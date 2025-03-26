// Heads up display function for the play screen
//will hopefull help with fututre modification

//make all functions into classes

function gameHUD(p, car){
    timeDisplay(p);
    coinDisplay(p);
    healthBar(p, car);
    boostBar(p, car);

    //only displays when active
    ItemsManager.shieldDisplayBar(p); 

    //debug displays
    frameRate(p);
    carPosition(p, car);
}


function timeDisplay(p){
    p.textSize(16);
    p.fill(255);
    p.textAlign(p.RIGHT, p.TOP);
    let secondsElapsed = ((p.millis() - p.startTime) / 1000).toFixed(1);
    p.text(`Time: ${secondsElapsed} sec`, p.width - 10, 10);
}
function coinDisplay(p){
    p.fill(255);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`Coins: ${window.coinsCollected}`, p.width - 10, 30);

}
function healthBar(p, car){// Draw Health Bar
    let xpos = p.windowWidth / 65;
    let ypos = p.windowHeight / 45;
    let width = p.windowWidth / 5.5;
    let height = p.windowHeight / 35;

    let maxHealth = (loadPersistentData().stats.health);
    p.fill(50);
    p.rect(xpos, ypos, width, height); //background to outline

    p.fill(0, 255, 0);
    p.rect(xpos, ypos, (car.healthBar /maxHealth) * width, height);

  // Label
    p.fill(255);
    p.textSize(16);
    p.textAlign("center");
    p.text("Health", xpos, ypos - height/2);

}
function boostBar(p, car){
// Draw Boost Meter
    p.fill(50);
    p.rect(20, 60, 200, 25);
    p.fill(255, 165, 0);
    p.rect(20, 60, car.boostMeter * 2, 25);
  // Labels
    p.fill(255);
    p.textSize(16);
    p.text("Boost", 20, 58);
}
function frameRate(p){
    p.textSize(16);
    p.fill(255);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.fps = p.frameRate();
    p.text("Frames: " + Math.round(p.fps), 75 ,p.height-22);
}
function carPosition(p, car){
    p.textSize(16);
    p.fill(255);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(`Car: (${Math.round(car.position.x/gridSize)}, ${Math.round(car.position.y/gridSize)})`, 10, p.height - 10);
}