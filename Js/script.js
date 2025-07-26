let currentSong = new Audio();
let songs;
let currfolder;
function secondsToMMSS(totalSeconds) {
    // If totalSeconds isn't a valid number, return "00:00"
    if (
        totalSeconds == null ||
        typeof totalSeconds !== 'number' ||
        Number.isNaN(totalSeconds)
    ) {
        return "00:00".trim();
    }

    const wholeSeconds = Math.floor(totalSeconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const seconds = wholeSeconds % 60;
    const mm = minutes < 10 ? '0' + minutes : String(minutes);
    const ss = seconds < 10 ? '0' + seconds : String(seconds);
    return `${mm}:${ss}`;
}
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]) // it will split the link and give us the song name 
        }
    }

    //getting the list of songs and putting the songs inside the ul of html

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML +
            ` <li>
                            <img class="invert" src="/Img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Krish Sharma</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/Img/play.svg" alt="">
                            </div>
                        </li>`
    }
    // Attach an event lister to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs;
}
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "/Img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:3000/Songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let card_container = document.querySelector(".card_container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs/")) {
            let folder = e.href.split("/").slice(-2)[0];

            //Get the meta data of folder
            let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`)
            let response = await a.json();
            card_container.innerHTML = card_container.innerHTML + `  <div data-folder="${folder}" class="card">
                        <div class="icon-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                color="#000000" fill="#000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
                            </svg>
                        </div>

                        <img src="/Songs/${folder}/cover.jpg" alt="image1">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

}
async function main() {

    await getSongs("Songs/CS");
    playMusic(songs[0], true)


    // Attach an event lister to play and pause song
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/Img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/Img/play.svg"

        }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMMSS(currentSong.currentTime)} / ${secondsToMMSS(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    //event listener for playing next song when currnt song is finished
    currentSong.addEventListener('ended', () => {
        const idx = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);


        if (idx >= 0 && idx < songs.length - 1) {
            playMusic(songs[idx + 1]);
        }
        else if (idx == songs.length - 1) {
            playMusic(songs[0]);
        }
    });

    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("Pevious Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("Next Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length)
            playMusic(songs[index + 1])
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // Event lister to mute the volume
    let curVolume = currentSong.volume;
    mute.addEventListener("click", () => {
        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            mute.src = "/Img/mute.svg"
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            mute.src = "/Img/volume.svg"
            currentSong.volume = curVolume;
            document.querySelector(".range").getElementsByTagName("input")[0].value = curVolume.value
        }
    })
}

main()
displayAlbums()


// event listener for the spacebar
window.addEventListener('keydown', event => {
    if (event.key === ' ') {
        event.preventDefault();
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/Img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/Img/play.svg"

        }
    }
})