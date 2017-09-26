'use strict';

angular.module('photosAngularApp')
.directive('loadOnScroll', function ($rootScope, $location, $timeout) {
    console.log('directive');
    
    return {
        link : function (scope, element, attrs) {

            // Ne pas executer à chaque fois sinon perte des données sauvegardées
            if ($rootScope.scrollPos == undefined) {
                $rootScope.scrollPos = {};
            }

            console.log('register scroll event');
    
            element.on("scroll", function () {
                // element is a angular jqlite one. element[0] is the raw dom element
                // console.log('scroll, element[0].scrollTop ', element[0].scrollTop, ', element.scrollHeight ', element[0].scrollHeight, 'element.clientHeight', 
                //     element[0].clientHeight, 'url:', $location.url());
                $rootScope.scrollPos[$location.path()] = element[0].scrollTop;
                if(element[0].scrollHeight === (element[0].clientHeight + element[0].scrollTop)) {
                    if ($rootScope.count < $rootScope.allPhotos.length) {
                        console.log('add photos', '$rootScope.count', $rootScope.count);
                        $rootScope.count += 36;
                        $rootScope.photos = scope.photos = $rootScope.allPhotos.slice(0, $rootScope.count);
                        scope.$apply();
                    }
                }
            }) ;

            scope.$on("$destroy", function() {
                console.log('destroy');
                element.off("scroll");
            });

            scope.$on('$routeChangeStart', function () {
                console.log('into routeChangeStart');
                console.log('scrollPosition: ', $rootScope.scrollPos, 'path', $location.path());
                $rootScope.scrollPos[$location.path()] = element[0].scrollTop;
            })
    
            scope.$on('$routeChangeSuccess', function() {
                // console.log('into routeChangeSuccess');
                $timeout(function() { // wait for DOM, then restore scroll position
                    console.log('into timeout', $location.path(), $rootScope.scrollPos);
                    console.log('restore scroll', $location.path(), $rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0)
                    element[0].scrollTop = $rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0;
                }, 10);
            });
        }
    }
});
