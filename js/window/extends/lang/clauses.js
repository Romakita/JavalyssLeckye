/** section: lang
 * class Clauses
 * Cette classe gère permet d'envoyer des informations sur l'ordre de tri, pagination et clause Where d'une requête SQL.
 **/
var Clauses = Class.create();
Clauses.prototype = {
/**
 * Clauses.pagination -> Number
 * Nombre de ligne par page.
 **/
	pagination: 5,
/**
 * Clauses.page -> Number
 * Nombre de ligne par page.
 **/
	page: 		0,
/**
 * Clauses.where -> String
 * Mot à rechercher dans la clause Where. Pour la recherche rapide.
 **/
	where:		'',
/**
 * Clauses.query -> String
 * Chaine de caractère SQL ajoutée à la suite de la clause WHERE. Implémenté pour la recherche avancée.
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	query:		'',
/**
 * Clauses.order -> String
 * Ordre de tri de la table.
 **/
	order: '',
/** 
 * new Clauses(options)
 * - options (Object): Objet de configuration de clauses
 * 
 * Cette méthode créée une nouvelle instance de Clauses.
 *
 * #### Paramètre options
 *
 * Le construteur prend en paramètre `options` et permet de configurer rapide l'objet Clauses. Les paramètres
 * prient en charge sont :
 *
 * * `pagination`
 * * `page`
 * * `order`
 * * `where`
 * * `query`
 * 
 **/
	initialize: function(options){
		Object.extend(this, options);
	},
/**
 * Clauses.clear() -> void
 *
 * Réinitialise les paramètres de la classe
 **/
	clear: function(){
		this.pagination = 	5;
		this.page = 		0;
		this.where = 		'';
		this.order = 		'';
	},
/**
 * Clauses.clone() -> Clauses
 *
 * Crée une copie de l'instance.
 **/
	clone: function(){
		return new Clauses(this);
	},
/**
 * Clauses.toJSON() -> String
 * 
 * Cette méthode retourne l'instance sérialisé au format JSON.
 **/
	toJSON: function(){
				
		var object = {
			where: 	encodeURI(this.where),
			order: 	this.order,
			limits: this.page * this.pagination + ',' + this.pagination,
			query:	encodeURI(this.query)
		};
		
		return escape(Object.toJSON(object));
	}	
};