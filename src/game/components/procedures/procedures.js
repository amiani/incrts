import uuidv4 from 'uuid/v4'

export default {
  hardware: {
    name: 'Hardware',
    icon: 'hardware.png',
    cost: { fabric: 2 },
    output: { hardware: 1 },
    color: 'black'
  },

  electronics: {
    name: 'Electronics',
    cost: { fabric: 2 },
    output: { electronics: 1 },
    color: 'yellow',
  },

  device: {
    name: 'Device',
    icon: 'device.png',
    cost: { hardware: 1, fabric: 1 },
    output: { devices: 1 },
    color: 'blue',
  },
}
