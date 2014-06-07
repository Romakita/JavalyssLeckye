/** section: Form
 * class ListBox < Element
 *
 * Cette classe permet de créer un collection de case à cocher à partir d'un tableau de données.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <h4>Instance en mode local</h4>
 * <p>Cette exemple montre comment créer une instance ListBox avec un liste de données en local :</p>
 * 
 *     var box = new ListBox({type:Checkbox.BOX}); //ou Checkbox.RAD si la liste est à choix unique
 *     box.setData([
 *         {value: 1, text:'option 1', name:'myListBox', checked:true},
 *         {value: 2, text:'option 2', name:'myListBox', checked:false},
 *         {value: 3, text:'option 3', name:'myListBox', checked:false}
 *     ]);
 *     document.body.appendChild(box);
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Cette exemple montre comment créer une instance ListBox avec récupération des données via AJAX :</p>
 * 
 *     var box = new ListBox({type:Checkbox.BOX, link:'listbox.php', parameters:'cmd=getlist'}); //ou Checkbox.RAD si la liste est à choix unique
 *     document.body.appendChild(box);
 *     box.load();
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>listbox.php</code></p>
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance ListBox en HTML :</p>
 *  
 *     <select class="box-listbox" name="myListBox[]" multiple="multiple">
 *          <option value="1">option 1</option>
 *          <option value="2" selected="selected">option 2</option>
 *          <option value="3" selected="selected">option 3</option>
 *     </select>
 *     <select class="box-listbox" name="myListBox2">
 *          <option value="1">option 1</option>
 *          <option value="2">option 2</option>
 *          <option value="3" selected="selected">option 3</option>
 *     </select>
 *
 * </div>
 * <div>
 * <p>Ce script PHP retourne une liste de données vers l'instance Select :</p>
 * 
 *     <?php
 *     $list = array(
 *          array(
 *               'value'=>'1',
 *               'text'=>'option 1'
 *          ),
 *          array(
 *               'value'=>'2',
 *               'text'=>'option 2'
 *          ),
 *          array(
 *               'value'=>'3',
 *               'text'=>'option 3'
 *          ),
 *          array(
 *               'value'=>'4',
 *               'text'=>'option 4'
 *          ),
 *          array(
 *               'value'=>'5',
 *               'text'=>'option 5'
 *          )
 *     );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getlist':
 *               echo json_encode($list);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * Case à cocher multiple :
 *
 * <select class="box-listbox" name="myListBox[]" multiple="multiple">
 * <option value="1">option 1</option>
 * <option value="2" selected="selected">option 2</option>
 * <option value="3" selected="selected">option 3</option>
 * </select>
 *
 * Case à cocher à choix unique :
 *
 * <select class="box-listbox" name="myListBox2">
 * <option value="1">option 1</option>
 * <option value="2">option 2</option>
 * <option value="3" selected="selected">option 3</option>
 * </select>
 **/
var ListBox = Class.createElement('div');
ListBox.AUTO_INCREMENT = 0;
ListBox.prototype = {
	__class__:	'listbox',
	className:	'wobject input listbox',
	empty:		false,
/**
 * ListBox#link -> String
 * Lien du script à interroger via AJAX.
 **/
	link: 		'',
	parameters: '',
	type:		'checkbox',
	UID:		0,
/**
 * new ListBox([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance de [[ListBox]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `link` (`String`): Lien du script PHP pour la récupération de la liste de données.
 * * `parameters` (String): Paramètre à passer au script PHP.
 * * `empty` (`String`): Message à afficher lorsque AJAX ne retourne aucune données.
 * * `type` (`String`): `radio` ou `checkbox`.
 *
 **/
	initialize: function(obj){
		
		this.link = 		$WR().getGlobals('link');
			
		if(!Object.isUndefined(obj)){
			Object.extend(this, obj);
		}
		//
		
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		this.UID = ListBox.AUTO_INCREMENT++;
		
		
		if(Object.isUndefined(obj) || Object.isUndefined(obj.catchWheel) || obj.catchWheel !== false){
			this.catchWheelEvent();
		}
	},
		
	destroy: function(){
		this.stopObserving();
		
		this.Observer.destroy();
		
		this.Observer = 	null;
		this.destroy = 		null;
		this.className = 	'';
				
		try{this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});}catch(er){}
	},
