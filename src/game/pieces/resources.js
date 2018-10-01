import uuidv4 from 'uuid/v4';

export function hardwareData() {
  this.id = uuidv4();
  this.name = 'hardware';
  this.cost = { fabric: 5 };
  this.output = { hardware: 2 };
  this.icon = 'hardware.png';
};
