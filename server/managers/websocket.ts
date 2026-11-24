import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { RoomManager } from './room.js';
import { GameManager, GameAction, GameType } from './game.js';
import { RoomModel } from '../models/room.js';
import { PlayerModel } from '../models/player.js';

interface Session {
  socket: Socket | null;
  userName?: string;
  disconnectTimer?: NodeJS.Timeout;
}

// 斷線後保留位置的時間：大廳內短一點，遊戲中長一點（手機切到背景、網路不穩）
const LOBBY_GRACE_MS = 15 * 1000;
const GAME_GRACE_MS = 2 * 60 * 1000;
// 防止電腦玩家的動作互相觸發形成無限迴圈
const MAX_BOT_STEPS = 200;

export default class SocketIOManager {
  private static instance: SocketIOManager;
  private io: Server;
  private roomManager: RoomManager;
  private gameManager: GameManager;
  // key 是客戶端自己產生、存在 sessionStorage 的 clientId，重新連線 / 重新整理都不會變
  private sessions = new Map<string, Session>();
  private static readonly ERROR_MESSAGES = {
    NICKNAME_TAKEN: '暱稱已被使用',
    NICKNAME_INVALID: '暱稱長度需為 1~12 個字',
    USER_NOT_CONNECTED: '使用者沒有連線',
    NOT_OWNER: '只有房主可以進行這個操作',
    GAME_PLAYING: '遊戲進行中，無法變更',
  };

  /**********************************************************
  * init
  */
  public constructor(server: HttpServer, config: { cors?: { credentials: boolean; origin: string } }) {
    this.io = new Server(server, config);
    this.roomManager = RoomManager.getInstance();
    this.gameManager = GameManager.getInstance();
    this.setupEventListeners();
    SocketIOManager.instance = this;
  }

  public static getInstance(): SocketIOManager {
    if (!SocketIOManager.instance) {
      throw new Error("請先實例化");
    }
    return SocketIOManager.instance;
  }

  private static getClientId(socket: Socket): string {
    const id = socket.handshake.auth?.clientId;
    return typeof id === 'string' && /^[\w-]{8,64}$/.test(id) ? id : socket.id;
  }

  /**********************************************************
  * socket io event
  */
  private setupEventListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      const clientId = SocketIOManager.getClientId(socket);
      socket.data.clientId = clientId;
      this.attachSocket(clientId, socket);

      socket.on('sendRoomMsg', ({ roomId, message }: { roomId: string; message: any }) => {
        const userName = this.sessions.get(clientId)?.userName;
        const text = String(message?.message ?? '').trim().slice(0, 300);
        if (!userName || !text || !socket.rooms.has(roomId)) return;
        this.io.to(roomId).emit('message', { userName, message: text });
      });

      socket.on('sendGameStatus', (payload: GameAction) => {
        try {
          this.handlePlayerAction(clientId, payload);
        } catch (error) {
          console.error(error);
          socket.emit('actionError', '發生錯誤，請再試一次');
        }
      });

      socket.on('leaveRoom', () => {
        this.leaveRoom(clientId);
      });

