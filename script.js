"use strict;"

// Creating the blocks

const container = document.querySelector('#blocks');
const board = document.querySelector('#board');
let x_board = board.offsetLeft; // x-coordinate of the board
let boardwidth = board.offsetWidth; // width of the board
const blocks = [];

document.addEventListener('keydown', move);

for (let k=0; k<248; ++k) {
    const block = document.createElement('div');
    block.classList.add('tobreak');
    blocks[k] = block;
    container.appendChild(block);
}

function move(event) {
    if (event.code == 'ArrowLeft') {
        if (x_board > boardwidth/2 + 2) {
            x_board = x_board - 2
            board.style.left = `${x_board}px`
        }
    }
    if (event.code == 'ArrowRight') {
        if (x_board < window.innerWidth - boardwidth/2 - 2) {
            x_board = x_board + 2
            board.style.left = `${x_board}px`
        }
    }
}