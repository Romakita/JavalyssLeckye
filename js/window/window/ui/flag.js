/** section: UI
 * class Bubble < Element
 * La classe Bubble est une bulle permettant d'afficher des informations aux survoles d'un élément. Cette Bulle se positionne en fonction
 * de la position de la souris.
 **/
var Bubble = Class.createSprite('div');
Bubble.prototype = {
	__class__:	'bubble',
	className: 	'wobject bubble div-bubble',
	/** 
	 * Lapse de temps avant la disparition du Bubble
	 * @type {Number} en seconde
	 */
	duration:	4,
/**
 * new Bubble()
 *
 * Cette méthode créée une nouvelle instance Bubble.
 **/
	initialize:function(){
		this.hide();

		var s = this.appendChild__;
		this.appendChild__ = this.appendChild;

		this.appendChild =  function(elem){
		
			this.appendChild__(elem);
			
			if(!Object.isUndefined(this.evt)){
				this.moveTo(Event.pointerX(this.evt)+20, Event.pointerY(this.evt) + 20);
			}
			
			return this;
		};
	},
/*
 * Bubble#appendChild(node) -> Bubble
 * - node (Element): Element à ajouter dans la bulle. 
 *
 * Cette méthode ajoute une nouvelle élément à la bulle.
 **/

	//deprecated
	activeTimer:function(){
		this.Timer(4);
		return this;
	},
	/**
	 * Supprime le contenu du Bubble.
	 * @returns {Bubble}
	 */
	clear: function(){
		this.innerHTML = '';
		return this;
	},
	//deprecated
	deactiveTimer:function(){
		this.duration = 0;
		return this;
	},	
/**
 * Bubble#hide() -> Bubble
 *
 * Fait disparaitre l'instance et supprime son contenu.
 **/
	hide:function(){
		
		this.setStyle({display:'none'});
		this.clear();
		
		if(Object.isFunction(this.hide_bind)){
			this.element_tmp.stopObserving('mouseout', this.hide_bind);
			this.element_tmp = '';
		}
		
		this.hide_bind = null;
		
		if(this.timer && Object.isFunction(this.timer.stop)){
			this.timer.stop();
		}
		
		return this;
	},
	/**
	 * @ignore
	 */
	remove: function(){this.clear();return this;},
/**
 * Bubble#moveTo(x, y) -> Bubble
 * - x (Number): Coordonnée X en pixel.
 * - y (Number): Coordonnée y en pixel.
 *
 * Cette méthode 
 **/	
	moveTo: function(x, y){
		var dim = 	this.getDimensions();
	
		if(x + dim.width > document.stage.stageWidth){
			x = x - dim.width - 20;
		}
		
		if(y + dim.height > document.stage.stageHeight - 20){
			y = y - dim.height - 20;
		}
			
		this.setStyle({top: y + "px", left: x + "px"});
		
		return this;
	},
/**
 * Bubble#add(node, options) -> Bubble
 * - node (Element): Element cible.
 * - options (Object): Options de configuration de l'élément.
 *
 * Cette méthode ajoute un élement sur lequel l'instance [[Bubble]] doit se positionner au survol du `node`.
 *
 **/	
	add: function(node, obj){
		var options = {
			text:			'',
			duration:		4,
			auto:			true
		};
		
		Object.extend(options, obj || {});
		
		var self = this;
				
		node.on('mouseover', function(evt){
			self.clear();
			self.setStyle({display:''});
			
			if(Object.isElement(options.text)){
				self.appendChild(options.text);
			}else{
				if(Object.isArray(options.text)){
					options.text.each(function(e){
						if(Object.isElement(e)){
							self.appendChild(e);
						}else{
							self.setText(e);	
						}
					});
				}else{
					self.setText(options.text);
				}
			}
			
			self.moveTo(Event.pointerX(evt) + 20, Event.pointerY(evt) + 20);
			
			if(options.auto){
				self.bind(node);
			}
			self.Timer(options.duration);
		});
		
		return this;
	},
	
	Timer:function(duration){
		
		if(duration > 0){
			this.duration = duration;
			(this.timer = new Timer(function(){
				this.duration = 0;
				this.hide();
			}.bind(this), duration, 1)).start();
		}
		
		return this;
	},
/**
 * Bubble#show(evt [, mixed [, node]]) -> Bubble
 * - evt (Event): Evenement généré par le `mouseover` de l'élément ciblé.
 *
 * Fait apparaitre la bulle en fonction de l'évenement `mouseover` de l'element associé et 
 * se positionne en fonction de la souris.
 **/
	show:function(evt, mixed, node){
		this.evt = evt;
				
		this.setStyle({display:'', left:'10px', top:'10px'});
		
		this.clear();
		
		if(Object.isElement(mixed)) this.appendChild(mixed);
		else this.setText(mixed);
		
		this.moveTo(Event.pointerX(evt) + 20, Event.pointerY(evt) + 20);
				
		if(Object.isElement(node)) {
			this.bind(node);
		}
		
		return this.Timer(this.duration);/**/
	},
/*
 * Bubble#bind(node) -> Bubble
 * - node (Element): Element utilisé pour la perte de focus.
 *
 * Cette méthode enregistre l'élément qui déclenchera l'événement `mouseout` et fera disparaitre la bulle.
 **/
	bind: function(node){
		this.hide_bind = 	this.hide.bind(this);
		this.element_tmp = 	node;
		node.observe('mouseout', this.hide_bind);
		return this;
	},
/**
 * Bubble#Timer(time) -> Bubble
 * - time (Number): Temps en seconde avant la disparition automatique.
 * 
 * Déclenche la fermeture automatique de la boite de dialogue.
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	Timer:function(time, bool){
		this.duration = time; 
		
		if(!Object.isUndefined(bool)){
			(new Timer(function(){
				this.duration = 0;
				this.hide();
			}.bind(this), this.duration, 1)).start();
		}
		
		return this;
	},
/**
 * Bubble#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new Bubble();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new Bubble();
 *     c.Text('mon text');
 *     alert(c.Text()); //mon text
 * 
 **/
	setText: function(txt){
		if(!Object.isUndefined(txt)){
			this.innerHTML = txt;	
		}
		return this;
	},
	
	getText: function(txt){
		return this.innerHTML;
	},
	
	Text: function(txt){
		if(!Object.isUndefined(txt)){
			this.innerHTML = txt;	
		}
		return this.innerHTML;
	},
	
	setDuration: function(duration){
		this.duration = duration;
		return this;
	},
/*
 * Bubble#__destruct() -> void
 * 
 * Destructeur de l'objet complexe.
 **/
	__destruct:function(){
		this.innerHTML = '';
		delete this.timer;
	}
};
/** section: UI
 * class Flag < Element
 * Cette classe gère la création de drapeau avec contenu descriptif.
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>Javascript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance Flag en javascript : </p>
 * 
 *     var flag = new Flag();
 *     var button = new SimpleButton({text:'Mon boutton'});
 * 
 *     //ancienne notation
 *     button.on('mouseover', function(){
 *         flag.setText('Mon texte descriptif').setType(Flag.TOP).color(Flag.GREY).show(this, true);
 *     });
 *     //nouvelle notation
 *     flag.add(button, {text:'mon texte descriptif', color:FLAG.GREY, orientation:Flag.TOP});
 *     document.body.appendChilds([flag, button]);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment faire apparaitre un Flag au survol d'un élément :</p>
 * 
 *     <div class="box-flag type-top icon-documentinfo color-grey" title="Mon information">
 *     <span class="box-simple-button"><a href="#">Mon boutton</a></span>
 *     </div>
 *
 * </div>
 * </div>
 **/
