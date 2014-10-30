/** section: UI
 * class Window < Element
 * Window est le coeur de cette bibliothèque. Elle permet de créer de fenêtre pour votre application.
 *
 * Window intègre différent élément de base de la bibliothèque Window JS. Ces éléments sont :
 *
 * * `DropMenu`: gestionnaire du menu de la fenêtre.
 * * `MinWin`: Référence vers la miniature de la fenêtre.
 *
 **/
var Window = Class.createSprite('div');
/**
 * Window.FS_NORMAL -> String
 *
 * Cette constante indique que le fullscreen doit être affiché en pleine page (ou selon les contraintes de WindowRegister.Constraint).
 **/
Window.FS_NORMAL = 	'normal';
/**
 * Window.FS_HTML5 -> String
 *
 * Cette constante indique que le fullscreen doit utiliser l'API HTML5 Fullscreen.
 **/
Window.FS_HTML5 = 	'htlm5';

Window.prototype = {
	__class__:		'window',
	className:		'wobject window radius shadow font',
	DIM_AUTO:		true,	
	CLOSABLE_:		true,
	CACHEABLE_:		true,
	RESIZABLE_:		true,
	
	fullscreenMode:	Window.FS_NORMAL,
/*
 * Window#x -> Number
 * Coordonnées en pixel de la fenêtre (readonly). 
 **/
	x:0,
/*
 * Window#y -> Number
 * Coordonnées en pixel de la fenêtre (readonly). 
 **/
	y:0,
/*
 * Window#focused -> Boolean
 * Indique si la fenêtre a le focus ou non.
 **/
	focused:	false,
	
	onClose:	'',
	onResize:	'',
	onHide:		'',
	backup:		null,
	icon:		'',
	parent:		null,
	miniature:	false,
/**
 * Window#MinWin -> MinWin
 * Référence vers la miniature de la fenêtre.
 **/
	MinWin:		null,
/**
 * Window#DropMenu -> DropMenu
 * Référence vers le gestionnaire de menu.
 **/
	DropMenu:	null,
/**
 * new Window(options)
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance de Window. Dès que vous appellez ce constructeur la fenêtre
 * est ajouté au gestionnaire de fenêtres. Il est possible d'indiquer au construteur des
 * options dont l'une permettant de ne pas ajouter la fenêtre au gestionnaire de fenêtre.
 * 
 * #### Attributs du paramètre options
 *
 * * `cacheable`: Si la valeur est `true` alors la fenêtre peut être réduite dans la barre des taches.
 * * `closable`: Si la valeur est `true` alors la fenêtre peut être fermé par l'utilisateur.
 * * `fullscreenMode`: Peut prendre les valeurs `Window.FS_NORMAL` (par défaut) ou `Window.FS_HTML5`.
 * * `icon`: Assigne une icône.
 * * `miniature`: Si la valeur est `true` sera ajouté au gestionnaire de fenêtre.
 * * `resizable`: Si la valeur est `true` alors la fenêtre peut être redimensionné.
 * * `title`: Assigne un titre à la fenêtre. 
 *
 **/
	initialize: function(obj){
		
		var options = {
			navbar:			false,
			cacheable: 		true,
			resizable:		true,
			closable:		true,
			miniature:		true,	
			fullscreenMode:	Window.FS_NORMAL,
			icon:			'default',
			title:			'',
			theme:			'default'			
		};

		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
	//#pragma region Instance
		this.backup = 		{x:$WR.Constraint().top, y:$WR.Constraint().left, width:0, height:0};
		this.constraint_ = 	{left:-1, right:-1, top:-1, bottom:-1};
		this.icon = 		'default';
		//-------------------
		//-DropMenu----------
		//-------------------
		this.DropMenu = 	options.navbar ? new NavBar(DropMenu.TOP) : new DropMenu(DropMenu.TOP);
		this.DropMenu.Chrome(true);
		this.DropMenu.addClassName('noradius');
		//this.DropMenu.addClassName('win-drop-menu');
		//-------------------
		//-Header------------
		//-------------------
		this.header = 		new Node('div', {className:'move wrap-header'});
		this.createDrag(this.header);
		/*this.on('dragstart', function(){
			this.superBody.setStyle('visibility:hidden');
		}.bind(this));
		
		this.on('dragend', function(){
			this.superBody.setStyle('visibility:visible');
		}.bind(this));*/
				
		this.setStyle('position:fixed;');
		
		//-------------------
		//-SuperBody---------
		//-------------------
		this.superBody = 	new Node('div', {className:'wrap-super-body'});
		//-------------------
		//-body--------------
		//-------------------
		this.corps = this.body = new Node('div', {className:'wrap-body win-corps'});
		//-------------------
		//-footer------------
		//-------------------
		this.footer = 		new Node('div', {className:'wrap-footer'});
		//-------------------
		//-HeaderTitle-------
		//-------------------
		this.headerTitle = 	new Node('div', {className:'font wrap-title icon-default'});
		this.headerTitle.innerHTML = 'title';
		//-------------------
		//-btn---------------
		//-------------------
		this.btnClose = 	new Node('div', {className:'btn-actions wrap-close btn-close'});
		this.btnResize = 	new Node('div', {className:'btn-actions wrap-resize btn-resize'});
		this.btnHide = 		new Node('div', {className:'btn-actions wrap-hide btn-hide'});
		//-------------------
		//-ResizerSection----
		//-------------------
		this.resizerN = 	new Node('div', {className:'wrap-resize wrap-n'});
		this.resizerS = 	new Node('div', {className:'wrap-resize wrap-s'});
		this.resizerE = 	new Node('div', {className:'wrap-resize wrap-e'});
		this.resizerW = 	new Node('div', {className:'wrap-resize wrap-w'});
		this.resizerSE = 	new Node('div', {className:'wrap-resize wrap-se'});
		this.resizerNE = 	new Node('div', {className:'wrap-resize wrap-ne'});
		this.resizerNW = 	new Node('div', {className:'wrap-resize wrap-nw'});
		this.resizerSW = 	new Node('div', {className:'wrap-resize wrap-sw'});	
		
		//#pragma endregion Instance
		
		this.appendChilds([
			this.header,
			this.superBody,
			this.resizerN,
			this.resizerS,
			this.resizerE,
			this.resizerW,
			this.resizerNE,
			this.resizerNW,
			this.resizerSE,
			this.resizerSW
		]);
		
		this.header.appendChilds([
			this.btnClose,
			this.btnResize,
			this.btnHide,
			this.headerTitle
		]);
		
		this.superBody.appendChilds([
			this.DropMenu,
			this.body,
			this.footer
		]);
					
		//#pragma region Event		
		this.on('keyup', function(evt){
			Event.stop(evt);
		});
		
		this.btnClose.observe('mousedown', function(evt){
			Event.stop(evt);
		});
		this.btnResize.observe('mousedown', function(evt){
			Event.stop(evt);
		});
		this.btnHide.observe('mousedown', function(evt){
			Event.stop(evt);
		});
		
		this.btnClose.observe('mouseup', this.onClickClose.bind(this));
		this.btnResize.observe('mouseup', this.onClickResize.bind(this));
		this.btnHide.observe('mouseup', this.onClickHide.bind(this));
		
		this.resizerN.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerS.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerE.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerW.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerNW.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerNE.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerSE.observe('mousedown', this.onMouseDownResize.bind(this));
		this.resizerSW.observe('mousedown', this.onMouseDownResize.bind(this));
		
		this.observe('drag', this.onSnapBox.bind(this));
		this.header.on('click', function(){
			this.focus();
		}.bind(this));
		//#pragma endregion Instance

		
		
		this.Cacheable(options.cacheable);
		this.Resizable(options.resizable);
		this.Closable(options.closable);
		
		this.setFullscreenMode(options.fullscreenMode);
		
		if(options.miniature) {
			this.on('dragend', this.focus.bind(this));
			this.observe('mousedown', this.focus.bind(this));
			
			this.MinWin = new MinWin(this);
			$WR.push(this);
		}
		
		this.miniature = options.miniature;
			
		this.setIcon(options.icon);
		this.setTitle(options.title);
		this.setTheme(options.theme);
		
		this.superAppendChild = this.appendChild;
/**
 * Window#appendChild(node) -> Window
 * - node (Node): Element à ajouter.
 *
 * Cette méthode ajoute un élément au corps de la fenêtre.
 **/
		this.appendChild = function(node){
			this.body.appendChild(node);
			return this;
		};
/**
 * Window#appendChildAt(node, it) -> Window
 * - node (Node): Element à ajouter.
 * - it (Number): Indice d'insertion.
 *
 * Cette méthode ajoute un élément à une position `it` au corps de la fenêtre.
 *
 * ##### Exemple
 *
 * Admettons que dans l'exemple suivant, ce soit le corps de la fenêtre et que ce dernier contient trois éléments. On souhaite en ajouter un
 * élément :
 *
 *     //<div class="win-body"> //corps de la fenetre
 *           //<div>elem1</div>
 *           //<div>elem2</div>
 *           //<div>elem3</div>
 *     //</div>
 *     //on ajoute un élement
 *     win.appendChildAt(new Node('div', 'elem4'), 1);
 *     //Résultat 
 *     //<div class="win-body"> //corps de la fenetre
 *          
 *           //<div>elem1</div> //0
 *           //<div>elem4</div>
 *           //<div>elem2</div> //1
 *           //<div>elem3</div> //2
 *     //</div>
 *
 **/
		this.appendChildAt = function(node, it){
			this.body.appendChilds(node, it);
			return this;
		};
/**
 * Window#appendChilds(array) -> Window
 * - array (Array): Tableau d'élément à ajouter.
 *
 * Cette méthode ajoute un tableau d'élément au corps de la fenêtre.
 **/
		this.appendChilds = function(array){
			this.body.appendChilds(array);
			return this;
		};
		this.topChild = function(node){
			this.body.topChild(node);
			return this;
		};
/**
 * Window#top(node) -> Window
 * - node (Node): Element à ajouter.
 *
 * Cette méthode ajoute un élément en haut du corps de la fenêtre.
 *
 * ##### Exemple
 *
 * L'exemple suivant ajoute un nouveau noeud au corps de la fenêtre avec la méthode Window.top() :
 *
 *     //<div class="win-body"> //corps de la fenetre
 *           //<div>elem1</div>
 *           //<div>elem2</div>
 *           //<div>elem3</div>
 *     //</div>
 *     //on ajoute un élement
 *     win.top(new Node('div', 'elem4'));
 *     //Résultat 
 *     //<div class="win-body"> //corps de la fenetre
 *           //<div>elem4</div>
 *           //<div>elem1</div>
 *           //<div>elem2</div>
 *           //<div>elem3</div>
 *     //</div>
 *
 **/
		this.top = function(node){
			this.body.topChild(node);
			return this;
		};
/**
 * Window#removeChild(node) -> Window
 * - node (Node): Element à supprimer.
 *
 * Cette méthode supprime un noeud du corps de la fenêtre.
 **/
		this.removeChild_back = this.removeChild;
		this.removeChild = function(node){
			this.body.removeChild(node);
			return this;	
		};
			
		this.focus();
		/**
		 * @ignore
		 */
		this.footer.show = function(){
			this.addClassName("show");
		};
	},

	destroy: function(){
		
		this.destroy = 		null;
		this.className = 	'';
		
		if(Object.isElement(this.parentNode)){
			this.parentNode.removeChild(this);
		}
				
		this.removeChild = 	this.removeChild_back;
		this.removeChilds = this.removeChilds_back;	
		
		$WR.reject(this);
		
		this.MinWin.window = 	null;
		this.MinWin = 			null;
		
		try{
			this.removeDrag();
		}catch(er){}
		
		try{
			this.stopObserving('drag', this.onSnapBox.bind(this));
		}catch(er){}
		
		this.stopObserving();
		
	},
/**
 * Window#createScrollBar() -> ScrollBar
 *
 * Cette méthode créée une barre de défilement.
 **/
 	createScrollBar: function(){
		//
		// wrapper
		//
		this.wrapper = 	new Node('div', {className:'wrapper'});
		
		var childs = this.body.childElements();
		
		if(childs.length){
			this.wrapper.appendChilds(childs);
		}
		
		this.body.appendChild(this.wrapper);	
		this.ScrollBar = new ScrollBar({node:this.body, wrapper:this.wrapper, type:'vertical'});
		
		this.body.appendChild = function(e){
			this.wrapper.appendChild(e);
			try{
				this.ScrollBar.update();	
			}catch(er){}
			return this;
		}.bind(this);
		
		this.body.removeChild = function(e){
			this.wrapper.removeChild(e);
			try{
				this.ScrollBar.update();	
			}catch(er){}
			return this;
		}.bind(this);
		
		return this.ScrollBar;
	},
/**
 * Window#Backup(backup) -> Object
 * - backup (Object): Information sur les coordonnées et dimensions de la fenêtre.
 *
 * Cette méthode sauvegarde les dimensions et les coordonnées de la fenêtre.
 * Elle retourne l'objet de sauvegarde généré.
 *
 **/
	Backup: function(backup){
		
		if(!Object.isUndefined(backup)){
			Object.extend(this.backup, backup);
		}else{
			try{
				this.backup = {
					x:		this.positionedOffset().left,
					y:		this.positionedOffset().top,
					width:	this.body.css('width'),
					height:	this.body.css('height')
				};
			}catch(er){}
		}
		
		return this.backup;
	},
	
	cloneBackup:function(){
		var backup = {};
		Object.extend(backup, this.backup);
		return backup;
	},
/** alias of: Window#Focused
 * Window#blur() -> Window
 *
 * La fenêtre perd le focus. C'est-à-dire qu'elle n'est plus par dessus les autres fenêtres.
 **/
	blur:function(){this.Focused(false);return this;},
/**
 * Window#Cacheable([bool]) -> Boolean
 * - bool (Boolean): `true` pour activer le bouton pour réduire la fenêtre `false` pour le de désactiver.
 *
 * Active ou désactive le bouton de réduction de la fenêtre dans la barre des tâches si `bool` est passé en paramètre.
 * Dans tous les cas la méthode retourne l'etat du bouton.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
 	Cacheable:function(bool){
		if(Object.isUndefined(bool)) return this.CACHEABLE_;
		
		this.removeClassName('cacheable');
		
		if(bool){
			this.addClassName('cacheable');
			this.btnHide.show();
		}else{
			this.btnHide.hide();
		}
	
		return this.CACHEABLE_ = bool;
	},
/**
 * Window#centralize([bool]) -> Window
 * - bool (Boolean): Désactive le comportement de redimensionnement automatique de la fenêtre.
 *
 * Cette méthode centre la fenêtre par rapport au conteneur parent. 
 **/
	centralize: function(bool){
		this.moveTo(0,0);
		
		if(Object.isUndefined(bool)) this.resizeTo('', '');
		
		if(this.parent == null){
			var x = (document.stage.stageWidth - this.getWidth()) / 2;
			var y = (document.stage.stageHeight - this.getHeight()) / 2;
		}else{
			var x = this.parent.cumulativeOffset().left + ((this.parent.getWidth() - this.getWidth()) / 2);
			var y = this.parent.cumulativeOffset().top + ((this.parent.getHeight() - this.getHeight()) / 2);
		}	
		
		//alert(this.stageHeightMax());
			
		if(this.stageWidth() > this.stageWidthMax() && this.stageHeight() > this.stageHeightMax()){
			
			this.resizeTo(document.stage.stageWidth, document.stage.stageHeight);
			x = 0;
			y = 0;
		}else{
			
			if(this.stageWidth() > this.stageWidthMax()){
				this.resizeTo(document.stage.stageWidth, '');
				x = 0;
			}
			
			if(this.stageHeight() > this.stageHeightMax()){
				this.resizeTo('',document.stage.stageHeight);
				y = 0;
			}
		}
					
		this.moveTo(x, y);
		
		return this;
	},
/**
 * Window#clear() -> Window
 *
 * Cette méthode réinitialise la fenêtre.
 **/
	clear: function(){
		this.headerTitle.innerHTML = '';
		this.body.removeChilds();
		return this;
	},
/**
 * Window#createTabControl() -> TabControl
 *
 * Cette méthode créée une instance [[TabControl]] et configure la fenetre.
 **/
 	createTabControl: function(obj){
		
		var options = {
			offset:		0,
			border:		false,
			maximize:	false,
			auto:		false,
			type:		'top'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.ChromeSetting(true);
		this.addClassName('tabcontrol');
		
		this.TabControl =	new TabControl(options);
		
		if(options.type == 'top') {
			var self = 		this;
			var oTitle = 	this.headerTitle.innerHTML;
			
			this.headerTitle.innerHTML = '';
			this.headerTitle.appendChild(this.TabControl.header);
			
			this.TabControl.on('change:orientation', function(){
				
				if(this.hasClassName('left')){
					self.headerTitle.innerHTML = oTitle;
					this.top(this.header);
				}else{
					this.headerTitle.innerHTML = '';
					this.headerTitle.appendChild(this.TabControl.header);
				}
			});
		}
		
		this.Body().appendChild(this.TabControl);
		
		if(options.border) {
			this.TabControl.SuperBody().addClassName('border');
		}
		
		if(options.maximize){
			
			this.TabControl.addClassName('maximize');
			
			this.observe('resize', function(){
				if(!this.Hidden()){
					this.select('.panel').each(function(e){	
						if(e.parentNode.parentNode.parentNode.className.match(/maximize/) && !e.match(/widgets/)){			
							var height = this.stageHeight() - parseInt(e.getStyle('padding-top')) * 2;
							e.setStyle('height:' + height + 'px');
						}
					}.bind(this));
				}
			});	
		}
				
		return this.TabControl;
	},
/**
 * Window#Header() -> Element
 * 
 * Cette méthode retourne l'élément d'entete de la fenêtre.
 **/	
	Header: function(){
		return this.header;
	},
/**
 * Window#Body() -> Element
 * 
 * Cette méthode retourne l'élément principal de la fenetre.
 **/	
	Body: function(){
		return this.body;
	},
/**
 * Window#Footer() -> Element
 * 
 * Cette méthode retourne l'élément pied de page de la fenêtre.
 **/	
	Footer: function(){
		return this.footer;
	},
/**
 * Window#createBox() -> AlertBox
 *
 * Cette méthode créée une nouvelle boite de dialogue relative à l'instance [[AlertBox]].
 **/
	createBox: function(){
	
		if(!Object.isUndefined(this.AlertBox)) return this.AlertBox;

		this.AlertBox = new AlertBox();
		this.AlertBox.setAbsolute(true);
		this.superBody.appendChild(this.AlertBox);
		
		return this.AlertBox;
	},
/**
 * Window#createForm() -> Extends.Form
 *
 * Cette méthode Cette méthode une instance Form.
 **/
	createForm: function(obj){
		
		if(this.Form != null){
			if(!Object.isUndefined(this.Form)) return this.Form;
		}
		this.Form = this.form = this.forms = new Extends.Form(obj);
		
		return this.Form;
	},
	
	destroyForm: function(){
		this.Form = this.form = this.forms = null;	
	},
/**
 * Window#Closable([bool]) -> Boolean
 * - bool (Boolean): `true` pour activer le bouton de fermeture `false` pour le de désactiver.
 *
 * Active ou désactive le bouton de fermeture si `bool` est passé en paramètre.
 * Dans tous les cas la méthode retourne l'etat du bouton.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	Closable:function(bool){
		if(Object.isUndefined(bool)) return this.CLOSABLE_;
		
		this.removeClassName('closable');
		
		if(bool){
			this.addClassName('closable');
		}
		
		return this.CLOSABLE_ = bool;
	},
/**
 * Window#close() -> void
 *
 * Cette méthode ferme la fenêtre et supprime l'instance. 
 **/
	close: function(){
		this.fire('window:close', null, false);
		if(Object.isFunction(this.destroy)) this.destroy();
	},
/** alias of: Window#Focused
 * Window#focus() -> Window
 *
 * Donne le focus à la fenêtre. Cette dernière demande à WindowRegister de la mettre en premier plan
 * par rapport aux autres fenêtres enregistrées. WindowsRegister s'occupe de remettre le fenêtre avec un
 * z-index égale à zero.
 **/
	focus: function(){this.Focused(true);return this;},
/**
 * Window#Focused([bool]) -> Boolean
 * - bool (Boolean): `true` pour donner le focus, `false` pour le faire perdre.
 *
 * Cette méthode donne le focus ou fait perdre le focus en fonction de la valeur de `bool`.
 * Dans tous les cas la méthode retourne l'etat du focus.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	Focused: function(bool){
		if(this.miniature){
			if(!Object.isUndefined(bool)){
				if(bool){
					
					$WR.focus(this);
					
					this.focused = true;
					
					this.fire('focus', null, false);
					
				}else{
					this.setStyle({zIndex:'100'});	
					this.focused = false;
					this.fire('blur', null, false);
				}
			}
		}
		return this.focused;
	},
/**
 * Window#setFullscreenMode(mode) -> Window
 * - mode (Window.FS_NORMAL | Window.FS_HTML5): Mode d'affichage.
 *
 * Cette méthode change le type d'affichage du mode Fullscreen.
 *
 * <p class="note">Implémenté depuis la version 5.2</p>
 **/
 	setFullscreenMode: function(mode){
		switch(mode){
			case Window.FS_NORMAL:
				this.fullscreenMode = mode;
				break;	
			case Window.FS_HTML5:
			
				if(document.navigator.html5.FullScreen){
					this.fullscreenMode = mode;
				}else{
					this.fullscreenMode = Window.FS_NORMAL;
				}			
				
				break;	
		}
			
	},
/**
 * Window#Fullscreen(bool) -> Boolean
 * - bool (Boolean): Change l'état de la fenêtre.
 *
 * Met en plein écran ou  restitue la taille d'origine de la fenêtre en fonction du paramètre `bool`. Si la valeur est à `true` alors 
 * la fenêtre sera affichée en plein écran. Dans le cas contraire la fenêtre reprendra sa configuration d'origine.
 *
 **/	
	Fullscreen:function(bool){
		if(Object.isUndefined(bool)){
			return this.hasClassName('fullscreen');	
		}
		
		bool = Object.isUndefined(bool) ? false : bool;
				
		if(this.Hidden()){
			this.Hidden(false);			
		}
		
		if(bool){
			if(!this.hasClassName('fullscreen') && !this.hasClassName('html5')){
				this.Backup();
			}
			
			this.addClassName('fullscreen');
			
			this.resizeTo(document.stage.stageWidth, document.stage.stageHeight);
			this.moveTo($WR.constraint_.left, $WR.constraint_.top);
			
		}else{//restauration des données
			
			this.removeClassName('fullscreen');
			
			if(this.hasClassName('html5')){
				if(Object.isFunction(this.fn)){
					Extends.stopObserving('resize', this.fn);
					this.fn = null;
				}
				
				this.cancelFullScreen();
				this.removeClassName('html5');
			}
			
			var backup = this.cloneBackup();
			
			this.setStyle({
				left:	backup.x + 'px', 
				top:	backup.y + 'px'
			});
			
			//if(this.hasClassName('tab'
			this.body.setStyle({
				width: 	backup.width + 'px',
				height: backup.height + 'px'
			});
			
			this.fire('window:resize', null, false);
			
			try{
				this.ScrollBar.update();	
			}catch(er){}
		}
		
		return this.hasClassName('fullscreen');
	},
/* alias of: Window#Fullscreen
 * Window#fullscreen() -> Window
 * 
 * Affiche la fenêtre en plein écran.
 **/
	fullscreen: function(){
		this.Fullscreen(true);
		return this;
	},
/**
 * Window#Hidden(bool) -> Boolean
 * - bool (Boolean): Change l'état de la fenêtre.
 *
 * Cache ou fait apparaitre la fenêtre en fonction du paramètre `bool`. Si la valeur est à `true` alors 
 * la fenêtre sera cachée. Dans le cas contraire la fenêtre sera affichée.
 *
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/	
	Hidden: function(bool){
		
		if(Object.isUndefined(bool)) return this.hasClassName('hidden');
		//this.hidden_ = bool;
		this.removeClassName('hidden');
		
		if(!bool){
						
			this.focus();
			
			if(this.Fullscreen()){//restauration des paramètres du fullscreen	
				this.resizeTo(document.stage.stageWidth, document.stage.stageHeight);		
				//this.moveTo(this.backup.x, this.backup.y);
			}else{
						
				try{
					if(!$WR.TaskBar()){
						var backup = this.cloneBackup();
						
						this.setStyle({
							left:	backup.x + 'px', 
							top:	backup.y + 'px'
						});
						
					}
					
				}catch(er){}
				
				this.fire('window:resize', null, false);
			}
		}else{//demande 
						
			this.addClassName('hidden');
			
			if(!$WR.TaskBar()){
				this.Backup();
				
				var x = $WR.constraint_.left;
				$$('.window.hidden').each(function(win){
					win.css('top', $WR.constraint_.top).css('left', x);
					x += win.getWidth();
				});
			}
			
		}
		
		return this.hasClassName('hidden');
	},
/**
 * Window#hide() -> Window
 *
 * Réduit la fenêtredans la barre des taches.
 **/
	hide: function(){
		this.Hidden(true);
		return this;
	},
/**
 * Window#moveTo(x, y) -> Window
 * - x (Number): Coordonnée en pixel.
 * - y (Number): Coordonnée en pixel.
 *
 * Cette méthode change la position de la fenêtre.
 **/
	moveTo:function(x, y){
		
		//mesure de padding	
		if(Object.isString(x)){
			if(x == 'left'){
				x = $WR.constraint_.left;
			}
			if(x == 'right'){
				var dim = 		this.getDimensions();
				x = 			document.stage.stageWidth - dim.width;
			}
		}
		if(Object.isString(y)){
			if(y == 'top'){
				y = $WR.constraint_.top;
			}
			if(y =='bottom'){
				var dim = 		this.getDimensions();
				y = 			document.stage.stageHeight - dim.height;
			}
		}
		
		this.x = x < $WR.Constraint().left ?  $WR.Constraint().left : x;
		this.y = y < $WR.Constraint().top ?  $WR.Constraint().top : y;
		
		this.css('top',this.y).css('left', this.x);
		
		//this.backup.y = 	this.y;
		//this.backup.x = 	this.x;
				
		return this;
	},
/**
 * Window#NoChrome(bool) -> Boolean
 * - bool (Boolean): Change l'état de la fenêtre.
 *
 * Enlève les bordures de la fenêtre ainsi que l'entête de la fenêtre.
 *
 * <p class="note">Implémenté depuis la version 2.4</p>
 **/	
	NoChrome: function(bool){
		if(Object.isUndefined(bool)) return this.noChrome;
		
		this.removeClassName('no-chrome');
		this.removeClassName('radius');
		
		if(bool){
			this.removeClassName('radius');
			this.addClassName('no-chrome');
		}
		
		return this.noChrome = bool;
	},
/**
 * Window#ChromeSetting(bool) -> Boolean
 * - bool (Boolean): Change l'état de la fenêtre.
 *
 * Configure la fenêtre avec le style CSS window-setting.
 *
 * <p class="note">Implémenté depuis la version 2.4</p>
 **/	
	ChromeSetting: function(bool){
		if(Object.isUndefined(bool)) return this.chromesetting;
		
		this.removeClassName('setting');
		
		if(bool){
			this.addClassName('setting');
		}
		
		return this.chromesetting = bool;
	},
/**
 * Window#observe(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `close` : Appelle la fonction lors de la fermeture.
 * * `resize` : Appelle la fonction lors du redimensionnement de la fenêtre.
 * * `hide` : Appelle la fonction lors de la disparition de la fenêtre. 
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			case 'close':this.observe('window:close', callback);break;
			case 'resize':this.observe('window:resize', callback);break;
			case 'hide':this.observe('window:hide', callback);break;
			default:
				Event.observe(this, eventName, callback);
				break;	
		}
		return this;
	},
/**
 * Window#open(options) -> Window
 * - options (Object): Objet de configuration d'une fenêtre.
 *
 * Cette méthode ouvre une fenêtre enfant.
 **/
	open: function(options){
		
		var Win = new Window(options);
		Win.opener = this;
		this.appendChild(Win);
		
		var pos = this.positionedOffset();
		
		Win.moveTo(pos.left + 10, pos.top + 10);
		
		this.focus();
		this.on('close', function(){this.close()}.bind(Win));
		
		return Win;
	},
/**
 * Window#overrideClose(options) -> void
 * - options (Object): Options de configuration de la méthode.
 * 
 * Cette méthode surchage la méthode [[Window#close]] et permet d'afficher une boite de dialogue sur chaque tentative de fermeture de l'instance.
 * Une demande de confirmation sera demandé à l'utilisateur avant toute destruction de l'instance [[Window]].
 *
 * <p class="note">La méthode [[Window#close]] sera sauvegardé dans [[Window#forceClose]].</p>
 *
 *
 **/
 	overrideClose: function(obj){return this.overideClose(obj)},
 	overideClose: function(obj){
		
		var options = {
			change: new Function(),
			submit:	new Function(),
			reset:	new Function(),
			close:	new Function()
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);	
		}
		
		this.createBox();
		
		this.observe('close', options.close);
		this.forceClose = this.close;
		
		this.close = function(){
			this.AlertBox.hide();
			
			if(this.Hidden()){
				this.Hidden(false);
			}
			
			this.focus();
			
			if(options.change.call(this, this)){
				
				var splite = SpliteWait($MUI('La formulaire a subit des modifications. Voulez-vous vraiment quitter ?'));
				var submit = new SimpleButton({text:$MUI('Sauvegarder et quitter'), icon:'filesave', type:'submit'});
				
				this.AlertBox.ti($MUI('Confirmation de fermeture')).ty().as([splite]).show();
				this.AlertBox.submit({
					text:	$MUI('Quitter sans sauvegarder'),
					icon:	'file-revert',
					type:	'normal',
					click:	function(){					
						if(options.reset.call(this, this, 'close')) return;
						
						this.fire('window:close', null, false);
						this.__destruct();
						
					}.bind(this)
				});
				
				this.AlertBox.reset({icon:'cancel'});
				
				this.AlertBox.box.footer.top(submit);
				
				submit.on('click',function(){
					if(options.submit.call(this, this, 'saveAndClose')) return;
					
					this.fire('window:close', null, false);
					
					try{
						this.__destruct();
					}catch(er){}
					
				}.bind(this));
				
				this.focus();
				
				return;	
			}
			
			this.fire('window:close', null, false);
			
			this.__destruct();
			//options.close.call(this, this);
		};
	},
/**
 * Window#Resizable([bool]) -> Boolean
 * - bool (Boolean): `true` pour activer le bouton de redimensionnement `false` pour le de désactiver.
 *
 * Active ou désactive le bouton de redimensionnement si `bool` est passé en paramètre.
 * Dans tous les cas la méthode retourne l'etat du bouton.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	Resizable:function(bool){
		if(Object.isUndefined(bool)) return this.RESIZABLE_;
		
		this.removeClassName('resizable');
		
		if(bool){
			this.addClassName('resizable');
		}
		
		return this.RESIZABLE_ = bool;	
	},
/**
 * Window#resizeTo() -> Window
 * Window#resizeTo(width, height) -> Window
 * width (Number): Largeur de la fenêtre en pixel.
 * height (Number): Hauteur de la fenêtre en pixel.
 *
 * Redimensionne la fenêtre en fonction des paramètres largeur et hauteur passés (en pixel).
 *
 * #### Exception pour Win.TabControl
 *
 * Si vous avez utiliser la méthode [[Window#createTabControl]], la méthode sans paramètre redimensionnera les panneaux du [[TabControl]] plutôt que la fenêtre.
 **/
	resizeTo:function(width, height, bool){
		
		if(Object.isUndefined(width)){
			if(this.TabControl){
				var panels = 	$A(this.Body().select('.panel'));
				var height =	 this.stageHeightMax()-21;
				
				panels.each(function(panel){
					panel.show();
					
					if(panel.getDimensions().height > height){
						this.moveTo(0, 0);
						panel.css('height', height);
					}
					
					panel.hide();
				}.bind(this));
				
				this.fire('window:resize', null, false);
				
				return;		
			}
		}
		
		if(document.navigator.client == 'IE' && document.navigator.version < 8){
			if(this.stageWidth() > 0){
				//this.css('width', '');
				//this.css('width', (this.stageWidth() + this.superBody.css('padding-left') + this.superBody.css('padding-right') + 50) + 'px');
			}
		}else{	
			this.body.css('width','auto').css('height','auto');
		}
		
		if(width != "" && width != 'auto'){ 
			
			var widthCalc = 	this.stageWidthMax();
			
			if(width > widthCalc){
				this.body.css('width', widthCalc);
			}else{
				this.body.css('width', width);
			}			
		}
		
		if(height != "" && height != 'auto'){
			var heightCalc = 	this.stageHeightMax();
			
			if(height > heightCalc){
				this.body.css('height',heightCalc);
			}else{
				this.body.css('height', height);
			}
		}
		
		this.fire('window:resize', null, false);
		
		try{
			this.ScrollBar.update();	
		}catch(er){}
		
		this.DIM_AUTO = Object.isUndefined(bool) || bool;
		return this;
	},
/**
 * Window#show() -> Window
 *
 * Cette méthode fait apparaitre la fenêtre.
 **/
	show: function(){
		this.Hidden(false);
		return this;
	},
/**
 * Window#stopObserving(eventName, callback) -> Window
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'close':this.stopObserving('window:close', callback);break;
			case 'resize':this.stopObserving('window:resize', callback);break;
			case 'hide':this.stopObserving('window:hide', callback);break;
			default:
				Event.stopObserving(this, eventName, callback);
				break;	
		}
		return this;
	},
/**
 * Window#Title(title) -> String
 * - title (String): Le titre de la fenêtre.
 *
 * Assigne et/ou retourne le titre de la fenêtre.
 *
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
 	Title: function(title){
		if(!Object.isUndefined(title)){
			this.headerTitle.innerHTML = Object.isUndefined(title) ? '' : title;
		}
		return this.headerTitle.innerHTML;
	},
	
/*
 * Alias de méthode. Ces méthodes sont dépréciés mais gardé pour la rétrocompatibilité.
 **/
	activeClose: function(){this.Closable(true);return this;},
	activeResize: function(){this.Resizable(true);return this;},
	activeHide: function(){this.Cacheable(true);return this;},
	deactiveClose: function(){this.Closable(false);return this;},
	deactiveResize: function(){this.Resizable(false);return this;},
	deactiveHide: function(){this.Cacheable(false);return this;},
	noResize: function(bool){this.Resizable(bool);return this;},	
	positionWindow: function(){return this.centralize();},
	remove:function(){return this.clear();},
/**
 * Window#onClickHide(evt) -> void
 **/
	onClickHide: function(evt){
		if(evt && Object.isFunction(evt.stop)){
			evt.stop();
		}
		
		this.Hidden(!this.Hidden());
	},
/**
 * Window#onClickResize(evt) -> void
 **/
	onClickResize: function(evt){
		
		if(evt && Object.isFunction(evt.stop)){
			evt.stop();
		}
		
		if(this.fullscreenMode == Window.FS_HTML5){
			
			if(!this.hasClassName('fullscreen')){
				
				this.Backup();
				
				this.addClassName('html5');
				
				var elem = this;
				elem.requestFullScreen();
				elem.setOpacity(0);
				
				new fThread(function(){
					
					this.Fullscreen(true);
					elem.setOpacity(1);
					
					Extends.observe('resize', this.fn = function(){
						this.Fullscreen(false);
					}.bind(this));
					
				}.bind(this), 0.2);
				
			}else{
				this.Fullscreen(!this.Fullscreen());
			}
														
		}else{
			this.Fullscreen(!this.Fullscreen());
		}
		
	},
/**
 * Window#onClickClose(evt) -> void
 **/
	onClickClose: function(evt){
		try{evt.stop();}catch(er){}
				
		if(Object.isFunction(this.close)) this.close();
	},
/**
 * Window#onMouseDownResize(evt) -> void
 **/
	onMouseDownResize: function(evt){
		this.currentTarget = evt.target;
		this.currentBind = this.onMouseMoveResize.bind(this);
		this.currentBindStop = this.onMouseUpResize.bind(this);
				
		this.options = {
			startX: 	Event.pointerX(evt),
			startY: 	Event.pointerY(evt),
			x:			this.positionedOffset().left,
			y:			this.positionedOffset().top,
			width:		this.body.css('width'),
			height:		this.body.css('height')
		};
		
		document.observe('mousemove', this.currentBind);
		document.observe('mouseup', this.currentBindStop);
		this.observe('mouseup', this.currentBindStop);
	},
/**
 * Window#onMouseMoveResize(evt) -> void
 **/
	onMouseMoveResize: function(evt){
		
		var Coord = {
			x: Event.pointerX(evt),
			y: Event.pointerY(evt)
		};
		
		if($WR.Constraint().left >= 0){
			Coord.x = Coord.x < $WR.Constraint().left ? $WR.Constraint().left : Coord.x;
		}
		
		if($WR.Constraint().right >= 0){
			Coord.x = (Coord.x + this.getWidth()) < $WR.Constraint().right ? Coord.x : ($WR.Constraint().right - this.getWidth());
		}
			
		if($WR.Constraint().bottom >= 0){
			Coord.y = (Coord.y + this.getHeight()) < $WR.Constraint().bottom ? Coord.y : ($WR.Constraint().bottom - this.getHeight());
		}
		
		if($WR.Constraint().top >= 0){
			Coord.y = Coord.y < $WR.Constraint().top ? $WR.Constraint().top : Coord.y;
		}
		
		Coord.deltaX = Coord.x - this.options.startX;
		Coord.deltaY = Coord.y - this.options.startY;
		
		var options = {};
		
		Object.extend(options, this.options);
		
		switch(this.currentTarget.className){
			case 'wrap-e':
				options.width = 	this.options.width + Coord.deltaX;
				break;
			case 'wrap-se':
				options.width = 	this.options.width + Coord.deltaX;
				options.height = 	this.options.height + Coord.deltaY;
				break;
			case 'wrap-s':
				options.height = 	this.options.height + Coord.deltaY;
				break;
			
			case 'wrap-n':
				if(Coord.y > this.options.startY){
					return;
				}
				options.y = 		Coord.y;
				options.height = 	this.options.height - Coord.deltaY; 
				break;
				
			case 'wrap-ne':
				if(Coord.y <= this.options.startY){
					options.y = 		Coord.y;
					options.height = 	this.options.height - Coord.deltaY;
				}
				
				options.width = 	this.options.width + Coord.deltaX;	
				break;
			
			case 'wrap-w':
				if(Coord.x > this.options.startX){
					return;
				}
				options.x = 		Coord.x;
				options.width = 	this.options.width - Coord.deltaX;
				break;
			case 'wrap-sw':
				if(Coord.x <= this.options.startX){
					options.x = 		Coord.x;
					options.width = 	this.options.width - Coord.deltaX;
				}
				options.height = 	this.options.height + Coord.deltaY;
				
				break;
			case 'wrap-nw':
				if(Coord.x <= this.options.startX){
					options.x = 		Coord.x;
					options.width = 	this.options.width - Coord.deltaX;
				}
				
				if(Coord.y <= this.options.startY){
					options.y = 		Coord.y;
					options.height = 	this.options.height - Coord.deltaY;
				}
				break;
		}
		
		if(options.width > 200) {
			this.body.setStyle({width: options.width + 'px'});
			this.setStyle({left: options.x  +'px'});
		}
		
		if(options.height > 50){
			this.body.setStyle({height: options.height + 'px'});
			this.setStyle({top: options.y  +'px'});
		}
		
		this.fire('window:resize', null, false);
	},
/**
 * Window#onMouseUpResize(evt) -> void
 **/
	onMouseUpResize: function(evt){
		Event.stop(evt);
		
		if(Object.isFunction(this.currentBind)){
			document.stopObserving('mousemove', this.currentBind);
			document.stopObserving('mouseup', this.currentBindStop);
			this.stopObserving('mouseup', this.currentBindStop);
		}
		
		this.currentTarget = null;
		this.currentBind = null;
		this.currentBindStop = null;
	},
/**
 * Window#onMouseDownResizeDrag(evt) -> void
 **/
	onMouseDownResizeDrag: function(evt){
		if(evt && Object.isFunction(evt.stop)){
			evt.stop();
		}
		
		this.onmousemove_bind = this.onMouseMoveResize.bind(this);
		this.onmouseup_bind = this.onMouseUpResize.bind(this);
		
		document.observe('mousemove', this.onmousemove_bind);
		document.observe('mouseup', this.onmouseup_bind);
		
	},
/**
 * Window#onSnapBox(evt) -> void
 **/
	onSnapBox: function(evt){

		var Coord = this.positionedOffset();
		var bool = false;
		
		if($WR.Constraint().left >= 0){
			Coord.left = Coord.left < $WR.Constraint().left ? $WR.Constraint().left : Coord.left;
		}
		
		if($WR.Constraint().right >= 0){
			Coord.left = (Coord.left + this.getWidth()) < $WR.Constraint().right ? Coord.left : ($WR.Constraint().right - this.getWidth());
		}
			
		if($WR.Constraint().bottom >= 0){
			Coord.top = (Coord.top + this.getHeight()) < $WR.Constraint().bottom ? Coord.top : ($WR.Constraint().bottom - this.getHeight());
		}
		
		if($WR.Constraint().top >=0){
			Coord.top = Coord.top < $WR.Constraint().top ? $WR.Constraint().top : Coord.top;
		}
		
		
		//this.backup.x = this.x = Coord.left;
		//this.backup.y = this.y = Coord.top;
					
		this.css('top', Coord.top).css('left', Coord.left);
		
		this.fire('window:snap', null, false);
	},
/** alias of: Window#Title
 * Window#getTitle() -> String
 * 
 * Retourne le titre de la fenêtre.
 **/
	getTitle: function(){
		return this.Title();
	},
/** alias of: Window#Title
 * Window#setTitle(txt) -> Window
 * 
 * Assigne un nouveau titre à la fenêtre.
 **/
	setTitle: function(txt){
		this.Title(txt);
		return this;
	},
/**
 * Window#setAbsolute(bool) -> Window
 * - bool (Boolean): Si la valeur est vrai alors le positionnement de la fenêtre sera en absolue. Par defaut la valeur est false.
 * 
 * Cette méthode change le comportement de la fenêtre pour le calcul de sa position. Par défaut le positionnement 
 * de la fenêtre est calculé par rapport à la fenêtre du navigateur (en CSS `position:fixed`). En utilisant
 * cette méthode, la fenêtre va calculé sa position par rapport à l'élément parent et sa valeur CSS prendra `position:absolute`.
 **/
	setAbsolute: function(bool, node){
		this.parent = bool ? (Object.isUndefined(node) ? this.parentNode : node) : null;
		return this;
	},
	/**
	 * @ignore
	 */
	setContent: function(elem){
		this.appendChild(elem);
		return this;
	},
/**
 * Window#stageHeight() -> Number
 *
 * Retourne la hauteur du corps de la fenêtre.
 **/
	stageHeight: function(){
		var parent = this.parentNode;
		
		if(parent == null){
			document.body.appendChild(this);
		}
		
		var n =  1 * this.body.css('height');
		
		if(parent == null){document.body.removeChild(this);}
		
		return n;
	},
/**
 * Window#stageHeightMax() -> Number
 *
 * Cette méthode retourne la hauteur maximal que peut avoir la fenêtre.
 **/
	stageHeightMax: function(){
		
		var parent = this.parentNode;
		
		if(parent == null){
			document.body.appendChild(this);
		}
		
		var options = {
			stage:			document.stage.stageHeight,
			header:			1 * this.header.getHeight(),
			menu:			this.DropMenu.css('display') == 'none' ? 0 : 1 * this.DropMenu.getHeight(),
			footer:			1 * this.footer.getHeight(),
			borderTop:		this.css('border-top-width') + this.body.css('border-top-width'),
			borderBottom:	this.css('border-bottom-width') + this.body.css('border-bottom-width'),
			marginTop:		this.superBody.css('padding-top'),
			marginBottom:	this.superBody.css('padding-bottom')
		};
		
		if(this.fullscreenMode == Window.FS_HTML5 && this.hasClassName('fullscreen') && this.hasClassName('html5')){
			options.stage =	this.getHeight();
		}else{
			if($WR.constraint_.top > -1){
				var top = $WR.constraint_.top >= 0 ? $WR.constraint_.top : 0;
				options.stage -= top;
			}
			
			if($WR.constraint_.bottom > -1){
				var bottom = $WR.constraint_.bottom >= 0 ? $WR.constraint_.bottom : 0;
				options.stage -= bottom;
			}
		}
		
		var height = options.stage - (options.header + options.menu + options.footer + options.marginBottom + options.marginTop + options.borderTop + options.borderBottom);
		
		if(parent == null){document.body.removeChild(this);}
		
		return height;
	},
/**
 * Window#stageWidth() -> Number
 *
 * Retourne la largeur du corps de la fenêtre.
 **/
	stageWidth: function(){
		
		var parent = this.parentNode;

		if(parent == null){
			document.body.appendChild(this);
		}
		
		var n = 1 * this.body.css('width');
		
		if(parent == null){document.body.removeChild(this);}
		
		return n;
	},
/**
 * Window#stageWidthMax() -> Number
 *
 * Cette méthode retourne la largeur maximal que peut avoir la fenêtre.
 **/
	stageWidthMax: function(){
		
		var parent = this.parentNode;
		
		if(parent == null){
			document.body.appendChild(this);
		}
		
		var width = 		document.stage.stageWidth;
		
		
		if(!(this.fullscreenMode == Window.FS_HTML5 && this.hasClassName('fullscreen') && this.hasClassName('html5'))){
			
			if($WR.constraint_.left > 0){
				width -= $WR.constraint_.left;
			}
			if($WR.constraint_.right > 0){
				width -= $WR.constraint_.right;
			}
				
		}
		if(parent == null){document.body.removeChild(this);}
		var border = this.body.css('border-left-width') + this.body.css('border-right-width') + this.css('border-left-width') + this.css('border-right-width');
		return width - (this.superBody.css('padding-left') +  this.superBody.css('padding-right')) - border;
	},
	/**
	 * Ajoute des contraintes pour le drag'n'drop et le redimensionnement de la fenêtre.
	 **/
	setConstraint: function(obj){
		for(var key in this.constraint_){
			this.constraint_[key] = obj[key];
		}
		return this;
	},
/**
 * Window#setVisibility(bool) -> Window
 * - bool (Boolean): Valeur changeant l'état de la fenêtre.
 *
 * Si la valeur de `bool` est sur vrai la fenêtresera visible, dans le cas contraire le contenu de la fenêtre sera caché et il ne restera que
 * que le contour de fenêtre. Cette méthode immite l'effet Aero de Window lors du survol d'une icône de la barre des tâches.
 *
 **/
	setVisibility: function(bool){
		this.header.setStyle('visibility:' + (bool ? 'visible' : 'hidden'));
		this.superBody.setStyle('visibility:' + (bool ? 'visible' : 'hidden'));
		return this;
	},
	/**
	 * Retourne le nom CSS de l'icone.
	 **/
	getIcon: function(){
		return this.icon;
	},
/**
 * Window#setIcon(icon) -> Window
 * - icon (String): Nom de l'icône.
 *
 * Cette méthode change le nom de l'icône. L'icône sera automatiquement modifié dans la miniature et dans le titre de la fenêtre.
 **/
	setIcon: function(icon){
		this.removeClassName('icon');
		this.headerTitle.className = "font wrap-title";
		this.headerTitle.addClassName('icon-'+icon);
		this.icon = icon;
		
		if(this.icon != ''){
			this.addClassName('icon');	
		}
		
		if(this.MinWin != null){
			this.MinWin.setIcon(this.icon);
		}
		return this;
	},
/**
 * Window#setHTML(str) -> Window
 * - str (String): Contenu HTML.
 *
 * Cette méthode permet d'écrire directement du code HTML sous forme de chaine de caractère dans le
 * corps de la fenêtre.
 **/
	setHTML:function(html){
		this.body.innerHTML = Object.isUndefined(html)?'':html;	
		return this;
	},
/**
 * Window#Text([text]) -> String
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
			this.body.innerHTML = text;
		}
		return this.body.innerHTML;
	},
/**
 * Window#setText(str) -> Window
 * - str (String): Texte brut.
 *
 * Cette méthode permet d'écrire directement du texte dans le
 * corps de la fenêtre. Tous les caractères seront encodés par leur équivalent HTML si besoin.
 **/
	setText: function(text){
		this.body.innerHTML = Object.isUndefined(text)?'':text.htmlEntities();
		return this;	
	},
/**
 * Window#setMinWidth(width) -> Window
 * - width (Number): Largeur minimale de la fenêtre.
 *
 * Cette méthode assigne une largeur minimale à la fenêtre.
 **/
	setMinWidth: function(width){this.body.setStyle({minWidth: width ? width + 'px' : 'auto'});return this;},
/**
 * Window#setMinHeight(height) -> Window
 * - height (Number): Hauteur minimale de la fenêtre.
 *
 * Cette méthode assigne une hauteur minimale à la fenêtre.
 **/
	setMinHeight: function(height){
		if(!Object.isUndefined(height)) {
			this.body.setStyle('min-height:'+height+'px');
		}
		return this;
	},
/**
 * Window#setMaxHeight(height) -> Window
 * - height (Number): Hateur maximale de la fenêtre.
 *
 * Cette méthode assigne une hauteur maximale à la fenêtre.
 **/
	setMaxHeight: function(height){
		
		//if(!Object.isUndefined(height)) {

			this.maxHeight = height;
			
			var parent = this.parentNode;
		
			if(parent == null){
				document.body.appendChild(this);
			}
			
			var options = {
				stage:			document.stage.stageHeight,
				header:			1 * this.header.getHeight(),
				menu:			this.DropMenu.css('display') == 'none' ? 0 : 1 * this.DropMenu.getHeight(),
				footer:			1 * this.footer.getHeight(),
				borderTop:		this.css('border-top-width') + this.body.css('border-top-width'),
				borderBottom:	this.css('border-bottom-width') + this.body.css('border-bottom-width'),
				marginTop:		this.superBody.css('padding-top'),
				marginBottom:	this.superBody.css('padding-bottom')
			};
			
			if($WR.constraint_.top > -1){
				var top = $WR.constraint_.top >= 0 ? $WR.constraint_.top : 0;
				options.stage -= top;
			}
			
			if($WR.constraint_.bottom > -1){
				var bottom = $WR.constraint_.bottom >= 0 ? $WR.constraint_.bottom : 0;
				options.stage -= bottom;
			}
		
			height = options.stage - (options.header + options.menu + options.footer + options.marginBottom + options.marginTop + options.borderTop + options.borderBottom);
			
			if(this.hasClassName('tabcontrol')){
				this.select('.wrap-super-body > .wrap-body > .tab-control > .wrap-super-body > .wrap-body > .panel').each(function(e){
					e.css('height', height - e.css('padding-top') - e.css('padding-bottom'));
				});
			}else{
				this.body.setStyle('max-height:'+height+'px');
			}
			
			if(parent == null){document.body.removeChild(this);}
		//}
		
	},
/**
 * Window#setMinWidth(width) -> Window
 * - width (Number): Largeur minimal de la fenêtre.
 *
 * Cette méthode assigne une largeur maximale à la fenêtre.
 **/
	setMaxWidth: function(width){
		
		if(!Object.isUndefined(width)) {
			this.maxWidth = width;								
			this.body.setStyle('max-width:'+width+'px');
		}
		
	},
/**
 * Window#setFormData(data) -> Window
 * - data (Object): Données à stocker.
 *
 * Cette méthode assigne un objet à attacher à l'instance.
 **/	
	setData: function(data){
		this.dataInstance = data;
		return this;
	},
/**
 * Window#getData() -> Object
 *
 * Cette méthode retourne un objet attaché à l'instance.
 **/	
	getData:function(data){
		return this.dataInstance;
	},
/**
 * Window#setTheme(theme) -> ProgressBar
 * - theme (String): Thème a appliquer.
 * 
 * Cette méthode permet de changer le thème de l'instance.
 **/
	setTheme: function(theme){
		
		this.removeClassName('theme-' + this.theme);
		
		if(theme){
			this.theme = theme;
			this.addClassName('theme-' + this.theme);
		}else{
			this.theme = 'default';
			this.addClassName('theme-' + this.theme);
		}
				
		return this;
	},
	
	getMaxHeight: function(){
		return this.maxHeight;
	},
	/** @ignore */
	setMinTop: function(y){this.constraint_.top = y;return this;},
	/** @ignore */
	setMaxTop: function(y){this.constraint_.bottom = y;return this;},
	/** @ignore */
	setMinLeft: function(x){this.constraint_.left = x;return this;},
	/** @ignore */
	setMaxLeft: function(x){this.constraint_.right = x;return this;}, 	
/*
 * Window#__destruct() -> void
 * 
 * Detruit l'objet complexe.
 **/
	__destruct: function(){
		if(Object.isFunction(this.destroy)) this.destroy();
	}
};
