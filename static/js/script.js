function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function refreshVideo(){
    let videosrc = `<video controls loop id="videoPlayer" width="650" controls muted="muted" autoplay><source id="source" src="/video/${makeid(64)}" type="video/mp4" /></video>`;
    let videoPlayerContainer = document.querySelector("#video-player-container");
    videoPlayerContainer.innerHTML = "";
    videoPlayerContainer.innerHTML = videosrc;
}

function videoToFullScreen(){
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
}

// getCookie("name")
// setCookie("reloaded","false","Thu, 18 Dec 2513 12:00:00 UTC")
// checkCookie("name")

if(!checkCookie("name")){
    $.get(
        "/getid",
        (id)=>{
            setCookie("id",id,"Thu, 18 Dec 2513 12:00:00 UTC");
            refreshVideo();
            videoToFullScreen();
        }
    )
}else{
    refreshVideo();
    videoToFullScreen();
}

let video = "";

setInterval(() => {

    $.get(
        `/deviceinfo/${getCookie("id")}`,
        (deviceInfo)=>{
            deviceInfo = JSON.parse(deviceInfo);
            // {name:id, named:false, videos:["bigbuck.mp4"],isPlaying:true,isMuted:true,setTime:false,time:0,checked:Math.floor(Date.now() / 1000)}
            if(video=="")video = deviceInfo["videos"][0];

            // if(deviceInfo["isMuted"][""])


        }
    )
    
}, 3000);
