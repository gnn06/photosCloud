'use strict';

describe('photo-controller', function () {

    var $controller, $rootScope, $location;
    
    beforeEach(angular.mock.module('photosAngularApp'));

	beforeEach(function() {
		inject(function (_$controller_, _$rootScope_, _$location_) {
			$controller = _$controller_;
			$rootScope  = _$rootScope_;
			$location   = _$location_;
		});
	});
        
    

	it('show work', function () {
		var $scope = $rootScope.$new();
		var controller = $controller('PhotoCtrl', {$scope: $scope});
		$scope.photos = [];
		$scope.photos[0] = { url: 'url0' };
		$scope.photos[1] = { url: 'url1' };
		$scope.photos[2] = { url: 'url2' };
		$scope.currentPhoto = 1;
		sinon.spy($location, 'path');
		$scope.goToNext();        
		expect($location.path.getCall(0).args[0]).to.equal('url2');
	});
});