// main.js

let currentSketch = null;
let firstLoad = true;

const Mode = {
  TITLE: 'title',
  PLAY: 'play',
  GARAGE: 'garage',
  SETTINGS: 'settings',
  LEADERBOARD: 'leaderboard',
  LOGIN: 'login',
  SIGNUP: 'signup',
  LEVELS: 'levels',
  MAP_EDITOR: 'map_editor',
};

function switchSketch(mode) {
  if (!firstLoad) window.soundEffects["pageChange"].play();
  window.LoadingScreen.show();
  setTimeout(() => {
    if (currentSketch) {
      currentSketch.remove();
    }
    switch (mode) {
      case Mode.TITLE:
        currentSketch = new p5(TitleSketch, 'main');
        break;
      case Mode.PLAY:
        currentSketch = new p5(PlaySketch, 'main');
        break;
      case Mode.GARAGE:
        currentSketch = new p5(GarageSketch, 'main');
        break;
      case Mode.SETTINGS:
        currentSketch = new p5(SettingsSketch, 'main');
        break;
      case Mode.LEADERBOARD:
        currentSketch = new p5(LeaderboardSketch, 'main');
        break;
      case Mode.LOGIN:
        currentSketch = new p5(LoginSketch, 'main');
        break;
      case Mode.SIGNUP:
        currentSketch = new p5(SignupSketch, 'main');
        break;
      case Mode.LEVELS:
        currentSketch = new p5(LevelsSketch, 'main');
        break;    
      case Mode.MAP_EDITOR:
        currentSketch = new p5(MapEditorSketch, 'main');
        break;
      default:
        console.log("Unknown mode: " + mode);
    }
  }, 800);
  firstLoad = false;
}

window.onload = function () {
  switchSketch(Mode.TITLE);
};
