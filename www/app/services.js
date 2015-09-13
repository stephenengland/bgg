'use strict';

/* Services */

var bggCollectionsServices = angular.module('bggCollectionsServices', ['ngResource']);

bggCollectionsServices.factory('Collection', ['$resource',
  function($resource){
    return $resource('collection/:username', {}, {
      query: {
        method:'GET', 
        params:{
          username:'username'
        }
      }
    });
  }
]);