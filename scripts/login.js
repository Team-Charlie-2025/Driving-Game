function LoginSketch(p) {
    let usernameInput, passwordInput, loginButton, message;
    p.preload = function () {
      bgImage = p.loadImage("graphics/titleScreen/titleBackground2.png");
    }
  
    p.setup = function () {
        p.windowResized();
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(48);
        p.fill(50);
        p.textFont(window.PixelFont);
      
        ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, function () { 
            switchSketch(Mode.TITLE);
        });
  
        // Username input
        usernameInput = p.createInput();
        usernameInput.size(200, 20);
        usernameInput.position(p.width / 2 - 100, p.height / 2 - 30);
        usernameInput.attribute('placeholder', 'Username');
  
        // Password input
        passwordInput = p.createInput('', 'password');
        passwordInput.size(200, 20);
        passwordInput.position(p.width / 2 - 100, p.height / 2);
        passwordInput.attribute('placeholder', 'Password');
  
        // Login button
        loginButton = p.createButton('Login');
        loginButton.size(50, 20);
        loginButton.position(p.width / 2 - 25, p.height / 2 + 40);
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
    
        fetch('http://cassini.cs.kent.edu:9411/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // ✅ Save the logged-in username globally
                window.username = username;
    
                message.html("Login successful! Redirecting...");
                message.style('color', 'green');
                message.show();
    
                setTimeout(() => {
                    switchSketch(Mode.TITLE);
                }, 2000);
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
      if (bgImage) {
        p.background(bgImage);
      } else {
        p.background(222, 236, 250);
      }
        p.fill(255, 255, 255, 200);
        p.noStroke();
        p.rect(p.width / 2 - (500 *window.widthScale/2), p.height / 2 - (500*window.heightScale/2), (500 *window.widthScale), (500*window.heightScale), 15);

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
    