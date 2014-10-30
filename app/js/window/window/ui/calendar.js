/** section: UI
 * class Calendar < Element
 *
 * Cette classe permet de créer un calendrier naviguable.
 **/
var Calendar = Class.createSprite('div'); 

Calendar.prototype = {
	__class__: 'calendar',
	className: 'wobject border calendar',
/*
 * Calendar#header -> Node
 * Entête du calendrier.
 **/
	header: 	null,
/*
 * Calendar#body -> Node
 * Corps du calendrier.
 **/
	body:		null,
/*
 * Calendar#footer -> Node
 * Pied de page du calendrier.
 **/
	footer: 	null,
/**
 * Calendar#CurrentDate -> Date
 * Date courrante de l'instance.
 **/
	CurrentDate: 	null,
/**
 * Calendar#DATE_NOW -> Date
 * {constant} Date d'aujourd'hui.
 **/
	DATE_NOW:		null,
	Observer: 		null,
	hidden_:		false,
	hiddenHours_: 	false,
	format:			'',
/**
 * new Calendar([options])
 * - options(Object): Options de configuration.
 *
 * Initialise une nouvelle instance du calendrier.
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `hours` (Boolean): Active ou désactive la navigation du calendrier avec les heures.
 * * `date` (`Date`): Indique une date par défaut au calendrier (optionnel, par défault date du jour).
 *
 **/
	initialize: function(obj){
		
		var options = {
			hours: 	false,
			date:	new Date(),
			format:	MUI.lang == 'fr' ? 'd/m/Y' : 'Y-m-d'
		};
		
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		//#pragma region Instance
		this.pas =			options.pas;
		this.format =		options.format;
		this.CurrentDate = 	options.date;
		this.DATE_NOW = 	new Date();
		//
		// Observer
		//
		this.Observer =		new Observer();
		this.Observer.bind(this);
		//
		// BtnNext
		//
		this.Flag =			new Flag(FLAG.TOP);
		//
		// Header
		//
		this.header = 		new Node('div', {className:'gradient border wrap-header calendar-head'});
		//
		// headerGrid
		//
		this.headerGrid =	new Node('div', {className:'wrap-grid grid-header calendar-grid-head'});
		//
		// bodyGrid
		//
		this.bodyGrid =		new Node('div', {className:'wrap-grid grid-body calendar-grid-body'});
		//
		// Body
		//
		this.body = 		new Node('div', {className:'font wrap-body calendar-body'}, [this.headerGrid, this.bodyGrid,new Node('div', {className:'clearfloat'})]);
		//
		// NodeDate
		//
		this.NodeDate =		new Node('div', {className:'font wrap-title calendar-node-date'}, this.CurrentDate.format(this.format));
		//
		// BtnNext
		//
		this.BtnNext = 		new SimpleButton({icon:'next'});
		this.BtnNext.addClassName('next');
		//
		// BtnNextTwo
		//		
		this.BtnNextTwo = 	new SimpleButton({icon:'nexttwo'});
		this.BtnNextTwo.addClassName('nexttwo');
		//
		// BtnPrev
		//		
		this.BtnPrev = 		new SimpleButton({icon:'prev'});
		this.BtnPrev.addClassName('prev');
		//
		// BtnPrevTwo
		//		
		this.BtnPrevTwo = 	new SimpleButton({icon:'prevtwo'});
		this.BtnPrevTwo.addClassName('prevtwo');
		
		//this.HiddenHours(!options.hours);
		//#pragma end region Instance
		
		this.header.appendChilds([
			this.BtnPrevTwo,
			this.BtnPrev,
			this.BtnNextTwo,
			this.BtnNext,
			this.NodeDate
		]);
				
		this.appendChilds([
			this.header,
			this.body,
			
			this.Flag
		]);
		
		for(var i = 0; i < 7; i++){
			var y = 0;
			if(MUI.lang == 'fr')  y = (i+1) % 7;
			else y = i;
			
			var node = new Node('span', {className:'wrap-day'}, MUI.getDay(y).slice(0,1));
			
			this.headerGrid.appendChild(node);
			if(y == 0 || y == 6) node.addClassName("weekend"); 
		}
		
		this.draw();
		
		//#pragma region Event
		
		this.BtnNext.observe('mouseup', this.onClickNext.bind(this));
		this.BtnNextTwo.observe('mouseup', this.onClickNextTwo.bind(this));
		this.BtnPrev.observe('mouseup', this.onClickPrev.bind(this));
		this.BtnPrevTwo.observe('mouseup', this.onClickPrevTwo.bind(this));
		
		this.Flag.add(this.BtnNext, {
			orientation: 	Flag.TOP,
			icon:			'documentinfo',
			color:			'grey',
			text:			$MUI('Avance le calendrier d\'un mois')
		});
		
		this.Flag.add(this.BtnNextTwo, {
			orientation: 	Flag.TOP,
			icon:			'documentinfo',
			color:			'grey',
			text:			$MUI('Avance le calendrier d\'un an')
		});
		
		this.Flag.add(this.BtnPrev, {
			orientation: 	Flag.TOP,
			icon:			'documentinfo',
			color:			'grey',
			text:			$MUI('Recule le calendrier d\'un mois')
		});
		
		this.Flag.add(this.BtnPrevTwo, {
			orientation: 	Flag.TOP,
			icon:			'documentinfo',
			color:			'grey',
			text:			$MUI('Recule le calendrier d\'un an')
		});
				
		//#pragma end region Event
		
	},
	
	destroy: function(){
		this.stopObserving();
		this.destroy = 		null;
		this.className = 	'';
		
		this.Observer.destroy();
		
		this.Observer = 	null;
		this.header = 		null;
		this.headerGrid =	null;
		this.bodyGrid =		null;
		this.body = 		null;
		this.footer = 		null;
		this.NodeDate =		null;
		this.NodeHours =	null;
		this.NodeMin =		null;
		this.BtnNext = 		null;		
		this.BtnNextTwo = 	null;	
		this.BtnPrev = 		null;
		this.BtnPrevTwo =  	null;	
		this.BtnUpHours =	null;
		this.BtnDownHours =	null;
		this.BtnUpMin =		null;		
		this.BtnDownMin =	null;
		this.TableData =	null;
		this.Flag =			null;
		
		try{this.select('.wobject').each(function(e){
				if(Object.isFunction(e.destroy)) e.destroy();
			});}catch(er){}
	},
/**
 * Calendar#Hidden(bool) -> Boolean
 * - bool (Boolean): Cache ou affiche le calendrier.
 *
 * Cette méthode cache ou affiche le calendrier en fonction du paramètre `bool`.
 * Elle retourne enfin l'etat du calendrier.
 *
 * Si `bool` est vrai le calendrier sera caché.
 **/
	Hidden:function(bool){
		if(!Object.isUndefined(bool)){
			this.hidden_ = bool;
			
			if(this.hidden_){
				this.hide();	
			}else{
				this.show();
			}
		}
		return this.hidden_;
	},
/*
 * Calendar#HiddenHours(bool) -> Boolean
 * - bool (Boolean): Active ou désactive la gestion des heures.
 *
 * Cette méthode active ou désactive la gestion de l'heure de l'instance.
 * Si `bool` est vrai la gestion des heures sera désactivé.
 **/	
	HiddenHours: function(bool){},
/**
 * Calendar#draw() -> Calendar
 * 
 * Cette méthode contruit le calendrier à partir de la date actuelle de l'instance.
 **/ 
	draw: function(){
		
		this.bodyGrid.removeChilds();
			
		var sender = 	this;
		var obj = {
			today:		(new Date()).toString_('date'),
			current:	this.CurrentDate.clone(),
			debut: 		this.CurrentDate.clone(),
			fin:		this.CurrentDate.clone(),
			offset:	{
				debut:	0,
				fin:	0
			}
		};
		
		//calcul du début et de fin
		obj.debut.setDate(1);
		obj.fin.setDate(obj.current.daysInMonth());
		
		
		//calcul du offset debut
		obj.offset.debut = 	(MUI.lang == 'fr') ? ((obj.debut.getDay()== 0) ? 6 : obj.debut.getDay() - 1) : obj.debut.getDay();
		obj.offset.fin = 	6 - ((MUI.lang == 'fr') ? ((obj.fin.getDay()== 0) ? 6 : obj.fin.getDay() - 1) : obj.fin.getDay());
		
		//definition des nouvelles de debut et de fin
		obj.debut.setDate(1 - obj.offset.debut);
		obj.fin.setDate(obj.fin.getDate() + obj.offset.fin);
		
		obj.it = 		obj.current.daysInMonth() + obj.offset.debut + obj.offset.fin;	
		obj.fin = 		obj.fin.toString_('date');	
		obj.current = 	obj.current.toString_('date');
		
		this.DateStart = 	obj.debut.clone();
		this.DateEnd =		obj.fin.toDate();
		
		for(var i = 0; i < obj.it; i++){
			//
			// Special Node
			//
			var node = 		new NodeDay(obj.debut);
			
			if(obj.current == obj.debut.toString_('date')){
				node.selected(true);	
			}else{
				if(obj.current.toDate().getMonth() != obj.debut.getMonth()) {
					node.enabled(false);
				}	
			}
						
			//information par Flag					
			node.observe('mouseover', function(){
				if(this.locked) return;
				
				sender.Flag.setText('<b>' + this.getDate().format('d F Y') + '</b>');
				sender.Flag.color('grey').setType(FLAG.TOP).show(this, true);
			});
			//Evenement lié au clic
			node.observe('mouseup', function(evt){sender.onClickDay(evt, this);});
			//Déclenchement de l'événement calendar:draw
			this.Observer.fire('calendar:draw', node, this);
				
			this.bodyGrid.appendChild(node);
			
			obj.debut.setDate(obj.debut.getDate() + 1);	
		}
		
		return this;
	},
/**
 * Calendar#observe(eventName, callback) -> Calendar
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
 * * `draw` : Appelle la fonction lorsque le calendrier appel la méthode [[Calendar#draw]].
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
	observe: function(eventName, callback){

		switch(eventName){
			case 'click.day':
			case 'change':
			case 'draw':
			case 'next':
			case "nexttwo":
			case 'nextwo':
			case 'prev':
			case 'prevtwo':
			case 'uphours':
			case 'downhours':
			case 'upmin':
			case 'downmin':
				this.Observer.observe('calendar:'+eventName, callback);
				break;
			default:
				Event.observe(this, eventName, callback);
		}
		return this;
	},
/**
 * Calendar#stopObserving(eventName, callback) -> Calendar
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case 'click.day':
			case 'change':
			case 'draw':
			case 'next':
			case 'nextwo':
			case 'prev':
			case 'prevtwo':
			case 'uphours':
			case 'downhours':
			case 'upmin':
			case 'downmin':
				this.Observer.stopObserving('calendar:'+eventName, callback);
				break;
			default:
				Event.stopObserving(this, eventName, callback);
		}
		return this;
	},
/**
 * Calendar#onClickDay(evt, node) -> void
 * - evt (Event): Objet événement.
 * - node (Element): Element ciblé par l'événement.
 *
 **/
	onClickDay: function(evt, node){
		if(node.locked) return;
		
		this.NodeDate.innerHTML = 	node.getDate().format(this.format);
		this.CurrentDate = 			(node.getDate().toString_('date', MUI.lang) + ' ' + this.CurrentDate.format('h:i:00')).toDate();
		
		this.draw();

		this.Observer.fire('calendar:click.day', evt, node);
		this.Observer.fire('calendar:change', evt, this.CurrentDate);
	},
/**
 * Calendar#onClickPrev(evt) -> void
 * - evt (Event): Objet événement.
 *
 **/
	onClickPrev: function(evt){
		Event.stop(evt);
		this.CurrentDate.setMonth(this.CurrentDate.getMonth() - 1, 1);
		this.NodeDate.innerHTML = this.CurrentDate.format(this.format);
		this.draw();
		
		this.Observer.fire('calendar:prev', this);		
	},
/**
 * Calendar#onClickPrevTwo(evt) -> void
 * - evt (Event): Objet événement.
 *
 **/
	onClickPrevTwo: function(evt){
		
		this.CurrentDate.setFullYear(this.CurrentDate.getFullYear() - 1);
		this.NodeDate.innerHTML = this.CurrentDate.format(this.format);
		this.draw();
		
		this.Observer.fire('calendar:prevtwo', this);
	},
/**
 * Calendar#onClickNext(evt) -> void
 * - evt (Event): Objet événement.
 *
 **/
	onClickNext: function(evt){
		this.CurrentDate.setMonth(this.CurrentDate.getMonth() + 1, 1);
				
		this.NodeDate.innerHTML = this.CurrentDate.format(this.format);		
		this.draw();
		
		this.Observer.fire('calendar:next', this);
	},
/**
 * Calendar#onClickNextTwo(evt) -> void
 * - evt (Event): Objet événement.
 *
 **/
	onClickNextTwo: function(evt){
		this.CurrentDate.setFullYear(this.CurrentDate.getFullYear() + 1);
		this.NodeDate.innerHTML = this.CurrentDate.format(this.format);
		this.draw();	
		
		this.Observer.fire('calendar:nexttwo', this);
	},
/**
 * Calendar#getDate() -> Date
 * 
 * Cette méthode retourne la date de l'instance.
 **/
	getDate: function(){
		return this.CurrentDate.clone();
	},
/**
 * Calendar#setDate(date) -> Calendar
 * - date (Date): Nouvelle date.
 *
 * Cette méthode assigne une nouvelle date à l'instance du calendrier.
 **/
	setDate: function(date){
		if(Object.isUndefined(date)) return;
		
		try{
			if(!Object.isFunction(date.getDate)){
				if(Object.isString(date)){
					date = date.toDate();
				}
			}
		}catch(er){
			date = new Date();	
		}
		
		if(date.format('Y') < 1800){
			date = new Date();
		}
		
		this.CurrentDate = date;
		
		this.CurrentDate.setSeconds(0);
		
		this.NodeDate.innerHTML = 	this.CurrentDate.format(this.format);
		
		this.draw();
		
		return this;
	},
/*
 * Calendar#setPas(pas) -> Calendar
 * - pas (Number): Pas d'incrémentation des heures.
 *
 * Cette méthode change le pas d'incrémentation des minutes.
 **/
	setPas: function(pas){
		/*this.pas = pas;
		
		var minute = 				('0'+(Math.round(new Number(this.CurrentDate.format('i')) / this.pas) * this.pas)).slice(-2);
		this.CurrentDate.setMinutes(minute);
		this.CurrentDate.setSeconds(0);
		
		this.NodeDate.innerHTML = 	this.CurrentDate.format(this.format);
		//this.NodeHours.innerHTML =	('0' + this.CurrentDate.getHours()).slice(-2);
		//this.NodeMin.innerHTML =	('0' + this.CurrentDate.getMinutes()).slice(-2);*/
		return this;
	}
};
/** section: UI
 * class NodeDay
 * 
 * Cette classe gère l'affichage d'un jour pour une instance [[Calendar]].
 **/
