define([], function() {
	return {
		chatanoo: {
			//url: 'http://preprod.ws.dring93.org/services',
			url: 'http://chatanoo-ws.dev/services',
			api_key: 'D93_qJlCaSsBbYBYypwF9TT8KmCOxhuZ',
			anonymous_user: {
				login: "anonymous",
				pass: "anonymous"
			},
			iframe: "http://chatanoo-mobile.dev/index-ios.html",
			datas: {
				Adress: {
					title: "Adresse",
					addLabel: "Ajouter une adresse",
					structure: [
						{ name: "id", 		label: "id", 			type: "static" },
						{ name: "adress", 	label: "Adresse", 		type: "text" },
						{ name: "zipCode", 	label: "Code Postal", 	type: "text" },
						{ name: "city", 	label: "Ville", 		type: "text" },
						{ name: "country", 	label: "Pays", 			type: "text" },
						{ name: "addDate", 	label: "Date d'ajout", 	type: "date" },
						{ name: "setDate", 	label: "Date de modif", type: "date" }
					]
				},
				Carto: {
					title: "Cartographique",
					addLabel: "Ajouter une donnée cartographique",
					structure: [
						{ name: "id", 		label: "id", 			type: "static" },
						{ name: "x", 		label: "x", 			type: "text" },
						{ name: "y", 		label: "y", 			type: "text" },
						{ name: "addDate", 	label: "Date d'ajout", 	type: "date" },
						{ name: "setDate", 	label: "Date de modif", type: "date" }
					]
				},
				Vote: {
					title: "Vote",
					addLabel: "Ajouter un vote",
					structure: [
						{ name: "id", 		label: "id", 			type: "static" },
						{ name: "rate", 	label: "Valeur", 		type: "text" },
						{ name: "user", 	label: "Auteur", 		type: "text" },
						{ name: "addDate", 	label: "Date d'ajout", 	type: "date" },
						{ name: "setDate", 	label: "Date de modif", type: "date" }
					]
				}
			}
		},
		notify: {
			url: 'http://localhost:3001'
		},
		mediasCenter: {
			url: "http://ms.dring93.org/",
			uploadURL: "http://ms.dring93.org/upload"
		},
		dateFormat: "DD/MM/YYYY"
	}
});