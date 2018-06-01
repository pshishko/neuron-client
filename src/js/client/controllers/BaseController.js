define(['config', '_', 'dd'], function(config, _, dd) {

	'use strict';

	return ['$rootScope', '$scope', function($rootScope, $scope) {

		$scope.setFormToDirty = function(form) {
			_.each(form, function(field) {
				if (field && field.$pristine) {
					field.$pristine = false;
				}
			});
		};

		$scope.$apply();
	}];
});