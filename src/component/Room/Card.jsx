/* eslint-disable react/prop-types */
import cardIconCrowm from '../../assets/icon/card-icon-crown.webp'
import cardIconDrip from '../../assets/icon/card-icon-drip.webp'
import cardIconNodrip from '../../assets/icon/card-icon-nodrip.webp'
import cardIconShield from '../../assets/icon/card-icon-shield.webp'
import cardFrame from '../../assets/role/card-frame.webp'
import Knife from '../../assets/gameboard/Knife.webp'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from '../Button'

const SELECTED_ICON = {
  SELECTTEAM: cardIconShield,
  LADY: cardIconDrip,
  ASSASSIN: Knife
}

/** 卡片右上角的狀態圖示（Card 與 CardFlat 共用） */
export const CardStatusIcons = ({ selected, hasLady, hadLady, isLeader, isTeamMember, currentStatus, iconClass }) => {
  const icons = [
    selected && SELECTED_ICON[currentStatus] && [SELECTED_ICON[currentStatus], '已選擇'],
    hasLady && [cardIconDrip, '湖中女神'],
    hadLady && [cardIconNodrip, '曾持有湖中女神'],
    isLeader && [cardIconCrowm, '隊長'],
    isTeamMember && [cardIconShield, '出任務隊員']
  ].filter(Boolean)
  return icons.map(([src, alt]) => (
    <img
      key={alt}
      src={src}
      alt={alt}
      title={alt}
      className={`${iconClass} object-contain opacity-80 hover:opacity-100 transition-opacity duration-200`}
    />
  ))
}

const Card = ({ userName, cardImg, center, onClick, selectable, ...status }) => {
  return (
    <div
      className={`flex relative w-[120px] lg:w-[180px] items-center justify-center bg-Black/[0.7] select-none ${
        selectable ? 'cursor-pointer hover:drop-shadow-[0_0_6px_White]' : ''
      } ${status.selected ? 'drop-shadow-[0_0_8px_White]' : ''}`}
      onClick={onClick}
    >
      <img src={cardImg} alt="card" className="h-full object-contain" draggable={false} />
      <div className="text-White absolute bottom-2 lg:bottom-4 text-sm lg:text-base tracking-widest truncate max-w-[90%]">
        {userName}
      </div>
      <div className="flex flex-col absolute top-4 right-4 lg:top-8 lg:right-8">
        <CardStatusIcons {...status} iconClass="w-5 h-5 lg:w-8 lg:h-8" />
      </div>
      {center && (
        <img
          src={center}
          alt="投票結果"
          className="absolute w-16 h-16 top-6 lg:w-28 lg:h-28 lg:top-10 left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  )
}

const LONG_PRESS_MS = 500

const SmallCard = ({ userName, cardImg, onClick, className, Introduction }) => {
  const [isEnlarged, setIsEnlarged] = useState(false)
  const [isBack, setIsBack] = useState(false)
  const timerRef = useRef(null)
  const longPressedRef = useRef(false)

  // 用 pointer 事件，滑鼠與手機觸控都支援長按
  const handlePointerDown = () => {
    longPressedRef.current = false
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true
      setIsBack(false)
      setIsEnlarged(true)
    }, LONG_PRESS_MS)
  }

  const cancelLongPress = () => clearTimeout(timerRef.current)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleClick = (e) => {
    // 長按放開後不要再觸發一般點擊
    if (longPressedRef.current) {
      e.preventDefault()
      longPressedRef.current = false
      return
    }
    onClick?.(e)
  }

  const handleClose = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEnlarged(false)
  }

  return (
    <>
      <div className={`flex relative items-center justify-center bg-Black/[0.7] select-none ${className}`}>
        <img
          src={cardImg}
          alt={userName}
          title={userName}
          draggable={false}
          className="h-full object-contain [-webkit-touch-callout:none]"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onPointerCancel={cancelLongPress}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      {/* 用 portal 掛到 body：不受外層 opacity / label 影響 */}
      {isEnlarged &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-Black/80 z-50 font-ZenOldMincho"
            onClick={handleClose}
          >
            <div className="relative w-[250px] max-w-[80vw]" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-Black/80 cursor-pointer" onClick={() => setIsBack(!isBack)}>
                <img src={isBack ? cardFrame : cardImg} alt="enlarged card" className="w-full object-contain" />
                {isBack ? (
                  <div className="text-justify text-White w-3/4 absolute text-sm sm:text-base left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {Introduction}
                  </div>
                ) : (
                  <div className="text-White absolute text-base bottom-[34%] left-1/2 -translate-x-1/2 tracking-widest whitespace-nowrap">
                    {userName}
                  </div>
                )}
              </div>
              <p className="text-LightGray text-xs text-center mt-2">點擊卡片翻面查看介紹</p>
              <Button mt="mt-4" onClick={handleClose}>
                確認
              </Button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
export { Card, SmallCard }
