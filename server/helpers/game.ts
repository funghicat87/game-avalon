import { PlayerModel } from "../models/player.js"
import { GameStateModel, History } from "../models/game.js";
/**********************************************************
 * Game
 */
interface GameBoardRule {
  teamSize: number[];
  failureCondition: number[];
}

const gameBoardRuleByNumber: {[key: number]: GameBoardRule} = {
  5: {
    teamSize: [2, 3, 2, 3, 3],
    failureCondition: [1, 1, 1, 1, 1]
  },
  6: {
    teamSize: [2, 3, 4, 3, 4],
    failureCondition: [1, 1, 1, 1, 1]
  },
  7: {
    teamSize: [2, 3, 3, 4, 4],
    failureCondition: [1, 1, 1, 2, 1]
  },
  8: {
    teamSize: [3, 4, 4, 5, 5],
    failureCondition: [1, 1, 1, 2, 1]
  },
  9: {
    teamSize: [3, 4, 4, 5, 5],
    failureCondition: [1, 1, 1, 2, 1]
  },
  10: {
    teamSize: [3, 4, 4, 5, 5],
    failureCondition: [1, 1, 1, 2, 1]
  }
}
  
/**
 * 函式：隨機派發角色
 */
function assignRoles(players: PlayerModel[], roleImgPair: {[key: string]: string}) {
  let rolesImgPair = roleImgPair;
  const shuffledRolesImg = Object.keys(rolesImgPair).sort(() => Math.random() - 0.5)
  // const shuffledRolesImg = Object.keys(rolesImgPair)
  for (let i = 0; i < players.length; i++) {
    players[i].role = rolesImgPair[shuffledRolesImg[i]]
    players[i].roleImg = shuffledRolesImg[i]
    players[i].selected = false,
    players[i].hasLady = false,
    players[i].hadLady = false,
    players[i].isLeader = false,
    players[i].isTeamMember = false
  }
}

/**
 * 函式：初始化遊戲版
 */
function initGameBoard(gameBoard: GameStateModel, players: PlayerModel[]) {
  /*
  {
    "missionHistory": {
      1: {
        "info":{
          "missionId": 1,
          "missionTeamSize": 2,
          "missionFailureCondition": 1,
          "missionResults": "success",
        },
        "voteHistory": [
          {
            "round": 1,
            "leaderIndex": 2,
            "teamMembersIndex": [2, 4],
            "votes": [true, true, false, false, false],
            "isApproved": true,
          }
        ],
      },
      2: {
        "info":{
          "missionId": 2,
          "missionTeamSize": 2,
          "missionFailureCondition": 1,
          "missionResults": null,
        },
        "voteHistory": [
          {
            "round": 1,
            "leaderIndex": null,
            "teamMembersIndex": [],
            "votes": [],
            "isApproved": null,
          }
        ]
      }
      // ...其他資訊...
    }
  }
  */
  let history: History = {}

  console.log('players.length:', gameBoardRuleByNumber)

  const missionTeamSize = gameBoardRuleByNumber[players.length]['teamSize']
  const missionFailureCondition = gameBoardRuleByNumber[players.length]['failureCondition']

  const missions = ['1', '2', '3', '4', '5']
  missions.forEach((element, key) => {
    history[element] = {
      mission: {
        id: element,
        teamSize: missionTeamSize[key],
        failureCondition: missionFailureCondition[key],
        votes: [],
        results: null
      },
      rounds: []
    }
  })
  gameBoard.history = history
  gameBoard['currentMission']['teamSize'] = missionTeamSize[0]
  gameBoard['currentMission']['failureCondition'] = missionFailureCondition[0]
}

/**
 * 函式：隨機選擇隊長
 */
function chooseLeader(gameBoard: GameStateModel, players: PlayerModel[]) {
  const randomIndex = Math.floor(Math.random() * players.length)
  gameBoard['currentRound']['leaderIndex'] = randomIndex
}

/**
 * 函式：隨機選擇湖中女神
 */
function chooseLady(gameBoard: GameStateModel, players: PlayerModel[]): number {
  return Math.floor(Math.random() * players.length)
}

/**
 * 函式：更新湖中女神
 */
function updateLadyIndex(players: PlayerModel[], gameBoard: GameStateModel, indices: number) {
  if (indices !== -1) {
    if (gameBoard['ladyIndex']!==null) {
      players[gameBoard['ladyIndex']].hadLady = true
      players[gameBoard['ladyIndex']].hadLadyIdx = indices
    }
    // update
    gameBoard['ladyIndex'] = indices
    gameBoard['ladyIndexHistory'].push(indices)
    // 現在正在擁有湖中女神
    players.forEach((player) => {
      player.hasLady = false
    })
    players[indices].hasLady = true
  }
}

