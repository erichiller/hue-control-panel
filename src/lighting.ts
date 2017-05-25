import { DEFAULT_HOME_LIGHT_ID } from './config';
import { Bridge } from './bridge';
import { lightObject , LightEffect } from './lightObject';
import { Color , ColorCIE } from './color';

export class Room extends lightObject {
	lights: Light[];

	BRIDGE_TARGET_NAME = "groups";

	getEffect(): LightEffect {
		console.log(typeof this + ".getEffect()");
		return this.get().action.effect;
	}
	setEffect(effect: LightEffect) {
		console.log("setEffect(" + effect + ")");
		let postdata = { "effect": effect }
		this.put("action", postdata)
	}

	getPower(): boolean {
		console.log(typeof this + ".getPower()");
		return this.get().action.on;
	}
	setPower(powerState: boolean) {
		console.log(typeof this + ".setPower(" + powerState + ")");
		let postdata = { "on": powerState }
		this.put("action", postdata)
	}

	getColor(): Color {
		console.log(typeof this + ".getColor()");
		let [x, y] = this.get().action.xy;
		return new ColorCIE(x, y)
	}
	setColor(color: Color) {
		console.log(typeof this + ".setColor()");
		let postdata = { "xy": [color.cie.x, color.cie.y] }
		this.put("action", postdata)
	}

}

export class Group extends lightObject {
	lights: Light[];

	BRIDGE_TARGET_NAME = "groups";

	getEffect(): LightEffect {
		console.log(typeof this + ".getEffect()");
		return this.get().action.effect;
	}
	setEffect(effect: LightEffect) {
		console.log("setEffect(" + effect + ")");
		let postdata = { "effect": effect }
		this.put("action", postdata)
	}

	getPower(): boolean {
		console.log(typeof this + ".getPower()");
		return this.get().action.on;
	}
	setPower(powerState: boolean) {
		console.log(typeof this + ".setPower(" + powerState + ")");
		let postdata = { "on": powerState }
		this.put("action", postdata)
	}

	getColor(): Color {
		console.log(typeof this + ".getColor()");
		let [x, y] = this.get().action.xy;
		return new ColorCIE(x, y)
	}
	setColor(color: Color) {
		console.log(typeof this + ".setColor()");
		let postdata = { "xy": [color.cie.x, color.cie.y] }
		this.put("action", postdata)
	}

}

export class Light extends lightObject {

	BRIDGE_TARGET_NAME = "lights";

	getEffect(): LightEffect {
		console.log(typeof this + ".getEffect()");
		return this.get().state.effect;
	}
	setEffect(effect: LightEffect) {
		console.log("setEffect(" + effect + ")");
		let postdata = { "effect": effect }
		this.put("state", postdata)
	}

	getPower(): boolean {
		console.log(typeof this + ".getPower()");
		return this.get().state.on;
	}
	setPower(powerState: boolean) {
		console.log(typeof this + ".setPower(" + powerState + ")");
		let postdata = { "on": powerState }
		this.put("state", postdata)
	}

	getColor(): Color {
		console.log(typeof this + ".getColor()");
		let [x, y] = this.get().state.xy;
		return new ColorCIE(x,y)
	}
	setColor(color: Color) {
		console.log(typeof this + ".setColor()");
		let postdata = { "xy": [color.cie.x, color.cie.y] }
		this.put("state", postdata)
	}

}


export let DEFAULT_HOME_LIGHT = new Light(DEFAULT_HOME_LIGHT_ID)
