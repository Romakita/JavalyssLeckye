/**
 * WindowRegister
 *
 * Gestionnaires des fênetres de type Window. Ses fonctions sont :
 *
 * * D'importer l'ensemble des sous-bibliothèques de Window,
 * * De gérer les paramètres globaux de la bibliothèque,
 * * De gérer le lancement de la barre des tâches,
 * * D'enregistrer, ordonancer, détruire les fenêtres Window,
 * * D'indiquer aux sous librairies la version actuelle de la bibliothèque,
 * * De vérifier si la version de Extends est compatible avec le gestionnaire de fenêtre.
 * 
 * Ce namespace se charge automatiquement à l'execution du script.
 *
 * <p class="alias alias-of">$WR est un alias à l'instance WindowRegister</p>
 *
 **/
var WindowRegister = {
	AUTO_INCREMENT:		0,
/**
 * WindowRegister.version -> 5.6
 * Indique la version de la bibliothèque Window
 **/
	version: 			'5.6',
/**
 * WindowRegister.REQUIRED_EXTENDS -> 3.1
 * Indique la version de la bibliothèque Extends requise.
 **/
	REQUIRED_EXTENDS:	'3.1',
/*
 * WindowRegister.windows -> Array
 * Pile des fenêtres instanciées.
 **/
	windows:			[],
/*
 * WindowRegister.stacks -> Object
 * Pile des instances enregistrées via la méthode [[WindowRegister.unique]].
 **/
	stacks:				{},
/**
 * WindowRegister.FileIcon -> Object
 * Liste des icones associées aux extensions.
 **/
    FileIcons:			{
        //documents
        'accdb': 'accdb-48',
        'pdf':	'pdf-48',
        'one':	'one-48',
        'doc':	'word-48',
        'dot':	'word-48',
        'docx':	'word-48',
        'xls':	'xls-48',
        'xlsx':	'xls-48',
        'ods':	'xls-48',
        'psd':	'psd-48',
        'pub':	'pub-48',
        'pubx':	'pub-48',
        'pps':	'pps-48',
        'ppsx':	'pps-48',
        'ppt':	'pps-48',
        'pptx':	'pps-48',
        'flv':	'flv-48',
        'flw':	'flv-48',

        //media
        'avi': 	'avi-48',
        'wmv': 	'wmv-48',
        'mkv': 	'mkv-48',
        'mp3':	'mp3-48',
        'wma':  'wma-48',
        'mpg': 	'mpeg-48',
        'mpeg': 'mpeg-48',
        'mov':	'mov-48',
        'swf':	'swf-48',

        //picture
        'bmp':	'preview',
        'gif':	'preview',
        'jpg':	'preview',
        'png':	'preview',

        //code
        'csv':	'code-48',
        'css':	'code-48',
        'html':	'code-48',
        'java':	'code-48',
        'php':	'code-48',
        'js':	'code-48',
        'sql':	'sql-48',
        'txt':	'text-48',
        //'vcs':	'cal-48',
        //'vcf':	'vcard-48',

        //archive
        'rar':	'rar-48',
        'tar':	'zip-48',
        'zip':	'zip-48'
    },
	/**
	 * WindowRegister.constraint_ -> Object
	 * Contrainte de positionnement des fenetres.
	 **/
	constraint_:		null,
	
	globals:			{
		parameters:	{}
	},
/*
 * WindowRegister.STRING_POST_PHP -> String
 * Chaine envoyé au script PHP lors d'envoi de données. Laisser à vide pour ne rien envoyer.
 * 
 * <p class="note">Implémenté depuis la version 2.1RC1</p>
 **/
	STRING_POST_PHP:	'',
/*
 * WindowRegister.options -> Object
 * Cet attribut contient la liste des sous-bibliothèques à charger au lancement du script.
 **/
	options:
	//[import] 
	[
		//minimal
		{link:'button.*'},
		{link:'ui.popup'},
		{link:'ui.calendar'},
		{link:'menu.*'},
		{link:'ui.section'},
		{link:'ui.htmlnode'},
		{link:'ui.minwin'},
		{link:'ui.taskbar'},
		{link:'ui.window'},
		{link:'ui.alert'},
		{link:'ui.widget'},
		{link:'ui.coloredbox'},
		{link:'form.input.*'},
		{link:'ui.flag'},
		{link:'ui.splite'},
		//ui
		{link:'ui.progressbar'},
		{link:'ui.scrollbar'},
		{link:'ui.tabcontrol'},
		//form
		{link:'form.checkbox.*'},
		{link:'form.paging'},
		{link:'form.passwordeval'},
		{link:'form.frameworker'},
		{link:'form.ticket'},
		//table
		{link:'table.*'},
		//optional
		{link:'ui.terminal'},
		{link:'ui.wloader'},
		{link:'ui.lightbox'}

	]//[/import]
	,
/*
 * WindowRegister.addLine(line, func, options) -> void
 * - line (String): Le nom de la ligne qui sera afficher dans le menu de la barre des tâches.
 * - func (Function): La fonction qui sera appellé au clique de la ligne.
 * - options (Object): Objet de configuration.
 *
 * Ajoute une nouvelle ligne au menu.
 **/
	addLine:function(line, func, options){
		if(this.TaskBar == null) return;

		this.TaskBar.addLine(line, func, options);
	},
//ignore
 	instanceTask:null,
/**
 * WindowRegister.TaskBar(task) -> TaskBar
 * - task (TaskBar): Instance de la barre des tâches.
 *
 * Ajoute et/ou retourne l'instance de la barre des tâches.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 *
 * ##### Affectation d'une valeur :
 * 
 *     WindowRegister.TaskBar(new TaskBar());
 *
 * ##### Récupération d'une valeur :
 * 
 *     alert(WindowRegister.TaskBar()); //affiche l'objet
 *
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	TaskBar: function(task){
		
		if(!Object.isUndefined(task)){
			if(this.instanceTask == null && task.__class__ == 'taskbar') this.instanceTask = task;
		}
		
		if(this.instanceTask){
			document.body.removeClassName('no-taskbar');	
		}
		
		return this.instanceTask;
	},
/**
 * WindowRegister.createTaskBar(options) -> TaskBar
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance de la barre des tâches si cette dernière n'est pas initialisé. Sinon
 * elle retourne l'instance de la barre des tâches.
 *
 * ##### Paramètre option
 *
 * * `menu` (Boolean): Si `true` le menu est activé. (par défaut activé).
 * * `clock` (Boolean): Si `true` l'horloge est activé. (par défaut activé).
 * * `hide` (Boolean): Si `true` le bouton cachant toutes les fenêtres est activé. (par défaut désactivé).
 * * `systray` (Boolean): Si `true` le systray est activé. (par défaut désactivé).
 * * `title` (String): Nom du menu.
 *
 **/
	createTaskBar: function(options){
		if(this.TaskBar() == null){
			
			if(Object.isFunction(document.body.removeClassName)){
				document.body.removeClassName('no-taskbar');
			}
			
			new TaskBar(options);
			document.body.appendChild(this.TaskBar());

			this.constraint_.top = this.TaskBar().getHeight();

			this.TaskBar().load();
		
		}
		return this.TaskBar();
	},
	/* WindowRegister.getTaskBar() -> TaskBar
	 *
	 * Retourne l'instance de la barre des taches si elle est initialisée
	 * 
	 **/
	getTaskBar: function(){
		return this.TaskBar();
	},
	/*
	 * WindowRegister.setTaskBar(taskbar) -> void
	 * - taskbar (TaskBar) : instance de la barre des tâches.
	 *
	 * Assigne la barre des taches au WindowRegister
	 **/
	setTaskBar: function(task){
		this.TaskBar(task);	
	},
/**
 * WindowRegister.setConstraint(options) -> WindowRegister
 * - options (Object): Objet de configuration.
 *
 * Ajoute les contraintes affectés aux fenêtres de type [[Window]].
 * Les contraintes définissent une zone de Drag'n'Drop possible pour les fenêtres.
 * C'est-à-dire que lors du déplacement d'une fenêtre, cette dernière ne pourra pas aller
 * au delà de la zone décrite.
 *
 * #### Paramètre options
 * 
 * Voici la descritions des attributs de l'objet `options` :
 * 
 * * `bottom` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la hauteur de la scène.
 * * `left` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la largeur de la scène.
 * * `right` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la largeur de la scène.
 * * `top` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la hauteur de la scène.
 * 
 **/
	setConstraint: function(options){
		
		Object.extend(this.constraint_, options);
		
		this.windows.each(function(win){
			if(this.constraint_.left >= 0){
				win.x = (win.x  < this.Constraint().left ? this.Constraint().left : win.x);
				win.css('left', win.x + 'px');
			}
		}.bind(this));
		
		return WindowRegister;
	},
/**
 * WindowRegister.getConstraint() -> Object
 *
 * Retourne les contraintes affectés aux fenêtres de type [[Window]].
 * Les contraintes définissent une zone de Drag'n'Drop possible pour les fenêtres.
 * C'est-à-dire que lors du déplacement d'une fenêtre, cette dernière ne pourra pas aller
 * au delà de la zone décrite.
 *
 * #### Objet de retour
 * 
 * Voici la descritions des attributs de l'objet `options` :
 * 
 * * `bottom` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la hauteur de la scène.
 * * `left` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la largeur de la scène.
 * * `right` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la largeur de la scène.
 * * `top` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la hauteur de la scène.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	getConstraint: function(){
		return this.constraint_;
	},
/**
 * WindowRegister.Constraint(options) -> Object
 * - options (Object): Objet de configuration.
 *
 * Ajoute et/ou retourne les contraintes affectés aux fenêtres de type [[Window]].
 * Les contraintes définissent une zone de Drag'n'Drop possible pour les fenêtres.
 * C'est-à-dire que lors du déplacement d'une fenêtre, cette dernière ne pourra pas aller
 * au delà de la zone décrite.
 *
 * #### Paramètre options
 * 
 * Voici la descritions des attributs de l'objet `options` :
 * 
 * * `bottom` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la hauteur de la scène.
 * * `left` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la largeur de la scène.
 * * `right` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la largeur de la scène.
 * * `top` ([[Number]]): -1 pas de contrainte ou une valeur entre 0 et la hauteur de la scène.
 * 
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 *
 * ##### Affectation d'une valeur :
 * 
 *     WindowRegister.Constraint({top:30, bottom:1024});
 *
 * ##### Récupération d'une valeur :
 * 
 *     WindowRegister.Constraint({top:30, bottom:1024});
 *     alert(WindowRegister.Constraint()); //affiche l'objet
 *
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/	
	Constraint: function(options){
		if(!Object.isUndefined(options)){
			this.setConstraint(options);
		}
		return this.getConstraint();		
	},
/**
 * WindowRegister.load() -> void
 * 
 * Charge les sous-bibliothèques de Window.
 * 
 * <p class="note">Cette méthode lance une exception si la version d'Extends est inférieure à celle requise.</p>
 **/
	load: function(){
		this.VERSION = this.version;
				
		if(typeof Extends == 'undefined' || Extends.version < this.REQUIRED_EXTENDS){
			throw("Window requires the Extends JavaScript framework >= " + this.REQUIRED_EXTENDS);	
		}
		
		this.constraint_ = {left:-1, top:-1, bottom:-1, right:-1};
		
		this.isMinified = document.findScript('window\.min') == '' ? false : true;
		
		this.options.each(function(options){ 
			Import('window/'+ options.link, this.isMinified);
		}.bind(this));
		
		this.begin = 	null;
		this.end =		null;
		
		Extends.ready(this.onDomLoaded.bind(this));
	},
/**
 * WindowRegister.blur() -> WindowRegister
 *
 * Fait perdre le focus à toutes les fênetres enregistrées.
 **/
	blur: function(){
		for(var i = 0; i < this.windows.length; i+=1){
			this.windows[i].blur();
		}
		return this;
	},
/**
 * WindowRegister.focus(window) -> WindowRegister
 * - window (Window): Fenêtre à mettre en haut de la pile.
 *
 * Place la fenêtre `window` en haut de la pile du gestionnaire de fenêtre. Graphiquement,
 * la fenêtre apparaitra par dessus toutes les autres.
 *
 **/
	focus:function(win){
		
		if(!win.className.match(/window/)){
			return;
		}
		
		var array = 	[];
		var zIndex = 	100;
		
		this.windows.each(function(e){
			if(win.INSTANCE_ID != e.INSTANCE_ID){
				e.setStyle({zIndex: zIndex});
				zIndex += 5;
				array.push(e);
			}
		});
		
		array.push(win);
		win.setStyle({zIndex: zIndex});
		
		this.windows = null;
		this.windows = array;
		
		return this;
	},
/**
 * WindowRegister.hide() -> WindowRegister
 *
 * Cache toutes les fênetres enregistrées dans le gestionnaire de fenêtre.
 **/
	hide:function(){
		this.windows.each(function(win){
			if(!win.hidden_){
				win.hide();
			}
		});
		return this;
	},
/**
 * WindowRegister.show() -> WindowRegister
 *
 * Montre toutes les fênetres enregistrées dans le gestionnaire de fenêtre.
 **/
	show:function(){
		this.windows.each(function(win){
			if(win.hidden_){
				win.show();
			}
		});
		return this;
	},
/**
 * WindowRegister.visibility(bool) -> WindowRegister
 * - bool (Boolean): `true` pour rendre visible la fenêtre.
 *
 * Cette méthode rend invisible le corps de toutes les fenêtres du gestionnaire.
 **/
	visibility: function(bool){
		this.windows.each(function(win){
			win.setVisibility(bool);	
		});
		return this;
	},
/*
 * WindowRegister.updateSize() -> WindowRegister
 *
 * Cette méthode rend invisible le corps de toutes les fenêtres du gestionnaire.
 **/
	updateSize: function(){
		
		if(this.windows && this.windows.length){
			this.windows.each(function(win){
				if(win.fullscreen_){
					win.Fullscreen(false);
					win.Fullscreen(true);
				}
			});
		}
		
		return this;
	},
/**
 * WindowRegister.push(win) -> Boolean
 * - win (Window): Instance de la fenêtre à ajouter.
 *
 * Ajoute l'instance de la fenêtre au gestionnaire de fenêtre.
 * Cette méthode à pour effet de créer une miniature de la fenêtre dans la barre des tâches.
 *
 **/
	push: function(win){
		
		if(Object.isUndefined(win)){
			return false;
		}
		
		if(!win.className.match(/window/)){
			return;
		}
		
		if(this.getTaskBar()){
			this.getTaskBar().MinWin.appendChild(win.MinWin);
		}
		
		win.INSTANCE_ID =	this.AUTO_INCREMENT++;
		
		if(!win.getMaxHeight()){
			
			var bottom = 0;
			if(this.constraint_.bottom > 0){
				var bottom = document.stage.stageHeight - this.constraint_.bottom;
			}
		}
		
		if(!document.navigator.mobile){
			win.moveTo(this.constraint_.left + (this.windows.length) * 10, this.constraint_.top + (this.windows.length)* 10);
		}else{
			win.moveTo(0, 0);
		}
					
		this.windows.push(win);
		
		return true;
	},
/**
 * WindowRegister.reject(win) -> Boolean
 * - win (Window): Instance de la fenêtre à supprimer.
 *
 * Supprime l'instance de la fenêtre du gestionnaire de fenêtre.
 * Cette méthode retourne `false` si la suppression échoue. 
 *
 **/
	reject:function(win){
		if(Object.isUndefined(win)){
			return false;
		}
				
		if(this.getTaskBar()){
			if(Object.isElement(win.MinWin) && Object.isElement(win.MinWin.parentNode)){
				win.MinWin.parentNode.removeChild(win.MinWin);
			}
		}
		
		var array = 	[];
				
		this.windows.each(function(e){
			if(win.INSTANCE_ID != e.INSTANCE_ID){
				array.push(e);
			}
		});
		
		this.windows = null;
		this.windows = array;
		
		return true;
	},
/** 
 * WindowRegister.getWindow(id) -> Window
 * - id (Number): Numéro d'instance.
 * 
 * Retourne l'instance Window en fonction de son numéro d'instance..
 **/	
	getWindow:function(id){
		return this.windows[id];
	},
/**
 * WindowRegister.setGlobals(key, value) -> WindowRegister
 * - key (String): Nom de la clef à stocker.
 * - value (Mixed): Valeur de la clef.
 *
 * Cette méthode permet de stocker des données globales à WindowJS.
 **/
	setGlobals:function(key, value){
        $.Extends.setGlobals(key, value);
		return this;
	},
/**
 * WindowRegister.getGlobals(key) -> Mixed
 * - key (String): Nom de la clef stockée.
 *
 * Cette méthode permet récuperer une valeur en fonction du paramètre [[key]].
 **/	
	getGlobals:function(key, bool){
		return $.Extends.getGlobals(key, bool);
	},
/**
 * WindowRegister.cleanEvent(obj) -> void
 * 
 * Cette méthode nettoye les événements d'un objet graphique de la bibliothèque Window JS.
 *
 * <p class="note">Pensez à restaurer les fonctions removeChild de l'élément avant utilisation de cette méthode</p>
 **/	
	cleanEvent:function(o){
		this.stopObserving();
	},
/**
 * WindowRegister.getByName(nameid) -> Boolean | Window
 * - nameid (String): Nom d'instance unique.
 * 
 * Cette méthode l'instance associée à `nameid` si elle existe.
 * Cette méthode ne génère pas d'objet dans le cas où l'instance n'existe pas.
 *
 * <p class="note">Implémenté depuis la version 2.8</p>
 **/
 	getByName: function(nameid){
		return (Object.isUndefined(this.stacks[nameid]) || this.stacks[nameid] == null) ? false : this.stacks[nameid].instance;
	},
/**
 * WindowRegister.unique(nameid [, options]) -> Boolean | Window
 * - nameid (String): Nom d'instance unique.
 * - options (Object): Option de configuration de la méthode.
 * - args (Mixed): paramètres à passer à l'instance unique.
 * 
 * Cette méthode permet de créer une instance unique en fonction du `nameid`. Si la méthode est rappelée avec le même `nameid`, la méthode ne créera pas de nouvelle instance et retournera `false`,
 * indiquant à votre script que l'instance existe déjà.
 *
 * #### Paramètre options
 *
 * Le comportement décrit précèdement peut néanmoins être modifié à l'aide du paramètre `options`. Ci-après la liste des attributs du paramètre :
 *
 * * `instance` (String) : Type de l'instance à créer lors de l'appel à la méthode. Par défault, l'instance créée est de type [[Window]].
 * * `autoclose` (Boolean): Cette option modifie le comportement de la méthode. Lorsque sa valeur est `true`, l'instance sera automatiquement fermé avec la méthode [[Window#close]]. 
 * * `action` (Function): Fonction à appelée après descruction de l'instance (à utiliser lorsque `autoclose` est à `true`).
 *
 **/
 	unique: function(nameid, obj){
		if(Object.isUndefined(nameid)) return false;
		var self = 		this;
		var options =  {
			instance: 	'Window',
			action:		function(){},
			autoclose:	false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);	
		}
		
		var args = $A(arguments);
		
		if(args.length > 2){
			
			options.parameters = [];
			for(var i = 2; i < args.length; i++){
				options.parameters.push(args[i]);
			}
		}
		
		var o = this.stacks[nameid];
		
		if(Object.isUndefined(o) || o == null){//création du nom unique
			
			if(Object.isString(options.instance)){
				var class_ = window[options.instance];
				o = {instance:class_.apply(class_.prototype, $A(options.parameters))};
			}
			
			if(Object.isFunction(options.instance)){
				o = {instance:options.instance.apply(options.instance.prototype, $A(options.parameters))};
			}
			
			o.stackAction = false;
			
			o.instance.on('close', function(){
				this.free(nameid);
			}.bind(this));
			
			this.stacks[nameid] = o;
			
			return o.instance;
		}
		
		//instance deja créée on met en queue l'ouverture de la nouvelle fenetre.
		if(o.stackAction) return false; //on a deja une action en attente (via Window.overideClose());
			
		o.stackAction = function(){
			
			//libération du stackAction
			//$WR.stacks[nameid].stackAction = null;
			//execution de l'action en attente
			self.free(nameid);		
			options.action.call(this);
				
		};
		
		if(Object.isFunction(o.instance.on)){
			o.instance.focus();
			o.instance.on('close', o.stackAction);
			//Déclenchement de la fermeture automatique de l'instance si autoclose est définie
			if(options.autoclose){
				o.instance.close();
			}
		}else{
			this.free(nameid);
			return this.unique(nameid, obj);
		}	
		
		return false;
	},
