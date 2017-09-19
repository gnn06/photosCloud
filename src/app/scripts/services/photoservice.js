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
				return Promise.all(photosIdx.map(url => {
					var photoUrl = $filter('thumbnail')(url);
					return $http({
						method: 'DELETE',
						url: photoUrl
					});
				}));
			})
			.then(function () {
				console.log('delete successful');
				photosIdx.forEach(function(url) {
					var idx = $rootScope.photos.findIndex(element => {
						return element.url == url;
					});
					$rootScope.photos.splice(idx, 1);
				}, this);
			});
	}
	return photoNewServiceInstance;
});