/**
 * 函式：電腦隨機選擇湖中女神
 */
function simulateAISelectLadyIndex(players: PlayerModel[], gameBoard: GameStateModel) {
  let idx = -1
  if (gameBoard.ladyIndex !== null && !players[gameBoard.ladyIndex].isHuman) {
    let listNotYetHadLady: number[] = []
    players.forEach((ele, idx) => {
      if (!gameBoard.ladyIndexHistory.includes(idx)) {
        listNotYetHadLady.push(idx)
      }
    })
    idx = listNotYetHadLady[Math.floor(Math.random() * listNotYetHadLady.length)]
  }
  return idx
}

/**
 * 函式：選擇下一位隊長
 */
function chooseNextLeader(players: PlayerModel[], gameBoard: GameStateModel) {
  const currentLeaderIndex = gameBoard['currentRound']['leaderIndex']
  const nextLeaderIndex = (currentLeaderIndex !== null ? (currentLeaderIndex + 1) % players.length : 0)
  return nextLeaderIndex
}

/**
 * 函式：更新選擇隊伍成員
 */
function updateTeamMembers(players: PlayerModel[], gameBoard: GameStateModel, indices: number[]) {
  gameBoard['currentRound']['teamMembersIndex'] = indices
  players.forEach((player) => {
    player.isTeamMember = false
  })
  for (const index of indices) {
    players[index].isTeamMember = true
  }
}

/**
 * 函式：檢查投票是否結束
 */
function checkIsVoteEnd(players: PlayerModel[], gameBoard: GameStateModel) {
  const total = players.length
  if (total === gameBoard['currentRound']['votes'].length) {
    return true
  } else {
    return false
  }
}

/**
 * 函式：檢查任務是否結束
 */
function checkIsMissionVoteEnd(temp: {[key: string]: number}[], gameBoard: GameStateModel) {
  const total = temp.length
  if (total === gameBoard['currentMission']['teamSize']) {
    return true
  } else {
    return false
  }
}

/**
 * 函式：檢查任務是否核准
 */
function checkIsApproved(votes: {[key: string]: number}[]) {
  const totalVotes = votes.length
  let onesCount = 0
  // 计算1的数量
  for (const vote of votes) {
    for (const key in vote) {
      if (vote[key] === 1) {
        onesCount++
      }
    }
  }
  // 检查是否有超过一半的1
  return onesCount > totalVotes / 2
}

/**
 * 函式：更新CurrentRound
 */
function updateCurrentRound(players: PlayerModel[], gameBoard: GameStateModel) {
  let isApproved = checkIsApproved(gameBoard.currentRound.votes)
  // isApproved = false
  gameBoard['currentRound']['isApproved'] = isApproved
  gameBoard.history[gameBoard.currentMission.id]['rounds'].push(
    JSON.parse(JSON.stringify(gameBoard['currentRound']))
  )
  players.forEach((player) => { player.isAgree = -1 });
  return isApproved
}

/**
 * 函式：更新到下一個Round
 */
function updateToNextRound(players: PlayerModel[], gameBoard: GameStateModel, isApproved: boolean) {
  const nextLeaderIndex = chooseNextLeader(players, gameBoard)
  players.forEach((player) => {
    player.isLeader = false
    player.isTeamMember = false
  })
  players[nextLeaderIndex].isLeader = true
  if (isApproved || (gameBoard['currentRound']['id']+1 > 5)) {
    gameBoard['currentRound']['id'] = 1
    gameBoard['currentRound']['leaderIndex'] = nextLeaderIndex
    gameBoard['currentRound']['teamMembersIndex'] = []
    gameBoard['currentRound']['votes'] = []
    gameBoard['currentRound']['isApproved'] = null
    return true
  } else {
    gameBoard['currentRound']['id'] += 1
    gameBoard['currentRound']['leaderIndex'] = nextLeaderIndex
    gameBoard['currentRound']['teamMembersIndex'] = []
    gameBoard['currentRound']['votes'] = []
    gameBoard['currentRound']['isApproved'] = null
    return false
  }
}

function checkZeroCount(array: number[], number: number) {
  const zeroCount = array.reduce((count, element) => {
    if (element === 0) {
      count++
    }
    return count
  }, 0)

  return !(zeroCount >= number)
}

function checkWinner(tempVoteInfo: {[key: string]: number}[], gameBoard: GameStateModel) {
  // return true
  return checkZeroCount(
    tempVoteInfo.map((obj) => Object.values(obj)[0]),
    gameBoard.currentMission.failureCondition
  )
}

