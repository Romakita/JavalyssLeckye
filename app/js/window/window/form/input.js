/** section: Form
 * class Input < Element
 *
 * Cette classe créée un champ de saisie classique et paramètrable.
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
 * <p>Cette exemple montre comment créer une instance Input en Javascript :</p>
 * <h4>Champ de saisie de type Alpha-numérique :</h4>
 * 
 *     var input = Input({value:'hello world', name:'Nom'});
 *     document.body.appendChild(input);
 *
 * <h4>Champ de saisie de type numérique :</h4>
 * 
 *     var input = Input({value:'0.0', name:'Numerique', type:'number', decimal:2});
 *     document.body.appendChild(input);
 * 
 * <h4>Champ de saisie de type date :</h4>
 *
 *     var input = Input({value:'24/07/1987', name:'Date', type:'date'});
 *     document.body.appendChild(input);
 * 
 * <h4>Champ de saisie de type e-mail :</h4>
 *
 *     var input = Input({value:'contact@javalyss.fr', name:'Email', type:'email'});
 *     document.body.appendChild(input);
 *
 * <h4>Champ de saisie de type IP v4 :</h4>
 *
 *     var input = Input({value:'192.168.0.1', name:'IP', type:'ip'});
 *     document.body.appendChild(input);
 *
 * <h4>Champ de saisie de type IP v6 :</h4>
 *
 *     var input = Input({value:'2001:0000:1234:0000:0000:C1C0:ABCD:0876', name:'IP', type:'ip'});
 *     document.body.appendChild(input);
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance Input en HTML :</p>
 * <h4>Champ de saisie de type alpha-numérique :</h4>
 *
 *     <input value="hello world" class="box-input" type="text" >
 *
 * <h4>Champ de saisie de type numérique :</h4>
 * 
 *     <input value="0.0" class="box-input type-number decimal-2" type="text" />
 *
 * <h4>Champ de saisie de type date :</h4>
 *
 *     <input value="24/07/1987" class="box-input type-date" type="text" />
 *
 * <h4>Champ de saisie de type e-mail :</h4>
 *
 *     <input value="contact@javalyss.fr" class="box-input type-email" type="text" />
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance Input en HTML 5 :</p>
 * <h4>Champ de saisie de type alpha-numérique :</h4>
 *
 *     <input value="hello world" class="box-input" type="text" >
 *
 * <h4>Champ de saisie de type numérique :</h4>
 * 
 *     <input value="0.0" class="box-input" data-type="number" data-decimal="2" type="text" />
 *
 * <h4>Champ de saisie de type date :</h4>
 *
 *     <input value="24/07/1987" class="box-input" data-type="date" type="text" />
 *
 * <h4>Champ de saisie de type e-mail :</h4>
 *
 *     <input value="contact@javalyss.fr" class="box-input" data-type="email" type="text" /> 
 *
 * <h4>Champ de saisie de type IP v4 :</h4>
 *
 *     <input value="192.168.0.1" class="box-input" data-type="ip" type="text" data-fixed="true" />
 *
 * <h4>Champ de saisie de type IP v6 :</h4>
 *
 *     <input value="2001:0000:1234:0000:0000:C1C0:ABCD:0876" class="box-input" data-type="ipv6" type="text" data-fixed="true" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <table class="table-form form-table"><tbody>
 * <tr>
 * <th><label for="Name">Alpha-numérique</label></th>
 * <td><input type="text" value="hello world" maxlength="255" class="box-input" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">Numérique</label>
 * </th>
 * <td><input type="text" value="0.0" maxlength="255" class="box-input type-number decimal-2" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">Date</label>
 * </th>
 * <td><input type="text" value="24/07/1987" maxlength="255" class="box-input type-date" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">E-mail</label>
 * </th>
 * <td><input type="text" value="contact@javalyss.fr" maxlength="255" class="box-input type-email" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">IP v4</label>
 * </th>
 * <td><input value="192.168.0.1" class="box-input" data-type="ip" type="text" data-fixed="true" data-empty="false" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">IP v6</label>
 * </th>
 * <td><input value="2001:0000:1234:0000:0000:C1C0:ABCD:0876" class="box-input" data-type="ipv6" type="text" data-fixed="true" data-empty="false" /></td>
 * </tr>
 * </tbody>
 * </table>
 *
 **/
