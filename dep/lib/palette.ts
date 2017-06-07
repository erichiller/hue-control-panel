/**
 * Colorish - TypeScript Color Palette
 * @author Eric D Hiller
 *
**/


interface picker {
	owner: colorPalette | null;
	wrap: HTMLElement;
	box: HTMLElement;
	boxS: HTMLElement;
	boxB: HTMLElement;
	pad: HTMLElement;
	padB: HTMLElement;
	padM: controlElementExt;
	padPal: paletteElementExt;
	cross: HTMLElement;
	crossBY: HTMLElement;
	crossBX: HTMLElement;
	crossLY: HTMLElement;
	crossLX: HTMLElement;
	sld: HTMLElement;
	sldB: HTMLElement;
	sldM: controlElementExt;
	sldGrad: sliderGradient;
	sldPtrS: HTMLElement;
	sldPtrIB: HTMLElement;
	sldPtrMB: HTMLElement;
	sldPtrOB: HTMLElement;
	btn: HTMLElement;
	btnT: HTMLElement;
}

class paletteElementExt {

	elm: HTMLCanvasElement | HTMLDivElement;
	ctx: CanvasRenderingContext2D;
	vmlNS: string; // vmlNamespace.vmlNS

	constructor(vmlNS?: string) {
		this.vmlNS = vmlNS;
		console.info("constuctor()ing paletteElementExt (padPal)");
		if (isCanvasSupported()) {
			console.info("Canvas is supported");
			// Canvas implementation for modern browsers
			this.elm = document.createElement('canvas');
			this.ctx = this.elm.getContext('2d');
		}

	}


	draw(width:number, height:number, type: 's' | 'v') {
		console.info(`in drawFunc for paletteElementExt.draw(). // width=${width} ; height=${height} ; type=${type}`);
		console.info(this);
		if (isCanvasSupported() && this.elm instanceof HTMLCanvasElement) {
			console.info(`paletteElementExt.draw() -> // width=${width} ; height=${height}`);
			this.elm.width = width;
			this.elm.height = height;

			this.ctx.clearRect(0, 0, this.elm.width, this.elm.height);

			let hGrad = this.ctx.createLinearGradient(0, 0, this.elm.width, 0);
			hGrad.addColorStop(0 / 6, '#F00');
			hGrad.addColorStop(1 / 6, '#FF0');
			hGrad.addColorStop(2 / 6, '#0F0');
			hGrad.addColorStop(3 / 6, '#0FF');
			hGrad.addColorStop(4 / 6, '#00F');
			hGrad.addColorStop(5 / 6, '#F0F');
			hGrad.addColorStop(6 / 6, '#F00');

			this.ctx.fillStyle = hGrad;
			this.ctx.fillRect(0, 0, this.elm.width, this.elm.height);

			let vGrad = this.ctx.createLinearGradient(0, 0, 0, this.elm.height);
			switch (type.toLowerCase()) {
				case 's':
					vGrad.addColorStop(0, 'rgba(255,255,255,0)');
					vGrad.addColorStop(1, 'rgba(255,255,255,1)');
					break;
				case 'v':
					vGrad.addColorStop(0, 'rgba(0,0,0,0)');
					vGrad.addColorStop(1, 'rgba(0,0,0,1)');
					break;
			}
			this.ctx.fillStyle = vGrad;
			this.ctx.fillRect(0, 0, this.elm.width, this.elm.height);
			console.log(this);
			console.log(this.ctx);
		} else {
			// VML fallback for IE 7 and 8

			let vmlContainer = document.createElement('div');
			vmlContainer.style.position = 'relative';
			vmlContainer.style.overflow = 'hidden';

			let hGrad = document.createElement(this.vmlNS + ':fill');
			(<any>hGrad).type = 'gradient';
			(<any>hGrad).method = 'linear';
			(<any>hGrad).angle = '90';
			(<any>hGrad).colors = '16.67% #F0F, 33.33% #00F, 50% #0FF, 66.67% #0F0, 83.33% #FF0'

			let hRect = document.createElement(this.vmlNS + ':rect');
			(<any>hRect).style.position = 'absolute';
			(<any>hRect).style.left = -1 + 'px';
			(<any>hRect).style.top = -1 + 'px';
			(<any>hRect).stroked = false;
			(<any>hRect).appendChild(hGrad);
			vmlContainer.appendChild(hRect);

			let vGrad = document.createElement(this.vmlNS + ':fill');
			(<any>vGrad).type = 'gradient';
			(<any>vGrad).method = 'linear';
			(<any>vGrad).angle = '180';
			(<any>vGrad).opacity = '0';

			let vRect = document.createElement(this.vmlNS + ':rect');
			vRect.style.position = 'absolute';
			vRect.style.left = -1 + 'px';
			vRect.style.top = -1 + 'px';
			(<any>vRect).stroked = false;
			vRect.appendChild(vGrad);
			vmlContainer.appendChild(vRect);
			this.elm = vmlContainer;

			this.elm.style.width = width + 'px';
			this.elm.style.height = height + 'px';

			hRect.style.width =
				vRect.style.width =
				(width + 1) + 'px';
			hRect.style.height =
				vRect.style.height =
				(height + 1) + 'px';

			// Colors must be specified during every redraw, otherwise IE won't display
			// a full gradient during a subsequential redraw
			(<any>hGrad).color = '#F00';
			(<any>hGrad).color2 = '#F00';

			switch (type.toLowerCase()) {
				case 's':
					(<any>vGrad).color = (<any>vGrad).color2 = '#FFF';
					break;
				case 'v':
					(<any>vGrad).color = (<any>vGrad).color2 = '#000';
					break;
			}
		}
	} //// END palette.draw() ////


}
function isControlElementExt(o: Object): o is controlElementExt {
	return ( (<controlElementExt>o).Instance !== undefined ||
		(<controlElementExt>o).ControlName !== undefined )
}
// function isTargetElementExt(o: Object): o is targetElementExt {
// 	return ((<targetElementExt>o).EventsAttached !== undefined ||
// 		(<targetElementExt>o).LinkedInstance !== undefined)
// }
interface controlElementExt extends HTMLElement {
	Instance?: colorPalette;
	ControlName?: string;
}

interface targetElementExt extends HTMLElement {
	EventsAttached?: boolean;
	LinkedInstance?: colorPalette;
}

type pointerType = "mouse" | "touch";

// type styleElement <CSSStyleDeclaration> = {
// 	[P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
// 	OriginalStyle: CSSStyleDeclaration;
// }

// type styleElementExt <HTMLStyleElement> = {
// 	[P in keyof HTMLStyleElement]?: HTMLStyleElement[P];
// }
interface styleElementExt extends Partial<HTMLStyleElement> {
	OriginalStyle?: Partial<CSSStyleDeclaration>;
}
// 	
// }

class sliderGradient {

	elm: HTMLElement;
	draw = null;
	vmlNS: string; // vmlNamespace.vmlNS

	constructor(vmlNS?: string) {
		this.vmlNS = vmlNS;
		console.info("constuctor()ing sliderGradient");
		if (isCanvasSupported()) {
			// Canvas implementation for modern browsers

			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');

			let drawFunc = function (width, height, color1, color2) {
				console.info(`in sliderGradient drawFunc(width=${width} ; height=${height} ; color1=${color1} ; color2=${color2} ; `);
				canvas.width = width;
				canvas.height = height;

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
				grad.addColorStop(0, color1);
				grad.addColorStop(1, color2);

				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			};

			console.info(`draw set to ${drawFunc}`);
			this.elm = canvas;
			this.draw = drawFunc;

		} else {
			// VML fallback for IE 7 and 8

			// this.initVML();

			let vmlContainer = document.createElement('div');
			vmlContainer.style.position = 'relative';
			vmlContainer.style.overflow = 'hidden';

			let grad = document.createElement(this.vmlNS + ':fill');
			(<any>grad).type = 'gradient';
			(<any>grad).method = 'linear';
			(<any>grad).angle = '180';

			let rect = document.createElement(this.vmlNS + ':rect');
			rect.style.position = 'absolute';
			rect.style.left = -1 + 'px';
			rect.style.top = -1 + 'px';
			(<any>rect).stroked = false;
			rect.appendChild(grad);
			vmlContainer.appendChild(rect);

			let drawFunc = function (width, height, color1, color2) {
				vmlContainer.style.width = width + 'px';
				vmlContainer.style.height = height + 'px';

				rect.style.width = (width + 1) + 'px';
				rect.style.height = (height + 1) + 'px';

				(<any>grad).color = color1;
				(<any>grad).color2 = color2;
			};

			this.elm = vmlContainer;
			this.draw = drawFunc;
		}
	}

}

