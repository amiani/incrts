import uuidv4 from 'uuid/v4';

export function tankData() {
  this.id = uuidv4();
  this.icon = 'tank.png';
  this.health = 10;
  this.damage = 1;
  this.speed = 1;
  this.shields = 0;
  this.cost = { hardware: 10, };
};