var Input = Class.createSprite('input');
Input.prototype = {
	__class__: 'input',
	className: 'wobject input',
/**
 * Input#type -> String
 * Type de champs de saisie. 
 * 
 * * `text` : Autorise la saisie de chaine alphanumérique.
 * * `email` : Autorise seulement la saisie d'adresse e-mail.
 * * `date` : Autorise seulement la saisie de date.
 * * `password`: Autorise la saisie de chaine alphanumérique. Les caractères saisies seront cachées.
 * * `number`: Autorise la saisie de chaine numérique seulement.
 * 
 **/
	type: 		'text',
	typebackup:	'text',
/**
 * Input#name -> String
 * Nom du champs de saisie.
 **/

/**
 * Input#value -> String
 * Valeur du champs de saisie.
 **/

/**
 * Input#maxLength -> Number
 * Nombre de caractère saisissable dans le champs.
 **/

/**
 * Input#decimal -> Number
 * Nombre de décimal après la virgurle.
 **/
 	decimal:		2,
/**
 * Input#autoselect -> Boolean
 * Vide le champ lorsque le champ obtient le focus.
 **/	
	autoselect: 	false,
/*
 * Input#backup -> Boolean
 * Active la sauvergarde de la valeur saisie par l'utilisateur.
 **/
 	backup: 	false,

	empty:		true,
	
	fixed:		false,
	
	mask:		false,
/**
 * new Input([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance [[Input]].
 *
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `autoselect` (`Boolean`): Vide le champ lorsque le champ obtient le focus.
 * * `decimal` (`Number`): Nombre de décimal après la virgule.
 * * `empty` (`Number`): Si empty est vrai le champ ne peut pas être vide.
 * * `maxLength` (`Number`): Nombre maximal de caractère saisissable.
 * * `name` (`String`): Nom du champs.
 * * `placeholder` (`String`): Texte affiché dans le champ lorsque ce dernier est vide (HTML5).
 * * `type` (`String`): `password`, `text`, `number`, `date`, `email`.
 * * `value` (`Mixed`): Valeur à affecter au champs.
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 * * `fixed` (`Boolean`): Dans le cas d'un champ de type IP ou IPv6, si fixed est vrai alors l'IP fera exactement 15 ou 39 caractères de long.
 * 
 **/
	initialize: function(options){
				
		if(!Object.isUndefined(options)){
			if(options.style){
				this.setStyle(options.style);
				options.style = null;
				delete options.style;
			}
			
			if(options.size){
				options.size = null;
				this.Large(true);
				delete options.size;	
			}
			
			if(document.navigator.client == 'IE'){
				for(var key in options){
					if(key == 'type'){
						if(options[key] != 'text' && options[key] != 'password' 
						&& options[key] != 'file' && options[key] != 'submit' 
						&& options[key] != 'checkbox' && options[key] != 'radio'
						&& options[key] != 'reset'){
							this[key] = 'text';
						}
					}else{
						this[key] = options[key];	
					}
				}
			}else{
				Object.extend(this, options);
			}
		}
		//
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		if(options){
			this.setType(options.type);
			
			if(options.mask){
				this.setMask(options.mask);	
			}
		}
				
		this.backup = this.Value();
		
		Event.observe(this, 'change', this.onChange.bind(this));
		Event.observe(this, 'keydown', this.onKeyDown.bind(this));
		Event.observe(this, 'keyup', this.onKeyUp.bind(this));
		Event.observe(this, 'focus', this.onFocus.bind(this));
		Event.observe(this, 'blur', this.onBlur.bind(this));
		Event.observe(this, 'keypress', this.onKeyPress.bind(this));
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
	},
/**
 * Input#observe(eventName, callback) -> Input
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Est déclenché lorsque la valeur du champ change.
 * * `blur` : Est déclenché lorsque le champ perd le focus.
 * * `focus` : Est déclenché lorsque le champ obtient le focus.
 * * `keyup` : Est déclenché lorsque la touche du clavier est relachée.
 * * `error` : Est déclenché lorsque la saisie de l'utilisateur comporte une erreur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		switch(eventName){
			default:
				Event.observe(this, eventName, callback);break;
			case 'change':
			case 'keypress':
			case 'keyup':
			case 'blur':
			case 'focus':
			case 'error':
				this.Observer.observe(eventName, callback);
				break;
		}
		return this;
	},
/**
 * Input#stopObserving(eventName, callback) -> Input
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Est déclenché lorsque la valeur du champ change.
 * * `blur` : Est déclenché lorsque le champ perd le focus.
 * * `focus` : Est déclenché lorsque le champ obtient le focus.
 * * `keyup` : Est déclenché lorsque la touche du clavier est relachée.
 * * `error` : Est déclenché lorsque la saisie de l'utilisateur comporte une erreur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/	
	stopObserving: function(eventName, callback){
		switch(eventName){
			default:
				Event.stopObserving(this, eventName, callback);
				break;
			case 'keypress':
			case 'change':
			case 'keyup':
			case 'blur':
			case 'focus':
			case 'error':
				this.Observer.stopObserving(eventName, callback);
				break;
		}
		return this;
	},
/**
 * Input#ReadOnly([bool]) -> Number
 * - bool (Number): Active ou désactive la saisie dans le champ.
 * 
 * Cette méthode permet d'activer ou de désactiver la saisie dans un champ texte [[Input]].
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Input();
 *     c.ReadOnly(true);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Input();
 *     c.ReadOnly(5);
 *     alert(c.ReadOnly()); //true
 *
 **/
	
/**
 * Input#MaxLength([maxchar]) -> Number
 * - maxchar (Number): Nombre de caractère maximal.
 * 
 * Assigne ou/et retourne le nombre maximal de caractère saisissable.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new Input();
 *     c.MaxLength(5);
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Input();
 *     c.MaxLength(5);
 *     alert(c.MaxLength()); //5
 *
 **/
	
/**
 * Input#Value([value]) -> String
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
 *     var c = new Input();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new Input();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		if(!Object.isUndefined(value)){
			
			switch(this.typebackup){
				default:
					this.value = value;
					break;
				case 'number':
					this.value = (value * 1).toFixed(this.decimal);
					break;
					
				case 'ip':				
				case 'ipv6':
					this.value = this._formatIP(value);
					break;
			}
		}
		
		return this.value;
	},
	
	_formatIP:function(value){
		
		if(this.typebackup == 'ip'){
			var values = value.split('.');
			for(var i = 0; i < values.length; i++){
				if(this.fixed){
					values[i] = ('000' + values[i]).slice(-3);
				}else{
					values[i] = 1 *  values[i];
				}
			}
			
			return values.join('.');	
		}
		
		var values = value.split(':');
					
		for(var i = 0; i < values.length; i++){
			if(this.fixed){
				values[i] = ('0000' + values[i]).slice(-4);
			}else{
				if(values[i].match(/[a-fA-F]/)){
					values[i] = ('0000'+ values[i]).slice(-4);
				}
			}
		}
		
		return values.join(':');
	},
/**
 * Input#Large(bool) -> Boolean
 *
 **/
	Large: function(bool){
		if(Object.isUndefined(bool)){
			return this.hasClassName('large');
		}
		
		this.removeClassName('large');
		
		if(bool){
			this.addClassName('large');	
		}
		
		return bool
	},
	
	toMagic: function(bool){
		this.removeClassName('input-magic');
		
		if(bool){
			this.addClassName('input-magic');	
		}
		
		return this;
	},
/*
 * Input#onKeyUp(evt) -> void
 **/	
	onKeyPress:function(evt){
		var keyCode = Event.getKeyCode(evt);
		
		if([0, 8, 13].indexOf(keyCode) == -1){//entrer, retour et suppr
				
			switch(this.typebackup){
				case 'email'://caractère interdit
					if([181, 178, 176, 168, 167, 164, 163, 123, 125, 124, 126, 96, 94, 93, 92, 91, 63, 62, 61, 60, 59, 58, 47, 44, 43, 42, 41, 40, 39, 38, 37, 36, 34, 33].indexOf() != -1){
						evt.stop();
					}
					break;
					
				case 'number':
					if(!(48 <= keyCode && keyCode <= 57)){//n'est pas un nombre
						
						switch(keyCode){
							case 45:
								evt.stop();
								if(this.value.indexOf('-') == -1){
									this.action = '-';	
								}
								
								break;
							case 43:
								evt.stop();
								if(this.value.indexOf('+') == -1){
									this.action = '+';	
								}
								break;
							case 46:
								if(this.value.indexOf('.') != -1){
									evt.stop();
								}
								break;
							default:
								evt.stop();
						}
					}
									
					break;
					
				case 'ip':
					if(this.value.length >= 15){
						evt.stop();
					}
					
					if(!(48 <= keyCode && keyCode <= 57)){//n'est pas un nombre
						if(keyCode != 46){
							evt.stop();
						}
					}
					break;
					
				case 'ipv6':
					if(this.value.length >= 39){
						evt.stop();
					}
					
					if(!((48 <= keyCode && keyCode <= 57) || (65 <= keyCode && keyCode <= 70) || (97 <= keyCode && keyCode <= 102))){//n'est pas un nombre hexa
						if(keyCode != 58){
							evt.stop();
						}
					}
					break;
					
			}
			
		}
		
		this.Observer.fire('keypress', evt);
	},
/*
 * Input#onKeyUp(evt) -> void
 **/	
	onKeyUp: function(evt){
		if(Event.getKeyCode(evt) == 13){
			this.blur();
			this.Observer.fire('keyup', evt);
			return;
		}
		
		switch(this.typebackup){
			
			case 'number':
				
				var e = (this.value +"").replace(/,/gi, '.');
				
				
				if(this.action){
					if(this.action == '-'){
						e = this.value = '-' + this.value;	
					}
					
					if(this.action == '+'){
						e = this.value = this.value.replace(/-/gi, '');	
					}
					
					this.action = false;
				}
								
				if(e != ''){
					this.backup = e;
				}
				
				break;
				
			case 'ip':
				var values = this.value.split('.');
				var str = [];
				
				for(var i = 0, len = values.length; i < len && i < 4; i++){
					var current = values[i];
					
					if(current.length > 3){
						if(i + 1 < 5){
							//+ (Object.isString(values[i+1]) ? values[i+1] : '')
							values[i+1] = 			current.slice(3, current.length); 
							current = values[i] = 	current.slice(0,3);
							len = 					values.length;
						}
					}else{
						if(current * 1 > 255){
							values[i+1] = 			current.slice(2, current.length);	
							current = values[i] = 	current.slice(0,2);
							len = 					values.length;
						}
					}
					
					if(i < values.length -1){//
						if(current == ''){
							current = 0;	
						}
					}
					
					current = current > 255 ? 255 : current;
										
					str.push(current);
				}
				
				this.value = str.join('.');
				
				break;
			
			case 'ipv6':
				var values = this.value.split(':');
				var str = [];
				
				for(var i = 0, len = values.length; i < len && i < 8; i++){
					var current = values[i];
					
					if(i > 0){//correction du précédent bloc
						if(str[i-1].match(/[a-fA-F]/)){
							str[i-1] = ('0000'+ str[i-1]).slice(-4);
						}
					}
					
					if(current.length > 4){
						if(i + 1 < 9){
							//+ (Object.isString(values[i+1]) ? values[i+1] : '')
							values[i+1] = 			current.slice(4, current.length); 
							current = values[i] = 	current.slice(0,4);
							len = 					values.length;
						}
					}else{
						if(current.toDecimal() > 65535){
							values[i+1] = 			current.slice(3, current.length);	
							current = values[i] = 	current.slice(0,3);							
							len = 					values.length;
						}
					}
										
					current = current.toDecimal() > 65535 ? 'FFFF' : current;
										
					str.push(('' + current).toUpperCase());
				}
				
				this.value = str.join(':');
				break;
				
			case 'text':
				if(this.mask){					
					this.value = this.value.format(this.mask);	
				}
				
				break;
		}
		
		this.Observer.fire('keyup', evt);		
	},
	
	onKeyDown:function(){
		
		switch(this.typebackup){
			case 'text':
				if(this.mask){
					this.value = this.value.unformat(this.mask);
				}
		}
	},
/*
 * Input#onChange(evt) -> void
 **/
 	onChange: function(evt){
 		
		this.Observer.fire('change', evt);
		
		switch(this.typebackup){
			case 'number':
				if(this.Value().isNumber()){
					this.backup = this.Value();
				}
				break;
				
			case 'ip':
				if(this.Value().isIP()){
					this.value = this._formatIP(this.value);
					this.backup = this.Value();
				}
				break;
			case 'ipv6':
								
				this.value = this._formatIP(this.value);
					
				if(this.Value().isIPv6()){					
					this.backup = this.Value();
				}
				
				break;
			case 'mail':
			case 'email':
				if(this.Value().isMail()) this.backup = this.Value();
				break;
			case 'date':
				if(this.Value().isDate()) this.backup = this.Value();
				break;
		}
	},
/*
 * Input#onBlur(evt) -> void
 **/	
	onBlur: function(evt){
		switch(this.typebackup){
			case 'number':
								
				if(this.value == '' && !this.empty){
					this.Value(this.backup);
				}
								
				if(this.value != ''){
					this.value = this.value.replace(/,/gi, '.');
					
					if(!this.value.isNumber()){
						this.Value(this.backup.isNumber() ? this.backup : (this.empty ? '' : 0));
						return this.Observer.fire('error', evt);	
					}
					
					this.value = (this.value * 1).toFixed(this.decimal);
				}
				
				break;
				
			case 'ip':
								
				if(this.value == '' && !this.empty){
					this.Value(this.backup);
				}
								
				if(this.value != ''){
					
					if(!this.value.isIP()){
						this.value = this._formatIP(this.backup.isIP() ? this.backup : (this.empty ? '' : '0.0.0.0'));					
						return this.Observer.fire('error', evt);	
					}
				}
				
				break;
				
			case 'ipv6':
								
				if(this.value == '' && !this.empty){
					this.Value(this.backup);
				}
								
				if(this.value != ''){
					this.value = this._formatIP(this.value);
				
					if(!this.value.isIPv6()){
						this.value = this.backup.isIPv6() ? this.backup : (this.empty ? '' : '0000:0000:0000:0000:0000:0000:0000:0000');						
						return this.Observer.fire('error', evt);	
					}
				}
				
				break;
			case 'mail':
			case 'email':
				
				if(this.empty && this.value == '') break;
				
				if(!this.value.isMail()){
					
					this.value = this.backup.isMail() ? this.backup : '';
					return this.Observer.fire('error', evt);
				}
								
				break;
				
			case 'date':
				if(this.empty && this.value == '') break;
				
				if(!this.value.isDate()){
					this.value = this.backup.isDate() ? this.backup : '';
					return this.Observer.fire('error', evt);
				}
				
				//this.backup = this.value;	
				
				break;	
		}
		
		return this.Observer.fire('blur', evt);
	},
/*
 * Input#onFocus(evt) -> void
 **/	
	onFocus: function(evt){
		if(this.autoselect){
			this.select();	
		}
		this.Observer.fire('focus', evt);
	},
/**
 * Input#getType() -> String
 *
 * Cette méthode le type du champ de saisie.
 **/	
	getType: function(){
		return this.typebackup
	},
	
	restore: function(){
		this.value = this.backup;
	},
/**
 * Input#setType(type) -> Input
 *
 * Cette méthode assigne le type de saisie qu'autorise le champs.
 *
 * * `text` : Autorise la saisie de chaine alphanumérique.
 * * `e-mail` : Autorise seulement la saisie d'adresse e-mail.
 * * `date` : Autorise seulement la saisie de date.
 * * `password`: Autorise la saisie de chaine alphanumérique. Les caractères saisies seront cachées.
 * * `number`: Autorise la saisie de chaine numérique seulement.
 *
 **/	
	setType: function(type){
		switch(type){
			default:
				this.typebackup = type;
				this.type = type;
				break;
				
			case 'ip':
				this.typebackup = type;
				
				if(!this.empty){
					this.value =  this.value == '' ? '0.0.0.0' : this.value;
				}
				
				if(this.value != ''){
					this.value =  this._formatIP(!this.value.isIP() ? '0.0.0.0' : this.value);
				}
				
				this.type = 'text';
				
				break;
			
			case 'ipv6':
				this.typebackup = type;
				
				if(!this.empty){
					this.value =  this.value == '' ? '0000:0000:0000:0000:0000:0000:0000:0000' : this.value;
				}
				
				if(this.value != ''){
					this.value =  this._formatIP(!this.value.isIPv6() ? '0000:0000:0000:0000:0000:0000:0000:0000' : this.value);
				}
				
				this.type = 'text';
				
				break;
				
			case 'number':
				this.typebackup = type;
				
				if(!this.empty){
					this.value = this.value == '' ? 0 : this.value;
				}
				
				if(this.value != ''){
					if(isNaN(1 * this.value)) this.value = 0;	
					this.value = (1 * this.value).toFixed(this.decimal);
				}
				
				this.type = 'text';
				break;
			case 'mail':
			case 'email':
			case 'date':
				this.typebackup = type;
				this.type = 'text';
				break;
		}
		return this;
	},
	
	setMask:function(mask){
		if(this.mask){
			this.value = this.value.unformat(this.mask);	
		}
		
		this.mask = mask;
		this.value = this.value.format(this.mask);
		return this;
	}
};
/** section: Form
 * class InputMagic < Input
 *
 * Cette classe créée un champ de saisie transparent. Ce champs de saisie devient apparent au focus du champs.
 *
 * <p class="note">Cette classe est définie dans le fichier window.input.js</p>
 **/
