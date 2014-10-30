/** section: DOM
 * class Node < Element
 * Créer un nouvelle élément de type Node. Ce node peut être inseré à n'importe quel autre élément du DOM.
 **/

/**
 * new Node(tagName[, attributs[, nodes]])
 * - tagName (String): Nom de la balise à créer.
 * - attributs (Object): Par défaut, ce paramètre prend un objet d'attribut permettant de personnaliser la balise (par exemple `{style:'width:300px'}`). Vous pouvez passer en paramètre un tableau de Node à ajouter au corps de la balise plutot que les attributs (dans ce cas il ne faut pas passer ce tableau en troisième paramètre).
 * - nodes (Array): Tableau de Node à ajouter au corps de la balise.
 *
 * Cette méthode créée une nouvelle instance de [[Node]].
 *
 * Il existe plusieurs façon d'instancier un [[Node]] comme ci-dessus :
 *
 * #### Avec un seul paramètre :
 *
 * * `new Node(tagName)`.
 *
 * #### Avec deux paramètres :
 *
 * * `new Node(tagName, attributs)` où est un `Object` contenu les attributs d'un `Element`.
 * * `new Node(tagName, [Node1, Node2, ..., Noden])`, de cette façon vous ajoutez des Nodes au corps du Node sans ajouter d'atributs au Node courant.
 * * `new Node(tagName, String)`, de cette façon vous créez un [[Node]] avec un texte quelconque dans son corps.
 *
 * #### Avec les trois paramètres :
 *
 * * `new Node(tabName, attributs, nodes)`, de cette façon le [[Node]] est initialisé avec des attributs et des Nodes ajoutés à son corps.
 * * `new Node(tabName, attributs, string)`, de cette façon le [[Node]] est initialisé avec des attributs et un texte quelconque.
 *
 **/
if(!Object.isUndefined(window['Node'])){
	var oNode = window['Node'];
}else{
	var Node;	
}
 
Node = function(tagName, obj, append){
	//document.navigator.initialize();	
	
	var element = document.createElement(tagName);
	
	
	if(arguments.length == 0) return element;
	
	//arg[1]
	if(!Object.isUndefined(obj)){

		if(Object.isElement(obj)) element.appendChild(obj);
		else{
			if(Object.isString(obj) || Object.isNumber(obj)){
				var text = document.createTextNode(obj);
				element.appendChild(text);
			}

			else{
				if((typeof obj) == "object" && !Object.isArray(obj)){
					
					for(var key in obj){
						if(key == "style") element.setStyle(obj[key]);
						else {
							try{
								element[key] = obj[key];	
							}catch(er){
								element.writeAttribute({key:obj[key]});
							}
						}
					}

				}
				if(Object.isArray(obj)){
					
					$A(obj).each(function(child){
						if(Object.isElement(child)){
							element.appendChild(child);
						}else{						
							if(Object.isString(child) || Object.isNumber(child)){
								var text = document.createTextNode(child);
								element.appendChild(text);
							}
						}
					});
				}
			}
		}
	}
	
	//arg[2]
	if(!Object.isUndefined(append)){
		if(Object.isString(append) || Object.isNumber(append)){

			var text = document.createTextNode(append);
			element.appendChild(text);
		}
		if(Object.isElement(append)){

			element.appendChild(append);
		}
		if(Object.isArray(append)){

			$A(append).each(function(child){
				if(Object.isElement(child)){
					element.appendChild(child);
				}else{						
					if(Object.isString(child) || Object.isNumber(child)){
						var text = document.createTextNode(child);
						element.appendChild(text);
					}
				}
			});
		}
	}
	
	return element;
};

if(oNode){
	Object.extend(Node, oNode);	
}
/** section: DOM
 *  class Element
 *
 *  The [[Element]] object provides a variety of powerful DOM methods for
 *  interacting with DOM elements&nbsp;&mdash; creating them, updating them,
 *  traversing them, etc. You can access these either as methods of [[Element]]
 *  itself, passing in the element to work with as the first argument, or as
 *  methods on extended element *instances*:
 *
 *      // Using Element:
 *      Element.addClassName('target', 'highlighted');
 *
 *      // Using an extended element instance:
 *      $('target').addClassName('highlighted');
 *
 *  Element is also a constructor for building element instances from scratch,
 *  see [`new Element`](#new-constructor) for details.
 *
 *  Most [[Element]] methods return the element instance, so that you can chain
 *  them easily:
 *
 *      $('message').addClassName('read').update('I read this message!');
 *
 *  ##### More Information
 *
 *  For more information about extended elements, check out ["How Prototype
 *  extends the DOM"](http://prototypejs.org/learn/extensions), which will walk
 *  you through the inner workings of Prototype's DOM extension mechanism.
 **/

