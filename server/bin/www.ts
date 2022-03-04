#!/usr/bin/env node

/**
 * Module dependencies.
 */
import http from 'http'
import debug from 'debug'
import { Server, Socket } from 'socket.io'
import { Console } from 'winston/lib/winston/transports'
import { app } from '../app.js'
import { getListFromDB } from '../controllers/listController.js'

const origin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://list.quickdash.co.uk'

debug('api:server')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '9000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin,
  },
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/* WEBSOCKETS */
io.on('connection', (socket: Socket) => {
  console.log(`Someone connected on ${socket.id}`)
  // A room is synonymous with a list
  // This allows us to fan out messages using a list.webId 😎
  socket.on('join', (webId: string) => {
    console.log(`Connected ${socket.id} with room ${webId}`)
    socket.join(webId)
  })
  // IGDev: Need a CRUD here
  // But we probably want to handle it via rooms
  socket.on('get-list', (webId: string) => {
    getListFromDB(webId)
      .then(list => {
        if (!list) return console.log('Return list deleted')

        // We still want to return the list to allow people to restore it
        // Use the response code to indicate this being the case
        if (list.deleted) return console.log('list soft deleted')

        return list
      })
      .catch(err => {
        console.log('Handle the DB Error', err)
      })
  })
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any) {
  if (error.syscall !== 'listen') throw error

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')

      return process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')

      return process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  debug('Listening on ' + bind)
}
