/* Music and Sound related functions for refactoring */
//classes/sounds.js

let musicVolume; //initial volume
let effectsVolume; //initial volume
function bgMusic(mode, p, action = "stop"){
    console.log(mode+ " " +action);
    if(!globalsLoaded)
        loadGlobals(p);
    switch(action){
        case "loop":
            if(!window.music[mode].isPlaying())
                window.music[mode].loop();//console.log("background music playing");
            break;

        case "stop":
            window.music[mode].stop();//console.log("background music stopped");
            break;

        case "play":
            if(!window.music[mode].isPlaying())
                window.music[mode].play();
            break;
    }
    
}
//function playEffect(p, name){}

function setMusicVolume(p, newVolume =0.25){
    musicVolume = newVolume; 
    for (let key in window.music) {
        window.music[key].setVolume(musicVolume);
    }
    console.log("music vol change");
    
};
function setEffectsVolume(p, newVolume =0.25){
    effectsVolume = newVolume;
    for (let key in window.soundEffects) {
        window.soundEffects[key].setVolume(effectsVolume);
    }
    console.log("effects vol change");
};
function getMusicVolume(p) {
    return musicVolume;
  };
function getEffectsVolume(p) {
    return effectsVolume;
};