/**
 * WindowRegister.free(nameid) -> void
 * - nameid (String): Nom d'instance unique.
 *
 * Cette méthode libère les ressources sur nameid.
 **/	
	free: function(nameid){
		this.stacks[nameid] = null;
	},
/**
 * WindowRegister.destructObject(obj) -> void
 * 
 * Cette méthode détruit un objet graphique de la bibliothèque Window JS.
 *
 * <p class="note">Pensez à restaurer les fonctions removeChild de l'élément avant utilisation de cette méthode</p>
 **/
	destructObject:function(o){			
		//suppression de la méthode destruct de l'obje
		o.destroy = null;
		this.cleanEvent(o);
		
		//récupération des enfants
		o.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});
	},
/**
 * WindowRegister.evalLink(link, target) -> void
 *
 * Cette méthode évalue un lien à la recherche de la chaine `javascript:` pour déterminer l'action à entreprendre, soit une redirection soit une action javascript.
 **/	
	evalLink:function(link, target){
		
		if(link.match(/^javascript:/)){
			eval(link.replace('javascript:',''));
		}else{
			if(target == '_blank'){
				window.open(link, 'windowtarget').focus();
			}else{
				window.location = link;
			}
		}
	},
/*
 * WindowRegister.onDomLoaded() -> void
 *
 * Cette méthode intercepte les éléments HTML de la page ayant les classes CSS cité dans la liste ci-après et les convertis
 * en élément Window.
 *
 * <p class="note">Cette méthode est implémenté depuis la version Window 2.4</p>
 **/
	onDomLoaded: function(){
		
		if(!this.TaskBar()){
			document.body.addClassName('no-taskbar');
		}
		
		Extends.fire('before.dom.load');
		
		var current = '';
		
		Widget.Transform(current ='.box-widget');
		DropMenu.Transform(current ='.box-drop-menu');
		ScrollBar.Transform(current ='.box-scroll-bar');
		ScrollBar.Transform(current ='.box-scrollbar');
		//SimpleTable.Transform(current ='.box-simpletable');
		
		TabControl.Transform(current ='.box-tab-control');
		AppButton.Transform(current ='.box-app-button');
		Calendar.Transform(current ='.box-calendar');
		HeadPiece.Transform(current ='.box-headpiece');
		InputButton.Transform(current ='.box-input-button');
		InputPopup.Transform(current ='.box-input-popup');
		InputCalendar.Transform(current ='.box-input-calendar');
		InputColor.Transform(current ='.box-input-color');
		InputCompleter.Transform(current ='.box-input-completer');
		InputCP.Transform(current ='.box-cp');
		InputCity.Transform(current ='.box-city');
		
		Input.Transform(current ='.box-input');
		Checkbox.Transform(current ='.box-checkbox');
		
		Select.Transform(current ='.box-select');
		ListBox.Transform(current ='.box-listbox');
		DoubleListBox.Transform(current ='.box-doublelistbox');
		
		GroupButton.Transform(current ='.box-group-button');
		SimpleButton.Transform(current ='.box-simple-button');
		ToggleButton.Transform(current ='.box-toggle-button');
		
		Flag.Transform(current ='.box-flag');
		LightBox.Transform(current ='lightbox');
		
		Extends.fire('after.dom.load');
		
	},
