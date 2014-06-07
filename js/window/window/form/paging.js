/** section: Form
 * class Paging
 * Cette classe gère l'affichage des paginations de listes ou tableaux de données.
 *
 * <p class="note">version 0.1 - Window 2.1RTM</p>
 * <p class="note">Cette classe est définie dans le fichier window.simpletable.js</p>
 **/
var Paging = Class.createSprite('span');
Paging.prototype = {
	
	__class__:	'paging',
	className:	'wobject paging',
/**
 * Paging.Input -> Element
 * Instance du champ de saisi.
 **/
 	Input: null,
/*
 * Paging.page_ -> Number
 * Numéro de page.
 **/		
	page:	0,
/*
 * Paging.maxLength -> Number
 * Nombre de page totale.
 **/
	maxLength:	0,
/**
 * new Paging()
 *
 * 
 **/	
	initialize: function(){
		this.body =	new Node('div');
		//
		// Input
		//
		this.Input = new Node('input',{type:'text', className:'paging-input'});
		this.Label = new Node('label');
		
		this.body.appendChild(new Node('label', $MUI('Page') + ' : '));
		this.body.appendChild(new Node('span', {className:'span-input field-input'}, this.Input));
		this.body.appendChild(this.Label);
		this.appendChild(this.body);
		//
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		this.Input.on('focus', function(){
			this.value = '';
		});
		
		this.Input.keyupenter(this.onChange.bind(this));
		
		this.Input.on('blur', function(){
			if(this.Input.value == '') this.Input.value = 1 + this.Page();
			else{//vérification du contenu
				if(isNaN(1 * this.Input.value)) this.Page(this.Page());
			}
		}.bind(this));
		
	},
/*
 * Paging.onChange() -> void
 **/
	onChange:function(){
		
		if(this.Input.value == '') this.Page(this.Page());
		else{//vérification du contenu
			
			if(isNaN(1 * this.Input.value)) this.Page(this.Page());
			else {
				this.page = Math.round(this.Input.value-1) % this.Range();
				this.Observer.fire('change', this);
			}
		}
		
	},
/**
 * Paging.observe(eventName, callback) -> Paging
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Intervient lors du changement de contenu de l'élément cible.
 * * `focus` : Intervient lorsque le contrôle est ciblé.
 * * `blur` : Intervient lorsque le contrôle perd le focus.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			case 'change':
				this.Observer.observe(eventName, callback);
				break;
			case 'focus':
			case 'blur':
				this.Input.on(eventName, callback);
				break;
			default:
				Event.observe(this, eventName, callback);
				break;
		}
	},
/**
 * Paging.stopObserving(eventName, callback) -> Paging
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback` associé à l'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Intervient lors du changement de contenu de l'élément cible.
 * * `focus` : Intervient lorsque le contrôle est ciblé.
 * * `blur` : Intervient lorsque le contrôle perd le focus.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'change':
				this.Observer.stopObserving(eventName, callback);
				break;
			case 'focus':
			case 'blur':
				this.Input.stopObserving(eventName, callback);
				break;
			default:
				Event.stopObserving(this, eventName, callback);
				break;
		}
	},
/**
 * Paging.setMaxLength(maxLength) -> Number
 **/
 	setMaxLength:function(maxLength){
		if(!Object.isUndefined(maxLength)){
			this.Label.innerHTML = '/' + (this.maxLength = maxLength);	
		}
		return this.maxLength;
	},
	
	Range:function(maxLength){
		if(!Object.isUndefined(maxLength)){
			this.Label.innerHTML = '/' + (this.maxLength = maxLength);	
		}
		return this.maxLength;
	},
/**
 * Paging.setPageNumber(maxLength) -> Paging
 **/
 	setPageNumber: function(page){
		
		if(Object.isNumber(1 * page)){
			this.Input.value = (this.page = Math.round(page) % this.Range()) + 1;
		}
		
		return this;
	},
	
 	Page: function(page){
		if(!Object.isUndefined(page)){
			this.setPageNumber(page);
		}
		
		return this.page;
	}
};