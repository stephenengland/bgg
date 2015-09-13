'use strict';

/* Controllers */

var bggCollectionsControllers = angular.module('bggCollectionsControllers', []);

bggCollectionsControllers.controller('HomeCtrl', ['$scope', 'Collection',
  function($scope, Collection) {

    $scope.loadingCollection = true;
    $scope.collection = [];

    var requestCollection = function () {
      Collection.get({
        "username": "nitroscen"
      }, function (data) {
        if (data.collection && data.collection.length > 0) {
          $scope.collection = data.collection;
        }

        if (data.processing) {
          setTimeout(requestCollection, 5000);
        }
        else {
          $scope.loadingCollection = false;
        }
      });
    };
    requestCollection();
  }]);