import { DEFAULT_HOME_LIGHT } from './lighting';
import { Bridge , DEFAULT_BRIDGE } from './bridge';
import { colorPalette } from '../dep/lib/palette';

// replace
let lightID = 11; // homepage
let defaultColor = "#0000ff";


let bridge = DEFAULT_BRIDGE;

window.addEventListener("DOMContentLoaded", startup, false);
let palette = new colorPalette("colorPalette", {
	lookupClass: null,
	onFineChange: setHueColor,
	valueElement: false,
	styleElement: false,
	padding: 2,
	borderWidth: 1,
	position: 'top',
	activeClass: "eric-rocks"
},
true);

function startup() {
	let hueColor: HTMLFormElement = <HTMLFormElement>document.querySelector("#status_rgb_red");
	if (hueColor) {
		hueColor.value = defaultColor;
		// hueColor.addEventListener("change", setHueColor, false);
		hueColor.select(); // pretty sure this selects the element for user input
	} else {
		console.log( "Unable to set color of current light, element not found" );
	}

	let discoLight: HTMLFormElement = <HTMLFormElement>document.querySelector("#discoLight");
	if (discoLight) {
		discoLight.value = (DEFAULT_HOME_LIGHT.getEffect() == "none" ? "Turn on Disco" : "Turn off Disco")
		discoLight.addEventListener("click", DEFAULT_HOME_LIGHT.toggleEffect, false);
	} else {
		console.log("Unable to set effect status of current light, element not found");
	}

	let turnLightOn: HTMLFormElement = <HTMLFormElement>document.querySelector("#turnLightOn");
	if (turnLightOn) {
		turnLightOn.value = (DEFAULT_HOME_LIGHT.getPower()===false?"Turn On":"Turn Off")
		turnLightOn.addEventListener("click", DEFAULT_HOME_LIGHT.togglePower);
	} else {
		console.log("Unable to set power status of current light, element not found");
	}

	let navigateHome: HTMLElement = <HTMLElement>document.querySelector("#navigate-home");
	navigateHome.addEventListener("click", () => { document.querySelector("#main").classList.toggle("rotate") } );


	document.querySelector("#test_el_targeting").addEventListener("click",function(ev: MouseEvent){
		
		console.log("I've been clicked");
		console.log(`nodename=${(<any>ev.target).nodeName} ;; nodeID=${(<any>ev.target).id}`);
		console.log(ev);
		console.log("---end---I've been clicked---");

	});
	

}


export function setHueColor() {
	DEFAULT_HOME_LIGHT.setColorHex(this.toHEXString());

	document.getElementById('status_rgb_red').innerHTML =
		Math.round(this.rgb[0]).toString();
	document.getElementById('status_rgb_green').innerHTML =
		Math.round(this.rgb[1]).toString();
	document.getElementById('status_rgb_blue').innerHTML =
		Math.round(this.rgb[2]).toString();
}


// function navigate(el?: Element, ev?: ElementEventMap[]): any {
// 	console.log(el,ev);
// 	if (el){
// 		console.log(el);
// 		console.log(el.id.indexOf("-"));
// 		console.log(el.id.substring(el.id.indexOf("-")))
// 		let dest = el.id.substring(el.id.indexOf("-"));
// 		switch (dest){
// 			case "home":
// 				;
// 			break;
// 			default:
// 				console.log("navigation option " + dest + " does not exist");
// 			break;
// 		}
// 	}
// }








