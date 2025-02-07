function drawTitle() {
    textAlign(CENTER, CENTER);
    if (bgImage) {
      background(bgImage);
    } else {
      background(30, 30, 30);
    }
  
    // title
    fill(255);
    textSize(48);
    textFont("Comic Sans MS");
    text("Swiggle", width / 2, 150);
  
    if (!buttonsTempBool) {
        buttons.push(
            new Button("Play Game", width / 2, height / 2 + 200, () => startGame())
          );
          buttons.push(
            new Button("Garage", width / 2, height / 2 + 270, () => showGarage())
          );
          buttons.push(
            new Button("Leaderboard", width / 2, height / 2 + 410, () =>
              showLeaderboard()
            )
          );
          buttons.push(
            new Button("Settings", width / 2, height / 2 + 340, () => showSettings())
          );
          buttons.push(
            new Button("Exit", width / 2, height / 2 + 480, () => exitGame())
          );
          buttons.push(
            new Button("login", width - 150, 50, () => login())
          );
          buttons.push(
            new Button("Sign Up", width - 150, 120, () => signUp()) // Below the Login button
          );

          buttonsTempBool = true;
          console.log("set to true");
    }
  
    // how to interact with buttons
    for (let button of buttons) {
      button.display();
    }
  }