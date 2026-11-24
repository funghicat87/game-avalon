import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import chatReducer from '../features/chatSlice'
import socketReducer from '../features/socketSlice'
import gameReducer from '../features/gameSlice'
import socketMiddleware from '../middleware/socketMiddleware'

const store = configureStore({
  reducer: {
    socket: socketReducer,
    chat: chatReducer,
    game: gameReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)
})

export function ReduxProvider(prop) {
  return <Provider store={store}>{prop.children}</Provider>
}
