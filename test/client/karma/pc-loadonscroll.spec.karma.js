/**
     * Given image 
     * When image aggrandie encore plus petite que l'ecran
     * Then image s'agrandie et reste centrée 
 *
 */
'use strict';

describe.only('pc-loadonscroll', function () {
	
	var $compile, rootScope, $scope;
	
	beforeEach(module('photosAngularApp'));

	beforeEach(function(/*done*/) {
		inject(function($compile, $rootScope, $controller) {
			$scope = $rootScope.$new();
			rootScope = $rootScope;
			$controller('pcLoadOnScrollController', { $scope: $scope });
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.count = 0;
			rootScope.allPhotos = [ 1, 2, 3, 4, 5 ];
			$scope.onScroll();
			expect(rootScope.imgToLoad).equals(5);
			expect(rootScope.count).equals(5);
			expect(rootScope.photos).eql([ 1, 2, 3, 4, 5 ]);
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.count = 0;
			rootScope.allPhotos = [ 1, 2, 3, 4, 5, 6, 7 ];
			$scope.onScroll();
			expect(rootScope.imgToLoad).equals(7);
			expect(rootScope.count).equals(7);
			expect(rootScope.photos).eql([ 1, 2, 3, 4, 5, 6, 7 ]);
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.count = 0;
			rootScope.allPhotos = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
			$scope.onScroll();
			expect(rootScope.imgToLoad).equals(7);
			expect(rootScope.count).equals(7);
			expect(rootScope.photos).eql([ 1, 2, 3, 4, 5, 6, 7 ]);
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.count = 7;
			rootScope.allPhotos = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
			$scope.onScroll();
			expect(rootScope.imgToLoad).equals(3);
			expect(rootScope.count).equals(10);
			expect(rootScope.photos).eql([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.count = 7;
			rootScope.allPhotos = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ];
			$scope.onScroll();
			expect(rootScope.imgToLoad).equals(7);
			expect(rootScope.count).equals(14);
			expect(rootScope.photos).eql([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]);
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.count = 14;
			rootScope.allPhotos = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
			$scope.onScroll();
			expect(rootScope.imgToLoad).equals(1);
			expect(rootScope.count).equals(15);
		});
	});

	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			rootScope.imgToLoad = 7;
			$scope.onImgLoad();
			$scope.onImgLoad();
			$scope.onImgLoad();
			$scope.onImgLoad();
			$scope.onImgLoad();
			$scope.onImgLoad();
			$scope.onImgLoad();
			expect(rootScope.imgToLoad).equals(0);
		});
	});
});
