const express = require('express');
const http = require("http");
const moment = require('moment');
const app = express();
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;
let local = [];

// adduser function
function adduser(id1,name,room){
let obj = {
    id : id1,
    userid : name,
    roomid : room
}
local.push(obj);
};

/// get room member

function getroommember(room) {
    return local.filter(user => user.roomid == room);
  }


  // remove user
  function userLeave(id) {
    const index = local.findIndex(user => user.id == id);
  
    if (index !== -1) {
      return local.splice(index, 1)[0];
    }
  }


app.use(express.static('public'));
app.use(express.json());


app.get('/',function(req,res){

res.sendFile(__dirname + '/home.html');
});

app.get('/room',function(req,res){

    res.sendFile(__dirname + '/room.html');

});


io.on('connection',(socket) =>{

    socket.on('joinroom',({userid,roomid})=> {
       
        adduser(socket.id,userid,roomid);
        socket.join(roomid);
        socket.emit('message',{msg : `welcome to chat ${userid}`,userid : "Bot",time : moment().format('h:mm a')});

        socket.broadcast.to(roomid).emit('message', {msg : `${userid} joined the Room`,userid : "Bot",time : moment().format('h:mm a')});


        socket.on('chatMessage',(msg)=>{

            msg.time =moment().format('h:mm a');
            io.to(roomid).emit('message', msg);
            
            });

           

            io.to(roomid).emit("roommember", {
                users: getroommember(roomid)
              });



            socket.on('disconnect',()=>{
                let a = userLeave(socket.id);

                socket.broadcast.to(roomid).emit('message', {msg : `${userid} left the Room`,userid : "Bot",time : moment().format('h:mm a')});

                io.to(roomid).emit("roommember", {
                    users: getroommember(roomid)
                  });
                });

    });
    // room up


});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));