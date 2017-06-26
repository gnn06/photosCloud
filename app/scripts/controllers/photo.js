'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('PhotoCtrl', function ($scope, $rootScope, $location, $route, $routeParams, $http) {
	console.log("dans PhotoCtrl")

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
        }, function(response) {
          console.error('error');
		});		
	}

	$scope.$location = $location;
	$scope.$route = $route;
	$scope.$routeParams = $routeParams;

	var host = $location.$$absUrl.substr(0,$location.$$absUrl.indexOf("#!"));
  
	$scope.currentPhoto = $rootScope.photos
    .map(function(item){return item.url})
      .indexOf("/thumbnail/" + $routeParams.folder)

	$http({method: 'GET',
		   url: '/data/' + $routeParams.folder
		   /*, cache: $templateCache*/}).
        then(function(response) {
          $scope.status = response.status;
          $scope.data = response.data;
        }, function(response) {
          $scope.data = response.data || 'Request failed';
          $scope.status = response.status;
		});

	$scope.post = function() {
		console.log('post');
		$http({method: 'POST',
		   url: '/data/' + $routeParams.folder,
		   data: { star: $scope.data.star }
		   /*, cache: $templateCache*/}).
        then(function(response) {
          $scope.status = response.status;
          //$scope.data = response.data;
        }, function(response) {
          //$scope.data = response.data || 'Request failed';
          $scope.status = response.status;
		});
	}
  });
