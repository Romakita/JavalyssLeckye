/** section: Button
 * class HeadPiece < SimpleButton
 * Cette classe permet de créer des vignettes avec une image et un titre.
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance HeadPiece en Javascript :</p>
 *
 *     var btn = HeadPiece({title:'Ma photo', src:'http://wiki.rom-makita.fr/window/images/WindowJSLogo.png'});
 *     document.body.appendChild(btn);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance HeadPiece en HTML :</p>
 * 
 *     <div class="box-headpiece">
 *     <a href="http://wiki.rom-makita.fr/window/"><img src="http://wiki.rom-makita.fr/window/images/WindowJSLogo.png"></a>
 *     <span>Ma photo</span>
 *     </div>
 * 
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div class="box-headpiece"><a href="http://wiki.rom-makita.fr/window/"><img src="http://wiki.rom-makita.fr/window/images/WindowJSLogo.png"></a><span>Ma photo</span></div>
 *
 **/
var HeadPiece = Class.from(SimpleButton);

HeadPiece.prototype = {
	__class__:	'headpiece',
	className:	'wobject hp-button noselect',
	resize:		true,
/**
 * new HeadPiece([options])
 * - options (Object): Objet de configuration
 * 
 * Cette méthode créée une nouvelle instance de [[HeadPiece]]. 
 * HeadPiece est une vignette comportant un titre et une image. 
 * 
 * #### Le paramètre options
 *
 * Le paramètre options peut prendre plusieurs attributs tel que :
 *
 * * `title` (`String`) : Assigne le titre de la vignette.
 * * `src` (`String`) : Indique le lien de l'image à charger.
 * * `legend` (`String`) : Crée une légende. Cette légende sera affiché au survol de la vignette.
 * * `icon` (`String`) : Affiche une icône CSS en lieu et place de l'image.
 * 
 **/
	initialize: function(obj){
		this.Picture = 				new Picture();
		this.WrapPicture =			new Node('div', {className:'wrap-picture'});
		this.DivSelected =			new Node('div', {className:'wrap-select icon-valid'});
		this.SpanText.className = 	'wrap-text';
		this.Icon.className =		'wrap-mask';
		
		this.Icon.appendChild(this.Picture);
		this.Icon.appendChild(this.WrapPicture);
		this.appendChild(this.DivSelected);
		
		this.SpanText.hide();
		
		var options = {
			className: '',
			title:	'',
			text:	'',
			src:	'',
			legend:	'',
			icon:	'',
			value:	'',
			resize:	true,
			nbTry:	0
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.resize = options.resize;
		this.Picture.onload = this.onComplete.bind(this);
		this.Picture.onerror = this.Picture.onabort = this.onError.bind(this);
		this.nbTry = options.nbTry;	
		if(options.className != '') 	this.addClassName(options.className);
		if(options.text != '') 			this.setText(options.text);
		if(options.title != '') 		this.setText(options.title);
		if(options.legend != '') 		this.Legend(options.legend);
		if(options.nofill)    			this.noFill();
		if(options.icon != '') 			this.setIcon(options.icon);
		if(options.src != '') 			this.setIcon(options.src);
		
	},
/*
 * HeadPiece.onComplete() -> void
 **/	
	onComplete: function(){
		
		this.Icon.removeClassName('icon-loading-gif');
		
		if(document.backgroundSize && this.resize){
			this.WrapPicture.addClassName('opa');
			this.WrapPicture.css('background-image', 'url("' + this.Picture.src + '")');
		}else{
						
			var dim = 		this.Icon.getDimensions();
				
			if(dim.width == 0 && dim.height == 0){
				
				if(this.resize){
					new Timer(function(e){
						var dim = 		this.Icon.getDimensions();
						
						if(!(dim.width == 0 && dim.height == 0)){
							e.stop();
							this.Picture.addClassName('opa');
							
							this.Picture.resizeTo(dim.width, dim.height);
							
							this.Picture.setStyle({
								marginTop: (((dim.height - this.Picture.height) / 2) - 1) + 'px' 
							});
						}
					}.bind(this), 0.5, 1000).start();
				}
			}else{
			
				this.Picture.addClassName('opa');		
				
				if(this.resize){
					this.Picture.resizeTo(dim.width, dim.height);
				
					this.Picture.setStyle({
						marginTop: (((dim.height - this.Picture.height) / 2) - 1) + 'px' 
					});
				}
			}
		}
	},
/*
 * HeadPiece.onError() -> void
 **/	
	onError: function(){
		
		if(this.timer){
			this.timer.stop();
			this.timer = null;
		}
		
		this.Picture.removeClassName('opa');
				
		if(this.nbTry > 0){
			this.nbTry--;
			
			this.Icon.addClassName('icon-loading-gif');
			this.Picture.src = this.Picture.src.split('?')[0] +  '?' + (Math.random() * 1000000).toFixed(0);
		}else{
			this.Icon.removeClassName('icon-loading-gif');
			this.Icon.addClassName('icon-cancel');	
		}
	},
/*
 * HeadPiece#Src(src) -> String
 * - src (String): Lien de l'image.
 *
 * Assigne et retourne le lien de l'image de la vignette.
 **/
	Src: function(src){		
		return this.setIcon(src);
	},
	//
	setSrc: function(src){this.Src(src);return this;},
/*
 * HeadPiece#setIcon(icon) -> HeadPiece
 *
 * Assigne un nom d'icône CSS pour la vignette.
 **/
	setIcon: function(icon){
		this.Icon.className = 'wrap-mask';
				
		if(icon != ''){
					
			if(icon.match(/\./)){//image par lien
				
				switch(icon.substring(icon.lastIndexOf('.')).toLowerCase()){
					case '.jpg':
					case '.gif':
					case '.png':
					case '.jpeg':
						this.Icon.addClassName('icon-loading-gif');
						this.Picture.removeClassName('opa');
						this.WrapPicture.removeClassName('opa');
						this.Picture.setUrl(icon);
						break;
					default:
						var ext = icon.substring(icon.lastIndexOf('.')).toLowerCase().replace('.', '');
						
						if(!$WR().FileIcons[ext]){
							ext = 'filenew-48';
						}else{
							ext = $WR().FileIcons[ext];
						}
						
						if(this.className.match(/mini/)){
							ext = ext.replace('-48', '-24');
						}
						this.Icon.addClassName('icon-' +ext);
						break;
				}
			
				
			}else{
				this.Icon.addClassName('icon-' + icon);
			}
		}else{
			this.Icon.removeClassName('icon-' + this.iconName);
			this.Picture.removeClassName('opa');
			this.WrapPicture.removeClassName('opa');
		}
		
		this.iconName = icon;
		return this;
	},
/**
 * HeadPiece#getIcon() -> String
 **/	
	getIcon: function(){return this.iconName;},
/**
 * HeadPiece#Mini() -> SimpleButton
 *
 * Cette méthode change le bouton en mini bouton.
 **/
 	
/*
 * HeadPiece#Submit() -> AppButton
 *
 * Cette méthode change le type de bouton en type Submit.
 **/
 	Submit: function(){},
/*
 * HeadPiece#Enable(bool) -> AppButton
 * - bool (Boolean): Change l'etat du bouton. Si la valeur est `true` le bouton sera actif. Si le valeur est `false` le bouton sera désactivé.
 *
 * Active ou désactive le bouton.
 **/
	Enable: function(bool){},
/*
 * HeadPiece#Selected(bool) -> AppButton
 * - bool (Boolean): Change l'etat du bouton. Si la valeur est `true` le bouton sera selectionné. Si le valeur est `false` le bouton sera déselectionné.
 *
 * Selectionne ou déselectionne le bouton.
 **/
	Selected: function(bool){
		
		this.removeClassName('selected');
		
		if(bool){
			this.addClassName('selected');
			return bool;	
		}
			
		return bool;
	},
/*
 * HeadPiece#setText(txt) -> AppButton
 * - txt (String): Texte à afficher.
 *
 * Cette méthode assigne un texte au bouton.
 **/
	setText:function(txt){
		
		if(Object.isUndefined(txt)) {
			this.SpanText.innerHTML = '';
			this.SpanText.hide();
		}
		else{
			this.SpanText.show();
			this.SpanText.innerHTML = txt;
		}
		
		return this;
	},
/*
 * HeadPiece#Title([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le titre de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new HeadPiece();
 *     c.Title('mon titre');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new HeadPiece();
 *     c.Title('mon titre');
 *     alert(c.Title()); //mon titre
 * 
 **/
	Title:function(title){
		return this.setText(title);
	}
};
/**
 * HeadPiece.Transform(node) -> HeadPiece
 * HeadPiece.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance HeadPiece.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[HeadPiece]].
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance HeadPiece en Javascript :</p>
 *
 *     var btn = HeadPiece({title:'Ma photo', src:'http://wiki.rom-makita.fr/window/images/WindowJSLogo.png'});
 *     document.body.appendChild(btn);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance HeadPiece en HTML :</p>
 * 
 *     <div class="box-headpiece">
 *     <a href="http://wiki.rom-makita.fr/window/"><img src="http://wiki.rom-makita.fr/window/images/WindowJSLogo.png"></a>
 *     <span>Ma photo</span>
 *     </div>
 * 
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div class="box-headpiece"><a href="http:/windowjs.fr/window/"><img src="http://windowjs.fr/window/images/WindowJSLogo.png"></a><span>Ma photo</span></div>
 *
 **/
HeadPiece.Transform = function(e){
	
	if(Object.isElement(e)){	
		var a = 			e.select('a')[0];
		var img =			e.select('img')[0];
		var text = 			e.select('span')[0];		
		var icon = 			a.className.replace('icon-', '');
		var btn = 			new HeadPiece({text:text ? text.innerHTML : '', icon:img ? img.src : icon});
		
		btn.link =		a.href;
		btn.title = 	e.title;
		btn.target = 	a.target;		
		
		btn.addClassName(e.className);
		btn.removeClassName('box-headpiece');
						
		btn.on('click', function(){
			$WR.evalLink(this.link, this.target);
		});
		
		e.replaceBy(btn);
		
		return btn;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(HeadPiece.Transform(e));
	});
	
	return options;
};