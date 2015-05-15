define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/data_model',
	'app/collections/datas'
], function( Backbone, _, Chatanoo,
	Data, Datas ) {
	
	var DatasSet = function() {
		
	};
	
	_.extend( DatasSet.prototype, Backbone.Events, {
		voId: null,
		voType: null,
		
		collections: {},
		
		load: function( callback ) {
			_( this.collections ).each( function( collection ) {
				collection.remove( collection.toArray() );
			});
			
			var mThis = this;
			var method, isMedia = false;
			switch( this.voType ) {
				case "Item": method = Chatanoo.datas.getDatasByItemId; break;
				case "Comment": method = Chatanoo.datas.getDatasByCommentId; break;
				case "User": method = Chatanoo.datas.getDatasByUserId; break;
				case "Query": method = Chatanoo.datas.getDatasByQueryId; break;
				
				case "Picture":
				case "Video":
				case "Sound":
				case "Text": 
					method = Chatanoo.datas.getDatasByMediaId; isMedia = true; break;
			}
			
			var r;
			if( isMedia ) {
				r = method.apply( Chatanoo.datas, [ this.voId, this.voType ] );
			} else {
				r = method.apply( Chatanoo.datas, [ this.voId ] );
			}
			Chatanoo.datas.on( r.success, function(types) {
				_( types ).each( function( datas, type ) {
					mThis.collections[type] = new Datas();
					mThis.collections[type].datasSet = mThis;
					_( datas ).each( function (data) { data['type'] = type; mThis.collections[type].push( data ); } );
				});
				mThis.trigger("load");
				
				if( _(callback).isUsable() && _.isFunction(callback))
					callback();
			}, this);
		},
		
		getVoById: function(id, type) {
			if( !_.isUsable( this.collections[type] ) )
				return null;
			
			var objects = this.collections[type].toArray();
			var len = objects.length;
			for(var i = 0; i < len; i++) {
				var vo = objects[i];
				if( vo.get('id') == id )
					return vo;
			}
		}
	});
	
	return DatasSet;
});