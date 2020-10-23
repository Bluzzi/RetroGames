const GAME = require("./Game");

const games = {"Puissance 4":"Puissance4","Snake":"Snake"}

class GameManager{
    #games;
    #randomGames;
    #io;
    constructor(io){
        this.#games = {};
        this.#randomGames = {};
        this.#io = io;
    }

    create(gameType, userID){
        let gameID = generateID();
        console.log("Game ID : " + gameID);

        this.#games[gameID] = new (require("../games/" + games[gameType]))(gameType, this.#io, gameID);
        this.#games[gameID].add_player(userID);
        console.log(this.#games[gameID].io)
        return gameID;
    }

    join(gameID, userID){
        if(this.#games[gameID]) {
            this.#games[gameID].add_player(userID);
            return true;
        } else {
            this.#io.sockets.connected[SERVER.get_socket(userID)].emit("game exists not");
            return false;
        }
    }

    random(gameType){
        
    }

    play_game(gameID, data){
        this.#games[gameID].play_game(data);
    }
}

function generateID(){
    let ID = "";
    for(let i = 0;i < 6; i++){
        if(Math.round(Math.random())==0){
            ID += String.fromCharCode(Math.floor(Math.random()*(90-65))+65);
        } else {
            ID += [0,1,2,3,4,5,7,8,9][Math.floor(Math.random()*9)];
        }
    }
    return ID;
}

module.exports = GameManager;