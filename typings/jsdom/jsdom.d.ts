// Type definitions for jsdom 2.0.0
// Project: https://github.com/tmpvar/jsdom
// Definitions by: Asana <https://asana.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />
/// <reference types="jquery" />

import EventEmitter = NodeJS.EventEmitter;


/**
 * Like web browsers, jsdom has the concept of a "console". This records both information directly sent from the page, via scripts executing inside the document, as well as information from the jsdom implementation itself. We call the user-controllable console a "virtual console", to distinguish it from the Node.js console API and from the inside-the-page window.console API.
 * @export
 * @interface VirtualConsole
 * @extends {EventEmitter}
 */
export interface VirtualConsole extends EventEmitter {
	/**
	 * By default, the JSDOM constructor will return an instance with a virtual console that forwards all its output to the Node.js console. To create your own virtual console and pass it to jsdom, you can override this default by doing
	 * @example
	 * // If you simply want to redirect the virtual console output to another console, like the default Node.js one, you can do
	 * virtualConsole.sendTo(console);
	 * @example
	 * // Code like this will create a virtual console with no behavior. You can give it behavior by adding event listeners for all the possible console methods:
	 * virtualConsole.on("error", () => { ... });
	 * virtualConsole.on("warn", () => { ... });
	 * virtualConsole.on("info", () => { ... });
	 * virtualConsole.on("dir", () => { ... });
	 * // ... etc. See {@link https://console.spec.whatwg.org/#logging}
	 * @param {Console} console 
	 * @returns {VirtualConsole} 
	 * 
	 * @memberof VirtualConsole
	 */
	sendTo(console: Console): VirtualConsole;
}

export interface VirtualConsoleOptions {
}

// export interface WindowProperties {
// 	parsingMode?: string; // html, xml, auto, undefined
// 	contentType?: string;
// 	parser?: any;
// 	url?: string;
// 	referrer?: string;
// 	cookieJar?: CookieJar;
// 	cookie?: string;
// 	resourceLoader?: any;
// 	deferClose?: boolean;
// 	concurrentNodeIterators?: number;
// 	virtualConsole?: VirtualConsole;
// 	created?: (something: any, window: Window) => any;
// 	features?: FeatureOptions;
// 	top?: Window;
// }

// tough-cookie
export interface CookieJar {

}

// export declare function createVirtualConsole(options?: VirtualConsoleOptions): VirtualConsole;
// export declare function getVirtualConsole(window: Window): VirtualConsole;
// export declare function createCookieJar(): CookieJar;
// export declare function nodeLocation(node: Node): any;
// export declare function reconfigureWindow(window: Window, newProps: WindowProperties): void;
// export declare function changeURL(window: Window, url: string): void;

// export declare function jQueryify(window: Window, jqueryUrl: string, callback: (window: Window, jquery: JQuery) => any): void;

// export declare var debugMode: boolean;

// export interface DocumentWithParentWindow extends Document {
// 	parentWindow: Window;
// }

/**
 * Before creating any documents, you can modify the defaults for all future documents:
 */
// export declare var availableDocumentFeatures: FeatureOptions;
// export declare var defaultDocumentFeatures: FeatureOptions;
// export declare var applyDocumentFeatures: FeatureOptions;

// export interface Callback {
// 	(errors: Error[], window: Window): any;
// }

// export interface FeatureOptions {
//     /**
//      * Enables/disables fetching files over the file system/HTTP
//      * Allowed: ["script", "img", "css", "frame", "iframe", "link"] or false
//      * Default for jsdom.env: false
//      */
// 	FetchExternalResources?: string[] | boolean;

//     /**
//      * Enables/disables JavaScript execution
//      * Default: ["script"]
//      * Allowed: ["script"] or false, 
//      * Default for jsdom.env: false
//      */
// 	ProcessExternalResources?: string[] | boolean;

//     /**
//      * Filters resource downloading and processing to disallow those matching the given regular expression
//      * Default: false (allow all)
//      * Allowed: /url to be skipped/ or false
//      * Example: /http:\/\/example.org/js/bad\.js/
//      */
// 	SkipExternalResources?: string | boolean;
// }



/// divided /// edh below ///

type ParsingMode = "ht,;" | "ease-out" | "ease-in-out"; 
/**
 * both url and referrer are canonicalized before they're used, so e.g. if you pass in "https:example.com", jsdom will interpret that as if you had given "https://example.com/". If you pass an unparseable URL, the call will throw. (URLs are parsed and serialized according to the URL Standard.)
 * @typedef {string} URL
 */
type URL = string;
type Resources = "usable" | undefined;
type RunScripts = "dangerously" | "outside- only" | undefined;
type HTML = string;

export interface windowOptions {

