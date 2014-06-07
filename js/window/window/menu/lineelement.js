/** section: Menu
 * class LineElement < Element
 * Gestion d'une ligne d'un menu. Cet élément rentre dans le processus de fabrication 
 * des classes [[DropMenu]] et [[SimpleMenu]].
 **/
var LineElement = Class.createSprite('li');
LineElement.prototype = {
	/** @ignore */
	__class__:	'lineelement',
	/** @ignore */
	className:	'wobject w-line line-element empty',
	_enabled: 	true,
/**
 * LineElement#text -> String
 * Texte affiché sur la ligne.
 **/
	text: 		'',
	
	value:		null,
/**
 * new LineElement([options])
 * - options (Object): Objet de configuration de l'instance.
 *
 * Cette méthode créée une nouvelle instance [[LineElement]].
 **/
	initialize: function(obj){
		
		var options = {
			data:		false,
			isSection:	false,
			border:		false,
			bold:		false,
			lite:		false,
			icon:		'',
			color:		false,
			title:		'',
			text:		'',
			enable:		true,
			size:		'normal'
		};
				
		if(!Object.isUndefined(obj)){
			if(Object.isString(obj) || Object.isNumber(obj)){
				options.title = obj;	
			}else{
				Object.extend(options, obj);
			}
		}
		//
		// Body
		//
		this.header = 			new Node('div', {className:'wrap-header border gradient over'});
		this.header.span =		new Node('span', {className:'font wrap-title title-line-element'});
		this.body =				new Node('ul', {className:'wrap-body'});
		this.wrapper = 			new Node('div', {className:'wrap-content'}, this.body);
		
		//#pragma region Instance	
		if(!options.lite){
			//
			//ColoredBox
			//
			this.ColoredBox = 	new ColoredBox();
			this.ColoredBox.hide();
			
			if(options.color) this.setColor(options.color);
			
			//
			//icons
			//
			this.icons = 		new Node('div',{className:'wrap-icon le-icon'});			
			this.header.appendChild(this.ColoredBox);
			this.header.appendChild(this.icons);
		}
		
		
		//#pragma endregion Instance
		this.header.appendChild(this.header.span);
		this.appendChild(this.header);
		this.appendChild(this.wrapper);		
		this.setText(options.title);
		if(options.text != '') 	this.setText(options.text);
		this.setIcon(options.icon);
		
		if(!options.enable)     this.Enable(options.enable);
		
		this.Bold(options.bold);
		this.Border(options.isSection || options.border);
		this.setData(options.data);
		
		if(options.size == 'large'){
			this.Large(true);
		}
		
		this.appendChild = function(e){
			this.removeClassName('empty');
			this.body.appendChild(e);
			return this;
		}.bind(this);
		
		this.removeChild = function(e){
			this.body.removeChild(e);
			
			if(this.body.childElements().length == 0){
				this.addClassName('empty');
			}
			
			return this;
		}.bind(this);
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.ColoredBox = 	null;
		this.body =			null;
		this.data = 		null;
		
		try{this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});}catch(er){}
	},
/**
 * LineElement#createProgressBar() -> ProgressBar
 *
 * Cette méthode retourne l'élément header de l'instance.
 **/	
	createProgressBar:function(){
		if(!this.ProgressBar){
			this.addClassName('progress');
			
			this.ProgressBar = 	new ProgressBar();
			this.ProgressBar.hide();
			this.Header().appendChild(this.ProgressBar);
			
			this.setProgress = function(){
				this.ProgressBar.show();
				return this.ProgressBar.setProgress.apply(this.ProgressBar, $A(arguments));
			};
		}
		
		return this.ProgressBar
	},
/**
 * LineElement#Header() -> Element
 *
 * Cette méthode retourne l'élément header de l'instance.
 **/	
	Header: function(){
		return this.header;
	},
/**
 * LineElement#Title() -> Element
 *
 * Cette méthode retourne l'élément titre de l'instance.
 **/	
	Title: function(){
		return this.header.span;
	},
/**
 * LineElement#Body() -> Element
 *
 * Cette méthode retourne l'élément body de l'instance.
 **/	
	Body: function(){
		return this.body;
	},
/**
 * LineElement#Bold(bool) -> LineElement
 * - bool (Boolean): Si la valeur est vrai le texte sera affiché en gras.
 *
 * Cette méthode change la propriété CSS `font-weight` du texte entre `bold` ou `normal` en fonction de la valeur de `bool`.
 **/
	Bold: function(bool){
		this.removeClassName('bold');
		if(bool){
			this.addClassName('bold');
		}
		return this;
	},
