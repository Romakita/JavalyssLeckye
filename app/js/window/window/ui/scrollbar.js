/** section: UI
 * class ScrollBar
 * Cette classe créée une bar de défillement personnalisable.
 * 
 * <p class="note">Une partie du code pour la gestion du scroll sous les tablettes provient de la librairie iScroll 4.</p>
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div><pre>
 * <code>
 * var wrapper = new Node('div', {style:'height:500px; width:500px'}, 'supercontentblalab ...');
 * var scroll = ScrollBar({node:wrapper, type:'vertical'});
 * </code></pre></div>
 * <div><pre>
 * <code>&lt;div class="box-scroll-bar"&gt;lorem ipsum etc...&lt;/div&gt;</code>
 * </pre></div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div class="box-scroll-bar type-vertical" style="height:300; width:300px">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 * It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</div>
 *
 **/
var ScrollBar = Class.create();

ScrollBar.Vertical = new Class.createSprite('div');
/** section: UI
 * class ScrollBar.Vertical
 **/
ScrollBar.Vertical.prototype = {
	className:'wobject scrollbar vertical',
/**
 * ScrollBar.Vertical#BtnTop -> SimpleButton
 **/
	BtnTop:null,
/**
 * ScrollBar.Vertical#BtnBottom -> SimpleButton
 **/
 	BtnBottom:null,
/**
 * ScrollBar.Vertical#Cursor -> Node
 **/
	Cursor:null,
/**
 * new ScrollBar.Vertical()
 *
 * Créée une nouvelle instance [[ScrollBar.Vertical]].
 **/	
	initialize:function(){
		this.BtnTop = 		new SimpleButton({icon:'1up-mini', type:'mini', className:'top'});
		this.BtnBottom =	new SimpleButton({icon:'1down-mini', type:'mini', className:'bottom'});
		this.Cursor =		new Node('div', {className:'cursor'}, new Node('div'));
		this.body =			new Node('div', {className:'wrap-body'}, this.Cursor);
		
		this.appendChilds([
			this.body,
			this.BtnTop,
			this.BtnBottom
		]);
		
		this.Cursor.createDrag({opacity:1, zIndex:1});
	},
/**
 * ScrollBar.Vertical#refresh() -> ScrollBar.Vertical
 *
 * Cette méthode rafraichi le rendu de la scrollbar.
 **/
 	refresh:function(){
		this.setCursorHeight(this.getRatio());
	},
/**
 * ScrollBar.Vertical#getButtonHeight() -> Number
 *
 * Cette méthode retourne la hauteur utile de la scrollbar.
 **/	
	getButtonHeight:function(){
		return this.BtnTop.css('height') + this.BtnTop.css('border-top-width') + this.BtnTop.css('border-bottom-width');
	},
/**
 * ScrollBar.Vertical.getHeight() -> Number
 *
 * Cette méthode retourne la hauteur utile de la scrollbar.
 **/	
	getHeight:function(){
		return this.body.getHeight();
	},
/**
 * ScrollBar.Vertical#setRatio(ratio) -> ScrollBar.Vertical 
 **/	
	setRatio:function(ratio){
		this.ratio = ratio;
		this.removeClassName('hide');
		
		if(this.ratio >=  1){//le contenu ne déborde pas
			this.addClassName('hide');
		}
		
		this.setCursorHeight(this.ratio);
				
		this.Cursor.dragOptions.constraint = {
			x1:	0,
			x2:	1,
			y1:	0,
			y2:	this.getHeight()
		};
	},
/**
 * ScrollBar.Vertical#getRatio() -> Number 
 **/	
	getRatio:function(){
		return this.ratio;
	},
/**
 * ScrollBar.Vertical#setCursorHeight(percent) -> Number
 *
 * Cette méthode retourne la hauteur utile de la scrollbar.
 **/	
	setCursorHeight:function(percent){
		this.Cursor.css('height', this.getHeight() * percent);
	},
/**
 * ScrollBar.Vertical#setCursorTop(percent) -> ScrollBar.Vertical
 *
 * Cette méthode permet d'assigner la position du curseur à partir de la position de l'élément principal.
 *
 **/	
	setCursorTop:function(percent){
		var top = percent * (this.getHeight() - this.Cursor.getHeight());
		this.Cursor.css('top', top);
		return this;
	},
/**
 * ScrollBar.Vertical#getCursorTop() -> Number
 *
 * Cette méthode retourne la position du curseur en pourcentage.
 *
 **/	
	getCursorTop:function(){
		return this.Cursor.positionedOffset().top / (this.getHeight() - this.Cursor.getHeight());
	},
/**
 * ScrollBar.Vertical#getCursorPixelTop() -> Number
 *
 * Cette méthode retourne la position du curseur en pixel.
 *
 **/	
	getCursorPixelTop:function(){
		return this.Cursor.positionedOffset().top;
	},
	
	isStart:function(o){
		o = o || 4;
		return this.Cursor.positionedOffset().top <= o;
	},
	
	isEnd: function(o){
		o = o || 4;
		return this.Cursor.positionedOffset().top + this.Cursor.getHeight() >= this.getHeight() - o;
	}
};

ScrollBar.Horizontal = new Class.createSprite('div');
/** section: UI
 * class ScrollBar.Horizontal
 **/
