define(['dd'], function(dd) {

	'use strict';

	return  ['$rootScope', function($rootScope) {

		var service = {};

		service.encrypt = function(data) {
			dd(data);
			var cryptData = {
				'data': data
			};
			return cryptData;
		};

		service.decrypt = function(cryptData) {
			var data = cryptData.data;
			dd(data);
			return data;
		};

		service.Crypt = service;
		return service;
	}];
});
