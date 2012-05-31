define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/query_model'
], function(Backbone, _, Chatanoo,
	Query) {
	
	var Queries = Backbone.Collection.extend({
    	model: Query,

		filters: [],

		loadQueries: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.queries.getQueries( {} );
			Chatanoo.queries.on( r.success, function(queries) {
				_(queries).each( function (query) { mThis.push( query ); } );
				mThis._calculate();
				mThis.trigger("change");
			}, this);
		},
		
		_filters: function(items) {
			var mThis = this;
			var result = items;
			_(this.filters).each( function(facet) {
				var prop = mThis._facetToArray( facet );
				result = _(result).filter( function(item) {
					return item.get(prop[1]).indexOf(facet[prop[0]]) != -1;
				});
			});
			return result;
		},
		
		_facetToArray: function( facet ) {
			for( var key in facet ) {
				switch(key) {
					case 'id': 				return [key,'id'];
					case 'Contenu': 		return [key,'content'];
					case 'Description': 	return [key,'description'];
					case 'Date d\'ajout': 	return [key,'addDate']
					case 'Date de modif': 	return [key,'setDate'];
				}
			};
			return null;
		},
		
		_calculate: function() {
			this._valid = _(this.toArray()).filter( function(query) {
				return parseInt( query.get('_isValid') );
			});
			this._unvalid = _(this.toArray()).filter( function(query) {
				return !parseInt( query.get('_isValid') );
			});
		},
		
		all: function() {
			return this._filters( this.toArray() );
		},
		
		_valid: [],
		valid: function() {
			return this._filters( this._valid );
		},
		
		_unvalid: [],
		unvalid: function() {
			return this._filters( this._unvalid );
		}
	});
	
	return Queries;	
});