/**
 * 函式：更新CurrentMission結果
 */
function updateCurrentMission(res: boolean, gameBoard: GameStateModel) {
  console.log('Mission result:', res)
  gameBoard['currentMission']['results'] = res
  gameBoard.history[gameBoard.currentMission.id]['mission']['results'] = res
}

/**
 * 函式：更新CurrentMission位置的值
 */
function updateToNextMission(gameBoard: GameStateModel) {
  const nextMissionId = parseInt(gameBoard.currentMission.id) + 1
  if (nextMissionId <= 5) {
    gameBoard.currentMission = JSON.parse(JSON.stringify(gameBoard.history[String(nextMissionId)].mission))
  } else {
    console.log('All missions completed.')
  }
}

/**
 * 函式：檢查遊戲有無結束
 */
function checkGameIsEnd(gameBoard: GameStateModel) {
  const missionResults = Object.values(gameBoard.history).map((ele) => ele.mission.results)
  const evilWins = missionResults.filter((result) => result === false).length >= 3
  const goodWins = missionResults.filter((result) => result === true).length >= 3

  if (evilWins) {
    return 'Evil'
  } else if (goodWins) {
    return 'Good'
  } else {
    return ''
  }
}

/**********************************************************
 * Game AI
 */

/**
 * 函數：從 players 亂數選擇幾位玩家
 */
function simulateAIRandomSelectPlayersIdx(players: PlayerModel[], gameBoard: GameStateModel) {
  if (!gameBoard.currentRound.leaderIndex) {
    return []
  }
  if (!players[gameBoard.currentRound.leaderIndex].isHuman) {
    const teamMemberIndex = gameBoard['currentMission']['teamSize'] !== null ? randomSelectPlayersIndices(players, gameBoard['currentMission']['teamSize']) : []
    return teamMemberIndex
  } else {
    return []
  }
}

/**
 * 電腦隨機投票
 */
function simulateAIRandomVote(players: PlayerModel[], gameBoard: GameStateModel) {
  const arr = gameBoard.currentRound.votes.map(obj => Object.keys(obj)[0]);
  const res = []
  if (gameBoard.currentRound.teamMembersIndex) {
    for (const player of players) {
      if (!player.isHuman && !arr.includes(player.name)) {
        res.push({ [player.name]: randomZeroOrOne() })
      }
    }
  }
  return res
}

/**
 * 函式：電腦任務隨機投票
 */
function simulateAIRandomVoteForMission(players: PlayerModel[], gameBoard: GameStateModel) {
  const arr = gameBoard.currentMission.votes.map(obj => Object.keys(obj)[0]);
  const res = []
  const playersOnMission = gameBoard.currentRound.teamMembersIndex.map((index) => players[index])
  for (const player of playersOnMission) {
    if (!player.isHuman && !arr.includes(player.name)) {
      if (['Merlin', 'Percival', 'LoyalServant'].includes(player.role)) {
        res.push({ [player.name]: 1 })
      }
      res.push({ [player.name]: randomZeroOrOne() })
    }
  }
  return res
}

/**
 * 函式：電腦隨機
 */
function simulateAISelectMerlinIndex(players:PlayerModel[]) {
  let idx = -1
  for (const player of players) {
    if (!player.isHuman && player.role === 'Assassin') {
      idx = Math.floor(Math.random() * players.length)
    }
  }
  return idx
}

/**
 * 函式：從 players 亂數選擇幾位玩家的 index
 */
function randomSelectPlayersIndices(players: PlayerModel[], count: number) {
  const selectedIndices: number[] = []
  while (selectedIndices.length < count) {
    const randomIndex = Math.floor(Math.random() * players.length)
    if (!selectedIndices.includes(randomIndex)) {
      selectedIndices.push(randomIndex)
    }
  }
  return selectedIndices
}

/**
 * 函式：輸出0 or 1
 */
function randomZeroOrOne() {
  return Math.floor(Math.random() * 2)
}

export {
  checkWinner,
  assignRoles,
  initGameBoard,
  chooseLeader,
  chooseLady,
  updateLadyIndex,
  simulateAISelectLadyIndex,
  updateTeamMembers,
  checkIsVoteEnd,
  updateCurrentRound,
  updateToNextRound,
  updateToNextMission,
  checkIsMissionVoteEnd,
  updateCurrentMission,
  checkGameIsEnd,
  simulateAIRandomSelectPlayersIdx,
  simulateAIRandomVote,
  simulateAIRandomVoteForMission,
  simulateAISelectMerlinIndex
}
