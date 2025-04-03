// scripts/login.js

function LoginSketch(p) {
  let usernameID;
  let passwordID;
  let submitLoginBtn;
  let loginElementsCreated = false;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    if (!loginElementsCreated) {
      createLoginElements();
      loginElementsCreated = true;
    }
    ExitIcon = new Button("ExitIcon", p.width - p .width * 0.05, p.height - p.height * 0.95, p.width, p.height, function () { 
      switchSketch(Mode.TITLE);
    });
    // stop loading
    window.LoadingScreen.hide();
  };

  p.draw = function () {
    p.background(230);
    p.fill(50);
    p.textSize(48);
    p.textFont("Comic Sans MS");
    p.text("Login", p.width / 2, 150);
    
    ExitIcon.display(p);
  };

  function createLoginElements() {
    usernameID = p.createInput("");
    usernameID.attribute("placeholder", "Username");
    usernameID.position(p.width / 2 - 100, 300);
    usernameID.size(200);

    passwordID = p.createInput("", "password");
    passwordID.attribute("placeholder", "Password");
    passwordID.position(p.width / 2 - 100, 350);
    passwordID.size(200);

    submitLoginBtn = p.createButton("Login");
    submitLoginBtn.position(p.width / 2 - 50, 400);
    submitLoginBtn.mousePressed(handleLogin);
  }

  function handleLogin() {
    let username = usernameID.value();
    let password = passwordID.value();
    console.log("Login attempted with:", username, password);
    switchSketch(Mode.TITLE);
    removeLoginElements();
  }

  function removeLoginElements() {
    if (usernameID) {
      usernameID.remove();
      usernameID = null;
    }
    if (passwordID) {
      passwordID.remove();
      passwordID = null;
    }
    if (submitLoginBtn) {
      submitLoginBtn.remove();
      submitLoginBtn = null;
    }
    loginElementsCreated = false;
  }
  p.mousePressed = function() {
    if (ExitIcon.isMouseOver(p)) {
      bgMusic.stop();
      ExitIcon.callback();
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    if (usernameID) {
      usernameID.position(p.width / 2 - 100, 300);
    }
    if (passwordID) {
      passwordID.position(p.width / 2 - 100, 350);
    }
    if (submitLoginBtn) {
      submitLoginBtn.position(p.width / 2 - 50, 400);
    }
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };
}


