/** section: UI
 * class LightBox < Element
 *
 * Cette classe créée une visionneuse d'image.
 **/
var LightBox = Class.createSprite('div');
LightBox.prototype = {
	__class__:'lightbox',
	className:'wobject lightbox theme-white',
	index:		0,
	hidden_:	true,
	minHeight:	0,
	minWidth:	0,
	theme:		'white',
/**
 * new LightBox()
 *
 * Créée une nouvelle instance [[LightBox]].
 **/
	initialize: function(obj){
		
		var options = {
			
		};
		
		if(Object.isUndefined(obj)){
			Object.extend(options, obj);	
		}

		//
		// Body
		//
		this.body = 		new Node('div', {className:'wrap-body'});
		//
		// Wrapper
		//
		this.picture = new Picture();
		this.picture.on('complete', this.onComplete.bind(this));
		this.wrapper =	new Node('div', {className:'wrap-mask'}, this.picture);
		//
		// Navigation
		//
		this.navigation =	new Node('div', {className:'wrap-nav'});
		//
		// Footer
		//
		this.legend = 		new Node('div', {className:'wrap-legend'});		
		//
		// Title
		//
		this.lTitle =		new Node('div', {className:'wrap-title'});
		//
		// Next
		//
		this.BtnNext =		new SimpleButton({icon:'next-24'});
		this.BtnNext.addClassName('btn-right');
		//
		// Previous
		//
		this.BtnPrevious =	new SimpleButton({icon:'prev-24'});
		this.BtnPrevious.addClassName('btn-left');
		//
		// Close
		//
		this.BtnClose =		new Node('div', {className:'wrap-close'});
		this.BtnClose.innerHTML = '&times;';
		this.BtnClose.hide();
		
		this.appendChild(this.body);
		//this.appendChild(this.navigation);
		this.body.appendChild(this.wrapper);
		this.body.appendChild(this.BtnNext);
		this.body.appendChild(this.BtnPrevious);
		this.body.appendChild(this.legend);
		this.body.appendChild(this.BtnClose);
		this.legend.appendChild(this.lTitle);
			
		this.hide();
		
		this.on('click', function(evt){
			Event.stop(evt);
			this.hide();
		}.bind(this));
				
		this.BtnPrevious.on('click', function(evt){
			Event.stop(evt);
			this.previous();
		}.bind(this));
		
		this.BtnNext.on('click', function(evt){
			Event.stop(evt);
			this.next();
		}.bind(this));
		
		
		Event.observe(this.body, "DOMMouseScroll", 	this.onWheel.bind(this), false); // Firefox*/
		Event.observe(this.body, "mousewheel", 		this.onWheel.bind(this), false);
				
	},
/*
 * ScrollBar#onWheel(event) -> void
 **/	
	onWheel: function(e){
		Event.stop(e);	
		
		//récupération du nombre de wheel	
		var nb = Event.wheel(e);
		
		try{
			
			if(nb < 0){
				this.next();
			}
			
			if(nb > 0){
				this.previous();
			}
			
		}catch(er){}		
	},
/**
 * LightBox#Hidden(bool) -> Boolean
 * - bool (Boolean): Change l'état de la fenêtre.
 *
 * Cache ou fait apparaitre la visionneuse en fonction du paramètre `bool`. Si la valeur est à `true` alors 
 * la visionneuse sera cachée. Dans le cas contraire elle sera affichée.
 *
 **/
 	Hidden: function(bool){
		if(bool){
			this.hide();	
		}else{
			this.show();	
		}
		return this.hidden_;
	},
/**
 * LightBox#hide() -> LightBox
 *
 * Cette méthode fait disparaitre l'instance.
 **/	
	hide: function(){
		this.removeClassName('fadein');
		this.setTheme('white');
		this.hidden_ = true;
		return this;
	},
/**
 * LightBox#show() -> LightBox
 *
 * Cette méthode fait apparaitre l'instance.
 **/
	show: function(){
		this.removeClassName('fadein');
		this.addClassName('fadein');
		this.hidden_ = false;
		
		//initialisation des valeurs
		if(this.minHeight == 0 && this.minWidth == 0){
			this.minHeight = 	this.body.getHeight();
			this.minWidth = 	this.body.getWidth();
			
			this.body.setStyle({
				left:	((document.stage.stageWidth - this.body.getWidth()) / 2) + 'px',
				top:	((document.stage.stageHeight - this.body.getHeight()) / 2) + 'px'	
			});
			
			this.body.addClassName('transition');
			//this.body.css($CSS3('transition') + '-duration', '400ms');
		}
		
		this.Current(this.options[this.index].src, this.options[this.index].title, this.options[this.index].theme);	
			
		return this;
	},
/**
 * LightBox#selectedIndex(index) -> void
 *
 * Cette méthode affiche l'image de l'index demandé.
 **/	
	selectedIndex:function(it){
		if(!Object.isUndefined(it)){
			this.index = it;
			
			if(!this.Hidden()){
				this.Current(this.options[this.index].src, this.options[this.index].title, this.options[this.index].theme);
			}
		}
		
		return this.index;
	},
/**
 * LightBox#next() -> LightBox
 *
 * Cette méthode passe à l'image suivante.
 **/
 	next:function(){
		this.index++;
		this.index = this.index >= this.options.length ? 0 : this.index;
		
		if(!this.Hidden()){
			this.Current(this.options[this.index].src, this.options[this.index].title, this.options[this.index].theme);
		}
	},
/**
 * LightBox#previous() -> LightBox
 *
 * Cette méthode passe l'image précédente.
 **/
 	previous:function(){
		this.index--;
		this.index = this.index < 0 ? this.options.length - 1 : this.index;
		
		if(!this.Hidden()){
			this.Current(this.options[this.index].src, this.options[this.index].title, this.options[this.index].theme);
		}
	},
/*
 * LightBox#Current(link, title) -> String 
 **/	
	Current: function(link, title, theme){
		if(Object.isUndefined(link)) return this.picture.src;
		
		
		this.setTheme(theme);
		this.picture.removeClassName('opa');
		
		if(title){
			this.lTitle.innerHTML =   '<span class="wrap-text">' + title + '</span>';
			
			if(this.options.length > 1){
				this.lTitle.innerHTML += '<span class="wrap-subtext">' + $MUI('Image') + ' '+ (this.index+1)+ ' ' + $MUI('sur') + ' ' + this.options.length + '</span>';
			}
					
			this.legend.stageHeight = this.legend.getHeight() + this.legend.css('padding-top') + this.legend.css('bottom');
		}else{
			this.legend.stageHeight = 0;
			this.lTitle.innerHTML =	'';
			if(this.options.length > 1){
				this.lTitle.innerHTML += 	'<span class="wrap-subtext">' + $MUI('Image') + ' ' + (this.index+1)+ ' ' + $MUI('sur') + ' ' + this.options.length + '</span>';
				this.legend.stageHeight = 	this.legend.getHeight() + this.legend.css('padding-top') + this.legend.css('bottom');
			}
		}
		
		this.BtnNext.hide();
		this.BtnPrevious.hide();
		this.BtnClose.hide();		
		this.legend.hide();
		
		this.body.setStyle({
			left:	((this.getDimensions().width - this.body.width) / 2) + 'px',
			top: 	((this.getDimensions().height - this.body.height) / 2) + 'px'
		});
		
		//this.picture = new Picture();
				
		this.wrapper.addClassName('icon-loading-32');	
		this.picture.setSrc(link);
		
		return this.picture.src;
	},
/*
 * 
 **/	
	onComplete:function(){//chargement de l'image
		
		this.wrapper.removeClassName('icon-loading-32');
		this.picture.css('width','auto').css('height', 'auto');
		
		var stage = {
			height: this.getHeight() - this.legend.stageHeight - 50,
			width: 	this.getWidth() - 50
		};
		
		var dim =		{
			height: 	this.picture.height,
			width: 		this.picture.width
		};
				
		//vérification de la posibilité d'affichage
		if(!(dim.height < stage.height && dim.width < stage.width)){
			dim = this.picture.resizeTo(stage.width, stage.height);
		}
		
		//
		if(dim.height < this.minHeight){
			dim.height = this.minHeight;
		}
		
		if(dim.width < this.minWidth){
			dim.width = this.minWidth;
		}
		
		dim.width += this.wrapper.css('left') + this.wrapper.css('right');
		
		this.body.setStyle({
			left:	((this.getWidth() - dim.width) / 2) + 'px',
			top:	((this.getHeight() - dim.height - this.legend.stageHeight) / 2) + 'px',
			width:	dim.width + 'px',
			height:	dim.height + 'px'
		});
		
		new Timer(function(){//animation picture
		
			this.picture.addClassName('opa');
			this.BtnClose.show();
			
			if(this.options.length > 1){
				this.BtnNext.show();
				this.BtnPrevious.show();
			}else{
				this.BtnNext.hide();
				this.BtnPrevious.hide();
			}
			
			new Timer(function(){
				
				if(this.lTitle.innerHTML || this.options.length > 1){	
					this.body.setStyle({
						height:	(dim.height + this.legend.stageHeight) + 'px'
					});
					
					new Timer(function(){
						this.legend.show();
					}.bind(this), 0.4, 1).start();
				}
			}.bind(this), 0.4, 1).start();
		}.bind(this), 0.6, 1).start();
		
	},
/**
 * LightBox#setData(array) -> LightBox
 * - array (Array): Tableau d'objet {src, title}.
 *
 * Cette méthode permet d'assigner une liste de données à afficher dans la [[LightBox]].
 **/	
	setData: function(array){
		this.options = array;
		return this;
	}
};
/**
 * LightBox.Transform(relname) -> void
 * - relname (String): Nom de regroupement des images à mettre en lightbox.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[LightBox]].
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment faire apparaitre un LightBox au clique d'un élément :</p>
 * 
 *     <a href="http://domain.fr/mon/dossier/monimg.png" rel="lightbox">
 *     <img src="http://domain.fr/mon/dossier/minmonimg.png" />
 *     </a>
 *
 * </div>
 * </div> 
 *
 **/
LightBox.Transform = function(e){
	
	if(!$WR().LightBox){
		WindowRegister.LightBox = $WR.LightBox = $WR().LightBox = new LightBox();
		document.body.appendChild($WR().LightBox);	
	}
		
	document.observe('click', function(event){
		var target = event.findElement('a[rel^='+e+']') || event.findElement('area[rel^='+e+']');
		
		if (target) {
			event.stop();
			
			var array = [];
			var index =	0;
			
			if ((target.getAttribute("rel") == e)){
				// if image is NOT part of a set, add single image to imageArray
				array.push({src: target.href, title:target.title, theme:target.data('theme')});         
			} else {
				// if image is part of a set..
				array = 
					$$(target.tagName + '[href][rel="' + target.rel + '"]').
					collect(function(anchor){ return {src:anchor.href, title:anchor.title, theme:anchor.data('theme')}; }).
					uniq();
				
				while (array[index].src != target.href) { index++; }
			}
			
			$WR().LightBox.setData(array);
			$WR().LightBox.selectedIndex(index);
			$WR().LightBox.show();
		}
	}.bind(this));
	
};
