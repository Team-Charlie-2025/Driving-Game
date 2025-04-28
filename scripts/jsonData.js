// scripts/jsonDATA.js

const CarType = { // The 3 different cars you can get so far
  NORMAL: "normal",
  TRUCK: "truck",
  SUPERCAR: "supercar",
};

//carType = CarType;
window.CarType = CarType; 

window.carBaseStats = {
  [CarType.NORMAL]: {
    health: 100,
    boost: 50,
    maxSpeed: 8,
    acceleration: 0.5,
    traction: 0.5,
    damageRes: 10
  },
  [CarType.TRUCK]: {
    health: 150,
    boost: 40,
    maxSpeed: 6,
    acceleration: 0.7,  // Truck has lower gear ratios so it works
    traction: 0.4,
    damageRes: 15
  },
  [CarType.SUPERCAR]: {
    health: 80,
    boost: 60,
    maxSpeed: 10,
    acceleration: 0.7,
    traction: 0.7,
    damageRes: 8
  }
};

window.defaultData = {
  selectedCar: 0,        // SELECTED CAR COLOR 
  selectedCarType: CarType.NORMAL, 
  selectedEngine: 0,
  selectedWheel: 0,
  stats: { ...window.carBaseStats[CarType.NORMAL] }
};

function loadPersistentData() {
  let data = localStorage.getItem("persistentData");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing persistentData:", e);
    }
  }

  localStorage.setItem("persistentData", JSON.stringify(window.defaultData));
  return defaultData;
}

function savePersistentData(newData) {
  const existing = loadPersistentData();
  const merged = { ...existing, ...newData };
  localStorage.setItem("persistentData", JSON.stringify(merged));
}

function clearPersistentData(){
  localStorage.removeItem("persistentData");
  console.log("Deleted persistent data");
}