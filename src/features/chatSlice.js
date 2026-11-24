import { createSlice } from '@reduxjs/toolkit'

const MAX_MESSAGES = 200

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: []
  },
  reducers: {
    setMessage: (state, action) => {
      state.messages.push(action.payload)
      // 只保留最近的訊息，避免長時間遊戲後越來越卡
      if (state.messages.length > MAX_MESSAGES) {
        state.messages.splice(0, state.messages.length - MAX_MESSAGES)
      }
    },
    clear: (state) => {
      state.messages = []
    }
  }
})

export const chatActions = chatSlice.actions

export default chatSlice.reducer
