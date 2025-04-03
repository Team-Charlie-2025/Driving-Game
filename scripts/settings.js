function SettingsSketch(p){
  let musicSlider, effectsSlider;
  let ExitIcon;
  let rebinding = null;
  let keybindButtons = [];

  p.preload = function () {
    loadMusic(p);
    loadSoundEffects(p);
    if (!globalsLoaded) loadGlobals(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);

    createKeybindButtons(p);

    musicSlider = p.createSlider(0, 1, getMusicVolume(p), 0.01);
    musicSlider.position(p.width / 2 - 75, p.height / 2 + 240);
    musicSlider.style('width', '150px');

    effectsSlider = p.createSlider(0, 1, getEffectsVolume(p), 0.01);
    effectsSlider.position(p.width / 2 - 75, p.height / 2 + 300);
    effectsSlider.style('width', '150px');

    ExitIcon = new Button(
      "ExitIcon",
      p.width - p.width * 0.05,
      p.height - p.height * 0.95,
      p.width,
      p.height,
      function() {
        bgMusic(Mode.SETTINGS, p, "stop");
        switchSketch(Mode.TITLE);
      }
    );

    bgMusic(Mode.SETTINGS, p, "loop");
    window.LoadingScreen.hide();
  };

  function createKeybindButtons(p) {
    const actions = Object.keys(keybindConfig);
    const startY = p.height / 2 - 100;
    const spacing = 40;
  
    const keyCodeToString = code => {
      if (code >= 65 && code <= 90) return String.fromCharCode(code); // A-Z
      if (code >= 48 && code <= 57) return String.fromCharCode(code); // 0-9
      switch (code) {
        case 37: return "←";
        case 38: return "↑";
        case 39: return "→";
        case 40: return "↓";
        case 32: return "Space";
        case 16: return "Shift";
        case 13: return "Enter";
        case 20: return "Caps Lock";
        case 9: return "Tab";
        default: return `KeyCode:${code}`;
      }
    };
  
    keybindButtons = actions.map((action, i) => {
      const btn = p.createButton(`${action.toUpperCase()}: ${keyCodeToString(getKeyForAction(action))}`);
      btn.position(p.width / 2 - 75, startY + i * spacing);
      btn.size(150, 30);
      btn.style("font-family", "PixelFont");
      btn.mousePressed(() => {
        rebinding = action;
        console.log(`Click to rebind ${action}`);
      });
      return btn;
    });
  }
  

  p.draw = function () {
    p.background(100, 193, 232);
    ExitIcon.display(p);

    p.fill(50);
    p.textSize(48);
    p.textFont(window.PixelFont);
    p.text("Settings", p.width / 2, p.height / 4);

    p.textSize(24);
    p.textFont(window.PixelFont);
    p.text("Music Volume: " + Math.trunc(musicSlider.value()*100), p.width / 2, p.height / 2 + 220);
    p.text("Effects Volume: " + Math.trunc(effectsSlider.value()*100), p.width / 2, p.height / 2 + 280);

    setMusicVolume(p, musicSlider.value());
    setEffectsVolume(p, effectsSlider.value());

    if (rebinding) {
      p.push();
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(20);
      p.fill(255, 0, 0);
      p.text(`Press a key for ${rebinding.toUpperCase()}`, p.width - 20, p.height - 30);
      p.pop();
    }
  };

  p.keyPressed = function () {
    if (rebinding) {
      const code = p.keyCode;
      console.log(`Binding ${rebinding} to keyCode ${code}`);
      setKeyForAction(rebinding, code);
  
      keybindButtons.forEach(btn => btn.remove());
      createKeybindButtons(p);
      rebinding = null;
    }
  
    if (p.keyCode === p.ESCAPE) {
      bgMusic(Mode.SETTINGS, p, "stop");
      switchSketch(Mode.TITLE);
    }
  };

  p.mousePressed = function () {
    if (ExitIcon.isMouseOver(p)) {
      bgMusic(Mode.SETTINGS, p, "stop");
      ExitIcon.callback();
    }
  };
}

