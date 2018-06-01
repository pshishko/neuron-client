/**
 * Created by Tur on 05.04.14.
 */

define([], function() {

	'use strict';

	return ['$rootScope', function($rootScope) {

		var doSlice = function(items, count) {
			var sliced = [];
			angular.forEach(items, function(item, key) {
				var incKey = key - 1;
				var chunkIndex = parseInt(incKey / count, 10);
				var isFirst = (incKey % count === 0);
				if (isFirst) {
					this[chunkIndex] = [];
				}
				this[chunkIndex].push(item);
			}, sliced);
			return sliced;
		};

		var makeSlices = function(items, count) {
			if (items == undefined || !count) return false;
			if (!angular.isObject(items) && !angular.isArray(items) && !angular.isString(items)) return items;

			items = _.sortBy(items, function(o) {
				return -o.id;
			});

			var sortedItems = {};
			_.each(items, function(data, key) {
				sortedItems[key + 1] = data;
			});

			var sliced = doSlice(sortedItems, count);

			// magic filter stabilization))
			// ***************************************
			if (angular.equals($rootScope.arrayinSliceOf, sliced)) {
				return $rootScope.arrayinSliceOf;
			} else {
				$rootScope.arrayinSliceOf = sliced;
			}
			return sliced;
			// ***************************************
		};

		return makeSlices;
	}];

});