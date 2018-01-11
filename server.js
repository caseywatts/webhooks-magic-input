const express = require('express')
const socketIO = require('socket.io')
const app = express()
const path = require('path')

// state
let state = {theSharedString: 'hi'}
const PORT = process.env.PORT || 3000
const INDEX = path.join(__dirname, 'index.html')

app.get('/', (req, res) => res.sendFile(INDEX))

const server = require('http').createServer(app)
server.listen(PORT)
console.log(`Example app listening on port ${PORT}!`)

const io = socketIO(server)

io.on('connection', (socket) => {
  console.log('Client connected')
  socket.on('close', () => console.log('Client disconnected'))

  // send out the initial state
  socket.emit('update-shared-string', state.theSharedString, () => { console.log('error sending state whoopsies') })

  socket.on('update-shared-string', (data) => {
    console.log('received ' + data)

    console.log('sending ' + data)
    io.emit('update-shared-string', data)
  })
})
