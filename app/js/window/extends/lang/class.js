/** section: lang
 * Class
 * Manages Prototype's class-based OOP system. Refer to Prototype's web site for a tutorial on classes and inheritance.
 **/
Object.extend(Class, {
/**
 * Class.createElement(baliseName) -> ClassElement
 * - baliseName (String): Nom de la balise. La classe héritera des propriétés de la balise demandée.
 *
 * Créée une classe héritant des méthodes de la classe `Element`. L'instance de la classe pourra être ajouté à un `element` du DOM via `element.appendChild`.
 * 
 * ##### Exemple
 * 
 * Cet exemple montre comment utiliser la méthode [[Class.createElement]].
 *
 *      var MaClasse = Class.createElement('div');
 *      MaClasse.prototype = {
 *            initialize: function(){
 *                  this.innerHTML = 'ma classe element';
 *            }
 *      };
 *      $Body.appendChild(new MaClasse());
 *
 **/
 	createElement: function(name){
		function klass() {
			
			if(!Object.isUndefined(name)){
								
				switch(typeof name){
					case 'string':
					
						var element  = 		document.createElement(name);
						element.className = 'wobject';
						
						element.destroy = function(){
							this.stopObserving();
							this.destroy = 		null;
							this.className = 	'';
							
							new Timer(function(){
								if(!Object.isUndefined(this.Observer)){
									this.Observer.destroy();
									this.Observer = null;
								}
								
								
								try{this.select('.wobject').each(function(e){
									if(Object.isFunction(e.destroy)) e.destroy();
								});}catch(er){}
							}, 0.1, 1).start();
						};
						
						Object.extend(element, this);
						element.initialize.apply(element, $A(arguments));
						break;
					case 'function':
						var element = name.apply(name.prototype, arguments);
												
						Object.extend(element, this);
						element.initialize.apply(element, $A(arguments));
						break;					
				}
									
				return element;
			}
			return this.initialize.apply(this, arguments);
		}
		
		Object.extend(klass, Class.Methods);
		//klass.superclass = parent;
		//klass.subclasses = [];
			
		if(!klass.prototype.initialize)	klass.prototype.initialize = Prototype.emptyFunction;
		
		klass.prototype.constructor = klass;
		
		return klass;
	},
/** alias of: Class.createElement
 * Class.createSprite(baliseName) -> ClassElement
 * - baliseName (String): Nom de la balise. La classe héritera des propriétés de la balise demandée.
 *
 * Créée une classe héritant des méthodes de la classe `Element`. L'instance de la classe pourra être ajouté à un `element` du DOM via `element.appendChild`.
 * 
 * ##### Exemple
 * 
 * Cet exemple montre comment utiliser la méthode [[Class.createSprite]].
 *
 *      var MaClasse = Class.createSprite('div');
 *      MaClasse.prototype = {
 *            initialize: function(){
 *                  this.innerHTML = 'ma classe element';
 *            }
 *      };
 *      document.body.appendChild(new MaClasse());
 *
 **/	
	createSprite: function(name) {
	
		function klass() {
			
			if(!Object.isUndefined(name)){
				
				switch(typeof name){
					case 'string':
						var element  = document.createElement(name);
												
						element.destroy = function(){
							this.stopObserving();
							this.destroy = 		null;
							this.className = 	'';
							
							new Timer(function(){
								if(!Object.isUndefined(this.Observer)){
									this.Observer.destroy();
									this.Observer = null;
								}
								
								if(Object.isFunction(this.select)){
									this.select('.wobject').each(function(e){
										if(Object.isFunction(e.destroy)){
											e.destroy();
										}
									});
								}
							}, 0.1, 1).start();
						};
						
						Object.extend(element, this);
						element.initialize.apply(element, $A(arguments));
						break;
						
					case 'function':
						var element = name.apply(name.prototype, arguments);
												
						Object.extend(element, this);
						element.initialize.apply(element, $A(arguments));
						break;					
				}
									
				return element;
			}
			return this.initialize.apply(this, arguments);
		}
		
		Object.extend(klass, Class.Methods);
		//klass.superclass = parent;
		//klass.subclasses = [];
			
		if(!klass.prototype.initialize)	klass.prototype.initialize = Prototype.emptyFunction;
		
		klass.prototype.constructor = klass;
		
		return klass;
	},
/**
 * Class.from(class) -> ClassElement
 * - class (?): Classe parente.
 *
 * Cette méthode créée une classe à partir d'une classe parente de type `Element` créée par la méthode [[Class.createSprite]].
 * 
 * ##### Exemple
 * 
 * Cet exemple montre comment utiliser la méthode [[Class.createSprite]].
 *
 *      var MaClasseParent = Class.createSprite('div');
 *      MaClasseParent.prototype = {
 *            initialize: function(){
 *                  this.innerHTML = 'Parent';
 *                  this.setStyle('border:1px solid black');
 *            }
 *      };
 *      
 *      var MaClasse = Class.from(MaClasseParent);
 *      MaClasse.prototype = {
 *            initialize: function(){
 *                  this.innerHTML += ' is superClass and Children is subclass';
 *                  this.setStyle('border:1px solid grey');
 *            }
 *      };
 *      document.body.appendChild(new MaClasseParent());
 *      document.body.appendChild(new MaClasse());
 *
 **/	
	from: function(parent){
		return this.createSprite(parent);	
	},
/**
 * Class.createAjax() -> ClassAjax
 *
 * Cette méthode créée une classe héritant des méthodes de la ClassAjax. Cette classe permet le transport d'un objet
 * via AJAX en implémentant les méthodes de bases. Ces méthodes sont les suivantes :
 * 
 * * initialize : Constructeur de votre classe.
 * * clone : Copie de l'instance.
 * * evalJSON : Analyse et copie des valeurs d'une chaine de caractère au format JSON.
 * * setObject : Copie des attributs d'un objet vers l'instance classe.
 * * toJSON : Convertie l'instance en chaine JSON.
 * 
 **/	
	createAjax:function(){
		var klass = 		null;
		var array =			[{
			
			initialize:function(obj){
				if(!Object.isUndefined(obj)){
					this.setObject(obj);
				}
			},
			
			clone: function(){
				return new klass(this);
			},
			
			evalJSON:function(json){
				
				var obj = json.evalJSON();
										
				this.setObject(obj);
				return this;
			},
			
			setObject:function(obj){
				Object.setObject(this, obj);
				return this;
			},
			
			toJSON:function(){
				return Object.EncodeJSON(this);
			}
		}];
		
		$A(arguments).each(function(e){
			array.push(e);
		});
		
		klass = Class.create.apply(Class, array);
		
		return klass;
	}
});
/**
 * class Object
 *
 * Extensions to the built-in Object object.
 * 
 * Because it is dangerous and invasive to augment Object.prototype (i.e., add instance methods to objects), all these methods are static methods that take an Object as their first parameter.
 * 
 * Object is used by Prototype as a namespace; that is, it just keeps a few new methods together, which are intended for namespaced access (i.e. starting with "Object.").
 * 
 * For the regular developer (who simply uses Prototype without tweaking it), the most commonly used methods are probably Object.inspect and, to a lesser degree, Object.clone.
 *
 * Advanced users, who wish to create their own objects like Prototype does, or explore objects as if they were hashes, will turn to Object.extend, Object.keys, and Object.values.
 **/
