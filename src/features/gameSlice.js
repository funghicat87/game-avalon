import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isShow: false,
  isStart: false,
  errorMsg: '',
  roomClosed: '',
  gameboard: {},
  players: []
}

/** 目前這位使用者在這個階段最多可以選幾位玩家；不能選時回傳 0 */
const getSelectLimit = (state, userName) => {
  const { gameboard, players } = state
  if (!gameboard?.currentRound) return 0
  const me = players.find((p) => p.name === userName)
  if (!me) return 0
  switch (gameboard.currentStatus) {
    case 'SELECTTEAM':
      return players[gameboard.currentRound.leaderIndex]?.name === userName ? gameboard.currentMission.teamSize : 0
    case 'ASSASSIN':
      return me.role === 'Assassin' ? 1 : 0
    case 'LADY':
      return gameboard.ladyIndex !== null && players[gameboard.ladyIndex]?.name === userName ? 1 : 0
    default:
      return 0
  }
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    reset: () => initialState,
    setGame: (state, action) => {
      if (!action.payload?.gameboard) return
      const statusChanged = action.payload.gameboard.currentStatus !== state.gameboard.currentStatus
      if (statusChanged) {
        state.isShow = true
        state.errorMsg = ''
      }
      // 同一個階段內收到更新（例如別人投票）時，保留自己已經點選的玩家
      const selected = statusChanged ? new Set() : new Set(state.players.filter((p) => p.selected).map((p) => p.name))
      state.gameboard = action.payload.gameboard
      state.players = action.payload.players.map((p) => ({ ...p, selected: selected.has(p.name) }))
    },
    setPlayers: (state, action) => {
      state.players = action.payload
    },
    setIsStart: (state, action) => {
      state.isStart = action.payload
    },
    setIsShow: (state, action) => {
      state.isShow = action.payload.isShow
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload
    },
    setRoomClosed: (state, action) => {
      state.roomClosed = action.payload
    },
    setSelectedPlayer: (state, action) => {
      const { playerName, userName } = action.payload
      const limit = getSelectLimit(state, userName)
      const player = state.players.find((p) => p.name === playerName)
      if (!limit || !player) return

      if (player.selected) {
        player.selected = false
        return
      }
      const selectedPlayers = state.players.filter((p) => p.selected)
      if (selectedPlayers.length < limit) {
        player.selected = true
      } else if (limit === 1) {
        // 只能選一位時，直接換成新點選的玩家
        selectedPlayers[0].selected = false
        player.selected = true
      }
    }
  }
})

export const gameActions = gameSlice.actions

export default gameSlice.reducer
