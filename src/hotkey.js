// Provides an api for browser windows to set hotkey combinations to functions.
// e.g.:
//  hotkeys.register(['e', 'q', 'alt'], function() {
//    console.log('e, q, and alt have been pressed simultaneously')
//  }, {
//    continuous: false // will not unregister trigger
//  })
//

// these are only available via keyup
const DICTIONARY = {
  'alt': 18,
  'ctrl': 17,
  'shift': 16,
  'win': 91,
}

let pressedKeys = {}

let triggers = []

const digest = function() {
  triggers = triggers.filter((trigger) => {
    const {keys, callback, options} = trigger;
    const areKeysPressed = keys.every(k => pressedKeys[k])
    if(areKeysPressed) {
      callback()

      // add this trigger back the registry but not immediately as user can have keys still pressed
      if (options.continuous) {
        setTimeout(() => triggers.push(trigger), 1000)
      }

      return false;
    }
    return true;
  })
}

// need to convert to uppercase due to mysterious uppercase and lowercase triggers.
const hotkey = {
  register: function(keys, callback, options = {}) {    
    keys = keys.map(k => (DICTIONARY[k] || k.toUpperCase().charCodeAt(0)))
    triggers.push({ keys, callback, options })

    window.document.addEventListener('keypress', e => {
      // console.debug('keypress', String.fromCharCode(e.which))
      pressedKeys[String.fromCharCode(e.which).toUpperCase().charCodeAt(0)] = true
    })

    window.document.addEventListener('keyup', e => {
      // TODO: debounce this
      digest();
      // console.debug('keyup', String.fromCharCode(e.which))
      pressedKeys[String.fromCharCode(e.which).toUpperCase().charCodeAt(0)] = false
    })    
  },
  triggers,
  pressedKeys,
  digest ,
  DICTIONARY
}
window.hotkey = hotkey
export default hotkey