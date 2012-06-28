define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/media.tmpl.html',
	
	'app/views/datas_popin_view',
	'app/views/metas_popin_view',
	'app/views/links_popin_view',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	Config,
	AbstractRowView,
	template,
	DatasPopinView, MetasPopinView, LinksPopinView,
	app_view) {
	
	var MediaView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer ce média ?",
    
		events: _.extend( {
    		"click .datas": "showDatas",
			"click .tags": "showMetas",
			"click .link": "showLinks"
		}, AbstractRowView.prototype.events ),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
	
		getMediaType: function() {
			var type = "";
			switch(  this.model.get('__className') ) {
				case "Vo_Media_Picture": type = 'Picture'; break;
				case "Vo_Media_Video": type = 'Video'; break;
				case "Vo_Media_Sound": type = 'Sound'; break;
				case "Vo_Media_Text": type = 'Text'; break;
			}
			return type;
		},
    
		render: function() {
			var type = this.getMediaType();
			
			this.$el.data('media-id', this.model.get('id'));
			this.$el.data('media-type', type);
			
			this.$el.html(_.template( template, { media: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		onSelectRow: function() {
			var mediaId = this.$el.data('media-id');
			var mediaType = this.$el.data('media-type');
			//app_view.chatanoo.loadUrl('/queries/' + queryId);
			
			// Timeout for dblclick
			setTimeout( function() {
				var r = Chatanoo.items.getItemsByMediaId( mediaId, mediaType );
				Chatanoo.items.on( r.success, function(items) {
					var itemId = items[0].id;
					
					var r = Chatanoo.queries.getQueriesByItemId( itemId );
					Chatanoo.queries.on( r.success, function(queries) {
						app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
					}, this);
				}, this);
			}, 500);
		},
    
		getEditingValue: function() {
			return {
				content: this.$el.find('textarea[name=title]').val(), 
				description: this.$el.find('textarea[name=description]').val()
			};
		},
		
		showDatas: function( event ) {
			event.preventDefault();
			this.createPopin( DatasPopinView, { voType: this.getMediaType(), voId: this.model.get('id') } );
		},
		
		showMetas: function( event ) {
			event.preventDefault();
			this.createPopin( MetasPopinView, { voType: this.getMediaType(), voId: this.model.get('id') } );
		},
		
		showLinks: function( event ) {
			event.preventDefault();
			this.createPopin( LinksPopinView, { voType: this.getMediaType(), voId: this.model.get('id') } );
		}
	});
	
	return MediaView;
});