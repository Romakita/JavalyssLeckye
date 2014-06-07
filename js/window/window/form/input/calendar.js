/** section: Form
 * class InputCalendar < InputPopup
 *
 * Cette classe permet de créer un champ de saisie de date via un calendrier.
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
 * <p>Cette exemple montre comment créer une instance InputCalendar Javascript :</p>
 * 
 *     var input = InputCalendar();
 *     document.body.appendChild(input);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML :</p>
 *
 *     //Champs date
 *     <input class="box-input-calendar" type="text" />
 *     //Champs date et heure
 *     <input class="box-input-calendar datetime step-15" type="text" />
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML 5 :</p>
 *
 *     //Champs date
 *     <input class="box-input-calendar" type="text" />
 *     //Champs date et heure
 *     <input class="box-input-calendar" type="text" date-step="15" data-hours="true" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div>
 * <p>InputCalendar simple :</p>
 * <input class="box-input-calendar" type="text" />
 * 
 * <p style="margin-top:10px">InputCalendar avec champs de choix des heures et minutes :</p>
 * <input class="box-input-calendar" type="text" date-step="15" data-hours="true" />
 * </div>
 *
 **/
var InputCalendar = Class.from(InputPopup);

InputCalendar.prototype = {
	__class__:		'inputcalendar',
	className:		'wobject input input-button input-popup input-calendar',
/*
 * InputCalendar#parent -> InputCalendar
 * Instance du calendrier parent.
 **/
	parent:			'',
/*
 * InputCalendar#child -> InputCalendar
 * Instance du calendrier enfant.
 **/
	child:			'',
/**
 * InputCalendar#Calendar -> Calendar
 * Instance du calendrier affiché dans le popup.
 **/
	Calendar: 		null,
/**
 * InputCalendar#Hours -> Select | InputCompleter
 * Instance gérant les heures de l'instance lorqu'elle est configuré sur le `type` select ou completer.
 **/	
	Hours:			null,
	/**
	 * @type Boolean
	 */
	mode:			false,
/**
 * InputCalendar#format -> String
 * Format d'affichage de la date.
 **/
	format:			null,
/*
 * InputCalendar#DateInterval
 * Objet contenant une date minimal et une date maximal afin d'empêcher
 * l'affichage des jours antérieur à la date minimal ou suppérieur à la date maximal.
 **/	
	DateInterval:	null,
/*
 * InputCalendar#DateInterval.min -> Date
 **/	
	changeTime:		false,
/**
 * new InputCalendar([options])
 * - options(Object): Options de configuration.
 *
 * Initialise une nouvelle instance du calendrier.
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `date` (`Date`): Indique une date par défaut au calendrier (optionnel, par défault date du jour).
 * * `step` (`Number`): Pas d'incrémentation des minutes.
 * * `type` (`Number`): Change le type d'affichage du calendrier. Les types pris en charges sont `date` et `datetime`.
 * * `format` (`String`): Format d'affichage de la date dans le calendrier.
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 *
 **/
	initialize: function(obj){
		
		var options = {
			format:	MUI.lang == 'fr' ? 'd/m/Y h:i:s' : 'Y-m-d h:i:s',
			type:	'date',
			step:	15,
			size:	'normal'
		};
		
		if(!Object.isUndefined(obj)){
			if(Object.isString(obj)) obj = {format:obj};
			
			Object.extend(options, obj);
		}
		
		if(options.pas){
			options.step = options.pas;	
		}
		
		if(options.size == 'large'){
			this.Large(true);
			delete options.size;
		}
		
		this.format = 	options.format;
		this.options = 	options;
		options.hours = false;
		
		//#pragma region Instance
		this.className_ = 		'';
		//
		// DateInterval
		//
		this.DateInterval = 	{min:null, max:null};
		//
		// SimpleButton
		//
		this.SimpleButton.setIcon('day');
		//
		// Calendar
		//
		if(options.format == 'd/m/Y h:i:s' || options.format == 'Y-m-d h:i:s'){
			options.format = options.format.split(' ')[0];	
		}
		
		this.Calendar = 		new Calendar(options);
		this.Calendar.Observer.bind(this);
		this.Calendar.HiddenHours(true);
		//this.Calendar.removeChild(this.Calendar.footer);
		//
		// Input
		//	
		this.Input.readOnly = 'readonly';
		this.Popup.Scroll(false);
		this.Popup.appendChild(this.Calendar);
		this.appendChild(this.Calendar.Flag);

		//
		//
		//
		this.Hours = 					options.type == 'completer' ? new InputCompleter(options) : new Select(options);
		this.Hours.Input.maxLength = 	5;
		this.Hours.Popup.deltaY = 		2;
		
		this.appendChild(new Node('div', {className:'wrap-text field-text'}, $MUI('à')));
		this.appendChild(this.Hours);
				
		this.setStep(options.step);	
		//
		// Contruction du champs Horraire
		//
		if(options.type != 'date'){
			this.EnableHours(true);
		}else{	
			this.write();
		}
		
		
		//#pragma region Event		
		this.Hours.on('focus', function(){
			this.addClassName('focus');
		}.bind(this));
		
		this.Hours.on('blur', function(){
			this.removeClassName('focus');
		}.bind(this));
		
		this.Hours.on('change', function(){this.onChangeTime()}.bind(this));
				
		this.Hours.Input.on('keyup', function(evt){
			//alert(evt.keyCode);
			if(this.value == '') return;
			
			var hours = 		'';
			var lastchar = 		'';
			
			for(var i = 0; i < this.value.length; i++){
				var char = this.value.substr(i, 1);
				switch(i){
					case 0:
						if(isNaN(char * 1)) char = "0";
						else{
							char = (char < "0") ? "0" : ((char > '2') ? '2': char);
						}
						lastchar = char;
						break;
					case 1:
						
						if(lastchar < "2"){
							if(isNaN(char * 1)) char = "0";
						}else{
							if(isNaN(char * 1)) char = "0";
							else{
								char = (char < "0") ? "0" : ((char > '3') ? '3': char);
							}
						}
						break;
					case 2:
						char = ':';
						break;
					case 3:
						if(isNaN(char * 1)) char = "0";
						else{
							char = (char < "0") ? "0" : ((char > '5') ? '5': char);
						}
						break;
					case 4:
						if(lastchar < "5"){
							if(isNaN(char * 1)) char = "0";
						}
						break;
				}
				hours += char;
			}
			this.value = hours;
		});
		
		this.Calendar.observe('change', function(evt, date){
			this.Calendar.Flag.hide();
			
			this.Hidden(true);
			this.write();
			
			this.onChangeTime(true);
			
		}.bind(this));
				
		this.Calendar.observe('draw', this.onDraw.bind(this));		
		
		if(options.value){
			this.Value(options.value);	
		}
		//#pragma endregion Event
	},
	
	destroy: function(){
		
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.Observer.destroy();
				
		this.Calendar =		null;
		this.Observer =		null;
		this.Popup =		null;
		this.Input =		null;
		this.value = 		null;
		this.SimpleButton = null;
		this.Hours =		null;
				
		try{this.select('.wobject').each(function(e){
			if(Object.isFunction(e.destroy)) e.destroy();
		});}catch(er){}
	},
/**
 * InputCalendar#EnableHours() -> Boolean
 * InputCalendar#EnableHours(bool) -> Boolean
 * - bool (Boolean): Valeur à assigner.
 *
 * Cette méthode active ou désactive le champ de selection des heures de l'instance.
 **/	
	EnableHours: function(bool){
		if(Object.isUndefined(bool)){
			return this.hasClassName('datetime');	
		}
		
		this.removeClassName('datetime');
		
		if(bool){
			if(this.format == 'Y-m-d h:i:s'){
				this.format = MUI.lang == 'fr' ? 'd/m/Y' : 'Y-m-d';
			}
			this.addClassName('datetime');
		}
		
		this.write();
		
		return bool;
	},
/** deprecated, related to: InputCalendar#EnableHours
 * InputCalendar#activeHours(step) -> InputCalendar
 * - step (Number): Pas d'incrémentation des minutes.
 *
 * Cette méthode active la gestion des heures.
 **/
	activeHours: function(pas){
		if(!Object.isUndefined(pas)){
			this.setStep(pas);	
		}
		
		this.EnableHours(true);
						
		return this;
	},
/**
 * InputCalendar#addInputCalendar(input) -> InputCalendar
 * - input (InputCalendar): Instance de InputCalendar à lier.
 *
 * Cette méthode lie une instance de [[InputCalendar]] avec cette instance afin de créer un interval de date comme
 * par exemple la date de début d'un événement et date de fin d'un événement.
 *
 * L'instance courante sera la date de fin et l'instance passé en paramètre sera la date de début à prendre en compte.
 **/
	addInputCalendar:function(inputCal){
		
		inputCal.addClassName('start');
		this.addClassName('end');
		
		this.parent = inputCal;
		inputCal.child = this;
		
		if(this.DateInterval.min){
			if(!this.parent.DateInterval.min){
				this.parent.DateInterval.min = this.DateInterval.min;
			}
		}else{
			if(this.parent.DateInterval.min){
				this.DateInterval.min = this.parent.DateInterval.min;
			}
		}
		
		if(this.DateInterval.max){
			if(!this.parent.DateInterval.max){
				this.parent.DateInterval.max = this.DateInterval.max;
			}
		}else{
			if(this.parent.DateInterval.max){
				this.DateInterval.max = this.parent.DateInterval.max;
			}
		}
		
		return this;
	},
/** alias of: InputCalendar#addInputCalendar
 * InputCalendar#linkTo(input) -> InputCalendar
 * - input (InputCalendar): Instance de InputCalendar à lier.
 *
 * Cette méthode lie une instance de [[InputCalendar]] avec cette instance afin de créer un interval de date comme
 * par exemple la date de début d'un événement et date de fin d'un événement.
 *
 * L'instance courante sera la date de fin et l'instance passé en paramètre sera la date de début à prendre en compte.
 **/	
	linkTo: function(input){
		return this.addInputCalendar(input);
	},
/** deprecated, related to: InputCalendar#EnableHours
 * InputCalendar#deactiveHours() -> InputCalendar
 *
 * Cette méthode désactive la gestion des heures.
 **/
	deactiveHours: function(){
		this.EnableHours(false);
		return this;
	},
/**
 * InputCalendar#observe(eventName, callback) -> InputCalendar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` sur le nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * Le champ d'auto-complétion prend en charge un certain nombre d'événement personnalisé, comme suivant :
 *
 * * `change` : Appelle la fonction lorsque l'utilisateur change de date.
 * * `draw` : Appelle la fonction lorsque le calendrier appel la méthode [[Calendar.draw]].
 * * `next` : Appelle la fonction lorsque le bouton suivant (Mois) est cliqué. 
 * * `nexttwo` : Appelle la fonction lorsque le bouton suivant (Année) est cliqué. 
 * * `prev` : Appelle la fonction lorsque le bouton précédent (Mois) est cliqué. 
 * * `prevtwo` : Appelle la fonction lorsque le bouton précédent (Année) est cliqué.
 * * `uphours` : Appelle la fonction lorsque le bouton des heures (Heure + 1) est cliqué. 
 * * `downhours` : Appelle la fonction lorsque le bouton des heures (Heure - 1) est cliqué. 
 * * `upmin` : Appelle la fonction lorsque le bouton des minutes (Minute + 1) est cliqué. 
 * * `downmin` : Appelle la fonction lorsque le bouton des minutes (Minute - 1) est cliqué. 
 *
 **/
	observe:function(eventName, handler){
		if(eventName == "mouseover" || eventName == 'mouseout' || eventName == 'click' || eventName == 'mousedown' || eventName == 'mouseup'){
			Event.observe(this, eventName, handler);		
		}else{
			this.Calendar.observe(eventName, handler);
		}
		return this;
	},
/**
 * InputCalendar#removeInputCalendar() -> InputCalendar
 *
 * Cette méthode supprime le lien entres deux instances d'[[InputCalendar]].
 **/
	removeInputCalendar: function(){
		if(this.parent != ''){
			this.parent.child = '';
			this.parent = '';
		}
		return this;
	},
/** alias of: InputCalendar#removeInputCalendar
 * InputCalendar#removeLink() -> InputCalendar
 *
 * Cette méthode supprime le lien entres deux instances d'[[InputCalendar]].
 **/	
	removeLink: function(){
		return this.removeInputCalendar();
	},
/**
 * InputCalendar#stopObserving(eventName, callback) -> InputCalendar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * Le champ d'auto-complétion prend en charge un certain nombre d'événement personnalisé, comme suivant :
 *
 * * `change` : Appelle la fonction lorsque l'utilisateur change de date.
 * * `draw` : Appelle la fonction lorsque le calendrier appel la méthode [[Calendar.draw]].
 * * `next` : Appelle la fonction lorsque le bouton suivant (Mois) est cliqué. 
 * * `nexttwo` : Appelle la fonction lorsque le bouton suivant (Année) est cliqué. 
 * * `prev` : Appelle la fonction lorsque le bouton précédent (Mois) est cliqué. 
 * * `prevtwo` : Appelle la fonction lorsque le bouton précédent (Année) est cliqué.
 * * `uphours` : Appelle la fonction lorsque le bouton des heures (Heure + 1) est cliqué. 
 * * `downhours` : Appelle la fonction lorsque le bouton des heures (Heure - 1) est cliqué. 
 * * `upmin` : Appelle la fonction lorsque le bouton des minutes (Minute + 1) est cliqué. 
 * * `downmin` : Appelle la fonction lorsque le bouton des minutes (Minute - 1) est cliqué.
 *
 **/
	stopObserving:function(eventName, handler){
		this.Calendar.stopObserving(eventName, handler);
		return this;
	},
/**
 * InputCalendar#write() -> InputCalendar
 *
 * Cette méthode écrit la date dans le champ de saisie.
 **/
	write: function(){
		if(this.format == 'Y-m-d h:i:s' || this.format == 'd/m/Y h:i:s'){
			this.Input.value = this.Calendar.getDate().toString_('date', MUI.lang);
		}else{
			this.Input.value = this.Calendar.getDate().format(this.format);
		}
		
		var hours =  ('0' + Math.floor(this.Calendar.getDate().getMinutes() / this.step) * this.step).slice(-2);
		this.Hours.Value(this.Calendar.getDate().format('h') + ':' + hours);
		
		return this;
	},
	/**
	 * Gestion des événements upHours, downHours, upMin et downMin.
	 * @event
	 */
	onChangeTime: function(bool){
				
		if(this.DateInterval.min){
			if(this.getDate().toString_('datetime') < this.DateInterval.min.toString_('date')+ ' 00:00:00'){
				this.Calendar.setDate(this.DateInterval.min.format('Y-m-d 00:00:00'));
			}
		}
		
		if(this.DateInterval.max){
			if(this.getDate().toString_('datetime') > this.DateInterval.max.toString_('date')+ ' 23:59:59'){
				this.setDate(this.DateInterval.max.format('Y-m-d 23:59:59'));
			}
		}
		
		if(this.parent){
			if(this.parent.getDate().toDate().toString_('datetime') > this.getDate().toString_('datetime')){
				this.setDate(this.parent.getDate().clone());
			}
			
		}

		if(this.child){
			if(this.getDate().toString_('datetime') > this.child.getDate().toDate().toString_('datetime')){
				this.child.setDate(this.getDate());
			}else{
				this.child.setDate(this.child.getDate());
			}
		}
		
		this.setDate(this.getDate());
		
		if(!bool) {			
			this.Calendar.Observer.fire('calendar:change', null, this.Calendar.CurrentDate);
		}
	},
/*
 * InputCalendar#onDraw(node) -> void
 * - node (Element): Element contenant une date du calendrier.
 *
 * Cette méthode est déclenché lorsque le calendrier construit la grille des jours d'un mois. 
 * Elle permet de désactiver l'affichage d'un jour.
 **/
	onDraw: function(node){
		
		if(this.DateInterval.min){
			if(node.getDate().toString_('date') < this.DateInterval.min.toString_('date')){
				node.lock();
				return;
			}
		}
		
		if(this.DateInterval.max){
			if(node.getDate().toString_('date') > this.DateInterval.max.toString_('date')){
				node.lock();
				return;
			}
		}
		
		if(this.parent == null || this.parent == '') return;
		
		if((node.getDate().toString_('date') < this.parent.Input.value.toDate().toString_('date', 'eng'))){
			node.lock();
			return;
		}
	},
/**
 * InputCalendar#Value([value]) -> String
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
 *     var c = new InputCalendar();
 *     c.Value('1992-07-24 18:00:00');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new InputCalendar();
 *     c.Value('1992-07-24 18:00:00');
 *     alert(c.Value()); //1992-07-24 18:00:00
 *
 **/
 	Value: function(date){
		if(date){
			this.setDate(date);	
		}
		
		return this.getDate().format('Y-m-d H:i:s');
	},
/**
 * InputCalendar#getDate() -> Date
 *
 * Cette méthode retourne la date de l'instance.
 **/
	getDate: function(){
		
		if(this.hasClassName('datetime')){
			var date =  this.Calendar.getDate();
			date.setHours(this.Hours.Value().split(':')[0], this.Hours.Value().split(':')[1], 0, 0);
			return date.clone();
		}
		
		return this.Calendar.getDate();
	},
/**
 * InputCalendar#setDate(date) -> InputCalendar
 * - date (Date | String): Nouvelle date.
 *
 * Cette méthode assigne une nouvelle date à l'instance du calendrier.
 **/
	setDate: function(date){
		if(date == '' || Object.isUndefined(date)){
			date = new Date();
		}
		
		this.Calendar.setDate(date);					
		return this.write();
	},
/**
 * InputCalendar#setFormat(frm) -> InputCalendar
 * - frm (String): Format de la date.
 * 
 * Cette méthode assigne un format d'affichage pour la date. 
 *
 * Pour la syntaxe du format repportez vous à la méthode [[Date#format]].
 **/
	setFormat: function(str){
		this.Input.value = this.Calendar.getDate().format(str);
		this.format = str;	
		
		return this;
	},
/**
 * InputCalendar#setStep(frm) -> InputCalendar
 * - frm (String): Format de la date.
 * 
 * Cette méthode assigne un format d'affichage pour la date. 
 *
 * Pour la syntaxe du format repportez vous à la méthode [[Date#format]].
 **/	
	setStep: function(step){
		
		var date = new Date();
		date.setMonth(0, 1);
		date.setHours(0, 0, 0, 0);
					
		var array = [];
		
		for(var i = 0; i < 24 * 60; i += step){
			array.push({text:date.format('h:i'), value:date.format('h:i')});
			date.setMinutes(date.getMinutes() + step);
		}
		
		this.step = step;
		this.Hours.setData(array);
		
		return this;
	}
};
/* section: Form
 * class InputHoursCalendar < InputCalendar
 *
 * Cette classe ajoute le support du champ de saisie avec calendrier.
 *
 * <p class="note">Cette classe est définie dans le fichier window.calendar.js</p>
 **/
