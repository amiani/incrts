import uuidv4 from 'uuid/v4'

export function ProtoTransfer(transferNumber, period, maxRate, rates, reward) {
  this.id = uuidv4()
  this.transferNumber = transferNumber
  this.customer = 'Zagreb Corp.'
  this.period = period
  this.maxRate = maxRate
  this.rates = rates
  this.reward = reward
}
