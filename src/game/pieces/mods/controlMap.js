import DeviceModControl from './DeviceMod'
import broker from '../../broker'

const stringToCompMap = {
  DeviceModControl,
}

const controlMap = {}

broker.addListener('controlMap', 'controlMap', body => {
  controlMap[body.id] = stringToCompMap[body.controlName]
})

export default controlMap
