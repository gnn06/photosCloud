'use strict';

angular.module('photosAngularApp')
	.animation('.panel', function ($animateCss, $mdPanel, $mdUtil) {
		console.log('dans animation');
		return {
			addClass: function(element, className, doneFn) {
				console.log('addClass');
				var panelAnimation = $mdPanel.newPanelAnimation()
					.duration(300 || this.separateDurations)
					.openFrom('.animation-target')
					.closeTo('.animation-target')
					.withAnimation($mdPanel.animation.SCALE);
				var animator = $mdUtil.dom.animator;
				var button = panelAnimation._openFrom;
				var openScale = animator.calculateZoomToOrigin(element, button) || '';
				// cleanup necessaire sinon transform persiste après 2° hide
				// ce qui fausse le 2° calcul de zoom
				return $animateCss(element, {
					// appel avec structural ne permet pas d'enlever ng-hide
					// {
					//   event:'hide', 
					//   structural:true 
					// }
					addClass : 'ng-hide',
					from: { transform: ''},
					to: { transform: openScale },
					cleanupStyles: true
				});
			},
			
			removeClass: function(element, className, doneFn) {
				console.log('removeClass');
				var panelAnimation = $mdPanel.newPanelAnimation()
					.duration(300 || this.separateDurations)
					.openFrom('.animation-target')
					.closeTo('.animation-target')
					.withAnimation($mdPanel.animation.SCALE);
				var animator = $mdUtil.dom.animator;
				var button = panelAnimation._openFrom;
				var openScale = animator.calculateZoomToOrigin(element, button) || '';
				return $animateCss(element, {
					/*event:'hide',
					structural:true */
					removeClass:'ng-hide',
					from: { transform: openScale },
					to: { transform: ''}
				});
			}
		};
	});
console.log('end of animation');