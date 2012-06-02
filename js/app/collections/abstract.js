define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	'Config'
], function( Backbone, _, $,
	Config ) {
	
	var AbstractCollection = Backbone.Collection.extend({
		isValidKey: "_isValid",
		
		filters: [],
		
		load: function() {},
		
		_filters: function(vos) {
			var mThis = this;
			var result = vos;
			_(this.filters).each( function(facet) {
				var prop = mThis._facetToArray( facet );
				if ( prop[1] != 'text' ) {
					result = _(result).filter( function(vo) {
						var value = mThis._normalizeValue( vo.get(prop[1]) );
						if( !_.isNull( value ) && !_.isUndefined( value ) && value != "" )
							return value.indexOf(facet[prop[0]]) != -1;
						return false;
					});
				} else {
					result = _(result).filter( function(vo) {
						var i = vo.toJSON();
						for( var p in i ) {
							var value = mThis._normalizeValue( vo.get(p) );
							if( !_.isNull( value ) && !_.isUndefined( value ) && value != "" ) {
								if( value.indexOf(facet[prop[0]]) != -1 )
									return true;
							}
						}
						return false;
					});
				}	
			});
			return result;
		},
		
		_facetToArray: function( facet ) {
			for( var key in facet ) {
				switch(key) {
					case 'id': 				return [key,'id'];
					case 'Titre': 			return [key,'title'];
					case 'Contenu': 		return [key,'content'];
					case 'Url': 			return [key,'url'];
					case 'Type': 			return [key,'type'];
					case 'Description': 	return [key,'description'];
					case 'Date d\'ajout': 	return [key,'addDate']
					case 'Date de modif': 	return [key,'setDate'];
					case 'Nom': 			return [key,'firstName'];
					case 'Prénom': 			return [key,'lastName'];
					case 'Pseudo': 			return [key,'pseudo'];
					case 'Email': 			return [key,'email'];
					case 'Rôle': 			return [key,'role'];
					case 'text': 			return [key,'text'];
				}
			};
			return null;
		},
		
		_normalizeValue: function( value ) {
			switch( true ) {
				case moment.isMoment(value): return value.format( Config.dateFormat );
				case _.isFunction(value): return null;
			}
			return value;
		},
		
		calculate: function() {
			var mThis = this;
			this._valid = _(this.toArray()).filter( function(vo) {
				var value = vo.get( mThis.isValidKey );
				return _.isBoolean( value ) ? value : parseInt( vo.get( mThis.isValidKey ) );
			});
			this._unvalid = _(this.toArray()).filter( function(vo) {
				var value = vo.get( mThis.isValidKey );
				return _.isBoolean( value ) ? !value : !parseInt( vo.get( mThis.isValidKey ) );
			});
		},
		
		all: function() {
			return this._filters( this.toArray() );
		},
		
		_valid: [],
		valid: function() {
			return this._filters( this._valid );
		},
		
		_unvalid: [],
		unvalid: function() {
			return this._filters( this._unvalid );
		}
	});
	
	return AbstractCollection;
});