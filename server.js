const express = require('express')
const ws = require('ws')
const SocketServer = ws.Server
const app = express()

const server = app.get('/', (req, res) => res.send(`
heya
<div id='server-time'></div>
<script>
var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);
var el = document.getElementById('server-time');

ws.onmessage = function (event) {
  el.innerHTML = 'Server time: ' + event.data;
};
</script>
  `))
.listen(3000, () => console.log('Example app listening on port 3000!'))

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
