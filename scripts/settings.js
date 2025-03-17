// settings.js

function SettingsSketch(p){
  let volumeSlider; // Slider for sound volume

  p.preload = function () {
    if(!globalsLoaded) loadGlobals(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);

    musicSlider = p.createSlider(0, 1, getMusicVolume(), 0.01);
    musicSlider.position(p.width / 2 - 75, p.height / 2 + 50);
    musicSlider.style('width', '150px');

    effectsSlider = p.createSlider(0, 1, getEffectsVolume(), 0.01);
    effectsSlider.position(p.width / 2 - 75, p.height / 2 + 100);
    effectsSlider.style('width', '150px');

    ExitIcon = new Button(
      "ExitIcon",
      p.width - p.width * 0.05,
      p.height - p.height * 0.95,
      p.width,
      p.height,
      function() {
        switchSketch(Mode.TITLE);
      }
    );

    music("title", p, 'loop');
    window.LoadingScreen.hide();
  };

  p.draw = function () {
    p.background(100, 193, 232); //change background in future?
    ExitIcon.display(p);

    // Draw text on top
    p.fill(50);
    p.textSize(48);
    p.textFont(window.PixelFont);
    p.text("Settings", p.width / 2, p.height / 4);

    // Display current volume value
    p.textSize(24);
    p.textFont(window.PixelFont);
    p.text("Music Volume: " + musicSlider.value(), p.width / 2, p.height / 2 + 80);
    p.text("Effects Volume: " + effectsSlider.value(), p.width / 2, p.height / 2 + 130);

    // updates with helper functions
    setMusicVolume(musicSlider.value());
    setEffectsVolume(effectsSlider.value());
  };

  

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      // stops music from playing - should be done in all functions that cause sketch changes
      if (window.music && window.music["title"] && window.music["title"][0].isPlaying()) {
        window.music["title"][0].stop();
      }
      switchSketch(Mode.TITLE);
    }
  };
  p.mousePressed = function() {
    if (ExitIcon.isMouseOver(p)) {
      if (window.music && window.music["title"] && window.music["title"][0].isPlaying()) {
        window.music["title"][0].stop();
      }
      ExitIcon.callback();
    }
  };
}
