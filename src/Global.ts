interface Number {
	toFixedNumber: (decimalPoints: number, base?: number) => number;
}
/**
 * Extends Number to allow for a multi-base toFixed which returns a Number
 * Rather than a traditional string
 * @param {number} decimalPoints
 * @param {number} [base] 
 * @returns {number} 
 */
Number.prototype.toFixedNumber = function (decimalPoints: number, base?: number): number {
	var pow = Math.pow(base || 10, decimalPoints);
	return +(Math.round(this * pow) / pow);
}

interface String {
	upperCaseFirst: () => string;
}
String.prototype.upperCaseFirst = function (): string {
	return this.charAt(0).toUpperCase() + this.slice(1);
}


interface Array<T> {
	includesArray: (find: any | any[]) => boolean;
}
/**
 * includesArray can check if every element of find is present in the array
 */
Array.prototype.includesArray = function (find: any | any[]): boolean {
	if (find instanceof Array) {
		for(let i=0; i<find.length; i++){
			let par=find[i];
			if (!this.includes(par)) { console.log(`${this}.includesArray(${find}) ~~~ testing ~~~ ${par} not in ${this}`); return false };
		}
		console.log(`${this}.includesArray(${find}) ~~~ testing ~~~includesArray(${find}) was in (${this} returning true`);
		// all the way through the find array, every element must be present
		return true;
	} else {
		return this.includes(find);
	}
}
