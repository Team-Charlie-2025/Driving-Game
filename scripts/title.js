// scripts/title.js

function TitleSketch(p) {
  let buttons = [];
  let bgImage;
  let imgTitle;
  let debugCheckbox; 
  let showInfo = false;
  let windowHeightScale, windowWidthScale, windowScale;
  p.preload = function() {    
    loadMusic(p);
    loadSoundEffects(p);
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
    debugCheckbox.position(10*window.widthScale, 10*window.heightScale);
    debugCheckbox.changed(() => {
      window.debug = debugCheckbox.checked();
      console.log("Debug mode set to:", window.debug);
    });
    bgMusic(Mode.TITLE, p, "loop"); //console.log("play");
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

  if (showInfo) {
    p.fill(34, 139, 34, 200); // Dark green with transparency
    p.noStroke();
    p.rect(p.width / 2 - 150, p.height / 2 - 50, 300, 100, 15); // Centered info box

    p.fill(255);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Still to be modified", p.width / 2, p.height / 2);
  }
};

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.widthScale + window.heightScale)/2;
    buttons = [];
    createButtons();
    //debugCheckbox.position(10, 10);
  };

  p.mousePressed = function () {
    bgMusic(Mode.TITLE, p, "loop"); 
    for (let btn of buttons) {
      if (btn.isMouseOver(p)) {
        bgMusic(Mode.TITLE, p, "stop");
        btn.callback();
        break;
      }
    }
  };
  function toggleInfo() {
    showInfo = !showInfo;
  }

  function createButtons() {
    buttons.push(
      new Button("Play", p.width / 2, p.height - p.height * 0.38, p.width, p.height, function () {
        switchSketch(Mode.LEVELS); //will go to level/difficulty selection
      }, "navy")
    );
    buttons.push(
      new Button("Garage", p.width / 2, p.height - p.height * 0.20, p.width, p.height, function () {
        switchSketch(Mode.GARAGE);
      }, "blue")
    );
    buttons.push(
      new Button("Settings", 200 * window.widthScale, 890*window.heightScale, p.width, p.height, function () {
          switchSketch(Mode.SETTINGS);
      })
  ); 
  buttons.push(
    new Button("Leaderboard", 1600 * window.widthScale, 150*window.heightScale, p.width, p.height, function () {
      switchSketch(Mode.LEADERBOARD);
    })
  );
  buttons.push(
    new Button("HELP", 1828*window.widthScale, 32*window.heightScale, p.width, p.height, function () {
      toggleInfo(); 
    }, "blue")
  );
  buttons.push(
    new Button("Map Editor", 1750 * window.widthScale, 969*window.heightScale, p.width, p.height, function () {
      switchSketch(Mode.MAP_EDITOR);
    }, "blue")
  );

  buttons.push(
    new Button("Signup", 1750*window.widthScale, 810*window.heightScale, p.width, p.height, function () {
      switchSketch(Mode.SIGNUP);
    }, "blue")
  );

  buttons.push(
    new Button("Login", p.width*7.4 / 8, p.height - p.height * 0.15, p.width, p.height, function () {
      switchSketch(Mode.LOGIN);
    }, "blue")
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
      new Button("Sign Up", p.width / 1.1, p.height - p.height * 0.88, function () {
        switchSketch(Mode.SIGNUP);
      })
      
    );*/
  }
}
