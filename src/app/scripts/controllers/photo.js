'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('PhotoCtrl', function ($scope, $rootScope, $location, $route, $routeParams, $http, $filter, $mdDialog) {
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
			$scope.currentPhoto = $rootScope.photos
				.map(function(item){return decodeURI(item.url)})
					.indexOf("/thumbnail/" + $routeParams.folder);
		}, function(response) {
			console.error('error');
		});		
	} else {
		$scope.currentPhoto = $rootScope.photos
			.map(function(item){return decodeURI(item.url)})
				.indexOf("/thumbnail/" + $routeParams.folder)
	}

	$scope.$location = $location;
	$scope.$route = $route;
	$scope.$routeParams = $routeParams;

	var host = $location.$$absUrl.substr(0,$location.$$absUrl.indexOf("#!"));

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
		  }).
        then(function(response) {
          $scope.status = response.status;
          //$scope.data = response.data;
        }, function(response) {
          //$scope.data = response.data || 'Request failed';
          $scope.status = response.status;
		});
	};

	$scope.deletePhoto = function(ev) {
		console.log('delete');
		
		var confirm = $mdDialog.confirm()
			// .title('Supprimer la photo ?')
			.textContent('Voulez-vous vraiment supprimer la photo ?')
			.ariaLabel('Lucky day')
			.targetEvent(ev)
			.ok('Supprimer')
			.cancel('Annuler');

		$mdDialog.show(confirm).then(function() {
			$http(
				{
					method: 'DELETE',
					url: '/photo/' + $routeParams.folder
				}
			).then(function (response) {
				console.log('delete successful');
				var next = $rootScope.photos[$scope.currentPhoto + 1].url;
				$rootScope.photos.splice($scope.currentPhoto, 1);
				$location.path($filter('thumbnail')(next));
			}, function (err) {
				console.log('delete error');
			})
			$scope.status = 'You decided to get rid of your debt.';
		}, function() {
			$scope.status = 'You decided to keep your debt.';
		});

	};		
});
