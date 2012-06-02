define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/query.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var QueryView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer cette question ?",
		
		events: _.extend( AbstractRowView.prototype.events, {
			
		}),
		
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
		}
	});
	
	return QueryView;
});