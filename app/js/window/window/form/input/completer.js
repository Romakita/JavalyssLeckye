/** section: Form
 * class InputCompleter < InputPopup
 * Le champs d'auto-complétion permet la saisie d'un mot clef et recherche simultanément une liste de données résultat correspondant à votre saisie
 * Les données peuvent être stocké en local ou depuis une base de données.
 *
 * #### Exemple en local
 *
 * Cette exemple montre comment créer une instance InputCompleter qui utilise une liste de données de Pays en local :
 *
 *     //importation de la librairie des pays.
 *     Import('extends.lang.countries');
 *     //on utilise la méthode Extends.ready pour attendre que le DOM soit complétement chargé
 *     Extends.ready(function(){
 *          var completer = new InputCompleter({minLength:0, delay:0});
 *          completer.setData(Countries.toData());
 *          document.body.appendChild(completer);
 *     });
 * 
 * #### Résultat
 *
 * <input type="text" class="box-input-completer exemple-completer-local" value="" />
 *
 * #### Exemple en client/serveur
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputCompleter recherchant des données situés sur un serveur PHP :</p>
 *
 *     var completer = InputCompleter({parameters:'cmd=getcities', link:'completer.php'});
 *     document.body.appendChild(completer);
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>completer.php</code></p>
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputCompleter avec HTML5 (depuis la version 4.8) :</p>
 *
 *     <input type="box-input-completer" data-link="completer.php" data-parameters="cmd=getcities" />
 *
 * <p>Cette exemple montre comment créer une instance InputCompleter recherchant des données situés sur un serveur PHP :</p>
 * 
 *     <input type="box-input-completer my-completer" />
 *     <script>
 *          Extends.after(function(){
 *               $$('.my-completer').each(function(completer){
 *                    completer.setLink('completer.php');
 *                    completer.setParameters('cmd=getcities');
 *               });
 *          });
 *     </script>
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>getcities.php</code></p>
 * </div>
 * <div>
 * <p>Ce script PHP retourne une liste de données vers le completer :</p>
 * 
 *     <?php
 *     $cities = array(
 *          array(
 *               'value'=>'1',
 *               'text'=>'L\'Abergement Clémenciat - 01400'
 *          ),
 *          array(
 *               'value'=>'2',
 *               'text'=>'L\'Abergement-de-Varey - 01640'
 *          ),
 *          array(
 *               'value'=>'3',
 *               'text'=>'Amareins - 01090'
 *          ),
 *          array(
 *               'value'=>'4',
 *               'text'=>'Ambérieu-en-Bugey - 01500'
 *          ),
 *          array(
 *               'value'=>'5',
 *               'text'=>'Ambérieux-en-Dombes - 01330'
 *          ),
 *     );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getcities':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['City'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance completer
 *               echo json_encode($final);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 *
 * </div>
 * </div>
 *
 **/ 
var InputCompleter = Class.from(InputPopup);

