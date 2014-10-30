/** section: Form
 * class LineBox < Element
 * Cette classe créer un element avec une case à cocher [[Checkbox]] et du texte.
 **/
var LineBox = Class.createSprite('ul');
LineBox.prototype = {
	__class__:	'linebox',
	className:	'wobject w-line linebox noselect',
/* 
 * LineBox#value -> String
 * Valeur du champ input.
 **/
	value: 		'',
/*
 * LineBox#checked -> Boolean
 * Indique si la ligne est coché.
 **/
	checked:	false, 
/*
 * LineBox#text -> String
 * Text de la ligne.
 **/
	text: 		'',
	update: 	false,
/**
 * new LineBox(options)
 * - options (Object): Options de configuration.
 *
 * Créée une nouvelle instance [[LineBox]].
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `checked` (Boolean): Indique si la case sera cochée ou pas.
 * * `name` (String): Donne un nom à la ligne.
 * * `text` (String): Affiche la valeur du texte dans la ligne.
 * * `type` (String): Indique le type de la case `radio` ou `checkbox`.
 *
 **/
	initialize: function(obj){
		
		var options = {
			data:	false,
			text:	'',
			name: 	'checkbox',			//
			type: 	'checkbox',
			checked:false,
			update:	true				//si on click sur cette checkbox, les enfants sont activés.
		};
			
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.CheckBox = 	new Checkbox(options);
		this.Label =		new Node('label', {className:'font wrap-title'});

		this.header = new Node('li', {className:'gradient border over wrap-header'}, [
			this.CheckBox,
			this.Label
		]);
		
		this.body = new Node('li', {className:'wrap-body'});
		
		this.appendChild(this.header);
		this.appendChild(this.body);
		
		this.header.on('click', this.onClick.bind(this));
		this.CheckBox.on('change', this.onChange.bind(this));
		
		this.appendChild = this.addChild;
		
		this.setData(options.data);
		this.setText(options.text);
		this.UpdateChild(options.update);
		
		if(!Object.isUndefined(options.select)){
			this.UpdateChild(options.select);
		}
		
		this.Checked(options.Checked);
		this.Value(options.value);
		this.Name(options.Name);
	},
	
	destroy: function(){
		this.stopObserving();
		this.header.stopObserving();
		this.Label.stopObserving();
		
		this.destroy = 		null;
		this.className = 	'';
		this.CheckBox = 	null;
		this.Label = 		null;
		this.header =		null;
		
		this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});
	},
/*
 * LineBox#onClick(evt)
 **/
	onClick: function(evt){
		this.Checked(!this.Checked());
		this.CheckBox.fire('checkbox:change');
	},
/**
 * LineBox#Header() -> Element
 * 
 * Cette méthode retourne l'élément d'entete de l'instance.
 **/	
	Header: function(e){		
		return this.header;
	},
/**
 * LineBox#Body() -> Element
 * 
 * Cette méthode retourne l'élément principal de l'instance.
 **/	
	Body: function(e){		
		return this.body;
	},
/*
 * LineBox#onChange(evt)
 **/
	onChange: function(evt){
		if(this.update){
			var array = this.childElements();
			
			for(var i = 0; i < array.length; i++){
				array[i].Checked(this.CheckBox.Checked());	
			}
		}
	},
/**
 * LineBox#appendChild(linebox) -> LineBox
 * - linebox(LineBox): Ligne à ajouter au corps de la ligne.
 *
 * Cette méthode ajoute une ligne à la l'instance.
 **/
	addChild: function(linebox){
		if(this.type == 'radio') return this;		
		this.body.appendChild(linebox);
		this.removeClassName('master');
		this.addClassName('master');
		return this;
	},
/**
 * LineBox#addChildAt(linebox, it) -> LineBox
 * - linebox(LineBox): Ligne à ajouter au corps de la ligne.
 * - it (Number): Indice d'insertion.
 *
 * Cette méthode ajoute une ligne à la l'instance à l'indice demandé.
 **/
	addChildAt: function(linebox, it){
		if(this.type == 'radio') return this;		
		this.body.addChildAt(linebox, it);
		this.removeClassName('master');
		this.addClassName('master');
		return this;
	},
/**
 * LineBox#top(linebox) -> LineBox
 * - linebox(LineBox): Ligne à ajouter au corps de la ligne.
 *
 * Cette méthode ajoute une ligne à la l'instance en haute de liste.
 **/
	top: function(linebox){
		return this.addChildAt(linebox, 0);
	},
/**
 * LineBox#removeChild(linebox) -> LineBox
 * - linebox (LineBox): Ligne à supprimer de l'instance.
 *
 * Supprime une LineBox du LineBox courant.
 **/
	removeChild: function(linebox){
		this.body.removeChild(linebox);
	},
