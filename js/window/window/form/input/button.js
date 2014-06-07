/** section: Form
 * class InputButton < Element
 *
 * Cette classe créée un champ de saisie avec un bouton.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton Javascript :</p>
 * 
 *     var input = InputButton({text:'InputButton', icon:'date'});
 *     document.body.appendChild(input);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML :</p>
 *  
 *     <input class="box-input-button icon-date" type="text" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <input class="box-input-button icon-date" type="text" />
 *
 **/
var InputButton = Class.createSprite('div');
InputButton.prototype = {
	/** @ignore */
	__class__: 'inputbutton',
	/** @ignore */
	className: 'wobject input input-button',
	
	value:	'',
/**
 * InputButton#Input -> Input
 * Instance Input permettant la saisie de texte.
 **/
 
/*
 * InputButton#Input#getParent() -> InputButton
 *
 * Cette méthode permet de récupérer l'instance parente. Cette méthode est utile lorsque vous ciblez l'instance dans une balise &lt;form&gt; par son nom `name` comme ceci :
 * 
 * <pre><code>&lt;form name="myForm"&gt;
 *     &lt;input name="myInput" class="box-input-button" type="text /&gt;
 * &lt;/form&gt;
 * &lt;script&gt;
 *     alert(document.myForm.myInput);//object HTMLInputElement
 *     alert(document.myForm.myInput);//Object HTMLDivElement soit InputButton
 * &lt;/script&gt;
 *
 **/
 
/**
 * InputButton#SimpleButton -> SimpleButton
 * Instance du bouton affiché à droite du champ de saisie.
 **/
	sync: 	true,
/**
 * new InputButton([options])
 * - options (Object): Objet de configuration.
 *
 * Créer un nouvelle instance du gestionnaire de tableau de données.
 *
 * #### Attributs du paramètre options
 * 
 * Le constructeur prend en charge un paramètre `options` permettant de configurer l'instance rapidement :
 *
 * * `sync` (`Boolean`): Si la valeur est vrai les méthodes [[InputButton#Text]] et [[InputButton#Value]].
 * * `name` (`String`): Nom du champ.
 * * `maxLength` (`Number`): Nombre maximal de caractère saisissable par l'utilisateur.
 * * `type` (`String`): `password` ou `text`.
 * * `value` (`Mixed`): Valeur à affecter au champs.
 * * `icon` (`String`): Icône à afficher pour le bouton.
 * * `placeholder` (`String`): Texte à afficher lorsque le champ de saisie est vide.
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 *
 **/
	initialize: function(obj){
		
		var options = {
			maxLength:	'',
			type:		'text',
			text:		'',
			value:		'',
			name:		'',
			icon:		'filenew',
			placeholder:'',
			sync:		false,
			size:		'normal'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		if(options.type != 'text' && options.type !='password'){
			options.type = 'text';
		}
		
		this.text = options.text;
		this.sync = options.sync;
		options.text = null;
		//
		// Input
		//
		this.Input = 			new Input({className:'input', type:options.type, name:options.name, placeholder:options.placeholder, sync:options.sync});
		//
		// SimpleButton
		//
		this.SimpleButton = 	new SimpleButton(options);
		
		if(options.maxLength != ''){
			this.Input.maxLenght = options.maxLength;
		}
		
		if(options.size == 'large'){
			this.Large(true);
		}
		
		this.appendChild(new Node('div', {className:"wrap-input field-input"}, this.Input));
		this.appendChild(this.SimpleButton);
		
		this.setText(this.text);
		this.Value(options.value);
		
		if(options.maxLength != '') this.MaxLength(options.maxLength);
		
		this.Input.on('focus', function(){
			this.addClassName('focus');
		}.bind(this));
		
		this.Input.on('blur', function(){
			this.removeClassName('focus');
		}.bind(this));
		
		this.Input.getParent = function(){
			return this;
		}.bind(this);
		
		this.Input.getInstance = function(){
			return this;
		}.bind(this);
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
				
		this.Input =		null;
		this.value = 		null;
		this.SimpleButton = null;
				
		this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});
	},
/**
 * InputButton#blur() -> InputButton
 * Cette méthode fait perdre le focus au champs de saisie.
 **/	
	blur:function(){
		this.Input.blur();
		return this;
	},
/**
 * InputButton#focus() -> InputButton
 * Cette méthode donne le focus au champs de saisie.
 **/	
	focus:function(){
		this.Input.focus();	
	},
