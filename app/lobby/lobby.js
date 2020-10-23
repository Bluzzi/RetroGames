const SOCKET = io("http://localhost:3000");
const GAME = sessionStorage.getItem("game");


sessionStorage.setItem("userID", generateID());

SOCKET.on("connect", function(){
    SOCKET.emit("userID", sessionStorage.getItem("userID"));
});

window.onload = function(){
    document.getElementById("game").textContent = GAME;
}

function game(mod){
    switch(mod){
        case "random":
            SOCKET.emit("game", GAME, mod);
            break;
        case "create":
            SOCKET.emit("game", GAME, mod);
            break;
        case "join":
            let ID = document.getElementById("gameID").value;
            SOCKET.emit("game", GAME, mod, ID);
            break;
    }
}

SOCKET.on("loadGame", function(){
    window.location.replace("../games/puissance4/puissance4.html");
})

SOCKET.on("game exists not", function(){
    // TODO : show error result
})

function generateID(){
    let ID = ""
    for(let i = 0;i < 10; i++){
        if(Math.round(Math.random())==0){
            ID += String.fromCharCode(Math.floor(Math.random()*(90-65))+65);
        } else {
            ID += [0,1,2,3,4,5,7,8,9][Math.floor(Math.random()*9)];
        }
    }
    return ID;
}