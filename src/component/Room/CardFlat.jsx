/* eslint-disable react/prop-types */
import cardIconCrowm from '../../assets/icon/card-icon-crown.webp'
import cardIconDrip from '../../assets/icon/card-icon-drip.webp'
import cardIconShield from '../../assets/icon/card-icon-shield.webp'
import cardIconNodrip from '../../assets/icon/card-icon-nodrip.webp'
import Knife from '../../assets/gameboard/Knife.webp'

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
    <div className="flex relative w-[100px] sm:w-[130px] lg:w-[180px] items-center justify-center bg-Black/[0.7]" onClick={onClick}>
      <img src={cardImg} alt="cardimg" className="h-full object-contain" />
      <div className="text-White absolute bottom-1 sm:bottom-2 lg:bottom-3 text-xs lg:text-sm tracking-wider lg:tracking-widest truncate max-w-[90%]">{userName}</div>
      <div className="flex flex-col absolute top-2 right-3 sm:top-3 sm:right-4 lg:top-5 lg:right-6">
        {selected && (
          <img
            src={getStatusIcon(currentStatus)}
            alt="selected"
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {hasLady && (
          <img
            src={cardIconDrip}
            alt="hasLady"
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {hadLady && (
          <img
            src={cardIconNodrip}
            alt="hadLady"
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {isLeader && (
          <img
            src={cardIconCrowm}
            alt="isLeader"
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {isTeamMember && (
          <img
            src={cardIconShield}
            alt="isTeamMember"
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
      <img
        src={center}
        alt="centetPicture"
        className={`absolute w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 top-2 left-1/2 -translate-x-1/2 ${center === null ? 'hidden' : ''}`}
      />
    </div>
  )
}

export { CardFlat }
