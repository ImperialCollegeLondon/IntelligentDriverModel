const Integrate = require('./math/integrate.js');
const Vehicle = require('./vehicle/vehicle.js');
const Canvas = require('./utils/canvas.js');
const WriteOutput = require('./helpers/write_output.js');

const { TIME_STEP, MAX_SIMULATION_TIME, CANVAS_CONFIG } = require('./utils/config.js');

const trafficList = require('./data/trafficList.json');

class App {
	constructor(trafficList, timeStep) {
		this.dt = timeStep;
		
		this.trafficList = [];
		this.currentTick = -1;
		this.integrate = new Integrate(this.dt);
		this.output = new WriteOutput();
		// this.cc = new Canvas(CANVAS_CONFIG.CANVAS_ID, CANVAS_CONFIG.CANVAS_WIDTH, CANVAS_CONFIG.CANVAS_HEIGHT);
		
		this.setupHandlers()
			.parseTrafficList(trafficList)
			.init();
	}
	
	setupHandlers() {
		this.onUpdateHandler = this.onUpdate.bind(this);
		
		return this;
	}
	
	parseTrafficList(trafficList) {
		for (let vehicleOpts of trafficList) {
			const vehicleInstance = new Vehicle(vehicleOpts);
			this.trafficList.push(vehicleInstance);
		}
		
		return this;
	}
	
	init() {
		this.simulationTime = 0.0;
		setTimeout(this.onUpdateHandler, 100);
	}
	
	preUpdate() {
		if (typeof this.cc !== 'undefined') {
			this.cc.newState(this.simulationTime);
		}
		
		for (let vehicle of this.trafficList) {
			vehicle.onTickHandler(this.simulationTime);
			
			if (typeof this.cc !== 'undefined') {
				this.cc.renderVehicle(vehicle);
			}
		}
	}
	
	onUpdate() {
		this.preUpdate();
		
		this.trafficList = this.integrate.timeStep(this.trafficList);
		this.output.formatTimeStepLine(this.simulationTime, this.trafficList);
		
		this.simulationTime += this.dt;
		if (this.simulationTime <= MAX_SIMULATION_TIME) {
			setImmediate(this.onUpdateHandler);
		} else {
			this.output.save();
		}
	}
}

/* App entry point */
const app = new App(trafficList, TIME_STEP);