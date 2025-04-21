// scripts/jsonDATA.js

window.defaultData = {
  selectedCar: 0,
  selectedEngine: 0,
  selectedWheel: 0,
  stats: { 
    health: 100,
    boost: 50,
    maxSpeed: 8,
    acceleration: 0.5,
    traction: 0.5,   // This is now our drift variable, .5-1
    dmgRes: 10
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