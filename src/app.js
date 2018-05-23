const Integrate = require('./math/integrate.js');
const Vehicle = require('./vehicle/vehicle.js');
const Canvas = require('./utils/canvas.js');
const WriteOutput = require('./helpers/write_output.js');

const { TIME_STEP, MAX_SIMULATION_TIME, CANVAS_CONFIG } = require('./utils/config.js');

const trafficList = require('./data/trafficList.json');

class App {
	constructor(trafficList, timeStep, maxSimulationTime, shouldOutputData) {
		this.dt = timeStep;
		this.maxSimulationTime = maxSimulationTime;
		this.shouldOutputData = shouldOutputData;
		
		this.trafficList = [];
		this.currentTick = -1;
		this.integrate = new Integrate(this.dt);
		this.isNode = (typeof setImmediate !== 'undefined') ? true : false; /* Detects runtime environment */
		
		if (this.isNode === true) {
			this.output = new WriteOutput();
		} else {
			this.cc = new Canvas(CANVAS_CONFIG.CANVAS_ID, CANVAS_CONFIG.CANVAS_WIDTH, CANVAS_CONFIG.CANVAS_HEIGHT);
		}
		
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
		if (this.isNode === false) {
			this.cc.newState(this.simulationTime);
		}
		
		for (let vehicle of this.trafficList) {
			vehicle.onTickHandler(this.simulationTime);
			
			if (this.isNode === false) {
				this.cc.renderVehicle(vehicle);
			}
		}
	}
	
	onUpdate() {
		this.preUpdate();
		
		this.trafficList = this.integrate.timeStep(this.trafficList);
		
		this.postUpdate();
		
		this.simulationTime += this.dt;
		if (this.simulationTime <= this.maxSimulationTime) {
			this.initNextTimeStep();
		} else {
			this.outputDataToFile();
		}
	}
	
	postUpdate() {
		if (this.isNode === true && this.shouldOutputData === true) {
			this.output.formatTimeStepLine(this.simulationTime, this.trafficList);
		}
	}
	
	outputDataToFile() {
		if (this.isNode === true && this.shouldOutputData === true) {
			this.output.save();
		}
	}
	
	initNextTimeStep() {
		if (this.isNode === true) {
			setImmediate(this.onUpdateHandler);
		} else {
			window.requestAnimationFrame(this.onUpdateHandler);
		}
	}
}

/* App entry point */
const app = new App(trafficList, TIME_STEP, MAX_SIMULATION_TIME, false);