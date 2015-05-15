define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/helpers/metas_typeahead'
], function(Backbone, _, Chatanoo,
	typeahead) {
	
	var Meta = Backbone.Model.extend(
	{
	    // Default attributes for the Query item.
	    defaults: function() {
	      return {};
	    },
	
	    initialize: function() {
		
	    },

		validateVo: function() {},
		unvalidateVo: function() {},

		loadDetails: function(callback) {
			var mThis = this;
			var r = Chatanoo.plugins["call"]( "GetItemsWithDetailsByTag", [this.get("id")] );
			Chatanoo.plugins.on( r.success, function(items) {
				callback(items);
			}, mThis);
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
			if( this.get( 'voType' ) ) {
				var service, method, isMedia = false, r;
				switch( this.get( 'voType' ) ) {
					case 'Query': service = Chatanoo.queries; method = service.addMetaIntoVo; break;
					case 'Item': service = Chatanoo.items; method = service.addMetaIntoVo; break;
					case 'Comment': service = Chatanoo.comments; method = service.addMetaIntoVo; break;
					case 'User': service = Chatanoo.users; method = service.addMetaIntoVo; break;
					
					case 'Sound':
					case 'Video':
					case 'Picture':
					case 'Text': isMedia = true; service = Chatanoo.medias; method = service.addMetaIntoMedia; break;
				}
				
				var meta = _.extend(this.toJSON(), options);
				delete meta.voId;
				delete meta.voType;
				delete meta.isMedia;
				
				if( isMedia )
					r = method.apply( service, [ meta, this.get( 'voId' ), this.get( 'voType' ) ] );
				else
					r = method.apply( service, [ meta, this.get( 'voId' ) ] );
				service.on( r.success, function( metaId ) {
					this.set(options);
					this.set("id", metaId);
					this.trigger("added");
					
					if( _( typeahead.name ).contains( meta.name ) ) typeahead.name.push(meta.name);
					if( _( typeahead.content ).contains( meta.content ) ) typeahead.content.push(meta.content);
				}, this);
			} else {
				var meta = options;
				meta.__className = "Vo_Meta";
				
				var r = Chatanoo.search.addMeta( meta );
				Chatanoo.search.on( r.success, function( metaId ) {
					this.set( 'id', metaId );
					this.set( meta );
					this.trigger("added");
				}, this);
			}
		}
	});
	//_.extend(Comment, Chatanoo.ValueObject.Comment);
	
	return Meta;
});