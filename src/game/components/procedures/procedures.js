import uuidv4 from 'uuid/v4'

export const hardware = {
  id: uuidv4(),
  sub: 'Hardware',
  icon: 'hardware.png',
  buildRate: 1,
  cost: { fabric: 2 },
  output: { hardware: 1 }
}

export const synthetics = {
  id: uuidv4(),
  buildRate: 1,
  cost: { fabric: 2 },
  output: { synthetics: 1 }
}

export const device = {
  id: uuidv4(),
  name: 'Device',
  icon: 'device.png',
  buildRate: 1,
  cost: { hardware: 1, fabric: 1 },
  output: { devices: 1 }
}
