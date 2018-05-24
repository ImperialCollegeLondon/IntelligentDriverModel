const fs = require('fs');

const { VEHICLE_TYPE, BEHAVIOUR_TYPE } = require('../utils/config.js');

class LatentBehaviour {
	constructor(implementTime, behaviourOpts) {
		this.implementTime = implementTime;
		this.behaviourOpts = behaviourOpts;
	}
}

class DatabaseVehicle {
	constructor(
		vehicleType,
		vehicleLength,
		position,
		velocity,
		initialVehicleBehaviour,
		latentVehicleBehaviour) {
			
			this.vehicleType = vehicleType;
			this.vehicleLength = vehicleLength;
			this.position = position;
			this.velocity = velocity;
			this.initialVehicleBehaviour = initialVehicleBehaviour;
			this.latentVehicleBehaviour = latentVehicleBehaviour;
	}
}

class WriteDatabase {
	constructor(fileName) {
		this.fileName = fileName.toString();
		this.output = [];
		
		this.produceDatabaseTemplate();
	}
	
	produceDatabaseTemplate() {
		const numberOfVehicles = 25; /* Specify number of vehicles */
		
		for (let i = 0; i < numberOfVehicles; i++) {
			const vehicleType = VEHICLE_TYPE.CAR;
			const vehicleLength = 4.8;
			const position = 450 - (12 * i); /* Start with i = 0 having most positive position */
			const velocity = 2.5;
			
			const initialVehicleBehaviour = {
				desiredVelocity: 5.4,
				safeTimeHeadway: 2.3,
				maxAcceleration: 1.5,
				desiredDeceleration: 1.2,
				jamDistance: 1.5,
				accelerationExponent: 4,
			};
			
			const spawnTime = 0;
			const latentVehicleBehaviour = this.vehicleSpawnPattern(spawnTime);
			
			/* Write additional latent behaviours here */
			
			const DatabaseVehicleInstance = new DatabaseVehicle(vehicleType, vehicleLength, position, velocity, initialVehicleBehaviour, latentVehicleBehaviour);
			this.output.push(DatabaseVehicleInstance);
		}
		
		this.saveDatabase();
	}
	
	vehicleSpawnPattern(spawnTime) {
		const behaviourOpts = [
			{
				behaviourType: BEHAVIOUR_TYPE.IS_SPAWNED,
				newBehaviour: true,
			}
		];
		
		const spawnPattern = new LatentBehaviour(spawnTime, behaviourOpts);
		return [spawnPattern];
	}
	
	saveDatabase() {
		const fileDirectory = './db/' + this.fileName + '.json';
		const output = JSON.stringify(this.output);
		
		fs.writeFile(fileDirectory, output, (err) => {
			if (err) {
				throw err;
			} else {
				
				console.log(fileDirectory);
			}
		});
	}
}

new WriteDatabase('trafficList');