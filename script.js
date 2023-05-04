"use strict;"

const m1 = 6;
const n1 = 12;
const w1 = 1;

let m = m1;
let n = n1;
let w = w1;
let score = 0;

const container = document.querySelector('#container');
const board = document.querySelector('#board');
const ball = document.querySelector('#ball');
const scoreboard = document.querySelector('#score');
const levels = document.querySelector("#levels");

const playAgain = document.querySelector('#again');
playAgain.addEventListener('click', startAgain);
const nextLevel = document.querySelector('#nextlevel');
nextLevel.addEventListener('click', newLevel);

const blocks = [];
let colors = ['cyan', 'darkcyan', 'darkkhaki', 'darksalmon', 'darkolivegreen', 'darkorange', 'indiared', 'crimson', 'red', 'darkred'];

let x_ball, y_ball, x_board, boardwidth, stop;

let dx = 2;
let dy = -2;
let v = Math.sqrt(dx*dx + dy*dy); // speed

let remaining = 0; // blocks remaining
let level_ind; // level indicator

board.style.left = `${window.innerWidth/2 - board.offsetWidth/2}px`;
board.style.top = `${window.innerHeight - board.offsetHeight - 50}px`;
ball.style.left = `${window.innerWidth/2 - ball.offsetWidth/2}px`;
//ball.style.top = `${window.innerHeight - board.offsetHeight - 250 - ball.offsetHeight}px`;
ball.style.top = `${window.innerHeight - board.offsetHeight - 50 - ball.offsetHeight}px`;
scoreboard.style.left = '30px';
scoreboard.style.top = `${window.innerHeight - 45}px`;
stop = false;

for (let i = 0; i < 5; i++) {
    const newl = document.createElement('div');
    newl.classList.add("level");
    newl.textContent = `level ${i+1}`;
    newl.addEventListener('click', function() { 
        setup(i);
    } );
    levels.appendChild(newl);
}
levels.style.left = `${window.innerWidth/2 - levels.offsetWidth/2}px`;

function setup(i) {
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
    level_ind = i;
    levels.classList.add('invisible');
    container.addEventListener('mousemove', board_move);
    document.addEventListener('keyup', start);
    dx = 2;
    dy = -2;
    stop = false; // game-over indicator
    if (i < 2) {
        simpleconfig(m, n, i+1);
    }
    else {
        config1(m, n, i)
    }
}

function simpleconfig(m, n, w) {  //arranging blocks
    for (let k = 0; k < m; k++) {
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');
            block.style.backgroundColor = colors[w-1];
            block.style.width = `${(container.offsetWidth-6)/(n)-2}px`;
            if (k % 2 == j % 2) {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0]);
            }
            else {
                blocks.push([block, w, w]);
                remaining += 1;
            }
            container.appendChild(block);
        }
    }
}

function config1(m, n, w) {
    for (let k = 0; k < m; k++){
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');
            block.style.width = `${(container.offsetWidth-6)/(n)-2}px`;
            if (k==0 | k==m-1 | j==0 | j==n-1) {
                block.style.backgroundColor = colors[w+1];
                blocks.push([block, w+2, w+2]);
                remaining += 1;
            }
            else if (k < m/2 + 1 && k > m/2 - 2 && j < n/2 + 1 && j > n/2 - 2 ) {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0]);
            }
            else {
                block.style.backgroundColor = colors[w-1];
                blocks.push([block, w, w]);
                remaining += 1;
            }
            container.appendChild(block);
        }
    }
}

function board_move(event) {
    x_board = Math.min(Math.max(event.clientX - boardwidth/2, container.offsetLeft + 3), container.offsetLeft + container.offsetWidth - boardwidth -3);
    board.style.left =  x_board + 'px';
}

function start(event) {
    if (event.code == 'Space') { //press space to start
        document.removeEventListener('keyup', start);
        requestAnimationFrame(playing);
    }
}

function playing() {
    ball_move();
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
    if (x_ball <= window.innerWidth/2 - 350 | x_ball >= window.innerWidth/2 - ball.offsetWidth + 350){ //vertical wall hit
        dx = -dx ; 
    }
    if (y_ball <= container.offsetTop){ //ceiling hit
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
    if (y_ball >= container.offsetTop + container.offsetHeight - ball.offsetHeight) {
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
    remaining = 0;
    for (let i = 0; i < m*n; ++i){
        container.removeChild(blocks[i][0]);
    }
    document.querySelector('#failed').classList.add('invisible');
    scoreboard.textContent = `score: 0`;
    score = 0;
    setup(level_ind);
}

function newLevel(event){
    for (let i = 0; i < m*n; ++i){
        container.removeChild(blocks[i][0]);
    }
    remaining = 0;
    document.querySelector('#win').classList.add('invisible');
    level_ind +=1;
    setup(level_ind);
}
