/** section: Form
 * class DoubleListBox < Element
 * Cette classe permet de créer un conteneur de deux listes [[ListBox]]. Elle permet de transferer 
 * des éléments de liste de droite vers la liste de gauche et inversement.
 *
 * La double liste n'est qu'un conteneur et ne retourne pas de liste des données (absence des méthodes `getData` et `getCheckedData`). Pour récupérer les données d'une des
 * liste, utilisez les attributs `DoubleListBox#ListBox1` ou `DoubleListBox#ListBox2` en fonction de vos besoins.
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
 * <p>Cette exemple montre comment créer une instance DoubleListBox avec un liste de données en local :</p>
 * 
 *     var box = DoubleListBox();
 *     box.setData([
 *         {value: 1, text:'option 1', name:'myListBox', selected:true},
 *         {value: 2, text:'option 2', name:'myListBox'},
 *         {value: 3, text:'option 3', name:'myListBox'}
 *     ]);
 *     document.body.appendChild(box);
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Cette exemple montre comment créer une instance DoubleListBox avec récupération des données via AJAX :</p>
 * 
 *     var box = DoubleListBox({link:'doublelistbox.php', parameters:'cmd=getlist'});
 *     document.body.appendChild(box);
 *     box.load();
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>listbox.php</code></p>
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance ListBox en HTML :</p>
 *  
 *     <select class="box-doublelistbox" name="myDoubleListBox[]" multiple="multiple">
 *          <option value="1">option 1</option>
 *          <option value="2" selected="selected">option 2</option>
 *          <option value="3" selected="selected">option 3</option>
 *          <option value="4">option 4</option>
 *          <option value="5">option 5</option>
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
 *               'text'=>'option 1',
 *               'selected'=> true
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
 * <select class="box-doublelistbox" name="myDoubleListBox[]" multiple="multiple">
 * <option value="1">option 1</option>
 * <option value="2" selected="selected">option 2</option>
 * <option value="3" selected="selected">option 3</option>
 * <option value="4">option 4</option>
 * <option value="5">option 5</option>
 * </select>
 *
 **/
