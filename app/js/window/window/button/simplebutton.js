/** section: Button
 * class SimpleButton < Element
 * Cette classe créée un bouton paramètrable avec une icone et un texte.
 * 
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance SimpleButton en Javascript.</p>
 *
 *     var btn = SimpleButton({title:'SimpleButton', icon:'date'});
 *     document.body.appendChild(btn);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance HeadPiece en HTML.</p>
 *
 *     <span class="box-simple-button"><a href="" class="date">SimpleButton</a></span>
 *     <span class="box-simple-button"><a href="">SimpleButton</a></span>
 *     <span class="box-simple-button"><a href="" class="date"></a></span>
 * 
 * </div>
 * </div>
 *  
 * #### Résultat
 * 
 * <span class="box-simple-button"><a href="" class="date">SimpleButton</a></span>
 * <span class="box-simple-button"><a href="">SimpleButton</a></span>
 * <span class="box-simple-button"><a href="" class="date"> </a></span>
 *
 **/
var SimpleButton = Class.createSprite('span');
SimpleButton.prototype = {
	__class__:	'simplebutton',
	className:	'wobject button simple-button noselect',
	_enabled: 	true,
	value:		null,
	legend:		'',
/**
 * new SimpleButton(options)
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance du bouton.
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
		
		var options = {
			className: '',
			text: 	'',
			icon:	'',
			enable:	true,
			nofill:	false,
			type:	'normal',
			legend:	''
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.addClassName('notext');
		
		this.SpanText = 	new Node('span', {className:'font wrap-text simple-button-text'});
		
		this.Tag =			new Node('div', {className:'wrap-tag tag-button'});
		this.Tag.hide();
		
		this.Icon = 		new Node('span', {className:'wrap-icon simple-button-icon'});

		this.appendChild(this.Icon);
		this.appendChild(this.SpanText);
		this.appendChild(this.Tag);
		
	
		if(options.className != '') 	this.addClassName(options.className);
		if(options.text != '') 			this.setText(options.text);
		if(options.icon != '') 			this.setIcon(options.icon);
		if(!options.enable)     		this.Enable(options.enable);
		if(options.nofill)    			this.noFill(options.nofill);
		
		switch(options.type){
			default:break;
			case 'submit':
				this.Submit();
				break;
			case 'normal':break;
			case 'large':
				this.Large();
				break;
			case 'mini':
				this.Mini();
				break;
		}
		
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.Tag.stopObserving();
		
		this.Icon =		null;
		this.SpanText =	null;
		this.Tag =		null;
	},
/**
 * SimpleButton.clear() ->  SimpleButton
 *
 * Vide le boutton.
 **/
	clear:function(){
		this.SpanText.innerHTML = 	'';
		this.Icon.className =   	'wrap-icon simple-button-icon';
		this.setIcon('');
		return this;
	},
/**
 * SimpleButton.noFill(bool) -> SimpleButton
 * - bool (Boolean): `true` les bordures et fond seront supprimés.
 *
 * Supprime le fond et les bordures de l'instance.
 **/
	noFill: function(bool){
		this.removeClassName('no-fill');
		
		if(bool){
			this.addClassName('no-fill');	
		}
		
		return this;
	},
/**
 * SimpleButton.Mini() -> SimpleButton
 *
 * Cette méthode change le bouton en mini bouton.
 **/
 	Mini: function(){
		this.Normal();
		this.addClassName('mini');
	},
/**
 * SimpleButton.Large() -> SimpleButton
 *
 * Cette méthode change le bouton en un bouton large acceptant les icônes de 32x32.
 **/
 	Large: function(){
		this.Normal();
		this.addClassName('large');
	},
/**
 * SimpleButton.Normal() -> SimpleButton
 *
 * Cette méthode rétablie le style du bouton.
 **/
 	Normal: function(){
		this.removeClassName('mini');
		this.removeClassName('large');
		this.removeClassName('submit');
		this.removeClassName('reset');
	},
/**
 * SimpleButton.Submit() -> SimpleButton
 *
 * Cette méthode change le type de bouton en type Submit.
 **/
 	Submit: function(){
		this.removeClassName('submit');
		this.removeClassName('reset');
		this.addClassName('submit');
	},
	//ignore
	remove:function(){
		this.clear();
	},
/**
 * SimpleButton.Enable(bool) -> SimpleButton
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
 * SimpleButton.Legend([txt]) -> String
 * - txt (String): Légende à afficher au survol du boutton lorsque ce dernier est contenu dans une instance WidgetButtons.
 *
 * Assigne et retourne une légende.
 **/
	Legend: function(txt){
		if(!Object.isUndefined(txt)){
			this.legend = txt;
		}
		return this.legend;
	},
/**
 * SimpleButton.Selected(bool) -> SimpleButton
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
/**
 * SimpleButton.select() -> SimpleButton
 *
 * Le bouton apparaitra selectionné. 
 **/
	select: function(){
		this.Selected(true);
		return this;
	},
/**
 * SimpleButton.unselect() -> SimpleButton
 *
 * Le bouton apparaitra non selectionné. 
 **/
	unselect: function(){
		this.Selected(false);
		return this;
	},
/**
 * SimpleButton.observe(eventName, callback) -> SimpleButton
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 **/
 
/**
 * SimpleButton.stopObserving(eventName, callback) -> void
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
 
	observe: function(arg1, arg2, bool){
				
		Event.observe(this, arg1, function(evt){
			if(arg1 == 'click' || arg1 == 'mousedown' || arg1 == 'mouseup'){
				if(!this._enabled){
					return;
				}
			}
			arg2.call(this, evt);
			if(Object.isUndefined(bool)) Event.stop(evt);
		});
				
		return this;
	},
/**
 * SimpleButton.setIcon(icon) -> SimpleButton
 * - icon (String): Nom de l'icone. 
 *
 * Cette méthode ajoute un nom d'icone qui apparaitra dans le bouton.
 *
 **/
	setIcon: function(icon){
		if(this.SpanText.innerHTML == '') this.SpanText.innerHTML = '&nbsp;';
		
		//réinitialisation des styles
		this.Icon.className = 	'wrap-icon simple-button-icon';
		this.removeClassName('icon icon-button');
		
		if(icon != ''){
			this.Icon.addClassName('icon-' + icon);
			this.addClassName('icon icon-button');
		}
		
		return this;
	},
/**
 * SimpleButton.getIcon() -> String
 *
 * Retourne le nom de l'icone affichée.
 *
 **/
	getIcon: function(icon){
		return this.Icon.className.replace('wrap-icon simple-button-icon', '').replace('icon-', '');
	},
/**
 * SimpleButton.setTag(txt) -> SimpleButton
 * - txt (Number | String): Texte à afficher.
 *
 * Cette méthode affiche un tag à droite du bouton.
 **/
 	setTag: function(txt){
		if(txt){
			this.Tag.show();
			this.Tag.innerHTML = txt;
		}else{
			this.Tag.hide();	
		}
		return this;
	},
/**
 * SimpleButton.setText(txt) -> SimpleButton
 * - txt (String): Texte à afficher.
 *
 * Cette méthode assigne un texte au bouton.
 **/
	setText:function(txt){
		
		//this.SpanText.className = '';
		this.removeClassName('notext');
		
		
		if(txt == '' || Object.isUndefined(txt) || txt == null){
			this.addClassName('notext');
			this.SpanText.innerHTML = '&nbsp;';
		}else{
			this.SpanText.innerHTML = txt;
		}
		
		this.fire('change:text');
		
		return this;
	},
/**
 * SimpleButton.getText(txt) -> String
 *
 * Cette méthode retourne le texte du bouton.
 **/
	getText:function(){
		return this.SpanText.innerHTML;
	},
/**
 * SimpleButton.Text([text]) -> String
 * - text(String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var btn = new SimpleButton();
 *     btn.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var btn = new SimpleButton({text:'mon text'});
 *     alert(btn.Text()); //mon text
 * 
 **/
	Text: function(text){
		if(!Object.isUndefined(text)){
			this.setText(text);
		}
		return this.getText();
	},
/**
 * SimpleButton.Value([value]) -> String
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
 *     var c = new SimpleButton();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new SimpleButton();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		if(!Object.isUndefined(value)){
			this.value = value;
		}
		
		return this.value;
	}
};
/**
 * SimpleButton.Transform(node) -> SimpleButton
 * SimpleButton.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance SimpleButton.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[SimpleButton]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance SimpleButton en Javascript.</p>
 *
 *     var btn = SimpleButton({title:'SimpleButton', icon:'date'});
 *     document.body.appendChild(btn);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance HeadPiece en HTML.</p>
 *
 *     <span class="box-simple-button"><a href="" class="date">SimpleButton</a></span>
 *     <span class="box-simple-button"><a href="">SimpleButton</a></span>
 *     <span class="box-simple-button"><a href="" class="date"></a></span>
 * 
 * </div>
 * </div>
 *  
 * #### Résultat
 * 
 * <span class="box-simple-button"><a href="" class="date">SimpleButton</a></span>
 * <span class="box-simple-button"><a href="">SimpleButton</a></span>
 * <span class="box-simple-button"><a href="" class="date"> </a></span>
 *
 **/
SimpleButton.Transform = function(e){
	
	if(Object.isElement(e)){
		
		
		var sub =		e.childElements()[0];
		var btn = 		new SimpleButton({icon:sub.data('icon') ? sub.data('icon') : sub.className.replace('icon-', '')});
		var text=		'';
		
		switch(sub.tagName.toLowerCase()){
			default:
				text =			sub.innerHTML;
				btn.element = 	sub;
				
				btn.appendChild(btn.element);
				btn.element.hide();
				
				btn.on('click', function(){
					this.element.click();
				});
				break;
			case 'a':
				text = 			sub.innerHTML;
				btn.link =		sub.href;
				btn.target = 	sub.target;
				
				btn.on('click', function(){
					$WR.evalLink(this.link, this.target);
				});
				break;
			case 'input':
				text =			sub.value;
				btn.input = 	sub;
				
				btn.appendChild(btn.input);
				btn.input.hide();
				
				btn.on('click', function(evt){
					var parentNode = btn;
					
					while(parentNode.tagName.toLowerCase() != 'form' && parentNode) {
						parentNode = parentNode.parentNode;
					}
					
					if(parentNode){
						parentNode.submit();
					}
				});
				break;
		}
		
		btn.setText(text == '' || text == ' ' ? '' : text);
		btn.title = 	e.title;
		
		btn.addClassName(e.className);
		btn.removeClassName('box-simple-button');
				
		e.replaceBy(btn);
		
		return btn;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(SimpleButton.Transform(e));
	});
	return options;
};
/** section: Button
 * class GroupButton < Element
 * Cette classe permet de regrouper une collection d'instance [[SimpleButton]] afin d'en modifier le style.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une collection de SimpleButton dans une instance GroupButton en Javascript :</p>
 *
 *     var group = GroupButton({selectable:true});
 *     group.appendChild(new SimpleButton({title:'SimpleButton', icon:'date'}));
 *     group.appendChild(new SimpleButton({title:'SimpleButton', icon:'date'}));
 *     group.appendChild(new SimpleButton({title:'SimpleButton', icon:'date'}));
 *     document.body.appendChild(group);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance SimpleButton en HTML :</p>
 * 
 *     <span class="box-group-button selectable">
 *     <span class="box-simple-button"><a href="" class="date">Button</a></span>
 *     <span class="box-simple-button"><a href="" class="date"> </a></span>
 *     <span class="box-simple-button"><a href="" class="date"> </a></span>
 *     </span>
 *
 * </div>
 * </div>
 *
 * #### Résultat
 *
 * <span class="box-group-button selectable">
 * <span class="box-simple-button"><a href="" class="date">Button</a></span>
 * <span class="box-simple-button"><a href="" class="date"> </a></span>
 * <span class="box-simple-button"><a href="" class="date"> </a></span>
 * </span>
 *
 **/
