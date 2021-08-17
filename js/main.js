//this is for sara

const COLS = 10
const ROWS = 20

var c = document.getElementById("tetris");
var w = c.width
var h = c.height
var ctx = c.getContext("2d");

var blocks = [
    [0, 0, 0, 0,
        1, 1, 1, 1
    ],

    [1, 0, 0,
        1, 1, 1
    ],

    [0, 0, 1,
        1, 1, 1,
    ],

    [0, 1, 1,
        0, 1, 1
    ],

    [0, 1, 1,
        1, 1
    ],

    [1, 1, 0,
        0, 1, 1
    ],

    [0, 1, 0,
        1, 1, 1,
    ]
];

var colors = ["cyan", "blue", "orange", "yellow", "green", "red", "purple", "white"]

var board = [];
var currentShape = [];
var xPos = 0; // coords from top left
var yPos = 0;
var currentID = 0;
var froze = false;
var end = false;
var RenderInterval;
var GravityInterval;

function init() {
    for (var y = 0; y < ROWS; y++) {
        board[y] = [];
        for (var x = 0; x < COLS; x++) {
            board[y][x] = 0
        }
    }
}

function drawGrid() {
    for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
            drawSquare(x, y, 8, 0.1)
        }
    }
}

function newTetromino() {
    currentShape = [];
    var id = Math.floor(Math.random() * 7)
    currentID = id
    var shape = blocks[id]
    var color = colors[id]
    var size = (id == 0 && 4) || 3 // 4 size only for line block

    for (var y = 0; y < size; y++) {
        currentShape[y] = []
        for (var x = 0; x < size; x++) {
            var i = size * y + x
            if (typeof shape[i] != 'undefined' && shape[i]) {
                currentShape[y][x] = id + 1
            } else {
                currentShape[y][x] = 0;
            }
        }
    }
    xPos = 3
    yPos = -1
    if (!validMove(0, 0)) {
        yPos = -2
    }
    froze = false
}

function moveDown() {
    if (!froze && currentShape) {
        if (validMove(0, 1)) {
            yPos += 1
        } else {
            froze = true
        }
    }
}

function moveLeft() {
    if (!froze && currentShape) {
        if (validMove(-1, 0)) {
            xPos -= 1
        }
    }
}

function moveRight() {
    if (!froze && currentShape) {
        if (validMove(1, 0)) {
            xPos += 1
        }
    }
}

function rotate(dir) {
    if (!froze && currentShape && currentID != 3) {
        if (dir == "CW") {
            var rotatedShape = spinArrayCockwise(JSON.parse(JSON.stringify(currentShape)))
        } else {
            var rotatedShape = spinArrayCounterCockwise(JSON.parse(JSON.stringify(currentShape)))
        }
        if (validMove(0, 0, rotatedShape)) {
            currentShape = rotatedShape
        }
    }

    function spinArrayCockwise(arr) {
        var newarr = []
        var length = arr[0].length
        for (var y = 0; y < (length); y++) {
            newarr[y] = []
            for (var x = 0; x < (length); x++) {
                newarr[y][x] = arr[(length) - x - 1][y];
            }
        }
        return newarr;
    }

    function spinArrayCounterCockwise(arr) {
        var newarr = []
        var length = arr[0].length
        for (var y = 0; y < (length); y++) {
            for (var x = 0; x < length; x++) {
                if (!newarr[length - x - 1]) newarr[length - x - 1] = [];
                var oldval = arr[y][x]
                newarr[length - x - 1][y] = oldval
            }
        }
        return newarr;
    }
}

function keyPress(key) {
    switch (key) {
        case 'left':
            moveLeft()
            break
        case 'right':
            moveRight()
            break
        case 'down':
            moveDown()
            break;
        case 'rotateCW':
            rotate('CW')
            break;
        case 'rotateCCW':
            rotate('CCW')
            break;
    }
}

function validMove(xOffset, yOffset, testBlock) {
    var block = testBlock || currentShape
    var newX = xPos + xOffset
    var newY = yPos + yOffset
    var length = block[0].length
    for (var y = 0; y < length; y++) {
        for (var x = 0; x < length; x++) {
            var blockCordY = newY + y
            var blockCordX = newX + x
            if (block[y][x] != 0) {
                if (blockCordY > ROWS - 1) return false; // above y = -1 since pieces spawn at -1
                if (blockCordX < 0 || blockCordX > COLS - 1) return false;
                if (blockCordY > -1 && board[blockCordY][blockCordX] != 0) return false;
            }
        }
    }
    return true
}

function printBoard() {
    var space = false
    for (var y = 0; y < ROWS; y++) {
        var row = ""
        for (var x = 0; x < COLS; x++) {
            var piece = false;
            if (typeof currentShape[y - yPos] != 'undefined') {
                var piece = currentShape[y - yPos][x - xPos]
            }
            if (piece) {
                row += " " + piece
            } else {
                row += " " + (board[y][x])
            }
        }
        space = !space
    }
}

function renderBoard() {
    for (var y = 0; y < ROWS; y++) {
        var row = ""
        for (var x = 0; x < COLS; x++) {
            var piece = false;
            if (typeof currentShape[y - yPos] != 'undefined') {
                var piece = currentShape[y - yPos][x - xPos]
            }
            if (piece) {
                if (piece != 0) drawSquare(x, y, piece, 1)
            } else {
                if (board[y][x] != 0) drawSquare(x, y, board[y][x], 1)
            }
        }
    }
}

function paintPieceToBoard() {
    var piece = currentShape
    end = false
    var size = piece.length

    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            var xCord = xPos + x;
            var yCord = yPos + y;
            if (piece[y][x] != 0) {
                if (typeof board[yCord] != 'undefined') board[yCord][xCord] = piece[y][x]
                if (yCord < 0) end = true;
            }
        }
    }
}

function clearLines() {
    for (var y = 0; y < ROWS; y++) {
        var full = true;
        for (var x = 0; x < COLS; x++) {
            if (board[y][x] == 0) {
                full = false
                break;
            }
        }
        if (full) {
            var emptyRow = [];
            for (var x = 0; x < COLS; x++) {
                emptyRow[x] = 0;
            }
            board.splice(y, 1)
            board.unshift(emptyRow)

        }
    }
}

function renderStepped() {
    ctx.clearRect(0, 0, w, h);
    drawGrid()
    if (froze) {
        paintPieceToBoard()
        clearLines()
        if (!end) newTetromino();
    }
    if (end) {
        clearInterval(RenderInterval)
        clearInterval(GravityInterval)
        newGame()
    }
    renderBoard()
}

function gravity() {
    if (currentShape) {
        moveDown()
    }
}

function drawSquare(x, y, id, gridTransparency = 1) { // coords from upper left corner
    var BlockPixelWidth = w / COLS
    var BlockPixelHeight = h / ROWS
    ctx.fillStyle = colors[id - 1]
    ctx.fillRect(x * BlockPixelWidth, y * BlockPixelHeight, BlockPixelWidth, BlockPixelHeight)

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,' + gridTransparency + ')';
    ctx.strokeRect(x * BlockPixelWidth, y * BlockPixelHeight, BlockPixelWidth, BlockPixelHeight, 0);
}

function newGame() {
    end = false;
    init()
    newTetromino()
    RenderInterval = setInterval(renderStepped, 1000 / 60)
    GravityInterval = setInterval(gravity, 1000)
}

newGame()