var NodeDay = Class.createSprite('span');

NodeDay.prototype = {
	__class__:'node-day',
	className:'wobject node-day',
/**
 * NodeDay#Date -> Date
 * Date de l'instance.
 **/
	Date: 		null,
	date: 		null,
/**
 * NodeDay#locked -> Boolean
 **/				
	locked: 	false,
	selected_:	false,
	enabled_:	false,
/**
 * new NodeDay([date])
 * - date (Date): Date à afficher dans l'instance.
 *
 * Cette méthode créée une nouvelle instance de [[NodeDay]].
 **/
	initialize: function(date){
		if(!Object.isUndefined(date)){
			this.setDate(date);
		}
	},
/**
 * NodeDay#lock() -> void
 * 
 * Cette méthode vérrouille l'affichage de l'instance. La date ne sera pas visible.
 **/
	lock: function(){
		this.locked = 		true;
		this.innerHTML = 	"&nbsp;";
		this.removeClassName('disabled');
		this.addClassName('disabled');
		this.removeClassName('current');
		this.removeClassName('now');
	},
/**
 * NodeDay#unlock() -> void
 * 
 * Cette méthode déverrouille l'affichage de l'instance. La date sera visible.
 **/
	unlock: function(){
		this.locked = false;
		this.removeClassName('disabled');
		this.selected(this.selected());
		this.setDate(this.Date);
	},
/**
 * NodeDay#Enable(bool) -> Boolean
 **/
 	Enable:function(bool){
		return this.enabled(bool);
	},
/*
 * NodeDay#enabled(bool) -> Boolean
 **/
	enabled: function(bool){
		if(!Object.isUndefined(bool)){
			this.removeClassName('off');
			
			if(!bool){
				this.addClassName('off');
			}
			
			this.enabled_ = bool;
		}
		
		return this.enabled_;
	},
/**
 * NodeDay#addTag() -> void
 *
 * Cette méthode ajoute un tag visuel à l'instance.
 **/	
	addTag: function(type){
		
		this.innerHTML = this.Date.getDate() + '<span class="bartag"><span class="dottag"></span></span>';
		
		switch(type){
			default:		
				this.addClassName('tagged');
				
				if(!isNaN(type * 1)){
					this.innerHTML = this.Date.getDate() + '<div class="tag-button">'+ type +'</div>';	
				}
				
				break;
			case 'left':	
				this.addClassName('tagged-left');
				break;
			case 'right':	
				this.addClassName('tagged-right');
				break;
			case 'middle':	
				this.addClassName('tagged-middle');
				break;
		}
	},
/**
 * NodeDay#removeTag() -> void
 *
 * Cette méthode supprime le tag visuel de l'instance.
 **/
	removeTag: function(){
		this.removeClassName('tagged');
		this.removeClassName('tagged-middle');
		this.removeClassName('tagged-right');
		this.removeClassName('tagged-left');
	},
/**
 * NodeDay#Selected(bool) -> Boolean
 * 
 * Change l'état de l'instance en fonction de la valeur de `bool`.
 **/
 	Selected: function(bool){
		return this.selected(bool);
	},
/*
 * NodeDay#selected(bool) -> Boolean
 * 
 * Change l'état de l'instance en fonction de la valeur de `bool`.
 **/
 	selected: function(bool){
		
		if(!Object.isUndefined(bool)){
			this.removeClassName('current');
			
			if(bool){
				this.addClassName('current');
			}
			
			this.selected_ = bool;
		}
		
		return this.selected_;
	},
/**
 * NodeDay#setDate(date) -> void
 *
 * Cette méthode change la date de l'instance.
 **/
	setDate: function(date){
		if(!Object.isUndefined(date)){
			
			if(this.date){
				this.removeClassName('date-' + this.date.format('Ymd'));
			}
			
			this.date = this.Date = date.clone();
			this.innerHTML = this.Date.getDate();
			
			var now = new Date();
			
			this.removeClassName('now');
			this.removeClassName('weekend');
			
			this.addClassName('date-' + this.date.format('Ymd'));
			
			if(this.Date.toString_('date') == now.toString_('date')){
				this.addClassName('now');
			}else{				
				if(this.Date.getDay() == 0 || this.Date.getDay() == 6){
					this.addClassName('weekend');
				}	
			}
			
			try{
				
			}catch(er){}
 		}
	},
/**
 * NodeDay#getDate() -> Date
 *
 * Cette méthode retourne la date de l'instance.
 **/	
	getDate: function(){
		return this.Date;
	}
};
/**
 * Calendar.Transform(node) -> Select
 * Calendar.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance Calendar.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[Calendar]].
 *
 * #### Exemple
 *
 *      //Dans une page HTML
 *      <div class="box-calendar"></div>
 *      //action js
 *      HeadPiece.Transform('.box-calendar');
 *
 * #### Résultat
 * 
 * <div class="box-calendar">1987-07-24</div>
 **/
Calendar.Transform = function(e){
	
	if(Object.isElement(e)){
			
		var date =			e.innerHTML;	
		var calendar = 		new Calendar();
		
		if(e.innerHTML != '') calendar.setDate(e.innerHTML);
		
		calendar.addClassName(e.className);
		calendar.removeClassName('box-calendar');
				
		e.replaceBy(calendar);
		
		return calendar;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(Calendar.Transform(e));
	});
	
	return options;
};