import { assignRoles, checkGameIsEnd, checkIsMissionVoteEnd, checkIsVoteEnd, checkWinner, chooseLady, chooseLeader, initGameBoard, simulateAIRandomSelectPlayersIdx, simulateAIRandomVote, simulateAIRandomVoteForMission, simulateAISelectLadyIndex, simulateAISelectMerlinIndex, updateCurrentMission, updateCurrentRound, updateLadyIndex, updateTeamMembers, updateToNextMission, updateToNextRound } from "../helpers/game.js";
import { GameStateModel, initGameStateModel } from "../models/game.js";
import { PlayerModel } from "../models/player.js";

interface GameType {
  gameboard: GameStateModel;
  players: PlayerModel[];
}

interface GameTypeMap {
  [key: string]: {
    gameboard: GameStateModel
    players: PlayerModel[]
  }
}

export class GameManager {
  static instance: GameManager
  private games: GameTypeMap = {} as GameTypeMap;

  constructor() {}

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }

  processOfGameStart(roomId: string, players: PlayerModel[], enableLady: boolean, roleImgPair: {[key: string]: string}): GameType {
    // 初始化games
    // tempVoteInfo[roomId] = []
    this.games[roomId] = {
      gameboard: initGameStateModel(),
      players: players ?? []
    }
    // 初始化玩家角色
    assignRoles(this.games[roomId].players, roleImgPair)
    // 初始化遊戲板
    initGameBoard(this.games[roomId].gameboard, this.games[roomId].players)
    // 初始化選擇執行任務隊長
    chooseLeader(this.games[roomId].gameboard, this.games[roomId].players)
    this.games[roomId].gameboard.currentRound.leaderIndex = 0
    // 初始化選擇湖中女神
    if (enableLady) {
      const idx = chooseLady(this.games[roomId].gameboard, this.games[roomId].players)
      updateLadyIndex(this.games[roomId].players, this.games[roomId].gameboard, 0)
    }
    // 設定下個狀態
    this.games[roomId].gameboard.currentStatus = 'SELECTTEAM'
    return this.games[roomId]
  }

  processOfLady(roomId: string, ladyIndex: number): GameType {
    // 更新下一個女神擁有者
    updateLadyIndex(this.games[roomId].players, this.games[roomId].gameboard, ladyIndex)
    // 設定下個狀態
    this.games[roomId].gameboard.currentStatus = 'SELECTTEAM'
    return this.games[roomId];
  }

  processOfSelectTeam(roomId: string, teamMembersIndex: number[]): GameType {
    // 更新執行任務隊員
    updateTeamMembers(this.games[roomId].players, this.games[roomId].gameboard, teamMembersIndex);
    // 設定下個狀態
    this.games[roomId].gameboard.currentStatus = 'VOTE';
    return this.games[roomId];
  }

  processOfVote(roomId: string, result: any): GameType | null {
    // 檢查有無重複投票
    const arr = this.games[roomId].gameboard.currentRound.votes.map(obj => Object.keys(obj)[0]);
    if (arr.includes(Object.keys(result)[0])) {
      return null;
    }
    // 更新投票結果
    this.games[roomId].gameboard.currentRound.votes.push(result);
    this.games[roomId].players.forEach(player => {
      if (player.name === Object.keys(result)[0]) {
        player.isAgree = result[Object.keys(result)[0]];
      }
    });

    // 檢查是否都投完票
    if (checkIsVoteEnd(this.games[roomId].players, this.games[roomId].gameboard)) {
      if (updateCurrentRound(this.games[roomId].players, this.games[roomId].gameboard)) {
        // 允許出任務
        // 下一個階段 VOTEFORMISSION
        this.games[roomId].gameboard.currentStatus = 'VOTEFORMISSION';
      } else {
        // 拒絕出任務
        // NextRound
        const isNextMissionRound = updateToNextRound(this.games[roomId].players, this.games[roomId].gameboard, false);
        if (isNextMissionRound) {
          updateCurrentMission(false, this.games[roomId].gameboard);
          // 檢查遊戲是否結束
          const gameEndMessage = checkGameIsEnd(this.games[roomId].gameboard);
          if (gameEndMessage === '') {
            updateToNextMission(this.games[roomId].gameboard);
            if (this.games[roomId].gameboard.ladyIndex !== null && ['3', '4', '5'].includes(this.games[roomId].gameboard.currentMission.id)) {
              this.games[roomId].gameboard.currentStatus = 'LADY';
            } else {
              this.games[roomId].gameboard.currentStatus = 'SELECTTEAM';
            }
          } else if (gameEndMessage === 'Good') {
            this.games[roomId].gameboard.currentStatus = 'ASSASSIN';
          } else {
            this.games[roomId].gameboard.endOfWin = 'EVIL';
            this.games[roomId].gameboard.currentStatus = 'END';
          }
        } 
        this.games[roomId].gameboard.currentStatus = 'SELECTTEAM';
      }
    }
    return this.games[roomId];
  }

  processOfVoteForMission(roomId: string, data: any): GameType | null {
    // 檢查有無重複投票
    let tempVoteInfo = this.games[roomId].gameboard.currentMission.votes
    const arr = this.games[roomId].gameboard.currentMission.votes.map(obj => Object.keys(obj)[0]);
    if (arr.includes(Object.keys(data)[0])) {
      return null;
    }

    // 獲取執行任務結果
    tempVoteInfo.push(data);
    console.log(tempVoteInfo)
    this.games[roomId].gameboard.currentMission.votes = tempVoteInfo
    // 檢查是否都投完票
    if (checkIsMissionVoteEnd(tempVoteInfo, this.games[roomId].gameboard)) {
      const res = checkWinner(tempVoteInfo, this.games[roomId].gameboard);
      updateCurrentMission(res, this.games[roomId].gameboard);
      // 檢查遊戲是否結束
      const gameEndMessage = checkGameIsEnd(this.games[roomId].gameboard);
      if (gameEndMessage === '') {
        updateToNextMission(this.games[roomId].gameboard);
        updateToNextRound(this.games[roomId].players, this.games[roomId].gameboard, true);
        if (this.games[roomId].gameboard.ladyIndex !== null && ['3', '4', '5'].includes(this.games[roomId].gameboard.currentMission.id)) {
          this.games[roomId].gameboard.currentStatus = 'LADY';
        } else {
          this.games[roomId].gameboard.currentStatus = 'SELECTTEAM';
        }
      } else if (gameEndMessage === 'Good') {
        this.games[roomId].gameboard.currentStatus = 'ASSASSIN';
      } else {
        this.games[roomId].gameboard.endOfWin = 'EVIL';
        this.games[roomId].gameboard.currentStatus = 'END';
      }
    }
    return this.games[roomId];
  }

  processOfAssassin(roomId: string, merlinIndex: number): GameType {
    // 檢查是否為梅林
    if (this.games[roomId].players[merlinIndex].role === 'Merlin') {
      this.games[roomId].gameboard.endOfWin = 'EVIL';
    } else {
      this.games[roomId].gameboard.endOfWin = 'GOOD';
    }
    // 結束遊戲
    this.games[roomId].gameboard.currentStatus = 'END';
    return this.games[roomId];
  }


  /**********************************************************
  * process Bot Action
  */
  public simulateBotAction(roomId: string): any {
    const gameType = this.games[roomId].gameboard.currentStatus
    let resIdx, voteRes, voteMissionRes, merlinIdx, ladyIndex, res
    switch (gameType) {
      case 'SELECTTEAM':
        resIdx = simulateAIRandomSelectPlayersIdx(
          this.games[roomId].players, this.games[roomId].gameboard)
        if (resIdx.length !== 0) {
          return {
            gameType: 'SELECTTEAM',
            roomId: roomId,
            teamMembersIndex: resIdx
          }
        }
        break
      case 'VOTE':
        voteRes = simulateAIRandomVote(
          this.games[roomId].players, this.games[roomId].gameboard)
        res = []
        if (voteRes.length !== 0) {
          for (const v of voteRes) {
            res.push({
              gameType: 'VOTE',
              roomId: roomId,
              data: v
            })
          }
          return res
        }
        break
      case 'VOTEFORMISSION':
        voteMissionRes = simulateAIRandomVoteForMission(
          this.games[roomId].players, this.games[roomId].gameboard)
        res = []
        if (voteMissionRes.length !== 0) {
          for (const obj of voteMissionRes) {
            for (const [key, value] of Object.entries(obj)) {
              res.push({
                gameType: 'VOTEFORMISSION',
                roomId: roomId,
                data: {[key]: value}
              })
            }
          }
          return res
        }
        break
      case 'ASSASSIN':
        merlinIdx = simulateAISelectMerlinIndex(this.games[roomId].players)
        if (merlinIdx !== -1) {
          return {
            gameType: 'ASSASSIN',
            roomId: roomId,
            merlinIndex: merlinIdx
          }
        }
        break
      case 'LADY':
        ladyIndex = simulateAISelectLadyIndex(
          this.games[roomId].players, this.games[roomId].gameboard)
        if (ladyIndex !== -1) {
          return {
            gameType: 'LADY',
            roomId: roomId,
            ladyIndex: ladyIndex
          }
        }
        break
    }
  }

}