/**
 * ListBox#clear() -> ListBox
 *
 * Réinitialise la liste de checkbox
 **/
	clear: function(){
		
		this.removeChilds();
		
		if(Object.isElement(this.element)){
			this.appendChild(this.element);
		}
		return this;
	},
/**
 * ListBox#Value() -> Array | Object
 * ListBox#Value(array) -> Array | Object
 * ListBox#Value(value) -> Array | Object
 * - array (Array): Liste de valeur à selectionner.
 * - value (Mixed): Valeur à affecter.
 *
 * Cette méthode retourne une liste de valeur selectionné.
 **/
 	Value:function(array){
		
		if(!Object.isUndefined(array)){
			
			this.value = array;
			if(!Object.isArray(array)){
				array = [array];
			}
			
			this.select('.linebox').each(function(line){
				
				if(Object.isFunction(line.Checked)){
					
					line.Checked(false);
					
					for(var i = 0; i < array.length; i++){
						
						if(line.Value() == array[i]){
							line.Checked(true);
							break;
						}
						
						if(line.Value() == array[i].value){
							line.Checked(true);
							break;
						}
						
					}
				}
				
			});	
		}
		
		return this.type == 'radio' ? this.value : this.getChecked();
	},
/**
 * ListBox#getChecked() -> Array
 *
 * Retourne un tableau de valeur des checkbox cochées
 **/
	getChecked: function(){
		var array = [];
				
		this.select('.linebox').each(function(line){
			if(Object.isFunction(line.Checked)){
				if(line.Checked()){
					if(Object.isFunction(line.Value)){
						if(line.Value() != null && line.Value() != ''){
							array.push(line.data || line.Value());
						}
					}
				}
			}
		});
		
		return array;
	},
/**
 * ListBox#load() -> ListBox
 *
 * Cette méthode charge les données depuis un script PHP à l'adresse [[ListBox#link]].
 **/	
	load: function(){
		if(this.link != ''){
			
			var globals = 		$WR().getGlobals('parameters');
			var parameters = 	this.parameters + (globals == '' ? '' : '&' + globals);
			
			this.removeClassName('icon-loading-gif');
			this.addClassName('icon-loading-gif');
			
			new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				onComplete: this.onComplete.bind(this)
			});
		}
		return this;
	},
	
	onComplete: function(result){
		this.removeClassName('icon-loading-gif');
		
		var obj = result.responseText.evalJSON();
			
		this.clear();
		this.Observer.fire('complete', obj);
		
		if(obj.length == 0){
			if(this.empty){
				if(!Object.isElement(this.empty)){//l'élément n'a pas été créée
					this.empty = new Node('div', {style:"width:100%; text-align:center; background-color:#D4D4D4; color:#464646; text-shadow:0px 1px #FFF;padding: 5px 0px 5px 0px;"}, Object.isString(this.empty) ? this.empty : '- '+ $MUI('Aucun résultat rétourné') + '- ');
					this.appendChild(this.empty);
				}
				
				if(array.length > 0){
					this.empty.hide();
				}else{
					this.empty.show();
				}
			}
		}
		
		this.setData($A(obj));
			
		if(Object.isElement(this.element)){
			this.apppendChild(this.element);
		}
		
		this.Value(this.value);
			
	},
/**
 * ListBox#getData() -> Array 
 *
 * Retourne l'ensemble des valeurs contenu dans la liste.
 **/
 	getData: function(){
		var array = 	[];
		var childs = 	this.childElements();
		
		for(var i = 0; i < childs.length; i++){
			array.push(childs[i].getData());
			
			if(childs[i].size() > 0){
				var subarray = childs[i].toArray();
				
				for(var y = 0; y < subarray.length; y++){
					array.push(subarray[y]);
				}
			}
		}
		
		return array;
	},
