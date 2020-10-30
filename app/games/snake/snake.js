// Server
const SOCKET = io("http://localhost:3000");

SOCKET.on("connect", function(){
    SOCKET.emit("userID", sessionStorage.getItem("userID"));
    SOCKET.emit("setReady", sessionStorage.getItem("userID"));
});

SOCKET.on("gameData", function(data){
    snakes = data.snakes;
    apples = data.apples;
    console.log(apples)
    draw();
});

SOCKET.on("end", function(snake){

});

function send(data){
    SOCKET.emit("gameData", data);
}

function menu(){
    window.location.replace("../../index.html");
}

document.addEventListener("keypress", function(e){
    if(["z","q","s","d"].includes(e.key)){
        send(e.key);
    }
})

let snakes;
let apples;
let gridImage = new Image();
gridImage.src = "./grid.png";

function draw() {
    let ctx = document.getElementById("game").getContext('2d');

    ctx.drawImage(gridImage, 0, 0);
    setApples();
    setSnakes();
}

function setSnakes(){
    let ctx = document.getElementById("game").getContext('2d');
    ctx.fillStyle = "blue";

    Object.keys(snakes).forEach(key => {
        let snake = snakes[key];
        snake.forEach((part)=>{
            ctx.beginPath();
            ctx.rect(part[0], part[1], 10, 10);
            ctx.fill()
        })
    });
}

function setApples(){
    let ctx = document.getElementById("game").getContext('2d');
    ctx.fillStyle = "red";

    apples.forEach(apple => {
        ctx.beginPath();
        ctx.rect(apple[0], apple[1], 10, 10);
        ctx.fill();
    });
    
}
