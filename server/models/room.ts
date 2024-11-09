import { PlayerModel } from "./player.js"
import { Socket } from 'socket.io'

export interface SocketClientsModel {
  [key: string] : Socket
}

export interface RoomModel {
  password: string,
  number: number,
  enableLady: boolean,
  roleImgPair: {[key: string]: string},
  players: Array<PlayerModel>
}

export interface RoomsModel {
  [key: string] : RoomModel
}

export function initRoomModel(): RoomModel {
  return {
    password: '',
    number: 5,
    enableLady: false,
    roleImgPair: {},
    players: []
  }
}