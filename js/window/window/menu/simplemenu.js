/** section: Menu
 * class SimpleMenu < Element
 * Cette classe permet la création de menu simple.
 *
 * L'image si contre représente une instance `DropMenu`. L'instance `SimpleMenu`
 * constitue un des éléments du gestionnaire des menus `DropMenu`.
 *
 * <img src="http://www.javalyss.fr/sources/window-drop-menu-add-line.png" >
 *
 **/
var SimpleMenu = Class.createSprite('span');

SimpleMenu.prototype = {
	/** @ignore */
	__class__: 		'simplemenu',
	/** @ignore */
	className:		'wobject simple-menu',
	/**
	 * Conteneur des elements du menu.
	 * @type Node
	 */
	content: 		null, 
/**
 * SimpleMenu.SimpleButton -> SimpleButton
 * Instance du bouton du menu.
 **/
	SimpleButton:  	null, 
	/**
	 * Corps du menu.
	 * @type Node
	 */
	body:			null,
	/**
	 * Liste de sous menu.
	 * @type Node
	 */
	menu:			null,
	/**
	 * Liste des lignes enregistrés dans le sous menu.
	 * @type Object
	 */
	options:		{},
	hidden_:		true,
/**
 * new SimpleMenu([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance de [[SimpleMenu]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `overable` (`Boolean`): Si la valeur est false le menu apparaitra au clique du bouton. Par défaut le menu apparait au survol du bouton. 
 * * `icon` (`String`): Nom de l'icône à afficher.
 * * `text` (`String`): Nom du menu.
 *
 **/
	initialize: function(obj){
		
		var options = {
			overable:	true,
			icon:		'',
			text:		''
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.header =			new Node('li', {className:'wrap-header header'});
		this.content = 			new Node('ul', {className:'wrap-content simple-menu-content'}), 
		this.body = 			new Node('li', {className:'wrap-body simple-menu-body'});
		this.cursor =			new Node('div', {className:'cursor'});
		
		this.SimpleButton = 	new SimpleButton(options);
		
		this.content.appendChild(this.body);
		this.body.appendChild(this.SimpleButton);
		//
		// Popup
		//
		this.Popup = this.wrapper =		new Node('div', {className:'w-popup wrapper'}, this.cursor);
		this.Popup.content = 			new Node('div', {className:'wrap-content border shadow background'});
		this.Popup.body = this.menu = 	new Node('ul', {className:'wrapper wrap-body wrap-menu simple-menu-ssmenu'}, this.header);
		
		
		this.options = 			{};
		
		this.body.appendChild(this.Popup);
		
		this.Popup.appendChild(this.Popup.content);
		this.Popup.content.appendChild(this.Popup.body);
		
												
		this.SimpleButton.observe('mouseup', function(evt){
			if(!this.Overable()) {
				if(!this.hasClassName('empty')){
					this.Hidden(!this.hidden_);
				}
			}			
		}.bind(this), true);
				
		this.menu.on('mouseup', function(evt){Event.stop(evt)}.bind(this));
		
		this.appendChild(this.content);
		this.appendChild = this.appendChild_;
		this.removeChild = this.removeChild_;
		
		this.addClassName('empty');
		
		if(document.navigator.mobile){
			options.overable = false;
			//this.wrapper.addClassName('w-popup popup');
			//this.menu.addClassName('wrap-content border');
			//this.menu.addClassName('');
		}
		
		this.Overable(options.overable);
		
		if(options.text) this.setText(options.text);		
	},
/**
 * SimpleMenu.appendChild(line) -> SimpleMenu
 * - line (LineElement): Instance d'une ligne.
 *
 * Cette méthode ajoute un node de type [[LineElement]] au corps du menu.
 **/
	appendChild_: function(le){
		
		if(Object.isUndefined(le)) throw('Error at SimpleMenu.appendChild() : arg[0] is undefined');
		if(le.__class__ != 'lineelement'){
			this.menu.appendChild(le);
		}else{
		
			this.options[le.getText()] = le;
			
			this.menu.appendChild(le);
			le.addClassName('line-altern-' + (this.menu.childElements().length % 2));
						
			le.observe('mouseup', function(){
				this.Hidden(true);
			}.bind(this));	
		}
		
		this.removeClassName('empty');
		
		return this;
	},
/**
 * SimpleMenu.addChildAt(line, it) -> SimpleMenu
 * - line (LineElement): Instance d'une ligne.
 * - it (Number): Numéro d'insertion de la ligne.
 *
 * Cette méthode ajoute un element de type [[LineElement]] au corps du menu à l'indice `it`.
 **/
	addChildAt: function(le, i){
		if(Object.isUndefined(le)) throw('Error at SimpleMenu.addChildAt() : arg[0] is undefined');
		if(le.__class__ != 'lineelement') throw('Error at SimpleMenu.addChildAt() : arg[0] isn\'t type of LineElement.');
		
		this.options[le.getText()] = le;
				
		le.observe('mouseup', function(){
			this.Hidden(true);
		}.bind(this));
		
		this.menu.addChildAt(le, i);
		
		return this;
	},
/**
 * SimpleMenu.clear() -> void
 * 
 * Cette méthode vide le menu.
 **/
	clear: function(){
		this.menu.removeChilds();
		this.options = {};
		this.hide();
		return this;
	},
/**
 * SimpleMenu#Overable(bool) -> Boolean
 * - bool (Boolean): Valeur changeant le mode fonctionnement du menu.
 *
 * Si la valeur `bool` est vrai, le menu apparaitra au survol de la souris, dans le cas contraire il apparaitra au clique du bouton.
 **/
	Overable: function(bool){
		
		if(Object.isUndefined(bool)) return this.className.match(/overable/);
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
		
		return bool;
	},
	
	Header:function(){return this.header},
/**
 * SimpleMenu#Hidden(bool) -> Boolean
 * 
 * Cette méthode cache ou fait apparaitre le corps du menu en fonction de la valeur `bool`.
 * 
 * Si aucune valeur n'est passé, la méthode se contentera de retourné la valeur de l'état du menu
 * `true` pour caché et `false` pour apparant.
 *
 **/
	Hidden: function(bool){
		
		this.removeClassName('show');
						
		if(!Object.isUndefined(bool)){
			if(bool){
				this.hidden_ = true;
									
				
				if(!this.Overable()) {
					
					if(document.navigator.mobile && Object.isElement(this.wrapper.parentNode)){
						this.wrapper.parentNode.removeChild(this.wrapper);
					}
											
					this.parasiter = false;
					
					if(Object.isFunction(this.onmouseup_bind)){
						document.stopObserving('mouseup', this.onmouseup_bind);
						this.onmouseup_bind = null;
					}
				}
								
			}else{
				this.hidden_ = false;
				
				if(!this.Overable()) {
					this.addClassName('show');				
					this.parasiter = true;
					
					if(document.navigator.mobile){
						document.body.appendChild(this.wrapper);
						this.centralize();	
					}
					
					this.onmouseup_bind = this.onDocumentMouseDown.bind(this);
					document.observe('mouseup', this.onmouseup_bind);
				}
				
			}
		}
		
		return this.hidden_;
	},
	
	onDocumentMouseDown: function(evt){
		if(this.parasiter) {
			this.parasiter = false;
			return;	
		}
					
		Event.stop(evt);
				
		this.hidden_ = 	true;
		this.removeClassName('show');
		
		if(document.navigator.mobile){
			document.body.removeChild(this.wrapper);
		}
		
		document.stopObserving('mouseup', this.onmouseup_bind);
		this.onmouseup_bind = 	null;
	
	},
/*
 * SimpleMenu#centralize() -> SimpleMenu
 **/
	centralize: function(){
		
		this.css('top', 0).css('left', 0);
				
		var x = (this.wrapper.getWidth() - this.menu.getWidth()) / 2;
		var y = (this.wrapper.getHeight() - this.menu.getHeight()) / 2;
		
		this.Popup.content.css('top', y + 'px').css('left', x + 'px');
		
		return this;
	},
/**
 * SimpleMenu#hide() -> SimpleMenu
 *
 * Cette méthode cache le corps du menu. Seul le bouton restera apparant.
 **/
	hide: function(){
		this.Hidden(true);
		return this;
	},
/**
 * SimpleMenu#observe(eventName, callback) -> SimpleMenu
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * Tous les événéments propoposés par le DOM.
 **/
	observe: function(eventName, listener){
		this.SimpleButton.observe(eventName, listener);		
		return this;
	},
/**
 * SimpleMenu#removeChild(line) -> SimpleMenu
 * - line (LineElement): Instance d'une ligne.
 *
 * Cette méthode supprime un node de type `LineElement` du corps du menu.
 **/
	removeChild_: function(le){
		if(Object.isUndefined(le)) throw('Error at SimpleMenu#removeChild() : arg[0] is undefined');
		if(le.__class__ != 'lineelement') throw('Error at SimpleMenu#removeChild() : arg[0] isn\'t type of LineElement.');
		
		var array = {};
		
		for(var key in this.options){
			if(le.getText() == key) continue;
			array[key] = this.options[key];
		}
		
		this.options = array;
		
		this.menu.removeChild(le);
		
		if(this.menu.childElements().length == 1){
			this.addClassName('empty');
		}
		
		return this;
	},
/**
 * SimpleMenu#Selected(bool) -> SimpleMenu
 *
 * Cette méthode change l'état du bouton `SimpleMenu#SimpleButton`.
 **/	
	Selected: function(bool){
		return this.SimpleButton.Selected(bool);
	},
/*
 * SimpleMenu#select() -> SimpleMenu
 *
 * Cette méthode change l'état du bouton `SimpleMenu#SimpleButton`. Ce dernier sera séléctionné.
 **/	
	select: function(){
		this.SimpleButton.Selected(true);
		return this;
	},
/*
 * SimpleMenu#unselect() -> SimpleMenu
 *
 * Cette méthode change l'état du bouton `SimpleMenu#SimpleButton`. Ce dernier ne sera plus séléctionné.
 **/
	unselect: function(){
		this.SimpleButton.Selected(false);
		return this;
	},
/**
 * SimpleMenu#show() -> SimpleMenu
 *
 * Cette méthode forche l'apparition du corps du menu.
 **/
	show: function(){
		this.Hidden(false);
		return this;
	},
/**
 * SimpleMenu#stopObserving(eventName, callback) -> SimpleMenu
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
	stopObserving: function(eventName, listener){
		this.SimpleButton.stopObserving(eventName, listener);
		return this;
	},
	
	topChild: function(le){
		if(Object.isUndefined(le)) throw('Error at SimpleMenu.topChild() : arg[0] is undefined');
		if(le.__class__ != 'lineelement') throw('Error at SimpleMenu.topChild() : arg[0] isn\'t type of LineElement.');
		
		this.options[le.getText()] = le;
		
		this.menu.topChild(le);
		this.show();
		
		return this;
	},
/**
 * SimpleMenu.getPopup() -> Element
 *
 * Cette méthode retourne le corps du menu qui apparait et disparait au survol de la souris.
 **/
	getPopup:function(){
		return this.menu;
	},
/**
 * SimpleMenu.getChild(key) -> LineElement
 * - key (String): Nom de la ligne à récuperer.
 * 
 * Cette méthode permet de récupérer un ligne  du menu.
 **/
	getChild: function(key){
		return this.options[key];
	},
/**
 * SimpleMenu.getChilds() -> Array
 * 
 * Cette méthode  retourne toutes les lignes de l'instance.
 **/
	getChilds: function(){
		var array = [];	

		for(var key in this.options){
			array.push(this.options[key]);
		}
		return array;
	},
/**
 * SimpleMenu.setIcon(icon) -> SimpleMenu
 * - icon (String): Nom de l'icône.
 *
 * Cette méthode change l'icône du menu.
 **/
	setIcon: function(icon){
		this.SimpleButton.setIcon(icon);
		return this;
	},
/**
 * SimpleMenu.Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new SimpleMenu();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new SimpleMenu();
 *     c.Text('mon text');
 *     alert(c.Text()); //mon text
 * 
 **/
 	Text: function(text){
		if(!Object.isUndefined(text)){
			this.setText(text);	
		}
		return this.getText();
	},
/**
 * SimpleMenu.getText() -> String
 *
 * Cette méthode retourne le nom du menu.
 **/
	getText: function(text){
		return this.SimpleButton.getText();
	},
/**
 * SimpleMenu.setText(text) -> String
 * - text (String): Nouveau nom du menu.
 *
 * Cette méthode change le nom du menu.
 **/
	setText: function(text){
		this.SimpleButton.setText(text);
		
		this.header.innerHTML = '<h1>' + text + '</h1>';
		
		return this;
	},
	
	__destruct: function(){
		this.removeChild = this.removeChild_;	
		$WR.destructObject(this, false);	
	}
};
/*
 * SimpleMenu.Transform(node) -> Select
 * SimpleMenu.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance DropMenu.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[SimpleMenu]].
 *
 * #### Exemple
 *
 * #### Résultat
 * 
 **/
SimpleMenu.Transform = function(e){
	if(Object.isElement(e)){
		
		
		
		return menu;
	}
	
	var options = [];
	var i = 0;
	
	$$(e).each(function(e){
		options.push(SimpleMenu.Transform(e));
	});
	
	return options;
};
