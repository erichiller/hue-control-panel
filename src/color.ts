
type rgb = {
	red: number;
	green: number;
	blue: number;
}
type cie = {
	x: number;
	y: number;
}
type hex = string;

export class Color {


	/**
	 * rgb returns RGB values by consuming the objects HEX value
	 * this is essentially HEX -> RGB
	 * 
	 * @readonly
	 * @type {rgb}
	 * @memberof Color
	 */
	get rgb(): rgb {
		console.log("get rgb()");
		let hex = this.hex;
		let r = hex.substr(1, 2);
		let g = hex.substr(3, 2);
		let b = hex.substr(5, 2);
		console.log("red=" + r + "green=" + g + "blue=" + b);
		return {
			red: parseInt(r, 16),
			green: parseInt(g, 16),
			blue: parseInt(b, 16)
		}
	}

	get hex(): hex {
		console.log("get hex()");
		let rgb = this.rgb;
		let hex = this.decimalToHex(rgb.red) +
			this.decimalToHex(rgb.green) +
			this.decimalToHex(rgb.blue);
		console.log(hex);
		return hex;
	}

	get cie(): cie {
		let rgb = this.rgb;
		let red = rgb.red;
		let green = rgb.green;
		let blue = rgb.blue;
		//function rgbToCie(red: number, green: number, blue: number): [number, number] {
		// Gamma correction
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

		return { x: fx.toFixedNumber(4), y: fy.toFixedNumber(4) };
	}




	decimalToHex(d: number, padding = 2) {
		var hex = Number(d).toString(16);
		while (hex.length < padding) {
			hex = "0" + hex;
		}
		return hex;
	}

}

export class ColorCIE extends Color {

	constructor(x: number, y: number) {
		super();
	}
}

export class ColorRGB extends Color {

	_rgb: rgb;

	constructor(red: number, green: number, blue: number) {
		super();
		this._rgb = {
			red: red,
			green: green,
			blue: blue,
		}
	}

	get rgb(): rgb {
		return this._rgb;
	}

}

export class ColorHex extends Color {

	_hex: string

	constructor(hex: string) {
		super();
		this._hex = hex;
	}

	get hex(): hex {
		return this._hex;
	}
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
