define(function(require) {

	'use strict';

	var directives = require('angular').module('angApp.directives', ['angApp.services']);

	// directives.directive('ngEnter',             require('directives/ngEnter'));
    directives.directive('bindGraph',           require('directives/bindGraph'));

	return directives;
});