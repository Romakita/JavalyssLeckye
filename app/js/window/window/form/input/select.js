/** section: Form
 * class Select < InputPopup
 * Cette classe permet de créée un champ avec une liste de choix apparaissant au clique de ce dernier.
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
 * <h4>Intance à choix unique</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local :</p>
 * 
 *     var select = Select();
 *     select.setData([
 *          {text:'option 1', value:1},
 *          {text:'option 2', value:2},
 *          {text:'option 3', value:3},
 *          {text:'option 4', value:4}
 *     ]);
 *     document.body.appendChild(select);
 *
 * <h4>Instance à choix multiple</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local. L'utilisateur peut choisir une ou plusieurs options dans la liste proposée :</p>
 * 
 *     var select = Select({multiple:true});
 *     select.setData([
 *          {text:'option 1', value:1},
 *          {text:'option 2', value:2},
 *          {text:'option 3', value:3},
 *          {text:'option 4', value:4}
 *     ]);
 *     document.body.appendChild(select);
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Les données sont cette fois-ci récupéré directement depuis un script PHP :</p>
 * 
 *     var select = Select({link:'select.php', parameters:'cmd=getlist'});
 *     //on charge les données avec la méthode load()
 *     select.load();
 *     document.body.appendChild(select);
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>select.php</code></p>
 * </div>
 *
 * <div>
 * <h4>Intance à choix unique</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local :</p>
 * 
 *     <select class="box-select">
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *     </select>
 *
 * <h4>Instance à choix multiple</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local. L'utilisateur peut choisir une ou plusieurs options dans la liste proposée :</p>
 * 
 *     <select class="box-select" multiple="multiple">
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *     </select>
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Les données sont cette fois-ci récupéré directement depuis un script PHP :</p>
 * 
 *     <select class="box-select my-select">
 *     </select>
 *     <script>
 *          Extends.after(function(){
 *               $$('.my-select').each(function(select){
 *                    select.setLink('select.php');
 *                    select.setParameters('cmd=getlist');
 *                    select.load();
 *               });
 *          });
 *     </script>
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>select.php</code></p>
 * </div>
 *
 * <div>
 *
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
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 *
 * ##### Select à choix unique
 *
 * <select class="box-select">
 * <option value="1">option 1</option>
 * <option value="2">option 2</option>
 * <option value="3">option 3</option>
 * <option value="4">option 4</option>
 * <option value="5">option 5</option>
 * </select>
 * 
 * ##### Select à choix multiple
 * 
 * <select class="box-select" multiple="multiple">
 * <option value="1">option 1</option>
 * <option value="2">option 2</option>
 * <option value="3">option 3</option>
 * <option value="4">option 4</option>
 * <option value="5">option 5</option>
 * </select> 
 *
 **/
var Select = Class.from(InputPopup);

