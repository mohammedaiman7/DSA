const grid = [
    ['W', 'O', 'R', 'D', 'S'],
    ['S', 'E', 'A', 'R', 'C'],
    ['B', 'A', 'C', 'K', 'T'],
    ['T', 'R', 'A', 'C', 'K'],
    ['F', 'I', 'N', 'D', 'S']
];

const wordsToFind = ["WORD", "BACK", "TRACK", "FIND"];

let rows = grid.length;
let cols = grid[0].length;

function startSolving() {
    resetGridDisplay();
    wordsToFind.forEach(word => {
        const found = findWord(word);
        if (found) log(`Word Found: ${word}`);
        else log(`Word Not Found: ${word}`);
    });
}

function resetGridDisplay() {
    const wordGrid = document.getElementById('word-grid');
    wordGrid.innerHTML = '';
    grid.forEach(row => {
        row.forEach(letter => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            wordGrid.appendChild(cell);
        });
    });
}

function log(message) {
    const logDiv = document.getElementById('log');
    logDiv.textContent = message;
}

function findWord(word) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (backtrack(word, 0, row, col)) return true;
        }
    }
    return false;
}

function backtrack(word, index, row, col) {
    if (index === word.length) return true;

    if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] !== word[index]) {
        return false;
    }

    // Temporarily mark the cell
    const temp = grid[row][col];
    grid[row][col] = '#';

    // Highlight the path visually
    highlightCell(row, col);

    const directions = [
        [0, 1],  // right
        [1, 0],  // down
        [0, -1], // left
        [-1, 0], // up
        [1, 1],  // down-right (diagonal)
        [-1, -1], // up-left (diagonal)
        [1, -1], // down-left (diagonal)
        [-1, 1]  // up-right (diagonal)
    ];

    // Try all directions
    for (const [dx, dy] of directions) {
        if (backtrack(word, index + 1, row + dx, col + dy)) {
            return true;
        }
    }

    // Unmark the cell (backtrack)
    grid[row][col] = temp;

    return false;
}

function highlightCell(row, col) {
    const wordGrid = document.getElementById('word-grid');
    const cell = wordGrid.children[row * cols + col];
    cell.classList.add('highlight');
}
