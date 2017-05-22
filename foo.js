const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const dom = new JSDOM(`<!DOCTYPE html>hello`);

console.log(dom.serialize())

console.log("done")
