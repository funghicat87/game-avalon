/* eslint-disable react/prop-types */
import { CardStatusIcons } from './Card'

const CardFlat = ({ userName, cardImg, center, onClick, selectable, ...status }) => {
  return (
    <div
      className={`flex relative w-[100px] sm:w-[130px] lg:w-[180px] items-center justify-center bg-Black/[0.7] select-none ${
        selectable ? 'cursor-pointer hover:drop-shadow-[0_0_6px_White]' : ''
      } ${status.selected ? 'drop-shadow-[0_0_8px_White]' : ''}`}
      onClick={onClick}
    >
      <img src={cardImg} alt="card" className="h-full object-contain" draggable={false} />
      <div className="text-White absolute bottom-1 sm:bottom-2 lg:bottom-3 text-xs lg:text-sm tracking-wider lg:tracking-widest truncate max-w-[90%]">
        {userName}
      </div>
      <div className="flex flex-col absolute top-2 right-3 sm:top-3 sm:right-4 lg:top-5 lg:right-6">
        <CardStatusIcons {...status} iconClass="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </div>
      {center && (
        <img
          src={center}
          alt="投票結果"
          className="absolute w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 top-2 left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  )
}

export { CardFlat }
