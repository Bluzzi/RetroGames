const GameManager = require("./utils/GamesManager");


class Server{
    #IO;
    constructor(IO){
        this.users = {};
        this.#IO = IO;
        this.GAMES_MANAGER = new GameManager(this.#IO);
    }

    get_gameID(socketIDOrUserID){
        return Object.keys(this.users).find(key => 
            this.users[key]["socketID"] === socketIDOrUserID || 
            key === socketIDOrUserID)["gameID"];
    }

    get_users(){
        return this.users;
    }

    get_IO(){
        return this.#IO;
    }

    get_socketID(userID){
        return this.users[userID].socketID;
    }

    get_user(socketID){
        return Object.keys(this.users).find(key => this.users[key]["socketID"] === socketID);
    }
}

// const SERVER = new Server();
// SERVER.start();

module.exports = Server;