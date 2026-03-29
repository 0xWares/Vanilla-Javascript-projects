const board = document.querySelector('.board');
const blockH = 30;
const blockW = 30;
let intervalId = null;

const cols = Math.floor(board.clientWidth / blockW);
const rows = Math.floor(board.clientHeight / blockH);
let food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random()* cols)}



const blocks = [];
let direction = 'down';
const snakeCoordinate = [
  {x: 8, y: 20},
  {x: 8, y: 21},
  {x: 8, y: 22},
]
for(let row = 0; row < rows; row++){
  for(let col = 0; col < cols; col++){
    const block = document.createElement('div');
    block.classList.add('blocks');
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}
function drawSnake(){
let head = null;
blocks[`${food.x}-${food.y}`].classList.add('food');
  if(direction === 'left'){
    head = {x: snakeCoordinate[0].x, y: snakeCoordinate[0].y - 1};
  }else if(direction === 'right'){
    head = {x: snakeCoordinate[0].x, y: snakeCoordinate[0].y + 1};
  }else if(direction === 'up'){
    head = {x: snakeCoordinate[0].x - 1, y: snakeCoordinate[0].y};
  }else if(direction === 'down'){
    head = {x: snakeCoordinate[0].x + 1, y: snakeCoordinate[0].y };
  }

  snakeCoordinate.forEach(activeBlocks => {
    blocks[`${activeBlocks.x}-${activeBlocks.y}`].classList.remove('fill');
  })

  if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
    alert("Game over");
    clearInterval(intervalId);
  }
  snakeCoordinate.unshift(head);
  snakeCoordinate.pop();





  snakeCoordinate.forEach(activeBlocks => {
    blocks[`${activeBlocks.x}-${activeBlocks.y}`].classList.add('fill');
  })
}


intervalId = setInterval(()=>{
  

  drawSnake();

},400);


addEventListener('keydown', (e) => {
  if(e.key === "ArrowUp"){
    direction = "up";
  }else if(e.key === "ArrowDown"){
    direction = "down";

  }else if(e.key === "ArrowLeft"){
    direction = "left";
  }else if(e.key === "ArrowRight"){
    direction = "right";
  }
  
})

