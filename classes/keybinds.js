// classes/keybinds.js

const DEFAULT_KEYBINDS = {
    forward: 87,  // W
    backward: 83, // S
    left: 65,     // A
    right: 68,    // D
    boost: 70,    // F
    pause: 27     // ESC (Pause)
  };
  
  function loadKeybinds() {
    let data = localStorage.getItem("keybinds");
    return data ? JSON.parse(data) : DEFAULT_KEYBINDS;
  }
  
  function saveKeybinds(newKeybinds) {
    localStorage.setItem("keybinds", JSON.stringify(newKeybinds));
  }
  
  // Retrieve a specific key action
  function getKeyForAction(action) {
    let keybinds = loadKeybinds();
    return keybinds[action] || DEFAULT_KEYBINDS[action];
  }
  