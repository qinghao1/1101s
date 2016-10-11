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
    ev3.runForDistance(motorA, -500, 1000);
    ev3.runForDistance(motorB, -500, 1000); // run for unit, need to be adjusted
}

function backward() {
    ev3.runForDistance(motorA, 500, 500);
    ev3.runForDistance(motorB, 500, 500);
}

function turn_car(angle) {
    angle = Math.floor(angle/15);
    ev3.runForDistance(motorA, -95*angle, 600); // turn car test on 90 degree
    ev3.runForDistance(motorB, 95*angle, 600);
}

function back_attack() {
    return ev3.touchSensorPressed(hand1) || ev3.touchSensorPressed(hand2);
}

function eye_turn(angle) {
    ev3.runToRelativePosition(motorC, 30 * angle, 300); //test on 90 degree set positive to be right dir
}

function enemy_in_front() {
    return ev3.ultrasonicSensorDistance(eye) < 50;
}

function position() {
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
        return 7;
     }
}

function safety() {
    if (position() < 6) {
        backward();
    }
    return safety();
}

function brake() {
    ev3.motorSetStopAction(motorA, "brake");
    ev3.motorSetStopAction(motorB, "brake");
}

function find_enemy() {
    var start = ev3.motorGetPosition(motorC);
    var angle = 0;
    var increment = 15;
    var ct = 0;
    function reset_eye() {
        ev3.runToAbsolutePosition(motorC, start, 500);
    }
    function turn_eye(direction) {
        if (ct > 2) {
            reset_eye()
            enemy = false;
            return 0;
        }
        if (ev3.ultrasonicSensorDistance(eye) < 50) {
            reset_eye();
            enemy = true;
            return angle;
        } else {
            if (direction === 'r') {
                if (angle + increment > 90) {
                    ct++;
                    direction = 'l';
                } else {
                    angle += increment;
                    eye_turn(increment);
                }
            } else {
                if (angle - increment < 90) {
                    ct++;
                    direction = 'r';
                } else {
                    angle -= increment;
                    eye_turn(-increment);
                }
            }
        }
        turn_eye(direction);
    }
    return turn_eye('r');
}

function turn_enemy() {
    var angle = find_enemy();
    //turn eye back
    turn_eye(-angle);
    turn_car(angle);
}

function attack() {
    while (enemy_in_front()) {
        forward();
    }
}

function defend() {
    while (back_attack()) {
        brake();
    }
}

var enemy = false;

turn_car(180);

function main() {
    brake();
    while (enemy) {
        attack();
        defend();
    } else {
        safety();
        turn_enemy();
    }
    ev3.pause(500);
}

main();
