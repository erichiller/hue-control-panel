
// import { jsdom } from 'jsdom';
import { JSDOM } from "jsdom";


// SVG full elements index: https://www.w3.org/TR/SVG/eltindex.html

export class svgPanel {

	dom: JSDOM;
	document: Document;

	width: number;
	height: number;
	element: Element;
	namespace: string = "http://www.w3.org/2000/svg"

	elements: HTMLElement[] = [];
	// const dom: JSDOM;

	constructor(width: number, height: number){
		this.dom = new JSDOM(
			'<?xml version="1.0" standalone="yes"?>',
			{
				contentType: "image/svg+xml",
			});
		this.document = this.dom.window.document;
		this.element = this.document.createElementNS(this.namespace, "svg");


		this.width = width
		this.height = height
		this.element.setAttribute('width', `${width}`);
		this.element.setAttribute('height', `${height}`);
		this.document.appendChild(this.element)
	}


	myconstructor(width: number, height: number) {

		this.dom = new JSDOM(
			'<?xml version="1.0" standalone="yes"?>',
			{
				contentType: "image/svg+xml",
			});

		this.document = this.dom.window.document;
		this.element = this.document.createElementNS(this.namespace, "svg");


		this.width = width
		this.height = height
		this.element.setAttribute('width', `${width}`);
		this.element.setAttribute('height', `${height}`);
		this.document.appendChild(this.element)


		// https://www.w3.org/TR/SVG/struct.html#DefsElement
		// should be <SVGDefsElement>
		let defs	= this.document.createElementNS(this.namespace, 'defs');

		// https://www.w3.org/TR/SVG/styling.html#StyleElement
		// style: https://www.w3.org/TR/SVG/styling.html#StyleElementExample
		let style 	= this.document.createElementNS(this.namespace, 'style');
		style.setAttribute('type', "text/css");
		let styleCDATA = this.document.createCDATASection(
		`
			@font-face {
				font-family: EkMukta-Regular;
				src: url('resource/EkMukta-Regular.ttf');
			}
		`)
// `
// <![CDATA[
// 	@font-face {
// 	font-family: EkMukta-Regular;
// 	src: url('resource/EkMukta-Regular.ttf');
// 	}
// ]]>
// `)
		style.appendChild(styleCDATA)
		defs.appendChild(style)
		console.log("appending in constructor(" + defs + ")")
		this.append(defs)
	}

	drawText(text: string, x: number, y: number) {
		let el = this.document.createElementNS(this.namespace, 'text');
		el.setAttribute('x', "20");
		el.setAttribute('y', "20");
		el.setAttribute('font-size', "24")
		el.setAttribute('font-family', "EkMukta-Light")
		el.textContent = text
		console.log("appending drawText("+text+")")
		this.append(el)

	}

	retrieve(): string {
		return this.dom.serialize()
	}



	append(el) {
		this.element.appendChild(el)
		this.elements.push(el)
	}


}
