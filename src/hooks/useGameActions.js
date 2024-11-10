import { useDispatch } from 'react-redux'
import { gameActions } from '../features/gameSlice'

export const useGameActions = (players, gameStatus, roomId) => {
  const dispatch = useDispatch()

  const handleConfirmLady = () => {
    const idx = players
      .map((block, index) => (block.selected ? index : null)) // 返回已被選取區塊的索引
      .filter((index) => index !== null)

    if (idx.length !== 1) {
      dispatch(gameActions.setErrorMsg('選擇正確數量'))
      return
    }

    if (gameStatus.ladyIndexHistory.includes(idx[0])) {
      dispatch(gameActions.setErrorMsg('選過了換一個'))
      return
    }

    dispatch({
      type: 'sendGameStatus',
      payload: {
        gameType: 'LADY',
        roomId: roomId,
        ladyIndex: idx[0]
      }
    })
    dispatch(gameActions.setErrorMsg(''))
    dispatch(
      gameActions.setIsShow({
        isShow: false
      })
    )
  }

  const handleConfirmMerlin = () => {
    const idx = players
      .map((block, index) => (block.selected ? index : null)) // 返回已被選取區塊的索引
      .filter((index) => index !== null)

    if (idx.length !== 1) {
      dispatch(gameActions.setErrorMsg('選擇正確數量'))
      return
    }

    dispatch({
      type: 'sendGameStatus',
      payload: {
        gameType: 'ASSASSIN',
        roomId: roomId,
        merlinIndex: idx[0]
      }
    })
    dispatch(gameActions.setErrorMsg(''))
    dispatch(
      gameActions.setIsShow({
        isShow: false
      })
    )
  }

  const handleConfirmTeamMember = () => {
    const idx = players
      .map((block, index) => (block.selected ? index : null)) // 返回已被選取區塊的索引
      .filter((index) => index !== null)

    if (gameStatus.currentMission.teamSize !== idx.length) {
      dispatch(gameActions.setErrorMsg('請選擇正確隊員數量'))
      return
    }

    dispatch({
      type: 'sendGameStatus',
      payload: {
        gameType: 'SELECTTEAM',
        roomId: roomId,
        teamMembersIndex: idx
      }
    })
    dispatch(gameActions.setErrorMsg(''))
    dispatch(
      gameActions.setIsShow({
        isShow: false
      })
    )
  }

  return { handleConfirmLady, handleConfirmMerlin, handleConfirmTeamMember }
}
