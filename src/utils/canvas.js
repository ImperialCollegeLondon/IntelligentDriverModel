// Load configuration variables
const { MAX_ROAD_LENGTH } = require('./config.js');

// This bit is mostly boring, it is responsible for rendering the animation
class Canvas {
	constructor(canvasId, canvasWidth, canvasHeight) {
		this.cc = document.createElement('canvas'); // Create a canvas to draw animations on
		this.cc.id = canvasId; // Set the ID of the canvas so that we can make changes later if necessary
		this.cc.width = canvasWidth; // Set the width of the canvas
		this.cc.height = canvasHeight; // Set the height of the canvas
		document.body.appendChild(this.cc); // Add the canvas to the webpage for viewing
		
		this.ctx = this.cc.getContext('2d'); // Allows you to be able to draw on canvas
	}
	
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.cc.width, this.cc.height); // Clear the canvas in preparation for new frame
	}
	
	// When a new frame is ready to be drawn, this function is called
	newState(currentTick) {
		this.clearCanvas(); // Clear canvas
		
		this.renderClock(currentTick); // Draw the current time
	}
	
	// This function draws the time of the current timestep
	renderClock(currentTick) {
		this.ctx.font = '10px serif';
		this.ctx.textBaseline = 'top';
		this.ctx.fillText(currentTick.toFixed(2), 0, 0);
	}
	
	// This function renders the vehicles in each frame
	renderVehicle(vehicle) {
		// First, we check if the vehicle is active
		if (vehicle.isSpawned) {
			const position = vehicle.position;
			const velocity = vehicle.velocity;
			const x = (position / MAX_ROAD_LENGTH) * this.cc.width;
			const y = this.cc.height / 2;
			const radius = Math.max(velocity / 3, 3); // Some maths magic that draws faster vehicles as being larger than slower vehicles
			const startAngle = 0;
			const endAngle = 2 * Math.PI;
		
			this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
			this.ctx.beginPath();
			this.ctx.arc(x, y, radius, startAngle, endAngle);
			this.ctx.fill();
		}
	}
}

module.exports = Canvas;