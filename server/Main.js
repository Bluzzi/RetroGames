const IO = require("socket.io")(3000);

const Server = new (require("./Server"))(IO);


console.log("Starting server...");

IO.on("connection", function(socket) {
    console.log(socket.id + " is connected");

    socket.on("game", function(type, mod, gameID){
        switch(mod){
            case "random":

                break;
            case "create":
                gameID = Server.GAMES_MANAGER.create(type, Server.get_user(socket.id));
                Server.users[Server.get_user(socket.id)]["gameID"] = gameID;
                break;
            case "join":
                if(Server.GAMES_MANAGER.join(gameID, Server.get_user(socket.id))){
                    Server.users[Server.get_user(socket.id)]["gameID"] = gameID;
                }
                break;
        }
    });

    socket.on("userID", function(data){
        if(Server.users[data]){
            Server.users[data].socketID = socket.id;
            socket.join(Server.users[data].gameID);
        } else {
            Server.users[data] = {socketID:socket.id}
        }
    })

    socket.on("gameData", function(data){
        let gameID = Server.users[Server.get_user(socket.id)].gameID;
        Server.GAMES_MANAGER.play_game(gameID, data);
    })

    module.exports = Server;
})

