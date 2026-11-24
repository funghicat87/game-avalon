import GameFlow from './GameFlow'
import TaskArea from './TaskArea'
import VoteRecordArea from './VoteRecordArea'

const STAGE_BY_STATUS = {
  SELECTTEAM: 0,
  VOTE: 1,
  VOTEFORMISSION: 2,
  LADY: 3
}

const GameBoardFront = ({ children, gameboard }) => {
  const stage = STAGE_BY_STATUS[gameboard.currentStatus] ?? -1

  const tasks = Object.values(gameboard.history ?? {}).map((ele) => ({
    win: ele.mission.results === null ? 'white' : ele.mission.results ? 'blue' : 'red',
    numberPeople: ele.mission.teamSize,
    needTwo: ele.mission.failureCondition >= 2,
    now: ele.mission.id === gameboard.currentMission?.id && !['ASSASSIN', 'END'].includes(gameboard.currentStatus)
  }))

  // 這個任務已經進行到第幾次組隊（連續五次否決任務失敗）
  const records = [1, 2, 3, 4, 5].map((ele) => (gameboard.currentRound?.id ?? 0) >= ele)

  return (
    <div className="relative flex flex-col justify-center items-center gap-1 lg:gap-0 py-2 lg:py-0 lg:h-[300px] w-full lg:w-auto">
      <GameFlow stage={stage} />
      <TaskArea tasks={tasks} />
      <VoteRecordArea records={records} />
      {children}
    </div>
  )
}

export default GameBoardFront