      socket.on('disconnect', () => {
        const session = this.sessions.get(clientId);
        // 同一個 clientId 已經用新的連線接手，就不用處理舊連線
        if (!session || session.socket !== socket) return;
        session.socket = null;
        const room = this.roomManager.findRoomByPlayerId(clientId);
        const grace = room && this.gameManager.isPlaying(room.id) ? GAME_GRACE_MS : LOBBY_GRACE_MS;
        session.disconnectTimer = setTimeout(() => this.expireSession(clientId), grace);
      });
    });
  }

  /** 新連線或重新連線：綁定 clientId，並把玩家放回原本的房間 */
  private attachSocket(clientId: string, socket: Socket) {
    const session = this.sessions.get(clientId);
    if (session) {
      clearTimeout(session.disconnectTimer);
      session.disconnectTimer = undefined;
      session.socket = socket;
    } else {
      this.sessions.set(clientId, { socket });
    }

    const room = this.roomManager.findRoomByPlayerId(clientId);
    if (room) {
      socket.join(room.id);
      socket.emit('roomStatus', SocketIOManager.publicPlayers(room.players));
      const game = this.gameManager.getGame(room.id);
      if (game) socket.emit('gameStatus', SocketIOManager.toPublic(game));
    }
  }

  /** 斷線超過保留時間：離開房間並釋放暱稱 */
  private expireSession(clientId: string) {
    const session = this.sessions.get(clientId);
    if (!session || session.socket) return;
    const room = this.roomManager.findRoomByPlayerId(clientId);
    if (room && session.userName) {
      this.systemMessage(room.id, `${session.userName} 已離線`);
    }
    this.leaveRoom(clientId);
    this.sessions.delete(clientId);
  }

  /** 玩家離開目前的房間，並通知房間內其他人 */
  public leaveRoom(clientId: string) {
    const current = this.roomManager.findRoomByPlayerId(clientId);
    if (!current) return;
    const wasPlaying = this.gameManager.isPlaying(current.id);
    const leaverName = current.players.find((p) => p.id === clientId)?.name;

    const { room, deleted } = this.roomManager.leaveRoom(clientId);
    if (!room) return;
    this.sessions.get(clientId)?.socket?.leave(room.id);

    if (deleted) {
      this.gameManager.deleteGame(room.id);
      this.io.to(room.id).emit('roomClosed', '房主已離開，房間已關閉');
      this.io.in(room.id).socketsLeave(room.id);
      return;
    }

    if (wasPlaying) {
      // 少了一位玩家，遊戲無法繼續
      this.gameManager.deleteGame(room.id);
      this.io.to(room.id).emit('gameAborted');
      this.systemMessage(room.id, `${leaverName} 離開房間，遊戲中止`);
    } else if (leaverName) {
      this.systemMessage(room.id, `${leaverName} 離開房間`);
    }
    this.io.to(room.id).emit('roomStatus', SocketIOManager.publicPlayers(room.players));
  }

  /**********************************************************
  * Game actions
  */
  private handlePlayerAction(clientId: string, payload: GameAction) {
    const socket = this.sessions.get(clientId)?.socket;
    const room = this.roomManager.findRoomByPlayerId(clientId);
    if (!socket || !room || !payload) return;
    const actor = room.players.find((p) => p.id === clientId)!;
    const action: GameAction = { ...payload, roomId: room.id };

    if (action.gameType === 'GAMESTART') {
      if (room.ownerId !== clientId) return socket.emit('actionError', SocketIOManager.ERROR_MESSAGES.NOT_OWNER);
      if (this.gameManager.isPlaying(room.id)) return socket.emit('actionError', SocketIOManager.ERROR_MESSAGES.GAME_PLAYING);
      if (room.players.length !== room.number) return socket.emit('actionError', '人數不夠');
    } else {
      // 投票一律以連線者本人的名字計算，不能代替別人投票
      if (action.gameType === 'VOTE' || action.gameType === 'VOTEFORMISSION') {
        const value = Number(payload.data ? Object.values(payload.data)[0] : NaN);
        action.data = { [actor.name]: value };
      }
      const error = this.gameManager.validateAction(room.id, actor, action);
      if (error) return socket.emit('actionError', error);
    }

    this.applyAction(room, action);
    this.runBots(room);
  }

  /** 讓電腦玩家依序行動，直到輪到真人玩家為止 */
  private runBots(room: RoomModel) {
    for (let step = 0; step < MAX_BOT_STEPS; step++) {
      const actions = this.gameManager.simulateBotAction(room.id);
      if (actions.length === 0) return;
      actions.forEach((action) => this.applyAction(room, action));
    }
    console.warn(`房間 ${room.id} 的電腦動作超過上限，已停止`);
  }

  private applyAction(room: RoomModel, payload: GameAction) {
    const roomId = room.id;
    let gameStatus: GameType | null = null;
    let message = '';
    switch (payload.gameType) {
      case 'GAMESTART':
        gameStatus = this.gameManager.processOfGameStart(roomId, room.players, room.enableLady, room.roleImgPair);
        message = '遊戲開始';
        break;
      case 'SELECTTEAM':
        gameStatus = this.gameManager.processOfSelectTeam(roomId, payload.teamMembersIndex);
        message = '選完隊伍準備投票';
        break;
      case 'LADY':
        gameStatus = this.gameManager.processOfLady(roomId, payload.ladyIndex);
        message = '湖中女神回合結束';
        break;
      case 'VOTE':
        gameStatus = this.gameManager.processOfVote(roomId, payload.data);
        message = `${Object.keys(payload.data)[0]} 投票完成`;
        break;
      case 'VOTEFORMISSION':
        gameStatus = this.gameManager.processOfVoteForMission(roomId, payload.data);
        message = `${Object.keys(payload.data)[0]} 出任務投票完成`;
        break;
      case 'ASSASSIN':
        gameStatus = this.gameManager.processOfAssassin(roomId, payload.merlinIndex);
        message = '刺客回合結束';
        break;
    }
    // null 代表重複投票之類的無效動作，不廣播
    if (!gameStatus) return;
    this.io.to(roomId).emit('gameStatus', SocketIOManager.toPublic(gameStatus));
    this.systemMessage(roomId, message);
  }

  /**
   * 送給客戶端前隱藏不該公開的資訊：
   * - 出任務的票只保留「誰投過」，不公開誰投成功 / 失敗
   * - 隊伍投票進行中先不公開各自的票，全部投完才揭曉
   */
  private static toPublic(game: GameType): GameType {
    const copy: GameType = JSON.parse(JSON.stringify(game));
    const hide = (votes: { [key: string]: number }[]) => votes.map((v) => ({ [Object.keys(v)[0]]: -1 }));
    copy.gameboard.currentMission.votes = hide(copy.gameboard.currentMission.votes);
    if (copy.gameboard.currentStatus === 'VOTE') {
      copy.gameboard.currentRound.votes = hide(copy.gameboard.currentRound.votes);
      copy.players.forEach((p) => { p.isAgree = -1 });
    }
    copy.players = SocketIOManager.publicPlayers(copy.players);
    return copy;
  }

  /** clientId 等同登入憑證，不能送給其他玩家 */
  private static publicPlayers(players: PlayerModel[]): PlayerModel[] {
    return players.map(({ id, ...rest }) => ({ ...rest, id: '' }));
  }

  private systemMessage(roomId: string, message: string) {
    this.io.to(roomId).emit('message', { userName: 'system', message });
  }

  /**********************************************************
  * 給 HTTP route 使用
  */
  public sendRoomStatus(room: RoomModel) {
    this.io.to(room.id).emit('roomStatus', SocketIOManager.publicPlayers(room.players));
  }

  public socketClientJoin(clientId: string, roomId: string) {
    const socket = this.sessions.get(clientId)?.socket;
    if (!socket) throw new Error(SocketIOManager.ERROR_MESSAGES.USER_NOT_CONNECTED);
    socket.join(roomId);
  }

  public getUserName(clientId: string): string | undefined {
    return this.sessions.get(clientId)?.userName;
  }

  public assertOwner(clientId: string, roomId: string) {
    const room = this.roomManager.getRoom(roomId);
    if (room && room.ownerId !== clientId) throw new Error(SocketIOManager.ERROR_MESSAGES.NOT_OWNER);
    if (room && this.gameManager.isPlaying(roomId)) throw new Error(SocketIOManager.ERROR_MESSAGES.GAME_PLAYING);
  }

  public setNickName(clientId: string, nickname: string): void {
    const name = String(nickname ?? '').trim();
    if (name.length < 1 || name.length > 12 || name === 'system') {
      throw new Error(SocketIOManager.ERROR_MESSAGES.NICKNAME_INVALID);
    }
    const session = this.sessions.get(clientId);
    if (!session?.socket) {
      throw new Error(SocketIOManager.ERROR_MESSAGES.USER_NOT_CONNECTED);
    }
    for (const [id, s] of this.sessions) {
      if (id !== clientId && s.userName === name) {
        throw new Error(SocketIOManager.ERROR_MESSAGES.NICKNAME_TAKEN);
      }
    }
    // 換名字前先離開原本的房間，避免房間裡留下舊名字
    if (session.userName && session.userName !== name) this.leaveRoom(clientId);
    session.userName = name;
  }
}