ScrollBar.Horizontal.prototype = {
	className:'wobject scrollbar horizontal show',
/**
 * ScrollBar.Horizontal#BtnTop -> SimpleButton
 **/
	BtnTop:null,
/**
 * ScrollBar.Horizontal#BtnBottom -> SimpleButton
 **/
 	BtnBottom:null,
/**
 * ScrollBar.Horizontal#Cursor -> Node
 **/
	Cursor:null,
/**
 * new ScrollBar.Horizontal()
 *
 * Créée une nouvelle instance [[ScrollBar.Horizontal]].
 **/	
	initialize:function(){
		this.BtnLeft = 		new SimpleButton({icon:'1left-mini', type:'mini', className:'left'});
		this.BtnRight =		new SimpleButton({icon:'1right-mini', type:'mini', className:'right'});
		this.Cursor =		new Node('div', {className:'cursor'}, new Node('div'));
		this.body =			new Node('div', {className:'wrap-body'}, this.Cursor);
		
		this.appendChilds([
			this.body,
			this.BtnLeft,
			this.BtnRight
		]);
		
		this.Cursor.createDrag({opacity:1, zIndex:1});
	},
/**
 * ScrollBar.Horizontal#refresh() -> ScrollBar.Horizontal
 *
 * Cette méthode rafraichi le rendu de la scrollbar.
 **/
 	refresh:function(){
		this.setCursorWidth(this.getRatio());
	},
/**
 * ScrollBar.Horizontal#getButtonWidth() -> Number
 *
 * Cette méthode retourne la largeur utile de la scrollbar.
 **/	
	getButtonWidth:function(){
		return this.BtnLeft.css('width') + this.BtnLeft.css('border-left-width') + this.BtnLeft.css('border-right-width');
	},
/**
 * ScrollBar.Horizontal#getWidth() -> Number
 *
 * Cette méthode retourne la largeur utile de la scrollbar.
 **/	
	getWidth:function(){
		return this.body.getWidth();
	},
/**
 * ScrollBar.Horizontal#setRatio() -> ScrollBar.Vertical 
 **/	
	setRatio:function(ratio){
		this.ratio = ratio;
		
		this.removeClassName('hide');
		
		if(this.ratio >= 1){//le contenu ne déborde pas
			this.addClassName('hide');
		}
		
		this.setCursorWidth(this.ratio);
		
		this.Cursor.dragOptions.constraint = {
			x1: 0,
			x2:	this.getWidth(),
			y1:	0,
			y2:	1
		};
	},
/**
 * ScrollBar.Horizontal#getRatio() -> Number 
 **/	
	getRatio:function(){
		return this.ratio;
	},
/**
 * ScrollBar.Horizontal#setCursorWidth(percent) -> Number
 *
 * Cette méthode retourne la hauteur utile de la scrollbar.
 **/	
	setCursorWidth:function(percent){
		this.Cursor.css('width', this.getWidth() * percent);
	},
/**
 * ScrollBar.Horizontal#setCursorleft(leftWrapper) -> ScrollBar.Horizontal
 *
 * Cette méthode permet d'assigner la position du curseur à partir de la position de l'élément principal.
 **/	
	setCursorLeft:function(percent){
		var left = percent * (this.getWidth() - this.Cursor.getWidth());
		this.Cursor.css('left', left);
		return this;
	},
/**
 * ScrollBar.Horizontal#setCursorleft() -> Number
 *
 * Cette méthode retourne la position du curseur en pixel.
 *
 **/	
	getCursorPixelLeft:function(){
		return this.Cursor.positionedOffset().left;
	},
/**
 * ScrollBar.Vertical#getCursorLeft() -> Number
 *
 * Cette méthode retourne la position du cursor / ratio = position de wrapper.
 *
 **/	
	getCursorLeft:function(){
		return this.Cursor.positionedOffset().left / (this.getWidth() - this.Cursor.getWidth());
	}
};

