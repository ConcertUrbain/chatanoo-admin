define([
	'Backbone',
	'Underscore',
	'jQuery',
	
	'Config',
	
	'app/views/notif_view',
	
	'app/collections/notifications',
	
	'app/models/notif_model',
	
	'text!app/templates/notifications.tmpl.html'
], function(Backbone, _, $,
	Config,
	NotifView,
	Notifications,
	Notif,
	template) {
	
	var NotificationsView = Backbone.View.extend(
	{
		collections: new Notifications(),
		user: null,
		
		initialize: function() {
			var mThis = this;
			
			this.socket = io.connect( Config.notify.url );
			this.socket.on('connect', 	function(data) { mThis.connect(data); 	});
			this.socket.on('queries', 	function(data) { mThis.queries(data); 	});
			this.socket.on('search', 	function(data) { mThis.search(data); 	});
			this.socket.on('comments', 	function(data) { mThis.comments(data); 	});
			this.socket.on('medias', 	function(data) { mThis.medias(data); 	});
			this.socket.on('items', 	function(data) { mThis.items(data); 	});
			this.socket.on('datas', 	function(data) { mThis.datas(data); 	});
			this.socket.on('users', 	function(data) { mThis.users(data); 	});
	    },
	
		events: {
			
		},
		
		render: function() {
			var mThis = this;
			require(['app/views/app_view'], function(app_view) {
				mThis.user = app_view.user;
			});
			
			var collapse = this.$el.find('#notifications').hasClass('in');
			
			this.$el.addClass("well menu");
			this.$el.html( _.template( template, { nb: this.collections.length } ) );
			
			var center = this.$el.find('#notifications');
			if( collapse )
				center.addClass('in');
			
			this.collections.each( function( notif, index ) {
				var nv = new NotifView({ model: notif });
				nv.on('delete', function() {
					mThis.collections.remove( nv.model );
					mThis.render();
				});
				center.prepend(  nv.render().el );
			});
			
			return this;
		},
		
		addNotification: function( notif ) {
			this.collections.add( notif );
			while( this.collections.length > 10 )
				this.collections.shift();
		},
		
		highlight: function() {
			this.$el.css({
				backgroundColor: "#FFFFCC"
			});
			this.$el.animate({
				backgroundColor: "#F6F6F6"
			}, 2000);
		},
		
		connect: function(data) {
		 	console.log("Connected to Chatanoo Notify Server!");
		
			this.render();
		},
		
		queries: function(data) {
			console.log(data);
			
			if(data.byUser == this.user.id)
				return;
			
			var n = new Notif();
			n.set('title', 'Question');
			
			var user = data.byUser;
			if( (!_.isNull( user.firstName ) && !_.isUndefined( user.firstName ) &&  user.firstName != "")
				&& (!_.isNull( user.lastName ) && !_.isUndefined( user.lastName ) &&  user.lastName != "") ) 
			{
				n.set('user', user.lastName + " " + user.firstName );
			} else if( !_.isNull( user.pseudo ) && !_.isUndefined( user.pseudo ) &&  user.pseudo != "" ) {
				n.set('user', user.pseudo);
			} else {
				n.set('user', user);
			}
			
			var query = 0;
			switch( data.method ) {
				case "addQuery":
					query = data.result;
					n.set('description', 'La question ' + query + ' a été ajoutée.');
					n.set('type', 'warn');
					break;
				case "setQuery":
					query = data.params[0].id;
					n.set('description', 'La question ' + query + ' a été modifiée.');
					n.set('type', 'info');
					break;
				case "deleteQuery":
					query = data.params[0];
					n.set('description', 'La question ' + query + ' a été supprimée.');
					n.set('type', 'error');
					break;
				case "addItemIntoQuery":
					var item = data.params[0].id;
					query = data.params[1];
					n.set('description', 'L\'item ' + item + ' a été ajouté à la question ' + query + '.');
					n.set('type', 'info');
					break;
				case "removeItemFromQuery":
					var item = data.params[0];
					query = data.params[1];
					n.set('description', 'L\'item ' + item + ' a été retiré à la question ' + query + '.');
					n.set('type', 'info');
					break;
				case "addMediaIntoQuery":
					var media = data.params[0].id;
					query = data.params[1];
					n.set('description', 'Le média ' + media + ' a été ajouté à la question ' + query + '.');
					n.set('type', 'info');
					break;
				case "removeMediaFromQuery":
					var media = data.params[0];
					query = data.params[2];
					n.set('description', 'Le média ' + media + ' a été retiré à la question ' + query + '.');
					n.set('type', 'info');
					break;
				case "addMetaIntoVo":
					var meta = data.params[0].id;
					query = data.params[1];
					n.set('description', 'Le tag ' + meta + ' a été ajouté à la question ' + query + '.');
					n.set('type', 'info');
					break;
				case "removeMetaFromVo":
					var meta = data.params[0];
					query = data.params[1];
					n.set('description', 'Le tag ' + meta + ' a été retiré à la question ' + query + '.');
					n.set('type', 'info');
					break;
				case "setUserOfVo":
					query = data.params[1];
					n.set('description', 'L\'auteur de la question ' + query + ' a été changé.');
					n.set('type', 'info');
					break;
				case "validateVo":
					query = data.params[0];
					if ( data.params[1] ) {
						n.set('description', 'La question ' + query + ' a été validée.');
						n.set('type', 'success');
					} else {
						n.set('description', 'La question ' + query + ' a été invalidée.');
						n.set('type', 'error');
					}
					break;
				case "addDataIntoVo":
					var data = data.params[0].id;
					query = data.params[1];
					n.set('description', 'La donnée associée ' + data + ' a été ajouté à la question ' +  + '.');
					n.set('type', 'info');
					break;
				case "removeDataFromVo":
					var data = data.params[0];
					query = data.params[2];
					n.set('description', 'Le donnée associée ' + data + ' a été retiré à la question ' +  + '.');
					n.set('type', 'info');
					break;
			}
			
			this.addNotification( n );
			
			this.render(); 
			this.highlight(); 
		},
		
		search: function(data) {
			console.log(data);
			
			this.render(); 
			this.highlight();
		},
		
		comments: function(data) {
			console.log(data);
			
			this.render(); 
			this.highlight();
		},
		
		medias: function(data) {
			console.log(data);
			
			this.render(); 
			this.highlight();
		},
		
		items: function(data) {
			console.log(data);
			
			this.render(); 
			this.highlight();
		},
		
		datas: function(data) {
			console.log(data);
			
			this.render(); 
			this.highlight();
		},
		
		users: function(data) {
			console.log(data);
			
			this.render(); 
			this.highlight();
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
		}
	});
	
	return NotificationsView;
});