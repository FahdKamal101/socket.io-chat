const http = require('http');
const express = require('express');
const socketio = require('socket.io');

//const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

//const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.get('/',  function (req, res) {
  res.status(200).send({
    message: 'Express Backend Server'});
});

io.on('connection',(socket)=>{

    console.log('new connection made.');
    socket.on('join', function(data){
      
      socket.join(data.room);

      console.log(data.user + ' has joined the group : ' + data.room);
      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:' has joined this group'});
    });


    socket.on('leave', function(data){
    
      console.log(data.user + ' left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this group.'});

      socket.leave(data.room);
    });

    socket.on('message',function(data){

      io.in(data.room).emit('new message', {user:data.user, message:data.message});
    })
});
//changed AT 12:10AM 3/20/2020
app.set('port',(process.env.PORT));

server.listen(app.get('port'));
