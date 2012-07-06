define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/abstract_row_view',
	
	'text!app/templates/data.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	Config,
	AbstractRowView,
	template,
	app_view) {
	
	var DataView = AbstractRowView.extend({	
		deleteMessage: "Voulez vous vraiment supprimer cette donnée ?",
    
		events: _.extend( {
			
		}, AbstractRowView.prototype.events ),
    
		initialize: function() {
			AbstractRowView.prototype.initialize.call(this);
	    },
    
		render: function() {
			this.$el.data('data-id', this.model.get('id'));
			this.$el.data('data-type', this.model.get('type'));
			
			this.$el.html(_.template( template, { 
				data: this.model, 
				editing: this.editing, 
				Config: Config,  
				structure: Config.chatanoo.datas[ this.model.get('type') ].structure
			} ));
    
			AbstractRowView.prototype.render.call(this);
			return this;
		},
		
		onSelectRow: function() {
			var dataId = $( event.currentTarget ).data('data-id');
			var dataType = $( event.currentTarget ).data('data-type');
		},
    
		getEditingValue: function() {
			var result = {};
			this.$el.find("input[name], textarea[name], select[name]").each( function(index, input) {
				result[ $(input).attr('name') ] = $(input).val();
			});
			
			return result;
		}
	});
	
	return DataView;
});