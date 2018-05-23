const CONFIG = {
	TIME_STEP: 0.1,
	MAX_SIMULATION_TIME: Infinity,
	OUTPUT_FILE_DIRECTORY: './helpers/output/',
	CANVAS_CONFIG: {
		CANVAS_ID: 'trafficSimulator',
		CANVAS_WIDTH: 1500,
		CANVAS_HEIGHT: 100,
	},
	MAX_ROAD_LENGTH: 1000,
	VEHICLE_TYPE: {
		VIRTUAL: 'virtual',
		CAR: 'car',
		VAN: 'van',
		TRUCK: 'truck',
		CUSTOM: 'custom'
	},
	BEHAVIOUR_TYPE: {
		IS_SPAWNED: 'isSpawned',
		DESIRED_VELOCITY: 'desiredVelocity',
		SAFE_TIME_HEADWAY: 'safeTimeHeadway',
		MAX_ACCELERATION: 'maxAcceleration',
		DESIRED_DECELERATION: 'desiredDeceleration',
		JAM_DISTANCE: 'jamDistance',
		ACCELERATION_EXPONENT: 'accelerationExponent'
	},
};

module.exports = CONFIG;