define(function(require) {

	'use strict';

	var models = require('angular').module('angApp.models', []);

    models.factory('User', require('models/User'));
    models.factory('Neuron', require('models/Neuron'));

	return models;
});