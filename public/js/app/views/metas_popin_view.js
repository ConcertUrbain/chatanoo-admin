define([
  'backbone',
  'underscore',
  'jquery',
  'chatanoo',
  
  'app/views/abstract_table_view',
  
  'config',
  
  'app/collections/metas',
  'app/views/meta_view',
  
  'text!app/templates/metas_popin.tmpl.html',
  
  'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
  AbstractTableView,
  Config,
  Metas, MetaView,
  template,
  app_view) {
  
  var MetasPopinView = AbstractTableView.extend(
  {  
    collection: new Metas(),
    voClass: MetaView,
    
    facets: [
      { label: 'id',     value: 'id' },
      { label: 'Type',   value: 'name' },
      { label: 'Contenu', value: 'content' }
    ],
    
    scrollReferer: ".modal-body",
    
    initialize: function( options ) {
      var mThis = this;
      this.$el.addClass("modal hide fade metas");
      this.$el.on('hidden', function () {
         mThis.kill();
      });
      
      this.addOptions = options;
      this.addOptions.__className = "Vo_Meta";
      
      this.collection.voId = options.voId;
      this.collection.voType = options.voType;
      if( !_.isUndefined( options.isMedia ) )
        this.collection.isMedia = options.isMedia;
      
      AbstractTableView.prototype.initialize.call(this);
      },
  
    events: _.extend( AbstractTableView.prototype.events, {
      
    }),
    
    render: function() {
      this.$el.html( _.template( template, { mode: this.mode } ) );
      
      AbstractTableView.prototype.render.call(this);
      return this;
    },
    
    kill: function() {
      this.$el.unbind()
      //this.model.off();
      this.$el.remove();
    }
  });
  
  return MetasPopinView;
});