'use strict';

angular.module('photosAngularApp')

.directive('pcSelectionToolbar', function () {
    return {
        transclude: true,
        
        template:   '<md-toolbar ng-if="selectionMode" style="background-color:red" class="md-toolbar-tools md-green" md-whiteframe="6">' +
                        '<md-button class="md-icon-button" aria-label="close" ng-click="toggleSelectionMode(false)">' +
                            '<md-icon md-font-set="material-icons">close</md-icon>' +
                        '</md-button>' +
                        '<div ng-show="selectionLength() == 0">Sélectionner des photos</div>' +
                        '<div ng-show="selectionLength()  > 0">' +
                            '{{ selectionLength() }}' +
                        '</div>' +
                        '<div flex></div>' +
                        '<div ng-show="selectionLength()  > 0">' +
                            '<ng-transclude></ng-transclude>' +
                        '</div>' +
                    '</md-toolbar>'
    }

})

.directive('pcSelectionItem', function ($compile) {
    return {
        transclude: true,
        
        template:   '<md-checkbox ng-model="photoSelection[p.url]"' +
                        'name="{{p.url}}"' +
                        'ng-show="selectionMode" aria-label="selectionner">' +
                    '</md-checkbox><ng-transclude></ng-transclude>',

        link: function (scope, element, attrs) {
            // need link vs compile as into compile
            // transcluded code is not available
            // console.log('link', element.html());
            var a = element.find('a');
            a.attr('ng-click', 'togglePhoto($event)');
            $compile(a)(scope);
        }
    }

})

.directive('pcSelectionButton', function () {
    return {
        
        template:   '<md-button class="md-icon-button" aria-label="Custom Icon Button" ng-click="toggleSelectionMode(true)">' +
                        '<md-icon md-font-set="material-icons">check_box</md-icon>' +
                    '</md-button>'
    }       
})
    
.directive('pcSelection', function ($location) {

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
                console.log('dans togglePhoto', 'mode=', scope.selectionMode);
                if (scope.selectionMode) {
                    // <md-checkbox name="/thumbnail/folder/DSCF3853.JPG">
                    // retrieve url from name attribute and get the current state 
                    // from photoSelection[]
                    var url = angular.element(event.currentTarget).parent().parent().find('md-checkbox').attr('name')
                    // console.log(url);
                    var currentToggleState = scope.photoSelection[url];
                    scope.photoSelection[url] = !currentToggleState;
                    event.preventDefault();
                    return;
                } 
            } 
        }

    }
    
});