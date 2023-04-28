"use strict;"

const container = document.querySelector('#blocks');
const board = document.querySelector('#board');
const ball = document.querySelector('#ball');
let x_ball = ball.offsetLeft; //
let y_ball = ball.offsetTop;  // x and y coordinates of the ball
let x_board = board.offsetLeft; // x-coordinate of the board
let boardwidth = board.offsetWidth; // width of the board
let stop = false; // game-over indicator
const blocks = [];

let dx = 1;
let dy = -1;

document.addEventListener('keydown', board_move);
document.addEventListener('keyup', start);

for (let k=0; k<248; ++k) {// Creating the blocks
    const block = document.createElement('div');
    block.classList.add('tobreak');
    blocks[k] = block;
    container.appendChild(block);
}

function board_move(event) {
    if (event.code == 'ArrowLeft') {
        if (x_board > -boardwidth/2 + 2) {
            x_board = x_board - 2;
            board.style.left = `${x_board}px`;
        }
        else {
            x_board = window.innerWidth + boardwidth/2 + 2;
            board.style.left = `${x_board}px`;
        }
    }
    if (event.code == 'ArrowRight') {
        if (x_board < window.innerWidth + boardwidth/2 - 2) {
            x_board = x_board + 2;
            board.style.left = `${x_board}px`;
        }
        else{
            x_board = -boardwidth/2 + 2;
            board.style.left = `${x_board}px`;
        }
    }
}

function start(event) {
    if (event.code == 'Space') { //press space to start
        requestAnimationFrame(ball_move);
    }
}
function ball_move() {
    if (x_ball < ball.offsetWidth | x_ball > window.innerWidth - ball.offsetWidth){ //vertical wall hit
        dx = -dx ; 
    }
    if (y_ball < 2*ball.offsetHeight){ //ceiling hit
        dy = -dy ; 
    }
    if (y_ball > window.innerHeight - ball.offsetHeight/2 - 2) {
        if (x_ball > (x_board - boardwidth/2) && x_ball < (x_board + boardwidth/2)) { //board hit
            dy = -dy;
        }
    }
    if (y_ball > window.innerHeight - ball.offsetHeight/2) {
        stop = true;
    }
    x_ball = x_ball + dx;
    y_ball = y_ball + dy;
    ball.style.left = `${x_ball}px`;
    ball.style.top = `${y_ball}px`;
    if (!stop){
        requestAnimationFrame(ball_move);
    }
    
}