'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
	.controller('MainCtrl', function ($scope, $rootScope, $http, $window, $location, 
		photoservice) {
		console.log('mainController');

		// $scope.photos, utilisé pour ng-repeat
		// $rootScope.photos, utilisé de vue en vue
	
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
