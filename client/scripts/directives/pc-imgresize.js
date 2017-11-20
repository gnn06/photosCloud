/* global angular */
'use strict';

/* 
 * meilleure solution qu'une div avec background car la taille 
 * de la div et respecte pas la taille de l'image
 */

angular.module('photosAngularApp')
	.directive('pcImgresize', function ($window) {		
		return {
			link : function (scope, element, attrs) {
				function chooseWidthOrHeight () {
					var w = element[0].width;
					var h = element[0].height;
					var ww = $window.innerWidth;
					var wh = $window.innerHeight;
					var ratio_W = (w / ww);
					var ratio_H = (h / wh);
					console.log('debug,src=', element[0].src);
					if (ratio_W / ratio_H > 1 ) {
						console.log('resize image => choose width', w, h, ww, wh);
						element.css('width', ww + 'px');
						element.css('height', '');
					} else {
						console.log('resize image => choose height', w, h, ww, wh);
						element.css('height', wh + 'px');
						element.css('width', '');
					}
				}
				// better to use onload instead on $observe on src attribute
				// because during $observe, imgage could don't be yet loaded

				/**
				 * when img loaded before onLoad event is registered, 
				 * onLoad is not fired. We test it, using naturalWidth properties
				 * (!= 0 <=> img already loaded, onLoad won't be fired)
				 */
				console.log('register img.onload');
				console.log(element[0].naturalWidth);
				if (element[0].naturalWidth != 0 && element[0].naturalHeight != 0) {
					console.log('image already loaded');
					chooseWidthOrHeight(element);
				}
				element.on('load', function () {
					console.log('onload image');
					chooseWidthOrHeight(element);
				});
				
				// $observe needed because img.src need to be interpolated
				// to replace {{}}. 
				// attrs.$observe('src', function(newVal, oldVal){
				// 	if (newVal != oldVal) {
				// 		console.log('into observe');
				// 		chooseWidthOrHeight(element);
				// 	}
				// });
				angular.element($window).on('resize', function () {
					// console.log('on resize img');
					chooseWidthOrHeight(element);
				});
				scope.$on('$destroy', function () {
					console.log('pc-imgresize.destroy');
					angular.element($window).off('resize');
				});
			}
		};
	});
