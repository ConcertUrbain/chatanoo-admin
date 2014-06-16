define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/query.tmpl.html',
	
	'app/views/datas_popin_view',
	'app/views/metas_popin_view',
	'app/views/links_popin_view',
	'app/views/stats_popin_view',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	DatasPopinView, MetasPopinView, LinksPopinView, StatsPopinView,
	app_view) {
	
	var QueryView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer cette question ?",
		
		events: _.extend( {
			"click .datas": "showDatas",
			"click .tags": "showMetas",
			"click .link": "showLinks",
			"click .stats": "showStats",
			"click .export": "export"
		}, AbstractRowView.prototype.events),
		
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
		
		render: function() {
			this.$el.data('query-id', this.model.get('id'));
			this.$el.html(_.template( template, { query: this.model, editing: this.editing, Config: Config } ));
			
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		onSelectRow: function() {
			var queryId = this.$el.data('query-id');
			app_view.chatanoo.loadUrl('/queries/' + queryId);
		},
		
		getEditingValue: function() {
			return {
				content: this.$el.find('textarea[name=content]').val(), 
				description: this.$el.find('textarea[name=description]').val()
			};
		},
		
		showDatas: function( event ) {
			event.preventDefault();
			this.createPopin( DatasPopinView, { voType: "Query", voId: this.model.get('id') } );
		},                                      
		                                        
		showMetas: function( event ) {          
			event.preventDefault();             
			this.createPopin( MetasPopinView, { voType: "Query", voId: this.model.get('id') } );
		},                                      
		                                        
		showLinks: function( event ) {          
			event.preventDefault();             
			this.createPopin( LinksPopinView, { voType: "Query", voId: this.model.get('id'), vo: this.model } );
		},                                      
		                                        
		showStats: function( event ) {          
			event.preventDefault();             
			this.createPopin( StatsPopinView, { voType: "Query", voId: this.model.get('id') } );
		},

		export: function( event ) {          
			event.preventDefault();  
			var mThis = this;
			this.model.loadDetails( function(items) {
				var data = [];
				// header
				data.push(['id', 'Titre', 'Description', 'Date d\'ajout', 'Date de modif', 'Vote', 'Tags', 'Commentaires', 'Medias']);

				_(items).each( function(entry) {
					var d = [];
					d.push( entry['VO'].id );
					d.push( '"""' + entry['VO'].title + '"""' );
					d.push( '"""' + entry['VO'].description + '"""' );
					d.push( entry['VO'].addDate ? entry['VO'].addDate.format() : null );
					d.push( entry['VO'].endDate ? entry['VO'].endDate.format() : null );
					d.push( entry['VO'].rate );

					d.push( '"""' + _(entry.metas).map( function(meta) {
						return meta.name + ":" + meta.content;
					}).join(' | ') + '"""' );

					d.push( '"""' + _(entry.comments).map( function(comment) {
						return comment.content;
					}).join(' | ') + '"""' );

					d.push( '"""' + _.flatten( _(entry.medias).map( function(medias) {
						return _(medias).map( function(media) {
							return media.url;
						});
					}) ).join(' | ') + '"""' );

					data.push(d);
				});
				
				var link = mThis.createCSVLink(data)
				link.click();
			} );
		},

		createCSVLink: function(data) {
			console.log(data);
			var csvContent = "data:text/csv;charset=utf-8,";
			_(data).each(function(infoArray, index){
			   dataString = infoArray.join(";");
			   csvContent += dataString + ";\n";
			}); 
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "my_data.csv");
			return link;
		}
	});
	
	return QueryView;
});