'use strict';

const module = angular.module('photosAngularApp');

module.directive('pcStars', function () {

	return {
		templateUrl: 'templates/stars.html',
        replace: true,
                    
        controller: function ($scope, $http, $routeParams) {
			console.log($routeParams);

			$http({method: 'GET',
				url: '/data/' + $routeParams.folder
				/*, cache: $templateCache*/}).
			then(function(response) {
				console.log('data retrieved', response.data);
				$scope.stars = response.data.stars;
			}, function(response) {
				console.error('error');
			});

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

		}
	};

});