Object.extend(Object, {
	LIMIT_LOOP:50,
	
	EncodeJSON:function(o){
		return escape(Object.toJSON(Object.encodeURIComponent(o)));
	},
/**
 * Object.encodeURIComponent(obj) -> Object
 * - obj (Object): Objet à encoder.
 * 
 *  Cette méthode clone et encode les attributs d'un objet.
 **/	
	encodeURIComponent:function(object, stack){
		var obj = Object.isArray(object) ? [] : {};
		stack = stack || 1;
		
		if(stack >= Object.LIMIT_LOOP) return;
		
		for(var key in object){
			if(Object.isFunction(object[key])){
				continue;
			}
			
			var type = typeof object[key];
			
			switch(type){
				case 'boolean':
					obj[key] = object[key];
					break;
					
				case 'number':
				case 'string':
					obj[key] = encodeURIComponent(object[key]);
					break;
					
				case 'object':
									
					if(object[key] === null || Object.isUndefined(object[key])){
						obj[key] = object[key];
						break;	
					}
					
					if(Object.isElement(object[key])){
						if(Object.isFunction(object[key].Value)){
							obj[key] = encodeURIComponent(object[key].Value());	
						}else{
							if(!Object.isUndefined(object.value)){
								obj[key] = encodeURIComponent(object[key].value);	
							}
						}
						
						break;
					}
					
					if(Object.isDate(object[key])){
						obj[key] = encodeURIComponent(object[key].format('Y-m-d h:i:s'));
						break;	
					}
					
					if(Object.isArray(object[key])){
						obj[key] = Object.encodeURIComponent(object[key], stack+1);
						break;
					}
					
					obj[key] = Object.encodeURIComponent(object[key], stack+1);
					break;
					
				default:
					try{
						obj[key] = encodeURIComponent(object[key], stack+1);
					}catch(er){}
			}
		}
		
		return obj;
	},
/**
 * Object.setObject(klass, obj) -> void
 * - klass (Class): Classe à étendre.
 * - obj (Object): Objet à copier.
 * 
 * Cette méthode copie les attributs d'un objet `obj` vers une classe `klass`.
 *
 * <p class="note">Cette méthode ne copie les fonctions.</p>
 **/	
	setObject:function(klass, obj){
		var pattern = Object.isElement(obj) ? klass : obj;
		
		for(var key in pattern){
			
			if(Object.isFunction(obj)){
				continue;
			}
			
			if(Object.isUndefined(obj[key])){
				continue;
			}
			try{
				
				var type = typeof obj[key];
								
				switch(type){
					case 'function':break;
						
					default:
					case 'boolean':
						klass[key] = obj[key];
						break;
						
					case 'number':
						klass[key] = 1 * obj[key];
						break;
					case 'string':
						
						if(Object.isString(obj[key]) && obj[key].isDate()){
							klass[key] = obj[key].toDate();
							break;
						}
						
						if(obj[key].isJSON() && isNaN(obj[key] * 1)){
							
							try{
								klass[key] = obj[key].evalJSON();
								break;
							}catch(er){}
						}
						
						klass[key] = obj[key];
						break;
						
					case 'object':
						if(obj[key] === null){
							obj[key] = object[key];
							break;	
						}
						
						if(Object.isElement(obj[key])){
							if(Object.isFunction(obj[key].Value)){
								klass[key] = obj[key].Value();	
							}else{
								if(!Object.isUndefined(obj.value)){
									klass[key] = obj[key].value;
								}
							}
							break;
						}
						
						if(Object.isDate(obj[key])){
							klass[key] = obj[key].clone();
							break;
						}
						
						if(Object.isArray(obj[key])){
							klass[key] = [];
							Object.setObject(klass[key], obj[key]);
							break;
						}
						
						var options = typeof klass[key] === 'object' && klass[key] != null ? klass[key] : {};
						
						Object.setObject(options, obj[key]);
						
						klass[key] = options;
				}
				
				
				
			}catch(er){}
		}
	}
});

$.Class = Class;