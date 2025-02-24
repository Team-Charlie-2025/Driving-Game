// The UI isn't perfect but the max speed and acceleration do increase when upgrading and it is reflected in game. 

let playerUpgrades = [
    { name: "Max Speed", level: 0, maxLevel: 10 },
    { name: "Acceleration", level: 0, maxLevel: 10 },
    { name: "Health", level: 0, maxLevel: 10 },
    { name: "Health Recovery", level: 0, maxLevel: 10 }
  ];
  
  function drawGarage() {
    background(50, 50, 50);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("Garage", width / 2, 100);
  
    buttons = []; // Clear previous buttons before adding new ones
  
    // Display upgrade options
    for (let i = 0; i < playerUpgrades.length; i++) {
      let upgrade = playerUpgrades[i];
  
      // Show Upgrade Name and Level
      textSize(20);
      textAlign(LEFT, CENTER);
      text(`${upgrade.name}: Level ${upgrade.level}/${upgrade.maxLevel}`, width / 2 - 120, 200 + i * 70);
  
      // Create "+ Upgrade" button
      let btn = new Button("+", .75 * width, 230 + i * 70, () => upgradeStat(i));
      buttons.push(btn);
      upgradeBars(width / 2 - 100, 230 + i * 70, upgrade.level);
    }
  
    // Back button to return to the main menu
    let backButton = new Button("Back to Menu", width / 2, height - 100, () => {
      mode = Mode.title;
    });
  
    buttons.push(backButton);
  
    for (let button of buttons) {
      if (button.label == "+")
      {
        button.width = 35;
        button.height = 35;
      }
        button.display();
    }
  }

  function upgradeBars(x, y, j) {
    for (let i = 0; i < 10; i++) {
      if (i < j) {
        fill(255, 0, 0);
      } else {
        fill(0, 0, 0);
      }
      rect(x + i * 55, y, 50, 10);
    }
    fill(255, 255, 255);
  }

  function upgradeStat(index) {
    let upgrade = playerUpgrades[index];
    if (upgrade.level < upgrade.maxLevel) {
      upgrade.level++; // Increase level
      switch(upgrade.name) {
        case "Max Speed":
          Car.upgradeDefaults(Car.defaultAcceleration, Car.defaultMaxSpeed * upgrade.level);
          break;
        case "Acceleration":
          Car.upgradeDefaults(Car.defaultAcceleration * upgrade.level, Car.defaultMaxSpeed);
          break;
        default:
      }
      console.log(`${upgrade.name} upgraded to level ${upgrade.level}`);
    } else {
      console.log(`${upgrade.name} is already at max level!`);
    }
  }
  
  function mousePressed() {
    for (let button of buttons) {
      button.checkClick();
    }
  }
  
  