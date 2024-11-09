import { createSlice } from '@reduxjs/toolkit'

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    players: []
  },
  reducers: {
    setPlayer: (state, action) => {
      state.players = action.payload
    },
    setSelectedPlayer: (state, action) => {
      const { id } = action.payload
      const player = state.players[id]

      if (player) {
        player.selected = !player.selected
      }
    }
  }
})

export const roomActions = roomSlice.actions

export default roomSlice.reducer
