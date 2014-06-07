/** section: Menu
 * class MenuCalendar < SimpleMenu
 *
 * Cette classe permet d'ajouter un menu avec calendrier dans une instance de type [[SimpleMenu]].
 **/
/*var MenuCalendar = function(obj){
	var node = new SimpleMenu(obj);
	Object.extend(node, this);
	node.initialize(obj);
	return node;	
};*/

var MenuCalendar = Class.from(SimpleMenu);

MenuCalendar.prototype = {
	__class__:		'menucalendar',
	className:		'wobject simple-menu menu-calendar',
/**
 * MenuCalendar#Calendar -> Calendar
 **/
	Calendar: 		null,
/**
 * MenuCalendar#format -> String
 * Format d'affichage de la date dans le menu.
 **/
	format:			'',
/**
 * new MenuCalendar()
 *
 * Cette méthode créée une nouvelle instance de [[MenuCalendar]].
 **/
	initialize: function(options){
		
		this.format = MUI.lang == 'fr' ? 'd/m/Y' : 'Y-m-d';
		
		if(!Object.isUndefined(options)){
			Object.extend(this, options);	
		}
		//
		// Calendar
		//
		this.Calendar = 		new Calendar();
		this.Calendar.Observer.bind(this);
		//
		// SimpleButton
		//
		if(Object.isUndefined(this.icon)){
			this.SimpleButton.setIcon('date');
		}
		
		this.SimpleButton.setText((new Date()).format(this.format));
		
		this.menu.appendChild(this.Calendar);		
		this.removeClassName('empty');
		
		this.getPopup().show();
				
		this.Calendar.observe('change', function(evt, date){
			this.SimpleButton.setText(date.format(this.format));
			this.Hidden(true);
		}.bind(this));
					
		this.observe('mouseup', function(evt){
			Event.stop(evt);
		});
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
	},
/**
 * MenuCalendar#observe(eventName, callback) -> MenuCalendar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` sur le nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * Le champ d'auto-complétion prend en charge un certain nombre d'événement personnalisé, comme suivant :
 *
 * * `change` : Appelle la fonction lorsque l'utilisateur change de date.
 * * `draw` : Appelle la fonction lorsque le calendrier appel la méthode [[Calendar.draw]].
 * * `next` : Appelle la fonction lorsque le bouton suivant (Mois) est cliqué. 
 * * `nexttwo` : Appelle la fonction lorsque le bouton suivant (Année) est cliqué. 
 * * `prev` : Appelle la fonction lorsque le bouton précédent (Mois) est cliqué. 
 * * `prevtwo` : Appelle la fonction lorsque le bouton précédent (Année) est cliqué.
 * * `uphours` : Appelle la fonction lorsque le bouton des heures (Heure + 1) est cliqué. 
 * * `downhours` : Appelle la fonction lorsque le bouton des heures (Heure - 1) est cliqué. 
 * * `upmin` : Appelle la fonction lorsque le bouton des minutes (Minute + 1) est cliqué. 
 * * `downmin` : Appelle la fonction lorsque le bouton des minutes (Minute - 1) est cliqué. 
 *
 **/
	observe:function(eventName, handler){
		this.Calendar.observe(eventName, handler);
		return this;
	},
/**
 * MenuCalendar#stopObserving(eventName, callback) -> MenuCalendar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/
	stopObserving:function(eventName, handler){
		this.Calendar.stopObserving(eventName, handler);
		return this;
	},
/**
 * MenuCalendar#getDate() -> Date
 *
 * Cette méthode retourne la date de l'instance.
 **/
	getDate: function(){
		return this.Calendar.getDate();
	},
/**
 * MenuCalendar#setDate(date) -> MenuCalendar
 * - date (Date): Nouvelle date.
 *
 * Cette méthode assigne une nouvelle date à l'instance du calendrier.
 **/
	setDate: function(date){
		this.Calendar.setDate(date);
		this.SimpleButton.setText(this.Calendar.getDate().format(this.format));
		return this;
	},
/**
 * MenuCalendar#setFormat(frm) -> MenuCalendar
 * - frm (String): Format de la date.
 * 
 * Cette méthode assigne un format d'affichage pour la date. 
 *
 * Pour la syntaxe du format repportez vous à la méthode [[Date#format]].
 **/
	setFormat:function(frm){
		this.format = frm;
		this.SimpleButton.setText(this.Calendar.getDate().format(frm));
		return this;
	},
/**
 * MenuCalendar#setIcon(icon) -> MenuCalendar
 * - icon (String): Nom de classe CSS de l'icône.
 *
 * Cette méthode change l'icône affiché par le menu.
 **/
	setIcon: function(icon){
		this.SimpleButton.setIcon(icon);
		return this;	
	}
};
