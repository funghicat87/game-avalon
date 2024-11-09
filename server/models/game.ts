export interface Mission {
  id: string;
  teamSize: number | null;
  failureCondition: number;
  votes: { [key: string]: number }[];
  results: boolean | null;
}

export interface Round {
  id: number;
  leaderIndex: number | null;
  teamMembersIndex: number[];
  votes: { [key: string]: number }[];
  isApproved: boolean | null;
}

export interface History {
  [key: string]: {
    mission: Mission;
    rounds: Round[];
  };
}

export interface GameStateModel {
  endOfWin: "GOOD" | "EVIL" | "";
  ladyIndex: number | null;
  ladyIndexHistory: number[];
  currentStatus: "GAMESTART" | "END" | "LADY" | "SELECTTEAM" | "VOTE" | "VOTEFORMISSION" | "ASSASSIN" | "";
  currentMission: Mission;
  currentRound: Round;
  history: History;
}

export function initGameStateModel(): GameStateModel {
  return {
    endOfWin: '',
    ladyIndex: null,
    ladyIndexHistory: [],
    currentStatus: "",
    currentMission: {
      id: '1',
      teamSize: null,
      failureCondition: -1,
      votes: [],
      results: false
    },
    currentRound: {
      id: 1,
      leaderIndex: null,
      teamMembersIndex: [],
      votes: [],
      isApproved: null
    },
    history: {}
  };
}