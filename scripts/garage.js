class UpgradeButton extends Button {
  constructor(label, x, y, callback, type = "upgrade", width = 180, height = 40) {
    super(label, x, y, callback, type);
    this.width = width;
    this.height = height;
  }

  display(p) {
    if (window.upgradeButton) {
      p.image(window.upgradeButton, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else {
      p.fill(180);
      p.stroke(0);
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 5);
    }

    p.textFont(window.PixelFont);
    p.textSize(25 * window.scale);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0);

    if (this.label === "MAX" || this.label === "OWNED") {
      p.text(this.label, this.x, this.y);
    } else {
      const labelWidth = p.textWidth(this.label);
      const totalWidth = labelWidth + 20 * window.widthScale;
      const startX = this.x - totalWidth / 2;
      
      const coinSize = 18 * window.widthScale;
      p.image(coinUp, startX, this.y - coinSize/2, coinSize, coinSize);
      
      p.textAlign(p.LEFT, p.CENTER);
      p.text(this.label, startX + coinSize + 4 * window.widthScale, this.y);
    }
  }
}

const ITEM_PRICES = {
  wrench: 3000,
  bomb: 5000,
  oil: 10000,
  shield: 15000,
  boat: 99999
};

function GarageSketch(p) {
  console.log(CurrencyManager.getTotalCoins());
  let upgradeEngineLevel = 1, upgradeBodyLevel = 1, upgradeTransmissionLevel = 1, upgradeTiresLevel = 1;
  let selectedCarIndex = 0;
  let BASE_UPGRADE_PRICE = 25;
  let DEFAULT_CAR_STATS = { ...window.defaultData.stats };
  let savedStats = { ...DEFAULT_CAR_STATS };
  let upgrades = [], carBoxes = [], resetUpgradeButton;
  let purchasedCars = [true, false, false, false, false, false, false, false];
  const CAR_COLOR_COST = 10;
  let debugAddCoinsButton;

  p.preload = function () {
    loadMusic(p);
    loadSoundEffects(p);
    coinBg = p.loadImage("graphics/coinBack.png");
    coinUp = p.loadImage("graphics/coinAnimation/tile000.png")
    bgImage = p.loadImage("graphics/garagebg.png");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont(window.PixelFont);
  
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.heightScale + window.widthScale) / 2;
  
    ExitIcon = new Button("ExitIcon", p.width - 45 * window.widthScale, 45 * window.heightScale, () => switchSketch(Mode.TITLE));
    if (window.debug) debugAddCoinsButton = new UpgradeButton("Coins", 80 * window.widthScale, p.height - 80 * window.heightScale, debugAddCoins, "gray");
  
    let savedConfig = loadPersistentData();
    if (savedConfig) {
      selectedCarType = savedConfig.selectedCarType || 0;
      selectedCarColor = savedConfig.selectedCarColor || 0;
  
      let upgrades = savedConfig.upgradesByCarType?.[selectedCarType];
      if (upgrades) {
        upgradeEngineLevel = upgrades.engine || 1;
        upgradeBodyLevel = upgrades.body || 1;
        upgradeTransmissionLevel = upgrades.transmission || 1;
        upgradeTiresLevel = upgrades.tires || 1;
      } else {
        upgradeEngineLevel = upgradeBodyLevel = upgradeTransmissionLevel = upgradeTiresLevel = 1;
      }
    } else {
      selectedCarType = 0;
      selectedCarColor = 0;
      upgradeEngineLevel = upgradeBodyLevel = upgradeTransmissionLevel = upgradeTiresLevel = 1;
    }
  
    DEFAULT_CAR_STATS = { ...window.defaultData.stats };
    savedStats = { ...DEFAULT_CAR_STATS };
  
    setupUpgradeLayout();
    setupItemPurchaseButtons();
    setupCarBodySelector();
  
    bgMusic(Mode.GARAGE, p, "loop");
    window.LoadingScreen && window.LoadingScreen.hide();
  };
  

  function setupUpgradeLayout() {
    upgrades = [];
    const size = 192 * window.widthScale;
    const spacing = 38.4 * window.widthScale;
    const totalWidth = 4 * size + 3 * spacing;
    const startX = (p.width - totalWidth) / 2;
    const boxY = p.height - size - 32.4 * window.heightScale;
    const buttonY = boxY - 24.84 * window.heightScale;
  
    if (window.debug) {
      resetUpgradeButton = new UpgradeButton("Reset", 76.8 * window.widthScale, p.height - 54 * window.heightScale, resetUpgrades, "gray", 192 * window.widthScale, 48.6 * window.heightScale);
    } else {
      resetUpgradeButton = null;
    }
  
    const types = ['engine', 'body', 'transmission', 'tires'];
    types.forEach((type, i) => {
      const x = startX + i * (size + spacing);
      const level = getUpgradeLevel(type);
      const price = getPrice(type);
      const btn = new UpgradeButton(price, x + size / 2, buttonY, () => purchaseUpgrade(type), "upgrade", 172.8 * window.widthScale, 48.6 * window.heightScale);
      upgrades.push({ type, label: type.charAt(0).toUpperCase() + type.slice(1), box: { x, y: boxY, w: size, h: size }, button: btn });
      updateUpgradeButtonText(upgrades[upgrades.length - 1]);
    });
  }

  function setupItemPurchaseButtons() {
    const itemTypes = ['wrench','bomb', 'oil', 'shield','boat'];
    const spacing = 140.4 * window.heightScale;
    const boxWidth = 96 * window.widthScale;
    const boxHeight = 86.4 * window.heightScale;
    const x = 76.8 * window.widthScale;
    const startY = 250 * window.heightScale;

    itemTypes.forEach((item, index) => {
      const y = startY + index * spacing;
      const label = item.charAt(0).toUpperCase() + item.slice(1);
      const price = window.debug ? 0 : ITEM_PRICES[item];
      const owned = ItemsManager.unlockedItems[item];
      const btnLabel = owned ? "OWNED" : price;

      const box = { x, y, w: boxWidth, h: boxHeight };
      const buttonY = y - 18.36 * window.heightScale;
      const btn = new UpgradeButton(btnLabel, x + boxWidth / 2, buttonY, () => purchaseItem(item), "item", boxWidth * 0.95, boxHeight * 0.4);
      upgrades.push({ type: item, label, box, button: btn });
    });
  }

  function purchaseItem(itemType) {
    if (ItemsManager.unlockedItems[itemType]) {
      console.log(itemType + " already unlocked.");
      return;
    }

    const price = window.debug ? 0 : ITEM_PRICES[itemType];
    if (CurrencyManager.getTotalCoins() >= price) {
      if (price > 0) CurrencyManager.spendCoins(price);
      ItemsManager.unlockItem(itemType);

      upgrades.forEach(up => {
        if (up.type === itemType) {
          up.button.label = "OWNED";
        }
      });

      saveConfiguration();
    } else {
      console.log("Not enough coins for " + itemType);
    }
  }

  function setupCarBodySelector() {
    carBoxes = [];
    let carBoxSize = 96 * window.widthScale;
    let spacing = 10 * window.widthScale;
    let startX = (p.width - (carBoxSize * getColorCountForCarType(selectedCarType) + spacing * (getColorCountForCarType(selectedCarType) - 1))) / 2;
    let startY = 20 * window.heightScale;
  
    for (let i = 0; i < getColorCountForCarType(selectedCarType); i++) {
      carBoxes.push({ x: startX + i * (carBoxSize + spacing), y: startY, w: carBoxSize, h: carBoxSize, index: i });
    }
  }
  
  function getColorCountForCarType(type) {
    if (type === 0) return 8;    // Normal car
    if (type === 1) return 6;    // Truck
    if (type === 2) return 4;    // Sports car
    return 8;
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
    up.button.label = level === 10 ? "MAX" : getPrice(up.type);
  }

  function purchaseUpgrade(type) {
    let level = getUpgradeLevel(type);
    let price = getPrice(type);
    if (CurrencyManager.getTotalCoins() >= price && level < 10) {
      if (typeof CurrencyManager.spendCoins === "function") {
        CurrencyManager.spendCoins(price);
      }
      setUpgradeLevel(type, level + 1);
      upgrades.forEach(u => u.type === type && updateUpgradeButtonText(u));
      saveConfiguration();
    }
  }
  function purchaseCarType(index) {
    let data = loadPersistentData();
    if (!data.purchasedCarTypes) data.purchasedCarTypes = [true, false, false];
    
    if (!data.purchasedCarTypes[index]) {
      const CAR_COST = 10;
      if (CurrencyManager.getTotalCoins() >= CAR_COST) {
        CurrencyManager.spendCoins(CAR_COST);
        data.purchasedCarTypes[index] = true;
        console.log(`Car type ${index} purchased!`);
      } else {
        console.log("Not enough coins to purchase this car type.");
        return;
      }
    }
  
    selectedCarType = index;
    selectedCarColor = 0; // Reset color when switching car type
    savePersistentData(data);
    setupCarBodySelector();
  }

  function purchaseCarColor(index) {
    let data = loadPersistentData();
    if (!data.purchasedColorsByCarType) data.purchasedColorsByCarType = {};
    if (!data.purchasedColorsByCarType[selectedCarType]) {
      data.purchasedColorsByCarType[selectedCarType] = Array(getColorCountForCarType(selectedCarType)).fill(false);
      data.purchasedColorsByCarType[selectedCarType][0] = true; // First color free
    }
  
    let purchasedColors = data.purchasedColorsByCarType[selectedCarType];
  
    if (!purchasedColors[index]) {
      if (CurrencyManager.getTotalCoins() >= 10) {
        CurrencyManager.spendCoins(10); // 🔥 TAKE 10 COINS
        purchasedColors[index] = true;
      } else {
        console.log("Not enough coins to unlock this color.");
        return; // Don't select if you can't afford
      }
    }
  
    selectedCarColor = index;
    savePersistentData(data);
  }
   
  
  
  function computeCalcStats() {
    return {
      health: DEFAULT_CAR_STATS.health + (upgradeBodyLevel - 1) * 5,
      dmgRes: DEFAULT_CAR_STATS.dmgRes + (upgradeBodyLevel - 1),
      boost: DEFAULT_CAR_STATS.boost,
      maxSpeed: DEFAULT_CAR_STATS.maxSpeed + ((upgradeTransmissionLevel+upgradeEngineLevel)/2 - 1) * 0.5,
      acceleration: DEFAULT_CAR_STATS.acceleration + ((upgradeTransmissionLevel+upgradeEngineLevel)/2 - 1) * 0.1,
      traction: DEFAULT_CAR_STATS.traction + (upgradeTiresLevel - 1) * 0.05,
    };
  }

  function formatNumber(num) {
    let fixed = num.toFixed(2);
    return fixed.indexOf('.') !== -1 ? fixed.replace(/\.0+$/, '') : fixed;
  }

  function getPrice(partType){
    if (window.debug) return 0;
    const level = getUpgradeLevel(partType);
    return Math.floor((BASE_UPGRADE_PRICE * 3 * Math.log(BASE_UPGRADE_PRICE) * (level * level) / 20));
  }

  p.draw = function () {
    p.background(bgImage || [30, 30, 30]);
    ExitIcon.display(p);
    if (resetUpgradeButton) resetUpgradeButton.display(p);
    if (debugAddCoinsButton) debugAddCoinsButton.display(p);

    carBoxes.forEach(box => {
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);
    
      let img = window.cars?.[box.index];
      if (img) {
        let data = loadPersistentData();
        let purchasedColors = data.purchasedColorsByCarType?.[selectedCarType] || [];
    
        if (!purchasedColors[box.index]) {
          p.tint(100); // Gray out locked color
        }
        p.image(img, box.x, box.y, box.w, box.h);
        p.noTint();
      }
    
      // 🔥 SHOW THE PRICE if it's locked!
      let data = loadPersistentData();
      let purchasedColors = data.purchasedColorsByCarType?.[selectedCarType] || [];
      if (!purchasedColors[box.index]) {
        const coinSize = 14 * window.widthScale;
        const coinX = box.x + box.w/2 - coinSize - 4 * window.widthScale;
        const textX = coinX + coinSize + 4 * window.widthScale;
        const y = box.y + box.h;
    
        p.image(coinUp, coinX, y - coinSize, coinSize, coinSize);
        p.fill(255, 215, 0);
        p.textSize(20 * window.scale);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text(10, textX, y); // Draw 10 as price
      }
    
      // 🔥 HIGHLIGHT SELECTED
      if (box.index === selectedCarColor) {
        p.stroke(255, 0, 0);
        p.strokeWeight(3);
        p.noFill();
        p.rect(box.x, box.y, box.w, box.h);
        p.strokeWeight(1);
      }
    });
            

    let centerX = p.width / 2 - 160 * window.widthScale;
    let centerY = p.height / 2 - 100 * window.heightScale;
    if (window.cars?.[selectedCarIndex]) {
      p.image(window.cars[selectedCarIndex], 
             centerX - (42.24 * window.widthScale),
             centerY - (100 * window.heightScale),
             318.72 * window.widthScale,
             319.68 * window.heightScale);
    }

    upgrades.forEach(up => {
      p.stroke(0);
      p.fill(211);
      p.rect(up.box.x, up.box.y, up.box.w, up.box.h);
      p.fill(0);
      p.textSize(24 * window.scale);
      p.textAlign(p.CENTER, p.CENTER);
      p.strokeWeight(0);
      p.text(up.label, up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 - 10 * window.heightScale);
      p.text("Lvl " + getUpgradeLevel(up.type), up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 + 15 * window.heightScale);
      
      up.button.display(p);
    });

    const consumables = upgrades.filter(u => ["wrench", "bomb", "oil", "shield","boat"].includes(u.type));
    consumables.forEach(up => {
      p.stroke(0);
      p.fill(200);
      p.rect(up.box.x, up.box.y, up.box.w, up.box.h);
      p.fill(0);
      p.textSize(24 * window.scale);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(up.label, up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 - 10 * window.heightScale);
      up.button.display(p);
    });

    let stats = computeCalcStats();
    let panelX = p.width - 270 * window.widthScale;
    let panelY = (p.height - 200 * window.heightScale) / 2;
    p.fill(255, 255, 255, 204);
    p.noStroke();
    p.rect(panelX, panelY, 250 * window.widthScale, 200 * window.heightScale);
    p.fill(0);
    p.textSize(24 * window.scale);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Stats", panelX + 10 * window.widthScale, panelY + 10 * window.heightScale);
    p.stroke(0);
    p.strokeWeight(1);
    p.line(panelX + 10 * window.widthScale, panelY + 28 * window.heightScale, 
           panelX + 240 * window.widthScale, panelY + 28 * window.heightScale);
    p.noStroke();
    p.strokeWeight(0);

    let names = ["Health", "Boost", "Max Speed", "Acceleration", "Traction", "Dmg Res"];
    let bases = [savedStats.health, savedStats.boost, savedStats.maxSpeed, savedStats.acceleration, savedStats.traction, savedStats.dmgRes];
    let vals = [stats.health, stats.boost, stats.maxSpeed, stats.acceleration, stats.traction, stats.dmgRes];
    for (let i = 0; i < names.length; i++) {
      let y = panelY + 35 * window.heightScale + i * 20 * window.heightScale;
      p.textAlign(p.LEFT); 
      p.text(names[i], panelX + 10 * window.widthScale, y);
      p.textAlign(p.RIGHT);
      let v = formatNumber(vals[i]);
      p.text(v, panelX + 240 * window.widthScale, y);
    }

    p.push();
    p.image(coinBg, 20 * window.widthScale, 20 * window.heightScale, 128 * window.widthScale, 64 * window.heightScale);
    p.fill(0);
    p.textSize(24 * window.scale);
    p.textAlign(p.LEFT, p.TOP);
    p.text(Math.floor(CurrencyManager.getTotalCoins()), 65 * window.widthScale, 45 * window.heightScale);
    p.pop();
  };

  p.mousePressed = function() {
    for (let box of carBoxes) {
      if (p.mouseX >= box.x && p.mouseX <= box.x + box.w &&
          p.mouseY >= box.y && p.mouseY <= box.y + box.h) {
        purchaseCarColor(box.index);
        return;
      }
    }
  
    // Then check other buttons like upgrades, exit, etc
    for (let up of upgrades) {
      if (up.button.isMouseOver(p)) {
        if (["wrench", "bomb", "oil", "shield", "boat"].includes(up.type)) {
          return purchaseItem(up.type);
        } else {
          return purchaseUpgrade(up.type);
        }
      }
    }
  
    if (resetUpgradeButton && window.debug && resetUpgradeButton.isMouseOver(p)) return resetUpgrades();
    if (debugAddCoinsButton && window.debug && debugAddCoinsButton.isMouseOver(p)) return debugAddCoins();
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
    window.heightScale = p.windowHeight / 1080;
    window.widthScale = p.windowWidth / 1920;
    window.scale = (window.heightScale + window.widthScale) / 2;
    
    ExitIcon = new Button("ExitIcon", p.width - 45 * window.widthScale, 45 * window.heightScale, () => switchSketch(Mode.TITLE));
    if (window.debug) debugAddCoinsButton = new UpgradeButton("Coins", 80 * window.widthScale, p.height - 80 * window.heightScale, debugAddCoins, "gray");
    
    setupUpgradeLayout();
    setupItemPurchaseButtons();
    setupCarBodySelector();
  };

  function saveConfiguration() {
    let data = loadPersistentData();
    if (!data) data = {};
  
    if (!data.upgradesByCarType) data.upgradesByCarType = {};
    if (!data.purchasedColorsByCarType) data.purchasedColorsByCarType = {};
    if (!data.purchasedCarTypes) data.purchasedCarTypes = [true, false, false];
  
    data.selectedCarType = selectedCarType;
    data.selectedCarColor = selectedCarColor;
  
    data.upgradesByCarType[selectedCarType] = {
      engine: upgradeEngineLevel,
      body: upgradeBodyLevel,
      transmission: upgradeTransmissionLevel,
      tires: upgradeTiresLevel
    };
  
    if (!data.purchasedColorsByCarType[selectedCarType]) {
      data.purchasedColorsByCarType[selectedCarType] = Array(getColorCountForCarType(selectedCarType)).fill(false);
      data.purchasedColorsByCarType[selectedCarType][0] = true;
    }
  
    if (!data.purchasedCarTypes[selectedCarType]) {
      data.purchasedCarTypes[selectedCarType] = true;
    }
  
    data.stats = computeCalcStats();
    data.unlockedItems = ItemsManager.unlockedItems;
  
    savedStats = { ...data.stats };
    savePersistentData(data);
  }
  

  function resetUpgrades() {
    upgradeEngineLevel = 1;
    upgradeBodyLevel = 1;
    upgradeTransmissionLevel = 1;
    upgradeTiresLevel = 1;
  
    ItemsManager.unlockedItems = {
      wrench: false,
      bomb: false,
      oil: false,
      shield: false,
      boat: false
    };
  
    purchasedCars = [true, false, false, false, false, false, false, false];
    selectedCarIndex = 0;
  
    const itemPrices = {
      wrench: window.debug ? 0 : ITEM_PRICES.wrench,
      bomb: window.debug ? 0 : ITEM_PRICES.bomb,
      oil: window.debug ? 0 : ITEM_PRICES.oil,
      shield: window.debug ? 0 : ITEM_PRICES.shield,
      boat: window.debug ? 0 : ITEM_PRICES.boat
    };

    upgrades.forEach(up => {
      if (["wrench", "bomb", "oil", "shield","boat"].includes(up.type)) {
        up.button.label = itemPrices[up.type];
      } else {
        updateUpgradeButtonText(up);
      }
    });    
  
    saveConfiguration();
    console.log("Upgrades and item purchases reset.");
  }  
}

function debugAddCoins() {
  if(window.debug){
    CurrencyManager.updateTotalCoins(1000);
    console.log("Debug: Added 1000 coins. Total coins:", CurrencyManager.getTotalCoins());
  }
}