/* Services */

var bggCollectionsServices = angular.module('bggCollectionsServices', ['ngResource']);

bggCollectionsServices.factory('Collection', ['$resource',
  function ($resource) {
    'use strict';

    var resource = $resource('/api/collection/:username', {}, {
      query: {
        method:'GET', 
        params: {
          username: 'username'
        }
      }
    });

    resource.usersInterval = {};
    resource.usersLoading = {};

    //Polls a username's collection until it gets back data from BGG
    resource.pollCollection = function (username, collectionCallback) {
      resource.usersLoading[username] = true;
      resource.get({
        "username": username
      }, function (data) {
        collectionCallback(data);

        if (data.processing) {
          if (!resource.usersInterval[username]) {
            resource.usersInterval[username] = setInterval(function () {
              resource.pollCollection(username, collectionCallback);
            }, 5000);
          }
        }
        else {
          resource.usersLoading[username] = false;
          if (resource.usersInterval[username]) {
            clearInterval(resource.usersInterval[username]);
          }
        }
      });
    };

    resource.stopPolling = function (username) {
      if (resource.usersInterval[username]) {
        clearInterval(resource.usersInterval[username]);
      }
    };

    resource.isPolling = function () {
      if (Object.keys(resource.usersLoading).length === 0) {
        return false;
      }

      return _.some(resource.usersLoading, function (user) {
        return user;
      });
    };

    return resource;
  }
]);

bggCollectionsServices.factory('MultipleCollections', [ '$rootScope', 'Owner', function ($rootScope, Owner) {
  'use strict';

  return function () {
    var $this = this;

    $this.userCollectionsData = {};

    $this.games = {};
    $this.filterByName = '';
    $this.filteredAndSortedGames = [];

    $this.refreshFilters = function () {
      var chainedLodashCollection = _.chain($this.games);
      if ($this.filterByName.length > 2) {
        chainedLodashCollection = chainedLodashCollection.filter(function (game) {
          return game.name.toLowerCase().indexOf($this.filterByName.toLowerCase()) > -1;
        });
      }
      chainedLodashCollection = chainedLodashCollection.sortBy('name');

      $this.filteredAndSortedGames = chainedLodashCollection.value();
    };

    $this.refresh = function () {
      var addOwnerIfNotExists = function (username, joinedGame, ownersGame) {
        if (!_.find(joinedGame.owners, 'username', username)) {
          joinedGame.owners.push(new Owner(username, ownersGame));
        }
      };

      $this.games = {};
      for (var userKey in $this.userCollectionsData) {
        var collection = $this.userCollectionsData[userKey];
        for (var gameKey in collection) {
          var ownersGame = collection[gameKey];
          if (!$this.games[ownersGame.objectid]) {
            $this.games[ownersGame.objectid] = ownersGame;
            ownersGame.owners = [ new Owner(userKey, ownersGame) ];
          }
          else {
            addOwnerIfNotExists(userKey, $this.games[ownersGame.objectid], ownersGame);
          }
        }
      }

      $this.refreshFilters();
    };

    $this.addCollection = function (data, username) {
      if (data.collection && data.collection.length > 0) {
        $this.userCollectionsData[username] = data.collection;
        $this.refresh();
      }
    };

    $this.removeCollection = function (username) {
      if (username && username.length > 0) {
        delete $this.userCollectionsData[username];
        $this.refresh();
      }
    };

    return $this;
  };
}]);

bggCollectionsServices.factory('Owner', [ function () {
  'use strict';

  //Owner 'constructor'
  return function (username, game) {
    this.username = username;
    this.rating = game.userrating;

    return this;
  };
}]);