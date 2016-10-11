#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

var eye = ev3.ultrasonicSensor();
var motorA = ev3.motorA();
var motorB = ev3.motorB();
var motorC = ev3.motorC();
var colourSensor = ev3.colorSensor();
var hand1 = ev3.touchSensor3();
var hand2 = ev3.touchSensor4();

function forward() {
    ev3.runForDistance(motorA, -300, 1000);
    ev3.runForDistance(motorB, -300, 1000); // run for unit, need to be adjusted
}

function backward() {
    ev3.runForDistance(motorA, 100, 500);
    ev3.runForDistance(motorB, 100, 500);
}

function turn_car(angle) {
    angle = Math.floor(angle/15);
    ev3.runForDistance(motorA, -95*angle, 600); // turn car test on 90 degree
    ev3.runForDistance(motorB, 95*angle, 600);
}

function at_line() {
	return ev3.reflectedLightIntensity(colourSensor) < 40;
}

var angle = 0;
var dir = 1; //1 is right -1 is left

function find_line() {
	var delta = 15;
	while (!at_line()) {
		if (angle + delta > 60) {
			dir = -dir;
		}
		if (dir > 0) {
			turn_car(delta);
			angle += delta;
		} else {
			turn_car(-delta);
			angle -= delta;
		}
	}
	angle = 0;
}

while(true) {
	if at_line() {
		forward();
	} else {
		backward();
		find_line();
	}
}