InputCompleter.prototype = {
	__class__: 	'inputcomplete',
	className:	'wobject input input-button input-popup input-completer',
/**
 * InputCompleter#minLength -> Number
 * Indique le nombre de caractère minimum avant la recherche en base de données.
 **/
	minLength: 	2,
/*
 * InputCompleter#delay -> Number
 * Temps d'attente avant de lancer une recherche.
 **/
	delay: 		0.5,
	timer:		null,
/*
 * InputCompleter#value -> String
 * Valeur du champ d'auto-completion.
 **/
 	value: 		'',
/*
 * InputCompleter#readOnly -> Boolean
 * Indique si le champs peut pendre des valeurs autres que celle proposé.
 **/
 	readOnly:	false,
/*
 * InputCompleter#showList -> Boolean
 * Affiche ou pas la liste complete en fonction du mot.
 **/
 	showList:	false,
/*
 * InputCompleter#exclude -> Boolean
 * Le saisie final doit différer de la liste de choix.
 **/
 	exclude:	false,
	hasFocus:	false,
	create:		false,
	loading:	false,
	
	options: 	null,
	parameters:	'',
	ID_AJAX:	0,
	link: 		'',
	local:		false,
/**
 * new InputCompleter([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance d'[[InputCompleter]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `button` (`Boolean`): Si la valeur est fausse le bouton sera caché.
 * * `delay` (`Boolean`): Temps d'attente avant le lancement de la recherche vers PHP.
 * * `link` (`String`) : Lien du serveur PHP.
 * * `minLength` (`Number`) : nombre de caractère minimum avant le lancement de la recherche.
 * * `parameters` (`String`): paramètres à passer au script PHP.
 * * `readOnly` (`Boolean`) : En mode `readonly` l'utilisateur devra impérativement insérer un mot appartenant à la liste.
 * * `showList` (`Boolean`) : Si la valeur est vrai, la liste complète sera chargé (peut prendre du temps selon la taille de la liste).
 * * `zeroShow` (`Boolean`): Uniquement en mode local, ce paramètre active l'affichage de liste complète si la recherche échoue. (par défaut n'affiche aucun résultat).
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 *
 **/
	initialize:function(obj){
		//#pragma region Instance
		var options = {
			auto:		false,
			minLength: 	2,
			delay:		0.5,
			link:		$WR().getGlobals('link'),
			exclude:	false,
			readOnly:	false,
			zeroShow:	false,
			showList:	false,
			button:		true,
			parameters:	'',
			value:		'',
			local:		false,
			size:		'normal',
			sync:		false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.options = [];
		
		this.SimpleButton.setIcon('search');	
		//
		// ProgressBar
		//
		this.ProgressBar = 	new ProgressBar(0,4, '');
		this.ProgressBar.hide();
		//#pragma endregion Instance
		this.appendChild(this.ProgressBar);

		//#pragma region Event		
		this.Input.on('keyup', this.onKeyUp.bind(this));
		
		this.Observer.observe('show', this.onShow.bind(this));
				
		this.Input.on('focus', function(){
			if(this.readOnly){
				this.backup = 		{text:this.getText(), value:this.Value()};
				this.value =		null;
				this.Input.value = 	'';
			}
			this.hasFocus = true;
		}.bind(this));
		
		this.Input.on('blur', function(evt){
			if(this.readOnly){
				if(this.Input.value == '' || this.value == null){
					this.value = 		this.backup.value;
					this.Input.value = 	this.backup.text;
				}
			}
			
			this.hasFocus = false;
			
			if(!this.loading && this.create){
				this.Observer.fire('completer:create', this);
				this.create = false;
			}
				
			if(this.Input.value == ''){
				this.Observer.fire('completer:empty', this);	
			}
				
			this.Observer.fire('completer:blur', evt, this);
		}.bind(this));
			
		//#pragma endregion Event
		this.Input.auto =	options.auto;
		this.minLength = 	options.minLength;
		this.delay = 		options.delay;
		this.link = 		options.link;
		this.sync = 		options.sync;
		this.timer =		new Timer(this.onTick.bind(this), this.delay);
		this.parameters =  	options.parameters;
		
		this.Exclude(options.exclude);
		this.ZeroShow(options.zeroShow);
		this.ShowList(options.showList);
		this.ReadOnly(options.readOnly);
		this.Value(options.value);
						
		//if(options.readOnly) this.readOnly(true);
		if(options.size == 'large'){
			this.Large(true);
		}
		
		if(!options.button)	this.addClassName('no-button');
		
		this.Input.getInstance = function(){
			return this.parentNode.parentNode;
		};
	},
	
	destroy: function(){
		
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.Observer.destroy();
				
		this.options = 		null;
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
/*
 * InputCompleter#onShow() -> void
 **/
	onShow:function(){
		this.Popup.hide();
		this.search();
	},
/**
 * InputCompleter#observe(eventName, callback) -> InputCompleter
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
 * * `create` : Appelle la fonction lorsque le champs contient une valeur n'étant pas dans la liste de choix retournées par le Completer.
 * * `complete` : Appelle la fonction lorsque la recherche est terminé (en base de données).
 * * `empty`: Appelle la fonction lorsque le champs de saisie est vide.
 * * `draw` : Appelle la fonction lorsque la liste est en cours de contruction. 
 * * `keyup` : Appelle la fonction lorsque l'utilisateur relève une touche du clavier.
 *
 **/
	observe:function(eventName, handler){
		switch(eventName){
			case "empty":
			case "create":
			case "hide":
			case "show":
			case "change": 		
			case "complete":	
			case "draw":		
			case 'keyup':
			case 'blur':
			case "send":		this.Observer.observe('completer:'+eventName, handler);
								break;
			case 'keydown':
			case 'keypress':
			case 'focus':		this.Input.on(eventName, handler.bind(this));
								break;
					
			default: Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * InputCompleter#draw(array) -> InputCompleter 
 * - array (Array): Tableau de données.
 *
 * Construit la liste en fonction du tableau de données.
 **/
	draw: function(array){
		
		if(this.exclude){
			this.Flag.hide();	
		}
		
		this.create = true;
		
		if(array.length == 0) {		
			this.Hidden(true);
			
			if(this.zeroShow){
				this.search(true);	
			}
			
			if(!this.hasFocus){
				this.Observer.fire('completer:create', this);
				this.create = false;
			}
			
			return;
		}
		
		if(array.length == 1 && this.exclude){
			this.Flag.setText($MUI('Le terme recherché existe déjà') + '.').color('red').show(this);
		}
				
		this.Popup.clear();
		this.Popup.show();
		this.hidden_ = false;
		
		this.Observer.fire('completer:show');	
	
		var sender = this;
			
		function onMouse(evt){
			sender.create = false;
			sender.onClickLine(evt, this);	
		}
		
		for(var i = 0; i < array.length; i += 1){
			
			if(Object.isString(array[i])){
				var line = new LineElement(array[i], true);
				if(this.Value() == array[i]) line.Selected(true);
			}else{
			
				if(Object.isUndefined(array[i].text)) {
					var line = new LineElement('', true);
				}else{

					var line = new LineElement(array[i].text);
					if(array[i].icon){
						line.setIcon(array[i].icon);
					}
					if(array[i].color){
						line.setColor(array[i].color);
					}
				}
				
				if(this.Value() == array[i].text){
					line.Selected(true);
					this.CurrentSibling = line;
				}
			}
			
			if(i == 0){
				this.CurrentSibling = line;	
			}
			
			line.addClassName('line-altern-' + (i % 2));
			line.data = array[i];
			
			this.Observer.fire('completer:draw', line, array[i]);
			
			line.observe('mouseup', onMouse);
			
			this.Popup.appendChild(line);	
						 
		}
		
		this.Popup.moveTo(this);
		this.Popup.refresh();
		
		return this;
	},
/**
 * InputCompleter#stopObserving(eventName, callback) -> InputCompleter
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/
	stopObserving:function(eventName, handler){
		
		switch(eventName){
			case 'keydown':
			case 'keypress':
			case "focus": 		
								this.Input.stopObserving(eventName, handler); 
								break;
			case 'hide':
			case 'show':
			case "draw":
			case "keyup":
			case 'create':
			case "complete":
			case "blur":
			case "empty":
			case "change": 		this.Observer.stopObserving('completer:' + eventName, handler); 
								break;
			default: 			Event.stopObserving(this, eventName, handler);
		}
		
		return this;
	},
/**
 * InputCompleter#search() -> void
 *
 * Lance une recherche sur le contenu saisi.
 **/
	search: function(bool){

		bool = Object.isUndefined(bool) ? false : bool;

		if(!this.local){

			if(this.Input.value.length < this.minLength && !bool){
				this.Hidden(true);
				return;
			}
			
			var obj = {
				cmd: 		this.parameters,
				parameters:	null,
				value:		this.Input.value
			};
			
			this.Observer.fire('completer:send', obj); 
			
			var globals = 		$WR().getGlobals('parameters');
			var parameters = 	"word=" + encodeURIComponent(bool ? '' : this.Input.value);
			parameters +=		this.parameters == '' ? '' : ('&'+this.parameters);
			parameters +=		globals == '' ? '' : ('&' + globals);		
			
			if(obj.parameters != null) parameters += "&" + obj.parameters;
			
			var sender = this;
			
			this.ProgressBar.setProgress(0, 4, '');
			this.ProgressBar.show();
			
			if(this.ajax && this.ajax.transport){
				if(Object.isFunction(this.ajax.transport.abort)){
					this.ajax.transport.abort();
				}
			}
			
			this.loading = true;
			
			this.ajax = new Ajax.Request(this.link, {
				method:		'post',
				parameters: parameters,	
				
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
					this.ajax = null;
					this.ProgressBar.setProgress(4, 4, '');
										
					this.ProgressBar.hide();
					this.onComplete(result);
					
					this.loading = false;
				}.bind(this)
			});
			
		}else{
			
			if(!this.options) return;
			if(this.options.length > 0){
								
				if(this.getText() == ''){
					this.draw(this.options);
					return;
				}
				
				var array = [];
				
				for(var i = 0; i < this.options.length; i +=1){
					var options = this.options[i];
					
					if(Object.isString(options)){
						
						var reg = new RegExp(this.getText().toLowerCase().sanitize('-'), 'g');
						if(options.toLowerCase().sanitize('-').match(reg)) {
							array.push({text:this.options});
							break;
						}
							
					}else{
						for(var key in options){
							if(Object.isString(options[key])){
								var reg = new RegExp(this.getText().toLowerCase().sanitize('-'), 'g');
								
								if(options[key].toLowerCase().sanitize('-').match(reg)) {
									array.push(this.options[i]);
									break;
								}
							}
						}
					}
					
				}						
				
				this.draw(array);
			}
			
		}
	},
/**
 * InputCompleter#MinLength(minChar) -> Number
 * - minChar (Number): Nombre minimumde caractère à saisir avant d'effectuer une recherche.
 *
 * Cette méthode indique le nombre minimum de caractère avant d'effectuer une recherche.
 *
 * <p class="note">Implémenté depuis la version 3.0</p>
 **/
 	MinChar:function(nb){
		if(!Object.isUndefined(nb)){
			this.minChar = nb;	
		}
		return this.minChar;
	},
/**
 * InputCompleter#ReadOnly(bool) -> Boolean
 * - bool (Boolean): Valeur changeant l''etat du champs.
 *
 * Cette méthode rend obligatoire le choix d'un mot dans la liste de recherche. 
 * Si aucun résultat n'est trouvé en fonction du mot, alors le contenu du champs
 * sera réinitialisé.
 *
 * <p class="note">Implémenté depuis la version 2.1RC2</p>
 **/
	ReadOnly: function(bool){
		if(!Object.isUndefined(bool)){
			this.readOnly_ = bool;
			
			if(bool){
				this.backup = "";	
			}
		}
		return this.readOnly;
	},
/**
 * InputCompleter#Exclude(bool) -> Boolean
 * - bool (Boolean): Valeur changeant l''etat du champs.
 *
 * Cette méthode impose que la saisie final soit différent de la liste de choix proposé.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
 	Exclude:function(bool){
		if(!Object.isUndefined(bool)){
			this.exclude = bool;
			
			if(bool && Object.isUndefined(this.Flag)){
				this.Flag = new Flag();
				this.Flag.setType(FLAG.RIGHT);
				this.appendChild(this.Flag);
			}
		}
		
		return this.exclude;
	},
/**
 * InputCompleter#ShowList(bool) -> Boolean
 * - bool (Boolean): Valeur changeant l''etat du champs.
 *
 * Si la valeur `bool` est vrai alors l'action du clique sur le bouton du completer
 * affichera la liste complete sans le mot rechercher (comportement d'un Select).
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	ShowList: function(bool){
		if(!Object.isUndefined(bool)){
			this.showList = bool
		}
		return this.showList;
	},
/**
 * InputCompleter#ZeroShow(bool) -> Boolean
 * - bool (Boolean): Valeur changeant l''etat du champs.
 *
 * Cette méthode, si la `bool` est vrai, affichera la liste complète si aucune correspondance n'est trouvé.
 * 
 * <p class="note">Implémenté depuis la version 2.1RTM</p>
 **/
	ZeroShow: function(bool){
		if(!Object.isUndefined(bool)){
			this.zeroShow = bool
		}
		return this.zeroShow;
	},
/**
 * InputCompleter#selectedIndex(it) -> InputCompleter
 * - it (Number): Indice de l'élément à selectionner.
 *
 * Cette méthode mes par défaut une valeur du tableau de données en fonction de l'itérateur `it` passé en paramètre.
 * 
 * <p class="note">Implémenté depuis la version 2.1RC2</p>
 **/
	selectedIndex: function(it){
		
		if(it >= 0 && it < this.options.length){
			
			if(!Object.isUndefined(this.options[it].text)){
				this.Input.value = this.options[it].text;
			}
			
			if(!Object.isUndefined(this.options[it].value)){
				this.value = this.options[it].value;
			}
		
		}
		return this;
	},
/*
 * InputCompleter#onComplete() -> void
 **/
	onComplete: function(result){
		
		var obj = result.responseText.evalJSON(result.responseText);	
			
		this.Observer.fire('completer:complete', obj, this);
		
		this.draw(this.options = obj);
	},
/*
 * InputCompleter#onClickLine() -> void
 **/
	onClickLine: function(evt, line){
			
		if(this.Popup.ScrollBar.isMove()) return;
		
		this.Current(line);
		
		Event.stop(evt);
				
		try{
			this.hide();
		}catch(er){}
		
		this.Observer.fire('completer:change', this.Input.value, this.Current(), this.Current().data, this);	
	},
/**
 * InputCompleter#Current() -> Node
 **/
	Current: function(newcurrent){
		
		if(!Object.isUndefined(newcurrent)){
			if(Object.isElement(newcurrent)){
				if(this.CurrentSibling) this.CurrentSibling.Selected(false);
			
				this.CurrentSibling = newcurrent;
				this.CurrentSibling.Selected(true);
				
				this.Popup.ScrollBar.scrollTo(this.CurrentSibling);
			
				this.setText(this.CurrentSibling.getText());
				
				if(!Object.isUndefined(this.CurrentSibling.data.value)){
					this.value = this.CurrentSibling.data.value;
				}else{
					this.value = this.CurrentSibling.data.text;
				}
			}else{
				if(!Object.isUndefined(newcurrent)){
					this.value = newcurrent.value;
				}else{
					this.value = newcurrent.text;
				}
			}
		}
		
		return this.CurrentSibling;
	},
/*
 * InputCompleter#onKeyUp() -> void
 **/	
	onKeyUp: function(evt){
		evt.stop();
		
		this.timer.stop();
		
		this.Observer.fire('completer:keyup', evt, this.Input.value);
				
		if(this.Input.value.length < this.minLength) {
			this.Hidden(true);	
			return
		};
		
		switch(evt.keyCode){
			case 13:
				if(!this.Hidden()){
					if(this.CurrentSibling){
						this.onClickLine(evt, this.CurrentSibling);
					}
				}else{
					this.search();	
				}
				break;
			case 40:
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.next() ? this.CurrentSibling.next() : this.CurrentSibling);
				}
				break;
			case 37:break;
			case 38:
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.previous() ? this.CurrentSibling.previous() : this.CurrentSibling);
				}
				break;	
			default:
				this.timer.start();
				break;		
		}
		
		return false;
	},
