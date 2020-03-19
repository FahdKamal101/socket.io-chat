const http = require('http');
const express = require('express');
const socketio = require('socket.io');

//const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

//const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection',(socket)=>{

    console.log('new connection made.');

    socket.on('join', function(data){
      
      socket.join(data.room);

      console.log(data.user + ' has joined the group : ' + data.room);

      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:' has joined this group'});
    });


    socket.on('leave', function(data){
    
      console.log(data.user + ' left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

      socket.leave(data.room);
    });

    socket.on('message',function(data){

      io.in(data.room).emit('new message', {user:data.user, message:data.message});
    })
});


server.listen(process.env.PORT || 3000, () => console.log(`Server has started.listening on port 3000`));

