"use strict;"

let m = 6;
let n = 13;
let w = 1;
let score = 0;

const container = document.querySelector('#container');
const board = document.querySelector('#board');
const ball = document.querySelector('#ball');
const scoreboard = document.querySelector('#score');
const levels = document.querySelector("#levels");
const currentlevel = document.querySelector("#currentlevel");
const returnbutton = document.querySelector("#return");
const nextLevel = document.querySelector('#nextlevel');
const playAgain = document.querySelector('#again');

playAgain.addEventListener('click', startAgain);
nextLevel.addEventListener('click', newLevel);
returnbutton.addEventListener('click', goback);

const blocks = [];
const colors = ['cyan', 'darkcyan', 'darkolivegreen', 'darkkhaki', 'darksalmon', 'darkorange', 'indianred', 'crimson', 'red', 'darkred'];
const planets = ['MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE'];
const perks = [1];
const fallingperks = [];
let activeperks = [[0, false], [0, false]];

let x_ball, y_ball, x_board, boardwidth, stop, time;

let dx = 2;
let dy = -2;
let v = Math.sqrt(dx*dx + dy*dy); // speed

let remaining = 0; // blocks remaining
let level_ind; // level indicator

scoreboard.style.left = '30px';
scoreboard.style.top = `${window.innerHeight - 45}px`;
currentlevel.style.left = '30px';
currentlevel.style.top = '45px';
returnbutton.style.left = '30px';
returnbutton.style.top = `${currentlevel.offsetHeight + 150}px`;

for (let i = 0; i < 8; i++) {
    const newl = document.createElement('div');
    newl.classList.add("level");
    newl.textContent = `${i+1}: ${planets[i]}`;
    newl.style.backgroundImage = `url('planet${i+1}.jpg')`;
    newl.style.backgroundSize = '100px';
    newl.style.cursor = 'pointer';
    newl.addEventListener('click', function() { 
        setup(i);
    } );
    levels.appendChild(newl);
}
levels.style.left = `${window.innerWidth/2 - levels.offsetWidth/2}px`;

function setup(i) {
    container.style.display = "inline-block";
    container.style.backgroundImage = `url('planet${i+1}.jpg')`;
    container.style.backgroundSize = `${container.offsetWidth}px`;
    container.style.cursor = 'none';
    board.style.display = "inline-block";
    ball.style.display = "inline-block";
    scoreboard.style.display = "inline-block";
    currentlevel.style.display = "inline-block";
    currentlevel.textContent = `LEVEL ${i+1}: ${planets[i]}`;
    returnbutton.style.display = "inline-block";
    blocks.length = 0;
    fallingperks.length = 0;
    activeperks = [[0, false], [0, false]];
    board.style.left = `${window.innerWidth/2 - board.offsetWidth/2}px`;
    board.style.top = `${window.innerHeight - board.offsetHeight - 50}px`;
    board.style.width = '130px';
    ball.style.left = `${window.innerWidth/2 - ball.offsetWidth/2}px`;
    ball.style.top = `${window.innerHeight - board.offsetHeight - 50 - ball.offsetHeight}px`;
    x_ball = ball.offsetLeft; // 
    y_ball = ball.offsetTop;  // x and y coordinates of the ball
    x_board = board.offsetLeft; // x-coordinate of the board
    boardwidth = board.offsetWidth; // width of the board
    level_ind = i;
    levels.style.display = 'none';
    container.addEventListener('mousemove', board_move);
    document.addEventListener('keyup', start);
    dx = 2;
    dy = -2;
    stop = false; // game-over indicator
    if (i < 2) {
        simpleconfig(m, n, i+1);
    }
    else if (i < 4){
        config1(m, n, i);
    }
    else if (i < 6) {
        config2(10, 5+2*(i-4));
    }
    else {
        config3(8, 9, i);
    }
}

function simpleconfig(m, n, w) {  //arranging blocks
    for (let k = 0; k < m; k++) {
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');            
            block.style.width = `${(container.offsetWidth-6)/(n)-2}px`;
            if (k % 2 == j % 2) {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0, 0]);
            }
            else {
                if ((j + k%4) % 4 < 2) {
                    blocks.push([block, w, w, perks[Math.floor(Math.random()*perks.length)]]);
                    block.style.backgroundColor = colors[w-1];
                }
                else {
                    blocks.push([block, w+1, w+1, perks[Math.floor(Math.random()*perks.length)]]);
                    block.style.backgroundColor = colors[w];
                }
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
                blocks.push([block, w+2, w+2, perks[Math.floor(Math.random()*perks.length)]]);
                remaining += 1;
            }
            else if (k < m/2 + 1 && k > m/2 - 2 && j < n/2 + 1 && j > n/2 - 2 ) {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0, 0]);
            }
            else {
                block.style.backgroundColor = colors[w-1];
                blocks.push([block, w, w, perks[Math.floor(Math.random()*perks.length)]]);
                remaining += 1;
            }
            container.appendChild(block);
        }
    }
}

function config2(n, w) {
    for (let k = 0; k < n - 1; k++) {
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');
            block.style.width = `${(container.offsetWidth-6)/(n)-2}px`;
            if ( j >= Math.abs(k - (n-2)/2) && j < n - Math.abs(k - (n-2)/2)) {
                block.style.backgroundColor = colors[w-Math.abs(k - (n-2)/2)];
                blocks.push([block, w-Math.abs(k - (n-2)/2) + 1, w-Math.abs(k - (n-2)/2) + 1, perks[Math.floor(Math.random()*perks.length)]]);
                remaining += 1;
            }
            else
            {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0, 0]);
            }
            container.appendChild(block);
        }
    }
}

