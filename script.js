"use strict;"

// Creating the blocks

const container = document.querySelector('#blocks');
const blocks = [];

for (let k=0; k<248; ++k) {
    const block = document.createElement('div');
    block.classList.add('tobreak');
    blocks[k] = block;
    container.appendChild(block);
}