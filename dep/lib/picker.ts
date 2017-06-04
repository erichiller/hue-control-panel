

// export class picker {
// 	owner: colorPalette | null;
// 	wrap: HTMLElement;
// 	box: HTMLElement;
// 	boxS: HTMLElement;
// 	boxB: HTMLElement;
// 	pad: HTMLElement;
// 	padB: HTMLElement;
// 	padM: controlElementExt;
// 	padPal: paletteElementExt;
// 	cross: HTMLElement;
// 	crossBY: HTMLElement;
// 	crossBX: HTMLElement;
// 	crossLY: HTMLElement;
// 	crossLX: HTMLElement;
// 	sld: HTMLElement;
// 	sldB: HTMLElement;
// 	sldM: controlElementExt;
// 	sldGrad: sliderGradient;
// 	sldPtrS: HTMLElement;
// 	sldPtrIB: HTMLElement;
// 	sldPtrMB: HTMLElement;
// 	sldPtrOB: HTMLElement;
// 	btn: HTMLElement;
// 	btnT: HTMLElement;
		
// 	drawPicker() {
// 		console.info("drawPicker()");

// 		// At this point, when drawing the picker, we know what the parent elements are
// 		// and we can do all related DOM operations, such as registering events on them
// 		// or checking their positioning
// 		this.processParentElementsInDOM();


// 		let container =
// 			this.container ?
// 				fetchElement(this.container) :
// 				document.getElementsByTagName('body')[0];

// 		// For BUTTON elements it's important to stop them from sending the form when clicked
// 		// (e.g. in Safari)
// 		if (this.targetElement instanceof HTMLButtonElement) {
// 			console.info('colorPalette.drawPicker() ; this.targetElement is of type HTMLButtonElement')
// 			if (this.targetElement.onclick) {
// 				let origCallback = this.targetElement.onclick;
// 				this.targetElement.onclick = function (evt) {
// 					origCallback.call(this, evt);
// 					return false;
// 				};
// 			} else {
// 				this.targetElement.onclick = function () { return false; };
// 			}
// 		}

// 		// valueElement
// 		if (this.valueElement) {
// 			if (this.valueElement instanceof HTMLInputElement) {
// 				console.info('colorPalette.drawPicker() ; this.valueElement is of type HTMLInputElement')
// 				let updateField = function () {
// 					this.fromString(this.valueElement.value, this.leaveValue);
// 					this.dispatchFineChange(this);
// 				};
// 				this.attachEvent(this.valueElement, 'keyup', updateField);
// 				this.attachEvent(this.valueElement, 'input', updateField);
// 				this.attachEvent(this.valueElement, 'blur', this.blurValue);
// 				this.valueElement.setAttribute('autocomplete', 'off');
// 			}
// 		}

// 		// styleElement
// 		if (this.styleElement) {
// 			this.styleElement.OriginalStyle = {
// 				backgroundImage: this.styleElement.style.backgroundImage,
// 				backgroundColor: this.styleElement.style.backgroundColor,
// 				color: this.styleElement.style.color
// 			};
// 		}

// 		if (this.value) {
// 			// Try to set the color from the .value option and if unsuccessful,
// 			// export the current color
// 			this.fromString(this.value) || this.exportColor();
// 		} else {
// 			this.importColor();
// 		}

// 		if (!this.picker) {
// 			console.info("this.picker was not yet set ; creating this.picker");
// 			this.picker = {
// 				owner: null,
// 				wrap: document.createElement('div'),
// 				box: document.createElement('div'),
// 				boxS: document.createElement('div'), // shadow area
// 				boxB: document.createElement('div'), // border
// 				pad: document.createElement('div'),
// 				padB: document.createElement('div'), // border
// 				padM: document.createElement('div'), // mouse/touch area
// 				padPal: new paletteElementExt(),
// 				cross: document.createElement('div'),
// 				crossBY: document.createElement('div'), // border Y
// 				crossBX: document.createElement('div'), // border X
// 				crossLY: document.createElement('div'), // line Y
// 				crossLX: document.createElement('div'), // line X
// 				sld: document.createElement('div'),
// 				sldB: document.createElement('div'), // border
// 				sldM: document.createElement('div'), // mouse/touch area
// 				sldGrad: new sliderGradient(),
// 				sldPtrS: document.createElement('div'), // slider pointer spacer
// 				sldPtrIB: document.createElement('div'), // slider pointer inner border
// 				sldPtrMB: document.createElement('div'), // slider pointer middle border
// 				sldPtrOB: document.createElement('div'), // slider pointer outer border
// 				btn: document.createElement('div'),
// 				btnT: document.createElement('span') // text
// 			};

