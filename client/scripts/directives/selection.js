'use strict';

angular.module('photosAngularApp')
.directive('selection', function ($location) {

    return {
        link : function (scope, element, attrs) {

            scope.selectionMode = false;

            scope.photoSelection = {};

            // Utilise pour le message "Sélectionner des photo"
            scope.selectionLength = function () {
                var result = 0;
                for (var key in scope.photoSelection) {
                    if (scope.photoSelection[key] == true) {
                        result += 1;
                    }
                }
                return result;
            }

            scope.toggleSelectionMode = function (changeTo) {
                scope.selectionMode = changeTo;
                if (scope.selectionMode == false) {
                    scope.photoSelection = {};
                }
            };

            /*
            * If selectionMode ON then, click a photo, check corresponding checkbox
            * else if selectionMode OFF, click = default event = open photo
            */
            scope.togglePhoto = function (event) {
                console.log('dans togglePhoto');
                if (scope.selectionMode) {
                    // href is absolute
                    // TODO get photoUrl from checkbox
                    var href = event.currentTarget.href;
                    var url = ('/' + href.replace($location.$$absUrl, '').replace('photo','thumbnail'));
                    var currentToggleState = scope.photoSelection[url];
                    scope.photoSelection[url] = !currentToggleState;
                    event.preventDefault();
                    return;
                } 
            } 
        }

    }
    
});