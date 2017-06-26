'use strict';

/**
 * @ngdoc directive
 * @name kosApp.directive:pilot
 * @description
 * # pilot
 */
angular.module('kosApp')
    .directive('pilot', function() {
        return {
            templateUrl: '../scripts/directives/pilot.html',
            restrict: 'E',
            replace: true,
            scope: {
                'callsign': '@',
                'warningMessage': '@'
            },
            link: function postLink(scope, element, attrs) {
                //element.text('this is the pilot directive');
            }
        };
    });
