if (flvjs.isSupported()) {
    var videoElement = document.getElementById('videoElement');
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        "isLive": true,
        url: 'http://maisonbleue2020.ddns.net:8000/live/obs.flv'
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
    flvPlayer.muted = true;
}