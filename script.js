"use strict;"

const body = document.querySelector('body');
const board = document.querySelector('#board');
const ball = document.querySelector('#ball');
const scoreboard = document.querySelector('#score');
scoreboard.style.left = '30px';
scoreboard.style.top = `${window.innerHeight - 45}px`;

board.style.left = `${window.innerWidth/2 - board.offsetWidth/2}px`;
board.style.top = `${window.innerHeight - board.offsetHeight - 50}px`;
ball.style.left = `${window.innerWidth/2 - ball.offsetWidth/2}px`;
//ball.style.top = `${window.innerHeight - board.offsetHeight - 250 - ball.offsetHeight}px`;
ball.style.top = `${window.innerHeight - board.offsetHeight - 50 - ball.offsetHeight}px`;

let x_ball = ball.offsetLeft; //
let y_ball = ball.offsetTop;  // x and y coordinates of the ball
let x_board = board.offsetLeft; // x-coordinate of the board
let boardwidth = board.offsetWidth; // width of the board
let stop = false; // game-over indicator
const blocks = [];
let colors = ['cyan', 'darkcyan', 'darkkhaki', 'darksalmon', 'darkolivegreen', 'darkorange', 'indiared', 'crimson', 'red', 'darkred'];

let dx = 0;
let dy = -2;
let v = Math.sqrt(dx*dx + dy*dy); // speed

let remaining = 0 // blocks remaining
let score = 0 // score

document.addEventListener('keydown', board_move);
document.addEventListener('keyup', start);

simpleconfig(4, 10, 2)

function simpleconfig(m, n, w) {  //arranging blocks
    for (let k = 0; k < m; k++) {
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');
            block.style.backgroundColor = colors[w-1];
            block.style.width = `${Math.floor(body.offsetWidth/n) - 4}px`;
            if (k % 2 == j % 2) {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0]);
            }
            else {
                blocks.push([block, w, w]);
                remaining += 1;
            }
            body.appendChild(block);
        }
    }
}

function board_move(event) {
    if (event.code == 'ArrowLeft') {
        if (x_board >= -boardwidth + 4) {
            x_board = x_board - 4;
            board.style.left = `${x_board}px`;
        }
        else {
            x_board = window.innerWidth;
            board.style.left = `${x_board}px`;
        }
    }
    if (event.code == 'ArrowRight') {
        if (x_board < window.innerWidth - 4) {
            x_board = x_board + 4;
            board.style.left = `${x_board}px`;
        }
        else{
            x_board = -boardwidth;
            board.style.left = `${x_board}px`;
        }
    }
}

function start(event) {
    if (event.code == 'Space') { //press space to start
        requestAnimationFrame(playing);
    }
}

function playing() {
    ball_move()
    if (stop) {
       gameover();
    }
    else if (remaining <= 0) {
        win();
    }
    else {
        requestAnimationFrame(playing)
    }
}

function ball_move() {
    if (x_ball <= 0 | x_ball > window.innerWidth - ball.offsetWidth){ //vertical wall hit
        dx = -dx ; 
    }
    if (y_ball < 0){ //ceiling hit
        dy = -dy ; 
    }
    if (y_ball > board.offsetTop - ball.offsetHeight && y_ball < board.offsetTop ) {//board hit
        if (x_ball > x_board + ball.offsetWidth && x_ball < x_board + boardwidth - 2*ball.offsetWidth) { 
            dy = -Math.abs(dy);
        }
        else if (x_ball > x_board - ball.offsetWidth && x_ball < x_board + ball.offsetWidth) {
            dx = Math.max(dx - v * 0.5 * (x_board + ball.offsetWidth - x_ball) / (2*ball.offsetWidth), -v*0.9);
            dy = -Math.sqrt(v*v - dx*dx)
        }
        else if (x_ball > x_board + boardwidth - 2*ball.offsetWidth && x_ball < x_board + boardwidth) {
            dx = Math.min(dx + v * 0.5 * (x_ball - (x_board + boardwidth - 2*ball.offsetWidth)) / (2*ball.offsetWidth), v*0.9);
            dy = -Math.sqrt(v*v - dx*dx)
        }
    }
    for (let k = 0; k < blocks.length; k++) { //block hit
        if (blocks[k][1] > 0) {
            if (y_ball < (blocks[k][0].offsetTop + blocks[k][0].offsetHeight) && y_ball > (blocks[k][0].offsetTop - ball.offsetHeight)) {
                if (Math.abs(x_ball + ball.offsetWidth/2 - blocks[k][0].offsetLeft - blocks[k][0].offsetWidth/2) < (ball.offsetWidth + blocks[k][0].offsetWidth)/2 + Math.abs(dx)) {
                    dx = -dx;
                    blocks[k][1] -=1;
                    if (blocks[k][1] <= 0) {
                        blocks[k][0].style.visibility = 'hidden';
                        remaining-=1;
                        score += blocks[k][2] * blocks[k][2];
                        scoreboard.textContent = `score: ${score}`;
                    }
                    else {
                        blocks[k][0].style.backgroundColor = colors[blocks[k][1] - 1];
                    }
                    
                }
            }
            else if (x_ball < (blocks[k][0].offsetLeft + blocks[k][0].offsetWidth) && x_ball > (blocks[k][0].offsetLeft - ball.offsetWidth)) {
                if (Math.abs(y_ball + ball.offsetHeight/2 - blocks[k][0].offsetTop - blocks[k][0].offsetHeight/2) < (ball.offsetHeight + blocks[k][0].offsetHeight)/2 + Math.abs(dy)) {
                    dy = -dy;
                    blocks[k][1] -=1;
                    if (blocks[k][1] <= 0) {
                        blocks[k][0].style.visibility = 'hidden';
                        remaining-=1;
                        score += blocks[k][2] * blocks[k][2];
                        scoreboard.textContent = `score: ${score}`;
                    }
                    else {
                        blocks[k][0].style.backgroundColor = colors[blocks[k][1] - 1];
                    }
                }
            }    
        }   
    }
    if (y_ball >= window.innerHeight - ball.offsetHeight) {
        stop = true;
    }
    x_ball = x_ball + dx;
    y_ball = y_ball + dy;
    ball.style.left = `${x_ball}px`;
    ball.style.top = `${y_ball}px`;
}

 function gameover(){
    document.querySelector('#failed').classList.remove('invisible');
 }

 function win() {
    document.querySelector('#win').classList.remove('invisible');
 }