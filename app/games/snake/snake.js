
window.onload = function(){
   start();
}
let snake = [[0, 0], [-10, 0], [-20, 0]];
let snakeDirs = [[1, 0], [1, 0], [1, 0]];
let dir = [1, 0];
let apple = null;
let eat = false;

let start =async function(){
    setInterval(()=>{
        for(let index = snake.length - 1; index >= 0; index--){
            snake[index] = [snake[index][0] + snakeDirs[index][0] * 10, snake[index][1] + snakeDirs[index][1] * 10]
        }
        grid();
    }, 250);
}

let setSnake = function(){
    let ctx = document.getElementById("game").getContext('2d');
    setApple();
    ctx.fillStyle = "blue";
    snake.forEach((part)=>{
        if(part[0] == apple[0] && part[1] == apple[1]){
            apple = null;
            snake.push(null);
            snakeDirs.push(dir);
        }
        ctx.beginPath();
        ctx.rect(part[0], part[1], 10, 10);
        ctx.fill()
    })
}

let setApple = function(){
    let ctx = document.getElementById("game").getContext('2d');

    apple = apple == null ? [randomNum(0, 54) * 10, randomNum(0, 54) * 10] : apple;

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(apple[0], apple[1], 10, 10);
    ctx.fill();
}

let grid = function() {
    let ctx = document.getElementById("game").getContext('2d');

    let img1 = new Image();

    img1.onload = function () {
        ctx.drawImage(img1, 0, 0);
        setSnake();
    };

    img1.src = "./grid.png";
}


document.addEventListener("keypress", function(e){
    switch(e.key){
        case "z":
            dir = [0, -1]
            break
        case "s":
            dir = [0, 1]
            break;
        case "q":
            dir = [-1, 0]
            break;
        case "d":
            dir = [1, 0]
            break;
    }
    if(["z","s","q","d"].includes(e.key)){
        snakeDirs.splice(0, 0, dir);
        snakeDirs.pop()
        console.log(...snakeDirs)
    }
})

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}