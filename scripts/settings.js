function SettingsSketch(p){
  let bgImage; 
  let isImageLoaded = false; 
  let volumeSlider; // Slider for sound volume
  let sound; // Sound object
  let backButton; // Back button

  p.preload = function () {
    sound = p.loadSound('sound/titleTheme.mp3'); 
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
    // Create a volume slider
    volumeSlider = p.createSlider(0, 100, 50); // Min 0, Max 100, Default 50
    volumeSlider.position(p.width / 2 - 75, p.height / 2 + 50);
    volumeSlider.style('width', '150px');

    ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, function () { 
      switchSketch(Mode.TITLE);
    }); // x button

    // Start playing sound 
    sound.loop();
    sound.setVolume(volumeSlider.value() / 100); // Set initial volume

    // Stop loading screen once setup is done
    window.LoadingScreen.hide();
  };

  p.draw = function () {
    p.background(100, 193, 232); //change background in future?
    ExitIcon.display(p);

    // Draw text on top
    p.fill(50);
    p.textSize(48);
    p.text("Settings", p.width / 2, p.height / 2 - 50);

    // Display current volume value
    p.textSize(24);
    p.text("Volume: " + getVolume(), p.width / 2, p.height / 2 + 100);

    // Apply volume change dynamically
    sound.setVolume(getVolume() / 100);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };
  p.mousePressed = function() {
    if (ExitIcon.isMouseOver(p)) {
      bgMusic.stop();
      ExitIcon.callback();
    }
  }

  // Function to return the current volume level
  function getVolume() {
    return volumeSlider.value();
  }

}

  