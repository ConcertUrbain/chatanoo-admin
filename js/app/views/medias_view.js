define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'app/views/abstract_table_view',
	
	'Config',
	
	'app/collections/medias',
	
	'text!app/templates/medias.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	AbstractTableView,
	Config,
	Medias,
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
			
			AbstractTableView.prototype.render.call(this);
			return this;
		},
		
		refresh: function( event ) {
			this.medias.loadMedias();
			return false;
		},
		
		selectRow: function( event ) {
			var mediaId = $( event.currentTarget ).data('media-id');
			//app_view.chatanoo.loadUrl('/queries/' + queryId);
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return MediasView;
});