define(function(require) {

	'use strict';

	var services = require('angular').module('angApp.services', []);

	services.factory('Auth',           require('services/Auth'));
	services.factory('Crypt',          require('services/Crypt'));
	services.factory('Socket',         require('services/Socket'));
    services.factory('LocalMemory',    require('services/LocalMemory'));
    services.factory('Model',          require('services/Model'));
 //    services.factory('Form',           require('services/Form'));
    services.factory('Helper',         require('services/Helper'));

	return services;
});