/**
 *  new Element(tagName[, attributes])
 *  - tagName (String): The name of the HTML element to create.
 *  - attributes (Object): An optional group of attribute/value pairs to set on
 *    the element.
 *
 *  Creates an HTML element with `tagName` as the tag name, optionally with the
 *  given attributes. This can be markedly more concise than working directly
 *  with the DOM methods, and takes advantage of Prototype's workarounds for
 *  various browser issues with certain attributes:
 *
 *  ##### Example
 *
 *      // The old way:
 *      var a = document.createElement('a');
 *      a.setAttribute('class', 'foo');
 *      a.setAttribute('href', '/foo.html');
 *      a.appendChild(document.createTextNode("Next page"));
 *
 *      // The new way:
 *      var a = new Element('a', {'class': 'foo', href: '/foo.html'}).update("Next page");
**/
Node.Methods = {
/**
 * Element.appendChild(@element, node) -> Node
 * - node (Node | Element): Element à ajouter au corps du node.
 *
 * Ajoute un [[Node]] au [[Node]] courant.
 **/

/**
 * Element.addChildAt(@element, node, it) -> Node
 * - node (Node | Element): Element à ajouter au corps de la balise.
 * - it (Number): Indice à laquelle il faut ajouter la balise.
 *
 *  Ajoute un [[Node]] à un l'indice demandé. Cette méthode permet d'inserer un [[Node]] entres deux enfants du [[Node]] parent.
 **/
	addChildAt:function(node, child, nb){

		if(Object.isUndefined(nb)){
			node.appendChild(child);
			return node;
		}
		
		if(nb == 0) return node.top(child);
		
		var position = node.childElements()[nb];
		node.insertBefore(child, position);
		
		return node;
	},
/**
 * Element.appendChilds(@element, nodeArray) -> Node
 * - nodeArray (Node): Tableau de [[Node]] à ajouter au corps du [[Node]] courant.
 *
 * Ajoute un ou plusieurs [[Node]] au [[Node]] courant.
 **/
	appendChilds:function(node, array){
		
		array.each(function(child){
			if(Object.isElement(child)){
				node.appendChild(child);
			}else{
				if(Object.isString(child) || Object.isNumber(child)){
					var text = document.createTextNode(child);
					node.appendChild(text);
				}
			}
		});
		
		return node;
	},
/** alias of: Element.appendChild
 * Element.appendChilds(@element, nodeArray) -> Node
 * - node (Node | Element): Element à ajouter au corps du node.
 *
 * Ajoute un [[Node]] au [[Node]] courant.
 **/
	a: function(node, child){return node.appendChild(child);},
/** alias of: Element.addChildAt
 * Element.at(@element, node, it) -> Node
 * - node (Node | Element): Element à ajouter au corps du node.
 * - it (Number): Indice à laquelle il faut ajouter l'element.
 *
 *  Ajoute un [[Node]] à un l'indice demandé. Cette méthode permet d'inserer un [[Node]] entres deux enfants du [[Node]] parent.
 **/
	at: function(node, child, i){return node.addChildAt(node, child, it);},
/** alias of: Element.appendChilds
 * Element.as(@element, nodeArray) -> Node
 * - nodeArray (Node): Tableau de [[Node]] à ajouter au corps du [[Node]] courant.
 *
 * Ajoute un ou plusieurs [[Node]] au [[Node]] courant.
 **/
	as: function(node, array){return node.appendChilds(node, array);},
/**
 * Element.css(@element, property, value) -> Element
 * Element.css(@element, property) -> String
 * - property (String): Propriété CSS.
 * - value (String): Valueur de la propriété.
 * 
 * Cette méthode permet de manipuler le le style CSS d'un élement.
 **/
 	css: function(node, property, value){
		if(Object.isUndefined(value)){
			value = node.getStyle(property);
			var float = parseFloat(value);
			return isNaN(float) ? value : float;
		}
		
		if(typeof property === 'object'){
			node.setStyle(property);	
			return node;
		}
		
		if(value == null || value == ''){
			node.removeCss(property);
		}
		
		if(property != 'z-index' && property != "zIndex" && !isNaN( 1 * value)){
			value += 'px';
		}
		
		node.setStyle(property+':'+ value);
		return node;
	},
/**
 * Element.removeCss(@element, property) -> Element
 * - property (String): Propriété CSS.
 * 
 * Cette méthode permet supprimer une propriété CSS.
 **/	
	removeCss:function(node, property){
		if(Object.isUndefined(property)){
			node.style.cssText = '';
			return node;
		}
		
		try{
			if(node.style.removeProperty) {
				node.style.removeProperty(property);
            } 
            else{
				if(property.indexOf('-') > -1){
					
					var o = property.split('-');
					
					for(var i = 1; i < o.length;  i++){
						o[i] = o[i].charAt(0).toUpperCase() + o[i].slice(1);	
					}
					
					property = o.join('');
				}
                
				node.style.removeAttribute(property);
            }

		}catch(er){
			if(property.indexOf('-') > -1){
					
				var o = property.split('-');
				
				for(var i = 1; i < o.length;  i++){
					o[i] = o[i].charAt(0).toUpperCase() + o[i].slice(1);	
				}
				
				property = o.join('');
			}
			
			try{
				node.style[property] = '';
			}catch(er){}
		}
		
		return node;
	},
/**
 * Element.data(@element, key, value) -> Mixed
 * - key (String): Nom de la clef contenant la valeur.
 *  - value (Mixed): Valeur de la clef.
 *
 * Cette méthode permet de lire/écrire les données stockées sur une balise via `data-*`.
 **/	
	data: function(node, key, value){
		
		key = key.sanitize().toLowerCase();
		
		if(Object.isUndefined(value)){
			value = node.getAttribute('data-' + key);
			
			switch(value){
				default:
					if(!value == null){
						if(Object.isNumber(value * 1)){
							value = value * 1;	
						}
					}
					break;
				case 'null':
					value = null;
					break;
				case 'true':
					value = true;
					break;
				case 'false':
					value = false;
					break;		
			}
					
			return value;
		}
		
		node.setAttribute('data-' + key, value);
		return value;
	},
/** alias of: Event.observe
 * Element.on(@element, listener) -> Node
 * - listener (Function): Fonction appelée sur le nom de l'événement.
 *
 * Cette méthode est un raccourci [[Event.observe]].
 **/
	on: function(node){var args = $A(arguments); args.shift(); return node.observe.apply(node, args);},
/** alias of: Event.observe, deprecated
 * Element.mouseover(@element, listener) -> Node
 * - listener (Function): Fonction appelée lors du `mouseover` sur l'élément.
 *
 * Cette méthode est un raccourci [[Event.observe]] et est spécialisé pour le `mouseover`.
 **/
 	mouseover: function(node, callback){
		return node.on('mouseover', callback);
	},
/** alias of: Event.observe
 * Element.mouseout(@element, listener) -> Node
 * - listener (Function): Fonction appelée lors du `mouseout` sur l'élément.
 *
 * Cette méthode est un raccourci [[Event.observe]] et est spécialisé pour le `mouseout`.
 **/
 	mouseout: function(node, callback){
		return node.on('mouseout', callback);
	},
/** alias of: Event.observe
 * Element.mousedown(@element, listener) -> Node
 * - listener (Function): Fonction appelée lors du `mousedown` sur l'élément.
 *
 * Cette méthode est un raccourci [[Event.observe]] et est spécialisé pour le `mousedown`.
 **/
	mousedown: function(node, callback){
		return node.on('mousedown', callback);
	},
/** alias of: Event.observe
 * Element.mouseup(@element, listener) -> Node
 * - listener (Function): Fonction appelée lors du `mouseup` sur l'élément.
 *
 * Cette méthode est un raccourci [[Event.observe]] et est spécialisé pour le `mouseup`.
 **/
	mouseup: function(node, callback){
		return node.on('mouseup', callback);
	},
/** alias of: Event.observe
 * Element.mousemove(@element, listener) -> Node
 * - listener (Function): Fonction appelée lors du `mousemove` sur l'élément.
 *
 * Cette méthode est un raccourci [[Event.observe]] et est spécialisé pour le `mouseup`.
 **/
	mousemove: function(node, callback){
		return node.on('mousemove', callback);
	},
/** alias of: Event.observe
 * Element.keyupcode(@element, code, listener) -> Node
 * - listener (Function): Fonction appelée lorsque la touche associé au code du second paramètre sera relaché.
 * - code (Number): Code de la touche clavier à intercepter.
 *
 * Cette méthode est un raccourci [[Event.observe]]. La fonction enregistrée sera appellée lorsque la touche `code`
 * sera relaché. Cette méthode fonctionne avec tous les éléments du DOM et plus particulièrement avec les balises
 * de type saisie (INPUT, TEXTEAREA, etc...).
 **/
	keyupcode: function(node, code, callback){
		return node.on('keyup', function(evt){
			if(Event.getKeyCode(evt) == code){
				return callback.call(this, evt);
			}
		});
	},
/** alias of: Event.observe
 * Element.keydowncode(@element, code, listener) -> Node
 * - listener (Function): Fonction appelée lorsque la touche associé au code du second paramètre sera pressé.
 * - code (Number): Code de la touche clavier à intercepter.
 *
 * Cette méthode est un raccourci [[Event.observe]]. La fonction enregistrée sera appellée lorsque la touche `code`
 * sera pressé. Cette méthode fonctionne avec tous les éléments du DOM et plus particulièrement avec les balises
 * de type saisie (INPUT, TEXTEAREA, etc...).
 **/
	keydowncode: function(node, code, callback){
		return node.on('keydown', function(evt){
			if(Event.getKeyCode(evt) == code){
				return callback.call(this, evt);
			}
		});
	},
/** alias of: Element.keyupcode
 * Element.keyupenter(@element, listener) -> Node
 * - listener (Function): Fonction appelée lorsque la touche ENTRER est relaché sur l'élément.
 *
 * Cette méthode est un raccourci [[Element.keyupcode]], sauf que vous n'avez pas besoin de mentionner le `code` clavier de la touche `ENTRER`. 
 * La fonction enregistré sera appellé lorsque la touche `ENTRER` sera relaché. Cette méthode fonctionne avec tous les éléments du DOM et plus 
 * particulièrement avec les balises de type saisie (INPUT, TEXTEAREA, etc...).
 **/
	keyupenter: function(node, callback){
		return node.on('keyup', function(evt){
			if(Event.getKeyCode(evt) == Event.KEY_RETURN){
				return callback.call(this, evt);
			}
		});
	},
/** alias of: Element.keydowncode
 * Element.keydownenter(@element, listener) -> Node
 * - listener (Function): Fonction appelée lorsque la touche ENTRER est pressé sur l'élément.
 *
 * Cette méthode est un raccourci [[Element.keydowncode]], sauf que vous n'avez pas besoin de mentionner le `code` clavier de la touche `ENTRER`. 
 * La fonction enregistré sera appellé lorsque la touche ENTRER sera pressé. Cette méthode fonctionne avec tous les éléments du DOM et plus 
 * particulièrement avec les balises de type saisie (INPUT, TEXTEAREA, etc...).
 **/
	keydownenter: function(node,callback){
		return node.on('keydown', function(evt){
			if(Event.getKeyCode(evt) == Event.KEY_RETURN){
				return callback.call(this, evt);
			}
		});
	},
/**
 * Element.top(@element, child) -> Node
 * - child (Node): Node à ajouter.
 * 
 * Ajoute un enfant au debut en tête des enfants de l'element courant
 *
 **/
	top: function(node, child){
		node.insert({top:child});
		return node;
	},
	//ignore
	topChild: function(node, child){
		node.insert({top:child});
		return node;
	},
	//ignore
	getChildAt: function(node, id){
		var childs = node.childElements();
		
		if(childs.length > 0 && id < childs.length){
			return childs[id]
		}
		
		return false;
	},
/**
 * Element.removeChilds(@element[, array]) -> Node
 * - array (Array): Liste de Node à supprimer du DOM.
 * 
 * Supprime tous les enfants de l'élement. Si `array` est passé alors seulement
 * la liste des elements sera supprimé.
 *
 **/
	removeChilds: function (node, array){
		if(Object.isArray(array)) var childs = array;
		else var childs = node.childElements();
		
		var nav = document.navigator;
		
		if(!(nav.client == 'IE' && nav.version < 8)){
			childs.each(function(e){
				e.parentNode.removeChild(e);
			});
		}
		
		node.innerHTML = '';
		
		return node;
	},
/**
 * Element.replaceBy(@element, node) -> Element
 * - node (Element): Element prennant la place de l'instance.
 *
 * Cette méthode permet de remplacer l'`element` par un node.
 * 
 * <p class="note">Méthode implémenté depuis la version 1.4</p>
 **/	
	replaceBy: function(node, newnode){
		//node.parentNode.insertBefore(newnode, node);
		//node.parentNode.removeChild(node);
		node.parentNode.replaceChild(newnode, node);
		//node.cloneStyle(newnode);
		
		return node;
	},
/**
 * Element.cloneStyle(@element, node) -> Element
 * - node (Element): Element prennant la place de l'instance.
 *
 * Cette méthode permet de cloner le style de l'élément.
 * 
 * <p class="note">Méthode implémenté depuis la version 1.4</p>
 **/	
	cloneStyle: function(node, newnode){
		
		var nav = document.navigator;
		
		if(!(nav.client == 'IE' && nav.version < 8)){
			(function cloneProperty(dest, src){
				for(key in src){
					try{
						if(Object.isString(src[key])){
							dest[key] = src[key];
						}else{
							if(typeof src[key] == "object") cloneProperty(dest[key], src[key]);
						}
					}catch(er){}
				}
			})(newnode.style, node.style);
		}
		
		return node;
	},
/**
 * Element.catchWheelEvent(@element) -> Element
 *
 * Cette méthode annule la propogation du scroll pour un élément scrollable contenu dans un autre element scrollable géré par Javascript.
 **/	
	catchWheelEvent:function(node){
		
		Event.observe(node, "DOMMouseScroll", function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}
			event.cancelBubble = true;
		}, false); // Firefox*/
		
		Event.observe(node, "mousewheel", function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}
			event.cancelBubble = true;
		}, false);
		
	},
