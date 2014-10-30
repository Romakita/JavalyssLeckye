Import('extends.geom.point');
Import('extends.geom.rectangle');

Element.addMethods({
/**
 * Element.constraint(x[, y[, xd[, yd]]]) -> Element
 * - x (Number): Coordonnée de la 1ère droite horizontale selon l'axe des X (0 par défaut, pas de contrainte).
 * - y (Number): Coordonnée de la 1ère droite verticale selon l'axe des Y (0 par défaut, pas de contrainte).
 * - xd (Number): Coordonnée de la 2e droite horizontale selon l'axe des X (0 par défaut, pas de contrainte).
 * - yd (Number): Coordonnée de la 2e droite verticale selon l'axe des Y (0 par défaut, pas de contrainte).
 *
 * Cette méthode défini un rectangle correspondant à zone de drag, c'est-à-dire de déplacement possible lors du mouvement du [[Node]].
 * Par défaut la zone n'a pas de limite et l'element peut être déplacé sur toute la surface de la page.
 * 
 * Vous pouvez définir jusqu'à 4 droites, 2 par axe selon X et 2 axe selon Y afin de définir une zone de déplacement.
 * Chacun des axes sont défini par rapport au point le plus haut du document HTML (au coin en haut à gauche).
 * 
 * ##### Exemple
 * 
 * <iframe src="http://javalyss.fr/sources/dragdrop.html" style="height:500px; width:500px;border:1px solid #808080;"></iframe>
 *
 **/

/**
 * Element.addDroppable(@element, drop) -> Element
 * - drop (Element): Element de réception de l'instance element.
 *
 * Cette méthode ajoute un element `drop` comme zone de réception de l'instance `element`.
 *
 * ##### Evénements
 *
 * Après utilisation de la méthode [[Element.addDrop]], les événements suivants seront disponibles :
 *
 * * `dragenter` : Est déclenché lorsque l'élément entre dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragleave` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragover` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `drop` : Est déclenché lorsque l'élément est déposé dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 *
 * ##### Exemple
 * 
 * <iframe src="http://javalyss.fr/sources/dragdrop.html" style="height:500px; width:500px;border:1px solid #808080;"></iframe>
 *
 **/

/**
 * Element.createDrag(@element) -> Element
 * Element.createDrag(@element, target) -> Element
 * Element.createDrag(@element, target, options) -> Element
 * Element.createDrag(@element, options) -> Element
 * - target (Element): Element à cliquer pour déclencher le drag'n'drop.
 * - options (Object): Objet de configuration.
 *
 * Cette méthode permet d'activer le Drag'n'Drop sur l'élément courant. 
 *
 * Par défaut le paramètre `target` de la méthode [[Element.createDrag]] n'est pas nécessaire et prend pour valeur l'`element` courant. Dans ce cas, ce sera le `mousedown` sur l'`element` qui  activera le déplacement du conteneur.
 * 
 * ##### Passage d'un Node en second paramètre
 * 
 * Si vous passez le second paramètre un [[Node]] ou [[Element]] (de préférence un [[Node]] enfant de l'élément en courant), ce dernier deviendra la zone cliquable du Drag'n'Drop.
 * Cette méthode est utile lorsque vous créez des éléments de type fenêtre (Boite de dialogue par exemple, où l'entete est la zone cliquable).
 *
 * ##### Le paramètre options
 *
 * Le paramètre `options` permet de configurer la méthode createDrag. L'objet prend différents attributs comme décrit ci-dessous :
 * 
 * * `options.absolute` : Si cette valeur est vrai l'élement sera déplacé de façon absolue. Dans le cas contraire, le deplacement se fera par rapport à sa position de départ.
 * * `options.constraint.x1` : Ajoute une constrainte sur l'axe des X1.
 * * `options.constraint.x2` : Ajoute une constrainte sur l'axe des X2. 
 * * `options.constraint.y1` : Ajoute une constrainte sur l'axe des Y1.
 * * `options.constraint.y2` : Ajoute une constrainte sur l'axe des Y2.
 * * `options.opacity` : Définit la valeur de l'opacité de l'élément lors du drag'n'drop. Par défaut, sa valeur est fixé à 0,7.
 * * `options.revert` : l'element reviendra à sa position initiale après le drag'n'drop (uniquement si `options.absolute` est vrai).
 * * `options.target` : Définit le élément a cliquer pour déplacer le conteneur `element`.
 * * `options.zIndex` : Définit la valeur de zIndex de l'élément lors du drag'n'drop. Par défaut, sa valeur est fixé à 10000.
 *
 * ##### Evénements
 *
 * Après utilisation de la méthode [[Element.createDrag]], les événements suivants seront disponibles :
 *
 * * `drag` : Est déclenché lorsque l'élément est déplacé par drag'n'drop.
 * * `dragend` : Est déclenché lorsque l'élément n'est plus déplacé par drag'n'drop.
 * * `dragenter` : Est déclenché lorsque l'élément entre dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragleave` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragover` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragstart` : Est déclenché lorsque l'élément commence à être déplacé.
 * * `drop` : Est déclenché lorsque l'élément est déposé dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * 
 * ##### Exemple
 * 
 * <iframe src="http://javalyss.fr/sources/dragdrop.html" style="height:500px; width:500px; border:1px solid #808080;"></iframe>
 *
 **/
	createDrag: function(node, target, obj){
		
		var options = {
			//backup:			{},
			absolute:		true,
			sort:			true,
			moved:			false,
			constraint:	{
				x1: 		0,
				x2: 		0,
				y1: 		0,
				y2:			0
			},
			
			drag:			null,
			dragstart:		null,
			dragend:		null,
			dragenter:		null,
			dragover:		null,
			dragleave:		null,
			drop:			null,
			onRevertComplete:null,
			
			target:			node,
			revert:			false,
			opacity:		0.7,
			zIndex:			10000
		};
		
		if(!Object.isUndefined(target)){
			if(Object.isElement(target)){//ancienne implémentation
				options.target = target;
				
				if(!Object.isUndefined(obj)){
					Object.extend(options, obj);
				}
			}else{
				Object.extend(options, target);
			}
		}
		
		
		if(document.navigator.client == 'IE' && document.navigator.version < 8){
			options.target = $(options.target);
		}
		//
		// Creation de l'interface
		//
		
		node.observeBackup = 		node.observe;
		node.stopObservingBackup = 	node.stopObserving;
		node.fireBackup = 			node.fire;
		
		Object.extend(node, Extends.DragInterface);
		
		node.droppable =			[];
			
		node.setDragOptions(options);
		options.target.observe('mousedown', node.onDragMouseDown_bind = node.onDragMouseDown.bind(node));
		//
		// RétroCompatibilité
		//
		node.dragOptions.onMouseDown = function(evt){node.onDragMouseDown(evt)};
		node.dragOptions.onMouseMove = function(evt){node.onDragMove(evt)};
		node.dragOptions.onMouseUp = function(evt){node.onDragEnd(evt)};
		
		return node;
	}
});
/** section: DOM
 * Extends.DragInterface
 *
 * Ensemble de méthode disponible après création d'un element Drag'n'Drop via la méthode [[Element.createDrag]].
 **/
