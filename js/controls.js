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
const rotateKeyCW = document.getElementById("input4")
rotateKeyCW.addEventListener('keydown', function(e) {
    updateKey(e, 'rotateCW')
})
const rotateKeyCCW = document.getElementById("input5")
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

if (!keys) {
    keys = { //We could include the textbox object in the array values so we don't have to use the ugly switch statement below (I think its beautiful though)
        37: ['ArrowLeft', 'left'],
        39: ['ArrowRight', 'right'],
        40: ['ArrowDown', 'down'],
        90: ['z', 'rotateCW'],
        88: ['x', 'rotateCCW'],
        32: ['spacebar', 'drop']
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
        case 'drop':
            break;
    }
}


//update key table, update textbox value, and update cookie keybinds on keypress
function updateKey(e, Action) {
    e.target.value = e.key
    var code = e.keyCode
    for (keyCode in keys) {
        if (keys[keyCode][1] == Action) {
            delete keys[keyCode]
            keys[code] = [e.key, Action]
            break;
        }
    }
    setCookie("keybinds", JSON.stringify(keys))
}

document.body.onkeydown = function(e) {
    if (document.activeElement.tagName != "INPUT" && typeof keys[e.keyCode] != 'undefined') {
        keyPress(keys[e.keyCode][1]);
    }
};