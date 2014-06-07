/** section: MyStore
 * class MyStore
 *
 * Cet espace de nom gère l'extension System.Agenda.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

System.Agenda = {
/**
 * new System.Agenda()
 **/
	initialize: function(){
				
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
		$S.observe('agenda.event:open.submit.complete', function(){
			var win = $WR.getByName('agenda');
			
			if(win){
				win.Panel.Schedule.load();	
			}
		});
				
		this.addStatut($MUI('Disponible'), 'free', '#16A765');
		this.addStatut($MUI('Occupé'), 'busy', '#FFAD46');
		this.addStatut($MUI('Provisoire'), 'provisory', '#C2C2C2');
		this.addStatut($MUI('Absent'), 'absent', '#D06B64');
		
	},
/**
 * System.Agenda.startInterface() -> void
 **/
 	startInterface:function(){
		
		if(System.Meta('AGENDA_IN_WIN')){
			
			System.addMenu($MUI('Agenda'), {
				appName:	'Agenda',
				icon:		'agenda'
			}).on('click', function(){
				System.Agenda.open();
			});
			
		}else{
			
			var win = this.open();
			
			System.addPanel($MUI('Agenda'),win.Panel, {
				appName:'Agenda'
			});
			
			document.body.removeChild(win);
			win.MinWin.css('display', 'none');
			win.AlertBox = System.AlertBox;
			
			$WR.TaskBar().insertBefore(win.Panel.Schedule.NavBar(), Element.select($WR.TaskBar(), '.wrap-minwin')[0]);
			
		}
		
	},
