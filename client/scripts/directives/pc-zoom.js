angular.module('photosAngularApp')
	.controller('pcZoomController', ['$scope', '$window', function($scope, $window) {
		$scope.onPinch = function onHammer (event) {
			var s = $scope.finalScale * event.scale;
			var dX = $scope.finalDeltaX * event.scale;
			var dY = $scope.finalDeltaY * event.scale;
			var trans = 'translate(' + dX +'px,' + dY + 'px) scale(' + s + ')';
			//console.log('pinch', trans);
			event.element.css('transform', trans);
			console.log('end of inch', trans);
		};
		$scope.onPinchEnd = function (event) {
			$scope.finalScale = $scope.finalScale * event.scale;
			if ($scope.finalScale < 1) {
				$scope.finalScale = 1;
				$scope.finalDeltaX = 0;
				$scope.finalDeltaY = 0;
			} else if ($scope.finalScale > 5) {
				$scope.finalScale = 5;
			}
			if (event.scale < 1) {
				$scope.finalDeltaX += event.deltaX;
				$scope.finalDeltaY += event.deltaY;    
				snapToBorder(event, $window);
			}
			var trans = 'translate(' + $scope.finalDeltaX +'px,' + $scope.finalDeltaY + 'px) scale(' + $scope.finalScale + ')';
			//console.log('pinch end', trans);
			event.element.css('transform', trans);
			console.log('end of pinchend', trans);
		};
		$scope.onDoubleTap = function (event) {
			if ($scope.finalScale == 1.0) {
				$scope.finalScale = 2.0;
			} else {
				$scope.finalScale  = 1.0;
				$scope.finalDeltaX = 0;
				$scope.finalDeltaY = 0;
			}
			var trans = 'translate(' + $scope.finalDeltaX +'px,' + $scope.finalDeltaY + 'px) scale(' + $scope.finalScale + ')';
			event.element.css('transform', trans);
			console.log('end of doubletap', trans);
		};
		$scope.onPan = function (event) {
			var dX = $scope.finalDeltaX + event.deltaX;
			var dY = $scope.finalDeltaY + event.deltaY;
			var trans = 'translate(' + dX +'px,' + dY + 'px) scale(' + $scope.finalScale + ')';
			event.element.css('transform', trans);
			console.log('end of pan', trans);
		};
	
		$scope.onPanEnd = function (event) {
			if ($scope.finalScale > 1) {
				/**
				 * si l'image est à sa taille originale
				 * on ne la déplace pas, elle reste centrée
				 */
				$scope.finalDeltaX += event.deltaX;
				$scope.finalDeltaY += event.deltaY;
				snapToBorder(event, $window);
			}
			var trans = 'translate(' + $scope.finalDeltaX +'px,' + $scope.finalDeltaY + 'px) scale(' + $scope.finalScale + ')';
			event.element.css('transform', trans);
			console.log('end of panEnd', trans);
		};
		function snapToBorder (event, window) {
			// taille de l'image sans le scale
			var w = event.element[0].clientWidth;
			var h = event.element[0].clientHeight;
			// taille de l'écran
			var wh = window.innerHeight;
			var ww = window.innerWidth;
			console.log('into snapToBorder image dimension='+w+'x'+h, 'screen dimension', ww+'x'+wh);
			/**
			 * si l'image est plus petite que l'écran dans un des deux dimensions
			 * on recentre l'image
			 */
			if ($scope.finalScale * w > ww) {
				/* important to use min at the end to priorise finalDeltaX to 0 */
				$scope.finalDeltaX = Math.max($scope.finalDeltaX,          -((w * $scope.finalScale / 2) - ww / 2));
				$scope.finalDeltaX = Math.min($scope.finalDeltaX,  (w * $scope.finalScale / 2) - ww / 2);
			} else {
				$scope.finalDeltaX = 0;
			}
			if (h * $scope.finalScale > wh) {
				$scope.finalDeltaY = Math.max($scope.finalDeltaY,          -((h * $scope.finalScale / 2) - wh / 2));
				$scope.finalDeltaY = Math.min($scope.finalDeltaY,   (h * $scope.finalScale / 2) - wh / 2);
			} else {
				$scope.finalDeltaY = 0;
			}
			// console.log('end of snap', $scope.finalDeltaX);
		}
		// $scope variables to facilitate unit test.
		$scope.finalScale = 1.0;
		$scope.finalDeltaX = 0;
		$scope.finalDeltaY = 0;
	}])
	.directive('pcZoom', function ($compile, $window) {
		return {
			link : function (scope, element, attrs) {
				element.attr('hm-pinch', 'onPinch($event)');
				element.attr('hm-doubletap', 'onDoubleTap($event)');
				element.attr('hm-pinchend', 'onPinchEnd($event)');
				element.attr('hm-pan', 'onPan($event)');
				element.attr('hm-panend', 'onPanEnd($event)');
				/* removeAttr needed to avoid error */
				element.removeAttr('pc-zoom');
				$compile(element)(scope);
			},
			// important to have terminal and priority with $compile
			// if not, execute controller and register event twice.
			terminal: true, 
			priority: 1000,
			controller : 'pcZoomController'
		};
	});