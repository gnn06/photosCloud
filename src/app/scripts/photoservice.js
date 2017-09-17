'use strict';

angular.module('photosAngularApp')
.factory('photoservice', function($mdDialog, $http, $rootScope, $filter) {
	var photoNewServiceInstance = {};
	photoNewServiceInstance.delete = function (photosIdx, ev) {
		var confirm = $mdDialog.confirm()
			// .title('Supprimer la photo ?')
			.textContent('Voulez-vous vraiment supprimer la photo ?')
			.ariaLabel('Lucky day')
			.targetEvent(ev)
			.ok('Supprimer')
			.cancel('Annuler');

		return $mdDialog.show(confirm)
			.then(function() {
				return new Promise(function(resolve, reject) {
					var photoUrl = $filter('thumbnail')($rootScope.photos[photosIdx[0]].url);
					$http({
						method: 'DELETE',
						url: photoUrl
					})
					.then(function () {
						console.log('delete successful');
						$rootScope.photos.splice(photosIdx[0], 1);
						resolve();
					}, function (err) {
						console.log('delete error', err);
						reject();
					})
				});
			}/*, function() {
				console.log('cancel');
				throw "cancel";
			}*/);
	} 
	return photoNewServiceInstance;
});