Extends.DragInterface = {
	events: [
		'drag',
		'dragstart',
		'dragend',
		'dragenter',
		'dragover',
		'dragleave',
		'drop'
	],
/**
 * Extends.DragInterface#dragOptions -> Object
 **/
	dragOptions: null,
/**
 * Extends.DragInterface#droppable -> Object
 **/	
	droppable:	null,
	
	isDragStart:false,
	isDroppable:false,
	isMouseDown:false,
	
	dropTarget: null,
	
	onDragMouseDown_bind: 	null,
	onDragMove_bind:		null,
	onDragEnd_bind:			null,
/**
 * Extends.DragInterface#addDroppable(node) -> Element
 * - node (Element): Zone de drop.
 *
 * Cette méthode permet d'ajouter une zone de drop.
 **/	
	addDroppable: function(drop){
		var options = this.dragOptions;
		
		this.droppable.push(drop);
		drop.DROPID = this.droppable.length;
		
		drop.observeBackup = 		drop.observe; 
		drop.stopObservingBackup = 	drop.stopObserving; 
		
		Object.extend(drop, Extends.DropInterface);
		
		return this;
	},
/**
 * Extends.DragInterface#constraint(options) -> Element
 * - options (Object): Zone de drag.
 *
 * Cette méthode permet de définir une zone de drag'n'drop possible selon les coordonnées (x1, y2, x2, y2).
 *
 * * `options.x1` : Ajoute une constrainte sur l'axe des X1.
 * * `options.x2` : Ajoute une constrainte sur l'axe des X2. 
 * * `options.y1` : Ajoute une constrainte sur l'axe des Y1.
 * * `options.y2` : Ajoute une constrainte sur l'axe des Y2.
 *
 **/	
	constraint: function(options){
		Object.extend(this.dragOptions.constraint, options);
		return this;
	},
/**
 * Extends.DragInterface#observe(eventName, callback) -> Element
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction à appeller. 
 *
 * Cette méthode permet d'écouter un événement `eventName`.
 *
 * #### Evènements
 *
 * * `drag` : Est déclenché lorsque l'élément est déplacé par drag'n'drop.
 * * `dragend` : Est déclenché lorsque l'élément n'est plus déplacé par drag'n'drop.
 * * `dragenter` : Est déclenché lorsque l'élément entre dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragleave` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragover` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragstart` : Est déclenché lorsque l'élément commence à être déplacé.
 * * `drop` : Est déclenché lorsque l'élément est déposé dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 *
 **/	
	observe: function(eventName, callback){
		switch(eventName){
			case 'drag':
			case 'dragleave':
			case 'dragenter':
			case 'dragover':
			case 'drop':
			case 'dragstart':
			case 'dragend':
				Event.observe(this, 'element:'+eventName, callback);
				break;
			default:
				this.observeBackup(eventName, callback);
		}
		return this;
	},
/**
 * Extends.DragInterface#fire(eventName [, memo[, bubble = true]]) -> Element
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction à appeller. 
 *
 * Cette méthode permet de déclencher un evenement.
 *
 * #### Evènements
 *
 * * `drag` : Est déclenché lorsque l'élément est déplacé par drag'n'drop.
 * * `dragend` : Est déclenché lorsque l'élément n'est plus déplacé par drag'n'drop.
 * * `dragenter` : Est déclenché lorsque l'élément entre dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragleave` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragover` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 * * `dragstart` : Est déclenché lorsque l'élément commence à être déplacé.
 * * `drop` : Est déclenché lorsque l'élément est déposé dans une zone de type `drop` (voir [[Element.addDroppable]] pour ajouter un element drop).
 *
 **/	
	fire: function(eventName, memo, bubble){
		switch(eventName){
			case 'drag':
			case 'dragleave':
			case 'dragenter':
			case 'dragover':
			case 'drop':
			case 'dragstart':
			case 'dragend':
				Event.fire(this, 'element:'+eventName, memo, bubble);
				break;
			default:
				this.fireBackup(eventName, memo, bubble);
		}
		return this;
	},
/*
 * Extends.DragInterface#onDragMouseDown() -> void
 **/	
	onDragMouseDown:function(evt){
		if(Event.isRightClick(evt)) return;
		
		if(this.isDragStart){
			return;	
		}
		
		evt.stop();
		
		var options = this.dragOptions;
		
		this.isMouseDown = 		true;
		this.isDragStart =		false;
		
		options.backup = 			this.positionedOffset();
		options.backup.zIndex = 	this.css('z-index');
		options.deltaX = 			Event.pointerX(evt) - options.backup.left;
		options.deltaY = 			Event.pointerY(evt) - options.backup.top;
		options.pointer =			new Point(Event.pointerX(evt), Event.pointerY(evt));
		options.backup.opacity =	this.getOpacity() || this.css('opacity');
		
		this.css('z-index', options.zIndex);
		
		if(Object.isFunction(this.onDragEnd_bind)){
			document.stopObserving('mouseup', this.onDragEnd_bind);
		}
		
		if(Object.isFunction(this.onDragMove_bind)){
			document.stopObserving('mousemove', this.onDragMove_bind);	
		}
					
		document.observe('mouseup', this.onDragEnd_bind = this.onDragEnd.bind(this));
		document.observe('mousemove', this.onDragMove_bind = this.onDragMove.bind(this));
		
	},
/*
 * Extends.DragInterface#onDragStart() -> void
 **/	
	onDragStart:function(evt){
		
		if(this.isMouseDown && !this.isDragStart){
			this.isDragStart = true;
			this.fire('dragstart', evt);
			this.setOpacity(this.dragOptions.opacity);
		}
		
		return;
	},
/*
 * Extends.DragInterface#onDragMove() -> void
 **/		
	onDragMove:function(evt){
		
		var options = this.dragOptions;
		this.onDragStart(evt);
		
		this.moved = true;
		evt.target = this;
				
		this.findDroppable(evt);
				
		var Coord = this.getCoord(evt);		
						
		//Mise à jour des coordonnées			
		if(options.absolute){
			this.setStyle({top: Coord.y+"px", left: Coord.x + "px"});
		}else{
							
			this.css('top', Coord.y - options.backup.top).css('left', Coord.x - options.backup.left);
			
			if(options.sort){//gestion du drag avec tri des éléments
				this.sort(Coord, evt);
			}
		}

		this.fire('drag', evt);
		
	},
/*
 * Extends.DragInterface#onDragEnd() -> void
 **/	
	onDragEnd:function(evt){
		evt.stop();
		
		var options = 			this.dragOptions;
		
		this.isMouseDown = 		false;
		this.isDragStart =		false;
		
		if(Object.isFunction(this.onDragEnd_bind)){
			document.stopObserving('mouseup', this.onDragEnd_bind);
		}
		
		if(Object.isFunction(this.onDragMove_bind)){
			document.stopObserving('mousemove', this.onDragMove_bind);	
		}
		
		this.onDragEnd_bind = null;
		this.onDragMove_bind = null;
		
		if(typeof options == 'object'){
			if(options.backup){
				this.css('z-index', Object.isUndefined(options.backup.zIndex) ? 0 : options.backup.zIndex);
				this.setOpacity(options.backup.opacity || 1);
			}
		}
						
		if(this.moved){
			
			if(this.isDroppable){
				this.fire('drop');
				this.dropTarget.fire('element:drop', this);
			}
			
			if(typeof options == 'object'){
				if(options.revert && options.absolute){
					this.revert(options.onRevertComplete);
				}
				
				if(!options.absolute){
					this.css('top', 0).css('left', 0);	
				}
			}
			
			this.fire('dragend');
			
			if(typeof options == 'object'){	
				options.moved = false;
			}
			
		}
				
	},
/*
 * Extends.DragInterface#getCoord() -> Object
 **/
	getCoord:function(evt){
		var options = 	this.dragOptions;
		var Coord =		new Point(Event.pointerX(evt) - options.deltaX, Event.pointerY(evt) - options.deltaY);	
		
		if((options.constraint.x1 != options.constraint.x2) || (options.constraint.y1 != options.constraint.y2)){
			var width = this.css('width') 
						+ this.css('border-left-width') 
						+ this.css('border-right-width') 
						+ this.css('padding-right') 
						+ this.css('padding-left');
			
			var height = this.css('height') 
						+ this.css('border-top-width') 
						+ this.css('border-bottom-width') 
						+ this.css('padding-top') 
						+ this.css('padding-bottom');
			
			if((options.constraint.x1 != options.constraint.x2)){
				if(Coord.x + width >= options.constraint.x2){
					Coord.x = options.constraint.x2 - this.getWidth();
				}
				
				if(Coord.x  < options.constraint.x1) {
					Coord.x = options.constraint.x1;
				}
			}
			
			if((options.constraint.y1 != options.constraint.y2)){
				if(Coord.y + height >= options.constraint.y2){
					Coord.y = options.constraint.y2 - this.getHeight();
				}
				
				if(Coord.y < options.constraint.y1){
					Coord.y = options.constraint.y1;
				}	
			}
		}
		
		return Coord;
	},
/*
 * Extends.DragInterface#sort() -> void
 **/	
	sort:function(Coord, evt){
			
		var options = 	this.dragOptions;
		var parent =	this.parentNode;			
		var childs = 	parent.childElements();
		var bool =		false;
		var point = 	evt ? new Point(Event.pointerX(evt),  Event.pointerY(evt)) : Coord;
		
		for(var i = 0; i < childs.length && !bool; i++){
			var e = 	childs[i];
			
			if(this === e) continue;//meme élément
			
			var rect = 	new Rectangle(e, true);
			
			if(bool = rect.contains(point)){
				
				if(point.compare(options.pointer) == -1){
					if(Object.isElement(e.next())){
						parent.insertBefore(this, e.next());
					}else{
						parent.appendChild(this);
					}
				}else{
					parent.insertBefore(this, e);
				}
				
				this.css('top', '0px').css('left', '0px');
				
				//options.pointer = 	point;
				
				Object.extend(options.backup, this.positionedOffset());
				
				//options.deltaX = 	Event.pointerX(evt) - options.backup.left;
				//options.deltaY = 	Event.pointerY(evt) - options.backup.top;
				
				//this.css('top', point.y - options.top).css('left', Coord.x - options.backup.left);
				bool = true;	
			}
		}
		
	},
/*
 * Extends.DragInterface#findDroppable() -> void
 **/
	findDroppable:function(evt){
		
		var options = 	this.dragOptions;
		var droppable = this.droppable;
		var mybreak = 	false;
		var drag = 		new Rectangle(this, true);
		
		//recherche des zones survolés
		for(var i = 0; i < droppable.length && !mybreak; i++){
			var drop = 		new Rectangle(droppable[i], true);
			
			if(drop.intersects(drag)){
				
				mybreak = 	true;
				drop = 		droppable[i];
				
				if(drop.DROPID != this.dropTarget.DROPID){
					this.isDroppable = 	true;
					options.dropTarget = this.dropTarget =	drop;
					
					this.fire('dragenter', evt);
					this.fire('dragover', evt);
					drop.fire('element:dragover', evt);
					drop.fire('element:dragenter', evt);
				}
				
				continue;
			}
		}
		
		if(!mybreak && this.isDroppable){
			this.dropTarget.fire('element:dragleave', evt);
			this.fire('dragleave', evt);
			
			this.isDroppable = 	false;
			options.dropTarget = this.dropTarget =	{DROPID:0};
		}
		
	},
/**
 * Extends.DragInterface#stopObserving(eventName, callback) -> Element
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction à appeller. 
 *
 * Cette méthode permet d'écouter un événement `eventName`.
 *
 * #### Evènements
 *
 * * `drag` : Est déclenché lorsque l'élément est déplacé par drag'n'drop.
 * * `dragend` : Est déclenché lorsque l'élément est relaché.
 * * `dragenter` : Est déclenché lorsque l'élément entre dans une zone de type `drop` (voir [[Extends.DragInterface#addDroppable]] pour ajouter un element drop).
 * * `dragleave` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Extends.DragInterface#addDroppable]] pour ajouter un element drop).
 * * `dragover` : Est déclenché lorsque l'élément quitte une zone de type `drop` (voir [[Extends.DragInterface#addDroppable]] pour ajouter un element drop).
 * * `dragstart` : Est déclenché lorsque l'élément commence à être déplacé.
 * * `drop` : Est déclenché lorsque l'élément est déposé dans une zone de type `drop` (voir [[Extends.DragInterface#addDroppable]] pour ajouter un element drop).
 *
 **/		
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'drag':
			case 'dragleave':
			case 'dragenter':
			case 'dragover':
			case 'drop':
			case 'dragstart':
			case 'dragend':
				Event.stopObserving(this, 'element:'+eventName, callback);
				break;
			default:
				if(Object.isFunction(this.stopObservingBackup)){
					this.stopObservingBackup(eventName, callback);
				}
		}
		return this;
	},
