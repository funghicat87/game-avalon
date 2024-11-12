import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Knife from '@/assets/gameboard/Knife.webp'
import Shield from '@/assets/icon/card-icon-shield.webp'
import Drip from '../assets/icon/card-icon-drip.webp'
import Background from '@/component/Background'
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
import { RoleImageMappingTable } from '@/utils/MappingImage'
import agree from '@/assets/gameboard/VoteingAgree.webp'
import disagree from '@/assets/gameboard/VoteingDisagree.webp'

const RoomFront = () => {
  const dispatch = useDispatch()
  const players = useSelector((state) => state.game.players)
  const gameboard = useSelector((state) => state.game.gameboard)
  const isStart = useSelector((state) => state.game.isStart)
  const isShow = useSelector((state) => state.game.isShow)
  const errorMsg = useSelector((state) => state.game.errorMsg)

  const location = useLocation()
  const navigate = useNavigate()
  const [userName, setUserName] = useState(null)
  const [roomId, setRoomId] = useState(null)

  const handleOnpopstate = () => {
    history.go(1)
  }

  const handleBeforeUnload = (event) => {
    event.preventDefault()
    event.returnValue = '' // This is required for Chrome
  }

  const handleAfterLoaded = () => {
    navigate('/')
  }

  useEffect(() => {
    history.pushState(
      {
        usr: {
          username: location.state.username,
          roomId: location.state.roomId,
          people: location.state.people,
          enableLady: location.state.enableLady
        }
      },
      document.title,
      location.href
    )

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handleOnpopstate)
    window.addEventListener('load', handleAfterLoaded)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handleOnpopstate)
      window.removeEventListener('load', handleAfterLoaded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.href, location.state.enableLady, location.state.people, location.state.roomId, location.state.username])

  useEffect(() => {
    if (!location.state) {
      navigate('/Login')
    }
    setUserName(location.state.username)
    setRoomId(location.state.roomId)
  }, [location.state, navigate])

  // const checkIsOwner = () => {
  //   let isOwner = false
  //   players.forEach((element) => {
  //     if (element.name === userName && element.isOwner) {
  //       isOwner = true
  //     }
  //   })
  //   return isOwner
  // }

  const handleBlockClick = (playerName, userName) => {
    dispatch(gameActions.setSelectedPlayer({ playerName, userName }))
  }

  const handleToLobby = () => {
    dispatch(gameActions.setIsStart(false))
  }

  const checkIsLeader = () => {
    let isLeader = false
    if (gameboard) {
      if (players[gameboard.currentRound.leaderIndex].name === userName) {
        isLeader = true
      }
    }
    return isLeader
  }

  const checkIsTeamMember = () => {
    let isTeamMember = false
    if (gameboard) {
      gameboard.currentRound.teamMembersIndex.forEach((element) => {
        if (players[element].name === userName) {
          isTeamMember = true
        }
      })
    }
    return isTeamMember
  }

  const checkIsBlueSide = () => {
    const blueSideMember = ['Merlin', 'Percival', 'LoyalServant']
    let isBlueSide = false
    players.forEach((element) => {
      if (element.name === userName && blueSideMember.includes(element.role)) {
        isBlueSide = true
      }
    })
    return isBlueSide
  }

  // const handleGameStart = () => {
  //   // 檢查人數是否足夠
  //   if (players.length < location.state.people) {
  //     alert('人數不夠')
  //     return
  //   }
  //   dispatch({
  //     type: 'sendGameStatus',
  //     payload: {
  //       gameType: 'GAMESTART',
  //       roomId: roomId
  //     }
  //   })
  // }

  const { handleConfirmLady, handleConfirmMerlin, handleConfirmTeamMember } = useGameActions(players, gameboard, roomId)

  const showBtn = (key) => {
    if (!isShow) return <></>
    switch (key) {
      case 'VOTE':
        return (
          <GameBoardFrameB
            content="Voteing"
            roomId={roomId}
            name={userName}
            status={gameboard.currentStatus}
            validation={{ required: { value: true, message: '請選擇是否同意出任務' } }}
          />
        )
      case 'SELECTTEAM':
        if (checkIsLeader()) {
          const selectedPlayersCount = players.filter((player) => player.selected).length
          const remainingPlayersCount = Math.max(0, gameboard.currentMission.teamSize - selectedPlayersCount)
          return (
            <GameBoardFrameA
              title="點擊頭像選擇出任務玩家"
              content={Array(remainingPlayersCount).fill(Shield)}
              onClick={handleConfirmTeamMember}
              errorMsg={errorMsg}
            />
          )
        }
        break
      case 'VOTEFORMISSION':
        if (checkIsTeamMember()) {
          if (checkIsBlueSide()) {
            return (
              <GameBoardFrameB
                content="Task"
                roomId={roomId}
                name={userName}
                status={gameboard.currentStatus}
                validation={{ required: { value: true, message: '請選擇任務成功或是失敗' } }}
                isBlueSide={true}
              />
            )
          } else {
            return (
              <GameBoardFrameB
                content="Task"
                roomId={roomId}
                name={userName}
                status={gameboard.currentStatus}
                validation={{ required: { value: true, message: '請選擇任務成功或是失敗' } }}
              />
            )
          }
        }
        break
      case 'LADY':
        return <GameBoardFrameA title="點擊頭像選擇湖中女神對象" content={[Drip]} onClick={handleConfirmLady} />
      case 'ASSASSIN':
        return <GameBoardFrameA title="點擊頭像刺殺梅林" content={[Knife]} onClick={handleConfirmMerlin} />
      case 'END':
        return <GameOver result={result} onClick={handleToLobby}></GameOver>
      default:
        ;<></>
    }
  }

  let me = players.find((player) => player.name === userName)
  // if me is defined return { name: me.name, role: me.role, roleImg: me.roleImg}
  // if me is undefined return { name: "", role: "", roleImg: ""}
  me =
    me !== undefined
      ? me
      : {
          name: userName,
          role: '',
          roleImg: 'Back',
          isHuman: false,
          isOwner: false,
          selected: false,
          hadLady: false,
          findMerlin: false,
          VoteResult: null
        }
  const [result, setResult] = useState(true)

  useEffect(() => {
    let faction = ''
    if (['Merlin', 'Percival', 'LoyalServant', 'LoyalServantB', 'LoyalServantC', 'LoyalServantD'].includes(me.role)) {
      faction = 'GOOD'
    } else {
      faction = 'EVIL'
    }

    if (faction === gameboard.endOfWin) {
      setResult(true)
    } else {
      setResult(false)
    }
  }, [me.role, gameboard.endOfWin])
  return (
    <Background>
      <PlayerArea players={players} userName={userName} currentStatus={gameboard.currentStatus} />
      {isStart ? (
        <GameBoardFront gameboard={gameboard}>{showBtn(gameboard.currentStatus)}</GameBoardFront>
      ) : (
        <SettingArea roomId={roomId} players={players} state={location.state} />
      )}

      <div className="flex flex-row items-center justify-center gap-2">
        <Chat roomId={roomId} userName={userName} />
        <Card
          userName={me.name}
          cardImg={RoleImageMappingTable[me.roleImg]}
          center={me.isAgree === 1 ? agree : me.isAgree === 0 ? disagree : null}
          onClick={() => handleBlockClick(me.name, userName)}
          selected={me.selected}
          hasLady={me.hasLady}
          hadLady={me.hadLady}
          isLeader={me.isLeader}
          isTeamMember={me.isTeamMember}
          currentStatus={gameboard.currentStatus}
        />
      </div>
    </Background>
  )
}

export default RoomFront
