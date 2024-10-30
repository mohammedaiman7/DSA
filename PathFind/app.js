const grid = document.getElementById('grid');
const rows = 20;
const cols = 20;
let start = {x: 0, y: 0};
let end = {x: 19, y: 19};
let walls = [];

function createGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (row === start.x && col === start.y) {
                cell.classList.add('start');
            } else if (row === end.x && col === end.y) {
                cell.classList.add('end');
            }

            cell.addEventListener('click', () => toggleWall(row, col));
            grid.appendChild(cell);
        }
    }
}

function toggleWall(row, col) {
    const cell = document.querySelector(`div[data-row='${row}'][data-col='${col}']`);
    if (cell.classList.contains('wall')) {
        cell.classList.remove('wall');
        walls = walls.filter(w => !(w.x === row && w.y === col));
    } else {
        cell.classList.add('wall');
        walls.push({x: row, y: col});
    }
}

// BFS Algorithm
function runBFS() {
    clearGrid();
    const queue = [start];
    const visited = new Set();
    const parent = {};

    while (queue.length > 0) {
        const current = queue.shift();
        const {x, y} = current;

        if (x === end.x && y === end.y) {
            return highlightPath(parent);
        }

        const neighbors = getNeighbors(x, y);
        neighbors.forEach(n => {
            if (!visited.has(`${n.x},${n.y}`) && !isWall(n.x, n.y)) {
                queue.push(n);
                visited.add(`${n.x},${n.y}`);
                parent[`${n.x},${n.y}`] = {x, y};
                document.querySelector(`div[data-row='${n.x}'][data-col='${n.y}']`).classList.add('visited');
            }
        });
    }
}

// DFS Algorithm
function runDFS() {
    clearGrid();
    const stack = [start];
    const visited = new Set();
    const parent = {};

    while (stack.length > 0) {
        const current = stack.pop();
        const {x, y} = current;

        if (x === end.x && y === end.y) {
            return highlightPath(parent);
        }

        const neighbors = getNeighbors(x, y);
        neighbors.forEach(n => {
            if (!visited.has(`${n.x},${n.y}`) && !isWall(n.x, n.y)) {
                stack.push(n);
                visited.add(`${n.x},${n.y}`);
                parent[`${n.x},${n.y}`] = {x, y};
                document.querySelector(`div[data-row='${n.x}'][data-col='${n.y}']`).classList.add('visited');
            }
        });
    }
}

// Dijkstra's Algorithm
function runDijkstra() {
    clearGrid();
    
    const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    
    const pq = new MinPriorityQueue({ priority: x => x.dist }); // Priority Queue based on distance
    pq.enqueue({ ...start, dist: 0 });
    dist[start.row][start.col] = 0;
  
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  
    while (!pq.isEmpty()) {
      const { row, col, dist: currentDist } = pq.dequeue().element;
  
      // Color the node as visited only when dequeued (actually processed)
      if (!visited[row][col]) {
        visited[row][col] = true;
        grid[row][col].classList.add("visited");
        //document.querySelector(`div[data-row='${row}'][data-col='${col}']`).classList.add('visited');
  
        if (row === end.row && col === end.col) {
          tracePath(parent);
          return;
        }
  
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
  
          if (isValid(newRow, newCol) && currentDist + 1 < dist[newRow][newCol]) {
            dist[newRow][newCol] = currentDist + 1;
            pq.enqueue({ row: newRow, col: newCol, dist: dist[newRow][newCol] });
            parent[newRow][newCol] = { row, col };
          }
        }
      }
    }
  }
  
  

// Utility functions
function getNeighbors(x, y) {
    const neighbors = [];
    if (x > 0) neighbors.push({x: x - 1, y});
    if (x < rows - 1) neighbors.push({x: x + 1, y});
    if (y > 0) neighbors.push({x, y: y - 1});
    if (y < cols - 1) neighbors.push({x, y: y + 1});
    return neighbors;
}

function isWall(x, y) {
    return walls.some(w => w.x === x && w.y === y);
}

function highlightPath(parent) {
    let {x, y} = end;
    while (x !== start.x || y !== start.y) {
        document.querySelector(`div[data-row='${x}'][data-col='${y}']`).classList.add('path');
        ({x, y} = parent[`${x},${y}`]);
    }
}

function clearGrid() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('visited', 'path');
    });
}

createGrid();
class MinPriorityQueue {
    constructor({ priority }) {
      this.priority = priority;
      this.queue = [];
    }
  
    // Add element to the queue and sort it based on priority (distance)
    enqueue(element) {
      this.queue.push(element);
      this.queue.sort((a, b) => this.priority(a) - this.priority(b));
    }
  
    // Remove and return the element with the smallest priority
    dequeue() {
      return this.queue.shift(); // Removes the first element (lowest distance)
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
