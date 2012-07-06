define([
	'Backbone',
	'Underscore',
	'Chatanoo'
], function(Backbone, _, Chatanoo) {

	var Media = Backbone.Model.extend(
	{
	    // Default attributes for the Query item.
	    defaults: function() {
	      return {};
	    },
	
	    initialize: function() {
		
	    },

		validateVo: function() {
			var r = Chatanoo.medias.validateMedia( this.get("id"), this.get('type'), true );
			Chatanoo.medias.on( r.success, function( mediaId ) {
				this.trigger("change change:validate");
				this.set('_isValid', 1);
			}, this);
		},
        
		unvalidateVo: function() {
			var r = Chatanoo.medias.validateMedia( this.get("id"), this.get('type'), false );
			Chatanoo.medias.on( r.success, function( mediaId ) {
				this.trigger("change change:unvalidate");
				this.set('_isValid', 0);
			}, this);
		},
        
		deleteVo: function() {
			var r = Chatanoo.medias.deleteMedia( this.get("id"), this.get('type') );
			Chatanoo.medias.on( r.success, function( bool ) {
				this.trigger("delete");
			}, this);
		},
		
		addVo: function(media) {
			var r = Chatanoo.medias.addMedia( media );
			Chatanoo.medias.on( r.success, function( mediaId ) {
				this.set( 'id', mediaId );
				this.set( media );
				this.trigger("added");
			}, this);
		},
        
		editVo: function(options) {
			var media = _.extend(this.toJSON(), options);
			delete media.type;
			
			var r = Chatanoo.medias.setMedia( media );
			Chatanoo.medias.on( r.success, function( mediaId ) {
				this.set(options);
				this.trigger("edited");
			}, this);
		}
	});
	//_.extend(Media, Chatanoo.ValueObject.Media.Abstract); 
	
	return Media;
});