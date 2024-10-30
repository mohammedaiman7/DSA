// Predefined Sudoku board with some values filled in (0 represents an empty cell)
const board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
  
  let grid = [];
  
  // Create the grid layout
  function createGrid() {
    const gridElement = document.getElementById("grid");
    for (let i = 0; i < 9; i++) {
      grid[i] = [];
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.innerText = board[i][j] !== 0 ? board[i][j] : "";
        if (board[i][j] !== 0) {
          cell.classList.add("filled");
        }
        grid[i][j] = cell;
        gridElement.appendChild(cell);
      }
    }
  }
  createGrid();
  
  // Helper function to slow down the solving process for visualization
  const DELAY_MS = 10;
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Backtracking Algorithm to solve Sudoku using probable values
  async function solveSudoku() {
    const probableValues = getAllProbableValues();
    if (await solve(0, 0, probableValues)) {
      console.log("Sudoku solved!");
    } else {
      console.log("No solution exists!");
    }
  }
  
  // Generate all possible values for each cell
  function getAllProbableValues() {
    const probableValues = Array.from({ length: 9 }, () => Array(9).fill(null));
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          probableValues[row][col] = getPossibleValues(row, col);
        }
      }
    }
  
    return probableValues;
  }
  
  // Get possible values for a specific cell
  function getPossibleValues(row, col) {
    const possible = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
    // Remove values in the same row and column
    for (let i = 0; i < 9; i++) {
      possible.delete(board[row][i]);
      possible.delete(board[i][col]);
    }
  
    // Remove values in the 3x3 subgrid
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        possible.delete(board[boxRow + i][boxCol + j]);
      }
    }
  
    return Array.from(possible);
  }
  
  // Recursive function to solve the board using backtracking and probable values
  async function solve(row, col, probableValues) {
    if (row === 9) return true; // Base case: Reached the end of the grid
  
    if (col === 9) return await solve(row + 1, 0, probableValues); // Move to the next row
  
    if (board[row][col] !== 0) return await solve(row, col + 1, probableValues); // Skip filled cells
  
    const candidates = probableValues[row][col]; // Get possible values for the cell
  
    for (let num of candidates) {
      if (isValid(row, col, num)) {
        board[row][col] = num; // Place the number
        grid[row][col].innerText = num; // Update the UI
        grid[row][col].classList.add("solved");
  
        await delay(DELAY_MS); // Slow down the process for visualization
  
        if (await solve(row, col + 1, probableValues)) {
          return true;
        }
  
        // Backtrack
        board[row][col] = 0;
        grid[row][col].innerText = "";
        grid[row][col].classList.remove("solved");
      }
    }
  
    return false; // Trigger backtracking
  }
  
  // Check if it's valid to place the number at board[row][col]
  function isValid(row, col, num) {
    // Check the row and column
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false;
      }
    }
  
    // Check the 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
  
    return true;
  }
  