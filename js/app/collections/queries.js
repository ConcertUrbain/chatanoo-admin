define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	
	'app/models/query_model'
], function(Backbone, _, Chatanoo,
	Query) {
	
	var Queries = Backbone.Collection.extend({
    	model: Query,

		loadQueries: function() {
			this.remove(this.toArray());
			
			var mThis = this;
			var r = Chatanoo.queries.getQueries( {} );
			Chatanoo.queries.on( r.success, function(queries) {
				_(queries).each( function (query) { mThis.push( query ); } );
				mThis.trigger("change");
			}, this);
		},
		
		all: function() {
			return this.toArray();
		},
		
		valid: function() {
			return _(this.toArray()).filter( function(query) {
				return parseInt( query.get('_isValid') );
			});
		},
		
		unvalid: function() {
			return _(this.toArray()).filter( function(query) {
				return !parseInt( query.get('_isValid') );
			});
		}
	});
	
	return Queries;	
});