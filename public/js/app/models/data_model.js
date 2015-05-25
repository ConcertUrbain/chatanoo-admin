define([
  'backbone',
  'underscore',
  'chatanoo'
], function(Backbone, _, Chatanoo) {

  var Data = Backbone.Model.extend(
  {
      // Default attributes for the Query item.
      defaults: function() {
        return {};
      },

      initialize: function() {

      },

    validateVo: function() {},
    unvalidateVo: function() {},

    deleteVo: function() {
      var r = Chatanoo.datas.deleteData( this.get("id"), this.get('type') );
      Chatanoo.datas.on( r.success, function( bool ) {
        this.trigger("delete");
      }, this);
    },

    addVo: function(options) {
      var service, method, isMedia = false, r;
      switch( this.get( 'voType' ) ) {
        case 'Query': service = Chatanoo.queries; method = service.addDataIntoVo; break;
        case 'Item': service = Chatanoo.items; method = service.addDataIntoVo; break;
        case 'Comment': service = Chatanoo.comments; method = service.addDataIntoVo; break;
        case 'User': service = Chatanoo.users; method = service.addDataIntoVo; break;

        case 'Sound':
        case 'Video':
        case 'Picture':
        case 'Text': isMedia = true; service = Chatanoo.medias; method = service.addDataIntoMedia; break;
      }

      var data = _.extend(this.toJSON(), options);
      delete data.voId;
      delete data.voType;
      delete data.type;

      if( isMedia )
        r = method.apply( service, [ data, this.get( 'voId' ), this.get( 'voType' ) ] );
      else
        r = method.apply( service, [ data, this.get( 'voId' ) ] );
      service.on( r.success, function( dataId ) {
        this.set( 'id', dataId );
        this.set( data );
        this.trigger("added");
      }, this);
    },

    editVo: function(options) {
      var data = _.extend(this.toJSON(), options);
      delete data.voId;
      delete data.voType;
      delete data.type;

      var r = Chatanoo.datas.setData( data );
      Chatanoo.datas.on( r.success, function( dataId ) {
        this.set(options);
        this.trigger("edited");
      }, this);
    }
  });
  //_.extend(Media, Chatanoo.ValueObject.Media.Abstract);

  return Data;
});
