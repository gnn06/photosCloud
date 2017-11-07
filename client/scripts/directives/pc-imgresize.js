/* global angular */
'use strict';

angular.module('photosAngularApp')
	.directive('pcImgresize', function ($window) {
		function temp (element) {
			var w = element[0].width;
			var h = element[0].height;
			var ww = $window.innerWidth;
			var wh = $window.innerHeight;
			var ratio_W = (w / ww);
			var ratio_H = (h / wh);
			if (ratio_W / ratio_H > 1 ) {
				console.log('resize image => choose width');
				element.css('width', ww + 'px');
				element.css('height', '');
			} else {
				console.log('resize image => choose height');
				element.css('height', wh + 'px');
				element.css('width', '');
			}
		}
		return {
			link : function (scope, element, attrs) {
				attrs.$observe('src', function(newVal, oldVal){
					if (newVal != oldVal) {
						console.log('into observe');
						temp(element);
					}
				});
				angular.element($window).on('resize', function () {
					// console.log('on resize img');
					temp(element);
				});            
			}
		};
	});
