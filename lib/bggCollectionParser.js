module.exports = {
  "parseResults": function(result) {
    var xmlItems = result && result.items && result.items.item;
    var items = [];

    /* 
     * NEVER TRUST EXTERNAL DATA!! :)
     * If anyone wants to 'fix' this and make the XML parsing sane.. go for it. I hate XML.
     */
    if (xmlItems) {
      for (var i = 0; i < xmlItems.length; i++) {
        var game = xmlItems[i];
        items.push({
          "subtype": game.$ && game.$.subtype,
          "objectid": game.$ && game.$.objectid,
          "collid": game.$ && game.$.collid,
          "name": game.name && game.name.length && game.name[0] && game.name[0]._,
          "image": game.image && game.image.length && game.image[0],
          "thumbnail": game.thumbnail && game.thumbnail.length && game.thumbnail[0],
          "yearpublished": game.yearpublished && game.yearpublished.length && game.yearpublished[0],
          "minplayers": game.stats && game.stats.length && game.stats[0].$ && game.stats[0].$.minplayers,
          "maxplayers": game.stats && game.stats.length && game.stats[0].$ && game.stats[0].$.maxplayers,
          "minplaytime": game.stats && game.stats.length && game.stats[0].$ && game.stats[0].$.minplaytime,
          "maxplaytime": game.stats && game.stats.length && game.stats[0].$ && game.stats[0].$.maxplaytime,
          "userrating": game.stats && game.stats.length && game.stats[0].rating && game.stats[0].rating.length && game.stats[0].rating[0].$ && game.stats[0].rating[0].$.value !== 'N/A' && game.stats[0].rating[0].$.value,
          "bggrating": game.stats && game.stats.length && game.stats[0].rating && game.stats[0].rating.length && game.stats[0].rating[0].bayesaverage && game.stats[0].rating[0].bayesaverage.length && game.stats[0].rating[0].bayesaverage[0].$ && game.stats[0].rating[0].bayesaverage[0].$.value
        });
      } 
    }

    return items;
  }
};
