class Integrate {
	constructor(dt) {
		this.dt = dt;
	}
	
	timeStep(trafficList) {
		let updatedPositionVelocityList = [];
		let indexVehicle = -1;
		let indexVehicleLeading = -1; /* WARNING: This only works if trafficList is sorted by position */
		
		for (let vehicle of trafficList) {
			indexVehicle += 1;
			
			if (vehicle.isSpawned === true) {
				
				const opts = {
					isVirtual: vehicle.isVirtual,
					desiredVelocity: vehicle.vehicleBehaviour.desiredVelocity,
					safeTimeHeadway: vehicle.vehicleBehaviour.safeTimeHeadway,
					maxAcceleration: vehicle.vehicleBehaviour.maxAcceleration,
					desiredDeceleration: vehicle.vehicleBehaviour.desiredDeceleration,
					jamDistance: vehicle.vehicleBehaviour.jamDistance,
					accelerationExponent: vehicle.vehicleBehaviour.accelerationExponent
				};
				
				const isVehicleLeading = (indexVehicleLeading < 0) ? true : false;
				
				const position = vehicle.position;
				const velocity = vehicle.velocity;
				
				const positionAhead = (isVehicleLeading === true) ? Infinity : trafficList[indexVehicleLeading].position - trafficList[indexVehicleLeading].vehicleLength;
				const velocityAhead = (isVehicleLeading === true) ? velocity : trafficList[indexVehicleLeading].velocity;
				
				const [newPosition, newVelocity] = this.rk4(position, velocity, positionAhead, velocityAhead, opts);
				
				updatedPositionVelocityList.push([
					indexVehicle,
					newPosition,
					newVelocity
				]);
				
				indexVehicleLeading = indexVehicle;
			}
		}
		
		return this.updateTrafficList(trafficList, updatedPositionVelocityList);
	}
	
	updateTrafficList(trafficList, updatedPositionVelocityList) {
		for (let update of updatedPositionVelocityList) {
			let [indexVehicle, newPosition, newVelocity] = update;
			trafficList[indexVehicle].position = newPosition;
			trafficList[indexVehicle].velocity = newVelocity;
		}
		
		return trafficList;
	}
	
	rk4(position, velocity, positionAhead, velocityAhead, opts) {
		
		const k0 = this.dt * this.dxdt(velocity, opts);
		const l0 = this.dt * this.dvdt(position, velocity, positionAhead, velocityAhead, opts);
		
		const k1 = this.dt * this.dxdt(velocity + l0 / 2, opts);
		const l1 = this.dt * this.dvdt(position + k0 / 2, velocity + l0 / 2, positionAhead, velocityAhead, opts);
		
		const k2 = this.dt * this.dxdt(velocity + l1 / 2, opts);
		const l2 = this.dt * this.dvdt(position + k1 / 2, velocity + l1 / 2, positionAhead, velocityAhead, opts);
		
		const k3 = this.dt * this.dxdt(velocity + l2, opts);
		const l3 = this.dt * this.dvdt(position + k2, velocity + l2, positionAhead, velocityAhead, opts);
		
		const xdt = (k0 + 2 * k1 + 2 * k2 + k3) / 6;
		const vdt = (l0 + 2 * l1 + 2 * l2 + l3) / 6;
		
		let newPosition = position + xdt;
		let newVelocity = velocity + vdt;
		
		return [newPosition, newVelocity];
	}
	
	dxdt(velocity, opts) {
		/* Zero velocity for virtual vehicle */
		if (opts.isVirtual === true) {
			return 0;
		}
		
		return velocity;
	}
	
	dvdt(position, velocity, positionAhead, velocityAhead, opts) {
		/* Zero acceleration for virtual vehicle */
		if (opts.isVirtual === true) {
			return 0;
		}
		
		const { desiredVelocity, safeTimeHeadway, maxAcceleration, desiredDeceleration, jamDistance, accelerationExponent } = opts;
		
		const positionDifference = position - positionAhead;
		const velocityDifference = velocity - velocityAhead;
		
		const s = jamDistance + Math.max((safeTimeHeadway * velocity) + ((velocity * velocityDifference) / (2 * Math.sqrt(maxAcceleration * desiredDeceleration))), 0);
		
		return maxAcceleration * (1 - Math.pow(velocity / desiredVelocity, accelerationExponent) - Math.pow(s / positionDifference, 2));
	}
}

module.exports = Integrate;