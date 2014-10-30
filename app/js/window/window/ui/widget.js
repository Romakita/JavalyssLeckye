/** section: UI
 * class Widget < Element
 *
 * Cette classe permet la création de widget. Le widget est un conteneur simple de contenu divers.
 **/
var Widget = Class.createSprite('div');
Widget.prototype = {
	__class__: 	'widget',
	className:	'wobject border widget',
/*
 * Widget#header -> Element
 **/
 	header: 	null,
/*
 * Widget#body -> Element
 **/
 	body:		null,
	icon:		'',
/**
 * new Widget()
 *
 * Cette méthode créée une nouvelle instance de widget.
 **/
	initialize: function(){
				
		this.wrapHeader = 	new Node('div', {className:'wrap-h'});
		this.divClear =		new Node('div', {style:'clear:both'});
		//
		// Header
		//
		this.header = 		new Node('div', {className:'wrap-header gradient'});
		//
		// Title
		//
		this.htitle =		new Node('div', {className:'wrap-title font noselect'});
		//
		// body
		//
		this.body = 	new Node('div', {className:'wrap-body'});
		//
		// body
		//
		this.footer = 	new Node('div', {className:'wrap-footer'});
			
		this.wrapHeader.appendChild(this.htitle);
		this.wrapHeader.appendChild(this.divClear);
		this.header.appendChild(this.wrapHeader);
		this.appendChild(this.header);
		this.appendChild(this.body);
		this.appendChild(this.footer);
		
		this.appendChild_ = this.appendChild;
		this.appendChild = function(e){
			this.body.appendChild(e);
			return this;	
		};
		
		this.removeChild = function(e){
			this.body.removeChild(e);
			return this;	
		};
		
		this.Chrome(true);	
	},
/**
 * Widget#Chrome(bool) -> Widget
 * Cette méthode change le rendu CSS de l'élément.
 **/
	Chrome:function(bool){
		
		this.removeClassName('chrome');
		
		if(bool){
			this.addClassName('chrome');	
		}
		
		return this;
	},
/**
 * Widget#Header() -> Element
 * 
 * Cette méthode retourne l'élément d'entete du widget.
 **/	
	Header: function(e){
		
		if(Object.isElement(e)){
			this.wrapHeader.appendChild(e);
			this.wrapHeader.appendChild(this.divClear);
		}
		
		return this.header;
	},
/**
 * Widget#addGroupButton() -> Element
 * 
 * Cette méthode ajoute un groupement de bouton dans l'entete.
 **/	
	addGroupButton: function(childs){
		var group = new GroupButton();
		
		if(Object.isElement(childs)) group.appendChild(childs);
		else{
			group.appendChilds(childs);
		}
		
		this.wrapHeader.appendChild(group);
		this.wrapHeader.appendChild(this.divClear);
		return group;
	},
/**
 * Widget#Body() -> Element
 * 
 * Cette méthode retourne l'élément principal du widget.
 **/	
	Body: function(){
		return this.body;
	},
/**
 * Widget#BorderRadius(bool) -> Boolean
 * 
 * Cette méthode supprime le style arrondi du widget.
 **/
 	BorderRadius: function(bool){
		this.removeClassName('no-radius');
		if(!bool){
			this.addClassName('no-radius');
		}
		return bool;
	},
/**
 * Widget#BorderRadiusLeft(bool) -> Boolean
 * 
 * Cette méthode supprime le style arrondi du widget.
 **/
 	BorderRadiusLeft: function(bool){
		this.removeClassName('no-radius-left');
		if(!bool){
			this.addClassName('no-radius-left');
		}
		return bool;
	},
/**
 * Widget#BorderRadiusRight(bool) -> Boolean
 * 
 * Cette méthode supprime le style arrondi du widget.
 **/
 	BorderRadiusRight: function(bool){
		this.removeClassName('no-radius-right');
		if(!bool){
			this.addClassName('no-radius-right');
		}
		return bool;
	},
/**
 * Widget#Footer() -> Element
 * 
 * Cette méthode retourne l'élément pied de page du widget.
 **/	
	Footer: function(){
		return this.footer;
	},
/**
 * Widget#Title([title]) -> String
 * - title (String): Titre à assigner à l'instance.
 *
 * Assigne ou/et retourne le titre de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new Widget();
 *     c.Title('mon titre');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new Widget();
 *     c.Title('mon titre');
 *     alert(c.Title()); //mon titre
 * 
 **/
	Title: function(txt){
		if(!Object.isUndefined(txt)){
			this.removeClassName('title');			
			this.setTitle(txt);	
		}
		return this.getTitle();
	},
/**
 * Widget#createScrollBar() -> ScrollBar
 *
 * Cette méthode créée une [[ScrollBar]] permettant le déplacement du contenu du [[Widget]].
 **/
 	createScrollBar: function(){
		//
		// wrapper
		//
		this.wrapper = 	new Node('div', {className:'wrapper'});
		
		var childs = this.body.childElements();
		
		if(childs.length){
			this.wrapper.appendChilds(childs);
		}
		
		this.body.appendChild(this.wrapper);
				
		this.ScrollBar = new ScrollBar({node:this.body, wrapper:this.wrapper, type:'vertical', useTransform:false});
		
		this.body.appendChild = function(e){
			this.wrapper.appendChild(e);
			return this;
		}.bind(this);
		
		this.body.removeChild = function(e){
			this.wrapper.removeChild(e);
			return this;
		}.bind(this);
				
		return this.ScrollBar;
	},
/*
 * Widget#cssTitle(css) -> void
 **/	
	cssTitle: function(obj){
		return this.htitle.setStyle(obj);
	},
/**
 * Widget#setTitle(t) -> Widget
 *
 * Cette méthode assigne un titre au widget.
 **/
	setTitle: function(t){
		this.htitle.show();
		this.htitle.innerHTML = t;
		
		if(t != ''){
			this.addClassName('title');
		}
		
		return this;
	},
/**
 * Widget#getTitle(t) -> String
 *
 * Cette méthode retourne le titre du widget.
 **/
	getTitle: function(){
		return this.htitle.innerHTML;
	},
/**
 * Widget#setIcon(t) -> Widget
 *
 * Cette méthode change l'icône afficher en entête du [[Widget]].
 **/
	setIcon: function(icon){
		
		this.htitle.removeClassName('icon-'+this.icon);
		this.removeClassName('icon');
		
		if(icon){
			this.addClassName('icon');
			this.htitle.addClassName('icon-' + icon);
		}
		
		this.icon = icon;
		
		return this;
	},
/**
 * Widget#getIcon() -> String
 *
 * Cette méthode retourne le nom de l'icône.
 **/
	getIcon: function(){
		return this.icon;
	}
};
/** section: UI
 * class WidgetContainer < Element
 *
 * Cette classe sert de conteneur pour l'ensemble des widgets et assure la mise en forme de ces derniers.
 **/
