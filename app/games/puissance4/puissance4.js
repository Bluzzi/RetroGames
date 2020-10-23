const SOCKET = io("http://localhost:3000");

SOCKET.on("connect", function(){
    SOCKET.emit("userID", sessionStorage.getItem("userID"));
});

function send(data){
    data = data.toString();
    SOCKET.emit("gameData", data);
}

SOCKET.on("draw", function(_grid, _column, _player){
    grid = _grid;
    player = _player;
    addCoin(_column);
});

SOCKET.on("end", function(_player){
    document.getElementById("winner").textContent += player ? "Joueur Rouge" : "Joueur Bleu";
});

// Client
let grid = [[],[],[],[],[],[],[]];
let player = true;


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

    for(let column = 0; column < grid.length; column++){
        for(let row = 0; row < grid[column].length; row++){
            ctx.fillStyle = grid[column][row] ? "#FF0000" : "#0000FF";
            ctx.beginPath();
            ctx.arc(40 + 65 * column, canvas.clientHeight - 40 - 65 * row, 30, 0, Math.PI*2, false);
            ctx.fill();
        }
    }
}

function addCoin(column){
    toggleButtonsEnability();

    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    let j = 0
    let inter = setInterval(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = player ? "#FF0000" : "#0000FF"; // Red || Blue

        ctx.beginPath();
        ctx.arc(40 + 65 * column, 0 + 1 * j, 30, 0, Math.PI*2, false);
        ctx.fill();

        drawGrid();

        j+=2
        if(j > canvas.clientHeight - 40 - 65 * grid[column].length){
            clearInterval(inter);
            toggleButtonsEnability();
            player = !player;
        }
    })   
}

function toggleButtonsEnability(){
    let children = document.getElementById("columnsButtons").children;
    for(let child = 0; child < children.length; child++){
        if(grid[child].length < 6)children[child].toggleAttribute("disabled");
    }
}

window.onload = drawGrid;