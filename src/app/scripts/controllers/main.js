'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http) {
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
          $rootScope.photos = $scope.photos = $rootScope.allPhotos.slice(0, 12);
        }, function(response) {
          console.error('error');
		});		
	}
});
