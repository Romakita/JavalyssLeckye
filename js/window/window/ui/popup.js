/** section: UI
 * class Popup
 *
 * Cette classe permet de conteneur d'élement.
 *
 * <p class="note">Le rendu du popup s'adapte au support utilisé (PC ou Tablette).</p> 
 **/
var Popup = Class.createSprite('div');
Popup.prototype = {
	__class__: 	'popup',
	className:	'wobject w-popup border shadow popup',
	deltaY:		0,
	deltaX:		0,
	scroll:		false,
	position:	'left',
	constraint:	false,
/**
 * new Popup([options])
 * - options (Object): Objet de configuration.
 * 
 * Cette méthode créée une nouvelle instance [[Popup]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `deltaX` (`Number`): Décalage du popup en pixel selon l'axe des X.
 * * `deltaY` (`Number`): Décalage du popup en pixel selon l'axe des Y.
 * * `scroll` (`Boolean`) : Remplace la barre de scroll système par celle de WindowJS.
 *
 **/
	initialize: function(options){
		
		if(!Object.isUndefined(options)){
			for(var key in options){
				if(!Object.isFunction(options[key])){
					this[key] = options[key];	
				}
			}
		}
		//
		// Body
		//
		this.body = 	new Node('ul', {className:'list-line wrapper noshadow noradius'});
		this.content = 	new Node('div', {className:'content wrap-content'}, this.body);
		
		if(document.navigator.mobile){
			this.content.addClassName('border');
			
			this.body.on('mouseup', function(evt){
				if(this.ScrollBar.isMove()) {
					evt.stop();	
				}
			}.bind(this));
		}//else{
			this.appendChild(this.content);
		//}
		//
		// ScrollBar
		//
		this.ScrollBar = new ScrollBar({node:this.content, wrapper:this.body, type:'vertical'});
		
		this.appendChild = function(node){
			
			if(node.tagName.toLowerCase() != 'li' && node.tagName.toLowerCase() != 'ol'){
				node = new Node('li', {className:'line'}, node);	
			}
			
			this.body.appendChild(node);
		};
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.ScrollBar.destroy();
		
		this.body = 	null;
		this.content = 	null;
		//this.popup =	null;
		this.ScrollBar = null;
		
		try{this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});}catch(er){}
	},
	
	Scroll:function(bool){
		if(Object.isUndefined(bool)) return this.scroll;
		
		if(bool){
			this.update();
		}else{
			this.content.removeClassName('sb-content-type-vertical');
		}
		
		this.scroll = bool;
		return this.scroll;
	},
/**
 * Popup#refresh() -> Popup
 *
 * Cette méthode actualise l'affichage de la barre de de défilement.
 **/
	refresh: function(){
		if(!this.scroll) return;
		this.ScrollBar.refresh();
		return this;
	},
	
	update: function(){
		if(!this.scroll) return;
		
		this.ScrollBar.refresh();
		return this;
	},
	
	show: function(){
		this.setStyle('display:block');
		
		this.update();
		
		//if(this.content.className.match(/sb-content-type-vertical/)){
			//if(!this.isDim){
				//this.isDim = true;
				//this.body.setStyle('width:' + (this.getWidth() - 23) + 'px');
			//}
		//}	
	},
		
	Body: function(){return this.body},
/**
 * Popup#clear() -> void
 **/
	clear: function(){return this.body.removeChilds()},
/**
 * Popup#moveTo(x, y) -> void
 * Popup#moveTo(element) -> void
 *
 **/	
	moveTo:function(x, y){
		if(!document.navigator.mobile){
			if(Object.isElement(x)){
				
				try{
					
					var node = 		this;
					var child = 	x;
					var options = 	{setWidth:false, setHeight:false, offsetTop:true, offsetLeft:true};
					
					this.clonePosition(x, options);
										
					this.css('top', this.css('top') + x.getHeight() - this.css('border-top-width'));
					
					if(this.position == 'left'){
						this.css('left', this.css('left') - this.css('border-left-width'));				
					}else{
						this.css('left', this.css('left') - (this.getWidth() - x.getWidth()));
					}
					
					x = this.css('left');
					y = this.css('top');
					
				}catch(er){}
				
			}
			//repositionnement si le popup est offset
			
			if(!this.constraint){
				x = x < 0 ? 0 : (x + this.getWidth() > document.stage.stageWidth ? document.stage.stageWidth - this.getWidth() : x);
				
				if(y < 0){
					y = 0;
				}else{
					if(y + this.getHeight() > document.stage.stageHeight){
						if(child && child.hasClassName('input')){
							y = y - this.getHeight() - child.getHeight();
						}else{
							y = document.stage.stageHeight - this.getHeight();
						}
					}
				}
				
				//y =  ? 0 : (y + this.getHeight() > document.stage.stageHeight ? document.stage.stageHeight - this.getHeight() : y);
			}else{
				
				var cx2 = this.constraint.getWidth() + this.constraint.cumulativeOffset().left;
				var cx1 = this.constraint.cumulativeOffset().left;
				
				var cy2 = this.constraint.getHeight() + this.constraint.cumulativeOffset().top;
				var cy1 = this.constraint.cumulativeOffset().top;
				
				x = x < cx1 ? cx1 : (x + this.getWidth() > cx2 ? cx2 - this.getWidth() : x);
				y = y < cy1 ? cy1 : (y + this.getHeight() > cy2 ? cy2 - this.getHeight() : y);	
			}
			
			this.css('left', x).css('top', y);
		}else{
			x = (document.stage.stageWidth - this.content.getWidth())/2;
			y = (document.stage.stageHeight - this.content.getHeight())/2;
			
			x = x < 0 ? 0 : (x + this.content.getWidth() > document.stage.stageWidth ? document.stage.stageWidth - this.content.getWidth() : x);
			y = y < 0 ? 0 : (y + this.content.getHeight() > document.stage.stageHeight ? document.stage.stageHeight - this.content.getHeight() : y);
			
			this.content.css('left', x + "px !important").css('top', y+ "px !important");
		}
	},
	
	setConstraint:function(e){
		this.constraint = e;
	}
};
/* section: UI
 * class ListElement
 **/
var ListLine = Class.createSprite('div');
ListLine.prototype = {
	__class__: 	'list-line',
	className:	'wobject list-line',
/*
 * new ListElement()
 **/
	initialize: function(){}
};