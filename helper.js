#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

var motorA = ev3.motorA();
var motorB = ev3.motorB();
var colorSensor = ev3.colorSensor();

//HELPER FUNCTIONS

function go_forward(distance) { //distance is in cm
	ev3.runForTime(motorA, 1000, distance * 24);
	ev3.runForTime(motorB, 1000, distance * 24);
}

function turn_left(degree) {
	ev3.runForTime(motorA, 1000, -degree / 90 * 235);
	ev3.runForTime(motorB, 1000, degree / 90 * 235);
}

function turn_right(degree) {
	ev3.runForTime(motorA, 1000, degree / 90 * 235);
	ev3.runForTime(motorB, 1000, -degree / 90 * 235);
}

var light_threshold = 50; //TO BE CONFIRMED

function at_line() {
	return ev3.reflectedLightIntensity(colorSensor) < light_threshold;
}

var timeout = 1000; //timeout in ms