var InputMagic = Class.from(Input);
InputMagic.prototype.initialize = function(){
	this.toMagic(true);
	return this;
};
/**
 * Input.Transform(node) -> Input
 * Input.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Select.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises select répondant au critère `selector` en instance [[Input]].
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
 * <p>Cette exemple montre comment créer une instance Input en Javascript :</p>
 * <h4>Champ de saisie de type Alpha-numérique :</h4>
 * 
 *     var input = Input({value:'hello world', name:'Nom'});
 *     document.body.appendChild(input);
 *
 * <h4>Champ de saisie de type numérique :</h4>
 * 
 *     var input = Input({value:'0.0', name:'Numerique', type:'number', decimal:2});
 *     document.body.appendChild(input);
 * 
 * <h4>Champ de saisie de type date :</h4>
 *
 *     var input = Input({value:'24/07/1987', name:'Date', type:'date'});
 *     document.body.appendChild(input);
 * 
 * <h4>Champ de saisie de type e-mail :</h4>
 *
 *     var input = Input({value:'contact@javalyss.fr', name:'Email', type:'email'});
 *     document.body.appendChild(input);
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance Input en HTML :</p>
 * <h4>Champ de saisie de type alpha-numérique :</h4>
 *
 *     <input value="hello world" class="box-input" type="text" >
 *
 * <h4>Champ de saisie de type numérique :</h4>
 * 
 *     <input value="0.0" class="box-input type-number decimal-2" type="text" />
 *
 * <h4>Champ de saisie de type date :</h4>
 *
 *     <input value="24/07/1987" class="box-input type-date" type="text" />
 *
 * <h4>Champ de saisie de type e-mail :</h4>
 *
 *     <input value="contact@javalyss.fr" class="box-input type-email" type="text" />
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance Input en HTML 5 :</p>
 * <h4>Champ de saisie de type alpha-numérique :</h4>
 *
 *     <input value="hello world" class="box-input" type="text" >
 *
 * <h4>Champ de saisie de type numérique :</h4>
 * 
 *     <input value="0.0" class="box-input" data-type="number" data-decimal="2" type="text" />
 *
 * <h4>Champ de saisie de type date :</h4>
 *
 *     <input value="24/07/1987" class="box-input" data-type="date" type="text" />
 *
 * <h4>Champ de saisie de type e-mail :</h4>
 *
 *     <input value="contact@javalyss.fr" class="box-input" data-type="email" type="text" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <table class="table-form form-table"><tbody>
 * <tr>
 * <th><label for="Name">Alpha-numérique</label></th>
 * <td><input type="text" value="hello world" maxlength="255" class="box-input" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">Numérique</label>
 * </th>
 * <td><input type="text" value="0.0" maxlength="255" class="box-input type-number decimal-2" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">Date</label>
 * </th>
 * <td><input type="text" value="24/07/1987" maxlength="255" class="box-input type-date" /></td>
 * </tr>
 * <tr>
 * <th>
 * <label for="LastName">E-mail</label>
 * </th>
 * <td><input type="text" value="contact@javalyss.fr" maxlength="255" class="box-input type-email" /></td>
 * </tr>
 * </tbody>
 * </table>
 *
 * 
 **/
