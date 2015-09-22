/* Services */

var bggCollectionsServices = angular.module('bggCollectionsServices', ['ngResource']);

bggCollectionsServices.factory('Collection', ['$resource',
  function ($resource) {
    'use strict';

    return $resource('/api/collection/:username', {}, {
      query: {
        method:'GET', 
        params: {
          username: 'username'
        }
      }
    });
  }
]);

bggCollectionsServices.factory('MultipleCollections', [ '$rootScope', 'Owner', function ($rootScope, Owner) {
  'use strict';

  return function () {
    var $this = this;

    $this.userCollectionsData = {};

    $this.games = {};

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
            addOwnerIfNotExists(user.username, $this.games[ownersGame.objectid], ownersGame);
          }
        }
      }

      $rootScope.$emit('collectionRefreshed', {}); 
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