var GroupButton = Class.createSprite('span');
GroupButton.prototype = {
	className:	'wobject group-button',
	selectable:	false,
/**
 * new GroupButton(options)
 * Créée une nouvelle instance [[GroupButton]].
 **/
	initialize:function(options){
		
		if(Object.isUndefined(options)){
			for(var key in options){
				if(!Object.isFunction(options[key])){
					this[key] = options[key];	
				}
			}
		}
		
		var self = this;
		
		this.binding = function(evt){this.Selected(true)};
		
		this.appendChild_back = this.appendChild;
		
		this.appendChild = function(node){
			this.appendChild_back(node);
			var child = this.select('.simple-button');
			
			child.invoke('removeClassName', 'lastchild').invoke('removeClassName', 'firstchild');
			if(child.length){
				child[0].addClassName('firstchild');
				child[child.length-1].addClassName('lastchild');
			}
			
			if(self.Selectable()){
				if(node.hasClassName('button')){
					if(!Object.isFunction(node.Selected_)){
						node.on('click', this.binding);
						node.Selected_ = node.Selected;
						
						node.Selected = function(bool){
							this.parentNode.blur();
							return this.Selected_(bool);
						};
					}
				}
			}
			
			return this;
		};
		
		this.Selectable(this.selectable);
	},
/**
 * GroupButton.Selectable(bool) -> Boolean
 *
 * Cette méthode change le comportement de la classe. Les boutons pourront être selectionnable si `bool` est vrai.
 **/	
	Selectable: function(bool){
		if(Object.isUndefined(bool)) {
			return this.hasClassName("selectable");
		}
		
		this.removeClassName('selectable');
		
		this.select('.simple-button').each(function(e){
			
			if(Object.isUndefined(this.binding)){
				e.stopObserving('click', this.binding);
				e.Selected(false);
			}
			
			if(Object.isFunction(e.Selected_)){
				e.Selected = e.Selected_;
				e.Selected_ = null;
			}
		}.bind(this));
		
		if(bool){
			this.addClassName('selectable');
			this.select('.simple-button').each(function(e){
				e.on('click', this.binding);
				e.Selected(false);
				
				if(!Object.isFunction(e.Selected_)){
					e.Selected_ = e.Selected;
					
					e.Selected = function(bool){
						this.parentNode.blur();
						return this.Selected_(bool);
					};
				}
			}.bind(this));
		}
		
		return bool;
	},
/**
 * GroupButton.blur() -> GroupButton
 **/	
	blur: function(){
		this.select('.selected').invoke('removeClassName', 'selected');
		return this;
	}
};
/**
 * GroupButton.Transform(node) -> GroupButton
 * GroupButton.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance SimpleButton.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[SimpleButton]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une collection de SimpleButton dans une instance GroupButton en Javascript :</p>
 *
 *     var group = GroupButton({selectable:true});
 *     group.appendChild(new SimpleButton({title:'SimpleButton', icon:'date'}));
 *     group.appendChild(new SimpleButton({title:'SimpleButton', icon:'date'}));
 *     group.appendChild(new SimpleButton({title:'SimpleButton', icon:'date'}));
 *     document.body.appendChild(group);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance SimpleButton en HTML :</p>
 * 
 *     <span class="box-group-button selectable">
 *     <span class="box-simple-button"><a href="" class="date">Button</a></span>
 *     <span class="box-simple-button"><a href="" class="date"> </a></span>
 *     <span class="box-simple-button"><a href="" class="date"> </a></span>
 *     </span>
 *
 * </div>
 * </div>
 *
 * #### Résultat
 *
 * <span class="box-group-button selectable">
 * <span class="box-simple-button"><a href="" class="date">Button</a></span>
 * <span class="box-simple-button"><a href="" class="date"> </a></span>
 * <span class="box-simple-button"><a href="" class="date"> </a></span>
 * </span>
 *
 **/
GroupButton.Transform = function(e){
	if(Object.isElement(e)){
		var selectable = e.className.match(/selectable/);
		Object.extend(e, GroupButton.prototype);
		e.initialize({selectable:selectable});
		return e;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(GroupButton.Transform(e));
	});
	return options;
};