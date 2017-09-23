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
  .module('photosAngularApp', ['ngResource', 'ngRoute', 'ngMaterial'])

  .filter('thumbnail', function() {
		return function (input) {
     		return input != undefined ?  input.replace(/thumbnail/g, 'photo') : "";
		};
  })
  .filter('original', function() {
		return function (input) {
     		return input != undefined ? input.replace(/thumbnail/g, 'original') : "";
		};
  })
  .filter('large', function () {
  	return function (input) {
  		return input != undefined ? input.replace(/thumbnail/g, 'large').replace(/mp4/,'jpg') : "";
  	}
  })

  .constant('BASE_URL', 'http://192.168.1.2:8090')

  .run(function ($rootScope, BASE_URL) {
	$rootScope.BASE_URL = BASE_URL;
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
		.when('/original/:folder*', {
		  templateUrl: 'views/original.html',
		  controller: 'PhotoCtrl'
	  })	
	});