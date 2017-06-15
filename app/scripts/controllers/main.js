'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('MainCtrl', function ($scope, $resource, $rootScope) {
	if (!$rootScope.photos) {
		var ws = $resource('thumbnails');
		$rootScope.photos = $scope.photos = ws.query()
	}
  });
