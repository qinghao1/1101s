#!/usr/bin/env node
require('./helper.js');

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
	return task4(now, dir);
})(0, 'l');