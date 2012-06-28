define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/meta.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var MetaView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer ce tag ?",
    
		events: _.extend( {
			
		}, AbstractRowView.prototype.events ),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('meta-id', this.model.get('id'));
			this.$el.html(_.template( template, { meta: this.model, editing: this.editing, Config: Config } ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		onSelectRow: function() {
			var metaId = $( event.currentTarget ).data('meta-id');
		},
    
		getEditingValue: function() {
			return {
				name: this.$el.find('input[name=name]').val(),
				content: this.$el.find('input[name=content]').val()
			};
		}
	});
	
	return MetaView;
});