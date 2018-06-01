define(function(require) {

	'use strict';

	var filters = require('angular').module('angApp.filters', ['angApp.services']);

	// filters.factory('inSlicesOf', require('filters/inSlicesOf'));
	// filters.filter('truncate', require('filters/truncate'));

	return filters;
});
