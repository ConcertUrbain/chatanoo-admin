define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/media_model'
], function(Backbone, _, Chatanoo,
	Media) {
	
	var Medias = Backbone.Collection.extend({
	    model: Media,

		filters: [],

		loadMedias: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.medias.getMedias( {} );
			Chatanoo.medias.on( r.success, function(medias) {
				_(medias).each( function(type, label) { 
					_(type).each( function(media) { media.type = label; mThis.push(media); } ); 
				}, this );
				mThis.trigger("change");
			}, this);
		},
		
		all: function() {
			return this.toArray();
		},
		
		valid: function() {
			return _(this.toArray()).filter( function(media) {
				return parseInt( media.get('_isValid') );
			});
		},
		
		unvalid: function() {
			return _(this.toArray()).filter( function(media) {
				return !parseInt( media.get('_isValid') );
			});
		}
	});

	return Medias
});