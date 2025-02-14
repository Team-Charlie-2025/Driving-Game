let globalsLoaded = false;

function loadGlobals(p){
    loadCars(p);
    loadEngines(p);
    loadTires(p);


    
    globalsLoaded = true;
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