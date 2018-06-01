define(['pr', '_'], function(pr, _) {

	'use strict';

	return ['Helper', function (Helper) {
		
		var service	= {};

		service.validate = function(form, callback) {
			if (form.$valid) {
				service.setFormToPristine(form);
				callback();
			} else {
				service.setFormToDirty(form);
			}
		};

		service.setFormToPristine = function(form) {
			form.serverError = {};
			form.$setPristine();
		};

		service.setFormToDirty = function(form) {
			_.each(form, function(field) {
				if (field && field.$pristine) {
					field.$pristine = false;
				}
			});
		};

		service.addErrors = function(form, errors) {
			if (!form) return false;
			form.serverError = {};
			_.each(errors, function(error, field) {
				form.serverError[field] = error;
			});
			return true;
		};

		/******************************************************************************************************************/

		return service;		
	}];
});