/*
 * InputCompleter#onTick() -> void
 **/
	onTick: function(){
		this.timer.stop();
		this.search();
	},
/**
 * InputCompleter#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new InputCompleter();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var btn = new InputCompleter();
 *     c.Text('mon text');
 *     alert(c.Text()); //mon text
 * 
 **/
 
/**
 * InputCompleter#Value([value]) -> String
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
 *     var c = new InputCompleter();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new InputCompleter();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		if(!Object.isUndefined(value)){
			this.Input.value = value;
			this.value = value;
			
			if(this.options.length > 0 && !Object.isUndefined(this.options[0].value)){

				for(var i = 0; i < this.options.length; i++){
					if(this.options[i].value == value){
						this.Current(this.options[i]);
						break;	
					}
				}
				
			}
		}
		
		return this.sync ? this.Input.value : this.value;
	},
/** 
 * InputCompleter#getValue() -> String
 * - value (String): Valeur à assigner.
 *
 * Retourne la valeur du champs de saisie.
 **/
	getValue: function(){
		return this.Value();
	},
/**
 * InputCompleter#setValue(value) -> InputCompleter
 * - value (String): Valeur à assigner.
 *
 * Assigne une valeur au champs de saisie.
 **/	
	setValue: function(value){
		this.Value(value);
		return this;
	},
