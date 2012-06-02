define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/user.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var UserView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer cet utilisateur ?",
    
		events: _.extend( AbstractRowView.prototype.events, {
    
		}),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('user-id', this.model.get('id'));
			this.$el.html(_.template( template, { user: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		getEditingValue: function() {
			return {
				firstName: this.$el.find('textarea[name=firstName]').val(), 
				lastName: this.$el.find('textarea[name=lastName]').val(), 
				pseudo: this.$el.find('textarea[name=pseudo]').val(), 
				email: this.$el.find('textarea[name=email]').val(), 
				role: this.$el.find('select[name=role]').val()
			};
		}
	});
	
	return UserView;
});