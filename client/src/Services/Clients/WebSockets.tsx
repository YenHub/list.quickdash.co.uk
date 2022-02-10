import { io } from 'socket.io-client'

const socketHost =
  process.env.REACT_APP_ENV === 'development'
    ? process.env.REACT_APP_SOCKET_HOST_DEV
    : process.env.REACT_APP_SOCKET_HOST_PROD

const socket = io(`${socketHost}`)

export const socketInit = () => {
  socket.on('connect', () => {
    console.log(`Connected on ${socket.id}`)
  })
}
