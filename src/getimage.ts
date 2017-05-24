
var sizeOf = require('image-size');
var url = require('url');
var http = require('http');

var imgUrl = "http://l.yimg.com/a/i/us/we/52/32.gif";

function getImageSize(imgUrl: string): Promise<[number,number]> {
	return new Promise( (resolve, reject) => {
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
				resolve( [size.width, size.height] )
			});
		});
	});

	
}

async function myfunc() {
	let [width, height] = await getImageSize(imgUrl)
	console.log(`width=${width} // height=${height}`)
	//.then( (resolve) =>
}


myfunc()
