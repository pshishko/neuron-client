define('dd', [], function() {

	'use strict';

	var dd = function(data, stop) {
		if ((new Error).stack) {
			var traceLine = (new Error).stack.split("\n")[2];
			var nameLine = traceLine.slice(traceLine.lastIndexOf("/") + 1, traceLine.length);
		} else {
			nameLine = '***';
		}
		if (typeof data == 'object') {
			console.log("[", nameLine, "][", typeof data, "] ==> ", data);
		} else {
			console.log("[%s][%s] ==> %s", nameLine, typeof data, data);
		}
		if (stop) {
			console.warn('JS Stopped successfully');
			throw new Error('JS Stopped successfully.');
		}
	};

	return dd;
});