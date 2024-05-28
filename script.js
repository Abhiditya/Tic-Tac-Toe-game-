const X_CLASS = 'x'
const O_CLASS = 'o'
const winComb=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6]
]

const cellElements= document.querySelectorAll('[data-cell]')
const board= document.getElementById('board')
const turnText= document.querySelector('[turn]')
const winText= document.querySelector('[data-winning-message-text]')
const winMsg= document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
let oTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame(){
    oTurn=false
    turnText.innerText="X's Turn"
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once : true})
    })    
    setBoardHoverClass()
    winMsg.classList.remove('show')
}

function handleClick(e){
    const cell = e.target
    const currentClass = oTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)){
        endGame(false)
    }
    else if(isDraw()){
        endGame(true)
    }
    else {
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw){
    if(draw){
        winText.innerText= 'Draw!'
    }
    else{
        winText.innerText= `${oTurn ? "O -" : "X -"} Wins!`
    }
    winMsg.classList.add('show')
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function swapTurns(){
    oTurn=!oTurn
    turnText.innerText=`${oTurn ? "O's": "X's"} Turn`
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if(oTurn){
        board.classList.add(O_CLASS)
    }
    else{
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass){
    return winComb.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}
