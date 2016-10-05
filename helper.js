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

function turn_left(dg){
    ev3.runForDistance(motorA, Math.floor(-dg / 90 * 190), 100);
    ev3.runForDistance(motorB, Math.floor(dg / 90 * 190), 100);
}

function turn_right(dg){
    ev3.runForDistance(motorA, Math.floor(dg / 90 * 190), 100);
    ev3.runForDistance(motorB, Math.floor(-dg / 90 * 190), 100);
}

var light_threshold = 40; //TO BE CONFIRMED

function at_line() {
	return ev3.reflectedLightIntensity(colorSensor) < light_threshold;
}

var timeout = 1000; //timeout in ms