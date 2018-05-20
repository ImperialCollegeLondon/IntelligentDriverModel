const CONFIG = {
	TIME_STEP: 0.05,
	CANVAS_CONFIG: {
		CANVAS_ID: '',
		CANVAS_WIDTH: 1500,
		CANVAS_HEIGHT: 100,
	},
	MAX_ROAD_LENGTH: 1000,
	DEFAULT_DRIVER_OPTS: {
		initialPosition: 0.0,
		initialVelocity: 0.0,
		desiredVelocity: 13.4, /* 30mph in m/s */
		safeTimeHeadway: 3.3, /* 3.3 s */
		maxAcceleration: 4.3, /* 0-60mph in 8s */
		desiredDeceleration: 2.3, /* 3mph in 1 s */
		jamDistance: 1.5, /* 1.50 m */
	},
	BEHAVIOUR_TYPE: {
		DESIRED_VELOCITY: 'desiredVelocity',
		SAFE_TIME_HEADWAY: 'safeTimeHeadway',
		MAX_ACCELERATION: 'maxAcceleration',
		DESIRED_DECELERATION: 'desiredDeceleration',
		JAM_DISTANCE: 'jamDistance',
		DRIVER_OPTS: 'resetDriverOpts'
	}
};

module.exports = CONFIG;