var Flag = Class.createSprite('div');

Flag.prototype = {
	__class__:	'flag',
	className:	'wobject flag',
	scroll:		false,
	absolute:	false,
	delta:		false,
/**
 * new Flag(type)
 * - type (String): Type du Flag.
 *
 * Cette méthode créée une nouvelle instance du drapeau.
 **/
	initialize: function(type){
		this.delta = 	false;
		this.cursor = 	new Node('div', {className: 'flag-cursor'});
		this.body = 	new Node('div', {className: 'flag-text'});
		
		this.appendChild(this.body);
		this.appendChild(this.cursor);
		this.setType(Flag.TOP);
		this.observe('mouseover', this.hide.bind(this));
		
		if(!Object.isUndefined(type)) this.setType(type);
		
		this.appendChild = function(node){
			this.body.appendChild(node);
		};
		
		this.css('z-index', '1000');
	},
/**
 * Flag#add(node, options) -> Flag
 * - node (Element): Element cible.
 * - options (Object): Options de configuration de l'élément.
 *
 * Cette méthode ajoute un élement sur lequel l'instance [[Flag]] doit se positionner au survol du `node`.
 *
 * <p class="note">Cettte méthode est disponible depuis la version 4.7</p>
 **/	
	add: function(elem, obj){
		var options = {
			orientation: 	Flag.TOP,
			color:			Flag.GREY,
			text:			'',
			icon:			'',
			auto:			true,
			onShow:			false
		};
		
		Object.extend(options, obj || {});
		
		var self = this;
		
		elem.on('mouseover', function(evt){
			
			var text = options.text;
			
			if(Object.isFunction(options.text)){
				text = options.text.call(this, evt);
			}
			
			if(options.icon){
				var content = new Node('p', {className:'icon-' + options.icon});
				
				if(Object.isElement(text)){
					content.appendChild(text);
				}else{
					
					if(Object.isArray(text)){
						text.each(function(e){
							if(Object.isElement(e)){
								content.appendChild(e);
							}else{
								content.innerHTML += e;
							}
						});
					}else{
						content.innerHTML = text;
					}
								
				}
				
				text = content;
				
				if(document.navigator.client == 'IE' && document.navigator.version < 9){
					text = content.outerHTML;
				}
			}
			
			self.setText(text);
			self.setOrientation(options.orientation);
			self.setColor(options.color);
			
			if(Object.isFunction(options.onShow)){
				options.onShow.call(this, evt);
			}
			
			if(options.auto){
				self.show(this, true);
			}else{
				self.show(this);
			}
		});
	},
/**
 * Flag#clear() -> Flag
 *
 * Réinitialise l'instance.
 **/
	clear: function(){
		this.body.innerHTML = '';
		return this;
	},
/*
 * Flag#Absolute(bool) -> Boolean
 * - bool (Boolean): Si la valeur est vrai alors le positionnement sera calculé en absolue.
 *
 * Cette méthode change la façon dont va être calculé le positionnement du flag.
 **/	
	Absolute:function(bool){},
/**
 * Flag#show(node [, bool]) -> Flag
 * - node (Element): Element cible.
 * - bool (Boolean): Si la valeur est vrai alors le drapeau disparaitra automatiquement lorsque le `mouseout` de `node` sera déclenché.
 *
 * Fait apparaitre le drapeau à proximité de l'élément `node` en fonction du type passé à [[Flag#setType]].
 **/
	show:function(elem, bool){
		if(Object.isUndefined(elem)) throw('Erreur: arg[0] est attendu. "undefined"');
		
		if(document.navigator.mobile && bool) return this;
		
		elem = $(elem);
		
		if(!Object.isUndefined(elem.orientation)){
			this.setType(elem.orientation);
		}
		
		this.removeClassName('flag-show');
		this.addClassName('flag-show');
		
		this.css('top', '0');
		this.css('left','0');
		
		var width = 	this.getWidth();
		var height = 	this.getHeight();
		
		this.clonePosition(elem, {setWidth:false, setHeight:false});
		
		switch(this.type){
			case Flag.TOP:
				this.css('left', this.css('left') + ((elem.getWidth() - width) / 2));
				this.css('top', this.css('top') - this.getHeight());
				break;
			case Flag.BOTTOM:
				this.css('left', this.css('left') + ((elem.getWidth() - width) / 2));
				this.css('top', this.css('top') + elem.getHeight());
				break;
			case Flag.RIGHT:
				this.css('left', this.css('left') + elem.getWidth());
				this.css('top', this.css('top') + ((elem.getHeight() - height) / 2));
				break;
			case Flag.LEFT:
				this.css('left', this.css('left') - width);
				this.css('top', this.css('top') + ((elem.getHeight() - height) / 2));
				break;
				
			case Flag.RB:
				this.css('top', this.css('top') + elem.getHeight());
				break;
			case Flag.RT:
				this.css('top', this.css('top') - height);
				break;
			case Flag.LB:
				this.css('left', this.css('left') - width + elem.getWidth());
				this.css('top', this.css('top') + elem.getHeight());
				break;
			case Flag.LT:
				this.css('left', this.css('left') - width + elem.getWidth());
				this.css('top', this.css('top') - height);
				break;
		}
				
		this.hide_bind = this.hide.bind(this);
		if(!Object.isUndefined(bool)) elem.observe('mouseout', this.hide_bind);
		
		this.elem = elem;			
		return this;
	},
/** alias of: Flag#setColor
 * Flag#color(color) -> Flag
 * - color (String): Nom de la couleur du drapeau.
 *
 * Cette méthode change la couleur du drapeau. Les couleurs prisent en charge
 * nativement sont :
 *
 * * Flag.RED
 * * Flag.GREEN
 * * Flag.BLUE
 * * Flag.DARK
 * * Flag.GREY
 * * Flag.WHITE
 * 
 **/
	color: function(color){
		if(!Object.isUndefined(color)){
			
			if(this.colorName != color){
				this.removeClassName(this.colorName);
				this.colorName = color;
				this.addClassName(color);
				
				this.cursor.className = 'flag-cursor flag-cursor-'+color;
				this.body.className = 	'flag-text flag-text-'+color;
			}
		}
		return this;
	},
/**
 * Flag#hide() -> Flag
 * 
 * Cette méthode fait disparaitre le drapeau.
 **/
	hide:function(){
		
		this.removeClassName('flag-show');
		
		if(Object.isFunction(this.hide_bind)){
			this.elem.stopObserving('mouseout', this.hide_bind);
			this.hide_bind =	null;
			this.elem = 		null;
		}
		
		this.cursor.className = 'flag-cursor';
		this.body.className = 	'flag-text';
		return this;
	},
/**
 * Flag#moveTo(x, y) -> Flag
 * - x (Number): Coordonnées en pixel.
 * - y (Number): Coordonnées en pixel.
 *
 * Positionne le drapeau aux coordonnées demandé.
 **/
	moveTo:function(x, y){
		this.setStyle({top: x +'px', left: y +'px'});
		return this;
	},
/**
 * Flag#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new Flag();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new Flag();
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
 * Flag#getText() -> Flag
 * 
 * Retourne le texte du drapeau.
 **/
	getText: function(){
		return this.body.innerHTML;
	},
/**
 * Flag#setColor(color) -> Flag
 * - color (String): Nom de la couleur du drapeau.
 *
 * Cette méthode change la couleur du drapeau. Les couleurs prisent en charge
 * nativement sont :
 *
 * * Flag.RED
 * * Flag.GREEN
 * * Flag.BLUE
 * * Flag.DARK
 * * Flag.GREY
 * * Flag.WHITE
 * 
 * <p class="note">Cettte méthode est disponible depuis la version 4.7</p>
 **/
	setColor: function(color){
		return this.color(color);
	},
/**
 * Flag#setText(mixed) -> Flag
 * - mixed (Element, String, Number): Contenu à afficher.
 *
 * Ajoute du texte, un nombre ou un élement au drapeau.
 **/
	setText: function(text){
		if(Object.isUndefined(text)) return;
		this.body.innerHTML = '';
		if(Object.isElement(text)){
			this.body.appendChild(text);
		}else{
			this.body.innerHTML = text;
		}
		return this;
	},
/**
 * Flag#setOrientation(orientation) -> Flag
 * - orientation (String): Orientation du Flag.
 *
 * Cette méthode change l'orienation du Flag. Les orientations pris en charge sont :
 *
 * * Flag.TOP
 * * Flag.BOTTOM
 * * Flag.LEFT
 * * Flag.LB
 * * Flag.LT
 * * Flag.RIGHT
 * * Flag.RB
 * * Flag.RT
 * 
 * <p class="note">Cettte méthode est disponible depuis la version 4.7</p>
 **/
	setOrientation: function(orientation){
		return this.setType(orientation);
	},
/** alias of: Flag#setOrientation
 * Flag#setType(orientation) -> Flag
 * - orientation (String): Orientation du Flag.
 *
 * Cette méthode change l'orienation du Flag. Les orientations pris en charge sont :
 *
 * * Flag.TOP
 * * Flag.BOTTOM
 * * Flag.LEFT
 * * Flag.LB
 * * Flag.LT
 * * Flag.RIGHT
 * * Flag.RB
 * * Flag.RT
 * 
 **/
	setType: function(type){
		if(Object.isUndefined(type)) return this;
		
		this.removeClassName(this.type);
		this.type = type;
		this.addClassName(this.type);
		
		return this;
	},
	/** @ignore */
	setTop: function(top){
		this.setStyle({top: top +'px'});
		return this;
	},
	/** @ignore */
	setLeft: function(left){
		this.setStyle({left: left +'px'});
		return this;
	},
/**
 * Flag#decalTo(x, y) -> Flag
 * - x (Number): Décalage en pixel.
 * - y (Number): Décalage en pixel.
 *
 * Decale le flag par rapport à sa position actuelle.
 * <p class="note">Implémenté depuis la version 2.1RC2</p>
 **/
	decalTo: function(x, y){
		if(!(x == 0 && y == 0)){
			this.setStyle({top: (this.css('top') + y) +'px', left: (this.css('left') + x) +'px'});
		}
		return this;
	},
/*
 * Flag#__destruct() -> void
 * 
 * Destructeur de l'objet complexe.
 **/
	__destruct:function(){
		this.removeChild(this.body);
		this.removeChild(this.cursor);
	}
};
/**
 * Flag.Transform(node) -> Flag
 * Flag.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Flag.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[Flag]].
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>HTML</span></li>
 * <li><span>HTML 5</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment faire apparaitre un Flag au survol d'un élément :</p>
 * 
 *     <div class="box-flag type-top icon-documentinfo color-grey" title="Mon information">
 *     <span class="box-simple-button"><a href="#">Mon boutton</a></span>
 *     </div>
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment faire apparaitre un Flag au survol d'un élément avec HTML5 :</p>
 * 
 *     <div class="box-flag" title="Mon information" data-orientation="top" data-icon="documentinfo" data-color="grey">
 *     <span class="box-simple-button"><a href="#">Mon boutton</a></span>
 *     </div>
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div class="box-flag type-top icon-documentinfo color-grey" title="Mon information">
 * <span class="box-simple-button"><a href="#">Mon boutton</a></span>
 * </div>
 *
 **/