// 			this.picker.pad.appendChild(this.picker.padPal.elm);
// 			this.picker.padB.appendChild(this.picker.pad);
// 			this.picker.cross.appendChild(this.picker.crossBY);
// 			this.picker.cross.appendChild(this.picker.crossBX);
// 			this.picker.cross.appendChild(this.picker.crossLY);
// 			this.picker.cross.appendChild(this.picker.crossLX);
// 			this.picker.padB.appendChild(this.picker.cross);
// 			this.picker.box.appendChild(this.picker.padB);
// 			this.picker.box.appendChild(this.picker.padM);

// 			this.picker.sld.appendChild(this.picker.sldGrad.elm);
// 			this.picker.sldB.appendChild(this.picker.sld);
// 			this.picker.sldB.appendChild(this.picker.sldPtrOB);
// 			this.picker.sldPtrOB.appendChild(this.picker.sldPtrMB);
// 			this.picker.sldPtrMB.appendChild(this.picker.sldPtrIB);
// 			this.picker.sldPtrIB.appendChild(this.picker.sldPtrS);
// 			this.picker.box.appendChild(this.picker.sldB);
// 			this.picker.box.appendChild(this.picker.sldM);

// 			this.picker.btn.appendChild(this.picker.btnT);
// 			this.picker.box.appendChild(this.picker.btn);

// 			this.picker.boxB.appendChild(this.picker.box);
// 			this.picker.wrap.appendChild(this.picker.boxS);
// 			this.picker.wrap.appendChild(this.picker.boxB);
// 		}


// 		let displaySlider = !!this.getSliderComponent();
// 		let dims = this.getPickerDims();
// 		let crossOuterSize = (2 * this.pointerBorderWidth + this.pointerThickness + 2 * this.crossSize);
// 		let padToSliderPadding = this.getPadToSliderPadding();
// 		let borderRadius = Math.min(
// 			this.borderRadius,
// 			Math.round(this.padding * Math.PI)); // px
// 		let padCursor = 'crosshair';

// 		// wrap
// 		this.picker.wrap.style.clear = 'both';
// 		this.picker.wrap.style.width = (dims[0] + 2 * this.borderWidth) + 'px';
// 		this.picker.wrap.style.height = (dims[1] + 2 * this.borderWidth) + 'px';
// 		this.picker.wrap.style.zIndex = String(this.zIndex);

// 		// picker
// 		this.picker.box.style.width = dims[0] + 'px';
// 		this.picker.box.style.height = dims[1] + 'px';

// 		this.picker.boxS.style.position = 'absolute';
// 		this.picker.boxS.style.left = '0';
// 		this.picker.boxS.style.top = '0';
// 		this.picker.boxS.style.width = '100%';
// 		this.picker.boxS.style.height = '100%';
// 		this.setBorderRadius(this.picker.boxS, borderRadius + 'px');

// 		// picker border
// 		this.picker.boxB.style.position = 'relative';
// 		this.picker.boxB.style.border = this.borderWidth + 'px solid';
// 		this.picker.boxB.style.borderColor = this.borderColor;
// 		this.picker.boxB.style.background = this.backgroundColor;
// 		this.setBorderRadius(this.picker.boxB, borderRadius + 'px');

// 		// IE hack:
// 		// If the element is transparent, IE will trigger the event on the elements under it,
// 		// e.g. on Canvas or on elements with border
// 		this.picker.padM.style.background =
// 			this.picker.sldM.style.background =
// 			'#FFF';
// 		this.setStyle(this.picker.padM, 'opacity', '0');
// 		this.setStyle(this.picker.sldM, 'opacity', '0');

