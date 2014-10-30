/** section: UI
 * class ProgressBar < Element
 * Cette classe créée un élement de barre de progression.
 **/
var ProgressBar = Class.createSprite('div');

ProgressBar.prototype = {
	__class__:	'progressbar',
	className:	'wobject w-flex progress-bar incremental',
	min:		0,
	max:		0,
/**
 * new ProgressBar(min, max, msg)
 * new ProgressBar(options)
 * - min (Number): Nombre de tâches acquises au départ.
 * - max (Number): Nombre de tâches totales.
 * - msg (String): Message affiché en dessous de la barre de progression.
 * - options (Object): Option de configuration de la barre de progression.
 *
 * Cette méthode créée une nouvelle instance [[ProgressBar]].
 *
 * #### Attributs du paramètre options
 *
 * * `fullscreen`: La barre occupera le maxime de place en fonction de l'élément ayant une valeur CSS `position:relative`.
 * * `min`: Nombre de tâches acquises au départ.
 * * `max`: Nombre de tâches totales.
 * * `text`: Message à afficher en dessous de la barre de progression.
 * * `infinite`: Affiche une boucle de chargement infinie à la place de la barre de progression.
 * * `theme`: En mode fullscreen vous pouvez spécifier le thème black ou white pour la couleur du background.
 *
 **/
	initialize: function(min, max, txt){
		
		var options = {
			min:		false,
			max:		false,
			text:		'',
			infinite:	false,
			fullscreen:	false,
			theme:		'black'
		};
		
		this.body = 	new Node('p',{className:'wrap-text progress-text'});
		this.flex =		new Node('div', {className:'wrap-flex progress-flex', style:'width:0%'});
		this.mask = 	new Node('div', {className:'wrap-mask progress-mask'});
		this.background = new Node('div', {className:'wrap-bg progress-bg'});
		this.background.setOpacity(0.7);
		
		this.appendChild(this.background);
		this.mask.appendChild(this.flex);
		this.appendChild(this.mask);
		this.appendChild(this.body);
		
		if(!Object.isUndefined(min) && !Object.isUndefined(max)){
			options.min = min;
			options.max = max;
			
			if(!Object.isUndefined(txt)){
				options.text = txt;
			}
		}else{
			Object.extend(options, min || {});		
		}
		
		if(options.min && options.max){
			this.setProgress(options.min, options.max);
		}else{
			if(options.infinite){
				this.Infinite(true);	
			}
		}
		
		if(options.text != ''){
			this.setText(options.text);
		}
		
		this.Fullscreen(options.fullscreen);	
		this.setTheme(options.theme);	
	},
/**
 * ProgressBar#Fullscreen(bool) -> Boolean
 * - bool (Boolean): Change l'état d'affichage de la barre.
 *
 * Cette méthode permet de changer l'affichage de la barre.
 **/	
	Fullscreen:function(bool){
		if(!Object.isUndefined(bool)){
			this.removeClassName('fullscreen');
			
			if(bool){
				this.addClassName('fullscreen');
			}
		}
		return this.hasClassName('fullscreen');
	},
/**
 * ProgressBar#Infinite(bool) -> Boolean
 * - bool (Boolean): Change l'état d'affichage de la barre.
 *
 * Cette méthode permet de changer l'affichage de la barre.
 **/
	Infinite:function(bool){
		
		if(!Object.isUndefined(bool)){
			this.removeClassName('infinite');
			this.addClassName('incremental');
			
			if(bool){
				this.addClassName('infinite');
				this.removeClassName('incremental');
			}
		}
		return this.hasClassName('infinite');
	},
/**
 * ProgressBar#infinite() -> ProgressBar
 *
 * Cette méthode change la progressbar en mode infinite.
 **/
 	infinite:function(){
		this.Infinite(true);
		return this;
	},
/**
 * ProgressBar#incremental() -> ProgressBar
 *
 * Cette méthode change la progressbar en mode incrémental.
 **/
 	infinite:function(){
		this.Infinite(false);
		return this;
	},
/**
 * ProgressBar#setHeight(height) -> ProgressBar
 * - height (Number | String): Hauteur de la barre de progression.
 *
 * Cette méthode permet de spécifier une hauteur à la barre de progression.
 **/	
	setHeight:function(h){
		this.mask.css('height', h);
		return this;
	},
/**
 * ProgressBar#setProgress(min, max, msg) -> ProgressBar
 * - min (Number): Nombre de tâches acquises au départ.
 * - max (Number): Nombre de tâches totales.
 * - msg (String): Message affiché en dessous de la barre de progression.
 *
 * Change l'avancement de la barre de progression.
 **/
	setProgress: function(min, max, txt){
		if(min > max) min = max;
		if(min < 0) min = 0;
		
		this.Infinite(false);
		
		this.min = min;
		this.max = max;
		this.flex.setStyle({width:Math.round((min / max) * 100) + "%"});
		
		if(!Object.isUndefined(txt)) this.setText(txt);
		
		return this;
	},
/**
 * ProgressBar#setText(msg) -> ProgressBar
 * - msg (String): Message affiché en dessous de la barre de progression.
 * 
 * Change le message affiché en dessous de la bar de progression.
 **/
	setText: function(txt){
		this.body.innerHTML = txt;
		return this;
	},
/**
 * ProgressBar#setColor(msg) -> ProgressBar
 * - msg (String): Message affiché en dessous de la barre de progression.
 * 
 * Change la couleur de la barre de progression.
 **/
	setColor: function(color){
		this.flex.css('background', color);
		return this;
	},
/**
 * ProgressBar#setTheme(theme) -> ProgressBar
 * - theme (String): Thème a appliquer.
 * 
 * Cette méthode permet de changer le thème de la barre de progression lorsque celle-ci est en mode fullscreen.
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
	}
};
/**
 * Window#createProgressBar() -> ProgressBar
 *
 * Cette méthode Cette méthode créée une nouvelle barre de progression relative à l'instance [[Window]].
 *
 * <p class="note">Uniquement disponible si le fichier window.progressbar.js est inclut dans le projet.</p>
 **/
Window.prototype.createProgressBar = function(obj){
	if(!Object.isUndefined(this.ProgressBar)) return;
	
	var options = {
		text:		$MUI('Chargement en cours. Patientez svp') + '...',
		fullscreen: true
	};
	
	Object.extend(options, obj || {});
	
	this.ProgressBar = new ProgressBar(options);
	this.ProgressBar.hide();
	
	this.superBody.appendChild(this.ProgressBar);
	
	return this.ProgressBar;
};
/**
 * Window.createHandler() -> void
 *
 * Cette méthode utilise la bar de progression lors du chargement de données via Ajax.
 *
 * <p class="note">Uniquement disponible si le fichier window.progressbar.js est inclut dans le projet.</p>
 **/
Window.prototype.backupIcon = function(){
	this.backupIcon_ = this.getIcon();
};
Window.prototype.createHandler = function(msg, bool){
	this.createProgressBar();
	this.ProgressBar.hide();
	this.backupIcon();
	
	var options = {
		onCreate: 		'',
		onLoading:		'',
		onLoaded:		'',
		onInteractive:	'',
		onSuccess:		'',
		onComplete:		'',
		context:		Object.isUndefined(bool) ? false : bool,
		activate:		false
	};
	
	if(Object.isString(msg)){
		for(var key in options) {
			if(key == 'context' || key == 'activate') continue;
			options[key] = msg;
		}
	}else{
		if(!Object.isUndefined(msg)){
			Object.extend(options, msg);	
		}
	}
	
	this.ActiveProgress = function(){
		options.activate = true;
	};
	
	this.DeactiveProgress = function(){
		options.activate = false;
	};
	
	this.globalHandler = {
		onCreate:function(result){
			if(options.context){
				if(!options.activate) return;
			}
			
			this.setIcon('loading-gif');
			this.ProgressBar.setProgress(0, 4, options.onCreate);
			this.ProgressBar.show();
		}.bind(this),
		
		onLoading:function(){
			if(options.context){
				if(!options.activate) return;
			}
			
			this.ProgressBar.setProgress(1, 4, options.onLoading);
		}.bind(this),
		
		onLoaded:function(){
			if(options.context){
				if(!options.activate) return;
			}
			
			this.ProgressBar.setProgress(2, 4, options.onLoaded);
		}.bind(this),
		
		onInteractive:function(){
			if(options.context){
				if(!options.activate) return;
			}
			
			this.ProgressBar.setProgress(3, 4, options.onInteractive);
		}.bind(this),
		
		onSuccess:function(){
			if(options.context){
				if(!options.activate) return;
			}
			
			this.ProgressBar.setProgress(4, 4, options.onSuccess);
		}.bind(this),
		
		onComplete: function(){
			if(options.context){
				if(!options.activate) return;
				else{
					options.activate = false;	
				}
			}
			
			this.setIcon(this.backupIcon_);
			this.ProgressBar.hide();
		}.bind(this)
	};
	
	Ajax.Responders.register(this.globalHandler);
	
	this.___destruct = this.__destruct;
	this.__destruct = function(){
		Ajax.Responders.unregister(this.globalHandler);
		this.globalHandler = null;
		this.___destruct();
	};
	
	return this.ProgressBar;
};

Widget.prototype.createProgressBar = function(obj){
	if(!Object.isUndefined(this.ProgressBar)) return;
	
	var options = {
		text:		$MUI('Chargement en cours. Patientez svp') + '...',
		fullscreen: true
	};
	
	Object.extend(options, obj || {});
	
	this.ProgressBar = new ProgressBar(options);
	this.ProgressBar.hide();
	
	this.appendChild_(this.ProgressBar);
	
	return this.ProgressBar;
};