/**
 * LineElement#Border(bool) -> LineElement
 * - bool (Boolean): Si la valeur est vrai la bordure sera ajoutée.
 *
 * Cette méthode ajoute ou supprime un bordure de séparation en fonction de la valeur de `bool`.
 **/	
	Border: function(bool){
		this.removeClassName('border');
		if(bool) this.addClassName('border');
		return this;
	},
/**
 * LineElement#Selected(bool) -> LineElement
 * - bool (Boolean): Si la valeur est vrai la ligne apparaitra comme etant selectionné.
 *
 * Cette méthode selectionne ou déselectionne la ligne en fonction de la valeur de `bool`.
 **/
	Selected:function(bool){
		this.removeClassName('selected');
		if(bool) this.addClassName('selected');
		return this;
	},
/**
 * LineElement#Enable(bool) -> SimpleButton
 * - bool (Boolean): Change l'etat du bouton. Si la valeur est `true` le bouton sera actif. Si le valeur est `false` le bouton sera désactivé.
 *
 * Active ou désactive le bouton.
 **/
	Enable: function(bool){
		
		this.removeClassName('disabled');
		this._enabled = bool;
		
		if(!bool){
			this.addClassName('disabled');	
			return this._enabled;	
		}
			
		return this._enabled = false;
	},
/**
 * LineElement#stopObserving(eventName, callback) -> void
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
	observe: function(arg1, arg2, bool){
				
		Event.observe(this.header, arg1, function(evt){
			if(arg1 == 'click' || arg1 == 'mousedown' || arg1 == 'mouseup'){
				if(!this._enabled){
					return;
				}
			}
			arg2.call(this, evt);
			//if(Object.isUndefined(bool)) Event.stop(evt);
		}.bind(this));
				
		return this;
	},
/**
 * LineElement#setColor(color) -> LineElement
 * - color (String): Code couleur au format hexadécimal.
 *
 * Cette méthode ajoute une Instance [[ColoredBox]] avec la couleur paramètré.
 **/
	setColor:function(color){
		if(Object.isUndefined(color)) {
			this.ColoredBox.hide();
			this.removeClassName('icon');
		}
		else{
			this.ColoredBox.show();
			this.addClassName('icon');
			this.ColoredBox.setColor(color);
		}
	},
/**
 * LineElement#getData() -> Array 
 *
 * Cette méthode retourne les données de l'instance.
 **/
	getData: function(){
		return this.data;
	},
/**
 * LineElement#setData() -> LineBox 
 *
 * Cette méthode permet de stocker des données dans l'instance.
 **/
	setData: function(obj){
		this.data = obj;
		return this;
	},
/**
 * LineElement#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new LineElement();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new LineElement();
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
 * LineElement#getText() -> String
 *
 * Cette méthode retourne le texte de la ligne.
 **/
	getText:function(){
		return this.header.span.innerHTML;
	},
/**
 * LineElement#setText(text) -> String
 * - text (String): Texte à afficher.
 *
 * Cette méthode change le texte de la ligne.
 **/
	setText:function(title){
		this.header.span.innerHTML = this.text = title;
		return this;
	},
/**
 * LineElement#Value([value]) -> String
 * - value (String): Valeur à assigner.
 * 
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new LineElement();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new LineElement();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		
		if(!Object.isUndefined(value)){
			this.value_ = value;
		}
		
		return this.value_;
	},
/**
 * LineElement#Large(bool) -> Boolean
 **/
	Large: function(bool){
		if(Object.isUndefined(bool)){
			return this.hasClassName('large');
		}
		
		this.removeClassName('large');
		
		if(bool){
			this.addClassName('large');	
		}
		
		return bool
	},
/**
 * LineElement#setIcon(icon) -> LineElement
 * - icon (String): Nom de l'icône.
 *
 * Cette méthode change l'icône de la ligne.
 **/
	setIcon: function(icon){
		
		this.removeClassName('icon');
		
		this.icons.removeClassName('icon-' + this.icon);
		this.icons.css('background-image', '');
		this.icons.removeClassName('contain');
		
		if(Object.isUndefined(icon) || icon == '') return this;
		
		if(icon.match(/http:|https:/)){
			this.icon = '';
			this.icons.css('background-image', 'url(' + icon + ')');
			this.icons.addClassName('contain');
		}else{
			this.icons.addClassName('icon-'+ icon);
			this.icon = icon;
		}
		
		this.addClassName('icon');
		
		return this;
	},
/**
 * LineElement#getIcon() -> String
 *
 * Cette méthode retourne l'icône de l'instance.
 **/
	getIcon:function(){
		return this.icon;
	},
	
	__destruct: function(){
		this.destroy();
	}
};