'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
	.controller('MainCtrl', function ($scope, $rootScope, $http, $document, $window, $location, $timeout, photoservice) {
		console.log('mainController');
	
		if (!$rootScope.photos) {
			$http({method: 'GET',
				url: '/thumbnails'
				/*, cache: $templateCache*/}).
					then(function(response) {
						$rootScope.allPhotos = response.data;
						$rootScope.allPhotos.sort((a, b) => {
							if (a.date < b.date) {
								return 1;
							} else if (a.date > b.date) {
								return -1;
							} else {
								return 0;
							}
						});
						$rootScope.count = 7 * (8 + 3);
						$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, $rootScope.count);
					}, function(response) {
						console.error('error');
			});
		} else {
			$rootScope.count = $rootScope.photos.length;
		}

		// $scope.retrievePage = function() {
		// 	console.log('retrieve');
		// 	$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, 12 + count);
		// 	count += 12;
		// };

		// Ne pas executer à chaque fois sinon perte des données sauvegardées
		if ($rootScope.scrollPos == undefined) {
			$rootScope.scrollPos = {};
		}

		console.log('register scroll event');
		angular.element($window).on("scroll", function () {
			var el = document.documentElement;
			// console.log('scroll, el.scrollHeight ', el.scrollHeight, 'window.innerHeight : ', $window.innerHeight, 'window.pageYOffset : ', $window.pageYOffset, 'url:', $location.url());
			// console.log('okSaveScroll', $scope.okSaveScroll, 'path', $location.path(),  $(window).scrollTop());
			// if ($scope.okSaveScroll) {
				// $rootScope.scrollPos[$location.path()] = $window.scrollTop; // scrollTop is not a function
				$rootScope.scrollPos[$location.path()] = $window.pageYOffset;
				// console.log($location.path(), $(window).scrollTop());
			// }
			// $rootScope.scrollPosition = window.pageYOffset;
			if(el.scrollHeight === (window.innerHeight + window.pageYOffset)) {
				if ($rootScope.count < $rootScope.allPhotos.length) {
					console.log('add photos', '$rootScope.count', $rootScope.count);
					$rootScope.count += 36;
					$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, $rootScope.count);
					$scope.$apply();
				}
			}
		}) ;

		$scope.$on("$destroy", function() {
			console.log('destroy');
			angular.element($window).off("scroll");
		});

		// $scope.scrollClear = function(path) {
		// 	$rootScope.scrollPos[path] = 0;
		// }

		$scope.$on('$routeChangeStart', function () {
			console.log('into routeChangeStart');
			console.log('scrollPosition: ', $rootScope.scrollPos, 'path', $location.path());
			// $rootScope.scrollPos[$location.path()] = $window.scrollTop();
			$rootScope.scrollPos[$location.path()] = $window.pageYOffset;
			$scope.okSaveScroll = false;
		})

		$scope.$on('$routeChangeSuccess', function() {
			// console.log('into routeChangeSuccess');
			$timeout(function() { // wait for DOM, then restore scroll position
				console.log('into timeout', $location.path(), $rootScope.scrollPos);
				console.log('restore scroll', $location.path(), $rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0)
				$window.scroll(0, $rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0);
				$scope.okSaveScroll = true;
			}, 100);
		});

		$scope.selection = false;

		$scope.photoSelection = {};

		$scope.selectionLength = function () {
			var result = 0;
			for (var key in $scope.photoSelection) {
				if ($scope.photoSelection[key] == true) {
					result += 1;
				}
			}
			return result;
		}

		$scope.toggleSelectionMode = function (changeTo) {
			$scope.selection = changeTo;
			if ($scope.selection == false) {
				$scope.photoSelection = {};
			}
		};
		
		$scope.togglePhoto = function (event) {
			console.log('dans togglePhoto');
			if ($scope.selection) {
				// href is absolute
				// TODO get photoUrl from checkbox
				var href = event.currentTarget.href;
				var url = ('/' + href.replace($location.$$absUrl, '').replace('photo','thumbnail'));
				var currentToggleState = $scope.photoSelection[url];
				$scope.photoSelection[url] = !currentToggleState;
				event.preventDefault();
				return;
			} 
		} 

		$scope.deletePhotos = function (ev) {
			console.log('deletePhotos');
			var photosIdx = [];
			for (var key in $scope.photoSelection) {
				if ($scope.photoSelection[key] == true) {
					photosIdx.push(key);
				}
			}
			photoservice.delete(photosIdx, ev)
			.then(function () {
				$scope.photoSelection = {};
				$scope.$apply();
			}, function () {
				console.log('rejected');
			});
		};

	});


// window.addEventListener("scroll", function () {
// 	var el = document.documentElement;
// 	// console.log(el.scrollHeight, window.innerHeight, window.pageYOffset);
// 	if(el.scrollHeight === (window.innerHeight + window.pageYOffset)) {
// 		console.log("bottom!");
// 		$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, 12 + count);
// 		count += 12;
// 	}
// });
