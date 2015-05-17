define([
  'Backbone',
  'Underscore',
  'Chatanoo',
  
  'app/collections/medias',
  'app/collections/comments'
], function(Backbone, _, Chatanoo, 
  Medias, Comments) {
  
  var Item = Backbone.Model.extend(
  {
      // Default attributes for the Query item.
      defaults: function() {
        return {};
      },
  
      initialize: function() {
    
      },

    isOnError: false,
  
    loadItem: function() {
      this.isOnError = false;
      //this.comments.remove(this.comments.toArray());
      //this.medias.remove(this.medias.toArray());
        
      var mThis = this;
      var r = Chatanoo.items.getItemById( this.get("id") );
      Chatanoo.items.on( r.success, function(item) {
        this.set(item);        
        //this.loadUser();    
        //this.loadComments();
        //this.loadMedias();
        //mThis.trigger("change");
      }, mThis);
      Chatanoo.items.on( r.error, function() {
        this.isOnError = true;
        mThis.trigger("change");
      }, mThis);
    }, 

    user: null,
    loadUser: function() {        
      var mThis = this;
      var r = Chatanoo.users.getUserById( this.get("_user") );
      Chatanoo.users.on( r.success, function(user) {
        mThis.user = user;
        mThis.trigger("change change:user");
      }, mThis);
    },
    
    addVo: function(item) {
      item.__className = "Vo_Item";
      
      var r = Chatanoo.items.addItem( item );
      Chatanoo.items.on( r.success, function( itemId ) {
        this.set( 'id', itemId );
        this.set( item );
        this.trigger("added");
      }, this);
    },

    editVo: function(options) {
      var item = _.extend(this.toJSON(), options);
      delete item.query_id;
      
      var r = Chatanoo.items.setItem( item );
      Chatanoo.items.on( r.success, function( itemId ) {
        this.set(options);
        this.trigger("edited");
      }, this);
    },
    
    validateVo: function() {
      var r = Chatanoo.items.validateVo( this.get("id"), true, false );
      Chatanoo.items.on( r.success, function( itemId ) {
        this.trigger("change:validate");
        this.loadItem();
      }, this);
    },
    
    unvalidateVo: function() {
      var r = Chatanoo.items.validateVo( this.get("id"), false, false );
      Chatanoo.items.on( r.success, function( itemId ) {
        this.trigger("change:unvalidate");
        this.loadItem();
      }, this);
    },
    
    deleteVo: function() {
      var r = Chatanoo.search.getMetasByVo( this.get("id"), 'Item' )
      Chatanoo.search.on( r.success, function( metas ) {
        var lock = _( metas ).find( function(meta) { 
          return meta.name == "admin" && meta.content == "lock";
        } ) || false;
        if( lock ) {
          alert("Vous ne pouvez pas supprimer cette contribution car elle a été bloquée par un administrateur.")
        } else {
          var r = Chatanoo.items.deleteItem( this.get("id") );
          Chatanoo.items.on( r.success, function( bool ) {
            this.trigger("delete");
          }, this);
        }
      }, this);
    }

  });
  //_.extend(Item, Chatanoo.ValueObject.Item);
  
  return Item;
});