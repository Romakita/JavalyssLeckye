/** section: Button
 * class AppButton < SimpleButton
 * Cette classe créée un bouton similaire à ceux sur iPhone/iPad.
 * 
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance AppButton avec un texte avec une icône en Javascript :</p>
 * 
 *     var btn = AppButton({text:'Mon boutton', icon:'date'});
 *     document.body.appendChild(btn);
 * 
 * <p>Cette exemple montre comment créer une instance AppButton de petite taille avec une icône en Javascript :</p>
 * 
 *     var btn = AppButton({icon:'date', type:'mini'});
 *     document.body.appendChild(btn);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance AppButton avec un texte avec une icône en HTML :</p>
 * 
 *     <span class="box-app-button"><a href="" class="date">Mon boutton</a></span>
 *
 * <p>Cette exemple montre comment créer une instance AppButton de petite taille avec une icône en HTML :</p>
 * 
 *     <span class="box-app-button type-mini"><a href="" class="date"> </a></span> 
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <table><tr><td>
 * <span class="box-app-button"><a href="" class="date">Mon boutton</a></span>
 * </td><td>
 * <span class="box-app-button type-mini"><a href="" class="date"> </a></span>
 * </td></tr></table>
 *
 **/
var AppButton = Class.from(SimpleButton);
AppButton.prototype = {
	__class__:'appbutton',
	className:'wobject app-button noselect',
/**
 * new AppButton(options)
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance [[AppButton]].
 * 
 * #### Attributs du paramètre options
 *
 * * `icon` : Nom de l'icone à afficher. La liste des icones est mise à disposition par le fichier icons.css de l'application.
 * * `text` : Texte à afficher dans le bouton.
 * * `enabled`: Active ou desactive le bouton.
 * * `nofill`: Supprime les bordures et le fond du bouton.
 * * `type`: (Normal : style normal, Mini : petit bouton, Large : grand boutton)
 *
 **/
	initialize:function(obj){
		this.Picture = 				new Picture();
		this.WrapPicture =			new Node('div', {className:'wrap-picture'});
		this.SpanText.className = 	'wrap-text';
		this.Icon.className =		'wrap-mask';
		
		this.Icon.appendChild(this.Picture);
		this.Icon.appendChild(this.WrapPicture);
		
		
		var options = {
			className: '',
			text: 	'',
			icon:	'',
			nofill:	false,
			type:	'normal',
			resize:	true,
			nbTry:	0
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.resize = options.resize;
		this.Picture.onload = this.onComplete.bind(this);
		this.Picture.onerror = this.Picture.onabort = this.onError.bind(this);
		this.resize = options.resize;

		if(options.className != '') 	this.addClassName(options.className);
		if(options.text != '') 			this.setText(options.text);
		if(options.nofill)    			this.noFill();
		
		switch(options.type){
			default:break;
			case 'mini':
				this.Mini();
				break;
		}
		
		if(options.icon != '') 			this.setIcon(options.icon);
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
 * AppButton#Mini() -> SimpleButton
 *
 * Cette méthode change le bouton en mini bouton.
 **/
 	Mini: function(){
		this.Normal();
		this.addClassName('mini');
	},
/*
 * AppButton#Normal() -> AppButton
 *
 * Cette méthode rétablie le style du bouton.
 **/
 	Normal: function(){
		this.removeClassName('mini');
	},
/*
 * SimpleButton.Submit() -> AppButton
 *
 * Cette méthode change le type de bouton en type Submit.
 **/
 	Submit: function(){},
/*
 * AppButton#Enable(bool) -> AppButton
 * - bool (Boolean): Change l'etat du bouton. Si la valeur est `true` le bouton sera actif. Si le valeur est `false` le bouton sera désactivé.
 *
 * Active ou désactive le bouton.
 **/
	Enable: function(bool){},
/*
 * AppButton#Large() -> AppButton
 *
 * Cette méthode change le bouton en un bouton large acceptant les icônes de 32x32.
 **/
 	Large: function(){},
/*
 * AppButton#Selected(bool) -> AppButton
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
 * AppButton#setIcon(icon) -> AppButton
 * - icon (String): Nom de l'icone ou lien de l'icone.
 *
 * Cette méthode ajoute un nom d'icone qui apparaitra dans le bouton.
 **/
	setIcon: function(icon){
		this.Icon.className = 'wrap-mask';
		//this.Icon.className = 'wrap-mask mask-app-icon';
				
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
/*
 * AppButton#getIcon() -> String
 *
 * Retourne le nom ou le lien de l'icône affichée.
 *
 **/
	getIcon: function(){
		return this.iconName;
	},
/*
 * AppButton#setText(txt) -> AppButton
 * - txt (String): Texte à afficher.
 *
 * Cette méthode assigne un texte au bouton.
 **/
	setText:function(txt){
		if(Object.isUndefined(txt)) this.SpanText.innerHTML = '';
		this.SpanText.innerHTML = txt;
		
		return this;
	}
};
/**
 * AppButton.Transform(node) -> AppButton
 * AppButton.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance AppButton.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[AppButton]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance AppButton avec un texte avec une icône en Javascript :</p>
 * 
 *     var btn = AppButton({text:'Mon boutton', icon:'date'});
 *     document.body.appendChild(btn);
 * 
 * <p>Cette exemple montre comment créer une instance AppButton de petite taille avec une icône en Javascript :</p>
 * 
 *     var btn = AppButton({icon:'date', type:'mini'});
 *     document.body.appendChild(btn);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance AppButton avec un texte avec une icône en HTML :</p>
 * 
 *     <span class="box-app-button"><a href="" class="date">Mon boutton</a></span>
 *
 * <p>Cette exemple montre comment créer une instance AppButton de petite taille avec une icône en HTML :</p>
 * 
 *     <span class="box-app-button type-mini"><a href="" class="date"> </a></span> 
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <table><tr><td>
 * <span class="box-app-button"><a href="" class="date">Mon boutton</a></span>
 * </td><td>
 * <span class="box-app-button type-mini"><a href="" class="date"> </a></span>
 * </td></tr></table>
 *
 **/
AppButton.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var a = 			e.getElementsByTagName('a')[0];
		var text = 			a.innerHTML;
		var icon = 			a.data('icon') ? a.data('icon') : a.className.replace('icon-', '');
		var btn = 			new AppButton({text:text, icon:icon, type:e.className.match(/type-mini/) ? 'mini' : ''});
		
		btn.link =		a.href;
		btn.title = 	e.title;
		btn.target = 	a.target;
		
		btn.addClassName(e.className);
		btn.removeClassName('box-app-button');
						
		btn.on('click', function(){
			$WR.evalLink(this.link, this.target);
		});
		
		e.replaceBy(btn);
		
		return btn;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(AppButton.Transform(e));
	});
	
	return options;
};