ScrollBar.prototype = {
	__class__:		'scrollbar',
	type:			'vertical',
	node:			false,
	wrapper:		false,
	sync:			false,
/**
 * ScrollBar.layoutMode -> Boolean
 * Si la valeur est vrai, le rendu du barre de défilement remplacé par celle de Window. Dans le cas contraire c'est la barre de défilement du navigateur qui sera utilisée.
 **/
 	layoutMode:		true,
/**
 * ScrollBar.virtual -> Boolean
 **/	
	virtual:		false,
/**
 * ScrollBar.pas -> Number
 **/
	pas:			0.3,
	typeOf:			'%',
	firstPas:		false,
/**
 * ScrollBar.timer -> Number
 **/
	timer:			null,
	duration:		0.06,
	IS_MOUSEDOWN:	false,
	LAST_WHEEL:		0,
	CURRENT_WHEEL:	1,
	minScrollX:		0,
	minScrollY:		0,
	maxScrollX:		0,
	maxScrollY:		0,
	scrollX:		0,
	scrollY:		0,
	buttonWidth:	16,
	buttonHeight:	16,
	//mobile
	scale: 			1,
	moved:			false,
	aniTime: 		null,
	useTransform: 	true,
	useTransition: 	false,
	bounce: 		true,
	bounceLock: 	false,
	momentum: 		true,
	lockDirection: 	true,
	scrollable:		false,
	height:			0,
	width:			0,
/**
 * new ScrollBar(options)
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance [[ScrollBar]].
 * 
 * #### Attributs du paramètre options
 *
 * * `node`: Noeud sur lequel on doit ajouter les barres de scroll.
 * * `wrapper`: Si vous avez devez un sous conteneur au node ajoutez le. Le script ne créera pas de sous conteneur supplémentaire.
 * * `type`: Type d'horientation (vertical, horizontal).
 *
 **/
	initialize:function(obj){
		
		this.layoutMode = !(document.navigator.touchevent && document.navigator.css3.overflowScrolling);
			
		if(!Object.isUndefined(obj)){
			Object.extend(this, obj);
		}
		
		if(Object.isString(this.pas)){
			if(this.pas.match('px')){
				this.pas = 	this.pas.replace('px', '') * 1;
				this.typeOf = 'px';
			}else{
				if(this.pas.match('%')){
					this.pas = 	this.pas.replace('%', '') / 100;
					this.typeOf = '%';
				}
			}
		}
		
		if(this.virtual){
			this.layoutMode = true;	
		}
		
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		this.useTransform = document.navigator.css3.transform && document.navigator.mobile ? this.useTransform : false;
		this.trnOpen = 'translate' + (document.navigator.css3.perspective ? '3d(' : '(');
		this.trnClose = document.navigator.css3.perspective ? ',0)' : ')';
		
		this.onmouseup_bind = this.onMouseUp.bind(this);
		//
		// Vertical Bar
		//		
		this.Vertical = 	new ScrollBar.Vertical();
		//
		// Horizontal Bar
		//
		this.Horizontal = 	new ScrollBar.Horizontal();
		//
		// Cache
		// 
		this.Cache = new Node('div', {className:'wrap-cache'});
				
		var node = 		this.node;
		this.node = 	'';
		var wrapper = 	this.wrapper;
		this.wrapper = 	'';
		
		this.setNode(node, wrapper);
		this.setType(this.type);
		
		if(this.layoutMode){
		
			this.Vertical.Cursor.on('drag', this.onDragCursorV.bind(this));
			this.Horizontal.Cursor.on('drag', this.onDragCursorH.bind(this));
			
			this.Vertical.Cursor.on('dragend', function(){
				this.moved = false;
			}.bind(this));
			
			this.Horizontal.Cursor.on('dragend', function(){
				this.moved = false;
			}.bind(this));
			
			
			this.Vertical.Cursor.on('dragend', function(){
				this.Observer.fire('scrollend');
				this.EventType = '';
			}.bind(this));
			
			this.Horizontal.Cursor.on('dragend', function(){
				this.Observer.fire('scrollend');
				this.EventType = '';
			}.bind(this));
			
			Event.observe(this.node, "DOMMouseScroll", 	this.onWheel.bind(this), false); // Firefox*/
			Event.observe(this.node, "mousewheel", 		this.onWheel.bind(this), false);
			this.node.catchWheelEvent();
			
			this.Vertical.BtnTop.on('mousedown', this.onMouseDownBtnTop.bind(this), false);
			this.Vertical.BtnTop.on('mouseover', this.onMouseOver.bind(this));
			this.Vertical.BtnTop.on('mouseout', this.onMouseOut.bind(this));
			
			this.Vertical.BtnBottom.on('mousedown', this.onMouseDownBtnBottom.bind(this), false);
			this.Vertical.BtnBottom.on('mouseover', this.onMouseOver.bind(this));
			this.Vertical.BtnBottom.on('mouseout', this.onMouseOut.bind(this));
			
			this.Horizontal.BtnLeft.on('mousedown', this.onMouseDownBtnLeft.bind(this), false);
			this.Horizontal.BtnLeft.on('mouseover', this.onMouseOver.bind(this));
			this.Horizontal.BtnLeft.on('mouseout', this.onMouseOut.bind(this));
			
			this.Horizontal.BtnRight.on('mousedown', this.onMouseDownBtnRight.bind(this), false);
			this.Horizontal.BtnRight.on('mouseover', this.onMouseOver.bind(this));
			this.Horizontal.BtnRight.on('mouseout', this.onMouseOut.bind(this));
			
			this.Vertical.body.on('mousedown', this.onMouseDownScrollV.bind(this));
			this.Vertical.body.on('mouseover', this.onMouseOver.bind(this));
			this.Vertical.body.on('mouseout', this.onMouseOut.bind(this));
			
			this.Horizontal.body.on('mousedown', this.onMouseDownScrollH.bind(this));
			this.Horizontal.body.on('mouseover', this.onMouseOver.bind(this));
			this.Horizontal.body.on('mouseout', this.onMouseOut.bind(this));		
			
			document.observe('mouseup', this.onmouseup_bind);
		}else{
			Event.observe(this.node, 'touchstart', function(evt){
				this.moved = false;
			}.bind(this));
			
			Event.observe(this.node, 'touchmove', function(evt){
				this.moved = true;
			}.bind(this));
		}
		
	},
	
	destroy: function(){
		this.destroy = null;
		
		document.stopObserving('mouseup', this.onmouseup_bind);
		
		this.Observer.destroy();
		
		this.Observer =	null;
		
		this.wrapper =					null;
		
		try{
			this.node.select('.wobject').each(function(e){
				if(Object.isFunction(e.destroy)) e.destroy;
			});
			this.node.refresh = 			null;
			this.node.scrollTo = 			null;
			this.node.get =					null;
		}catch(er){}
		
		this.node =						null;
		this.Vertical.Cursor =			null;
		this.Vertical.BtnTop = 			null;
		this.Vertical.BtnBottom =		null;
		this.Vertical = 					null;
		
		this.Horizontal.BtnLeft = 			null;
		this.Horizontal.BtnRight =			null;
		this.Horizontal.Cursor =			null;
		this.Horizontal = 					null;
		this.Cache = 					null;
	},
/**
 * ScrollBar#addPasY() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur de [[ScrollBar#pas]].
 **/
 	addPasY: function(nb){
		
		nb = Object.isUndefined(nb) ? 1 : Math.abs(nb);
		
		switch(this.typeOf){
			case '%':
				this.setScrollTop(this.getScrollTop() + (this.viewport.height * this.pas * nb));
				break;
			case 'px':
				this.setScrollTop(this.getScrollTop() + this.pas * nb);
				break;	
		}
		
		return this;
	},
/**
 * ScrollBar#subPasY() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur négative de [[ScrollBar#pas]] .
 **/	
	subPasY: function(nb){
		
		nb = Object.isUndefined(nb) ? 1 : Math.abs(nb);	
		
		switch(this.typeOf){
			case '%':
				this.setScrollTop(this.getScrollTop() - (this.viewport.height * this.pas * nb));
				break;
			case 'px':
				this.setScrollTop(this.getScrollTop() - this.pas * nb);
				break;	
		}
				
		return this;
	},
/**
 * ScrollBar#addPageY() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur de ScrollBar#page.
 **/	
	addPageY: function(bool){
		this.setScrollTop(this.getScrollTop() + this.viewport.height);
	},
/**
 * ScrollBar#subPageY() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur negative de ScrollBar#page.
 **/
	subPageY: function(){
		this.setScrollTop(this.getScrollTop() - this.viewport.height);
	},
/**
 * ScrollBar#addPasX() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur de [[ScrollBar#pas]].
 **/	
	addPasX: function(){		
		
		switch(this.typeOf){
			case '%':
				this.setScrollLeft(this.getScrollLeft() + (this.viewport.width * this.pas));
				break;
			case 'px':
				this.setScrollLeft(this.getScrollLeft() + this.pas);
				break;	
		}
		return this;
	},
/**
 * ScrollBar#subPasX() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur négative de [[ScrollBar#pas]] .
 **/		
	subPasX: function(){		
		switch(this.typeOf){
			case '%':
				this.setScrollLeft(this.getScrollLeft() - (this.viewport.width * this.pas));
				break;
			case 'px':
				this.setScrollLeft(this.getScrollLeft() - this.pas);
				break;	
		}
		
		return this;
	},
/**
 * ScrollBar#addPageX() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur de ScrollBar#page.
 **/	
	addPageX: function(){
		this.setScrollLeft(this.getScrollLeft() + this.viewport.width);
	},
/**
 * ScrollBar#subPageX() -> ScrollBar
 *
 * Cette méthode deplace le contenu d'une valeur negative de ScrollBar#page.
 **/
	subPageX: function(){
		this.setScrollLeft(this.getScrollLeft() - this.viewport.width);	
	},
/**
 * ScrollBar#setNode(node [, wrapper]) -> ScrollBar
 * - node (Element): Element cible.
 * - wrapper (Element): Element wrapper.
 *
 * Cette méthode assigne le node sur lequel il faut ajouter une scrollbar.
 **/	
	setNode: function(node, wrapper){
		
		if(!Object.isElement(node)) return this;
		
		if(this.node){
			this.node.removeClassName('scrollbars');
			this.node.removeClassName('vertical');	
			this.node.removeClassName('all');
			this.node.removeClassName('horizontal');
			
			if(this.wrapper && !this.createWrapper){
				this.node.appendChilds(this.wrapper.childElements());	
			}
		}
		
		this.node = node;
				
		if(!this.layoutMode){
			this.node.addClassName('iscroll');
		}else{
			this.node.addClassName('scrollbars ' + this.type);	
		}
		
		if(Object.isElement(wrapper)){
			this.wrapper = wrapper;
			this.createWrapper = false;
		}else{
			this.createWrapper = 		true;
			this.wrapper = 				new Node('div');
			this.wrapper.innerHTML = 	this.node.innerHTML;
			this.node.innerHTML = 		'';		
			this.node.appendChild(this.wrapper);
		}
		
		this.wrapper.addClassName('wrapper');
		
		this.node.observe('mouseup', this.onmouseup_bind);
		
		if(this.layoutMode){
			this.node.appendChild(this.Cache);
			this.node.appendChild(this.Horizontal);
			this.node.appendChild(this.Vertical);
			
			if(document.navigator.touchevent){
				this.node.on('touchstart', this.onTouchStart.bind(this));
			}
		}else{
			this.wrapper.css('min-height', this.node.offsetHeight + 2);
		}
				
		this.node.refresh = 	this.refresh.bind(this);
		this.node.scrollTo = 	this.scrollTo.bind(this);
		this.node.get =			function(){return this}.bind(this);
				
		return this;
	},
/**
 * ScrollBar#setType(type) -> ScrollBar
 **/	
	setType: function(type){
		
		if(Object.isElement(this.node) && this.type){
			this.node.removeClassName(this.type);
		}
				
		if(this.type){
			this.node.addClassName(this.type);
		}
		
		//if(this.type != 'none'){		
			this.refresh();
		//}
		return this;
	},
/**
 * ScrollBar#refresh() -> ScrollBar
 * 
 * Cette méthode met à jour les paramètres des barres de défilement.
 **/
 	refresh:function(){
		
		if(!this.layoutMode){
			this.wrapper.css('min-height', this.node.offsetHeight + 2);
		}
		//on récupère les dimensions des différents éléments de la barre de scroll
		this.buttonHeight = this.Vertical.getButtonHeight();
		this.buttonWidth =	this.Horizontal.getButtonWidth();
		
		var viewport = 		this.node.getDimensions();
		
		if(this.virtual){
			var dimension = {height:this.height, width:this.width};
		}else{
			var dimension =	this.wrapper.getDimensions();
		}
		
		this.viewport = 	viewport;
		this.dimension = 	dimension;	
		this.dirY = 		0;	
		this.wrapperH =		this.viewport.height;
		this.wrapperW =		this.viewport.width;
		this.scrollerH =	this.dimension.height;
		this.scrollerW =	this.dimension.width;
		this.maxScrollY = 	this.wrapperH - this.scrollerH;
		this.maxScrollX = 	this.wrapperW - this.scrollerW;
		this.scrollable =	false;
		//(info_top_contenu/calcul_contenu_top_max())*(calcul_bouton_top_max())
		this.Vertical.setRatio(this.viewport.height / this.dimension.height);
		this.Horizontal.setRatio(this.viewport.width / this.dimension.width);
		
		this.node.removeClassName('vertical');
		this.node.removeClassName('horizontal');
		this.node.removeClassName('all');
		
		if(this.Vertical.getRatio() < 1 && (this.type == 'vertical' || this.type == 'all')){
			this.node.addClassName('vertical');			
			this.scrollable =	true;
			this.Vertical.refresh();
		}
		
		if(this.Horizontal.getRatio() < 1 && (this.type == 'horizontal' || this.type == 'all')){
			this.node.addClassName('horizontal');			
			this.scrollable =	true;
			this.Horizontal.refresh();
		}
		
		if(this.Vertical.getRatio() < 1 && this.Horizontal.getRatio() < 1 && this.type == 'all'){
			this.node.addClassName('all');
			this.Vertical.refresh();
			this.Horizontal.refresh();
		}
				
		if(!this.scrollable){
			this.scrollToStart();	
		}
		
		this.Observer.fire('update');
		this.Observer.fire('refresh');
		
		return this;
	},
/**
 * ScrollBar#update() -> ScrollBar
 * 
 * Cette méthode met à jour les paramètres des barres de défilement.
 **/	
	update:function(){
		return this.refresh();
	},
/**
 * ScrollBar#observe(eventName, callback) -> ScrollBar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 **/
 	observe: function(eventName, callback){
		switch(eventName){
			case 'update':
			case 'scroll':
			case 'scrollstart':
			case 'scrollend':
				this.Observer.observe(eventName, callback);
				break;
		};
		return this;
	},
/**
 * ScrollBar#onDragCursorV(event) -> void
 **/
	onDragCursorV: function(evt){
		
		this.EventType = 	'drag';
		this.moved =		true;
						
		this.setScrollTop(this.Vertical.getCursorTop() * (this.dimension.height - this.viewport.height));
		
		this.Observer.fire('scroll', evt);
	},
/**
 * ScrollBar#onDragCursorH(event) -> void
 **/
	onDragCursorH: function(evt){
		
		this.EventType = 'drag';
		this.moved =	true;
						
		this.setScrollLeft(this.Horizontal.getCursorLeft() * (this.dimension.width - this.viewport.width));
		
		this.Observer.fire('scroll', evt);
	},
/**
 * ScrollBar#onMouseDownBtnTop(event) -> void
 **/	
	onMouseDownBtnTop: function(evt){
		Event.stop(evt);	
		this.EventType = 	'mousedown';
			
		this.Observer.fire('scrollstart', evt);
			
		this.clearTimer();				
		this.subPasY(true);
		this.Observer.fire('scroll', evt);
		
		this.IS_MOUSEDOWN = true;
		var bool = 			0;
		
		this.startTimer(function(pe){
			
			if(bool < 4){//on saute les trois premiers top
				bool++;
				return
			}
			
			if(this.IS_MOUSEDOWN){
				this.EventType = 'mousedown-long';
				
				this.subPasY();
				this.Observer.fire('scroll', evt);
				
			}else{
				this.clearTimer();
			}
		}.bind(this));
		
	},
/**
 * ScrollBar#onMouseDownBtnBottom(event) -> void
 **/	
	onMouseDownBtnBottom: function(evt){
		
		Event.stop(evt);
		this.EventType = 	'mousedown';
		
		this.Observer.fire('scrollstart', evt);
		
		this.clearTimer();
		this.addPasY(true);
		this.Observer.fire('scroll', evt);
		
		this.IS_MOUSEDOWN = true;
		var bool = 			0;
		
		this.startTimer(function(pe){
			
			if(bool < 4){//on saute les trois premiers top
				bool++;
				return
			}
						
			if(this.IS_MOUSEDOWN){
				this.EventType = 'mousedown-long';
								
				this.addPasY();
				this.Observer.fire('scroll', evt);
			}else{
				this.clearTimer();
			}
			
		}.bind(this));
	},
/**
 * ScrollBar#onMouseDownBtnLeft(event) -> void
 **/	
	onMouseDownBtnLeft: function(evt){
		
		Event.stop(evt);
		this.EventType = 	'mousedown';
		
		this.Observer.fire('scrollstart', evt);		
				
		this.clearTimer();				
		this.subPasX(true);
		this.Observer.fire('scroll', evt);
		
		this.IS_MOUSEDOWN = true;
		var bool =			0;
		
		this.startTimer(function(pe){
			if(bool < 4){//on saute les trois premiers top
				bool++;
				return
			}
			
			if(this.IS_MOUSEDOWN){
				this.EventType = 'mousedown-long';
							
				this.subPasX();
				this.Observer.fire('scroll', evt);
			}else{
				this.clearTimer();
			}
			
		}.bind(this));
		
	},
/**
 * ScrollBar#onMouseDownBtnRight(event) -> void
 **/	
	onMouseDownBtnRight: function(evt){
		
		Event.stop(evt);
		this.EventType = 	'mousedown';
		
		this.Observer.fire('scrollstart', evt);
			
		this.clearTimer();
		this.addPasX(true);
		this.Observer.fire('scroll', evt);
		
		this.IS_MOUSEDOWN = true;
		var bool =			0;
		
		this.startTimer(function(pe){
			
			if(bool < 4){//on saute les trois premiers top
				bool++;
				return
			}
			
			if(this.IS_MOUSEDOWN){
				this.EventType = 'mousedown-long';
								
				this.addPasX();
				this.Observer.fire('scroll', evt);
			}else{
				this.clearTimer();
			}
			
		}.bind(this));
		
	},
/**
 * ScrollBar#onMouseDownScrollV(event) -> void
 **/	
	onMouseDownScrollV: function(evt){
		
		Event.stop(evt);
		this.EventType = 	'mousedown-page';
		
		this.Observer.fire('scrollstart', evt);
					
		this.clearTimer();
					
		var y = 	this.Vertical.Cursor.cumulativeOffset().top;
		var y2 = 	y + this.Vertical.Cursor.getHeight();
		
		
		if(y2 < Event.pointerY(evt)){
			this.addPageY();
		}else{
			this.subPageY();
		}
		
		this.Observer.fire('scroll', evt);
		
		this.IS_MOUSEDOWN = true;
		var bool =			0;
		
		this.startTimer(function(pe){
							
			if(bool < 4){//on saute les trois premiers top
				bool++;
				return
			}
							
			if(this.IS_MOUSEDOWN){
				var y = 		this.Vertical.getCursorPixelTop();
				var y2 = 		y + this.Vertical.Cursor.getHeight();
				
				var yPointer = 	Event.pointerY(evt) - this.Vertical.body.cumulativeOffset().top;
								
				if(y2 < yPointer){
					this.addPageY();
				}
				
				if(y > yPointer){
					this.subPageY();
				}
								
			}else{
				this.clearTimer();	
			}
			
			this.Observer.fire('scroll', evt);
			
		}.bind(this));
			
	},
/**
 * ScrollBar#onMouseDownScrollH(event) -> void
 **/	
	onMouseDownScrollH: function(evt){
		
		Event.stop(evt);
		this.EventType = 	'mousedown-page';
		
		this.Observer.fire('scrollstart', evt);
		
		this.clearTimer();
				
		var x = 	this.Horizontal.Cursor.positionedOffset().left;
		var x2 = 	x + this.Horizontal.Cursor.getWidth();
		
		if(x2 < Event.pointerX(evt)){
			this.addPageX();
		}else{
			this.subPageX();
		}
		
		this.Observer.fire('scroll', evt);
		
		this.IS_MOUSEDOWN = true;
		var bool =			0;
		
		this.startTimer(function(pe){
			
			if(bool < 4){//on saute les trois premiers top
				bool++;
				return
			}
			
			if(this.IS_MOUSEDOWN){
				
				var x = 		this.Horizontal.getCursorPixelLeft();
				var x2 = 		x + this.Horizontal.Cursor.getWidth();
				
				var xPointer = 	Event.pointerX(evt) - this.Horizontal.body.cumulativeOffset().left;
								
				if(x2 < xPointer){
					this.addPageX();
				}
				
				if(x > xPointer){
					this.subPageX();
				}
				
			}else{
				this.clearTimer();	
			}
			
			this.Observer.fire('scroll', evt);
			
		}.bind(this));
	},
/**
 * ScrollBar#onMouseDownBtnTop(event) -> void
 **/	
	onMouseOver: function(evt){
		if(this.IS_MOUSEDOWN){
			this.startTimer();
		}
	},
/**
 * ScrollBar#onMouseDownBtnTop(event) -> void
 **/	
	onMouseOut: function(evt){
		if(this.IS_MOUSEDOWN){
			this.stopTimer();
			this.Observer.fire('scrollend', evt);
		}
	},
/**
 * ScrollBar#onMouseUp(event) -> void
 **/	
	onMouseUp: function(evt){
		
		this.clearTimer();
		
		if(this.IS_MOUSEDOWN){
			this.Observer.fire('scrollend', evt);
		}
		
		this.EventType = 	'';
		this.IS_MOUSEDOWN = false;
	},
	
	startTimer:function(callback, duration){
				
		if(this.timer == null){
			this.timer = new Timer(function(pe){
				if(Object.isFunction(this.callbackTimer)){
					this.callbackTimer.call(this, pe);
				}
			}.bind(this), duration ? duration : this.duration);
		}
		
		if(Object.isFunction(callback)){
			this.callbackTimer = callback;
		}
		
		this.timer.start();
		
		return this;
	},
	
	stopTimer:function(){
		
		if(this.timer && Object.isFunction(this.timer.stop)){
			this.timer.stop();
		}
			
		return this;
	},
	
	clearTimer: function(){
		this.stopTimer();
		
		this.callbackTimer = null;
		
		return this;
	},
/**
 * ScrollBar#onWheel(event) -> void
 **/	
	onWheel: function(e){
		
		//récupération du nombre de wheel
		if(!this.IS_WHEEL){
			
			this.refresh();
			this.Observer.fire('scrollstart', e);
		}
		
		this.EventType = 'wheel';
		
		var nb = Event.wheel(e);
				
		if(this.type == 'all' || this.type == 'vertical'){//onWheel
			
			if(!this.IS_WHEEL){
				this.current = this.Vertical.Cursor.positionedOffset().top;
				this.IS_WHEEL = true;
			}
			
			if(nb < 0){
				this.addPasY(Math.ceil(Math.abs(nb)));
			}
			
			if(nb > 0){
				this.subPasY(Math.ceil(Math.abs(nb)));
			}
										
		}else{
			
			if(!this.IS_WHEEL){
				this.current = this.Horizontal.Cursor.positionedOffset().left;
				this.IS_WHEEL = true;
			}
			
			if(nb < 0){
				this.addPasX(Math.ceil(Math.abs(nb)));
			}
			
			if(nb > 0){
				this.subPasX(Math.ceil(Math.abs(nb)));
			}
		}
		
		
		this.Observer.fire('scroll', e);
		
		//fin du scroll avec la molette de la souris
		/**/
		function onTimeScroll(){
			
			if(this.LAST_WHEEL == this.CURRENT_WHEEL){
				
				this.clearTimer();
				
				this.IS_WHEEL = 		false;
				this.LAST_WHEEL = 		0;
				this.CURRENT_WHEEL = 	1;
				
				this.Observer.fire('scrollend', e);
				
				return;
			}
			
			this.CURRENT_WHEEL = this.LAST_WHEEL;
		}

		if(this.LAST_WHEEL == 0 && nb != 0){
			this.startTimer(onTimeScroll.bind(this), 0.4);			
		}
		
		this.LAST_WHEEL += Math.abs(Event.wheel(e));
		
	},
/**
 * ScrollBar#onTouchStart(event) -> void
 **/
	onTouchStart:function(event){
		Event.stop(event);
		
		var that = 	this,
			point = document.navigator.touchevent ? event.touches[0] : event,
			matrix, x, y,
			c1, c2;
		
		this.moved = 		false;
		this.animating = 	false;
		this.distX = 		0;
		this.distY = 		0;
		this.absDistX = 	0;
		this.absDistY = 	0;
		this.dirX = 		0;
		this.dirY = 		0;
		this.EventType = 	'touchstart';
		
		if (this.useTransition) {
			this._transitionTime(0);
		}
		
		if (this.momentum) {
			/*if (this.useTransform) {
				//// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(this.wrapper, null)[document.navigator.vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
				x = Math.abs(matrix[4] * 1);
				y = Math.abs(matrix[5] * 1);
			} else {
				x = Math.abs(getComputedStyle(this.wrapper, null).left.replace(/[^0-9-]/g, '') * 1);
				y = Math.abs(getComputedStyle(this.wrapper, null).top.replace(/[^0-9-]/g, '') * 1);
			}
			
			if (x != -this.scrollX || y != -this.scrollY) {
				//if (that.options.useTransition) that._unbind('webkitTransitionEnd');
				//else 
				if(this.aniTime) clearTimeout(this.aniTime);
				this.steps = [];
				//this.scrollTo(x, y);
			}*/
		}
			
		this.absStartX = this.scrollX;	// Needed by snap threshold
		this.absStartY = this.scrollY;

		this.startX = this.scrollX;
		this.startY = this.scrollY;
		this.pointX = point.pageX;
		this.pointY = point.pageY;

		this.startTime = event.timeStamp || Date.now();
		
		var evt2 = new StopEvent(this);
		this.Observer.fire('scrollstart', evt2);
		
		if(evt2.stopped){
			evt.stop();
			return;
		}
		
		if(Object.isFunction(this.movebind)){
			this.node.stopObserving('touchmove', this.movebind);
			this.node.stopObserving('touchend', this.endbind);
		}
		
		this.node.on('touchmove', this.movebind = this.onTouchMove.bind(this));
		this.node.on('touchend', this.endbind = this.onTouchEnd.bind(this));
		
	},
/**
 * ScrollBar#onTouchMove(event) -> void
 **/
	onTouchMove:function(event){
				
		Event.stop(event);
		
		var that = 		this,
			point = 	document.navigator.touchevent ? event.touches[0] : event,
			deltaY =	this.pointY - point.pageY,
			deltaX =	this.pointX - point.pageX,
			newX = 		this.scrollX + deltaX,
			newY = 		this.scrollY + deltaY,
			c1, c2, scale,
			timestamp = event.timeStamp || Date.now();
		
		this.pointX = 		point.pageX;
		this.pointY = 		point.pageY;
		this.EventType = 	'touchmove';
		
		// Slow down if outside of the boundaries
		if (!(newX > 0 || newX < this.maxScrollX)) {
			newX = this.bounce ? this.scrollX + (deltaX / 2) : newX >= 0 || this.maxScrollX >= 0 ? 0 : this.maxScrollX;
		}
		if (!(newY > this.minScrollY || newY < this.maxScrollY)) { 
			newY = this.bounce ? this.scrollY + (deltaY / 2) : newY >= this.minScrollY || this.maxScrollY >= 0 ? this.minScrollY : this.maxScrollY;
		}

		if (this.absDistX < 6 && this.absDistY < 6) {
			this.distX += deltaX;
			this.distY += deltaY;
			this.absDistX = Math.abs(this.distX);
			this.absDistY = Math.abs(this.distY);

			return;
		}

		// Lock direction
		//if (this.lockDirection) {
			/*if (this.absDistX > this.absDistY + 5) {
				newY = this.scrollY;
				deltaY = 0;
			} else if (this.absDistY > this.absDistX + 5) {
				newX = this.scrollX;
				deltaX = 0;
			}*/
		//}

		this.moved = true;
		
		this.scrollTo(newX, newY);
		
		this.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - this.startTime > 300) {
			this.startTime = timestamp;
			this.startX = this.scrollX;
			this.startY = this.scrollY;
		}
				
		var evt2 = new StopEvent(this);
		this.Observer.fire('scroll', evt2);
		if(evt2.stopped) return;
		
	},
