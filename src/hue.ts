import { DEFAULT_HOME_LIGHT } from './lighting';
import { Bridge , DEFAULT_BRIDGE } from './bridge';


// replace
let lightID = 11; // homepage
let defaultColor = "#0000ff";


let bridge = DEFAULT_BRIDGE;

window.addEventListener("load", startup, false);

function startup() {
	let hueColor: HTMLFormElement = <HTMLFormElement> document.querySelector("#hueColor");
	hueColor.value = defaultColor;
	hueColor.addEventListener("change", setHueColor, false);
	hueColor.select(); // pretty sure this selects the element for user input

	let discoLight: HTMLFormElement = <HTMLFormElement>document.querySelector("#discoLight");
	discoLight.value = (DEFAULT_HOME_LIGHT.getEffect() == "none" ? "Turn on Disco" : "Turn off Disco")
	discoLight.addEventListener("click", DEFAULT_HOME_LIGHT.toggleEffect, false);

	let turnLightOn: HTMLFormElement = <HTMLFormElement>document.querySelector("#turnLightOn");
	turnLightOn.value = (DEFAULT_HOME_LIGHT.getPower()===false?"Turn On":"Turn Off")
	turnLightOn.addEventListener("click", DEFAULT_HOME_LIGHT.togglePower);

}


function setHueColor(event: Event) {
	console.log("setHueColor("+event+")");
	console.log((event.target as HTMLFormElement).value)
	DEFAULT_HOME_LIGHT.setColorHex((event.target as HTMLFormElement).value)
}