/**
 * Element.createMask(@element, mask[, type]) -> Node
 * - mask (String): suite de caractère # pour la création d'un mask. # permet d'indiquer à la méthode que ce caractère pourra être remplacé par un caractère de saisie.
 * - type (String): Indique si la saisie n'autorise que les entiers (type => number).
 *
 * Créer un masque de saisie pour un champs de saisie.
 * Cette méthode permet de formater l'affichage du champs et contraindre la saisie de différent
 * type comme celui d'une date, d'un entier, d'un numéro de téléphone, etc...
 *
 * ##### Exemples
 *
 * Dans cette exemple nous allons créer un champ de saisie et nous allons y ajouter un masque pour le
 * téléphone :
 *
 *      var node = new Node('input', {type:'text'});
 *      node.createMask('## ## ## ## ##', 'number'); //le masque est spécifique au téléphone de 10 numéros.
 *
 **/
	createMask: function(node, mask, type){
		
		if(type == 'number'){
			node.readOnly = 'readonly';
		}
		
		node.observe('keydown', function(evt){
			if(evt.keyCode == 8 && type == 'number'){
				node.value_ = node.value_.slice(0, node.value_.length - 1);
				
				if(Object.isUndefined(node.value_)){
					node.value_ = '';
				}
			}
		});
		
		try{
			if(Object.isUndefined(type)){
				node.value_ = node.value;	
			}
		}catch(er){}

		node.observe('keyup', function(evt){

			var num = false, pad = false;
			
			if(Object.isUndefined(node.value_)) {
				node.value_ = node.value.unformat(mask);
			}

			if(((num = $R(48, 57).include(evt.keyCode)) || (pad = $R(96, 105).include(evt.keyCode))) && type == 'number'){
				
				if(num) {
					node.value_ += evt.keyCode - 48;
				}
				if(pad) {
					node.value_ += evt.keyCode - 96;
				}	
				
			}
			
			if(node.value_.length > 0){
				
				var str = 		'';

				for(var i = 0, y = 0; y < node.value_.length && i < mask.length; i+=1){

					var char = mask[i];
					
					if(char == "#"){
						str += node.value_[y];
						y++;
						
					}else{
						str += mask[i];
					}
				}
				
				node.value = str;
				node.value_ = node.value_.slice(0, y);
				
			}else{
				node.value = '';	
			}
			
		});
		return node;
	},