class BoxShadow {

	hShadow: number;
	vShadow: number;
	blur: number;
	spread: number;
	color
	inset

	constructor(hShadow: number, vShadow: number, blur: number, spread: number, color, inset?) {
		this.hShadow = hShadow;
		this.vShadow = vShadow;
		this.blur = blur;
		this.spread = spread;
		this.color = color;
		this.inset = !!inset;
	};

	toString() {
		let vals = [
			Math.round(this.hShadow) + 'px',
			Math.round(this.vShadow) + 'px',
			Math.round(this.blur) + 'px',
			Math.round(this.spread) + 'px',
			this.color
		];
		if (this.inset) {
			vals.push('inset');
		}
		return vals.join(' ');
	};
}

class vmlNamespace {

	vmlNS: string = 'pjsvml'
	vmlCSS: string = 'pjsvmlcss'

	constructor() {
		// init VML namespace
		let doc = document;
		if (!(<any>doc).namespaces[this.vmlNS]) {
			(<any>doc).namespaces.add(this.vmlNS, 'urn:schemas-microsoft-com:vml');
		}
		if (!doc.styleSheets[this.vmlCSS]) {
			let tags = ['shape', 'shapetype', 'group', 'background', 'path', 'formulas', 'handles', 'fill', 'stroke', 'shadow', 'textbox', 'textpath', 'imagedata', 'line', 'polyline', 'curve', 'rect', 'roundrect', 'oval', 'arc', 'image'];
			let ss = (<any>doc).createStyleSheet();
			ss.owningElement.id = this.vmlCSS;
			for (let i = 0; i < tags.length; i += 1) {
				ss.addRule(this.vmlNS + '\\:' + tags[i], 'behavior:url(#default#VML);');
			}
		}
	}
}

type hsvT = [
	number | null,
	number | null,
	number | null
]
type rgbT = hsvT;

class colorPaletteOptions {
	//
	// Color Picker options
	//
	width             : number = 181; // width of color palette (in px)
	height            : number = 101; // height of color palette (in px)
	showOnClick       : boolean = true; // whether to display the color picker when user clicks on its target element
	mode              : string = 'HSV'; // HSV | HVS | HS | HV - layout of the color picker controls
	position          : string = 'bottom'; // left | right | top | bottom - position relative to the target element
	smartPosition     : boolean = true; // automatically change picker position when there is not enough space for it
	sliderSize        : number = 16; // px
	crossSize         : number = 8; // px
	closable          : boolean = false; // whether to display the Close button
	closeText         : string = 'Close';
	buttonColor       : string = '#000000'; // CSS color
	buttonHeight      : number = 18; // px
	padding           : number = 12; // px
	backgroundColor   : string = '#FFFFFF'; // CSS color
	borderWidth       : number = 1; // px
	borderColor       : string = '#BBBBBB'; // CSS color
	borderRadius      : number = 8; // px
	insetWidth        : number = 1; // px
	insetColor        : string = '#BBBBBB'; // CSS color
	sliderPtrSpace    : number = 3; // px
	shadow            : boolean = true; // whether to display shadow
	shadowBlur        : number = 15; // px
	shadowColor       : string = 'rgba(0,0,0,0.2)'; // CSS color
	pointerColor      : string = '#4C4C4C'; // px
	pointerBorderColor: string = '#FFFFFF'; // px
	pointerBorderWidth: number = 1; // px
	pointerThickness  : number = 2; // px
	zIndex            : number = 1000;
	container         : Element | null = null; // where to append the color picker (BODY element by default)
	// General options
	//
	value             : string = null; // initial HEX color. To change it later, use methods fromString(), fromHSV() and fromRGB()
	valueElement      : Partial<HTMLInputElement>; // element that will be used to display and input the color code
	styleElement      : styleElementExt; // element that will preview the picked color using CSS backgroundColor

	required          : boolean = true; // whether the associated text <input> can be left empty
	refine            : boolean = true; // whether to refine the entered color code (e.g. uppercase it and remove whitespace)
	hash              : boolean = false; // whether to prefix the HEX color code with # symbol
	uppercase         : boolean = true; // whether to uppercase the color code
	/**
	 * called instantly every time the color changes (value can be either a function or a string with javascript code)
	 * 
	 * @type {Function} will be given a `this` equal to the caller colorPalette
	 * @memberof colorPaletteOptions
	 */
	onFineChange      : Function;

	activeClass       : string = 'palette-active'; // class to be set to the target element when a picker window is open on it
	minS              : number = 0; // min allowed saturation (0 - 100)
	maxS              : number = 100; // max allowed saturation (0 - 100)
	minV              : number = 0; // min allowed value (brightness) (0 - 100)
	maxV              : number = 100; // max allowed value (brightness) (0 - 100)

	// By default, search for all elements with class="colorPalette" and install a color picker on them.
	// You can change what class name will be looked for by setting the option lookupClass
	// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
	lookupClass       : string | null = 'colorPalette';
	public static markedClass: string = "colorPalette";;
}

type eventGroup = {
	el: HTMLElement,
	ev: string,
	func: EventListener
}
interface GroupEvents {
	[GroupName: string]: eventGroup[] ;
}

export class colorPalette extends colorPaletteOptions {
	attachedGroupEvents: GroupEvents = {}

	picker: picker;

	pointerOrigin: { x: number, y: number } | null = null
	capturedTarget: EventTarget | null = null

	leaveValue: number = 1 << 0
	leaveStyle: number = 1 << 1
	leavePad: number = 1 << 2
	leaveSld: number = 1 << 3


	private linkedElementsProcessed: boolean;

	private vmlNamespace: vmlNamespace;
	private vmlReady: boolean = false

	fixed: boolean;
	targetElement: targetElementExt;

	//
	// Accessing the picked color
	//
	hsv: hsvT = [0, 0, 100]; // read-only  [0-360, 0-100, 0-100]
	rgb: rgbT = [255, 255, 255]; // read-only  [0-255, 0-255, 0-255]

	/**
	 * Usage:
	 * let myColor = new colorPalette(<targetElement> [, <options>])
	 * @param targetElement 
	 * @param options 
	 */
	constructor(targetElement: targetElementExt | string, options?: Partial<colorPaletteOptions>, register?: boolean) {
		super();

		if(register){
			this.attachDOMReadyEvent( () => {
				if (this.lookupClass) {
					installByClassName(this.lookupClass);
				}
			});
		}
		this.attachEvent(document, 'mousedown', this.onDocumentMousedown.bind(this));
		this.attachEvent(window, 'resize', this.onWindowResize.bind(this));
		this.attachDOMReadyEvent(() => { this.loadElements(targetElement, options); });

	}

	loadElements(targetElement: targetElementExt | string, options?: Partial<colorPaletteOptions>) {

		console.log("loadElements()");

		this.valueElement = targetElement; // element that will be used to display and input the color code
		this.styleElement = targetElement; // element that will preview the picked color using CSS backgroundColor

		// Find the target element
		if (typeof targetElement === "string") {
			let id = targetElement;
			let elm = document.getElementById(id);
			if (elm) {
				this.targetElement = <targetElementExt>elm;
				console.info("target element set ->" + elm.id);
			} else {
				console.warn('Could not find target element with ID \'' + id + '\'');
			}
		} else if (targetElement instanceof HTMLElement) {
			this.targetElement = <targetElementExt>targetElement;
		}

		if (<targetElementExt>targetElement) {
			if (this.targetElement.LinkedInstance) {
				console.warn('Cannot link palette twice to the same element. Skipping.');
				return;
			} else {
				this.targetElement.LinkedInstance = this;
			}
		} else {
			console.error(`Invalid target element: '${this.targetElement }' of type '${typeof this.targetElement } - INVALID, can not attach`);
			return;
		}

		// Find the value element
		this.valueElement = fetchElement(this.valueElement);
		// Find the style element
		this.styleElement = fetchElement(this.styleElement);

		for (let opt in options) {
			if (options.hasOwnProperty(opt)) {
				this[opt] = options[opt];
			}
		}
	}


