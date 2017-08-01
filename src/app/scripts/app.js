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
     	return input.replace(/.*thumbnail/g, 'photo');
		};
  })
  .filter('original', function() {
		return function (input) {
     	return input.replace(/.*thumbnail/g, 'original');
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
		.when('/original/:folder*', {
		  templateUrl: 'views/original.html',
		  controller: 'PhotoCtrl'
	  })	
	});

	
window.addEventListener("scroll", function () {
	var el = document.documentElement;
	// console.log(el.scrollHeight, window.innerHeight, window.pageYOffset);
	if(el.scrollHeight === (window.innerHeight + window.pageYOffset)) {
		console.log("bottom!");
	}
});
