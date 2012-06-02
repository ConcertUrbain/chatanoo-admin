define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/media.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var MediaView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer ce média ?",
    
		events: _.extend( AbstractRowView.prototype.events, {
    
		}),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			var type = "";
			switch(  this.model.get('__className') ) {
				case "Vo_Media_Picture": type = 'Picture'; break;
				case "Vo_Media_Video": type = 'Video'; break;
				case "Vo_Media_Sound": type = 'Sound'; break;
				case "Vo_Media_Text": type = 'Text'; break;
			}
			this.$el.data('media-id', this.model.get('id'));
			this.$el.data('media-type', type);
			
			this.$el.html(_.template( template, { media: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
    
		getEditingValue: function() {
			return {
				content: this.$el.find('textarea[name=title]').val(), 
				description: this.$el.find('textarea[name=description]').val()
			};
		}
	});
	
	return MediaView;
});