Select.prototype = {
	__class__: 	'inputcomplete',
	className:	'wobject input input-button input-popup input-completer input-select',
/*
 * Select.value -> String
 * Valeur du champs.
 **/
 	value: 		'',
	index:		0,
	options: 	null,
	parameters:	'',
	link: 		'',
	date:		null,
	multiple:	false,
	multipleValue:false,
/**
 * new Select([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance de [[Select]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `link` (`String`): Lien du script PHP pour la récupération de la liste de données.
 * * `parameters` (String): Paramètre à passer au script PHP.
 * * `button` (`Boolean`) : Si la valeur est vrai le bouton sera affiché.
 * * `value` (`String`) : Valeur du champs.
 * * `name` (`String`) : Nom du champs.
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 *
 **/
	initialize:function(obj){
				
		var options = {
			auto:		false,
			link:		$WR().getGlobals('link'),
			parameters:	'',
			button:		true,
			value:		'',
			name:		'',
			multiple:	false,
			size:		'normal'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		var sender = this;
		//#pragma region Instance
		//
		// 
		//
		this.SpanTextKeyUp = new Node('span', {className:'wrap-keyup'});
		this.appendChild(this.SpanTextKeyUp);
		this.SpanTextKeyUp.hide();
		//
		//-Input
		//
		this.Input.readOnly = 	'readonly';
		this.Input.name =  		options.name;
		this.Input.auto =		false;
		
		if(options.multiple){
			options.catchWheel = false;
			this.ListBox = new ListBox(options);
			this.Popup.appendChild(this.ListBox);
			this.multiple = true;
			
			this.ListBox.on('draw', function(line){
				this.Observer.fire('select:draw', line, line.getData());
			}.bind(this));
			
			this.ListBox.on('change', function(evt, box){
				this.Value();
				this.Observer.fire('select:change', box, box.getData());
			}.bind(this));
		}
		//
		// ProgressBar
		//
		this.ProgressBar = 	new ProgressBar(0,4, '');
		this.ProgressBar.hide();
		//#pragma endregion Instance
		this.appendChild(this.ProgressBar);
		//
		//-SimpleMenu
		//
		this.SimpleButton.setIcon('1down-mini-blue');

		//#pragma region Event		
		this.Input.on('keypress', this.onKeyPress.bind(this));
		this.Input.on('keyup', this.onKeyUp.bind(this));			
						
		this.Observer.on('show', function(){			
			if(this.Popup.Body().select('.line-element.item').length == 0 && this.Popup.Body().select('.linebox').length == 0) this.Hidden(true);
			else{
				this.Popup.ScrollBar.refresh();
				if(!this.multiple){
					this.Popup.ScrollBar.scrollTo(this.CurrentSibling);
				}
			}
		}.bind(this));
		//#pragma endregion Event
				
		this.link = 		options.link;
		this.parameters =  	options.parameters;
		this.date = 		new Date();
		
		if(options.size == 'large'){
			this.Large(true);
		}
		
		if(options.value != '') {
			this.Value(options.value);
		}
		
		if(!options.button)	{
			this.addClassName('no-button');
		}
		
		this.Input.submit = function(){
			var instance = this.parentNode.parentNode;
			instance.setText(instance.Value());
		};
		this.Input.getInstance = function(){
			return this.parentNode.parentNode;
		};
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
		this.ProgressBar =	null;
				
		try{this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});}catch(er){}
	},
	
	clear:function(){
		this.Popup.clear();
		return this;
	},
/**
 * Select#observe(eventName, callback) -> Select
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` sur le nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * Le champ d'auto-complétion prend en charge un certain nombre d'événement personnalisé, comme suivant :
 *
 * * `change` : Appelle la fonction lors du changement de valeur du champ.
 * * `complete` : Appelle la fonction lorsque la recherche est terminé (en base de données).
 * * `draw` : Appelle la fonction lorsque la liste est en cours de contruction.
 *
 **/
	observe:function(eventName, handler){
		switch(eventName){
			case "complete":
			case "change": 
			case "draw":
							this.Observer.observe('select:'+eventName, handler); 
							break;
			case 'blur':
			case 'focus':	this.Input.on(eventName, handler.bind(this));
							break;
			default: Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * Select#fire(eventName) -> Select
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode déclenche un événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * Le champ d'auto-complétion prend en charge un certain nombre d'événement personnalisé, comme suivant :
 *
 * * `change` : Appelle la fonction lors du changement de valeur du champ.
 * * `complete` : Appelle la fonction lorsque la recherche est terminé (en base de données).
 * * `draw` : Appelle la fonction lorsque la liste est en cours de contruction.
 *
 **/
	fire:function(eventName){
		switch(eventName){
			case "complete":
			case "change": 
			case "draw":
							this.Observer.fire('select:'+eventName); 
							break;
			case 'blur':
			case 'focus':	this.Input.fire(eventName);
							break;
			default: Event.fire(this, eventName);
		}
		return this;
	},
/**
 * Select#load() -> Select
 *
 * Cette méthode charge les données de la liste depuis une base de données si `Select#link` est configuré.
 **/	
	load: function(){
		
		if(this.link != ''){
			
			var globals = 		$WR().getGlobals('parameters');
			var parameters = 	this.parameters + (globals == '' ? '' : '&' + globals);
			
			this.ProgressBar.setProgress(0, 4, '');
			this.ProgressBar.show();
						
			new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				
				onCreate:function(result){
					this.ProgressBar.setProgress(1, 4, '');
					result.ID = 0;
				}.bind(this),
				
				onLoading:function(){
					this.ProgressBar.setProgress(2, 4, '');
				}.bind(this),
				
				onLoaded:function(){
					this.ProgressBar.setProgress(3, 4,'');
				}.bind(this),
				
				onInteractive:function(){
					this.ProgressBar.setProgress(4, 4, '');
				}.bind(this),
				
				onSuccess:function(){
					this.ProgressBar.setProgress(4, 4, '');
				}.bind(this),	
				
				onComplete: function(result){
					
					this.ProgressBar.setProgress(4, 4, '');
					this.ProgressBar.hide();
										
					var obj = result.responseText.evalJSON();
									
					obj = $A(obj);
					
					this.setData(obj);
										
					this.Observer.fire('select:complete', obj);
						
				}.bind(this)
			});
		}

		return this;
	},
