const SOCKET = io("http://localhost:3000");
const userID = sessionStorage.getItem("userID");

SOCKET.on("connect", function(){
    SOCKET.emit("userID", userID);
    SOCKET.emit("setReady", userID);
});

SOCKET.on("gameData", function(data){
    if(Object.keys(data).includes("countdown")){
        countdown(data.countdown);
    } else {
        ennemy = data[Object.keys(data).find(x => x != userID)];
        player = data[userID];
            
        draw();
    }
});

SOCKET.on("end", function(_player){
    
});

function send(data){
    SOCKET.emit("gameData", data);
}

// Send mouse position
let mousePosition;
document.addEventListener("mousemove", async function(e){
    mousePosition = e.y - blastersSize[1] / 2;
})
setInterval(()=>{
    send({mouse:mousePosition});
}, 100);
// Send keys on press
document.addEventListener("keypress", function(e){
    if(["a","z","e"].includes(e.key)){
        send({key:e.key});
    }
})

let blastersSize = [60, 40];
let bulletsSize = [8, 8];
let player;
let ennemy;
let playerImage = new Image();
playerImage.src = "./green_blaster.png";
let playerBulletImage = new Image();
playerBulletImage.src = "./green_bullet.png";
let ennemyImage = new Image();
ennemyImage.src = "./red_blaster.png";
let ennemyBulletImage = new Image();
ennemyBulletImage.src = "./red_bullet.png";

function countdown(count){
    let canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    if(count == 0)count = "Go !";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00FFFF";    
    ctx.font = 'Bold 200px Sans-Serif';
    ctx.textAlign = "center"; 
    ctx.strokeText(count, 350, 250);
}

function draw(){
    let canvas = document.getElementById("game");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.bullets.forEach(bullet => {
        ctx.drawImage(playerBulletImage, bullet.x, bullet.y - player.bulletSize.y / 2, player.bulletSize.x, player.bulletSize.y);
    });
    

    ctx.drawImage(playerImage, player.pos.x, player.pos.y - player.blasterSize.y / 2, player.blasterSize.x, player.blasterSize.y);

    ctx.fillStyle = "#00FFFF";    
    ctx.font = 'Bold 80px Sans-Serif';
    ctx.textAlign = "center"; 
    ctx.strokeText(player.score, 300, 100);

    if(!ennemy)return;
    ctx.strokeText(ennemy.score, 400, 100);

    ennemy.bullets.forEach(bullet => {
        ctx.drawImage(ennemyBulletImage, canvas.width - bullet.x - ennemy.bulletSize.x, bullet.y - ennemy.bulletSize.y / 2, ennemy.bulletSize.x, ennemy.bulletSize.y);
    });
    ctx.drawImage(ennemyImage, canvas.width - ennemy.pos.x - ennemy.blasterSize.x, ennemy.pos.y - ennemy.blasterSize.y / 2, ennemy.blasterSize.x, ennemy.blasterSize.y);
}