/**
 * System.jGalery.open() -> void
 **/
	open:function(type){
		var win = $WR.unique('agenda', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('agenda');
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(Flag.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('agenda');
		win.addClassName('agenda');
		//
		// TabControl
		//
		win.appendChild(this.createPanel(win));
				
		document.body.appendChild(win);
		
		$S.fire('agenda:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		return win;
	},
/**
 * System.Agenda.createPanelSchedule() -> void
 **/	
	createPanel: function(win){
		
		var panel = win.Panel = new System.jPanel({
			title:			'',
			placeholder:	$MUI('Rechercher'),
			parameters:		'cmd=agenda.event.list'
		});
		
		panel.addClassName('agenda');
		panel.setTheme('grey flat');	
		panel.Progress.addClassName('splashscreen');
		//
		//
		//
		panel.WrapBubble = new Node('div');
		
		win.Bubble = panel.Bubble = new Bubble();
		win.Bubble2 = panel.Bubble2 = new Bubble();
		
		panel.WrapBubble.appendChild(panel.Bubble);
		panel.WrapBubble.appendChild(panel.Bubble2);
		panel.appendChild(panel.WrapBubble);
		
		win.Flag = panel.Flag = new Flag();
		panel.appendChild(panel.Flag);
		//
		//
		//
		panel.BtnViewList = new SimpleButton({text:$MUI('Listing')});
		panel.BtnViewList.addClassName('listing');
		//
		//
		//
		panel.Schedule = new Schedule({
			collision:		true,
			parameters:		'cmd=agenda.event.list&User_ID=' + $U().User_ID,
			headerFormat:	'D. j/n',
			toolbarView:	panel.BtnViewList
			
		});
		panel.Schedule.BtnNext.setIcon('next-element');
		panel.Schedule.BtnPrevious.setIcon('previous-element');
		panel.Schedule.NavBar().addClassName('agenda-top-bar');
		
		panel.Schedule.ProgressBar = panel.ProgressBar;
		
		panel.Header().appendChild(panel.Schedule.NavBar());
		panel.Schedule.NavBar().css('float', 'left');
		
		//panel.Schedule.css('border', '0px').css('position', 'absolute').css('width', 'auto').css('top', '0').css('bottom', 0).css('left', 0).css('right', 0);
		
		panel.PanelBody.appendChild(panel.Schedule);
		
		panel.PanelBody.refresh = function(){
			panel.Schedule.resize();	
		};
		//
		// IMPRESSION
		//
		
		this.createMenu(win);	
		
		//
		//
		//
		panel.Table = this.createTable(win);
		panel.PanelBody.appendChild(panel.Table);
		//panel.PanelBody = panel.Schedule;
		//
		//
		//
		panel.BtnAdd = new SimpleButton({text:$MUI('Créer') });
		panel.BtnAdd.addClassName('button-create-event');
		panel.BtnAdd.on('click', function(){			
			System.Opener.open('agenda.open', {User_ID:$U().User_ID});
		});
		panel.Schedule.NavBar().top(panel.BtnAdd);
		//
		// Calendar
		//		
		panel.Calendar = new Calendar();
		panel.Calendar.BtnNext.setIcon('next-element');
		panel.Calendar.BtnNext.stopObserving('mouseover');
		panel.Calendar.BtnPrev.setIcon('previous-element');
		panel.Calendar.BtnPrev.stopObserving('mouseover');
		panel.Calendar.BtnNextTwo.setIcon('next-2-element');
		panel.Calendar.BtnNextTwo.stopObserving('mouseover');
		panel.Calendar.BtnPrevTwo.setIcon('previous-2-element');
		panel.Calendar.BtnPrevTwo.stopObserving('mouseover');
		
		panel.Calendar.on('change', function(){
			panel.Schedule.setDate(this.getDate());
			panel.Calendar.setDate(panel.Schedule.getDate());
		});
				
		panel.Calendar.observe('next', this.onChangeDate.bind(this));
		panel.Calendar.observe('prev', this.onChangeDate.bind(this));
		panel.Calendar.observe('nexttwo', this.onChangeDate.bind(this)); 
		panel.Calendar.observe('prevtwo', this.onChangeDate.bind(this));
		
		panel.DropMenu.appendChild(panel.Calendar);
		
		panel.Schedule.on('change.date', function(){
			panel.Calendar.setDate(panel.Schedule.getDate());
		});
		//
		// Chargement complet
		//
		panel.Schedule.on('complete', function(obj){
			this.onChangeDate();
			
			var win =	$WR.getByName('agenda');
				
			if(win.Panel.ProgressBar.hasClassName('splashscreen')){
				win.Panel.ProgressBar.show();
				new Timer(function(){
					win.Panel.ProgressBar.hide();
					win.Panel.ProgressBar.removeClassName('splashscreen');
				}, 1, 1).start();
			}
			
			win.Panel.Table.clear();
			win.Panel.Table.addRows($A(obj));
			
		}.bind(this));
		
		panel.Schedule.on('load', function(options){
			
			options.User_ID = System.Agenda.getUserID();
			
			System.Agenda.currentOptions = options;
			
			System.fire('agenda:refresh', options);
		});
		//
		// Tracé d'un événement au planning
		//
		panel.Schedule.on('draw', this.onDraw.bind(this));
		//
		//
		//
		panel.Schedule.on('drag', function(){
			panel.WrapBubble.hide();
		});
		panel.Schedule.on('resize', function(){
			panel.WrapBubble.hide();
		});
		//
		//
		//
		panel.Schedule.on('mousedown', function(evt){
			
			if(!System.Agenda.haveCreateRight( System.Agenda.getUser())){
				evt.stop()
			}
			
		}.bind(this));
		//
		// Création d'un événement
		//
		panel.Schedule.on('create', function(evt, event){
			panel.WrapBubble.show();
			this.onCreate(evt, event);
		}.bind(this));
		//
		// Ouverture d'un événement
		//
		panel.Schedule.on('open', function(evt, event){
			System.Opener.open('agenda.open', event.getData());
		});
		//
		//
		//
		panel.Schedule.on('change', this.onChange.bind(this));
		//
		//
		//
		panel.Bubble.on('mouseup', function(evt){
			evt.stop();
		});
		
		document.on('mouseup', function(){
			panel.Bubble.hide();
		});
		
		this.createAgendaMenu(win);
		
		//
		// Gestion du listing
		//
		panel.Schedule.NavBar().select('.toolbar-view > .simple-button').each(function(btn){
			btn.on('click', function(){
				if(this.hasClassName('listing')){
					panel.addClassName('mode-listing');
				}else{
					panel.removeClassName('mode-listing');
				}
			});
		});
		
		return panel;
	},
/**
 *
 **/	
	createTable:function(win){
		
		var table = new SimpleTable({
			groupBy:	'Date_Group',
			readOnly:	true,
			sort:		false,
			empty:		$MUI('Aucune événement sur les dates recherchées')
		});
		
		table.addHeader({
			'Action': 		{title:'', width:70, type:'action'},
			'Date_Start': 	{title:$MUI('Date'), width:60, style:'text-align:left'},
			'Date_End': 	{title:$MUI(' '), width:130, style:'text-align:center'},
			'title': 		{title:$MUI('Objet'), style:'text-align:left'},
			'Comment': 		{title:$MUI('Remarques'), style:'text-align:left', width:250},
			'Statut': 		{title:$MUI('Statut'), width:130, style:'text-align:center'}
		});
		
		table.onWriteName = function(key){
			
			if(key){
				return key.toDate().format('l d F Y');
			}
			return '';
		};
		
		table.addFilters('Action', function(e, cel, data){
			
			var location  = data.Location.trim();
				
			if(location != ''){
				
				if(System.Opener){
					
					var button  = new SimpleButton({icon:'map', type:'mini'});
					button.data = data;
					
					e.appendChild(button);
											
					button.on('click', function(){
						
						System.Opener.open('map', {
							
							title:		this.data.Title,
							location: 	this.data.Location
						});
						
					});
				}
			}
				
			return e;		
		});
		
		table.addFilters('Date_Start', function(e, cel, data){
			cel.css('text-align', 'right');
			return e.toDate().format('h\\hi');
		});
		
		table.addFilters('Date_End', function(e, cel, data){
			cel.css('text-align', 'left');
			
			if(data.Date_Start.toDate().format('Ymd') == data.Date_End.toDate().format('Ymd')){
				return ' - ' + e.toDate().format('h\\hi');
			}
			
			return ' - ' + e.toDate().format('d/m/Y h\\hi');
		});
		
		table.addFilters('title', function(e, cel, data){
			cel.css('text-align', 'left');
			
			var node = 	new Node('h5', {style:'margin:0px'}, e);
			var p = 	new Node('p', {style:'font-weight:normal; font-size:11px;margin:0'}, data.Location);
				
			node.appendChild(p);
			
			return node;
		});
		
		table.addFilters('Statut', function(e, cel, data){
			var statut = System.Agenda.Status(e);
			var box = 	new ColoredBox();
			box.setColor(statut.color);
			box.setStyle('position:absolute; right:4px; top:7px;');
			return new Node('div', {style:'padding-right:30px;position:relative; height:30px; line-height:30px;text-align:right'}, [$MUI(statut.text), box]);
		});
		
		table.on('open', function(evt, data){
			System.Agenda.Event.open(data);
		});
		
		table.on('remove', function(evt, data){
			System.Agenda.Event.remove(data, win.createBox());
		});
		
		return table;
	},
/**
 * System.Agenda.createPrintMenu() -> void
 **/
 	createMenu:function(win){
		var panel = win.Panel;
		
		panel.SimpleMenu = 	new SimpleMenu({icon:'1down-mini'});
		panel.Schedule.addGroupButton([panel.SimpleMenu]);
		//
		//
		//
		panel.SimpleMenu.Print = new LineElement({text:$MUI("Imprimer"), icon:'print'});
		panel.SimpleMenu.appendChild(panel.SimpleMenu.Print);
		
		panel.SimpleMenu.Print.on('click', function(){
			System.Agenda.PrintList.open(System.Agenda.currentOptions, win.createBox());
		});
		//
		//
		//
		panel.SimpleMenu.Export = new LineElement({text:$MUI("Exporter"), icon:'export'});
		panel.SimpleMenu.appendChild(panel.SimpleMenu.Export);
		
		panel.SimpleMenu.Export.on('click', function(){
			System.Agenda.Export.open(System.Agenda.currentOptions, win.createBox());
		});
		//
		//
		panel.SimpleMenu.Agenda = new LineElement({text:$MUI("Agendas & préférences"), icon:'agenda-setting'});
		panel.SimpleMenu.appendChild(panel.SimpleMenu.Agenda);
		
		panel.SimpleMenu.Agenda.on('click', function(){
			System.User.openMyPreferences().TabControl.get($MUI('Agenda')).click();
		});
		
		if($U().getRight()){
			//
			//
			//
			panel.SimpleMenu.Setting = new LineElement({text:$MUI("Configuration"), icon:'advanced'});
			panel.SimpleMenu.appendChild(panel.SimpleMenu.Setting);
			
			panel.SimpleMenu.Setting.on('click', function(){
				System.Settings.open().TabControl.get($MUI('Agenda')).click();
			});
		}
		
	},
/**
 * System.Agenda.createAgendaMenu() -> void
 **/	
	createAgendaMenu:function(win){
		var panel = win.Panel;
		//
		//
		//
		panel.ButtonSetting = new SimpleButton({icon:'advanced'});
		panel.ButtonSetting.css('float', 'right').css('margin-top', '9px').css('margin-right', '13px');
		
		panel.ButtonSetting.on('click', function(){
			System.User.openMyPreferences().TabControl.get($MUI('Agenda')).click();
		});
		
		panel.DropMenu.appendChild(new Node('h3', [
			$MUI('Mes agendas')/*,
			panel.ButtonSetting*/
		]));
		
		
		var button = panel.DropMenu.addMenu($MUI('Mon agenda'));
		button.Selected(true);
		button.addClassName('agendas user-' + $U().User_ID);
		button.value = $U().User_ID;
		button.data = $U();
		
		button.on('click', function(){
			panel.DropMenu.select('.agendas.selected')[0].Selected(false);
			this.Selected(true);
			
			panel.Schedule.setParameters('cmd=agenda.event.list&User_ID=' + this.value);
			panel.Schedule.load();
			panel.BtnAdd.show();
		});
		//
		// Les autres
		//
		System.exec('user.list', {
			parameters:'options=' + Object.EncodeJSON({Users:System.Agenda.getUsersID()}),
			onComplete:function(result){
				try{
					var array = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				for(var i = 0; i < array.length; i++){
					if(array[i].User_ID == $U().User_ID) continue;
										
					var button = panel.DropMenu.addMenu(array[i].Name.toUpperCase() + ' ' + array[i].FirstName);
					//button.Selected(true);
					button.addClassName('agendas user-' + array[i].User_ID);
					button.value = 	array[i].User_ID;
					button.data =	new System.User(array[i]);
					
					button.on('click', function(){
						panel.DropMenu.select('.agendas.selected')[0].Selected(false);
						this.Selected(true);
						
						panel.Schedule.setParameters('cmd=agenda.event.list&User_ID=' + this.value);
						panel.Schedule.load();
						
						if(System.Agenda.haveCreateRight(this.data)){
							panel.BtnAdd.show();
						}else{
							panel.BtnAdd.hide();
						}
						
					});
				}
		
			}
		});
		
		panel.Schedule.load();	
	},
/**
 * System.Agenda.setCurrent() -> void
 **/
	setCurrent:function(name){
		var win = $WR.getByName('agenda');
		var panel = win.Panel;
		
		panel.Open(false);
		panel.destroyForm();
	},
/**
 * System.Agenda.refresh() -> void
 **/	
	refresh:function(bool){
		var win = $WR.getByName('agenda');
		
		if(win){
			win.Panel.Schedule.load(bool);
		}
	},
/**
 * System.Agenda.onChange(evt, event) -> void
 **/	
	onChange:function(evt, event){
		
		var win = $WR.getByName('agenda');
		panel = win.Panel;
		
		panel.WrapBubble.show();
		
		event.setText(event.getData().title + ' - ' + $MUI('Enregistrement en cours') + '...');
		
		new System.Agenda.Event(event.getData()).free(function(){
			
			this.commit(function(){
				event.setText(event.getData().title);
				panel.Schedule.load(false);//update du planning silencieusement.
			});
			
		}, function(){
			event.restore();		
			panel.Schedule.load(false);
				
		});
		
	},
/**
 * System.Agenda.onDraw(event) -> void
 **/	
	onDraw:function(event){
		var win = 		$WR.getByName('agenda');
		var bubble = 	win.createBubble();
		
		bubble.hide();
		
		if(event.data.Locked){
			event.lock();	
		}
		
		if(!event.data.Date_Start){
			return;
		}
		
		var html = 	new HtmlNode();
		var table = new TableData();
		table.addHead($MUI('Début le') + ' : ', {width:90}).addField(event.data.Date_Start.toDate().format('l d F Y à h\\hi'), {width:250}).addRow();
		table.addHead($MUI('Fin le') + ' : ').addField(event.data.Date_End.toDate().format('l d F Y à h\\hi')).addRow();
		table.addHead(' ', {height:8}).addRow();
		table.addHead($MUI('Lieu') + ' : ').addField(event.data.Location).addRow();
		table.addHead($MUI('Statut') + ' : ').addField(System.Agenda.Status(event.data.Statut).text).addRow();
				
		html.appendChilds([
			new Node('h2', {style:'margin-top:0;'}, event.Title), 
			table
		]);
		
		System.fire('agenda.event:draw', event, html);
		table.addHead(' ', {height:8}).addRow();
		
		
		if(event.data.Users.length){
			
			event.addClassName('shared');
			
			table.addHead($MUI('Organisateur') + ' : ').addField(event.data.Owner).addRow();	
			table.addHead($MUI('Participant(s)') + ' : ').addField(event.Attendants.join(', ')).addRow();	
		}else{
			table.addHead($MUI('Créé par') + ' : ').addField(event.data.Owner).addRow();	
		}
		
		bubble.add(event, {
			duration:	0,
			text:		html
		});		
		
	},
/**
 * System.Agenda.onCreate(evt, event) -> void
 **/	
	onCreate:function(evt, event){
		var win = 		$WR.getByName('agenda');
		var panel =		win.Panel;
		var bubble = 	win.Bubble2;
		var flag =		win.createFlag();
		
		bubble.hide();
		flag.hide();
		//
		//
		//
		var title = 	new Node('h2', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Création d\'un événement'));
		//
		//
		//		
		var submit = 	new SimpleButton({type:'submit', text:$MUI('Créer un événement')});
		submit.css('margin-right', '10px');
		//
		//
		//
		var reset =	new SimpleButton({icon:'remove-element-2', noFill:true, nofill:true});
		reset.setStyle('position:absolute;top:5px; right:5px; font-weight:bold; color:#333');
		
		reset.on('click', function(){
			bubble.hide();
			event.destroy();
		});
		
		var input =			new Input({type:'text'});
		input.Large(true);
		input.css('width', '99%');
		
		input.keyupenter(function(){
			submit.click();
		});
		
		var html = 	new HtmlNode();
		var table = new TableData();
		table.css('margin-bottom', '15px');
		table.addHead($MUI('Début le') + ' : ', {width:80}).addCel(event.start.format('l d M Y à h\\hi'), {width:250}).addRow();
		table.addHead($MUI('Fin le') + ' : ').addCel(event.end.format('l d M Y à h\\hi')).addRow();
		table.addHead(' ', {height:8}).addRow();
		table.addHead($MUI('Objet') + ' : ').addCel(input).addRow();
		
		html.appendChilds([
			title,
			table,
			submit,
			reset
		]);
		
		bubble.show(evt, html).moveTo(bubble.css('left') - input.positionedOffset().left - 30, bubble.css('top') - input.positionedOffset().top - input.css('height')-10);
		input.focus();
		
		submit.on('click', function(){
			if(input.Value() == ''){
				flag.setText($MUI('Veuillez choisir un titre pour votre événement !')).setType(Flag.TOP).show(input, true);
				return;
			}
			
			event.setText(input.Value() + ' - ' + $MUI('Enregistrement en cours') + '...');
			
			var statut = System.Agenda.Status('provisory');
			var user = System.Agenda.getUser();
			
			var ev = new System.Agenda.Event({
				Date_Start:	event.start,
				Date_End:	event.end,
				Title:		input.Value(),
				User_ID:	user.User_ID,
				User:		user.Name + ' '  + user.FirstName,
				Statut:		'provisory',
				Recall:		$U().getMeta("AGENDA_RECALL_EVENT") || 0
			});
			
			event.setBackground(statut.color); 
			
			ev.free(function(){
			
				this.commit(function(){
					event.setText(event.getData().title);
					System.Opener.open('agenda.open', this);
					panel.Schedule.load(false);//update du planning silencieusement.
				});
				
			}, function(){
				var splite = new SpliteIcon($MUI('L\'utilisateur est indisponible sur les dates demandées'));
				splite.setIcon('alert-48');
				
				var box = win.createBox();
				box.setTitle($MUI('Indisponibilité')).a(splite).setType('CLOSE').Timer(5).show();
				
				event.destroy();		
				panel.Schedule.load(false);					
			});
			
			bubble.hide();
		});	
		
	},
/**
 * EvenementsManager.onChangeData() -> void
 *
 * Cette méthode est appelée lorsque l'utilisateur change la date du calendrier.
 **/
	onChangeDate: function(){
		var win =	$WR.getByName('agenda');
		var panel = win.Panel;
		
		panel.Calendar.draw();
		
		$S.exec('agenda.event.count', {
			parameters:'options='+ Object.EncodeJSON({
				User_ID:System.Agenda.getUserID(),
				date:	panel.Calendar.getDate().format('Y-m'),
				length:	panel.Calendar.getDate().daysInMonth()
			}),
			
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					return $S.trace(result.responseText);
				}
				
				try{
												
				for(var i = 0; i < array.length; i++){
					
					var options = panel.Calendar.select('.date-' + array[i].date.replace(/-/gi, ''));
					
					options.each(function(e){
						e.addTag(array[i].length);
					});
				}
				
				}catch(er){alert(er)}
			}.bind(this)
		});
	},

/**
 * System.Agenda.addMarker(options) -> Marker
 *
 * Cette méthode permet d'ajouter un marqueur sur le planning.
 **/	
	addMarker:function(options){
		var win = $WR.getByName('agenda');
		
		return win.Panel.Schedule.addMarker(options);
	},
/**
 * System.Agenda.addStatut(options) -> System.Agenda
 *
 * Cette méthode permet d'ajouter un statut.
 **/	
	addStatut:function(name, value, color){
		
		var options = $S.Meta('AGENDA_STATUS') || [];
		
		for(var i = 0; i < options.length; i++){
			if(options[i].value == value){
				return true;
			}
		}
	
		options.push({
			text:	name, 
			value:	value,
			color:	color
		});
		
		options = options.sortBy(function(s){
			return s.text;
		});
		
		$S.Meta('AGENDA_STATUS', options);
		
		return this;
	},
/**
 * System.Agenda.getUserID() -> Number
 **/	
	getUserID:function(){
		var win = $WR.getByName('agenda');
		return win.Panel.DropMenu.select('.agendas.selected')[0].value;
	},
/**
 * System.Agenda.getUser() -> System.User
 **/	
	getUser:function(){
		var win = $WR.getByName('agenda');
		return win.Panel.DropMenu.select('.agendas.selected')[0].data;
	},
	
	getUserByID:function(id){
		var win = $WR.getByName('agenda');
		
		return win.Panel.DropMenu.select('.agendas.user-' + id)[0].data;
	},
/**
 * System.Agenda.getUsersID() -> Array
 *
 * Retourne la liste des ID utilisateur séléctionné pour être affiché sur l'agenda partagé.
 **/	
	getUsersID:function(){
		return ($U().getMeta('AGENDA_USERS') || []).concat([$U().User_ID]);
	},
/**
 *
 **/	
	haveCreateRight:function(user){
		if(user.User_ID == $U().User_ID) return true;
		
		var a = user.getMeta('AGENDA_USERS_EVT_ADD') || [];
		return a.indexOf($U().User_ID) != -1;
	},
/**
 *
 **/	
	haveAgenda:function(user){
		if(user.User_ID == $U().User_ID) return true;
		
		var a = $U().getMeta('AGENDA_USERS') || [];
		return a.indexOf(user.User_ID) != -1;
	},
/**
 * System.Agenda.Status() -> Array
 * System.Agenda.Status(str) -> Object
 *
 **/	
	Status:function(str){
		
		var list = $S.Meta('AGENDA_STATUS');
		
		if(Object.isUndefined(str)){
			return list;	
		}
		
		for(var i = 0; i < list.length; i++){
			if(list[i].value == str){
				return list[i];
			}
		}
		return false;
	}
};

System.Agenda.initialize();