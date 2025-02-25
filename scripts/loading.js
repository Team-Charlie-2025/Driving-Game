// consolidate loading screen functionality within js file
// opened with main during sketch
// closed/hidden at end of setup on new sketch
let pageNew;
window.LoadingScreen = { 
    show: function() {
        //window.pageChange.play();
        //console.log("Showing loading screen..."); //debugging
        let loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = "flex";
        }
    },

    hide: function() {
        //console.log("Hiding loading screen..."); //debugging
        let loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 500); // Small delay to ensure smooth transition
        }
    }
};