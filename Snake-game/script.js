const board = document.querySelector('.board');
const score = document.querySelector('.score');
const highestScore = document.querySelector('.highest-score');
const startBtn = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGame = document.querySelector('.start-game');
const gameOver = document.querySelector('.game-over');
const restartBtn = document.querySelector('.restart')

const blockH = 30;
const blockW = 30;
let intervalId = null;
let current_score = 0;
let highest_score = 0;

const cols = Math.floor(board.clientWidth / blockW);
const rows = Math.floor(board.clientHeight / blockH);
let food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random()* cols)}

const blocks = [];
let direction = 'down';
let snakeCoordinate = [
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
    
    clearInterval(intervalId);
    modal.style.display = 'flex';
    startGame.style.display = 'none';
    gameOver.style.display = 'flex';
    return;
  }
  snakeCoordinate.unshift(head);
  snakeCoordinate.pop();

  if(head.x === food.x && head.y === food.y){
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random()* cols)}
    blocks[`${food.x}-${food.y}`].classList.add('food');

    current_score++;
    score.innerHTML = current_score; 

    if(current_score > highest_score){
      highest_score = current_score;
      localStorage.setItem('highest_score', highest_score);
      highestScore.innerHTML = highest_score;
    }
    snakeCoordinate.unshift(head);
  }

  snakeCoordinate.forEach(activeBlocks => {
    blocks[`${activeBlocks.x}-${activeBlocks.y}`].classList.add('fill');
  })
}



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


startBtn.addEventListener('click', () => {
  modal.style.display = "none";
  intervalId = setInterval(()=>{
  drawSnake();
},300);
})

restartBtn.addEventListener('click', restartGame); 

function restartGame(){
  clearInterval(intervalId);

  document.querySelectorAll('.food').forEach(el => el.classList.remove('food'));
  document.querySelectorAll('.fill').forEach(el => el.classList.remove('fill'));

  current_score = 0;
  score.innerHTML = 0;
  direction = 'down';

  food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
  snakeCoordinate = [
    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 5, y: 4 },
  ];

  modal.style.display = 'none';
  gameOver.style.display = 'none';
  startGame.style.display = 'flex';

  intervalId = setInterval(() => drawSnake(), 300);
}