Flag.Transform = function(e){
	
	if(!WindowRegister.Flag){
		WindowRegister.Flag = $WR.Flag = $WR().Flag = new Flag();
		document.body.appendChild($WR().Flag);	
	}
		
	if(Object.isElement(e)){
		var options = {
			orientation: 	e.data('orientation'),
			icon:			e.data('icon'),
			color:			e.data('color'),
			text:			e.title,
			auto:			e.data('auto') || !e.className.match(/noauto/)
		};
		
		if(!options.orientation){
			options.orientation = e.className.match(/type-/) ? e.className.substring(e.className.lastIndexOf('type-')).split(' ')[0].replace('type-','flag-') : Flag.RIGHT
		}else{
			options.orientation = 'flag-' + options.orientation;
		}
		
		if(!options.icon){
			options.icon = e.className.match(/icon-/) ? e.className.substring(e.className.lastIndexOf('icon-')).split(' ')[0].replace('icon-','') : ''
		}
		
		if(!options.color){
			 options.color = e.className.match(/color-/) ? e.className.substring(e.className.lastIndexOf('color-')).split(' ')[0].replace('color-','') : Flag.GREY	
		}
				
		switch(options.orientation){
			case 'flag-RT':
				options.orientation = Flag.RT;
				break;
			case 'flag-RB':
				options.orientation = Flag.RB;
				break;
			case 'flag-LT':
				options.orientation = Flag.LT;
				break;
			case 'flag-LB':
				options.orientation = Flag.LB;
				break;
		}
		
		e.removeClassName('icon-' + options.icon);			
		e.title = 	'';
		
		$WR().Flag.add(e, options);
				
		return e;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(Flag.Transform(e));
	});
	
	return options;
};