/**
 * Select#draw(array) -> Select 
 * - array (Array): Tableau de données.
 *
 * Construit la liste en fonction du tableau de données.
 **/
	draw: function(array){
		
		if(!this.multiple){
			this.Popup.Body().select('.line-element.item').each(function(e){
				e.stopObserving('mouseup');
				e.data = null;
			});
			
			this.Popup.clear();
			
			if(Object.isUndefined(array)) return;
			if(Object.isUndefined(array.length)) return;
			if(array.length == 0) return;
			
			var sender = this;
			
			function onMouse(evt){
				sender.onClickLine(evt, this);
			}
			
			for(var i = 0, y = 0; i < array.length; i += 1){
				
				if(Object.isString(array[i])){
					var line = new LineElement(array[i], true);
				}else{
				
					if(Object.isUndefined(array[i].text)) {
						var line = new LineElement('', true);
					}else{
						
						var line = new LineElement(array[i].text);
						
						if(Object.isUndefined(array[i].value)){
							array[i].value = array[i].text;
						}
						
						if(array[i].icon){
							line.setIcon(array[i].icon);
						}
						
						if(array[i].color){
							line.setColor(array[i].color);
						}
						
						if(array[i].level){
							line.Title().css('padding-left', 15 * array[i].level);
						}
						
						if(array[i].selected){
							this.Value(array[i].value);
						}
					}
				}
				
				if(y == 0){
					this.CurrentSibling = line;
				}
					
				if(!array[i].group){
					line.index = y;
					line.addClassName('item');
					line.addClassName('line-altern-' + (y % 2));
					line.observe('mouseup', onMouse);
					line.setData(array[i]);
					y++;
				}else{
					line.addClassName('group');
				}
				
				this.Observer.fire('select:draw', line, array[i]);
				
				this.Popup.appendChild(line);				 
			}
			
		}else{
			this.ListBox.setData(array);
			
			if(this.multipleValue){
				this.Value(this.multipleValue);
			}
		}
		
		this.Popup.moveTo(this);
				
		return this;
	},
/**
 * Select#stopObserving(eventName, callback) -> Select
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/
	stopObserving:function(eventName, handler){
		switch(eventName){
			case "complete":
			case "change": 
			case "draw":
							this.Observer.stopObserving('select:'+eventName, handler); 
							break;
			case 'blur':
			case 'focus':	this.Input.stopObserving(eventName, handler);
							break;
			default: 		Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
/**
 * Select#selectedIndex(it) -> Boolean | Number
 * - it (Number): Indice de l'élément à selectionner.
 *
 * Cette méthode mes par défaut une valeur du tableau de données en fonction de l'itérateur `it` passé en paramètre.
 * 
 * <p class="note">Implémenté depuis la version 2.1RC2</p>
 **/
	selectedIndex: function(it){
		var options = this.Popup.Body().select('.line-element.item');
		
		if(options.length == 0){
			return false;
		}
		
		if(it < options.length){
			this.Current(options[it]);
		}
		
		return Object.isElement(this.Current()) ? this.Current().index : false;
	},
/*
 * Select#onClickLine(evt, line) -> void
 *
 * Gestion de l'événement click. Cette événement intervient lors du click sur la ligne de la liste.
 **/
	onClickLine: function(evt, line){
		if(this.Popup.ScrollBar.isMove()) return;
		
		this.Current(line);
		
		Event.stop(evt);
				
		this.hide();
		
		this.Observer.fire('select:change', this.Input.value, this.Current(), this.Current().data, this);	
	},
/**
 * Select#Current() -> Node
 **/
	Current: function(newcurrent){
		
		if(!Object.isUndefined(newcurrent)){
			if(this.CurrentSibling) this.CurrentSibling.Selected(false);
			
			this.CurrentSibling = newcurrent;
			this.CurrentSibling.Selected(true);
			
			this.Popup.ScrollBar.scrollTo(this.CurrentSibling);
			
			this.setText(this.CurrentSibling.getText().unescapeHTML());
			
			if(!Object.isUndefined(this.CurrentSibling.data.value)){
				this.value = this.CurrentSibling.data.value;
			}else{
				this.value = this.CurrentSibling.data.text;
			}
		}
		
		return this.CurrentSibling;
	},
