angular.module('photosAngularApp')
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
			controller : function ($scope) {
				var finalScale = 1.0;
				var finalDeltaX = 0;
				var finalDeltaY = 0;
				$scope.onPinch = function onHammer (event) {
					var s = finalScale * event.scale;
					var dX = finalDeltaX * event.scale;
					var dY = finalDeltaY * event.scale;
					var trans = 'translate(' + dX +'px,' + dY + 'px) scale(' + s + ')';
					//console.log('pinch', trans);
					event.element.css('transform', trans);
					console.log('end of inch', finalDeltaX);
				};
				$scope.onPinchEnd = function (event) {
					finalScale = finalScale * event.scale;
					if (finalScale < 1) {
						finalScale = 1;
						finalDeltaX = 0;
						finalDeltaY = 0;
					} else if (finalScale > 5) {
						finalScale = 5;
					}
					if (event.scale < 1) {
						finalDeltaX += event.deltaX;
						finalDeltaY += event.deltaY;    
						snapToBorder(event);
					}
					//console.log(finalDeltaX);
					var trans = 'translate(' + finalDeltaX +'px,' + finalDeltaY + 'px) scale(' + finalScale + ')';
					//console.log('pinch end', trans);
					event.element.css('transform', trans);
					console.log('end of pinchend', finalDeltaX);
				};
				$scope.onDoubleTap = function (event) {
					if (finalScale == 1.0) {
						finalScale = 2.0;
					} else {
						finalScale  = 1.0;
						finalDeltaX = 0;
						finalDeltaY = 0;
					}
					var trans = 'translate(' + finalDeltaX +'px,' + finalDeltaY + 'px) scale(' + finalScale + ')';
					event.element.css('transform', trans);
					console.log('end of doubletap', finalDeltaX);
				};
				$scope.onPan = function (event) {
					if (finalScale > 1) {
						var dX = finalDeltaX + event.deltaX;
						var dY = finalDeltaY + event.deltaY;
						var trans = 'translate(' + dX +'px,' + dY + 'px) scale(' + finalScale + ')';
						event.element.css('transform', trans);
						console.log('end of pan', finalDeltaX);
					}
				};
				function snapToBorder (event, window) {
					var w = event.element[0].clientWidth;
					var h = event.element[0].clientHeight;
					var wh = window.innerHeight;
					var ww = window.innerWidth;
					/* important to use min at the end to priorise finalDeltaX to 0 */
					finalDeltaX = Math.max(finalDeltaX,          -((w * finalScale / 2) - ww / 2));
					finalDeltaX = Math.min(finalDeltaX,  (w * finalScale / 2) - ww / 2);
					finalDeltaY = Math.max(finalDeltaY,          -((h * finalScale / 2) - wh / 2));
					finalDeltaY = Math.min(finalDeltaY,   (h * finalScale / 2) - wh / 2);
					console.log('end of snap', finalDeltaX);
				}
            
				$scope.onPanEnd = function (event) {
					finalDeltaX += event.deltaX;
					finalDeltaY += event.deltaY;
					snapToBorder(event, $window);
					var trans = 'translate(' + finalDeltaX +'px,' + finalDeltaY + 'px) scale(' + finalScale + ')';
					event.element.css('transform', trans);
					console.log('end of panEnd', finalDeltaX);
				};
			}
		};
	});