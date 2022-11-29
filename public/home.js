let img = document.getElementById("join");
let user = document.getElementById('user');
let room1 = document.getElementById('room');

img.addEventListener('click',function(){

let username = user.value;
let room = room1.value;

        window.location.href = `/room?userid=${username}&roomid=${room}`; 

});