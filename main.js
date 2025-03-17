// main.js

let currentSketch = null;
let firstLoad = true;
let musicPlaying = "title";

const Mode = {
  TITLE: 'title',
  PLAY: 'play',
  GARAGE: 'garage',
  SETTINGS: 'settings',
  LEADERBOARD: 'leaderboard',
  LOGIN: 'login',
  SIGNUP: 'signup',
  LEVELS: 'level'
};

function switchSketch(mode) {
  /*
  if (!firstLoad) {
    window.pageChange.play();
  }*/
  window.LoadingScreen.show();
  setTimeout(() => {
    if (currentSketch) {
      currentSketch.remove();
    }
    switch (mode) {
      case Mode.TITLE:
        window.changeMusic("title");//music choice per sketch
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
      default:
        console.log("Unknown mode: " + mode);
    }
  }, 800);
  firstLoad = false;
}

window.onload = function () {
  switchSketch(Mode.TITLE);
};

window.changeMusic = function(newMusicKey){
  if(musicPlaying != newMusicKey){ //only stop music if song in changeing
    window.music[musicPlaying].stop();

    window.pageChange.play(); //will probably need a timer
    musicPlaying = newMusicKey;
    window.music[musicPlaying].loop();
  }
}