	attachGroupEvent(groupName: string, el: HTMLElement, evnt: string, func: EventListener): void {
		console.group("attachGroupEvent()");
		if (!this.attachedGroupEvents[groupName]) {
			this.attachedGroupEvents[groupName] = new Array({ el: el, ev: evnt, func: func });
		} else {
			this.attachedGroupEvents[groupName].push({el: el, ev: evnt, func: func});
		}
		console.log("%O", this.attachedGroupEvents);
		console.log("%O", JSON.stringify(this.attachedGroupEvents));
		console.log(JSON.stringify(this.attachedGroupEvents));
		this.attachEvent(el, evnt, func);
		console.groupEnd();
	}


	detachGroupEvents(groupName: string): void {
		console.group("detachGroupEvents()");
		console.log(`ATTEMPT in detachGroupEvents SAFELY REMOVE GROUP EVENTS FOR ${groupName}`);
		if (this.attachedGroupEvents[groupName].length) {
			for (let i = 0; i < this.attachedGroupEvents[groupName].length; i ++) {
				let evt = this.attachedGroupEvents[groupName][i];
				this.detachEvent(evt.el, evt.ev, evt.func);
			}
			console.log(`SAFELY REMOVE GROUP !!! DELETE !!! EVENTS FOR ${groupName}`);
			delete this.attachedGroupEvents[groupName];
		}
		console.groupEnd();
	}


	captureTarget(target: EventTarget): void {
		// IE
		if ((<any>target).setCapture) {
			this.capturedTarget = target;
			(<any>this.capturedTarget).setCapture();
		}
	}


	releaseTarget(): void {
		// IE
		if (this.capturedTarget) {
			(<any>this.capturedTarget).releaseCapture();
			this.capturedTarget = null;
		}
	}


	fireEvent(el, evnt) {
		if (!el) {
			return;
		}
		if (document.createEvent) {
			let ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if ((<any>document).createEventObject) {
			let ev: Event = <Event>(<any>document).createEventObject();
			el.fireEvent('on' + evnt, ev);
		} else if (el['on' + evnt]) { // alternatively use the traditional event model
			el['on' + evnt]();
		}
	}


	static classNameToList(className: string): string[] {
		return className.replace(/^\s+|\s+$/g, '').split(/\s+/);
	}


	// The className parameter (str) can only contain a single class name
	hasClass(elm: Partial<HTMLElement>, className:string): boolean {
		if (!className) {
			return false;
		}
		return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
	}


	// The className parameter (str) can contain multiple class names separated by whitespace
	setClass(elm: Partial<HTMLElement>, className:string): void {
		let classList = (colorPalette).classNameToList(className);
		for (let i = 0; i < classList.length; i += 1) {
			if (!this.hasClass(elm, classList[i])) {
				elm.className += (elm.className ? ' ' : '') + classList[i];
			}
		}
	}


	// The className parameter (str) can contain multiple class names separated by whitespace
	unsetClass(elm: Partial<HTMLElement>, className:string): void {
		let classList = (colorPalette).classNameToList(className);
		for (let i = 0; i < classList.length; i += 1) {
			let repl = new RegExp(
				'^\\s*' + classList[i] + '\\s*|' +
				'\\s*' + classList[i] + '\\s*$|' +
				'\\s+' + classList[i] + '(\\s+)',
				'g'
			);
			elm.className = elm.className.replace(repl, '$1');
		}
	}


	getStyle(elm: Element): CSSStyleDeclaration {
		return window.getComputedStyle ? window.getComputedStyle(elm) : (<any>elm).currentStyle;
	}


	setStyle(elm: Partial<HTMLElement>, property: string, value: any): void {
		let helper = document.createElement('div');
		/**
		 * Returns the first property that is supported by the current browser
		 * @param names array of properties ; preferred property first
		 */
		let getSupportedProp = function (names: string[]) {
			for (let i = 0; i < names.length; i += 1) {
				if (names[i] in helper.style) {
					return names[i];
				}
			}
		};
		let props = {
			borderRadius: getSupportedProp(['borderRadius', 'MozBorderRadius', 'webkitBorderRadius']),
			boxShadow: getSupportedProp(['boxShadow', 'MozBoxShadow', 'webkitBoxShadow'])
		};
		switch ( property.toLowerCase() ) {
			case 'opacity':
				let alphaOpacity = Math.round(parseFloat(value) * 100);
				elm.style.opacity = value;
				elm.style.filter = 'alpha(opacity=' + alphaOpacity + ')';
				break;
			default:
				elm.style[props[property]] = value;
				break;
		}
	}


	setBorderRadius(elm, value): void {
		this.setStyle(elm, 'borderRadius', value || '0');
	}


	setBoxShadow(elm, value) {
		this.setStyle(elm, 'boxShadow', value || 'none');
	}


	getElementPos(e: HTMLElement, relativeToViewport?: boolean): [number, number] {
		let x = 0, y = 0;
		let rect = e.getBoundingClientRect();
		x = rect.left;
		y = rect.top;
		if (!relativeToViewport) {
			let viewPos = this.getViewPos();
			x += viewPos[0];
			y += viewPos[1];
		}
		return [x, y];
	}


	getElementSize(e) {
		return [e.offsetWidth, e.offsetHeight];
	}


	// get pointer's X/Y coordinates relative to viewport
	getAbsPointerPos(e) {
		if (!e) { e = window.event; }
		let x = 0, y = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			x = e.clientX;
			y = e.clientY;
		}
		return { x: x, y: y };
	}


	// get pointer's X/Y coordinates relative to target element
	getRelPointerPos(e) {
		if (!e) { e = window.event; }
		let target = e.target || e.srcElement;
		let targetRect = target.getBoundingClientRect();

		let x = 0, y = 0;

		let clientX = 0, clientY = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		x = clientX - targetRect.left;
		y = clientY - targetRect.top;
		return { x: x, y: y };
	}


	getViewPos() {
		let doc = document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	}


	getViewSize() {
		let doc = document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	}

	redrawPosition() {
		console.group('colorPalette.redrawPosition()');

		let tp, vp;

		if (this.fixed) {
			console.info("is fixed");
			// Fixed elements are positioned relative to viewport,
			// therefore we can ignore the scroll offset
			tp = this.getElementPos(this.targetElement, true); // target pos
			vp = [0,0];	                                       // view   pos
		} else {
			tp = this.getElementPos(this.targetElement);       // target pos
			vp = this.getViewPos();                            // view   pos
		}
		console.info("tp ( target position ) = %O", tp);
		console.info("vp ( view position )   = %O", vp);

		let ts = this.getElementSize(this.targetElement);      // target size
		let vs = this.getViewSize();                           // view   size
		let ps = this.getPickerOuterDims();                    // picker size


		console.info("ts ( target size ) = %O", ts);
		console.info("vs ( view   size ) = %O", vs);
		console.info("ps ( picker size ) = %O", ps);


		let a, b, c;
		switch (this.position.toLowerCase()) {
			case 'left' : a = 1 ; b =  0; c =  -1; break;
			case 'right': a = 1 ; b =  0; c =  1 ; break;
			case 'top'  : a = 0 ; b =  1; c =  -1; break;
			default     : a = 0 ; b =  1; c =  1 ; break;
		}
		let l = (ts[b] + ps[b]) / 2;
		let pp: number[];


		console.info("a (  ) = %O", a);
		console.info("b (  ) = %O", b);
		console.info("c (  ) = %O", c);

		// compute picker position
		if (!this.smartPosition) {
			console.info('colorPalette.redrawPosition() ; this.smartPosition = false');
			pp = [
				tp[a],
				tp[b] + ts[b] - l + l * c
			];
		} else {
			console.info('colorPalette.redrawPosition() ; this.smartPosition = true');
			pp = [
				// is the viewer smaller than target position + picker size
				-vp[a] + tp[a] + ps[a] > vs[a] ?
				// if yes - test if target position + half of target size is greater than half of viewport size AND 
					// target positon plus target size minus  picker size is greater than or equal to zero.
						// if yes set to target position plus target size minus picker size
						// if no set to viewsize minus picker size divided by two.
				// if no set to target position
					// was:
					// 	(-vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a]) :
					(-vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : ( vs[a] - ps[a] ) / 2 ) :
					tp[a],
				-vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ?
					(-vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c) :
					(tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c)
			];
		}

		let x = pp[a];
		let y = pp[b];
		let positionValue = this.fixed ? 'fixed' : 'absolute';
		let contractShadow =
			(pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) &&
			(pp[1] + ps[1] < tp[1] + ts[1]);

		this.drawPosition(x, y, positionValue, contractShadow);
		console.groupEnd();
	}