/**
 * ScrollBar#onTouchEnd(event) -> void
 **/
	onTouchEnd:function(event){
		
		if (document.navigator.touchevent && event.touches.length != 0){
			this.node.stopObserving('touchmove', this.movebind);
			this.node.stopObserving('touchend', this.endbind);
			return;
		}
		
		if(this.moved){
			Event.stop(event);	
		}
		
		var that = this,
			point = document.navigator.touchevent ? event.changedTouches[0] : event,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (event.timeStamp || Date.now()) - this.startTime,
			newPosX = this.scrollX,
			newPosY = this.scrollY,
			distY,
			newDuration,
			snap,
			scale;

		this.node.stopObserving('touchmove', this.movebind);
		this.node.stopObserving('touchend', this.endbind);
				
		if (!this.moved) {
			if (document.navigator.touchevent) {
				// Find the last touched element
				target = point.target;
				while (target.nodeType != 1) target = target.parentNode;

				if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
					ev = document.createEvent('MouseEvents');
					ev.initMouseEvent('click', true, true, event.view, 1,
						point.screenX, point.screenY, point.clientX, point.clientY,
						event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
						0, null);
					ev._fake = true;
					target.dispatchEvent(ev);
				}
			}

			this._resetPos(200);
			
			var evt2 = new StopEvent(this);
			this.Observer.fire('scrollend', evt2);
			this.moved = false;
			return;
		}
		
		if (duration < 300 && this.momentum) {
			
			momentumX = newPosX ? this._momentum(newPosX - this.startX, duration, this.scrollX, this.scrollerW - this.wrapperW - this.scrollY, this.bounce ? this.wrapperW : 0) : momentumX;
			momentumY = newPosY ? this._momentum(newPosY - this.startY, duration, this.scrollY, (this.maxScrollY < 0 ? this.scrollerH - this.wrapperH - this.scrollY : 0), this.bounce ? this.wrapperH : 0) : momentumY;
			
			newPosX = this.scrollX + momentumX.dist;
			newPosY = this.scrollY + momentumY.dist;
			
 			//if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			//if ((that.y > 0 && newPosY > 0) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) {momentumY = { dist:0, time:0 };}
		}

		if (momentumX.dist || momentumY.dist) {
			
			newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 10);
			that.scrollTo(Math.round(newPosX), Math.round(newPosY), newDuration);

			var evt2 = new StopEvent(this);
			this.Observer.fire('scrollend', evt2);
			this.moved = false;
			return;
		}
		
		this.moved = false;
		//this._resetPos(200);
	},
