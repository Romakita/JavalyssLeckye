MUI.addWords({
	'Today':	'Aujourd\'hui',
	'Daily':	'Jour',
	'Weekly':	'Semaine',
	'Monthly':	'Mois',
	'7 days':	'7 jours'
}, 'fr');

/** section: UI
 * class Schedule
 * Cette classe permet de créer un planning dynamique.
 **/
var Schedule = Class.createElement('div');
/**
 * Schedule.DAILY -> String
 **/
Schedule.DAILY = 	'daily';
/**
 * Schedule.WEEKLY -> String
 **/
Schedule.WEEKLY = 	'weekly';
/**
 * Schedule.MONTHLY -> String
 **/
Schedule.MONTHLY = 	'monthly';
/**
 * Schedule.CUSTOM -> String
 **/
Schedule.CUSTOM = 	'custom';

Schedule.prototype = {
	className:'wobject schedule',
/**
 * Schedule#link -> String
 **/
	link:		'',
/**
 * Schedule#parameters -> String
 **/
	parameters:	'',
/**
 * Schedule#rows -> Number
 **/	
	rows:		24,
/**
 * Schedule#cols -> Number
 **/
	cols:		7,
/**
 * Schedule#offStart -> Number
 **/	
	offStart:	8,
/**
 * Schedule#offEnd -> Number
 **/	
	offEnd:		18,
/**
 * Schedule#marginLeft -> Number
 **/	
	marginLeft:	2,
/**
 * Schedule#marginRight -> Number
 **/	
	marginRight:2,
/**
 * Schedule#collision -> Boolean
 **/
	collision:	false,
		
	format:			'l d F Y',
	headerFormat:	'l d F',
	
	mode:		'weekly',
/**
 * new Schedule()
 *
 * Créée une nouvelle instance [[Schedule]].
 **/
 	initialize: function(options){
		
		if(this.link == ''){
			this.link = $WR().getGlobals('link');
		}
		
		if(!Object.isUndefined(options)){
			Object.extend(this, options);
		}
		
		
		if(!this.collision && this.marginRight < 10){
			this.marginRight = 10;	
		}
		//
		//
		//
		this.data = 	new Array();
		//
		//
		//
		this.Date =		new Date();
		//
		// Header
		//
		this.header = 	new Node('div', {className:'wrap-header'});
		//
		// Body
		//
		this.body = 	new Node('div', {className:'wrap-body'});
		this.body.wrapper =	new Node('div');
		this.body.appendChild(this.body.wrapper);
		
		this.body.dateMarker = 			new Node('div', {className:'wrap-date-marker'});
		this.body.dateMarker.marker = 	new Node('div', {className:'date-marker'});
		
		this.body.arrowMarker = 		new Node('div', {className:'content-arrow-marker'});
		this.body.arrowMarker.marker = 	new Node('div', {className:'arrow-marker'});
		
		this.body.dateMarker.appendChild(this.body.dateMarker.marker);
		this.body.arrowMarker.appendChild(this.body.arrowMarker.marker);
		//
		//
		//
		this.topBar = new Node('div', {className:'topbar'});
		this.header.appendChild(this.topBar);
		//
		//
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		this.Flag1 = this.Flag = new Flag();
		this.Flag2 = new Flag();
		
		this.appendChild(this.header);
		this.appendChild(this.body);
		this.appendChild(this.Flag);
		this.appendChild(this.Flag2);
		
		this.Timer = new Timer(this.onTick.bind(this), 0.1);
		this.Timer.start();
		
		this.body.on('mousedown', this.onMouseDownBody.bind(this));	
		this.body.oncontextmenu = function(){return false;};
		
		this.BtnToday = 	new SimpleButton({text:$MUI('Today')});
		this.BtnPrevious = 	new SimpleButton({icon:'prev'});
		this.BtnNext = 		new SimpleButton({icon:'next'});
		this.MenuCalendar = new MenuCalendar({format:this.format, nofill:true, icon:''});
		
		this.BtnDaily = 	new SimpleButton({text:$MUI('Daily')});
		this.BtnWeekly = 	new SimpleButton({text:$MUI('Weekly')});
		this.BtnMonthly = 	new SimpleButton({text:$MUI('Monthly')});
		this.Btn7Days = 	new SimpleButton({text:$MUI('7 days')});
		
		this.addGroupButton([this.BtnToday]);
		this.addGroupButton([this.BtnPrevious, this.BtnNext]);
		this.addGroupButton([this.MenuCalendar]);
		
		var groupView = [this.BtnDaily, this.BtnWeekly, this.BtnMonthly, this.Btn7Days];
		
		if(options.toolbarView){
			if(Object.isElement(options.toolbarView)){
				groupView.push(options.toolbarView);
			}else{
				groupView = groupView.concat(options.toolbarView);
			}
		}
		
		var group = this.addGroupButton(groupView);
		group.addClassName('right toolbar-view');
		group.Selectable(true);
		
		switch(this.mode){
			case Schedule.DAILY:
				this.cols = 1;
				this.BtnDaily.Selected(true);
			default:
			
			case Schedule.CUSTOM:
				this.MenuCalendar.setFormat(this.format);
				this.resizeTo(this.cols, this.rows);
				
				break;
				
			case Schedule.WEEKLY:
				this.Date.setDay(1);
				this.Date.setHours(0,0,0);
				this.cols = 7;
				this.MenuCalendar.setFormat('$S - $E Y');
				this.resizeTo(this.cols, this.rows);
				this.BtnWeekly.Selected(true);
				break;
				
			case Schedule.MONTHLY:
				this.Date.setDate(1);
				this.Date.setHours(0,0,0);
				this.cols = this.Date.daysInMonth();
				this.MenuCalendar.setFormat('F Y');
				this.resizeTo(this.cols, this.rows);
				this.BtnMonthly.Selected(true);
				break;
		}
		
		this.BtnPrevious.on('click', this.previous.bind(this));
		this.BtnNext.on('click', this.next.bind(this));
		this.BtnDaily.on('click', this.daily.bind(this));
		this.BtnWeekly.on('click', this.weekly.bind(this));
		this.BtnMonthly.on('click', this.monthly.bind(this));
		this.Btn7Days.on('click', this.sevenDays.bind(this));
		
		document.stage.resize(function(){
			this.resize();
		}.bind(this));
		
		this.MenuCalendar.on('change', function(){
			
			this.Date = this.MenuCalendar.getDate();
			
			this.Observer.fire('change.date');
			
			this.setDate(this.Date);
			
		}.bind(this));
		
		this.BtnToday.on('click', function(){
			
			this.Date = new Date();
			
			this.Observer.fire('change.date');
			
			this.setDate(this.Date);
			
		}.bind(this));
		
		document.on('mouseup', function(){
			this.destroyLastEvent();
		}.bind(this));
	},
/**
 * Schedule#addGroupButton(childs) -> GroupButton
 **/
	addGroupButton:function(childs){
		var group = new GroupButton();
		
		if(Object.isElement(childs)) group.appendChild(childs);
		else{
			group.appendChilds(childs);
		}
		
		this.topBar.appendChild(group);
		return group;
	},
	
	NavBar:function(){
		return this.topBar;
	},
/*
 * Schedule#addEvent(options) -> Schedule.Event
 * - options (Object): Configuration de l'événement.
 *
 * Cette méthode permet d'ajouter une événement à l'agenda.
 **/	
	addEvent: function(options){
		
		if(Object.isUndefined(options)){
			return;	
		}
		
		this.createEvent(options);
	},
/**
 * Schedule#createEvent(options) -> Schedule.Event
 * - options (Object): Configuration de l'événement.
 *
 * Cette méthode créée un événement sur l'agenda.
 **/	
	createEvent:function(options){
		
		if(Object.isUndefined(options)){
			return;	
		}
		
		var datestart = 	Object.isString(options.start) ? options.start.toDate() : options.start.clone();
		var dateend = 		Object.isString(options.end) ? options.end.toDate() : options.end.clone();
		var dateNow = 		new Date();
		var self =			this;
		//var firstlock = 	false;
		//var endlock = 		false;
		var celHeight = 	this.getCelHeight();
		
		if(datestart.format('Ymd') < this.Date.format('Ymd')){
			firstlock = true;
			datestart = 	this.Date.clone();
		}
		
		if(dateend.format('Ymd') > this.DateEnd.format('Ymd')){
			endlock = true;
			dateend = 	this.DateEnd.clone();
		}
		
		while(datestart.format('Ymd') <=  dateend.format('Ymd')){
			
			var event = new Schedule.Event(options);
			options.EID = this.data.length;
			
			this.data.push(options);
			
			var diff = 	Math.floor(this.Date.dateDiff(datestart));
			var cel =	this.getCol(diff);
		
			if(cel){
				
				this.body.chips.appendChild(event);
								
				event.css('width', cel.getWidth() - event.css('border-left-width') -  event.css('border-right-width') - this.marginLeft - this.marginRight - 1);
				event.css('left', cel.positionedOffset().left - this.getCol(-1).getWidth() + this.marginLeft);
				
				var top = 		0;
				var height = 	celHeight * 24;//!à modifier	
				if(datestart.format('ymd') == options.start.format('ymd')){
					top = celHeight * options.start.format('h') + ( (celHeight / 60) * options.start.format('i'));
					event.css('top', top);
					
					event.header.observe('mousedown', function(event){
						self.onResizeHeaderStart(event, this.parentNode);
					});
					
				}else{
					event.LockHeader(true);
				}	
				
				if(datestart.format('ymd') == options.end.format('ymd')){
					height = celHeight * options.end.format('h') + ( (celHeight / 60) * options.end.format('i'));
					event.footer.observe('mousedown', function(event){self.onResizeFooterStart(event, this.parentNode);});
				}else{
					event.LockFooter(true);
				}
				
				event.css('height', height - top - event.css('border-top-width') -  event.css('border-bottom-width'));
				
				if(options.end.format('ymd') < dateNow.format('ymd')){
					event.setOpacity(0.6);
				}
					
				//Ajout des événements
				if(!event.LockFooter() && !event.LockHeader()){
					
					event.observe('dragstart', function(event){event = event.memo; self.onDragStartEvent(event, this);});
					event.observe('drag', function(event){event = event.memo; self.onDragEvent(event, this);});
					event.observe('dragend', function(event){event = event.memo; self.onDragEndEvent(event, this);});
					
					
					event.constraint({
						x1:	this.marginLeft,
						x2: this.body.chips.getWidth() - 1 - this.marginRight,
						y1: 0,
						y2:	0
					});
				}
				
				event.observe('mouseup', function(event){event = event.memo; self.onMouseUpEvent(event, this);});
				
				//}else{
				//	event.observe('mousedown', function(evt){
				//		Event.stop(evt);
				//	});
				//}
				
				this.Observer.fire('draw', event);
			}
					
			datestart.setDate(datestart.getDate() + 1);
			
		}
		
		return this;
	},
	
/**
 * Schedule#addMarker(options) -> Schedule.Marker
 * - options (Object): Configuration du marqueur.
 *
 * Cette méthode permet d'ajouter un marqueur.
 **/	
	addMarker: function(options){
		
		if(Object.isUndefined(options)){
			return;	
		}
		
		this.addClassName('have-marker');
		
		var marker = Object.isElement(options) ? options : new Schedule.Marker(options);
		
		var celHeight = 	this.getCelHeight();
		
		var diff = 	Math.floor(this.Date.dateDiff(marker.getDate()));
		
		var cel =	this.getCol(diff);
		
		if(cel){
			
			this.body.chips.appendChild(marker);
			
			//marker.css('width', cel.getWidth() - event.css('border-left-width') -  event.css('border-right-width') - this.marginLeft - this.marginRight - 1);
			var offsetLeft = cel.getWidth()-marker.getWidth();
			marker.css('left', cel.positionedOffset().left - this.getCol(-1).getWidth() + offsetLeft);
			
			var height = 	celHeight * 24;//!à modifier	
			
			var top = celHeight * marker.getDate().format('h') + ( (celHeight / 60) * marker.getDate().format('i'));
			top = top - (marker.getHeight() / 2);
			
			marker.css('top', top);
			marker.on('mousedown', function(evt){
				evt.stop();
				return false;
			});
			
		}
			
		return marker;
	},
/**
 * Schedule#createProgressBar() -> ProgressBar
 *
 * Cette méthode créée une nouvelle barre de progression relative à l'instance [[Progress]].
 **/
	createProgressBar: function(obj){
		if(!Object.isUndefined(this.ProgressBar)) return;
		
		var options = {
			text:		$MUI('Chargement en cours. Patientez svp') + '...',
			fullscreen: true,
			theme:		'white',
			infinite:	true
		};
		
		Object.extend(options, obj || {});
		
		this.ProgressBar = new ProgressBar(options);
		this.ProgressBar.hide();
		
		this.appendChild(this.ProgressBar);
		
		return this.ProgressBar;
	},
/**
 * Schedule#clear() -> void
 *
 * Cette méthode supprime l'ensemble des événements affichés.
 **/	
	clear: function(){
		this.body.chips.removeChilds();
		this.data = [];
		
		this.removeClassName('have-marker');
		return this;
	},
	
	resize:function(){
		var data = this.data;
		var markers = this.body.chips.select('.schedule-marker');
		
		this.clear();
		this.setData(data);
		
		//this.Observer.fire('complete', data);
		
		markers.each(function(marker){
			this.addMarker(marker);
		}.bind(this));
		
		return this;
	},
/**
 * Schedule#createRows(rows) -> void
 *
 * Cette méthode permet de créer des lignes au planning.
 **/	
	createRows: function(rows){
		
		var sender = this;
		
		//if(Object.isUndefined(offset)) offset = 0;
		
		for(var i = 0; i < rows; i++){
			var row = {
				it:i,
				header:	new Node('div', {className:'rows header row-'+ i}, new Node('div', {className:'time'}, ('0'+i).slice(-2) +':00')),
				body:	new Node('div', {className:'rows marker row-'+ i}, new Node('div', {className:'middle-row'}))
			};
			
			row.header.friend = row.body;
			row.body.friend = 	row.header;
			
			if(i == 0){
				this.row0 = row;	
			}
			
			row.setID = function(id){
				this.Row_ID = id;
				this.header.id = 'row-' + id;
				return this;
			};
			
			row.getID = function(){
				return this.Row_ID;
			};
											
			///build-------------------------------
			this.body.header.appendChild(row.header);
			this.body.maskTime.appendChild(row.body);			
			//events-------------------------------
			
			this.Observer.fire('draw.row', row);
			
			if(i < this.offStart || i >= this.offEnd){
				row.body.addClassName('off');
			}
			
		}
		
		return this;
	},
/**
 * Schedule#createCols(col) -> void
 *
 * Cette méthode permet de créer les colonnes du planning.
 **/
 	createCols:function(cols){
		
		var sender = 		this;
		var date =			this.Date.clone();
		var dateNow =		new Date().format('Y-m-d');
		this.DateEnd =		this.Date.clone();
		this.DateEnd.setDate(this.Date.getDate() + cols)
		this.DateEnd.setHours(0,0,0);
		
		for(i = 0; i < cols; i++){
			
			var cel = {
				format:	this.headerFormat,
				date: 	date.clone(),
				it: 	i,
				header:	this.header.Table.addCel(new Node('div', {className:'day'}, date.format(this.headerFormat) ), {
							className:"cols header col-"+i, 
							returnElement:true
						}),
						
				body:	this.body.Table.addCel('',{
							className:		'cols body col-' + i,
							returnElement:	true
						}),
			/**
			 * Cel.getID() -> Number
			 **/		
				getID:function(){
					return this.it;
				},
			/**
			 * Cel.setDate(date) -> Element
			 **/	
				setDate: function(date){
					this.date = date.clone();
					this.header.removeChilds();
					this.header.appendChild(new Node('div', {className:'day'}, this.date.format(this.format)));
					this.id = 	'col-' + date.toString_('date', 'eng');
				},
			/**
			 * Cel.getDate() -> Date
			 **/
				getDate: function(){
					return this.date
				}
			};
			
			cel.header.friend = cel.body;
			cel.body.friend	=	cel.header;
			
			cel.header.parent = cel;
			cel.body.parent = cel;
			
			cel.body.getDate = cel.getDate.bind(cel);
									
			$S.fire('draw.col', cel);
			
			if(date.getDay() == 6 || date.getDay() == 0){
				cel.body.addClassName('off');
			}
			
			
			if(date.format('Y-m-d') == dateNow){
				cel.header.addClassName('today');
				cel.body.addClassName('today');
				cel.body.appendChild(this.body.dateMarker);
			}
			
			date.setDate(date.getDate()+1);
		}
	
	},
/**
 * Schedule#eventCollisionTo(sEvent) -> Boolean
 * - sEvent (Schedule.Event): Evenement.
 **/	
	eventCollisionTo:function(event, bool){
		var rect = new Rectangle(event);
		var point = new Point(rect.x, rect.y);
		if(bool){
			rect.height-=1;
		}
		
		var events = 	this.body.chips.select('.schedule-event');
		var collision = false;
		var distance =	false;
				
		for(var i = 0; i < events.length; i++){
			if(events[i] != null) {
				var compare = new Rectangle(events[i]);
				
				if(bool){
					compare.height-=1;
				}
				
				if(!compare.equals(rect)){
					if(compare.intersects(rect)){
						
						if(!collision){
							distance =  point.distanceTo(compare);
							collision = events[i];
						}else{
							var d = point.distanceTo(compare);
							if(d < distance){
								distance = d;
								collision = events[i];	
							}
						}
					}
				}
			}
		};
				
		return collision ? collision : false;
	},
/**
 * Schedule#daily() -> Schedule
 *
 * Cette méthode affiche l'agenda sur 1 jour.
 **/	
	daily: function(){
		this.mode = Schedule.CUSTOM;
		this.cols = 1;
		this.resizeTo(this.cols, this.rows);
		
		this.Observer.fire('change.date');
		
		this.setDate(this.Date);
	},
/**
 * Schedule#monthly() -> Schedule
 *
 * Cette méthode affiche l'agenda sur un mois.
 **/	
	monthly: function(){
		this.mode = Schedule.MONTHLY;
		
		this.Observer.fire('change.date');
		
		this.setDate(this.Date);
	},
/**
 * Schedule#weekly() -> Schedule
 *
 * Cette méthode affiche l'agenda sur une semaine.
 **/	
	weekly: function(){
		this.mode = Schedule.WEEKLY;
		
		this.Observer.fire('change.date');
		
		this.setDate(this.Date);
	},
/**
 * Schedule#sevenDays() -> Schedule
 *
 * Cette méthode affiche l'agenda sur 7 jours.
 **/	
	sevenDays: function(){
		this.mode = Schedule.CUSTOM;
		this.cols = 7;
		this.Date.setDay(new Date().getDay());
		this.resizeTo(this.cols, this.rows);
		
		this.Observer.fire('change.date');
		
		this.setDate(this.Date);
	},
/**
 * Schedule#next() -> Schedule
 *
 * Cette méthode permet de déplacer le calendrier du nombre de jour affiché sur l'agenda.
 **/	
	next: function(){
		this.Date.setDate(this.Date.getDate() + this.cols);
		
		this.Observer.fire('change.date');
		
		return this.setDate(this.Date);
	},
/**
 * Schedule#previous() -> Schedule
 *
 * Cette méthode permet de déplacer le calendrier du nombre de jour affiché sur l'agenda.
 **/	
	previous: function(){
		this.Date.setDate(this.Date.getDate() - this.cols);
		
		this.Observer.fire('change.date');
		
		return this.setDate(this.Date);
	},
/**
 * Schedule#previous() -> Schedule
 *
 * Cette méthode détruit le dernier événement créer et non enregistré en base de données.
 **/	
	destroyLastEvent:function(){
		if(this.lastEvent){
			if(Object.isFunction(this.lastEvent.destroy)){
				this.lastEvent.destroy();
			}
			this.lastEvent = null;
		}
	},
/**
 * Schedule#refresh() -> Schedule
 **/	
	refresh:function(){
		
		this.body.chips.removeChilds();
		
		if(Object.isElement(this.body.dateMarker.parentNode)){
			this.body.dateMarker.parentNode.removeChild(this.body.dateMarker);
		}
		
		var dateNow = new Date().format("Y-m-d");
		//mise à jour des champs dates
		for(i = 0, len = this.cols; i < len; i++){
			var date =  new Date();
			date.setFullYear(this.Date.getFullYear());
			date.setMonth(this.Date.getMonth());
			date.setDate(this.Date.getDate() + i);
			
			var cel = this.getCol(i).parent;
			
			cel.setDate(date);
			
			cel.body.removeClassName('off');
			cel.body.removeClassName('today');
			cel.header.removeClassName('today');
			
			if(date.getDay() == 6 || date.getDay() == 0){
				cel.body.addClassName('off');
			}
			
			if(date.format('Y-m-d') == dateNow){
				cel.header.addClassName('today');
				cel.body.addClassName('today');
				cel.body.appendChild(this.body.dateMarker);
			}
		}
		
		this.DateEnd =		this.Date.clone();
		this.DateEnd.setDate(this.Date.getDate() + this.cols)
		this.DateEnd.setHours(0,0,0);
		
		if(this.link == ''){
			for(var i = 0; i < this.data.length; i++){
				
				this.createEvent(this.data[i]);
				
			}
		}else{
			this.load();	
		}
	
		return this;
	},
/**
 * Schedule#resizeTo(col, row) -> void
 *
 * Cette méthode permet de redimensionner la grille.
 **/	
	resizeTo: function(cols, rows){
		
		
		if(!this.header.Table){
			
			if(this.body.header){
				this.body.header.stopObserving('mousedown');	
			}
			//
			//
			//
			this.header.Table =			new TableData();
			this.header.Table.className = 'table-header';
			//
			//
			//
			this.body.Table =			new TableData();
			this.body.Table.className = 'table-body';
			//
			//
			//
			this.body.mask = 			new Node('div', {className:'wrap-mask'});
			//
			//
			//
			this.body.maskTime = 		new Node('div', {className:'wrap-markers-times'});	//contient les lignes marqueurs de temps
			//
			//
			//
			this.body.chips =			new Node('div', {className:'wrap-chips'});			//contient les elements flottant du planning
			this.body.chips.parent = 	this;
		}else{
			this.header.Table.clear();
			this.body.Table.clear();
			this.body.chips.removeChilds();
			this.body.mask.removeChilds();
			this.body.maskTime.removeChilds();
		}
		
		//
		//
		//
		this.header.emptyCel = 		this.header.Table.addCel('', {className:'wrap-empty', returnElement:true}); 		//cellule [0,0] de l'entete -logo
		
		this.body.Table.addCel('', {className:'wrap-empty'});				
		
		//
		// CelMask
		//	
		this.body.celMask = 		this.body.Table.addCel(this.body.mask, {className:'wrap-content', returnElement:true});
		this.body.celMask.colSpan =	cols;
		
		this.body.Table.addRow();
		//
		// Entete des lignes
		//
		this.body.header = 			this.body.Table.addCel(this.body.arrowMarker, {className:'wrap-times', returnElement:true});//cellule [1,0] du body
		
		this.body.mask.appendChild(this.body.chips);
		this.body.mask.appendChild(this.body.maskTime);
		this.header.appendChild(this.header.Table);
		this.body.wrapper.appendChild(this.body.Table);		
		
		this.createRows(rows);
		this.createCols(cols);
		
		this.header.Table.addCel('', {className:'cel-offset-scroll'});
		
		this.body.header.on('mousedown', function(evt){
			Event.stop(evt);
		});
				
	},
/**
 * Schedule#observe(eventname, callback) -> Schedule
 *
 * #### Evénement
 * 
 * * `create` : Création d'un événement.
 * * `open` : Lorsque l'utilisateur clique sur un événement.
 * 
 **/
 	observe: function(eventName, callback){
		
		switch(eventName){
			case 'open':
			case 'complete':
			case 'mousedown': 
			case 'create':
			case 'draw':
			case 'draw.col':
			case 'draw.row':
			case 'change':
			case 'change.date':
			case 'load':
			case 'drag':
			case 'resize':
				this.Observer.observe(eventName, callback);
				break;
			default:
				Event.observe(this, eventName, callback);
				break;		
		};
		
		return this;
	},
/**
 * Schedule#stopObserving(eventname, callback) -> Schedule
 *
 * #### Evénement
 * 
 * * `create` : Création d'un événement.
 * * `open` : Lorsque l'utilisateur clique sur un événement.
 *  
 **/
 	stopObserving: function(eventName, callback){
		
		switch(eventName){
			case 'open':
			case 'complete':
			case 'mousedown': 
			case 'create':
			case 'draw':
			case 'draw.col':
			case 'draw.row':
			case 'change':
			case 'change.date':
			case 'load':
			case 'drag':
			case 'resize':
				this.Observer.stopObserving(eventName, callback);
				break;
			default:
				Event.stopObserving(this, eventName, callback);
				break;		
		};
		
		return this;
	},
/**
 * Select#load() -> Select
 *
 * Cette méthode charge les données de la liste depuis une base de données si `Select#link` est configuré.
 **/	
	load: function(progress){
		
		progress = Object.isUndefined(progress) ? true : progress;
		
		if(this.link != ''){
			
			var globals = 		$WR().getGlobals('parameters');
			var parameters = 	this.parameters + (globals == '' ? '' : '&' + globals);
			
			var end = this.Date.clone();
			end.setDate(end.getDate() + (this.cols-1));
			
			parameters += (parameters == '' ? '' : '&') + 'start=' + this.Date.format('Y-m-d 00:00:00') + '&end=' + end.format('Y-m-d 23:59:59');
				
			if(this.ajax && this.ajax.transport){
				if(Object.isFunction(this.ajax.transport.abort)){
					this.ajax.transport.abort();
				}
			}	
			
			if(this.ProgressBar && progress){
				this.ProgressBar.show();	
			}
			
			var options = {
				start:	this.Date.format('Y-m-d 00:00:00'),
				end:	end.format('Y-m-d 23:59:59')
			};
			
			this.ajax = new Ajax.Request(this.link, {
				parameters: parameters,
				method:		'post',
				
				onLoaded:function(){
					this.Observer.fire('load', options);
				}.bind(this),
						
				onComplete: function(result){
					
					var obj = result.responseText.evalJSON();
					
					this.setData(obj);
					
					if(this.ProgressBar){
						this.ProgressBar.hide();	
					}
					
					this.Observer.fire('complete', obj);
				}.bind(this)
			});
		}

		return this;
	},
/**
 * Schedule#onMouseDownBody() -> void
 **/	
	onMouseDownBody: function(evt){
		
		this.destroyLastEvent();			
		
		if((!document.all && evt.which == 3) || (document.all && evt.button == 2)){//desactivation du clic droit
			return;
		}
		
		Event.stop(evt);
		if(Event.pointerX(evt) > this.body.chips.cumulativeOffset().left + this.body.chips.getWidth()) return;
		
		var stopEvent = new StopEvent(this);
					
		this.Observer.fire('mousedown', stopEvent);
		
		if(stopEvent.isStop()){
			return;	
		}
		
		var node = 	new Schedule.Event({
			background:	'0099FF',
			start:		null,
			end:		null
		});
		
		node.create = true;
		
		var mouse = this.getMouseEvent(evt);
		mouse.y += this.body.cumulativeScrollOffset().top;
		node.css('top', mouse.y);
		
		var subCelHeight = 	this.getCelHeight() / 4;
		subCelHeight = 		Math.floor(node.css('top') / subCelHeight) * subCelHeight;
		var top = 			subCelHeight < 0 ? 0 : subCelHeight;
		
		for(var i = 0; i < this.cols; i++) {
			var rect = new Rectangle(this.getCol(i));
			rect.x -= this.getCol(-1).getWidth();
			
			if(rect.contains(mouse)){
				break;	
			}
		}
		
		node.css('top', top);
		node.css('left', this.getColLeft(i) + this.marginLeft);
		node.css('width', this.getCol(i).getWidth() - this.marginRight - this.marginLeft - node.css('border-left-width') - node.css('border-right-width') - 1);
		node.css('height', (this.getCelHeight() / 4) - node.css('border-top-width') - node.css('border-bottom-width'));
		
		node.start = 	this.getCol(i).getDate().clone();		
		node.end = 		this.getCol(i).getDate().clone();
		
		node.start.setSeconds(0);
		node.end.setSeconds(0);
		
		this.body.chips.appendChild(node);
		
		var hours = 	this.pixelToHours(node.css('top'));
		node.start.setHours(hours.hours, hours.minutes, 0);
		node.end.setHours(hours.hours, hours.minutes + 15, 0);
		
		if(this.collision){
			if(this.eventCollisionTo(node, true)){
				this.body.chips.removeChild(node);
				return;
			}
		}
					
		this.onResizeFooterStart(evt, node);
		
		var self = this;
		
		node.footer.observe('mousedown', function(event){self.onResizeFooterStart(event, this.parentNode);});
		node.header.observe('mousedown', function(event){self.onResizeHeaderStart(event, this.parentNode);});
		node.observe('dragstart', function(event){event = event.memo; self.onDragStartEvent(event, this);});
		node.observe('drag', function(event){event = event.memo; self.onDragEvent(event, this);});
		node.observe('dragend', function(event){event = event.memo; self.onDragEndEvent(event, this);});
		
		node.constraint({
			x1:	this.marginLeft,
			x2: this.body.chips.getWidth() - 1 - this.marginRight,
			y1: 0,
			y2:	0
		});
		
		
		
		this.Observer.fire('draw', node);
	},
/**
 * Schedule#onTick() -> void
 **/
	onTick: function(){
		this.Timer.stop();
		
		var date = new Date();
		if(this.body.dateMarker.parentNode){
			var height = this.row0.body.getHeight();
			
			if(height != 0){
				height = height * date.format('h') + ( (height / 60) * date.format('i'));
				this.body.dateMarker.marker.css('top', height);
				this.body.arrowMarker.marker.css('top', height);
			}
			
			this.Timer = new Timer(this.onTick.bind(this), 60);
		}
		
		this.Timer.start();
	},
/**
 * Schedule#onMouseUpEvent() -> void
 **/	
	onMouseUpEvent:function(event, node){
		
		if(!node.hasChange()){
			this.Observer.fire('open', event, node);
		}
	},
/**
 * Schedule#onDragEvent() -> void
 **/
 	onDragStartEvent: function(event, node){
				
		node.backup();
		this.Flag1.hide();
		this.Flag2.hide();
		
	},
/**
 * Schedule#onDragEvent() -> void
 **/
 	onDragEvent: function(event, node){
		
		this.Observer.fire('drag', event, node);
		
		var mouse = this.getMouseEvent(event);
					
		for(var i = 0; i < this.cols; i++) {
			var rect = new Rectangle(this.getCol(i));
			rect.x -= this.getCol(-1).getWidth();
			
			if(rect.contains(mouse)){
				break;	
			}
		}
		
		if(i < this.cols) {
			node.css('left', this.getColLeft(i) + this.marginLeft);
		}
		
		var subCelHeight = 	this.getCelHeight() / 4;
		subCelHeight = 		Math.floor(node.css('top') / subCelHeight) * subCelHeight;
		subCelHeight = 		subCelHeight < 0 ? 0 : subCelHeight;
		
		node.css('top', subCelHeight);
		
		if(this.body.header.getHeight() <= node.css('top') + node.css('height')){
			node.css('top', this.body.header.getHeight() - node.css('height') -  node.css('border-top-width'));
		}
		
		//gestion de la date
		var hours = this.pixelToHours(node.css('top'));
		var date = 	this.getCol(i).getDate();
		
		node.start.setDate(date.getDate());
		node.start.setMonth(date.getMonth());
		node.start.setHours(hours.hours, hours.minutes, 0);
					
		this.Flag1.setText('<p class="icon-clock">' + node.start.format('h\\hi') + '</p>').color('grey').setType(FLAG.RIGHT).show(node.header, true);
		
		hours = this.pixelToHours(node.css('top') + node.getHeight() - node.css('border-top-width'));
		node.end.setDate(date.getDate());
		node.end.setMonth(date.getMonth());
		node.end.setHours(hours.hours, hours.minutes, 0);
		
		this.Flag2.setText('<p class="icon-clock">' + node.end.format('h\\hi') + '</p>').color('grey').setType(FLAG.RIGHT).show(node.footer, true);
			
	},
/**
 * Schedule#onDragEndEvent() -> void
 **/
	onDragEndEvent: function(event, node){
		this.Flag1.hide();
		this.Flag2.hide();
			
		if(this.collision){
			if(this.eventCollisionTo(node, true)){
				node.restore();
			}
		}
		
		if(node.end.format('YmdHis') > new Date().format('YmdHis')){
			node.setOpacity(1);	
		}else{
			node.setOpacity(0.6);
		}
		
		
		this.Observer.fire('change', event, node);
		
	},
/**
 * Schedule#onResizeFooterStart() -> void
 **/
	onResizeFooterStart: function(event, node){
		
		if((!document.all && event.which == 3) || (document.all && event.button == 2)){//desactivation du clic droit
			return;
		}
		
		if(node.locked() || node.LockFooter()){
			return;
		}
		
		this.Flag.hide();
		this.Flag1.hide();
		this.Flag2.hide();
		
		event.stop();
		node.backup();
		
		node.back.mouseY = 	event.pointerY();		
		node.back.opacity = node.getOpacity();
		
		node.setOpacity(0.7);
		
		if(Object.isFunction(this.onMouseMove)){
			Event.stopObserving(document, 'mousemove', this.onMouseMove);
			Event.stopObserving(document, 'mouseup', this.onMouseUp);
		}
		
		this.onMouseMove = 	function(e){this.onResizeFooter(e, node)}.bind(this);
		this.onMouseUp = 	function(e){this.onResizeFooterEnd(e, node)}.bind(this);
		
		Event.observe(document, 'mousemove', this.onMouseMove);
		Event.observe(document, 'mouseup', this.onMouseUp);
	},
/**
 * Schedule#onResizeFooter() -> void
 **/	
	onResizeFooter: function(event, node){
		
		this.Observer.fire('resize', event, node);
		
		var subCelHeight = this.getCelHeight() / 4;
		
		var height = node.back.height + (event.pointerY() - node.back.mouseY);
		
		height = height > subCelHeight ? height : subCelHeight;
		height = Math.round(height / subCelHeight) * subCelHeight;
		
		if(this.body.header.getHeight() < node.css('top') + height){
			height = this.body.header.getHeight()  - node.css('top') -  (node.css('border-top-width') + node.css('border-bottom-width'));
		}
		
		var heightold = node.css('height');
		
		node.css('height', height - node.css('border-top-width') - node.css('border-bottom-width'));
		
		if(this.collision){
			if(e = this.eventCollisionTo(node)){
				node.css('height', e.css('top') - node.css('top') - node.css('border-top-width') - node.css('border-bottom-width'));
			}
		}
		
		//gestion de la date
		var hours = this.pixelToHours(node.css('top') + node.getHeight() - node.css('border-top-width'));
		node.end.setHours(hours.hours, hours.minutes, 0);
		
		this.Flag2.setText('<p class="icon-clock">' + node.end.format('h\\hi') + '</p>').color('grey').setType(FLAG.RIGHT).show(node.footer, true);
	},
/**
 * Schedule#onResizeFooterEnd() -> void
 **/	
	onResizeFooterEnd: function(event, node){
		
		if(Object.isFunction(this.onMouseMove)){
			Event.stopObserving(document, 'mousemove', this.onMouseMove);
			Event.stopObserving(document, 'mouseup', this.onMouseUp);
			
			this.onMouseMove = null;
			this.onMouseUp = null;
		}
		
		if(node.end.format('YmdHis') > new Date().format('YmdHis')){
			node.setOpacity(1);
		}else{
			node.setOpacity(0.6);
		}
		
		if(!node.create){	
			this.Observer.fire('change', event, node);
		}else{
			this.Observer.fire('create', event, node);
			this.lastEvent = node;
			node.create = false;
		}
		
		this.Flag.hide();
		this.Flag1.hide();
		this.Flag2.hide();	
	},
/**
 * Schedule#onResizeHeaderStart() -> void
 **/
	onResizeHeaderStart: function(event, node){
		
		if((!document.all && event.which == 3) || (document.all && event.button == 2)){//desactivation du clic droit
			return;
		}
		
		if(node.locked() || node.LockHeader()){
			return;
		}
		
		this.Flag.hide();
		this.Flag1.hide();
		this.Flag2.hide();
		
		event.stop();
		node.backup();
		
		node.back.mouseY = 	event.pointerY();
		node.back.y2 = 		node.back.height + node.back.top;
		node.back.opacity = node.getOpacity();
		
		node.setOpacity(0.7);
		
		if(Object.isFunction(this.onMouseMove)){
			Event.stopObserving(document, 'mousemove', this.onMouseMove);
			Event.stopObserving(document, 'mouseup', this.onMouseUp);
		}
		
		this.onMouseMove = 	function(e){this.onResizeHeader(e, node)}.bind(this);
		this.onMouseUp = 	function(e){this.onResizeHeaderEnd(e, node)}.bind(this);
		
		Event.observe(document, 'mousemove', this.onMouseMove);
		Event.observe(document, 'mouseup', this.onMouseUp);
	},
/**
 * Schedule#onResizeHeader() -> void
 **/	
	onResizeHeader: function(event, node){
		
		this.Observer.fire('resize', event, node);
		
		var height = 	this.css('height');
		
		var subCelHeight = this.getCelHeight() / 4;
		
		var top = node.back.top + (event.pointerY() - node.back.mouseY);
		top =  node.back.y2 - top > subCelHeight ? top :  node.back.y2 - subCelHeight;
		
		top = Math.floor(top / subCelHeight) * subCelHeight;
				
		if(top < 0){
			top = 0;
		}	
		
		node.css('top', top).css('height', node.back.y2 - top);
		
		if(this.collision){
			node.css('height', node.back.y2 - top -1);
			if(e = this.eventCollisionTo(node)){
				node.css('top', e.css('top') + e.getHeight());
				node.css('height', node.back.y2 - node.css('top'));
				return;
			}
			node.css('height', node.back.y2 - top);
		}
		
		//gestion de la date
		var hours = this.pixelToHours(node.css('top'));
		node.start.setHours(hours.hours, hours.minutes, 0);
					
		this.Flag1.setText('<p class="icon-clock">' + node.start.format('h\\hi') + '</p>').color('grey').setType(FLAG.RIGHT).show(node.header, true);
	},
/**
 * Schedule#onResizeFooterEnd() -> void
 **/	
	onResizeHeaderEnd: function(event, node){
		
		if(Object.isFunction(this.onMouseMove)){
			Event.stopObserving(document, 'mousemove', this.onMouseMove);
			Event.stopObserving(document, 'mouseup', this.onMouseUp);
			this.onMouseMove = null;
			this.onMouseUp = null;
		}
		
		this.Flag.hide();
		this.Flag1.hide();
		this.Flag2.hide();
		
		node.setOpacity(node.getOpacity() || 1);
		
		this.Observer.fire('change', event, node);
	},
/**
 * Schedule#getMouseEvent() -> Point
 **/	
	getMouseEvent: function(event){
		var origine = 	Point.FromCSS(this.body.chips.cumulativeOffset());
		var mouse = 	Point.FromEvent(event);
		
		return mouse.substract(origine);
	},
/**
 * Schedule#getCol(it) -> HTMLTableCellElement
 * - it (Number): Numérode la colonne à récupérer.
 *
 * Cette méthode retourne la colonne demandée.
 **/	
	getCol: function(it){
		return this.body.Table.getCel(1, 1+ it);
	},
/**
 * Schedule#getColLeft(it) -> Number
 * - it (Number): Numérode la colonne à récupérer.
 *
 * Cette méthode le positionnement relatif à la bordure gauche du planning.
 **/	
	getColLeft: function(it){
		return this.getCol(it).positionedOffset().left - this.getCol(-1).getWidth();	
	},
/**
 * Schedule#getDate() -> Date
 * Cette méthode retourne la date du planning.
 **/	
	getDate:function(){
		return this.Date.clone();	
	},
/**
 * Schedule#setDate(date) -> void
 * Cette méthode change la date du planning.
 **/	
	setDate:function(date){
		if(Object.isUndefined(date.getFullYear)){
			if(Object.isFunction(date.toDate)){
				date = date.toDate();
			}
		}
		
		this.Date = date.clone();
				
		switch(this.mode){
			default:
				this.MenuCalendar.setFormat('l d F Y');
				break;	
			case Schedule.WEEKLY:
				this.Date.setDay(1);
				this.Date.setHours(0,0,0);
				
				if(this.cols != 7){
					this.cols = 7;
					this.resizeTo(this.cols, this.rows);
				}
				
				this.MenuCalendar.setFormat('$S - $E Y');
				break;
				
			case Schedule.MONTHLY:
				this.Date.setDate(1);
				this.Date.setHours(0,0,0);
				if(this.cols != this.Date.daysInMonth()){
					this.cols = this.Date.daysInMonth();
					this.resizeTo(this.cols, this.rows);
				}
				this.MenuCalendar.setFormat('F Y');
				break;
		}
		
		this.MenuCalendar.setDate(this.Date);
		
		return this.refresh();
	},
/**
 * Schedule#hoursToPixel(date) -> Number
 * Cette méthode convertie la date en pixel.
 **/	
	hoursToPixel: function(date){
		var celHeight = this.getCelHeight() * 24;
		return celHeight * date.format('h') + ( (celHeight / 60) * date.format('i'));
	},
/**
 * Schedule#dateToPixel(pixel) -> Object
 * Cette méthode convertie le pixel en heure.
 **/	
	pixelToHours: function(pix){
		var celHeight = this.getCelHeight();
		var hours =		Math.round((pix) / celHeight);
		var minutes = 	(pix - hours * celHeight) / (celHeight / 60);
		minutes =		Math.round(minutes / 15) * 15;
		
		return {hours:hours, minutes:minutes};
	},
/**
 * Schedule#getCelHeight() -> Number
 *
 * Cette méthode retourne la hauteur d'une cellule de l'agenda.
 **/	
	getCelHeight:function(){
		
		if(Object.isUndefined(this.celHeight)){
			this.celHeight = this.row0.body.getHeight();
		}
		
		return this.celHeight;	
	},
/**
 * Schedule#setData(array) -> Schedule
 *
 * Cette méthode supprime les événements affichés et ajoute les nouveaux événements sur l'agenda.
 **/	
	setData: function(array){
		this.clear();
		
		$A(array).each(function(e){
			this.addEvent(e);
		}.bind(this));
		
		return this;
	},
/**
 * Schedule#getData() -> Array
 *
 * Cette méthode retourne l'ensemble des données affichés sur l'agenda.
 **/	
	getData: function(){
		var array = [];
		
		this.body.chips.select('.schedule-event').each(function(e){
			array.push(e.getData());
		}.bind(this));
		
		return array;
	},
/**
 * Schedule#setLink(link) -> Select
 * - link (String): Lien de la passerelle PHP.
 * 
 * Cette méthode assigne un lien afin de récupérer des données depuis PHP.
 **/
	setLink:function(link){
		this.link = link;
		return this;
	},
/**
 * Schedule#setParameters(parameters) -> Select
 * - parameters (String): paramètres.
 * 
 * Cette méthode assigne des paramètres à envoyer vers le script PHP lors de la récupération de données depuis ce dernier.
 **/	
	setParameters:function(param){
		this.parameters = param;	
	}
};
/**
 * class Schedule.Event
 * Cette classe gère l'affichage d'un événement sur l'agenda
 **/
