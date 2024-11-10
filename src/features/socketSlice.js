import { createSlice } from '@reduxjs/toolkit'

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    socketId: null
  },
  reducers: {
    setConnected(state, action) {
      state.isConnected = action.payload
    },
    setSocketId(state, action) {
      state.socketId = action.payload
    }
  }
})

export const { setConnected, setSocketId } = socketSlice.actions

export default socketSlice.reducer
