define([
  'backbone',
  'underscore',
  'jquery',
  'chatanoo',

  'config',

  'app/models/comment_model',
  'app/models/data_model',
  'app/models/item_model',
  'app/models/media_model',
  'app/models/meta_model',
  'app/models/query_model',
  'app/models/user_model',

  'app/helpers/create_popin',

  'app/views/add_link_popin',

  'text!app/templates/links_popin.tmpl.html'
], function(Backbone, _, $, Chatanoo,
  Config,
  Comment, Data, Item, Media, Meta, Query, User,
  createPopin,
  AddLinkPopin,
  template) {

  var LinksPopinView = Backbone.View.extend(
  {
    model: null,

    voType: null,
    voId: null,
    vo: null,

    links: null,
    graphLinks: [],

    cellSize: { width: 120, height: 50, horizontalGap: 100, verticalGap: 25, verticalTypeGap: 100 },

    count: 0,

    events: {
      'click .add': 'addLink',
      'click .graph-control .delete-link': 'deleteLink',
      'click .graph-control .delete-vo': 'deleteVo',
    },

    initialize: function(options) {
      var mThis = this;
      this.$el.addClass("modal hide fade links");

      this.voType = options.voType;
      this.voId = options.voId;
      this.vo = options.vo;

      this.load();
      },

    load: function() {
      this.count = 0;
      this.links = {};

      var mThis = this;
      var conf = Config.chatanoo.links[ this.voType ];
      _( _.union(conf.parents, conf.children) ).each( function(type) {
        mThis.count++;
        mThis.getLinks( mThis.voType, type, mThis.vo );
      });
    },

    getLinks: function( voType, linkType, vo ) {
      var service, method, args = [], uniq = false;
      switch( voType ) {
        case "Query":
          switch( linkType ) {
            case "Item":   service = Chatanoo.items;   method = Chatanoo.items.getItemsByQueryId;     args = [vo.get('id')];       break;
            case "Media":   service = Chatanoo.medias;   method = Chatanoo.medias.getMediasByQueryId;   args = [vo.get('id')];       break;
            case "User":   service = Chatanoo.users;   method = Chatanoo.users.getUserById;       args = [vo.get('_user')];     uniq = true; break;
            case "Meta":   service = Chatanoo.search;   method = Chatanoo.search.getMetasByVo;       args = [vo.get('id'), 'Query']; break;
            case "Data":   service = Chatanoo.datas;   method = Chatanoo.datas.getDatasByQueryId;     args = [vo.get('id')];       break;
          }
          break;
        case "Item":
          switch( linkType ) {
            case "Query":   service = Chatanoo.queries; method = Chatanoo.queries.getQueriesByItemId;   args = [vo.get('id')];      break;
            case "Comment": service = Chatanoo.comments;method = Chatanoo.comments.getCommentsByItemId; args = [vo.get('id')];      break;
            case "Media":   service = Chatanoo.medias;   method = Chatanoo.medias.getMediasByItemId;   args = [vo.get('id')];      break;
            case "User":   service = Chatanoo.users;   method = Chatanoo.users.getUserById;       args = [vo.get('_user')];     uniq = true; break;
            case "Meta":   service = Chatanoo.search;   method = Chatanoo.search.getMetasByVo;       args = [vo.get('id'), 'Item'];   break;
            case "Data":   service = Chatanoo.datas;   method = Chatanoo.datas.getDatasByQueryId;     args = [vo.get('id')];       break;
          }
          break;
        case "Comment":
          switch( linkType ) {
            case "Item":   service = Chatanoo.items;   method = Chatanoo.items.getItemById;       args = [vo.get('_item')];     uniq = true; break;
            case "User":   service = Chatanoo.users;   method = Chatanoo.users.getUserById;       args = [vo.get('_user')];     uniq = true; break;
            case "Data":   service = Chatanoo.datas;   method = Chatanoo.datas.getDatasByCommentId;   args = [vo.get('id')];       break;
          }
          break;
        case "Media":
          switch( linkType ) {
            case "Item":   service = Chatanoo.items;   method = Chatanoo.items.getItemsByMediaId;     args = [vo.get('id'), vo.get('type')];         break;
            //case "Query":   service = Chatanoo.queries; method = Chatanoo.queries.getQueryById;     args = [vo.get('_query')];               break;
            case "User":   service = Chatanoo.users;   method = Chatanoo.users.getUserById;       args = [vo.get('_user')];               uniq = true; break;
            case "Meta":   service = Chatanoo.search;   method = Chatanoo.search.getMetasByVo;       args = [vo.get('id'), 'Media_' + vo.get('type')];   break;
            case "Data":   service = Chatanoo.datas;   method = Chatanoo.datas.getDatasByMediaId;     args = [vo.get('id'), vo.get('type')];         break;
          }
          break;
        case "User":
          switch( linkType ) {

          }
          break;
        case "Data":
          switch( linkType ) {

          }
          break;
        case "Meta":
          switch( linkType ) {
            case "Item":   service = Chatanoo.items;   method = Chatanoo.items.getItemsByMetaId;     args = [vo.get('id')];   break;
            case "Query":   service = Chatanoo.queries; method = Chatanoo.queries.getQueriesByMetaId;   args = [vo.get('id')];   break;
            case "Media":   service = Chatanoo.medias;   method = Chatanoo.medias.getMediasByMetaId;   args = [vo.get('id')];   break;
          }
          break;
      }

      var mThis = this;
      var r = method.apply( service, args );
      service.on( r.success, function( results ) {
        if( _.isObject( results ) ) {
          mThis.links[ linkType ] = [];
          if( uniq ) {
            mThis.links[ linkType ].push( results );
          } else {
            _( results ).each( function(result) {
              if( linkType == 'Media' || linkType == 'Data' ) {
                _( result ).each( function(vo) {
                  if( _.isObject( vo ) ) {
                    mThis.links[ linkType ].push( vo );
                  }
                });
              } else {
                mThis.links[ linkType ].push( result );
              }
            });
          }
        }
        mThis.count--;
        if( mThis.count <= 0 ) {
          mThis.render();
        }
      }, this);
      service.on( r.error, function( results ) {
        mThis.links[ linkType ] = [];
        mThis.count--;
        if( mThis.count <= 0 ) {
          mThis.render();
        }
      }, this);
    },

    render: function() {
      this.graphLinks = [];

      this.$el.html(_.template( template, { Config: Config } ));

      if( _.isNull( this.links ) || _.isEmpty( this.links ) )
        return this;

      var mThis = this;
      var parents = [], children = [];
      var conf = Config.chatanoo.links[ this.voType ];
      var parenstMax = 0; _( conf.parents ).each( function( type ) { if(mThis.links[type].length > 0) parents.push( type ); var size = mThis.links[type].length; if( parenstMax < size ) parenstMax = size; });
      var childrenMax = 0; _( conf.children ).each( function( type ) { if(mThis.links[type].length > 0) children.push( type ); var size = mThis.links[type].length; if( childrenMax < size ) childrenMax = size; });
      var horizonMax = ( parents.length >= children.length ) ? parents.length : children.length;
      var padding = 10;

      var paperWidth = this.cellSize.width * horizonMax + this.cellSize.horizontalGap * (horizonMax - 1) + padding * 2;
      var paperHeight = this.cellSize.height + this.cellSize.verticalTypeGap * 2 + this.cellSize.height * (parenstMax + childrenMax) + this.cellSize.verticalGap * (parenstMax + childrenMax - 2) + padding * 2;

      if(paperWidth < 580) paperWidth = 580;
      if(paperHeight < 380) paperHeight = 380;

      var paper = Raphael( this.$el.find('#graph')[0], paperWidth, paperHeight );

      var x, y;
      var width = this.cellSize.width * parents.length + this.cellSize.horizontalGap * (parents.length - 1);
      var height = this.cellSize.height * parenstMax + this.cellSize.verticalGap * (parenstMax - 1);

      var block, blocks = [];
      _( parents ).each( function(type, index) {
        var vos = mThis.links[ type ];
        x = (paperWidth - width) / 2 + index * (mThis.cellSize.width + mThis.cellSize.horizontalGap) + padding;
        _( vos ).each( function (vo, i) {
          block = { vo: vo, x: x, y: height - (i + 1) * mThis.cellSize.height - i * mThis.cellSize.verticalGap + padding };
          if(i == 0) { block.position = "start"; }
          else if(i == _(vos).size() - 1) { block.position = "end"; }

          blocks.push( block );
        });
      });

      var center = {
        vo: mThis.vo.toJSON(),
        x: paperWidth / 2 + padding - mThis.cellSize.width / 2,
        y: height + padding + this.cellSize.verticalTypeGap,
        position: "center"
      };
      blocks.push( center );

      var offsetY = height + padding + 2 * this.cellSize.verticalTypeGap + this.cellSize.height;
      width = this.cellSize.width * children.length + this.cellSize.horizontalGap * (children.length - 1);
      _( children ).each( function(type, index) {
        var vos = mThis.links[ type ];
        x = (paperWidth - width) / 2 + index * (mThis.cellSize.width + mThis.cellSize.horizontalGap) + padding;
        _( vos ).each( function (vo, i) {
          block = { vo: vo, x: x, y: offsetY + i * (mThis.cellSize.height + mThis.cellSize.verticalGap) };
          if(i == 0) { block.position = "start"; }
          else if(i == _(vos).size() - 1) { block.position = "end"; }

          blocks.push( block );
        });
      });

      paper.setStart();
      var start;
      _( blocks ).each( function( block ) {
        if( block.position == "start" ) {
          start = block;
          paper.path("M" + (center.x + mThis.cellSize.width / 2) + " " + (center.y + mThis.cellSize.height / 2) + " L" + (block.x + mThis.cellSize.width / 2) + " " + (block.y + mThis.cellSize.height / 2) );
        } else if( block.position == "end" ) {
          paper.path("M" + (start.x + mThis.cellSize.width / 2) + " " + (start.y + mThis.cellSize.height / 2) + " L" + (block.x + mThis.cellSize.width / 2) + " " + (block.y + mThis.cellSize.height / 2) );
        }
      });
      var lines = paper.setFinish();
      lines.attr({
        stroke: '#BCBCBC',
        "stroke-width": 1
      });

      _( blocks ).each( function( block ) {
        var b = paper.createGraphCell( block.vo, block.x, block.y, mThis);
        mThis.graphLinks.push( b );
        if( block.position == "center" ) {
          b.select(true);
          mThis.renderVo( block.vo );
        }
      });

      return this;
    },

    currentVo: null,
    renderVo: function(vo) {
      this.currentVo = vo;

      var tmpl = "";
      var canDelete = false;
      switch( vo.__className ) {
        case "Vo_Query":   tmpl = "links_query.tmpl.html";   canDelete = Config.chatanoo.links.Query.canDelete;     break;
        case "Vo_Item":   tmpl = "links_item.tmpl.html";     canDelete = Config.chatanoo.links.Item.canDelete;     break;
        case "Vo_Comment":   tmpl = "links_comment.tmpl.html";   canDelete = Config.chatanoo.links.Comment.canDelete;   break;
        case "Vo_User":   tmpl = "links_user.tmpl.html";     canDelete = Config.chatanoo.links.User.canDelete;     break;
        case "Vo_Meta":   tmpl = "links_meta.tmpl.html";     canDelete = Config.chatanoo.links.Meta.canDelete;     break;
      }
      if( vo.__className.indexOf('Vo_Data') != -1 ) {
        tmpl = "links_data.tmpl.html"; canDelete = Config.chatanoo.links.Data.canDelete;
      }
      if( vo.__className.indexOf('Vo_Media') != -1 ) {
        tmpl = "links_media.tmpl.html"; canDelete =
        Config.chatanoo.links.Media.canDelete;
      }

      var mThis = this;
      require(['text!app/templates/' + tmpl], function(tmpl) {
        mThis.$el.find('.graph-control').html( _.template( tmpl, { vo: vo, canDelete: canDelete, Config: Config } ) );
      });
    },

    addLink: function() {
      var popin = createPopin( AddLinkPopin, {
        voType: this.voType,
        voId:   this.voId,
        vo:   this.vo
      } );

      popin.on('added', function() {
        this.load();
        popin.off();
      }, this);

      return false;
    },

    deleteLink: function() {
      var service, method, args = [];
      switch(true) {
        case this.vo.get('__className') == "Vo_User":
          switch(true) {
            case this.currentVo__className == "Vo_Comment":
              service = Chatanoo.comments;
              method = Chatanoo.comments.setComment
              this.currentVo._user = 0;
              args = [this.currentVo];
              break;
            case this.currentVo.__className == "Vo_Item":
              service = Chatanoo.items;
              method = Chatanoo.items.setItem
              this.currentVo._user = 0;
              args = [this.currentVo];
              break;
            case this.currentVo.__className.indexOf("Vo_Media") != -1:
              service = Chatanoo.medias;
              method = Chatanoo.medias.setMedia
              this.currentVo._user = 0;
              args = [this.currentVo];
              break;
            case this.currentVo.__className == "Vo_Query":
              service = Chatanoo.queries;
              method = Chatanoo.queries.setQuery
              this.currentVo._user = 0;
              args = [this.currentVo];
              break;
            case this.currentVo.__className == "Vo_Meta":
              service = Chatanoo.users;
              method = Chatanoo.users.removeMetaFromVo
              args = [this.currentVo.id, this.vo.get('id')];
              break;
            case this.currentVo.__className.indexOf("Vo_Data") != -1:
              service = Chatanoo.users;
              method = Chatanoo.users.removeDataFromVo
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id')];
              break;
          }
          break;
        case this.vo.get('__className') == "Vo_Item":
          switch(true) {
            case this.currentVo.__className == "Vo_Comment":
              service = Chatanoo.items;
              method = Chatanoo.items.removeCommentFromItem
              args = [this.currentVo.id, this.vo.get('id')];
              break;
            case this.currentVo.__className == "Vo_Query":
              service = Chatanoo.queries;
              method = Chatanoo.queries.removeItemFromQuery
              args = [this.vo.get('id'), this.currentVo.id];
              break;
            case this.currentVo.__className.indexOf("Vo_Media") != -1:
              service = Chatanoo.items;
              method = Chatanoo.items.removeMediaFromItem
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id')];
              break;
            case this.currentVo.__className == "Vo_Meta":
              service = Chatanoo.items;
              method = Chatanoo.items.removeMetaFromVo
              args = [this.currentVo.id, this.vo.get('id')];
              break;
            case this.currentVo.__className == "Vo_User":
              service = Chatanoo.items;
              method = Chatanoo.items.setItem
              this.vo.set('_user', 0);
              args = [this.vo.toJSON()];
              break;
            case this.currentVo.__className.indexOf("Vo_Data") != -1:
              service = Chatanoo.items;
              method = Chatanoo.items.removeDataFromVo
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id')];
              break;
          }
          break;
        case this.vo.get('__className') == "Vo_Query":
          switch(true) {
            case this.currentVo.__className == "Vo_Item":
              service = Chatanoo.queries;
              method = Chatanoo.queries.removeItemFromQuery
              args = [this.currentVo.id, this.vo.get('id')];
              break;
            case this.currentVo.__className.indexOf("Vo_Media") != -1:
              service = Chatanoo.queries;
              method = Chatanoo.queries.removeMediaFromQuery
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id')];
              break;
            case this.currentVo.__className == "Vo_Meta":
              service = Chatanoo.queries;
              method = Chatanoo.queries.removeMetaFromVo
              args = [this.currentVo.id, this.vo.get('id')];
              break;
            case this.currentVo.__className == "Vo_User":
              service = Chatanoo.queries;
              method = Chatanoo.queries.setQuery
              this.vo.set('_user', 0);
              args = [this.vo.toJSON()];
              break;
            case this.currentVo.__className.indexOf("Vo_Data") != -1:
              service = Chatanoo.queries;
              method = Chatanoo.queries.removeDataFromVo
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id')];
              break;
          }
          break;
        case this.vo.get('__className') == "Vo_Comment":
          switch(true) {
            case this.currentVo.__className == "Vo_Item":
              service = Chatanoo.items;
              method = Chatanoo.items.removeCommentFromItem
              args = [this.vo.get('id'), this.currentVo.id];
              break;
            case this.currentVo.__className == "Vo_User":
              service = Chatanoo.comments;
              method = Chatanoo.comments.setComment
              this.vo.set('_user', 0);
              args = [this.vo.toJSON()];
              break;
            case this.currentVo.__className.indexOf("Vo_Data") != -1:
              service = Chatanoo.comments;
              method = Chatanoo.comments.removeDataFromVo
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id')];
              break;
          }
          break;
        case this.vo.get('__className').indexOf("Vo_Media") != -1:
          switch(true) {
            case this.currentVo.__className == "Vo_Query":
              service = Chatanoo.queries;
              method = Chatanoo.queries.removeMediaFromQuery
              args = [this.vo.get('id'), this.vo.get('type'), this.currentVo.id];
              break;
            case this.currentVo.__className == "Vo_Item":
              service = Chatanoo.items;
              method = Chatanoo.items.removeMediaFromItem
              args = [this.vo.get('id'), this.vo.get('type'), this.currentVo.id];
              break;
            case this.currentVo.__className == "Vo_Meta":
              service = Chatanoo.medias;
              method = Chatanoo.medias.removeMetaFromMedia
              args = [this.currentVo.id, this.vo.get('id'), this.vo.get('type')];
              break;
            case this.currentVo.__className == "Vo_User":
              service = Chatanoo.medias;
              method = Chatanoo.medias.setQuery;
              this.vo.set('_user', 0);
              args = [this.vo.toJSON()];
              break;
            case this.currentVo.__className.indexOf("Vo_Data") != -1:
              service = Chatanoo.medias;
              method = Chatanoo.medias.removeDataFromMedia
              args = [this.currentVo.id, _.getLast( this.currentVo.__className ), this.vo.get('id'), this.vo.get('type')];
              break;
          }
          break;
      }

      if( !confirm( "Êtes-vous sûr de vouloir supprimer ce lien ?" ) )
        return false;

      var r = method.apply( service, args );
      service.on( r.success, function( results ) {
        this.load();
      }, this);

      return false;
    },

    deleteVo: function() {
      if( !confirm( "Êtes-vous sûr de vouloir supprimer cette objet ?" ) )
        return false;

      var vo;
      switch(true) {
        case this.currentVo.__className == 'Vo_User':     vo = new User(this.currentVo);     break;
        case this.currentVo.__className == 'Vo_Item':     vo = new Item(this.currentVo);     break;
        case this.currentVo.__className == 'Vo_Query':     vo = new Query(this.currentVo);   break;
        case this.currentVo.__className == 'Vo_Comment':   vo = new Comment(this.currentVo);   break;
        case this.currentVo.__className == 'Vo_Meta':     vo = new Meta(this.currentVo);     break;

        case this.currentVo.__className.indexOf('Vo_Media') != -1:
          vo = new Media(this.currentVo);
          vo.set('type', _.getLast( this.currentVo.__className ));
          break;
        case this.currentVo.__className.indexOf('Vo_Data') != -1:
          vo = new Data(this.currentVo);
          vo.set('type', _.getLast( this.currentVo.__className ));
          break;
      }

      vo.on('delete', function() {
        this.load();
      }, this);
      vo.deleteVo();

      return false;
    },

    kill: function() {
      this.$el.unbind()
      //this.model.off();
      this.$el.remove();
    }
  });

  Raphael.fn.createGraphCell = function(vo, x, y, delegate) {
    var paper = this;

    var cell = paper.set();

    var rect = paper.rect(x, y, delegate.cellSize.width, delegate.cellSize.height, 5);
    rect.isSelected = false;
    rect.select = function(trueOrFalse) {
      if(trueOrFalse) {
        this.attr( { stroke: '#0088CC' } );
      } else {
        this.attr( { stroke: '#BCBCBC' } );
      }
      this.isSelected = trueOrFalse;
    }
    rect.attr({
      fill: '#F3F3F3',
      stroke: '#BCBCBC',
      "stroke-width": 1
    });
    cell.push( rect );

    var label = "";
    switch( vo.__className ) {
      case "Vo_Query":   label = "Question";   break;
      case "Vo_Item":   label = "Contribution";  break;
      case "Vo_Comment":   label = "Commentaire";   break;
      case "Vo_User":   label = "Utilisateur";   break;
      case "Vo_Meta":   label = "Tag";       break;
    }
    if( vo.__className.indexOf('Vo_Data') != -1 )
      label = "Données";
    if( vo.__className.indexOf('Vo_Media') != -1 )
      label = "Média";

    var text = paper.text(x + delegate.cellSize.width/2, y + delegate.cellSize.height/2, label + " " + vo.id);
    text.attr({
      fill: "#0088CC",
      "font-size": 14,
      "font-family": "Arial"
    });
    cell.push( text );

    cell.mouseover( function() {
      if(!rect.isSelected) {
        rect.attr( { stroke: '#0088CC' } );
      }
    });
    cell.mouseout( function() {
      if(!rect.isSelected) {
        rect.attr( { stroke: '#BCBCBC' } );
      }
    });
    cell.click( function() {
      delegate.renderVo( vo );
      _( delegate.graphLinks ).each( function(r) {
        r.select(false);
      })
      rect.select(true);
    });

    return rect;
  }

  return LinksPopinView;
});