function config3(m, n, w) {
    for (let k = 0; k < m; k++){
        for (let j = 0; j < n; j++) {
            const block = document.createElement('div');
            block.classList.add('tobreak1');
            block.style.width = `${(container.offsetWidth-6)/(n)-2}px`;
            if (k==0 | k == m-1) {
                block.style.backgroundColor = colors[w];
                blocks.push([block, w+1, w+1, perks[Math.floor(Math.random()*perks.length)]]);
                remaining += 1;
            }
            else if (j % 2 == 1) {
                block.style.visibility = 'hidden';
                blocks.push([block, 0, 0, 0]);
            }
            else {
                block.style.backgroundColor = colors[w - Math.abs(j - (n-1)/2)];
                blocks.push([block, w - Math.abs(j - (n-1)/2) + 1, w - Math.abs(j - (n-1)/2) + 1, perks[Math.floor(Math.random()*perks.length)]]);
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
        time = Date.now();
        requestAnimationFrame(playing);
    }
}

function playing() {
    ball_move();
    let ctime = Date.now();
    if (ctime - time > 3000) { //accelerate
        time = ctime;
        dx = dx + Math.sign(dx) * 2/(Math.pow(v, 1.5));
        dy = dy + Math.sign(dy) * 2/(Math.pow(v, 1.5));
        v = Math.sqrt(dx*dx + dy*dy);
    }
    for (let i = 0; i < fallingperks.length; i++) {
        if (fallingperks[i][0].offsetTop > board.offsetTop - fallingperks[i][0].offsetHeight && fallingperks[i][0].offsetTop < board.offsetTop + board.offsetHeight && fallingperks[i][0].offsetLeft > x_board - fallingperks[i][0].offsetWidth && fallingperks[i][0].offsetLeft < x_board + boardwidth) {
            activeperks[fallingperks[i][1]][0] = Date.now() + 5000;
            fallingperks[i][0].style.display = 'none';
        }
        fallingperks[i][0].style.top = `${fallingperks[i][0].offsetTop + 2}px`;
    }
    for (let i = 0; i < activeperks.length; i++) {
        if (activeperks[i][1] && ctime >= activeperks[i][0]) {
            activeperks[i][1] = false;           
            boardwidth -= 40;
            board.style.width = `${boardwidth}px`;             
        }
        else if (!activeperks[i][1] && ctime < activeperks[i][0]) {
            activeperks[i][1] = true;
            boardwidth += 40;
            board.style.width = `${boardwidth}px`; 
        }
    }
    if (fallingperks.length > 0) {
        if (fallingperks[0][0].offsetTop >= container.offsetTop + container.offsetHeight - fallingperks[0][0].offsetHeight) {
        container.removeChild(fallingperks[0][0]);
        let kme = fallingperks.splice(0, 1);
        }
    }
    
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
                        if (blocks[k][3] > 0) {
                            const newperk = document.createElement('div');
                            newperk.classList.add("falling");
                            newperk.style.width = `${blocks[k][0].offsetWidth}px`;
                            newperk.style.top = `${blocks[k][0].offsetTop}px`;
                            newperk.style.left = `${blocks[k][0].offsetLeft}px`;
                            newperk.textContent = "<-->";
                            container.appendChild(newperk);
                            fallingperks.push([newperk, blocks[k][3]]);
                        }
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
                        if (blocks[k][3] > 0) {
                            const newperk = document.createElement('div');
                            newperk.classList.add("falling");
                            newperk.style.width = `${blocks[k][0].offsetWidth}px`;
                            newperk.style.top = `${blocks[k][0].offsetTop}px`;
                            newperk.style.left = `${blocks[k][0].offsetLeft}px`;
                            newperk.textContent = "<-->";
                            container.appendChild(newperk);
                            fallingperks.push([newperk, blocks[k][3]]);
                        }
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
    document.querySelector('#failed').style.display = 'inline-block';
    container.style.cursor = 'default';
    for (let i = 0; i < fallingperks.length; i++) {
        container.removeChild(fallingperks[i][0]);
    }
}

function win() {
    document.querySelector('#win').style.display = 'inline-block';
    container.style.cursor = 'default';
    for (let i = 0; i < fallingperks.length; i++) {
        container.removeChild(fallingperks[i][0]);
    }
}

function startAgain(event){
    remaining = 0;
    for (let i = 0; i < blocks.length; i++){
        container.removeChild(blocks[i][0]);
    }
    document.querySelector('#failed').style.display = 'none';
    scoreboard.textContent = `score: 0`;
    score = 0;
    setup(level_ind);
}

function newLevel(event){
    for (let i = 0; i < blocks.length; i++){
        container.removeChild(blocks[i][0]);
    }
    remaining = 0;
    document.querySelector('#win').style.display = 'none';
    if (level_ind <=7) {
        level_ind +=1;
        setup(level_ind);
    }
    else {
        document.querySelector('#failed').textContent = "YOU PASSED ALL LEVELS!"
    }
}

function goback() {
    document.location.reload();
}