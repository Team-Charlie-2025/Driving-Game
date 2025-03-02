// classes/globals.js

let globalsLoaded = false;

function loadGlobals(p) {
  loadCars(p);
  loadEngines(p);
  loadTires(p);
  loadSound(p);
  loadButtons(p);
  loadAnimations(p);
  window.buildingImg = p.loadImage("assets/building.png");
  window.debug = false;
  globalsLoaded = true;
}

function loadSound(p) {
  window.bgMusic = p.loadSound('sound/themeOption.mp3');
  window.bgMusic.setVolume(0.15);

  window.carStart = p.loadSound('sound/carStart.wav');
  window.carStart.setVolume(1.5);

  // Possibly change; is a bit annoying
  window.pageChange = p.loadSound('sound/newPage.wav');
  window.pageChange.setVolume(0.02);
  console.log("sounds loaded");
}

function loadCars(p) {
  window.cars = [];

  window.cars.push(p.loadImage("graphics/cars/blueStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/greenStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/lightblueStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/lightgreenStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/lightpurpleStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/orangeStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/purpleStripe.png"));
  window.cars.push(p.loadImage("graphics/cars/redStripe.png"));

  console.log("cars loaded");
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
    window.playButton = p.loadImage("graphics/titleScreen/playButton.png");
    window.garageButton = p.loadImage("graphics/titleScreen/garageButton.png");
    window.leaderButton = p.loadImage("graphics/titleScreen/leaderboardButton.png");
    window.setButton = p.loadImage("graphics/titleScreen/settingButton.png");

    //////////generic buttons//////////
    window.ButtonIcons = p.loadImage("graphics/buttons.png");
    window.basicButton = [];
    window.basicButton["blue"] = p.loadImage("graphics/basicButton/blueButton.png");
    window.basicButton["green"] = p.loadImage("graphics/basicButton/greenButton.png");
    window.basicButton["navy"] = p.loadImage("graphics/basicButton/navybutton.png");
    window.basicButton["orange"] = p.loadImage("graphics/basicButton/oranButton.png");
    window.basicButton["red"] = p.loadImage("graphics/basicButton/redButton.png");
    window.basicButton["yellow"] = p.loadImage("graphics/basicButton/yellButton.png");

    window.PixelFont = p.loadFont('graphics/pixelFont.ttf');

  console.log("buttons loaded");
}

/////////////////////////////////////////////////
function loadAnimations(p) {
  window.animations = {};

  // map[key = name of object to be animated], which holds array of frames
  window.animations["coin"] = [];
  window.animations["coin"].push(p.loadImage("graphics/coinAnimation/tile000.png"));
  window.animations["coin"].push(p.loadImage("graphics/coinAnimation/tile001.png"));
  window.animations["coin"].push(p.loadImage("graphics/coinAnimation/tile002.png"));
  window.animations["coin"].push(p.loadImage("graphics/coinAnimation/tile003.png"));
  window.animations["coin"].push(p.loadImage("graphics/coinAnimation/tile004.png"));

  console.log("coin animations loaded");
}
//////////////////////////////////////////////////

