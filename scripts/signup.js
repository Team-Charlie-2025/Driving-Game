function SignupSketch(p) {
  let usernameInput, passwordInput, signupButton, message;
  let bgImage;

  p.preload = function () {
    loadMusic(p);
    loadSoundEffects(p);
    bgImage = p.loadImage("graphics/titleScreen/titleBackground2.png");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
    p.textFont(window.PixelFont);

    ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, function () {
      switchSketch(Mode.TITLE);
    });

    createSignup(p);

    window.LoadingScreen.hide();
  };
  function createSignup(p){
    // Username input
    usernameInput = p.createInput();
    usernameInput.size(200 * window.widthScale, 20 * window.heightScale);
    usernameInput.style("font-size", (20 * window.widthScale) + "px");
    usernameInput.position(p.width / 2 - 100* window.widthScale, p.height / 2 - 30* window.heightScale);
    usernameInput.attribute('placeholder', 'Username');

    // Password input
    passwordInput = p.createInput('', 'password');
    passwordInput.size(200 * window.widthScale, 20 * window.heightScale);
    passwordInput.style("font-size", (20 * window.widthScale) + "px");
    passwordInput.position(p.width / 2 - 100* window.widthScale, p.height / 2);
    passwordInput.attribute('placeholder', 'Password');

    // Signup button
    signupButton = p.createButton('Sign-Up');
    signupButton.size(100* window.widthScale, 30* window.heightScale);
    signupButton.style("font-family", "PixelFont");
    signupButton.style("font-size", (25 * window.widthScale) + "px");
    signupButton.position(p.width / 2 - 50* window.widthScale, p.height / 2 + 40* window.heightScale);
    signupButton.mousePressed(sendSignupData);

    // Message element
    message = p.createP('');
    message.position(p.width / 2 - 200* window.widthScale, p.height / 2 + 80* window.heightScale);
    message.style('color', 'green');
    message.hide();
  }

  function sendSignupData() {
    let username = usernameInput.value();
    let password = passwordInput.value();

    fetch(`${BACKEND_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          message.html("Signup successful! Redirecting...");
          message.style('color', 'green');
          message.show();
          setTimeout(() => {
            switchSketch(Mode.LOGIN);
          }, 2000);
        } else {
          message.html("Signup failed: " + data.error);
          message.style('color', 'red');
          message.show();
        }
      })
      .catch(error => {
        console.error("Error:", error);
        message.html("Error connecting to server.");
        message.style('color', 'red');
        message.show();
      });
  }

  p.draw = function () {
    if (bgImage) {
      p.background(bgImage);
    } else {
      p.background(222, 236, 250);
    }
    ExitIcon.display(p);
    p.fill(255, 255, 255, 200);
    p.noStroke();
    p.rect(p.width / 2 - (500 * window.widthScale / 2), p.height / 2 - (500 * window.heightScale / 2), (500 * window.widthScale), (500 * window.heightScale), 15);

    p.textSize(100*window.scale);
    p.fill(50);
    p.text("Signup", p.width / 2, p.height / 2 - 100 *window.heightScale);
  };
  p.windowResized = function (){
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.widthScale + window.heightScale)/2;
    ExitIcon = new Button("ExitIcon",
        p.width - p.width * 0.05,
        p.height - p.height * 0.95,
        function() {
          bgMusic(Mode.SETTINGS, p, "stop");
          switchSketch(Mode.TITLE);
        });
      usernameInput.hide();
      passwordInput.hide();
      signupButton.hide();
      createSignup(p);
  };

  p.mousePressed = function () {
    if (ExitIcon.isMouseOver(p)) {
      bgMusic(Mode.TITLE, p, "stop");
      ExitIcon.callback();
    }
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };
}
