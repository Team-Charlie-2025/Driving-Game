function SignupSketch(p) {
  let usernameInput, passwordInput, signupButton, message;

  p.preload = function () {
    loadMusic(p);
    loadSoundEffects(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(230);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);

    ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, function () {
      switchSketch(Mode.TITLE);
    });

    // Username input
    usernameInput = p.createInput();
    usernameInput.position(p.width / 2 - 100, p.height / 2 - 30);
    usernameInput.attribute('placeholder', 'Username');

    // Password input
    passwordInput = p.createInput('', 'password');
    passwordInput.position(p.width / 2 - 100, p.height / 2);
    passwordInput.attribute('placeholder', 'Password');

    // Signup button
    signupButton = p.createButton('Sign Up');
    signupButton.position(p.width / 2 - 50, p.height / 2 + 40);
    signupButton.mousePressed(sendSignupData);

    // Message element
    message = p.createP('');
    message.position(p.width / 2 - 100, p.height / 2 + 80);
    message.style('color', 'green');
    message.hide();

    window.LoadingScreen.hide();
  };

  function sendSignupData() {
    let username = usernameInput.value();
    let password = passwordInput.value();

    fetch('http://cassini.cs.kent.edu:9411/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
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
    ExitIcon.display(p);
    p.textSize(100);
    p.fill(50);
    p.text("Signup", p.width / 2, p.height / 2 - 100);
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
