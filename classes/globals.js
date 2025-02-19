let globalsLoaded = false;

function loadGlobals(p){
    loadCars(p);
    loadEngines(p);
    loadTires(p);
    loadSound(p);
    loadButtons(p);

    
    globalsLoaded = true;
}
function loadSound(p){
    window.bgMusic = p.loadSound('sound/themeOption.mp3');
    window.bgMusic.setVolume(0.15);

    window.carStart = p.loadSound('sound/carStart.wav');
    window.carStart.setVolume(1.5);

    window.pageChange = p.loadSound('sound/newPage.wav');
    window.pageChange.setVolume(0.15);
    console.log("sounds loaded");
}

function loadCars(p){
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

function loadEngines(p){
    window.engines = [];
    window.engines.push(p.loadImage("graphics/engines/engineOne.png"));
    window.engines.push(p.loadImage("graphics/engines/engineTwo.png"));
    window.engines.push(p.loadImage("graphics/engines/engineThree.png"));
    console.log("engines loaded");
}

function loadTires(p){
    window.tires = [];
    window.tires.push(p.loadImage("graphics/tires/tireDefault.png"));
    window.tires.push(p.loadImage("graphics/tires/tireRacing.png"));
    window.tires.push(p.loadImage("graphics/tires/tireSnow.png"));
    console.log("tires loaded");
}
function loadButtons(p){
    window.playButton = p.loadImage("graphics/titleScreen/playButton.png");
    window.garageButton = p.loadImage("graphics/titleScreen/garageButton.png");
    console.log("buttons loaded");
}
