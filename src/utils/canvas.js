const { MAX_ROAD_LENGTH } = require('./config.js');

class Canvas {
	constructor(canvasId, canvasWidth, canvasHeight) {
		this.cc = document.createElement('canvas');
		this.cc.id = canvasId;
		this.cc.width = canvasWidth;
		this.cc.height = canvasHeight;
		document.body.appendChild(this.cc);
		
		this.ctx = this.cc.getContext('2d');
	}
	
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.cc.width, this.cc.height);
		
		return this;
	}
	
	newState(simulationTime) {
		this.clearCanvas()
			.renderClock(simulationTime);
	}
	
	renderClock(simulationTime) {
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
		this.ctx.font = '10px serif';
		this.ctx.textBaseline = 'top';
		this.ctx.fillText(simulationTime.toFixed(2), 0, 0);
	}
	
	renderVehicle(vehicle) {
		if (vehicle.isSpawned === true) {
			const position = vehicle.position;
			const x = (position / MAX_ROAD_LENGTH) * this.cc.width;
			
			if (vehicle.isVirtual === true) {
				this.ctx.strokeStyle = 'rgba(229, 57, 53, 1.0)';
				this.ctx.beginPath();
				this.ctx.moveTo(x, 10);
				this.ctx.lineTo(x, 25);
				this.ctx.stroke();
			} else {
				const velocity = vehicle.velocity;
				const y = this.cc.height / 2;
				const radius = Math.max(Math.sqrt(velocity), 2); /* Draws faster cars as being larger for visual effect */
				const startAngle = 0;
				const endAngle = 2 * Math.PI;
				
				this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
				this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
				this.ctx.beginPath();
				this.ctx.arc(x, y, radius, startAngle, endAngle);
				this.ctx.fill();
			}
		}
	}
}

module.exports = Canvas;