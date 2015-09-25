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

bggCollectionsServices.factory('MultipleCollections', [ '$rootScope', 'Game', function ($rootScope, Game) {
  'use strict';

  return function () {
    var $this = this;

    $this.userCollectionsData = {};

    $this.games = {};
    $this.filterByName = '';
    $this.filteredAndSortedGames = [];
    $this.minimumPlayers = 1;
    $this.maximumPlayers = 30;
    $this.minPlayersFilter = 1;
    $this.maxPlayersFilter = 30;

    $this.minimumRating = 1;
    $this.maximumRating = 10;
    $this.ratingFilter = 1;

    $this.refreshAggregateData = function () {
      var game = _.min($this.games, function (game) {
        return (game.minplayers && parseInt(game.minplayers)) || 99;
      });

      $this.minimumPlayers = (game && game.minplayers) || 99;
      
      if ($this.minimumPlayers === 99) {
        $this.minimumPlayers = 1;
      }

      game = _.max($this.games, function (game) {
        return (game.maxplayers && parseInt(game.maxplayers)) || 0;
      }).maxplayers || 0;

      $this.maximumPlayers = (game && game.maxplayers) || 0;
      
      if ($this.maximumPlayers >= 30 || $this.maximumPlayers === 0) {
        $this.maximumPlayers = 30;
      }

      if ($this.minPlayersFilter < $this.minimumPlayers) {
        $this.minPlayersFilter = $this.minimumPlayers;
      }

      if ($this.maxPlayersFilter > $this.maximumPlayers) {
        $this.maxPlayersFilter = $this.maximumPlayers;
      }

      game = _.max($this.games, function (game) {
        return (game.bggrating && parseFloat(game.bggrating)) || -1;
      });

      $this.maximumRating = game.bggrating || 10;
    };

    $this.gameIsWithinRange = function (game) {
      var minPlayers = (game.minplayers && parseInt(game.minplayers)) || 1;
      var maxPlayers = (game.maxplayers && parseInt(game.maxplayers)) || 30;
      var rating = (game.bggrating && parseFloat(game.bggrating)) || 0;

      return $this.maxPlayersFilter >= minPlayers && $this.minPlayersFilter <= maxPlayers && ($this.ratingFilter <= 1 || $this.ratingFilter <= rating);
    };

    $this.refreshFilters = function () {
      var chainedLodashCollection = _.chain($this.games);
      if ($this.filterByName.length > 2) {
        chainedLodashCollection = chainedLodashCollection.filter(function (game) {
          return game.name.toLowerCase().indexOf($this.filterByName.toLowerCase()) > -1;
        });
      }
      chainedLodashCollection = chainedLodashCollection.filter($this.gameIsWithinRange);
      chainedLodashCollection = chainedLodashCollection.sortBy('name');

      $this.filteredAndSortedGames = chainedLodashCollection.value();
    };

    $this.refresh = function () {
      $this.games = {};
      for (var userKey in $this.userCollectionsData) {
        var collection = $this.userCollectionsData[userKey];
        for (var gameKey in collection) {
          var ownersGame = collection[gameKey];
          if (!$this.games[ownersGame.objectid]) {
            $this.games[ownersGame.objectid] = new Game(ownersGame, userKey);
          }
          else {
            $this.games[ownersGame.objectid].addOwnerIfNotExists(userKey, ownersGame);
          }
        }
      }

      $this.refreshAggregateData();
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
    this.name = username;
    this.rating = game.userrating;

    return this;
  };
}]);

bggCollectionsServices.factory('Game', ['Owner', function (Owner) {
  'use strict';

  //Game 'constructor'
  return function (game, owner) {
    game.owners = [ new Owner(owner, game) ];

    game.addOwnerIfNotExists = function (owner, ownersGame) {
      if (!_.find(game.owners, 'username', owner)) {
        game.owners.push(new Owner(owner, ownersGame));
      }
    };

    game.rating = function () {
      return parseFloat(game.bggrating).toFixed(1);
    };

    return game;
  };
}]);