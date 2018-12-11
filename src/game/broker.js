// eslint-disable-next-line
import gameWorker from 'worker-loader!./game.worker'

const worker = new gameWorker()
const listeners = {}

const deliver = (sub, body) => {
  const listenerList = listeners[sub]
  for (let i = 0, n = listenerList.length; i !== n; i++) {
    listenerList[i].onmessage(body)
  }
}

worker.onmessage = e => deliver(e.data.sub, e.data.body)

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
  postLocal: (sub, body) => deliver(sub, body)
}

export default broker