/**
 * ListBox#selectedIndex(it) -> Number
 *
 * Cette méthode selectionne une ligne de l'instance.
 **/
 	selectedIndex: function(it){
		var i = 0;
		
		this.childElements().each(function(e){
			if(e.hasClassName('linebox')){
				
				if(!Object.isUndefined(it)){
					if(i == it){
						if(e.Checked){
							e.Checked(true);
						}
					}
				}else{
					if(e.Checked()){
						it = i;
					}
				}
				
				i++;
			}
		});
		
		return it;
	},
/**
 * ListBox#size() -> Number
 *
 * Cette méthode le nombre d'élément contenu dans l'instance.
 **/
	size: function(){
		return this.childElements().length;
	},
/*
 * ListBox#toArray() -> Array 
 *
 * Retourne l'ensemble des valeurs contenu dans la liste.
 **/	
	toArray: function(){
		return this.getData();
	},
/**
 * ListBox#observe(eventName, callback) -> SimpleTable
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Intervient lorsque le chargement de la liste via PHP est terminé.
 * * `change` : Intervient lorsque l'utilisateur sélection ou désélectionne un élément de la liste.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, handler){
		switch(eventName){
			case 'change':
			case "draw":
			case "complete":
				this.Observer.observe(eventName, handler);
				break;
			default:
				Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * ListBox#stopObserving(eventName, callback) -> SimpleTable
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode supprime un écouteur `callback` associer à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Intervient lorsque le chargement de la liste via PHP est terminé.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving: function(eventName, handler){
		switch(eventName){
			case 'change':
			case "draw":
			case "complete":
				this.Observer.stopObserving(eventName, handler);
				break;
			default:
				Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
/**
 * ListBox#setData(array) -> ListBox
 * - array (Array): Tableau de données.
 *
 * Cette méthode assigne une liste de données à l'instance [[ListBox]] et créée automatiquement une collection de case à cocher en fonction de la structure du tableau.
 **/
	setData:function(options){
		var self = this;
		
		this.clear();
		
		$A(options).each(function(data){	
			//
			// LineBox
			//
			var box = new LineBox({text:data.text, type:this.type, data:data, name:data.name ? data.name : 'list-box' + this.UID, checked:data.checked});
			box.Value(Object.isUndefined(data.value) ? data : data.value);
			
			this.appendChild(box);
			
			this.Observer.fire('draw', box, this);
			
			box.CheckBox.on('change', function(evt){
				
				if(self.type =='radio'){
					self.value = box.Value();	
				}
				
				self.Observer.fire('change', evt, this);
				
			}.bind(box));
		}, this);
		return this;
	},
/**
 * ListBox#setLink(link) -> ListBox
 * - link (String): Lien de la passerelle PHP.
 * 
 * Cette méthode assigne un lien afin de récupérer des données depuis PHP.
 **/
 	setLink:  function(link){
		this.link = link;
		return this;
	},
