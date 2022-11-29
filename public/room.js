let leave = document.getElementById('leave');
let span = document.getElementById("s2");
let left = document.getElementById('l2');
let a = document.getElementById('one');
const { userid, roomid } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});



const socket = io();
span.innerText = roomid;
 
leave.addEventListener('click',function(){

window.location.href = "/";
});

//join chat room
socket.emit('joinroom', { userid, roomid });


// get room member
socket.on('roommember', ({users }) => {
  console.log(users);
  additems(users);
});


let send = document.getElementById("send");

send.addEventListener('click',function(){

  let msg = document.getElementById("message").value;
  document.getElementById("message").value = '';
  document.getElementById("message").focus();

  socket.emit('chatMessage', {msg,userid});

  // addtolist({msg,userid},"chat1");
  
});

socket.on('message', (msg)=>
  {
    console.log(msg);

   addtolist(msg,"chat");
   a.scrollTop = a.scrollHeight;
  });


  function addtolist(obj,class1)
  {

   let div = document.createElement('div');
   if(obj.userid=="Bot")
   {
    div.className = "chat2";
   }
   else if(obj.userid == userid)
   {
   div.className = "chat1";
   obj.userid = "me";
   }
   else
   {
    div.className = class1;
   }
   div.innerHTML = ` <span>${obj.userid}</span>
   <span>${obj.time}</span>
   <p>${obj.msg}</p>`
    

   a.appendChild(div);
  }


  function additems(list)
  {

    left.innerHTML = '';
    for(let i=0;i<list.length;i++)
    {

     let li  = document.createElement('li');
     li.innerHTML = `${list[i].userid}   <img src="live.png" height="20px" />`;
     left.appendChild(li);
    }

  }