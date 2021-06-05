
$.get(
    "/getnamed",
    (namedDevices)=>{
        $.get(
            "/allvideos",
            (videos)=>{
                namedDevices = JSON.parse(namedDevices)

                let cardsContainer = document.querySelector(".cards-container");
                let cards = ""

                for(namedDevice in namedDevices){
                    cards += card(namedDevice, namedDevices[namedDevice], videos);
                }

                cardsContainer.innerHTML = cards;
                //complete injecting cards

                let domCards = document.querySelectorAll(".card");
                for(let c = 0;c<domCards.length;c++){
                    domCards[c].querySelector(".set-video").addEventListener("click",(e)=>{
                        $.get(`/setvideo/${domCards[c].getAttribute("socketid")}?video=${domCards[c].querySelector(".movie-selection .select select").value}`,(res)=>{setTimeout(()=>{window.location.reload()},1000)})
                    })
                    domCards[c].querySelector(".set-time").addEventListener("click",(e)=>{
                        $.get(`/settime/${domCards[c].getAttribute("socketid")}?settime=${domCards[c].querySelector(".time-set .input input").value}`,(res)=>{domCards[c].querySelector(".time-set .input input").value="";})
                    })

                    domCards[c].querySelector(".unmute").addEventListener("click",(e)=>{
                        $.get(`/setsound/${domCards[c].getAttribute("socketid")}?setsound=unmute`,(res)=>{})
                    })
                    domCards[c].querySelector(".mute").addEventListener("click",(e)=>{
                        $.get(`/setsound/${domCards[c].getAttribute("socketid")}?setsound=mute`,(res)=>{})
                    })
                    domCards[c].querySelector(".play").addEventListener("click",(e)=>{
                        $.get(`/play/${domCards[c].getAttribute("socketid")}`,(res)=>{})
                    })
                    domCards[c].querySelector(".pause").addEventListener("click",(e)=>{
                        $.get(`/pause/${domCards[c].getAttribute("socketid")}`,(res)=>{})
                    })

                    let renameScreen = document.querySelector(".rename-screen");
                    domCards[c].querySelector(".rename").addEventListener("click",(e)=>{
                        renameScreen.style.display="flex";
                    })

                    renameScreen.querySelector(".fa-times").addEventListener("click",(e)=>{
                        renameScreen.style.display="none";
                    })

                    renameScreen.querySelector(".rename-button-container .card-button").addEventListener("click",(e)=>{
                        $.get(`/setname/${domCards[c].getAttribute("socketid")}?name=${document.querySelector(".rename-input-container .rename-input input").value}`,(res)=>{setTimeout(()=>{window.location.reload()},1000)})
                    })


                }
            }
        )
    }
)

