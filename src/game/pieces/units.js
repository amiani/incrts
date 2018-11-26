import uuidv4 from 'uuid/v4'

export const colorDict = {
  tanks: 'blue',
}

export const tank = {
  name: 'Light Tank',
  type: 'tanks',
  isUnit: true,
  icon: 'tank.png',
  health: 10,
  damage: 1,
  speed: 1,
  shields: 0,
  buildRate: 1,
  cost: { hardware: 10, },
}

export const units = {
  tank
}
