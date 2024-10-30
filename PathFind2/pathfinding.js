const rows = 20;
const cols = 20;
let grid = [];
let start = { row: 0, col: 0 };
let end = { row: 19, col: 19 };

// Initialize grid
function createGrid() {
  const gridElement = document.getElementById("grid");
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (i === start.row && j === start.col) cell.classList.add("start");
      if (i === end.row && j === end.col) cell.classList.add("end");
      grid[i][j] = cell;
      gridElement.appendChild(cell);
    }
  }
}
createGrid();

// BFS Algorithm
function runBFS() {
  clearGrid();
  const queue = [start];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  visited[start.row][start.col] = true;

  while (queue.length) {
    const { row, col } = queue.shift();
    grid[row][col].classList.add("visited");

    if (row === end.row && col === end.col) {
      tracePath(parent);
      return;
    }

    for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValid(newRow, newCol, visited)) {
        queue.push({ row: newRow, col: newCol });
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = { row, col };
      }
    }
  }
}

// DFS Algorithm
function runDFS() {
  clearGrid();
  const stack = [start];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  visited[start.row][start.col] = true;

  while (stack.length) {
    const { row, col } = stack.pop();
    grid[row][col].classList.add("visited");

    if (row === end.row && col === end.col) {
      tracePath(parent);
      return;
    }

    for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValid(newRow, newCol, visited)) {
        stack.push({ row: newRow, col: newCol });
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = { row, col };
      }
    }
  }
}

// Dijkstra's Algorithm
function runDijkstra() {
  clearGrid();
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  const queue = [{ ...start, dist: 0 }];
  dist[start.row][start.col] = 0;

  while (queue.length) {
    const { row, col, dist: currentDist } = queue.shift();
    grid[row][col].classList.add("visited");

    if (row === end.row && col === end.col) {
      tracePath(parent);
      return;
    }

    for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const newRow = row + dr;
      const newCol = col + dc;
      const newDist = currentDist + 1;

      if (isValid(newRow, newCol) && newDist < dist[newRow][newCol]) {
        queue.push({ row: newRow, col: newCol, dist: newDist });
        dist[newRow][newCol] = newDist;
        parent[newRow][newCol] = { row, col };
      }
    }
  }
}

// Check if the cell is within the grid and not visited
function isValid(row, col, visited) {
  return row >= 0 && row < rows && col >= 0 && col < cols && !visited[row][col];
}

// Trace the shortest path
function tracePath(parent) {
  let cell = end;
  while (cell) {
    const { row, col } = cell;
    grid[row][col].classList.add("path");
    cell = parent[row][col];
  }
}

// Clear visited cells and path
function clearGrid() {
  grid.flat().forEach(cell => {
    cell.classList.remove("visited", "path");
  });
}
