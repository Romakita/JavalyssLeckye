/** section: UI
 * class AlertBox < Element
 * AlertBox est classe permet de créer des boites modales.
 **/ 
var AlertBox = Class.createSprite('div');
/*
 * AlertBox.AC -> String
 **/
AlertBox.AC = 		'AC';
/**
 * AlertBox.OK -> String
 **/
AlertBox.OK = 		'OK';
/*
 * AlertBox.SEARCH -> String
 **/
AlertBox.SEARCH = 	'SEARCH';
/**
 * AlertBox.CLOSE -> String
 **/
AlertBox.CLOSE = 	'CLOSE';
/**
 * AlertBox.CONFIRM -> String
 **/
AlertBox.CONFIRM = 	'CONFIRM';
/**
 * AlertBox.Y_N -> String
 **/
AlertBox.Y_N = 		'Y/N';
/**
 * AlertBox.NORMAL -> String
 **/
AlertBox.NORMAL = 	'NORMAL';
/**
 * AlertBox.NONE -> String
 **/
AlertBox.NONE =		'NONE';

AlertBox.prototype = {
	__class__:	'alertbox',	
	className:	'wobject alertbox',	
/* 
 * AlertBox#x -> Number
 * Coordonnées X.
 **/
	x:0,						
/*
 * AlertBox#y -> Number
 * Coordonnées Y.
 **/
	y:0,
/*
 * AlertBox#isShow -> Boolean
 * Indique si la boite de dialogue est affiché.
 **/
	isShow: 	false,
/* 
 * AlertBox#onSubmit -> Function
 **/
	onSubmit:	null,
/* 
 * AlertBox#onReset -> Function
 **/
	onReset:	null,
/* 
 * AlertBox#onClose -> Function
 **/
	onClose:	null,
/** 
 * AlertBox#background -> Element
 **/
 	background:	null,
/**
 * AlertBox#time -> Number
 * Temps avant la fermeture de la boite de dialogue.
 **/
	time:		0,
/** 
 * new AlertBox([options])
 * - options (Object): Objet de configuration.
 *
 * Créée une nouvelle instance [[AlertBox]].
 * 
 * #### Attributs du paramètre options
 *
 * Le paramètre `options` prend plusieurs attributs comme suivants :
 *
 * * `title` (`String`): Donne une titre à la boite de dialogue.
 * * `type` (`String`): Donne un type d'affichage pour la boite de dialogue.
 * * `icon` (`String`): Ajoute le nom CSS de l'icône.
 * * `tiùer` (`Number`): Temps en seconde avant la disparition automatique de la boite de dialogue.
 * 
 **/
	initialize: function(obj){
		var options = {
			title: 	"",
			type:  	AlertBox.Y_N,
			timer:	0,
			icon:	'',
			theme:	'default'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.box = this.window = new Window({
			miniature:false, 
			resizable:false, 
			cacheable:false
		});
		
		this.background = 			new Node('div', {className: 'wrap-background'});
		this.body = this.corps = 	new Node('div', {className:'wrap-box-body alertbox-corps'});
		this.btnSubmit =			new SimpleButton({className:'win-btn-ok btn-ok', text:'ok', type:'submit'});
		this.btnReset = 			new SimpleButton({className:'win-btn-reset btn-reset', type:'reset'});
		
		this.appendChilds([this.background, this.box]);
		this.box.appendChild(this.body);
		
		this.box.footer.appendChilds([
			this.btnSubmit,
			this.btnReset
		]);
		
		this.box.setIcon('alert-status-unknow');
		
		this.onclick_reset = 	this.onClickReset.bind(this);
		this.onclick_submit = 	this.onClickSubmit.bind(this);
		
		this.btnSubmit.observe('mouseup', this.onclick_submit);
		this.btnReset.observe('mouseup', this.onclick_reset);
		
		//this.box.btnClose.observe('mouseup', this.onClickClose.bind(this));
				
		this.hide();
		/**
		 * Cette méthode ajoute un Node à la boite de dialogue
		 * @param {Node} elem Element HTML à ajouter au corps de la boite de dialogue
		 * @function
		 * @returns {AlertBox}
		 */
		this.appendChild = this.appendChild_;
		/**
		 * Supprime un Node à la boite de dialogue
		 * @param {Node} elem Element HTML à ajouter au corps de la boite de dialogue
		 * @function
		 * @returns {AlertBox}
		 */
		this.removeChild = this.removeChild_;

		this.box.close = this.onClickClose.bind(this);
		
		this.box.moveTo = function(x, y){
		
			//mesure de padding	
			if(Object.isString(x)){
				if(x == 'left'){
					x = 0;
				}
				if(x == 'right'){
					var dim = 		this.getDimensions();
					x = 			document.stage.stageWidth - dim.width;
				}
			}
			if(Object.isString(y)){
				if(y == 'top'){
					y = 0;
				}
				if(y =='bottom'){
					var dim = 		this.getDimensions();
					y = 			document.stage.stageHeight - dim.height;
				}
			}
			
			this.x = x < 0 ?  0 : x;
			this.y = y < 0 ?  0 : y;
			
			this.css('top',this.y).css('left', this.x);
			
			//this.backup.y = 	this.y;
			//this.backup.x = 	this.x;
					
			return this;
		};
		
		this.ti(options.title);
		this.setIcon(options.icon);
		this.ty(options.type);
		this.Timer(options.timer);
		this.setTheme(options.theme);
	},
/** 
 * AlertBox#appendChild(node) -> AlertBox
 * - node (Node): Element du DOM.
 *
 * Cette méthode ajoute un Node au corps de la boite de dialogue.
 **/
	appendChild_:function(elem){
		if(Object.isUndefined(elem)) return this;		
		this.body.appendChild(elem);
		return this;
	},
/*
 * AlertBox#addChildAt(node, it) -> AlertBox
 * - node (Node): Element du DOM.
 * - it (Number): Indice d'insertion du node.
 *
 * Cette méthode ajoute un Node au corps de la boite de dialogue.
 **/
	 appendChildAt_: function(elem, i){
		
		this.body.appendChildAt(elem, i);
		
		return this;
	},
/** 
 * AlertBox#appendChilds(array) -> AlertBox
 * - array (Array): Tableau d'element.
 *
 * Cette méthode ajoute un ou plusieurs Node au corps de la boite de dialogue.
 **/
	appendChilds_: function(array){
		for(var i = 0; i < array.length; i += 1){
			this.appendChild(array[i]);
		}
		return this;
	},
/** 
 * AlertBox#clear() -> AlertBox
 *
 * Vide le contenu de la boite de dialogue.
 * returns: Retourne l'instance AlertBox.
 **/
	clear: function(){
		
		//réinitialisation des valeurs
		this.time =		0;
		
		if(this.Timer_ && Object.isFunction(this.Timer_.stop)){
			this.Timer_.stop();
		}
		
		this.box.setStyle({top:"0",left:"0"});
		this.box.resizeTo('', '');
		this.box.NoChrome(true);
		this.box.setTitle('');
		this.body.css('padding', '10px');
		this.removeClassName('wait');
		this.removeClassName('progress');
		this.setIcon('alert');
		this.onSubmit = null;
		this.onReset = 	null;
		this.setTheme();
		
		if(this.progress && Object.isElement(this.progress.parentNode)){
			this.progress.parentNode.removeChild(this.progress);
		}
		
		this.body.removeChilds();		
		this.btnSubmit.remove();
		this.btnReset.remove();
		this.btnSubmit.Submit();
		this.box.DropMenu.clear();
		
		this.box.footer.removeChilds();
		this.box.footer.appendChilds([
			this.btnSubmit,
			this.btnReset
		]);
		
		return this;
	},
/** 
 * AlertBox#close() -> AlertBox
 *
 * Ferme la boite de dialogue.
 **/
	close: function(){
		this.onClickClose();
		this.hide();
		return this;
	},
/**
 * AlertBox#Timer(time) -> AlertBox
 * - time (Number): Temps en seconde avant la fermeture automatique de l'AlertBox.
 * 
 * Cette méthode assigne la temps en seconde pour la fermeture automatique de la boite de dialogue. Laissez la valeur à zero pour désactiver la fermeture automatique.
 **/
	Timer:function(time, bool){
		this.time = time; 
		
		if(!Object.isUndefined(bool)){
			this.Timer_ = new Timer(function(){
				if(this.time == 0) return;
				
				this.time = 0;
				this.onClickClose(null);
			}.bind(this), this.time, 1);
			this.Timer_.start();
		}
		
		return this;
	},
/** 
 * AlertBox#hide() -> AlertBox
 *
 * Cette méthode fait disparaitre la boite de dialogue.
 **/
	hide: function(){
		this.isShow = 	false;
		this.setStyle({display:'none'});
		this.clear();		
		return this;
	},
/** 
 * AlertBox#moveTo(x, y) -> AlertBox
 * - x (Number): Coordonnée en Pixel
 * - y (Number): Coordonnée en Pixel
 * 
 * Modifie le positionnement de la fenêtre.
 **/
	moveTo:function(x, y){	
		this.box.moveTo(x, y);
		return this;
	},
/**
 * AlertBox#Body() -> Element
 * 
 * Retourne l'élément principal de l'instance.
 **/
 	Body: function(){
		return this.body;
	},
/**
 * AlertBox#Chrome(bool) -> AlertBox
 * 
 * Si le paramètre `bool` est fausse, le contour de la boite de dialogue (bordure et entete) ne seront pas tracé lors de l'apparition de la boite de dialogue.
 **/	
	Chrome: function(bool){
		return this.box.NoChrome(!bool);
	},
/** deprecated
 * AlertBox#NoChrome(bool) -> AlertBox
 * 
 * Si le paramètre `bool` est vrai, le contour de la boite de dialogue (bordure et entete) ne seront pas tracé lors de l'apparition de la boite de dialogue.
 *
 **/	
	NoChrome: function(bool){
		return this.box.NoChrome(bool);
	},
/**
 * AlertBox#createProgressBar() -> AlertBox
 *
 * Cette méthode créée une nouvelle instance [[ProgressBar]].
 **/
	createProgressBar: function(){
		
		if(!Object.isUndefined(this.progress)){
			this.box.footer.appendChild(this.progress);
			return this.progress;
		}
		
		this.progress = 			new ProgressBar();
		this.box.footer.appendChild(this.progress);
		
		return this.progress;
	},
/**
 * Window#createForm() -> Extends.Form
 *
 * Cette méthode Cette méthode une instance Form.
 **/
	createForm: function(obj){
	
		if(!Object.isUndefined(this.Form)) return this.Form;

		this.Form = this.form = this.forms = new Extends.Form(obj);
		
		return this.Form;
	},
/** 
 * AlertBox#observe(eventName, callback) -> AlertBox
 * - eventName (String): Nom de l'événement à intercepter.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` sur le nom de l'événement `eventName`.
 * 
 * #### Evénement pris en charge
 *
 * * `close`: appellé lors de la fermeture de la boite de dialogue.
 * * `submit`: appellé lors du clique sur le bouton de validation.
 * * `reset`: appellé lors du clique sur le bouton d'annulation.
 *
 **/
	observe: function(eventName, callback){
		switch(eventName){
			default:		Event.observe(this, eventName, callback);break;
			case 'submit': 	this.setOnSubmit(callback);break;
			case 'reset':	this.setOnReset(callback);break;
			case 'close':	this.setOnClose(callback); break;
		}
		return this;
	},
/*
 * AlertBox#top(node) -> AlertBox
 * - node (Node): Element à ajouter.
 *
 * Cette méthode ajoute un Node au début du corps de la boite de dialogue.
 **/
	top: function(elem){
		this.body.top(elem);
		return this;
	},
	
	topChild: function(elem){
		this.body.top(elem);
		return this;
	},
/** 
 * AlertBox#centralize() -> AlertBox
 * - array (Array): Tableau d'element.
 *
 * Cette méthode ajoute un ou plusieurs Node au corps de la boite de dialogue.
 **/
	centralize: function(){return this.box.centralize();},
	positionWindow: function(){
		this.box.centralize();
		return this;
	},
/**
 * AlertBox#progressBar(start, maximum, message) -> AlertBox
 * - start (Number): Numéro de départ de la progressbar.
 * - maximum (Number): Numéro maximal de la progressbar.
 * - message (String): Message à afficher dans la progressbar.
 *
 * Ouvre une boite de dialogue formaté. Cette dernière contient une [[ProgressBar]] paramétrable.
 **/
 	progressBar: function(start, maximum, message){
		
		this.createProgressBar();
		
		this.body.removeChilds();

		this.progress.setProgress(start, maximum);
		this.progress.setText(message);
		
		this.addClassName('progress');
				
		this.setTitle($MUI('Loading')+'...').setType('NONE').setIcon('loading-gif');
		this.box.NoChrome(true);
		
		return this;
	},
	
	progressBar2: function(start, maximum, message){
		return this.progressBar(start, maximum, message);
	},
/**
 * AlertBox#reset() -> SimpleButton
 * AlertBox#reset(callback) -> AlertBox
 * AlertBox#reset(options) -> AlertBox
 * - callback (Function): Fonction à enregistrer.
 * - options (Object): Objet de configuration du bouton reset de la boite de dialogue.
 *
 * Cette méthode enregistre une fonction sur l'événement reset.
 *
 * <p class="note">Depuis la version 2.7, cette méthode prend en paramètre un objet de configuration.</p>
 *
 * #### Attributs du paramètre options
 *
 * Le paramètre `options` prend plusieurs attributs comme suivants :
 *
 * * `click` (`Function`): Action à l'annulation du formulaire.
 * * `text` (`String`): Texte à afficher sur le bouton reset.
 * * `icon` (`String`): Nom de l'icône CSS à afficher.s
 *
 **/
	reset: function(callback){
		if(Object.isUndefined(callback)) return this.btnReset;
		if(Object.isFunction(callback)){
			 return this.observe('reset', callback);
		}
		
		if(typeof callback == 'object'){
			if(!Object.isUndefined(callback.text)) this.btnReset.setText(callback.text);
			if(!Object.isUndefined(callback.icon)) this.btnReset.setIcon(callback.icon);
			if(Object.isFunction(callback.click)) this.observe('reset', callback.click);
		}
		
		if(Object.isUndefined(callback)){
			if(Object.isFunction(this.onReset)) {
				if(this.onReset.call(this)) return;
			}
			
			this.hide();
		}
		return this;
	}, 
/**
 * AlertBox#resizeTo(width, height) -> AlertBox
 * - callback (Function): Fonction à enregistrer.
 *
 * Redimensionne la boite de dialogue.
 **/
	resizeTo:function(width, height){
		this.box.resizeTo(width, height);
		return this;
	},
/*
 * AlertBox#remove() -> AlertBox
 **/
	remove:function(){
		return this.clear();
	},
/**
 * AlertBox#removeChild(node) -> AlertBox
 * - node (Node): Element à supprimer.
 *
 * Cette méthode supprime un [[Node]] du corps de la boite de dialogue.
 **/
	removeChild_: function(elem){
		this.body.removeChild(elem);
		return this;
	},
/**
 * AlertBox#show() -> AlertBox
 *
 * Cette méthode fait apparaitre la boite de dialogue.
 **/
	show: function(title, element, type){
		
		if(!Object.isUndefined(title)) 	this.setTitle(title);
		if(Object.isElement(element)) 	this.setContent(element);
		else{
			if(Object.isString(element) && !Object.isUndefined(element)) {	
				this.setHTML(element);
			}
		}	
			
		if(!Object.isUndefined(title) && !Object.isUndefined(element)) this.setType(type);
		
		this.onShow();
	
		return this;
	},
/**
 * AlertBox#submit() -> SimpleButton
 * AlertBox#submit(callback) -> AlertBox
 * AlertBox#submit(options) -> AlertBox
 * - callback (Function): Fonction à enregistrer.
 * - options (Object): Objet de configuration du bouton reset de la boite de dialogue.
 *
 * Cette méthode enregistre une fonction sur l'événement submit du formulaire.
 *
 * <p class="note">Depuis la version 2.7, cette méthode prend en paramètre un objet de configuration.</p>
 *
 * #### Attributs du paramètre options
 *
 * Le paramètre `options` prend plusieurs attributs comme suivants :
 *
 * * `click` (`Function`): Action à la soumition du formulaire.
 * * `text` (`String`): Texte à afficher sur le bouton submit.
 * * `icon` (`String`): Nom de l'icône CSS à afficher.
 *
 **/
	submit: function(callback){
		if(Object.isFunction(callback)){
			return this.observe('submit', callback);
		}
		
		if(typeof callback == 'object'){
			if(!Object.isUndefined(callback.text)) this.btnSubmit.setText(callback.text);
			if(!Object.isUndefined(callback.icon)) this.btnSubmit.setIcon(callback.icon);
			if(Object.isFunction(callback.click)) this.observe('submit', callback.click);
			if(callback.type == 'normal') this.btnSubmit.Normal();
		}
		
		if(Object.isUndefined(callback)){
			if(Object.isFunction(this.onSubmit)) {
				if(this.onSubmit.call(this)) return;
			}
				
			this.hide();
		}
				
		return this;
	},
/**
 * AlertBox#wait(node) -> AlertBox
 * - node (Node): Node à ajouter avant l'image de progression.
 *
 * Ouvre une boite de dialogue formaté. Cette dernière contient une image de chargement avec le message
 * Opération en cours.
 **/
	wait:function(elem){
		
		this.hide();
		
		if(!Object.isUndefined(elem)){
			this.appendChild(elem);
		}
		
		this.addClassName('wait');
		
		var loader = new Node('div', {className:"wrap-loader alertbox-loader"}, $MUI('Loading. Please wait') +'...');	
		this.appendChild(loader);
		
		return this.setType('NONE').show();
	},
/*
 * AlertBox#onClickSubmit() -> void
 *
 * (event) Cette méthode est appelée lorsque le bouton `Submit` est cliqué.
 **/
	onClickSubmit: function(evt){
		Event.stop(evt);

		if(Object.isFunction(this.onSubmit)) {
			if(this.onSubmit.call(this, evt)) return;
		}
			
		this.hide();
	},
/*
 * AlertBox#onClickReset() -> void
 *
 * (event) Cette méthode est appelée lorsque le bouton `Reset` est cliqué.
 **/
	onClickReset: function(evt){

		if(Object.isFunction(this.onReset)) {
			if(this.onReset.call(this, evt)) return;
		}
		
		this.hide();
	},
/*
 * AlertBox#onClickClose() -> void
 *
 * (event) Cette méthode est appelée au moment de la fermeture de la boite de dialogue.
 **/
	onClickClose: function(evt){
		
		if(Object.isFunction(this.onReset)) {
			
			if(this.onReset.call(this, evt)) return;
		}
		
		if(Object.isFunction(this.onClose)){
			if(this.onClose.call(this, evt)) return;
		}
		
		this.hide();
	},
/*
 * AlertBox#onKeyPress() -> void
 *
 * (event) Cette méthode est appelée lorsque la touche `entrée` est appuyée.
 **/
	onKeyPress: function(evt){
		if(evt.keyCode != 13) return;
		
		this.onClickSubmit(evt);
	},
/*
 * AlertBox#onShow() -> AlertBox
 *
 * (event) Cette méthode est appelée au moment de l'apparition de la fenêtre.
 **/
	onShow: function(){

		this.isShow = true;

		this.setStyle({display:'block'});
		this.box.show();
		this.box.setStyle({zIndex:10005});
		this.box.centralize();
		
		if(this.time > 0){
			(new Timer(function(){
				if(this.time == 0) return;
				
				this.time = 0;
				this.onClickClose(null);
			}.bind(this), this.time, 1)).start();
		}
		
		/*this.body.select('input').each(function(input){
			if((input.type == 'text' || input.type == 'password') && !input.readOnly){
				
				if(!Object.isUndefined(input.auto) && !input.auto){
					return;
				}
				
				input.observe('keyup', this.onKeyPress.bind(this));
			}
		});*/
		
		return this;	
	},
/** alias of: AlertBox#appendChild
 * AlertBox#a() -> AlertBox
 *
 * Alias de la méthode appendChild
 **/
	a: 	function(){return this.appendChild.apply(this, $A(arguments));},
/** alias of: AlertBox#appendChilds
 * AlertBox#as() -> AlertBox
 *
 * Alias de la méthode appendChilds
 **/
	as: function(){return this.appendChilds.apply(this, $A(arguments));},
/** alias of: AlertBox#i
 * AlertBox#i() -> AlertBox
 *
 * Alias de la méthode AlertBox#setIcon().
 **/
	i: 	function(){return this.setIcon.apply(this, $A(arguments));},
/** alias of: AlertBox#observe
 * AlertBox#on() -> AlertBox
 *
 * Alias de la méthode AlertBox#observe().
 **/
	on: function(){return this.observe.apply(this, $A(arguments));},
/** alias of: AlertBox#setTitle
 * AlertBox#ti() -> AlertBox
 *
 * Alias de la méthode AlertBox#setTitle().
 **/
	ti: function(){return this.setTitle.apply(this, $A(arguments));},
/** alias of: AlertBox#setType
 * AlertBox#ty() -> AlertBox
 *
 * Alias de la méthode AlertBox#setType().
 **/
	ty: function(){return this.setType.apply(this, $A(arguments));},
/**
 * AlertBox#getWindow() -> Window
 *
 * Cette méthode retourne l'instance [[Window]].
 **/
	getWindow: function(){
		return this.box;
	},
	/*
	 * Retourne l'objet Bouton Submit de la boite de dialogue
	 * @see SimpleButton
	 * returns {SimpleButton}
	 */
	getBtnSubmit:function(){
		return this.btnSubmit;	
	},
	/*
	 * Retourne l'objet Bouton Reset de la boite de dialogue
	 * @see SimpleButton
	 * returns {SimpleButton}
	 */
	getBtnReset:function(){
		return this.btnReset;	
	},
	/*
	 * Retourne l'objet ProgressBar de la boite de dialogue
	 * @see ProgressBar
	 * returns {ProgressBar}
	 */
	getProgressBar: function(){
		return this.progress;
	},
/**
 * AlertBox#setAbsolute(bool) -> AlertBox
 * - bool (Boolean): Valeur booléenne
 *
 * Change le comportement de la fenetre. Si la valeur de bool est `true` le positionnement de la fenêtre se fera de façon absolue `position:absolute`. Dans le cas contraire 
 * sera la propriété CSS sera `position:fixed`.
 **/
	setAbsolute:function(bool){
		this.box.setAbsolute(bool, this.background);
		this.background.setStyle(bool ? 'position:absolute' : 'position:fixed');
		return this;
	},
/*
 * AlertBox#setBgOpacity(op) -> AlertBox
 * - op (Number): Valeur de l'opacité entre 0 et 1.
 *
 * Change l'opacité du fond noir de la boite de dialogue.
 **/
	setBgOpacity:function(number){
		this.background.setOpacity(number);
		return this;
	},
	//Deprecated
	setContent: function(elem){
		this.body.removeChilds();
		this.appendChild(elem);
		return this;
	},
/**
 * AlertBox#setIcon(icon) -> AlertBox
 * - icon (String): Nom de l'icone.
 *
 * Assigne une icône CSS.
 **/
	setIcon: function(icon){
		if(icon == '') return this;
		this.box.setIcon(icon);
		return this;
	},
/**
 * AlertBox#setHTML(html) -> AlertBox
 * - html (String): Chaine HTML
 *
 * Ajoute du texte HTML au corps de la boite de dialogue.
 **/
	setHTML:function(html){
		this.body.innerHTML = Object.isUndefined(html)?'':html;
		
		/*this.body.select('input').each(function(input){
			if((input.type == 'text' || input.type == 'password') && !input.readOnly){
				
				if(!Object.isUndefined(input.auto) && !input.auto){
					return;
				}
				
				input.observe('keyup', this.onKeyPress.bind(this));
			}
		});*/
		
		return this;
	},
	/*
	 * @deprecated Depuis la version 2.x
	 * @see AlertBox#observe()
	 */
	setOnReset: function(fn){
		if(!Object.isUndefined(fn)) this.onReset = fn;
		return this;
	},
	/*
	 * @deprecated Depuis la version 2.x
	 * @see AlertBox#observe()
	 */
	setOnClose: function(fn){
		if(!Object.isUndefined(fn)) this.onClose = fn;
		return this;
	},
	/*
	 * @deprecated Depuis la version 2.x
	 * @see AlertBox#observe()
	 */
	setOnSubmit: function(fn){
		if(!Object.isUndefined(fn)) this.onSubmit = fn;
		return this;
	},
/**
 * AlertBox#setProgress(start, maximum, message) -> AlertBox
 * - start (Number): Numéro de départ de la progressbar.
 * - maximum (Number): Numéro maximal de la progressbar.
 * - message (String): Message à afficher dans la progressbar.
 *
 * Change l'etat de la progressbar. A utiliser après avoir fait AlertBox#progressBar().
 *
 * <p class="note">Sous IE il est recommandé d'utiliser cette methode après AlertBox#progressBar() plutot que AlertBox#progressBar() à répétition.
 * Il s'agit d'un bug lié à la gestion du DOM d'IE</p>
 **/
	setProgress: function(start, maximum, message){
		this.progress.setProgress(start, maximum);
		this.progress.setText(message);
		return this;
	},
/**
 * AlertBox#setText(text) -> AlertBox
 * - text (String): Texte brut.
 *
 * Affiche le texte brut dans la boite de dialogue. Cette méthode supprime le contenu de la boite de dialogue.
 **/
	setText: function(text){
		this.body.innerHTML = Object.isUndefined(text) ? '' : text.htmlEntities();
		return this;
	},
/**
 * AlertBox#setTitle(title) -> AlertBox
 * - title (String): Texte brut.
 *
 * Met à jours le titre de la boite de dialogue.
 **/
	setTitle: function(txt){
		if(txt != '') this.box.NoChrome(false);
		this.box.setTitle(Object.isUndefined(txt)?'':txt);
		return this;
	},
/**
 * AlertBox#setType(type) -> AlertBox
 * - type (String): Type de la boite de dialogue.
 *
 * Cette méthode change le comportement et l'affichage de la fenêtre.
 * Par exemple le type OK affiche simplement un bouton de validation.
 * Repportez-vous au namespace [[ALERT]] pour avoir les différents type.
 **/
	setType: function(type){
		
		switch(type){
			case AlertBox.AC://deprecated
				this.Timer(this.time);
							
			case AlertBox.NONE:	
				this.btnReset.hide();
				this.btnSubmit.hide();
				break;
				
			case AlertBox.OK: 		
				this.btnReset.hide();
				this.btnSubmit.show();
				this.btnSubmit.setText($MUI('Ok'));							
				break;
							
			case AlertBox.SEARCH:	
				this.btnReset.show();
				this.btnSubmit.show();
								
				this.btnReset.setText($MUI('Cancel'));
				this.btnSubmit.setText($MUI('Search'));
				
				break;
			
			case AlertBox.CLOSE:	
				this.btnReset.show();
				this.btnSubmit.hide();
				this.btnReset.setText($MUI('Close'));
				
				break;
			
			case AlertBox.CONFIRM:				
			case AlertBox.Y_N: 	
				this.btnReset.show();
				this.btnSubmit.show();
				
				this.btnSubmit.setText($MUI('Yes'));
				this.btnReset.setText($MUI('No'));
				break;
				
			default:
			case AlertBox.NORMAL:		
				this.btnReset.show();
				this.btnSubmit.show();
							
				this.btnSubmit.setText($MUI('Ok'));
				this.btnReset.setText($MUI('Cancel'));
							
				break;
		}
		
		return this;
	},
/**
 * AlertBox#setData(data) -> Window
 * - data (Object): Données à stocker.
 *
 * Cette méthode assigne un objet à attacher à l'instance.
 **/	
	setData: function(data){
		this.dataInstance = data;
		return this;
	},
/**
 * AlertBox#getData() -> Object
 *
 * Cette méthode retourne un objet attaché à l'instance.
 **/	
	getData:function(data){
		return this.dataInstance;
	},
/**
 * AlertBox#setTheme(theme) -> ProgressBar
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
		
		this.box.setTheme(this.theme);
		
		return this;
	}
};