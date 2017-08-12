'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $window) {
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
						$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, count);
					}, function(response) {
						console.error('error');
			});
		}

		var count = 36;

		// $scope.retrievePage = function() {
		// 	console.log('retrieve');
		// 	$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, 12 + count);
		// 	count += 12;
		// };

		angular.element($window).bind("scroll", function () {
			console.log('scroll', count);
			var el = document.documentElement;
			if(el.scrollHeight === (window.innerHeight + window.pageYOffset)) {
				console.log('retrieve');
				if (count < $rootScope.allPhotos.length) {
					$rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, 12 + count);
					count += 12;
					$scope.$apply();
				}
			}
		});
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