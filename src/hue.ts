let defaultColor = "#0000ff";

let userId = "XO3rCiWc269m6rk5wv1OZzudn9PCkAY-JcRMby8x";
let bridgeIP = "192.168.10.44";
let lightID = 11;

window.addEventListener("load", startup, false);

function startup() {
	let hueColor: HTMLFormElement = <HTMLFormElement> document.querySelector("#hueColor");
	hueColor.value = defaultColor;
	hueColor.addEventListener("change", setHueColor, false);
	hueColor.select(); // pretty sure this selects the element for user input

	let discoLight: HTMLFormElement = <HTMLFormElement>document.querySelector("#discoLight");
	discoLight.value = (get("lights", lightID).state.effect == "none" ? "Turn on Disco" : "Turn off Disco")
	discoLight.addEventListener("click", toggleDisco, false);

	let turnLightOn: HTMLFormElement = <HTMLFormElement>document.querySelector("#turnLightOn");
	turnLightOn.value = (get("lights", lightID).state.on==false?"Turn On":"Turn Off")
	turnLightOn.addEventListener("click", toggleLightPower);

}

// @param method string, enum = POST, PUT, GET, 
// @param category string, enum = lights, groups, config , schedules , scenes , sensors , rules 
// @param noun integer = id of the device or group being acted upon
function get(category: string, id: number, noun?: string): any {
	let conn = new XMLHttpRequest();
	let result;
	console.log("in get() with category=" + category + "id=" + id + "noun=" + noun);
	conn.onreadystatechange = function () {
		console.log("statechange for get()this=>" + this.readyState + "||" + this.status);
		if (this.readyState != 4) return;
		if (this.status == 200) {
			result = JSON.parse(this.responseText);
			console.log("received: " + result);

			// we get the returned data
		}
		// end of state change: it can be after some time (async)
	}




	let method: string = "GET"
	let url = "http://" + bridgeIP + "/api/" + userId + "/" + category + "/" + id + (noun ? "/" + noun : "")
	console.log("GETing data to: " + url);
	conn.open(method, url, false);
	conn.setRequestHeader('Content-Type', 'application/json');
	conn.send();
	return result;
}
function put(category: string, id: number, noun: string, postdata: any): any {
	let conn = new XMLHttpRequest();
	let result;
	console.log("in put() with category=" + category + "id=" + id + "noun=" + noun + "postdata=" + postdata);
	conn.onreadystatechange = function () {
		if (this.readyState != 4) return;
		if (this.status == 200) {
			result = JSON.parse(this.responseText);
			console.log("received: " + result);

			// we get the returned data
		}
		// end of state change: it can be after some time (async)
	}
	let method: string = "PUT";
	let url = "http://" + bridgeIP + "/api/" + userId + "/" + category + "/" + id + (noun ? "/" + noun : "");
	console.log("PUTing data to: " + url);
	conn.open(method, url, false);
	conn.setRequestHeader('Content-Type', 'application/json');
	conn.send(JSON.stringify(postdata));
	return result;
}


function toggleDisco() {
	console.log("toggleDisco()");
	let currentEffect = get("lights", lightID).state.effect;
	let postdata = { "effect" : (currentEffect != 'none' ? 'none' : 'colorloop') }
	put("lights", lightID, "state", postdata)
}

function toggleLightPower() {
	console.log("toggleLightPower()");
	let currentPowerStatus:boolean = get("lights", lightID).state.on;
	let postdata = { "on": (currentPowerStatus == true ? false : true) }
	put("lights", lightID, "state", postdata)
}

function setHueColor(event: Event) {
	console.log("setHueColor("+event+")");
	console.log((event.target as HTMLFormElement).value)
	let [r, g, b] = hexToRGB((event.target as HTMLFormElement).value)
	let [x, y] = rgbToCie(r,g,b)
	// let currentEffect = get("lights", lightID).state.effect;
	let postdata = { "xy": [ x , y ] }
	put("lights", lightID, "state", postdata)
}

function hexToRGB(hex: string): [number ,number, number] {
	let r = hex.substr(1,2);
	let g = hex.substr(3,2);
	let b = hex.substr(5,2);
	console.log("red=" + r + "green=" + g + "blue=" + b);
	let red: number = parseInt(r, 16)
	let green: number = parseInt(g, 16)
	let blue: number = parseInt(b, 16)
	return [red, green, blue]
}




//dep
function watchHueColor(event) {
	console.log("watchHueColor() on event=" + event);
	document.querySelectorAll("p").forEach(function (p) {
		p.style.color = event.target.value;
	});
}






function rgbToCie(red: number, green: number, blue: number): [number, number] {
	//Gamma correctie
	red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
	green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
	blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

	//Apply wide gamut conversion D65
	var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
	var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
	var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

	var fx = X / (X + Y + Z);
	var fy = Y / (X + Y + Z);
	if (Number.isNaN(fx)) {
		fx = 0.0;
	}
	if (Number.isNaN(fy)) {
		fy = 0.0;
	}

	return [fx.toFixedNumber(4), fy.toFixedNumber(4)];
}

function cieToRgb(x: number, y: number, brightness: number = 254): [number, number, number] {
	var z = 1.0 - x - y;
	var Y = (brightness / 254).toFixedNumber(2);
	var X = (Y / y) * x;
	var Z = (Y / y) * z;

	//Convert to RGB using Wide RGB D65 conversion
	var red = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
	var green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
	var blue = X * 0.051713 - Y * 0.121364 + Z * 1.011530;

	//If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
	if (red > blue && red > green && red > 1.0) {
		green = green / red;
		blue = blue / red;
		red = 1.0;
	} else if (green > blue && green > red && green > 1.0) {
		red = red / green;
		blue = blue / green;
		green = 1.0;
	} else if (blue > red && blue > green && blue > 1.0) {
		red = red / blue;
		green = green / blue;
		blue = 1.0;
	}

	//Reverse gamma correction
	red = red <= 0.0031308 ? 12.92 * red : (1.0 + 0.055) * Math.pow(red, (1.0 / 2.4)) - 0.055;
	green = green <= 0.0031308 ? 12.92 * green : (1.0 + 0.055) * Math.pow(green, (1.0 / 2.4)) - 0.055;
	blue = blue <= 0.0031308 ? 12.92 * blue : (1.0 + 0.055) * Math.pow(blue, (1.0 / 2.4)) - 0.055;


	//Convert normalized decimal to decimal
	red = Math.round(red * 255);
	green = Math.round(green * 255);
	blue = Math.round(blue * 255);

	if (Number.isNaN(red))
		red = 0;

	if (Number.isNaN(green))
		green = 0;

	if (Number.isNaN(blue))
		blue = 0;

	return [red, green, blue];
}


interface Number {
	toFixedNumber(decimalPoints: number, base?: number): number;
}
/**
 * Extends Number to allow for a multi-base toFixed which returns a Number
 * Rather than a traditional string
 * @param {number} decimalPoints
 * @param {number} [base] 
 * @returns {number} 
 */
Number.prototype.toFixedNumber = function (decimalPoints: number, base?: number): number {
	var pow = Math.pow(base || 10, decimalPoints);
	return +(Math.round(this * pow) / pow);
}



