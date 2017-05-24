

# Async / Await usage



[Examples][why_async_blows_promises_away]
```javascript

// the function being called with await must return a promise
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
   }
}

// await can only be called on functions labeled async
async function doSomething() {
  console.log(await getImageSize())
  return "done"
}

doSomething()
```











[why_async_blows_promises_away]: https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9
