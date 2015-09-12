'use strict';

/* Controllers */

var bggCollectionsControllers = angular.module('bggCollectionsControllers', []);

bggCollectionsControllers.controller('HomeCtrl', ['$scope',
  function($scope) {
    $scope.test = 'property';
  }]);