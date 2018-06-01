define(['pr'], function (pr) {

	'use strict';

	return [function () {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				elem.bind('keypress keydown', function (event) {
					var code = event.keyCode || event.which;
					if (code === 13) {
						event.preventDefault();
						if (event.ctrlKey == true) {
							elem.val(elem.val() + '\r\n');
						} else {
							$(elem).blur();
							scope.$apply(attrs.ngEnter);
						}
					}
				});
			}
		}
	}];
});