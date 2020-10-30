const Game = require("../utils/Game")

class Snake extends Game {
    #snakes;
    #apples;
    constructor(type, io, gameID){
        super(type, io, gameID)
        this.#snakes = {}
        this.#apples = [];
        this.playersRequired = 4;
    }

    load_game(){
        for(let userID of Object.keys(this.players)){
            let socket = this.io.sockets.sockets[(require("../Main")).get_socketID(userID)];
            socket.emit("loadGame", this.type);
        }
    }

    start_game(){
        
        // Create snakes object
        let positions = [[0, 0], [500, 500], [500, 0], [0, 500]]
        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        for(let userID of Object.keys(this.players)){
            this.#snakes[userID] = {
                body:[positions[0]],
                dirs:[directions[0]],
                pos:positions.shift(),
                dir:directions.shift()
            }
        }

        // Create apples array
        for(let i = 0; i < Object.keys(this.players).length * 2 + 1; i++){
            this.#apples.push(this.moveApple());
        }

        setInterval(()=>{
            this.moveSnake();
            let data = {snakes:{}, apples:this.#apples};
            for(let userID of Object.keys(this.players)){
                data.snakes[userID] = this.#snakes[userID].body;
            }
            this.io.to(this.gameID).emit("gameData",data);
        }, 250);
    }

    play_game(userID, key){
        switch(key){
            case "z":
                this.#snakes[userID].dir = [0, -1];
                break;
            case "s":
                this.#snakes[userID].dir = [0, 1];
                break;
            case "q":
                this.#snakes[userID].dir = [-1, 0];
                break;
            case "d":
                this.#snakes[userID].dir = [1, 0];
                break;
        }
    }

    moveSnake(){
        for(let userID of Object.keys(this.players)) {
            // Add new dir and new pos
            this.#snakes[userID].body.splice(0, 0, this.#snakes[userID].pos);
            this.#snakes[userID].dirs.splice(0, 0, this.#snakes[userID].dir);
            // Del last dir and last pos if no apple is eaten
            let eatedApple = this.#apples.findIndex(e => e[0] == this.#snakes[userID].body[0][0] && e[1] == this.#snakes[userID].body[0][1]);
            if(eatedApple == -1){
                this.#snakes[userID].dirs.pop();
                this.#snakes[userID].body.pop();
            } else {
                this.#apples[eatedApple] = this.moveApple();
            }
            // Go forward
            this.#snakes[userID].pos = [
                this.#snakes[userID].pos[0] + this.#snakes[userID].dir[0] * 10,
                this.#snakes[userID].pos[1] + this.#snakes[userID].dir[1] * 10,
            ];
            // Prevent from being outside of the screen
            if(this.#snakes[userID].pos[0] > 540) this.#snakes[userID].pos[0] = 0;
            if(this.#snakes[userID].pos[0] < 0) this.#snakes[userID].pos[0] = 540;
            if(this.#snakes[userID].pos[1] > 540) this.#snakes[userID].pos[1] = 0;
            if(this.#snakes[userID].pos[1] < 0) this.#snakes[userID].pos[1] = 540;
        }
    }

    moveApple(){
        return [this.randomNum(0, 54) * 10, this.randomNum(0, 54) * 10];
    }

    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

module.exports = Snake;