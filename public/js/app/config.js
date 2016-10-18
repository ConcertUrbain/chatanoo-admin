define([
  'jquery',
  'json!env.json'
], function($, env) {

  return {
    load: function(callback) {
      var _this = this;
      $.getJSON(env.API_KEYS, function(data) {
        _this.chatanoo.sessions = data.api_key;
        callback(null);
      })
    },
    chatanoo: {
      url: env.WS_URL,
      sessions: [],

      anonymous_user: {
        login: "anonymous",
        pass: "anonymous"
      },
      iframe: env.MOBILE_URL,
      users: {
        role: {
          admin:     'Administrateur',
          modo:     'Modérateur',
          user:     'Utilisateur',
          anonymous:   'Anonyme'
        }
      },
      links: {
        Query: {
          parents: ['User'],
          children: ['Meta', 'Data', 'Item', 'Media'],
          canDelete: false
        },
        Item: {
          parents: ['Query', 'User'],
          children: ['Meta', 'Data', 'Comment', 'Media'],
          canDelete: true
        },
        Comment: {
          parents: ['Item', 'User'],
          children: ['Data'],
          canDelete: true
        },
        Media: {
          parents: ['Item', 'User'/*, 'Query'*/],
          children: ['Meta', 'Data'],
          canDelete: true
        },
        Data: {
          parents: ['Item', 'User', 'Query', 'Media', 'Comment'],
          children: [],
          canDelete: true
        },
        Meta: {
          parents: ['Item', 'Query', 'Media'],
          children: [],
          canDelete: false
        },
        User: {
          parents: [],
          children: ['Item', 'Query', 'Media', 'Comment', 'Data', 'Meta'],
          canDelete: false
        }
      },
      datas: {
        Adress: {
          title: "Adresse",
          addLabel: "Ajouter une adresse",
          structure: [
            { name: "id",     label: "id",       type: "static" },
            { name: "adress",   label: "Adresse",     type: "text" },
            { name: "zipCode",   label: "Code Postal",   type: "text" },
            { name: "city",   label: "Ville",     type: "text" },
            { name: "country",   label: "Pays",       type: "text" },
            { name: "addDate",   label: "Date d'ajout",   type: "date" },
            { name: "setDate",   label: "Date de modif", type: "date" }
          ]
        },
        Carto: {
          title: "Cartographique",
          addLabel: "Ajouter une donnée cartographique",
          structure: [
            { name: "id",     label: "id",       type: "static" },
            { name: "x",     label: "x",       type: "text" },
            { name: "y",     label: "y",       type: "text" },
            { name: "addDate",   label: "Date d'ajout",   type: "date" },
            { name: "setDate",   label: "Date de modif", type: "date" }
          ]
        },
        Vote: {
          title: "Vote",
          addLabel: "Ajouter un vote",
          structure: [
            { name: "id",     label: "id",       type: "static" },
            { name: "rate",   label: "Valeur",     type: "text" },
            { name: "user",   label: "Auteur",     type: "text" },
            { name: "addDate",   label: "Date d'ajout",   type: "date" },
            { name: "setDate",   label: "Date de modif", type: "date" }
          ]
        }
      }
    },
    mediasCenter: {
      url: env.MEDIAS_CENTER.url,
      inputBucket: env.MEDIAS_CENTER.input_bucket,
      identityPoolId: env.MEDIAS_CENTER.identity_pool,
      region: env.MEDIAS_CENTER.region,
    },
    dateFormat: "DD/MM/YYYY"
  }
});
