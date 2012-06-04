define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'text!app/templates/query.tmpl.html',
	
	'app/views/app_view'
], function(Backbone, _, $,
	template,
	app_view) {
	
	var RowView = Backbone.View.extend(
	{
		tagName: "tr",
		
		model: null,
		editing: false,
		
		deleteMessage: "",
		
		events: {
			"click .validate": "validateVo",
			"click .unvalidate": "unvalidateVo",
			"dblclick td": "editVo",
			"click .edit": "editVo",
			"click .validate-edit": "validateEditing",
			"keydown td": "validateEditing",
			"click .cancel-edit": "cancelEditing",
			"click .delete": "deleteVo"
		},
		
		initialize: function() {
			this.model.on("change", this.render, this);
	    },
		
		render: function() {
			if( this.editing )
				this.$el.addClass('editing');
			else
				this.$el.removeClass('editing');
			
			this.$el.find('textarea').elastic();
			
			return this;
		},
		
		validateVo: function() {
			this.model.validateVo();
		},
        
		unvalidateVo: function() {
			this.model.unvalidateVo();
		},
        
		editVo: function( event ) {
			var mThis = this;
			
			event.preventDefault();
			this.editing = true;
			this.render();
			
			this.trigger('change');
		},
        
		deleteVo: function( event ) {
			event.preventDefault();
			var r = confirm( this.deleteMessage );
			if( r ) {
				this.model.deleteVo();
			}
		},
		
		//edit
		validateEditing: function( event ) {
			if( _.isUndefined( event.keyCode ) || event.keyCode == 13 ) {
				this.editing = false;
				if( this.$el.hasClass('new') )
					this.model.addVo( this.getEditingValue() );
				else		
					this.model.editVo( this.getEditingValue() );
			}
		},
		
		getEditingValue: function() {
			return {};
		},
		
		cancelEditing: function( event ) {
			event.preventDefault();
			this.editing = false;
			this.render();
			
			this.trigger('change');
		},
		
		createPopin: function( Klass, options ) {
			var popin = new Klass( options );
			popin.$el.on('hidden', function () {
				popin.kill();
				popin.remove();
			});
			$('body').append( popin.render().$el );
			popin.$el.modal({});
			popin.$el.modal('show');
		},
		
		kill: function() {
			this.$el.unbind()
			this.model.off();
		}
	});
	
	return RowView;
});