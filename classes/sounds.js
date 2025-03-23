/* Music and Sound related functions for refactoring */
//classes/sounds.js

let musicVolume; //initial volume
let effectsVolume; //initial volume

function bgMusic(mode, p, action = "stop"){
    if(!window.music[mode].isLoaded()){
        console.log("sound not loaded"); 
    }
    //console.log("AudioContext state:", p.getAudioContext().state);
    switch(action){
        case "loop":
            if(!window.music[mode].isPlaying())
                window.music[mode].loop();
            break;

        case "stop":
            if(window.music[mode].isPlaying())
                window.music[mode].stop();
            break;

        case "play":
            if(!window.music[mode].isPlaying())
                window.music[mode].play();
            break;
    }
    
}
function soundEffect(name, p, action = "stop"){
    switch(action){
        case "loop":
            if(!window.soundEffects[name].isPlaying())
                window.soundEffects[name].loop();
            break;

        case "stop":
            if(window.soundEffects[name].isPlaying())
                window.soundEffects[name].stop();
            break;

        case "play":
            if(!window.soundEffects[name].isPlaying())
                window.soundEffects[name].play();
            break;
    }
}

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