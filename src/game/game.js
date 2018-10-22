import gameWorker from './game.worker'

const worker = new gameWorker()
const listeners = { 
  update: [],
}

worker.onmessage = e => {
  const listenerList = listeners[e.data.name]
  for (let i = 0, n = listenerList.length; i != n; i++) {
    listenerList[i].onmessage(e.data.message)
  }
}

const game = {
  addListener: (name, listener) => {
    listeners[name].push(listener)
  },
  
  removeListener: (name, id) => {
    const i = listeners.findIndex(l => l.id === id)
    delete listeners[name][i]
  }
}

export default game
