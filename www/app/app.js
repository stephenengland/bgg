'use strict';

var bggCollectionsApp = angular.module('bggCollectionsApp', [
  'ngRoute',
  'bggCollectionsControllers',
  'bggCollectionsServices'
]);

bggCollectionsApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);