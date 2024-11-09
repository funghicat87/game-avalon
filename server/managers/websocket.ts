import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { RoomManager } from './room.js';
import { GameManager } from './game.js';
import { SocketClientsModel } from '../models/room.js';
import { PlayerModel } from '../models/player.js';

export default class SocketIOManager {
  private static instance: SocketIOManager;
  private io: Server;
  private roomManager: RoomManager;
  private gameManager: GameManager;
  private socketClients = {} as SocketClientsModel;
  private static readonly ERROR_MESSAGES = {
    NICKNAME_TAKEN: '暱稱已被使用',
    USER_NOT_CONNECTED: '使用者沒有連線'
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

  /**********************************************************
  * socket io event 
  */
  private setupEventListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client with ID ${socket.id} connected.`);
      this.addSocketClient(socket.id, socket);

      socket.on('sendRoomMsg', ({ roomId, message }: { roomId: string; message: any }) => {
        this.io.to(roomId).emit('message', message);
      });

      socket.on('sendRoomStatus', ({ roomId, data }: { roomId: string; data: any }) => {
        const room = this.roomManager.getRoom(roomId);
        this.io.to(roomId).emit('roomStatus', room);
      });

      socket.on('sendGameStatus', (data: any) => {
        this.updateStatus(data)
        // 檢查電腦動作
        let res = this.gameManager.simulateBotAction(data.roomId);
        while (res !== undefined) {
          const isArray = Array.isArray(res);
          const isObject = typeof res === 'object' && res !== null && !isArray;
          if (isObject) {
            this.updateStatus(res);
          } 
          else if (isArray) {
            res.forEach((element: any) => { 
              this.updateStatus(element);
            });
          }
          res = this.gameManager.simulateBotAction(data.roomId);
        }
      });

      socket.on('disconnect', () => {
        // 处理客户端断开连接时的逻辑
      });
    });
  }

  /**********************************************************
  * updateStatus
  */
  private updateStatus(payload: any) {
    let gameStatus;
    const gameType = payload.gameType
    const roomId = payload.roomId
    switch (gameType) {
      case 'GAMESTART':
        // 檢查人數是否足夠
        const roomManager = RoomManager.getInstance()
        const room = roomManager.getRoom(roomId)
        const players = room?.players
        if (room && players && (players?.length < room.number)) {
          break
        }
        // 
        gameStatus = this.gameManager.processOfGameStart(roomId, players, room.enableLady, room.roleImgPair)
        // 傳送訊息
        this.io.to(roomId).emit('gameStatus', gameStatus)
        this.io.to(roomId).emit('message', { userName: "system", message: "遊戲開始" })
        break
      case 'SELECTTEAM':
        // 
        gameStatus = this.gameManager.processOfSelectTeam(roomId, payload.teamMembersIndex)
        // 傳送訊息
        this.io.to(roomId).emit('gameStatus', gameStatus)
        this.io.to(roomId).emit('message', { userName: "system", message: "選完隊伍準備投票" })
        break
      case 'LADY':
        // 
        gameStatus = this.gameManager.processOfLady(roomId, payload.ladyIndex)
        // 傳送訊息
        this.io.to(roomId).emit('gameStatus', gameStatus)
        this.io.to(roomId).emit('message', { userName: "system", message: "湖中女神回合結束" })
        break
      case 'VOTE':
        // 
        gameStatus = this.gameManager.processOfVote(roomId, payload.data)
        // 傳送訊息
        this.io.to(roomId).emit('gameStatus', gameStatus)
        this.io.to(roomId).emit('message', { userName: "system", message: `${Object.keys(payload.data)[0]}投票完成` })
        break
      case 'VOTEFORMISSION':
        // 
        gameStatus = this.gameManager.processOfVoteForMission(roomId, payload.data)
        // 傳送訊息
        this.io.to(roomId).emit('gameStatus', gameStatus)
        this.io.to(roomId).emit('message', { userName: "system", message: `${Object.keys(payload.data)[0]}出任務投票完成` })
        break
      case 'ASSASSIN':
        // 
        gameStatus = this.gameManager.processOfAssassin(roomId, payload.merlinIndex)
        // 傳送訊息
        this.io.to(roomId).emit('gameStatus', gameStatus)
        this.io.to(roomId).emit('message', { userName: "system", message: "刺客回合結束" })
        break
    }
  }


  /**********************************************************
  * SocketClient
  */
  public sendEvent(roomId: string, status: string, data: PlayerModel[]) {
    this.io.to(roomId).emit(status, data)
  }

  /**********************************************************
  * other function
  */
  public addSocketClient(socketId: string, socket: Socket) {
    this.socketClients[socketId] = socket;
  }

  public socketClientJoin(userId: string, roomId: string) {
    const socket = this.socketClients[userId]
    socket.join(roomId)
  }

  private isNicknameTaken(nickname: string): boolean {
    for (const userId in this.socketClients) {
      const name = this.socketClients[userId].data.userName;
      if (name === nickname) {
        return true; // 如果有任何房間中已經有相同的暱稱，返回 true
      }
    }
    return false; // 如果沒有相同的暱稱，返回 false
  }

  public setNickName(userId: string, nickname: string): boolean {
    // 檢查有沒有重複的名稱
    const isTaken = this.isNicknameTaken(nickname);
    if (isTaken) {
      throw new Error(SocketIOManager.ERROR_MESSAGES.NICKNAME_TAKEN);
    } else {
      // 檢查有沒有socket連結的ID
      if (this.socketClients[userId]) {
        const socket = this.socketClients[userId]
        socket.data.userName = nickname
        return true
      } else {
        throw new Error(SocketIOManager.ERROR_MESSAGES.USER_NOT_CONNECTED);
      }
    }
  }
}
