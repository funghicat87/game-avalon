import express, { Request, Response } from 'express';
import { RoomManager } from '../managers/room.js';
import SocketIOManager from '../managers/websocket.js';

const router = express.Router();
const roomManager = RoomManager.getInstance();

router.post('/setNickName', (req: Request, res: Response) => {
  const { userId, userName } = req.body
  try {
    const socketIOManager = SocketIOManager.getInstance();
    const success = socketIOManager.setNickName(userId, userName);
    res.json({ success: true, message: `User with ID ${userId} joined room ${userName}.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }  
})

router.post('/joinRoom', (req: Request, res: Response) => {
  const { userId, userName, roomId, password } = req.body;
  try {
    const socketIOManager = SocketIOManager.getInstance();
    const players = roomManager.joinRoom({ userId, userName, roomId, password });
    socketIOManager.socketClientJoin(userId, roomId)
    socketIOManager.sendEvent(roomId, 'roomStatus', players)
    res.json({ success: true, message: `User with ID ${userId} joined room ${roomId}.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/createRoom', (req: Request, res: Response) => {
  const { userId, userName, password, people, enableLady, roleImgPair } = req.body;
  try {
    const socketIOManager = SocketIOManager.getInstance();
    const players = roomManager.createRoom({ userId, userName, password, people, enableLady, roleImgPair });
    socketIOManager.socketClientJoin(userId, userId)
    socketIOManager.sendEvent(userId, 'roomStatus', players)
    res.json({ success: true, message: `Room ${userId} created successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/modifyRoom', (req: Request, res: Response) => {
  const { userId, userName, password, people, enableLady } = req.body;
  try {
    const players = roomManager.modifyRoom({ userId, userName, password, people, enableLady });
    res.json({ success: true, message: `Room ${userId} modify successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/addComputer', (req: Request, res: Response) => {
  const { roomId } = req.body;
  try {
    const socketIOManager = SocketIOManager.getInstance();
    const players = roomManager.addComputer({ roomId });
    socketIOManager.sendEvent(roomId, 'roomStatus', players)
    res.json({ success: true, message: `Computer player added to room ${roomId}.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/removeComputer', (req: Request, res: Response) => {
  const { roomId } = req.body;
  try {
    const socketIOManager = SocketIOManager.getInstance();
    const players = roomManager.removeComputer({ roomId });
    socketIOManager.sendEvent(roomId, 'roomStatus', players)
    res.json({ success: true, message: `Computer player removed from room ${roomId}.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
