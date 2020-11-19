var fact_index = 0;
var facts = [
    'Gymnázium je vybaveno knihovnou, která obsahuje přes 16 000 knih.',
    'Motto: Per aspera ad astra.',
    'Škola má bezbariérový přístup.',
    'Škola má kapacitu 590 žáků, v současné době má 20 tříd. ',
    'Naše škola je nejlepší. :D',
]

var fouryear;
var yearSelected;
var loader_on = false;
var loadStep = 0;
var loadSteps = Infinity;
var int;

function include(filename, onload, id) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    if(id) {
    	script.id = id;
    }
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;onload();}
            } else {
                onload();
            }
        };
    head.appendChild(script);
}

window.resourceCache = {};
var loading = [];
function resourcesLoad(Arr) {
    Arr.forEach(function(url) {
        if(window.resourceCache[url]) {
            return window.resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                window.resourceCache[url] = img;
                partialCallback()

                if(loadStep == loadSteps) {
                    resourceReadyCallback()
                }
            };
            window.resourceCache[url] = false;
            img.src = url;
        }
    });
}


window.onload = function() {
    include('bundle.js', function() {
        loadStep += 1
        document.getElementById("loader-bar").style.width = (loadStep/loadSteps*100)+"%";
        res = [ //Add all assets that should be preloaded for smooth play, they will be loaded to browser cache.
            'assets/pano/01.jpg',
            'assets/pano/02.jpg',
            'assets/pano/03.jpg',
            'assets/pano/04.jpg',
            'assets/pano/05.jpg',
            'assets/pano/06.jpg',
            'assets/pano/07.jpg',
            'assets/map/0.png',
            'assets/map/1.png',
            'assets/map/2.png',
            'assets/map/3.png',
            'assets/map/player.png',
            'assets/cup.png',
        ];
        loadSteps = res.length+1;
        resourcesLoad(res);
    })
    var button4 = document.getElementById("fouryear");
    var button8 = document.getElementById("eightyear");

    if (button4 && button8) {
        button4.addEventListener("click", (event) => { yearSelect(true); });
        button8.addEventListener("click", (event) => { yearSelect(false); });
    }
}

function yearSelect(isFouryear) {
    fouryear = isFouryear;
    yearSelected = true;

    document.getElementById("intro").style.display = "none";
    document.getElementById("introvideo").style.display = "block";

    document.getElementById("introcontinue").addEventListener("click", (event) => {
        loading_screen();
        if (loadStep == loadSteps) {
            start_app();
        }
    });
}

function loading_screen() {
    loader_on = true;

    document.getElementById("introvideo").style.display = "none";
    var f = document.getElementById("introframe");
    f.parentNode.removeChild(f);
    document.getElementById("loader").style.display = "block";

    document.getElementById("fact").innerHTML = "<em>" + facts[fact_index] + "</em>";
    int = setInterval(function() {
        fact_index = (fact_index + 1) % facts.length;

        var fact = document.getElementById("fact");
        if (!fact) {
            clearInterval(int);
            return;
        }

        fact.innerHTML = facts[fact_index];
    }, 2000);
}


function resourceReadyCallback() {
    if (loader_on)
        start_app();
}

function partialCallback() {
    loadStep += 1
    document.getElementById("loader-bar").style.width = (loadStep/loadSteps*100)+"%";
}

function start_app() {
    var overlay = document.getElementById("overlay");
    if (overlay) { overlay.style.filter = "blur(2px)" };
    window.start(fouryear);
    document.body.style.backgroundImage = "none";
}