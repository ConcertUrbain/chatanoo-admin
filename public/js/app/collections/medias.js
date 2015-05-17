define([
  'Underscore',
  'Chatanoo',

  'app/collections/abstract',
  
  'app/models/media_model'
], function( _, Chatanoo,
  AbstractCollection,
  Media) {
  
  var Medias = AbstractCollection.extend({
      model: Media,
    badgeName: "medias",

    load: function() {
      this.remove(this.toArray());
      
      var mThis = this;
      var r = Chatanoo.medias.getMedias( {} );
      Chatanoo.medias.on( r.success, function(medias) {
        _(medias).each( function(type, label) { 
          _(type).each( function(media) { media.type = label; mThis.push(media); } ); 
        }, this );
        mThis.calculate();
        mThis.trigger("load");
      }, this);
    },
    
    getVoById: function(id, type) {
      var objects = this.toArray();
      var len = objects.length;
      for(var i = 0; i < len; i++) {
        var vo = objects[i];
        if( vo.get('id') == id && vo.get('type') == type)
          return vo;
      }
    }
  });

  return Medias
});