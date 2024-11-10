import io from 'socket.io-client'
import { setConnected, setSocketId } from '../features/socketSlice'
import { chatActions } from '../features/chatSlice'
import { gameActions } from '../features/gameSlice'
import { origin } from '../config/setting'

const socketMiddleware = (store) => {
  let socket

  const isConnection = store.getState().socket.isConnected

  if (!isConnection) {
    socket = io(`${origin}`)

    socket.on('connect', () => {
      store.dispatch(setConnected(true))
      store.dispatch(setSocketId(socket.id))
    })

    socket.on('disconnect', () => {
      store.dispatch(setConnected(false))
    })

    socket.on('message', (message) => {
      store.dispatch(chatActions.setMessage(message))
    })

    socket.on('roomStatus', (data) => {
      store.dispatch(gameActions.setPlayers(data))
    })

    socket.on('gameStatus', (data) => {
      store.dispatch(gameActions.setIsStart(true))
      store.dispatch(gameActions.setGame(data))
    })
  }

  return (next) => (action) => {
    switch (action.type) {
      case 'submitMessage':
        socket.emit('sendRoomMsg', action.payload)
        break
      case 'sendGameStatus':
        socket.emit('sendGameStatus', action.payload)
        break
    }
    return next(action)
  }
}

export default socketMiddleware
