import GameFlowStartImg from '../../assets/gameboard/GameFlowStart.webp'
import GameFlowImg from '../../assets/gameboard/GameFlow.webp'

const GameFlowStart = ({ content, className }) => {
  return (
    <div className={`relative h-6 sm:h-7 lg:h-8 w-[88px] sm:w-[160px] lg:w-[250px] flex items-center justify-center ${className} `}>
      <span className="text-White z-10 whitespace-nowrap text-[10px] sm:text-sm lg:text-base tracking-normal sm:tracking-[0.4em] lg:tracking-[0.75em]">{content}</span>
      <img src={GameFlowStartImg} alt="GameFlowStartImg" className="w-full absolute top-0 z-0 h-full" />
    </div>
  )
}

const GameFlowBody = ({ content, className }) => {
  return (
    <div className={`relative h-6 sm:h-7 lg:h-8 w-[88px] sm:w-[160px] lg:w-[250px] flex items-center justify-center -ml-2 sm:-ml-3 lg:-ml-5 ${className} `}>
      <span className="text-White z-10 whitespace-nowrap text-[10px] sm:text-sm lg:text-base tracking-normal sm:tracking-[0.4em] lg:tracking-[0.75em] ml-2 sm:ml-4 lg:ml-6 ">{content}</span>
      <img src={GameFlowImg} alt="GameFlowStartImg" className="w-full absolute top-0 z-0 h-full" />
    </div>
  )
}

const GameFlow = ({ stage }) => {
  return (
    <div className="flex">
      <GameFlowStart content="領袖組織隊伍" className={`${stage === 0 ? '' : 'opacity-50'}`} />
      <GameFlowBody content="投票" className={`${stage === 1 ? '' : 'opacity-50'}`} />
      <GameFlowBody content="出任務" className={`${stage === 2 ? '' : 'opacity-50'}`} />
      <GameFlowBody content="湖中女神" className={`${stage === 3 ? '' : 'opacity-50'}`} />
    </div>
  )
}

export default GameFlow
