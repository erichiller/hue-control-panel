import './Global';
import { DEFAULT_BRIDGE, Bridge } from './bridge'
import { Color, ColorCIE , ColorHex , ColorRGB } from './color';



export type LightEffect = "colorloop" | "none";

export abstract class lightObject {
	id: number;
	name: string;
	bridge: Bridge;

	color: Color

	BRIDGE_TARGET_NAME = typeof this + "s";

	constructor(id: number, bridge = DEFAULT_BRIDGE) {
		this.id = id;
		this.bridge = bridge;
	}

	abstract getPower(): boolean;
	abstract setPower(powerState: boolean);

	abstract getEffect(): LightEffect;
	abstract setEffect(effect: LightEffect);

	abstract getColor(): Color;
	abstract setColor(color: Color);

	toggleEffect() {
		console.log(typeof this + "." + this.id + "toggleEffect()");
		this.setEffect(this.getEffect() != 'none' ? 'none' : 'colorloop')
	}

	togglePower() {
		console.log(typeof this + "." + this.id + "toggleLightPower()");
		this.setPower(this.getPower() == true ? false : true)
	}

	put(noun: string, postdata: any) {
		this.bridge.put(this.BRIDGE_TARGET_NAME, this.id, noun, postdata);
	}

	get(noun?: string): any {
		return this.bridge.get(this.BRIDGE_TARGET_NAME, this.id, noun);
	}

	setColorHex(colorAsHex: string){
		let color = new ColorHex(colorAsHex);
		this.setColor(color)
	}

	setColorRGB(red: number, green: number, blue: number) {
		let color = new ColorRGB(red, green, blue);
		this.setColor(color)
	}
}


