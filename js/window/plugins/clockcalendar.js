/** section: UI
 * class ClockCalendar < Element
 *
 * Cette classe permet de créer une horloge avec un Calendrier qui apparait lorsque l'on clique dessus.
 *
 **/
var ClockCalendar = Class.createSprite('span');

ClockCalendar.prototype = {
	__class__:		'clockcalendar',
	className:		'wobject gradient clock-calendar',
	/** @ignore */
	Timer:			null,
/**
 * ClockCalendar#formatHours -> String
 * Format d'affichage de l'heure.
 **/
	formatHours:	'h:i:s',
	hidden_:		true,
/**
 * new ClockCalendar()
 *
 * Cette méthode Cette méthode créée une nouvelle instance de [[ClockCalendar]].
 **/
	initialize: function(){
		
		//
		// Calendar
		//
		this.Calendar = 		new Calendar();
		//
		// Hours
		//
		this.AreaHours =		new Node('span', {className:'font wrap-hours'}, this.Calendar.DATE_NOW.format(this.formatHours));
		//
		// Date
		//
		this.AreaDate =			new Node('span', {className:'font wrap-date'}, this.Calendar.DATE_NOW.toString_('date',MUI.lang));
		//
		// Popup
		//
		//
		// Popup
		//
		this.Popup =			new Popup();
		this.Popup.hide();
		
		this.Popup.appendChild(this.Calendar);
		//
		// Timer
		//
		this.Timer =			new Timer(this.onTick.bind(this), 1);
		
		this.Calendar.Observer.bind(this);
			
		this.appendChilds([
			this.AreaDate,
			this.AreaHours,
			this.Popup
		]);
		
		this.Calendar.observe('mouseover', 	function(evt){
			this.noHide = true;
		}.bind(this));
		
		this.Calendar.observe('mouseout', 	function(evt){ 
			this.noHide = false;
		}.bind(this));
		
		Event.observe(this, 'click', this.show.bind(this));
		//event lié au bouton
		this.Timer.start();
	},
/**
 * ClockCalendar#Hidden(bool) -> Boolean
 * - bool (Boolean): Cache ou affiche le calendrier.
 *
 * Cette méthode cache ou affiche le calendrier en fonction du paramètre `bool`.
 * Elle retourne enfin l'etat du calendrier.
 *
 * Si `bool` est vrai le calendrier sera caché.
 **/
	Hidden:function(bool){
		
		if(Object.isUndefined(bool)){
			return this.hidden_;	
		}
		
		if(bool){
			this.Popup.hide();
			this.hidden_ = true;
			
			if(Object.isFunction(this.onclick_bind)){
				document.stopObserving('mouseup', this.onclick_bind);
				this.onclick_bind = '';
			}
			
		}else{
						
			this.Popup.show();
			this.hidden_ = false;
			this.Popup.moveTo(this);
			
			this.onclick_bind = this.hide.bind(this);
			document.observe('mouseup', this.onclick_bind);
			
		}
		
		return this.hidden_;
	},

/**
 * ClockCalendar#hide() -> ClockCalendar
 *
 * Cette méthode cache le panneau du calendrier.
 **/
	hide:function(){
		if(this.noHide) return;
		
		this.Hidden(true);
		
		return this;
	},
/**
 * ClockCalendar#observe(eventName, callback) -> ClockCalendar
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
 * ClockCalendar#show() -> ClockCalendar
 *
 * Cette méthode force l'apparition du panneau du calendrier.
 **/
	show: function(){
		this.Hidden(false);
		
		return this;
	},
/**
 * ClockCalendar#stopObserving(eventName, callback) -> ClockCalendar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/
	stopObserving:function(eventName, handler){
		this.Calendar.stopObserving(eventName, handler);
		return this;
	},
/*
 * ClockCalendar#onTick() -> void
 *
 * Cette événement est déclenché toutes les secondes afin de mettre à jour l'heure.
 **/
	onTick: function(){
		this.Calendar.DATE_NOW.setSeconds(this.Calendar.DATE_NOW.getSeconds() + 1);
		this.AreaHours.innerHTML = 	this.Calendar.DATE_NOW.format(this.formatHours);
		this.AreaDate.innerHTML = 	this.Calendar.DATE_NOW.toStringDate(MUI.lang);
	}
};