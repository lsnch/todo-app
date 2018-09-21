let input_field = document.querySelector(".input__text");

let list = document.querySelector(".main__list");

let footer_counter = document.querySelector(".footer__counter");
let footer_fill_button = document.querySelector(".footer__fill");
let footer_clear_button = document.querySelector(".footer__clear");

let storage = {
	add(string) {
		let data = this.entries;
		data.push(string);
		this.entries = data;
	},

	remove(index) {
		let data = this.entries;
		data.splice(index, 1);
		this.entries = data;
	},

	swap(i, j) {
		let data = this.entries;
		[data[i], data[j]] = [data[j], data[i]];
		this.entries = data;
	},
};
Object.defineProperty(storage, "entries", {
	get() {
		let data = [];
		if (localStorage.entries) {
			data = JSON.parse(localStorage.entries);
		}
		return data;
	},

	set(data) {
		localStorage.entries = JSON.stringify(data);
	},
});

function addItem(event) {
	if (!input_field.value) return;

	let lis = constructLis([input_field.value]);

	storage.add(input_field.value);
	input_field.value = "";

	list.append(...lis);

	updateCounter();
}

function updateCounter() {
	footer_counter.textContent = `items total: ${list.children.length}`;
}

function repopulate() {
	let entries = storage.entries;

	let lis = constructLis(entries);

	list.append(...lis);
}

function clear() {
	storage.entries = [];

	[...list.children].forEach(el => el.remove());
}

function constructLis(entries) {
	let lis = entries.map(entry => {
		let li = document.createElement("li");
		li.draggable = "true";

		let p = document.createElement("p");
		p.textContent = entry;
		li.append(p);

		let close_button = document.createElement("span");
		close_button.classList.add("close-button");
		li.append(close_button);

		return li;
	});
	return lis;
}

// entry
input_field.addEventListener("keypress", function() {
	if (event.keyCode != 13) return;

	addItem();
});

// close buttons
list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	console.log(event);
	let li = target.parentElement;
	let index = [...li.parentElement.children].indexOf(li);

	storage.remove(index);

	li.remove();
	updateCounter();
});

// fill list with random strings
footer_fill_button.addEventListener("click", _ => {
	clear();

	let total = 5;
	let data = [];
	for (let i = 0; i < total; i++) {
		data[i] = `${Math.random()}`;
	}
	data.push(`---- `.repeat(140));
	storage.entries = data;

	repopulate();
	updateCounter();
});

// clear list
footer_clear_button.addEventListener("click", _ => {
	clear();

	updateCounter();
});

// DnD
let dragged_li;
list.addEventListener("dragstart", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged");

	event.dataTransfer.effectAllowed = "copy";
	event.dataTransfer.setData("text/html", "");
	dragged_li = target;
});

list.addEventListener("dragenter", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged_over");
});
list.addEventListener("dragover", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	event.preventDefault();
});
list.addEventListener("dragleave", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged_over");
});
list.addEventListener("dragend", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged");
});

list.addEventListener("drop", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged_over");
	if (target === dragged_li) return;

	let i = [...target.parentElement.children].indexOf(target);
	let j = [...dragged_li.parentElement.children].indexOf(dragged_li);
	storage.swap(i, j);

	[target.innerHTML, dragged_li.innerHTML] = [
		dragged_li.innerHTML,
		target.innerHTML,
	];
});

(function init() {
	repopulate();
	updateCounter();
})();
