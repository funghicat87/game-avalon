import { assignRoles, checkGameIsEnd, checkIsMissionVoteEnd, checkIsVoteEnd, checkWinner, chooseLady, chooseLeader, initGameBoard, isEvil, simulateAIRandomSelectPlayersIdx, simulateAIRandomVote, simulateAIRandomVoteForMission, simulateAISelectLadyIndex, simulateAISelectMerlinIndex, updateCurrentMission, updateCurrentRound, updateLadyIndex, updateTeamMembers, updateToNextMission, updateToNextRound } from "../helpers/game.js";
import { GameStateModel, initGameStateModel } from "../models/game.js";
import { PlayerModel } from "../models/player.js";

export interface GameType {
  gameboard: GameStateModel;
  players: PlayerModel[];
}

export interface GameAction {
  gameType: string;
  roomId: string;
  teamMembersIndex?: number[];
  ladyIndex?: number;
  merlinIndex?: number;
  data?: { [name: string]: number };
}

const isIndex = (v: unknown, length: number): v is number =>
  Number.isInteger(v) && (v as number) >= 0 && (v as number) < length

export class GameManager {
  static instance: GameManager
  private games: { [roomId: string]: GameType } = {}

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }

  getGame(roomId: string): GameType | undefined {
    return this.games[roomId]
  }

  deleteGame(roomId: string) {
    delete this.games[roomId]
  }

  /** 遊戲進行中（已開始且尚未結束） */
  isPlaying(roomId: string): boolean {
    const game = this.games[roomId]
    return !!game && game.gameboard.currentStatus !== 'END'
  }

  /**
   * 檢查真人玩家送來的動作是否合法。
   * 回傳錯誤訊息；合法時回傳 null。
   */
  validateAction(roomId: string, actor: PlayerModel, action: GameAction): string | null {
    const game = this.games[roomId]
    if (!game) return '遊戲尚未開始'
    const { gameboard, players } = game
    if (gameboard.currentStatus !== action.gameType) return '現在不是這個階段'
    const actorIdx = players.findIndex((p) => p.id === actor.id)
    if (actorIdx === -1) return '你不在這場遊戲中'
    const value = action.data ? Object.values(action.data)[0] : undefined

    switch (action.gameType) {
      case 'SELECTTEAM': {
        if (actorIdx !== gameboard.currentRound.leaderIndex) return '只有隊長可以選擇隊員'
        const idx = action.teamMembersIndex
        if (
          !Array.isArray(idx) ||
          idx.length !== gameboard.currentMission.teamSize ||
          new Set(idx).size !== idx.length ||
          !idx.every((i) => isIndex(i, players.length))
        ) return '請選擇正確隊員數量'
        return null
      }
      case 'LADY':
        if (actorIdx !== gameboard.ladyIndex) return '只有湖中女神持有者可以選擇'
        if (!isIndex(action.ladyIndex, players.length)) return '選擇正確數量'
        if (gameboard.ladyIndexHistory.includes(action.ladyIndex)) return '選過了換一個'
        return null
      case 'VOTE':
        if (value !== 0 && value !== 1) return '投票內容錯誤'
        return null
      case 'VOTEFORMISSION':
        if (!gameboard.currentRound.teamMembersIndex.includes(actorIdx)) return '你不是出任務的隊員'
        if (value !== 0 && value !== 1) return '投票內容錯誤'
        if (value === 0 && !isEvil(actor.role)) return '好人只能投任務成功'
        return null
      case 'ASSASSIN':
        if (actor.role !== 'Assassin') return '只有刺客可以刺殺'
        if (!isIndex(action.merlinIndex, players.length)) return '選擇正確數量'
        return null
      default:
        return '未知的動作'
    }
  }

  processOfGameStart(roomId: string, players: PlayerModel[], enableLady: boolean, roleImgPair: {[key: string]: string}): GameType {
    // 初始化 games（players 與房間共用同一個陣列，房間畫面才會同步）
    this.games[roomId] = {
      gameboard: initGameStateModel(),
      players
    }
    const { gameboard } = this.games[roomId]
    // 初始化玩家角色
    assignRoles(players, roleImgPair)
    // 初始化遊戲板
    initGameBoard(gameboard, players)
    // 隨機選擇第一位隊長
    chooseLeader(gameboard, players)
    // 初始化湖中女神
    if (enableLady) {
      updateLadyIndex(players, gameboard, chooseLady(gameboard, players))
    }
    // 設定下個狀態
    gameboard.currentStatus = 'SELECTTEAM'
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

  /** 任務結束（成功 / 失敗 / 連續五次否決）後決定下一個階段 */
  private advanceAfterMission(roomId: string) {
    const { gameboard } = this.games[roomId]
    const gameEndMessage = checkGameIsEnd(gameboard);
    if (gameEndMessage === 'Good') {
      gameboard.currentStatus = 'ASSASSIN';
    } else if (gameEndMessage === 'Evil') {
      gameboard.endOfWin = 'EVIL';
      gameboard.currentStatus = 'END';
    } else {
      updateToNextMission(gameboard);
      if (gameboard.ladyIndex !== null && ['3', '4', '5'].includes(gameboard.currentMission.id)) {
        gameboard.currentStatus = 'LADY';
      } else {
        gameboard.currentStatus = 'SELECTTEAM';
      }
    }
  }

  /** 回傳 null 代表重複投票、狀態沒有改變 */
  processOfVote(roomId: string, result: { [name: string]: number }): GameType | null {
    const { gameboard, players } = this.games[roomId]
    const name = Object.keys(result)[0]
    // 檢查有無重複投票
    if (gameboard.currentRound.votes.some((obj) => Object.keys(obj)[0] === name)) {
      return null;
    }
    // 更新投票結果
    gameboard.currentRound.votes.push(result);
    const player = players.find((p) => p.name === name)
    if (player) player.isAgree = result[name]

    // 檢查是否都投完票
    if (checkIsVoteEnd(players, gameboard)) {
      if (updateCurrentRound(players, gameboard)) {
        // 允許出任務
        gameboard.currentStatus = 'VOTEFORMISSION';
      } else {
        // 拒絕出任務 → 換下一位隊長；連續五次否決則本次任務判定失敗
        const isNextMissionRound = updateToNextRound(players, gameboard, false);
        if (isNextMissionRound) {
          updateCurrentMission(false, gameboard);
          this.advanceAfterMission(roomId)
        } else {
          gameboard.currentStatus = 'SELECTTEAM';
        }
      }
    }
    return this.games[roomId];
  }

  /** 回傳 null 代表重複投票、狀態沒有改變 */
  processOfVoteForMission(roomId: string, data: { [name: string]: number }): GameType | null {
    const { gameboard, players } = this.games[roomId]
    const votes = gameboard.currentMission.votes
    // 檢查有無重複投票
    if (votes.some((obj) => Object.keys(obj)[0] === Object.keys(data)[0])) {
      return null;
    }
    votes.push(data);
    // 檢查是否都投完票
    if (checkIsMissionVoteEnd(votes, gameboard)) {
      updateCurrentMission(checkWinner(votes, gameboard), gameboard);
      updateToNextRound(players, gameboard, true);
      this.advanceAfterMission(roomId)
    }
    return this.games[roomId];
  }

  processOfAssassin(roomId: string, merlinIndex: number): GameType {
    const { gameboard, players } = this.games[roomId]
    // 檢查是否為梅林
    gameboard.endOfWin = players[merlinIndex].role === 'Merlin' ? 'EVIL' : 'GOOD';
    // 結束遊戲
    gameboard.currentStatus = 'END';
    return this.games[roomId];
  }


  /**********************************************************
  * process Bot Action
  * 回傳電腦玩家接下來要做的動作；沒有動作時回傳 []
  */
  public simulateBotAction(roomId: string): GameAction[] {
    const game = this.games[roomId]
    if (!game) return []
    const { gameboard, players } = game
    switch (gameboard.currentStatus) {
      case 'SELECTTEAM': {
        const teamMembersIndex = simulateAIRandomSelectPlayersIdx(players, gameboard)
        return teamMembersIndex.length ? [{ gameType: 'SELECTTEAM', roomId, teamMembersIndex }] : []
      }
      case 'VOTE':
        return simulateAIRandomVote(players, gameboard).map((data) => ({ gameType: 'VOTE', roomId, data }))
      case 'VOTEFORMISSION':
        return simulateAIRandomVoteForMission(players, gameboard).map((data) => ({ gameType: 'VOTEFORMISSION', roomId, data }))
      case 'ASSASSIN': {
        const merlinIndex = simulateAISelectMerlinIndex(players)
        return merlinIndex !== -1 ? [{ gameType: 'ASSASSIN', roomId, merlinIndex }] : []
      }
      case 'LADY': {
        const ladyIndex = simulateAISelectLadyIndex(players, gameboard)
        return ladyIndex !== -1 ? [{ gameType: 'LADY', roomId, ladyIndex }] : []
      }
      default:
        return []
    }
  }
}
