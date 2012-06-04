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
			"click .stats": "showStats"
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
		
		getEditingValue: function() {
			return {
				content: this.$el.find('textarea[name=content]').val(), 
				description: this.$el.find('textarea[name=description]').val()
			};
		},
		
		showDatas: function( event ) {
			event.preventDefault();
			this.createPopin( DatasPopinView, { model: null, voType: "query", voId: this.model.get('id') } );
		},
		
		showMetas: function( event ) {
			event.preventDefault();
			this.createPopin( MetasPopinView, { model: null, voType: "query", voId: this.model.get('id') } );
		},
		
		showLinks: function( event ) {
			event.preventDefault();
			this.createPopin( LinksPopinView, { model: null, voType: "query", voId: this.model.get('id') } );
		},
		
		showStats: function( event ) {
			event.preventDefault();
			this.createPopin( StatsPopinView, { model: null, voType: "query", voId: this.model.get('id') } );
		}
	});
	
	return QueryView;
});