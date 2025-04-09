class UpgradeButton extends Button {
  display(p) {
    this.width = 180;
    this.height = 40;
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
  
    if (this.label === "MAX") {
      p.text("MAX", this.x, this.y);
    } else {
      const labelWidth = p.textWidth(this.label);
      const totalWidth = labelWidth + 20;
      const startX = this.x - totalWidth / 2;
  
      p.image(coinUp, startX, this.y - 10, 18, 18);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(this.label, startX + 22, this.y);
    }
  }
}

function GarageSketch(p) {
  console.log(CurrencyManager.getTotalCoins());
  let upgradeEngineLevel = 1, upgradeBodyLevel = 1, upgradeTransmissionLevel = 1, upgradeTiresLevel = 1;
  let selectedCarIndex = 0;
  let BASE_UPGRADE_PRICE = window.debug ? 0 : 10;
  const DEFAULT_CAR_STATS = { ...window.defaultData.stats };
  let savedStats = { ...DEFAULT_CAR_STATS };
  let upgrades = [], carBoxes = [], resetUpgradeButton;
  let purchasedCars = [true, false, false, false, false, false, false, false];
  const CAR_COLOR_COST = 10;

  p.preload = function () {
    loadMusic(p);
    loadSoundEffects(p);
    coinBg = p.loadImage("graphics/coinBack.png");
    coinUp = p.loadImage("graphics/coinAnimation/tile000.png")
    bgImage = p.loadImage("graphics/garagebg.png");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, () => switchSketch(Mode.TITLE));

    resetUpgradeButton = new Button("Reset", 80, p.height / 2, resetUpgrades, "gray");

    let savedConfig = loadPersistentData();
    if (savedConfig) {
      if (typeof savedConfig.upgradeEngineLevel === "number") upgradeEngineLevel = savedConfig.upgradeEngineLevel;
      if (typeof savedConfig.upgradeBodyLevel === "number") upgradeBodyLevel = savedConfig.upgradeBodyLevel;
      if (typeof savedConfig.upgradeTransmissionLevel === "number") upgradeTransmissionLevel = savedConfig.upgradeTransmissionLevel;
      if (typeof savedConfig.upgradeTiresLevel === "number") upgradeTiresLevel = savedConfig.upgradeTiresLevel;
      if (typeof savedConfig.selectedCar === "number") selectedCarIndex = savedConfig.selectedCar;
      if (Array.isArray(savedConfig.purchasedCars)) purchasedCars = savedConfig.purchasedCars;
    }

    setupUpgradeLayout();
    setupCarBodySelector();
    bgMusic(Mode.GARAGE, p, "loop");
    window.LoadingScreen && window.LoadingScreen.hide();
  };

  function setupUpgradeLayout() {
    upgrades = [];
    let size = 196, spacing = 100, totalWidth = 4 * size + 3 * spacing;
    let startX = (p.width - totalWidth) / 2;
    let boxY = p.height - size - 20, buttonY = boxY - 20;

    resetUpgradeButton = new UpgradeButton("Reset", 80, p.height / 2, resetUpgrades, "gray");

    let types = ['engine', 'body', 'transmission', 'tires'];
    types.forEach((type, i) => {
      let x = startX + i * (size + spacing);
      let level = getUpgradeLevel(type);
      let price = BASE_UPGRADE_PRICE * level;
      let btn = new UpgradeButton(price, x + size / 2, buttonY, () => purchaseUpgrade(type), "upgrade");
      upgrades.push({ type, label: type.charAt(0).toUpperCase() + type.slice(1), box: { x, y: boxY, w: size, h: size }, button: btn });
      updateUpgradeButtonText(upgrades[upgrades.length - 1]);
    });
  }

  function setupCarBodySelector() {
    carBoxes = [];
    let carBoxSize = 96, cols = 8, spacing = 10;
    let totalWidth = cols * carBoxSize + (cols - 1) * spacing;
    let startX = (p.width - totalWidth) / 2;
    let startY = 20;

    for (let i = 0; i < cols; i++) {
      carBoxes.push({ x: startX + i * (carBoxSize + spacing), y: startY, w: carBoxSize, h: carBoxSize, index: i });
    }
  }

  function getUpgradeLevel(type) {
    return { engine: upgradeEngineLevel, body: upgradeBodyLevel, transmission: upgradeTransmissionLevel, tires: upgradeTiresLevel }[type] || 0;
  }

  function setUpgradeLevel(type, level) {
    if (type === 'engine') upgradeEngineLevel = level;
    else if (type === 'body') upgradeBodyLevel = level;
    else if (type === 'transmission') upgradeTransmissionLevel = level;
    else if (type === 'tires') upgradeTiresLevel = level;
  }

  function updateUpgradeButtonText(up) {
    let level = getUpgradeLevel(up.type);
    up.button.label = level === 10 ? "MAX" : BASE_UPGRADE_PRICE * level;
  }

  function purchaseUpgrade(type) {
    let level = getUpgradeLevel(type);
    let price = BASE_UPGRADE_PRICE * level;
    if (CurrencyManager.getTotalCoins() >= price && level < 10) {
      if (typeof CurrencyManager.spendCoins === "function") {
        CurrencyManager.spendCoins(price);
      }
      setUpgradeLevel(type, level + 1);
      upgrades.forEach(u => u.type === type && updateUpgradeButtonText(u));
      saveConfiguration();
    }
  }

  function purchaseCar(index) {
    if (CurrencyManager.getTotalCoins() >= CAR_COLOR_COST) {
      if (typeof CurrencyManager.spendCoins === "function") {
        CurrencyManager.spendCoins(CAR_COLOR_COST);
      }
      purchasedCars[index] = true;
      selectedCarIndex = index;
      saveConfiguration();
    } else {
      console.log("Not enough coins for car color.");
    }
  }

  function computeCalcStats() {
    return {
      health: DEFAULT_CAR_STATS.health + (upgradeBodyLevel - 1) * 5,
      dmgRes: DEFAULT_CAR_STATS.dmgRes + (upgradeBodyLevel - 1),
      boost: DEFAULT_CAR_STATS.boost,
      maxSpeed: DEFAULT_CAR_STATS.maxSpeed + (upgradeEngineLevel - 1) * 0.5,
      acceleration: DEFAULT_CAR_STATS.acceleration + (upgradeTransmissionLevel - 1) * 0.1,
      turn: DEFAULT_CAR_STATS.turn + (upgradeTiresLevel - 1) * 0.05,
    };
  }

  function formatNumber(num) {
    let fixed = num.toFixed(2);
    return fixed.indexOf('.') !== -1 ? fixed.replace(/\.0+$/, '') : fixed;
  }

  p.draw = function () {
    p.background(bgImage || [30, 30, 30]);
    ExitIcon.display(p);
    if (resetUpgradeButton) resetUpgradeButton.display(p);

    carBoxes.forEach(box => {
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);

      let img = window.cars?.[box.index];
      if (img) {
        if (!purchasedCars[box.index]) {
          p.tint(100);
        }
        p.image(img, box.x, box.y, box.w, box.h);
        p.noTint();
      }

      if (!purchasedCars[box.index]) {
        let coinX = box.x + box.w / 2 - 18;
        let textX = coinX + 18;
        let y = box.y + box.h;
      
        p.image(coinUp, coinX, y - 14, 14, 14);
        p.fill(255, 215, 0);
        p.textSize(12);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text(CAR_COLOR_COST, textX, y);
      }

      if (box.index === selectedCarIndex) {
        p.stroke(255, 0, 0);
        p.strokeWeight(3);
        p.noFill();
        p.rect(box.x, box.y, box.w, box.h);
        p.strokeWeight(1);
      }
    });

    let centerX = p.width / 2 - 160, centerY = p.height / 2 - 100;
    if (window.cars?.[selectedCarIndex]) {
      p.image(window.cars[selectedCarIndex], centerX, centerY - 100, 320, 320);
    }

    upgrades.forEach(up => {
      p.stroke(0);
      p.fill(211);
      p.rect(up.box.x, up.box.y, up.box.w, up.box.h);
      p.fill(0);
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(up.label, up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 - 10);
      p.text("Lvl " + getUpgradeLevel(up.type), up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 + 15);
      up.button.display(p);
    });

    let stats = computeCalcStats(), panelX = p.width - 270, panelY = (p.height - 200) / 2;
    p.fill(255, 255, 255, 204);
    p.noStroke();
    p.rect(panelX, panelY, 250, 200);
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Stats", panelX + 10, panelY + 10);
    p.stroke(0);
    p.line(panelX + 10, panelY + 28, panelX + 240, panelY + 28);
    p.noStroke();

    let names = ["Health", "Boost", "Max Speed", "Acceleration", "Turn", "Dmg Res"];
    let bases = [savedStats.health, savedStats.boost, savedStats.maxSpeed, savedStats.acceleration, savedStats.turn, savedStats.dmgRes];
    let vals = [stats.health, stats.boost, stats.maxSpeed, stats.acceleration, stats.turn, stats.dmgRes];
    for (let i = 0; i < names.length; i++) {
      let y = panelY + 35 + i * 20;
      p.textAlign(p.LEFT); p.text(names[i], panelX + 10, y);
      p.textAlign(p.RIGHT);
      let d = Math.abs(vals[i] - bases[i]), v = formatNumber(vals[i]), b = formatNumber(bases[i]);
      p.text(d < 0.01 ? v : `${v} (${b})`, panelX + 240, y);
    }

    p.push();
    p.image(coinBg, 20, 20, 128, 64);
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(Math.floor(CurrencyManager.getTotalCoins()), 65, 45);
    p.pop();
  };

  p.mousePressed = function () {
    for (let box of carBoxes) {
      if (p.mouseX >= box.x && p.mouseX <= box.x + box.w && p.mouseY >= box.y && p.mouseY <= box.y + box.h) {
        if (purchasedCars[box.index]) {
          selectedCarIndex = box.index;
        } else {
          purchaseCar(box.index);
        }
        return;
      }
    }
    for (let up of upgrades) {
      if (up.button.isMouseOver(p)) return purchaseUpgrade(up.type);
    }
    if (resetUpgradeButton.isMouseOver(p)) return resetUpgrades();
    if (ExitIcon.isMouseOver(p)) {
      bgMusic(Mode.GARAGE, p, "stop");
      ExitIcon.callback();
    }
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      bgMusic(Mode.GARAGE, p, "stop");
      switchSketch(Mode.TITLE);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setupUpgradeLayout();
    setupCarBodySelector();
    resetUpgradeButton = new Button("Reset", 80, p.height / 2, resetUpgrades, "gray");
  };

  function saveConfiguration() {
    let config = {
      upgradeEngineLevel, upgradeBodyLevel, upgradeTransmissionLevel, upgradeTiresLevel,
      selectedCar: selectedCarIndex,
      purchasedCars,
      stats: computeCalcStats()
    };
    savedStats = { ...config.stats };
    savePersistentData(config);
  }

  function resetUpgrades() {
    upgradeEngineLevel = 1;
    upgradeBodyLevel = 1;
    upgradeTransmissionLevel = 1;
    upgradeTiresLevel = 1;
  
    upgrades.forEach(updateUpgradeButtonText);
    purchasedCars = [true, false, false, false, false, false, false, false];
  
    selectedCarIndex = 0;
  
    saveConfiguration();
    console.log("Upgrades and car purchases reset.");
  }  
  
  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };
}
