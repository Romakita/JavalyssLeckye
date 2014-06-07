/** section: UI
 * class ToolBar
 *
 * Cette classe permet de créer une barre d'outil.
 *
 **/
var ToolBar = Class.createElement('div');
ToolBar.prototype = {
	className:'wobject gradient border toolbar',
	initialize:function(){
		
	}
};
/** section: UI
 * class TaskBar < ToolBar
 *
 * Cette classe est un Singleton. Elle gère le menu principal, l'horloge, le Systray et la représentation
 * miniature des fenêtres ouvertes.
 *
 * #### Menu principal
 *
 * Le menu principal regroupe en théorie les liens vers les grandes fonctionnalités de votre application.
 * Le menu est de type PanelMenu, c'est-à-dire qu'au survol il fait apparaitre un ensemble d'icones au format
 * 48x48 avec leur titre respectif.
 *
 * #### Systray
 *
 * Le systray est à l'image systray de Window. (Cette partie est en cours de production pour la version 2.2)
 *
 * #### Horloge
 *
 * Il s'agit d'un partie faisant apparaitre l'heure courant et un calendrier au click. Les fonctionnalités
 * de cette partie ne sont pas encore fixés.
 *
 * #### Gestionnaire MinWin
 *
 * Cette partie est le regroupement des miniatures de chaque fenêtre.
 *
 **/
var TaskBar = function(options){
	
	if(!$WR.TaskBar()){
		var elem = new ToolBar();

		Object.extend(elem, this);
		elem.initialize(options);
				
		$WR.TaskBar(elem);
	}

	return $WR.TaskBar();
};

TaskBar.prototype = {
	__class__:	'taskbar',
	className:	'wobject gradient border toolbar taskbar',
/**
 * TaskBar#PanelMenu -> PanelMenu
 * Instance du menu principal.
 **/
	PanelMenu:		null,
/**
 * TaskBar#ClockCalendar -> ClockCalendar
 * Instance du calendrier.
 **/
	ClockCalendar:	null,
/**
 * TaskBar#Systray -> DropMenu
 * Instance du systray.
 **/
	Systray:		null,
/**
 * new TaskBar(options)
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
	initialize: function(obj){
		
		var options = {
			menu: 		true,
			systray:	false,
			clock:		true,
			hide:		false,
			title:		'AppStart',
			type:		'top',
			instance:	'SimpleButton',
			parameters:		[
				'PanelMenu',
				'MinWin',
				'ClockCalendar',
				'Systray'
			]
		};

		if(!Object.isUndefined(obj)) Object.extend(options, obj);
		
		this.Name = 		options.title;
		this.instance =		options.instance;
		
		this.createPanelMenu();
		
		
		for(var i = 0; i < options.parameters.length; i++){
			var current = options.parameters[i];
			
			switch(current){
				default:
					this.appendChild(current);
					break;
				case 'PanelMenu':
					if(options.menu){
						if(PanelMenu){
							this.appendChild(this.createPanelMenu());
						}
					}
					break;
					
				case 'MinWin':
					this.MinWin =	new Node('div', {className:'wrap-minwin'});
					this.appendChild(this.MinWin);
					break;
					
				case 'Systray':
					if(options.systray){
						this.appendChild(this.createSystray());
					}
					break;
				case 'ClockCalendar':
					if(options.clock){
						if(ClockCalendar){
							this.appendChild(this.createClockCalendar());
						}
					}	
					break;
			}
		}
		
	},
/**
 * TaskBar#createPanelMenu() -> PanelMenu
 **/
	createPanelMenu:function(){
		if(this.PanelMenu) return this.PanelMenu;
		
		this.PanelMenu = new SimpleMenu();
		this.PanelMenu.addClassName('menu');
		this.PanelMenu.setText($MUI(this.Name));
		this.addClassName('menu');
		
		return this.PanelMenu;
	},
/**
 * TaskBar#createSystray() -> PanelMenu
 **/	
	createSystray:function(){
		if(this.Systray) return this.Systray;
		
		this.Systray =		new DropMenu();
		this.Systray.addClassName('systray');							
		this.addClassName('systray');
		this.appendChild(this.Systray);
		
		return this.Systray;
	},
/**
 * TaskBar#createClockCalendar() -> ClockCalendar
 **/
	createClockCalendar:function(){
		if(this.ClockCalendar) return this.ClockCalendar;
		
		this.ClockCalendar = 	new ClockCalendar();
		this.addClassName('clock');
		this.appendChild(this.ClockCalendar);
		
		return this.ClockCalendar;
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.SimpleButton = null;
		this.ClockCalendar =null;
		this.Systray = 		null;
		this.Name = 		null;
		this.instance =		null;
		
		this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});
	},