// 		// pad
// 		this.picker.pad.style.position = 'relative';
// 		this.picker.pad.style.width = this.width + 'px';
// 		this.picker.pad.style.height = this.height + 'px';

// 		// pad palettes (HSV and HVS)
// 		this.picker.padPal.draw(this.width, this.height, this.getPadYComponent());

// 		// pad border
// 		this.picker.padB.style.position = 'absolute';
// 		this.picker.padB.style.left = this.padding + 'px';
// 		this.picker.padB.style.top = this.padding + 'px';
// 		this.picker.padB.style.border = this.insetWidth + 'px solid';
// 		this.picker.padB.style.borderColor = this.insetColor;

// 		// pad mouse area
// 		this.picker.padM.Instance = this;
// 		this.picker.padM.ControlName = 'pad';
// 		this.picker.padM.style.position = 'absolute';
// 		this.picker.padM.style.left = '0';
// 		this.picker.padM.style.top = '0';
// 		this.picker.padM.style.width = (this.padding + 2 * this.insetWidth + this.width + padToSliderPadding / 2) + 'px';
// 		this.picker.padM.style.height = dims[1] + 'px';
// 		this.picker.padM.style.cursor = padCursor;

// 		// pad cross
// 		this.picker.cross.style.position = 'absolute';
// 		this.picker.cross.style.left =
// 			this.picker.cross.style.top =
// 			'0';
// 		this.picker.cross.style.width =
// 			this.picker.cross.style.height =
// 			crossOuterSize + 'px';

// 		// pad cross border Y and X
// 		this.picker.crossBY.style.position =
// 			this.picker.crossBX.style.position =
// 			'absolute';
// 		this.picker.crossBY.style.background =
// 			this.picker.crossBX.style.background =
// 			this.pointerBorderColor;
// 		this.picker.crossBY.style.width =
// 			this.picker.crossBX.style.height =
// 			(2 * this.pointerBorderWidth + this.pointerThickness) + 'px';
// 		this.picker.crossBY.style.height =
// 			this.picker.crossBX.style.width =
// 			crossOuterSize + 'px';
// 		this.picker.crossBY.style.left =
// 			this.picker.crossBX.style.top =
// 			(Math.floor(crossOuterSize / 2) - Math.floor(this.pointerThickness / 2) - this.pointerBorderWidth) + 'px';
// 		this.picker.crossBY.style.top =
// 			this.picker.crossBX.style.left =
// 			'0';

// 		// pad cross line Y and X
// 		this.picker.crossLY.style.position =
// 			this.picker.crossLX.style.position =
// 			'absolute';
// 		this.picker.crossLY.style.background =
// 			this.picker.crossLX.style.background =
// 			this.pointerColor;
// 		this.picker.crossLY.style.height =
// 			this.picker.crossLX.style.width =
// 			(crossOuterSize - 2 * this.pointerBorderWidth) + 'px';
// 		this.picker.crossLY.style.width =
// 			this.picker.crossLX.style.height =
// 			this.pointerThickness + 'px';
// 		this.picker.crossLY.style.left =
// 			this.picker.crossLX.style.top =
// 			(Math.floor(crossOuterSize / 2) - Math.floor(this.pointerThickness / 2)) + 'px';
// 		this.picker.crossLY.style.top =
// 			this.picker.crossLX.style.left =
// 			this.pointerBorderWidth + 'px';

// 		// slider
// 		this.picker.sld.style.overflow = 'hidden';
// 		this.picker.sld.style.width = this.sliderSize + 'px';
// 		this.picker.sld.style.height = this.height + 'px';

// 		// slider gradient
// 		this.picker.sldGrad.draw(this.sliderSize, this.height, '#000', '#000');

// 		// slider border
// 		this.picker.sldB.style.display = displaySlider ? 'block' : 'none';
// 		this.picker.sldB.style.position = 'absolute';
// 		this.picker.sldB.style.right = this.padding + 'px';
// 		this.picker.sldB.style.top = this.padding + 'px';
// 		this.picker.sldB.style.border = this.insetWidth + 'px solid';
// 		this.picker.sldB.style.borderColor = this.insetColor;

