define(['angular', 'services', '_', 'dd'], function(angular, services, _, dd) {

	'use strict';

    var controllersModule = angular.module('angApp.controllers', ['angApp.services']);

    var controllersInjector = function (module, controllers) {
        _.each(controllers, function (controllerName) {
            module.controller(controllerName, ['$scope', '$injector', function($scope, $injector) {
                require(['controllers/' + controllerName], function(controller) {
                    $injector.invoke(controller, this, {'$scope': $scope});
                });
            }]);
        });
    }

    return controllersInjector(controllersModule, [
        'BaseController',
        'NeuronController'
        // 'UserController',
    ]);
});