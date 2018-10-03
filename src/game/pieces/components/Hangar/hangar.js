import uuidv4 from 'uuid/v4';

export default function hangarData(buildingId, isSource) {
  this.id = uuidv4();
  this.buildingId = buildingId;
  this.capacity = 10;
  this.isSource = true;
  this.demand = {};
  this.units = [];
}