/**
 * Extends.DragInterface#revert() -> Element
 *
 * Cette méthode replace l'élément sur sa position d'origine.
 **/
	revert:function(callback){
		
		if(Object.isFunction(Effect.MoveTo)){
			this.MoveTo(this.dragOptions.backup.left, this.dragOptions.backup.top, {onComplete:callback});
		}else{
			this.css('left', this.dragOptions.backup.left).css('top', this.dragOptions.backup.top);
		}		
		return this;
	},
/**
 * Extends.DragInterface#getDropArea() -> Array
 *
 * Cette méthode retourne la liste des zones de drop.
 **/	
	getDropArea:function(){
		return this.droppable || [];
	},
		
	getDrop: function(){return this.getDropArea();},
/**
 * Extends.DragInterface#getCurrentDrop() -> Element
 *
 * Cette méthode retourne la zone drop en cours.
 **/	
	getCurrentDrop:function(){
		return this.dropTarget;
	},
	
	setDragOptions:function(options){
		
		this.dragOptions = 	options;
		this.dropTarget	= 	{DROPID:0};
		
		if(this.dragOptions.absolute){
			this.css('position', 'absolute');
		}
		else{
			this.css('position', 'relative');
		}
		
		if(this.events){
			//Ajout des listeners
			for(var i = 0; i < this.events.length; i++){
				
				if(Object.isFunction(options[this.events[i]])) {
					
					this.on('element:'+events[i], (function(fn, node){
						return function(evt){
							return fn.call(node, evt);
						};
					})(this.dragOptions[this.events[i]], this));
					
				}
			}
		}
	},
