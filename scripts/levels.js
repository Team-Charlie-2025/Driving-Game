function LevelsSketch(p) {
    let buttons = [];

    p.preload = function() {
        bgImage = p.loadImage("graphics/mainbg.png");
        imgTitle = p.loadImage("graphics/title.png");
        loadSound(p); // no music on page currently
    };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        createLevelButtons(); //level option buttons
        ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, p.width, p.height, function () { 
            switchSketch(Mode.TITLE);
          }); // x button
    
        // stop loading
        window.LoadingScreen.hide();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        buttons = [];
        createLevelButtons();
    };

    p.draw = function () {
        p.background(100, 193, 232); //change background in future?
        ExitIcon.display(p);
     
        for (let btn of buttons) {
        btn.display(p);
        }
    };
    p.mousePressed = function () {
        for (let btn of buttons) {
          if (btn.isMouseOver(p)) {
            btn.callback();
            break;
          }
        }
        if (ExitIcon.isMouseOver(p)) {
            ExitIcon.callback();
          }
      };
      p.keyPressed = function () {
        if (p.keyCode === p.ESCAPE) {
            switchSketch(Mode.TITLE);
        }
      };

    function createLevelButtons () { 
        //basic implementation, all go to same play mode
        //modify for different levels/maps
        buttons.push(
            new Button("EXTRA HARD", p.width / 2, p.height - p.height * 0.80,p.width, p.height, function () {
                window.difficulty = 1.5;
                console.log("Difficulty changed to EXTRA HARD value, " + window.difficulty);
              switchSketch(Mode.PLAY); //CHANGE TO LEVELS
            }, "red"));
        buttons.push(
            new Button("HARD", p.width / 2, p.height - p.height * 0.60,p.width, p.height, function () {
                window.difficulty = 1.25;
                console.log("Difficulty changed to HARD value, " + window.difficulty);
                switchSketch(Mode.PLAY); //CHANGE TO LEVELS
                }, "orange"));
        buttons.push(
            new Button("MEDIUM", p.width / 2, p.height - p.height * 0.40,p.width, p.height, function () {
                window.difficulty = 1.0;
                console.log("Difficulty changed to MEDIUM, value " + window.difficulty);
                switchSketch(Mode.PLAY); //CHANGE TO LEVELS
                }, "yellow"));
        buttons.push(
            new Button("EASY", p.width / 2, p.height - p.height * 0.20,p.width, p.height, function () {
                window.difficulty = 0.8;
                console.log("Difficulty changed to EASY, value " + window.difficulty);
                switchSketch(Mode.PLAY); //CHANGE TO LEVELS
                }, "green"));
    };

}