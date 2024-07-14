jQuery("#reciter").selectpicker({
    liveSearch: true,
    noneSelectedText: "Select Reciter",
});

jQuery("#chapter").selectpicker({
    liveSearch: true,
    noneSelectedText: "Select Chapter",
});

setURLandImage();

function getFileURI() {
    var reciter = $("reciter").value;

    var sura = threeDigits($("chapter").value);

    var aya = threeDigits($("verse").value);

    return "https://everyayah.com/data/" + reciter + "/" + sura + aya + ".mp3";
}

function getImageURI() {
    var sura = $("chapter").value;

    var aya = $("verse").value;

    return "https://everyayah.com/data/images_png/" + sura + "_" + aya + ".png";
}

function setURLandImage() {
    $("url").innerHTML = $("url").href = getFileURI();
    $("urlImage").innerHTML = $("urlImage").href = getImageURI();
    $("verseImage").innerHTML = '<img src="' + getImageURI() + '" />';

    loadFile("player", {
        file: getFileURI(),
    });
    document.getElementById("newMediaPlayer").src = getFileURI();

    if ($("autoplay").checked) recite();
}

function recite() {
    if (audioSupport) {
        document.getElementById("newMediaPlayer").play();
    } else {
        sendEvent("player", "playpause");
    }
}

function threeDigits(num) {
    var temp = "000" + num;

    return temp.substr(temp.length - 3);
}

function $(element) {
    if (typeof element == "string") element = document.getElementById(element);

    return element;
}

//-------------------------------------------------------------------

// Player javascript API

//-------------------------------------------------------------------

function initAudioPlayer(playerID, width, height, container) {
    var so = new SWFObject(
        "mediaplayer/mediaplayer.swf",
        playerID,
        width,
        height,
        8
    );

    so.addParam("allowscriptaccess", "always");

    so.addParam("allowfullscreen", "false");

    so.addVariable("width", width);

    so.addVariable("height", height);

    so.addVariable("file", getFileURI());

    so.addVariable("javascriptid", playerID);

    so.addVariable("enablejs", "true");

    so.addVariable("showstop ", "false");

    so.write(container);
}

function sendEvent(playerID, typ, param) {
    var player = $(playerID);

    if (player && player.sendEvent) player.sendEvent(typ, param);
}

function loadFile(playerID, obj) {
    var player = $(playerID);

    if (player && player.loadFile) player.loadFile(obj);
}
var audioSupport = document.getElementById("newMediaPlayer").canPlayType;
document.addEventListener("DOMContentLoaded", function (event) {
    if (audioSupport) {
        document.getElementById("mediaPlayer").style.display = "none";
    } else {
        document.getElementById("newMediaPlayer").style.display = "none";
        initAudioPlayer("player", 170, 20, "mediaPlayer");
    }
});