// 		// slider mouse area
// 		this.picker.sldM.Instance = this;
// 		this.picker.sldM.ControlName = 'sld';
// 		this.picker.sldM.style.display = displaySlider ? 'block' : 'none';
// 		this.picker.sldM.style.position = 'absolute';
// 		this.picker.sldM.style.right = '0';
// 		this.picker.sldM.style.top = '0';
// 		this.picker.sldM.style.width = (this.sliderSize + padToSliderPadding / 2 + this.padding + 2 * this.insetWidth) + 'px';
// 		this.picker.sldM.style.height = dims[1] + 'px';
// 		this.picker.sldM.style.cursor = 'default';

// 		// slider pointer inner and outer border
// 		this.picker.sldPtrIB.style.border =
// 			this.picker.sldPtrOB.style.border =
// 			this.pointerBorderWidth + 'px solid ' + this.pointerBorderColor;

// 		// slider pointer outer border
// 		this.picker.sldPtrOB.style.position = 'absolute';
// 		this.picker.sldPtrOB.style.left = -(2 * this.pointerBorderWidth + this.pointerThickness) + 'px';
// 		this.picker.sldPtrOB.style.top = '0';

// 		// slider pointer middle border
// 		this.picker.sldPtrMB.style.border = this.pointerThickness + 'px solid ' + this.pointerColor;

// 		// slider pointer spacer
// 		this.picker.sldPtrS.style.width = this.sliderSize + 'px';
// 		this.picker.sldPtrS.style.height = this.sliderPtrSpace + 'px';

// 		this.picker.btn.style.display = this.closable ? 'block' : 'none';
// 		this.picker.btn.style.position = 'absolute';
// 		this.picker.btn.style.left = this.padding + 'px';
// 		this.picker.btn.style.bottom = this.padding + 'px';
// 		this.picker.btn.style.padding = '0 15px';
// 		this.picker.btn.style.height = this.buttonHeight + 'px';
// 		this.picker.btn.style.border = this.insetWidth + 'px solid';

// 		// the Close button
// 		let insetColors = this.insetColor.split(/\s+/);
// 		let outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
// 		this.picker.btn.style.borderColor = outsetColor;

// 		this.picker.btn.style.color = this.buttonColor;
// 		this.picker.btn.style.font = '12px sans-serif';
// 		this.picker.btn.style.textAlign = 'center';
// 		try {
// 			this.picker.btn.style.cursor = 'pointer';
// 		} catch (eOldIE) {
// 			this.picker.btn.style.cursor = 'hand';
// 		}
// 		this.picker.btn.onmousedown = () => { this.hide(); };
// 		this.picker.btnT.style.lineHeight = this.buttonHeight + 'px';
// 		this.picker.btnT.innerHTML = '';
// 		this.picker.btnT.appendChild(document.createTextNode(this.closeText));

// 		// place pointers
// 		this.redrawPad();
// 		this.redrawSld();

// 		// If we are changing the owner without first closing the picker,
// 		// make sure to first deal with the old owner
// 		if (this.picker.owner && this.picker.owner !== this) {
// 			console.warn("This picker previously had an owner, and it WAS NOT THIS")
// 			this.unsetClass(this.picker.owner.targetElement, this.activeClass);
// 		}

// 		// Set the new picker owner
// 		this.picker.owner = this;

// 		// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
// 		// after setting the owner
// 		if (container instanceof HTMLBodyElement) {
// 			console.log('redrawPosition() is now set based upon Body');
// 			this.redrawPosition();
// 		} else {
// 			console.log('redrawPosition() is now set based upon relative.');
// 			this.drawPosition(0, 0, 'relative', false);
// 		}

// 		console.log(`parentnode(${this.picker.wrap.parentNode}) != container(${container})`);
// 		if (this.picker.wrap.parentNode != container) {
// 			console.info(`container.appendChild(${this.picker.wrap})`);
// 			container.appendChild(this.picker.wrap);
// 		}

// 		this.attachEvent(this.picker.wrap, 'touchstart', this.onControlTouchStart);

// 		console.trace(`${this.targetElement} class to ${this.activeClass}`);
// 		this.setClass(this.targetElement, this.activeClass);
// 	}
// }
