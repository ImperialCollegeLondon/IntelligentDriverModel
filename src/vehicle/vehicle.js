const { BEHAVIOUR_TYPE, VEHICLE_TYPE } = require('../utils/config.js');

/*

[
	{
		vehicleType: 'virtual' / 'car' / 'van' / 'truck',
		vehicleLength: [Number] - length of vehicle from front bumper to back bumper
		position: [Number] - initial position,
		velocity: [Number] - initial velocity,
		initialVehicleBehaviour: {
			desiredVelocity: [Number],
			safeTimeHeadway: [Number] - reaction time of driver,
			maxAcceleration: [Number],
			desiredDeceleration: [Number],
			jamDistance: [Number] - gap to leave to back bumper of next car,
			accelerationExponent: [Number] - controls acceleration behaviour,
		},
		latentVehicleBehaviour: [
			{
				implementTime: [Number] - time to implement behaviour relative to gameTime,
				behaviourOpts: [
					behaviourType: 'isSpawned' / 'desiredVelocity' / 'safeTimeHeadway' / 'maxAcceleration' / 'desiredDeceleration' / 'jamDistance' / 'accelerationExponent',
					newBehaviour: [Boolean / Number]
				]
			}
		]
	}
]

*/

class Vehicle {
	constructor(opts) {
		/* opts = { vehicleType, vehicleLength, position, velocity, initialVehicleBehaviour, latentVehicleBehaviour } */
		this.opts = opts;
		this.isSpawned = false;
		this.isVirtual = false;
		this.position = 0;
		this.velocity = 0;
		
		this.init(opts)
			.parseInitialVehicleBehaviour()
			.parseLatentVehicleBehaviour();
	}
	
	init(opts) {
		this.vehicleType = opts.vehicleType;
		this.vehicleLength = opts.vehicleLength;
		this.position = opts.position;
		this.velocity = opts.velocity;
		this.isVirtual = (this.vehicleType === VEHICLE_TYPE.VIRTUAL);
		
		return this;
	}
	
	parseInitialVehicleBehaviour() {
		/* Allows for adding behaviours according to default values later */
		this.vehicleBehaviour = this.opts.initialVehicleBehaviour;
		
		return this;
	}
	
	parseLatentVehicleBehaviour() {
		this.latentVehicleBehaviour = this.opts.latentVehicleBehaviour;
		
		/* Sort the latentVehicleBehaviour array by implementTime */
		this.latentVehicleBehaviour.sort((a, b) => (a.implementTime <= b.implementTime) ? -1 : 1);
		
		return this;
	}
	
	onTickHandler(simulationTime) {
		this.updateVehicleBehaviour(simulationTime);
	}
	
	updateVehicleBehaviour(simulationTime) {
		if (this.latentVehicleBehaviour.length > 0 && this.latentVehicleBehaviour[0].implementTime <= simulationTime) {
			for (let latentVehicleBehaviour of this.latentVehicleBehaviour) {
				if (latentVehicleBehaviour.implementTime <= simulationTime) {
					for (let vehicleBehaviour of latentVehicleBehaviour.behaviourOpts) {
						this.activateVehicleBehaviour(vehicleBehaviour.behaviourType, vehicleBehaviour.newBehaviour);
					}
					
					const behaviourIndex = this.latentVehicleBehaviour.indexOf(latentVehicleBehaviour);
					this.latentVehicleBehaviour.splice(behaviourIndex, 1);
				}
			}
		}
	}
	
	activateVehicleBehaviour(behaviourType, newBehaviour) {
		switch(behaviourType) {
			case BEHAVIOUR_TYPE.IS_SPAWNED:
				this.setIsSpawned(newBehaviour);
				break;
			
			case BEHAVIOUR_TYPE.DESIRED_VELOCITY:
				this.setDesiredVelocity(newBehaviour);
				break;
			
			case BEHAVIOUR_TYPE.SAFE_TIME_HEADWAY:
				this.setSafeTimeHeadway(newBehaviour);
				break;
			
			case BEHAVIOUR_TYPE.MAX_ACCELERATION:
				this.setMaxAcceleration(newBehaviour);
				break;
			
			case BEHAVIOUR_TYPE.DESIRED_DECELERATION:
				this.setDesiredDeceleration(newBehaviour);
				break;
			
			case BEHAVIOUR_TYPE.JAM_DISTANCE:
				this.setJamDistance(newBehaviour);
				break;
			
			case BEHAVIOUR_TYPE.ACCELERATION_EXPONENT:
				this.setAccelerationExponent(newBehaviour);
				break;
		}
	}
	
	setIsSpawned(newBehaviour) {
		this.isSpawned = newBehaviour;
	}
	
	setDesiredVelocity(newBehaviour) {
		this.desiredVelocity = newBehaviour;
	}
	
	setSafeTimeHeadway(newBehaviour) {
		this.safeTimeHeadway = newBehaviour;
	}
	
	setMaxAcceleration(newBehaviour) {
		this.maxAcceleration = newBehaviour;
	}
	
	setDesiredDeceleration(newBehaviour) {
		this.desiredDeceleration = newBehaviour;
	}
	
	setJamDistance(newBehaviour) {
		this.jamDistance = newBehaviour;
	}
	
	setAccelerationExponent(newBehaviour) {
		this.accelerationExponent = newBehaviour;
	}
	
	/* TODO: Add option to reset driver stats */
}

module.exports = Vehicle;