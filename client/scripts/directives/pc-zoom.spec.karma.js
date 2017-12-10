/**
     * Given image 
     * When image aggrandie encore plus petite que l'ecran
     * Then image s'agrandie et reste centrée 
 *
 */
'use strict';

describe('pc-zoom', function () {
	
	var $scope;
	var element;
	var window;
	
	beforeEach(module('photosAngularApp'));

	afterEach(function() {
		element.remove();
	});

	beforeEach(function(/*done*/) {
		inject(function($rootScope, $controller, $compile, $document, $window) {
			$scope = $rootScope.$new();
			$controller('pcZoomController', {$scope:$scope});

			/**
			 * solution 1
			 * soit on crée une vraie balise IMG, l'image doit être téléchargeable
			 * il faut alors gérer le temps de téléchargement de l'image via event onload
			 * et retardé l'éxécution du test via le done()
			 * 
			 * inconvénient : la taille de l'image et de la fenêtre est difficile à controler.
			 */
			var content = angular.element('<div class="container"><div class="content" pc-zoom></div></div>');
			element = content.find('DIV');
			// wait event load is needed to have the image width
			// element.bind('load', function() {
			// 	// console.log('image loaded', element[0].clientWidth);
			// 	done();
			// });
			// if element is not appended to the body, the width image is not available
			angular.element($document[0].body).append(content);
			$scope.$digest();

			/**
			 * solution 2
			 * on mock element complétement
			 * avantage : 
			 *  - on contrôle la taille de l'image et de la fenetre
			 *  - pas besoin d'avoir l'image téléchargeable
			 */


			// element = [];
			// element[0] = {};
			// element[0].clientWidth  = 300;
			// element[0].clientHeight = 200;
			// element._css_ = '';
			// element.css = function(key, value) { 
			// 	if (value == undefined) { 
			// 		return this._css_;
			// 	} else { 
			// 		this._css_ = value;
			// 	}
			// };
	
			window = $window;
			window.innerWidth  = 300;
			window.innerHeight = 200;
			// console.log('dans beforeEach', element[0].clientWidth);

			// window = content;

			$scope.finalScale  = 1;
			$scope.finalDeltaX = 0;
			$scope.finalDeltaY = 0;

		});
	});

	/**
	 * Given image à taille d'origine
     * When reduit
     * Then l'image reprend sa taille d'origine
	 */
	describe('given image à taille d"origine, when pinch', function () {
		it('then image reprend sa tailel d"origine', function () {	
			// console.log('start of test');	
			var event = { element: element, scale: 0.9, deltaX: 0, deltaY: 0 };
			$scope.onPinchEnd(event);
			var trans = event.element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(1)');
		});
	});
	
	/**
	 * Given image à taille d'origine
	 * When aggeandi
	 * Then l'image est aggrandie
	 */
	describe('given image à taille d"origine, when zoom', function () {
		it('then image reprend sa tailel d"origine', function () {	
			// console.log('start of test');	
			var event = { element: element, scale: 1.1, deltaX: 0, deltaY: 0 };
			$scope.onPinchEnd(event);
			var trans = event.element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(1.1)');
		});
	});

	/**
	 * Image taille origine
	 * When pan
	 * Then l'image bouge, quand on arrête l'image reprend sa position d'origine centrée
	 */
	describe('given image à taille d"origine, when pan', function () {
		it('then l\'image reprend sa position', function () {	
			// console.log('start of test');	
			var event = { element: element, scale: 1, deltaX: 10, deltaY: 10 };
			$scope.onPanEnd(event);
			var trans = event.element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(1)');
		});
	});

	describe('given image rétrécie, when pan', function () {
		it('then l\'image ne bouge pas', function () {	
			// console.log('start of test');	
			$scope.finalScale = 0.9;
			$scope.onPanEnd({ element: element, scale: 0.9, deltaX: 10, deltaY: 10 });
			var trans = element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(0.9)');
		});
	});

	describe('given image à taille d\'origine, when pan au dela du cadre', function () {
		it('then l\'image se recadre', function () {
			$scope.finalScale  = 1;
			$scope.finalDeltaX = 0;
			$scope.finalDeltaY = 0;
			// $scope.onPanEnd({ element: element, scale: 0.9, deltaX: 10, deltaY: 10 });
			$scope.onPanEnd({ element: element, deltaX: 10, deltaY: 10 });
			// var trans = element.css('transform');
			var trans = element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(1)');
		});
	});

	describe('given image aggrandie, when pan au limite du cadre', function () {
		it('then l\'image se déplace à la limite', function () {
			$scope.finalScale  = 2;
			$scope.finalDeltaX = 0;
			$scope.finalDeltaY = 0;
			// $scope.onPanEnd({ element: element, scale: 0.9, deltaX: 10, deltaY: 10 });
			$scope.onPanEnd({ element: element, deltaX: 150, deltaY: 100 });
			// var trans = element.css('transform');
			var trans = element.css('transform');
			expect(trans).to.equal('translate(150px, 100px) scale(2)');
		});
	});

	describe('given image aggrandie, when pan au dela du cadre', function () {
		it('then l\'image se recadre', function () {
			$scope.finalScale  = 2;
			$scope.finalDeltaX = 0;
			$scope.finalDeltaY = 0;
			// $scope.onPanEnd({ element: element, scale: 0.9, deltaX: 10, deltaY: 10 });
			$scope.onPanEnd({ element: element, deltaX: 160, deltaY: 110 });
			// var trans = element.css('transform');
			var trans = element.css('transform');
			expect(trans).to.equal('translate(150px, 100px) scale(2)');
		});
	});

	describe('given image aggrandie et décalée, when pinch à 0.9', function () {
		it('then l\'image se recadre', function () {
			window.innerWidth  = 300;
			window.innerHeight = 300;

			$scope.finalScale  = 1.5; // => img dimension = 450x300
			$scope.finalDeltaX = 0;
			$scope.finalDeltaY = 50;
			// $scope.onPanEnd({ element: element, scale: 0.9, deltaX: 10, deltaY: 10 });
			$scope.onPinchEnd({ element: element, scale: 0.9, deltaX: 0, deltaY: 0 });
			// var trans = element.css('transform');
			var trans = element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(1.35)');
		});
	});

	describe('given image aggrandie et décalée, when pinch à 0.9 avec décalage', function () {
		it('then l\'image se recadre', function () {
			window.innerWidth  = 300;
			window.innerHeight = 300;

			$scope.finalScale  = 1.5; // => img dimension = 450x300
			$scope.finalDeltaX = 0;
			$scope.finalDeltaY = 50;
			// $scope.onPanEnd({ element: element, scale: 0.9, deltaX: 10, deltaY: 10 });
			$scope.onPinchEnd({ element: element, scale: 0.9, deltaX: 0, deltaY: 10 });
			// var trans = element.css('transform');
			var trans = element.css('transform');
			expect(trans).to.equal('translate(0px, 0px) scale(1.35)');
		});
	});
});