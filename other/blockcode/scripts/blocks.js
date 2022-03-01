var canvas, ctx;
var pos = [0, 0];
var angle = 0;
var speed = 5;

window.addEventListener("load", function() {
	canvas = document.getElementById("result");
	canvas.setAttribute("width", canvas.offsetWidth);
	canvas.setAttribute("height", canvas.offsetHeight);
	ctx = canvas.getContext("2d");
});


var commands = {
	"say": alert,
	/*"write": function(text) {
		document.getElementById("result").innerHTML += text;
	},*/
	"repeat": function(n, code) {
		for (var i = 0; i<n; i++) {
			run(code);
		}
	},
	"forward": function(n) {
		console.log("FWD");
		var cpos = pos2canvas(pos);
		ctx.moveTo(cpos[0], cpos[1]);

		pos[0] = pos[0] + Math.cos(deg2rad(angle - 90)) * n * speed;
		pos[1] = pos[1] + Math.sin(deg2rad(angle - 90)) * n * speed;

		var cpos = pos2canvas(pos);
		ctx.lineTo(cpos[0], cpos[1]);
		ctx.stroke();
		ctx.moveTo(cpos[0], cpos[1]);
	},
	"turnleft": function(n) {
		angle -= n;
	},
	"turnright": function(n) {
		angle += n;
	}
};


function deg2rad(deg) {
	return deg * (Math.PI/180);
}


function pos2canvas(pos) {
	return [Math.floor(canvas.width/2) + pos[0], 
			Math.floor(canvas.height/2) + pos[1]];
}


function run(blocks) {
	for (var i = 0; i < blocks.length; i++) {
		var block = blocks[i];
		var fields = [];
		for (var j = 0; j < block.children.length; j++) {
			if (block.children[j].tagName == "INPUT") {
				fields.push(block.children[j].value);
			}
		}

		var droptargets = block.getElementsByClassName("droptarget");
		for (var j = 0; j < droptargets.length; j++) {
			fields.push(droptargets[j].children);
		}

		var fn = commands[block.dataset.command];
		fn.apply(null, fields);
	}
}

function save() {
	download("save.blc", document.getElementById("code").innerHTML);
}

function download(filename, data) {
    var blob = new Blob([data], {type: "text/html"});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

function clearcanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	pos = [0, 0];
	angle = 0;
}

function clearcode() {
	document.getElementById("code").innerHTML = "";
	clearcanvas();
}