var WidgetContainer = Class.createSprite('div');

WidgetContainer.prototype = {
	__class__: 	'widget-container',
	className:	'wobject widget-container',
	number:		2,
	Container1:	null,
	Container2:	null,
	Container3:	null,
	Container4:	null,
/**
 * new WidgetContainer()
 *
 * Cette méthode créée une nouvelle instance de [[WidgetContainer]].
 **/
	initialize: function(obj){
		
		var options = {
			number:		2,
			dragdrop:	false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this[0] = this.Container1 = new Node('div', {className:'widgets-box col-1'});
		this[1] = this.Container2 = new Node('div', {className:'widgets-box col-2'});
		this[2] = this.Container3 = new Node('div', {className:'widgets-box col-3'});
		this[3] = this.Container4 = new Node('div', {className:'widgets-box col-4'});
		
		this.appendChilds([
			this.DashBoard = new Node('div', {className:'widgets-dashboard'}, [
				this.Container1,
				this.Container2,
				this.Container3,
				this.Container4,
				new Node('div', {style:'clear:both'})
			]),
			new Node('div', {style:'clear:both'})
		]);
		
		this.appendChild_ = this.appendChild;
		this.appendChild = this.addWidget;
		
		this.setNumber(options.number);
		
		for(var i = 0; i < 4; i++){
			this[i].Maximize = function(bool){
				this.removeClassName('maximize');
				
				if(bool){
					this.addClassName('maximize');	
				}
				
				if(this.Widgets){
					this.Widgets.Compact(bool);
				}
				
				return this;
			};
		}
		
	},
/*
 * WidgetContainer#addWidget() -> WidgetContainer
 *
 **/	
	addWidget: function(node){
		
		var length = this.select('.widget').length;
		this['Container' + ((length % this.number) + 1)].appendChild(node);
	},
/**
 * WidgetContainer#Compact(bool) -> WidgetContainer
 *
 * Cette méthode supprime les marges entres les colonnes.
 **/
	Compact:function(bool){
		
		this.removeClassName('compact');
		
		if(bool){
			this.addClassName('compact');	
		}
		
		return this;
	},
/**
 * WidgetContainer#Maximize(bool) -> WidgetContainer
 *
 * Cette méthode applique une hauteur 100% au conteneur.
 **/
	Maximize:function(bool){
		
		this.removeClassName('maximize');
		
		if(bool){
			this.addClassName('maximize');	
		}
		
		return this;
	},
/** alias of: WidgetContainer#setNumber
 * WidgetContainer#setCols(num) -> WidgetContainer
 *
 * Cette méthode change le nombre de colonne affichée par l'instance. 
 **/	
	setCols: function(num){
		return this.setNumber(num);
	},
/**
 * WidgetContainer#setNumber(num) -> WidgetContainer
 *
 * Cette méthode change le nombre de colonne affichée par l'instance. 
 **/	
	setNumber: function(num){
		if(Object.isUndefined(num)) return this;
		
		this.removeClassName('cols-1');
		this.removeClassName('cols-2');
		this.removeClassName('cols-3');
		this.removeClassName('cols-4');
		
		switch(num){
			case 1:
				this.Container2.hide();
				this.Container3.hide();
				this.Container4.hide();
				
				this.number = 1;
				this.addClassName('cols-1');				
				break;
				
			case 2:
				this.Container2.show();
				this.Container3.hide();
				this.Container4.hide();
				
				this.number = 2;
				this.addClassName('cols-2');				
				break;
				
			case 3:
				this.Container2.show();
				this.Container3.show();
				this.Container4.hide();
				
				this.number = 3;
				this.addClassName('cols-3');
				break;
				
			case 4:
				this.Container2.show();
				this.Container3.show();
				this.Container4.show();
				
				this.number = 4;
				this.addClassName('cols-4');
				break;	
		}
		
		var childs = this.select('.widget');
		childs.each(function(e){e.parentNode.removeChild(e);});
		childs.each(function(e){this.appendChild(e);}, this);
	}	
};
/**
 * Widget.Transform(node) -> Select
 * Widget.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Widget.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[Widget]].
 *
 * #### Exemple
 *
 *      //Dans une page HTML
 *      <div class="box-widget">
 *         <div class="header icon-advanced">Mon Widget</div>
 *         <div>
 *         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 *         It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
 *         </div>
 *         <div class="footer"></div>
 *      </div>
 * 
 **/
Widget.Transform = function(e){
	if(Object.isElement(e)){
		
		var widget = 	new Widget();	
		widget.addClassName(e.className.replace('box-widget'));
		
		e.childElements().each(function(node){
			
			if(node.className.match(/header/)){
				node.className = node.className.replace('header', '').trim();
				widget.Header().addClassName(node.className);
				widget.Header().cloneStyle(node);
				widget.setIcon(node.className.replace('icon-', ''));
				widget.Title(node.innerHTML);
				return;
			}
			
			if(node.className.match(/footer/)){
				node.className = node.className.replace('footer', '').trim();
				widget.Footer().addClassName(node.className);
				widget.Footer().cloneStyle(node);
				widget.Footer().innerHTML += node.innerHTML;
				return;
			}
			
			widget.Body().addClassName(node.className);
			widget.Body().cloneStyle(node);
			widget.Body().innerHTML += node.innerHTML;
			
		});
				
		e.replaceBy(widget);		
		return widget;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(Widget.Transform(e));
	});
	
	return options;
};
/** section: UI
 * class WidgetTextArea < Widget
 *
 * Cette classe permet la création de widget avec un champ TextArea.
 **/
