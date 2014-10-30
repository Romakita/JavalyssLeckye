/** section: lang
 * class Observer
 * La classe `Observer` est un gestionnaire d'événement personnalisé. Il vous permet de créer vos propres événements et ce
 * indépendement du gestionnaire d'événement du navigateur.
 *
 * #### Depuis la version 1.1
 *
 * * La classe Observer intègre un observeur d'événement par motif ou pattern, ce qui permet d'observer un groupe d'événement pour une seule fonction. 
 * * La méthode fire peut être stoppé à l'aide de l'objet [[StopEvent]].
 *
 **/
var Observer = $.Observer = $.Class.create();

Observer.prototype = {
/**
 * Observer.listerner -> Object Array
 * Liste des noms d'événements enregistrés dans le gestionnaire. 
 **/
	listener: null,
/**
 * Observer.patterns -> Object Array
 * Liste des patterns d'événements enregistrés dans le gestionnaire. 
 **/
	patterns: null,
/**
 * Observer.binding -> Mixed
 * Instance de l'objet utilisant lui même l'instance du gestionnaire courrant. (voir [[Observer.bind]]).
 **/
	binding: null,
/**
 * new Observer([instance])
 * - instance (?): Contexte à appliquer à l'instance [[Observer]].
 * 
 * Cette méthode créée une nouvelle instance du gestionnaire d'événement.
 **/
	initialize: function(instance){
		this.listener = {};
		this.patterns = {};
		
		if(!Object.isUndefined(instance)){
			this.bind(instance);
		}
	},
	
	destroy: function(){
		this.listener = null;
		this.patterns = null;
		this.binding = 	null;
	},
/**
 * Observer.bind(instance) -> Observer
 * - instance (?): Contexte à appliquer à l'instance [[Observer]]. 
 * 
 * Cette méthode ajoute une instance comme référence lors de l'utilisation de [[Observer.fire]]. (cf. `methode.apply(instanceMethode, args)`.
 * Elle évite l'emploi répétitif de la fonction `Function#bind()` dans une classe. Le contexte d'exécution de l'objet est 
 * automatiquement restitué, ce qui évite des erreurs de références lors de l'exécution du script JS.
 **/
	bind: function(instance){
		this.binding = instance;
		return this;
	},
/**
 * Observer.fire(eventName) -> Observer
 * - eventName (String): Nom de l'événement à déclencher.
 *
 * La méthode `fire` exécute un nom d'événement. L'ensemble des fonctions liées au nom d'événement seront appellées.
 *
 * ##### Exemple
 * 
 *      var calls = new Observer();
 *      calls.observe('myevent', function(){
 *          alert('hello world');
 *      };
 *      calls.fire('myevent'); //Affiche la boite de dialogue Hello world
 * 
 **/
	fire: function(eventName){
		
		var stopper = 		false;
		var properties = 	$A(arguments);
		var args = 			[];
	
		for(var i = 1; i < properties.length; i += 1){
			args.push(properties[i]);
		}
	
		
		if(args.length > 0){
			if(args[0] != null && args[0].__class__ && args[0].__class__ == 'stopevent'){
				args[0].eventName = eventName;
				stopper = args[0];
			}
		}
		
		//lancement des patternListener
		for(var key in this.patterns){
			
			var reg = new RegExp(key);
			
			if(reg.test(eventName)){		
				for(var i = 0; i < this.patterns[key].length; i+=1){
								
					if(Object.isFunction(this.patterns[key][i])){	
						try{						
							this.patterns[key][i].apply(this.binding, args);
						}catch(er){
							console.log(er);
						}
						if(stopper){
							//fin du parcours
							if(stopper.stopped) return this;
						}
					}
				}
			}
		}
			
		if(this.listener != null){
			this.listener[eventName];
			
			if(!Object.isUndefined(this.listener[eventName])){
				//lancement des listener
				for(var i = 0; i < this.listener[eventName].length; i+=1){
									
					if(Object.isFunction(this.listener[eventName][i])){
						
						try{
							var obj = this.listener[eventName][i].apply(this.binding, args);
						}catch(er){
							console.log(er);
						}
						
						if(stopper){
							//fin du parcours
							if(stopper.stopped) return obj;
						}
					}
				}
				
			}
		}
		return this;
	},
/**
 * Observer.observe(eventName, listener) -> Observer
 * - eventName (String): Nom de l'événement à observer.
 * - listener (Function): Fonction liée au nom de l'événement.
 * 
 * Observe un nom d'événement personnalisé et enregistre une fonction. Cette fonction sera appellé lors de l'utilisation
 * de la méthode [[Observer.fire]] avec comme paramètre le même nom d'événement.
 **/
	observe: function(eventName, callback){

		if(!Object.isArray(this.listener[eventName])){
			this.listener[eventName] = [];	
		}
		this.listener[eventName].push(callback);
		return this;
	},
/** alias of: Observer.observe
 * Observer.on(eventName, listener) -> Observer
 * - eventName (String): Nom de l'événement à observer.
 * - listener (Function): Fonction liée au nom de l'événement.
 * 
 * Observe un nom d'événement personnalisé et enregistre une fonction. Cette fonction sera appellé lors de l'utilisation
 * de la méthode [[Observer.fire]] avec comme paramètre le même nom d'événement.
 **/
	on: function(eventName, callback){
		return this.observe(eventName, callback);
	},
/**
 * Observer.observePattern(pattern, listener) -> Observer
 * - pattern (String): motif de recherche.
 * - listener (Function): Fonction liée au nom de l'événement.
 * 
 * Cette méthode observe tous les noms d'événements personnalisés ressemblant au motif `pattern`. La fonction enregistré sera appellé lors de l'utilisation
 * de la méthode [[Observer.fire]] avec comme paramètre le même nom d'événement proche du `pattern`.
 *
 * <p class="note">Cette méthode est disponible depuis la version 1.1</p>
 **/
	observePattern: function(pattern, callback){
		if(!Object.isArray(this.patterns[pattern])){
			this.patterns[pattern] = [];	
		}
		this.patterns[pattern].push(callback);
	},
/**
 * Observer.stopObserving(eventName) -> Observer
 * - eventName (String): Nom de l'événement à stopper
 *
 * Stop un événement enregistré dans le gestionnaire.
 **/
	stopObserving: function(eventName, callback){
		if(Object.isUndefined(this.listener[eventName])){
			return;
		}
		
		var array = this.listener[eventName];
		this.listener[eventName] = new Array();
		
		if(Object.isFunction(callback)){
			
			for(var i = 0; i < array.length; i += 1){
				if(array[i] == callback) continue;
				this.listener[eventName].push(array[i]);
			}
		}
		
		return this;
	},
/** alias of: Observer.stopObserving
 * Observer.stop(eventName) -> Observer
 * - eventName (String): Nom de l'événement à stopper
 *
 * Stop un événement enregistré dans le gestionnaire.
 **/
 	stop: function(eventName){
		this.callbacks[eventName] = [];
		return this;
	}
};
/** section: lang
 * class StopEvent
 *
 * Stoppeur d'évenement généré à l'aide de la classe [[Observer]].
 * 
 * <p class="note">Cette classe est disponible depuis la version 1.1</p>
 **/
var StopEvent = $.Observer.StopEvent = $.Class.create();
StopEvent.prototype = {
	__class__: 'stopevent',
	eventName:	'',
	stopped: 	false,
	target:		null,
/**
 * new StopEvent([target])
 * - target (Mixin): Element cible de l'événement.
 *
 * Cette méthode créée une nouvelle instance de `SysEvent`
 **/
	initialize: function(target){
		if(!Object.isUndefined(target)){
			this.target = target;
		}
	},
/**
 * StopEvent.stop() -> void
 *
 * Stop l'événement. La fonction appellant la méthode [[System.fire]] sera informé de l'arrêt de l'événement.
 **/
 	stop: function(){
		this.stopped = true;	
	},
/**
 * StopEvent.isStop() -> void
 *
 * Retourne l'état de l'événement. Si l'événement est stoppé, la méthode retournera `true`.
 **/	
	isStop:function(){
		return this.stopped;	
	}
};