import React from 'react'
import UpperLeft from '../assets/frame/upper_left.svg'
import UpperRight from '../assets/frame/upper_right.svg'
import LowerRight from '../assets/frame/lower_right.svg'
import LowerLeft from '../assets/frame/lower_left.svg'

const Frame = ({ children, className, width = 'w-[650px]' }) => {
  const classes = `borderGradientFrame relative border-box border-[1.4461px] bg-Black/[0.85]  text-White flex  items-center justify-center font-ZenOldMincho py-12 ${className} ${width}`
  return (
    <div className={classes}>
      <div
        className="bg-cover absolute w-[120px] h-[120px] corner top-[-7.0723px] right-[-7.0723px]"
        style={{ backgroundImage: `url(${UpperRight})` }}
      ></div>
      <div
        className="bg-cover absolute w-[120px] h-[120px] corner bottom-[-7.0723px] left-[-7.0723px]"
        style={{ backgroundImage: `url(${LowerLeft})` }}
      ></div>
      <div
        className="bg-cover absolute w-[120px] h-[120px] corner top-[-7.0723px] left-[-7.0723px]"
        style={{ backgroundImage: `url(${UpperLeft})` }}
      ></div>
      <div
        className="bg-cover absolute w-[120px] h-[120px] corner bottom-[-7.0723px] right-[-7.0723px]"
        style={{ backgroundImage: `url(${LowerRight})` }}
      ></div>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

export default Frame
