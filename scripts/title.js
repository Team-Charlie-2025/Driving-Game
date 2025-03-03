// scripts/title.js

function TitleSketch(p) {
  let buttons = [];
  let bgImage;
  let imgTitle;
  let bgMusic = null;
  let debugCheckbox; 

  p.preload = function() {
    if (bgMusic == null) {
      bgMusic = p.loadSound('sound/titleTheme.mp3', () => {bgMusic.loop();} );
      bgMusic.setVolume(0.15); 
    }
    
    bgImage = p.loadImage("graphics/titleBackground.png");
    imgTitle = p.loadImage("graphics/title.png");
    if(!globalsLoaded) loadGlobals(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    createButtons();
    if (window.debug === undefined) {
      window.debug = false;
    }
    debugCheckbox = p.createCheckbox("Debug", window.debug);
    debugCheckbox.position(10, 10);
    debugCheckbox.changed(() => {
      window.debug = debugCheckbox.checked();
      console.log("Debug mode set to:", window.debug);
    });
    // stop loading
    window.LoadingScreen.hide();
  };


  p.draw = function () {
   if (bgImage) { //until background is done, commented out
      p.background(bgImage); 
    } else {
      p.background(222, 236, 250);
    }
    for (let btn of buttons) {
      btn.display(p);
    }
    if (imgTitle) {
      p.image(
        imgTitle,
        p.windowWidth / 10,
        p.windowHeight / 6,
        p.windowWidth / 1.2,
        p.windowHeight / 2.6
      );
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    buttons = [];
    createButtons();
    debugCheckbox.position(10, 10);
  };

  p.mousePressed = function () {
    if(!bgMusic.isPlaying()){//for chrome non-auto play rules
      console.log ("playing");
      bgMusic.loop(); 
    }
    for (let btn of buttons) {
      if (btn.isMouseOver(p)) {
        bgMusic.stop();
        btn.callback();
        break;
      }
    }
  };

  function createButtons() {
    buttons.push(
      new Button("Play", p.width / 2, p.height - p.height * 0.40, function () {
        switchSketch(Mode.LEVELS); //will go to level/difficulty selection
      })
    );
    buttons.push(
      new Button("Garage", p.width / 2, p.height - p.height * 0.25, function () {
        switchSketch(Mode.GARAGE);
      })
    );
    buttons.push(
      new Button("Leaderboard", p.width / 1.2, p.height - p.height * 0.90, function () {
        switchSketch(Mode.LEADERBOARD);
      })
    );
    buttons.push(
      new Button("Settings", p.width / 7, p.height - p.height * 0.15, function () {
        switchSketch(Mode.SETTINGS);
      })
    );
    /*
    buttons.push(
      new Button("Exit", p.width / 2, p.height - p.height * 0.17, function () {
        if (currentSketch) {
          currentSketch.remove();
        }
      })
    );
    buttons.push(
      new Button("Login", p.width / 1.1, p.height - p.height * 0.95, function () {
        switchSketch(Mode.LOGIN);
      })
    );
    buttons.push(
      new Button("Sign Up", p.width / 1.1, p.height - p.height * 0.88, function () {
        switchSketch(Mode.SIGNUP);
      })
      
    );*/
  }
}
