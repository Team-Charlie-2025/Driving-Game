// scripts/login.js
function LoginSketch(p) {
  let usernameInput, passwordInput, loginButton, message, ExitIcon, bgImage;

  p.preload = function () {
    bgImage = p.loadImage("graphics/titleScreen/titleBackground2.png");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(50);
    p.textFont(window.PixelFont);

    // “Back” icon to return to Title
    ExitIcon = new Button(
      "ExitIcon",
      p.width - p.width * 0.05,
      p.height - p.height * 0.95,
      () => switchSketch(Mode.TITLE)
    );

    // Username field
    usernameInput = p.createInput();
    usernameInput.attribute("placeholder", "Username");
    usernameInput.size(200, 20);
    usernameInput.position(p.width / 2 - 100, p.height / 2 - 30);

    // Password field
    passwordInput = p.createInput("", "password");
    passwordInput.attribute("placeholder", "Password");
    passwordInput.size(200, 20);
    passwordInput.position(p.width / 2 - 100, p.height / 2);

    // Login button
    loginButton = p.createButton("Login");
    loginButton.size(80, 30);
    loginButton.position(p.width / 2 - 40, p.height / 2 + 50);
    loginButton.mousePressed(sendLoginData);

    // Feedback message
    message = p.createP("");
    message.position(p.width / 2 - 100, p.height / 2 + 90);
    message.style("color", "green");
    message.hide();

    window.LoadingScreen.hide();
  };

  function sendLoginData() {
    const username = usernameInput.value().trim();
    const password = passwordInput.value();

    fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          window.username    = username;
          window.accessToken = data.access_token;
          // console.log(`${username}, ${window.username}, ${window.accessToken}`)
          localStorage.setItem("username",    username);
          localStorage.setItem("accessToken", data.access_token);
          // console.log(`after login:\n ${localStorage.getItem("username")}`)
          message.html("Login successful! Redirecting…");
          message.style("color", "green");
          message.show();

          setTimeout(() => {
            switchSketch(Mode.TITLE);
          }, 1000);

        } else {
          message.html("Login failed: " + (data.error || "Unknown error"));
          message.style("color", "red");
          message.show();
        }
      })
      .catch(err => {
        console.error("Error:", err);
        message.html("Network error");
        message.style("color", "red");
        message.show();
      });
  }

  p.draw = function () {
    // background
    if (bgImage) p.background(bgImage);
    else        p.background(222, 236, 250);

    // semi‐transparent panel
    p.fill(255, 255, 255, 200);
    p.noStroke();
    p.rect(
      p.width / 2 - 250 * window.widthScale,
      p.height / 2 - 250 * window.heightScale,
      500 * window.widthScale,
      500 * window.heightScale,
      15
    );

    ExitIcon.display(p);
    p.fill(50);
    p.textSize(100);
    p.text("Login", p.width / 2, p.height / 2 - 100);
  };

  p.mousePressed = function () {
    if (ExitIcon.isMouseOver(p)) {
      bgMusic(Mode.LOGIN, p, "stop");
      ExitIcon.callback();
    }
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) switchSketch(Mode.TITLE);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    usernameInput.position(p.width / 2 - 100, p.height / 2 - 30);
    passwordInput.position(p.width / 2 - 100, p.height / 2);
    loginButton.position(p.width / 2 - 40, p.height / 2 + 50);
    message.position(p.width / 2 - 100, p.height / 2 + 90);
  };
}
