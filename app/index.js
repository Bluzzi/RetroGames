mods = {0:"Puissance 4", 1:"Snake"}

function game(mod){
    sessionStorage.setItem("game", mods[mod]);
    window.location.replace("./lobby/lobby.html");
}