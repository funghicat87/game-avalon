import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Knife from '@/assets/gameboard/Knife.webp'
import Shield from '@/assets/icon/card-icon-shield.webp'
import Drip from '@/assets/icon/card-icon-drip.webp'
import Background from '@/component/Background'
import BackButton from '@/component/BackButton'
import { Card } from '@/component/Room/Card'
import Chat from '@/component/Room/Chat'
import GameBoardFrameA from '@/component/Room/GameBoardFrameA'
import GameBoardFrameB from '@/component/Room/GameBoardFrameB'
import GameBoardFront from '@/component/Room/GameBoardFront'
import GameOver from '@/component/Room/GameOver'
import PlayerArea from '@/component/Room/PlayerArea'
import SettingArea from '@/component/Room/SettingArea'
import { gameActions } from '@/features/gameSlice'
import { useGameActions } from '@/hooks/useGameActions'
import { RoleImageMappingTable, voteImage } from '@/utils/MappingImage'
import { isEvilRole } from '@/utils/game'

const hasVoted = (votes, name) => (votes ?? []).some((vote) => Object.keys(vote)[0] === name)

// 大廳中不顯示上一局的角色與狀態
const toLobbyPlayer = (player) => ({
  ...player,
  role: '',
  roleImg: 'Back',
  isAgree: -1,
  hasLady: false,
  hadLady: false,
  isLeader: false,
  isTeamMember: false,
  selected: false
})

