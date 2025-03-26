// scripts/play.js

function PlaySketch(p) {
  let gameOverSound = true;
  let car;
  let physicsEngine;
  let zoomFactor = 2.5;
  let enemies = [];
  let ENEMY_SPAWN_RATE = 100000; // 1000 = 1 seconds
  let lastSpawn = 0;
  let coins = [];
  let shields= [];
  window.coinsCollected = 0;
  
  p.preload = function() {
    loadMusic(p);
    loadSoundEffects(p);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.startTime = p.millis();
    p.fps = p.frameRate();
    physicsEngine = new PhysicsEngine();
    generateGenMap(p, mapSize, mapSize);
    //generateRoadMap(p, mapSize, mapSize);
    window.runCoinsCalculated = false;
    window.isGameOver = false;

    ItemsManager.shieldResetGame(); //fix shield error
    
    window.LoadingScreen.hide();
    bgMusic(Mode.PLAY, p, "loop");

    // Start enemy spawner
    window.enemySpawnInterval = setInterval(() => spawnEnemy(p), ENEMY_SPAWN_RATE);

    // coin creation, positioning, building check, and logs
    ////////////////////////////////////////////////
    const totalCoins = 750;
    const totalSheilds = 200; 
    let attempts = 0;
    const maxAttempts = 10000; 
    while (coins.length < totalCoins && attempts < maxAttempts) {
      // random map index
      let randX = Math.floor(p.random(0, map[0].length));
      let randY = Math.floor(p.random(0, map.length));
      
      // checks tile, if road, puts coin in center
      if (map[randY] && map[randY][randX] instanceof Road) {
        let coinX = randX * gridSize + gridSize / 2;
        let coinY = randY * gridSize + gridSize / 2;
        if (window.debug) console.log(`Spawning coin ${coins.length + 1} at tile (${randX}, ${randY}) with world coordinates (${coinX}, ${coinY})`);
        coins.push(new Coin(p, coinX, coinY));
      }
      attempts++;
    }
    
    if (attempts >= maxAttempts && debug) {
      console.log("Max attempts reached while spawning coins. Coins spawned: " + coins.length);
    }
    // shield creation, positioning, building check, and logs
    attempts = 0;
    while (shields.length < totalSheilds && attempts < maxAttempts) {
      // random map index
      let randX = Math.floor(p.random(0, map[0].length));
      let randY = Math.floor(p.random(0, map.length));
      
      // checks tile, if road, puts coin in center
      if (map[randY] && map[randY][randX] instanceof Road) {
        let shieldX = randX * gridSize + gridSize / 2;
        let shieldY = randY * gridSize + gridSize / 2;
        if (window.debug) console.log(`Spawning sheild ${shields.length + 1} at tile (${randX}, ${randY}) with world coordinates (${shieldX}, ${shieldY})`);
        shields.push(new Shield(p, shieldX, shieldY));
      }
      attempts++;
    }
    
    if (attempts >= maxAttempts && debug) {
      console.log("Max attempts reached while spawning shields. Shields spawned: " + sheilds.length);
    }
    ////////////////////////////////////////////////


    p.showGameOverScreen = function () {
        bgMusic(Mode.PLAY, p, "stop");
        if(gameOverSound) {soundEffect("gameOver", p, "play"); gameOverSound = false;} //only play once
      
        p.push();
        p.fill(150, 0, 0, 180); // Semi-transparent red overlay
        p.rect(0, 0, p.width, p.height);
        
        p.fill(255);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("GAME OVER", p.width / 2, p.height / 3);

        p.textSize(30);
        p.fill(255);
        p.text("Press R to Restart", p.width / 2, p.height / 2);
        p.text("Press M for Main Menu", p.width / 2, p.height / 1.5);
        p.pop();
    };
  };

  // Add spawn function
  function spawnEnemy(p) {
    if (!car || window.isGameOver) return;

    const spawnDistance = 1000;
    const angle = p.random(p.TWO_PI);
    const x = car.position.x + spawnDistance * p.cos(angle);
    const y = car.position.y + spawnDistance * p.sin(angle);

    const enemy = new Enemy(p, x, y, car);
    physicsEngine.add(enemy);
    enemies.push(enemy);
  }

  p.draw = function () {
    p.background(255);
  
    // GAME OVER
    if (window.isGameOver) {
      ////////////////////////////////////////////
      if (!window.runCoinsCalculated) {
        // calculate coins, scores
        const runCoinReward = CurrencyManager.computeCoinsEarned(window.coinsCollected);
        CurrencyManager.updateTotalCoins(runCoinReward);
        const elapsedTime = (p.millis() - p.startTime) / 1000;
        const enemyDestroyed = window.enemyDestroyedCount || 0;
        const computedScore = ScoreManager.computeScore(elapsedTime, enemyDestroyed, window.coinsCollected);
        
        if(window.debug){
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
      
      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.scale(zoomFactor);
      if (car) p.translate(-car.position.x, -car.position.y);
      drawMap(p, car ? car.position : {x: 0, y: 0}, zoomFactor);
      if (car) car.display();
      enemies.forEach(enemy => enemy.display());
      coins.forEach(coin => coin.display());
      p.pop();
        
      p.push();
      p.fill(150, 0, 0, 180); // Semi-transparent red overlay
      p.rect(0, 0, p.width, p.height);
      p.pop();
      
      p.showGameOverScreen();
      return;
    }
  
    // GAMEPLAY LOGIC
    coins = checkCoinCollisions(coins, car, p);
    shields = checkShieldCollisions(shields, car, p);

    if (!car) {
      const stats = loadPersistentData().stats;
      car = new Car(p, p.width / 2, p.height / 2, stats);
      physicsEngine.add(car);
    }
    
    enemies = enemies.filter(enemy => {
      if (enemy.removeFromWorld || enemy.healthBar <= 0) {
        physicsEngine.remove(enemy);
        return false;
      }
      return true;
    });
  
    // GAME RENDERING
    p.push();
      p.translate(p.width / 2, p.height / 2);
      p.scale(zoomFactor);
      p.translate(-car.position.x, -car.position.y);
  
      drawMap(p, car.position, zoomFactor);
      car.display();
  
      enemies.forEach(enemy => {
        enemy.update();
        enemy.display();
        checkBuildingCollisions(enemy);
      });
  
      coins.forEach(coin => coin.display());
      shields.forEach(shield => shield.display());
  
      if (window.debug) {
        physicsEngine.objects.forEach(obj => {
          if (obj.collider && typeof obj.collider.drawOutline === "function") {
            obj.collider.drawOutline();
          }
        });
  
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
      if(ItemsManager.ifShield()) //draw outline on car for shield
        car.collider.drawOutline(true);
    p.pop();
  
    // Heads up display
    p.push();
      gameHUD(p, car)
    p.pop();

  
    // PHYSICS
    physicsEngine.update();
    car.update();
    checkBuildingCollisions(car);
    checkCarCollisions(car, enemies);
  };
  
  

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      bgMusic(Mode.PLAY, p, "stop");
      clearInterval(window.enemySpawnInterval);
      switchSketch(Mode.TITLE);
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
    if (p.keyCode === p.ESCAPE) {
        bgMusic(Mode.PLAY, p, "stop");
        clearInterval(window.enemySpawnInterval);
        switchSketch(Mode.TITLE);
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

              if( ! (obj instanceof Enemy) ){
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