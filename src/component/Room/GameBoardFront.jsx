import { useState, useEffect } from 'react'
import GameFlow from './GameFlow'
import TaskArea from './TaskArea'
import VoteRecordArea from './VoteRecordArea'

const GameBoardFront = ({ children, gameboard }) => {
  const [staege, setStage] = useState(0)
  const [tasksData, setTasksData] = useState([])
  const [records, setRecords] = useState([])

  // const tasksData = [
  //   { win: "red", numberPeople: '3' },
  //   { win: "blue", numberPeople: '3' },
  //   { win: "red", numberPeople: '4' },
  //   { win: "red", numberPeople: '5', needTwo: true, now: true },
  //   { win: "white", numberPeople: '5' }
  // ];

  useEffect(() => {
    switch (gameboard.currentStatus) {
      case 'SELECTTEAM':
        setStage(0)
        break
      case 'VOTE':
        setStage(1)
        break
      case 'VOTEFORMISSION':
        setStage(2)
        break
      case 'LADY':
        setStage(3)
        break
      default:
        break
    }

    const tasks = Object.values(gameboard.history).map((ele) => {
      if (ele.mission.results !== null) {
        if (ele.mission.results) {
          return { win: 'blue', numberPeople: ele.mission.teamSize }
        } else {
          return { win: 'red', numberPeople: ele.mission.teamSize }
        }
      } else {
        return { win: 'white', numberPeople: ele.mission.teamSize }
      }
    })
    setTasksData(tasks)

    const record = [1, 2, 3, 4, 5].map((ele) => {
      if (gameboard.currentRound.id >= ele) {
        return true
      } else {
        return false
      }
    })
    setRecords(record)
  }, [gameboard])

  return (
    <div className="relative flex flex-col justify-center items-center h-[300px]">
      <GameFlow stage={staege} />
      <TaskArea tasks={tasksData} />
      <VoteRecordArea records={records} />
      {children}
    </div>
  )
}

export default GameBoardFront
