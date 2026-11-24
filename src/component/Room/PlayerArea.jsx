/* eslint-disable react/prop-types */
import { CardFlat } from './CardFlat'
import { getDisplayRole, getRevealedRole, getRoleSide, voteImage } from '../../utils/MappingImage'

const PlayerArea = ({ players, userName, currentStatus, selectable, onSelect }) => {
  const me = players.find((player) => player.name === userName)
  // 用湖中女神查驗過的對象，可以看到他的陣營
  const ladyTargetName = me?.hadLady ? players[me.hadLadyIdx]?.name : null

  const getCardImg = (player) => {
    if (currentStatus === 'END') return getRevealedRole(player)
    if (player.name === ladyTargetName) return getRoleSide(player)
    return getDisplayRole(player, me?.role)
  }

  return (
    <div className="flex flex-row w-full lg:w-[950px] flex-wrap-reverse items-center justify-center gap-2 lg:gap-3">
      {players
        .filter((player) => player.name !== userName)
        .map((player) => (
          <CardFlat
            key={player.name}
            userName={player.name}
            cardImg={getCardImg(player)}
            center={voteImage(player.isAgree)}
            onClick={() => onSelect(player.name)}
            selectable={selectable}
            selected={player.selected}
            hasLady={player.hasLady}
            hadLady={player.hadLady}
            isLeader={player.isLeader}
            isTeamMember={player.isTeamMember}
            currentStatus={currentStatus}
          />
        ))}
    </div>
  )
}

export default PlayerArea
