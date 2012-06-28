define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/metas',
	'app/views/meta_view',
	
	'text!app/templates/metas_popin.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
	AbstractTableView,
	Config,
	Metas, MetaView,
	template,
	app_view) {
	
	var MetasPopinView = AbstractTableView.extend(
	{	
		collection: new Metas(),
		voClass: MetaView,
		
		facets: ['id', 'Name', 'Contenu'],
		
		tableHeight: 365,
		
		initialize: function( options ) {
			this.addOptions = options;
			this.addOptions.__className = "Vo_Meta";
			
			this.collection.voId = options.voId;
			this.collection.voType = options.voType;
			
			AbstractTableView.prototype.initialize.call(this);
	    },
	
		events: _.extend( AbstractTableView.prototype.events, {
			
		}),
		
		render: function() {
			this.$el.addClass("metas modal hide fade");
			
			this.$el.html( _.template( template, { mode: this.mode } ) );
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MetasPopinView;
});