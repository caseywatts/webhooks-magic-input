const express = require('express')
const ws = require('ws')
const SocketServer = ws.Server
const app = express()

// state
let theSharedString = "hi";

const server = app.get('/', (req, res) => res.send(`
Magic Input
<input id="theSharedString" value="hi">
<script>
var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);
var el = document.getElementById('theSharedString');

ws.onmessage = function (event) {
  // console.log(event.data);
  el.value = event.data;
};

el.oninput = function (event) {
  // console.log(el.value);
  ws.send(el.value);
}
</script>
  `))
.listen(3000, () => console.log('Example app listening on port 3000!'))

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  // console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', (data) => {
    // console.log(data);
    theSharedString = data;
    wss.clients.forEach((client) => {
      client.send(theSharedString);
    });
  })
});
