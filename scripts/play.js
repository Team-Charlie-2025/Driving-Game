function PlaySketch(p) {
  let gameOverSound = true;
  let car;
  let hud;
  let physicsEngine;
  let zoomFactor = 2.5;
  let enemies = [];
  let ENEMY_SPAWN_RATE = 10000 / window.difficulty; // 10 seconds base rate, adjusted by difficulty
  let lastSpawn = 0;
  let coins = [];
  let shields = [];
  let wrenches = [];
  let bombs = [];
  let oils = [];
  let gas = []; // Add gas cans array
  window.coinsCollected = 0;
  window.enemyDestroyedCount = 0;

  // Pause related variables
  let isPaused = false;
  let pauseResumeButton;
  let pauseMainMenuButton;
  // Initialize global pause tracking variables
  window.totalPausedTime = 0;
  window.pauseStartTime = 0;

  // Fixed button positions as percentages of screen height/width
  const RESUME_BUTTON_Y_PERCENT = 0.5; // 50% from top
  const MAIN_MENU_BUTTON_Y_PERCENT = 0.65; // 65% from top

  p.houseImages = []; // Array to stores all the house photos
  p.preload = function () {
    loadMusic(p);
    loadSoundEffects(p);

    p.buildingImg = p.loadImage("assets/building.png");
    p.enemyImg = p.loadImage("assets/police+car.png");   // Regular cop car image
    p.truckImg = p.loadImage("assets/police+truck.png"); // Truck image
    p.bikeImg = p.loadImage("assets/police+bike.png");   // Motorcycle image
    p.buildImages = [];
    p.houseImages = [
      p.loadImage("assets/Buildings/house_01.png"),
      p.loadImage("assets/Buildings/house_02.png"),
      p.loadImage("assets/Buildings/house_03.png"),
      p.loadImage("assets/Buildings/house_04.png"),
      p.loadImage("assets/Buildings/house_05.png"),
      p.loadImage("assets/Buildings/house_06.png"),
      p.loadImage("assets/Buildings/house_07.png"),
      p.loadImage("assets/Buildings/house_08.png"),
      p.loadImage("assets/Buildings/house_09.png"),
      p.loadImage("assets/Buildings/house_10.png"),
    ];
    p.buildingImages = [
      p.loadImage("assets/Buildings/building_04.png"),
      p.loadImage("assets/Buildings/building_05.png"),
      p.loadImage("assets/Buildings/building_06.png"),
      p.loadImage("assets/Buildings/building_07.png"),
      p.loadImage("assets/Buildings/building_08.png"),
      p.loadImage("assets/Buildings/building_09.png"),
      p.loadImage("assets/Buildings/fire_station.png"),
      p.loadImage("assets/Buildings/hospital.png"),
    ];
    // will be moved to globals eventually
    grassImg = p.loadImage("assets/mapBuilder/Terrain/grass.png");
    waterImg = p.loadImage("assets/mapBuilder/Terrain/water.png")

  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.startTime = p.millis();
    p.fps = p.frameRate();
    physicsEngine = new PhysicsEngine();
    //generateGenMap(p, mapSize, mapSize);
    //generateDFSMap(p, mapSize, mapSize); // Why is this just so much better 
    //generateDFSChunkedMap(p,mapSize, mapSize); // Too cluttered downtown
    //generateSmartChunkedMap(p, mapSize, mapSize);
    //generateRefactoredDFSMap(p, mapSize, mapSize); // Weird gaps
    generateImprovedCityMap(p, 500, 500); // Has weird gen but usable
    window.driveGrid = buildDrivableGrid(map);  //cache drivable grid
    window.runCoinsCalculated = false;
    window.isGameOver = false;

    // Load player car
    const savedData = loadPersistentData();
    const stats = savedData.stats;
    //car = new Car(p, p.width / 2, p.height / 2, stats);
    car = new Car(p, centerX * 32, centerY * 32, stats);  // Puts the car downtown


    // Set car image from selected car color if it exists
    const selectedCarIndex = savedData.selectedCar || 0;
    if (window.cars && window.cars[selectedCarIndex]) {
      car.currentImage = window.cars[selectedCarIndex];
    }

    // Update collider with the correct image
    car.collider = new Collider(
      car,
      "polygon",
      { offsetX: -32, offsetY: -32 },
      car.currentImage
    );

    physicsEngine.add(car);
    ItemsManager.ItemResetGame();

    window.LoadingScreen.hide();
    bgMusic(Mode.PLAY, p, "loop");

    // Start enemy spawner
    window.enemySpawnInterval = setInterval(() => spawnEnemy(p), ENEMY_SPAWN_RATE);

    //////////MAP ITEM CREATION///////////////
    // Load item unlocks before spawning anything
    const savedConfig = loadPersistentData();
    if (savedConfig?.unlockedItems) {
      for (let key in savedConfig.unlockedItems) {
        if (savedConfig.unlockedItems[key]) {
          ItemsManager.unlockItem(key);
        }
      }
    }
    createShields(p, shields, map);
    console.log("Shields made: " + shields.length);
    createWrenches(p, wrenches, map);
    console.log("Wrenches made: " + wrenches.length);
    createCoins(p, coins, map);
    console.log("Coins made: " + coins.length);
    createBomb(p, bombs, map);
    console.log("Bombs made: " + bombs.length);
    createOil(p, oils, map);
    console.log("Oils made: " + oils.length);
    createGas(p, gas, map); // Create gas cans
    console.log("Gas cans made: " + gas.length);
    ///////////////////////////////////////////

    // Create pause menu buttons with fixed positioning based on screen percentages
    createPauseButtons();

    p.showGameOverScreen = function () {
      bgMusic(Mode.PLAY, p, "stop");
      if (gameOverSound) { soundEffect("gameOver", p, "play"); gameOverSound = false; } //only play once
      p.textFont(window.PixelFont);
      p.push();
      p.fill(150, 0, 0, 180); // Semi-transparent red overlay
      p.rect(0, 0, p.width, p.height);

      p.fill(255);
      p.textSize(120 * window.scale);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("GAME OVER", p.width / 2, p.height / 3);

      p.textSize(40 * window.scale);
      p.text(`Your Final Score: ${window.finalScore || 0}`, p.width / 2, p.height / 2.5);

      p.fill(255);
      p.text("Press R to Restart", p.width / 2, p.height / 2);
      p.text("Press M for Main Menu", p.width / 2, p.height / 1.8);
      p.pop();
    };
  };

  // Create pause buttons function - separated to be reusable
  function createPauseButtons() {
    // Calculate button positions based on percentage of screen dimensions
    const resumeButtonY = p.height * RESUME_BUTTON_Y_PERCENT;
    const mainMenuButtonY = p.height * MAIN_MENU_BUTTON_Y_PERCENT;

    pauseResumeButton = new Button(
      "RESUME",
      p.width / 2,
      resumeButtonY,
      function () {
        togglePause();
      },
      "green", "medium"
    );

    pauseMainMenuButton = new Button(
      "MAIN MENU",
      p.width / 2,
      mainMenuButtonY,
      function () {
        bgMusic(Mode.PLAY, p, "stop");
        clearInterval(window.enemySpawnInterval);
        switchSketch(Mode.TITLE);
      },
      "red", "medium"
    );
  }

  // Toggle pause state function
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      // Record when we started this pause session
      window.pauseStartTime = p.millis();
      // Pause game music
      window.music[Mode.PLAY].pause();
    } else {
      // Calculate how long this pause session lasted and add to total
      window.totalPausedTime += (p.millis() - window.pauseStartTime);
      // Resume game music
      window.music[Mode.PLAY].play();
    }
  }

  // Enemy spawning function with different types
  function spawnEnemy(p) {
    if (!car || window.isGameOver || isPaused) return;

    const spawnDistance = 1000;
    const angle = p.random(p.TWO_PI);
    const x = car.position.x + spawnDistance * p.cos(angle);
    const y = car.position.y + spawnDistance * p.sin(angle);

    const elapsedTime = (p.millis() - p.startTime) / 1000;

    const BIKE_UNLOCK_TIME = 40;  //40 sec
    const TRUCK_UNLOCK_TIME = 60;  //60 sec

    //initially just cop cars
    let enemy;
    const rand = p.random();

    if (elapsedTime < BIKE_UNLOCK_TIME) {
      enemy = new Enemy(p, x, y, car);
    } else if (elapsedTime < TRUCK_UNLOCK_TIME) {  //cop cars and bikes
      if (rand < 0.7) {  //70% cops, 30% bikes
        enemy = new Enemy(p, x, y, car);
      } else {
        enemy = new Motorcycle(p, x, y, car);
      }
    } else {  //cops, bikes, and trucks
      const timeSinceTruckUnlock = elapsedTime - TRUCK_UNLOCK_TIME;
      const MAX_TRANSITION_TIME = 120;  //this + TRUCK_UNLOCK_TIME = 3 min cap
      const t = Math.min(timeSinceTruckUnlock / MAX_TRANSITION_TIME, 1.0);  //0 to 1

      //spawn ratios change over time
      const copChance = 0.55 * (1 - t);  //starts at 55%, drops to 0%
      const bikeChance = 0.25 + 0.15 * t;  //25% -> 40%
      const truckChance = 0.20 + 0.40 * t;  //20% -> 60%

      const total = copChance + bikeChance + truckChance;
      const copNormalized = copChance / total;
      const bikeNormalized = bikeChance / total;

      if (rand < copNormalized) {
        enemy = new Enemy(p, x, y, car);
        //console.log("cop spawning");
      } else if (rand < copNormalized + bikeNormalized) {
        enemy = new Motorcycle(p, x, y, car);
        //console.log("bike spawning");
      } else {
        enemy = new Truck(p, x, y, car);
        //console.log("truck spawning");
      }
    }

    physicsEngine.add(enemy);
    enemies.push(enemy);
  }

  p.draw = function () {
    p.background("white");

    // Handle pause overlay and drawing
    if (isPaused && !window.isGameOver) {
      // Still draw the game scene in the background
      drawGameScene();

      // Draw pause overlay
      p.push();
      p.fill(0, 0, 0, 150); // Semi-transparent black overlay
      p.rect(0, 0, p.width, p.height);

      p.textFont(window.PixelFont);
      p.textSize(90 * window.scale);
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("PAUSED", p.width / 2, p.height / 3);

      // Draw pause menu buttons
      pauseResumeButton.display(p);
      pauseMainMenuButton.display(p);
      p.pop();

      showHud(p, map, car, isPaused);
      return;
    }

    // GAME OVER
    if (window.isGameOver) {
      ////////////////////////////////////////////
      if (!window.runCoinsCalculated) {
        // calculate coins, scores
        const runCoinReward = CurrencyManager.computeCoinsEarned(window.coinsCollected);
        CurrencyManager.updateTotalCoins(runCoinReward);
        const elapsedTime = (p.millis() - p.startTime - window.totalPausedTime) / 1000; // Account for paused time
        const enemyDestroyed = window.enemyDestroyedCount || 0;
        const finalscore = ScoreManager.computeScore(elapsedTime, enemyDestroyed, window.coinsCollected, window.difficulty);
        ScoreManager.updateHighScore(finalscore);
        window.finalScore = finalscore;

        fetch("http://cassini.cs.kent.edu:9411/submit_score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: window.username,  // This must be set when user logs in!
            score: finalscore
          })
        })
          .then(response => response.json())
          .then(data => {
            if (!data.success) {
              console.error("Score submit error:", data.message);
            }
          })
          .catch(error => {
            console.error("Error submitting score:", error);
          });
        console.log("Game Over: Score sent to server: " + finalscore);
        if (window.debug) {
          console.log("Game Over: Run coins reward calculated: " + runCoinReward);
          console.log("Game Over: Score calculated: " + computedScore +
            " (Elapsed Time: " + elapsedTime +
            ", Enemies Destroyed: " + enemyDestroyed +
            ", Coins Collected: " + window.coinsCollected +
            ", Difficulty: " + window.difficulty + ")");
        }
        window.runCoinsCalculated = true;
      }
      ////////////////////////////////////////////

      drawGameScene();
      p.showGameOverScreen();
      return;
    }

    // Normal gameplay when not paused
    updateGame();
    drawGameScene();
    showHud(p, map, car);
  };

  // Function to draw game scene without updating
  function drawGameScene() {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(zoomFactor);
    if (car) p.translate(-car.position.x, -car.position.y);

    drawMap(p, car ? car.position : { x: 0, y: 0 }, zoomFactor);

    // Pass isPaused to display methods to freeze animations, animate beofre cars so they "drive over"
    coins.forEach(coin => coin.display(isPaused));
    shields.forEach(shield => shield.display(isPaused));
    wrenches.forEach(wrench => wrench.display(isPaused));
    bombs.forEach(bomb => bomb.display(isPaused));
    oils.forEach(oil => oil.display(isPaused));
    gas.forEach(canister => canister.display(isPaused)); // Draw gas cans

    if (car) car.display();
    enemies.forEach(enemy => enemy.display());

    bombs.forEach(bomb => bomb.display(isPaused)); //animation "over" cars


    if (window.debug) {
      bombs.forEach(bomb => bomb.collider.drawOutline());
      oils.forEach(oil => oil.collider.drawOutline());
      physicsEngine.objects.forEach(obj => {
        if (obj.collider && typeof obj.collider.drawOutline === "function") {
          obj.collider.drawOutline();
        }
      });

      // Debug building outlines
      if (car) {
        let halfWidth = p.width / (2 * zoomFactor);
        let halfHeight = p.height / (2 * zoomFactor);
        let center = car.position;
        let startXTile = Math.floor((center.x - halfWidth) / gridSize);
        let startYTile = Math.floor((center.y - halfHeight) / gridSize);
        let endXTile = Math.ceil((center.x + halfWidth) / gridSize);
        let endYTile = Math.ceil((center.y + halfHeight) / gridSize);
        for (let y = startYTile; y < endYTile; y++) {
          for (let x = startXTile; x < endXTile; x++) {
            if (map[y] && map[y][x] instanceof Building) {
              let building = map[y][x];
              if (building.collider && typeof building.collider.drawOutline === "function") {
                building.collider.drawOutline();
              }
            }
          }
        }
      }
    }
    if (ItemsManager.ifShield()) {//draw outline on car for shield
      car.collider.drawOutline(true);
    }
    p.pop();
  }

  // Function to update game state
  function updateGame() {
    if (isPaused) return; // Skip all updates when paused

    coins = checkCoinCollisions(coins, car, p);
    shields = checkShieldCollisions(shields, car, p);
    wrenches = checkWrenchCollisions(wrenches, car, p);
    bombs = checkBombCollisions(bombs, car, p);
    oils = checkOilCollisions(oils, car, p);
    gas = checkGasCollisions(gas, car, p); // Check gas can collisions

    // Update fuel level and check if empty
    ItemsManager.updateFuel(p, car, isPaused);
    if (ItemsManager.isFuelEmpty()) {
      window.isGameOver = true;
      console.log("Game Over: Out of fuel!");
    }

    if (!car) {
      const stats = loadPersistentData().stats;
      car = new Car(p, p.width / 2, p.height / 2, stats);
      physicsEngine.add(car);
    }

    enemies = enemies.filter(enemy => {
      if (enemy.removeFromWorld || enemy.healthBar <= 0) {
        physicsEngine.remove(enemy);
        window.enemyDestroyedCount = (window.enemyDestroyedCount || 0) + 1;
        return false;
      }
      return true;
    });

    enemies.forEach(enemy => {
      enemy.update();
      checkBuildingCollisions(enemy);
      checkBombCollisions(bombs, enemy, p);
      checkOilCollisions(oils, enemy, p);
    });

    physicsEngine.update();
    car.update();
    checkBuildingCollisions(car);
    checkCarCollisions(car, enemies);
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.widthScale + window.heightScale) / 2;

    // Update pause button positions on resize using our percentage-based approach
    createPauseButtons();
  };

  p.keyPressed = function () {
    // Toggle pause with P key (or custom keybind)
    if (p.keyCode === getKeyForAction("pause")) {
      togglePause();
      return;
    }

    // Only handle gameplay inputs when not paused
    if (!isPaused) {
      if (p.keyCode === getKeyForAction("placebomb")) {
        ItemsManager.placeBomb(p, car, bombs, isPaused);
      }
      if (p.keyCode === getKeyForAction("spilloil")) {
        ItemsManager.spillOil(p, car, oils, isPaused);
      }
    }

    if (p.keyCode === p.ESCAPE) {
      if (isPaused) {
        togglePause(); // Unpause if paused
      } else {
        bgMusic(Mode.PLAY, p, "stop");
        clearInterval(window.enemySpawnInterval);
        switchSketch(Mode.TITLE);
      }
    }

    if (window.isGameOver) {
      if (p.keyIsDown(82)) { // 'R' key
        switchSketch(Mode.PLAY);
      }
      if (p.keyIsDown(77)) { // 'M' key
        clearInterval(window.enemySpawnInterval);
        switchSketch(Mode.TITLE); // Go back to main menu
      }
    }
  };

  // Add mousePressed function to handle pause menu clicks
  p.mousePressed = function () {
    if (isPaused) {
      if (pauseResumeButton.isMouseOver(p)) {
        pauseResumeButton.callback();
      } else if (pauseMainMenuButton.isMouseOver(p)) {
        pauseMainMenuButton.callback();
      }
    }
  };

  // Modified collision check
  function checkBuildingCollisions(obj) {
    const tileX = Math.floor(obj.position.x / gridSize);
    const tileY = Math.floor(obj.position.y / gridSize);
    for (let j = tileY - 1; j <= tileY + 1; j++) {
      for (let i = tileX - 1; i <= tileX + 1; i++) {
        if (map[j] && map[j][i] instanceof Building) {
          let building = map[j][i];
          if (obj.collider.intersects(building.collider)) {

            if (!(obj instanceof Enemy)) {
              obj.buildingCollision(); //user car gets damage
            }
            if (obj.velocity) {  //reverse velocity (enemy & player)
              obj.velocity.mult(-1);
            }
            if (obj.speed !== undefined) {  //reverse speed if it exists (player)
              obj.speed = (-1) * obj.speed;
            }
            //apply small knockback to prevent enemies getting stuck
            let knockbackForce = 5;
            let knockbackVector = p5.Vector.sub(obj.position, building.position);
            knockbackVector.setMag(knockbackForce);
            obj.position.add(knockbackVector);

            if (!obj.controlDisabled) {
              obj.controlDisabled = true;
              setTimeout(() => {
                obj.controlDisabled = false;
              }, 250);
            }
            return;
          }
        }
      }
    }
  }

  //enemy collision check
  function checkCarCollisions(car, enemies) {
    for (let enemy of enemies) {
      if (car.collider.intersects(enemy.collider)) {

        //use relative velocity to scale knockback
        let relativeVelocity = p5.Vector.sub(car.velocity, enemy.velocity).mag();
        let knockbackForce = p.map(relativeVelocity, 0, 10, 5, 20); //adjust scaling

        //apply knockback in opposite directions
        let knockbackVector = p5.Vector.sub(car.position, enemy.position);
        knockbackVector.setMag(knockbackForce);



        car.position.add(knockbackVector);
        enemy.position.sub(knockbackVector); //push enemy slightly
        if (car.attackDamage) {
          enemy.healthBar = Math.max(0, enemy.healthBar - (enemy.attackDamage / 2));
          car.healthBar = Math.max(0, car.healthBar - (enemy.attackDamage * window.difficulty))
        }
        //temp disable enemy movement to prevent rapid collisions
        if (!enemy.controlDisabled) {
          enemy.controlDisabled = true;
          setTimeout(() => {
            enemy.controlDisabled = false;
          }, 750);
        }
      }
    }
  }
}