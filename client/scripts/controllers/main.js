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

		$scope.selectionMode = false;

		$scope.photoSelection = {};

		// Utilise pour le message "Sélectionner des photo"
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
			$scope.selectionMode = changeTo;
			if ($scope.selectionMode == false) {
				$scope.photoSelection = {};
			}
		};
		
		/*
		 * If selectionMode ON then, click a photo, check corresponding checkbox
		 * else if selectionMode OFF, click = default event = open photo
		 */
		$scope.togglePhoto = function (event) {
			console.log('dans togglePhoto');
			if ($scope.selectionMode) {
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
