const express = require('express')
const ws = require('ws')
const SocketServer = ws.Server
const app = express()
const path = require('path')

// state
let state = {theSharedString: 'hi'}
const PORT = process.env.PORT || 3000
const INDEX = path.join(__dirname, 'index.html')

const server = app.get('/', (req, res) => res.sendFile(INDEX))
.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const wss = new SocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('close', () => console.log('Client disconnected'))

  sendState(ws)

  ws.on('message', (data) => {
    console.log('received ' + data)
    state.theSharedString = data
    wss.clients.forEach((client) => {
      console.log('sending ' + JSON.stringify(state))
      sendState(client)
    })
  })
})

const sendState = (destination) => {
  destination.send(JSON.stringify(state), () => { console.log('error sending state whoopsies') })
}
