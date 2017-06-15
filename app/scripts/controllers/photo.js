'use strict';

/**
 * @ngdoc function
 * @name photosAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photosAngularApp
 */
angular.module('photosAngularApp')
  .controller('PhotoCtrl', function ($scope, $rootScope, $location, $route, $routeParams) {
	console.log("dans PhotoCtrl")
	$scope.$location = $location
	$scope.$route = $route
	$scope.$routeParams = $routeParams
	var temp = $location.$$absUrl.substr(0,$location.$$absUrl.indexOf("#!"))
  $scope.currentPhoto = $rootScope.photos.map(function(item){return item.url}).indexOf(temp + "thumbnail/" + $routeParams.folder)
  });
