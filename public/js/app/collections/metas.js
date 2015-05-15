define([
	'Underscore',
	'Chatanoo',

	'app/collections/abstract',
	
	'app/models/meta_model'
], function( _, Chatanoo,
	AbstractCollection,
	Meta ) {
	
	var Metas = AbstractCollection.extend({
		model: Meta,
		isValidKey: null,
		
		voId: null,
		voType: null,
		isMedia: false,
		
		load: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r;
			if( _.isNull( this.voId ) )
				r = Chatanoo.search.getMetas();
			else
				r = Chatanoo.search.getMetasByVo( this.voId, this.isMedia ? "Media_" + this.voType : this.voType );
			Chatanoo.search.on( r.success, function(metas) {
				_(metas).each( function (meta) { mThis.push( meta ); } );
				mThis.trigger("load");
			}, this);
		}
	});
	
	return Metas;
});