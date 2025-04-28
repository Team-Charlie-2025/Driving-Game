// classes/globals.js

let globalsLoaded = false;

function loadGlobals(p) {
  loadCars(p);
  loadEngines(p);
  loadTires(p);
  loadMusic(p);
  loadSoundEffects(p);
  loadButtons(p);
  loadAnimations(p);
  window.widthScale = p.windowWidth/1920;
  window.heightScale = p.windowHeight/1080;
  window.scale = (window.heightScale + window.widthScale) /2 ;
  window.buildingImg = p.loadImage("assets/building.png");
  window.difficulty = 1.0;
  window.debug = false;
  globalsLoaded = true;
}

function loadMusic(p) {
  window.music = {}; //each mode has a different song
  window.music[Mode.TITLE] = p.loadSound("sound/titleTheme.mp3");
  window.music[Mode.PLAY] = p.loadSound("sound/themeOption.mp3");
  window.music[Mode.GARAGE] = p.loadSound("sound/titleTheme.mp3");
  window.music[Mode.SETTINGS] = p.loadSound("sound/titleTheme.mp3");
  window.music[Mode.LEADERBOARD] = p.loadSound("sound/titleTheme.mp3");
  window.music[Mode.LEVELS] = p.loadSound("sound/titleTheme.mp3");
  for (let key in window.music) {
    window.music[key].setVolume(musicVolume);
}
    
}

function loadSoundEffects(p) {
  window.soundEffects = {};
  window.soundEffects["carStart"] = p.loadSound("sound/carStart.wav");
  window.soundEffects["pageChange"] = p.loadSound("sound/newPage.wav");
  window.soundEffects["gameOver"] = p.loadSound("sound/GameOver.wav");
  for (let key in window.soundEffects) {
    window.soundEffects[key].setVolume(effectsVolume);
}
}

function loadCars(p) {
  window.cars = {
    normal: [],
    truck: [],
    sports: [],
    super: []
  };

  // Load images for the "normal" car
  window.cars["normal"].push(p.loadImage("graphics/cars/blueStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/greenStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/lightblueStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/lightgreenStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/lightpurpleStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/orangeStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/purpleStripe.png"));
  window.cars["normal"].push(p.loadImage("graphics/cars/redStripe.png"));

  // // Load images for the truck
  window.cars["truck"].push(p.loadImage("assets/police+truck.png"));
  window.cars["truck"].push(p.loadImage("assets/police+truck.png"));
  window.cars["truck"].push(p.loadImage("assets/police+truck.png"));
  window.cars["truck"].push(p.loadImage("assets/police+truck.png"));
  window.cars["truck"].push(p.loadImage("assets/police+truck.png"));
  window.cars["truck"].push(p.loadImage("assets/police+truck.png"));
  // window.cars["truck"].push(p.loadImage("graphics/cars/truckBlue.png"));
  // window.cars["truck"].push(p.loadImage("graphics/cars/truckGreen.png"));
  // window.cars["truck"].push(p.loadImage("graphics/cars/truckRed.png"));
  // window.cars["truck"].push(p.loadImage("graphics/cars/truckYellow.png"));

  // // Load images for the sports car
  // window.cars["sports"].push(p.loadImage("graphics/cars/sportsBlue.png"));
  // window.cars["sports"].push(p.loadImage("graphics/cars/sportsGreen.png"));
  // window.cars["sports"].push(p.loadImage("graphics/cars/sportsRed.png"));
  // window.cars["sports"].push(p.loadImage("graphics/cars/sportsYellow.png"));

  console.log("Cars loaded:", window.cars);
}

function loadEngines(p) {
  window.engines = [];

  window.engines.push(p.loadImage("graphics/engines/engineOne.png"));
  window.engines.push(p.loadImage("graphics/engines/engineTwo.png"));
  window.engines.push(p.loadImage("graphics/engines/engineThree.png"));

  console.log("engines loaded");
}

function loadTires(p) {
  window.tires = [];

  window.tires.push(p.loadImage("graphics/tires/tireDefault.png"));
  window.tires.push(p.loadImage("graphics/tires/tireRacing.png"));
  window.tires.push(p.loadImage("graphics/tires/tireSnow.png"));

  console.log("tires loaded");
}

