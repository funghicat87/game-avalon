/* eslint-disable react/prop-types */
import cardIconCrowm from '../../assets/icon/card-icon-crown.webp'
import cardIconDrip from '../../assets/icon/card-icon-drip.webp'
import cardIconNodrip from '../../assets/icon/card-icon-nodrip.webp'
import cardIconShield from '../../assets/icon/card-icon-shield.webp'
import cardFrame from '../../assets/role/card-frame.webp'
import Knife from '../../assets/gameboard/Knife.webp'
import { useState } from 'react'
import Button from '../Button'

const Card = ({
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
      <div className="text-White absolute bottom-4 tracking-widest">{userName}</div>
      <div className="flex flex-col absolute top-8 right-8">
        {selected && (
          <img
            src={getStatusIcon(currentStatus)}
            alt="selected"
            className="w-8 h-8 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {hasLady && (
          <img
            src={cardIconDrip}
            alt="hasLady"
            className="w-8 h-8 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {hadLady && (
          <img
            src={cardIconNodrip}
            alt="hadLady"
            className="w-8 h-8 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {isLeader && (
          <img
            src={cardIconCrowm}
            alt="isLeader"
            className="w-8 h-8 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
        {isTeamMember && (
          <img
            src={cardIconShield}
            alt="isTeamMember"
            className="w-8 h-8 object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
      <img
        src={center}
        alt="centetPicture"
        className={`absolute w-28 h-28 top-10 left-1/2 -translate-x-1/2 ${center === null ? 'hidden' : ''}`}
      />
    </div>
  )
}

const SmallCard = ({ userName, cardImg, onClick, className, Introduction, onEnlargeChange }) => {
  const [isEnlarged, setIsEnlarged] = useState(false)
  
  let timer = null
  const handleLongPress = () => {
    timer = setTimeout(() => {
      setIsEnlarged(true)
      onEnlargeChange(true) // 通知父元件
    }, 500)
  }

  const handleTouchEnd = () => {
    setIsEnlarged(false)
    onEnlargeChange(false) // 通知父元件
    clearTimeout(timer)
  }


  const [isBack, setIsBack] = useState(false)

  const handleTurnBack = () => {
    setIsBack(true)
  }

  const handleTurnFront = () => {
    setIsBack(false)
  }

  return (
    <>
      <div className={`flex relative items-center justify-center bg-Black/[0.7] ${className}`}>
        <img
          src={cardImg}
          alt="cardimg"
          className="h-full object-contain"
          onClick={onClick}
          onMouseDown={handleLongPress}
          onMouseUp={handleTouchEnd}
          title={userName}
        />
      </div>
      {isEnlarged && (
        <div className="fixed inset-0 flex items-center justify-center bg-Black/80 z-50">
          <div className="relative w-[250px]">
            <div>
              {isBack ? (
                <div className="bg-Black/80">
                  <img
                    src={cardFrame}
                    alt="enlarged cardimg"
                    className="w-full object-contain"
                    onClick={handleTurnFront}
                  />
                  <div className="text-justify text-White w-3/4 absolute text-base left-1/2 -translate-x-1/2 top-[150px] -translate-y-1/2 ">
                    {Introduction}
                  </div>
                </div>
              ) : (
                <div className="bg-Black/80">
                  <img
                    src={cardImg}
                    alt="enlarged cardimg"
                    className="w-full object-contain"
                    onClick={handleTurnBack}
                  />
                  <div className="text-White absolute text-base bottom-[102px] left-1/2 -translate-x-1/2 tracking-widest">
                    {userName}
                  </div>
                </div>
              )}
            </div>
            <Button mt="mt-6" onClick={handleTouchEnd}>
              確認
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
export { Card, SmallCard }
