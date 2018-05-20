const { BEHAVIOUR_TYPE, DEFAULT_DRIVER_OPTS, MAX_ROAD_LENGTH } = require('../utils/config.js');

/*

opts = [
	{
		(*)"spawnTime": 10,
		(*)"driverOpts": "default",
		(*)"rogueBehaviour": [
			{
				(*)"implementTime": 10,
				(*)"rogueOpts": [["desiredVelocity", 12.5], ["safeTimeHeadway", 3]]
			}, {
				"implementTime": 200,
				"rogueOpts": [["resetDriverOpts", 0]]
			}
		]
	}
];

Note: Keys marked (*) are required
Note: driverOpts can be "default" or an object of custom driver behaviour properties
Note: implementTime is the time AFTER SPAWN that the behaviour comes into effect
Note: rogueOpts is an array of arrays
Note: The second parameter in the rogueOpts arrays is the new value to be used

*/

// Class for the vehicles
class Vehicle {
	// This function is called when each vehicle is extracted from the data list
	constructor(spawnTime, driverOpts, rogueBehaviour) {
		this.isSpawned = false; // Is the vehicle active?
		this.rogueBehaviour = []; // This stores any changes in behaviour of the vehicle after the initial declaration
		this.spawnTime = spawnTime; // Set the vehicle spawn time
		this.position = 0; // Initial position = 0
		this.velocity = 0; // Initial velocity = 0
		this.driverOpts = driverOpts; // Store the initial driver behaviours
		
		// Parse the initial driver behaviour and then parse the rogue behaviour
		this.parseDriverOpts(driverOpts)
			.parseRogueBehaviour(rogueBehaviour);
	}
	
	// Sets the initial behaviour of each vehicle based on the default values or custom values supplied
	parseDriverOpts(driverOpts) {
		if (driverOpts === 'default') {
			this.position = this.position || DEFAULT_DRIVER_OPTS.initialPosition;
			this.velocity = this.velocity || DEFAULT_DRIVER_OPTS.initialVelocity;
			this.desiredVelocity = DEFAULT_DRIVER_OPTS.desiredVelocity;
			this.safeTimeHeadway = DEFAULT_DRIVER_OPTS.safeTimeHeadway;
			this.maxAcceleration = DEFAULT_DRIVER_OPTS.maxAcceleration;
			this.desiredDeceleration = DEFAULT_DRIVER_OPTS.desiredDeceleration;
			this.jamDistance = DEFAULT_DRIVER_OPTS.jamDistance;
		} else {
			this.position = this.position || driverOpts.initialPosition;
			this.velocity = this.velocity || driverOpts.initialVelocity;
			this.desiredVelocity = driverOpts.desiredVelocity;
			this.safeTimeHeadway = driverOpts.safeTimeHeadway;
			this.maxAcceleration = driverOpts.maxAcceleration;
			this.desiredDeceleration = driverOpts.desiredDeceleration;
			this.jamDistance = driverOpts.jamDistance;
		}
		
		return this;
	}
	
	// Sets up any rogue behaviour of the vehicle
	parseRogueBehaviour(rogueBehaviour) {
		// Loop through rogue behaviour array from the traffic data list
		for (let behaviour of rogueBehaviour) {
			// Create an instance of any rogue behaviours
			// Implement time = the time at which the rogue behaviour activates after the vehicle has spawned
			// Rogue opts = name of behaviour to change (i.e. desiredVelocity) and the new value to use
			const rogueBehaviourInstance = {
				implementTime: this.spawnTime + behaviour.implementTime,
				rogueOpts: behaviour.rogueOpts
			};
			
			// Store the behaviours in an array
			this.rogueBehaviour.push(rogueBehaviourInstance);
		}
		
		// Sorts rogueBehaviour array according to implementTime
		// This prevents having to loop through the entire array of rogue behaviours each time
		// We just want to check if the first behaviour should be activated
		// If not, we do not need to check the remaining behaviours since the array is sorted
		// Efficiency FTW
		this.rogueBehaviour.sort((a, b) => {
			return (a.implementTime <= b.implementTime) ? -1 : 1;
		});
	}
	
