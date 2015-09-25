var bggCollectionsApp = angular.module('bggCollectionsApp', [
  'ngRoute',
  'bggCollectionsControllers',
  'bggCollectionsServices',
  'rzModule'
]);

bggCollectionsApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    "use strict";

    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/collections/:list?/:usernames?', {
        templateUrl: 'partials/collections.html',
        controller: 'CollectionsCtrl'
      }).
      otherwise({
        redirectTo: '/collections/'
      });
  }]);