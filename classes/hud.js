//scripts/hud.js
let windowHeightScale, windowWidthScale, windowScale;
let coinImg, bombImg, oilImg, timeImg
function showHud(p, map, car, isPaused = false){
  let animationTime = isPaused ? this.animationStartTime : p.millis();

  frameIndex = Math.floor(animationTime / frameDuration) % window.animations["coin"].length;
  coinImg = window.animations["coin"][frameIndex];

  frameIndex = Math.floor(animationTime / frameDuration) % window.animations["bomb"].length;
  bombImg = window.animations["bomb"][frameIndex];

  frameIndex = Math.floor(animationTime / frameDuration) % window.animations["oil"].length;
  oilImg = window.animations["oil"][frameIndex];
  
  frameIndex = Math.floor(animationTime / frameDuration) % window.animations["hourglass"].length;
  timeImg = window.animations["hourglass"][frameIndex];


    // UI
    p.push();
      //drawMinimap(p,map,4)

      // Only draws debug if debug is clicked
      //if (window.debug)
      drawDebugInfo(p,car);
      drawMeters(p,car);
      drawCarDash(p,car);
      drawTimer(p, isPaused);
      ItemsManager.shieldDisplayBar(p, isPaused);
      drawInventory(p, scale);
      
    p.pop();

}

function drawCarDash(p,car){
  p.fill(255);
  p.textSize(35*window.scale);
  p.text(`Speed: ${Math.round(car.speed*10)}`, 260*window.widthScale, 50*window.heightScale);
  p.textSize(20*window.scale);
  p.text("Gear: " + (car.getGear()+1), 260*window.widthScale, 75*window.heightScale);
  // Draw RPM Bar
  let tempRPM = car.currentRPM;
  if(car.isBoosting){
    tempRPM = tempRPM*1.5;
  }
  const rpm = tempRPM; // Assuming `car.rpm` contains the current RPM value
  const maxRpm = 8000; // Maximum RPM
  const rpmBarHeight = 120 * window.widthScale;
  const rpmBarWidth = 20 * window.heightScale;
  const rpmBarX = 225 * window.widthScale;
  const rpmBarY = 10 * window.heightScale;
  
  // Draw RPM Bar Background
  p.fill(50);
  p.rect(rpmBarX, rpmBarY, rpmBarWidth, rpmBarHeight);

  // Determine RPM Bar Color
  if (rpm <= 3000) {
    p.fill("yellow"); 
  } else if (rpm <= 5500) {
    p.fill("orange"); 
  } else {
    p.fill("red"); 
  }
  const rpmPercentage = rpm / maxRpm;
  p.rect(rpmBarX, rpmBarY+rpmBarHeight, rpmBarWidth, -rpmPercentage * rpmBarHeight);
}

// Draws boost and health meters
function drawMeters(p,car){
  // Labels
  p.fill(255);
  p.textSize(20*window.scale);
  p.textFont(window.PixelFont);
  p.text("Health", 10*window.widthScale, 18*window.heightScale);
  p.text("Boost", 10*window.widthScale, 65*window.heightScale);
  p.text("Fuel", 10*window.widthScale, 112*window.heightScale); // New fuel label
  

  let maxHealth = (loadPersistentData().stats.health);  
  // Draw Health Bar
  p.fill(50);
  p.rect(10*window.widthScale, 20*window.heightScale, 200*window.widthScale, 25*window.heightScale);
  
  //color change as health decreases
  if(car.healthBar < maxHealth/4) //quarter health =  red
    p.fill(240, 20, 20);
  else if(car.healthBar < maxHealth /2) //half health =  yellow
    p.fill(223, 232, 100);
  else
    p.fill(0, 255, 0);
  
  p.rect(10*window.widthScale, 20*window.heightScale, (car.healthBar/maxHealth)*200*window.widthScale, 25*window.heightScale);

  // Draw Boost Meter
  p.fill(50);
  p.rect(10*window.widthScale, 67*window.heightScale, 200*window.widthScale, 25*window.heightScale);
  p.fill(255, 165, 0);


  //console.log("boost" + car.boostMeter);
  p.rect(10*window.widthScale, 67*window.heightScale, car.boostMeter * 2 * window.widthScale, 25*window.heightScale);

  // Draw Fuel Meter
  p.fill(50);
  p.rect(10*window.widthScale, 114*window.heightScale, 200*window.widthScale, 25*window.heightScale);
  
  // Change fuel meter color based on level
  const fuelPercentage = ItemsManager.getFuelPercentage();
  if (fuelPercentage < 0.25) // Below 25%
    p.fill(179, 43, 43);
  else if (fuelPercentage < 0.5) // Below 50%
    p.fill(165, 179, 43);
  else
    p.fill(34, 139, 34); // Green

  p.rect(10*window.widthScale, 114*window.heightScale, fuelPercentage * 200 * window.widthScale, 25*window.heightScale);
}