/**
 * ListBox#setParameters(parameters) -> ListBox
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/
	setParameters: function(param){
		this.parameters = param;
		return this;
	}
};
/**
 * ListBox.Transform(node) -> Checkbox
 * ListBox.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance ListBox.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[ListBox]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <h4>Instance en mode local</h4>
 * <p>Cette exemple montre comment créer une instance ListBox avec un liste de données en local :</p>
 * 
 *     var box = new ListBox({type:Checkbox.BOX}); //ou Checkbox.RAD si la liste est à choix unique
 *     box.setData([
 *         {value: 1, text:'option 1', name:'myListBox', checked:true},
 *         {value: 2, text:'option 2', name:'myListBox', checked:false},
 *         {value: 3, text:'option 3', name:'myListBox', checked:false}
 *     ]);
 *     document.body.appendChild(box);
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Cette exemple montre comment créer une instance ListBox avec récupération des données via AJAX :</p>
 * 
 *     var box = new ListBox({type:Checkbox.BOX, link:'listbox.php', parameters:'cmd=getlist'}); //ou Checkbox.RAD si la liste est à choix unique
 *     document.body.appendChild(box);
 *     box.load();
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>listbox.php</code></p>
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance ListBox en HTML :</p>
 *  
 *     <select class="box-listbox" name="myListBox[]" multiple="multiple">
 *          <option value="1">option 1</option>
 *          <option value="2" selected="selected">option 2</option>
 *          <option value="3" selected="selected">option 3</option>
 *     </select>
 *     <select class="box-listbox" name="myListBox2">
 *          <option value="1">option 1</option>
 *          <option value="2">option 2</option>
 *          <option value="3" selected="selected">option 3</option>
 *     </select>
 *
 * </div>
 * <div>
 * <p>Ce script PHP retourne une liste de données vers l'instance Select :</p>
 * 
 *     <?php
 *     $list = array(
 *          array(
 *               'value'=>'1',
 *               'text'=>'option 1'
 *          ),
 *          array(
 *               'value'=>'2',
 *               'text'=>'option 2'
 *          ),
 *          array(
 *               'value'=>'3',
 *               'text'=>'option 3'
 *          ),
 *          array(
 *               'value'=>'4',
 *               'text'=>'option 4'
 *          ),
 *          array(
 *               'value'=>'5',
 *               'text'=>'option 5'
 *          )
 *     );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getlist':
 *               echo json_encode($list);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * Case à cocher multiple :
 *
 * <select class="box-listbox" name="myListBox[]" multiple="multiple">
 * <option value="1">option 1</option>
 * <option value="2" selected="selected">option 2</option>
 * <option value="3" selected="selected">option 3</option>
 * </select>
 *
 * Case à cocher à choix unique :
 *
 * <select class="box-listbox" name="myListBox2">
 * <option value="1">option 1</option>
 * <option value="2">option 2</option>
 * <option value="3" selected="selected">option 3</option>
 * </select>
 *
 **/
ListBox.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var box = 		new ListBox({
			name:		e.name,
			value:		e.value,
			type:		e.multiple ? 'checkbox' : 'radio',
			element:	e
		});
				
		box.id = e.id;		
		box.addClassName(e.className);
		box.removeClassName('box-listbox');
				
		e.replaceBy(box);
		box.appendChild(e);
		
		e.className = '';
		e.hide();
		
		var array = [];
		var index = 0;
		
		for(var y = 0; y < e.options.length; y++){
						
			array.push({value: e.options[y].value, text:e.options[y].innerHTML, checked:e.options[y].selected, element:e.options[y]});
			
			if(e.options[y].selected){
				index = y;
			}
		}
		
		box.setData(array);
		
		if(e.multiple){
			box.on('change', function(box){
				box.getData().element.selected = box.Checked();
			});
		}else{
			box.selectedIndex(index);
			box.on('change', function(){
				e.selectedIndex = this.selectedIndex();
			});
		}
			
		box.setData = function(array){
			
			var self = this;
			
			this.clear();
			
			$A(options).each(function(data){	
				//
				// LineBox
				//
				var box = new LineBox({text:data.text, type:this.type, data:data, name:data.name ? data.name : 'list-box' + this.UID, checked:data.checked});
				box.Value(data.value || data);
				
				this.appendChild(box);
				
				this.Observer.fire('draw', box, this);
				
				box.CheckBox.on('change', function(evt){
					self.Observer.fire('change', evt, this);
				}.bind(box));
			}, this);
			
			e.removeChilds();
			
			for(var i = 0; i < array.length; i++){
				e.appendChild(new Node('option', {value:array[i].value || array[i].text, text:array[i].text}));
			}
			
			return this;
		}.bind(box);	
		
		e.getInstance = function(){
			return box;	
		};
		
		return box;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(ListBox.Transform(e));
	});
	
	return options;
};