	// For every new frame, this function is called
	// We try to keep the steps in this call to a minimum so that fewer operations are carried out
	// for each frame
	onTickUpdateHandler(currentTick) {
		// This function basically checks if a vehicle needs to be spawned
		// And updates any rogue behavious that may have become active
		this.updateSpawnPointer(currentTick)
			.updateRogueBehaviourPointer(currentTick);
	}
	
	// Check if vehicle needs to be activated or deactivated
	updateSpawnPointer(currentTick) {
		if (this.isSpawned === false && this.spawnTime <= currentTick) {
			this.isSpawned = true;
		}
		if (this.isSpawned === true && this.position >= MAX_ROAD_LENGTH) {
			//this.isSpawned = false;
		}
		
		return this;
	}
	
	// Check if a new behaviour of the vehicle is active
	updateRogueBehaviourPointer(currentTick) {
		// Good use of efficient short circuit evaluation
		if (this.isSpawned === true && this.rogueBehaviour.length > 0 && this.rogueBehaviour[0].implementTime <= currentTick) {
			// Loop through the list of rogue behaviours
			for (let behaviourList of this.rogueBehaviour) {
				// If behaviour should be activated
				if (behaviourList.implementTime <= currentTick) {
					// Loop through the options of the behaviour
					for (let opts of behaviourList.rogueOpts) {
						const [behaviourType, updatedValue] = opts;
						this.updateBehaviour(behaviourType, updatedValue); // Pass the options to an updateBehaviour handler that does the messy work
					}
					
					// Remove from rogueBehaviour list once changes implemented
					const behaviourListIndex = this.rogueBehaviour.indexOf(behaviourList);
					this.rogueBehaviour.splice(behaviourListIndex, 1);
				}
			}
		}
	}
	
	// Messy work of identifying which behaviour is being updated
	updateBehaviour(behaviourType, updatedValue) {
		switch (behaviourType) {
			case BEHAVIOUR_TYPE.DESIRED_VELOCITY:
				this.setDesiredVelocity(updatedValue);
				break;
				
			case BEHAVIOUR_TYPE.SAFE_TIME_HEADWAY:
				this.setSafeTimeHeadway(updatedValue);
				break;
				
			case BEHAVIOUR_TYPE.MAX_ACCELERATION:
				this.setMaxAcceleration(updatedValue);
				break;
				
			case BEHAVIOUR_TYPE.DESIRED_DECELERATION:
				this.setDesiredDeceleration(updatedValue);
				break;
				
			case BEHAVIOUR_TYPE.JAM_DISTANCE:
				this.setJamDistance(updatedValue);
				break;
				
			case BEHAVIOUR_TYPE.DRIVER_OPTS:
				this.resetDriverOpts();
				break;
				
		}
	}
	
	// All of the functions below are responsible for updating the behaviour of the vehicles
	setSpawned(isSpawned) {
		this.isSpawned = isSpawned;
	}
	
	setDesiredVelocity(desiredVelocity) {
		this.desiredVelocity = desiredVelocity;
	}
	
	setSafeTimeHeadway(safeTimeHeadway) {
		this.safeTimeHeadway = safeTimeHeadway;
	}
	
	setMaxAcceleration(maxAcceleration) {
		this.maxAcceleration = maxAcceleration;
	}
	
	setDesiredDeceleration(desiredDeceleration) {
		this.desiredDeceleration = desiredDeceleration;
	}
	
	setJamDistance(jamDistance) {
		this.jamDistance = jamDistance;
	}
	
	resetDriverOpts() {
		this.parseDriverOpts(this.driverOpts);
	}
}

module.exports = Vehicle;