/**
 * Node#setTheme(@element, theme) -> Node
 * - theme (String): Thème a appliquer.
 * 
 * Cette méthode permet de changer le thème du node.
 **/
	setTheme: function(node, theme){
		
		node.removeClassName('theme-' + node.theme);
		
		if(theme){
			node.theme = theme;
			node.addClassName('theme-' + node.theme);
		}else{
			node.theme = 'default';
			node.addClassName('theme-' + node.theme);
		}
		
		return this;
	},
	
	setClassName:function(node, c){return node.addClassName(c);}
};

Element.addMethods(Node.Methods);

Element.addMethods('IMG', {
/**
 * Node.resizeTo(@element, width, height) -> Picture
 * - height (Number): Hauteur de l'image.
 * - width (Number): Largeur de l'image
 *
 * Cette méthode redimensionne l'image en gardant respection ses proportions.
 *
 * <p class="note">Cette méthode ne s'applique qu'à la balise IMG.</p>
 **/
	resizeTo:function(node, widthMax, heightMax){
				
		var height = 	node.height;
		var width = 	node.width;
		
		if(height > width){
			
			width = Math.round((heightMax / height) * width);
				
			height = heightMax; 
			
			
		}
		else if(height < width){
			
			if(widthMax <= heightMax){
				height = Math.round((widthMax / width) * height);
				//Largeur du nouveau logo
				width = widthMax;
			}else{
				
				width = Math.round((heightMax / height) * width);
				
				height = heightMax; 
				
				if(width > widthMax){
					height = Math.round((widthMax / width) * height);
					//Largeur du nouveau logo
					width = widthMax;
				}
				
			}
			
		}
		else if(height == width){
			//Largeur & hauteur du nouveau logo
			
			if(heightMax > widthMax){
				width = widthMax;
				height = widthMax;
			}
			else{
				width = heightMax;
				height = heightMax;
				
			}
		}
		
		node.setStyle({width:width+'px', height:height+'px'});
		node.width = width;
		node.height = height;
		
		return {'0':width, '1':height, width:width, height:height};
	}
});

