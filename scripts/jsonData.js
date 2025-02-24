// scripts/jsonDATA.

window.defaultData = {
  selectedCar: 0,
  selectedEngine: 0,
  selectedWheel: 0,
  stats: { 
    health: 100,
    boost: 50,
    maxSpeed: 8,
    acceleration: 0.4,
    turn: 0.08,
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

function savePersistentData(data) {
  localStorage.setItem("persistentData", JSON.stringify(data));
}

function clearPersistentData(){
  localStorage.removeItem("persistentData");
  console.log("Deleted persistent data");
}