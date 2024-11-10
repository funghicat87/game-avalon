export interface PlayerModel {
  name: string,
  role: string,
  roleImg: string,
  isHuman: boolean,
  isOwner: boolean,
  selected: boolean,
  hasLady: boolean,  // 現在擁有湖中女神
  hadLady: boolean,  // 曾經擁有過湖中女神
  hadLadyIdx: number,  // 曾經擁有過湖中女神的index
  isLeader: boolean,
  isTeamMember: boolean,
  isAgree: number
}

export function initPlayerModel(): PlayerModel {
  return {
    name: "",
    role: "",
    roleImg: "",
    isHuman: false,
    isOwner: false,
    selected: false,
    hasLady: false,
    hadLady: false,
    hadLadyIdx: -1,
    isLeader: false,
    isTeamMember: false,
    isAgree: -1
  }
}
