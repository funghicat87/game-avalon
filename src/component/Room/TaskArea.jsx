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

  return (
    <div className={`relative ${now ? 'w-52 h-52 ' : 'w-44 h-44 '}`}>
      <span
        className={`${getTextColorClass()} font-Roboto absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center ${getDropShadowClass()} font-thin tracking-wider ${
          now ? 'text-[12px] top-16' : 'text-[10px] top-12'
        }`}
      >
        Task {task}
      </span>
      <span
        className={`${getTextColorClass()} absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center ${getDropShadowClass()} ${
          now ? 'text-5xl top-[80px]' : 'text-4xl top-[66px]'
        }`}
      >
        {numberPeople}
      </span>
      <span
        className={`${getTextColorClass()} absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center ${getDropShadowClass()} ${
          now ? 'text-[11px] bottom-[60px]' : 'text-[10px] bottom-[50px]'
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
