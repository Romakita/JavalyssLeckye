Extends.Effect = {
	
	NODE_FPS:			100,
	NODE_DURATION:		0.5,
/**
 * Element.Appear(@element [, options]) -> Element
 * 
 * Cette méthode fait apparaitre progressivement l'element.
 *
 * #### Paramètre options
 *
 * * `options.duration` : Durée de l'effet.
 * * `options.delay` : Temps de retard avant le début de l'effet.
 * * `options.onComplete` : Ecouteur qui sera appelé un fois l'effet terminé.
 *
 **/
	Appear: function(node, obj){
		
		node.setOpacity(0);
		
		var options = {
			duration: 	Extends.Effect.NODE_DURATION,
			delay:		0,
			finish:		0,
			count:		0,
			time:		0,
			frame:		0,
			fps:		100
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		options.finish = 	options.duration + options.delay;
		options.frame =		options.fps * options.duration;
		options.opacity = 	1 / options.frame;
		options.f =			1 / options.fps;
		//alert(options.frame);
		options.on = function(n){
			n.setOpacity((this.opacity * this.count).toFixed(2));
		};
		
		var date = new Date();
		options.end = function(n){
			n.setOpacity(1);
			console.log(date.secondsDiff(new Date()));
		};
		
		node.options = options;
				
		options.timer = new Timer(node.onEffect.bind(node), 1 / options.fps);
		options.timer.start();
		
		onEffect = null;
				
		return node;
	},
/**
 * Element.Disappear(@element [, options]) -> Element
 * 
 * Cette méthode fait dispparaitre progressivement l'element.
 *
 * #### Paramètre options
 *
 * * `options.duration` : Durée de l'effet.
 * * `options.delay` : Temps de retard avant le début de l'effet.
 * * `options.onComplete` : Ecouteur qui sera appelé un fois l'effet terminé.
 *
 **/
	Disappear: function(node, obj){

		node.setOpacity(1);
		
		var options = {
			duration: 	Extends.Effect.NODE_DURATION,
			delay:		0,
			finish:		0,
			count:		0,
			time:		0,
			frame:		0,
			fps:		Extends.Effect.NODE_FPS
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		options.finish = 	options.duration + options.delay;
		options.frame =		options.fps * options.duration;
		options.opacity = 	1 / options.frame;
		options.f =			1 / options.fps;
		
		options.on = function(n){
			n.setOpacity(1 - (this.opacity * this.count).toFixed(1));
		};
		
		options.end = function(n){
			n.setOpacity(0);
		};
		
		var onEffect = function(){
			Extends.Effect.onEffect(node, options);	
		};
		
		options.timer = new Timer(onEffect.bind(node), options.f);
		options.timer.start();
		
		onEffect = null;
		
		return node;
	},
/**
 * Element.Grow(@element [, options]) -> Element
 * 
 * Cette méthode fait apparaitre progressivement l'element par agrandissement.
 *
 * #### Paramètre options
 *
 * * `options.duration` : Durée de l'effet.
 * * `options.delay` : Temps de retard avant le début de l'effet.
 * * `options.onComplete` : Ecouteur qui sera appelé un fois l'effet terminé.
 * * `options.direction` : Type d'apparition. Les différents types sont les suivants `center`, `top-left`, `top-right`, `bottom-right`, `bottom-left`
 *
 **/
	Grow: function(node, obj){
		
		var options = {
			duration: 	Extends.Effect.NODE_DURATION,
			delay:		0,
			finish:		0,
			count:		0,
			time:		0,
			frame:		0,
			fps:		Extends.Effect.NODE_FPS,
			direction:	'center',
			dimension:	{
				width: 	1 * node.getStyle('width').replace('px', ''),
				height:	1 * node.getStyle('height').replace('px', '')
			},
			dim:		{width:0, height:0}
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}

		options.coord =	{y:parseFloat(node.getStyle('top') || '0'), x:parseFloat(node.getStyle('left') || '0')};
		
		options.finish = 	options.duration + options.delay;
		options.frame =		options.fps * options.duration;

		options.move = {
			width:	options.dimension.width / options.frame,
			height:	options.dimension.height / options.frame
		};
		
		//modification du style
		var childs = node.childElements();
		
		for(var i = 0; i < childs.length; i++){
			childs[i].setStyle('visibility:hidden');
		};
		node.setOpacity(1);
		node.setStyle('width:0px;height:0px');
		
		switch(options.direction) {
			case 'top-left':
			  	break;
			case 'top-right':
				node.setStyle({
					left: 	(options.coord.x + options.dimension.width) + 'px'
				});
				node.MoveTo(options.coord.x, options.coord.y, {duration:options.duration});
			 	break;
			case 'bottom-left':
				node.setStyle({
					top:	(options.coord.y + options.dimension.height) + 'px'
				});
				node.MoveTo(options.coord.x, options.coord.y, {duration:options.duration});
				break;
			case 'bottom-right':
				node.setStyle({
					left: 	(options.coord.x + options.dimension.width) + 'px',
					top:	(options.coord.y + options.dimension.height) + 'px'
				});
				node.MoveTo(options.coord.x, options.coord.y, {duration:options.duration});	
				break;
			case 'center':
				node.setStyle({
					left: 	(options.coord.x + (options.dimension.width / 2)) + 'px',
					top:	(options.coord.y + (options.dimension.height / 2)) + 'px'
				});
				node.MoveTo(options.coord.x, options.coord.y, {duration:options.duration});
				
				break;
		}
		
		options.on = function(n){
			this.dim.height += 	this.move.height;
			this.dim.width += 	this.move.width;
			
			node.setStyle({
				width: 	this.dim.width + 'px',
				height:	this.dim.height + 'px'
			});
		};
		
		options.end = function(n){
			node.setStyle({
				width: 	this.dimension.width + 'px',
				height:	this.dimension.height + 'px'
			});
			
			var childs = n.childElements();
			
			for(var i = 0; i < childs.length; i++){
				childs[i].setStyle('visibility:visible');
				childs[i].Appear({duration:0.1});
			};
		};
		
		var onEffect = function(){
			Effect.onEffect(node, options);	
		};
		
		options.timer = new Timer(onEffect.bind(node), 1 / options.fps);
		options.timer.start();
		
		onEffect = null;
		
		return node;
	},
	/*
	 * Effet de transition. L'objet disparait par miniaturisation.
	 * @param {Integer} obj Configuration de configuration de la translation
	 *<ul>
	 *		<li>{@link Number} delay retard de la translation</li>
	 *		<li>{@link Number} duration : temps de la translation</li>
	 *		<li>{@link String} direction : type d'agrandissement (center, top-left, top-right, bottom-left, bottom-right)</li>
	 * 		<li>{@link Number} onComplete : fonction appellé après la transition</li>
	 *</ul>
	 */
/**
 * Element.Shrink(@element [, options]) -> Element
 * 
 * Cette méthode fait dispparaitre progressivement l'element par miniaturisation.
 *
 * #### Paramètre options
 *
 * * `options.duration` : Durée de l'effet.
 * * `options.delay` : Temps de retard avant le début de l'effet.
 * * `options.onComplete` : Ecouteur qui sera appelé un fois l'effet terminé.
 * * `options.direction` : Type d'apparition. Les différents types sont les suivants `center`, `top-left`, `top-right`, `bottom-right`, `bottom-left`
 *
 **/
	Shrink: function(node, obj){
		
		var options = {
			duration: 	Extends.Effect.NODE_DURATION,
			delay:		0,
			finish:		0,
			count:		0,
			time:		0,
			frame:		0,
			fps:		Extends.Effect.NODE_FPS,
			direction:	'center',
			dimension:	{
				width: 	1 * node.getStyle('width').replace('px', ''),
				height:	1 * node.getStyle('height').replace('px', '')
			},
			dim:		{width:0, height:0}
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		options.dim =	{width:options.dimension.width, height:options.dimension.height};
		
		options.coord =	{y:parseFloat(node.getStyle('top') || '0'), x:parseFloat(node.getStyle('left') || '0')};
		
		options.finish = 	options.duration + options.delay;
		options.frame =		options.fps * options.duration;

		options.move = {
			width:	options.dimension.width / options.frame,
			height:	options.dimension.height / options.frame
		};
		
		//modification du style
		var childs = node.childElements();
		
		for(var i = 0; i < childs.length; i++){
			childs[i].setStyle('visibility:hidden');
		};
				
		switch(options.direction) {
			case 'none':
			case 'top-left':
			  	break;
			case 'top-right':
				node.MoveTo(options.coord.x + options.dimension.width, options.coord.y, {duration:options.duration});
			 	break;
			case 'bottom-left':
				node.MoveTo(options.coord.x, options.coord.y + options.dimension.height, {duration:options.duration});
				break;
			case 'bottom-right':
				node.MoveTo(options.coord.x + options.dimension.width, options.coord.y + options.dimension.height, {duration:options.duration});	
				break;
			case 'center':

				node.MoveTo(options.coord.x + (options.dimension.width / 2), 
							options.coord.y + (options.dimension.height / 2), {duration:options.duration});
				
				break;
		}
		
		node.Disappear({duration:options.duration});
		
		options.on = function(n){
			this.dim.height -= 	this.move.height;
			this.dim.width -= 	this.move.width;
			
			node.setStyle({
				width: 	this.dim.width + 'px',
				height:	this.dim.height + 'px'
			});
		};
		
		options.end = function(n){
			node.setStyle({
				width: 	this.dimension.width + 'px',
				height:	this.dimension.height + 'px'
			});
			
			node.setOpacity(0);
			
			var childs = n.childElements();
			
			for(var i = 0; i < childs.length; i++){
				childs[i].setStyle('visibility:visible');
				childs[i].setOpacity(1);
			};
			
		};
		
		var onEffect = function(){
			Extends.Effect.onEffect(node, options);	
		};
		
		options.timer = new Timer(onEffect.bind(node), 1 / options.fps);
		options.timer.start();
		
		onEffect = null;
		
		return node;
	},
/**
 * Element.MoveTo(@element, x, y [, options]) -> Element
 * - x (Number): Coordonnées.
 * - y (Number): Coordonnées.
 *
 * Cette méthode déplace l'element vers les coordonnées `x` et `y`.
 *
 * #### Paramètre options
 *
 * * `options.duration` : Durée de l'effet.
 * * `options.delay` : Temps de retard avant le début de l'effet.
 * * `options.onComplete` : Ecouteur qui sera appelé un fois l'effet terminé.
 *
 **/
	MoveTo:function(node, x, y, obj){
		
		var options = {
			duration: 	Extends.Effect.NODE_DURATION,
			delay:		0,
			finish:		0,
			count:		0,
			time:		0,
			frame:		0,
			fps:		Extends.Effect.NODE_FPS,
			x:			x,
			y:			y
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		options.coord =	{y:parseFloat(node.getStyle('top') || '0'), x:parseFloat(node.getStyle('left') || '0')};
		
		//calcul du mouvement
		options.finish = 	options.duration + options.delay;
		options.frame =		options.fps * options.duration;
		options.move = {
			x:	(x - options.coord.x) / options.frame,
			y:	(y - options.coord.y) / options.frame
		};
		
		options.on = function(n){
			
			this.coord.x += this.move.x;
			this.coord.y += this.move.y;
			
			n.setStyle({
				left: 	Math.round(this.coord.x) + 'px',
				top:	Math.round(this.coord.y) + 'px'
			});
		};
		
		var onEffect = function(){
			Extends.Effect.onEffect(node, options);	
		};
		
		options.timer = new Timer(onEffect.bind(node), 1 / options.fps);
		options.timer.start();
		
		onEffect = null;
		
		return node;
	},
	/*
	 * @private
	 * @ignore
	 */
	onEffect: function(node){
		
		var options = node.options;
		options.time += options.f;
		
		if(options.time < options.delay) return;
		
		if(options.count < options.frame){
			options.count++;
			options.on(node);
		}else{
			
			options.timer.stop();
			options.timer = null;
			options.on = null;
			
			if(!Object.isUndefined(options.end)) {
				options.end(node);
				options.end = null;
			}
			
			if(Object.isFunction(options.onComplete)) {
				options.onComplete.call(node, node);
				options.onComplete = null;
			}
		}
	}
};

Element.addMethods(Extends.Effect);