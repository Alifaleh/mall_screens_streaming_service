
var socket = io();


let videosrc = '<video controls loop id="videoPlayer" width="650" controls muted="muted" autoplay><source id="source" src="/video" type="video/mp4" /></video>';
let videoPlayerContainer = document.querySelector("#video-player-container");

socket.emit('connection');


let injectVideo=(delay)=>{
    setTimeout(()=>{
        videoPlayerContainer.innerHTML = videosrc;
        setTimeout(()=>{
            for(x=0;x<100;x++){
                try{
                    let elem = document.getElementById("videoPlayer");
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { 
                        elem.msRequestFullscreen();
                    }
                }catch(e){}
            }
        },1000)
    },delay)
}

socket.on('setid', function(msg) {
    if(getCookie("reloaded")=="true"){
        socket.emit('migratetoid',getCookie("id"));
        setCookie("reloaded","false","Thu, 18 Dec 2513 12:00:00 UTC")
    }
    setCookie("id",msg,"Thu, 18 Dec 2513 12:00:00 UTC")
    injectVideo(1000)
});


socket.on("setsound", (data)=>{
    let videoplayer = document.querySelector("#videoPlayer");
    if(data=="mute"){
        videoplayer.muted = true;
    }else if(data=="unmute"){
        videoplayer.muted = false;
    }
})


socket.on("settime",(data)=>{
    let videoplayer = document.querySelector("#videoPlayer");
    console.log(parseFloat(data))
    videoplayer.currentTime = parseFloat(data);
})

socket.on("pause",()=>{
    let videoplayer = document.querySelector("#videoPlayer");
    videoplayer.pause();
})

socket.on("play",()=>{
    let videoplayer = document.querySelector("#videoPlayer");
    videoplayer.play();
})

socket.on('setvideo', ()=>{
    setCookie("reloaded","true","Thu, 18 Dec 2513 12:00:00 UTC")
    socket.emit('setwillreload');
    videoPlayerContainer.innerHTML = "";
    window.open(window.location.href, '_blank');
    window.close();
})

// socket.emit('chat message', input.value);

// socket.on('setyourvideo', function(msg) {
// });