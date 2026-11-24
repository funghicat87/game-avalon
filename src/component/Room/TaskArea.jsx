import TaskFrameBlue from '../../assets/gameboard/TaskFrameBlue.webp'
import TaskFrameRed from '../../assets/gameboard/TaskFrameRed.webp'
import TaskFrameWhite from '../../assets/gameboard/TaskFrameWhite.webp'

const Task = ({ task, win, numberPeople, now, needTwo }) => {
  const getImageSrc = () => {
    if (win === 'red') return TaskFrameRed
    if (win === 'blue') return TaskFrameBlue
    return TaskFrameWhite // 默認圖片
  }

  const getDropShadowClass = () => {
    if (win === 'red') return 'drop-shadow-[0_0_5px_#FF3636]'
    if (win === 'blue') return 'drop-shadow-[0_0_5px_#3693FF]'
    return 'drop-shadow-[0_0_5px_White]'
  }

  const getTextColorClass = () => {
    if (win === 'red') return 'text-[#F7BABA]'
    if (win === 'blue') return 'text-[#C0D6F7]'
    return 'text-White'
  }

  // 手機 / 平板用百分比定位，lg 以上維持原本的像素定位
  return (
    <div
      className={`relative ${
        now
          ? 'w-16 h-16 min-[400px]:w-20 min-[400px]:h-20 sm:w-32 sm:h-32 lg:w-52 lg:h-52'
          : 'w-[52px] h-[52px] min-[400px]:w-16 min-[400px]:h-16 sm:w-28 sm:h-28 lg:w-44 lg:h-44'
      }`}
    >
      <span
        className={`${getTextColorClass()} font-Roboto absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center whitespace-nowrap ${getDropShadowClass()} font-thin tracking-wider ${
          now
            ? 'text-[8px] sm:text-[10px] lg:text-[12px] top-[26%] lg:top-16'
            : 'text-[7px] sm:text-[9px] lg:text-[10px] top-[24%] lg:top-12'
        }`}
      >
        Task {task}
      </span>
      <span
        className={`${getTextColorClass()} absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:translate-y-0 flex items-center justify-center ${getDropShadowClass()} ${
          now
            ? 'text-xl min-[400px]:text-2xl sm:text-4xl lg:text-5xl top-1/2 lg:top-[80px]'
            : 'text-lg min-[400px]:text-xl sm:text-3xl lg:text-4xl top-1/2 lg:top-[66px]'
        }`}
      >
        {numberPeople}
      </span>
      <span
        className={`${getTextColorClass()} absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center whitespace-nowrap ${getDropShadowClass()} ${
          now
            ? 'text-[8px] sm:text-[10px] lg:text-[11px] bottom-[24%] lg:bottom-[60px]'
            : 'text-[7px] sm:text-[9px] lg:text-[10px] bottom-[22%] lg:bottom-[50px]'
        } ${needTwo ? '' : 'hidden'}`}
      >
        兩張失敗
      </span>
      <img className="absolute w-full h-full" src={getImageSrc()} alt="TaskFrame" />
    </div>
  )
}

const TaskArea = ({ tasks }) => {
  return (
    <div className="flex items-center justify-center">
      {tasks.map((data, index) => (
        <Task
          key={index}
          task={index + 1}
          win={data.win}
          numberPeople={data.numberPeople}
          needTwo={data.needTwo}
          now={data.now}
        />
      ))}
    </div>
  )
}

export default TaskArea
