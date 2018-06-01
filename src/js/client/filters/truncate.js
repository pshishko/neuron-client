/**
 * Created by Tur on 05.04.14.
 */

define(['pr'], function(pr) {

	'use strict';

	return [function() {
		return function(text, length, end) {
			length = !isNaN(length) ? length : 10;
			end = (end !== undefined) ? end : '...';
			if (text.length <= length || text.length - end.length <= length) {
				return text;
			} else {
				return String(text).substring(0, length - end.length) + end;
			}
		};
	}];

});