var WidgetTextArea  = Class.from(Widget);

WidgetTextArea.prototype = {
	__class__: 	'widget textarea',
	className:	'wobject gradient border widget textarea widget-text-area',
/**
 * new WidgetTextArea()
 *
 * Cette méthode créée une nouvelle instance de [[WidgetTextArea]].
 **/
	initialize: function(obj){
		var options = obj || {};		
		this.TextArea = new Node('textarea', options);
		this.TextArea.addClassName('w-area');
		
		this.appendChild(this.TextArea);
	},
/**
 * WidgetTextArea#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new WidgetTextArea();
 *     c.Text('mon texte');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new WidgetTextArea();
 *     c.Text('mon texte');
 *     alert(c.Text()); //mon texte
 * 
 **/
 	setText: function(txt){
		if(!Object.isUndefined(txt)){
			this.TextArea.innerHTML = txt;
		}
		return this;
	},
	
	getText: function(){
		return this.TextArea.value;
	},
	
	Value:function(txt){
		return this.Text(txt);
	},
	
	Text: function(txt){
		if(!Object.isUndefined(txt)){
			this.TextArea.innerHTML = txt;
		}
		return this.TextArea.value;
	}
};
/** section: Form, deprecated
 * class HeadPieceList < Widget
 * 
 * Cette classe créée un widget contenant des miniatures de photo.
 **/

/** section: Form
 * class WidgetButtons < Widget
 * 
 * Cette classe créée un widget pouvant contenir une collection de Boutton tels que [[AppButton]], [[SimpleButton]], [[HeadPiece]].
 **/
