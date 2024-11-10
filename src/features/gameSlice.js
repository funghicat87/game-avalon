import { createSlice } from '@reduxjs/toolkit'

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    isShow: false,
    isStart: false,
    errorMsg: '',
    gameboard: {},
    players: []
  },
  reducers: {
    setGame: (state, action) => {
      if (!action.payload?.gameboard) return
      if (action.payload.gameboard.currentStatus !== state.gameboard.currentStatus) {
        state.isShow = true
      }
      state.gameboard = action.payload.gameboard
      state.players = action.payload.players
    },
    setGameBoard: (state, action) => {
      state.gameboard = action.payload
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
    setSelectedPlayer: (state, action) => {
      const { playerName, userName } = action.payload
      let isAssassin = false
      state.players.forEach((element) => {
        if (element.name === userName && element.role == 'Assassin') {
          isAssassin = true
        }
      })

      let isLeader = false
      if (state.players[state.gameboard.currentRound.leaderIndex].name === userName) {
        isLeader = true
      }

      let isLadyOwner = false
      if (state.gameboard.ladyIndex !== null) {
        if (state.players[state.gameboard.ladyIndex].name === userName) {
          isLadyOwner = true
        }
      }

      if (isLeader && state.gameboard.currentStatus === 'SELECTTEAM') {
        const player = state.players.filter((block) => block.name === playerName)[0]
        const limit = state.gameboard.currentMission.teamSize

        const newSelectedCount = state.players.filter((block) => block.selected).length
        if (player) {
          if (newSelectedCount < limit) {
            player.selected = !player.selected
          } else {
            if (player.selected) {
              player.selected = !player.selected
            }
          }
        }
      } else if (isAssassin && state.gameboard.currentStatus === 'ASSASSIN') {
        const player = state.players.filter((block) => block.name === playerName)[0]
        const limit = 1

        const newSelectedCount = state.players.filter((block) => block.selected).length
        if (player) {
          if (newSelectedCount < limit) {
            player.selected = !player.selected
          } else {
            if (player.selected) {
              player.selected = !player.selected
            }
          }
        }
      } else if (isLadyOwner && state.gameboard.currentStatus === 'LADY') {
        const player = state.players.filter((block) => block.name === playerName)[0]
        const limit = 1

        const newSelectedCount = state.players.filter((block) => block.selected).length
        if (player) {
          if (newSelectedCount < limit) {
            player.selected = !player.selected
          } else {
            if (player.selected) {
              player.selected = !player.selected
            }
          }
        }
      }
    }
  }
})

export const gameActions = gameSlice.actions

export default gameSlice.reducer
