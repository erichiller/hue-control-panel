/**
 * PaletteJS - JavaScript Color Palette
 * @author Sean Oberoi
 *
**/


class colorPalette {

	_attachedGroupEvents: {}

	picker: HTMLElement;

	_pointerMoveEvent: {
		mouse: string = 'mousemove',
		touch: string = 'touchmove'
	}
	_pointerEndEvent: {
		mouse: string = 'mouseup',
		touch: string = 'touchend'
	}


	_pointerOrigin: Element | null = null
	_capturedTarget: EventTarget | null = null



	_vmlNS: string = 'pjs_vml_'
	_vmlCSS: string = 'pjs_vml_css_'
	_vmlReady: boolean = false



	leaveValue: number = 1 << 0
	leaveStyle: number = 1 << 1
	leavePad: number = 1 << 2
	leaveSld: number = 1 << 3



	// General options
	//
	value             = null; // initial HEX color. To change it later, use methods fromString(), fromHSV() and fromRGB()
	valueElement      : Element; // element that will be used to display and input the color code
	styleElement      : Element; // element that will preview the picked color using CSS backgroundColor
	required          : boolean = true; // whether the associated text <input> can be left empty
	refine            : boolean = true; // whether to refine the entered color code (e.g. uppercase it and remove whitespace)
	hash              : boolean = false; // whether to prefix the HEX color code with # symbol
	uppercase         : boolean = true; // whether to uppercase the color code
	onFineChange      = null; // called instantly every time the color changes (value can be either a function or a string with javascript code)
	activeClass       : string = 'palettejs-active'; // class to be set to the target element when a picker window is open on it
	minS              : number = 0; // min allowed saturation (0 - 100)
	maxS              : number = 100; // max allowed saturation (0 - 100)
	minV              : number = 0; // min allowed value (brightness) (0 - 100)
	maxV              : number = 100; // max allowed value (brightness) (0 - 100)

	// Accessing the picked color
	//
	hsv               = [0, 0, 100]; // read-only  [0-360, 0-100, 0-100]
	rgb               = [255, 255, 255]; // read-only  [0-255, 0-255, 0-255]

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
	shadow            : boolean = true; // whether to display shadow
	shadowBlur        : number = 15; // px
	shadowColor       : string = 'rgba(0,0,0,0.2)'; // CSS color
	pointerColor      : string = '#4C4C4C'; // px
	pointerBorderColor: string = '#FFFFFF'; // px
	pointerBorderWidth: number = 1; // px
	pointerThickness  : number = 2; // px
	zIndex            : number = 1000;
	container: Element | null = null; // where to append the color picker (BODY element by default)

	// By default, search for all elements with class="palettejs" and install a color picker on them.
	//
	// You can change what class name will be looked for by setting the property palettejs.lookupClass
	// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
	//
	lookupClass: string = 'palettejs';


	register() {
		this.attachDOMReadyEvent(this.init());
		this.attachEvent(document, 'mousedown', this.onDocumentMouseDown);
		this.attachEvent(window, 'resize', this.onWindowResize);
	}


	init() {
		if (this.lookupClass) {
			this.installByClassName(this.lookupClass);
		}
	}

	installByClassName(className: string) {
		var inputElms = document.getElementsByTagName('input');
		var buttonElms = document.getElementsByTagName('button');

		this.tryInstallOnElements(inputElms, className);
		this.tryInstallOnElements(buttonElms, className);
	};


	tryInstallOnElements(elms, className) {
		var matchClass = new RegExp('(^|\\s)(' + className + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

		for (var i = 0; i < elms.length; i += 1) {
			if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color') {
				if (this.isColorAttrSupported) {
					// skip inputs of type 'color' if supported by the browser
					continue;
				}
			}
			var m;
			if (!elms[i].palettejs && elms[i].className && (m = elms[i].className.match(matchClass))) {
				var targetElm = elms[i];
				var optsStr = null;

				var dataOptions = this.getDataAttr(targetElm, 'palettejs');
				if (dataOptions !== null) {
					optsStr = dataOptions;
				} else if (m[4]) {
					optsStr = m[4];
				}

				var opts = {};
				if (optsStr) {
					try {
						opts = (new Function('return (' + optsStr + ')'))();
					} catch (eParseError) {
						this.warn('Error parsing palettejs options: ' + eParseError + ':\n' + optsStr);
					}
				}
				targetElm.palettejs = new colorPalette(targetElm, opts);
			}
		}
	}


	isColorAttrSupported() {
		var elm = document.createElement('input');
		if (elm.setAttribute) {
			elm.setAttribute('type', 'color');
			if (elm.type.toLowerCase() == 'color') {
				return true;
			}
		}
		return false;
	}


	isCanvasSupported() {
		var elm = document.createElement('canvas');
		return !!(elm.getContext && elm.getContext('2d'));
	}


	fetchElement(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	}


	isElementType(elm, type) {
		return elm.nodeName.toLowerCase() === type.toLowerCase();
	}


	getDataAttr(el, name) {
		var attrName = 'data-' + name;
		var attrValue = el.getAttribute(attrName);
		if (attrValue !== null) {
			return attrValue;
		}
		return null;
	}