var WidgetButtons =	Class.from(Widget);
var HeadPieceList = WidgetButtons; 
WidgetButtons.prototype = {
	className:'wobject border widget chrome widget-hp',
/**
 * new WidgetButtons([options])
 * - options (Object):  Objet de configuration de l'instance.
 *
 * Cette méthode créée une nouvelle instance du gestionnaire de vignette. 
 **/	
	initialize: function(obj){	
		var options = {
			select: true
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);	
		}
		
		var sender = this;
		//
		// Flag
		//
		this.Flag =		new Flag(FLAG.RIGHT);
		
		this.createScrollBar();
		//
		// Observer
		//
		this.Observer = 	new Observer();
		this.Observer.bind(this);
				
		this.Footer().appendChild(this.Flag);
				
		this.wrapper.appendChild_ = this.wrapper.appendChild;
		this.wrapper.appendChild = function(e){
			var self = this.wrapper;
			this.wrapper.appendChild_(e);
			
			if(Object.isFunction(e.Selected)){
				
				e.on('click', function(evt){
					if(options.select){
						var childs = self.childElements();
						
						for(var i = 0; i < childs.length; i++){
							childs[i].Selected(false);	
						}
						
						e.Selected(true);
					}
					
					sender.Observer.fire('click', evt, this);
				});
			}else{
				e.on('click', function(evt){
					sender.Observer.fire('click', evt, this);
				});
			}
			
			e.on('mouseover', function(evt){
				if(!Object.isFunction(this.Legend)) return;
				if(this.Legend() == '') return;
				sender.Flag.setText(this.Legend()).color('grey').show(this, true);	
			});
			
			this.ScrollBar.refresh();
		}.bind(this);
	},
/**
 * WidgetButtons#setData(array) -> WidgetButtons
 * - array (Array): Tableau de données
 * 
 * Cette méthode ajoute une tableau de données et construit la liste à partir de ce dernier.
 * 
 * Le tableau de données est un tableau tableau d'objet. La structure de l'objet
 * doit comporter au minimum deux attributs nommés comme suivants :
 *
 * * `src` (`String`) : Lien de l'image.
 * * `title` (`String`) : Titre de l'image.
 * * `icon` (`String`) : Lien de l'icône en remplacement de l'image.
 *
 * L'objet peut prendre un attribut supplémentaire nommé `legend` pour activer la fonctionnalité 
 * d'apparition de message au survol de la vignette. `legend` est une description plus complète
 * de l'image.
 *
 **/
	setData:function(array){
		for(var i = 0; i < array.length; ++i){
			var hp = new HeadPiece(array[i]);
			this.appendChild(hp);
			this.Observer.fire('draw', hp);
		}
		return this;
	},
/**
 * WidgetButtons#clear() -> WidgetButtons
 *
 * Cette méthode vide la liste.
 **/
	clear: function(){
		this.wrapper.removeChilds();
		return this;
	},
/**
 * WidgetButtons#observe(eventName, callback) -> WidgetButtons
 * - eventName (String): Nom de l'événement à intercepter.
 * - callback (Function): Fonction associée à l'événement.
 * 
 * Cette méthode ajoute un écouteur `callback` sur le nom de l'événement `eventName`.
 *
 * #### Evenement pris en charge
 *
 * * `click` : L'écouteur sera appellé lors du click sur une vignette.
 * * `draw` : L'écouteur sera appellé lors de la contruction de la liste et prend en paramètre `HeadPiece`.
 * 
 **/	
	observe:function(eventName, callback){
		switch(eventName){
			default:Event.observe(this, eventName, callback);
					break;
			case 'click':
				this.Observer.observe('click', callback);
				break;
			case 'draw':
				this.Observer.observe('draw', callback);
				break;
		}
	},
/**
 * WidgetButtons#stopObserving(eventName, callback) -> WidgetButtons
 * - eventName (String): Nom de l'événement à stopper.
 * - callback (Function): Fonction associée à l'événement.
 * 
 * Stop un écouteur `callback` sur le nom de l'événement `eventName`.
 **/
	stopObserving:function(eventName, callback){
		switch(eventName){
			default:Event.stopObserving(this, eventName, callback);
					break;
			case 'click':
				this.Observer.stopObserving('click', callback);
				break;
			case 'draw':
				this.Observer.stopObserving('draw', callback);
				break;
		}
	},
/**
 * WidgetButtons#getData() -> Array
 * 
 * Cette méthode retourne l'ensemble des données enregistré dans gestionnaire de vignette.
 **/	
	getData: function(){
		var child = this.Body().childElements();
		var array = [];
		
		for(var i = 0; i < child.length; i++){
			array.push(child.Value());	
		}
		
		return array;
	},
/**
 * WidgetButtons#childElements() -> array
 *
 * Retourne la liste des `Element` enfant.
 **/
	childElements: function(){
		return this.Body().childElements();
	}
};
