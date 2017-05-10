let hueColor
let defaultColor = "#0000ff";

let userId = "XO3rCiWc269m6rk5wv1OZzudn9PCkAY-JcRMby8x";
let bridgeIP = "192.168.10.44";
let lightID = "11";

window.addEventListener("load", startup, false);

function startup() {
	hueColor = document.querySelector("#hueColor");
	hueColor.value = defaultColor;
	hueColor.addEventListener("input", updateFirst, false);
	hueColor.addEventListener("change", updateAll, false);
	hueColor.select();
}

hueColor.addEventListener("input", updateFirst, false);
hueColor.addEventListener("change", watchHueColor, false);

function watchHueColor(event) {
	document.querySelectorAll("p").forEach(function (p) {
		p.style.color = event.target.value;
	});
}


function updateFirst(event) {
	let p = document.querySelector("p");
	if (p) { p.style.color = event.target.value; }
}

function updateAll(event) {
	document.querySelectorAll("p").forEach(function (p) {
		p.style.color = event.target.value;
	});
}

// @param method string, enum = POST, PUT, GET, 
// @param category string, enum = lights, groups, config , schedules , scenes , sensors , rules 
// @param noun integer = id of the device or group being acted upon
function sendColor(method, category, noun) {
	let url = "http://" + bridgeIP + "/api/" + userId + "/" + category + (noun ? noun : "")
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		value: value
	}));
}

function get(group, id, noun, key) {
	url = "http://" + bridgeIP + "/api/" + userId + "/" + category + "/" + id + (noun ? "/" + noun : "")
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		value: value
	}));
}

xhr.onreadystatechange = function () {
	if (this.readyState != 4) return;

	if (this.status == 200) {
		var data = JSON.parse(this.responseText);

		// we get the returned data
	}

	// end of state change: it can be after some time (async)
};

xhr.open('GET', yourUrl, true);
xhr.send();


function toggleDisco() {
	currentEffect = get("lights", lightID, "state", "effect")
	body = '{"effect":"' + (currentEffect != 'none' ? 'none' : 'colorloop') + '"}'
	send("PUT", "lights", lightID, "state", body)
}
