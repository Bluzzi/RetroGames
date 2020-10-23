class Game{
    constructor(type, io, roomID){
        this.type = type;
        this.io = io;
        this.roomID = roomID;
        this.players = [];
    }

    add_player(userID){
        this.players.push(userID);
        this.load_game();
    }

    remove_player(userID){
        // TODO
    }

    play_game(data){
        // Edit in child class
    }

    load_game(data){
        // Edit in child class
    }
}

module.exports = Game;