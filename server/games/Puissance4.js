const Game = require("../utils/Game")

class Puissance4 extends Game{
    #grid;
    #playerTurn;
    #colors;
    constructor(type, io, gameID){
        super(type, io, gameID);
        this.#grid = [[],[],[],[],[],[],[]];
        this.playersRequired = 4;
        this.#playerTurn = Math.round(Math.random());
        this.#colors = {}
    }

    load_game(){
        this.#colors[Object.keys(this.players)[0]] = "#FF0000";
        this.#colors[Object.keys(this.players)[1]] = "#0000FF";
        for(let userID of Object.keys(this.players)){
            let socket = this.io.sockets.sockets[(require("../Main")).get_socketID(userID)];
            socket.emit("loadGame", this.type);
        }
    }

    start_game(){
        let data = {"grid":this.#grid, "currentPlayer":Object.keys(this.players)[this.#playerTurn], "colors":this.#colors}
        this.io.to(this.gameID).emit("gameData", data);
    }

    play_game(userID, column) {
        // Test validity of column
        if(userID != Object.keys(this.players)[this.#playerTurn]) return;
        if(column > 6 || this.#grid[column].length >= 6) return;
        let currentPlayer = this.#playerTurn;

        // Change current player
        this.#playerTurn = (this.#playerTurn == 0) ? 1 : 0;
        // Link to front end
        let data = {"grid":this.#grid, "currentPlayer":Object.keys(this.players)[this.#playerTurn], "column":column}
        this.io.to(this.gameID).emit("gameData", data);
        // Add coin to grid
        this.#grid[column].push(Object.keys(this.players)[currentPlayer]);
        // Test if there is a winner
        if(this.isAWinner(currentPlayer)){
            this.io.to(this.gameID).emit("end", Object.keys(this.players)[currentPlayer]);
        }
    }

    isAWinner(currentPlayer){
        // Verify columns:
        for(let i of this.#grid){
            if(i.join("").includes(Object.keys(this.players)[currentPlayer].toString().repeat(4)))return true;
        }
        // Verify rows
        for(let i = 0;i < 6;i++){
            let a = this.#grid.map((column)=>{return column.length>i?column[i]:"null"})
            if(a.join("").includes(Object.keys(this.players)[currentPlayer].toString().repeat(4)))return true;
        }
        // Verify diagonals
        for(let i=0;i<4;i++){//Left to right
            for(let j=0;j<3;j++){
                let a = [this.#grid[i][j],this.#grid[i+1][j+1],this.#grid[i+2][j+2],this.#grid[i+3][j+3]]
                if(a.join("").includes(Object.keys(this.players)[currentPlayer].toString().repeat(4)))return true;
            }
        }
        for(let i=6;i>2;i--){//Right to left
            for(let j=0;j<3;j++){
                let a = [this.#grid[i][j],this.#grid[i - 1][j + 1],this.#grid[i - 2][j + 2],this.#grid[i - 3][j + 3]]
                if(a.join("").includes(Object.keys(this.players)[currentPlayer].repeat(4)))return true;
            }
        }
        return false;
    }
}

module.exports = Puissance4;