'use strict';

/* Controllers */

var bggCollectionsControllers = angular.module('bggCollectionsControllers', []);

bggCollectionsControllers.controller('HomeCtrl', ['$scope', 'Collection',
  function($scope, Collection) {

    $scope.loadingCollection = true;
    $scope.showInGrid = true;
    $scope.showInTable = false;
    $scope.collection = [];
    $scope.users = {};
    $scope.addUsername = '';

    $scope.refreshCollection = function () {
      var col = {};
      for (var userKey in $scope.users) {
        var user = $scope.users[userKey];
        for (var gameKey in user.collection) {
          var game = user.collection[gameKey];
          if (!col[game.objectid]) {
            col[game.objectid] = game;
            game.owners = [user.username];
          }
          else {
            col[game.objectid].owners.push(user.username)
          }
        }
      }

      $scope.collection = col;
    };

    $scope.requestCollection = function (username) {
      $scope.users[username].loadingCollection = true;
      Collection.get({
        "username": username
      }, function (data) {
        if (data.collection && data.collection.length > 0) {
          $scope.users[username].collection = data.collection;
          $scope.refreshCollection();
        }

        if (data.processing) {
          setTimeout(function () {
            $scope.requestCollection(username);
          }, 5000);
        }
        else {
          $scope.users[username].loadingCollection = false;
        }
      });
    };
    $scope.showGrid = function () {
      $scope.showInTable = false;
      $scope.showInGrid = true;
    };

    $scope.showTable = function () {
      $scope.showInTable = true;
      $scope.showInGrid = false;
    };

    $scope.addUser = function () {
      $scope.users[$scope.addUsername] = { "username": $scope.addUsername };
      $scope.requestCollection($scope.addUsername); //TODO: Add error handling logic
    };
  }]);