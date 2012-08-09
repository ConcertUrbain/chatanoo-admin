define([
	'Backbone',
	'Underscore',
	'Chatanoo',
	'Config'
], function( Backbone, _, $,
	Config ) {
	
	var AbstractCollection = Backbone.Collection.extend({
		isValidKey: "_isValid",
		reverse: false,
		badgeName: null,
		
		filters: [],
		
		load: function() {},
		
		getVoById: function(id) {
			var objects = this.toArray();
			var len = objects.length;
			for(var i = 0; i < len; i++) {
				var vo = objects[i];
				if( vo.get('id') == id )
					return vo;
			}
		},
		
		_filters: function(vos) {
			var mThis = this;
			var result = vos;
			_(this.filters).each( function(facet) {
				var prop = mThis._facetToArray( facet );
				if ( prop[1] != 'text' ) {
					result = _(result).filter( function(vo) {
						var value = mThis._normalizeValue( vo.get(prop[1]) );
						if( !_.isNull( value ) && !_.isUndefined( value ) && typeof value === "string" && value != "" )
							return value.toLowerCase().indexOf(facet[prop[0]].toLowerCase()) != -1;
						return false;
					});
				} else {
					result = _(result).filter( function(vo) {
						var i = vo.toJSON();
						for( var p in i ) {
							var value = mThis._normalizeValue( vo.get(p) );
							if( !_.isNull( value ) && !_.isUndefined( value ) && typeof value === "string" && value != "" ) {
								if( value.toLowerCase().indexOf(facet[prop[0]].toLowerCase()) != -1 )
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
					case 'Name': 			return [key,'name'];
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
					default: 				return [key,key];
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
			if( _.isNull( this.isValidKey ) )
				return;
			
			var mThis = this;
			this._valid = _(this.toArray()).filter( function(vo) {
				var value = vo.get( mThis.isValidKey );
				return _.isBoolean( value ) ? value : parseInt( vo.get( mThis.isValidKey ) );
			});
			this._unvalid = _(this.toArray()).filter( function(vo) {
				var value = vo.get( mThis.isValidKey );
				return _.isBoolean( value ) ? !value : !parseInt( vo.get( mThis.isValidKey ) );
			});
			
			require(['app/views/app_view'], function(app_view) {
				if( !_.isNull( mThis.badgeName ) )
					app_view.setMenuBadge( mThis.badgeName, mThis.reverse ? mThis._valid.length : mThis._unvalid.length );
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
		},
		
		validateVo: function( vo ) {
			this._unvalid = _(this._unvalid).without( vo );
			
			if( !_( this._valid ).contains( vo ) )
				this._valid.push(vo);
				
			var mThis = this;
			require(['app/views/app_view'], function(app_view) {
				if( !_.isNull( mThis.badgeName ) )
					app_view.setMenuBadge( mThis.badgeName, mThis.reverse ? mThis._valid.length : mThis._unvalid.length );
			});
		},
		
		unvalidateVo: function( vo ) {
			this._valid = _(this._valid).without( vo );
			
			if( !_( this._unvalid ).contains( vo ) )
				this._unvalid.push(vo);
				
			var mThis = this;
			require(['app/views/app_view'], function(app_view) {
				if( !_.isNull( mThis.badgeName ) )
					app_view.setMenuBadge( mThis.badgeName, mThis.reverse ? mThis._valid.length : mThis._unvalid.length );
			});
		}
	});
	
	return AbstractCollection;
});