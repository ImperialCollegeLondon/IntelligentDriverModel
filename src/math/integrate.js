// This module carries out the integration
// We use Runge Kutta order 4 to carry out the integral

class Integrate {
	constructor(dt) {
		this.dt = dt; // Save the size of the time steps
	}
	
	// This function initiates the time step
	timeStep(trafficList) {
		let updatedPositionVelocityList = []; // We keep track of the new positions and velocities
		let carCounter = -1; // We use a car counter to loop through the array
		
		// Loop through each vehicle
		for (let vehicle of trafficList) {
			carCounter += 1;
			
			// Check if vehicle is active
			if (vehicle.isSpawned === true) {
				
				// Store the parameters for the vehicle
				const opts = {
					jamDistance: vehicle.jamDistance,
					safeTimeHeadway: vehicle.safeTimeHeadway,
					maxAcceleration: vehicle.maxAcceleration,
					desiredDeceleration: vehicle.desiredDeceleration,
					desiredVelocity: vehicle.desiredVelocity,
				};
				
				// Is this vehicle in front of queue?
				const isVehicleLeading = (carCounter === 0 || trafficList[carCounter - 1].isSpawned === false);
				
				const position = vehicle.position;
				const velocity = vehicle.velocity;
				
				// If the vehicle was in front, we need to manually give values for the position and velocity of the car ahead
				// since there is no vehicle in front. We use Infinity for the position of the next car, and we use the velocity
				// of the current vehicle as the velocity of the vehicle in front.
				const positionAhead = (isVehicleLeading === true) ? Infinity : trafficList[carCounter - 1].position;
				const velocityAhead = (isVehicleLeading === true) ? velocity : trafficList[carCounter - 1].velocity;
				
				// Send the data to the integrating step
				const [newPosition, newVelocity] = this.rk4(position, velocity, positionAhead, velocityAhead, opts);
				
				// Push the new values to the trafficList array
				updatedPositionVelocityList.push([
					carCounter,
					newPosition,
					newVelocity
				]);
			}
		}
		
		// Update the trafficList and then return it
		return this.updateTrafficList(trafficList, updatedPositionVelocityList);
	}
	
	// We don't want to update the position and velocity of the vehicles mid-timestep
	// since this will affect the timestep calculations of other vehicles in the queue.
	// Instead, we store the new updated values in an array and update the trafficList
	// at the end of the timestep
	updateTrafficList(trafficList, updatedPositionVelocityList) {
		// Loop through each new updated value
		for (let update of updatedPositionVelocityList) {
			let [carCounter, newPosition, newVelocity] = update;
			trafficList[carCounter].position = newPosition; // Update the position
			trafficList[carCounter].velocity = newVelocity; // Update the velocity
		}
		
		return trafficList; // Send the updated trafficList back
	}
	
	// Everything below this line is used for the integration, including the two first
	// order differential equations that govern the behaviour described in the IDM.
	// This function applies the Runge Kutta method
	// See https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
	rk4(position, velocity, positionAhead, velocityAhead, opts) {
		
		const k0 = this.dt * this.dxdt(velocity);
		const l0 = this.dt * this.dvdt(position, velocity, positionAhead, velocityAhead, opts);
		
		const k1 = this.dt * this.dxdt(velocity + l0 / 2);
		const l1 = this.dt * this.dvdt(position + k0 / 2, velocity + l0 / 2, positionAhead, velocityAhead, opts);
		
		const k2 = this.dt * this.dxdt(velocity + l1 / 2);
		const l2 = this.dt * this.dvdt(position + k1 / 2, velocity + l1 / 2, positionAhead, velocityAhead, opts);
		
		const k3 = this.dt * this.dxdt(velocity + l2);
		const l3 = this.dt * this.dvdt(position + k2, velocity + l2, positionAhead, velocityAhead, opts);
		
		const xdt = (k0 + 2 * k1 + 2 * k2 + k3) / 6;
		const vdt = (l0 + 2 * l1 + 2 * l2 + l3) / 6;
		
		let newPosition = position + xdt;
		let newVelocity = velocity + vdt;
		
		return [newPosition, newVelocity];
	}
	
	dxdt(velocity) {
		return velocity;
	}
	
	dvdt(position, velocity, positionAhead, velocityAhead, opts) {
		const { jamDistance, safeTimeHeadway, maxAcceleration, desiredDeceleration, desiredVelocity } = opts;
		
		const positionDifference = positionAhead - position;
		const velocityDifference = velocityAhead - velocity;
		
		const s = jamDistance + Math.max((safeTimeHeadway * velocity) + ((velocity * velocityDifference) / (2 * Math.sqrt(maxAcceleration * desiredDeceleration))), 0);
		return maxAcceleration * (1 - Math.pow(velocity / desiredVelocity, 4) - Math.pow(s / positionDifference, 2));
	}
}

module.exports = Integrate;