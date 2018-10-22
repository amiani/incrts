import { TICKRATE } from './constants'

const resources = {
  credits: 3200,
  creditIncome: 0,
  fabric: 3200,
  fabricIncome: 0,
  hardware: 1000,
  hardwareIncome: 0,
  devices: 0,
  synthetics: 0,
  energy: 10000,
  energyIncome: 0,
  drain: 5,
  productivity: 1,
}

//buildings
const factories = {}
const assemblers = {}
const generators = {}

const buildQueues = {}

const hangars = {}
const unitQueues = { tanks: [], }

const orders = {}

const update = () => {
  updateResources()
  postMessage({ name: 'update', message: resources })
}

onmessage = e => {
  console.log('recived message')
}

const updateResources = () => {
  let nextEnergy = resources.energy + resources.energyIncome - resources.drain
  resources.energy = nextEnergy > 0 ? nextEnergy : 0
  resources.productivity = resources.energy > resources.drain || !resources.drain
    ? 1
    : resources.energyIncome / resources.drain
}

setInterval(update, TICKRATE);
