import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from '../../component/Button'
import { post } from '../../utils/api'

const SettingArea = ({ roomId, players, people, isOwner }) => {
  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const isFull = people ? players.length >= people : false

  const handleGameStart = () => {
    if (!isFull) {
      setErrorMsg(`人數不夠（${players.length}/${people}）`)
      return
    }
    setErrorMsg('')
    dispatch({ type: 'sendGameStatus', payload: { gameType: 'GAMESTART', roomId } })
  }

  const callApi = async (path) => {
    setErrorMsg('')
    try {
      await post(path, { roomId })
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 非 https 環境無法使用剪貼簿，忽略
    }
  }

  return (
    <div className="text-White flex flex-col items-center gap-2 w-full max-w-96 lg:w-96">
      <div className="flex items-center gap-3 text-lg tracking-widest">
        <span>
          房間號碼 <span className="dropShadowWhite">{roomId}</span>
        </span>
        <button type="button" className="text-sm text-LightGray hover:text-White underline" onClick={handleCopy}>
          {copied ? '已複製' : '複製'}
        </button>
      </div>
      <p className="text-sm text-LightGray">
        玩家 {players.length}/{people ?? '?'}
        {!isOwner && '，等待房主開始遊戲'}
      </p>
      <div className="flex flex-row w-full justify-end items-end gap-2">
        {isOwner && (
          <>
            <Button mt="mt-0" onClick={handleGameStart} disabled={!isFull}>
              開始
            </Button>
            <Button mt="mt-0" onClick={() => callApi('/addComputer')} disabled={isFull}>
              加入電腦
            </Button>
            <Button mt="mt-0" onClick={() => callApi('/removeComputer')}>
              刪除電腦
            </Button>
          </>
        )}
      </div>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
    </div>
  )
}

export default SettingArea
