/** section: Button
 * class ToggleButton < Element
 * Cette classe créée un bouton à deux issues.
 * 
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance ToggleButon en Javascript : </p>
 * 
 *     var btn = ToggleButton();
 *     document.body.appendChild(btn);
 * 
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance ToggleButon en HTML : </p>
 * 
 *     <select class="box-toggle-button">
 *     <option value="0">Non</option>
 *     <option value="1">Oui</option>
 *     </select>
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <select class="box-toggle-button"><option value="0">Non</option><option value="1">Oui</option></select>
 **/
var ToggleButton = Class.createSprite('span');
ToggleButton.prototype = {
	__class__:	'togglebutton',
	className:	'wobject toggle-button noselect',
	value:		false,
	backup:		false,
/**
 * new ToggleButton(options)
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance [[ToggleButton]].
 * 
 * #### Attributs du paramètre options
 *
 * * `yes` : Texte à afficher sur le OUI.
 * * `no` : Texte à afficher sur le Non.
 *
 **/
	initialize:function(obj){
		
		var options = {
			className: '',
			yes: 	$MUI('Oui'),
			no:		$MUI('Non'),
			type:	'normal'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		//
		// Yes
		//
		this.Yes = 		new Node('span', {className:'yes-part'}, options.yes);
		//
		// No
		//
		this.No = 		new Node('span', {className:'no-part'}, options.no);
		//
		// Cursor
		//
		this.Cursor = 	new Node('div', {className:'cursor'});
		//
		//
		//
		this.appendChild(this.Yes);
		this.appendChild(this.No);
		this.appendChild(this.Cursor);
		
		this.Yes.on('click', function(){
			this.Value(false);
			this.fire('toggle:change', this);
		}.bind(this));
		
		this.No.on('click', function(){
			this.Value(true);
			this.fire('toggle:change', this);
		}.bind(this));
		
		this.Cursor.on('mousedown', this.onMouseDown.bind(this));
		this.Cursor.on('click', this.onClick);
		
		if(options.type == 'mini'){
			this.Mini();	
		}
		
	},
	
	onClick: function(evt){
		evt.stop();
		
		if(this.options && Object.isFunction(this.options.onMove)){	
			document.stopObserving('mousemove', this.options.onMove);
			document.stopObserving('mouseup', this.options.onUp);
			this.options.onMove = null;
		}
	},
	
	onMouseDown: function(){
		var theX =		this.cumulativeOffset().left + (this.getDimensions().width / 2);
		this.options =	{};
		this.options.value = this.Value();
		
		this.options.onMove = function(evt){
			this.Value(Event.pointerX(evt) > theX);
		}.bind(this);
		
		this.options.onUp = function(evt){
			
			document.stopObserving('mousemove', this.options.onMove);
			document.stopObserving('mouseup', this.options.onUp);
			
			if(this.options.value != this.Value()){
				this.fire('toggle:change', this);
			}
		}.bind(this);
			
		document.observe('mousemove', this.options.onMove);
		document.observe('mouseup', this.options.onUp);	
		
	},
/**
 * ToggleButton#observe(eventName, callback) -> ToggleButton
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 **/
	observe: function(eventName, callback){
		switch(eventName){
			case 'change':
				Event.observe(this, 'toggle:change', callback);
				break;
			default:
				Event.observe(this, eventName, callback);
				break;	
		}
		return this;
	},
/**
 * ToggleButton#stopObserving(eventName, callback) -> ToggleButton
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'change':
				Event.stopObserving(this, 'toggle:change', callback);
				break;
			default:
				Event.stopObserving(this, eventName, callback);
				break;	
		}
		return this;
	},	
/**
 * ToggleButton#Value([bool]) -> String
 * - bool(Boolean): valeur à assigner
 *
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var btn = new ToggleButton();
 *     btn.Value(true);
 *
 * Récupération d'une valeur :
 * 
 *     var btn = new ToggleButton();
 *     alert(btn.Value(true)); //true
 * 
 **/
	Value: function(bool){
		if(Object.isUndefined(bool)) return this.value;
		
		this.value = this.backup = bool;
		this.removeClassName('toggle-yes');
		
		if(bool) this.addClassName('toggle-yes');
		
		return this.value;
	},
/**
 * ToggleButton.Normal() -> SimpleButton
 *
 * Cette méthode rétablie le style du bouton.
 **/
 	Normal: function(){
		this.removeClassName('mini');
	},
/**
 * ToggleButton.Mini() -> SimpleButton
 *
 * Cette méthode change le bouton en mini bouton.
 **/
 	Mini: function(){
		this.addClassName('mini');
	}
};
/**
 * ToggleButton.Transform(node) -> ToggleButton
 * ToggleButton.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance ToggleButton.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[ToggleButton]].
 *
 * #### Exemple
 * 
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance ToggleButon en Javascript : </p>
 * 
 *     var btn = ToggleButton();
 *     document.body.appendChild(btn);
 * 
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance ToggleButon en HTML : </p>
 * 
 *     <select class="box-toggle-button">
 *     <option value="0">Non</option>
 *     <option value="1">Oui</option>
 *     </select>
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <select class="box-toggle-button"><option value="0">Non</option><option value="1">Oui</option></select>
 *
 **/
ToggleButton.Transform = function(e){
	
	if(Object.isElement(e)){
		
		if(e.tagName == 'SELECT'){
			var btn = 		new  ToggleButton({yes:e.options[1].innerHTML, no:e.options[0].innerHTML});
			btn.Value(e.value == e.options[1].value);
		}else{
			var btn = 		new  ToggleButton();
			btn.Value(e.className.match(/yes/));
		}
		
		btn.title = 	e.title;
		btn.addClassName(e.className);
		btn.removeClassName('box-toggle-button');
		
		e.replaceBy(btn);
		
		if(e.tagName == 'SELECT'){
			btn.appendChild(e);
			e.hide();
			e.removeClassName('box-toggle-button');
			
			btn.on('change', function(){
				if(this.Value()){
					e.selectedIndex = 1;
				}else{
					e.selectedIndex = 0;
				}
			});
			
			e.getInstance = function(){
				return btn;
			}
		}
						
		return btn;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(ToggleButton.Transform(e));
	});
	
	return options;
};
