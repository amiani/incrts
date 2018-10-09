import uuidv4 from 'uuid/v4';

export default function ProtoHangar(ownerId, isSource) {
  this.id = uuidv4();
  this.ownerId = ownerId;
  this.capacity = 10;
  this.isSource = isSource;
  this.demand = { tanks: 0 };
  this.units = { tanks: [], };
}
