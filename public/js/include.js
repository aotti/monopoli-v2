$(function(){
    $(".rules_game").load("pages/rulesPage.html"); 
    $(".audio_input").load("pages/audioInput.html"); 
    $(".setting_mods").load("pages/settingMods.html"); 
    const startInterval = setInterval(() => {
        if($(".player_info")) {
            clearInterval(startInterval)
            $(".player_info").load("pages/playerList.html"); 
        }
    }, 1000);
});
