'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('PhotoCtrl', function ($scope, $resource, $rootScope, $location, $route, $routeParams, $http) {
	console.log("dans PhotoCtrl")

	if (!$rootScope.photos) {
		console.log('photos null');
		var ws = $resource('thumbnails');
		$rootScope.photos = $scope.photos = ws.query();
	}

	$scope.$location = $location
	$scope.$route = $route
	$scope.$routeParams = $routeParams
	var host = $location.$$absUrl.substr(0,$location.$$absUrl.indexOf("#!"))
  $scope.currentPhoto = $rootScope.photos
    .map(function(item){return item.url})
      .indexOf(host + "thumbnail/" + $routeParams.folder)

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