	drawPosition(x, y, positionValue, contractShadow) {
		console.info('colorPalette.drawPosition()');
		let vShadow = contractShadow ? 0 : this.shadowBlur; // px

		this.picker.wrap.style.position = positionValue;
		this.picker.wrap.style.left = x + 'px';
		this.picker.wrap.style.top = y + 'px';

		this.setBoxShadow(
			this.picker.boxS,
			this.shadow ?
				new BoxShadow(0, vShadow, this.shadowBlur, 0, this.shadowColor) :
				null);
	}


	getPickerDims() {
		let displaySlider = !!this.getSliderComponent();
		let dims = [
			2 * this.insetWidth + 2 * this.padding + this.width +
			(displaySlider ? 2 * this.insetWidth + this.getPadToSliderPadding() + this.sliderSize : 0),
			2 * this.insetWidth + 2 * this.padding + this.height +
			(this.closable ? 2 * this.insetWidth + this.padding + this.buttonHeight : 0)
		];
		return dims;
	}


	getPickerOuterDims() {
		let dims = this.getPickerDims();
		return [
			dims[0] + 2 * this.borderWidth,
			dims[1] + 2 * this.borderWidth
		];
	}


	getPadToSliderPadding() {
		return Math.max(this.padding, 1.5 * (2 * this.pointerBorderWidth + this.pointerThickness));
	}


	getPadYComponent() {
		switch (this.mode.charAt(1).toLowerCase()) {
			case 'v':
				return 'v';
		}
		return 's';
	}


	getSliderComponent() {
		if (this.mode.length > 2) {
			switch (this.mode.charAt(2).toLowerCase()) {
				case 's':
					return 's';
				case 'v':
					return 'v';
			}
		}
		console.error(`mode ${this.mode}is null, this should not occur`);
		return null;
	}


	onDocumentMousedown(e: Event) {
		if (!e) { e = window.event; }
		let target: controlElementExt | targetElementExt = <controlElementExt | targetElementExt>(e.target || e.srcElement);

		console.info(">-------------------new (testing) onDocumentMousedown-------------------<")

		console.info(e);

		if ((<any>target).LinkedInstance) { console.log("target has Linked Instance; is targetElementExt?") };
		if ((<any>target).EventsAttached) { console.log("target has EventsAttached; is targetElementExt?") };
		if ((<any>target).Instance) { console.log("target has Instance; is controlElementExt?") };
		if ((<any>target).ControlName) { console.log("target has ControlName; is controlElementExt?")};


		if ((<controlElementExt>target).ControlName) {
			console.log(`colorPalette.onDocumentMouseDown() ; testing->RESULT IS controlElementExt`);
			this.onControlPointerStart(e, target, (<controlElementExt>target).ControlName, 'mouse');
			
		} else {
			let testElement: targetElementExt = target;
			for (let i = 0; i < 3; i++) {
				console.log("trying with %s", (<any>testElement).nodeName);
				if ( testElement.LinkedInstance ) {
				console.log(`colorPalette.onDocumentMouseDown() ; is targetElementExt`);
					if (testElement.LinkedInstance.showOnClick) {
						console.info("colorPalette.onDocumentMouseDown() ; targetElementExt has showOneClick");
						testElement.LinkedInstance.show();
						console.log("displaying with %s",(<any>testElement).nodeName);
						return;
					}
				}
				testElement = (<any>e).path[i];
			}
			(colorPalette).hideAll();
		}
	}

	onControlTouchStart(e: Event) {
		if (!e) { e = window.event; }
		let target: controlElementExt | targetElementExt = <controlElementExt | targetElementExt>(e.target || e.srcElement);

		if ( isControlElementExt(target) ) {
			this.onControlPointerStart(e, target, target.ControlName, 'touch');
		}
	}


	onWindowResize(e: Event) {
		this.redrawPosition();
	}


	onParentScroll(e: Event) {
		// hide the picker when one of the parent elements is scrolled
		if (this.picker && this.picker.owner) {
			this.picker.owner.hide();
		}
	}

	preventDefault(e: Event) {
		if (e.preventDefault) { e.preventDefault(); }
		e.returnValue = false;
	}