/*
 * Select#onKeyUp() -> void
 **/		
	onKeyUp: function(evt){
		evt.stop();
				
		switch(Event.getKeyCode(evt)){
			
			case 13:
				if(this.CurrentSibling){
					this.onClickLine(evt, this.CurrentSibling);
					return false;
				}
				break;
			
			case 40:
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.next() ? this.CurrentSibling.next() : this.CurrentSibling);
				}
				break;
				
			case 38:
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.previous() ? this.CurrentSibling.previous() : this.CurrentSibling);
				}
				break;
				
		}

	},
/*
 *
 **/
	onKeyPress: function(evt){
		if(Event.getKeyCode(evt) == 0) return;
		
		if(this.Input.readOnly){
					
			if(this.date.secondsDiff(new Date()) > 2){
				this.char = Event.getChar(evt);	
				this.date = new Date();
				
				this.SpanTextKeyUp.hide();
				
				if(this.char === false) {
					return;
				}
			}else{
				var char = Event.getChar(evt);
				
				if(char === false){
					return;		
				}
				
				this.char += char;
				this.date = new Date();
				
				this.SpanTextKeyUp.innerHTML = this.char;
				this.SpanTextKeyUp.show();
				
				if(this.SpanTextKeyUp.timer){
					this.SpanTextKeyUp.timer.stop();
				}
				
				this.SpanTextKeyUp.timer = new Timer(function(){
					this.SpanTextKeyUp.hide();
				}.bind(this), 2, 1);
				this.SpanTextKeyUp.timer.start();
			}
			
			var options = this.Popup.Body().select('.line-element.item');
			
			for(var i = 0; i < options.length; i++){
				var e = 	options[i];
				var text =  e.getData().text == '' ? e.getText() :  e.getData().text;
				
				if(this.char.toLowerCase().sanitize() == (text).slice(0, this.char.length).toLowerCase().sanitize()){
					
					this.Current(e);
					
					if(this.Hidden()){
						this.Observer.fire('select:change', this.Input.value, this.Current(), this.Current().data, this);
					}
					
					return;	
				}
			}
			
			this.char = '';
			
			if(this.SpanTextKeyUp.timer && Object.isFunction(this.SpanTextKeyUp.timer.stop)){
				this.SpanTextKeyUp.timer.stop();
				this.SpanTextKeyUp.hide();
			}
			
		}else{//autocompletion à partir du texte
			
			if(this.CurrentSibling) {
				this.CurrentSibling.Selected(false);
			}
			this.CurrentSibling = false;
			
			var options = this.Popup.Body().select('.line-element.item');
			
			for(var i = 0; i < options.length; i++){
				var e = 	options[i];
				var text =  e.getData().text == '' ? e.getText() :  e.getData().text;
				
				if(this.Input.value.toLowerCase() == text.slice(0, this.Input.value.length).toLowerCase()){
							
					this.CurrentSibling = e;
					this.CurrentSibling.Selected(true);
					
					this.Popup.ScrollBar.scrollTo(this.CurrentSibling);
					
					return;	
				}
			}
		}
	},
/**
 * Select#Value([value]) -> String
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
 *     var c = new Select();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Select();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		
		if(!Object.isUndefined(value)){
			
			if(!this.multiple){
			
				this.Input.value = 	'' + value;
				this.value = 		value;
				
				var options = this.Popup.Body().select('.line-element.item');
				
				for(var i = 0, len = options.length; i < len; i++){
					var e = 	options[i];
					var value = ('' + e.getData().value).toLowerCase();
					var text =	('' + e.getData().text).toLowerCase();
					
					try{
						if(!Object.isUndefined(value)){
									
							if(this.value == value || this.Input.value.toLowerCase() == value){
								this.Current(e);
								return this.value;
							}
							
							if(this.Input.value.toLowerCase() == text) {
								this.Current(e);
								return this.value;
							}
							
						}else{
							if(this.Input.value.toLowerCase() == text) {
								this.Current(e);
								return this.value;
							}
						}
					}catch(er){}	
				}
			}
		}
		
		if(this.multiple){
			
			if(Object.isUndefined(value)){
				var array = this.ListBox.Value();
			}else{
				var array = this.ListBox.Value(Object.isArray(value) ? value : [value]);
				this.multipleValue = value;
			}
			
			this.Input.value = '';
			
			this.ListBox.select('.linebox').each(function(e){
				
				if(e.Checked()){
					this.Input.value += e.getData().text +'; ';
				}
				
			}.bind(this));
			
			return array;
		}
		
		
		return this.value;
	},
/**
 * Select#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new Select();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new Select();
 *     c.Text('mon text');
 *     alert(c.Text()); //mon text
 * 
 **/	
	setText: function(txt, bool){
		if(!Object.isUndefined(txt)){
			this.Input.value = txt;
		}
		return this;
	},
	
	getText: function(){
		return this.Input.value;
	},
	
	Text: function(txt){
		if(!Object.isUndefined(txt)){
			this.Input.value = txt;
		}
		return this.Input.value;
	},
