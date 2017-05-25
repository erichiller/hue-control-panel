
import { JSDOM } from "jsdom";
const svg2png = require("svg2png");
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const url = require('url');
const http = require('http');

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
				resources:		"usable",
				contentType:	"image/svg+xml",
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

		let style = this.document.createElementNS(this.namespace, 'style');
		style.setAttribute('type', 'text/css');
		style.textContent = `<![CDATA[ ${this.getStyle()} ]]>`
		this.element.appendChild( this.document.createElementNS(this.namespace, 'defs') )
			.appendChild( style )
	}

	drawText(text: string, x: number, y: number, id?: string) {
		let el = this.document.createElementNS(this.namespace, 'text');
		el.setAttribute('x', `${x}`);
		el.setAttribute('y', `${y}`);
		if (id) {
			el.setAttribute('id', `${id}`)
		}
		el.textContent = text
		console.log("appending drawText("+text+")")
		this.element.appendChild(el);
	}

	retrieve(): string {
		return (
			this.xmlDeclaration + "\n" + 
			// this.dom.serialize()
			this.element.outerHTML
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

	async centerDrawImage(srcURL: string, y: number){
		let [width, height] = await getImageSize(srcURL)
		let x = (this.width - width) / 2;
		this.drawImage(srcURL,x,y,width,height);
	}

	async drawImage(srcURL: string, x: number, y: number, width?: number, height?: number){
		
		let el = this.document.createElementNS(this.namespace, 'image');
		el.setAttribute('x', `${x}`);
		el.setAttribute('y', `${y}`);
		el.setAttribute('width', `${width}`);
		el.setAttribute('height', `${height}`);
		el.setAttribute('xlink:href', `${srcURL}`);
		this.element.appendChild(el);
	}

	
}




////////
// Utility functions
////////

function getImageSize(imgUrl: string): Promise<[number, number]> {
	return new Promise((resolve, reject) => {
		let options = url.parse(imgUrl);
		http.get(options, function (response) {
			let chunks = [];
			response.on('data', function (chunk) {
				chunks.push(chunk);
			}).on('end', function () {
				let buffer = Buffer.concat(chunks);
				let size = sizeOf(buffer);
				console.log("returning...")
				console.log(size)
				resolve([size.width, size.height])
			});
		});
	});
}


// interface Element {
// 	append(el: Element): void;
// }

// Element.prototype.append = function (el: Element): void {
// 	this.appendChild(el)	
// }
