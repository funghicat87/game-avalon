import { PlayerModel } from "./player.js"

export interface RoomModel {
  id: string,
  ownerId: string,
  password: string,
  number: number,
  enableLady: boolean,
  roleImgPair: {[key: string]: string},
  players: Array<PlayerModel>
}

export interface RoomsModel {
  [key: string] : RoomModel
}
