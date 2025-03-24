let keybindConfig = {
  boost: 70,     // 'f'
  forward: 87,   // 'w'
  backward: 83,  // 's'
  left: 65,      // 'a'
  right: 68,     // 'd'
  drift: 16      // Shift
};

function loadKeybinds() {
  const saved = localStorage.getItem("keybinds");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure we keep numbers (keyCodes)
      Object.keys(keybindConfig).forEach(action => {
        if (typeof parsed[action] === "number") {
          keybindConfig[action] = parsed[action];
        }
      });
    } catch (e) {
      console.error("Failed to parse saved keybinds:", e);
    }
  }
}

function saveKeybinds() {
  localStorage.setItem("keybinds", JSON.stringify(keybindConfig));
  console.log("Keybinds saved:", keybindConfig);
}

function getKeyForAction(action) {
  return keybindConfig[action];
}

function setKeyForAction(action, keyCode) {
  keybindConfig[action] = keyCode;
  saveKeybinds();
}

loadKeybinds();
