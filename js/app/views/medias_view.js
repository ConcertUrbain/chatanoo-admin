define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/medias',
	'app/views/media_view',
	
	'text!app/templates/medias.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Medias, MediaView,
	template,
	app_view) {
	
	var MediasView = AbstractTableView.extend(
	{
		el: $("#content"),
		
		medias: new Medias(),
		
		initialize: function() {
			//app_view.chatanoo.loadUrl('/queries/20');
			
			this.medias.loadMedias();
			this.medias.on('change', function() { this.render(); }, this);
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			'click .refresh': 'refresh',
			'click tbody tr': 'selectRow'
		}),
		
		render: function() {
			this.$el.removeClass().addClass('comments');
			
			var medias;
			switch(this.mode) {
				case "all": medias = this.medias.all(); break;
				case "valid": medias = this.medias.valid(); break;
				case "unvalid": medias = this.medias.unvalid(); break;
			}
			this.$el.html( _.template( template, { medias: medias, mode: this.mode } ) );
			
			var els = [];
			_(medias).each( function (medias) {
				var mv = new MediaView( { model: medias } );
				els.push( mv.render().el );
			});
			this.$el.find("table tbody").append( els );
			
			this.search();
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		search: function() {
			var mThis = this;
			var visualSearch = VS.init({
	          container  : $('#searchbox'),
	          query      : '',
	          callbacks  : {
				search       : function(query, searchCollection) {
					mThis.medias.filters = searchCollection.facets();
					mThis.render();
				},
	            facetMatches : function(callback) {
	              callback([
	                'id', 'Type', 'Contenu', 'Description', 'Url', 'Date d\'ajout', 'Date de modif'
	              ]);
	            },
	            valueMatches : function(facet, searchTerm, callback) {
	              switch (facet) {
	              	case 'Type':
	                  callback(['image', 'viédo', 'audio', 'text']);
	                  break;
	              }
	            }
	          }
	        });
		},
		
		refresh: function( event ) {
			this.medias.loadMedias();
			return false;
		},
		
		selectRow: function( event ) {
			var mediaId = $( event.currentTarget ).data('media-id');
			var mediaType = $( event.currentTarget ).data('media-type');
			//app_view.chatanoo.loadUrl('/queries/' + queryId);
			
			var r = Chatanoo.items.getItemsByMediaId( mediaId, mediaType );
			Chatanoo.items.on( r.success, function(items) {
				var itemId = items[0].id;
				
				var r = Chatanoo.queries.getQueriesByItemId( itemId );
				Chatanoo.queries.on( r.success, function(queries) {
					app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
				}, this);
			}, this);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MediasView;
});