var FLAG = {
/**
 * Flag.TOP -> String
 **/
	TOP: 	'flag-top',
/**
 * Flag.BOTTOM -> String
 **/
	BOTTOM:	'flag-bottom',
/**
 * Flag.LEFT -> String
 **/
	LEFT:	'flag-left',
/**
 * Flag.RIGHT -> String
 **/
	RIGHT:	'flag-right',
/**
 * Flag.RB -> String
 **/
	RB: 'flag-bottom flag-RB',
/**
 * Flag.RT -> String
 **/
	RT: 'flag-top flag-RT',
/**
 * Flag.LB -> String
 **/
	LB: 'flag-bottom flag-LB',
/**
 * Flag.LT -> String
 **/
	LT: 'flag-top flag-LT',
/**
 * Flag.GREY -> String
 **/	
	GREY:	'grey',
/**
 * Flag.RED -> String
 **/	
	RED:	'red',
/**
 * Flag.BLUE -> String
 **/	
	BLUE:	'blue',
/**
 * Flag.GREEN -> String
 **/	
	GREEN:	'green',
/**
 * Flag.WHITE -> String
 **/	
	WHITE:	'white'
};
Object.extend(Flag, FLAG);
/**
 * Window#createBubble() -> Bubble
 *
 * Cette méthode Cette méthode créée une nouvelle instance de [[Bubble]] relative à l'instance [[Window]].
 *
 * <p class="note">Uniquement disponible si le fichier window.flag.js est inclut dans le projet.</p>
 **/
Window.prototype.createBubble = function(){
	if(!Object.isUndefined(this.Bubble)) return this.Bubble;
	
	this.Bubble = new Bubble();
	this.superBody.appendChild(this.Bubble);
	
	return this.Bubble;
};
/**
 * Window#createFlag() -> Flag
 *
 * Cette méthode Cette méthode créée une nouvelle instance de Flag relative à l'instance [[Window]].
 *
 * <p class="note">Uniquement disponible si le fichier window.flag.js est inclut dans le projet.</p>
 **/
Window.prototype.createFlag = function(){
	if(!Object.isUndefined(this.Flag)) return this.Flag;
	
	this.Flag = new Flag();
	this.superBody.appendChild(this.Flag);
	
	return this.Flag;
};
/**
 * Widget#createFlag() -> Flag
 *
 * Cette méthode Cette méthode créée une nouvelle instance de Flag relative à l'instance [[Window]].
 *
 * <p class="note">Uniquement disponible si le fichier window.flag.js est inclut dans le projet.</p>
 **/
Widget.prototype.createFlag = function(){
	if(!Object.isUndefined(this.Flag)) return this.Flag;
	
	this.Flag = new Flag();
	this.appendChild_(this.Flag);
	
	return this.Flag;
};