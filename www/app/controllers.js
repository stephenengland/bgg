/* Controllers */
/*jshint browser: true */

var bggCollectionsControllers = angular.module('bggCollectionsControllers', []);

bggCollectionsControllers.controller('CollectionsCtrl', ['$scope', '$route', '$routeParams', 'Collection',
  function($scope, $route, $routeParams, Collection) {
    'use strict';

    $scope.listType = 'grid';
    $scope.collection = [];
    $scope.filteredCollection = [];
    $scope.users = {};
    $scope.addUsername = '';
    $scope.searchFilter = '';
    $scope.getIsLoadingCollection = function () {
      if (Object.keys($scope.users).length === 0) {
        return false;
      }

      return _.some($scope.users, function (user) {
        return user.loadingCollection;
      });
    };

    $scope.refreshFilters = function () {
      var chainedLodashCollection = _.chain($scope.collection);
      if ($scope.searchFilter.length > 2) {
        chainedLodashCollection = chainedLodashCollection.filter(function (game) {
          return game.name.toLowerCase().indexOf($scope.searchFilter.toLowerCase()) > -1;
        });
      }
      chainedLodashCollection = chainedLodashCollection.sortBy('name');

      $scope.filteredCollection = chainedLodashCollection.value();
    };

    $scope.refreshCollection = function () {
      var col = {};
      var addOwnerIfNotExists = function (game, username) {
        if (!_.find(game.owners, function(owner) { return owner === username; })) {
          game.owners.push(username);
        }
      };

      for (var userKey in $scope.users) {
        var user = $scope.users[userKey];
        for (var gameKey in user.collection) {
          var game = user.collection[gameKey];
          if (!col[game.objectid]) {
            col[game.objectid] = game;
            game.owners = [user.username];
          }
          else {
            addOwnerIfNotExists(col[game.objectid], user.username);
          }
        }
      }
      $scope.collection = col;
      $scope.refreshFilters();
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
          if (!$scope.users[username].interval) {
            $scope.users[username].interval = setInterval(function () {
              $scope.requestCollection(username);
            }, 5000);
          }
        }
        else {
          $scope.users[username].loadingCollection = false;
          if ($scope.users[username].interval) {
            clearInterval($scope.users[username].interval);
          }
        }
      });
    };

    $scope.showGrid = function () {
      $scope.listType = 'grid';
      $scope.updateParams();
    };

    $scope.showTable = function () {
      $scope.listType = 'table';
      $scope.updateParams();
    };

    $scope.parseUsernames = function () {
      if ($routeParams.usernames) {
        return $routeParams.usernames.split('-'); 
      }

      return [];
    };

    $scope.updateParams = function () {
      var usernames = '';
      var first = true;
      var users = _.sortBy($.map($scope.users, function(v, i) {
        return i;
      }), function (username) {
        return username;
      });
      for (var usernameIndex in users) {
        if (!first) {
          usernames += '-';
        }
        usernames += users[usernameIndex];
        first = false;
      }
      var params = {
        "usernames": usernames
      };

      if ($scope.listType === 'table') {
        params.list = 'table';
      }
      else {
        params.list = 'grid';
      }

      $route.updateParams(params);
    };

    $scope.addUser = function (username, updatingParams) {
      if (username && username.length > 2) {
        $scope.users[username] = { "username": username };
        $scope.requestCollection(username); //TODO: Add error handling logic 

        if (!updatingParams) {
          $scope.updateParams();
        }
      }
    };

    $scope.removeUser = function (username) {
      if ($scope.users[username].interval) {
        clearInterval($scope.users[username].interval);
      }
      delete $scope.users[username];
      $scope.refreshCollection();
      $scope.updateParams();
    };

    $scope.search = function () {
      $scope.refreshFilters();
    };

    $scope.updateFromRoute = function () {
      var users = $scope.parseUsernames();
      for (var i=0; i<users.length; i++) {
        $scope.addUser(users[i], true);
      }

      if ($routeParams.list === 'table') {
        $scope.listType = 'table';
      }
    };

    $scope.updateFromRoute();
  }]);