// eslint-disable-next-line
import gameWorker from 'worker-loader!./game.worker'

const worker = new gameWorker()
const listeners = {}

worker.onmessage = e => {
  const listenerList = listeners[e.data.sub]
  for (let i = 0, n = listenerList.length; i !== n; i++) {
    listenerList[i].onmessage(e.data.body)
  }
}

const broker = {
  addListener: (sub, id, onmessage) => {
    !listeners[sub] && (listeners[sub] = [])
    listeners[sub].push({ id, onmessage })
  },
  
  removeListener: (sub, id) => {
    const i = listeners.findIndex(l => l.id === id)
    delete listeners[sub][i]
  },

  post: message => worker.postMessage(message),
}

export default broker
