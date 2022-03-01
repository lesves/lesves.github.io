function ID() {
	return "_" + Math.random().toString(36).substr(2, 9);
}


function drag(event) {
	event.dataTransfer.effectAllowed = "move";
	event.dataTransfer.setData("text", event.target.id);
}


function drop(event) {
	event.preventDefault();
	var data = event.dataTransfer.getData("text");
	var block = document.getElementById(data);
	if (block.classList.contains("blocklist")) {
		block = block.cloneNode(true);
		block.classList.remove("blocklist");
	}
	block.id = ID();
	if (event.target.classList.contains("droptarget")) {
		event.target.appendChild(block);
	}
	event.target.classList.remove("over");

	if (event.target.classList.contains("block") && !event.target.classList.contains("blocklist")) {
		event.target.parentNode.insertBefore(block, event.target.nextSibling);
	}
}


function trash(event) {
	event.preventDefault();
	var data = event.dataTransfer.getData("text");
	var block = document.getElementById(data);
	if (!block.classList.contains("blocklist")) {
		block.parentNode.removeChild(block);
	}
}


function dragover(event) {
	event.preventDefault();
	event.target.classList.add("over");
}


function dragleave(event) {
	event.preventDefault();
	event.target.classList.remove("over");
}


window.addEventListener("load", function() {
	var els = document.getElementsByClassName("block");
	for (var i = 0; i<els.length; i++) {
		els[i].id = ID();
	}
});
