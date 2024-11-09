export const getRoleImgPair = (number) => {
  let rolesImgPair
  if (number === '5') {
    rolesImgPair = {
      Merlin: 'Merlin',
      Percival: 'Percival',
      LoyalServant: 'LoyalServant',
      Morgana: 'Morgana',
      Assassin: 'Assassin'
    }
  } else if (number === '6') {
    rolesImgPair = {
      Merlin: 'Merlin',
      Percival: 'Percival',
      LoyalServant: 'LoyalServant',
      LoyalServantB: 'LoyalServant',
      Morgana: 'Morgana',
      Assassin: 'Assassin'
    }
  } else if (number === '7') {
    rolesImgPair = {
      Merlin: 'Merlin',
      Percival: 'Percival',
      LoyalServant: 'LoyalServant',
      LoyalServantB: 'LoyalServant',
      Morgana: 'Morgana',
      Assassin: 'Assassin',
      Mordred: 'Oberon'
    }
  } else if (number === '8') {
    rolesImgPair = {
      Merlin: 'Merlin',
      Percival: 'Percival',
      LoyalServant: 'LoyalServant',
      LoyalServantB: 'LoyalServant',
      LoyalServantC: 'LoyalServant',
      Morgana: 'Morgana',
      Assassin: 'Assassin',
      MinionA: 'Minion'
    }
  } else if (number === '9') {
    rolesImgPair = {
      Merlin: 'Merlin',
      Percival: 'Percival',
      LoyalServant: 'LoyalServant',
      LoyalServantB: 'LoyalServant',
      LoyalServantC: 'LoyalServant',
      LoyalServantD: 'LoyalServant',
      Morgana: 'Morgana',
      Assassin: 'Assassin',
      Mordred: 'Mordred'
    }
  } else if (number === '10') {
    rolesImgPair = {
      Merlin: 'Merlin',
      Percival: 'Percival',
      LoyalServant: 'LoyalServant',
      LoyalServantB: 'LoyalServant',
      LoyalServantC: 'LoyalServant',
      LoyalServantD: 'LoyalServant',
      Morgana: 'Morgana',
      Assassin: 'Assassin',
      Mordred: 'Mordred',
      Oberon: 'Oberon'
    }
  }
  return rolesImgPair
}
