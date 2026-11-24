import io from 'socket.io-client'
import { setConnected } from '../features/socketSlice'
import { chatActions } from '../features/chatSlice'
import { gameActions } from '../features/gameSlice'
import { origin, clientId } from '../config/setting'

const socketMiddleware = (store) => {
  // 用 clientId 當身分，重新連線後伺服器會自動把我們放回原本的房間並送回最新狀態
  const socket = io(origin, { auth: { clientId } })

  socket.on('connect', () => {
    store.dispatch(setConnected(true))
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

  socket.on('gameAborted', () => {
    store.dispatch(gameActions.setIsStart(false))
  })

  socket.on('roomClosed', (reason) => {
    store.dispatch(gameActions.setRoomClosed(reason || '房間已關閉'))
  })

  socket.on('actionError', (message) => {
    store.dispatch(gameActions.setErrorMsg(message))
    // 動作被伺服器拒絕，重新顯示操作視窗讓玩家再試一次
    store.dispatch(gameActions.setIsShow({ isShow: true }))
  })

  return (next) => (action) => {
    switch (action.type) {
      case 'submitMessage':
        socket.emit('sendRoomMsg', action.payload)
        break
      case 'sendGameStatus':
        socket.emit('sendGameStatus', action.payload)
        break
      case 'leaveRoom':
        socket.emit('leaveRoom')
        store.dispatch(gameActions.reset())
        store.dispatch(chatActions.clear())
        break
    }
    return next(action)
  }
}

export default socketMiddleware
