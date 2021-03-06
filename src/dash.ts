import fetch, { Response } from "node-fetch";
import { svgPanel } from './svg';


function getTime(): string {
	// postMeridiem = false
	let suffix = "a"
	let hour = new Date().getHours();
	if ( hour > 12 ) {
		hour -= 12
		// postMeridiem = true
		suffix = "p"
	}
	let minute = new Date().getMinutes();

	return hour + ":" + minute + suffix
}

async function constructDash() {

	let svg = new svgPanel(320, 480);
	// draw the clock
	svg.drawText(getTime(), 160, 200, "clock");

	// draw weather image
	await svg.centerDrawImage("http://l.yimg.com/a/i/us/we/52/32.gif", 300)

	console.log("svg.element.getAtrribute:")
	console.log(svg.element.getAttribute)

	console.log("svg.element.attributes.length:")
	console.log(svg.element.attributes.length)

	console.log("svg.//getElementsByTagName//.attributes.length:")
	console.log(svg.dom.window.document.getElementsByTagName("svg")[0].attributes.length)

	console.log("svg.get:")
	console.log(svg.retrieve())

	// save the file
	svg.savePNG("dash.png")

}

constructDash();
console.log("done.")




// declare namespace NodeJS {
// 	export interface Global {
// 		window: any;
// 		// document: Document;
// 	}
// }



		// created: (error: Error, window: Window) => { 
		// 	console.log("jsdom initialized.")
		// 	if (error){
		// 		console.log(error)
		// 	}
		// },

// done: (console.log("document has been loaded"))

// node fetch, see: http://blog.ctaggart.com/2016/12/fetch-api-via-typescript-async.html

// fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D2488892&format=json&diagnostics=true&callback=")
// .then(function(response){
// 	return response.json();
// })
// .then(function(json){
	
	
// 	let description = json.query.results.channel.item.description
// 	let imageIndexStart = description.indexOf("\"")+1
// 	let imageURL = description.substring(imageIndexStart, description.indexOf("\"", imageIndexStart+1))
// 	console.log("====JSON====")
// 	console.log(json);

// 	console.log("====description====")
// 	console.log(description);

// 	console.log("====imageIndexStart====")
// 	console.log(imageIndexStart);

// 	console.log("====end====")
// 	console.log(description.indexOf("\"", imageIndexStart)+1);

// 	console.log("====imageURL====")
// 	console.log(imageURL)




// 	new svgPanel(320,480);
// 	// svgPanel.
// /////////////////////////////////////////////////////////////////////// end jsonparsestuff
// });

// $foo.query.results.channel.item.description

// $foo = (cat jsonfile | ConvertFrom - Json)




