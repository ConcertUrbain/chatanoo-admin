define([
	'Backbone',
	'Underscore',
	'jQuery'
], function(Backbone, _, $) {
	
	var AbstractTableView = Backbone.View.extend(
	{
		blockResize: false,
		collection: null,
		voClass: null,
		
		addOptions: {},
		addViewClass: "row",
		
		mode: 'all',
		facets: ['id', 'Contenu', 'Date d\'ajout', 'Date de modif'],
		
		currentRow: null,
		
		tableHeight: null,
		
		initialize: function() {
			var mThis = this;
			
			this.collection.load();
			this.collection.on('load', function() { this.render(); }, this);
			
			var mThis = this;
			$(window).resize( function( event ) {
				mThis.renderHead();
			});
			$(window).on( "scroll", function(event) {
				mThis.processScroll(event);
			} );
	    },
	
		events: {
			// table controls
			'click .all a': 'showAll',
			'click .valid a': 'showValid',
			'click .unvalid a': 'showUnvalid',
			'click table tbody tr td.action': '_actionClick',
			'click .refresh': 'refresh',
			'click .add': "add"
		},
		
		render: function() {
			this.renderResult();
			this.search();
			this.renderHead();
			
			var mThis = this;
			this.$el.find(".modal-body").on( "scroll", function(event) {
				//mThis.processScroll(event);
			} );
			
			this.nav = null;
			this.navTop = 0;
			this.navIsFixed = 0;
			this.tableHead = null;
			this.tableHeadTop = 0;
			this.tableHeadIsFixed = 0;
			this.processScroll();
		
			return this;
		},
		
		refresh: function( event ) {
			this.collection.load();
			return false;
		},
		
		nav: null,
		navTop: 0,
		navIsFixed: 0,
		tableHead: null,
		tableHeadTop: 0,
		tableHeadIsFixed: 0,
		processScroll: function(event) {
			var scrollTop; 
			if( event )
				scrollTop = $(event.currentTarget).scrollTop();
			else
				scrollTop = $(window).scrollTop();
			
			if( _.isNull( this.nav ) ) {
				this.nav = this.$el.find('.subnav');
				this.navTop = this.nav.length && this.nav.offset().top - 40;
			}
			if (scrollTop >= this.navTop && !this.navIsFixed) {
				this.navIsFixed = 1
				this.nav.addClass('subnav-fixed')
			} else if (scrollTop <= this.navTop && this.navIsFixed) {
				this.navIsFixed = 0
				this.nav.removeClass('subnav-fixed')
			}
			
			if( _.isNull( this.tableHead ) ) {
				this.tableHead = this.$el.find('.table-fixed-head');
				var tableRef = this.$el.find( this.tableHead.data('target') );
				this.tableHeadTop = this.tableHead.length && tableRef.offset().top - 40 - 40;
			}
			if (scrollTop >= this.tableHeadTop && !this.tableHeadIsFixed) {
				this.tableHeadIsFixed = 1;
				this.tableHead.css("display", "block");
			} else if (scrollTop <= this.tableHeadTop && this.tableHeadIsFixed) {
				this.tableHeadIsFixed = 0;
				this.tableHead.css("display", "none");
			}
		},

		_request: "",
		renderResult: function() {
			var mThis = this;
			this.$el.find("table tbody tr:not(.add)").remove();
        
			var collection;
			switch(this.mode) {
				case "all": collection = this.collection.all(); break;
				case "valid": collection = this.collection.valid(); break;
				case "unvalid": collection = this.collection.unvalid(); break;
			}

			var els = [];
			_(collection).each( function (vo) {
				var v = mThis.createRowView( vo );
				els.push( v.render().el );
			});
			this.$el.find("table tbody").prepend( els );
		},
		
		createRowView: function( model ) {
			var mThis = this;
			var v = new this.voClass( { model: model } );
			v.on('change', function() {
				$(window).resize();
			});
			v.on('selected', function() {
				if( !_.isNull( mThis.currentRow ) ) {
					mThis.currentRow.cancelEditing();
					mThis.currentRow.$el.removeClass('active');
				}
				mThis.currentRow = v;
			});
			v.model.on('change', function() {
				$(window).resize();
			});
			v.model.on('added', function() {
				v.$el.removeClass('new');
			});
			v.model.on("change:validate", function() {
				mThis.collection.validateVo( v.model );
				if( mThis.mode != "all" ) {
					v.kill();
					v.remove();
				}
			});
			v.model.on("change:unvalidate", function() {
				mThis.collection.unvalidateVo( v.model );
				if( mThis.mode != "all" ) {
					v.kill();
					v.remove();
				}
			});
			return v;
		},
        
		_request: '',
		search: function() {
			var mThis = this;
			var visualSearch = VS.init({
		      container  : this.$el.find('#searchbox'),
		      query      : mThis._request,
		      callbacks  : {
				search       : function(query, searchCollection) {
					mThis.collection.filters = searchCollection.facets();
					mThis._request = query;
					mThis.renderResult();
					$(window).resize();
				},
		        facetMatches : function(callback) {
		          callback(mThis.facets);
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
		
		renderHead: function() {
			var mThis = this;
			this.$el.find(".table-fixed-head").each( function(index, table) {
				var tableRef = mThis.$el.find( $(table).data("target") );
				$(table).html("");
				
				var ul = $("<ul />");
				tableRef.find('th').each( function(i, th) {
					var el = $("<li />");
					
					var w = $(th).width();
					w += parseInt( $(th).css("padding-left").substring(0, $(th).css("padding-left").length - 2) );
					w += parseInt( $(th).css("padding-right").substring(0, $(th).css("padding-right").length - 2) );
					if(i > 0)
						w += 1;
					el.width( w );
					
					el.html( $(th).html() );
					ul.append( el );
				});
				
				$(table).append( ul );
			});
		},

		// table controls
		showAll: function( event ) {
			this.mode = "all";
			this.render();
        
			return false;
		},
        
		showValid: function( event ) {
			this.mode = "valid";
			this.render();
        
			return false;
		},
        
		showUnvalid: function( event ) {
			this.mode = "unvalid";
			this.render();
        
			return false;
		},
		
		add: function() {
			if( this.addViewClass == "row" ) {
				var v = this.createRowView( new this.collection.model( this.addOptions ) );
				v.$el.addClass('new');
				v.editing = true;
				
				var tr = this.$el.find("table tbody tr:not(.add)");
				if( tr.length == 0 ) {
					this.$el.find("table tbody").prepend( v.render().$el );
				} else {
					$(tr[tr.length - 1]).after( v.render().$el );
				}
			}
			
			return false;
		},
		
		_actionClick: function( event ) {
			event.preventDefault();
		}
		
	});
	
	return AbstractTableView;
});