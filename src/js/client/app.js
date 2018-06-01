define('app', [
	'dd',
	'config',
	'angular',
    'services',
	'models',
	'filters',
	'directives',
	'controllers',
	'ngResource',
	'ngAnimate',
    'ngEventEmitter'
], function(dd, config, angular, services, filters, directives, controllers) {

	'use strict';

	var angApp = angular.module('angApp', [
		'angApp',
		'angApp.filters',
        'angApp.services',
		'angApp.models',
		'angApp.directives',
		'angApp.controllers',
		'ui.router',
		'ui.router.stateHelper',
		'ngAnimate',
		'ngResource',
        'ngEventEmitter'
	]);
	return angApp;
});