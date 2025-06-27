const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, score, gameLoop, changingDirection;

function startGame() {
  snake = [{ x: 8, y: 10 }];
  direction = { x: 1, y: 0 };
  food = getRandomFoodPosition();
  score = 0;
  changingDirection = false;
  scoreDiv.textContent = "Score: " + score;
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, 100);
}

function draw() {
  // Move snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collision with wall or self
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameLoop);
    ctx.fillStyle = "#f44336";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 110, 210);
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDiv.textContent = "Score: " + score;
    food = getRandomFoodPosition();
  } else {
    snake.pop();
  }

  // Draw
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "#ffd600";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw snake
  ctx.fillStyle = "#4caf50";
  snake.forEach((segment, i) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
  });

  changingDirection = false;
}

function getRandomFoodPosition() {
  let position;
  while (true) {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    if (!snake.some(segment => segment.x === position.x && segment.y === position.y)) {
      return position;
    }
  }
}

function changeDirection(e) {
  if (changingDirection) return;
  changingDirection = true;
  const key = e.key;
  if ((key === "ArrowLeft" || key === "a") && direction.x !== 1) {
    direction = { x: -1, y: 0 };
  }
  else if ((key === "ArrowUp" || key === "w") && direction.y !== 1) {
    direction = { x: 0, y: -1 };
  }
  else if ((key === "ArrowRight" || key === "d") && direction.x !== -1) {
    direction = { x: 1, y: 0 };
  }
  else if ((key === "ArrowDown" || key === "s") && direction.y !== -1) {
    direction = { x: 0, y: 1 };
  }
}

document.addEventListener('keydown', changeDirection);
restartBtn.addEventListener('click', startGame);

startGame();