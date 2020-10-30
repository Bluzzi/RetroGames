const { Cookies } = require("electron");

const SOCKET = io("http://localhost:3000");

SOCKET.on("connect", function(){
    SOCKET.emit("userID", sessionStorage.getItem("userID"));
    SOCKET.emit("setReady", sessionStorage.getItem("userID"));
});

SOCKET.on("gameData", function(data){
    grid = data["grid"];
    if(data["colors"])colors=data["colors"];
    let column;
    if(Object.keys(data).includes("column")) column=data["column"];

    player = data["currentPlayer"]; 
    if(player == sessionStorage.getItem("userID")) enableButtons();
    else disableButtons();

    addCoin(column);
});

SOCKET.on("end", function(_player){
    document.getElementById("winner").textContent = _player == sessionStorage.getItem("userID") ?  "Vous avez gagné !" : "Vous avez perdu";
});

function send(data){
    SOCKET.emit("gameData", data);
}

function menu(){
    window.location.replace("../../index.html");
}

// Client
let grid;
let player;
let colors;

function addCoin(column){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    if(column==undefined) return drawGrid();
    let j = 0;
    let inter = setInterval(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        ctx.fillStyle = colors[Object.keys(colors).find(x => x != player)];

        ctx.beginPath();
        ctx.arc(40 + 65 * column, 0 + 1 * j, 30, 0, Math.PI*2, false);
        ctx.fill();

        drawGrid();
        drawCoins();

        j+=2
        if(j > canvas.clientHeight - 40 - 65 * grid[column].length){
            clearInterval(inter);
        }
    })   
}

function drawGrid(){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000"; // Black

    for(let j = 0; j < 6; j++){
        for(let i=0; i < 7; i++){
            ctx.beginPath();
            ctx.arc(40 + 65 * i, 40 + 65 * j, 30, 0, Math.PI*2, false);
            ctx.stroke();
        }
    }
}

function drawCoins(){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    for(let column = 0; column < grid.length; column++){
        for(let row = 0; row < grid[column].length; row++){
            ctx.fillStyle = colors[grid[column][row]];
            ctx.beginPath();
            ctx.arc(40 + 65 * column, canvas.clientHeight - 40 - 65 * row, 30, 0, Math.PI*2, false);
            ctx.fill();
        }
    }
}

function disableButtons(){
    let children = document.getElementById("columnsButtons").children;
    for(let child = 0; child < children.length; child++){
        if(grid[child].length < 6)children[child].setAttribute("disabled","true");
    }
}

function enableButtons(){
    let children = document.getElementById("columnsButtons").children;
    for(let child = 0; child < children.length; child++){
        if(grid[child].length < 6)children[child].removeAttribute("disabled");
    }
}