class Gaussian {
	constructor(mean, standardDeviation, skew = 0) {
		this.mean = mean;
		this.standardDeviation = standardDeviation;
		this.skew = skew;
	}
	
	generateRandomNormal() {
		let s = 0;
		let v1 = 0;
		let v2 = 0;
		
		do {
			const u1 = Math.random();
			const u2 = Math.random();
			
			v1 = (2 * u1) - 1;
			v2 = (2 * u2) - 1;
			
			s = Math.pow(v1, 2) + Math.pow(v2, 2);
		} while (s === 0 || s >= 1);
		
		// Possible store v2 to be used for future call for efficiency savings?
		return this.mean + (this.standardDeviation * v1 * Math.sqrt(-2 * (Math.log(s) / s)));
	}
}

const G = new Gaussian(1.8, 0.3);
const G_arr = [];

for (let i = 0; i < 1000000; i++) {
	G_arr.push(G.generateRandomNormal());
}

Array.prototype.mean = function() {
	const l = this.length;
	let s = 0;
	for (let el of this) {
		s += el;
	}
	return s / l;
};

Array.prototype.std = function() {
	const mean = this.mean();
	const l = this.length;
	let s = 0;
	for (let el of this) {
		s += Math.pow(el - mean, 2);
	}
	return Math.sqrt(s / l);
};

Array.prototype.maximum = function() {
	let a = this[0];
	for (let i of this) {
		if (i > a) {
			a = i;
		}
	}
	return a;
};

Array.prototype.minimum = function() {
	let a = this[0];
	for (let i of this) {
		if (i < a) {
			a = i;
		}
	}
	return a;
};

console.log(G_arr.mean());
console.log(G_arr.std());
console.log(G_arr.maximum());
console.log(G_arr.minimum());