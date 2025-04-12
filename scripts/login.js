function LoginSketch(p) {
  let usernameInput, passwordInput, loginButton, message;

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

      // Login button
      loginButton = p.createButton('Login');
      loginButton.position(p.width / 2 - 50, p.height / 2 + 40);
      loginButton.mousePressed(sendLoginData);

      // Message element
      message = p.createP('');
      message.position(p.width / 2 - 100, p.height / 2 + 80);
      message.style('color', 'green');
      message.hide(); // Hide message initially

      // Stop loading
      window.LoadingScreen.hide();
  };

  function sendLoginData() {
      let username = usernameInput.value();
      let password = passwordInput.value();

      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              message.html("Login successful! Redirecting...");
              message.style('color', 'green');
              message.show();
              setTimeout(() => {
                  switchSketch(Mode.TITLE); // Redirect to game or dashboard
              }, 2000); // Redirect after 2 seconds
          } else {
              message.html("Login failed: " + data.error);
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
      p.text("Login", p.width / 2, p.height / 2 - 100);
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
