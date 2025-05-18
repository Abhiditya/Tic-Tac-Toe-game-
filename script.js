const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const turnText = document.querySelector('[turn]');
const winText = document.querySelector('[data-winning-message-text]');
const winMsg = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const toggleModeButton = document.getElementById('toggleMode');

const X_CLASS = 'x';
const O_CLASS = 'o';

let oTurn;
let isComputerMode = false;

const winComb = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// === Mode Toggle ===
toggleModeButton.addEventListener('click', () => {
    isComputerMode = !isComputerMode;
    toggleModeButton.textContent = isComputerMode ? 'Computer' : '2 Player';

    toggleModeButton.classList.remove('blue-mode', 'red-mode');
    toggleModeButton.classList.add(isComputerMode ? 'red-mode' : 'blue-mode');

    startGame();
});

toggleModeButton.classList.add('blue-mode');
restartButton.addEventListener('click', startGame);

startGame();

function startGame() {
    oTurn = false;
    turnText.innerText = "X's Turn";
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winMsg.classList.remove('show');

    if (isComputerMode && oTurn) {
        makeComputerMove();
    }
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (isComputerMode && oTurn) {
            setTimeout(makeComputerMove, 300); // slight delay for realism
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    turnText.innerText = `${oTurn ? "O's" : "X's"} Turn`;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS, O_CLASS);
    board.classList.add(oTurn ? O_CLASS : X_CLASS);
}

function checkWin(currentClass) {
    return winComb.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell =>
        cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    );
}

function endGame(draw) {
    winText.innerText = draw ? 'Draw' : `${oTurn ? "O -" : "X -"} Wins`;
    winMsg.classList.add('show');
}

// === COMPUTER MOVE (Minimax AI) ===
function makeComputerMove() {
    const boardState = Array.from(cellElements).map(cell => {
        if (cell.classList.contains(X_CLASS)) return X_CLASS;
        if (cell.classList.contains(O_CLASS)) return O_CLASS;
        return null;
    });

    const bestMove = minimax(boardState, O_CLASS).index;
    const cell = cellElements[bestMove];
    cell.click(); // simulate user click
}

function minimax(board, player) {
    const opponent = player === X_CLASS ? O_CLASS : X_CLASS;
    const emptyIndices = board.map((val, i) => val === null ? i : null).filter(v => v !== null);

    if (checkWinner(board, X_CLASS)) return { score: -10 };
    if (checkWinner(board, O_CLASS)) return { score: 10 };
    if (emptyIndices.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < emptyIndices.length; i++) {
        const index = emptyIndices[i];
        const newBoard = [...board];
        newBoard[index] = player;

        const result = minimax(newBoard, opponent);
        moves.push({ index, score: result.score });
    }

    let bestMove;
    if (player === O_CLASS) {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function checkWinner(board, player) {
    return winComb.some(comb => {
        return comb.every(index => board[index] === player);
    });
}
