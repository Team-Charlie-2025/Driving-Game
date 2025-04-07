//scripts/hud.js
let windowHeightScale, windowWidthScale, windowScale;
function showHud(p, map, car, isPaused = false){

    // UI
    p.push();
      
      //drawMinimap(p,map,4)

      // Only draws debug if debug is clicked
      if (window.debug)
        drawDebugInfo(p,car);
      drawMeters(p,car);
      drawCoinsTimer(p, isPaused);
      ItemsManager.shieldDisplayBar(p, isPaused);
      drawInventory(p, scale);
      
      // We're removing the pause indicator from the HUD since it's already shown in the main overlay
      
    p.pop();

}

// Draws boost and health meters
function drawMeters(p,car){
  // Labels
  p.fill(255);
  p.textSize(16*window.scale);
  p.text("Health", 10*window.widthScale, 18*window.heightScale);
  p.text("Boost", 10*window.widthScale, 65*window.heightScale);
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


}

// Draws the framerate and car position
function drawDebugInfo(p,car){
  // Frame Rate
  p.textSize(14*window.scale);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.fill(0);
  p.fps = p.frameRate();
  p.text("Frames: " + Math.round(p.fps), 10*window.widthScale ,p.height-22*window.heightScale);
  // debug positional for car
  if (car) {
    p.textSize(12*window.scale);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.fill(0);
    p.text(`Car: (${Math.round(car.position.x/gridSize)}, ${Math.round(car.position.y/gridSize)})`, 10*window.widthScale, p.height - 10*window.heightScale);
    }
}

function drawCoinsTimer(p, isPaused = false){
  p.push();
    p.textSize(16*window.scale);
    p.fill(255);
    p.textAlign(p.CENTER, p.TOP);
    
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
    
    p.text(`Time: ${secondsElapsed} sec`, p.width/2 - 10*window.widthScale, 10*window.heightScale);
    p.text(`Coins: ${window.coinsCollected}`, p.width/2 - 10*window.widthScale, 30*window.heightScale);
  p.pop();
}
function drawInventory(p, scale){
  p.push(); //Bombs
    p.textSize(16*windowScale);
    p.fill(255);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`Bomb Inventory: ${bombInventory}`, p.width - 10*windowWidthScale,  10*windowHeightScale);
  p.pop();
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