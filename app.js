var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// 存储用户
var users = [];

app.use('/',express.static(__dirname + '/www'));
server.listen(80);
console.log("http://localhost:80/");

// socket.io

io.on('connection', function(socket){
  // 登录
  socket.on('login', function(nickname){
    if(users.indexOf(nickname) > -1){
      socket.emit('loginFailed');
    }else{
      socket.nickname = nickname;
      users.push(nickname);
      console.log(nickname + '已经上线了，总在线人数为:' + users.length);
      socket.emit('loginSuccess');
      io.sockets.emit('system', nickname, users.length, 'login');
    }
  })

  //断开连接，实时更新users数组
  socket.on('disconnect', function(){
    var index = users.indexOf(socket.nickname);
    users.splice(index, 1);
    io.sockets.emit('system', socket.nickname, users.length, 'logout');
    console.log(socket.nickname + '已经下线了');
    console.log(users);
  })
  // 发送消息
  socket.on('msgSend', function(msg){
    socket.broadcast.emit('newMsg', socket.nickname, msg);
  })
})
