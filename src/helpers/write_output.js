const fs = require('fs');

class WriteOutput {
	constructor() {
		this.output = [];
	}
	
	formatTimeStepLine(simulationTime, trafficList) {
		let output = [simulationTime];
		for (let vehicle of trafficList) {
			const indexVehicle = trafficList.indexOf(vehicle); /* Could this be done more efficiently? */
			const position = vehicle.position;
			const velocity = vehicle.velocity;
			
			output.push([indexVehicle, position, velocity]);
		}
		
		this.output.push(output);
	}
	
	saveOutput() {
		const output = JSON.stringify(this.output);
	}
}