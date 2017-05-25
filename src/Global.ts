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


