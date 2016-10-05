require('./helper.js');

//Task 3
(function task3() {
	//checks for line
	if (!at_line()) {
	go_forward(2);
	} else {
	go_forward(-5);
	turn_right(30);
	}
	//timeout in ms
	ev3.pause(timeout);
	//repeat
	return task3();
})();