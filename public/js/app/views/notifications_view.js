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
				
			if(window.io) {
				this.socket = io.connect( Config.notify.url );
				this.socket.on('connect', 	function(data) { mThis.connect(data); 	});
				this.socket.on('queries', 	function(data) { mThis.queries(data); 	});
				this.socket.on('search', 	function(data) { mThis.search(data); 	});
				this.socket.on('comments', 	function(data) { mThis.comments(data); 	});
				this.socket.on('medias', 	function(data) { mThis.medias(data); 	});
				this.socket.on('items', 	function(data) { mThis.items(data); 	});
				this.socket.on('datas', 	function(data) { mThis.datas(data); 	});
				this.socket.on('users', 	function(data) { mThis.users(data); 	});
			}
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
		
		createNotif: function(data, title) {
			var n = new Notif();
			n.set('title', title);
			
			return n;
		},
		
		setUser: function(data, notif) {
			/*if(data.byUser == this.user.id)
				return false;*/
				
			var user = data.byUser;
			if( _( user.firstName ).isUsable() && _( user.lastName ).isUsable() ) {
				notif.set('user', user.lastName + " " + user.firstName );
			} else if( _( user.pseudo ).isUsable() ) {
				notif.set('user', user.pseudo);
			} else {
				notif.set('user', user);
			}
			
			return true;
		},
		
		queries: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Question' );
			if( !this.setUser( data, n ) ) return;
			
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
					var item = data.result;
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
					var media = data.result;
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
					var meta = data.result;
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
					var d = data.result;
					query = data.params[1];
					n.set('description', 'La donnée associée ' + d + ' a été ajouté à la question ' +  + '.');
					n.set('type', 'info');
					break;
				case "removeDataFromVo":
					var d = data.params[0];
					query = data.params[2];
					n.set('description', 'Le donnée associée ' + d + ' a été retiré à la question ' +  + '.');
					n.set('type', 'info');
					break;
			}
			
			this.addNotification( n );
			
			this.render(); 
			this.highlight(); 
		},
		
		search: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Tag' );
			if( !this.setUser( data, n ) ) return;
			
			var meta = 0;
			switch( data.method ) {
				case "addMeta":
					meta = data.result;
					n.set('description', 'Le tag ' + meta + ' a été ajouté.');
					n.set('type', 'success');
					break;
				case "setMeta":
					meta = data.params[0].id;
					n.set('description', 'Le tag ' + meta + ' a été modifié.');
					n.set('type', 'info');
					break;
				case "deleteMeta":
					meta = data.params[0];
					n.set('description', 'Le tag ' + meta + ' a été supprimé.');
					n.set('type', 'error');
					break;
			}

			this.addNotification( n );
			
			this.render(); 
			this.highlight();
		},
		
		comments: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Commentaire' );
			if( !this.setUser( data, n ) ) return;
			
			var comment = 0;
			switch( data.method ) {
				case "addComment":
					comment = data.result;
					n.set('description', 'Le commentaire ' + comment + ' a été ajouté.');
					n.set('type', 'warn');
					break;
				case "setComment":
					comment = data.params[0].id;
					n.set('description', 'Le commentaire ' + comment + ' a été modifié.');
					n.set('type', 'info');
					break;
				case "setItemOfComment":
					comment = data.params[0].id;
					item = data.params[1];
					n.set('description', 'Le commentaire ' + comment + ' a été ajouté à  l\'item ' + item + '.');
					n.set('type', 'success');
					break;
				case "deleteComment":
					comment = data.params[0];
					n.set('description', 'Le commentaire ' + comment + ' a été supprimer.');
					n.set('type', 'error');
					break;
				case "setUserOfVo":
					var user = data.params[0];
					comment = data.params[1];
					n.set('description', 'L\'auteur du commentaire ' + comment + ' a été changé.');
					n.set('type', 'info');
					break;
				case "validateVo":
					comment = data.params[0];
					if ( data.params[1] ) {
						n.set('description', 'Le commentaire ' + comment + ' a été validé.');
						n.set('type', 'success');
					} else {
						n.set('description', 'Le commentaire ' + comment + ' a été invalidé.');
						n.set('type', 'error');
					}
					break;
				case "addDataIntoVo":
					var d = data.result;
					comment = data.params[1];
					n.set('description', 'La donnée associée ' + d + ' a été ajoutée au commentaire ' + comment + '.');
					n.set('type', 'success');
					break;
				/*case "addVoteIntoItemPatch":
					comment = data.result;
					n.set('description', 'Le commentaire ' + comment + ' a été ajouté.');
					n.set('type', 'success');
					break;*/
				case "removeDataFromVo":
					var d = data.params[0];
					var dataType = data.params[1];
					comment = data.params[2];
					n.set('description', 'La donnée associée ' + d + ' a été supprimée du commentaire ' + comment + '.');
					n.set('type', 'error');
					break;
			}

			this.addNotification( n );
			
			this.render(); 
			this.highlight();
		},
		
		medias: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Médias' );
			if( !this.setUser( data, n ) ) return;
			
			var media = 0;
			switch( data.method ) {
				case "addMedia":
					media = data.result;
					n.set('description', 'Le média ' + media + ' a été ajouté.');
					n.set('type', 'warn');
					break;
				case "setMedia":
					media = data.params[0].id;
					var mediaType = data.params[1];
					n.set('description', 'Le média ' + media + ' a été modifié.');
					n.set('type', 'info');
					break;
				case "deleteMedia":
					media = data.params[0];
					var mediaType = data.params[1];
					n.set('description', 'Le média ' + media + ' a été suprimmé.');
					n.set('type', 'error');
					break;
				case "setUserOfMedia":
					var user = data.params[0];
					media = data.params[1];
					var mediaType = data.params[2];
					n.set('description', 'L\'auteur du média ' + media + ' a été changé.');
					n.set('type', 'info');
					break;
				case "addMetaIntoMedia":
					var meta = data.result;
					media = data.params[1];
					var mediaType = data.params[2];
					n.set('description', 'Le tag ' + meta + ' a été ajouté au média ' + media + '.');
					n.set('type', 'success');
					break;
				case "removeMetaFromMedia":
					var meta = data.params[0];
					media = data.params[1];
					var mediaType = data.params[2];
					n.set('description', 'Le tag ' + meta + ' a été supprimé du média ' + media + '.');
					n.set('type', 'error');
					break;
				case "validateMedia":
					media = data.params[0];
					var mediaType = data.params[1];
					if ( data.params[2] ) {
						n.set('description', 'Le média ' + media + ' a été validé.');
						n.set('type', 'success');
					} else {
						n.set('description', 'Le média ' + media + ' a été invalidé.');
						n.set('type', 'error');
					}
					break;
				case "addDataIntoMedia":
					media = data.result;
					var mediaType = data.params[2];
					var d = data.result;
					n.set('description', 'La donnée associée ' + d + ' a été ajoutée au média ' + media + '.');
					n.set('type', 'success');
					break;
				case "removeDataFromMedia":
					media = data.params[2];
					var mediaType = data.params[3];
					var d = data.params[0];
					var dataType = data.params[1];
					n.set('description', 'La donnée associée ' + d + ' a été supprimé du média ' + media + '.');
					n.set('type', 'error');
					break;
			}
			
			this.addNotification( n );
			
			this.render(); 
			this.highlight();
		},
		
		items: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Item' );
			if( !this.setUser( data, n ) ) return;
			
			var item = 0;
			switch( data.method ) {
				case "addItem":
					item = data.result;
					n.set('description', 'L\'item ' + item + ' a été ajouté.');
					n.set('type', 'warn');
					break;
				case "setItem":
					item = data.params[0].id;
					n.set('description', 'L\'item ' + item + ' a été modifié.');
					n.set('type', 'info');
					break;
				case "deleteItem":
					item = data.params[0];
					n.set('description', 'L\'item ' + item + ' a été supprimé.');
					n.set('type', 'error');
					break;
				case "addCommentIntoItem":
					var comment = data.result;
					item = data.params[1];
					n.set('description', 'Le commentaire ' + comment + ' a été ajouté à l\'item ' + item + '.');
					n.set('type', 'success');
					break;
				/*case "addCommentIntoItemPatch":
					item = data.result;
					n.set('description', 'L\'item ' + item + ' a été ajouté.');
					n.set('type', 'warn');
					break;*/
				case "removeCommentFromItem":
					var comment = data.params[0];
					item = data.params[1];
					n.set('description', 'Le commentaire ' + comment + ' a été supprimé à l\'item ' + item + '.');
					n.set('type', 'error');
					break;
				case "addMediaIntoItem":
					var media = data.result;
					item = data.params[1];
					n.set('description', 'Le média ' + media + ' a été ajouté à l\'item ' + item + '.');
					n.set('type', 'success');
					break;
				case "removeMediaFromItem":
					var media = data.params[0];
					var mediaType = data.params[1];
					item = data.params[2];
					n.set('description', 'Le média ' + media + ' a été supprimé à l\'item ' + item + '.');
					n.set('type', 'error');
					break;
				case "validateVo":
					item = data.params[0];
					if ( data.params[1] ) {
						n.set('description', 'L\'item ' + item + ' a été validé.');
						n.set('type', 'success');
					} else {
						n.set('description', 'L\'item ' + item + ' a été invalidé.');
						n.set('type', 'error');
					}
					break;
				case "addMetaIntoVo":
					var meta = data.result;
					item = data.params[1];
					n.set('description', 'Le tag ' + meta + ' a été ajouté à l\'item ' + item + '.');
					n.set('type', 'success');
					break;
				case "removeMetaFromVo":
					var meta = data.params[0];
					item = data.params[1];
					n.set('description', 'Le tag ' + meta + ' a été supprimé à l\'item ' + item + '.');
					n.set('type', 'error');
					break;
				case "setUserOfVo":
					var user = data.params[0];
					item = data.params[1];
					n.set('description', 'L\'auteur de l\'item ' + item + ' a été changé.');
					n.set('type', 'info');
					break;
				case "addDataIntoVo":
					var d = data.result;
					item = data.params[1];
					n.set('description', 'La donnée associée ' + d + ' a été ajoutée à l\'item ' + item + '.');
					n.set('type', 'success');
					break;
				case "removeDataFromVo":
					var d = data.params[0];
					var dataType = data.params[1];
					item = data.params[2];
					n.set('description', 'La donnée associée ' + d + ' a été supprimée de l\'item ' + item + '.');
					n.set('type', 'error');
					break;
			}
			
			this.addNotification( n );
			
			this.render(); 
			this.highlight();
		},
		
		datas: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Données associée' );
			if( !this.setUser( data, n ) ) return;
			
			var data = 0;
			switch( data.method ) {
				case "addData":
					d = data.result;
					n.set('description', 'La donnée associée ' + d + ' a été ajoutée.');
					n.set('type', 'success');
					break;
				case "setData":
					d = data.params[0].id;
					n.set('description', 'La donnée associée ' + d + ' a été modifiée.');
					n.set('type', 'info');
					break;
				case "deleteData":
					d = data.params[1];
					n.set('description', 'La donnée associée ' + d + ' a été supprimée.');
					n.set('type', 'error');
					break;
			}
			
			this.addNotification( n );
			
			this.render(); 
			this.highlight();
		},
		
		users: function(data) {
			console.log(data);
			
			var n = this.createNotif( data, 'Utilisateur' );
			if( !this.setUser( data, n ) ) return;
			
			var user = 0;
			switch( data.method ) {
				case "addUser":
					user = data.result;
					n.set('description', 'L\'utilisateur ' + user + ' a été ajouté.');
					n.set('type', 'success');
					break;
				case "setUser":
					user = data.params[0].id;
					n.set('description', 'L\'utilisateur ' + user + ' a été modifié.');
					n.set('type', 'info');
					break;
				case "deleteUser":
					user = data.params[0];
					n.set('description', 'L\'utilisateur ' + user + ' a été supprimé.');
					n.set('type', 'error');
					break;
				case "banUser":
					user = data.params[0];
					if ( data.params[1] ) {
						n.set('description', 'L\'utilisateur ' + user + ' a été banni.');
						n.set('type', 'error');
					} else {
						n.set('description', 'L\'utilisateur ' + user + ' a été accepté.');
						n.set('type', 'success');
					}
					break;
				case "addDataIntoVo":
					var d = data.result;
					user = data.params[1];
					n.set('description', 'La donnée associée ' + d + ' a été ajoutée à l\'utilisateur ' + user + '.');
					n.set('type', 'success');
					break;
				case "removeDataFromVo":
					var d = data.params[0];
					var dataType = data.params[1];
					user = data.params[2];
					n.set('description', 'La donnée associée ' + d + ' a été supprimée de l\'utilisateur ' + user + '.');
					n.set('type', 'error');
					break;
			}
			
			this.addNotification( n );
			
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