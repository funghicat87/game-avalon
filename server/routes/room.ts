import express, { Request, Response } from 'express';
import { RoomManager } from '../managers/room.js';
import SocketIOManager from '../managers/websocket.js';

const router = express.Router();
const roomManager = RoomManager.getInstance();

/** 統一處理錯誤：業務錯誤回 400，讓前端可以直接顯示 message */
const handle = (fn: (req: Request) => object) => (req: Request, res: Response) => {
  try {
    res.json({ success: true, ...fn(req) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/** 取得已設定的暱稱，沒有設定代表還沒登入 */
const requireUserName = (socketIOManager: SocketIOManager, userId: string) => {
  const userName = socketIOManager.getUserName(userId);
  if (!userName) throw new Error('請先輸入姓名');
  return userName;
};

router.post('/setNickName', handle((req) => {
  const { userId, userName } = req.body;
  SocketIOManager.getInstance().setNickName(userId, userName);
  return { userName: SocketIOManager.getInstance().getUserName(userId) };
}));

router.post('/joinRoom', handle((req) => {
  const { userId, roomId, password } = req.body;
  const socketIOManager = SocketIOManager.getInstance();
  const userName = requireUserName(socketIOManager, userId);
  const id = String(roomId ?? '').trim();
  // 一個玩家同時只能在一個房間
  const current = roomManager.findRoomByPlayerId(userId);
  if (current && current.id !== id) socketIOManager.leaveRoom(userId);

  const room = roomManager.joinRoom({ userId, userName, roomId: id, password });
  socketIOManager.socketClientJoin(userId, room.id);
  socketIOManager.sendRoomStatus(room);
  return { roomId: room.id, people: room.number, enableLady: room.enableLady };
}));

router.post('/createRoom', handle((req) => {
  const { userId, password, people, enableLady, roleImgPair } = req.body;
  const socketIOManager = SocketIOManager.getInstance();
  const userName = requireUserName(socketIOManager, userId);
  socketIOManager.leaveRoom(userId);

  const room = roomManager.createRoom({ userId, userName, password, people, enableLady, roleImgPair });
  socketIOManager.socketClientJoin(userId, room.id);
  socketIOManager.sendRoomStatus(room);
  return { roomId: room.id, people: room.number, enableLady: room.enableLady };
}));

router.post('/addComputer', handle((req) => {
  const { userId, roomId } = req.body;
  const socketIOManager = SocketIOManager.getInstance();
  socketIOManager.assertOwner(userId, roomId);
  socketIOManager.sendRoomStatus(roomManager.addComputer({ roomId }));
  return {};
}));

router.post('/removeComputer', handle((req) => {
  const { userId, roomId } = req.body;
  const socketIOManager = SocketIOManager.getInstance();
  socketIOManager.assertOwner(userId, roomId);
  socketIOManager.sendRoomStatus(roomManager.removeComputer({ roomId }));
  return {};
}));

export default router;