/**
 * Window.ready(callback) -> void
 *
 * Cette méthode enregistre une fonction qui sera appelée après le chargement complet des éléments HTML de la bibliothèque [[WindowRegister]].
 **/
	ready: function(callback){
		Extends.observe('after.dom.load', callback);
	}
};

Object.extend(Extends, {
/*
 * Extends.after(callback) -> void
 *
 * Cette méthode enregistre une fonction qui sera appellée après le chargement complet des éléments HTML de la bibliothèque [[WindowRegister]].
 * (voir la méthode [[WindowRegister.onDomLoaded]]).
 **/
	after: function(callback){
		Extends.observe('after.dom.load', callback);
	},
/*
 * Extends.before(callback) -> void
 *
 * Cette méthode enregistre une fonction qui sera appellée avant le chargement complet des éléments HTML de la bibliothèque [[WindowRegister]].
 * (voir la méthode [[WindowRegister.onDomLoaded]]).
 **/	
	before: function(callback){
		Extends.observe('before.dom.load', callback);
	}
});

WindowRegister.load();
/** alias of: WindowRegister
 * $WR() -> WindowRegister
 * Utilitaire permettant de gérer les fonctions de base de WindowJS
 **/
function $WR(){
	return WindowRegister;
};

Object.extend($WR, WindowRegister);

