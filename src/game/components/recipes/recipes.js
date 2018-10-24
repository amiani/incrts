import uuidv4 from 'uuid/v4'

export const hardware = {
  id: uuidv4(),
  name: 'Hardware',
  icon: 'hardware.png',
  input: { fabric: 2 },
  output: { hardware: 1 }
}

export const synthetics = {
  id: uuidv4(),
  input: { fabric: 2 },
  output: { synthetics: 1 }
}

export const device = {
  id: uuidv4(),
  name: 'Device',
  icon: 'device.png',
  input: { hardware: 1, fabric: 1 },
  output: { devices: 1 }
}
