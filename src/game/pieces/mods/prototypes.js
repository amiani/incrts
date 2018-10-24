import uuidv4 from 'uuid/v4'
import { hardware } from '../../components/recipes'

export function ProtoDeviceMod() {
  this.id = uuidv4()
  this.type = 'mods'
  this.name = 'Device Mod'
  this.icon = 'devicemod.png'
  this.version = 1
  this.cost = { fabric: 50 }
  this.drain = 0
  this.status = true
  this.control = 'DeviceModControl'
  this.recipes = []
}