/**
 * InputCompleter#setDelay(delay) -> InputCompleter
 * - delay (Number): Delai avant de lancer la recherche.
 *
 * Cette méthode assigne un nouveau délai après la fin de saisie d'un caractère pour lancer une recherche.
 **/	
	setDelay: function(delay){
		this.delay = delay;
		this.timer = new Timer(this.onTick.bind(this), this.delay);	
		return this;
	},
/**
 * InputCompleter#getData() -> Array
 *
 * Cette méthode retourne la liste de données de l'instance [[InputCompleter]].
 **/
	getData: function(data){
		return this.options;
	},
/**
 * InputCompleter#setData(array) -> InputCompleter
 * - array (Array): Tableau de données.
 *
 * Cette méthode ajoute une liste de données à l'instance [[InputCompleter]].
 **/
	setData: function(data){
		this.local = 	true;
		this.options = 	data;
		return this;
	},
/*
 * InputCompleter#setMaxLength(length) -> InputCompleter
 * - length (Number): Nombre maximal de caractère saisissable dans le champs.
 *
 * Limite le nombre de caractère que l'utilisateur peut saisir dans le champs.
 **/
	setMaxLength:function(length){
		this.Input.maxLength = length;
		return this;
	},
/*
 * InputCompleter#setMinLength(length) -> InputCompleter
 * - length (Number): Nombre minimal de caractère avant de lancer une recherche.
 *
 * Cette méthode assigne le nombre de minimal de caractère que l'utilisateur doit saisir avant que le completer effectue une recherche.
 **/
	setMinLength:function(length){
		this.minLength = length;
		return this;
	},
