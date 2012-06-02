define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/item.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var ItemView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer cette contribution ?",
    
		events: _.extend( AbstractRowView.prototype.events, {
    
		}),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('item-id', this.model.get('id'));
			this.$el.html(_.template( template, { item: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
    
		getEditingValue: function() {
			return {
				title: this.$el.find('textarea[name=title]').val(), 
				description: this.$el.find('textarea[name=description]').val(),
				url: this.$el.find('textarea[name=url]').val()
			};
		}
	});
	
	return ItemView;
});