const Game = require("../utils/Game")

class Puissance4 extends Game{
    #grid;
    #turn;
    #playersNeeded;
    constructor(type, io, roomID){
        super(type, io, roomID)
        this.#grid = [[],[],[],[],[],[],[]];
        this.#turn = Math.round(Math.random()) == 1;
        this.#playersNeeded = 2;
    }

    load_game(){
        if(this.players.length < this.#playersNeeded)return;
        for(let userID of this.players){
            let socket = this.io.sockets.sockets[(require("../Main")).get_socketID(userID)];
            socket.emit("loadGame");
        }
    }

    play_game(column){
        column = parseInt(column);
        // Test validity of column
        if(column > 6 || this.#grid[column].length >= 6) return;
        // Link to front end
        this.io.to(this.roomID).emit("draw", this.#grid, column, this.#turn);
        // Add coin to grid
        this.#grid[column].push(this.#turn);

        // Test if there is a winner
        if(this.isAWinner()){
            this.io.to(this.roomID).emit("end", this.#turn);
        }
        this.#turn = !this.#turn;
    }


    isAWinner(){
        // Verify columns:
        for(let i of this.#grid){
            if(i.join("").includes(this.#turn.toString().repeat(4)))return true;
        }
        // Verify rows
        for(let i = 0;i < 6;i++){
            let a = this.#grid.map((column)=>{return column.length>i?column[i]:"null"})
            if(a.join("").includes(this.#turn.toString().repeat(4)))return true;
        }
        // Verify diagonals
        for(let i=0;i<4;i++){//Left to right
            for(let j=0;j<3;j++){
                let a = [this.#grid[i][j],this.#grid[i+1][j+1],this.#grid[i+2][j+2],this.#grid[i+3][j+3]]
                if(a.join("").includes(this.#turn.toString().repeat(4)))return true;
            }
        }
        for(let i=6;i>2;i--){//Right to left
            for(let j=0;j<3;j++){
                let a = [this.#grid[i][j],this.#grid[i - 1][j + 1],this.#grid[i - 2][j + 2],this.#grid[i - 3][j + 3]]
                if(a.join("").includes(this.#turn.toString().repeat(4)))return true;
            }
        }
        return false;
    }
}

module.exports = Puissance4;