var DoubleListBox = Class.createSprite('div');
DoubleListBox.prototype = {
	__class__:	'doublelistbox',
	className:	'wobject widget gradient border doublelistbox',
/**
 * DoubleListBox#ListBox1 -> ListBox
 * Liste de droite.
 **/
	ListBox1: 	null,
/**
 * DoubleListBox#ListBox2 -> ListBox
 * Liste de gauche.
 **/
	ListBox2:	null,
/**
 * DoubleListBox#link -> String
 * Lien du script à interroger via AJAX.
 **/
	link:		'',
	parameters:	'',
/**
 * new DoubleListBox()
 * new DoubleListBox(options)
 * - options (Object): Objet de configuration.
 *
 * Créée une nouvelle instance [[DoubleListBox]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `link` (`String`): Lien du script PHP pour la récupération de la liste de données.
 * * `parameters` (String): Paramètre à passer au script PHP.
 *
 **/
	initialize: function(options){
		
		this.link = 		$WR().getGlobals('link');
		
		if(!Object.isUndefined(options)){
			Object.extend(this, options);
		}
		//
		// BtnLtR
		//
		this.BtnLtR =	new SimpleButton({icon:'next'});
		//
		// BtnRtL
		//
		this.BtnRtL =	new SimpleButton({icon:'prev'});
		//
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		//
		// ListBox1
		//
		this.ListBox1 = new ListBox();
		this[0] = this.ListBox1;
		this.ListBox1.addClassName('dlb-lb1');
		//
		// ListBox2
		//
		this.ListBox2 = new ListBox();
		this[1] = this.ListBox2;
		this.ListBox2.addClassName('dlb-lb2');
		//
		//
		//
		this.Title1 = new Node('div', {className:'font'}, this.title1 || '');
		//
		//
		//
		this.Title2 = new Node('div', {className:'font'}, this.title2 || '');
		//
		// Thead
		//
		this.Thead = new Node('thead', {className:'wrap-header'}, [
			new Node('tr',[
				new Node('th', this.Title1),
				new Node('th'),
				new Node('th', this.Title2)
			])
		]);
		
		
		//
		// Table
		//
		this.Table = new TableData();
		this.Table.insertBefore(this.Thead, this.Table.getElementsByTagName('tbody')[0]);
				
		this.Table.className = '';
		
		this.Table.addCel(this.ListBox1, {className:'dlb-left'});
		this.Table.addCel([this.BtnLtR, this.BtnRtL],{className:'dlb-mid'});
		this.Table.addCel(this.ListBox2, {className:'dlb-right'});
		
		this.appendChild(this.Table);
				
		this.BtnRtL.on('click', this.onClickRtL.bind(this));
		this.BtnLtR.on('click', this.onClickLtR.bind(this));
		
	},
/*
 * DoubleListBox#onClickRtL()
 **/
	onClickRtL: function(evt){

		var childs = this.ListBox2.childElements();
		
		for(var i = 0; i < childs.length; i++){

			if(childs[i].Checked()){
				this.ListBox2.removeChild(childs[i]);
				this.ListBox1.appendChild(childs[i]);
				childs[i].Checked(false);
				
				this.Observer.fire('draw.listbox.1', childs[i]);
			}
		}

	},
/*
 * DoubleListBox#onClickRtL()
 **/
	onClickLtR: function(evt){
		var childs = this.ListBox1.childElements();
		
		for(var i = 0; i < childs.length; i++){
			if(childs[i].Checked()){
				this.ListBox1.removeChild(childs[i]);
				this.ListBox2.appendChild(childs[i]);
				
				childs[i].Checked(false);
				
				this.Observer.fire('draw.listbox.2', childs[i]);
			}
		}
	},
/**
 * DoubleListBox#load() -> DoubleListBox
 *
 * Cette méthode charge les données depuis un script PHP à l'adresse [[DoubleListBox#link]].
 **/	
	load: function(){
		if(this.link != ''){
			
			var globals = 		$WR().getGlobals('parameters');
			var parameters = 	this.parameters + (globals == '' ? '' : '&' + globals);

			new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				
				onComplete: function(result){
					
					var obj = result.responseText.evalJSON();
					
					if(Object.isFunction(this.ListBox1.clear)){
						this.ListBox1.clear();
					}
					
					if(Object.isFunction(this.ListBox2.clear)){
						this.ListBox2.clear();
					}
					
					this.Observer.fire('complete', obj);
										
					this.setData($A(obj));
										
				}.bind(this)
			});
		}
		return this;
	},
/**
 * DoubleListBox#observe(eventName, callback) -> DoubleListBox
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `complete` : Intervient lorsque le chargement de la liste via PHP est terminé.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){		
			case 'draw.listbox.1':
			case 'draw.listbox.2':
				this.Observer.observe(eventName, callback);
				break;	
			case "complete":
				this.Observer.observe(eventName, callback);
				break;
			default:
				Event.observe(this, eventName, callback);
		}
		return this;
	},
/**
 * DoubleListBox#stopObserving(eventName, callback) -> DoubleListBox
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
			case 'draw.listbox.1':
			case 'draw.listbox.2':
				this.Observer.stopObserving(eventName, callback);
				break;
			case "complete":
				this.Observer.stopObserving(eventName, handler);
				break;
			default:
				Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
/**
 * DoubleListBox#setLink(link) -> ListBox
 * - link (String): Lien de la passerelle PHP.
 * 
 * Cette méthode assigne un lien afin de récupérer des données depuis PHP.
 **/
 	setLink:  function(link){
		this.link = link;
		return this;
	},
