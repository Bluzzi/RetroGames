const GAME = require("./Game");

const games = {"Puissance 4":"Puissance4", "Snake":"Snake", "Blasters":"Blasters"};


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
        this.#games[gameID] = new (require("../games/" + games[gameType]))(games[gameType], this.#io, gameID);
        this.#games[gameID].add_player(userID);
        return gameID;
    }

    async delete(gameID, userID){
        delete this.#games[gameID];
    }

    async join(gameID, userID){
        if(this.#games[gameID]) {
            this.#games[gameID].add_player(userID);
            return true;
        } else {
            return false;
        }
    }

    random(gameType, userID){
        if(!this.#randomGames[gameType]){
            let gameID = generateID();    
            this.#randomGames[gameType] = new (require("../games/" + games[gameType]))(games[gameType], this.#io, gameID);
        }
        let gameID = this.#randomGames[gameType].gameID;
        if(this.#randomGames[gameType].add_player(userID)){
            this.#games[this.#randomGames[gameType].gameID] = this.#randomGames[gameType];
            delete this.#randomGames[gameType];
        }
        return gameID;
    }

    async set_ready(gameID, userID){
        this.#games[gameID].set_ready(userID);
    }

    async play_game(gameID, userID, data){
        this.#games[gameID].play_game(userID, data);
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