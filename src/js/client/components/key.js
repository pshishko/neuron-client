define('key', ['md5'], function() {

	'use strict';

	var service = {};

	service.S4 = function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};

	service.guid = function() {
		var S4 = service.S4;
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	};

	service.getUid = function() {
		return hex_md5(service.guid());
	};

	return service;
});