Schedule.Event = Class.createElement('div');

Schedule.Event.prototype = {
	className:'wobject schedule-event',
/**
 * Schedule.Event#start -> Date
 **/	
	start:		null,
/**
 * Schedule.Event#end -> Date
 **/
	end:		null,
/**
 * Schedule.Event#data -> Object
 **/
	data:		null,
/**
 * Schedule.Event#title -> String
 **/
	title:		'',
/**
 * Schedule.Event#background -> String
 **/
	background:		'FFF',
/**
 * Schedule.Event#color -> String
 **/	
	color:			'000',
/**
 * new Schedule.Event([options])
 **/	
	initialize: function(options){
		
		options.start = Object.isString(options.start) ? options.start.toDate() : options.start;
		options.end = 	Object.isString(options.end) ? options.end.toDate() : options.end;
		
		if(!Object.isUndefined(options)){
			Object.extend(this, options);
		}
		
		this.data = 	options;
		
		this.header = 	new Node('div', {className:'wrap-header'});
		this.body = 	new Node('div', {className:'wrap-body'});
		this.footer = 	new Node('div', {className:'wrap-footer'});
		
		this.appendChild(this.header);
		this.appendChild(this.body);
		this.appendChild(this.footer);
		
		this.setText(this.title);
		this.setBackground(this.background);
		this.setColor(this.color);
		
		this.createDrag();
		
		this.title = '';
		
	},
/**
 * Schedule.Event#destroy() -> Schedule.Event
 **/	
	destroy:function(){
		var schedule = this.parentNode.parent;
		schedule.data[this.EID] = null;
		this.parentNode.removeChild(this);
		return this;
	},
/**
 * Schedule.Event#backup() -> void
 **/	
	backup:function(){
		this.back = {
			start:	this.start.clone(),
			end:	this.end.clone(),
			opacity:this.getOpacity(),
			top:	this.css('top'),
			left:	this.css('left'),
			height:	this.css('height')
		};
		
		this.removeClassName('restore');
	},
/**
 * Schedule.Event#hasChange() -> Boolean
 *
 * Cette méthode indique si l'événement a subit une modification (changement de position).
 **/	
	hasChange:function(){
		if(this.back){
			return this.back.top != this.css('top') || this.back.left != this.css('left') || this.back.height != this.css('height');
		}
		return false;
	},
/**
 * Schedule.Event#restore() -> void
 **/	
	restore:function(){
		if(this.back){
			this.start = 	this.back.start;
			this.end = 		this.back.end;
			this.setOpacity(this.opacity);
			this.css('top', this.back.top);
			this.css('left', this.back.left);
			this.css('height', this.back.height);
			
			this.addClassName('restore');
		}
	},
/**
 * Schedule.Event#lock([bool]) -> Boolean
 **/	
	lock:function(){
		this.addClassName('locked');
		this.removeDrag();
	},
/**
 *
 **/	
	locked:function(){
		return this.hasClassName('locked');
	},
/**
 * Schedule.Event#LockHeader([bool]) -> Boolean
 **/
	LockHeader: function(bool){
		if(Object.isUndefined(bool)){
			return this.hasClassName('lock-header');
		}
		
		this.removeClassName('lock-header');
		
		if(bool){
			this.addClassName('lock-header');
			
			if(!this.LockFooter()){	
				this.removeDrag();
			}
		}else{
			if(!this.LockFooter()){	
				this.createDrag();
			}
		}
		
		return bool;
	},
/**
 * Schedule.Event#LockFooter([bool]) -> Boolean
 **/
	LockFooter: function(bool){
		if(Object.isUndefined(bool)){
			return this.hasClassName('lock-footer');
		}
				
		this.removeClassName('lock-footer');
		
		if(bool){
			this.addClassName('lock-footer');
			
			if(!this.LockHeader()){	
				this.removeDrag();
			}
		}else{
			if(!this.LockHeader()){	
				this.createDrag();
			}
		}
		
		return bool;
	},
/**
 * Schedule.Event#setBackground(color) -> Schedule.Event
 * - color (String): Couleur au format hexadécimal.
 *
 * Cette méthode change la couleur de fond et les couleurs de la bordure du chip.
 **/
	setBackground: function(background){
		
		var color = 	new Color(background);
		
		/*if(this.end.format('ymd') < new Date().format('ymd')){
			color.setLuminance(	color.setLuminance() + 20);
			background = color.toString().replace('#', '');
		}*/
		
		color.setLuminance(color.getLuminance() - 50);
					
		this.setStyle({backgroundColor: "#" + background.replace('#', ''), border:'1px solid ' + ((background != "000000") ? color.toString() : "#666")});
					
		this.header.css('background-color', (background != "000000") ? color.toString() : "#666");
		this.footer.css('background-color', (background != "000000") ? color.toString() : "#666");
				
		return this;
	},
	
	setColor: function(color){
		
		this.body.css('color', '#' + color);
				
		return this;
	},
/**
 * Schedule.Event#setText(text) -> Schedule.Event
 * - text (String): Texte à afficher.
 *
 * Cette méthode change le texte affiché dans le corps de l'instance.
 **/	
	setText: function(str){
		this.body.removeChilds();
		if(this.start){
			this.body.appendChilds([
				new Node('div', {style:'font-weight:bold;font-size:85%'}, this.start.format('h:i') + ' - ' +  this.end.format('h:i')),
				new Node('span', {className:'event-title'}, str)
			]);
		}
		return this;
	},
/**
 * Schedule.Event#getData() -> Object
 * 
 * Cette méthode retourne les données de l'instance.
 **/	
	getData: function(){
		
		this.data.start = 	this.start.clone();
		this.data.end = 	this.end.clone();
		
		return this.data;
	}
};

