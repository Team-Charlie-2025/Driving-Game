
class UpgradeButton extends Button {

  display(p) {

    this.width = 180;
    this.height = 40;
    // If you have an image asset for upgrade buttons, use it.
    if (window.upgradeButton) {
      p.image(window.upgradeButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else {

      p.fill(180);
      p.stroke(0);
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 5);
    }
    p.textFont(window.PixelFont);
    p.textSize(20);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0);
    p.text(this.label, this.x, this.y);
  }
}

function GarageSketch(p) {
  // Upgrade levels for each type.
  let upgradeEngineLevel = 1;
  let upgradeBodyLevel = 1;
  let upgradeTransmissionLevel = 1;
  let upgradeTiresLevel = 1;
  let resetButton;
  // Base price for upgrades.
  const BASE_UPGRADE_PRICE = 10;

  // Base/default car stats.
  const DEFAULT_CAR_STATS = { ...window.defaultData.stats };

  let upgrades = [];

  p.preload = function() {
    loadSound(p);
    coinBg = p.loadImage("graphics/coinBack.png");
    bgImage = p.loadImage("graphics/garagebg.png");
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    resetButton = new Button("Reset Upgrades", 300, 300, resetUpgrades, "blue");
    // Load persistent upgrade levels if available.
    let savedConfig = loadPersistentData();
    if (savedConfig) {
      if (typeof savedConfig.upgradeEngineLevel === "number")
        upgradeEngineLevel = savedConfig.upgradeEngineLevel;
      if (typeof savedConfig.upgradeBodyLevel === "number")
        upgradeBodyLevel = savedConfig.upgradeBodyLevel;
      if (typeof savedConfig.upgradeTransmissionLevel === "number")
        upgradeTransmissionLevel = savedConfig.upgradeTransmissionLevel;
      if (typeof savedConfig.upgradeTiresLevel === "number")
        upgradeTiresLevel = savedConfig.upgradeTiresLevel;
    }

    setupUpgradeLayout();

    window.LoadingScreen.hide();
    if (!window.bgMusic.isPlaying()) {
      window.bgMusic.loop();
    }
  };

  // Create or update the layout for upgrade boxes and their buttons.
  function setupUpgradeLayout() {
    upgrades = [];
    let upgradeBoxSize = 196;
    let spacing = 100;
    let totalWidth = 4 * upgradeBoxSize + 3 * spacing;
    let startX = (p.width - totalWidth) / 2;
    // Upgrade boxes sit 20 pixels above the bottom.
    let boxY = p.height - upgradeBoxSize - 20;
    // Buttons are positioned directly above the box (20 pixels above).
    let buttonY = boxY - 20;

    let types = [
      { type: 'engine', label: 'Engine' },
      { type: 'body', label: 'Body' },
      { type: 'transmission', label: 'Transmission' },
      { type: 'tires', label: 'Tires' }
    ];

    for (let i = 0; i < types.length; i++) {
      let x = startX + i * (upgradeBoxSize + spacing);
      let upgradeObj = {
        type: types[i].type,
        label: types[i].label,
        box: { x: x, y: boxY, w: upgradeBoxSize, h: upgradeBoxSize },
        button: null // will be created below.
      };

      // Calculate the center of the upgrade box (for the button).
      let btnX = x + upgradeBoxSize / 2;
      // Compute current level and price.
      let level = getUpgradeLevel(upgradeObj.type);
      let price = BASE_UPGRADE_PRICE * (level);
      let btnLabel = price;
      // Create an UpgradeButton.
      let btn = new UpgradeButton(btnLabel, btnX, buttonY, function() {
        purchaseUpgrade(upgradeObj.type);
      }, "upgrade"); // Pass a color value if needed.
      upgradeObj.button = btn;

      upgrades.push(upgradeObj);
    }
  }

  // Returns the current upgrade level for a given type.
  function getUpgradeLevel(type) {
    if (type === 'engine') return upgradeEngineLevel;
    if (type === 'body') return upgradeBodyLevel;
    if (type === 'transmission') return upgradeTransmissionLevel;
    if (type === 'tires') return upgradeTiresLevel;
    return 0;
  }

  // Sets the upgrade level for a given type.
  function setUpgradeLevel(type, newLevel) {
    if (type === 'engine') upgradeEngineLevel = newLevel;
    else if (type === 'body') upgradeBodyLevel = newLevel;
    else if (type === 'transmission') upgradeTransmissionLevel = newLevel;
    else if (type === 'tires') upgradeTiresLevel = newLevel;
  }

  // Update the UpgradeButton's label text for a given upgrade.
  function updateUpgradeButtonText(upgradeObj) {
    let level = getUpgradeLevel(upgradeObj.type);
    let price = BASE_UPGRADE_PRICE * (level);
    upgradeObj.button.label = price;
    if (level == 10) {
      upgradeObj.button.label = "MAX";
    }
  }

  // Attempt to purchase an upgrade of a given type.
  function purchaseUpgrade(type) {
    let level = getUpgradeLevel(type);
    let price = BASE_UPGRADE_PRICE * (level);
    let totalCoins = CurrencyManager.getTotalCoins();
    if (totalCoins >= price && level < 10) {
      if (typeof CurrencyManager.spendCoins === "function") {
        CurrencyManager.spendCoins(price);
      }
      setUpgradeLevel(type, level + 1);
      // Update the corresponding button's label.
      upgrades.forEach(up => {
        if (up.type === type) {
          updateUpgradeButtonText(up);
        }
      });
      saveConfiguration();
    } else {
      console.log("Not enough coins for " + type + " upgrade!");
    }
  }

  // Compute current car stats based on upgrade levels.
  //   Engine: +0.5 to maxSpeed per level.
  //   Body: +5 to health per level.
  //   Transmission: +0.1 to acceleration per level.
  //   Tires: +0.05 to turn per level.
  function computeCalcStats() {
    let newHealth = DEFAULT_CAR_STATS.health + (upgradeBodyLevel - 1) * 5;
    let newMaxSpeed = DEFAULT_CAR_STATS.maxSpeed + (upgradeEngineLevel - 1) * 0.5;
    let newAcceleration = DEFAULT_CAR_STATS.acceleration + (upgradeTransmissionLevel - 1) * 0.1;
    let newTurn = DEFAULT_CAR_STATS.turn + (upgradeTiresLevel - 1) * 0.05;
    return {
      health: newHealth,
      boost: DEFAULT_CAR_STATS.boost,
      maxSpeed: newMaxSpeed,
      acceleration: newAcceleration,
      turn: newTurn,
      dmgRes: DEFAULT_CAR_STATS.dmgRes
    };
  }

  // number format / pulled from inet
  function formatNumber(num) {
    let fixed = num.toFixed(2);
    return fixed.indexOf('.') !== -1 ? fixed.replace(/\.?0+$/, '') : fixed;
  }

  p.draw = function() {
    if (bgImage) {
      p.background(bgImage);
    } else {
      p.background(30, 30, 30);
    }

    resetButton.display(p);

    // Draw each upgrade box.
    upgrades.forEach(up => {
      p.stroke(0);
      p.fill(211);
      p.rect(up.box.x, up.box.y, up.box.w, up.box.h);
      p.fill(0);
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(up.label, up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 - 10);
      p.text("Lvl " + getUpgradeLevel(up.type), up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 + 15);
      // Display the connected upgrade button.
      up.button.display(p);
    });

    // Draw stats panel on the right.
    let calcStats = computeCalcStats();
    let panelWidth = 300;
    let panelHeight = 200;
    let panelX = p.width - panelWidth - 20;
    let panelY = (p.height - panelHeight) / 2;
    p.fill(255, 255, 255, 204);
    p.noStroke();
    p.rect(panelX, panelY, panelWidth, panelHeight);

    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Stats", panelX + 10, panelY + 10);
    p.stroke(0);
    p.line(panelX + 10, panelY + 28, panelX + panelWidth - 10, panelY + 28);
    p.noStroke();

    let statNames = ["Health", "Boost", "Max Speed", "Acceleration", "Turn", "Dmg Res"];
    let baseValues = [
      DEFAULT_CAR_STATS.health,
      DEFAULT_CAR_STATS.boost,
      DEFAULT_CAR_STATS.maxSpeed,
      DEFAULT_CAR_STATS.acceleration,
      DEFAULT_CAR_STATS.turn,
      DEFAULT_CAR_STATS.dmgRes
    ];
    let calcValues = [
      calcStats.health,
      calcStats.boost,
      calcStats.maxSpeed,
      calcStats.acceleration,
      calcStats.turn,
      calcStats.dmgRes
    ];

    for (let i = 0; i < statNames.length; i++) {
      let lineY = panelY + 35 + i * 20;
      p.textAlign(p.LEFT, p.TOP);
      p.text(statNames[i], panelX + 10, lineY);
      p.textAlign(p.RIGHT, p.TOP);
      let diff = Math.abs(calcValues[i] - baseValues[i]);
      let formattedCalc = formatNumber(calcValues[i]);
      let formattedBase = formatNumber(baseValues[i]);
      let displayText = diff < 0.01 ? formattedCalc : formattedCalc + " (" + formattedBase + ")";
      p.text(displayText, panelX + panelWidth - 10, lineY);
    }

    // Draw coin counter (upper left).
    p.push();
      p.image(coinBg, 20, 20, 128, 64);
      p.fill(0);
      p.textSize(16);
      p.textAlign(p.LEFT, p.TOP);
      p.text(CurrencyManager.getTotalCoins(), 65, 45);
    p.pop();
  };

  // Allow clicking on an upgrade box or its connected button.
  p.mousePressed = function() {
    // Check upgrade buttons first.
    for (let i = 0; i < upgrades.length; i++) {
      let up = upgrades[i];
      if (up.button.isMouseOver(p)) {
        purchaseUpgrade(up.type);
        return;
      }
    }
    if (resetButton.isMouseOver(p)) {
      resetButton.callback();
      return;
    }
    
    // Also allow clicking on the upgrade boxes.
    for (let i = 0; i < upgrades.length; i++) {
      let up = upgrades[i];
      if (
        p.mouseX >= up.box.x &&
        p.mouseX <= up.box.x + up.box.w &&
        p.mouseY >= up.box.y &&
        p.mouseY <= up.box.y + up.box.h
      ) {
        purchaseUpgrade(up.type);
        return;
      }
    }
    // Check for exit if an ExitIcon exists.
    if (typeof ExitIcon !== "undefined" && ExitIcon.isMouseOver(p)) {
      window.bgMusic.stop();
      ExitIcon.callback();
    }
  };

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      window.bgMusic.stop();
      switchSketch(Mode.TITLE);
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setupUpgradeLayout();
  };

  function saveConfiguration() {
    let newStats = computeCalcStats();
    let config = {
      upgradeEngineLevel,
      upgradeBodyLevel,
      upgradeTransmissionLevel,
      upgradeTiresLevel,
      stats: { ...newStats }
    };
    savePersistentData(config);
    console.log("Configuration saved:", config);
  }
  function resetUpgrades() {
    upgradeEngineLevel = 1;
    upgradeBodyLevel = 1;
    upgradeTransmissionLevel = 1;
    upgradeTiresLevel = 1;
    
    // Update the labels on all upgrade buttons to reflect the reset cost/level
    upgrades.forEach(up => updateUpgradeButtonText(up));
    
    // Save the reset configuration
    saveConfiguration();
    console.log("All upgrades have been reset.");
  }
}