/**
 * Extends.DragInterface#removeDrag() -> Element
 *
 * Cette méthode supprime les événements liés au Drag'n'Drop ajoutés lors de l'utilisation de la méthode [[Element.createDrag]].
 * L'élément ne sera plus draggable jusqu'à la prochaine utilisation de la méthode [[Element.createDrag]]
 *
 **/
	removeDrag: function(node){
		
		if(!this.dragOptions) return;
		
		if(Object.isFunction(this.onDragMouseDown_bind)){
			this.dragOptions.target.stopObserving('mousedown', this.onDragMouseDown_bind);
		}
		
		this.onDragMouseDown_bind = null;
		this.observe = 				this.observeBackup;
		this.stopObserving = 		this.stopObservingBackup;		
		
		for(var i = 0; i < this.droppable.length; i++){
			var drop = this.droppable[i];
			
			drop.stopObserving('dragenter');
			drop.stopObserving('dragleave');
			drop.stopObserving('dragover');
			drop.stopObserving('drop');
			
			drop.observe = 			drop.observeBackup;
			drop.stopObserving = 	drop.stopObservingBackup;
			
		}	
			
		for(var key in Extends.DragInterface){
			if(key == 'observe' || key == 'stopObserving'){
				continue;
			}
			
			this[key] = null;
			delete this[key];
		}
		
		return this;
	}
	
};
/** section: DOM
 * Extends.DragInterface
 *
 * Ensemble de méthode disponible après création d'un element Drag'n'Drop via la méthode [[Element.createDrag]].
 **/
Extends.DropInterface = {
	
	observe:function(eventName, callback){
		
		switch(eventName){
			case 'dragleave':
			case 'dragenter':
			case 'dragover':
			case 'drop':
				Event.observe(this, 'element:'+eventName, callback);
			default:
				this.observeBackup(eventName, callback);
		}
		
		return this;
	},
	
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'dragleave':
			case 'dragenter':
			case 'dragover':
			case 'drop':
				Event.stopObserving(this, 'element:'+eventName, callback);
				break;
			default:
				this.stopObservingBackup(eventName, callback);
		}
		return this;
	}
};