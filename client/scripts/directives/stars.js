'use strict';

const module = angular.module('photosAngularApp');

module.directive('pcStars', function () {

	return {
		templateUrl: 'templates/stars.html',
		replace: true,
					
		controller: function ($scope, $rootScope, $http, $routeParams) {
			console.log('into pc-stars.controller', $routeParams);

			$scope.toggleStarMode = function () {
				
				$rootScope.starMode = (!$rootScope.starMode);
				console.log($rootScope.starMode);
			};

			$http({method: 'GET',
				url: '/data/' + $routeParams.folder
				/*, cache: $templateCache*/}).
				then(function(response) {
					console.log('data retrieved', response.data);
					$scope.stars = response.data.stars;
					$scope.$watch('stars', function (newValue, oldValue) {
						if (newValue != oldValue) {
							console.log('post');
							$http({method: 'POST',
								url: '/data/' + $routeParams.folder,
								data: { stars: $scope.stars }
							}).
								then(function(response) {
									console.log('saved');
								}, function(response) {
									console.error('error');
								});
						}
					});
				}, function(response) {
					console.error('error');
				});

			

		}
	};

});