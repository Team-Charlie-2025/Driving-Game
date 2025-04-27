// scripts/jsonDATA.js

window.defaultData = {
  selectedCarType: 0,  // 0: Normal, 1: Truck, 2: Sports
  selectedCarColor: 0,   
  upgradesByCarType: {  
    0: { engine: 1, body: 1, transmission: 1, tires: 1 },
    1: { engine: 1, body: 1, transmission: 1, tires: 1 },
    2: { engine: 1, body: 1, transmission: 1, tires: 1 }
  },
  purchasedCarTypes: [true, false, false], // Normal unlocked by default
  purchasedColorsByCarType: {
    0: [true, false, false, false, false, false, false, false],
    1: [true, false, false, false, false, false],
    2: [true, false, false, false],
  },
  stats: { // Normal car stats
    health: 100,
    boost: 50,
    maxSpeed: 8,
    acceleration: 0.5,
    traction: 0.5,
    dmgRes: 10
  },
  unlockedItems: {
    wrench: false,
    bomb: false,
    oil: false,
    shield: false
  }
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