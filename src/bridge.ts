import { Room , Group , Light } from './lighting';
import { DEFAULT_BRIDGE_IP , DEFAULT_USER_ID } from './config';

export class Bridge {

	ip: string;
	user: string;

	Rooms: Room[];
	Groups: Group[];
	Lights: Light[];

	constructor(ip: string, user = DEFAULT_USER_ID) {

	}

	get(category?: string, id?: number, noun?: string): any {
		let conn = new XMLHttpRequest();
		let result;
		console.log("in get() with category=" + category + "id=" + id + "noun=" + noun);
		conn.onreadystatechange = function () {
			console.log("statechange for get()this=>" + this.readyState + "||" + this.status);
			if (this.readyState != 4) return;
			if (this.status == 200) {
				result = JSON.parse(this.responseText);
				console.log("received: " + result);

				// we get the returned data
			}
			// end of state change: it can be after some time (async)
		}
		let method: string = "GET"
		let url = "http://" + this.ip + "/api/" + this.user + "/" + 
			(category ? category + "/" : "") + 
			(id ? id + "/" : "") + 
			(noun ? noun + "/" : "");
		console.log("GETing data to: " + url);
		conn.open(method, url, false);
		conn.setRequestHeader('Content-Type', 'application/json');
		conn.send();
		return result;
	}

	put(category: string, id: number, noun: string, postdata: any): any {
		let conn = new XMLHttpRequest();
		let result;
		console.log("in put() with category=" + category + "id=" + id + "noun=" + noun + "postdata=" + postdata);
		conn.onreadystatechange = function () {
			if (this.readyState != 4) return;
			if (this.status == 200) {
				result = JSON.parse(this.responseText);
				console.log("received: " + result);

				// we get the returned data
			}
			// end of state change: it can be after some time (async)
		}
		let method: string = "PUT";
		let url = "http://" + this.ip + "/api/" + this.user + "/" +
			(category ? category + "/" : "") +
			(id ? id + "/" : "") +
			(noun ? noun + "/" : "");
		console.log("PUTing data to: " + url);
		conn.open(method, url, false);
		conn.setRequestHeader('Content-Type', 'application/json');
		conn.send(JSON.stringify(postdata));
		return result;
	}
}

export const DEFAULT_BRIDGE: Bridge = new Bridge(DEFAULT_BRIDGE_IP);
