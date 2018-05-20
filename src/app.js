/*

TODO:
- Consider method for adding vehicles by click

*/

// Load helper classes
const Integrate = require('./math/integrate.js');
const Vehicle = require('./vehicle/vehicle.js');
const Canvas = require('./utils/canvas.js');

// Load configuration variables
const { TIME_STEP, CANVAS_CONFIG } = require('./utils/config.js');

// Load pre-programmed traffic data file
const trafficList = require('./data/trafficList.json');

class App {
	// This constructor function gets called when the app is started
	constructor(trafficList, timeStep) {
		// Save the time step setting
		this.dt = timeStep;
		
		this.trafficList = []; // Holds the traffic list
		this.currentTick = -1; // Holds the value for the current time
		this.integrate = new Integrate(this.dt); // Initiate the integrating class
		this.cc = new Canvas(CANVAS_CONFIG.CANVAS_ID, CANVAS_CONFIG.CANVAS_WIDTH, CANVAS_CONFIG.CANVAS_HEIGHT); // Initiate a canvas to draw animations on
		
		// Parse the traffic data from file and then initiate the integration process
		this.setupHandlers()
			.parseTrafficList(trafficList)
			.init();
	}
	
	setupHandlers() {
		this.onUpdateHandler = this.onUpdate.bind(this);
		
		return this;
	}
	
	parseTrafficList(trafficList) {
		// Loop through each vehicle in the trafficList file
		for (let vehicle of trafficList) {
			const vehicleInstance = new Vehicle(vehicle.spawnTime, vehicle.driverOpts, vehicle.rogueBehaviour); // Create a vehicle object for each vehicle in the file
			this.trafficList.push(vehicleInstance); // Add the vehicle object to the trafficList array initiated above
		}
		
		return this;
	}
	
	init() {
		this.currentTick = 0.0; // At the start of integration, set the time = 0
		setTimeout(this.onUpdateHandler, 100); // Initiate integration after 100 milliseconds
	}
	
	preUpdate() {
		this.cc.newState(this.currentTick); // Prepare the canvas for a new frame
		for (let vehicle of this.trafficList) { // Loop through the trafficList array
			vehicle.onTickUpdateHandler(this.currentTick); // Update the trafficList to remove or add active/inactive vehicles
			this.cc.renderVehicle(vehicle); // Render the vehicle position for this frame
		}
	}
	
	onUpdate() {
		this.preUpdate(); // Run the pre-update routine
		
		this.trafficList = this.integrate.timeStep(this.trafficList); // Update the trafficList using data from the integration timestep
		this.currentTick += this.dt; // Update the time by dt
		
		window.requestAnimationFrame(this.onUpdateHandler); // Prepare for next frame
	}
}

/* Start the app */
const app = new App(trafficList, TIME_STEP);