var InputHoursCalendar = function(options){
	var input = new InputCalendar(options);
	Object.extend(input, this);
	input.initialize.apply(input, $A(arguments));
	return input;
};
InputHoursCalendar.prototype = {
/*
 * new InputHoursCalendar([options])
 * - options(Object): Options de configuration.
 *
 * Initialise une nouvelle instance du calendrier.
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `date` (`Date`): Indique une date par défaut au calendrier (optionnel, par défault date du jour).
 * * `pas` (`Number`): Pas d'incrémentation des minutes.
 *
 **/
 	
};
/**
 * InputCalendar.Transform(node) -> InputCalendar
 * InputCalendar.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputCalendar.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[InputCalendar]].
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
 * <p>Cette exemple montre comment créer une instance InputCalendar Javascript :</p>
 * 
 *     var input = InputCalendar();
 *     document.body.appendChild(input);
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputCalendar en HTML :</p>
 *
 *     //Champs date
 *     <input class="box-input-calendar" type="text" />
 *     //Champs date et heure
 *     <input class="box-input-calendar datetime step-15" type="text" />
 *
 * </div>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputCalendar en HTML 5 :</p>
 *
 *     //Champs date
 *     <input class="box-input-calendar" type="text" />
 *     //Champs date et heure
 *     <input class="box-input-calendar" type="text" date-step="15" data-hours="true" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <div>
 * <p>InputCalendar simple :</p>
 * <input class="box-input-calendar" type="text" />
 * 
 * <p style="margin-top:10px">InputCalendar avec champs de choix des heures et minutes :</p>
 * <input class="box-input-calendar" type="text" date-step="15" data-hours="true" />
 * </div>
 *
 *
 **/
