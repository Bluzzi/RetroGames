let mods = {0: "Puissance 4", 1: "Snake", 2: "Blasters"}

function game(mod){
    sessionStorage.setItem("game", mods[mod]);
    window.location.replace("./lobby/lobby.html");
}