/**
 * DoubleListBox#setParameters(parameters) -> ListBox
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/
	setParameters: function(param){
		this.parameters = param;
		return this;
	},
/**
 * DoubleListBox#setData(array) -> DoubleListBox
 * - array (Array): Tableau de données.
 *
 * Cette méthode assigne une liste de données à l'instance [[DoubleListBox]] et créée automatiquement une collection de case à cocher en fonction de la structure du tableau.
 **/
	setData:function(options){
		this.ListBox1.removeChilds();
		this.ListBox2.removeChilds();
		
		for(var i = 0; i < options.length; i++){		
			//
			// LineBox
			//
			var box = new LineBox({text:options[i].text});
			box.Value(options[i].value);
			
			if(options[i].selected){
				this.ListBox1.appendChild(box);
			}else{
				this.ListBox2.appendChild(box);	
			}
		}
		return this;
	},
/**
 * DoubleListBox#setLeftTitle(title) -> ListBox
 *
 * Cette méthode ajoute un titre à la colonne de gauche.
 **/
 	setLeftTitle: function(title){
		this.Title1.innerHTML = title;
		return this;
	},
/**
 * DoubleListBox#setRightTitle(title) -> ListBox
 *
 * Cette méthode ajoute un titre à la colonne de gauche.
 **/
 	setRightTitle: function(title){
		this.Title2.innerHTML = title;
		return this;
	}
};
/**
 * DoubleListBox.Transform(node) -> Checkbox
 * DoubleListBox.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance DoubleListBox.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[DoubleListBox]].
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
 * <p>Cette exemple montre comment créer une instance DoubleListBox avec un liste de données en local :</p>
 * 
 *     var box = DoubleListBox();
 *     box.setData([
 *         {value: 1, text:'option 1', name:'myListBox', selected:true},
 *         {value: 2, text:'option 2', name:'myListBox'},
 *         {value: 3, text:'option 3', name:'myListBox'}
 *     ]);
 *     document.body.appendChild(box);
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Cette exemple montre comment créer une instance DoubleListBox avec récupération des données via AJAX :</p>
 * 
 *     var box = DoubleListBox({link:'doublelistbox.php', parameters:'cmd=getlist'});
 *     document.body.appendChild(box);
 *     box.load();
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>listbox.php</code></p>
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance ListBox en HTML :</p>
 *  
 *     <select class="box-doublelistbox" name="myDoubleListBox[]" multiple="multiple">
 *          <option value="1">option 1</option>
 *          <option value="2" selected="selected">option 2</option>
 *          <option value="3" selected="selected">option 3</option>
 *          <option value="4">option 4</option>
 *          <option value="5">option 5</option>
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
 *               'text'=>'option 1',
 *               'selected'=> true
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
 * <select class="box-doublelistbox" name="myDoubleListBox[]" multiple="multiple">
 * <option value="1">option 1</option>
 * <option value="2" selected="selected">option 2</option>
 * <option value="3" selected="selected">option 3</option>
 * <option value="4">option 4</option>
 * <option value="5">option 5</option>
 * </select>
 *
 **/
DoubleListBox.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var box = 		new DoubleListBox();
				
		box.id = e.id;		
		box.addClassName(e.className);
		box.removeClassName('box-doublelistbox');
				
		e.replaceBy(box);
		box.appendChild(e);
		
		e.className = '';
		e.hide();
		
		var array = [];
		var index = 0;
		
		for(var y = 0; y < e.options.length; y++){
						
			array.push({value: e.options[y].value, text:e.options[y].innerHTML, selected:e.options[y].selected, element:e.options[y]});
			
			if(e.options[y].selected){
				index = y;
			}
		}
		
		box.setData(array);
		
		if(!e.multiple){
			e.multiple = true;
		}
		
		box.on('change', function(box){
			for(var y = 0; y < e.options.length; y++){
				e.options.selected = false;
			}
			
			box.ListBox1.getData().element.selected = true;
		});
		
		box.setData = function(array){
			this.ListBox1.removeChilds();
			this.ListBox2.removeChilds();
		
			for(var i = 0; i < options.length; i++){		
				//
				// LineBox
				//
				var box = new LineBox({text:options[i].text});
				box.Value(options[i].value);
				
				if(options[i].selected){
					this.ListBox1.appendChild(box);
				}else{
					this.ListBox2.appendChild(box);	
				}
			}
			
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
		options.push(DoubleListBox.Transform(e));
	});
	
	return options;
};