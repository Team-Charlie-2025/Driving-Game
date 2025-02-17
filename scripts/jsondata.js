// scripts/jsonDATA.js
function loadPersistentData() {
  let data = localStorage.getItem("persistentData");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing persistentData:", e);
    }
  }
  let defaultData = {
    selectedCar: 0,
    selectedEngine: 0,
    selectedWheel: 0,
    stats: {
      health: 100,
      boost: 50,
      maxSpeed: 8,
      acceleration: 0.1,
      turn: 0.05,
      dmgRes: 10
    }
  };
  localStorage.setItem("persistentData", JSON.stringify(defaultData));
  return defaultData;
}

function savePersistentData(data) {
  localStorage.setItem("persistentData", JSON.stringify(data));
}