/**
 * == Extends ==
 * Window repose sur deux bibliothèques Prototype pour la normalisation du language JavaScript sur tous les navigateurs et Extends qui propose des fonctions avancées pour
 * pour la création d'élément du DOM enrichie.
 *
 * Pour plus d'information sur la bibliothèque Extends et outils rendez-vous sur cette page <a href="http://wiki.rom-makita.fr/extends/">http://wiki.rom-makita.fr/extends/</a>.
 **/

/** section: Extends
 * class Element
 * Cette classe créer un élément du DOM. Pour plus d'information rendez-vous sur la page de description des classes de la bibliothèque 
 * <a href="http://wiki.rom-makita.fr/extends/">Extends</a>.
 **/

//Ajout des mots de traductions
MUI.addWords({
	'erase':			'Effacer la date', 
	'previoustwo':		'Année précèdente', 
	'nexttwo':			'Année suivante', 
	'previous':			'Mois précèdecent', 
	'next':				'Mois suivant',
	'search': 			'Rechercher',
	'close': 			'Fermer',
	'yes': 				'Oui',
	'no':				'Non',
	'ok': 				'Ok',
	'cancel':			'Annuler',
	'loading':			'Chargement',
	'load processing':	'Chargement en cours',
	'wait':				'Patientez',
	'operation processing': 'Opération en cours de traitement',
	'error':			'Erreur',
	'Loading. Please wait': 'Chargement en cours'
}, 'fr');

MUI.addWords({
	'erase':		'Erase the date', 
	'previoustwo':	'Previous years', 
	'nexttwo':		'Next years', 
	'previous':		'Previous month', 
	'next':			'Next month',
	'search': 			'Search',
	'close': 			'Close',
	'yes': 				'Yes',
	'no':				'Non',
	'Oui': 				'Yes',
	'Non':				'Non',
	'ok': 				'Ok',
	'cancel':			'Cancel',
	'loading':			'Loading',
	'load processing':	'Load processing',
	'wait':				'Please wait',
	'operation processing': 'Operation processing',
	'error':			'Error'
}, 'en');