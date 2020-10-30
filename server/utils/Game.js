class Game{
    constructor(type, io, gameID){
        this.type = type;
        this.io = io;
        this.gameID = gameID;
        this.players = {};
        this.playersRequired = 1;
    }

    add_player(userID){
        this.players[userID] = false;
        if(Object.keys(this.players).length >= this.playersRequired){
            this.load_game();
            return true;
        }
        return false;
    }

    remove_player(userID){
        delete this.players[userID];
    }

    set_ready(userID){
        this.players[userID] = true;
        if(!Object.values(this.players).includes(false)){
            this.start_game();
        }
    }

    set_unready(userID){
        this.players[userID] = false;
    }

    start_game(){
        // Edit in child class
    }

    play_game(userID, data){
        // Edit in child class
    }

    load_game(data){
        socket.emit("loadGame", this.type);
        // Edit in child class
    }
}

module.exports = Game;