/**
 * LineBox#Checked(bool) -> Boolean
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
 *     var line = new LineBox();
 *     line.Checked(true); //la case sera cochée
 *
 * ##### Récupération d'une valeur :
 * 
 *     var line = new LineBox();
 *     line.Checked(false);
 *     alert(line.Checked()); //false indique la case n'est pas cochée.
 *
 **/
	Checked: function(bool){
		if(Object.isUndefined(bool)) return this.CheckBox.Checked();
		
		this.checked = this.CheckBox.Checked(bool);
		
		if(this.update){
			this.childElements().each(function(e){
				if(Object.isFunction(e.Checked)){
					e.Checked(this.CheckBox.Checked());	
				}
			}.bind(this));
		}
		
		return this.checked;
	},
/**
 * LineBox#Name(str) -> String
 **/
	Name: function(str){
		if(Object.isUndefined(str)) return this.CheckBox.Name();
		return this.name = this.CheckBox.Name(str);
	},
/**
 * LineBox#Text([text]) -> String
 * - str (String): Texte à ajouter.
 *
 * Assigne ou/et retourne le texte de l'instance.
 * 
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var line = new LineBox();
 *     line.Text('mon text');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var line = new LineBox({text:'mon text'});
 *     alert(line.Text()); //mon text
 *
 **/
	setText: function(str){
		if(!Object.isUndefined(str)) this.Label.innerHTML = str;
		return this;
	},
	
	getText: function(){
		return this.Label.innerHTML;
	},
	
	Text: function(str){
		if(Object.isUndefined(str)) return this.text;
		return this.text = this.Label.innerHTML = str;
	},
/**
 * LineBox#Type(type) -> String
 * - type (String): Type de la ligne.
 *
 * Cette méthode permet de changer le type de la case à cocher pouvant être soit de type `radio`, soit de type `checkbox`. 
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var line = new LineBox();
 *     line.Type(Checkbox.RAD);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var line = new LineBox();
 *     line.Type(Checkbox.RAD);
 *     alert(line.Type()); //radio
 *
 **/
	Type: function(type){
		if(Object.isUndefined(type)) return  this.CheckBox.Type();
		return this.CheckBox.Type(type);
	},
/**
 * LineBox#Value([value]) -> ?
 * - value (mixedValue): Valeur 
 *
 * Assigne ou retourne une valeur de la ligne. Cette valeur est aux choix du développeur et
 * peut contenir n'importe quoi.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var line = new LineBox();
 *     line.Value('ma valeur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var line = new LineBox();
 *     line.Value('ma valeur');
 *     alert(line.Value()); //ma valeur
 *
 **/
	Value: function(value){
		if(Object.isUndefined(value)) return this.value;
		return this.value = this.CheckBox.Value(value);
	},
/**
 * LineBox#UpdateChild() -> Boolean
 * LineBox#UpdateChild(bool) -> Boolean
 *
 * Cette méthode permet d'activer si `bool` est vrai, la mise à jour des cases à cocher contenu dans l'instance. 
 **/
	UpdateChild: function(bool){
		if(Object.isUndefined(bool)) return this.update;
		return this.update = bool ? true : false;
	},
/**
 * LineBox#clear() -> LineBox
 *
 * Cette méthode supprime tous les noeuds enfants contenu dans l'instance.
 **/
	clear:function(){
		this.body.removeChilds();
		return this;
	},
/**
 * LineBox#Bold(bool) -> LineElement
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
 * LineBox#childElements() -> Array
 *
 * Cette méthode retourne la liste des noeuds enfants de l'instance.
 **/
	childElements: function(){
		return this.body.childElements();
	},
/**
 * LineBox#getChecked() -> Array
 *
 * Cette méthode retourne la liste de données à partir des noeuds enfants de type [[Checkbox]] cochés.
 **/
	getChecked: function(){
		var array = [];
		
		this.select('.linebox').each(function(line){
			if(Object.isFunction(line.Checked)){
				if(line.Checked()){
					if(line.Value()){
						array.push(line.Value());
					}
				}
			}
		});
		
		return array;
	},
/**
 * LineBox#getData() -> Mixed 
 *
 * Cette méthode retourne les données attachés à l'instance.
 **/
	getData: function(){
		return this.data;
	},
/**
 * LineBox#setData(obj) -> LineBox 
 * - obj (Mixed): Données à attacher à l'instance.
 *
 * Cette méthode permet d'attacher des données à l'instance.
 **/
	setData: function(obj){
		this.data = obj;
		return this;
	},
/**
 * LineBox#size() -> Number
 *
 * Cette méthode retourne le nombre de noeud enfant direct contenu dans l'instance.
 **/
	size: function(){
		return this.body.childElements().length;
	},
/**
 * LineBox#toArray() -> Array 
 *
 * Cette méthode retourne une liste de données attachés à chaque noeud enfant contenu dans l'instance.
 **/
	toArray: function(){
		var array = [];
		var childs = this.childElements();
		
		for(var i = 0; i < childs.length; i++){
			//ajout de la données de l'instance
			array.push(childs[i].getData());
			//ajout des données des enfants de l'instance
			if(childs[i].length > 0){
				var subarray = childs[i].getArray();
				
				for(var y = 0; y < subarray.length; y++){
					array.push(subarray);
				}
			}
		}
		
		return array;	
	}
};