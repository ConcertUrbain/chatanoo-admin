define([
  'Backbone',
  'Underscore',
  'jQuery',
  
  'app/helpers/create_popin'
], function(Backbone, _, $,
  createPopin) {
  
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
    
    scrollReferer: window,
    $scrollReferer: null,
    
    initialize: function() {
      var mThis = this;
      
      this.collection.load();
      this.collection.on('load', function() { this.render(); }, this);
      
      var mThis = this;
      $(window).resize( function( event ) {
        mThis.renderHead();
      });
      
      if( this.scrollReferer === window ) {
        $(window).on( "scroll", function(event) {
          mThis.processScroll(event);
        } );
      }
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
      
      if( this.scrollReferer === window ) {
        this.$scrollReferer = $(window);
      } else {
        this.$scrollReferer = this.$el.find( this.scrollReferer );
        
        var mThis = this;
        this.$scrollReferer.on( "scroll", function(event) {
          mThis.processScroll(event);
        } );
      }
      
      this.topNav = null;
      this.bottomNav = null;
      this.tableHead = null;
      this.processScroll();
    
      return this;
    },
    
    refresh: function( event ) {
      this.collection.load();
      return false;
    },
    
    topNav: null,
    bottomNav: null,
    tableHead: null,
    processScroll: function(event) {
      var scrollTop = this.$scrollReferer.scrollTop();
      var offset = this.$scrollReferer.height();
      
      // TOP NAV
      if( _.isNull( this.topNav ) ) {
        var nav = this.$el.find('.topnav');
        if( nav.length > 0 ) { 
          nav.removeClass('subnav-fixed');
          this.topNav = {
            el: nav,
            top: nav.length && nav.offset().top,
            isFixed: 0
          }
          if( this.scrollReferer === window ) { 
            this.topNav.top -= 40;
          } else {
            this.topNav.top -= this.$scrollReferer.offset().top;
          }
        }
      }
      if( !_.isNull( this.topNav ) ) {
        if (scrollTop > this.topNav.top && !this.topNav.isFixed) {
          this.topNav.isFixed = 1;
          this.topNav.el.addClass('subnav-fixed');
        } else if (scrollTop <= this.topNav.top && this.topNav.isFixed) {
          this.topNav.isFixed = 0;
          this.topNav.el.removeClass('subnav-fixed');
        }
      }
      
      // TABLE HEAD
      if( _.isNull( this.tableHead ) ) {
        var table = this.$el.find('.table-fixed-head');
        if( table.length > 0 ) {
          table.css("display", "none");
          
          var tableRef = this.$el.find( table.data('target') );
          this.tableHead = {
            el: table,
            top: table.length && tableRef.offset().top - 40,
            isFixed: 0
          }
          if( this.scrollReferer === window ) { 
            this.tableHead.top -= 40;
          } else {
            this.tableHead.top -= this.$scrollReferer.offset().top;
          }
        }
      }
      if( !_.isNull( this.tableHead ) ) {
        if (scrollTop > this.tableHead.top && !this.tableHead.isFixed) {
          this.tableHead.isFixed = 1;
          this.tableHead.el.css("display", "block");
        } else if (scrollTop <= this.tableHead.top && this.tableHead.isFixed) {
          this.tableHead.isFixed = 0;
          this.tableHead.el.css("display", "none");
        }
      }
      
      // BOTTOM NAV
      if( _.isNull( this.bottomNav ) ) {
        var nav = this.$el.find('.bottomnav');
        if( nav.length > 0 ) { 
          nav.removeClass('subnav-fixed-bottom');
          this.bottomNav = {
            el: nav,
            top: nav.length && nav.offset().top,
            isFixed: 0
          }
        }
      }
      if( !_.isNull( this.bottomNav ) ) {
        if ((scrollTop + offset) < this.bottomNav.top && !this.bottomNav.isFixed) {
          this.bottomNav.isFixed = 1;
          this.bottomNav.el.addClass('subnav-fixed-bottom');
        } else if ((scrollTop + offset) >= this.bottomNav.top && this.bottomNav.isFixed) {
          this.bottomNav.isFixed = 0;
          this.bottomNav.el.removeClass('subnav-fixed-bottom');
        }
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

        $(window).resize();
        this.$scrollReferer.scrollTop(10000);
      } else {
        $(window).resize();
        createPopin( this.addViewClass, this.addOptions );
      }
      
      return false;
    },
    
    _actionClick: function( event ) {
      event.preventDefault();
    }
    
  });
  
  return AbstractTableView;
});