/**
 * ScrollBar#onTouchCancel(event) -> void
 **/
	onTouchCancel:function(event){
		
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = (!(this.scrollX >= 0)) ? 0 : this.scrollX < this.maxScrollX ? this.maxScrollX : this.scrollX,
			resetY = (!(this.scrollY >= 0 || this.maxScrollY > 0)) ? 0: this.scrollY < this.maxScrollY ? this.maxScrollY : this.scrollY;
			
		//this.scrollTo(resetX, resetY, time || 0);
	},
	
	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 	0.0006,
			speed = 		Math.abs(dist) / time,
			newDist = 		(speed * speed) / (2 * deceleration),
			newTime = 		0, 
			outsideDist = 	0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = 	size / (6 / (newDist / speed * deceleration));
			maxDistUpper = 	maxDistUpper + outsideDist;
			speed = 		speed * maxDistUpper / newDist;
			newDist = 	maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = 	size / (6 / (newDist / speed * deceleration));
			maxDistLower = 	maxDistLower + outsideDist;
			speed = 		speed * maxDistLower / newDist;
			newDist = 		maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;
		
		return { dist: newDist, time: Math.round(newTime) };
	},
	
	_startAni: function () {
		var that = this,
			startY = this.scrollY,
			startX = this.scrollX,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (this.animating) return;
		
		if (!this.steps.length) {
			this._resetPos(400);
			return;
		}
		
		step = this.steps.shift();
		
		if(step.x == startX && step.y == startY) step.time = 0;

		this.animating = 	true;
		this.moved = 		true;
		
		if (this.useTransition) {
			this._transitionTime(step.time);
			this.scrollTo(step.x, step.y);
			this.animating = false;
			//if (step.time) this._bind('webkitTransitionEnd');
			//else this._resetPos(0);
			return;
		}

		animate = function () {
			
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				this.scrollTo(step.x, step.y);
				this.animating = false;
				this._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = Math.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			
			this.scrollTo(newX, newY);
			
			if (this.animating) this.aniTime = setTimeout(animate, 1);
				
		}.bind(this);
		
		animate();
	},
	
	_transitionTime: function (time) {
		this.wrapper.style[document.navigator.vendor + 'TransitionDuration'] = time + 'ms';
	},
