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
    p.fill(50);

    createKeybindButtons(p);
    createSliders(p);

    ExitIcon = new Button(
      "ExitIcon",
      p.width - p.width * 0.05,
      p.height - p.height * 0.95,
      function() {
        bgMusic(Mode.SETTINGS, p, "stop");
        switchSketch(Mode.TITLE);
      }
    );

    bgMusic(Mode.SETTINGS, p, "loop");
    p.windowResized();
    window.LoadingScreen.hide();
  };

  function createKeybindButtons(p) {
    const actions = Object.keys(keybindConfig);
    const startY = p.height / 2 - 20*window.heightScale;
    spacing = 60*window.heightScale;
  
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
      btn.position(p.width / 2 - 112*window.widthScale, startY + i * spacing);
      btn.size(224*window.widthScale, 40 * window.heightScale);
      btn.style("font-family", "PixelFont");
      btn.style("font-size", (25 * window.widthScale) + "px");
      btn.mousePressed(() => {
        rebinding = action;
        console.log(`Click to rebind ${action}`);
      });
      return btn;
    });
  }
  function createSliders(p) {
    musicSlider = p.createSlider(0, 1, getMusicVolume(p), 0.01);
    musicSlider.size(200*window.widthScale, 10*window.heightScale) 
    musicSlider.position(p.width / 2 - 75, p.height / 4 + 25*window.heightScale);
    musicSlider.style('width', '150px');

    effectsSlider = p.createSlider(0, 1, getEffectsVolume(p), 0.01);
    effectsSlider.size(200*window.widthScale, 10*window.heightScale) 
    effectsSlider.position(p.width / 2 - 75, p.height / 4 + 100*window.heightScale);
    effectsSlider.style('width', '150px');
  };
  

  p.draw = function () {
    p.background(100, 193, 232);
    ExitIcon.display(p);

    p.fill(0);
    p.textSize(100 * window.scale);
    p.textFont(window.PixelFont);
    p.text("Settings", p.width / 2, p.height / 6);
    
    p.textSize(40 * window.scale);
    p.textFont(window.PixelFont);
    p.text("Music Volume: " + Math.trunc(musicSlider.value()*100), p.width / 2, p.height / 4);
    p.text("Effects Volume: " + Math.trunc(effectsSlider.value()*100), p.width / 2, p.height / 4 + 75*window.heightScale);
    p.text("Keybinds", p.width / 2, p.height / 2 - 90*window.heightScale);

    setMusicVolume(p, musicSlider.value());
    setEffectsVolume(p, effectsSlider.value());

    if (rebinding) {
      p.push();
      p.textAlign(p.center, p.CENTER);
      p.textSize(25 * window.scale);
      p.fill(215, 0, 0);
      p.text(`Press a key for ${rebinding.toUpperCase()}`, p.width / 2, p.height / 2 - 40*window.heightScale);
      p.pop();
    }
  };
  
  p.windowResized = function (){
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.widthScale + window.heightScale)/2;
    
    for (let button of keybindButtons){
      button.hide();
    }
    musicSlider.hide();
    effectsSlider.hide();

    createKeybindButtons(p);
    createSliders(p);
    ExitIcon = new Button(
      "ExitIcon",
      p.width - p.width * 0.05,
      p.height - p.height * 0.95,
      function() {
        bgMusic(Mode.SETTINGS, p, "stop");
        switchSketch(Mode.TITLE);
      }
    );
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

