import { io, Socket as SocketType } from 'socket.io-client'
import { errorLog, successLog } from '../Utils/ReactUtils'
import { setSocketState } from '../Reducers/settingSlice'
import store from '../Store'

export class Socket {
  private static instance: Socket
  private socket: SocketType
  private socketHost: string

  public constructor() {
    if (Socket.instance) {
      throw new Error('Use `const socket = Socket.getInstance()` instead')
    }

    this.socketHost =
      process.env.REACT_APP_ENV === 'development'
        ? process.env.REACT_APP_API_DEV!
        : process.env.REACT_APP_API_PROD!
    this.socket = io(this.socketHost)
  }

  public disconnect(): void {
    this.socket.disconnect()
  }

  public init(): void {
    const {
      settings: { webId, connected },
    } = store.getState()

    if (connected) return

    const handleConnect = () => {
      successLog(`[WebSockets] Connected on ${this.socket.id}`)
      this.socket.emit('join', { webId })
      store.dispatch(setSocketState({ connected: true }))
    }

    const handleDisconnect = (err: Error | string) => {
      errorLog(`[WebSockets] Disconnection Reason: ${err}`)
      store.dispatch(setSocketState({ connected: false }))
    }

    this.socket.off('connect', handleConnect).on('connect', handleConnect)
    this.socket.off('disconnect', handleDisconnect).on('disconnect', handleDisconnect)
    this.socket
      .off('connect_error', handleDisconnect)
      .on('connect_error', handleDisconnect)
    this.socket
      .off('reconnect_error', handleDisconnect)
      .on('reconnect_error', handleDisconnect)
  }

  public static getInstance(): Socket {
    Socket.instance = Socket.instance || new Socket()

    return Socket.instance
  }
}
