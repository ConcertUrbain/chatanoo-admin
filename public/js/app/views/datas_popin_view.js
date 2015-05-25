define([
  'backbone',
  'underscore',
  'jquery',
  
  'config',
  
  'app/collections/datasset',
  'app/views/datas_view',
  'app/collections/datas',
  
  'text!app/templates/datas_popin.tmpl.html',
], function(Backbone, _, $,
  Config,
  DatasSet, DatasView, Datas,
  template) {
  
  var DatasPopinView = Backbone.View.extend(
  {
    datasSet: new DatasSet(),
    datasViews: {},
    
    events: {
    },
    
    initialize: function( options ) {
      var mThis = this;
      this.$el.addClass("modal hide fade datas");
      this.$el.on('hidden', function () {
         mThis.kill();
      });
      
      this.datasSet = new DatasSet();
      this.datasSet.voId = options.voId;
      this.datasSet.voType = options.voType;
      
      this.datasSet.load();
      this.datasSet.on('load', function() { this.render(); }, this);
      
      this.datasViews = {};
      },
    
    render: function() {
      this.$el.html(_.template( template, { } ));
      
      var mThis = this;
      _( Config.chatanoo.datas ).each( function( conf, type ) {
        if( !mThis.datasViews[type] ) {
          mThis.datasViews[type] = new DatasView({ 
            voId: mThis.datasSet.voId,
            voType: mThis.datasSet.voType,
            dataType: type, 
            title: conf.title, 
            addLabel: conf.addLabel });
        }
        mThis.datasViews[type].collection = _.isUndefined( mThis.datasSet.collections[type] ) ? new Datas() : mThis.datasSet.collections[type];
        if( _.isNull( mThis.datasViews[type].collection.datasSet ) ) mThis.datasViews[type].collection.datasSet = this.datasSet;
        mThis.$el.find('.modal-body').append( mThis.datasViews[type].render().$el );
      })
      
      return this;
    },
    
    kill: function() {
      this.$el.unbind()
      
      if( !_.isNull( this.datasSet ) ) { 
        this.datasSet.off();
        this.datasSet = null;
      }
      
      //this.model.off();
      _( this.datasViews ).each( function( datasView ) {
        datasView.kill();
      });
      this.datasViews = {};
      this.$el.remove();
    }
  });
  
  return DatasPopinView;
});