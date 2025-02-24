function SettingsSketch(p) {
  let keybinds = loadKeybinds();
  let selectedKey = null;

  p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(230);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(32);
      p.fill(50);
      p.text("Settings", p.width / 2, 50);

      let y = 100;
      Object.keys(keybinds).forEach(action => { // Loops through each keybind action
          let btn = p.createButton(`${action}: ${String.fromCharCode(keybinds[action])}`); //Converts the keycode into a readable character
          btn.position(p.width / 2 - 100, y);
          btn.mousePressed(() => {
              selectedKey = action;
              btn.html("Press any key...");
          });
          y += 50;
      });

      let saveBtn = p.createButton("Save Keybinds");
      saveBtn.position(p.width / 2 - 50, y + 50);
      saveBtn.mousePressed(() => {
          saveKeybinds(keybinds);
          switchSketch(Mode.TITLE);
      });

      window.LoadingScreen.hide();
  };

  p.keyPressed = function () {
      if (selectedKey) {
          keybinds[selectedKey] = p.keyCode;
          selectedKey = null;
      }
  };
}

