const leftKey = document.getElementById("input1")
leftKey.addEventListener('keydown',function(e){updateKey(e,'left')})
const rightKey = document.getElementById("input2")
rightKey.addEventListener('keydown',function(e){updateKey(e,'right')})
const downKey = document.getElementById("input3")
downKey.addEventListener('keydown',function(e){updateKey(e,'down')})
const rotateKeyCW = document.getElementById("input4")
rotateKeyCW.addEventListener('keydown',function(e){updateKey(e,'rotateCW')})
const rotateKeyCCW = document.getElementById("input5")
rotateKeyCCW.addEventListener('keydown',function(e){updateKey(e,'rotateCCW')})

var keys = getCookie("keybinds")
if(keys){
    console.log(keys)
    keys = JSON.parse(keys)
} else {
    keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        90: 'rotateCW',
        88: 'rotateCCW',
        32: 'drop'
    };
}
console.log(keys)

function updateKey(e,Key){
    e.target.value = e.key
    var code = e.keyCode
    for(key in keys){
        if(keys[key] == Key){
            delete keys[key]
            keys[code] = Key
            break;
        }
    }
    setCookie("keybinds",JSON.stringify(keys))
}
document.body.onkeydown = function( e ) {
    if (document.activeElement.tagName != "INPUT" && typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
    }
};