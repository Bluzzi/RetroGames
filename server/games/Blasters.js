const Game = require("../utils/Game")
class Blasters extends Game {
    #blasters;
    constructor(type, io, roomID){
        super(type, io, roomID);
        this.#blasters = {};
        this.playersRequired = 2;
    }

    load_game(){
        let startPositions = [[10, 100], [10, 100]];
        for(let userID of Object.keys(this.players)){
            let pos = startPositions.shift();
            this.#blasters[userID] = {pos:{x: pos[0], y: pos[1]}, bullets:[], blasterSize:{x:60 , y: 40}, bulletSize: {x: 8, y: 8}, score: 0};
        }

        for(let userID of Object.keys(this.players)){
            let socket = this.io.sockets.sockets[(require("../Main")).get_socketID(userID)];
            socket.emit("loadGame", this.type);
        }
    }

    reset_players(){
        let startPositions = [[10, 100], [10, 100]];
        for(let userID of Object.keys(this.players)){
            let pos = startPositions.shift();
            this.#blasters[userID] = {pos:{x: pos[0], y: pos[1]}, bullets:[], blasterSize:{x:60 , y: 40},bulletSize: {x: 8, y: 8}, score: this.#blasters[userID].score};
        }
    }

    start_game(){
        let count = 3
        let countdown = setInterval(() => {
            this.io.to(this.gameID).emit("gameData", {countdown: count});
            count -= 1
            if(count < 0){
                clearInterval(countdown);
                setTimeout(()=>{
                    this.start_round();
                }, 1000)
            }
        }, 1000);
    }

    start_round(){
        this.reset_players();
        setInterval(() => {
            for(let userID of Object.keys(this.#blasters)){
                let pos = this.#blasters[userID].mouse;
                if(pos > this.#blasters[userID].pos.y + 20){
                    this.#blasters[userID].pos.y += 2;
                } else if(pos < this.#blasters[userID].pos.y - 20) {
                    this.#blasters[userID].pos.y -= 2;
                }
                for(let i = 0; i < this.#blasters[userID].bullets.length; i++){
                    let bullet = this.#blasters[userID].bullets[i];
                    this.#blasters[userID].bullets[i] = { x: bullet.x + 5, y: bullet.y};

                    let ennemy = this.#blasters[Object.keys(this.#blasters).find(x => x != userID)];
                    let l1 = [700 - ennemy.pos.x - ennemy.blasterSize.x, ennemy.pos.y];
                    let r1 = [700 - ennemy.pos.x, ennemy.pos.y + ennemy.blasterSize.y];

                    let l2 = Object.values(this.#blasters[userID].bullets[i]);
                    let r2 = [this.#blasters[userID].bullets[i].x + this.#blasters[userID].bulletSize.x, this.#blasters[userID].bullets[i].y + this.#blasters[userID].bulletSize.y]
                    if(this.overlap(l1, r1, l2, r2)){
                        console.log("touch")
                    }
                }

                this.#blasters[userID].bullets = this.#blasters[userID].bullets.filter((bullet) => bullet != null && bullet.x < 700);
            }

            
            this.io.to(this.gameID).emit("gameData", this.#blasters);
        }, 25);
    }

    

    overlap(l1, r1, l2, r2) {
        if(l1[0] >= r2[0] || l2[0] >= r1[0]) return false;

        if(l1[1] >= r2[1] || l2[1] >= r1[1]) return false;
        
        return true;
    }
      
    

    play_game(userID, data){
        if(data.mouse){
            this.#blasters[userID]["mouse"] = data.mouse;
        }
        if(data.key){
            switch(data.key){
                case "a":
                    let num = 0
                    let inter = setInterval(() => {
                        this.#blasters[userID].bullets.push({x: this.#blasters[userID].pos.x, y: this.#blasters[userID].pos.y});
                        this.io.to(this.gameID).emit("gameData", this.#blasters);
                        num += 1
                        if(num >= 5)clearInterval(inter);
                    }, 500)
                    break;
                case "z":

            }
        }
    }
}

module.exports = Blasters;