const fs = require('fs');
const { OUTPUT_FILE_DIRECTORY } = require('../utils/config.js');

class WriteOutput {
	constructor() {
		this.output = [];
	}
	
	formatTimeStepLine(simulationTime, trafficList) {
		let output = [simulationTime];
		let vehiclesOutput = [];
		for (let vehicle of trafficList) {
			if (vehicle.isSpawned === true && vehicle.isVirtual === false) {
				const indexVehicle = trafficList.indexOf(vehicle); /* Could this be done more efficiently? */
				const position = vehicle.position;
				const velocity = vehicle.velocity;
			
				vehiclesOutput.push([indexVehicle, position, velocity]);
			}
		}
		output.push(vehiclesOutput);
		this.output.push(output);
	}
	
	save() {
		const output = JSON.stringify(this.output);
		const fileName = Date.now().toString();
		const fileDirectory = OUTPUT_FILE_DIRECTORY + fileName + '.json';
		
		fs.writeFile(fileDirectory, output, (err) => {
			if (err) {
				throw err;
			}
			
			console.log(fileDirectory);
		});
	}
}

module.exports = WriteOutput;