/**
 * class Schedule.Marker
 * Cette classe gère l'affichage d'un marqueur sur l'agenda.
 **/
Schedule.Marker = Class.createElement('div');

Schedule.Marker.prototype = {
	className:'wobject schedule-marker',
/**
 * Schedule.Marker#date -> Date
 **/	
	date:		null,
/**
 * Schedule.Marker#data -> Object
 **/
	data:		null,
/**
 * Schedule.Marker#title -> String
 **/
	icon:		'',
/**
 * new Schedule.Marker([options])
 **/	
	initialize: function(options){
		
		options.date = Object.isString(options.date) ? options.date.toDate() : options.date;
		
		if(!Object.isUndefined(options)){
			Object.extend(this, options);
		}
		
		this.data = 	options;
		this.body = 	new Node('div', {className:'wrap-body'});
		
		this.appendChild(this.body);
		
		this.setIcon(options.icon);		
	},
/**
 * Schedule.Marker#getData() -> Object
 * 
 * Cette méthode retourne les données de l'instance.
 **/	
	getData: function(){
		return this.data;
	},
/**
 * Schedule.Marker#getDate() -> Date
 * 
 * Cette méthode retourne la date du marqueur.
 **/	
	getDate: function(){
		return this.date;
	},
	
	setIcon:function(icon){
		
		if(icon){
			this.body.removeClassName('icon-' + this.icon);
			this.icon = icon;
			this.body.addClassName('icon-' + this.icon);
		}
		
		return this.icon;
	}
};