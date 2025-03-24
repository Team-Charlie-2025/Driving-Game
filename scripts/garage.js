// scripts/garage.js

function GarageSketch(p) {
  // Add vehicle type selection
  let selectedVehicleType = 0; // 0 = Car, 1 = Van
  let vehicleBoxes = [];
  
  // Existing variables
  let selectedCarIndex = 0;
  let selectedEngineIndex = 0;
  let selectedWheelIndex = 0;

  // loads defaults / overwrites if found *later on
  const DEFAULT_CAR_STATS = { ...window.defaultData.stats };
  let savedStats = { ...DEFAULT_CAR_STATS };

  let exit;

  let carBoxes = [];
  let engineBoxes = [];
  let wheelBoxes = [];

  let saveButton;

  // Add vehicle type data
  const vehicleTypes = [
    { name: "Car", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Van", maxSpeed: -2, boost: 50, health: 60, acceleration: -0.1, turn: -0.02, dmgRes: 15 }
  ];

  // Existing data arrays
  const dataBody = [
    { name: "Blue Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Green Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Light Blue Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Light Green Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Light Purple Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Orange Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Purple Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Red Stripe", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 }
  ];
  const dataEngine = [
    { name: "V4", maxSpeed: 0, boost:0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "V6", maxSpeed: 1, boost: 10, health: -10, acceleration: 0.2, turn: -0.01, dmgRes: -1 },
    { name: "V8", maxSpeed: 3, boost: 30, health: -30, acceleration: 0.3, turn: -0.02, dmgRes: -2 }
  ];

  const dataTire = [
    { name: "Standard", maxSpeed: 0, boost: 0, health: 0, acceleration: 0, turn: 0, dmgRes: 0 },
    { name: "Racing", maxSpeed: 1, boost: 0, health: -10, acceleration: 0.1, turn: -0.02, dmgRes: 0 },
    { name: "Snow", maxSpeed: -1, boost: 0, health: 10, acceleration: -0.1, turn: 0.03, dmgRes: 0 }
  ];

  p.preload = function() { 
    loadMusic(p);
    loadSoundEffects(p);
    coinBg = p.loadImage("graphics/coinBack.png");
    bgImage = p.loadImage("graphics/garagebg.png");
    
    // Preload vehicle type images if needed
    if (!window.vehicleTypeImages) {
      window.vehicleTypeImages = [];
      window.vehicleTypeImages[0] = p.loadImage("assets/car.png");
      window.vehicleTypeImages[1] = p.loadImage("assets/van.png");
    }
  };

  // computes stats from default + any mods
  function computeCalcStats() {
    let engineMod = dataEngine[selectedEngineIndex];
    let wheelMod = dataTire[selectedWheelIndex];
    let bodyMod = dataBody[selectedCarIndex];
    let vehicleMod = vehicleTypes[selectedVehicleType];
    
    return {
      health: DEFAULT_CAR_STATS.health + engineMod.health + wheelMod.health + bodyMod.health + vehicleMod.health,
      boost: DEFAULT_CAR_STATS.boost + engineMod.boost + wheelMod.boost + bodyMod.boost + vehicleMod.boost,
      maxSpeed: DEFAULT_CAR_STATS.maxSpeed + engineMod.maxSpeed + wheelMod.maxSpeed + bodyMod.maxSpeed + vehicleMod.maxSpeed,
      acceleration: DEFAULT_CAR_STATS.acceleration + engineMod.acceleration + wheelMod.acceleration + bodyMod.acceleration + vehicleMod.acceleration,
      turn: DEFAULT_CAR_STATS.turn + engineMod.turn + wheelMod.turn + bodyMod.turn + vehicleMod.turn,
      dmgRes: DEFAULT_CAR_STATS.dmgRes + engineMod.dmgRes + wheelMod.dmgRes + bodyMod.dmgRes + vehicleMod.dmgRes,
      vehicleType: selectedVehicleType // Add vehicle type to saved stats
    };
  }

  // number format / pulled from inet
  function formatNumber(num) {
    let fixed = num.toFixed(2);
    return fixed.indexOf('.') !== -1 ? fixed.replace(/\.?0+$/, '') : fixed;
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // loads data from persistence
    ExitIcon = new Button("ExitIcon", p.width - p.width * 0.05, p.height - p.height * 0.95, p.width, p.height, function () { 
      switchSketch(Mode.TITLE);
    });

    let savedConfig = loadPersistentData();
    if (savedConfig) {
      if (typeof savedConfig.selectedCar === "number") {
        selectedCarIndex = savedConfig.selectedCar;
      }
      if (typeof savedConfig.selectedEngine === "number") {
        selectedEngineIndex = savedConfig.selectedEngine;
      }
      if (typeof savedConfig.selectedWheel === "number") {
        selectedWheelIndex = savedConfig.selectedWheel;
      }
      if (typeof savedConfig.vehicleType === "number") {
        selectedVehicleType = savedConfig.vehicleType;
      }
      if (savedConfig.stats !== undefined) {
        savedStats = { ...savedConfig.stats };
      } else {
        savedStats = { ...DEFAULT_CAR_STATS };
      }
    }

    setupLayout();
    saveButton = p.createButton("Save Configuration");
    saveButton.style("font-size", "18px");
    saveButton.position(p.width / 2 - 50, p.height - 60);
    saveButton.mousePressed(saveConfiguration);
    bgMusic(Mode.GARAGE, p, "loop"); 

    // stop loading
    window.LoadingScreen.hide();
  };

  function setupLayout() {
    // Vehicle type selection boxes - moved down below coin display
    let vehicleBoxSize = 128;
    let vehicleBoxesY = 100; // Changed from 20 to 100 to move below coin display
    let vehicleBoxesStartX = 20;
    
    vehicleBoxes = [];
    for (let i = 0; i < vehicleTypes.length; i++) {
      let box = {
        x: vehicleBoxesStartX + i * (vehicleBoxSize + 10),
        y: vehicleBoxesY,
        w: vehicleBoxSize,
        h: vehicleBoxSize,
        index: i
      };
      vehicleBoxes.push(box);
    }
    
    // Original layout logic for other components
    let margin = 20;
    let carBoxSize = 128;
    let carColCount = 4;
    let carRowCount = 2;
    let totalCarWidth = carColCount * carBoxSize;
    let startX = (p.width - totalCarWidth) / 2;
    
    // Move car color selection boxes up
    let startY = vehicleBoxes[0].y + vehicleBoxSize + margin;

    // car body (4x2) top, engine (1x3) bot left, wheel (1x3) bot right
    carBoxes = [];
    for (let row = 0; row < carRowCount; row++) {
      for (let col = 0; col < carColCount; col++) {
        let box = {
          x: startX + col * carBoxSize,
          y: startY + row * carBoxSize,
          w: carBoxSize,
          h: carBoxSize,
          index: row * carColCount + col
        };
        carBoxes.push(box);
      }
    }
    
    let engineBoxCount = 3;
    engineBoxes = [];
    let engineX = margin;
    let engineTotalHeight = engineBoxCount * carBoxSize + (engineBoxCount - 1) * 10;
    let engineStartY = p.height - margin - engineTotalHeight;
    for (let i = 0; i < engineBoxCount; i++) {
      let box = {
        x: engineX,
        y: engineStartY + i * (carBoxSize + 10),
        w: carBoxSize,
        h: carBoxSize,
        index: i
      };
      engineBoxes.push(box);
    }
    
    let wheelBoxCount = 3;
    wheelBoxes = [];
    let wheelX = p.width - margin - carBoxSize;
    let wheelTotalHeight = wheelBoxCount * carBoxSize + (wheelBoxCount - 1) * 10;
    let wheelStartY = p.height - margin - wheelTotalHeight;
    for (let i = 0; i < wheelBoxCount; i++) {
      let box = {
        x: wheelX,
        y: wheelStartY + i * (carBoxSize + 10),
        w: carBoxSize,
        h: carBoxSize,
        index: i
      };
      wheelBoxes.push(box);
    }
  }

  p.draw = function() {  
    if (bgImage) {
      p.background(bgImage);
    } else {
      p.background(30, 30, 30);
    }
    ExitIcon.display(p);

    // Coin display - ensure it's visible
    p.push();
    p.image(coinBg, 20, 20, 128, 64);
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(CurrencyManager.getTotalCoins(), 65, 45);
    p.pop();

    // Draw vehicle type selection boxes
    p.textSize(20);
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Vehicle Type:", 20, vehicleBoxes[0].y - 30);
    
    for (let i = 0; i < vehicleBoxes.length; i++) {
      let box = vehicleBoxes[i];
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);
      
      // Draw vehicle image or placeholder
      if (window.vehicleTypeImages && window.vehicleTypeImages[i]) {
        p.image(window.vehicleTypeImages[i], box.x, box.y, box.w, box.h);
      } else {
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(vehicleTypes[i].name, box.x + box.w/2, box.y + box.h/2);
      }
      
      // Highlight selected vehicle
      if (i === selectedVehicleType) {
        p.stroke(255, 0, 0);
        p.strokeWeight(3);
        p.noFill();
        p.rect(box.x, box.y, box.w, box.h);
        p.strokeWeight(1);
      }
    }

    // car engine tire boxes draw
    for (let i = 0; i < carBoxes.length; i++) {
      let box = carBoxes[i];
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);
      if (window.cars && window.cars[i]) {
        p.image(window.cars[i], box.x, box.y, box.w, box.h);
      }
      if (i === selectedCarIndex) {
        p.stroke(255, 0, 0);
        p.strokeWeight(3);
        p.noFill();
        p.rect(box.x, box.y, box.w, box.h);
        p.strokeWeight(1);
      }
    }
    
    // Draw engine boxes
    for (let i = 0; i < engineBoxes.length; i++) {
      let box = engineBoxes[i];
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);
      if (window.engines && window.engines[i]) {
        p.image(window.engines[i], box.x, box.y, box.w, box.h);
      } else {
        p.fill(211);
        p.rect(box.x, box.y, box.w, box.h);
        p.noFill();
      }
      if (i === selectedEngineIndex) {
        p.stroke(255, 0, 0);
        p.strokeWeight(3);
        p.noFill();
        p.rect(box.x, box.y, box.w, box.h);
        p.strokeWeight(1);
      }
    }
    
    // Draw wheel boxes
    for (let i = 0; i < wheelBoxes.length; i++) {
      let box = wheelBoxes[i];
      p.stroke(0);
      p.fill(211);
      p.rect(box.x, box.y, box.w, box.h);
      if (window.tires && window.tires[i]) {
        p.image(window.tires[i], box.x, box.y, box.w, box.h);
      } else {
        p.fill(211);
        p.rect(box.x, box.y, box.w, box.h);
        p.noFill();
      }
      if (i === selectedWheelIndex) {
        p.stroke(255, 0, 0);
        p.strokeWeight(3);
        p.noFill();
        p.rect(box.x, box.y, box.w, box.h);
        p.strokeWeight(1);
      }
    }

    // big car display in center - with correct aspect ratios for each vehicle type
    let centralX = p.width / 2; // Center of the screen X
    let centralY = p.height / 2 + 250; // Center of the screen Y (with slight offset)
    let carDisplayScale = 7.0; // Car display scale
    let vanDisplayScale = 6.0; // Van display scale

    // Calculate car dimensions
    let carWidth = 64 * carDisplayScale;
    let carHeight = 64 * carDisplayScale;

    // Calculate van dimensions
    let vanWidth = 80 * vanDisplayScale;
    let vanHeight = 48 * vanDisplayScale;

    if (selectedVehicleType === 0 && window.cars && window.cars[selectedCarIndex]) {
      // Show car - 64x64 ratio centered at the exact point
      p.image(
        window.cars[selectedCarIndex], 
        centralX - carWidth/2, // Subtract half width to center
        centralY - carHeight/2, // Subtract half height to center
        carWidth, 
        carHeight
      );
    } else if (selectedVehicleType === 1 && window.vehicleTypeImages && window.vehicleTypeImages[1]) {
      // Show van - 80x48 ratio centered at the exact same point
      p.image(
        window.vehicleTypeImages[1], 
        centralX - vanWidth/2, // Subtract half width to center
        centralY - vanHeight/2, // Subtract half height to center
        vanWidth, 
        vanHeight
      );
    }

    // calc/display stats in format - moved UP to not cover tire selection
    let calcStats = computeCalcStats();
    let panelWidth = 200;
    let panelHeight = 220;
    let panelX = p.width - 220;
    let panelY = 150; // Fixed position at the top, below coin display
    
    p.fill(255, 255, 255, 204);
    p.noStroke();
    p.rect(panelX, panelY, panelWidth, panelHeight);

    // "stats" underlined
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Stats", panelX + 10, panelY + 10);
    p.stroke(0);
    p.line(panelX + 10, panelY + 28, panelX + panelWidth - 10, panelY + 28);
    p.noStroke();

    let statNames = ["Health", "Boost", "Max Speed", "Acceleration", "Turn", "Dmg Res", "Vehicle"];
    let baseValues = [
      savedStats.health,
      savedStats.boost,
      savedStats.maxSpeed,
      savedStats.acceleration,
      savedStats.turn,
      savedStats.dmgRes,
      "Car"
    ];
    let calcValues = [
      calcStats.health,
      calcStats.boost,
      calcStats.maxSpeed,
      calcStats.acceleration,
      calcStats.turn,
      calcStats.dmgRes,
      vehicleTypes[selectedVehicleType].name
    ];

    for (let i = 0; i < statNames.length; i++) {
      let lineY = panelY + 35 + i * 20;
      p.textAlign(p.LEFT, p.TOP);
      p.text(statNames[i], panelX + 10, lineY);

      p.textAlign(p.RIGHT, p.TOP);
      
      if (i === statNames.length - 1) {
        // Vehicle type display
        p.text(calcValues[i], panelX + panelWidth - 10, lineY);
      } else {
        // Numeric stats display
        let diff = Math.abs(calcValues[i] - baseValues[i]);
        let formattedCalc = formatNumber(calcValues[i]);
        let formattedBase = formatNumber(baseValues[i]);
        let displayText;
        if (diff < 0.01) {
          displayText = formattedCalc;
        } else {
          displayText = formattedCalc + " (" + formattedBase + ")";
        }
        p.text(displayText, panelX + panelWidth - 10, lineY);
      }
    }
  };

  p.mousePressed = function() {
    // Check if vehicle type was clicked
    for (let i = 0; i < vehicleBoxes.length; i++) {
      let box = vehicleBoxes[i];
      if (
        p.mouseX >= box.x &&
        p.mouseX <= box.x + box.w &&
        p.mouseY >= box.y &&
        p.mouseY <= box.y + box.h
      ) {
        selectedVehicleType = i;
        return;
      }
    }
    
    // check if { car, engine, wheel } clicked
    for (let i = 0; i < carBoxes.length; i++) {
      let box = carBoxes[i];
      if (
        p.mouseX >= box.x &&
        p.mouseX <= box.x + box.w &&
        p.mouseY >= box.y &&
        p.mouseY <= box.y + box.h
      ) {
        selectedCarIndex = i;
        return;
      }
    }
    for (let i = 0; i < engineBoxes.length; i++) {
      let box = engineBoxes[i];
      if (
        p.mouseX >= box.x &&
        p.mouseX <= box.x + box.w &&
        p.mouseY >= box.y &&
        p.mouseY <= box.y + box.h
      ) {
        selectedEngineIndex = i;
        return;
      }
    }
    for (let i = 0; i < wheelBoxes.length; i++) {
      let box = wheelBoxes[i];
      if (
        p.mouseX >= box.x &&
        p.mouseX <= box.x + box.w &&
        p.mouseY >= box.y &&
        p.mouseY <= box.y + box.h
      ) {
        selectedWheelIndex = i;
        return;
      }
    }
    
    if (ExitIcon.isMouseOver(p)) {
      bgMusic(Mode.GARAGE, p, "stop"); 
      ExitIcon.callback();
    }
  };

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      bgMusic(Mode.GARAGE, p, "stop"); 
    switchSketch(Mode.TITLE);
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setupLayout();
    saveButton.position(p.width / 2 - 50, p.height - 60);
  };

  function saveConfiguration() {
    let newStats = computeCalcStats();
    let config = {
      selectedCar: selectedCarIndex,
      selectedEngine: selectedEngineIndex,
      selectedWheel: selectedWheelIndex,
      vehicleType: selectedVehicleType,
      stats: { ...newStats }
    };
    savedStats = { ...newStats };
    savePersistentData(config);
    console.log("Configuration saved:", config);
  }
}