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
    p.textSize(Math.round(25 * window.scale));
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
  wrench: 250,
  bomb: 500,
  oil: 750,
  shield: 1000,
  boat: 25000
};

function GarageSketch(p) {
  console.log(CurrencyManager.getTotalCoins());
  let upgradeEngineLevel = 1;
  let upgradeBodyLevel = 1;
  let upgradeTransmissionLevel = 1;
  let upgradeTiresLevel = 1;

  let carUpgrades = {
    normal: { engine: 1, body: 1, transmission: 1, tires: 1 },
    truck: { engine: 1, body: 1, transmission: 1, tires: 1 },
    supercar: { engine: 1, body: 1, transmission: 1, tires: 1 },
  };

  let carColorsUnlocked = {
    normal: [true, false, false, false, false, false, false, false],
    truck:  [true, false, false, false, false, false],
    supercar: [true,false]
  };

  let purchasedCarTypes = {
    normal: true,
    truck: false,
    supercar: false,
  };

  let selectingCarType = false;   // Flag for if were picking a different cr
  let carTypeBoxes = [];
  let moreCarsButton;     // Something tells me this is wrong but it works

  let selectedCarIndex = 0;     // Color index
  let selectedCarType = CarType.NORMAL;  // (normal, truck, supercar)

  const CAR_COLOR_COST = 10;
  const CAR_TYPE_PRICES = {
    normal: 0,
    truck: 3000,
    supercar: 10000
  };

  let BASE_UPGRADE_PRICE = 25;
  let DEFAULT_CAR_STATS = { ...window.carBaseStats[selectedCarType] };
  let savedStats = { ...DEFAULT_CAR_STATS };
  let upgrades = [], carBoxes = [], resetUpgradeButton;
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
      if (typeof savedConfig.upgradeEngineLevel === "number") upgradeEngineLevel = savedConfig.upgradeEngineLevel;
      if (typeof savedConfig.upgradeBodyLevel === "number") upgradeBodyLevel = savedConfig.upgradeBodyLevel;
      if (typeof savedConfig.upgradeTransmissionLevel === "number") upgradeTransmissionLevel = savedConfig.upgradeTransmissionLevel;
      if (typeof savedConfig.upgradeTiresLevel === "number") upgradeTiresLevel = savedConfig.upgradeTiresLevel;
      if (typeof savedConfig.selectedCar === "number") selectedCarIndex = savedConfig.selectedCar;
      if (typeof savedConfig.selectedCarType === "string") selectedCarType = savedConfig.selectedCarType;
      if (savedConfig?.carUpgrades) {
        carUpgrades = savedConfig.carUpgrades;
      }
      if (savedConfig?.carColorsUnlocked) {
        carColorsUnlocked = savedConfig.carColorsUnlocked;
      }
      if (savedConfig?.purchasedCarTypes) {
        purchasedCarTypes = savedConfig.purchasedCarTypes;
      }
      loadCarUpgrades(selectedCarType);

      //loadCarUpgrades(selectedCarIndex); 
      
    }

    DEFAULT_CAR_STATS = { ...window.carBaseStats[selectedCarType] };
    let savedStats = { ...DEFAULT_CAR_STATS };
    if (savedConfig?.unlockedItems) {
      ItemsManager.unlockedItems = { ...savedConfig.unlockedItems };
    }
  
    setupUpgradeLayout();
    setupItemPurchaseButtons();
    if(selectedCarType != "supercar") setupCarBodySelector(); // We dont draw bodys for the supercar
    moreCarsButton = new Button("More Cars", p.width - 350 * window.widthScale, 75 * window.heightScale, () => {
      selectingCarType = true;
      setupCarTypeSelector();
    });
    bgMusic(Mode.GARAGE, p, "loop");
    window.LoadingScreen && window.LoadingScreen.hide();
  };

  // Saves the active car upgrades to the dictionary upgrades
  function saveCarUpgrades(type) {
    console.log("index 1: " + selectedCarIndex);
    carUpgrades[type] = {
      engine: upgradeEngineLevel,
      body: upgradeBodyLevel,
      transmission: upgradeTransmissionLevel,
      tires: upgradeTiresLevel
    };
  }
  
  function loadCarUpgrades(type) {

    console.log("index 2: " + selectedCarIndex);
    let upgrades = carUpgrades[type];
    if (!upgrades) {
      upgrades = { engine: 1, body: 1, transmission: 1, tires: 1 };
      carUpgrades[type] = upgrades;
    }
    upgradeEngineLevel = upgrades.engine;
    upgradeBodyLevel = upgrades.body;
    upgradeTransmissionLevel = upgrades.transmission;
    upgradeTiresLevel = upgrades.tires;
  }
  
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
  
    const types = ['body', 'engine', 'transmission', 'tires'];
    types.forEach((type, i) => {
      const x = startX + i * (size + spacing);
      const level = getUpgradeLevel(type);
      const price = getPrice(type);
      const btn = new UpgradeButton(price, x + size / 2, buttonY, () => purchaseUpgrade(type), "upgrade", 172.8 * window.widthScale, 48.6 * window.heightScale);
      upgrades.push({ type, label: type.charAt(0).toUpperCase() + type.slice(1), box: { x, y: boxY, w: size, h: size }, button: btn });
      updateUpgradeButtonText(upgrades[upgrades.length - 1]);
    });
  
    setupItemPurchaseButtons();
  }

  function setupCarTypeSelector() {
    carTypeBoxes = [];
    const carBoxSize = 200 * window.widthScale; 
    const spacing = 25 * window.widthScale;
    const types = ['normal', 'truck', 'supercar'];
    const totalWidth = types.length * carBoxSize + (types.length - 1) * spacing;
    const startX = (p.width - totalWidth) / 2;
    const startY = 20 * window.heightScale;
    types.forEach((type, i) => {
      carTypeBoxes.push({
        type,
        x: startX + i * (carBoxSize + spacing),
        y: startY,
        w: carBoxSize,
        h: carBoxSize
      });
    });
  }
  

  function setupItemPurchaseButtons() {
    const itemTypes = ['wrench', 'bomb', 'oil', 'shield', 'boat'];
    const spacing = p.height * 0.13;
    const boxWidth = p.width * 0.05;
    const boxHeight = p.height * 0.08;
    const x = p.width * 0.04;
    const startY = p.height * 0.3;
  
    itemTypes.forEach((item, index) => {
      const y = startY + index * spacing;
      const label = item.charAt(0).toUpperCase() + item.slice(1);
      const level = ItemsManager.unlockedItems[item] || 0;
      const isUnlocked = level > 0;
      const isMaxed = level >= 5;
  
      const box = { x, y, w: boxWidth, h: boxHeight };
      const buttonY = y - p.height * 0.017;
  
      let btnLabel;
      let btnCallback;
  
      if (item === 'boat') {
        // Special logic for the boat
        if (isUnlocked) {
          btnLabel = "OWNED";
          btnCallback = () => {}; // No action needed
        } else {
          btnLabel = ITEM_PRICES[item];
          btnCallback = () => purchaseItem(item);
        }
      } else {
        console.log("testing button: ");
        // Logic for other items
        if (!isUnlocked) {
          btnLabel = window.debug ? 0 : ITEM_PRICES[item];
          btnCallback = () => purchaseItem(item);
        } else if (isMaxed) {
          btnLabel = "MAX";
          btnCallback = () => {};
        } else {
          btnLabel = getItemUpgradePrice(item, level + 1);
          btnCallback = () => purchaseItemUpgrade(item);
        }
      }
  
      const btn = new UpgradeButton(btnLabel, x + boxWidth / 2, buttonY, btnCallback, "item", boxWidth * 0.95, boxHeight * 0.4);
      upgrades.push({ type: item, label, box, button: btn });
    });
  }

  function purchaseItem(itemType) {
    console.log("purchase item")
    const price = window.debug ? 0 : ITEM_PRICES[itemType];
    if (CurrencyManager.getTotalCoins() >= price) {
      CurrencyManager.spendCoins(price);
      ItemsManager.unlockItem(itemType);
  
      upgrades.forEach(up => {
        if (up.type === itemType) {
          up.button.label = getItemUpgradePrice(itemType, 2);
          up.button.callback = () => purchaseItemUpgrade(itemType);
        }
      });
  
      saveConfiguration();
    } else {
      console.log("Not enough coins for " + itemType);
    }
  }

  // Creates boxes for the car colors
  function setupCarBodySelector() {
    setupUpgradeLayout();
    carBoxes = [];
    let carBoxSize = 96 * window.widthScale;
    let cols = carColorsUnlocked[selectedCarType].length;
    let spacing = 10 * window.widthScale;
    let totalWidth = cols * carBoxSize + (cols - 1) * spacing;
    let startX = (p.width - totalWidth) / 2;
    let startY = 20 * window.heightScale;

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

  function purchaseCarColor(index) {

    //console.log("index bought: " + selectedCarIndex);
    if (carColorsUnlocked[selectedCarType][index]) {
      // Already own color, just select it
      selectedCarIndex = index;
      saveConfiguration();
      return;
    }
  
    if (CurrencyManager.getTotalCoins() >= CAR_COLOR_COST) {
      CurrencyManager.spendCoins(CAR_COLOR_COST);
      carColorsUnlocked[selectedCarType][index] = true;
      selectedCarIndex = index;
      saveConfiguration();
      console.log(`Purchased color ${index} for ${selectedCarType}`);
    } else {
      console.log("Not enough coins for car color.");
    }
  }

  function switchCarType(newType) {
    if (!purchasedCarTypes[newType]) {
      console.log("Car type not purchased yet!");
      return;
    }
    saveCarUpgrades(selectedCarType); // Save old
    selectedCarType = newType;
    selectedCarIndex = 0; // Reset color selection to first color
    loadCarUpgrades(selectedCarType); // Load new
    DEFAULT_CAR_STATS = { ...window.carBaseStats[selectedCarType] };
    savedStats = { ...DEFAULT_CAR_STATS };
    setupUpgradeLayout();
    saveConfiguration();
  }

  function drawCarTypeSelector() {
    carTypeBoxes.forEach(box => {
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);
  
      if (purchasedCarTypes[box.type]) {
        // Show the car image if the car type is purchased
        let carImage = window.cars?.[box.type]?.[0]; // Get the first image of the car type
        if (carImage) {
          const imageSize = box.w * 0.8; // Scale the image to fit inside the box
          if (box.type === "truck" || box.type === "supercar") {
            p.image(
              carImage,
              box.x + (box.w - imageSize) / 2, // Center the image horizontally
              box.y + (box.h - imageSize * 0.6) / 2, // Center the image vertically
              imageSize,
              imageSize * 0.6
            );
          } else if (box.type === "normal") {
            p.image(
              carImage,
              box.x + (box.w - imageSize) / 2, // Center the image horizontally
              box.y + (box.h - imageSize) / 2, // Center the image vertically
              imageSize,
              imageSize
            );
          }
        }
      } else {
        // Show a question mark if the car type is not purchased
        p.fill(0);
        p.textSize(50 * window.scale);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("?", box.x + box.w / 2, box.y + box.h / 2);
      }
  
      // Draw the car type name or cost
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(28 * window.scale);
      p.text(box.type.toUpperCase(), box.x + box.w / 2, box.y + 5 * window.heightScale);
      
      p.textAlign(p.CENTER, p.BOTTOM);
      p.textSize(25 * window.scale);
      let cost = CAR_TYPE_PRICES[box.type];
      if (purchasedCarTypes[box.type]) {
        p.text("OWNED", box.x + box.w / 2, box.y + box.h - 5 * window.heightScale);
      } else {
        p.text(cost + " Coins", box.x + box.w / 2, box.y + box.h - 5 * window.heightScale);
      }
    });
  }
  

  function computeCalcStats() {
    if(selectedCarType == "normal"){
      return {
        health: DEFAULT_CAR_STATS.health + (upgradeBodyLevel - 1) * 4,
        damageRes: DEFAULT_CAR_STATS.damageRes + Math.round((upgradeBodyLevel - 1)*.5),
        boost: DEFAULT_CAR_STATS.boost,
        maxSpeed: DEFAULT_CAR_STATS.maxSpeed + (upgradeEngineLevel - 1) * 0.85,
        acceleration: DEFAULT_CAR_STATS.acceleration + (upgradeTransmissionLevel) * 0.05,
        traction: DEFAULT_CAR_STATS.traction + (upgradeTiresLevel - 1) * 0.041,
      };
    } else if(selectedCarType == "truck") {
      return {
        health: DEFAULT_CAR_STATS.health + (upgradeBodyLevel - 1) * 5,
        damageRes: DEFAULT_CAR_STATS.damageRes + Math.round((upgradeBodyLevel - 1)*0.8),
        boost: DEFAULT_CAR_STATS.boost,
        maxSpeed: DEFAULT_CAR_STATS.maxSpeed + (upgradeEngineLevel - 1) * 0.6,
        acceleration: DEFAULT_CAR_STATS.acceleration + (upgradeTransmissionLevel) * 0.042,
        traction: DEFAULT_CAR_STATS.traction + (upgradeTiresLevel - 1) * 0.033,
      };
    } else if (selectedCarType == "supercar") {
      return {
        health: DEFAULT_CAR_STATS.health + (upgradeBodyLevel - 1) * 3,
        damageRes: DEFAULT_CAR_STATS.damageRes + Math.round((upgradeBodyLevel - 1)*.4),
        boost: DEFAULT_CAR_STATS.boost,
        maxSpeed: DEFAULT_CAR_STATS.maxSpeed + (upgradeEngineLevel - 1) * 1.1138,
        acceleration: DEFAULT_CAR_STATS.acceleration + (upgradeTransmissionLevel) * 0.1,
        traction: DEFAULT_CAR_STATS.traction + (upgradeTiresLevel - 1) * 0.056,
      };
    }
  }

  function formatNumber(num) {
    let fixed = num.toFixed(2);
    return fixed.indexOf('.') !== -1 ? fixed.replace(/\.0+$/, '') : fixed;
  }

  function getPrice(partType){
    if (window.debug) return 0;
    const level = getUpgradeLevel(partType);
    let adjustedPrice = BASE_UPGRADE_PRICE;
    if(selectedCarType == "truck")
      adjustedPrice = BASE_UPGRADE_PRICE *1.5;
    else if (selectedCarType == "supercar")
      adjustedPrice = BASE_UPGRADE_PRICE *2;
    return Math.floor((adjustedPrice * 3 * Math.log(adjustedPrice) * (level * level) / 20));
  }

  p.draw = function () {
    p.background(bgImage || [30, 30, 30]);
    ExitIcon.display(p);
    if (!selectingCarType && moreCarsButton) moreCarsButton.display(p);
    if (resetUpgradeButton) resetUpgradeButton.display(p);
    if (debugAddCoinsButton) debugAddCoinsButton.display(p);
    if (selectingCarType) {
      drawCarTypeSelector();
    } else {
      if (selectedCarType != "supercar"){ // We dont draw colors for the supercar
        carBoxes.forEach(box => {
          p.stroke(0);
          p.fill(211);
          p.rect(box.x, box.y, box.w, box.h);
      
          let img = window.cars?.[selectedCarType][box.index];
          if (img) {
            if (!carColorsUnlocked[selectedCarType][box.index]) {
              p.tint(100);
            }
            if(selectedCarType == "truck"){
              p.image(img, box.x, box.y+(box.h*.15), box.w, box.h*.7);
              p.noTint();
            }else {
              p.image(img, box.x, box.y, box.w, box.h);
              p.noTint();
            }
          }
      
          if (!carColorsUnlocked[selectedCarType][box.index]) {
            const coinSize = 14 * window.widthScale;
            let coinX = box.x + box.w / 2 - coinSize - 4 * window.widthScale;
            let textX = coinX + coinSize + 4 * window.widthScale;
            let y = box.y + box.h;
          
            p.image(coinUp, coinX, y - coinSize, coinSize, coinSize);
            p.fill(255, 215, 0);
            p.textSize(Math.round(20 * window.scale));
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
    }
    

    let centerX = p.width / 2 - 160 * window.widthScale;
    let centerY = p.height / 2 - 100 * window.heightScale;
    if (window.cars?.[selectedCarType][selectedCarIndex]) {
      if(selectedCarType == "truck" || selectedCarType == "supercar"){  // Draws elongated cars for special cars
        p.image(window.cars[selectedCarType][selectedCarIndex], 
              centerX - (42 * window.widthScale),
              centerY - (100 * window.heightScale),
              450 * window.widthScale,
              300 * window.heightScale);
        }else {
          p.image(window.cars[selectedCarType][selectedCarIndex], 
            centerX - (42 * window.widthScale),
            centerY - (100 * window.heightScale),
            350 * window.widthScale,
            350 * window.heightScale);
        }
    }

    upgrades.forEach(up => {
      p.stroke(0);
      p.fill(211);
      p.rect(up.box.x, up.box.y, up.box.w, up.box.h);
      p.fill(0);
      p.textSize(Math.round(30 * window.scale));
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
      p.textSize(Math.round(30 * window.scale));
      p.textAlign(p.CENTER, p.CENTER);
      p.text(up.label, up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 - 10);
    
      const lvl = ItemsManager.unlockedItems[up.type];
      if (up.type === "boat") {
        // Special logic for the boat
        if (lvl) {
          p.text("OWNED", up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 + 15);
        } 
      } else if (lvl && typeof lvl === "number") {
        // Logic for other consumables
        p.text("Lvl " + lvl, up.box.x + up.box.w / 2, up.box.y + up.box.h / 2 + 15);
      }
    
      up.button.display(p);
    });
    let stats = computeCalcStats();
    let panelX = p.width - 440 * window.widthScale;
    let panelY = (p.height - 200 * window.heightScale) / 2;
    p.fill(255, 255, 255, 204);
    p.noStroke();
    p.rect(panelX, panelY, 400 * window.widthScale, 170 * window.heightScale);
    p.fill(0);
    p.textSize(Math.round(32 * window.scale));
    p.textAlign(p.LEFT, p.TOP);
    p.text("Stats", panelX + 10 * window.widthScale, panelY + 10 * window.heightScale);
    p.stroke(0);
    p.strokeWeight(1);
    p.line(panelX + 10 * window.widthScale, panelY + 36 * window.heightScale, 
           panelX + 340 * window.widthScale, panelY + 36 * window.heightScale);
    p.noStroke();
    p.strokeWeight(0);
    
    let names = ["Health", "Max Speed", "Acceleration", "Traction", ];
    let bases = [savedStats.health, savedStats.boost, savedStats.maxSpeed, savedStats.acceleration, savedStats.traction, savedStats.damageRes];
    let vals = [stats.health, stats.boost, stats.maxSpeed, stats.acceleration, stats.traction, stats.damageRes];
    for (let i = 0; i < names.length; i++) {    // Draws the numbers
      let y = panelY + 40 * window.heightScale + i * 30 * window.heightScale;
      p.textAlign(p.RIGHT);
      let v;
      if(i>=1 )  // Skips the boost stat
        v = formatNumber(vals[i+1]);
      else 
        v = formatNumber(vals[i]);
      p.text(v, panelX + 230 * window.widthScale, y);
    }
    for (let i = 0; i < names.length; i++) {  // Draws stat names
      let y = panelY + 40 * window.heightScale + i * 30 * window.heightScale;
      let statName = names[i];
      let statX = panelX + 5 * window.widthScale;
      let circleXStart = statX + 255 * window.widthScale;
      let level = 1;

      // Match level to stat name
      if (statName === "Health" || statName === "Dmg Res") level = upgradeBodyLevel;
      else if (statName === "Max Speed") level = upgradeEngineLevel;
      else if (statName === "Acceleration") level = upgradeTransmissionLevel;
      else if (statName === "Traction") level = upgradeTiresLevel;
      else level = 1;

      // Draw label
      p.textAlign(p.LEFT);
      p.fill(0);
      p.textSize(Math.round(32 * window.scale));
      p.text(statName, statX, y);

      // Draw 5 circle slots (background grey, then filled red as needed)
      let radius = 10 * window.scale;
      let gap = 12 * window.widthScale;
      for (let j = 0; j < 5; j++) {
        let cx = circleXStart + j * (radius * 2 + gap);
        let cy = y + radius * 1.2;

        // grey background
        p.fill(180);
        p.circle(cx, cy, radius * 2);

        let fillFraction = Math.min(Math.max(level * 0.5 - j, 0), 1); // 0 to 1

        if (fillFraction > 0) {
          p.noStroke();
          p.fill(200, 0, 0); // red

          let clipX = cx - radius;
          let clipY = cy - radius;
          let clipWidth = 2 * radius * fillFraction;
          let clipHeight = 2 * radius;

          // Save current state
          p.push();
          // Set clipping area
          p.drawingContext.save();
          p.drawingContext.beginPath();
          p.drawingContext.rect(clipX, clipY, clipWidth, clipHeight);
          p.drawingContext.clip();

          // Draw red circle inside clipped region
          p.circle(cx, cy, radius * 2);

          // Restore clipping
          p.drawingContext.restore();
          p.pop();
        }
      }
    }

    p.push();
    p.image(coinBg, 20 * window.widthScale, 20 * window.heightScale, 128 * window.widthScale, 64 * window.heightScale);
    p.fill(0);
    p.textSize(Math.round(24 * window.scale));
    p.textAlign(p.LEFT, p.TOP);
    p.text(Math.floor(CurrencyManager.getTotalCoins()), 65 * window.widthScale, 45 * window.heightScale);
    p.pop();
  };

  p.mousePressed = function () {
    if (!selectingCarType && moreCarsButton && moreCarsButton.isMouseOver(p)) {
      moreCarsButton.callback();
      return;
    }
    
    if (selectingCarType) {
      for (let box of carTypeBoxes) {
        if (p.mouseX >= box.x && p.mouseX <= box.x + box.w && p.mouseY >= box.y && p.mouseY <= box.y + box.h) {
          // Purchase or Switch
          console.log("box type: " + box.type)
          if (purchasedCarTypes[box.type]) {
            switchCarType(box.type);
          } else if (CurrencyManager.getTotalCoins() >= CAR_TYPE_PRICES[box.type]) {
            CurrencyManager.spendCoins(CAR_TYPE_PRICES[box.type]);
            purchasedCarTypes[box.type] = true;
            switchCarType(box.type);
            saveConfiguration();
          } else {
            console.log("Not enough coins for " + box.type);
            return;
          }
  
          selectingCarType = false;
          if(selectedCarType != "supercar") setupCarBodySelector(); 
          saveConfiguration();
          return;
        }
      }
      if (ExitIcon.isMouseOver(p)) {
        bgMusic(Mode.GARAGE, p, "stop");
        ExitIcon.callback();
        return;
      }
      return;
    }
  
    // Normal garage clicks:
    for (let box of carBoxes) {
      if (p.mouseX >= box.x && p.mouseX <= box.x + box.w && p.mouseY >= box.y && p.mouseY <= box.y + box.h) {
        if (carColorsUnlocked[selectedCarType][box.index]) {
          selectedCarIndex = box.index;
          saveConfiguration();
        } else {
          purchaseCarColor(box.index);
        }
        return;
      }
    }
  
    for (let up of upgrades) {
      if (up.button.isMouseOver(p)) {
        up.button.callback();
        return;
      }
    }    
  
    if (resetUpgradeButton && window.debug && resetUpgradeButton.isMouseOver(p)) {
      return resetUpgrades();
    }
    if (window.debug) if (debugAddCoinsButton.isMouseOver(p)) return debugAddCoins();
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
    if (!window.debug) debugAddCoinsButton = new UpgradeButton("Coins", 80 * window.widthScale, p.height - 80 * window.heightScale, debugAddCoins, "gray");
    
    setupUpgradeLayout();
    setupItemPurchaseButtons();
    setupCarBodySelector();
    moreCarsButton = new Button("More Cars", p.width - 375 * window.widthScale, 75 * window.heightScale, () => {
      selectingCarType = true;
      setupCarTypeSelector();
    });
    
  };

  function saveConfiguration() {
    console.log("car index saved: " + selectedCarIndex);
    saveCarUpgrades(selectedCarType);
    console.log("supercars saved: " + purchasedCarTypes)
    let config = {
      carUpgrades,
      carColorsUnlocked,
      purchasedCarTypes,
      selectedCar: selectedCarIndex,
      selectedCarType: selectedCarType,
      stats: computeCalcStats(),
      unlockedItems: ItemsManager.unlockedItems
    };
  
    savedStats = { ...config.stats };
    savePersistentData(config);
  }
  
  

  function resetUpgrades() {
    upgradeEngineLevel = 1;
    upgradeBodyLevel = 1;
    upgradeTransmissionLevel = 1;
    upgradeTiresLevel = 1;
    
    carUpgrades = {
      normal: { engine: 1, body: 1, transmission: 1, tires: 1 },
      truck: { engine: 1, body: 1, transmission: 1, tires: 1 },
      supercar: { engine: 1, body: 1, transmission: 1, tires: 1 }
    };
  
    carColorsUnlocked = {
      normal: [true, false, false, false, false, false, false, false],
      truck:  [true, false, false, false, false, false],
      supercar: [true, false]
    };
  
    purchasedCarTypes = {
      normal: true,
      truck: false,
      supercar: false
    };
  
    selectedCarIndex = 0;     // Color index
    selectedCarType = CarType.NORMAL;  // (normal, truck, supercar)

    
    ItemsManager.unlockedItems = {
      wrench: false,
      bomb: false,
      oil: false,
      shield: false,
      boat: false
    };
  
    //purchasedCarsColor = [true, false, false, false, false, false, false, false];
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
  function purchaseItemUpgrade(itemType) {
    console.log("Purchase " + itemType);
    if (itemType == "boat") { //If we've bought a boat we skip this function
      console.log(itemType + " already unlocked.");
      return;
    } 
    let level = ItemsManager.unlockedItems[itemType];
    if (level >= 5) return;

    const price = getItemUpgradePrice(itemType, level + 1);
    if (window.debug || CurrencyManager.getTotalCoins() >= price) {
      CurrencyManager.spendCoins(price);
      ItemsManager.upgradeItem(itemType);

      upgrades.forEach(up => {
        if (up.type === itemType) {
          const newLevel = ItemsManager.unlockedItems[itemType];
          up.button.label = newLevel >= 5 ? "MAX" : getItemUpgradePrice(itemType, newLevel + 1);
        }
      });

      saveConfiguration();
    } else {
      console.log("Not enough coins to upgrade " + itemType);
    }
  }
  function getItemUpgradePrice(itemType, level) {
    if (window.debug) return 0;
    const basePrice = ITEM_PRICES[itemType] || 1000;
    return Math.floor(basePrice * level * 0.6);
  }
  function debugAddCoins() {
    if(window.debug){
    CurrencyManager.updateTotalCoins(10000);
    console.log("Debug: Added 10000 coins. Total coins:", CurrencyManager.getTotalCoins());}
  }
}
