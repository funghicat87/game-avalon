/* eslint-disable react/prop-types */
import { CardFlat } from './CardFlat'
import { useDispatch } from 'react-redux'
import { gameActions } from '../../features/gameSlice'
import { getDisplayRole, getRoleSide } from '../../utils/MappingImage'
import agree from '@/assets/gameboard/VoteingAgree.png'
import disagree from '@/assets/gameboard/VoteingDisagree.png'

// name: "",
// role: "",
// roleImg: "",
// isHuman: false,
// isOwner: false,
// selected: false,
// hadLady: false
// findMerlin: false, ??
// VoteResult: null,

const PlayerArea = ({ players, userName, currentStatus }) => {
  const dispatch = useDispatch()
  const myRole = players.find((player) => player.name === userName)?.role
  const playerWithLady = players.find((player) => player.name === userName && player.hadLady)
  const targetName = playerWithLady ? players[playerWithLady.hadLadyIdx].name : null

  const handleBlockClick = (playerName, userName) => {
    dispatch(gameActions.setSelectedPlayer({ playerName, userName }))
  }

  return (
    <div className="flex flex-row w-[950px] flex-wrap-reverse items-center justify-center gap-3">
      {players
        .filter((player) => player.name !== userName)
        .map((player, index) => {
          if (targetName === player.name) {
            return (
              <CardFlat
                key={index}
                userName={player.name}
                cardImg={getRoleSide(player)}
                center={player.isAgree === 1 ? agree : player.isAgree === 0 ? disagree : null}
                onClick={() => handleBlockClick(player.name, userName)}
                selected={player.selected}
                hasLady={player.hasLady}
                hadLady={player.hadLady}
                isLeader={player.isLeader}
                isTeamMember={player.isTeamMember}
                currentStatus={currentStatus}
              />
            )
          } else {
            return (
              <CardFlat
                key={index}
                userName={player.name}
                cardImg={getDisplayRole(player, myRole)}
                center={player.isAgree === 1 ? agree : player.isAgree === 0 ? disagree : null}
                onClick={() => handleBlockClick(player.name, userName)}
                selected={player.selected}
                hasLady={player.hasLady}
                hadLady={player.hadLady}
                isLeader={player.isLeader}
                isTeamMember={player.isTeamMember}
                currentStatus={currentStatus}
              />
            )
          }
        })}
    </div>
  )
}

export default PlayerArea
