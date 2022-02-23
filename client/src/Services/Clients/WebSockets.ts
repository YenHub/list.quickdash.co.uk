import { io, Socket } from 'socket.io-client'
import { errorLog, showGatedFeatures, successLog } from '../Utils/ReactUtils'
import { setSocketState } from '../Reducers/settingSlice'
import store from '../Store'

const socketHost =
  process.env.REACT_APP_ENV === 'development'
    ? process.env.REACT_APP_API_DEV
    : process.env.REACT_APP_API_PROD

const handleDisconnect = (err: Error | string, socket: Socket) => {
  const {
    settings: { connected },
  } = store.getState()
  errorLog(`[WebSockets] Failed to connect: ${err}`)
  connected && store.dispatch(setSocketState({ connected: false }))
}

const handleConnect = (socket: Socket) => {
  const {
    settings: { webId },
  } = store.getState()
  successLog(`[WebSockets] Connected on ${socket.id}`)
  socket.emit('join', { webId })
  store.dispatch(setSocketState({ connected: true }))
}

export const socketInit = () => {
  const {
    settings: { version },
  } = store.getState()
  // IGDev: Will need to remove this dev gate
  if (!version || !showGatedFeatures) return

  const socket: Socket = io(`${socketHost}`)

  socket
    .off('connect', () => {
      handleConnect(socket)
    })
    .on('connect', () => {
      handleConnect(socket)
    })
  socket
    .off('connect_error', err => {
      handleDisconnect(err, socket)
    })
    .on('connect_error', err => {
      handleDisconnect(err, socket)
    })
  socket
    .off('disconnect', err => {
      handleDisconnect(err, socket)
    })
    .on('disconnect', err => {
      handleDisconnect(err, socket)
    })
  socket
    .off('reconnect_error', err => {
      handleDisconnect(err, socket)
    })
    .on('reconnect_error', err => {
      handleDisconnect(err, socket)
    })
}
