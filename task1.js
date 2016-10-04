#!/usr/bin/env node
var ev3 = require('./node_modules/ev3source/ev3.js');
var source = require('./node_modules/ev3source/source.js');

var motorA = ev3.motorA();
var motorB = ev3.motorB();

//HELPER FUNCTIONS
var distance_scaling = 20 //TO BE CONFIRMED

function go_forward(distance) { //distance is in cm
ev3.runForDistance(motorA, distance * distance_scaling, 100);
ev3.runForDistance(motorB, distance * distance_scaling, 100);
}

var turn_distance = 1000 //TO BE CONFIRMED

function turn_left(degree) {
ev3.runForDistance(motorA, turn_distance * degree / 90, 100);
ev3.runForDistance(motorB, -turn_distance * degree / 90, 100);
}

function turn_right(degree) {
ev3.runForDistance(motorA, -turn_distance * degree / 90, 100);
ev3.runForDistance(motorB, turn_distance * degree / 90, 100);
}

var light_threshold = 50; //TO BE CONFIRMED

function at_line() {
	return ev3.reflectedLightIntensity(colorSensor) < light_threshold;
}

var timeout = 500; //timeout in ms

//Task 1
go_forward(10);

//Task 2
turn_right(90);

//Task 3
(function task3() {
	//checks for line
	if (!at_line()) {
	go_forward(5);
	} else {
	turn_right(30);
	}
	//timeout in ms
	ev3.pause(timeout);
	//repeat
	task3();
})()

//Task 4
(function task4(degree, curr) { 
//degree is current bearing relative to last seen line (clockwise is positive)
//curr is current rotation direction (l,r)
	if (at_line()) {
		var now = 0
		var dir = 'l';
		go_forward(2);
	} else {
		//find the line! keeps turning between 90 left and 90 right to find the line
		var turn_increment = 15; //divisor of 90
		if (curr === 'r') {
			//turn right until -90, then turn left
			if (degree - turn_increment < -90) {
				var dir = 'l';
				var now = degree
			} else {
				turn_right(turn_increment);
				var now = degree - turn_increment;
				var dir = curr;
			}
		} else {
			//turn left until +90, then turn right
			if (degree + turn_increment > 90) {
				var dir = 'r';
				var now = degree
			} else {
				turn_left(turn_increment);
				var now = degree + turn_increment;
				var dir = curr;
			}
		}
	}
	//timeout in ms
	ev3.pause(timeout);
	//repeat
	task4(now, dir);
})()