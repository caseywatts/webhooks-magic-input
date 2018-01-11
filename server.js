const express = require('express')
const ws = require('ws')
const SocketServer = ws.Server
const app = express()

// state
let theSharedString = "hi";
const PORT = process.env.PORT || 3000;

const server = app.get('/', (req, res) => res.send(`
Magic Input
<input id="theSharedString" value="${theSharedString}">
<script>
var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);
var el = document.getElementById('theSharedString');

ws.onmessage = function (event) {
  console.log("received: " + event.data);
  el.value = event.data;
};

el.oninput = function (event) {
  console.log("input: " + el.value);
  ws.send(el.value);
}
</script>
  `))
.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', (data) => {
    console.log('received ' + data);
    theSharedString = data;
    wss.clients.forEach((client) => {
      console.log('sending ' + theSharedString)
      client.send(theSharedString);
    });
  })
});