Element.addMethods('INPUT', {
/**
 * Node#ReadOnly(@element [, bool]) -> Number
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
 *     var c = new Node('input', {type:'text'});
 *     c.ReadOnly(true);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Node('input', {type:'text'});
 *     c.ReadOnly(5);
 *     alert(c.ReadOnly()); //true
 *
 **/
	ReadOnly:function(node, bool){
		
		if(!Object.isUndefined(bool)) {
			node.readOnly = bool;
		}
	
		return node.readOnly;
	},
/**
 * Node#MaxLength(@element [, maxchar]) -> Number
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
 *     var c = new Node('input', {type:'text'});
 *     c.MaxLength(5);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Node('input', {type:'text'});
 *     c.MaxLength(5);
 *     alert(c.MaxLength()); //5
 *
 **/	
	MaxLength:function(node, nb){
		
		if(!Object.isUndefined(nb)) {
			node.maxLength = nb;
		}
	
		return node.maxLength;
	},
/**
 * Node#Value(@element [, value]) -> String
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
 *     var c = new Node('input', {type:'text'});
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Node('input', {type:'text'});
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(node, value){
		if(!Object.isUndefined(value)){
			node.value = value;
		}
		
		return node.value;
	}
});

if(typeof Builder == "undefined"){//support de l'ancienne bibliothèque Builder.node
	var Builder = {
		node:function(tagName, obj, append){
			return new Node(tagName, obj, append);	
		}
	};
}