/**
 * ScrollBar#limitTop() -> Number
 *
 * Limite le deplacement de la barre de défilement.
 **/	
	limitTop: function(top){
		top = Math.round(top);
		
		var height = this.Vertical.Cursor.css('height') + this.Vertical.Cursor.css('border-top-width') + this.Vertical.Cursor.css('border-bottom-width');
		
		top = top < this.Vertical.Cursor.dragOptions.constraint.y1 ? this.Vertical.Cursor.dragOptions.constraint.y1 : top;
		top = top > (this.Vertical.Cursor.dragOptions.constraint.y2 - height) ? (this.Vertical.Cursor.dragOptions.constraint.y2 - height) : top;
		return top;
	},
/**
 * ScrollBar#limitMarginTop() -> Number
 *
 * Limite le deplacement de la page.
 **/	
	limitMarginTop: function(top){
		top = Math.round(top);
		top = top > this.dimension.height - this.viewport.height ? this.dimension.height - this.viewport.height : top;
		top = top < 0 ? 0 : top; 
		return top;
	},
/**
 * ScrollBar#limitLeft() -> Number
 *
 * Limite le deplacement de la page.
 **/	
	limitMarginLeft: function(left){
		left = Math.round(left);
		left = left > this.dimension.width - this.viewport.width ? this.dimension.width - this.viewport.width : left;
		left =  left < 0 ? 0 : left;
		return left;
	},