/**
 * TaskBar#load() -> TaskBar
 *
 * Charge les miniatures des fenêtres dans la barre des tâches en fonction
 * des fenêtres enregistrées dans le gestionnaire.
 **/
	load: function(){},
/**
 * TaskBar#menu() -> PanelMenu
 **/	
	menu: function(){
		return this.PanelMenu;
	},
	
	Menu: function(){
		return this.PanelMenu;
	},
/*
 * TaskBar#hAddLine(name, func, options) -> LineElement
 * - name (String): Nom de la ligne.
 * - func (Function): Fonction appelée au clique.
 * - options (Object): Objet de configuration. Voir [[SimpleButton]].
 *
 * Cette méthode ajoute une ligne à l'entête du [[PanelMenu]].
 *
 * Le [[PanelMenu]] est constitué de trois parties Header, Body et Footer qui sont respectivements
 * des Menus. Header et Footer intégre un nombre limité de ligne, contraitement au menu Body.
 * 
 * Le menu Body affiche les icônes au format 48x48. Header et Footer les affiches au format 16x16.
 *
 **/
	hAddLine: function(line, arg2, arg3){
		return this.menu().Header().add(line, arg2, arg3);
	},
/*
 * TaskBar#fAddLine(name, func, options) -> LineElement
 * - name (String): Nom de la ligne.
 * - func (Function): Fonction appelée au clique.
 * - options (Object): Objet de configuration. Voir [[SimpleButton]].
 *
 * Cette méthode ajoute une ligne à pied de page du [[PanelMenu]].
 *
 * Le [[PanelMenu]] est constitué de trois parties Header, Body et Footer qui sont respectivements
 * des Menus. Header et Footer intégre un nombre limité de ligne, contraitement au menu Body.
 * 
 * Le menu Body affiche les icônes au format 48x48. Header et Footer les affiches au format 16x16.
 *
 **/
	fAddLine: function(line, arg2, arg3){
		return this.menu().Footer().add(line, arg2, arg3);
	},
/**
 * TaskBar#addLine(name, func, options) -> LineElement
 * - name (String): Nom de la ligne.
 * - func (Function): Fonction appelée au clique.
 * - options (Object): Objet de configuration. Voir [[SimpleButton]].
 *
 * Cette méthode ajoute une ligne au corps du [[PanelMenu]].
 *
 * Le [[PanelMenu]] est constitué de trois parties Header, Body et Footer qui sont respectivements
 * des Menus. Header et Footer intégre un nombre limité de ligne, contraitement au menu Body.
 * 
 * Le menu Body affiche les icônes au format 48x48. Header et Footer les affiches au format 16x16.
 *
 **/
	addLine: function(line, arg2, arg3){
		
		if(!Object.isFunction(arg2)){
			arg3 = arg2;
		}
		//verification du type pour le paramètre line
		var le;
		
		switch(typeof(line)){
			default:
			case 'object':
				le = line;
				line = line.getText();				
				break;
			case 'string':
				le = window[this.instance].call(window[this.instance].prototype, arg3);
				le.setText(line);		
		}
		
		//vérification du type pour le paramètre arg2
		if(Object.isFunction(arg2)) le.on('click',arg2);
		
		this.PanelMenu.appendChild(le);

		return le;
	},
/**
 * TaskBar#getSys() -> DropMenu
 *
 * Cette méthode retourne l'instance du Systray. Systray est de 
 * type [[DropMenu]], ce qui vous permet de manipuler le systray
 * comme un menu sans réel limite.
 **/
	getSys: function(){
		return this.Systray;
	}
};