// Variables for puzzle
let board = [];
let size = 4;
let tileSize;
let emptyTile = { row: size - 1, col: size - 1 }; // Bottom right is initially empty
let solved = false;
let canMove = true;

// Dark mode color scheme
const colors = {
  background: "#121212",
  tile: "#1e1e1e",
  tileStroke: "#444444",
  text: "#e0e0e0",
  solvedText: "#4CAF50",
};

function setup() {
  // Create a canvas that fits a nice sized puzzle
  let canvasSize = min(windowWidth * 0.8, windowHeight * 0.8, 500);
  createCanvas(canvasSize, canvasSize);
  tileSize = canvasSize / size;

  // Initialize the board
  initializeBoard();
  shuffleBoard(100); // 100 random moves to shuffle
}

function draw() {
  background(colors.background);
  drawBoard();

  // Display win message if solved
  if (solved) {
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(colors.solvedText);
    text("SOLVED!", width / 2, height / 2);
  }
}

function initializeBoard() {
  board = [];
  let count = 1;
  // Create a solved board (1-15, with bottom right empty)
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      if (i === size - 1 && j === size - 1) {
        row.push(0); // Empty tile is represented as 0
      } else {
        row.push(count++);
      }
    }
    board.push(row);
  }
  // Reset empty tile position
  emptyTile = { row: size - 1, col: size - 1 };
  solved = false;
}

function shuffleBoard(moves) {
  // Temporarily disable checking for solved state during shuffle
  canMove = false;

  for (let i = 0; i < moves; i++) {
    let possibleMoves = getPossibleMoves();
    let randomMove = random(possibleMoves);

    // Move a random tile adjacent to the empty space
    swapWithEmpty(randomMove.row, randomMove.col);
  }

  // Re-enable move checking
  canMove = true;
}

function getPossibleMoves() {
  let moves = [];
  // Check adjacent tiles (up, down, left, right)
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  for (let dir of directions) {
    const newRow = emptyTile.row + dir.row;
    const newCol = emptyTile.col + dir.col;

    // If within bounds
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      moves.push({ row: newRow, col: newCol });
    }
  }

  return moves;
}

function drawBoard() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = board[i][j];

      // Don't draw the empty tile
      if (value === 0) continue;

      // Draw the tile
      fill(colors.tile);
      stroke(colors.tileStroke);
      rect(j * tileSize, i * tileSize, tileSize, tileSize, 5);

      // Draw the number
      fill(colors.text);
      textAlign(CENTER, CENTER);
      textSize(tileSize / 3);
      text(value, j * tileSize + tileSize / 2, i * tileSize + tileSize / 2);
    }
  }
}

function mousePressed() {
  if (!canMove || solved) return;

  // Calculate which tile was clicked
  const clickedRow = floor(mouseY / tileSize);
  const clickedCol = floor(mouseX / tileSize);

  // Check if the clicked tile is adjacent to the empty tile
  if (isAdjacent(clickedRow, clickedCol)) {
    swapWithEmpty(clickedRow, clickedCol);
    checkIfSolved();
  }
}

function isAdjacent(row, col) {
  // Check if the coordinates are in bounds
  if (row < 0 || row >= size || col < 0 || col >= size) return false;

  // Check if adjacent to empty tile (horizontally or vertically)
  return (Math.abs(row - emptyTile.row) === 1 && col === emptyTile.col) || (Math.abs(col - emptyTile.col) === 1 && row === emptyTile.row);
}

function swapWithEmpty(row, col) {
  // Swap the clicked tile with the empty tile
  board[emptyTile.row][emptyTile.col] = board[row][col];
  board[row][col] = 0;

  // Update empty tile position
  emptyTile = { row, col };
}

function checkIfSolved() {
  let count = 1;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // Skip the last cell which should be empty
      if (i === size - 1 && j === size - 1) {
        if (board[i][j] !== 0) return;
      } else {
        // Check if numbers are in sequence
        if (board[i][j] !== count++) return;
      }
    }
  }

  // If we get here, the puzzle is solved
  solved = true;
}

// Add reset button when key is pressed
function keyPressed() {
  if (key === "r" || key === "R") {
    initializeBoard();
    shuffleBoard(100);
  }
}
