import { RoomsModel, RoomModel } from "../models/room.js";
import { PlayerModel } from "../models/player.js";

export class RoomManager {
  static instance: RoomManager;
  private rooms: RoomsModel = {} as RoomsModel;
  private static readonly ERROR_MESSAGES = {
    ROOM_NOT_FOUND: '房間不存在',
    INVALID_PASSWORD: '密碼錯誤',
    ROOM_FULL: '房間人數已滿',
    NO_COMPUTER_PLAYER: '房間中沒有電腦玩家',
  };

  private constructor() {}

  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  getRoom(roomId: string): RoomModel {
    return this.rooms[roomId];
  }

  joinRoom({ userId, userName, roomId, password }: { userId: string, userName: string, roomId: string, password: string }): PlayerModel[] {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    if (room.password !== password) {
      throw new Error(RoomManager.ERROR_MESSAGES.INVALID_PASSWORD);
    }

    if (room.players.length >= room.number) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_FULL);
    }

    this.rooms[roomId].players.push({
      name: userName,
      isHuman: true,
      isOwner: false,
      selected: false,
      role: "",
      roleImg: "Back",
      hasLady: false,
      hadLady: false,
      hadLadyIdx: -1,
      isLeader: false,
      isTeamMember: false,
      isAgree: -1
    });
    console.log(`玩家 ${userName} 已加入房間 ${roomId}`);
    return this.rooms[roomId].players;
  }

  createRoom({ userId, userName, password, people, enableLady, roleImgPair }: { userId: string, userName: string, password: string, people: number, enableLady: boolean, roleImgPair: {[key: string]: string} }): PlayerModel[] {
    const roomId = userId; // 使用房主 userId 作為房間 ID
    this.rooms[roomId] = {
      password,
      number: people,
      enableLady,
      roleImgPair,
      players: []
    };

    this.rooms[roomId].players.push({
      name: userName,
      isHuman: true,
      isOwner: true,
      selected: false,
      role: "",
      roleImg: "Back",
      hasLady: false,
      hadLady: false,
      hadLadyIdx: -1,
      isLeader: false,
      isTeamMember: false,
      isAgree: -1
    });
    console.log(`房間 ${roomId} 已創建`);
    return this.rooms[roomId].players;
  }

  modifyRoom({ userId, userName, password, people, enableLady }: { userId: string, userName: string, password: string, people: number, enableLady: boolean }): PlayerModel[] {
    const roomId = userId; // 使用房主 userId 作為房間 ID
    this.rooms[roomId] = {
      ...this.rooms[roomId],
      password,
      number: people,
      enableLady,
    };
    console.log(`房間 ${roomId} 已更新`);
    return this.rooms[roomId].players;
  }

  addComputer({ roomId }: { roomId: string }): PlayerModel[] {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    if (room.players.length >= room.number) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_FULL);
    }

    this.rooms[roomId].players.push({
      name:  `AI-${Date.now()}`,  // 使用當前時間戳作為電腦玩家名稱
      isHuman: false,
      isOwner: false,
      selected: false,
      role: "",
      roleImg: "Back",
      hasLady: false,
      hadLady: false,
      hadLadyIdx: -1,
      isLeader: false,
      isTeamMember: false,
      isAgree: -1
    });
    console.log(`電腦玩家已添加至房間 ${roomId}`);
    return this.rooms[roomId].players;
  }

  removeComputer({ roomId }: { roomId: string }): PlayerModel[] {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error(RoomManager.ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    const computerIndex = room.players.findIndex((player) => !player.isHuman);
    if (computerIndex === -1) {
      throw new Error(RoomManager.ERROR_MESSAGES.NO_COMPUTER_PLAYER);
    }

    this.rooms[roomId].players.splice(computerIndex, 1);
    console.log(`電腦玩家已從房間 ${roomId} 中移除`);
    return this.rooms[roomId].players;
  }
}