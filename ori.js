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


function move_backward_unit() {
    ev3.runForDistance(motorA, 500, 500);
    ev3.runForDistance(motorB, 500, 500);
}
function detect_back_attack() {
    if (ev3.touchSensorPressed(hand1) || ev3.touchSensorPressed(hand2)) {
        move_backward_unit();
        detect_back_attack();
    } else {
        ;
    }
}
function motor_c_turn(angle) {// this angle means 3 angle
    ev3.runToRelativePosition(motorC, 10 * angle, 300); //test on 90 degree set positive to be right dir
}
function turn_car(angle) {
    ev3.runForDistance(motorA, 1000, 600); // turn car test on 90 degree
    ev3.runForDistance(motorB, 1000, 600);
} // every angle is 15

function run_unit() {
    ev3.runForDistance(motorA, -500, 1000);
    ev3.runForDistance(motorB, -500, 1000); // run for unit, need to be adjusted
}
function check() {
    var light = ev3.reflectedLightIntensity(colourSensor);
    if(light >= 55 && light <= 59) {
        return 1;
    } else if (light >= 19 && light <= 22) {
        return 2;
    } else if (light >= 34 && light <= 37) {
        return 3;
    } else if (light >= 23 && light <= 26) {
        return 4;
     } else if (light >= 98) {
        return 5;
     } else if (light >= 71 && light <= 74) {
        return 6;
     } else { 
         ;
     }
}
    
function get_angle_from_eye() {
    var position = ev3.motorGetPosition(motorC);
    var angle = 0;
    var increment = 5;
    function back_and_forth(state, angle, count) {
        if (ev3.ultrasonicSensorDistance(eye) < 50) {
            return angle;
        } else {
            if (count > 4&& check() < 5) { // later can add in danger checking
                ev3.runToAbsolutePosition(motorC, position, 500);
                return 9342; // if still cannot find and car is not in danger
            }
            if (angle >= 30 && state === "r") {
                ev3.pause(800);
                back_and_forth("l", angle, count + 1);
            } else if (angle <= -30 && state === "l") {
                ev3.pause(800);
                back_and_forth("r", angle, count);
            } else if (state === "r" && angle < 30) {
                motor_c_turn(increment);
                angle = angle + increment;
                back_and_forth(state, angle, count);
            } else if (state === "l" && angle > -30) {
                motor_c_turn(-increment); // eye turn left
                angle = angle - increment;
                back_and_forth(state, angle, count);
            } else {
                return 0; // if it is in danger, then donot turn
            }
        }
    }
    return back_and_forth("r", 0, 1);
}
function check_danger() {
  var p = check();
  if(p >= 5) {
      move_backward_unit();
      check_danger();
   }else {
      ;
   }
}
function deal_with_sensor_angle(angle) {
    if (angle === 9342) {
        turn_car(30);
        ev3.pause(600);
        deal_with_sensor_angle(get_angle_from_eye());
    } else {
        turn_car(angle);
    }
    
}

function search_and_attack() {
    if (ev3.ultrasonicSensorDistance(eye) < 50) {
        run_unit(); // run for a unit distance
        search_and_attack(); //search again
    } else {
        check_danger();
        detect_back_attack();
        ev3.motorSetStopAction(motorA, "brake");
        ev3.motorSetStopAction(motorB, "brake");
        var angle = get_angle_from_eye();
        deal_with_sensor_angle(angle); // find enemy from sensor, if cannot, turn car
        search_and_attack();
    }
}


//ev3.runForDistance(motorA, -1000, 1000);
//ev3.runForDistance(motorB, -1000, 1000);
turn_car(6);

