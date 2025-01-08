"use strict";


var abc_ = "abcdefghijklmnopqrstuvwxyz".split("");
var abc = new Set(abc_);

var acc = "áäčďéěíĺľňóôőöŕšťúůűüýřž";
var acc_r = "aacdeeillnoooorstuuuuyrz";


function norm(s) {
	for (let i = 0; i < acc.length; i++) {
		s = s.replace(acc[i], acc_r[i]);
	}
	return s;
}

function argmin(arr) {
	// https://gist.github.com/engelen/fbce4476c9e68c52ff7e5c2da5c24a28
	return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}


function letspan(l, visible) {
	let x = document.createElement("span");
	x.innerText = visible ? l : "_";
	x.classList.add("letter");
	visible ? x.classList.add("visible") : x.classList.add("hidden");
	return x;
}


function DeadlyHangman(wordlist) {
	this.length = Math.floor(Math.random() * 3 + 4);
	this.wordlist = wordlist.filter(w => w.length == this.length);
	this.lives = 10;
	this.guessed = new Set();
	this.incorrect = new Set();
	this.launched = false;
	this.correct_num = 0;

	this.elements = {
		"word": document.getElementById("word"),
		"incorrect": document.getElementById("incorrect"),
		"lives": document.getElementById("lives"),
	}

	this.render = function() {
		if (this.lives === 0) {
			alert("Oběšen. Jako vždy. Tajenka byla: " + this.wordlist[0]);
			window.location.reload();
		} else if (this.correct_num === this.length) {
			alert("Vyhráli jste. Jak je to možné? (Tajenka: " + this.wordlist[0] + ")");
			window.location.reload();
		}

		this.elements["lives"].innerText = this.lives;
		this.elements["word"].textContent = "";
		this.elements["incorrect"].textContent = "";
		this.wordlist[0].split("").map(l => letspan(l, this.guessed.has(norm(l)))).forEach(x => this.elements["word"].appendChild(x));
		this.incorrect.forEach(x => this.elements["incorrect"].innerText += x);
		this.guessed.forEach(x => {
			document.getElementById("key-" + x).classList.add("guessed");
		});
	}

	this.launch = function() {
		this.launched = true;
		document.getElementById("main").removeAttribute("hidden");
		document.getElementById("intro").setAttribute("hidden", "");
		this.render();
	}

	this.input = function(c) {
		if (!this.launched) {return;}
		if (abc.has(c) && !this.guessed.has(c)) {
			this.guessed.add(c);
			let new_wordlist = this.wordlist.filter(w => !norm(w).includes(c));
			if (new_wordlist.length) {
				this.incorrect.add(c);
				this.lives -= 1;
				this.wordlist = new_wordlist;
				//console.log(this.wordlist[0]);
			} else {
				this.wordlist = this.wordlist.sort(() => Math.random() - 0.5);
				let wi = argmin(this.wordlist.map(w => norm(w).split(c).length-1));
				this.correct_num += norm(this.wordlist[wi]).split(c).length-1;
				let qry = norm(this.wordlist[wi]).replace(new RegExp("[^" + c + "]"), "_");
				this.wordlist = this.wordlist.filter(w => norm(w).replace(new RegExp("[^" + c + "]"), "_") == qry);
			}
			this.render();
		}
	}
}

fetch("cz_nouns.txt").then(r => r.text().then(x => x.split("\n")))
	.then(lst => lst.map(el => el.replace(/^\s+|\s+$/g, '')))
	.then(lst => lst.map(el => el.toLowerCase()))
	.then(wlist => {
		var hangman = new DeadlyHangman(wlist);
		document.getElementById("launch").addEventListener("click", () => hangman.launch());
		document.addEventListener("keydown", (e) => hangman.input(String.fromCharCode(e.which).toLowerCase()));

		let kb = document.getElementById("keyboard");
		for (let i = 0; i<abc_.length; i++) {
			let el = document.createElement("div");
			el.innerText = abc_[i];
			el.classList.add("key");
			el.id = "key-" + abc_[i];
			el.dataset.key = abc_[i];
			el.addEventListener("click", (e) => hangman.input(event.target.dataset.key));
			kb.appendChild(el);
			if (i % 13 == 12) {
				kb.appendChild(document.createElement("br"))
			}
		}
});
