/** section: Form
 * class TextArea < Element
 *
 * Cette classe créée une zone de saisie de texte.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance TextArea en Javascript :</p>
 * 
 *     var area = TextArea({value:'hello world', name:'Nom', maxLength:2000});
 *     document.body.appendChild(area);
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance TextArea en HTML 5 :</p>
 *
 *     <textarea class="box-textarea" type="text" data-maxlength="2000">hello world</textarea>
 *
 * </div>
 * </div>
 *
 **/
var TextArea = Class.createSprite('textarea');
TextArea.prototype = {
	__class__: 'textarea',
	className: 'wobject textarea',
/**
 * TextArea#name -> String
 * Nom du champs de saisie.
 **/

/**
 * TextArea#value -> String
 * Valeur du champs de saisie.
 **/

/**
 * TextArea#maxLength -> Number
 * Nombre de caractère saisissable dans le champs.
 **/

/**
 * new TextArea([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance [[TextArea]].
 *
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `maxLength` (`Number`): Nombre maximal de caractère saisissable.
 * * `name` (`String`): Nom du champs.
 * * `value` (`Mixed`): Valeur à affecter au champs.
 * 
 **/
	initialize: function(obj){
				
		var options = {
			maxLength: 	null,
			name:		'',
			value:		''
		};
		
		Object.extend(options, obj || {});
		
		if(options.maxLength){
			this.MaxLength(options.maxLength);
		}
		
		if(options.readOnly){
			this.ReadOnly(options.readOnly);
		}
		
		if(options.value != ''){
			this.Value(options.value);
		}
		//
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		Event.observe(this, 'keypress', this.onKeyPress.bind(this));
		
		this.catchWheelEvent();
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
	},
/**
 * Input#observe(eventName, callback) -> Input
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Est déclenché lorsque la valeur du champ change.
 * * `blur` : Est déclenché lorsque le champ perd le focus.
 * * `focus` : Est déclenché lorsque le champ obtient le focus.
 * * `keyup` : Est déclenché lorsque la touche du clavier est relachée.
 * * `error` : Est déclenché lorsque la saisie de l'utilisateur comporte une erreur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			default:
				Event.observe(this, eventName, callback);break;
			case 'keypress':
				this.Observer.observe(eventName, callback);
				break;
		}
		return this;
	},
/**
 * Input#stopObserving(eventName, callback) -> Input
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Est déclenché lorsque la valeur du champ change.
 * * `blur` : Est déclenché lorsque le champ perd le focus.
 * * `focus` : Est déclenché lorsque le champ obtient le focus.
 * * `keyup` : Est déclenché lorsque la touche du clavier est relachée.
 * * `error` : Est déclenché lorsque la saisie de l'utilisateur comporte une erreur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/	
	stopObserving: function(eventName, callback){
		switch(eventName){
			default:
				Event.stopObserving(this, eventName, callback);
				break;
			case 'keypress':
				this.Observer.stopObserving(eventName, callback);
				break;
		}
		return this;
	},
/**
 * TextArea#MaxLength([maxchar]) -> Number
 * - maxchar (Number): Nombre de caractère maximal.
 * 
 * Assigne ou/et retourne le nombre maximal de caractère saisissable.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Input();
 *     c.MaxLength(5);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Input();
 *     c.MaxLength(5);
 *     alert(c.MaxLength()); //5
 *
 **/
	MaxLength:function(nb){
		
		if(!Object.isUndefined(nb)) {
			this.maxLength = nb;
		}
	
		return this.maxLength;
	},
/**
 * Input#ReadOnly([bool]) -> Number
 * - bool (Number): Active ou désactive la saisie dans le champ.
 * 
 * Cette méthode permet d'activer ou de désactiver la saisie dans un champ texte [[Input]].
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new TextArea();
 *     c.ReadOnly(true);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new TextArea();
 *     c.ReadOnly(5);
 *     alert(c.ReadOnly()); //true
 *
 **/
	ReadOnly:function(bool){
		
		if(!Object.isUndefined(bool)) {
			this.readOnly = bool;
		}
	
		return this.readOnly;
	},
	
	onKeyPress:function(evt){
		if(!Object.isUndefined(this.maxLength) && this.maxLength >= 0){
		
			if(this.maxLength < this.Value().length){
				evt.stop();
				this.Value(this.Value().slice(0, this.maxLength));	
			}
		}
		
		this.Observer.fire('keypress', evt);
	},
/**
 * Input#Value([value]) -> String
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
 *     var c = new Input();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Input();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		if(!Object.isUndefined(value)){
			
			this.innerHTML = 	value;
		}
		
		return this.value;
	},
	
	toMagic: function(bool){
		this.removeClassName('magic');
		
		if(bool){
			this.addClassName('magic');	
		}
		
		return this;
	}
};
/**
 * Input.Transform(node) -> Input
 * Input.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Select.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises select répondant au critère `selector` en instance [[Input]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance TextArea en Javascript :</p>
 * 
 *     var area = TextArea({value:'hello world', name:'Nom', maxLength:2000});
 *     document.body.appendChild(area);
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance TextArea en HTML 5 :</p>
 *
 *     <textarea class="box-textarea" type="text" data-maxlength="2000">hello world</textarea>
 *
 * </div>
 * </div>
 * 
 **/
TextArea.Transform = function(e){
	
	if(Object.isElement(e)){
		//Extension des méthodes
		var className = e.className;
		
		Object.extend(e, Input.prototype);
		e.addClassName(className);
		
		var options = {
			maxLength:	e.data('maxlength') ? e.data('maxlength') : null
		};
				
		e.initialize(options);
		e.removeClassName('box-textarea');
		return e;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(TextArea.Transform(e));
	});
	
	
	return options;
};