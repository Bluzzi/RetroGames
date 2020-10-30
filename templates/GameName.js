const Game = require("../utils/Game")

class GameName extends Game {
    constructor(type, io, roomID){
        super(type, io, roomID)
    }

    load_game(){

    }

    start_game(){
        
    }

    play_game(userID, data){
        // Edit in child class
    }
}

module.exports = GameName;