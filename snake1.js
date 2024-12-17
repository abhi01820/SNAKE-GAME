let dir = {x: 0, y: 0};
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameOver.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
musicSound.loop = true;

let speed =5;
let score = 0;
let lastTime = 0;
let snakebody = [{x: 12, y: 10}];
let food = {x: 4, y: 6};

const scoreBox = document.getElementById("scoreBox");
const highScoreBox = document.getElementById("highScoreBox");

let highScore = localStorage.getItem("highScore");
let highScoreEval = highScore === null ? 0 : parseInt(highScore);
highScoreBox.innerHTML = "High Score: " + highScoreEval;

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastTime) / 1000 < 1 / speed) return;
    lastTime = ctime;
    gameWork();
}

function Collide(snake) {
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function gameWork() {

    if (Collide(snakebody)) {
        musicSound.pause();
        gameOverSound.play();
        alert("Game Over. Press any key to play again!");
        snakebody = [{x: 12, y: 10}];
        dir = {x: 0, y: 0};
        score = 0;
        scoreBox.innerHTML = "Score: 0";
        musicSound.play();
    }


    if (snakebody[0].x === food.x && snakebody[0].y === food.y) {
        foodSound.play();
        score++;
        scoreBox.innerHTML = "Score: " + score;


        if (score > highScoreEval) {
            highScoreEval = score;
            localStorage.setItem("highScore", highScoreEval);
            highScoreBox.innerHTML = "High Score: " + highScoreEval;
        }

        snakebody.unshift({x: snakebody[0].x + dir.x, y: snakebody[0].y + dir.y});

        let a = 2, b = 16;
        do {
            food = {
                x: Math.floor(a + (b - a) * Math.random()),
                y: Math.floor(a + (b - a) * Math.random())
            };
        } while (snakebody.some(seg => seg.x === food.x && seg.y === food.y));
    }


    for (let i = snakebody.length - 2; i >= 0; i--) {
        snakebody[i + 1] = {...snakebody[i]};
    }
    snakebody[0].x += dir.x;
    snakebody[0].y += dir.y;


    const board = document.getElementById("board");
    board.innerHTML = "";

    snakebody.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? "head" : "snake");
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp": if (dir.y === 0) dir = {x: 0, y: -1}; break;
        case "ArrowDown": if (dir.y === 0) dir = {x: 0, y: 1}; break;
        case "ArrowLeft": if (dir.x === 0) dir = {x: -1, y: 0}; break;
        case "ArrowRight": if (dir.x === 0) dir = {x: 1, y: 0}; break;
    }
});

musicSound.play();