/**
 * Select#getData() -> Array
 *
 * Cette méthode retourne l'ensemble des données stockés dans l'instance `Select`.
 **/
 	getData: function(){
		var array = [];
		
		if(!this.multiple){
			this.Popup.Body().select('.line-element.item').each(function(e){
				if(Object.isFunction(e.getData)){
					array.push(e.getData());	
				}
			});
		}else{
			this.Popup.Body().select('.w-line.linebox').each(function(e){
				if(Object.isFunction(e.getData)){
					array.push(e.getData());	
				}
			});
		}
		
		return array;
	},
/**
 * Select#getSelectedData() -> Object
 *
 * Retourne l'ensemble de l'objet stocké et ciblé dans l'instance. 
 * Par défaut, si aucune données n'a été assigné via la méthode Select#setData(),
 * la méthode retourne la valeur du champs (similaire à Select#Text()).
 **/
	getSelectedData: function(){
		if(this.multiple){
			return this.ListBox.getChecked();	
		}
		if(this.Popup.Body().select('.line-element.item').length == 0) return this.getText();
		return this.CurrentSibling.data;
	},
/** 
 * Select#getValue() -> String
 * - value (String): Valeur à assigner.
 *
 * Retourne la valeur du champs de saisie.
 **/
	getValue: function(){
		return this.Value();
	},
/**
 * Select#setValue(value) -> Select
 * - value (String): Valeur à assigner.
 *
 * Assigne une valeur au champs de saisie.
 **/	
	setValue: function(value){
		this.Value(value);
		return this;
	},
/**
 * Select#setData(array) -> Select
 * - array (Array): Tableau de données.
 *
 * Cette méthode ajoute une liste de données à l'instance [[Select]].
 **/
	setData: function(array){
		
		if(Object.isArray(array)){
			
			this.draw(array);
			
			if(this.getText() != ''){
				this.setText(this.getText());	
			}
			
			if(!Object.isUndefined(this.Value())){//on réasigne la valeur afin de pointer la bonne ligne
				this.Value(this.Value());
			}
		}
		return this;
	},
/**
 * Select#setMaxLength(size) -> Select
 * - size (Number): Nombre de caractère maximum saisissable.
 *
 * Cette méthode indique le nombre de caractère maximal saisissable lorque le champ
 * de saisie n'est pas en mode `readonly`.
 **/
	setMaxLength:function(length){
		this.Input.maxLength = length;
		return this;
	},
