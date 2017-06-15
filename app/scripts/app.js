'use strict';

/**
 * @ngdoc overview
 * @name photosAngularApp
 * @description
 * # photosAngularApp
 *
 * Main module of the application.
 */
angular
  .module('photosAngularApp', ['ngResource', 'ngRoute'])

  .filter('thumbnail', function() {
	return function (input) {
//		console.log(input);
      return input.replace(/.*thumbnail/g, 'photo');
	};
  })
  .config(function($routeProvider, $locationProvider) {
	  $routeProvider
	  .when('/', {
		  templateUrl: 'views/main.html',
		  controller: 'MainCtrl'
	  })
	  .when('/photo/:folder*', {
		  templateUrl: 'views/photo.html',
		  controller: 'PhotoCtrl'
	  })
  });