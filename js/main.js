//this is for sara

const COLS = 10
const ROWS = 20

const queueCOLS = 4;
const queueROWS = 12;

var c = document.getElementById("tetris");
var w = c.width
var h = c.height
var ctx = c.getContext("2d");

var q = document.getElementById("queueCanvas");
var queueW = q.width
var queueH = q.height
var queueCtx = q.getContext("2d");

q.width = q.width + 100 // move the content of queue into the middle of the canvas, some pixels get cut off from the edge if u dont
queueCtx.translate(10,0)

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

var colors = ["#a8ebff", "#6666ed", "#f7a540", "#ffdf75", "#a1d186", "#fa5252", "#ce79ed", "#23204a"]

var board = [];
var queueBoard = [];

var currentShape = [];
var xPos = 0; // coords from top left
var yPos = 0;
var currentID = 0;
var froze = false;
var end = false;
var RenderInterval;
var GravityInterval;

// Tetromino movement functions

var isSoftDropping = false
var currentGravity = 700 //gravity of current level

function moveDown(keyUp, isUserInput = false, cellsDown = 1) {
    if(cellsDown <= 0) return

    if(isUserInput && isSoftDropping && keyUp){
      isSoftDropping = false
      setGravity(1000)
    }

    if(isUserInput && !keyUp && !isSoftDropping){
        isSoftDropping = true
        setGravity(100)
    }

    if (!froze && currentShape && !keyUp) {
        if (validMove(0, 1)) {
            yPos += 1
            moveDown(false,false,cellsDown-1)
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

function hardDrop(){
  setGravity(0)

  /*
	if (!froze && currentShape) {
    var blocksToMoveDown = 0
		for(var i = 0; i<20-yPos; i++){
			if(validMove(0,i)){
        blocksToMoveDown = i
			} else {
        break
      }
		}
    yPos += blocksToMoveDown
    froze = true
	}
  */
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

function keyPress(key,isUp) {
  if(isUp && key != 'down') return
    switch (key) {
        case 'left':
            moveLeft()
            break
        case 'right':
            moveRight()
            break
        case 'down':
            moveDown(isUp,true)
            break;
        case 'rotateCW':
            rotate('CW')
            break;
        case 'rotateCCW':
            rotate('CCW')
            break;
        case 'hardDrop':
        	hardDrop()
        	break;
    }
}

// the Meat

var bag;
var nextBag;

function getNthTetrominoInQueue(n){
	var tet = bag[n-1];
	if(tet == undefined){
		tet = nextBag[n-bag.length-1]
	}
  return tet
}

function useNextTetromino(){
	var pieceId = bag.shift()
	if(bag.length <= 0){
		bag = nextBag
		nextBag = shuffleArray([0,1,2,3,4,5,6])
	}
	return pieceId
}

function newTetromino() {
    currentShape = [];
    var id = useNextTetromino()
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

//render and debug func

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
                if (piece != 0) drawSquare(x, y, piece, false, 1)
            } else {
                if (board[y][x] != 0) drawSquare(x, y, board[y][x], false, 1)
            }
        }
    }
}

function renderQueue(){
  for(var nthPiece = 1; nthPiece < 4; nthPiece++){
    var theId = getNthTetrominoInQueue(nthPiece)
    var thePiece = [...blocks[theId]]
    var size = (theId == 0 && 4) || 3
    var padding = Array((size * 3) * (nthPiece-1)).fill(0)
    thePiece = padding.concat(thePiece)
    for(var x = 0; x < (queueCOLS * queueROWS); x++){
      var y = Math.floor(x/size)
      var realX = x % size
      if(thePiece[x] == 1){
        drawSquare(realX,y,theId+1,true,1)
      }
    }
  }
}

function drawSquare(x, y, id, isQueue, gridTransparency = 1, isGrid = false) { // coords from upper left corner
    var thisCols = (isQueue && queueCOLS) || COLS
    var thisRows = (isQueue && queueROWS) || ROWS
    var thisCtx = (isQueue && queueCtx) || ctx
    var BlockPixelWidth = ((isQueue && queueW) || w) / thisCols
    var BlockPixelHeight = ((isQueue && queueH) || h) / thisRows

    thisCtx.fillStyle = colors[id - 1]
    thisCtx.fillRect(x * BlockPixelWidth, y * BlockPixelHeight, BlockPixelWidth, BlockPixelHeight)

    if(isGrid) {thisCtx.lineWidth = 1;}
    else {thisCtx.lineWidth = 4;}
    //background grid stroke
    thisCtx.strokeStyle = 'rgba(242, 237, 228,' + gridTransparency + ')';


    //line block
    if(id==1){
      thisCtx.strokeStyle = 'rgba(112, 200, 219,' + gridTransparency + ')';
    }
    //The Blue One:
    else if(id==2){
      thisCtx.strokeStyle = 'rgba(65, 65, 158,' + gridTransparency + ')';
    }
    //o range
    else if(id==3){
      thisCtx.strokeStyle = 'rgba(219, 131, 24,' + gridTransparency + ')';
    }
    //blocc
    else if(id==4){
      thisCtx.strokeStyle = 'rgba(245, 192, 78,' + gridTransparency + ')';
    }
    // gween OwO
    else if(id==5){
      thisCtx.strokeStyle = 'rgba(97, 150, 68,' + gridTransparency + ')';
    }
    // me af
    else if(id==6){
      thisCtx.strokeStyle = 'rgba(191, 46, 46,' + gridTransparency + ')';
    }
    //my t is spinning
    else if(id==7){
      thisCtx.strokeStyle = 'rgba(146, 77, 171,' + gridTransparency + ')';
    }

    thisCtx.strokeRect(x * BlockPixelWidth+thisCtx.lineWidth/2, y * BlockPixelHeight+thisCtx.lineWidth/2, BlockPixelWidth-thisCtx.lineWidth, BlockPixelHeight-thisCtx.lineWidth);

}




function drawGrid(q = false) {
  var thisCols = (q && queueCOLS) || COLS
  var thisRows = (q && queueROWS) || ROWS
  var thisTransparency = (q && '0') || 0.1
    for (var y = 0; y < thisRows; y++) {
        for (var x = 0; x < thisCols; x++) {
            drawSquare(x, y, 8, q, thisTransparency,true)
        }
    }
}

//game loop stuff

function renderStepped() {
    ctx.clearRect(0, 0, w, h);
    queueCtx.clearRect(-1, 0, queueW+2, queueH); // i think the queueCtx.translate(10,0) has some floating point errors, theres a pixel that isn't cleared if you dont do it from -1 to queueW +2
    drawGrid()
    drawGrid(true)
    if (froze) {
        setGravity(currentGravity)
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
    renderQueue()
}

function init() {
    for (var y = 0; y < ROWS; y++) {
        board[y] = [];
        for (var x = 0; x < COLS; x++) {
            board[y][x] = 0
        }
    }

    for (var y = 0; y < queueROWS; y++) {
        queueBoard[y] = [];
        for (var x = 0; x < queueCOLS; x++) {
            queueBoard[y][x] = 0
        }
    }

}

function gravity(cellsPerFrame) { // increase function call rate to increase gravity
    if (currentShape) {
       moveDown(false,false,cellsPerFrame)
    }
}

function setGravity(msPerFall){
  var cellsPerFrame = 1
  if(msPerFall < (1000/60)){
    cellsPerFrame = (1000/60) / msPerFall
    msPerfall = (1000/60)
  }
  clearInterval(GravityInterval)
  GravityInterval = setInterval(gravity, msPerFall, Math.round(cellsPerFrame))
}

function newGame() {
    end = false;
    init()
    bag = shuffleArray([0,1,2,3,4,5,6])
	nextBag = shuffleArray([0,1,2,3,4,5,6])
    newTetromino()
    RenderInterval = setInterval(renderStepped, 1000 / 60)
    setGravity(currentGravity)
}

newGame()
