'use strict';

angular.module('photosAngularApp')
	.controller('pcLoadOnScrollController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.onScroll = function (event) {
			if ($rootScope.count < $rootScope.allPhotos.length) {
				console.log('add photos', '$rootScope.count', $rootScope.count);
				var imgToLoad = 0;
				const nbImgRow = 7;
				if ($rootScope.allPhotos.length - $rootScope.count < nbImgRow) {
					imgToLoad = $rootScope.allPhotos.length % nbImgRow;
				} else {
					imgToLoad = nbImgRow;
				}
				console.log('nb image to load', imgToLoad);
				$rootScope.count += $rootScope.imgToLoad = imgToLoad;
				$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, $rootScope.count);
				$rootScope.$digest();
			}
		};
		$scope.onImgLoad = function (event) {
			$rootScope.imgToLoad -= 1;
			// console.log($rootScope.imgToLoad, this.src);
			$rootScope.$apply();
		};
	}])
	.directive('imageonload', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				console.log('link of imageonload');
				element.bind('load', function() {
					console.log('image is loaded');
					scope.onImgLoad();
				});
				element.bind('error', function(){
					console.log('image could not be loaded');
					scope.onImgLoad();
				});
				/* removeAttr needed to avoid error */
				element.removeAttr('imageonload');
			}
		};
	})
	.directive('loadOnScroll', function ($rootScope, $location, $timeout) {
		return {
			link : function (scope, element, attrs) {
				// Ne pas executer à chaque fois sinon perte des données sauvegardées
				if ($rootScope.scrollPos == undefined) {
					$rootScope.scrollPos = {};
				}

				console.log('register scroll event');

				element.on('scroll', function () {
					// element is a angular jqlite one. element[0] is the raw dom element
					// console.log('scroll, element[0].scrollTop ', element[0].scrollTop, ', element.scrollHeight ', element[0].scrollHeight, 'element.clientHeight', 
					//     element[0].clientHeight, 'url:', $location.url());
					$rootScope.scrollPos[$location.path()] = element[0].scrollTop;
					if(element[0].scrollHeight === (element[0].clientHeight + element[0].scrollTop)) {
						scope.onScroll();
					}
				}) ;

				scope.$on('$destroy', function() {
					console.log('destroy');
					element.off('scroll');
				});

				scope.$on('$routeChangeStart', function () {
					console.log('into routeChangeStart');
					console.log('scrollPosition: ', $rootScope.scrollPos, 'path', $location.path());
					$rootScope.scrollPos[$location.path()] = element[0].scrollTop;
				})
    
				scope.$on('$routeChangeSuccess', function() {
					// console.log('into routeChangeSuccess');
					$timeout(function() { // wait for DOM, then restore scroll position
						console.log('into timeout', $location.path(), $rootScope.scrollPos);
						console.log('restore scroll', $location.path(), $rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0)
						element[0].scrollTop = $rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0;
					}, 10);
				});
			},
			controller : 'pcLoadOnScrollController'
		};
	});