	attachEvent(el, evnt, func) {
		if (el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + evnt, func);
		}
	}


	detachEvent(el, evnt, func) {
		if (el.removeEventListener) {
			el.removeEventListener(evnt, func, false);
		} else if (el.detachEvent) {
			el.detachEvent('on' + evnt, func);
		}
	}



	attachGroupEvent(groupName, el, evnt, func) {
		if (!this._attachedGroupEvents.hasOwnProperty(groupName)) {
			this._attachedGroupEvents[groupName] = [];
		}
		this._attachedGroupEvents[groupName].push([el, evnt, func]);
		this.attachEvent(el, evnt, func);
	}


	detachGroupEvents(groupName) {
		if (this._attachedGroupEvents.hasOwnProperty(groupName)) {
			for (var i = 0; i < this._attachedGroupEvents[groupName].length; i += 1) {
				var evt = this._attachedGroupEvents[groupName][i];
				this.detachEvent(evt[0], evt[1], evt[2]);
			}
			delete this._attachedGroupEvents[groupName];
		}
	}


	attachDOMReadyEvent(func) {
		var fired = false;
		var fireOnce = function () {
			if (!fired) {
				fired = true;
				func();
			}
		};

		if (document.readyState === 'complete') {
			setTimeout(fireOnce, 1); // async
			return;
		}

		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', fireOnce, false);

			// Fallback
			window.addEventListener('load', fireOnce, false);

		} else if ((<any>document).attachEvent) {
			// IE
			(<any>document).attachEvent('onreadystatechange', function () {
				if (document.readyState === 'complete') {
					(<any>document).detachEvent('onreadystatechange', arguments.callee);
					fireOnce();
				}
			})

			// Fallback
				(<any>window).attachEvent('onload', fireOnce);

			// IE7/8
			if ((<any>document).documentElement.doScroll && window == window.top) {
				var tryScroll = function () {
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
		}
	}


	warn(msg) {
		if (window.console && window.console.warn) {
			window.console.warn(msg);
		}
	}


	preventDefault(e) {
		if (e.preventDefault) { e.preventDefault(); }
		e.returnValue = false;
	}


	captureTarget(target) {
		// IE
		if ((<any>target).setCapture) {
			this._capturedTarget = target;
			(<any>this._capturedTarget).setCapture();
		}
	}


	releaseTarget() {
		// IE
		if (this._capturedTarget) {
			(<any>this._capturedTarget).releaseCapture();
			this._capturedTarget = null;
		}
	}


	fireEvent(el, evnt) {
		if (!el) {
			return;
		}
		if (document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if ((<any>document).createEventObject) {
			var ev:Event = <Event>(<any>document).createEventObject();
			el.fireEvent('on' + evnt, ev);
		} else if (el['on' + evnt]) { // alternatively use the traditional event model
			el['on' + evnt]();
		}
	}


	classNameToList(className) {
		return className.replace(/^\s+|\s+$/g, '').split(/\s+/);
	}


	// The className parameter (str) can only contain a single class name
	hasClass(elm, className) {
		if (!className) {
			return false;
		}
		return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
	}


	// The className parameter (str) can contain multiple class names separated by whitespace
	setClass(elm, className) {
		var classList = this.classNameToList(className);
		for (var i = 0; i < classList.length; i += 1) {
			if (!this.hasClass(elm, classList[i])) {
				elm.className += (elm.className ? ' ' : '') + classList[i];
			}
		}
	}


	// The className parameter (str) can contain multiple class names separated by whitespace
	unsetClass(elm, className) {
		var classList = this.classNameToList(className);
		for (var i = 0; i < classList.length; i += 1) {
			var repl = new RegExp(
				'^\\s*' + classList[i] + '\\s*|' +
				'\\s*' + classList[i] + '\\s*$|' +
				'\\s+' + classList[i] + '(\\s+)',
				'g'
			);
			elm.className = elm.className.replace(repl, '$1');
		}
	}


	getStyle(elm) {
		return window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;
	}


	setStyle(elm: Element, property: string, value: any) {
		var helper = document.createElement('div');
		var getSupportedProp = function (names) {
			for (var i = 0; i < names.length; i += 1) {
				if (names[i] in helper.style) {
					return names[i];
				}
			}
		};
		var props = {
			borderRadius: getSupportedProp(['borderRadius', 'MozBorderRadius', 'webkitBorderRadius']),
			boxShadow: getSupportedProp(['boxShadow', 'MozBoxShadow', 'webkitBoxShadow'])
		};
		return function (elm, prop, value) {
			switch (prop.toLowerCase()) {
				case 'opacity':
					var alphaOpacity = Math.round(parseFloat(value) * 100);
					elm.style.opacity = value;
					elm.style.filter = 'alpha(opacity=' + alphaOpacity + ')';
					break;
				default:
					elm.style[props[prop]] = value;
					break;
			}
		};
	}


	setBorderRadius(elm, value) {
		this.setStyle(elm, 'borderRadius', value || '0');
	}


	setBoxShadow(elm, value) {
		this.setStyle(elm, 'boxShadow', value || 'none');
	}


	getElementPos(e, relativeToViewport) {
		var x = 0, y = 0;
		var rect = e.getBoundingClientRect();
		x = rect.left;
		y = rect.top;
		if (!relativeToViewport) {
			var viewPos = this.getViewPos();
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
		var x = 0, y = 0;
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
		var target = e.target || e.srcElement;
		var targetRect = target.getBoundingClientRect();

		var x = 0, y = 0;

		var clientX = 0, clientY = 0;
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
		var doc = document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	}


	getViewSize() {
		var doc = document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	}


	redrawPosition() {

		if (this.picker && this.picker.owner) {
			var thisObj = this.picker.owner;

			var tp, vp;

			if (thisObj.fixed) {
				// Fixed elements are positioned relative to viewport,
				// therefore we can ignore the scroll offset
				tp = this.getElementPos(thisObj.targetElement, true); // target pos
				vp = [0, 0]; // view pos
			} else {
				tp = this.getElementPos(thisObj.targetElement); // target pos
				vp = this.getViewPos(); // view pos
			}

			var ts = this.getElementSize(thisObj.targetElement); // target size
			var vs = this.getViewSize(); // view size
			var ps = this.getPickerOuterDims(thisObj); // picker size
			var a, b, c;
			switch (thisObj.position.toLowerCase()) {
				case 'left': a = 1; b = 0; c = -1; break;
				case 'right': a = 1; b = 0; c = 1; break;
				case 'top': a = 0; b = 1; c = -1; break;
				default: a = 0; b = 1; c = 1; break;
			}
			var l = (ts[b] + ps[b]) / 2;

			// compute picker position
			if (!thisObj.smartPosition) {
				var pp = [
					tp[a],
					tp[b] + ts[b] - l + l * c
				];
			} else {
				var pp = [
					-vp[a] + tp[a] + ps[a] > vs[a] ?
						(-vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a]) :
						tp[a],
					-vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ?
						(-vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c) :
						(tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c)
				];
			}

			var x = pp[a];
			var y = pp[b];
			var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
			var contractShadow =
				(pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) &&
				(pp[1] + ps[1] < tp[1] + ts[1]);

			this._drawPosition(thisObj, x, y, positionValue, contractShadow);
		}
	}


	_drawPosition(thisObj, x, y, positionValue, contractShadow) {
		var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

		this.picker.wrap.style.position = positionValue;
		this.picker.wrap.style.left = x + 'px';
		this.picker.wrap.style.top = y + 'px';

		this.setBoxShadow(
			this.picker.boxS,
			thisObj.shadow ?
				new this.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) :
				null);
	}


	getPickerDims(thisObj) {
		var displaySlider = !!this.getSliderComponent(thisObj);
		var dims = [
			2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.width +
			(displaySlider ? 2 * thisObj.insetWidth + this.getPadToSliderPadding(thisObj) + thisObj.sliderSize : 0),
			2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.height +
			(thisObj.closable ? 2 * thisObj.insetWidth + thisObj.padding + thisObj.buttonHeight : 0)
		];
		return dims;
	}


	getPickerOuterDims(thisObj) {
		var dims = this.getPickerDims(thisObj);
		return [
			dims[0] + 2 * thisObj.borderWidth,
			dims[1] + 2 * thisObj.borderWidth
		];
	}


	getPadToSliderPadding(thisObj) {
		return Math.max(thisObj.padding, 1.5 * (2 * thisObj.pointerBorderWidth + thisObj.pointerThickness));
	}


	getPadYComponent(thisObj) {
		switch (thisObj.mode.charAt(1).toLowerCase()) {
			case 'v':
				return 'v';
		}
		return 's';
	}


	getSliderComponent(thisObj) {
		if (thisObj.mode.length > 2) {
			switch (thisObj.mode.charAt(2).toLowerCase()) {
				case 's':
					return 's';
				case 'v':
					return 'v';
			}
		}
		return null;
	}


	onDocumentMouseDown(e) {
		if (!e) { e = window.event; }
		var target = e.target || e.srcElement;

		if (target._pjsLinkedInstance) {
			if (target._pjsLinkedInstance.showOnClick) {
				target._pjsLinkedInstance.show();
			}
		} else if (target._pjsControlName) {
			this.onControlPointerStart(e, target, target._pjsControlName, 'mouse');
		} else {
			// Mouse is outside the picker controls -> hide the color picker!
			if (this.picker && this.picker.owner) {
				this.picker.owner.hide();
			}
		}
	}


	onControlTouchStart(e) {
		if (!e) { e = window.event; }
		var target = e.target || e.srcElement;

		if (target._pjsControlName) {
			this.onControlPointerStart(e, target, target._pjsControlName, 'touch');
		}
	}


	onWindowResize(e) {
		this.redrawPosition();
	}


	onParentScroll(e) {
		// hide the picker when one of the parent elements is scrolled
		if (this.picker && this.picker.owner) {
			this.picker.owner.hide();
		}
	}



	onControlPointerStart(e, target, controlName, pointerType) {
		var thisObj = target._pjsInstance;

		this.preventDefault(e);
		this.captureTarget(target);

		var registerDragEvents = function (doc, offset) {
			this.attachGroupEvent('drag', doc, this._pointerMoveEvent[pointerType],
				this.onDocumentPointerMove(e, target, controlName, pointerType, offset));
			this.attachGroupEvent('drag', doc, this._pointerEndEvent[pointerType],
				this.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(document, [0, 0]);

		if (window.parent && window.frameElement) {
			var rect = window.frameElement.getBoundingClientRect();
			var ofs = [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		var abs = this.getAbsPointerPos(e);
		var rel = this.getRelPointerPos(e);
		this._pointerOrigin = {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
			case 'pad':
				// if the slider is at the bottom, move it up
				switch (this.getSliderComponent(thisObj)) {
					case 's': if (thisObj.hsv[1] === 0) { thisObj.fromHSV(null, 100, null); }; break;
					case 'v': if (thisObj.hsv[2] === 0) { thisObj.fromHSV(null, null, 100); }; break;
				}
				this.setPad(thisObj, e, 0, 0);
				break;

			case 'sld':
				this.setSld(thisObj, e, 0);
				break;
		}

		this.dispatchFineChange(thisObj);
	}


	onDocumentPointerMove(e, target, controlName, pointerType, offset) {
		return function (e) {
			var thisObj = target._pjsInstance;
			switch (controlName) {
				case 'pad':
					if (!e) { e = window.event; }
					this.setPad(thisObj, e, offset[0], offset[1]);
					this.dispatchFineChange(thisObj);
					break;

				case 'sld':
					if (!e) { e = window.event; }
					this.setSld(thisObj, e, offset[1]);
					this.dispatchFineChange(thisObj);
					break;
			}
		}
	}


	onDocumentPointerEnd(e, target, controlName, pointerType) {
		return function (e) {
			var thisObj = target._pjsInstance;
			this.detachGroupEvents('drag');
			this.releaseTarget();
			// Always dispatch changes after detaching outstanding mouse handlers,
			// in case some user interaction will occur in user's onchange callback
			// that would intrude with current mouse events
			this.dispatchChange(thisObj);
		};
	}


	dispatchChange(thisObj) {
		if (thisObj.valueElement) {
			if (this.isElementType(thisObj.valueElement, 'input')) {
				this.fireEvent(thisObj.valueElement, 'change');
			}
		}
	}


	dispatchFineChange(thisObj) {
		if (thisObj.onFineChange) {
			var callback;
			if (typeof thisObj.onFineChange === 'string') {
				callback = new Function(thisObj.onFineChange);
			} else {
				callback = thisObj.onFineChange;
			}
			callback.call(thisObj);
		}
	}


	setPad(thisObj, e, ofsX, ofsY) {
		var pointerAbs = this.getAbsPointerPos(e);
		var x = ofsX + pointerAbs.x - this._pointerOrigin.x - thisObj.padding - thisObj.insetWidth;
		var y = ofsY + pointerAbs.y - this._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

		var xVal = x * (360 / (thisObj.width - 1));
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (this.getPadYComponent(thisObj)) {
			case 's': thisObj.fromHSV(xVal, yVal, null, this.leaveSld); break;
			case 'v': thisObj.fromHSV(xVal, null, yVal, this.leaveSld); break;
		}
	}


	setSld(thisObj, e, ofsY) {
		var pointerAbs = this.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - this._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (this.getSliderComponent(thisObj)) {
			case 's': thisObj.fromHSV(null, yVal, null, this.leavePad); break;
			case 'v': thisObj.fromHSV(null, null, yVal, this.leavePad); break;
		}
	}




	initVML() {
		if (!this._vmlReady) {
			// init VML namespace
			var doc = document;
			if (!doc.namespaces[this._vmlNS]) {
				doc.namespaces.add(this._vmlNS, 'urn:schemas-microsoft-com:vml');
			}
			if (!doc.styleSheets[this._vmlCSS]) {
				var tags = ['shape', 'shapetype', 'group', 'background', 'path', 'formulas', 'handles', 'fill', 'stroke', 'shadow', 'textbox', 'textpath', 'imagedata', 'line', 'polyline', 'curve', 'rect', 'roundrect', 'oval', 'arc', 'image'];
				var ss = doc.createStyleSheet();
				ss.owningElement.id = this._vmlCSS;
				for (var i = 0; i < tags.length; i += 1) {
					ss.addRule(this._vmlNS + '\\:' + tags[i], 'behavior:url(#default#VML);');
				}
			}
			this._vmlReady = true;
		}
	}


	createPalette() {

		var paletteObj = {
			elm: null,
			draw: null
		};

		if (this.isCanvasSupported) {
			// Canvas implementation for modern browsers

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			var drawFunc = function (width, height, type) {
				canvas.width = width;
				canvas.height = height;

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
				hGrad.addColorStop(0 / 6, '#F00');
				hGrad.addColorStop(1 / 6, '#FF0');
				hGrad.addColorStop(2 / 6, '#0F0');
				hGrad.addColorStop(3 / 6, '#0FF');
				hGrad.addColorStop(4 / 6, '#00F');
				hGrad.addColorStop(5 / 6, '#F0F');
				hGrad.addColorStop(6 / 6, '#F00');

				ctx.fillStyle = hGrad;
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
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
				ctx.fillStyle = vGrad;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			};

			paletteObj.elm = canvas;
			paletteObj.draw = drawFunc;

		} else {
			// VML fallback for IE 7 and 8

			this.initVML();

			var vmlContainer = document.createElement('div');
			vmlContainer.style.position = 'relative';
			vmlContainer.style.overflow = 'hidden';

			var hGrad = document.createElement(this._vmlNS + ':fill');
			hGrad.type = 'gradient';
			hGrad.method = 'linear';
			hGrad.angle = '90';
			hGrad.colors = '16.67% #F0F, 33.33% #00F, 50% #0FF, 66.67% #0F0, 83.33% #FF0'

			var hRect = document.createElement(this._vmlNS + ':rect');
			hRect.style.position = 'absolute';
			hRect.style.left = -1 + 'px';
			hRect.style.top = -1 + 'px';
			hRect.stroked = false;
			hRect.appendChild(hGrad);
			vmlContainer.appendChild(hRect);

			var vGrad = document.createElement(this._vmlNS + ':fill');
			vGrad.type = 'gradient';
			vGrad.method = 'linear';
			vGrad.angle = '180';
			vGrad.opacity = '0';

			var vRect = document.createElement(this._vmlNS + ':rect');
			vRect.style.position = 'absolute';
			vRect.style.left = -1 + 'px';
			vRect.style.top = -1 + 'px';
			vRect.stroked = false;
			vRect.appendChild(vGrad);
			vmlContainer.appendChild(vRect);

			var drawFunc = function (width, height, type) {
				vmlContainer.style.width = width + 'px';
				vmlContainer.style.height = height + 'px';

				hRect.style.width =
					vRect.style.width =
					(width + 1) + 'px';
				hRect.style.height =
					vRect.style.height =
					(height + 1) + 'px';

				// Colors must be specified during every redraw, otherwise IE won't display
				// a full gradient during a subsequential redraw
				hGrad.color = '#F00';
				hGrad.color2 = '#F00';

				switch (type.toLowerCase()) {
					case 's':
						vGrad.color = vGrad.color2 = '#FFF';
						break;
					case 'v':
						vGrad.color = vGrad.color2 = '#000';
						break;
				}
			};

			paletteObj.elm = vmlContainer;
			paletteObj.draw = drawFunc;
		}

		return paletteObj;
	}


	createSliderGradient() {

		var sliderObj = {
			elm: null,
			draw: null
		};

		if (this.isCanvasSupported) {
			// Canvas implementation for modern browsers

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			var drawFunc = function (width, height, color1, color2) {
				canvas.width = width;
				canvas.height = height;

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
				grad.addColorStop(0, color1);
				grad.addColorStop(1, color2);

				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			};

			sliderObj.elm = canvas;
			sliderObj.draw = drawFunc;

		} else {
			// VML fallback for IE 7 and 8

			this.initVML();

			var vmlContainer = document.createElement('div');
			vmlContainer.style.position = 'relative';
			vmlContainer.style.overflow = 'hidden';

			var grad = document.createElement(this._vmlNS + ':fill');
			grad.type = 'gradient';
			grad.method = 'linear';
			grad.angle = '180';

			var rect = document.createElement(this._vmlNS + ':rect');
			rect.style.position = 'absolute';
			rect.style.left = -1 + 'px';
			rect.style.top = -1 + 'px';
			rect.stroked = false;
			rect.appendChild(grad);
			vmlContainer.appendChild(rect);

			var drawFunc = function (width, height, color1, color2) {
				vmlContainer.style.width = width + 'px';
				vmlContainer.style.height = height + 'px';

				rect.style.width = (width + 1) + 'px';
				rect.style.height = (height + 1) + 'px';

				grad.color = color1;
				grad.color2 = color2;
			};

			sliderObj.elm = vmlContainer;
			sliderObj.draw = drawFunc;
		}

		return sliderObj;
	}




	BoxShadow() {
		var BoxShadow = function (hShadow, vShadow, blur, spread, color, inset) {
			this.hShadow = hShadow;
			this.vShadow = vShadow;
			this.blur = blur;
			this.spread = spread;
			this.color = color;
			this.inset = !!inset;
		};

		BoxShadow.prototype.toString = function () {
			var vals = [
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

		return BoxShadow;
	}


	//
	// Usage:
	// var myColor = new palettejs(<targetElement> [, <options>])
	//



	constructor(targetElement, options) {

		this.valueElement = targetElement; // element that will be used to display and input the color code
		this.styleElement = targetElement; // element that will preview the picked color using CSS backgroundColor

		for (var opt in options) {
			if (options.hasOwnProperty(opt)) {
				this[opt] = options[opt];
			}
		}

		// hide: () => {};
		// show:
		// redraw: 
		// importColor: 

	}

	hide() {
		if (isPickerOwner()) {
			detachPicker();
		}
	};


	show() {
		drawPicker();
	};


	redraw() {
		if (isPickerOwner()) {
			drawPicker();
		}
	};


	importColor() {
		if (!this.valueElement) {
			this.exportColor();
		} else {
			if (this.isElementType(this.valueElement, 'input')) {
				if (!this.refine) {
					if (!this.fromString(this.valueElement.value, this.leaveValue)) {
						if (this.styleElement) {
							this.styleElement.style.backgroundImage = this.styleElement._pjsOrigStyle.backgroundImage;
							this.styleElement.style.backgroundColor = this.styleElement._pjsOrigStyle.backgroundColor;
							this.styleElement.style.color = this.styleElement._pjsOrigStyle.color;
						}
						this.exportColor(this.leaveValue | this.leaveStyle);
					}
				} else if (!this.required && /^\s*$/.test(this.valueElement.value)) {
					this.valueElement.value = '';
					if (this.styleElement) {
						this.styleElement.style.backgroundImage = this.styleElement._pjsOrigStyle.backgroundImage;
						this.styleElement.style.backgroundColor = this.styleElement._pjsOrigStyle.backgroundColor;
						this.styleElement.style.color = this.styleElement._pjsOrigStyle.color;
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


	exportColor(flags) {
		if (!(flags & this.leaveValue) && this.valueElement) {
			var value = this.toString();
			if (this.uppercase) { value = value.toUpperCase(); }
			if (this.hash) { value = '#' + value; }

			if (this.isElementType(this.valueElement, 'input')) {
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
		if (!(flags & this.leavePad) && isPickerOwner()) {
			redrawPad();
		}
		if (!(flags & this.leaveSld) && isPickerOwner()) {
			redrawSld();
		}
	};


	// h: 0-360
	// s: 0-100
	// v: 0-100
	//
	fromHSV(h, s, v, flags) { // null = don't change
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

		this.rgb = HSV_RGB(
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
	fromRGB(r, g, b, flags) { // null = don't change
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

		var hsv = RGB_HSV(
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
		var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
		this.rgb[0] = rgb[0];
		this.rgb[1] = rgb[1];
		this.rgb[2] = rgb[2];

		this.exportColor(flags);
	};


	fromString(str, flags) {
		var m;
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
			var params = m[1].split(',');
			var re = /^\s*(\d*)(\.\d+)?\s*$/;
			var mR, mG, mB;
			if (
				params.length >= 3 &&
				(mR = params[0].match(re)) &&
				(mG = params[1].match(re)) &&
				(mB = params[2].match(re))
			) {
				var r = parseFloat((mR[1] || '0') + (mR[2] || ''));
				var g = parseFloat((mG[1] || '0') + (mG[2] || ''));
				var b = parseFloat((mB[1] || '0') + (mB[2] || ''));
				this.fromRGB(r, g, b, flags);
				return true;
			}
		}
		return false;
	};


	toString() {
		return (
			(0x100 | Math.round(this.rgb[0])).toString(16).substr(1) +
			(0x100 | Math.round(this.rgb[1])).toString(16).substr(1) +
			(0x100 | Math.round(this.rgb[2])).toString(16).substr(1)
		);
	};


	toHEXString() {
		return '#' + this.toString().toUpperCase();
	};


	toRGBString() {
		return ('rgb(' +
			Math.round(this.rgb[0]) + ',' +
			Math.round(this.rgb[1]) + ',' +
			Math.round(this.rgb[2]) + ')'
		);
	};


	rgbObj() {
		var r = Math.round(this.rgb[0]);
		var g = Math.round(this.rgb[1]);
		var b = Math.round(this.rgb[2]);
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


	isLight() {
		return (
			0.213 * this.rgb[0] +
			0.715 * this.rgb[1] +
			0.072 * this.rgb[2] >
			255 / 2
		);
	};


	_processParentElementsInDOM() {
		if (this._linkedElementsProcessed) { return; }
		this._linkedElementsProcessed = true;

		var elm = this.targetElement;
		do {
			// If the target element or one of its parent nodes has fixed position,
			// then use fixed positioning instead
			//
			// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
			// that's why we need to check if the returned style object is non-empty
			var currStyle = this.getStyle(elm);
			if (currStyle && currStyle.position.toLowerCase() === 'fixed') {
				this.fixed = true;
			}

			if (elm !== this.targetElement) {
				// Ensure to attach onParentScroll only once to each parent element
				// (multiple targetElements can share the same parent nodes)
				//
				// Note: It's not just offsetParents that can be scrollable,
				// that's why we loop through all parent nodes
				if (!elm._pjsEventsAttached) {
					this.attachEvent(elm, 'scroll', this.onParentScroll);
					elm._pjsEventsAttached = true;
				}
			}
		} while ((elm = elm.parentNode) && !this.isElementType(elm, 'body'));
	};


	// r: 0-255
	// g: 0-255
	// b: 0-255
	//
	// returns: [ 0-360, 0-100, 0-100 ]
	//
	RGB_HSV(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var n = Math.min(Math.min(r, g), b);
		var v = Math.max(Math.max(r, g), b);
		var m = v - n;
		if (m === 0) { return [null, 0, 100 * v]; }
		var h = r === n ? 3 + (b - g) / m : (g === n ? 5 + (r - b) / m : 1 + (g - r) / m);
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
	HSV_RGB(h, s, v) {
		var u = 255 * (v / 100);

		if (h === null) {
			return [u, u, u];
		}

		h /= 60;
		s /= 100;

		var i = Math.floor(h);
		var f = i % 2 ? h - i : 1 - (h - i);
		var m = u * (1 - s);
		var n = u * (1 - s * f);
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


	detachPicker() {
		this.unsetClass(THIS.targetElement, THIS.activeClass);
		this.picker.wrap.parentNode.removeChild(this.picker.wrap);
		delete this.picker.owner;
	}


	drawPicker() {

		// At this point, when drawing the picker, we know what the parent elements are
		// and we can do all related DOM operations, such as registering events on them
		// or checking their positioning
		THIS._processParentElementsInDOM();

		if (!this.picker) {
			this.picker = {
				owner: null,
				wrap: document.createElement('div'),
				box: document.createElement('div'),
				boxS: document.createElement('div'), // shadow area
				boxB: document.createElement('div'), // border
				pad: document.createElement('div'),
				padB: document.createElement('div'), // border
				padM: document.createElement('div'), // mouse/touch area
				padPal: this.createPalette(),
				cross: document.createElement('div'),
				crossBY: document.createElement('div'), // border Y
				crossBX: document.createElement('div'), // border X
				crossLY: document.createElement('div'), // line Y
				crossLX: document.createElement('div'), // line X
				sld: document.createElement('div'),
				sldB: document.createElement('div'), // border
				sldM: document.createElement('div'), // mouse/touch area
				sldGrad: this.createSliderGradient(),
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

		var p = this.picker;

		var displaySlider = !!this.getSliderComponent(THIS);
		var dims = this.getPickerDims(THIS);
		var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
		var padToSliderPadding = this.getPadToSliderPadding(THIS);
		var borderRadius = Math.min(
			THIS.borderRadius,
			Math.round(THIS.padding * Math.PI)); // px
		var padCursor = 'crosshair';

		// wrap
		p.wrap.style.clear = 'both';
		p.wrap.style.width = (dims[0] + 2 * THIS.borderWidth) + 'px';
		p.wrap.style.height = (dims[1] + 2 * THIS.borderWidth) + 'px';
		p.wrap.style.zIndex = THIS.zIndex;

		// picker
		p.box.style.width = dims[0] + 'px';
		p.box.style.height = dims[1] + 'px';

		p.boxS.style.position = 'absolute';
		p.boxS.style.left = '0';
		p.boxS.style.top = '0';
		p.boxS.style.width = '100%';
		p.boxS.style.height = '100%';
		this.setBorderRadius(p.boxS, borderRadius + 'px');

		// picker border
		p.boxB.style.position = 'relative';
		p.boxB.style.border = THIS.borderWidth + 'px solid';
		p.boxB.style.borderColor = THIS.borderColor;
		p.boxB.style.background = THIS.backgroundColor;
		this.setBorderRadius(p.boxB, borderRadius + 'px');

		// IE hack:
		// If the element is transparent, IE will trigger the event on the elements under it,
		// e.g. on Canvas or on elements with border
		p.padM.style.background =
			p.sldM.style.background =
			'#FFF';
		this.setStyle(p.padM, 'opacity', '0');
		this.setStyle(p.sldM, 'opacity', '0');

		// pad
		p.pad.style.position = 'relative';
		p.pad.style.width = THIS.width + 'px';
		p.pad.style.height = THIS.height + 'px';

		// pad palettes (HSV and HVS)
		p.padPal.draw(THIS.width, THIS.height, this.getPadYComponent(THIS));

		// pad border
		p.padB.style.position = 'absolute';
		p.padB.style.left = THIS.padding + 'px';
		p.padB.style.top = THIS.padding + 'px';
		p.padB.style.border = THIS.insetWidth + 'px solid';
		p.padB.style.borderColor = THIS.insetColor;

		// pad mouse area
		p.padM._pjsInstance = THIS;
		p.padM._pjsControlName = 'pad';
		p.padM.style.position = 'absolute';
		p.padM.style.left = '0';
		p.padM.style.top = '0';
		p.padM.style.width = (THIS.padding + 2 * THIS.insetWidth + THIS.width + padToSliderPadding / 2) + 'px';
		p.padM.style.height = dims[1] + 'px';
		p.padM.style.cursor = padCursor;

		// pad cross
		p.cross.style.position = 'absolute';
		p.cross.style.left =
			p.cross.style.top =
			'0';
		p.cross.style.width =
			p.cross.style.height =
			crossOuterSize + 'px';

		// pad cross border Y and X
		p.crossBY.style.position =
			p.crossBX.style.position =
			'absolute';
		p.crossBY.style.background =
			p.crossBX.style.background =
			THIS.pointerBorderColor;
		p.crossBY.style.width =
			p.crossBX.style.height =
			(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
		p.crossBY.style.height =
			p.crossBX.style.width =
			crossOuterSize + 'px';
		p.crossBY.style.left =
			p.crossBX.style.top =
			(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) - THIS.pointerBorderWidth) + 'px';
		p.crossBY.style.top =
			p.crossBX.style.left =
			'0';

		// pad cross line Y and X
		p.crossLY.style.position =
			p.crossLX.style.position =
			'absolute';
		p.crossLY.style.background =
			p.crossLX.style.background =
			THIS.pointerColor;
		p.crossLY.style.height =
			p.crossLX.style.width =
			(crossOuterSize - 2 * THIS.pointerBorderWidth) + 'px';
		p.crossLY.style.width =
			p.crossLX.style.height =
			THIS.pointerThickness + 'px';
		p.crossLY.style.left =
			p.crossLX.style.top =
			(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2)) + 'px';
		p.crossLY.style.top =
			p.crossLX.style.left =
			THIS.pointerBorderWidth + 'px';

		// slider
		p.sld.style.overflow = 'hidden';
		p.sld.style.width = THIS.sliderSize + 'px';
		p.sld.style.height = THIS.height + 'px';

		// slider gradient
		p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

		// slider border
		p.sldB.style.display = displaySlider ? 'block' : 'none';
		p.sldB.style.position = 'absolute';
		p.sldB.style.right = THIS.padding + 'px';
		p.sldB.style.top = THIS.padding + 'px';
		p.sldB.style.border = THIS.insetWidth + 'px solid';
		p.sldB.style.borderColor = THIS.insetColor;

		// slider mouse area
		p.sldM._pjsInstance = THIS;
		p.sldM._pjsControlName = 'sld';
		p.sldM.style.display = displaySlider ? 'block' : 'none';
		p.sldM.style.position = 'absolute';
		p.sldM.style.right = '0';
		p.sldM.style.top = '0';
		p.sldM.style.width = (THIS.sliderSize + padToSliderPadding / 2 + THIS.padding + 2 * THIS.insetWidth) + 'px';
		p.sldM.style.height = dims[1] + 'px';
		p.sldM.style.cursor = 'default';

		// slider pointer inner and outer border
		p.sldPtrIB.style.border =
			p.sldPtrOB.style.border =
			THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

		// slider pointer outer border
		p.sldPtrOB.style.position = 'absolute';
		p.sldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
		p.sldPtrOB.style.top = '0';

		// slider pointer middle border
		p.sldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

		// slider pointer spacer
		p.sldPtrS.style.width = THIS.sliderSize + 'px';
		p.sldPtrS.style.height = sliderPtrSpace + 'px';

		// the Close button
		function setBtnBorder() {
			var insetColors = THIS.insetColor.split(/\s+/);
			var outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
			p.btn.style.borderColor = outsetColor;
		}
		p.btn.style.display = THIS.closable ? 'block' : 'none';
		p.btn.style.position = 'absolute';
		p.btn.style.left = THIS.padding + 'px';
		p.btn.style.bottom = THIS.padding + 'px';
		p.btn.style.padding = '0 15px';
		p.btn.style.height = THIS.buttonHeight + 'px';
		p.btn.style.border = THIS.insetWidth + 'px solid';
		setBtnBorder();
		p.btn.style.color = THIS.buttonColor;
		p.btn.style.font = '12px sans-serif';
		p.btn.style.textAlign = 'center';
		try {
			p.btn.style.cursor = 'pointer';
		} catch (eOldIE) {
			p.btn.style.cursor = 'hand';
		}
		p.btn.onmousedown = function () {
			THIS.hide();
		};
		p.btnT.style.lineHeight = THIS.buttonHeight + 'px';
		p.btnT.innerHTML = '';
		p.btnT.appendChild(document.createTextNode(THIS.closeText));

		// place pointers
		redrawPad();
		redrawSld();

		// If we are changing the owner without first closing the picker,
		// make sure to first deal with the old owner
		if (this.picker.owner && this.picker.owner !== THIS) {
			this.unsetClass(this.picker.owner.targetElement, THIS.activeClass);
		}

		// Set the new picker owner
		this.picker.owner = THIS;

		// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
		// after setting the owner
		if (this.isElementType(container, 'body')) {
			this.redrawPosition();
		} else {
			this._drawPosition(THIS, 0, 0, 'relative', false);
		}

		if (p.wrap.parentNode != container) {
			container.appendChild(p.wrap);
		}

		this.attachEvent(p.wrap, 'touchstart', this.onControlTouchStart);

		this.setClass(THIS.targetElement, THIS.activeClass);
	}


	redrawPad() {
		// redraw the pad pointer
		switch (this.getPadYComponent(THIS)) {
			case 's': var yComponent = 1; break;
			case 'v': var yComponent = 2; break;
		}
		var x = Math.round((THIS.hsv[0] / 360) * (THIS.width - 1));
		var y = Math.round((1 - THIS.hsv[yComponent] / 100) * (THIS.height - 1));
		var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
		var ofs = -Math.floor(crossOuterSize / 2);
		this.picker.cross.style.left = (x + ofs) + 'px';
		this.picker.cross.style.top = (y + ofs) + 'px';

		// redraw the slider
		switch (this.getSliderComponent(THIS)) {
			case 's':
				var rgb1 = HSV_RGB(THIS.hsv[0], 100, THIS.hsv[2]);
				var rgb2 = HSV_RGB(THIS.hsv[0], 0, THIS.hsv[2]);
				var color1 = 'rgb(' +
					Math.round(rgb1[0]) + ',' +
					Math.round(rgb1[1]) + ',' +
					Math.round(rgb1[2]) + ')';
				var color2 = 'rgb(' +
					Math.round(rgb2[0]) + ',' +
					Math.round(rgb2[1]) + ',' +
					Math.round(rgb2[2]) + ')';
				this.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			case 'v':
				var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 100);
				var color1 = 'rgb(' +
					Math.round(rgb[0]) + ',' +
					Math.round(rgb[1]) + ',' +
					Math.round(rgb[2]) + ')';
				var color2 = '#000';
				this.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
		}
	}


	redrawSld() {
		var sldComponent = this.getSliderComponent(THIS);
		if (sldComponent) {
			// redraw the slider pointer
			switch (sldComponent) {
				case 's': var yComponent = 1; break;
				case 'v': var yComponent = 2; break;
			}
			var y = Math.round((1 - THIS.hsv[yComponent] / 100) * (THIS.height - 1));
			this.picker.sldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(sliderPtrSpace / 2)) + 'px';
		}
	}


	isPickerOwner() {
		return this.picker && this.picker.owner === THIS;
	}


	blurValue() {
		THIS.importColor();
	}


	// Find the target element
	if(typeof targetElement === 'string') {
	var id = targetElement;
	var elm = document.getElementById(id);
	if (elm) {
		this.targetElement = elm;
	} else {
		this.warn('Could not find target element with ID \'' + id + '\'');
	}
} else if (targetElement) {
	this.targetElement = targetElement;
} else {
	this.warn('Invalid target element: \'' + targetElement + '\'');
}

if (this.targetElement._pjsLinkedInstance) {
	this.warn('Cannot link palettejs twice to the same element. Skipping.');
	return;
}
this.targetElement._pjsLinkedInstance = this;

// Find the value element
this.valueElement = this.fetchElement(this.valueElement);
// Find the style element
this.styleElement = this.fetchElement(this.styleElement);

var THIS = this;
var container =
	this.container ?
		this.fetchElement(this.container) :
		document.getElementsByTagName('body')[0];
var sliderPtrSpace = 3; // px

// For BUTTON elements it's important to stop them from sending the form when clicked
// (e.g. in Safari)
if (this.isElementType(this.targetElement, 'button')) {
	if (this.targetElement.onclick) {
		var origCallback = this.targetElement.onclick;
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
	if (this.isElementType(this.valueElement, 'input')) {
		var updateField = function () {
			THIS.fromString(THIS.valueElement.value, this.leaveValue);
			this.dispatchFineChange(THIS);
		};
		this.attachEvent(this.valueElement, 'keyup', updateField);
		this.attachEvent(this.valueElement, 'input', updateField);
		this.attachEvent(this.valueElement, 'blur', blurValue);
		this.valueElement.setAttribute('autocomplete', 'off');
	}
}

// styleElement
if (this.styleElement) {
	this.styleElement._pjsOrigStyle = {
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
	}


	// //================================
	// // Public properties and methods
	// //================================


	// // By default, search for all elements with class="palettejs" and install a color picker on them.
	// //
	// // You can change what class name will be looked for by setting the property palettejs.lookupClass
	// // anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
	// //
	// this.palettejs.lookupClass = 'palettejs';


	// this.palettejs.installByClassName = function (className) {
	// 	var inputElms = document.getElementsByTagName('input');
	// 	var buttonElms = document.getElementsByTagName('button');

	// 	this.tryInstallOnElements(inputElms, className);
	// 	this.tryInstallOnElements(buttonElms, className);
	// };


	// this.register();


	// return this.palettejs;

