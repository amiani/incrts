import uuidv4 from 'uuid/v4'

export function ProtoOrder(want, deadline) {
  this.id = uuidv4()
  this.want = want
  this.units = {}
  this.deadline = deadline
}
