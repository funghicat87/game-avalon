import MerlinImage from '@/assets/role/card-Merlin.png'
import PercivalImage from '@/assets/role/card-Percival.png'
import LoyalServantImageA from '@/assets/role/card-LoyalServantOfArthurA.png'
import LoyalServantImageB from '@/assets/role/card-LoyalServantOfArthurB.png'
import LoyalServantImageC from '@/assets/role/card-LoyalServantOfArthurC.png'
import LoyalServantImageD from '@/assets/role/card-LoyalServantOfArthurD.png'
import LoyalServantImageE from '@/assets/role/card-LoyalServantOfArthurE.png'
import MerlinFlatImage from '@/assets/role/card-flat-Merlin.png'
import PercivalFlatImage from '@/assets/role/card-flat-Percival.png'
import LoyalServantFlatImageA from '@/assets/role/card-flat-LoyalServantOfArthurA.png'
import LoyalServantFlatImageB from '@/assets/role/card-flat-LoyalServantOfArthurB.png'
import LoyalServantFlatImageC from '@/assets/role/card-flat-LoyalServantOfArthurC.png'
import LoyalServantFlatImageD from '@/assets/role/card-flat-LoyalServantOfArthurD.png'
import LoyalServantFlatImageE from '@/assets/role/card-flat-LoyalServantOfArthurE.png'

import AssassinImage from '@/assets/role/card-Assassin.png'
import MordredImage from '@/assets/role/card-Morderd.png'
import MorganaImage from '@/assets/role/card-Morgana.png'
import OberonImage from '@/assets/role/card-Oberon.png'
import MinionImageA from '@/assets/role/card-MinionOfMordredA.png'
import MinionImageB from '@/assets/role/card-MinionOfMordredB.png'
import MinionImageC from '@/assets/role/card-MinionOfMordredC.png'
import AssassinFlatImage from '@/assets/role/card-flat-Assassin.png'
import MordredFlatImage from '@/assets/role/card-flat-Morderd.png'
import MorganaFlatImage from '@/assets/role/card-flat-Morgana.png'
import OberonFlatImage from '@/assets/role/card-flat-Oberon.png'
import MinionFlatImageA from '@/assets/role/card-flat-MinionOfMordredA.png'
import MinionFlatImageB from '@/assets/role/card-flat-MinionOfMordredB.png'
import MinionFlatImageC from '@/assets/role/card-flat-MinionOfMordredC.png'

import HalfMerlinMorgana from '@/assets/role/card-flat-Half.png'
import Red from '@/assets/role/card-flat-Red.png'
import Blue from '@/assets/role/card-flat-Blue.png'

import cardBack from '@/assets/role/card-back.png'
import cardBackFlat from '@/assets/role/card-flat-Back.png'

export const RoleImageMappingTable = {
  Merlin: MerlinImage,
  Percival: PercivalImage,
  LoyalServant: LoyalServantImageA,
  LoyalServantB: LoyalServantImageB,
  LoyalServantC: LoyalServantImageC,
  LoyalServantD: LoyalServantImageD,
  LoyalServantE: LoyalServantImageE,
  Morgana: MorganaImage,
  Assassin: AssassinImage,
  Mordred: MordredImage,
  Oberon: OberonImage,
  MinionA: MinionImageA,
  MinionB: MinionImageB,
  MinionC: MinionImageC,
  Back: cardBack
}

export const FlatRoleImageMappingTable = {
  Merlin: MerlinFlatImage,
  Percival: PercivalFlatImage,
  LoyalServant: LoyalServantFlatImageA,
  LoyalServantB: LoyalServantFlatImageB,
  LoyalServantC: LoyalServantFlatImageC,
  LoyalServantD: LoyalServantFlatImageD,
  LoyalServantE: LoyalServantFlatImageE,
  Morgana: MorganaFlatImage,
  Assassin: AssassinFlatImage,
  Mordred: MordredFlatImage,
  Oberon: OberonFlatImage,
  MinionA: MinionFlatImageA,
  MinionB: MinionFlatImageB,
  MinionC: MinionFlatImageC,
  Back: cardBackFlat,
  Half: HalfMerlinMorgana,
  Red: Red,
  Blue: Blue
}

export const getDisplayRole = (player, myRole) => {
  // 如果沒有角色資訊，返回背面
  if (!myRole || !player.role) return FlatRoleImageMappingTable['Back']

  // 根據使用者角色來決定應該顯示什麼角色卡
  // 如果是梅林，顯示所有壞人角色
  if (myRole === 'Merlin' && ['Assassin', 'Oberon', 'Minion', 'Morgana'].includes(player.role)) {
    return FlatRoleImageMappingTable['Red']
  }
  // 如果是派西維爾，顯示不確定的角色
  if (myRole === 'Percival' && ['Merlin', 'Morgana'].includes(player.role)) {
    return FlatRoleImageMappingTable['Half']
  }

  if (myRole === 'Mordred' && ['Morgana', 'Assassin', 'Minion'].includes(player.role)) {
    return FlatRoleImageMappingTable['Red']
  }

  if (myRole === 'Minion' && ['Morgana', 'Assassin', 'Mordred'].includes(player.role)) {
    return FlatRoleImageMappingTable['Red']
  }

  if (myRole === 'Morgana' && ['Minion', 'Assassin', 'Mordred'].includes(player.role)) {
    return FlatRoleImageMappingTable['Red']
  }

  if (myRole === 'Assassin' && ['Minion', 'Morgana', 'Mordred'].includes(player.role)) {
    return FlatRoleImageMappingTable['Red']
  }

  // 其他情況返回背面
  return FlatRoleImageMappingTable['Back']
}

export const getRoleSide = (player) => {
  // 如果沒有角色資訊，返回背面
  if (!player.role) return FlatRoleImageMappingTable['Back']

  if (['Mordred', 'Morgana', 'Assassin', 'Minion'].includes(player.role)) {
    return FlatRoleImageMappingTable['Red']
  }
  // 其他情況
  return FlatRoleImageMappingTable['Blue']
}

export const getDefaultRoleImg = (number) => {
  if (number === 5) {
    return ['Merlin', 'Percival', 'LoyalServant', 'Morgana', 'Assassin']
  } else if (number === 6) {
    return ['Merlin', 'Percival', 'LoyalServant', 'LoyalServantB', 'Morgana', 'Assassin']
  } else if (number === 7) {
    return ['Merlin', 'Percival', 'LoyalServant', 'LoyalServantB', 'Morgana', 'Assassin', 'Mordred']
  } else if (number === 8) {
    return ['Merlin', 'Percival', 'LoyalServant', 'LoyalServantB', 'LoyalServantC', 'Morgana', 'Assassin', 'MinionA']
  } else if (number === 9) {
    return [
      'Merlin',
      'Percival',
      'LoyalServant',
      'LoyalServantB',
      'LoyalServantC',
      'LoyalServantD',
      'Morgana',
      'Assassin',
      'Mordred'
    ]
  } else if (number === 10) {
    return [
      'Merlin',
      'Percival',
      'LoyalServant',
      'LoyalServantB',
      'LoyalServantC',
      'LoyalServantD',
      'Morgana',
      'Assassin',
      'Mordred',
      'Oberon'
    ]
  }
}

export const isBlueSide = (role) => {
  return [
    'Merlin',
    'Percival',
    'LoyalServant',
    'LoyalServantB',
    'LoyalServantC',
    'LoyalServantD',
    'LoyalServantE'
  ].includes(role)
}
