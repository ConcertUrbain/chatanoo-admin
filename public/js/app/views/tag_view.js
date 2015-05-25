define([
  'backbone',
  'underscore',
  'jquery',
  'chatanoo',
  
  'config',
  
  'app/views/abstract_row_view',
  
  'text!app/templates/tag.tmpl.html',

  'app/views/links_popin_view',
  
  'app/views/app_view'
], function(Backbone, _, $, Chatanoo,
  Config,
  AbstractRowView,
  template,
  LinksPopinView,
  app_view) {
  
  var TagView = AbstractRowView.extend({  
    deleteMessage: "Voulez vous vraiment supprimer ce tag ?",
    
    events: _.extend( {
      "click .link": "showLinks",
      "click .export": "export"
    }, AbstractRowView.prototype.events ),
    
    initialize: function() {
      AbstractRowView.prototype.initialize.call(this);
      },
    
    render: function() {
      this.$el.data('tag-id', this.model.get('id'));
      this.$el.html(_.template( template, { tag: this.model, editing: this.editing, Config: Config } ));
    
      AbstractRowView.prototype.render.call(this);
      return this;
    },
    
    onSelectRow: function() {
      var itemId = this.$el.data('tag-id');
      
      // Timeout for dblclick
      // setTimeout( function() {
      //   var r = Chatanoo.queries.getQueriesByItemId( itemId );
      //   Chatanoo.queries.on( r.success, function(queries) {
      //     app_view.chatanoo.loadUrl('/queries/' + queries[0].id + '/items/' + itemId);
      //   }, this);
      // }, 500);
    },
    
    getEditingValue: function() {
      return {
        name: this.$el.find('textarea[name=name]').val(), 
        content: this.$el.find('textarea[name=content]').val()
      };
    },                                   
                                            
    showLinks: function( event ) {          
      event.preventDefault();             
      this.createPopin( LinksPopinView, { voType: "Meta", voId: this.model.get('id'), vo: this.model } );
    },

    export: function( event ) {          
      event.preventDefault();  
      var mThis = this;
      this.model.loadDetails( function(items) {
        var data = [];
        // header
        data.push(['id', 'Titre', 'Description', 'Date d\'ajout', 'Date de modif', 'Vote', 'Tags', 'Commentaires', 'Medias']);

        _(items).each( function(entry) {
          var d = [];
          d.push( entry['VO'].id );
          d.push( '"""' + entry['VO'].title + '"""' );
          d.push( '"""' + entry['VO'].description + '"""' );
          d.push( entry['VO'].addDate ? entry['VO'].addDate.format() : null );
          d.push( entry['VO'].endDate ? entry['VO'].endDate.format() : null );
          d.push( entry['VO'].rate );

          d.push( '"""' + _(entry.metas).map( function(meta) {
            return meta.name + ":" + meta.content;
          }).join(' | ') + '"""' );

          d.push( '"""' + _(entry.comments).map( function(comment) {
            return comment.content;
          }).join(' | ') + '"""' );

          d.push( '"""' + _.flatten( _(entry.medias).map( function(medias) {
            return _(medias).map( function(media) {
              if (media.__className == "Vo_Media_Picture") {
                return Config.mediasCenter.url + "m/" + media.url + ".jpg";
              } else if (media.__className == "Vo_Media_Video") {
                return Config.mediasCenter.url + "m/480x320/" + media.url + ".mp4";
              } else if (media.__className == "Vo_Media_Sound") {
                return Config.mediasCenter.url + "m/" + media.url + ".mp3";
              }
              return media.url;
            });
          }) ).join(' | ') + '"""' );

          data.push(d);
        });
        
        var link = mThis.createCSVLink(data)
        link.click();
      } );
    },

    createCSVLink: function(data) {
      console.log(data);
      var csvContent = "data:text/csv;charset=utf-8,";
      _(data).each(function(infoArray, index){
         dataString = infoArray.join(";");
         csvContent += dataString + ";\n";
      }); 
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      return link;
    }
  });
  
  return TagView;
});