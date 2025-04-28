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

    createLogin(p);
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
    p.textSize(100 * window.scale);
    p.fill(50);
    p.text("Login", p.width / 2, p.height / 2 - 100* window.heightScale);
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
      loginButton.hide();
      message.hide();;
      createLogin(p);
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
    function createLogin(p){
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
 
       // Login button
       loginButton = p.createButton('Login');
       loginButton.size(76* window.widthScale, 30* window.heightScale);
       loginButton.style("font-family", "PixelFont");
       loginButton.style("font-size", (25 * window.widthScale) + "px");
       loginButton.position(p.width / 2 - 38* window.widthScale, p.height / 2 + 40* window.heightScale);
       loginButton.mousePressed(sendLoginData);
 
       // Message element
       message = p.createP('');
       message.position(p.width / 2 - 200* window.widthScale, p.height / 2 + 80* window.heightScale);
       message.style('color', 'green');
       message.hide(); // Hide message initially
    }
}
