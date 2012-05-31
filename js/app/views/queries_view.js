define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/queries',
	'app/views/query_view',
	
	'text!app/templates/queries.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	AbstractTableView,
	Config,
	Queries, QueryView,
	template,
	app_view) {
	
	var QueriesView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		queries: new Queries(),
		
		initialize: function() {
			app_view.chatanoo.loadUrl('/session');
			
			this.queries.loadQueries();
			this.queries.on('change', function() { this.render(); }, this);
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			'click .refresh': 'refresh',
			'click tbody tr': 'selectRow'
		}),
		
		render: function() {
			this.$el.removeClass().addClass('queries');
			
			var queries;
			switch(this.mode) {
				case "all": queries = this.queries.all(); break;
				case "valid": queries = this.queries.valid(); break;
				case "unvalid": queries = this.queries.unvalid(); break;
			}
			this.$el.html( _.template( template, { queries: queries, mode: this.mode } ) );
			
			var els = [];
			_(queries).each( function (query) {
				var qv = new QueryView( { model: query } );
				els.push( qv.render().el );
			});
			this.$el.find("table tbody").append( els );
			
			this.search();
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		_request: "",
		search: function() {
			var mThis = this;
			var visualSearch = VS.init({
	          container  : $('#searchbox'),
	          query      : mThis._request,
	          callbacks  : {
				search       : function(query, searchCollection) {
					mThis.queries.filters = searchCollection.facets();
					mThis._request = query;
					mThis.render();
				},
	            facetMatches : function(callback) {
	              callback([
	                'id', 'Contenu', 'Description', 'Date d\'ajout', 'Date de modif'
	              ]);
	            },
	            valueMatches : function(facet, searchTerm, callback) {
	              switch (facet) {
	              	/*case 'account':
	                  callback([]);
	                  break;*/
	              }
	            }
	          }
	        });
		},
		
		refresh: function( event ) {
			this.queries.loadQueries();
			return false;
		},
		
		selectRow: function( event ) {
			var queryId = $( event.currentTarget ).data('query-id');
			app_view.chatanoo.loadUrl('/queries/' + queryId);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return QueriesView;
});