/** section: Form
 * class Ticket < Element
 *
 * Cette classe créée une étiquette.
 *
 * <p class="note">Cette classe est définie dans le fichier window.ticket.js</p>
 **/
var Ticket = Class.createSprite('div');
Ticket.prototype = {
	/** @ignore */
	__class__: 'Ticket',
	/** @ignore */
	className: 'wobject ticket',
	
	value:	'',
	icon:	'',
/*
 * new Ticket([options])
 * - options (Object): Objet de configuration.
 *
 * Créer un nouvelle instance Ticket.
 *
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `value` (`?`): Informations attachés au ticket.
 * * `text` (`String`): Valeur à affecter au champs.
 * * `icon` (`String`): Icône à afficher pour le bouton.
 *
 **/
	initialize: function(obj){
		
		var options = {
			value:		'',
			text:		'',
			icon:		'',
			draggable:	true
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
				
		this.setText(options.text);
		this.Value(options.value);
		this.setIcon(options.icon);
		
		if(options.draggable){
			this.createDrag(options);
		}
	},
/*
 * Ticket.Value([value]) -> String
 * - value (String): Valeur à assigner.
 * 
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Ticket();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Ticket();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		if(!Object.isUndefined(value)){
			this.value = value;
		}
		
		return this.value;
	},
/*
 * Ticket.Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new Ticket();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new Ticket();
 *     c.Text('mon text');
 *     alert(c.Text()); //mon text
 * 
 **/
	setText: function(text){
		if(!Object.isUndefined(text)){
			this.innerHTML = text;	
		}
		return this;
	},
	
	getText: function(){
		return this.innerHTML;
	},
	
	Text: function(text){
		if(!Object.isUndefined(text)){
			this.innerHTML = text;	
		}
		return this.innerHTML;
	},
/*
 * Ticket.setIcon(icon) -> Ticket
 * 
 * Cette méthode assigne une icone à l'instance.
 **/	
	setIcon: function(icon){
		this.removeClassName('icon-' + this.icon);
		
		if(icon != '') {
			this.icon = icon;
			this.addClassName('icon-' + icon);
		}
		return this;
	}
};