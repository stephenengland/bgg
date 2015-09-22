/* Controllers */
/*jshint browser: true */

var bggCollectionsControllers = angular.module('bggCollectionsControllers', []);

bggCollectionsControllers.controller('CollectionsCtrl', ['$scope', '$route', '$routeParams', 'Collection', 'MultipleCollections',
  function($scope, $route, $routeParams, Collection, MultipleCollections) {
    'use strict';

    $scope.listType = 'grid';
    $scope.collections = new MultipleCollections();
    $scope.filteredCollection = [];
    $scope.users = [];
    $scope.usersInterval = {};
    $scope.usersLoading = {};
    $scope.addUsername = '';
    $scope.searchFilter = '';

    $scope.showGrid = function () {
      $scope.listType = 'grid';
      $scope.updateParams();
    };

    $scope.showTable = function () {
      $scope.listType = 'table';
      $scope.updateParams();
    };


    $scope.getIsLoadingCollection = function () {
      if (Object.keys($scope.usersLoading).length === 0) {
        return false;
      }

      return _.some($scope.usersLoading, function (user) {
        return user;
      });
    };


    $scope.refreshFilters = function () {
      var chainedLodashCollection = _.chain($scope.collections.games);
      if ($scope.searchFilter.length > 2) {
        chainedLodashCollection = chainedLodashCollection.filter(function (game) {
          return game.name.toLowerCase().indexOf($scope.searchFilter.toLowerCase()) > -1;
        });
      }
      chainedLodashCollection = chainedLodashCollection.sortBy('name');

      $scope.filteredCollection = chainedLodashCollection.value();
    };

    $scope.$watch('collectionRefreshed', function () {
      console.log($scope.collections);
      console.log($scope.collections.userCollectionsData);
      console.log($scope.collections.games); //WTF IS GOING ON HERE!?!?
      $scope.refreshFilters();
    });

    $scope.requestCollection = function (username) {
      $scope.usersLoading[username] = true;
      Collection.get({
        "username": username
      }, function (data) {
        $scope.collections.addCollection(data, username);

        if (data.processing) {
          if (!$scope.usersInterval[username]) {
            $scope.usersInterval[username] = setInterval(function () {
              $scope.requestCollection(username);
            }, 5000);
          }
        }
        else {
          $scope.usersLoading[username] = false;
          if ($scope.usersInterval[username]) {
            clearInterval($scope.userIntervals[username]);
          }
        }
      });
    };

    $scope.addUser = function (username, updatingParams) {
      username = username && username.length && username.toLowerCase();
      if (username && username.length > 2 && !_.includes($scope.users, username)) {
        $scope.users.push(username);
        $scope.requestCollection(username); //TODO: Add error handling logic 

        if (!updatingParams) {
          $scope.updateParams();
        }
      }
    };

    $scope.removeUser = function (username) {
      if ($scope.userIntervals[username]) {
        clearInterval($scope.userIntervals[username]);
      }
      $scope.collections.removeCollection(username);
      $scope.updateParams();
    };

    $scope.search = function () {
      $scope.refreshFilters();
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
      for (var usernameIndex in $scope.users) {
        if (!first) {
          usernames += '-';
        }
        usernames += $scope.users[usernameIndex];
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