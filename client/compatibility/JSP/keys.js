// =================
// KEYBOARD HANDLING
// =================

keys = [];

function handleKeydown(evt) {
    if (!($(evt.target).is('input'))) {
	keys[evt.keyCode] = true;
    }
}

function handleKeyup(evt) {
    if (!($(evt.target).is('input'))){
	keys[evt.keyCode] = false;
    }
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}


window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);
