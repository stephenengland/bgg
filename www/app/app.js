var bggCollectionsApp = angular.module('bggCollectionsApp', [
  'ngRoute',
  'bggCollectionsControllers',
  'bggCollectionsServices'
]);

bggCollectionsApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    "use strict";

    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/collections/:usernames?', {
        templateUrl: 'partials/collections.html',
        controller: 'CollectionsCtrl'
      }).
      otherwise({
        redirectTo: '/collections/'
      });
  }]);