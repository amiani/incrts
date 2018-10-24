import uuidv4 from 'uuid/v4'

export const colorDict = {
  tanks: 'blue',
}

export function ProtoTank(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.name = 'Light Tank'
  this.type = 'tanks'
  this.isUnit = true
  this.icon = 'tank.png'
  this.health = 10
  this.damage = 1
  this.speed = 1
  this.shields = 0
  this.buildRate = 1
  this.cost = { hardware: 10, }
}
