// scripts/jsonDATA.js

window.defaultData = {
  carUpgrades: {
    normal: { engine: 1, body: 1, transmission: 1, tires: 1 },
    truck: { engine: 1, body: 1, transmission: 1, tires: 1 },
    sports: { engine: 1, body: 1, transmission: 1, tires: 1 },
  },
  carColors: {
    normal: [true, false, false, false, false, false, false, false], // First color unlocked by default
    truck: [true, false, false, false, false, false, false, false],
    sports: [true, false, false, false, false, false, false, false],
  },

  selectedCarType: "normal", // Currently selected car type
  selectedCarColor: 0, // Currently selected color index
  stats: { 
    health: 100,
    boost: 50,
    maxSpeed: 8,
    acceleration: 0.5,
    traction: 0.5,
    dmgRes: 10,
  },
};

function loadPersistentData() {
  let data = localStorage.getItem("persistentData");
  if (data) {
    try {
      data = JSON.parse(data);

      // Ensure carColors is initialized for all car types
      if (!data.carColors) {
        data.carColors = {
          normal: [true, false, false, false, false, false, false, false],
          truck: [true, false, false, false, false, false, false, false],
          sports: [true, false, false, false, false, false, false, false],
        };
      } else {
        // Add missing car types to carColors
        if (!data.carColors.normal) data.carColors.normal = [true, false, false, false, false, false, false, false];
        if (!data.carColors.truck) data.carColors.truck = [true, false, false, false, false, false, false, false];
        if (!data.carColors.sports) data.carColors.sports = [true, false, false, false, false, false, false, false];
      }

      return data;
    } catch (e) {
      console.error("Error parsing persistentData:", e);
    }
  }

  // Initialize default data if none exists
  const defaultData = {
    carUpgrades: {
      normal: { engine: 1, body: 1, transmission: 1, tires: 1 },
      truck: { engine: 1, body: 1, transmission: 1, tires: 1 },
      sports: { engine: 1, body: 1, transmission: 1, tires: 1 },
    },
    carColors: {
      normal: [true, false, false, false, false, false, false, false],
      truck: [true, false, false, false, false, false, false, false],
      sports: [true, false, false, false, false, false, false, false],
    },
    selectedCarType: "normal",
    selectedCarColor: 0,
    stats: { 
      health: 100,
      boost: 50,
      maxSpeed: 8,
      acceleration: 0.5,
      traction: 0.5,
      dmgRes: 10,
    },
    unlockedItems: {},
  };

  localStorage.setItem("persistentData", JSON.stringify(defaultData));
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