/**
 * Select#setParameters(parameters) -> Select
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/
	setParameters: function(param){
		this.parameters= param;
		return this;
	},
/*
 * Select#setCommand(cmd) -> Select
 * - cmd (String): Commande.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/
	setCommand: function(cmd){
		return this.setParameters(cmd);
	},
/**
 * Select#setLink(link) -> Select
 * - link (String): Lien de la passerelle PHP.
 * 
 * Cette méthode assigne un lien afin de récupérer des données depuis PHP.
 **/
	setLink:function(link, cmd){

		if(Object.isUndefined(link)) return;
		this.link = link;
		
		if(cmd) this.setParameters(cmd);
		return this;
	}	
};
/**
 * Select.Transform(node) -> Select
 * Select.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Select.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises select répondant au critère `selector` en instance [[Select]].
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
 * <h4>Intance à choix unique</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local :</p>
 * 
 *     var select = Select();
 *     select.setData([
 *          {text:'option 1', value:1},
 *          {text:'option 2', value:2},
 *          {text:'option 3', value:3},
 *          {text:'option 4', value:4}
 *     ]);
 *     document.body.appendChild(select);
 *
 * <h4>Instance à choix multiple</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local. L'utilisateur peut choisir une ou plusieurs options dans la liste proposée :</p>
 * 
 *     var select = Select({multiple:true});
 *     select.setData([
 *          {text:'option 1', value:1},
 *          {text:'option 2', value:2},
 *          {text:'option 3', value:3},
 *          {text:'option 4', value:4}
 *     ]);
 *     document.body.appendChild(select);
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Les données sont cette fois-ci récupéré directement depuis un script PHP :</p>
 * 
 *     var select = Select({link:'select.php', parameters:'cmd=getlist'});
 *     //on charge les données avec la méthode load()
 *     select.load();
 *     document.body.appendChild(select);
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>select.php</code></p>
 * </div>
 *
 * <div>
 * <h4>Intance à choix unique</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local :</p>
 * 
 *     <select class="box-select">
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *     </select>
 *
 * <h4>Instance à choix multiple</h4>
 * <p>Cette exemple montre comment créer une instance Select avec une liste de données en local. L'utilisateur peut choisir une ou plusieurs options dans la liste proposée :</p>
 * 
 *     <select class="box-select" multiple="multiple">
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *          <option value="1">option 1</option>
 *     </select>
 *
 * <h4>Instance récupérant des données depuis un serveur</h4>
 * <p>Les données sont cette fois-ci récupéré directement depuis un script PHP :</p>
 * 
 *     <select class="box-select my-select">
 *     </select>
 *     <script>
 *          Extends.after(function(){
 *               $$('.my-select').each(function(select){
 *                    select.setLink('select.php');
 *                    select.setParameters('cmd=getlist');
 *                    select.load();
 *               });
 *          });
 *     </script>
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>select.php</code></p>
 * </div>
 *
 * <div>
 *
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
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 *
 * ##### Select à choix unique
 *
 * <select class="box-select">
 * <option value="1">option 1</option>
 * <option value="2">option 2</option>
 * <option value="3">option 3</option>
 * <option value="4">option 4</option>
 * <option value="5">option 5</option>
 * </select>
 * 
 * ##### Select à choix multiple
 * 
 * <select class="box-select" multiple="multiple">
 * <option value="1">option 1</option>
 * <option value="2">option 2</option>
 * <option value="3">option 3</option>
 * <option value="4">option 4</option>
 * <option value="5">option 5</option>
 * </select> 
 * 
 **/
Select.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var select = 		new Select({multiple:e.multiple});
		select.id = 		e.id;
				
		if(!e.multiple){
			select.title = 		e.title;
		}else{
			select.Input.value = e.title;
		}
		
		select.addClassName(e.className);
		select.removeClassName('box-select');
		e.className = '';
		
		var array = [];
		var index = 0;
		var group = '';
		
		for(var y = 0; y < e.options.length; y++){
			try{
				if(e.options[y].parentNode.tagName.toLowerCase() == 'optgroup'){
					if(group != e.options[y].parentNode.label){
						array.push({text:e.options[y].parentNode.label, group:true}); 
						group = e.options[y].parentNode.label;
					}
				}
			}catch(er){}
						
			array.push({icon:e.options[y].className, level:e.options[y].data('level'), value: e.options[y].value, text:e.options[y].innerHTML, checked:e.options[y].selected, element:e.options[y]});
			
			if(e.options[y].selected){
				index = y;
			}
		}
		
		select.setData(array);
		if(!e.multiple){select.selectedIndex(index);}
		
		e.replaceBy(select);
		e.hide();
		select.appendChild(e);
			
		if(e.multiple){
			select.on('change', function(box){
				box.getData().element.selected = box.Checked();
			});
		}else{
			select.on('change', function(evt){
				e.selectedIndex = this.selectedIndex();
			});
		}
		
		e.getInstance = function(){
			return select;	
		};
		
		select.setData = function(array){
			this.draw(array);
			e.removeChilds();
			for(var i = 0; i < array.length; i++){
				e.appendChild(new Node('option', {value:array[i].value || array[i].text, text:array[i].text}));
			}
			
			return this;
		}.bind(select);
		
		e.removeClassName('box-select');
		
		return select;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(Select.Transform(e));
	});
	
	
	return options;
};