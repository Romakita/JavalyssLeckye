/** section: Menu
 * class ContextMenu < Element
 * Cette classe permet de remplacer le menu contextuel du système d'exploitation par celui de WindowJS sur l'élément cible.
 *
 * Voici ci-contre l'instance ContextMenu :
 *
 * <img src="http://www.javalyss.fr/sources/window-context-menu.png" style="width:100%" />
 **/
var ContextMenu = Class.createSprite('div');

ContextMenu.prototype = {
	__class__:	'contextmenu',
	className:	'wobject w-popup popup border background context-menu shadow',
/**
 * new ContextMenu([options])
 * - options (Object): Objet de configuration de l'instance.
 *
 * Cette méthode créée une nouvelle instance de ContextMenu.
 *
 * <img src="http://www.javalyss.fr/sources/window-context-menu.png">
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `left` (`Boolean`): Si la valeur est vrai alors le contexte menu apparaitra sur le clique gauche.
 * * `right` (`Boolean`): Si la valeur est vrai alors le contexte menu apparaitra sur le clique droit.
 * * `options` (`Array`): Tableau d'objet {title: String, icon: String, click: Function} pour la création du menu contextuel.
 *
 **/
	initialize:function(obj){

		var options = {
			right:		true,
			left: 		false,
			options:	[]
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		
		this.left = 	options.left;
		this.right = 	options.right;
		this.x = 0;
		this.y = 0;
		this.zIndex = 	this.getStyle('zIndex');	
		this.hidden_ = 	false;
		this.hide();
		//
		// Body
		//
		this.body = 	new Node('ul', {className:'body wrapper'});
		//
		//
		//
		this.content = 	new Node('div', {className:'content wrap-content'}, this.body);
		
		//
		// ScrollBar
		//
		this.ScrollBar = new ScrollBar({node:this.content, wrapper:this.body, type:'vertical'});
		//
		//Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		this.appendChild(this.content);
		
		//redirection des méthodes
		this.appendChild =	function(node){
			this.body.appendChild(node);
			node.on('click', this.hide.bind(this));
			
			node.addClassName('line-altern-' + this.body.childElements().length % 2);
			
			this.ScrollBar.refresh();
			return this;
		};
		this.removeChild_ = 	this.removeChild;
		this.removeChild = 		function(node){
			this.body.removeChild(node);
			node.stopObserving('click');
			this.ScrollBar.refresh();
			return this;
		};
		
		//#pragma event
		document.observe('mousedown', this.hide.bind(this));
		this.observe('mousedown', function(evt){evt.stop()});
		this.observe('mouseup', this.hide.bind(this));

	},
/**
 * ContextMenu#addNode(node) -> ContextMenu
 * - node (Element): Element 
 *
 * Cette méthode ajoute une élément à la liste des éléménts cible du menu contextuel. 
 * Lorsque l'élément sera cliqué le menu contextuel apparaitra.
 **/
 	addNode:function(node){
		
		var sender = this;
		node.oncontextmenu_back = 	node.oncontextmenu;
				
		if(sender.right){
			if(!document.navigator.mobile){
				node.oncontextmenu = function(evt){
					this.onClick(evt, node);
					return false;
				}.bind(this);
			}
		}
		
		if(sender.left){
			node.on('click', function(evt){this.onClick(evt, node)}.bind(this));
		}
		
		return this;
	},
	
	onClick: function(evt, node){
		
		this.show();
		
		if(Event.pointerX){
			var x = Event.pointerX(evt);
			var y = Event.pointerY(evt);
		}else{
			if(event.clientX){
				var x = event.clientX;
				var y = event.clientY;
			}
		}
		
		this.moveTo(x, y);
		
		this.Observer.fire('click', evt, node);
	},
/**
 * ContextMenu#observe(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			case 'click':
				this.Observer.observe(eventName, callback);
				break;
			default: Event.observe(this, eventName, callback);
		}
		return this;
	},
/**
 * ContextMenu#stopObserving(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `click` : Intervient lors du clique sur l'élément cible.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'click':
				this.Observer.stopObserving(eventName, callback);
				break;
			default: Event.stopObserving(this, eventName, callback);
		}
	},
/**
 * ContextMenu#addNode(node) -> ContextMenu
 * - node (Element): Element 
 *
 * Cette méthode ajoute une élément à la liste des éléménts cible du menu contextuel. 
 * Lorsque l'élément sera cliqué le menu contextuel apparaitra.
 *
 **/	
	removeNode: function(node){
		node.stopObserving('click', node.oncontext_click);
		node.oncontextmenu = 	node.oncontextmenu_back;
	},
	/**
	 * Réinitialise la liste des lignes cliquable du ContextMenu.
	 * @returns {ContextMenu}
	 */
	clear: function(){return this.body.removeChilds();},
/**
 * ContextMenu#hide() -> ContextMenu
 *
 * Fait disparaitre le menu.
 **/
	hide: function(){
		if(this.hidden_) return;
		
		this.setStyle({display:'none', zIndex:this.zIndex, top:'0px', left:'0px'});
		this.hidden_ = true;
		return this;
	},

	top:function(node){
		return this.body.top(node);
	},
	/**
	 * Enregistre une ligne au ContextMenu. Cette méthode crée une LineElement et la configure selon les trois paramètres.
	 * Rien ne vous empeche de le faire manuellement et de l'ajouter avec la methode ContextMenu.{@link appendChild()}.
	 * @param {String} title Titre de la ligne LineElement.
	 * @param {Function} callback Ecouteur de l'événement mousedown sur LineElement.
	 * @param {Object} obj Configuration de la ligne (icone, texte en gras, et bordure).
	 * @returns {LineElement} La ligne fraichement instanciée.
	 */
	register: function(title, callback, obj){
		var line = new LineElement(obj);
		line.setText(title);
		this.appendChild(line);
		return line;
	},
	/**
	 * @ignore
	 */
	removeChilds: function(){	
		this.body.removeChilds();
		return this;
	},
/**
 * ContextMenu#show() -> ContextMenu
 *
 * Fait apparaitre le menu.
 **/
	show: function(){
		if(!this.hidden_) return;
				
		this.zIndex = this.getStyle('zIndex');
		this.setStyle({display:'', zIndex:'1000'});
		this.hidden_ = false;
		
		return this;
	},
/**
 * ContextMenu#moveTo(x, y) -> ContextMenu
 * - x (Number): Coordonnées.
 * - y (Number): Coordonnées.
 *
 * Déplacement le menu contextuel aux coordonnées `(x, y)`.
 **/	
	moveTo:function(x, y){
		//if(document.navigator.mobile) return;
		this.x = x;
		this.y = y;
		
		var node = document.navigator.mobile ? this.content : this;
		
		if(this.y + node.getHeight() > document.stage.stageHeight) 	this.y = document.stage.stageHeight - node.getHeight() - 10;
		if(this.x + node.getWidth() > document.stage.stageWidth) 	this.x = document.stage.stageWidth - node.getWidth() - 10;

		node.setStyle({top:this.y +"px", left:this.x +"px"});
		return this;
	},
	/**
	 * Retourne la ligne à l'indice demandé.
	 * @param {Number} i Indice du Node.
	 * @returns {LineElement}
	 */
	getChildAt: function(i){
		return this.body.getChildAt(i);
	},
/**
 * ContextMenu#childElements() -> array
 *
 * Retourne la liste des `Element` enfant.
 **/
	childElements: function(){
		return this.body.childElements();
	},
/*
 * ContextMenu#__destruct() -> void
 * 
 * Désalloue les ressources et nettoye l'instance.
 **/
	__destruct:function(){
		$WR.destructObject(this);
	}
};