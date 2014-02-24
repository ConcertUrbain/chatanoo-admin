define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	'Config',

	'app/models/header_model',
	'app/views/header_view',
	'app/views/menu_view',
	'app/views/chatanoo_view',
	'app/views/overlay_view',
	
	'text!app/templates/app.tmpl.html'
], function(Backbone, _, $, Chatanoo, Config,
	Header, HeaderView, MenuView, ChatanooView, OverlayView,
	template) {
	
	var AppView = Backbone.View.extend(
	{
		el: "body",
		
		header: null,
		menu: null,
		chatanoo: null,
		
		content: null,
		
		overlay: null,
		user: null,
		
		isLogin: false,
		
		nb: {
			queries: 0,
			items: 0,
			comments: 0,
			medias: 0,
			users: 0,
			tags: 0
		},
		
		initialize: function() {
			console.log("init");
			this.$el.html(_.template(template, this.model));
			
			this.header = new HeaderView( { el: $('#header'), model: new Header() } );
			this.header.on('logout', this.logout, this);
			
			this.overlay = new OverlayView( { el: $('#overlay') } );
			this.overlay.hide('loading');
			
			Chatanoo.on('loading', function() {
				this.overlay.show('loading');
			}, this);
			
			Chatanoo.on('finish', function() {
				this.overlay.hide('loading');
			}, this);
	  	},	 

		getCurrentUser: function() {  
			if( _.isUndefined( Chatanoo.connection ) )
				return;
			      
			var mThis = this;
			var r = Chatanoo.connection.getCurrentUser();
			Chatanoo.connection.on( r.success, function(user) {
				this.user = user;
				this.trigger("change change:user");
				this.render();
			}, mThis);
		},
		
		setMenuBadge: function(type, value) {
			this.nb[type] = value;
			if( !_.isNull( this.menu ) )
				this.menu.render();
		},
		
		render: function() {	
			var mThis = this;
			
			if( _.isNull(this.user) && $.cookie('session_key') != null)
				this.getCurrentUser();
							
			this.header.render();
			
			if( this.isLogin ) {
				if( !_.isNull( this.menu ) ) { this.menu.kill(); this.menu.remove(); this.menu = null; };
				if( !_.isNull( this.chatanoo ) ) { this.chatanoo.kill(); this.chatanoo.remove(); this.chatanoo = null; };
			} 
			
			if( $('#wrapper').children().length < 1 )
			{
				$('<div />', { id: 'menu' }).appendTo( $('#wrapper') );
				$('<div />', { id: 'content' }).appendTo( $('#wrapper') );
				$('<div />', { id: 'chatanoo' }).appendTo( $('#wrapper') );
			}
			
			if( !_.isNull( this.menu ) ) {
				this.menu.render();
			} else if( $('#menu').length > 0 ) {
				this.menu = new MenuView( { el: $('#menu') } );
				this.menu.render();
			}
			if( !_.isNull( this.chatanoo ) ) {
				//this.chatanoo.render();
			} else if( $('#chatanoo').length > 0 ) {
				mThis.chatanoo = new ChatanooView( { el: $('#chatanoo') } );
				mThis.chatanoo.render();
			}
			
			if( !_.isNull(this.content) )
				this.content.render();
			
			return this;
		},
		
		logout: function() {
			location.hash = '/login';
		},
		
		// Retract the chatanoo iframe
		retract: function() {
			$('body').addClass('retract');
			$(window).resize();
		},
		
		// Deploy the chatanoo iframe
		deploy: function() {
			$('body').removeClass('retract');
			$(window).resize();
		},
		
		_gotoView: function(view, options, callback, isLogin) {
			if( !_.isNull(this.content) && _.isFunction(this.content.kill))
				this.content.kill();
				
			this.isLogin = isLogin || false;
				
			options = options || {};
			
			var mThis = this;
			require([view], function( View ) {
				mThis.content = new View( options );
				callback.apply( mThis, [mThis.content] );
				mThis.render();
			});
		},
		
		gotoLogin: function() {				
			this._gotoView( 'app/views/login_view', {}, function ( login_view ) {
				
			}, true );
		},
		
		gotoDashboard: function() {
			this._gotoView( 'app/views/dashboard_view', {}, function ( dashboard_view ) {
				
			} );
		},
		
		gotoQueries: function() {
			this._gotoView( 'app/views/queries_view', {}, function ( queries_view ) {
				
			} );
		},
		
		gotoItems: function() {
			this._gotoView( 'app/views/items_view', {}, function ( items_view ) {
				
			} );
		},
		
		gotoComments: function() {
			this._gotoView( 'app/views/comments_view', {}, function ( comments_view ) {
				
			} );
		},
		
		gotoMedias: function() {
			this._gotoView( 'app/views/medias_view', {}, function ( medias_view ) {
				
			} );
		},
		
		gotoUsers: function() {
			this._gotoView( 'app/views/users_view', {}, function ( users_view ) {
				
			} );
		},

		gotoTags: function() {
			this._gotoView( 'app/views/tags_view', {}, function ( tags_view ) {
				
			} );
		}
	});
	
	var app = new AppView;
	
	return app;
});