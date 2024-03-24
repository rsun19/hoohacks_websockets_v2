import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const players = []
const responses = new Map()

app.get('/', (req, res) => {
  const user = req.query.user;
  players.push(user)
  console.log(user)
  res.send(`Hello, ${user}! Welcome to the homepage.`);
});

io.on('connect', (socket) => {
    //console.log('connected!')
    socket.on('userPresent', function (data) {
        players.push(data)
        console.log(data)
        console.log('success')
    });
});

// io.on('connection', function (socket) {
//     console.log('connected:', socket.client.id);
//     socket.on('serverEvent', function (data) {
//         console.log('new message from client:', data);
//     });
//     setInterval(function () {
//         socket.emit('clientEvent', Math.random());
//         console.log('message sent to the clients');
//     }, 3000);
// });

server.listen(3030, () => {
  console.log('server running at http://localhost:3030');
});
