function SettingsSketch(p)

{
  let bgImage; 
  let isImageLoaded = false; 
  let volumeSlider; // Slider for sound volume
  let sound; // Sound object
  let backButton; // Back button

  p.preload = function () 
  {
    bgImage = p.loadImage('graphics/BackGround.jpg', () =>
       {
      isImageLoaded = true; 
    });

    sound = p.loadSound('sound/titleTheme.mp3'); 
  };

  p.setup = function ()
   {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
    // Create a volume slider
    volumeSlider = p.createSlider(0, 100, 50); // Min 0, Max 100, Default 50
    volumeSlider.position(p.width / 2 - 75, p.height / 2 + 50);
    volumeSlider.style('width', '150px');

    // Create a back button
    backButton = p.createButton('Back');
    backButton.position(p.width / 2 - 40, p.height / 2 + 150);
    backButton.mousePressed(goBack); // Call goBack function when pressed

    // Style the back button
    backButton.style('padding', '10px');
    backButton.style('background-color', '#4CAF50');
    backButton.style('color', 'white');
    backButton.style('border', 'none');
    backButton.style('border-radius', '5px');
    backButton.style('cursor', 'pointer');
    backButton.style('font-size', '20px');

    // Start playing sound 
    sound.loop();
    sound.setVolume(volumeSlider.value() / 100); // Set initial volume

    // Stop loading screen once setup is done
    window.LoadingScreen.hide();
  };

  p.draw = function () {
    if (isImageLoaded) {
      p.image(bgImage, 0, 0, p.width, p.height); // Draw background if loaded
    } else {
      p.background(230); // Fallback background while loading
    }

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

  // Function to return the current volume level
  function getVolume() {
    return volumeSlider.value();
  }

  function goBack() {
    switchSketch(Mode.TITLE);  
  }
}
