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

const players = new Set()

const questions = []

const responses = []


app.get('/', (req, res) => {
//   const user = req.query.user;
//   players.add(user)
//   console.log(user)
  res.send(`Hello! Welcome to the homepage.`);
});

io.on('connect', (socket) => {
    //console.log('connected!')
    socket.on('questions', function (data) {
        questions.clear()
        const question_list = JSON.parse(data)
        question_list.forEach((question) => {
            questions.push(question)
        })
        console.log(questions)
    })
    
    socket.on('userPresent', function (data) {
        players.add(data)
        console.log(data)
        console.log('success')
        setInterval(function () {
            console.log('---')
            console.log(JSON.stringify(Array.from(players)).toString())
            console.log('---')
            socket.emit('currentPlayers', JSON.stringify(Array.from(players)));
        }, 3000);
    });
});

// io.on('connection', unction (socket) {
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
