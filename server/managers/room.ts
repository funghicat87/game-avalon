import { RoomsModel, RoomModel } from "../models/room.js";
import { PlayerModel, initPlayerModel } from "../models/player.js";

const VALID_ROLES = ['Merlin', 'Percival', 'LoyalServant', 'Morgana', 'Assassin', 'Mordred', 'Oberon', 'Minion'];

export class RoomManager {
  static instance: RoomManager;
  private rooms: RoomsModel = {} as RoomsModel;
  private static readonly ERROR_MESSAGES = {
    ROOM_NOT_FOUND: '房間不存在',
    INVALID_PASSWORD: '密碼錯誤',
    ROOM_FULL: '房間人數已滿',
    NO_COMPUTER_PLAYER: '房間中沒有電腦玩家',
    INVALID_PEOPLE: '玩家人數必須介於 5 到 10 人',
    INVALID_ROLES: '角色設定與玩家人數不符',
    NAME_IN_ROOM: '房間內已有相同暱稱的玩家',
  };

  private constructor() {}

  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  getRoom(roomId: string): RoomModel | undefined {
    return this.rooms[roomId];
  }

  /** 找出某位玩家（clientId）目前所在的房間 */
  findRoomByPlayerId(clientId: string): RoomModel | undefined {
    return Object.values(this.rooms).find((room) => room.players.some((p) => p.id === clientId));
  }

  /** 產生 5 位數、不重複的房間號碼 */
  private generateRoomId(): string {
    let id: string;
    do {
      id = String(Math.floor(10000 + Math.random() * 90000));
    } while (this.rooms[id]);
    return id;
  }

  private validateRoleImgPair(people: number, roleImgPair: {[key: string]: string}) {
    const roles = Object.values(roleImgPair ?? {});
    if (
      roles.length !== people ||
      !roles.every((r) => VALID_ROLES.includes(r)) ||
      !roles.includes('Merlin') ||
      !roles.includes('Assassin')
    ) {
      throw new Error(RoomManager.ERROR_MESSAGES.INVALID_ROLES);
    }
  }

  joinRoom({ userId, userName, roomId, password }: { userId: string, userName: string, roomId: string, password: string }): RoomModel {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    if ((room.password ?? '') !== (password ?? '')) {
      throw new Error(RoomManager.ERROR_MESSAGES.INVALID_PASSWORD);
    }

    // 已經在房間內（例如重新整理後再加入一次）直接視為成功
    if (room.players.some((p) => p.id === userId)) {
      return room;
    }

    if (room.players.some((p) => p.name === userName)) {
      throw new Error(RoomManager.ERROR_MESSAGES.NAME_IN_ROOM);
    }

    if (room.players.length >= room.number) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_FULL);
    }

    room.players.push(initPlayerModel({ id: userId, name: userName, isHuman: true }));
    console.log(`玩家 ${userName} 已加入房間 ${roomId}`);
    return room;
  }

  createRoom({ userId, userName, password, people, enableLady, roleImgPair }: { userId: string, userName: string, password: string, people: number, enableLady: boolean, roleImgPair: {[key: string]: string} }): RoomModel {
    const number = Number(people);
    if (!Number.isInteger(number) || number < 5 || number > 10) {
      throw new Error(RoomManager.ERROR_MESSAGES.INVALID_PEOPLE);
    }
    this.validateRoleImgPair(number, roleImgPair);

    const roomId = this.generateRoomId();
    this.rooms[roomId] = {
      id: roomId,
      ownerId: userId,
      password: password ?? '',
      number,
      enableLady: Boolean(enableLady),
      roleImgPair,
      players: [initPlayerModel({ id: userId, name: userName, isHuman: true, isOwner: true })]
    };
    console.log(`房間 ${roomId} 已創建`);
    return this.rooms[roomId];
  }

  /**
   * 玩家離開房間。回傳 { room, deleted }：
   * 房主離開或房內沒有真人玩家時，整個房間會被刪除。
   */
  leaveRoom(clientId: string): { room?: RoomModel, deleted: boolean } {
    const room = this.findRoomByPlayerId(clientId);
    if (!room) return { deleted: false };

    // 用 splice 原地修改：遊戲與房間共用同一個 players 陣列
    room.players.splice(room.players.findIndex((p) => p.id === clientId), 1);
    if (room.ownerId === clientId || !room.players.some((p) => p.isHuman)) {
      delete this.rooms[room.id];
      console.log(`房間 ${room.id} 已刪除`);
      return { room, deleted: true };
    }
    return { room, deleted: false };
  }

  addComputer({ roomId }: { roomId: string }): RoomModel {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    if (room.players.length >= room.number) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_FULL);
    }

    // 找一個還沒被使用的編號當電腦名稱
    let n = 1;
    while (room.players.some((p) => p.name === `AI-${n}`)) n++;
    room.players.push(initPlayerModel({ id: `AI-${roomId}-${n}`, name: `AI-${n}` }));
    console.log(`電腦玩家已添加至房間 ${roomId}`);
    return room;
  }

  removeComputer({ roomId }: { roomId: string }): RoomModel {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    // 從最後加入的電腦開始移除
    const computerIndex = room.players.map((p) => p.isHuman).lastIndexOf(false);
    if (computerIndex === -1) {
      throw new Error(RoomManager.ERROR_MESSAGES.NO_COMPUTER_PLAYER);
    }

    room.players.splice(computerIndex, 1);
    console.log(`電腦玩家已從房間 ${roomId} 中移除`);
    return room;
  }
}
