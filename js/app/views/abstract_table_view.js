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
		
		mode: 'all',
		facets: ['id', 'Contenu', 'Date d\'ajout', 'Date de modif'],
		
		initialize: function() {
			var mThis = this;
			
			this.collection.load();
			this.collection.on('change', function() { this.render(); }, this);
			
			$(window).resize( function( event ) {
				if( !mThis.blockResize )
					mThis.resize();
			});
	    },
	
		events: {
			// table controls
			'click a.all': 'showAll',
			'click a.valid': 'showValid',
			'click a.unvalid': 'showUnvalid',
			'click table tbody tr': '_selectRow',
			'click table tbody tr td.action': '_actionClick',
			'click .refresh': 'refresh',
		},
		
		render: function() {
			this.renderResult();
			this.search();
			
			this.resize(false);
			return this;
		},
		
		refresh: function( event ) {
			this.collection.load();
			return false;
		},

		_request: "",
		renderResult: function() {
			var mThis = this;
			this.$el.find("table tbody").html('');
        
			var collection;
			switch(this.mode) {
				case "all": collection = this.collection.all(); break;
				case "valid": collection = this.collection.valid(); break;
				case "unvalid": collection = this.collection.unvalid(); break;
			}
        
			var els = [];
			_(collection).each( function (vo) {
				var v = new mThis.voClass( { model: vo } );
				v.model.on('change', function() {
					mThis.collection.calculate();
					mThis.renderResult();
					$(window).resize();
				});
				els.push( v.render().el );
			});
			this.$el.find("table tbody").append( els );
		},
        
		_request: '',
		search: function() {
			var mThis = this;
			var visualSearch = VS.init({
		      container  : $('#searchbox'),
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
		
		_selectRow: function( event ) {
			this.$el.find('tbody tr.selected').removeClass('selected');
			$( event.currentTarget ).addClass('selected');
		},
		
		_actionClick: function( event ) {
			event.preventDefault();
		},
		
		resize: function( blockResize ) {
			this.blockResize = _.isUndefined( blockResize ) ? true : blockResize;
			
			var table = this.$el.find('table');
			var col = table.find('thead th').length;
			
			table.width('100%');
			var tablePer = table.width() - 16;
			table.find('thead th').each( function(index, td) {
				var size = $(td).data('size');
				if(size.indexOf('px') != -1) {
					tablePer -= size.replace('px', '') * 1;
				}
			});
			
			table.find('thead th').each( function(index, td) {
				var size = $(td).data('size');
				var width = 0;
				switch(true) {
					case size.indexOf('%') != -1:
						var per = size.replace('%', '') / 100;
						width = (index == col - 1) ? tablePer * per + 16 : tablePer * per;
						break;
					case size.indexOf('px') != -1:
						var val = size.replace('px', '') * 1;
						width = (index == col - 1) ? val + 16 : val;
						break;
				}
				
				$(td).width( width );
			});
			
			table.find('tbody td').each( function(index, td) {
				var size = table.find('thead th:eq(' + (index % col) + ')').data('size');
				var width = 0;
				switch(true) {
					case size.indexOf('%') != -1:
						var per = size.replace('%', '') / 100;
						width = (tablePer - 16) * per;
						break;
					case size.indexOf('px') != -1:
						var val = size.replace('px', '') * 1;
						width = val;
						break;
				}
				
				$(td).width( width );
			});
			
			var h = $(window).height() - 40 - 52;
			table.height( h );
			table.find('tbody').height( h - 26 );
			
			if( !this.blockResize )
				return;
			
			var mThis = this;
			setTimeout( function() {
				mThis.blockResize = false;
				mThis.resize(false);
			}, 300);
		}
	});
	
	return AbstractTableView;
});