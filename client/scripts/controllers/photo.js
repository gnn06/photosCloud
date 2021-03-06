'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */

angular.module('photosAngularApp')
	.controller('PhotoCtrl', function ($scope, $rootScope, $location, $route, $routeParams, $http, 
		$filter, $timeout, $document, photoservice) {
		console.log('dans PhotoCtrl');

		function indexOfPhoto () {
			var result;
			var decodedPhotoURL = $rootScope.photos
				.map(function(item){return decodeURI(item.url);});
			var currentURL = decodeURI('/thumbnail/' + $routeParams.folder);
			result = decodedPhotoURL.indexOf(currentURL);
			return result;
		}
	
		if (!$rootScope.photos) {
			$http({method: 'GET',
				url: '/thumbnails'
				/*, cache: $templateCache*/}).
				then(function(response) {
					$rootScope.photos = $scope.photos = response.data;
					$rootScope.photos.sort((a, b) => {
						if (a.date < b.date) {
							return 1;
						} else if (a.date > b.date) {
							return -1;
						} else {
							return 0;
						}
					});
					$scope.currentPhoto = indexOfPhoto();
				}, function(response) {
					console.error('error');
				});		
		} else {
			$scope.currentPhoto = indexOfPhoto();
		}

		$scope.$location = $location;
		$scope.$route = $route;
		$scope.$routeParams = $routeParams;

		$scope.goToPrev = function () {
			var hrefNext = $scope.photos[$scope.currentPhoto - 1].url;
			hrefNext = $filter('thumbnail')(hrefNext);
			$location.path(hrefNext);
		};
		
		$scope.goToNext = function () {
			var hrefNext = $scope.photos[$scope.currentPhoto + 1].url;
			hrefNext = $filter('thumbnail')(hrefNext);
			$location.path(hrefNext);
		};

		$scope.deletePhoto = function(ev) {
			console.log('delete');
			var photosIdx = [];
			photosIdx.push($rootScope.photos[$scope.currentPhoto].url);
			photoservice.delete(photosIdx, ev)
				.then(function () {
					// currentPhoto target next as array was reduced.
					var next = $rootScope.photos[$scope.currentPhoto].url;
					$location.path($filter('thumbnail')(next));
				}, function () {
					console.log('rejected');
				});
		};

		$scope.timeoutHide = false;

		const HIDE_DELAY = 4000;

		function hide () {
			$scope.timeoutHide = true;
			$document.on('mousemove', function () {
				console.log('mouse move => show hidden controls');
				$document.off('mousemove');
				$scope.$apply('timeoutHide = false');
				$timeout(function () {
					console.log('hide');
					hide();
				}, HIDE_DELAY);
			});
		}

		$timeout(function () {
			console.log('inactivity => hide controls');
			hide();
		}, HIDE_DELAY);

	});