function loadButtons(p){
    //////////title screen//////////
    window.displayBacking= p.loadImage("graphics/displayBacking.png");
    window.leaderButton = p.loadImage("graphics/titleScreen/leaderboardButton.png");
    window.setButton = p.loadImage("graphics/titleScreen/settingButton.png");

    //////////generic buttons//////////
    window.exitButton = p.loadImage("graphics/buttonsSliced/button130.png");
    window.basicButton = [];
    window.basicButton["blue"] = p.loadImage("graphics/basicButton/blueButton.png");
    window.basicButton["green"] = p.loadImage("graphics/basicButton/greenButton.png");
    window.basicButton["navy"] = p.loadImage("graphics/basicButton/navyButton.png");
    window.basicButton["orange"] = p.loadImage("graphics/basicButton/oranButton.png");
    window.basicButton["red"] = p.loadImage("graphics/basicButton/redButton.png");
    window.basicButton["yellow"] = p.loadImage("graphics/basicButton/yellButton.png");
    window.basicButton["purple"] = p.loadImage("graphics/basicButton/purpButton.png");
    window.basicButton["teal"] = p.loadImage("graphics/basicButton/tealButton.png");

    //window.PixelFont = p.loadFont('assets/fonts/pixelFont.ttf'); //old font
    window.PixelFont = p.loadFont('assets/fonts/ThaleahFat.ttf');

  console.log("buttons loaded");
}

function loadAnimations(p) {
  window.animations = {};

  // map[key = name of object to be animated], which holds array of frames
  window.animations["coin"] = [];
  for(i =1; i <= 4; i++)
    window.animations["coin"].push(p.loadImage(`graphics/coinAnimation/tile00${i}.png`));

  window.animations["shield"] = [];
  for(i =1; i <= 4; i++)
    window.animations["shield"].push(p.loadImage(`graphics/shieldAnimation/shield${i}.png`));
  
  window.animations["wrench"] = [];
  for(i =1; i <= 4; i++)
    window.animations["wrench"].push(p.loadImage(`graphics/wenchAnimation/wrench${i}.png`));

  window.animations["bomb"] = [];
  window.animations["bomb"].push(p.loadImage("graphics/bombAnimation/bomb1.png"));
  window.animations["bomb"].push(p.loadImage("graphics/bombAnimation/bomb2.png"));
  window.animations["bomb"].push(p.loadImage("graphics/bombAnimation/bomb3.png"));
  window.animations["bombExplosion"] = [];
  window.animations["bombExplosion"].push(p.loadImage("graphics/bombAnimation/bomb4.png"));
  window.animations["bombExplosion"].push(p.loadImage("graphics/bombAnimation/bomb5.png"));
  window.animations["bombExplosion"].push(p.loadImage("graphics/bombAnimation/bomb6.png"));

  window.animations["oil"] = [];
  for(i =1; i <= 4; i++)
    window.animations["oil"].push(p.loadImage(`graphics/oilAnimation/oil${i}.png`));
  window.animations["oilSpill"] = [];
  window.animations["oilSpill"].push(p.loadImage("graphics/oilAnimation/oilSpill.png"));

  window.animations["gas"] = [];
  for(i =1; i <= 5; i++)
    window.animations["gas"].push(p.loadImage(`graphics/gasAnimation/GasCan${i}.png`));

  window.animations["hourglass"]=[];
  for(i =1; i <= 5; i++)
    window.animations["hourglass"].push(p.loadImage(`graphics/hourglassAnimation/${i}.png`));
    //window.animations["hourglass"].push(p.loadImage(`graphics/hourglassAnimation/hourglass${i}.png`));


  console.log("animations loaded");
}

window.loadMapAssets = function(p) {
  window.categories = ['Buildings', 'Roads', 'Terrain', 'Decorations', 'Nodes'];
  window.currentTab = 'Buildings';
  window.assetManifest = {}; // loads from manifest.txt in each folder
  window.assets = {};
  window.thumbnails = [];
  window.selectedTile = null;
  window.placedTiles = [];
  window.thumbnailScroll = 0;
  window.currentRotation = 0;

  window.gridSize = 32;
  window.mapFilenames = ["map01.json", "map02.json", "map03.json", "map04.json", "map05.json"];
  window.mapCols = 32;
  window.mapRows = 32;
  window.assetPanelWidth = window.gridSize * 6;
  window.visibleThumbnailCount = 6;
  window.thumbnailSize = window.gridSize * 4;
  window.thumbnailSpacing = 10;
  window.categoryButtonHeight = 40;
  window.categoryButtonsHeight = window.categories.length * window.categoryButtonHeight + 20;
  window.thumbnailsAreaY = window.categoryButtonsHeight;
  window.categoryLayers = {
    'Terrain': 0,
    'Roads': 1,
    'Buildings': 3,
    'Decorations': 4,
    'Nodes': 5
  };

  window.getLayerForCategory = function(category) {
    return window.categoryLayers[category] ?? 0;
  };

  window.categories.forEach(cat => {
    p.loadStrings(`/assets/mapBuilder/${cat}/manifest.txt`, function(fileList) {
      window.assetManifest[cat] = fileList;
      window.assets[cat] = new Array(fileList.length);
      fileList.forEach((filename, i) => {
        let cleanName = filename.trim();
        let path = `/assets/mapBuilder/${cat}/${cleanName}`;
        p.loadImage(path, img => {
          window.assets[cat][i] = img;
        });
      });
    });
  });
};