/**
 * InputButton#observe(eventName, callback) -> InputButton
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
 * * `keyup` : Appelle la fonction lorsque l'utilisateur relève une touche du clavier.
 *
 **/
	observe:function(eventName, handler){
		switch(eventName){
			case 'change':
			case 'keydown': 		
			case 'keyup':
			case 'blur':
			case 'focus':		this.Input.on(eventName, handler.bind(this));
								break;
					
			default: Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * InputButton#stopObserving(eventName, callback) -> InputButton
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/
	stopObserving:function(eventName, handler){
		switch(eventName){
			case 'change':
			case 'keydown': 		
			case 'keyup':
			case 'blur':
			case 'focus': 		this.Input.stopObserving('focus', handler); 
								break;
			default: Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
/**
 * InputButton#MaxLength([maxchar]) -> Number
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
	MaxLength:function(nb){
		return this.Input.MaxLength(nb);
	},
/**
 * InputButton#Value([value]) -> String
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
 *     var c = new InputButton();
 *     c.Value('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new InputButton();
 *     c.Value('mavaleur');
 *     alert(c.Value()); //mavaleur
 *
 **/
	Value: function(value){
		if(!Object.isUndefined(value)){
			this.value = value;
			if(this.sync) this.Input.value = value;	
		}
		
		if(this.sync){
			return this.Input.value;	
		}
		
		return this.value;
	},
/**
 * InputButton#Text([text]) -> String
 * - text (String): Texte à assigner à l'instance.
 *
 * Assigne ou/et retourne le texte de l'instance.
 *
 * ##### Exemple d'utilisation
 * 
 * Affectation d'une valeur :
 * 
 *     var c = new InputButton();
 *     c.Text('mon text');
 *
 * Récupération d'une valeur :
 * 
 *     var c = new InputButton();
 *     c.Text('mon text');
 *     alert(c.Text()); //mon text
 * 
 **/
	getText: function(){
		return this.Input.value;
	},
	
	setText: function(text){
		
		if(!Object.isUndefined(text)){
			this.Input.value = text;	
		}
		
		return this;
	},
/**
 * InputButton#Text([text]) -> String
 * - text (String): texte à assigner.
 * 
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new InputButton();
 *     c.Text('mavaleur');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new InputButton();
 *     c.Text('mavaleur');
 *     alert(c.Text()); //mavaleur
 *
 **/	
	Text: function(text){
		if(this.sync) this.Value(text);
		if(!Object.isUndefined(text)){
			this.Input.value = text;	
		}
		return this.Input.value;
	},
	
	setIcon: function(icon){
		this.SimpleButton.setIcon(icon);
	},
/**
 * InputButton#Large(bool) -> Boolean
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
	}
};
/**
 * InputButton.Transform(node) -> InputButton
 * InputButton.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputButton.
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
 * <p>Cette exemple montre comment créer une instance InputButton Javascript :</p>
 * 
 *     var input = InputButton({text:'InputButton', icon:'date'});
 *     document.body.appendChild(input);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML :</p>
 *  
 *     <input class="box-input-button icon-date" type="text" />
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML 5 :</p>
 *  
 *     <input class="box-input-button" type="text" data-icon="date" data-js="myFunctionJS" />
 *     <input class="box-input-button" type="text" data-icon="date" data-href="http://domaine.js" data-target="_blank" />
 *     <input class="box-input-button" type="text" data-icon="date" data-href="javascript:alert('ici')" />
 *     
 *     <scritp>
 *     function myFunctionJS(evt){
 *         alert(this.className); //input-button
 *     }
 *     </script>
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <input class="box-input-button icon-date" type="text" />
 *
 **/
InputButton.Transform = function(e){
	
	if(Object.isElement(e)){
		
		var icon = 		e.data('icon') ? e.data('icon') : e.className.slice(e.className.indexOf('icon-'), e.className.length).split(' ')[0].replace('icon-', '');
		
		var input = 	new InputButton({
			name:		e.name,
			value:		e.value,
			sync:		true,
			type:		e.type,
			icon:		icon ? icon : ''
		});
				
		if(e.data('js')){
			input.SimpleButton.on('click', function(evt){
				
				var js = e.data('js').split('.');
				var fn = window[js[0]];
				
				for(var i = 1; i < js.length; i++){
					fn = fn[js[i]];
				}
									
				fn.call(input, evt);
					
			});
		}
		
		if(e.data('href')){
			input.SimpleButton.on('click', function(evt){
				$WR.evalLink(e.data('href'), e.data('target'));
			});
		}
		
		if(e.maxLength > 0){
			input.Input.maxLength = 	e.maxLength;
		}
		
		if(e.placeholder){
			input.Input.placeholder = e.placeholder;	
		}
		
		input.id = e.id;
				
		input.addClassName(e.className);
		input.removeClassName('box-input-button');
				
		e.replaceBy(input);
		
		return input;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputButton.Transform(e));
	});
	
	return options;
};