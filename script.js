"use strict;"
const m1 = 4;
const n1 = 10;
const w1 = 1;

let m = m1;
let n = n1;
let w = w1;
let score = 0;


const body = document.querySelector('#container');
const board = document.querySelector('#board');
const ball = document.querySelector('#ball');
const scoreboard = document.querySelector('#score');

const playAgain = document.querySelector('#again');
playAgain.addEventListener('click', startAgain);
const nextLevel = document.querySelector('#nextlevel');
nextLevel.addEventListener('click', newLevel);

scoreboard.style.left = '30px';
scoreboard.style.top = `${window.innerHeight - 45}px`;

const blocks = [];
let colors = ['cyan', 'darkcyan', 'darkkhaki', 'darksalmon', 'darkolivegreen', 'darkorange', 'indiared', 'crimson', 'red', 'darkred'];

let x_ball, y_ball, x_board, boardwidth, stop;

let dx = 0;
let dy = -5;
let v = Math.sqrt(dx*dx + dy*dy); // speed

let remaining = 0; // blocks remaining
    
container.addEventListener('mousemove', board_move);
document.addEventListener('keyup', start);


// const levels = document.querySelector("#levels");
// const level1 = document.querySelector("#first");
// const level2 = document.querySelector("#second");
// const level3 = document.querySelector("#third");
// const level4 = document.querySelector("#fourth");
// const level5 = document.querySelector("#fifth");
// const level6 = document.querySelector("#sixth");
// const level7 = document.querySelector("#seventh");
// const level8 = document.querySelector("#eight");
// const level9 = document.querySelector("#ninght");

// level1.addEventListener('click', firstlevel);

// function firstlevel(event){
//     simpleconfig(m, n, w);
//     document.addEventListener('keyup', start);
//     levels.classList.add('invisible');
// }

simpleconfig(m, n, w);

function simpleconfig(m, n, w) {  //arranging blocks
    blocks.length = 0;
    board.style.left = `${window.innerWidth/2 - board.offsetWidth/2}px`;
    board.style.top = `${window.innerHeight - board.offsetHeight - 50}px`;
    ball.style.left = `${window.innerWidth/2 - ball.offsetWidth/2}px`;
    //ball.style.top = `${window.innerHeight - board.offsetHeight - 250 - ball.offsetHeight}px`;
    ball.style.top = `${window.innerHeight - board.offsetHeight - 50 - ball.offsetHeight}px`;

    x_ball = ball.offsetLeft; // 
    y_ball = ball.offsetTop;  // x and y coordinates of the ball
    x_board = board.offsetLeft; // x-coordinate of the board
    boardwidth = board.offsetWidth; // width of the board
    stop = false; // game-over indicator

    for (let k = 0; k < m; k++) {
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');
            block.style.backgroundColor = colors[w-1];
            block.style.width = `${100/n - 0.1*n/2}%`;
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
    x_board = event.clientX - boardwidth/2;
    board.style.left = x_board + 'px';       
}


function start(event) {
    if (event.code == 'Space') { //press space to start
        requestAnimationFrame(playing);
    }
}

function playing() {
    ball_move();
    document.removeEventListener('keyup', start);
    if (stop) {
        gameover();
    }
    else if (remaining <= 0) {
        win();
    }
    else {
        requestAnimationFrame(playing);
    }
}

function ball_move() {
    if (x_ball <= window.innerWidth/2 - 350 | x_ball > window.innerWidth/2 - ball.offsetWidth + 350){ //vertical wall hit
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
            dy = -Math.sqrt(v*v - dx*dx);
        }
        else if (x_ball > x_board + boardwidth - 2*ball.offsetWidth && x_ball < x_board + boardwidth) {
            dx = Math.min(dx + v * 0.5 * (x_ball - (x_board + boardwidth - 2*ball.offsetWidth)) / (2*ball.offsetWidth), v*0.9);
            dy = -Math.sqrt(v*v - dx*dx);
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
    score = 0;
    document.querySelector('#failed').classList.remove('invisible');
}

function win() {
    document.querySelector('#win').classList.remove('invisible');
}

function startAgain(event){
    for (let i = 0; i < m*n; ++i){
        body.removeChild(blocks[i][0]);
    }
    document.querySelector('#failed').classList.add('invisible');
    scoreboard.textContent = `score: 0`;
    document.addEventListener('keyup', start);
    simpleconfig(m1, n1, w1);
}

function newLevel(event){
    for (let i = 0; i < m*n; ++i){
        body.removeChild(blocks[i][0]);
    }
    w = w+1;
    document.querySelector('#win').classList.add('invisible');
    document.addEventListener('keyup', start);
    simpleconfig(m, n, w);
}