	onControlPointerStart(e:Event, target:controlElementExt, controlName: string, pointerType: pointerType) {
		console.info('colorPalette.onControlPointerStart()');
		this.preventDefault(e);
		this.captureTarget(target);


		const pointerMoveEvent = {
			mouse: 'mousemove',
			touch: 'touchmove'
		}
		const pointerEndEvent = {
			mouse: 'mouseup',
			touch: 'touchend'
		}

		let registerDragEvents = (doc, offset) => {
			console.info(`controlName=${controlName}`)
			this.attachGroupEvent('drag', doc, pointerMoveEvent[pointerType], this.onDocumentPointerMove(e, target, controlName, pointerType, offset));
			// this.attachGroupEvent('drag', doc, pointerMoveEvent[pointerType], this.onDocumentPointerMove);
			this.attachGroupEvent('drag', doc, pointerEndEvent[pointerType],
				this.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(document, [0, 0]);

		if (window.parent && window.frameElement) {
			let rect = window.frameElement.getBoundingClientRect();
			let ofs = [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		let abs = this.getAbsPointerPos(e);
		let rel = this.getRelPointerPos(e);
		this.pointerOrigin = {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
			case 'pad':
				// if the slider is at the bottom, move it up
				switch (this.getSliderComponent()) {
					case 's': if (this.hsv[1] === 0) { this.fromHSV(null, 100, null); }; break;
					case 'v': if (this.hsv[2] === 0) { this.fromHSV(null, null, 100); }; break;
				}
				this.setPad(e, 0, 0);
				break;

			case 'sld':
				this.setSld(e, 0);
				break;
		}
		this.dispatchFineChange();
	}


	onDocumentPointerMove(e: Event, target: EventTarget, controlName: string, pointerType: pointerType, offset) {
		return (e) => {
			switch (controlName) {
				case 'pad':
					if (!e) { e = window.event; }
					this.setPad(e, offset[0], offset[1]);
					this.dispatchFineChange();
					break;

				case 'sld':
					if (!e) { e = window.event; }
					this.setSld(e, offset[1]);
					this.dispatchFineChange();
					break;
			}
		}
	}


	onDocumentPointerEnd(e: Event, target: EventTarget, controlName: string, pointerType: pointerType) {
		return (e) => {
			this.detachGroupEvents('drag');
			this.releaseTarget();
			// Always dispatch changes after detaching outstanding mouse handlers,
			// in case some user interaction will occur in user's onchange callback
			// that would intrude with current mouse events
			this.dispatchChange();
		};
	}


	dispatchChange(): void {
		if (this.valueElement) {
			if (this.valueElement instanceof HTMLInputElement) {
				this.fireEvent(this.valueElement, 'change');
			}
		}
	}


	dispatchFineChange(): void {
		if (this.onFineChange) {
			let callback;
			if (typeof this.onFineChange === 'string') {
				callback = new Function(this.onFineChange);
			} else {
				callback = this.onFineChange;
			}
			callback.call(this);
		}
	}


	setPad(this, e, ofsX, ofsY): void {
		let pointerAbs = this.getAbsPointerPos(e);
		let x = ofsX + pointerAbs.x - this.pointerOrigin.x - this.padding - this.insetWidth;
		let y = ofsY + pointerAbs.y - this.pointerOrigin.y - this.padding - this.insetWidth;

		let xVal = x * (360 / (this.width - 1));
		let yVal = 100 - (y * (100 / (this.height - 1)));

		switch (this.getPadYComponent()) {
			case 's': this.fromHSV(xVal, yVal, null, this.leaveSld); break;
			case 'v': this.fromHSV(xVal, null, yVal, this.leaveSld); break;
		}
	}


	setSld(e, ofsY): void {
		let pointerAbs = this.getAbsPointerPos(e);
		let y = ofsY + pointerAbs.y - this.pointerOrigin.y - this.padding - this.insetWidth;

		let yVal = 100 - (y * (100 / (this.height - 1)));

		switch (this.getSliderComponent()) {
			case 's': this.fromHSV(null, yVal, null, this.leavePad); break;
			case 'v': this.fromHSV(null, null, yVal, this.leavePad); break;
		}
	}


	public static hideAll() {
		console.log(`in event hideAll; querySelectorAll->'.${(colorPalette).markedClass}'`);
		let elements = document.querySelectorAll("." + (colorPalette).markedClass);
		console.log("in event- hideAll; elements->");
		for (let i = 0; i < elements.length; i++) {
			let e = elements[i];
			console.log(e);
			(<any>e).owner.hide();
		};
	}

	hide(): void {
		if (this.isPickerOwner()) {
			this.detachPicker();
		}
	};


	show(): void {
		this.drawPicker();
	};


	redraw(): void {
		if (this.isPickerOwner()) {
			this.drawPicker();
		}
	};


	importColor(): void {
		if (!this.valueElement) {
			this.exportColor();
		} else {
			if (this.valueElement instanceof HTMLInputElement) {
				if (!this.refine) {
					if (!this.fromString(this.valueElement.value, this.leaveValue)) {
						if (this.styleElement) {
							this.styleElement.style.backgroundImage = this.styleElement.OriginalStyle.backgroundImage;
							this.styleElement.style.backgroundColor = this.styleElement.OriginalStyle.backgroundColor;
							this.styleElement.style.color = this.styleElement.OriginalStyle.color;
						}
						this.exportColor(this.leaveValue | this.leaveStyle);
					}
				} else if (!this.required && /^\s*$/.test(this.valueElement.value)) {
					this.valueElement.value = '';
					if (this.styleElement) {
						this.styleElement.style.backgroundImage = this.styleElement.OriginalStyle.backgroundImage;
						this.styleElement.style.backgroundColor = this.styleElement.OriginalStyle.backgroundColor;
						this.styleElement.style.color = this.styleElement.OriginalStyle.color;
					}
					this.exportColor(this.leaveValue | this.leaveStyle);

				} else if (this.fromString(this.valueElement.value)) {
					// managed to import color successfully from the value -> OK, don't do anything
				} else {
					this.exportColor();
				}
			} else {
				// not an input element -> doesn't have any value
				this.exportColor();
			}
		}
	};


	exportColor(flags?): void {
		if (!(flags & this.leaveValue) && this.valueElement) {
			let value = this.toString();
			if (this.uppercase) { value = value.toUpperCase(); }
			if (this.hash) { value = '#' + value; }

			if (this.valueElement instanceof HTMLInputElement) {
				this.valueElement.value = value;
			} else {
				this.valueElement.innerHTML = value;
			}
		}
		if (!(flags & this.leaveStyle)) {
			if (this.styleElement) {
				this.styleElement.style.backgroundImage = 'none';
				this.styleElement.style.backgroundColor = '#' + this.toString();

				if (this.isLight()) {
					this.styleElement.style.color = '#000';
					this.unsetClass(this.styleElement, 'dark');
				} else {
					this.styleElement.style.color = '#FFF';
					this.setClass(this.styleElement, 'dark');
				}
			}
		}
		if (!(flags & this.leavePad) && this.isPickerOwner()) {
			this.redrawPad();
		}
		if (!(flags & this.leaveSld) && this.isPickerOwner()) {
			this.redrawSld();
		}
	};


	// h: 0-360
	// s: 0-100
	// v: 0-100
	//
	fromHSV(h: number | null, s: number | null, v: number | null, flags?): boolean { // null = don't change
		if (h !== null) {
			if (isNaN(h)) { return false; }
			h = Math.max(0, Math.min(360, h));
		}
		if (s !== null) {
			if (isNaN(s)) { return false; }
			s = Math.max(0, Math.min(100, this.maxS, s), this.minS);
		}
		if (v !== null) {
			if (isNaN(v)) { return false; }
			v = Math.max(0, Math.min(100, this.maxV, v), this.minV);
		}

		this.rgb = HSVtoRGB(
			h === null ? this.hsv[0] : (this.hsv[0] = h),
			s === null ? this.hsv[1] : (this.hsv[1] = s),
			v === null ? this.hsv[2] : (this.hsv[2] = v)
		);

		this.exportColor(flags);
	};


	// r: 0-255
	// g: 0-255
	// b: 0-255
	//
	fromRGB(r: number | null, g: number | null, b: number | null, flags?): boolean { // null = don't change
		if (r !== null) {
			if (isNaN(r)) { return false; }
			r = Math.max(0, Math.min(255, r));
		}
		if (g !== null) {
			if (isNaN(g)) { return false; }
			g = Math.max(0, Math.min(255, g));
		}
		if (b !== null) {
			if (isNaN(b)) { return false; }
			b = Math.max(0, Math.min(255, b));
		}

		let hsv = RGBtoHSV(
			r === null ? this.rgb[0] : r,
			g === null ? this.rgb[1] : g,
			b === null ? this.rgb[2] : b
		);
		if (hsv[0] !== null) {
			this.hsv[0] = Math.max(0, Math.min(360, hsv[0]));
		}
		if (hsv[2] !== 0) {
			this.hsv[1] = hsv[1] === null ? null : Math.max(0, this.minS, Math.min(100, this.maxS, hsv[1]));
		}
		this.hsv[2] = hsv[2] === null ? null : Math.max(0, this.minV, Math.min(100, this.maxV, hsv[2]));

		// update RGB according to final HSV, as some values might be trimmed
		let rgb = HSVtoRGB(this.hsv[0], this.hsv[1], this.hsv[2]);
		this.rgb[0] = rgb[0];
		this.rgb[1] = rgb[1];
		this.rgb[2] = rgb[2];

		this.exportColor(flags);
	};


	fromString(str: string, flags?) {
		let m;
		if (m = str.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) {
			// HEX notation
			//

			if (m[1].length === 6) {
				// 6-char notation
				this.fromRGB(
					parseInt(m[1].substr(0, 2), 16),
					parseInt(m[1].substr(2, 2), 16),
					parseInt(m[1].substr(4, 2), 16),
					flags
				);
			} else {
				// 3-char notation
				this.fromRGB(
					parseInt(m[1].charAt(0) + m[1].charAt(0), 16),
					parseInt(m[1].charAt(1) + m[1].charAt(1), 16),
					parseInt(m[1].charAt(2) + m[1].charAt(2), 16),
					flags
				);
			}
			return true;

		} else if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
			let params = m[1].split(',');
			let re = /^\s*(\d*)(\.\d+)?\s*$/;
			let mR, mG, mB;
			if (
				params.length >= 3 &&
				(mR = params[0].match(re)) &&
				(mG = params[1].match(re)) &&
				(mB = params[2].match(re))
			) {
				let r = parseFloat((mR[1] || '0') + (mR[2] || ''));
				let g = parseFloat((mG[1] || '0') + (mG[2] || ''));
				let b = parseFloat((mB[1] || '0') + (mB[2] || ''));
				this.fromRGB(r, g, b, flags);
				return true;
			}
		}
		return false;
	};


	toString(): string {
		return (
			(0x100 | Math.round(this.rgb[0])).toString(16).substr(1) +
			(0x100 | Math.round(this.rgb[1])).toString(16).substr(1) +
			(0x100 | Math.round(this.rgb[2])).toString(16).substr(1)
		);
	};


	toHEXString(): string {
		return '#' + this.toString().toUpperCase();
	};


	toRGBString(): string {
		return ('rgb(' +
			Math.round(this.rgb[0]) + ',' +
			Math.round(this.rgb[1]) + ',' +
			Math.round(this.rgb[2]) + ')'
		);
	};


	rgbObj(): string {
		let r = Math.round(this.rgb[0]);
		let g = Math.round(this.rgb[1]);
		let b = Math.round(this.rgb[2]);
		return (
			JSON.stringify(
				{
					'r': r,
					'g': g,
					'b': b
				}
			)
		);
	};


	isLight(): boolean {
		return (
			0.213 * this.rgb[0] +
			0.715 * this.rgb[1] +
			0.072 * this.rgb[2] >
			255 / 2
		);
	};


	processParentElementsInDOM():void {
		console.info("colorPalette.processParentElementsInDOM()");
		if (this.linkedElementsProcessed) { return; }
		console.info("colorPalette.linkedElementsProcessed=true");
		this.linkedElementsProcessed = true;

		let elm = this.targetElement;
		do {
			console.log("colorPalette.processParentElementsInDOM()");
			console.log(elm);
			// If the target element or one of its parent nodes has fixed position,
			// then use fixed positioning instead
			//
			// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
			// that's why we need to check if the returned style object is non-empty
			let currStyle = this.getStyle(elm);
			if (currStyle && currStyle.position.toLowerCase() === 'fixed') {
				this.fixed = true;
			}

			if (elm !== this.targetElement) {
				// Ensure to attach onParentScroll only once to each parent element
				// (multiple targetElements can share the same parent nodes)
				//
				// Note: It's not just offsetParents that can be scrollable,
				// that's why we loop through all parent nodes
				if (!elm.EventsAttached) {
					this.attachEvent(elm, 'scroll', this.onParentScroll.bind(this));
					elm.EventsAttached = true;
				}
			}
		} while ((elm = elm.parentElement) && !(elm instanceof HTMLBodyElement));
	};

	detachPicker():void {
		this.unsetClass(this.targetElement, this.activeClass);
		this.picker.wrap.parentNode.removeChild(this.picker.wrap);
		delete this.picker.owner;
	}


	drawPicker(): void {
		console.info("drawPicker()");

		// At this point, when drawing the picker, we know what the parent elements are
		// and we can do all related DOM operations, such as registering events on them
		// or checking their positioning
		this.processParentElementsInDOM();


		let container =
			this.container ?
				fetchElement(this.container) :
				document.getElementsByTagName('body')[0];

		// For BUTTON elements it's important to stop them from sending the form when clicked
		// (e.g. in Safari)
		if (this.targetElement instanceof HTMLButtonElement) {
			console.info('colorPalette.drawPicker() ; this.targetElement is of type HTMLButtonElement')
			if (this.targetElement.onclick) {
				let origCallback = this.targetElement.onclick;
				this.targetElement.onclick = function (evt) {
					origCallback.call(this, evt);
					return false;
				};
			} else {
				this.targetElement.onclick = function () { return false; };
			}
		}

		// valueElement
		if (this.valueElement) {
			if (this.valueElement instanceof HTMLInputElement) {
				console.info('colorPalette.drawPicker() ; this.valueElement is of type HTMLInputElement')
				let updateField = function () {
					this.fromString(this.valueElement.value, this.leaveValue);
					this.dispatchFineChange(this);
				};
				this.attachEvent(this.valueElement, 'keyup', updateField.bind(this));
				this.attachEvent(this.valueElement, 'input', updateField.bind(this));
				this.attachEvent(this.valueElement, 'blur', this.blurValue.bind(this));
				this.valueElement.setAttribute('autocomplete', 'off');
			}
		}

		// styleElement
		if (this.styleElement) {
			this.styleElement.OriginalStyle = {
				backgroundImage: this.styleElement.style.backgroundImage,
				backgroundColor: this.styleElement.style.backgroundColor,
				color: this.styleElement.style.color
			};
		}

		if (this.value) {
			// Try to set the color from the .value option and if unsuccessful,
			// export the current color
			this.fromString(this.value) || this.exportColor();
		} else {
			this.importColor();
		}

		if (!this.picker) {
			console.info("this.picker was not yet set ; creating this.picker");
			this.picker = {
				owner: null,
				wrap: document.createElement('div'),
				box: document.createElement('div'),
				boxS: document.createElement('div'), // shadow area
				boxB: document.createElement('div'), // border
				pad: document.createElement('div'),
				padB: document.createElement('div'), // border
				padM: document.createElement('div'), // mouse/touch area
				padPal: new paletteElementExt(),
				cross: document.createElement('div'),
				crossBY: document.createElement('div'), // border Y
				crossBX: document.createElement('div'), // border X
				crossLY: document.createElement('div'), // line Y
				crossLX: document.createElement('div'), // line X
				sld: document.createElement('div'),
				sldB: document.createElement('div'), // border
				sldM: document.createElement('div'), // mouse/touch area
				sldGrad: new sliderGradient(),
				sldPtrS: document.createElement('div'), // slider pointer spacer
				sldPtrIB: document.createElement('div'), // slider pointer inner border
				sldPtrMB: document.createElement('div'), // slider pointer middle border
				sldPtrOB: document.createElement('div'), // slider pointer outer border
				btn: document.createElement('div'),
				btnT: document.createElement('span') // text
			};

			this.picker.pad.appendChild(this.picker.padPal.elm);
			this.picker.padB.appendChild(this.picker.pad);
			this.picker.cross.appendChild(this.picker.crossBY);
			this.picker.cross.appendChild(this.picker.crossBX);
			this.picker.cross.appendChild(this.picker.crossLY);
			this.picker.cross.appendChild(this.picker.crossLX);
			this.picker.padB.appendChild(this.picker.cross);
			this.picker.box.appendChild(this.picker.padB);
			this.picker.box.appendChild(this.picker.padM);

			this.picker.sld.appendChild(this.picker.sldGrad.elm);
			this.picker.sldB.appendChild(this.picker.sld);
			this.picker.sldB.appendChild(this.picker.sldPtrOB);
			this.picker.sldPtrOB.appendChild(this.picker.sldPtrMB);
			this.picker.sldPtrMB.appendChild(this.picker.sldPtrIB);
			this.picker.sldPtrIB.appendChild(this.picker.sldPtrS);
			this.picker.box.appendChild(this.picker.sldB);
			this.picker.box.appendChild(this.picker.sldM);

			this.picker.btn.appendChild(this.picker.btnT);
			this.picker.box.appendChild(this.picker.btn);

			this.picker.boxB.appendChild(this.picker.box);
			this.picker.wrap.appendChild(this.picker.boxS);
			this.picker.wrap.appendChild(this.picker.boxB);
		}


		let displaySlider = !!this.getSliderComponent();
		let dims = this.getPickerDims();
		let crossOuterSize = (2 * this.pointerBorderWidth + this.pointerThickness + 2 * this.crossSize);
		let padToSliderPadding = this.getPadToSliderPadding();
		let borderRadius = Math.min(
			this.borderRadius,
			Math.round(this.padding * Math.PI)); // px
		let padCursor = 'crosshair';

		// wrap
		this.setClass(this.picker.wrap,(colorPalette).markedClass);
		(<any>this.picker.wrap).owner = this;
		this.picker.wrap.style.clear  = 'both';
		this.picker.wrap.style.width  = (dims[0] + 2 * this.borderWidth) + 'px';
		this.picker.wrap.style.height = (dims[1] + 2 * this.borderWidth) + 'px';
		this.picker.wrap.style.zIndex = String(this.zIndex);

		// picker
		this.picker.box.style.width     = dims[0] + 'px';
		this.picker.box.style.height    = dims[1] + 'px';

		this.picker.boxS.style.position = 'absolute';
		this.picker.boxS.style.left     = '0';
		this.picker.boxS.style.top      = '0';
		this.picker.boxS.style.width    = '100%';
		this.picker.boxS.style.height   = '100%';
		this.setBorderRadius(this.picker.boxS, borderRadius + 'px');

		// picker border
		this.picker.boxB.style.position = 'relative';
		this.picker.boxB.style.border = this.borderWidth + 'px solid';
		this.picker.boxB.style.borderColor = this.borderColor;
		this.picker.boxB.style.background = this.backgroundColor;
		this.setBorderRadius(this.picker.boxB, borderRadius + 'px');

		// IE hack:
		// If the element is transparent, IE will trigger the event on the elements under it,
		// e.g. on Canvas or on elements with border
		this.picker.padM.style.background =
			this.picker.sldM.style.background =
			'#FFF';
		this.setStyle(this.picker.padM, 'opacity', '0');
		this.setStyle(this.picker.sldM, 'opacity', '0');

		// pad
		this.picker.pad.style.position = 'relative';
		this.picker.pad.style.width    = this.width + 'px';
		this.picker.pad.style.height   = this.height + 'px';

		// pad palettes (HSV and HVS)
		this.picker.padPal.draw(this.width, this.height, this.getPadYComponent());

		// pad border
		this.picker.padB.style.position    = 'absolute';
		this.picker.padB.style.left        = this.padding + 'px';
		this.picker.padB.style.top         = this.padding + 'px';
		this.picker.padB.style.border      = this.insetWidth + 'px solid';
		this.picker.padB.style.borderColor = this.insetColor;

		// pad mouse area
		this.picker.padM.Instance = this;
		this.picker.padM.ControlName = 'pad';
		this.picker.padM.style.position = 'absolute';
		this.picker.padM.style.left = '0';
		this.picker.padM.style.top = '0';
		this.picker.padM.style.width = (this.padding + 2 * this.insetWidth + this.width + padToSliderPadding / 2) + 'px';
		this.picker.padM.style.height = dims[1] + 'px';
		this.picker.padM.style.cursor = padCursor;

		// pad cross
		this.picker.cross.style.position = 'absolute';
		this.picker.cross.style.left =
			this.picker.cross.style.top =
			'0';
		this.picker.cross.style.width =
			this.picker.cross.style.height =
			crossOuterSize + 'px';

		// pad cross border Y and X
		this.picker.crossBY.style.position =
			this.picker.crossBX.style.position =
			'absolute';
		this.picker.crossBY.style.background =
			this.picker.crossBX.style.background =
			this.pointerBorderColor;
		this.picker.crossBY.style.width =
			this.picker.crossBX.style.height =
			(2 * this.pointerBorderWidth + this.pointerThickness) + 'px';
		this.picker.crossBY.style.height =
			this.picker.crossBX.style.width =
			crossOuterSize + 'px';
		this.picker.crossBY.style.left =
			this.picker.crossBX.style.top =
			(Math.floor(crossOuterSize / 2) - Math.floor(this.pointerThickness / 2) - this.pointerBorderWidth) + 'px';
		this.picker.crossBY.style.top =
			this.picker.crossBX.style.left =
			'0';

		// pad cross line Y and X
		this.picker.crossLY.style.position =
			this.picker.crossLX.style.position =
			'absolute';
		this.picker.crossLY.style.background =
			this.picker.crossLX.style.background =
			this.pointerColor;
		this.picker.crossLY.style.height =
			this.picker.crossLX.style.width =
			(crossOuterSize - 2 * this.pointerBorderWidth) + 'px';
		this.picker.crossLY.style.width =
			this.picker.crossLX.style.height =
			this.pointerThickness + 'px';
		this.picker.crossLY.style.left =
			this.picker.crossLX.style.top =
			(Math.floor(crossOuterSize / 2) - Math.floor(this.pointerThickness / 2)) + 'px';
		this.picker.crossLY.style.top =
			this.picker.crossLX.style.left =
			this.pointerBorderWidth + 'px';

		// slider
		this.picker.sld.style.overflow = 'hidden';
		this.picker.sld.style.width    = this.sliderSize + 'px';
		this.picker.sld.style.height   = this.height + 'px';

		// slider gradient
		this.picker.sldGrad.draw(this.sliderSize, this.height, '#000', '#000');

		// slider border
		this.picker.sldB.style.display     = displaySlider ? 'block' : 'none';
		this.picker.sldB.style.position    = 'absolute';
		this.picker.sldB.style.right       = this.padding + 'px';
		this.picker.sldB.style.top         = this.padding + 'px';
		this.picker.sldB.style.border      = this.insetWidth + 'px solid';
		this.picker.sldB.style.borderColor = this.insetColor;

		// slider mouse area
		this.picker.sldM.Instance       = this;
		this.picker.sldM.ControlName    = 'sld';
		this.picker.sldM.style.display  = displaySlider ? 'block' : 'none';
		this.picker.sldM.style.position = 'absolute';
		this.picker.sldM.style.right    = '0';
		this.picker.sldM.style.top      = '0';
		this.picker.sldM.style.width    = (this.sliderSize + padToSliderPadding / 2 + this.padding + 2 * this.insetWidth) + 'px';
		this.picker.sldM.style.height   = dims[1] + 'px';
		this.picker.sldM.style.cursor   = 'default';

		// slider pointer inner and outer border
		this.picker.sldPtrIB.style.border =
			this.picker.sldPtrOB.style.border =
			this.pointerBorderWidth + 'px solid ' + this.pointerBorderColor;

		// slider pointer outer border
		this.picker.sldPtrOB.style.position = 'absolute';
		this.picker.sldPtrOB.style.left = -(2 * this.pointerBorderWidth + this.pointerThickness) + 'px';
		this.picker.sldPtrOB.style.top = '0';

		// slider pointer middle border
		this.picker.sldPtrMB.style.border = this.pointerThickness + 'px solid ' + this.pointerColor;

		// slider pointer spacer
		this.picker.sldPtrS.style.width = this.sliderSize + 'px';
		this.picker.sldPtrS.style.height = this.sliderPtrSpace + 'px';

		this.picker.btn.style.display = this.closable ? 'block' : 'none';
		this.picker.btn.style.position = 'absolute';
		this.picker.btn.style.left = this.padding + 'px';
		this.picker.btn.style.bottom = this.padding + 'px';
		this.picker.btn.style.padding = '0 15px';
		this.picker.btn.style.height = this.buttonHeight + 'px';
		this.picker.btn.style.border = this.insetWidth + 'px solid';

		// the Close button
		let insetColors         = this.insetColor.split(/\s+/);
		let outsetColor         = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
		this.picker.btn.style.borderColor = outsetColor;

		this.picker.btn.style.color       = this.buttonColor;
		this.picker.btn.style.font        = '12px sans-serif';
		this.picker.btn.style.textAlign   = 'center';
		try {
			this.picker.btn.style.cursor	= 'pointer';
		} catch (eOldIE) {
			this.picker.btn.style.cursor	= 'hand';
		}
		this.picker.btn.onmousedown 		= () => { this.hide(); };
		this.picker.btnT.style.lineHeight = this.buttonHeight + 'px';
		this.picker.btnT.innerHTML 		= '';
		this.picker.btnT.appendChild(document.createTextNode(this.closeText));

		// place pointers
		this.redrawPad();
		this.redrawSld();

		// If we are changing the owner without first closing the picker,
		// make sure to first deal with the old owner
		if (this.picker.owner && this.picker.owner !== this) {
			console.warn("This picker previously had an owner, and it WAS NOT THIS")
			this.unsetClass(this.picker.owner.targetElement, this.activeClass);
		}

		// Set the new picker owner
		this.picker.owner = this;

		// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
		// after setting the owner
		if (container instanceof HTMLBodyElement) {
			console.log('redrawPosition() is now set based upon Body');
			this.redrawPosition();
		} else {
			console.log('redrawPosition() is now set based upon relative.');
			this.drawPosition(0, 0, 'relative', false);
		}

		console.log(`parentnode(${this.picker.wrap.parentNode}) != container(${container})`);
		if (this.picker.wrap.parentNode != container) {
			console.info(`container.appendChild(${this.picker.wrap})`);
			container.appendChild(this.picker.wrap);
		}

		this.attachEvent(this.picker.wrap, 'touchstart', this.onControlTouchStart.bind(this));

		console.trace(`${this.targetElement} class to ${this.activeClass}`);
		this.setClass(this.targetElement, this.activeClass);
	}


	redrawPad(): void {
		let yComponent: number;
		let rgb, rgb1, rgb2: rgbT;
		let color1, color2: string;
		// redraw the pad pointer
		switch (this.getPadYComponent()) {
			case 's': yComponent = 1; break;
			case 'v': yComponent = 2; break;
		}
		let x = Math.round((this.hsv[0] / 360) * (this.width - 1));
		let y = Math.round((1 - this.hsv[yComponent] / 100) * (this.height - 1));
		let crossOuterSize = (2 * this.pointerBorderWidth + this.pointerThickness + 2 * this.crossSize);
		let ofs = -Math.floor(crossOuterSize / 2);
		this.picker.cross.style.left = (x + ofs) + 'px';
		this.picker.cross.style.top = (y + ofs) + 'px';

		// redraw the slider
		switch (this.getSliderComponent()) {
			case 's':
				console.info("redrawPad() called sliderComponent() ; return -> s");
				rgb1 = HSVtoRGB(this.hsv[0], 100, this.hsv[2]);
				rgb2 = HSVtoRGB(this.hsv[0], 0, this.hsv[2]);
				color1 = 'rgb(' +
					Math.round(rgb1[0]) + ',' +
					Math.round(rgb1[1]) + ',' +
					Math.round(rgb1[2]) + ')';
				color2 = 'rgb(' +
					Math.round(rgb2[0]) + ',' +
					Math.round(rgb2[1]) + ',' +
					Math.round(rgb2[2]) + ')';
				this.picker.sldGrad.draw(this.sliderSize, this.height, color1, color2);
				break;
			case 'v':
				console.info("redrawPad() called sliderComponent() ; return -> v");
				rgb = HSVtoRGB(this.hsv[0], this.hsv[1], 100);
				color1 = 'rgb(' +
					Math.round(rgb[0]) + ',' +
					Math.round(rgb[1]) + ',' +
					Math.round(rgb[2]) + ')';
				color2 = '#000';
				this.picker.sldGrad.draw(this.sliderSize, this.height, color1, color2);
				break;
		}
	}


	redrawSld():void {
		let yComponent: number;
		let sldComponent = this.getSliderComponent();
		if (sldComponent) {
			// redraw the slider pointer
			switch (sldComponent) {
				case 's':
					console.info("redrawSld() called sliderComponent() ; return -> s");
					yComponent = 1;
					break;
				case 'v':
					console.info("redrawSld() called sliderComponent() ; return -> v");
					yComponent = 2;
					break;
			}
			let y = Math.round((1 - this.hsv[yComponent] / 100) * (this.height - 1));
			this.picker.sldPtrOB.style.top = (y - (2 * this.pointerBorderWidth + this.pointerThickness) - Math.floor(this.sliderPtrSpace / 2)) + 'px';
		}
	}


	isPickerOwner(): boolean {
		return this.picker && this.picker.owner === this;
	}


	blurValue():void {
		this.importColor();
	}

	attachDOMReadyEvent(func): void {
		let fired = false;
		let fireOnce = function () {
			if (!fired) {
				fired = true;
				func();
			}
		};

		if (document.readyState === 'complete') {
			setTimeout(fireOnce.bind(this), 1); // async
			return;
		}

		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', fireOnce.bind(this), false);
			// Fallback
			window.addEventListener('load', fireOnce.bind(this), false);
		} else if ((<any>document).attachEvent) {
			/// START IE code ///
			(<any>document).attachEvent('onreadystatechange', function () {
				if (document.readyState === 'complete') {
					(<any>document).detachEvent('onreadystatechange', arguments.callee);
					fireOnce();
				}
			}.bind(this))
			// Fallback
			(<any>window).attachEvent('onload', fireOnce.bind(this));

			// IE7/8
			if ((<any>document).documentElement.doScroll && window == window.top) {
				let tryScroll = function () {
					if (!document.body) { return; }
					try {
						(<any>document).documentElement.doScroll('left');
						fireOnce();
					} catch (e) {
						setTimeout(tryScroll, 1);
					}
				};
				tryScroll();
			}
		} /// END IE code ///
	}

	/**
	 * Attaches Event to element pointing to func
	 * 
	 * @param {EventTarget} el 
	 * @param {string} evnt 
	 * @param {any} func 
	 * 
	 * @memberof colorPalette
	 */
	attachEvent(el: EventTarget, evnt: string, func: EventListener): void {
		if (el.addEventListener) {
			el.addEventListener(evnt, func, false);
			// console.group("attachEvent()");
			// console.log("element --> %O", el)
			// console.log("event ----> %O", evnt)
			// console.log("func -----> %O", func)
			// console.groupEnd();
		} else if ((<any>el).attachEvent) {
			// Use the non-standard attachEvent for old school IE
			(<any>el).attachEvent('on' + evnt, func);
		}
	}

	detachEvent(el: EventTarget, evnt: string, func: EventListener): void {
		if (el.removeEventListener) {
			el.removeEventListener(evnt, func, false);
			// console.group("detachEvent()");
			// console.log("element --> %O", el)
			// console.log("event ----> %O", evnt)
			// console.log("func -----> %O", func)
			// console.groupEnd();
		} else if ((<any>el).detachEvent) {
			/// this is for IE ///
			(<any>el).detachEvent('on' + evnt, func);
		}
	}

}



function installByClassName(className: string) {
	let inputElms = document.getElementsByTagName('input');
	let buttonElms = document.getElementsByTagName('button');

	tryInstallOnElements(inputElms, className);
	tryInstallOnElements(buttonElms, className);
};

/**
 * Installation of a palette will be performed onto the indicated elements (see parameters) - options can be specified using hte string colorPalette-options="{json string of options}" on the element;
 * @param elms install on these elements
 * @param className install on elements with this className
 */
function tryInstallOnElements(elms, className) {
	let matchClass = new RegExp('(^|\\s)(' + className + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

	for (let i = 0; i < elms.length; i += 1) {
		if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color') {
			if (isColorAttrSupported) {
				// skip inputs of type 'color' if supported by the browser
				continue;
			}
		}
		let m;
		if (!elms[i].colorPalette && elms[i].className && (m = elms[i].className.match(matchClass))) {
			let targetElm = elms[i];
			let optsStr = null;

			let dataOptions = getDataAttr(targetElm, 'colorPalette-options');
			if (dataOptions !== null) {
				optsStr = dataOptions;
			} else if (m[4]) {
				optsStr = m[4];
			}

			let opts;
			if (optsStr) {
				try {
					opts = (new Function('return (' + optsStr + ')'))();
				} catch (eParseError) {
					console.warn('Error parsing colorPalette options: ' + eParseError + ':\n' + optsStr);
				}
			}
			targetElm.colorPalette = new colorPalette(targetElm, opts);
		}
	}
}


function isColorAttrSupported() {
	let elm = document.createElement('input');
	if (elm.setAttribute) {
		elm.setAttribute('type', 'color');
		if (elm.type.toLowerCase() == 'color') {
			return true;
		}
	}
	return false;
}


function isCanvasSupported() {
	let elm = document.createElement('canvas');
	return !!(elm.getContext && elm.getContext('2d'));
}


function fetchElement(mixed) {
	return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
}


function getDataAttr(el, name) {
	let attrName = 'data-' + name;
	let attrValue = el.getAttribute(attrName);
	if (attrValue !== null) {
		return attrValue;
	}
	return null;
}


// r: 0-255
// g: 0-255
// b: 0-255
//
// returns: [ 0-360, 0-100, 0-100 ]
//
function RGBtoHSV(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	let n = Math.min(Math.min(r, g), b);
	let v = Math.max(Math.max(r, g), b);
	let m = v - n;
	if (m === 0) { return [null, 0, 100 * v]; }
	let h = r === n ? 3 + (b - g) / m : (g === n ? 5 + (r - b) / m : 1 + (g - r) / m);
	return [
		60 * (h === 6 ? 0 : h),
		100 * (m / v),
		100 * v
	];
}


// h: 0-360
// s: 0-100
// v: 0-100
//
// returns: [ 0-255, 0-255, 0-255 ]
//
function HSVtoRGB(h, s, v): hsvT {
	let u = 255 * (v / 100);

	if (h === null) {
		return [u, u, u];
	}

	h /= 60;
	s /= 100;

	let i = Math.floor(h);
	let f = i % 2 ? h - i : 1 - (h - i);
	let m = u * (1 - s);
	let n = u * (1 - s * f);
	switch (i) {
		case 6:
		case 0: return [u, n, m];
		case 1: return [n, u, m];
		case 2: return [m, u, n];
		case 3: return [m, n, u];
		case 4: return [n, m, u];
		case 5: return [u, m, n];
	}
}
