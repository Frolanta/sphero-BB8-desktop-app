"use strict";

var sphero = require("sphero");


var BB8 = module.exports = function BB8(uuid) {

	this.sphero = sphero(uuid);
	this.direction = 0;
	this.speed = 0;
	this.moving = false;
	this.connected = false;
	this.canMove = false;
	this.batteryState = null;

	this.currentSpeed = 100;
	this.speed = 100;
	this.minSpeed = 50;
	this.maxSpeed = 250;

	this.acceleration = 0;

	this.movingUp = false;
	this.movingDown = false;
	this.rotatingLeft = false;
	this.rotatingRight = false;

	this.calibrating = false;
}

BB8.prototype.start = function (callback) {

	var self = this;

	self.sphero.connect(function() {
		  console.log("connected");
		  self.sphero.color({ red: 0, green: 255, blue: 0 });

		  setTimeout(function() {
		  	  self.sphero.setStabilization(1);
		  	  self.sphero.setInactivityTimeout(10);
			  self.sphero.color({ red: 0, green: 0, blue: 0 });
			  self.sphero.setBackLed(0);
			  self.connected = true;
			  self.sphero.getPowerState(function(err, data) {
				   self.batteryState = data.batteryState;
				        console.log("  recVer:", data.recVer);
					    console.log("  batteryState:", data.batteryState);
					    console.log("  batteryVoltage:", data.batteryVoltage);
					    console.log("  chargeCount:", data.chargeCount);
					    console.log("  secondsSinceCharge:", data.secondsSinceCharge);
				   if (self.batteryState !== 'Battery Charging') {
				   		self.canMove = true;
				   }
			  });

		  }, 2000);

		  callback();

	});
}

BB8.prototype.stop = function (callback) {

	var self = this;
	self.sphero.disconnect(function () {
		self.connected = false;
		callback();
	});
}

BB8.prototype.update = function () {
	if (!this.connected || !this.canMove) {
		return ;
	}

	if (this.movingUp) {
		this.speed = this.currentSpeed;
	} else {
		this.speed = 0;
	}

	if (this.rotatingLeft) {
		this.direction -= 10;
		if (this.direction < 0) {
			this.direction = 359;
		}
	} else if (this.rotatingRight) {
		this.direction += 10;
		if (this.direction > 360) {
			this.direction = 0;
		}
	}

	if (this.calibrating) {
		console.log("heading: " + this.direction);
		this.sphero.roll(0, this.direction);
		//this.sphero.setHeading(this.direction);
	} else {
		this.sphero.roll(this.speed, this.direction);
	}


}

BB8.prototype.rotateLeft = function () {
	this.rotatingLeft = true;
}

BB8.prototype.rotateRight = function () {
	this.rotatingRight = true;
}

BB8.prototype.moveUp = function () {
	this.movingUp = true;
}

BB8.prototype.moveDown = function () {
	this.movingDown = true;
}

BB8.prototype.stopRotateLeft = function () {
	this.rotatingLeft = false;
}

BB8.prototype.stopRotateRight = function () {
	this.rotatingRight = false;
}

BB8.prototype.stopMoveUp = function () {
	this.movingUp = false;
}

BB8.prototype.stopMoveDown = function () {
	this.movingDown = false;
}

BB8.prototype.brake = function () {
	this.speed = 0;
}

BB8.prototype.increaseSpeed = function () {
	this.currentSpeed += 10;
	if (this.currentSpeed > this.maxSpeed) {
		this.currentSpeed = this.maxSpeed;
	}
	console.log("speed: " + this.currentSpeed);
}

BB8.prototype.decreaseSpeed = function () {
	this.currentSpeed -= 10;
	if (this.currentSpeed < this.minSpeed) {
		this.currentSpeed = this.minSpeed;
	}
	console.log("speed: " + this.currentSpeed);
}

BB8.prototype.startCalibration = function () {
	console.log("start calibrating");
	this.calibrating = true;
	this.sphero.setBackLed(127);
	this.sphero.setStabilization(0);
}

BB8.prototype.stopCalibration = function () {
	console.log("stop calibrating");
	this.calibrating = false;
	this.sphero.setBackLed(0);
	this.sphero.setStabilization(1);
}


BB8.prototype.isConnected = function () {
	return this.connected;
}