	/**
	 * To enable executing scripts inside the page, you can use the runScripts: "dangerously" option
	 * If you are simply trying to execute script "from the outside", instead of letting <script> elements (and inline event handlers) run "from the inside", you can use the runScripts: "outside-only" option, which enables window.eval:
	 * @type {RunScripts}
	 * @memberof windowOptions
	 */
	runScripts?:			RunScripts
	/**
	 * contentType affects the value read from document.contentType, and how the document is parsed: as HTML or as XML. Values that are not "text/html" or an XML [mime type]{@link https://html.spec.whatwg.org/multipage/infrastructure.html#xml-mime-type} will throw. It defaults to "text/html".
	 * @type {string}
	 * @memberof windowOptions
	 */
	contentType?:			string
	parsingMode?:			ParsingMode
	/**
	 * 
	 * @type {URL} defaults to about:blank
	 * @memberof windowOptions
	 */
	url?:					URL
	/**
	 * referrer just affects the value read from document.referrer. It defaults to no referrer (which reflects as the empty string).
	 * @type {URL}
	 * @memberof windowOptions
	 */
	referrer?:				URL
	userAgent?:				string
	parseOptions?:			ParseOptions
	cookieJar?:				CookieJar
	virtualConsole?:		VirtualConsole
}

export interface ParseOptions {
	locationInfo?:			boolean
}


export interface Options {
	windowOptions?:			windowOptions
	resources?:				Resources
	beforeParse?:			(Window) => void
	/**
	 * userAgent affects the value read from navigator.userAgent, as well as the User-Agent header sent while fetching subresources. It defaults to `Mozilla/5.0 (${process.platform}) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/${jsdomVersion}`.
	 * @type {string}
	 * @memberof Options
	 */
	userAgent?:				string
	/**
	 * referrer just affects the value read from document.referrer. It defaults to no referrer (which reflects as the empty string).
	 * @type {URL}
	 * @memberof Options
	 */
	referrer?:				URL
	cookieJar?:				CookieJar
	url?:					URL
	/**
	 * contentType affects the value read from document.contentType, and how the document is parsed: as HTML or as XML. Values that are not "text/html" or an XML mime type will throw. It defaults to "text/html".
	 * @type {string}
	 * @memberof Options
	 */
	contentType?:			string
	/**
	 * includeNodeLocations preserves the location info produced by the HTML parser, allowing you to retrieve it with the nodeLocation() method (described below). It defaults to false to give the best performance, and cannot be used with an XML content type since our XML parser does not support location info.

	 * @type {boolean}
	 * @memberof Options
	 */
	includeNodeLocations?:	boolean
	virtualConsole?:		VirtualConsole
	runScripts?:			RunScripts
}

declare class JSDOM {

	/**
	 * the Window object that was created for you.
	 * @property {Window} window
	 * @memberof JSDOM
	 */
	window: Window;
	virtualConsole: VirtualConsole;
	cookieJar: CookieJar;

	/**
	 * Creates an instance of JSDOM.
	 * @param {string} html 
	 * @param {Options} [options] 
	 * 
	 * @memberof JSDOM
	 */
	constructor(html: HTML, options?:Options);

	/**
	 * The serialize() method will return the HTML [serialization]{@link https://html.spec.whatwg.org/#html-fragment-serialisation-algorithm} of the document, including the doctype
	 * 
	 * @returns {html} 
	 * 
	 * @memberof JSDOM
	 */
	serialize(): HTML;

	/**
	 * The nodeLocation() method will find where a DOM node is within the source document, returning the parse5 location info for the node:
	 * @param {Node} node 
	 * @returns {NodeLocation} 
	 * 
	 * @memberof JSDOM
	 */
	nodeLocation(node: Node): NodeLocation;


	runVMScript(script: string)

}


export interface NodeLocation {
	startOffset?: number
	endOffset?  : number
	startTag?   : number
	endTag?     : number
}

export interface Settings {
	// not sure the data type of Window.top
	windowTop?: any
	url       : URL
}

export declare function fragment(html: string): DocumentFragment;
 

// there is also
// fromURL -- returns Promise
// fromFile -- returns Promise


// ERIC MADE THESE NEW

// useragent
// // get window
// // virtualConsole
// // cookieJar
// // serialize
// // nodeLocation
// // runVMScript
// // reconfigure
// // fragment
// // fromURL
// // fromFile
// // normalizeFromURLOptions
// // export declare function normalizeFromFileOptions(filename, options): 
// declare type encoding string;
// // export declare function transformOptions(options, encoding)

// export declare toughCookie;
// export declare CookieJar;
// export declare VirtualConsole;
// export declare JSDOM;
// export declare function normalizeHTML(html: string, transportLayerEncodingLabel?: encoding): (html: string,encoding: encoding);