Input.Transform = function(e){
	
	if(Object.isElement(e)){
		//Extension des méthodes
		var className = e.className;
		
		Object.extend(e, Input.prototype);
		e.addClassName(className);
		
		var options = {
			type:		'text',
			empty:		e.className.match(/empty/),
			autoselect:	e.className.match(/autoselect/)
		};
		
		if(e.className.match(/type-/)){
			options.type = e.className.substring(e.className.lastIndexOf('type-')).split(' ')[0].replace('type-','');
		}
		
		if(e.data('type')){
			options.type = e.data('type');
		}
		
		if(e.className.match(/decimal-/)){
			options.decimal = parseInt(e.className.substring(e.className.lastIndexOf('decimal-')).split(' ')[0].replace('decimal-',''));
		}
		
		if(e.data('decimal')){
			options.decimal = 1 * e.data('decimal');
		}
		
		if(e.data('empty')){
			options.empty = e.data('empty');
		}
		
		if(e.data('fixed')){
			options.fixed = e.data('fixed');
		}
		
		if(e.data('mask')){
			options.mask = e.data('mask');
		}
		
		if(e.data('autoselect')){
			options.autoselect = e.data('autoselect');
		}
		
		e.initialize(options);
		e.removeClassName('box-input');
		return e;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(Input.Transform(e));
	});
	
	return options;
};
Import('window.form.input.textarea');
Import('window.form.input.button');
Import('window.form.input.popup');
Import('window.form.input.calendar');
Import('window.form.input.color');
Import('window.form.input.completer');
Import('window.form.input.select');
Import('window.form.input.city');