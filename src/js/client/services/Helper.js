define(['_', 'dd'], function(_, dd) {

	'use strict';

	return  ['$rootScope', '$location', '$state', '$sce', function($rootScope, $location, $state, $sce) {

		var service = {};

		/******************************************************************************************************************/
		// ObjectHelper

		service.setObject = function(object, params) {
			object = object || {};
			_.each(params, function(newValue, field) {
				object[field] = newValue;
			});
			return object;
		};

		service.addToObject = function(object, key, field) {
			object = object || {};
			object[key] = field;
			return object;
		};

		service.updateObject = function(object, params) {
			service.setObject(object, params);
			var remove = _.difference(_.keys(object), _.keys(params));
			_.each(remove, function(o, k) {
				if (o == 'access_token') {
					return true;
				}
				object = _.omit(object, o);
			});
			return object;
		};

		service.removeFromObject = function(object, id) {
			delete object[id];
			return object;
		};

        service.difference = function(object, base) {
            function changes(object, base) {
                return _.transform(object, function(result, value, key) {
                    if (key == 'id' || key == 'link') {
                        result[key] = value;
                    }
                    if (!_.isEqual(value, base[key])) {
                        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                    }
                });
            }
            return changes(object, base);
        }

		/******************************************************************************************************************/
		// ArrayHelper

		service.addToArray = function(array, item) {
			if (!array) {
				array = [];
			}
			array.push(item);
			return array;
		};

		service.removeFromArrayByObjectId = function(array, id) {
			return _.filter(array, function(object) {
				if (object.id !== id) {
					return object;
				}
			});
		};

		service.mergeArray = function(array1, array2) {
			return _.union(array1, array2);
		};

		service.in_array = function(field, array) {
			return _.indexOf(array, field) >= 0;
		};

		/******************************************************************************************************************/
		// StringHelper

		service.ucfirst = function(str) {
			if (_.isEmpty(str)) return '';
			var parts = str.split(' ');
			var words = [];

			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				var first = part[0].toUpperCase();
				var rest = part.substring(1, part.length);
				var word = first + rest;
				words.push(word);
			}
			return words.join(' ');
		};
		/******************************************************************************************************************/
		// ParseHelper

		service.parseLinkDataFromText = function(text, callback, failCallback) {
			var urls = service.parseLink(text);
			if (!_.isEmpty(urls)) {
				var url = urls[0];
				if (service.getYoutubeId(url)) {
					callback({
						url: url,
						type: 'youtube',
						youtube_id: service.getYoutubeId(url)[1],
					});
					return true;
				}
				service.isImageUrl(url, function(url, isImage) {
					if (isImage) {
						callback({
							url: url,
							type: 'image',
							image: url,
						});
						return true;
					}
					callback({
						url: url,
						type: 'link',
					});
				});
			} else {
				failCallback();
			}
			return false;
		};

	    service.linkify = function(inputText) {
			var replacedText, replacePattern1, replacePattern2, replacePattern3;

			//URLs starting with http://, https://, or ftp://
			replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

			//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
			replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

			//Change email addresses to mailto:: links.
			replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
			replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

			return replacedText;
		}

		service.getYoutubeId = function(url) {
			var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
			return videoid;
		};

		service.getYoutubeUrlById = function(id) {
			return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + id);
		};

		service.parseLink = function(inputText) {
			return inputText.match(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim);
		};

		service.isImageUrl = function(url, callback) {
			var img = new Image();
			img.onerror = function() { callback(url, false); }
			img.onload =  function() { callback(url, true); }
			img.src = url;
		}

		/******************************************************************************************************************/
		// LocationHelper

		service.redirect = function(path) {
			$location.path(path);
			this.safeApply();
		};

		service.emptyRedirect = function(object, path) {
			if (!object || (_.isObject(object) && _.isEmpty(object))) {
				$location.path(path);
				this.safeApply();
			}
			return true;
		};

		service.getCurrentParam = function(param) {
            return $state.params[param];
		};

		service.getCurrentParamWithRedirect = function(param) {
			var currentParam = service.getCurrentParam(param);
			if (!currentParam || currentParam == ':' + param) {
				$location.path('/');
				this.safeApply();
				return false;
			}
			return currentParam;
		};

		/******************************************************************************************************************/
		// BaseHelper

		service.watchOne = function(scope, watch, callback) {
			if (!callback()) {
				service.watch(scope, watch, function(newValue, stopWatch) {
					if (callback(newValue)) {
						stopWatch();
					}
				});
			}
		};

		service.watch = function(scope, watch, callback) {
			var stopWatch = scope.$watch(watch, function(newValue, oldValue) {
				if (newValue == undefined) return true;
				callback(newValue, stopWatch);
			}, true);
		}

		service.safeApply = function($scope) {
			var scope = $scope ? $scope : $rootScope;
			var phase = scope.$root.$$phase;
			
			if (phase != '$apply' && phase != '$digest') {
				scope.$apply();
			}
		};
		
		return service;
	}];
});