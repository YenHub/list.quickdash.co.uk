import { io, Socket } from 'socket.io-client'

import { useAppStore } from '../Store'
import { errorLog, showGatedFeatures, successLog } from '../Utils/ReactUtils'

const socketHost = (
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_DEV
    : import.meta.env.VITE_API_PROD
) as string

const handleDisconnect = (err: Error | string, socket: Socket) => {
  const {
    settings: { connected },
  } = useAppStore.getState()
  errorLog(`[WebSockets] Failed to connect: ${err}`)
  if (connected) {
    socket.disconnect()
    useAppStore.getState().setSocketState(false)
  }
}

const handleConnect = (socket: Socket) => {
  const {
    settings: { webId },
  } = useAppStore.getState()
  successLog(`[WebSockets] Connected on ${socket.id}`)
  socket.emit('join', { webId })
  useAppStore.getState().setSocketState(true)
}

export const socketInit = () => {
  const {
    settings: { version },
  } = useAppStore.getState()
  // IGDev: Will need to remove this dev gate
  if (!version || !showGatedFeatures) return

  const socket: Socket = io(`${socketHost}`)

  socket.offAny()
  socket.offAnyOutgoing()

  socket.on('connect', () => handleConnect(socket))
  socket.on('connect_error', err => handleDisconnect(err, socket))
  socket.on('disconnect', err => handleDisconnect(err, socket))
  socket.on('reconnect_error', err => handleDisconnect(err as Error, socket))
}
