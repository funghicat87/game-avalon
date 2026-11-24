/** 卡圖 key（例如 LoyalServantB、MinionA）對應到遊戲中的角色 */
export const imageKeyToRole = (imageKey) => {
  if (imageKey.startsWith('LoyalServant')) return 'LoyalServant'
  if (imageKey.startsWith('Minion')) return 'Minion'
  return imageKey
}

/** 由卡圖 key 列表產生送給伺服器的 { 卡圖key: 角色 } */
export const buildRoleImgPair = (imageKeys) => Object.fromEntries(imageKeys.map((key) => [key, imageKeyToRole(key)]))

export const EVIL_ROLES = ['Morgana', 'Assassin', 'Mordred', 'Oberon', 'Minion']

export const isEvilRole = (role) => EVIL_ROLES.includes(role)
