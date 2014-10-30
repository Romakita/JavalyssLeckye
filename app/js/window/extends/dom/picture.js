/** section: DOM
 * class Picture
 **/
var Picture = Class.createSprite('img');

Picture.prototype = {
	__class__:'picture',
/**
 * new Picture()
 *
 * Créée une nouvelle instance de [[Picture]].
 **/
	initialize: function(obj){	
		this.timer =	new Timer(this.onTick_Timer.bind(this), 0);
		if(!Object.isUndefined(obj)){
			Object.extend(this, obj);
			
			if(!Object.isUndefined(obj.src)){
				this.timer.start();
			}
		}
		
		this.onload = function(){
			if(this.complete){
				this.fire('picture:complete');
				return;
			}
		}.bind(this);
	},
/**
 * Picture.observe(eventName, callback) -> Picture
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Est déclenché lorsque l'image est complémentement chargé.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){

		switch(eventName){
			case 'complete':
				Element.observe(this, 'picture:complete', callback);
				break;
			default:	
				Element.observe(this, eventName, handler);
				break;
		}
		return this;
	},
/**
 * Picture.stopObserving(eventName, callback) -> Picture
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback` associé un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Est déclenché lorsque l'image est complémentement chargé.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving:function(eventName, handler){
		eventName = eventName.toLowerCase();

		switch(eventName){
			case 'complete':
				Element.stopObserving(this, 'picture:complete', handler);
				break;
			default: Element.stopObserving(this, eventName, handler);
		}

		return this;
	},

	onTick_Timer: function(timer){
		this.timer.stop();
		
		if(this.complete){
			this.fire('picture:complete');
			return;
		}
		
		this.timer.start();
	},
/**
 * Picture.Src(link) -> String
 * Picture.Src() -> String
 * - link (String): Lien de l'image à charger.
 *
 * Cette méthode assigne le lien de l'image à charger et retourne le nom du lien.
 **/
	Src: function(link){
		if(!Object.isUndefined(link)){
			//this.timer.start();
			this.src = link;	
		}
		
		return this.src
	},
/**
 * Picture.setSrc(link) -> void
 * - link (String): Lien de l'image à charger.
 *
 * Cette méthode assigne le lien de l'image à charger.
 **/	
	setSrc: function(link){
		this.Src(link);
		return this;
	},

	setUrl: function(link){
		//this.timer.start();
		this.src = link;
		return this;
	},
	
	getUrl: function(){
		return this.src;
	}				
};

