define([
	'Backbone',
	'Underscore',
	'jQuery',
	'Chatanoo',
	
	'Config',
	
	'app/collections/comments',
	'app/collections/datas',
	'app/collections/items',
	'app/collections/medias',
	'app/collections/metas',
	'app/collections/queries',
	'app/collections/users',
	
	'text!app/templates/add_link_popin.tmpl.html',
], function(Backbone, _, $, Chatanoo,
	Config,
	Comments, Datas, Items, Medias, Metas, Queries, Users,
	template) {
	
	var AddLinkPopinView = Backbone.View.extend(
	{
		model: null,
		
		voType: null,
		voId: null,
		vo: null,
		
		selectedRow: null,
		
		events: {
			'change #type': 'changeType',
			'click .validate': 'addLink'
		},
		
		initialize: function(options) {
			//this.model.on("change", this.render, this);
			var mThis = this;
			this.$el.addClass("modal hide fade add-link");
			
			this.voType = options.voType;
			this.voId = options.voId;
			this.vo = options.vo;
			
			this.$el.on('hidden', function () {
			 	mThis.kill();
			});
	    },
	
		_request: '',
		search: function() {
			var mThis = this;
			var visualSearch = VS.init({
		      container  : this.$el.find('#searchbox'),
		      query      : mThis._request,
		      callbacks  : {
				search       : function(query, searchCollection) {
					mThis._collection.filters = searchCollection.facets();
					mThis._request = query;
					mThis.renderResult();
					//$(window).resize();
				},
		        facetMatches : function(callback) {
		          callback();
		        },
		        valueMatches : function(facet, searchTerm, callback) {
		          switch (facet) {
		          	/*case 'account':
		              callback([]);
		              break;*/
		          }
		        }
		      }
		    });
		},
		
		_requestType: null, 
		changeType: function() {
			this._requestType = this.$el.find('#type').val();
			if( this._requestType != 'none')
				this.loadCollection();
		},
		
		_collection: null,
		loadCollection: function() {
			if( this._requestType == 'none')
				return;
			
			var filters = [];
			if( !_.isNull( this._collection ) ) filters = this._collection.filters;
			
			switch( this._requestType ) {
				case 'User': 	this._collection = new Users(); 	break;
				case 'Meta': 	this._collection = new Metas(); 	break;
				case 'Data': 	this._collection = new Datas(); 	break;
				case 'Item': 	this._collection = new Items(); 	break;
				case 'Query': 	this._collection = new Queries(); 	break;
				case 'Comment': this._collection = new Comments(); 	break;
				case 'Media': 	this._collection = new Medias(); 	break;
			}
			this._collection.on('load', function() {
				this.render();
			}, this);
			this._collection.filters = filters;
			this._collection.load();
		},
		
		renderResult: function() {
			var mThis = this;
			
			var table = this.$el.find('#table');
			table.find('tbody > tr').remove();
			this.selectedRow = null;
		
			if( this._request == '' || this._requestType == 'none')
				return;
				
			var properties = [];
			switch( this._requestType ) {
				case 'User': 	properties = ['lastName', 'firstName', "pseudo"]; 	break;
				case 'Meta': 	properties = ['name', 'content']; 					break;
				case 'Data': 	properties = 'all'; 								break;
				case 'Item': 	properties = ['title']; 							break;
				case 'Query': 	properties = ['content']; 							break;
				case 'Comment': properties = ['content']; 							break;
				case 'Media': 	properties = ['title']; 							break;
			}
			
			var els = [];
			_( this._collection.all() ).each( function(vo) {
				var options = { id: vo.get('id'), content: '' };
				if( typeof properties !== "string" ) {
					options.content = _.chain( properties )
										.map( function(prop) { return vo.get(prop); })
										.reduce( function(memo, value) { return memo + ", " + value; })
										.value();
				} else if( properties == "all" ){
					options.content = _.chain( vo.toJSON() )
										.map( function(prop) { 
											switch(true) {
												case typeof prop === 'string': return prop;
												case moment.isMoment(prop): return prop.format( Config.dateFormat );
											}
										})
										.reduce( function(memo, value) { return memo + ", " + value; })
										.value();
				}
				var tr = $('<tr />s', {}).html( _.template( '<td><%= id %></td><td><%= content %></td>', options ) );
				
				tr.data('vo-id', options.id);
				tr.data('link-type', mThis._requestType);
				if( _.isUsable( vo.get('type') ) )
					tr.data('vo-type', vo.get('type'));
				tr.click( function(event) {
					mThis.selectedRow = tr;
					_( els ).each( function(el) {
						el.removeClass('active');
					})
					tr.addClass('active');
				});
				tr.dblclick( function(event) {
					tr.click();
					mThis.addLink();
				});
				
				els.push( tr );
				table.append( tr );
			});	
		},
		
		render: function() {
			var links = Config.chatanoo.links[ this.voType ];
			var options = _( _.union( links.parents, links.children ) ).map( function( link ) {
				var option = {}; option.value = link;
				switch( link ) {
					case 'User': 	option.label = "Utilisateur"; 		break; 
					case 'Data': 	option.label = "Donnée associée"; 	break; 
					case 'Meta': 	option.label = "Tag"; 				break; 
					case 'Query': 	option.label = "Question"; 			break; 
					case 'Item': 	option.label = "Contribution";		break; 
					case 'Comment': option.label = "Commentaire"; 		break; 
					case 'Media': 	option.label = "Média"; 			break; 
				}
				return option;
			});
			this.$el.html(_.template( template, { options: options, selectedType: this._requestType } ));
			
			this.search();
			this.renderResult();
			
			return this;
		},
		
		addLink: function() {
			var linkType = this.selectedRow.data('link-type');
			var voId = this.selectedRow.data('vo-id');
			var voType = this.selectedRow.data('vo-type');
			
			switch( this.voType ) {
				case 'User':
					switch( linkType ) {
						case 'Data': 	
							service = Chatanoo.users; 	
							method = Chatanoo.users.addDataIntoVo; 		
							var data = this._collection.getVoById(voId, voType).toJSON(); delete data.type;
							args = [data, this.vo.get('id')];	
							break;
						case 'Item': 	
							service = Chatanoo.items; 	
							method = Chatanoo.items.setItem; 	
							var item = this._collection.getVoById(voId);
							item.set('_user', this.vo.get('id'));
							args = [item.toJSON()];	
							break;
						case 'Query': 
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.setQuery; 	
							var query = this._collection.getVoById(voId);
							query.set('_user', this.vo.get('id'));
							args = [query.toJSON()];	
							break;
						case 'Comment':
							service = Chatanoo.comments; 	
							method = Chatanoo.comments.setComment; 	
							var comment = this._collection.getVoById(voId);
							comment.set('_user', this.vo.get('id'));
							args = [comment.toJSON()];	
							break;
						case 'Media':
							service = Chatanoo.medias; 	
							method = Chatanoo.medias.setMedia; 	
							var media = this._collection.getVoById(voId, voType);
							media.set('_user', this.vo.get('id'));
							media = media.toJSON(); delete media.type;
							args = [media];	
							break;
						case 'Meta': 	
							service = Chatanoo.users; 	
							method = Chatanoo.users.addMetaIntoVo; 	
							args = [this._collection.getVoById(voId).toJSON(), this.vo.get('id')];
							break;
					}
					break;
				case 'Item':
					switch( linkType ) {
						case 'User': 
							service = Chatanoo.items; 	
							method = Chatanoo.items.setItem; 	
							this.vo.set('_user', voId);
							args = [this.vo.toJSON()];
							break;
						case 'Meta': 	
							service = Chatanoo.items; 	
							method = Chatanoo.items.addMetaIntoVo; 	
							args = [this._collection.getVoById(voId).toJSON(), this.vo.get('id')];
							break;
						case 'Data': 	
							service = Chatanoo.items; 	
							method = Chatanoo.items.addDataIntoVo; 	
							var data = this._collection.getVoById(voId, voType).toJSON(); delete data.type;
							args = [data, this.vo.get('id')];
							break;
						case 'Query': 
						 	service = Chatanoo.queries; 	
							method = Chatanoo.queries.addItemIntoQuery; 	
							args = [this.vo.toJSON(), voId];
							break;
						case 'Comment': 	
							service = Chatanoo.items; 	
							method = Chatanoo.items.addCommentIntoItem; 	
							args = [this._collection.getVoById(voId).toJSON(), this.vo.get('id')];
							break;
						case 'Media': 	
							service = Chatanoo.items; 	
							method = Chatanoo.items.addMediaIntoItem; 	
							var media = this._collection.getVoById(voId, voType).toJSON(); delete media.type;
							args = [media, this.vo.get('id')];
							break;
					}
					break;
				case 'Query':
					switch( linkType ) {
						case 'User': 
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.setQuery; 	
							this.vo.set('_user', voId);
							args = [this.vo.toJSON()];
							break;
						case 'Meta': 
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.addMetaIntoVo; 	
							args = [this._collection.getVoById(voId).toJSON(), this.vo.get('id')];
							break;
						case 'Data': 	
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.addDataIntoVo; 	
							var data = this._collection.getVoById(voId, voType).toJSON(); delete data.type;
							args = [data, this.vo.get('id')];
							break;
						case 'Item': 	
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.addItemIntoQuery; 	
							args = [this._collection.getVoById(voId).toJSON(), this.vo.get('id')];
							break;	
						case 'Media': 	
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.addMediaIntoQuery; 	
							var media = this._collection.getVoById(voId, voType).toJSON(); delete media.type;
							args = [media, this.vo.get('id')];
							break;
					}
					break;
				case 'Media':	
					var media;
					switch( linkType ) {
						case 'User': 
							service = Chatanoo.medias; 	
							method = Chatanoo.medias.setMedia; 	
							this.vo.set('_user', voId);
							media = this.vo.toJSON(); delete media.type;
							args = [media];
							break;
						case 'Meta': 
							service = Chatanoo.medias; 	
							method = Chatanoo.medias.addMetaIntoMedia; 	
							args = [this._collection.getVoById(voId).toJSON(), this.vo.get('id'), this.vo.get('type')];
							break;
						case 'Data': 
							service = Chatanoo.medias; 	
							method = Chatanoo.medias.addDataIntoMedia; 	
							args = [this._collection.getVoById(voId, voType).toJSON(), this.vo.get('id'), this.vo.get('type')];
							break;
						case 'Item': 	
							service = Chatanoo.items; 	
							method = Chatanoo.items.addMediaIntoItem; 	
							media = this.vo.toJSON(); delete media.type;
							args = [media, voId];
							break;
						case 'Query': 	
							service = Chatanoo.queries; 	
							method = Chatanoo.queries.addMediaIntoQuery; 	
							media = this.vo.toJSON(); delete media.type;
							args = [media, voId];
							break;
					}
					break;
				case 'Comment':
					switch( linkType ) {
						case 'User': 
							service = Chatanoo.comments; 	
							method = Chatanoo.comments.setComment; 	
							this.vo.set('_user', voId);
							args = [this.vo.toJSON()];
							break;
						case 'Data': 	
							service = Chatanoo.comments; 	
							method = Chatanoo.comments.addDataIntoVo; 	
							var data = this._collection.getVoById(voId, voType).toJSON(); delete data.type;
							args = [data, this.vo.get('id')];
							break;
						case 'Item':
							service = Chatanoo.items; 	
							method = Chatanoo.items.addCommentIntoItem; 	
							args = [this.vo.toJSON(), voId];
							break;
					}
					break;
			}
			
			var mThis = this;
			var r = method.apply( service, args );
			service.on( r.success, function( results ) {
				this.$el.modal('hide');
				this.trigger('added')
			}, this);
			
			return false;
		},
		
		kill: function() {
			this.$el.unbind()
			//this.model.off();
			this.$el.remove();
		}
	});
	
	return AddLinkPopinView;
});