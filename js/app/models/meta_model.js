define([
	'Backbone',
	'Underscore',
	'Chatanoo'
], function(Backbone, _, Chatanoo) {
	
	var Meta = Backbone.Model.extend(
	{
	    // Default attributes for the Query item.
	    defaults: function() {
	      return {};
	    },
	
	    initialize: function() {
		
	    },
		
		deleteVo: function() {
			var r = Chatanoo.search.deleteMeta( this.get("id") );
			Chatanoo.search.on( r.success, function( bool ) {
				this.trigger("delete");
			}, this);
		},
		
		editVo: function(options) {
			var meta = _.extend(this.toJSON(), options);
			var r = Chatanoo.search.setMeta( meta );
			Chatanoo.search.on( r.success, function( metaId ) {
				this.set(options);
				this.trigger("edited");
			}, this);
		},
		
		addVo: function( options ) {
			var service, method, isMedia = false, r;
			switch( this.get( 'voType' ) ) {
				case 'Query': service = Chatanoo.queries; method = service.addMetaIntoVo; break;
				case 'Item': service = Chatanoo.items; method = service.addMetaIntoVo; break;
				case 'Comment': service = Chatanoo.comments; method = service.addMetaIntoVo; break;
				
				case 'Sound':
				case 'Video':
				case 'Picture':
				case 'Text': isMedia = true; service = Chatanoo.medias; method = service.addMetaIntoMedia; break;
			}
			
			var meta = _.extend(this.toJSON(), options);
			delete meta.voId;
			delete meta.voType;
			
			if( isMedia )
				r = method( service, [ meta, this.get( 'voId' ), this.get( 'voType' ) ] );
			else
				r = method.apply( service, [ meta, this.get( 'voId' ) ] );
			service.on( r.success, function( metaId ) {
				this.set(options);
				this.set("id", metaId);
				this.trigger("added");
			}, this);
		}
	});
	//_.extend(Comment, Chatanoo.ValueObject.Comment);
	
	return Meta;
});