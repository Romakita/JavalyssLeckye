/** section: Form
 * class InputPopup < InputButton
 *
 * Cette classe permet de créer des champs de saisie avec un popup apparaissant lorsque le champ à le focus. 
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputPopup en Javascript :</p>
 *
 *     var input = InputPopup({value:'', icon:'date'});
 *     input.appendChild(new Node('div', 'Hello world'));
 *     document.body.appendChild(input);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputPopup en HTML :</p>
 *
 *     <input class="box-input-popup icon-date target-mypopup" type="text" />
 *     <div class="mypopup">Hello world</div>
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <input class="box-input-popup icon-date target-mypopup" type="text" />
 * <div class="mypopup">Hello world</div>
 *
 **/ 
var InputPopup = Class.from(InputButton);
InputPopup.prototype = {
	__class__: 	'inputpopup',
	className:	'wobject input input-button input-popup',
/**
 * InputPopup#Popup -> Popup
 **/	
	Popup: 		null,
/**
 * InputPopup#Observer -> Observer
 **/	
	Observer:	null,
	eventDom:	false,
/**
 * new InputPopup([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance d'[[InputPopup]].
 *
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `sync` (`Boolean`): Si la valeur est vrai les méthodes InputPopup#Text et InputPopup#Value.
 * * `name` (`String`): Nom du champ.
 * * `maxLength` (`Number`): Nombre maximal de caractère saisissable par l'utilisateur.
 * * `type` (`String`): `password` ou `text`.
 * * `value` (`Mixed`): Valeur à affecter au champs.
 * * `icon` (`String`): Icône à afficher pour le bouton.
 * * `placeholder` (`String`): Texte à afficher lorsque le champ de saisie est vide.
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 *
 **/
	initialize:function(obj){
		//
		// Popup
		//
		this.Popup =		new Popup({scroll:true});
		this.Popup.hide();
		this.hidden_ = true;
		//
		// Observer
		//
		this.Observer = 	new Observer();
		this.Observer.bind(this);
		
		this.appendChild(this.Popup);
		this.Input.autocomplete = "off";
		
		//#event
		this.SimpleButton.on('click', this.toggle.bind(this), true);
		this.Input.on('click', this.toggle.bind(this));
		
		if(!Object.isUndefined(obj)){
			if(obj.size == 'large'){
				this.Large(true);
			}
		}
		
		this.Input.keyupcode(9, function(){
			this.Hidden(false);
		}.bind(this));
		
		this.Input.keydowncode(9, function(){
			this.Hidden(true);
		}.bind(this));
		
		if(document.navigator.mobile) { 
			this.Input.on('focus', this.toggle.bind(this));
			
			this.Popup.body.observe('mouseup', function(event){
				Event.stop(event);
							
				return false;
			}.bind(this));
			
		}else{
			
			this.Popup.observe('mouseup', function(event){
				Event.stop(event);
				
				this.Popup.ScrollBar.Vertical.Cursor.dragOptions.onMouseUp(event);
				
				return false;
			}.bind(this));	
		}
	},
	
	destroy: function(){
		
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
				
		this.Observer.destroy();
				
		this.Observer =		null;
		this.Popup =		null;
		this.Input =		null;
		this.value = 		null;
		this.SimpleButton = null;
				
		try{this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});}catch(er){}
	},
/**
 * InputPopup#positionTo(type) -> void
 * Cette méthode permet de spécifier la façon dont le popup doit se positionner par rapport à l'élement. 
 * Par défaut le popup se positionne par rapport à la bordure gauche de l'élement.
 **/
 	positionTo:function(type){
		this.Popup.position = type == 'left' ? 'left' : 'right';
	},
/*
 * InputPopup#toggle(evt) -> void
 **/
	toggle: function(event){
		Event.stop(event);
		this.Hidden(!this.hidden_);
		return false;
	},
/**
 * InputPopup#Hidden(bool) -> Boolean
 * - bool (Boolean): Si la valeur est vrai la liste disparaitra.
 *
 * Affiche ou cache en fonction de `bool` la liste.
 **/
	Hidden: function(bool){
		if(!Object.isUndefined(bool)){
			if(bool){
				
				if(this.hidden_){
				//	return;	
				}
				
				if(document.navigator.mobile) { 
					if(Object.isElement(this.Popup.parentNode)){
						this.Popup.parentNode.removeChild(this.Popup);
					}
				}
				
				this.Popup.hide();
				this.hidden_ = true;
				
				if(Object.isFunction(this.onClickBind)){		
					document.stopObserving('mouseup', this.onClickBind);
					this.onClickBind = null;
				}
				
				this.Observer.fire('hide');
				
			}else{
				
				if(!this.hidden_){
					return;	
				}
				
				if(document.navigator.mobile) { 
					document.body.appendChild(this.Popup);
				}	
				this.Popup.show();
				this.Popup.moveTo(this);
				this.hidden_ = false;
				
				this.Observer.fire('show');
				
				this.onClickBind = function(evt){								
					this.Hidden(true);
				}.bind(this);
				
				document.observe('mouseup', this.onClickBind);
			}
		}
		return this.hidden_;
	},
/**
 * InputPopup#hide() -> Select
 *
 * Cette méthode cache le popup.
 **/
	hide: function(){this.Hidden(true);return this;},
/**
 * InputPopup#show() -> Select
 *
 * Cette méthode affiche le popup.
 **/
	show: function(){this.Hidden(false); return this;}
};

/**
 * InputPopup.Transform(node) -> InputPopup
 * InputPopup.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputPopup.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[InputButton]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>HTML 5</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputPopup en Javascript :</p>
 *
 *     var input = InputPopup({value:'', icon:'date'});
 *     input.appendChild(new Node('div', 'Hello world'));
 *     document.body.appendChild(input);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputPopup en HTML :</p>
 *
 *     <input class="box-input-popup icon-date target-mypopup" type="text" />
 *     <div class="mypopup">Hello world</div>
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputPopup en HTML 5 :</p>
 *
 *     <input class="box-input-popup" data-icon="date" data-content="mypopup" type="text" />
 *     <div class="mypopup">Hello world</div>
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <input class="box-input-popup icon-date target-mypopup" type="text" />
 * <div class="mypopup">Hello world</div>
 *
 **/
InputPopup.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var icon = 	e.data('icon') ? e.data('icon') : e.className.slice(e.className.indexOf('icon-'), e.className.length).split(' ')[0].replace('icon-', '');		
		var input = new InputPopup({
			name:		e.name,
			value:		e.value,
			icon:		icon ? icon : ''
		});
		
		if(e.data('content')){
			$$('.' + e.data('content')).each(function(e){
				input.Popup.appendChild(e);
			});
		}else{
			input.Popup.appendChild($$('.' + e.className.slice(e.className.indexOf('target-'), e.className.length).split(' ')[0].replace('target-', ''))[0]);
		}
		
		if(e.maxLength > 0){
			input.maxLength = 	e.maxLength;
		}
		
		if(e.placeholder){
			input.Input.placeholder = e.placeholder;	
		}
		
		input.id = e.id;
				
		input.addClassName(e.className);
		input.removeClassName('box-input-popup');
				
		e.replaceBy(input);
		
		return input;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputPopup.Transform(e));
	});
	
	return options;
};