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
		}
	});

	return Medias
});