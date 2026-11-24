import UpperLeft from '../assets/frame/upper_left.svg'
import UpperRight from '../assets/frame/upper_right.svg'
import LowerRight from '../assets/frame/lower_right.svg'
import LowerLeft from '../assets/frame/lower_left.svg'

// 角落裝飾：手機版縮小（64px），md 以上維持 120px
const cornerBase = 'bg-cover absolute w-16 h-16 md:w-[120px] md:h-[120px] corner'

const Frame = ({ children, className, width = 'w-full md:w-[650px]' }) => {
  const classes = `borderGradientFrame relative border-box border-[1.4461px] bg-Black/[0.85]  text-White flex  items-center justify-center font-ZenOldMincho py-8 md:py-12 ${className} ${width}`
  return (
    <div className={classes}>
      <div
        className={`${cornerBase} top-[-3.77px] right-[-3.77px] md:top-[-7.0723px] md:right-[-7.0723px]`}
        style={{ backgroundImage: `url(${UpperRight})` }}
      ></div>
      <div
        className={`${cornerBase} bottom-[-3.77px] left-[-3.77px] md:bottom-[-7.0723px] md:left-[-7.0723px]`}
        style={{ backgroundImage: `url(${LowerLeft})` }}
      ></div>
      <div
        className={`${cornerBase} top-[-3.77px] left-[-3.77px] md:top-[-7.0723px] md:left-[-7.0723px]`}
        style={{ backgroundImage: `url(${UpperLeft})` }}
      ></div>
      <div
        className={`${cornerBase} bottom-[-3.77px] right-[-3.77px] md:bottom-[-7.0723px] md:right-[-7.0723px]`}
        style={{ backgroundImage: `url(${LowerRight})` }}
      ></div>
      <div className="flex flex-col w-full md:w-auto px-5 md:px-0">{children}</div>
    </div>
  )
}

export default Frame