/**
 * ScrollBar#limitLeft() -> Number
 *
 * Limite le deplacement de la barre de défilement.
 **/	
	limitLeft: function(left){
		left = Math.round(left);
		
		var width = this.Horizontal.cursorWidth + this.Vertical.Cursor.css('border-left-width') + this.Horizontal.Cursor.css('border-right-width');
		
		left = left < this.Horizontal.Cursor.dragOptions.constraint.x1 ? this.Horizontal.Cursor.dragOptions.constraint.x1 : left;
		left = left > (this.Horizontal.Cursor.dragOptions.constraint.x2 - width) ? (this.Horizontal.Cursor.dragOptions.constraint.x2 - width) : left;
		return left;
	},
/**
 * ScrollBar#getScrollTop() -> Number
 *
 * Retourne la position courante de la barre de défilement.
 **/
	getScrollTop: function(){
		return this.scrollY;
	},
/**
 * ScrollBar#getScrollLeft() -> Number
 *
 * Retourne la position courante de la barre de défilement.
 **/	
	getScrollLeft: function(){
		return this.scrollX;	
	},
/**
 * ScrollBar#scrollTo(x, y) -> ScrollBar
 * ScrollBar#scrollTo(x, y, time) -> ScrollBar
 * ScrollBar#scrollTo(x, y, time, relative) -> ScrollBar
 * ScrollBar#scrollTo(node) -> ScrollBar
 * - x (Number): Coordonnées X.
 * - y (Number): Coordonnées Y.
 * - node (Element): Element cible.
 * - time (Number): Durée de l'animation.
 *
 * Déplace la page aux coordonnées `x, y` ou sur l'élément `node`.
 **/	
	scrollTo: function(x, y, time, relative){
		if(Object.isUndefined(x)) return this;
		
		if(Object.isString(x)){
			x = $(x);
		}
		
		if(Object.isElement(x)){
			var coord = 	x.positionedOffset();
			x = 			coord.left;
			y = 			coord.top;
		}
		
		if(Object.isUndefined(y)){
			y = this.scrollY;
		}
		
		if(this.layoutMode){
			if(Object.isUndefined(time)){
				
				this.scrollY = 	this.limitMarginTop(y);
				this.scrollX = 	this.limitMarginLeft(x);
				
				this.Vertical.setCursorTop(this.scrollY / (this.dimension.height - this.viewport.height));
				this.Horizontal.setCursorLeft(this.scrollX / (this.dimension.width - this.viewport.width));
								
				if(!this.virtual){				
					if(this.useTransform) {
						this.wrapper.style[document.navigator.vendor + 'Transform'] = this.trnOpen + '-' + this.scrollX + 'px,' + '-' +this.scrollY + 'px' + this.trnClose;
					}
					else{
						this.wrapper.css('top', '-' + this.scrollY + 'px');
						this.wrapper.css('left', '-' + this.scrollX + 'px');	
					}
				}
								
			}else{
				
				var step = x,
				i, l;
				
				this.stop();
				
				if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
			
				for (i=0, l=step.length; i<l; i++) {
					if (step[i].relative) { step[i].x = this.scrollY - step[i].x; step[i].y = this.scrollY - step[i].y; }
					this.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
				}
		
				this._startAni();	
			}
		}else{
			this.scrollY = this.node.scrollTop = 	y || this.node.scrollTop;
			this.scrollX = this.node.scrollLeft =  x || this.node.scrollLeft;
		}
		
		return this;
	},
