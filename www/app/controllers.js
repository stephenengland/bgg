/* Controllers */
/*jshint browser: true */

var bggCollectionsControllers = angular.module('bggCollectionsControllers', []);

bggCollectionsControllers.controller('CollectionsCtrl', ['$scope', '$route', '$routeParams', 'Collection', 'MultipleCollections',
  function($scope, $route, $routeParams, Collection, MultipleCollections) {
    'use strict';

    $scope.listType = 'grid';
    $scope.collections = new MultipleCollections();
    $scope.users = [];
    $scope.addUsername = '';

    $scope.showGrid = function () {
      $scope.listType = 'grid';
      $scope.updateParams();
    };

    $scope.showTable = function () {
      $scope.listType = 'table';
      $scope.updateParams();
    };


    $scope.isPolling = Collection.isPolling;

    $scope.requestCollection = function (username) {
      Collection.pollCollection(username, function (data) {
        $scope.collections.addCollection(data, username);
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
      Collection.stopPolling(username);
      var i = $scope.users.indexOf(username);
      $scope.users.splice(i, 1);
      $scope.collections.removeCollection(username);
      $scope.updateParams();
    };

    $scope.search = function () {
      $scope.collections.refreshFilters();
    };

    $scope.onFilterChange = function () {
      $scope.collections.refreshFilters();
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