// Draws the framerate and car position
function drawDebugInfo(p,car){
  // Frame Rate
  p.textSize(16*window.scale);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.fill(0);
  p.fps = p.frameRate();
  p.text("Frames: " + Math.round(p.fps), 10*window.widthScale ,p.height-22*window.heightScale);
  // debug positional for car
  if (car) {
    p.textSize(16*window.scale);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.fill(0);
    p.text(`Car: (${Math.round(car.position.x/gridSize)}, ${Math.round(car.position.y/gridSize)})`, 10*window.widthScale, p.height - 10*window.heightScale);
    }
}

function drawTimer(p, isPaused = false){
  p.push();
    // Calculate effective game time considering pauses
    let effectiveTime;
    if (isPaused) {
      // When paused, use the time when pause started minus total previous paused time
      effectiveTime = (window.pauseStartTime - p.startTime - window.totalPausedTime) / 1000;
    } else {
      // When active, use current time minus start time minus total paused time
      effectiveTime = (p.millis() - p.startTime - window.totalPausedTime) / 1000;
    }
    
    // Format to one decimal place
    let secondsElapsed = effectiveTime.toFixed(1);


    let backingWidth = 150 * window.widthScale;
    let backingHeight = 50 * window.heightScale;
    let imageX = p.width/2 - backingWidth/2;
    let imageY = 20 * window.heightScale - backingHeight / 2;
  
    p.image(window.displayBacking, imageX, imageY, backingWidth, backingHeight);
  
  // Center of the image
    centerX = imageX + backingWidth / 2;
    centerY = imageY + backingHeight / 2;

    p.textSize(20*window.scale);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`  ${secondsElapsed} sec`, centerX, centerY);


    p.translate(centerX- backingWidth / 4, centerY);
    p.imageMode(p.CENTER);
    p.noStroke();
    p.image(timeImg, 0, 0, 20*window.widthScale, 20*window.heightScale);
  p.pop();
}
function drawInventory(p, scale){
  p.push(); //Bombs
    let backingWidth = 150 * window.widthScale;
    let backingHeight = 50 * window.heightScale;
    let imageX = p.width - 10 * window.widthScale - backingWidth;
    let imageY = 20 * window.heightScale - backingHeight / 2;
  
    p.image(window.displayBacking, imageX, imageY, backingWidth, backingHeight);
  
    // Center of the image
    let centerX = imageX + backingWidth / 2;
    let centerY = imageY + backingHeight / 2;
  
    p.textSize(20 * window.scale);
    p.textFont(window.PixelFont);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`  ${bombInventory}`, centerX, centerY);

    p.translate(centerX- backingWidth / 4, centerY);
    p.imageMode(p.CENTER);
    p.noStroke();
    p.image(bombImg, 0, 0, 20*window.widthScale, 20*window.heightScale);
  p.pop();

  p.push(); //Oils
    backingWidth = 150 * window.widthScale;
    backingHeight = 50 * window.heightScale;
    imageX = p.width - 10 * window.widthScale - backingWidth;
    imageY = 60 * window.heightScale - backingHeight / 2;
  
    p.image(window.displayBacking, imageX, imageY, backingWidth, backingHeight);
  
    // Center of the image
    centerX = imageX + backingWidth / 2;
    centerY = imageY + backingHeight / 2;
  
    p.textSize(20 * window.scale);
    p.fill(0);
    p.textFont(window.PixelFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`  ${oilInventory}`, centerX, centerY);

    p.translate(centerX- backingWidth / 4, centerY);
    p.imageMode(p.CENTER);
    p.noStroke();
    p.image(oilImg, 0, 0, 25*window.widthScale, 20*window.heightScale);
  p.pop();


  p.push(); //coins
    imageX = p.width - 10 * window.widthScale - backingWidth;
    imageY = 100 * window.heightScale - backingHeight / 2;
  
    p.image(window.displayBacking, imageX, imageY, backingWidth, backingHeight);
  
  // Center of the image
    centerX = imageX + backingWidth / 2;
    centerY = imageY + backingHeight / 2;

    p.textSize(20*window.scale);
    p.textFont(window.PixelFont);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`  ${window.coinsCollected}`, centerX, centerY);

    p.translate(centerX- backingWidth / 4, centerY);
    p.imageMode(p.CENTER);
    p.noStroke();
    p.image(coinImg, 0, 0, 20*window.widthScale, 20*window.heightScale);
  p.pop()
}

/*
function drawMinimap(p, map, tileSize) {
  let mapSize = 100; // minimap size in pixels
  let mapRows = 50;  // how much of the map is displayed
  let scaleFactor = mapSize / mapRows; // Scale tiles to fit minimap

  let xOffset = p.width - mapSize - 20; // Top-right corner
  let yOffset = 20;

  p.noStroke();
  p.translate(xOffset, yOffset); // Position minimap

  for (let y = 0; y < mapRows; y++) {
    for (let x = 0; x < mapRows; x++) {
      let tile = tilemap[y][x];

      // Choose colors based on tile type
      if (tile === 0) {
        p.fill(50, 50, 50); // Grey for roads
        } else {
          p.fill(0, 150, 0); // Green for grass
          }

            // Draw tile on minimap
            p.rect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor);
        }
    }

}
*/