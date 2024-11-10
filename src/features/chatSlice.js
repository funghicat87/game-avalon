import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: []
  },
  reducers: {
    setMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  }
})

export const chatActions = chatSlice.actions

export default chatSlice.reducer
