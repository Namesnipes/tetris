const leftKey = document.getElementById("input1")
leftKey.addEventListener('keydown', function(e) {
    updateKey(e, 'left')
})
const rightKey = document.getElementById("input2")
rightKey.addEventListener('keydown', function(e) {
    updateKey(e, 'right')
})
const downKey = document.getElementById("input3")
downKey.addEventListener('keydown', function(e) {
    updateKey(e, 'down')
})

const hardDropKey = document.getElementById("input4")
hardDropKey.addEventListener('keydown', function(e) {
    updateKey(e, 'hardDrop')
})

const rotateKeyCW = document.getElementById("input5")
rotateKeyCW.addEventListener('keydown', function(e) {
    updateKey(e, 'rotateCW')
})
const rotateKeyCCW = document.getElementById("input6")
rotateKeyCCW.addEventListener('keydown', function(e) {
    updateKey(e, 'rotateCCW')
})


//fetch keybinds from cookies, else fall back to default keybinds
var keys = getCookie("keybinds")

if (keys) {
    try {
        keys = JSON.parse(keys)
    } catch (e) {
        console.error(e)
        setCookie("keybinds", "")
        keys = ""
    }
}

if (!keys) { // format - keycode: [keyname, corresponding tetris input, isKeyHeldDown]
    keys = { //We could include the textbox object in the array values so we don't have to use the ugly switch statement below (I think its beautiful though)
        37: ['ArrowLeft', 'left', false],
        39: ['ArrowRight', 'right', false],
        40: ['ArrowDown', 'down', false],
        90: ['z', 'rotateCW', false],
        88: ['x', 'rotateCCW', false],
        32: ['spacebar', 'hardDrop', false]
    };
}

//set current keybinds in textboxes
for (keyCode in keys) {
    var keyName = keys[keyCode][0]
    var action = keys[keyCode][1]
    switch (action) {
        case 'left':
            leftKey.value = keyName
            break;
        case 'right':
            rightKey.value = keyName
            break;
        case 'down':
            downKey.value = keyName
            break;
        case 'rotateCW':
            rotateKeyCW.value = keyName
            break;
        case 'rotateCCW':
            rotateKeyCCW.value = keyName
            break;
        case 'hardDrop':
            hardDropKey.value = keyName
            break;
    }
}


//update key table, update textbox value, and update cookie keybinds on keypress
function updateKey(e, Action) {
    console.log(e.keyCode + " " + Action)
    var code = e.keyCode
    if(code in keys){
      e.target.style['background-color'] = 'red'
      setTimeout(function(){
        e.target.style['background-color'] = null
      },1000)
      return
    };
    e.target.value = e.key
    for (keyCode in keys) {
        if (keys[keyCode][1] == Action) {
            delete keys[keyCode]
            keys[code] = [e.key, Action, false]
            break;
        }
    }
    setCookie("keybinds", JSON.stringify(keys))
}


document.body.onkeydown = function(e) {
    if (document.activeElement.tagName != "INPUT" && typeof keys[e.keyCode] != 'undefined') {
        var isDown = keys[e.keyCode][2]
        if(isDown) return
        keys[e.keyCode][2] = true
        keyPress(keys[e.keyCode][1],false);
    }
};

document.body.onkeyup = function(e) {
    if (document.activeElement.tagName != "INPUT" && typeof keys[e.keyCode] != 'undefined') {
        var isDown = keys[e.keyCode][2]
        keys[e.keyCode][2] = false
        keyPress(keys[e.keyCode][1],true);
    }
};
