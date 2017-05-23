
// import { jsdom } from 'jsdom';
import { JSDOM } from "jsdom";
const svg2png = require("svg2png");
const fs = require('fs');
const path = require('path');



// SVG full elements index: https://www.w3.org/TR/SVG/eltindex.html

export class svgPanel {

	dom: JSDOM;
	document: Document;

	width: number;
	height: number;
	element: Element;
	namespace: string = "http://www.w3.org/2000/svg";
	xmlDeclaration: string =
	'<?xml version="1.0" encoding="UTF-8" standalone="no"?>'

	elements: HTMLElement[] = [];

	constructor(width: number, height: number) {

		this.dom = new JSDOM(
				this.xmlDeclaration
			,
			{
				contentType: "image/svg+xml",
			});

		this.document = this.dom.window.document;

		this.element = this.document.createElementNS(this.namespace,"svg");
		this.width = width
		this.height = height
		this.element.setAttribute('width', `${width}`);
		this.element.setAttribute('height', `${height}`);
		this.element.setAttribute('xmlns', `${this.namespace}`);
		this.document.appendChild(this.element)

		let el = this.document.createElementNS(this.namespace, "rect")
		el.setAttribute('x', "20");
		el.setAttribute('y', "20");
		el.setAttribute('width', "50");
		el.setAttribute('height', "90");
		el.setAttribute('fill', "green");
		this.element.appendChild(el);

		this.drawText("hello world",20,20);




		// let xmlHeader = this.document.createElement('xml');
		// xmlHeader.setAttribute('version', "1.0");
		// xmlHeader.setAttribute('encoding', "UTF-8");
		// xmlHeader.setAttribute('encoding', "no");
		// this.document.appendChild(xmlHeader)

		// let style = this.document.createElementNS(this.namespace, 'xml-stylesheet');
		// style.setAttribute('type', "text/css");
		// style.setAttribute('href', "resource/dash.css");
		// this.document.appendChild(style)

		// https://www.w3.org/TR/SVG/struct.html#DefsElement
		// should be <SVGDefsElement>
		// let defs	= this.document.createElementNS(this.namespace, 'defs');

		let style = this.document.createElementNS(this.namespace, 'style');
		style.setAttribute('type', 'text/css');
		style.textContent = `<![CDATA[ ${this.getStyle()} ]]>`
		this.element.appendChild( this.document.createElementNS(this.namespace, 'defs') )
			.appendChild( style )
			
			

		// https://www.w3.org/TR/SVG/styling.html#StyleElement
		// style: https://www.w3.org/TR/SVG/styling.html#StyleElementExample

		// let styleCDATA = this.document.createCDATASection(
		// `
		// 	@font-face {
		// 		font-family: EkMukta-Regular;
		// 		src: url('resource/EkMukta-Regular.ttf');
		// 	}
		// `);
		// console.log(styleCDATA);
		// console.log(styleCDATA.textContent)


		// style.appendChild(styleCDATA);
		// let foo = this.document.createCDATASection("foo");
		// console.log(foo);
		
// `
// <![CDATA[
// 	@font-face {
// 	font-family: EkMukta-Regular;
// 	src: url('resource/EkMukta-Regular.ttf');
// 	}
// ]]>
// `)
		// defs.appendChild(style)
		// console.log("appending in constructor(" + defs + ")")
		// this.append(defs)
	}

	drawText(text: string, x: number, y: number, id?: string) {

		text=""

		let el2 = this.document.createElementNS(this.namespace, 'text');
		el2.setAttribute('x', "20");
		el2.setAttribute('y', "80");
		el2.setAttribute('font-size', "24")
		el2.setAttribute('font-family', "Arial")
		el2.textContent = "Arial=" + text
		console.log("appending drawText(" + text + ")")
		this.append(el2)

		let el = this.document.createElementNS(this.namespace, 'text');
		el.setAttribute('x', "160");
		el.setAttribute('y', "200");
		el.setAttribute('font-size', "84")
		el.setAttribute('font-family', "EkMukta-Light")
		el.setAttribute('text-anchor', "middle")
		el.textContent = text
		console.log("appending drawText("+text+")")
		this.append(el)
	}

	retrieve(): string {
		return (
			this.xmlDeclaration + "\n" + 
			this.dom.serialize()
		)
	}

	savePNG(fileOutPath: string){
		//fileOutPath
		fs.writeFile("C:/Users/ehiller/dev/src/github.com/erichiller/hue-control-panel/foo.png", 
			svg2png.sync(this.retrieve(),
			{
				filename: __dirname
			}), 
			function (err) {
				if (err) {
					return console.log(err);
				}
				console.log("wrote file '" + fileOutPath + "' ; done.");
			});
		
	}



	getStyle(): string {
		return fs.readFileSync('resource/dash.css', 'utf8');
	}

	


	append(el) {
		this.element.appendChild(el)
		this.elements.push(el)
	}


}
