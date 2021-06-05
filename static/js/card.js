
function card(id, title, movies){
    console.log(id)
    console.log(title)
    console.log(movies)
    return `
    <!-- card-start -->
    <div class="card-holder">
        <div class="card" socketid="${id}">
            <div class="img-container">
                <img class="card-image" src="/static/img/tv.jpg" alt="">
                <div class="logo-img-card-container"><img class="logo-img-card" src="/static/img/nav-logo.png" alt=""></div>
                <div class="card-title"><p>${title}</p></div>
                <div class="rename card-button">Rename</div>
            </div>
            <div class="controlls-container">
                <div class="movie-selection">
                    <div class="select">
                        <select>
                            ${moviesOp(movies)}
                        </select>
                    </div>
                    <div class="card-button set-video">
                        Set
                    </div>
                </div>
                
                <div class="time-set">
                    <div class="input">
                        <input type="text" placeholder="Time">
                    </div>
                    <div class="card-button set-time">Set</div>
                </div>

                <div class="controll-icons">
                    <i class="fas fa-volume-up unmute"></i>
                    <i class="fas fa-volume-slash mute"></i>
                    <i class="fas fa-play play"></i>
                    <i class="fas fa-pause pause"></i>
                </div>

            </div>
        </div>
    </div>
    <!-- card-end -->
    `
}


function moviesOp(movies){
    let moviesOptions = ""
    for(let c=0;c<movies.length;c++){
        moviesOptions += `<option value="${movies[c]}">${movies[c].split(".")[0]}</option>`
    }
    return moviesOptions;
}