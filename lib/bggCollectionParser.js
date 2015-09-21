module.exports = {
  "parseResults": function(result) {
    var xmlItems = result.items && result.items.item;
    var items = [];

    if (xmlItems) {
      for (var i = 0; i < xmlItems.length; i++) {
        var game = xmlItems[i];
        items.push({
          "subtype": game.$.subtype,
          "objectid": game.$.objectid,
          "collid": game.$.collid,
          "name": game.name && game.name[0]._,
          "image": game.image && game.image[0],
          "thumbnail": game.thumbnail && game.thumbnail[0]
        });
      } 
    }

    return items;
  }
};
