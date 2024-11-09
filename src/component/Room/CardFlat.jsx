/* eslint-disable react/prop-types */
import cardIconCrowm from '../../assets/icon/card-icon-crown.png'
import cardIconDrip from '../../assets/icon/card-icon-drip.png'
import cardIconShield from '../../assets/icon/card-icon-shield.png'
import cardIconNodrip from '../../assets/icon/card-icon-nodrip.png'
import Knife from '../../assets/gameboard/Knife.png'

const CardFlat = ({
  userName,
  cardImg,
  center,
  onClick,
  selected,
  hasLady,
  hadLady,
  isLeader,
  isTeamMember,
  currentStatus
}) => {
  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'SELECTTEAM':
        return cardIconShield
      case 'LADY':
        return cardIconDrip
      case 'ASSASSIN':
        return Knife
      default:
        return null
    }
  }

  return (
    <div className="flex relative w-[180px] items-center justify-center bg-Black/[0.7]" onClick={onClick}>
      <img src={cardImg} alt="cardimg" className="h-full object-contain" />
      <div className="text-White absolute bottom-3 text-sm tracking-widest">{userName}</div>
      <div className="flex flex-col absolute top-5 right-6">
        {selected && (
          <img
            src={getStatusIcon(currentStatus)}
            alt="selected"
            className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {hasLady && (
          <img
            src={cardIconDrip}
            alt="hasLady"
            className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {hadLady && (
          <img
            src={cardIconNodrip}
            alt="hadLady"
            className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {isLeader && (
          <img
            src={cardIconCrowm}
            alt="isLeader"
            className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {isTeamMember && (
          <img
            src={cardIconShield}
            alt="isTeamMember"
            className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
      <img
        src={center}
        alt="centetPicture"
        className={`absolute w-24 h-24 top-2 left-1/2 -translate-x-1/2 ${center === null ? 'hidden' : ''}`}
      />
    </div>
  )
}

export { CardFlat }