/**
 * InputCompleter#setParameters(parameters) -> ListBox
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/
	setParameters: function(param){
		this.parameters = param;
		return this;
	},
/*
 * InputCompleter#setCommand(cmd) -> InputCompleter
 * - cmd (String): Commande à assigner.
 *
 * Assigne une commande à envoyer vers PHP pour lors de la recherche de résultat en base de données.
 **/
	setCommand: function(cmd){
		if(Object.isUndefined(cmd)) return;
		this.parameters = 'cmd='+cmd;
		return this;
	},
/**
 * InputCompleter#setLink(link) -> InputCompleter
 * - link (String): Lien du script PHP à interroger.
 *
 * Assigne une commande à envoyer vers PHP pour lors de la recherche de résultat en base de données.
 **/
	setLink:function(link, cmd){
		if(Object.isUndefined(link)) return;
		this.link = link;
		return this;
	}
};
/**
 * InputCompleter.Transform(node) -> Select
 * InputCompleter.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputCompleter.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[InputCompleter]].
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
 * <p>Cette exemple montre comment créer une instance InputCompleter recherchant des données situés sur un serveur PHP :</p>
 *
 *     var completer = InputCompleter({parameters:'cmd=getcities', link:'completer.php'});
 *     document.body.appendChild(completer);
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>completer.php</code></p>
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputCompleter avec HTML5 (depuis la version 4.8) :</p>
 *
 *     <input type="box-input-completer" data-link="completer.php" data-parameters="cmd=getcities" />
 * 
 * <p>Cette exemple montre comment créer une instance InputCompleter recherchant des données situés sur un serveur PHP :</p>
 * 
 *     <input type="box-input-completer my-completer" />
 *     <script>
 *          Extends.after(function(){
 *               $$('.my-completer').each(function(completer){
 *                    completer.setLink('completer.php');
 *                    completer.setParameters('cmd=getcities');
 *               });
 *          });
 *     </script>
 *
 * <p>Cliquez sur l'onglet PHP pour voir le script PHP du fichier <code>getcities.php</code></p>
 * </div>
 * <div>
 * <p>Ce script PHP retourne une liste de données vers le completer :</p>
 * 
 *     <?php
 *     $cities = array(
 *          array(
 *               'value'=>'1',
 *               'text'=>'L\'Abergement Clémenciat - 01400'
 *          ),
 *          array(
 *               'value'=>'2',
 *               'text'=>'L\'Abergement-de-Varey - 01640'
 *          ),
 *          array(
 *               'value'=>'3',
 *               'text'=>'Amareins - 01090'
 *          ),
 *          array(
 *               'value'=>'4',
 *               'text'=>'Ambérieu-en-Bugey - 01500'
 *          ),
 *          array(
 *               'value'=>'5',
 *               'text'=>'Ambérieux-en-Dombes - 01330'
 *          ),
 *     );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getcities':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['City'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance completer
 *               echo json_encode($final);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 *
 * </div>
 * </div>
 *
 **/
InputCompleter.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var node = 	new InputCompleter({
			link:		e.data('link') == null ? '' : e.data('link'),
			parameters: e.data('parameters') == null ? '' : e.data('parameters'),
			button:		e.data('button') == null && e.data('type') == null
		});
		
		if(e.data('type') == 'countries'){
			node.setData(Countries.toData());	
		}
		
		node.id = 			e.id;
		node.Input.name = 	e.name;
		node.Input.value =	e.value;
		node.title = 		e.title;
		
		if(e.maxLength > 0){
			node.Input.maxLength = 	e.maxLength;
		}
		
		node.addClassName(e.className);
		node.removeClassName('box-input-completer');
		
		node.Value(node.Input.value);
			
		e.replaceBy(node);	
		
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputCompleter.Transform(e));
	});
	
	return options;
};