InputCalendar.Transform = function(e){
	
	if(Object.isElement(e)){
		var options = {};
		
		if(e.className.indexOf('type-') > -1){
			options.type =	e.className.slice(e.className.indexOf('type-'), e.className.length).split(' ')[0].replace('type-', '');
		}
		
		if(e.className.indexOf('pas-') > -1){
			options.pas =	1 * e.className.slice(e.className.indexOf('pas-'), e.className.length).split(' ')[0].replace('pas-', '');
		}
		
		if(e.className.indexOf('step-') > -1){
			options.step =	1 * e.className.slice(e.className.indexOf('step-'), e.className.length).split(' ')[0].replace('step-', '');
		}
		
		//HTML5
		if(e.data('hours')){
			options.type =	'datetime';
		}
		
		if(e.hasClassName('datetime')){
			options.type =	'datetime';
		}
		if(isNaN(1 * e.data('step'))){
			options.step =  e.data('step');
		}
		
		var node = 			new InputCalendar(options);
		node.id = 			e.id;
		//node.Input.name = 	e.name;
		node.title = 		e.title;
		
		node.addClassName(e.className.replace('box-input-calendar', ''));
		
		node.setDate(e.value);
			
		e.replaceBy(node);
		node.appendChild(e);
		
		e.type = 'hidden';
		
		e.getInstance = function(){
			return node;
		};
		
		node.on('change', function(){
			e.value = node.getDate().format('Y-m-d H:i:s');
		});
		
		if(e.data('empty') && !e.value.isDate()){
			node.Input.value = '';
		}
				
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputCalendar.Transform(e));
	});
	
	return options;
};
