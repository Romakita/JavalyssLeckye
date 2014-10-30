/** section: Form
 * class Checkbox < Element
 * Cette classe permet de créer des cases à cocher.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance Checkbox Javascript :</p>
 * 
 *     var box = Checkbox({value:'yes'});
 *     document.body.appendChild(box);
 *     var radio = Checkbox({value:'no', type:'radio', name:'myRadio'});
 *     document.body.appendChild(box);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance Checkbox en HTML :</p>
 *  
 *     <input class="box-checkbox" type="checkbox" value="option 1" name="myCheckbox" />
 *     <input class="box-checkbox" type="radio" value="option 1" name="myRadio" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <table>
 * <tr>
 * <th><label>Version checkbox</label></th>
 * <td><input class="box-checkbox" type="checkbox" value="option 1" name="myCheckbox" /></td>
 * </tr>
 * <tr>
 * <th></th>
 * <td><input class="box-checkbox" type="checkbox" value="option 2" name="myCheckbox" /></td>
 * </tr>
 * <tr>
 * <th><label>Version radio</label></th>
 * <td><input class="box-checkbox" type="radio" value="option 1" name="myRadio" /></td>
 * </tr>
 * <tr>
 * <th></th>
 * <td><input class="box-checkbox" type="radio" value="option 2" name="myRadio" /></td>
 * </tr>
 * </table>
 *
 **/
var Checkbox = Class.createSprite('span');
/**
 * Checkbox.BOX -> String
 **/
Checkbox.BOX = 'checkbox';
/**
 * Checkbox.RAD -> String
 **/
Checkbox.RAD = 'radio';

Checkbox.prototype = {
	__class__:	'checkbox',
	className:	'wobject checkbox',
	value: 		null,
	name: 		'',
	checked:	false, 
	type_:		'checkbox',
/**
 * new Checkbox(options)
 * - options(Object): Options de configuration.
 *
 * Créée une nouvelle instance [[Checkbox]].
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `name` (String): Donne un nom à la ligne.
 * * `type` (String): Indique le type de la case `radio` ou `checkbox`.
 * * `checked` (Boolean): Indique si la case sera cochée ou pas.
 *
 **/
	initialize: function(obj){

		var options = {
			name: 		Checkbox.BOX,
			type: 		Checkbox.BOX,
			checked:	false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
				
		this.Checked(options.checked);
		this.Name(options.name);
		this.Type(options.type);
		
		this.on('click', this.onClick);
	},
	
	destroy: function(){
		this.stopObserving('click');
		this.stopObserving('change');
		
		this.destroy = 		null;
		this.className = 	'';
	},
/**
 * Checkbox#observe(eventName, callback) -> Checkbox
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Intervient lorsque l'utilisateur change l'état de l'instance.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, handler){
		switch(eventName){
			case "change":
				this.observe('checkbox:'+eventName, handler);
				break;
			default:
				Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * Checkbox#stopObserving(eventName, callback) -> Checkbox
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback` associer à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Intervient lorsque l'utilisateur change l'état de l'instance.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving: function(eventName, handler){
		switch(eventName){
			case "change":
				this.stopObserving('checkbox:'+eventName, handler);
				break;
			default:
				Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
	/*
	 * event Checkbox.on('click',evt)
	 * - evt (Event): Evénement généré par l'action click.
	 **/
	onClick: function(evt){
		Event.stop(evt);
		
		this.Checked(!this.Checked());
		
		this.fire("checkbox:change");
	},
/**
 * Checkbox#Checked(bool) -> Boolean
 * - bool (Boolean): Change l'etat de la case.
 * 
 * Change ou retourne l'etat de la case. `true` la case est coché, `false` la case n'est pas coché.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Checkbox();
 *     c.Checked(true); //la case sera cochée
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Checkbox();
 *     c.Checked(false);
 *     c(line.Checked()); //false indique la case n'est pas cochée.
 *
 **/
	Checked: function(bool){
		if(Object.isUndefined(bool)) return this.checked;
				
		if(bool){
						
			if(this.Type() == 'radio'){
				$A($$('.checkbox-name-' + this.name)).each(function(c){
					c.removeClassName('checked');
					c.checked = false;
				});
			 }
			 
			 this.addClassName('checked');
			 this.checked = true;
		}else{
			if(this.Type() == 'checkbox'){
				this.removeClassName('checked');
				this.checked = false;
			}
		}
				
		return this.checked;
	},
/**
 * Checkbox#Name(str) -> String
 **/
	Name: function(str){
		if(Object.isUndefined(str)) return this.name;
		
		this.removeClassName('checkbox-name-' + this.name);
		this.addClassName('checkbox-name-' + str);
				
		return this.name = str;
	},	
/**
 * Checkbox#Type(type) -> String
 * - type (String): Type de la case.
 *
 * Change ou retourne le type de case. Soit `radio`, soit `checkbox` par defaut. 
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Checkbox();
 *     c.Type('radio');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Checkbox();
 *     c.Type('radio');
 *     alert(c.Type()); //radio
 *
 **/
	Type: function(type){
		if(type){
			this.removeClassName('type-' + this.type_);
			this.type_ = type;
			this.addClassName('type-' + this.type_);
		}
		
		return this.type_;
	},
/**
 * Checkbox#Value([value]) -> String
 * - value (`String`): Code couleur.
 *
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Checkbox();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Checkbox();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 **/
	Value: function(value){
		if(Object.isUndefined(value)) return this.value;
		return this.value = value;
	}
};
/**
 * Checkbox.Transform(node) -> Checkbox
 * Checkbox.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Checkbox.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[Checkbox]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance Checkbox Javascript :</p>
 * 
 *     var box = Checkbox({value:'yes'});
 *     document.body.appendChild(box);
 *     var radio = Checkbox({value:'no', type:'radio', name:'myRadio'});
 *     document.body.appendChild(box);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance Checkbox en HTML :</p>
 *  
 *     <input class="box-checkbox" type="checkbox" value="option 1" name="myCheckbox" />
 *     <input class="box-checkbox" type="radio" value="option 1" name="myRadio" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <table>
 * <tr>
 * <th><label>Version checkbox</label></th>
 * <td><input class="box-checkbox" type="checkbox" value="option 1" name="myCheckbox" /></td>
 * </tr>
 * <tr>
 * <th></th>
 * <td><input class="box-checkbox" type="checkbox" value="option 2" name="myCheckbox" /></td>
 * </tr>
 * <tr>
 * <th><label>Version radio</label></th>
 * <td><input class="box-checkbox" type="radio" value="option 1" name="myRadio" /></td>
 * </tr>
 * <tr>
 * <th></th>
 * <td><input class="box-checkbox" type="radio" value="option 2" name="myRadio" /></td>
 * </tr>
 * </table>
 *
 **/
Checkbox.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var box = 		new Checkbox({
			name:		e.name,
			checked:	e.checked,
			value:		e.value,
			type:		e.type == 'radio' ? 'radio' : 'checkbox'
		});
				
		box.id = e.id;		
		box.addClassName(e.className);
		box.removeClassName('box-checkbox');
				
		e.replaceBy(box);
		
		box.on('change',function(){
			e.checked = box.Checked();
		});
		
		box.appendChild(e);
		
		e.getInstance = function(){
			return box;	
		};
		
		return box;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(Checkbox.Transform(e));
	});
	
	return options;
};

Import('window.form.checkbox.linebox');
Import('window.form.checkbox.listbox');
Import('window.form.checkbox.doublelistbox');