const RoomFront = () => {
  const dispatch = useDispatch()
  const gamePlayers = useSelector((state) => state.game.players)
  const gameboard = useSelector((state) => state.game.gameboard)
  const isStart = useSelector((state) => state.game.isStart)
  const isShow = useSelector((state) => state.game.isShow)
  const errorMsg = useSelector((state) => state.game.errorMsg)
  const roomClosed = useSelector((state) => state.game.roomClosed)
  const isConnected = useSelector((state) => state.socket.isConnected)

  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const userName = location.state?.username
  const roomId = location.state?.roomId ?? params.id

  // 離開 / 重新整理前提醒（重新整理後會自動回到房間）
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    if (roomClosed) {
      alert(roomClosed)
      navigate('/Login', { replace: true })
    }
  }, [roomClosed, navigate])

  const players = useMemo(() => (isStart ? gamePlayers : gamePlayers.map(toLobbyPlayer)), [isStart, gamePlayers])
  const status = isStart ? gameboard.currentStatus : ''
  const { handleConfirmLady, handleConfirmMerlin, handleConfirmTeamMember } = useGameActions(players, gameboard, roomId)

  if (!userName) return <Navigate to="/Login" replace />

  const myIndex = players.findIndex((player) => player.name === userName)
  const me = players[myIndex] ?? { name: userName, role: '', roleImg: 'Back', isAgree: -1 }
  const isOwner = !!me.isOwner
  const isEvil = isEvilRole(me.role)

  const round = gameboard.currentRound
  const mission = gameboard.currentMission
  const leaderName = round ? players[round.leaderIndex]?.name : ''
  const ladyName = gameboard.ladyIndex != null ? players[gameboard.ladyIndex]?.name : ''
  const isLeader = isStart && round?.leaderIndex === myIndex
  const isLadyOwner = isStart && gameboard.ladyIndex === myIndex
  const isTeamMember = isStart && !!round?.teamMembersIndex.includes(myIndex)

  // 這個階段我能不能點選其他玩家
  const selectable =
    (status === 'SELECTTEAM' && isLeader) ||
    (status === 'LADY' && isLadyOwner) ||
    (status === 'ASSASSIN' && me.role === 'Assassin')

  const handleSelect = (playerName) => {
    if (selectable) dispatch(gameActions.setSelectedPlayer({ playerName, userName }))
  }

  const handleToLobby = () => {
    dispatch(gameActions.setIsStart(false))
  }

  /** 輪到別人時顯示的提示 */
  const getHint = () => {
    switch (status) {
      case 'SELECTTEAM':
        return isLeader ? '' : `等待隊長 ${leaderName} 選擇出任務的隊員`
      case 'VOTE':
        return hasVoted(round.votes, userName) ? `等待其他玩家投票（${round.votes.length}/${players.length}）` : ''
      case 'VOTEFORMISSION':
        return isTeamMember && !hasVoted(mission.votes, userName)
          ? ''
          : `等待隊員出任務（${mission.votes.length}/${mission.teamSize}）`
      case 'LADY':
        return isLadyOwner ? '' : `等待湖中女神 ${ladyName} 查驗身分`
      case 'ASSASSIN':
        return me.role === 'Assassin' ? '' : '好人完成三個任務！等待刺客刺殺梅林'
      default:
        return ''
    }
  }

  const renderAction = () => {
    if (status === 'END') {
      const result = gameboard.endOfWin === (isEvil ? 'EVIL' : 'GOOD')
      return <GameOver result={result} winner={gameboard.endOfWin} onClick={handleToLobby} />
    }
    if (!isShow) return null
    switch (status) {
      case 'VOTE':
        if (hasVoted(round.votes, userName)) return null
        return (
          <GameBoardFrameB
            content="Voteing"
            title={`是否同意隊長 ${leaderName} 的隊伍出任務？`}
            roomId={roomId}
            name={userName}
            status={status}
            validation={{ required: { value: true, message: '請選擇是否同意出任務' } }}
          />
        )
      case 'SELECTTEAM': {
        if (!isLeader) return null
        const selectedPlayersCount = players.filter((player) => player.selected).length
        const remainingPlayersCount = Math.max(0, mission.teamSize - selectedPlayersCount)
        return (
          <GameBoardFrameA
            title={`點擊頭像選擇 ${mission.teamSize} 位出任務玩家`}
            content={Array(remainingPlayersCount).fill(Shield)}
            onClick={handleConfirmTeamMember}
            errorMsg={errorMsg}
          />
        )
      }
      case 'VOTEFORMISSION':
        if (!isTeamMember || hasVoted(mission.votes, userName)) return null
        return (
          <GameBoardFrameB
            content="Task"
            title={isEvil ? '選擇任務成功或失敗' : '好人只能讓任務成功'}
            roomId={roomId}
            name={userName}
            status={status}
            validation={{ required: { value: true, message: '請選擇任務成功或是失敗' } }}
            isBlueSide={!isEvil}
          />
        )
      case 'LADY':
        if (!isLadyOwner) return null
        return (
          <GameBoardFrameA
            title="點擊頭像選擇湖中女神查驗對象"
            content={[Drip]}
            onClick={handleConfirmLady}
            errorMsg={errorMsg}
          />
        )
      case 'ASSASSIN':
        if (me.role !== 'Assassin') return null
        return (
          <GameBoardFrameA
            title="點擊頭像刺殺梅林"
            content={[Knife]}
            onClick={handleConfirmMerlin}
            errorMsg={errorMsg}
          />
        )
      default:
        return null
    }
  }

  const hint = getHint()

  return (
    <Background>
      <BackButton
        to="/Login"
        confirmText={
          isOwner
            ? '你是房主，離開後房間會關閉，確定要離開嗎？'
            : isStart && status !== 'END'
              ? '遊戲進行中，離開會讓這局中止，確定要離開嗎？'
              : '確定要離開房間嗎？'
        }
      >
        離開房間
      </BackButton>
      {!isConnected && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-red-900/90 text-White text-center text-sm py-2">
          連線中斷，正在重新連線…
        </div>
      )}
      <PlayerArea
        players={players}
        userName={userName}
        currentStatus={status}
        selectable={selectable}
        onSelect={handleSelect}
      />
      {isStart ? (
        <GameBoardFront gameboard={gameboard}>
          {hint && (
            <p className="text-LightGray text-sm text-center tracking-wider mt-1 lg:absolute lg:-bottom-6">{hint}</p>
          )}
          {renderAction()}
        </GameBoardFront>
      ) : (
        <SettingArea roomId={roomId} players={players} people={location.state?.people} isOwner={isOwner} />
      )}

      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-2 w-full lg:w-auto">
        <Chat roomId={roomId} userName={userName} />
        <Card
          userName={me.name}
          cardImg={RoleImageMappingTable[me.roleImg] ?? RoleImageMappingTable.Back}
          center={voteImage(me.isAgree)}
          onClick={() => handleSelect(me.name)}
          selectable={selectable}
          selected={me.selected}
          hasLady={me.hasLady}
          hadLady={me.hadLady}
          isLeader={me.isLeader}
          isTeamMember={me.isTeamMember}
          currentStatus={status}
        />
      </div>
    </Background>
  )
}

export default RoomFront
