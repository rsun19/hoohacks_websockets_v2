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

var questions = []

var scores = new Map()
var updated = []

let curQuestionIndex = 0

let playerDataInterval;

app.get('/', (req, res) => {
//   const user = req.query.user;
//   players.add(user)
//   console.log(user)
  res.send(`Hello! Welcome to the homepage.`);
});

io.on('connect', (socket) => {
    console.log('connected!')
    socket.on('questions', function (data) {
        questions = []
        const question_list = JSON.parse(data)
        question_list.forEach((question) => {
            questions.push(question)
        })
        console.log(questions)
    })

    socket.on('userPresent', function (data) {
        players.add(data)
        console.log(data)
        console.log('email received')
        // if (playerDataInterval) {
        //     clearInterval(playerDataInterval);
        // }
        // playerDataInterval = setInterval(function () {
            console.log('sending player data')
            io.sockets.emit('currentPlayers', JSON.stringify(Array.from(players)));
        // }, 3000);
        scores = new Map()
        for (const data of players) {
            scores.set(data, 0)
        }
    });

    socket.on('curAnswer', function (data) {
        const curAnswer = JSON.parse(data)
        q_index = curAnswer[0]
        points = curAnswer[1]
        user = curAnswer[2]
        let prev = scores.get(user)
        scores.set(user, prev+Number(points))
        console.log(scores)
    })

    socket.on('startGameNow', function (data) {
        io.sockets.emit('startGame', `game started by ${data.toString()}`)
    })

    socket.on('disconnect', () => {
        console.log('disconnected')
        // clearInterval(playerDataInterval);
        // playerDataInterval = null;
    })
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
