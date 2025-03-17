function SettingsSketch(p){
  let volumeSlider; // Slider for sound volume

  p.preload = function () {
    loadSound(p); 
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
    // Create a volume slider
    volumeSlider = p.createSlider(0, 100, getSoundVolume(p));
    volumeSlider.position(p.width / 2 - 75, p.height / 2 + 50);
    volumeSlider.style('width', '150px');

    ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, p.width, p.height, function () { 
      switchSketch(Mode.TITLE);
    }); // x button

    window.titlebgMusic.loop();
    // Stop loading screen once setup is done
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
    p.text("Music Volume: " + volumeSlider.value(), p.width / 2, p.height / 2 + 100);

    musicVolumeChange(p, volumeSlider.value());
  };
  

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      window.titlebgMusic.stop();
      switchSketch(Mode.TITLE);
    }
  };
  p.mousePressed = function() {
    if (ExitIcon.isMouseOver(p)) {
      window.titlebgMusic.stop();
      ExitIcon.callback();
    }
  }

}