/**
 * ScrollBar#ScrollTop([y]) -> Number
 * - y (Number): Coordonnées Y.
 *
 * Déplace la page aux coordonnées y.
 **/
	ScrollTop: function(top, time, relative){
		if(top) this.scrollTo(this.scrollX, top, time, relative);
		return this.getScrollTop();	
	},
/**
 * ScrollBar#ScrollLeft([x]) -> Number
 * - x (Number): Coordonnées X.
 *
 * Déplace la page aux coordonnées x.
 **/	
	ScrollLeft: function(left, time, relative){
		if(left) this.scrollTo(left, this.scrollY, time, relative);
		return this.getScrollLeft();	
	},
/**
 * ScrollBar#setScrollTop(y) -> ScrollBar
 * - y (Number): Coordonnées Y.
 *
 * Déplace la page aux coordonnées y.
 **/	
	setScrollTop: function(top, time, relative){
		this.scrollTo(this.scrollX, top, time, relative);
		return this;
	},
/**
 * ScrollBar#setScrollLeft(x) -> ScrollBar
 * ScrollBar#setScrollLeft(x, time) -> ScrollBar
 * ScrollBar#setScrollLeft(x, time, relative) -> ScrollBar
 * - x (Number): Coordonnées X.
 *
 * Déplace la page aux coordonnées x.
 **/	
	setScrollLeft: function(left, time, relative){
		this.scrollTo(left, this.scrollY, time, relative);
		return this;
	},
/**
 * ScrollBar#scrollToStart() -> ScrollBar
 *
 * Cette méthode place la [[ScrollBar]] en debut de page.
 **/	
	scrollToStart: function(){
		return this.setScrollTop(0);
	},
/**
 * ScrollBar#isScrollStart() -> ScrollBar
 *
 * Cette méthode indique si le curseur est positionné au debut de contenu.
 **/
 	isScrollStart:function(offset){
		return this.Vertical.isStart(offset);
	},
/**
 * ScrollBar#isScrollEnd() -> ScrollBar
 *
 * Cette méthode indique si le curseur est positionné au fin de course.
 **/
 	isScrollEnd:function(offset){
		return this.Vertical.isEnd(offset);
	},
/**
 * ScrollBar#scrollToEnd() -> ScrollBar
 *
 * Cette méthode place la [[ScrollBar]] en fin de page.
 **/	
	scrollToEnd: function(){
		return this.setScrollTop(this.wrapper.getHeight());
	},
/**
 * ScrollBar#stop() -> ScrollBar
 *
 * Cette méthode stop l'animation.
 **/	
	stop: function () {
		try{
			if(this.aniTime) clearTimeout(this.aniTime);
		}catch(er){}
		this.steps = 		[];
		this.moved = 		false;
		this.animating = 	false;
	},
/**
 * ScrollBar#isMove() -> Boolean
 *
 * Indique si la scrollbar est en cours de déplacement lors d'un TouchEvent.
 **/	
	isMove:function(){
		return this.moved;	
	},
/**
 * ScrollBar#isScrollable() -> Boolean
 *
 * Indique si la [[ScrollBar]] est affichée.
 **/	
	isScrollable:function(){
		return this.scrollable;	
	}
};
/**
 * ScrollBar.Transform(node) -> HeadPiece
 * ScrollBar.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance ScrollBar.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[ScrollBar]].
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment faire apparaitre un Flag au survol d'un élément :</p>
 * 
 *     <div class="box-scroll-bar type-vertical" style="width:300px; height:300px">
 *         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 *         It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
 *      </div>
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div class="box-scroll-bar type-vertical" style="width:300px; height:300px">
 * Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 * It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
 * </div> 
 *
 **/
ScrollBar.Transform = function(e){
	if(Object.isElement(e)){	
		
		var wrapper = e.select('wrapper');
		var type = 'vertical';
			
		if(wrapper.length == 1){
			wrapper = wrapper[0];
		}else{
			wrapper = null;
		}
		
		if(e.data('type') != null){
			type = e.data('type');
		}else{
			if(e.className.match(/type-/)){
				type = e.className.substring(e.className.lastIndexOf('type-')).split(' ')[0].replace('type-','') ;
			}
		}
			
		return new ScrollBar({node:e, wrapper:wrapper, type:type});
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(ScrollBar.Transform(e));
	});
	
	return options;
};