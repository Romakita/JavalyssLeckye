/** section: Agenda
 * System.Agenda.Event
 **/

Import('plugins.inputrecipient');

System.Agenda.Event = Class.createAjax({
/**
 * System.Agenda.Event#Event_ID -> Number
 **/
	Event_ID: 0,
/**
 * System.Agenda.Event#User_ID -> Number
 **/
	User_ID: 0,
/**
 * System.Agenda.Event#Owner_ID -> Number
 **/
	Owner_ID: 0,
/**
 * System.Agenda.Event#Contact_ID -> Number
 **/
	Contact_ID: 0,
/**
 * System.Agenda.Event#User_ID -> Number
 **/
	Contact: '',
/**
 * System.Agenda.Event#Statut_ID -> Number
 **/
	Statut_ID: 1,
/**
 * System.Agenda.Event#Recall -> Number
 **/
	Recall: -1,
/**
 * System.Agenda.Event#Title -> String
 * Varchar
 **/
	Title: "",
/**
 * System.Agenda.Event#Comment -> String
 * Text
 **/
	Comment: "",
/**
 * System.Agenda.Event#Date_Start -> Datetime
 **/
	Date_Start: '0000-00-00 00:00:00',
/**
 * System.Agenda.Event#Date_End -> Datetime
 **/
	Date_End: '0000-00-00 00:00:00',
/**
 * System.Agenda.Event#Location -> String
 * Varchar
 **/
	Location: "",
	
	Locked:	 false,
/**
 * System.Agenda.Event#Date_Create -> Datetime
 **/
	Date_Create: '0000-00-00 00:00:00',
/**
 * System.Agenda.Event#Date_Update -> Datetime
 **/
	Date_Update: '0000-00-00 00:00:00',
/**
 *
 **/	
	Statut:	'busy',
/**
 *
 **/	
	Type:	'agenda',
/**
 *
 **/	
	Users: 		null,
/**
 *
 **/
	Contacts: 	null,
	
	initialize:function(obj){
		
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(this.Users == null || this.Users == ''){
			this.Users = [];
		}
		
		if(this.Contacts == null || this.Contacts == ''){
			this.Contacts = [];
		}
	},
/**
 * System.Agenda.Event#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('agenda.event.commit', {
			
			parameters: 'AgendaEvent=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
								
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.Agenda.Event#send(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	send: function(callback, error){
		
		$S.exec('agenda.event.send', {
			
			parameters: 'AgendaEvent=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
								
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.Agenda.Event#free(callback, error) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode vérifie qu'il n'y pas d'événement sur les dates indiquées
 **/	
	free:function(callback, error){
		$S.exec('agenda.event.free', {
			
			parameters: 'AgendaEvent=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					var bool = result.responseText.evalJSON();
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return;	
				}
				
				if(bool){				
					if(Object.isFunction(callback)) {
						callback.call(this, this);
					}
				}else{
					if(Object.isFunction(error)) {
						error.call(this, this);
					}	
				}
			}.bind(this)
			
		});
	},
/**
 * System.Agenda.Event#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('agenda.event.delete',{
			parameters: 'AgendaEvent=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	},
	
	setObject:function(obj){
		Object.setObject(this, obj);
		
		if(this.start){
			this.Date_Start = this.start;	
		}
		
		if(this.end){
			this.Date_End = this.end;	
		}
	}
});

Object.extend(System.Agenda.Event, {
	
	initialize:function(){
		
		System.Opener.add('agenda.open', {
			text: 	'Agenda',
			icon:	'agenda-32',
			click:	System.Agenda.Event.open.bind(this),
			onList:	function(event){
				
				if(!Object.isUndefined(event) && !Object.isUndefined(event.Type)){
					
					if(!event.Type.match(/agenda/)){
						return true;
					}
				}
				
				return false;
			}
		});			
	},
	
	Recalls: [
		{text:$MUI('Aucun'), value:-1},
		{text:$MUI('À l\'heure de début'), value:0},
		{text:$MUI('5 minutes'), value:5},
		{text:$MUI('15 minutes'), value:15},
		{text:$MUI('30 minutes'), value:30},
		{text:$MUI('1 heure'), value:60},
		{text:$MUI('18 heures'), value:60*18},
		{text:$MUI('1 jour'), value:60*24},
		{text:$MUI('1 semaine'), value:60*24*7}
	],
/**
 *
 **/	
	open:function(event, mode){
		if(mode == 'window'){
			return this.openInWindow(event);
		}
		
		return this.openInPanel(event);
	},
/**
 *
 **/	
	openInPanel:function(event){
		try{
			
			var win = 	$WR.getByName('agenda');
			var panel = win.Panel;
			
			win.setData(event = new System.Agenda.Event(event));
			
			var forms = win.createForm();
			
			//
			// Réinitialisation du contenu
			//
			panel.clearSwipAll();
			panel.Open(true, 650);
			//
			//
			//
			win.BtnRemove = new Node('span', {className:'icon icon-system-remove', style:'float:right'}, $MUI('Supprimer'));
			win.BtnRemove.on('click',function(){
				System.Agenda.Event.remove(win.getData(), win.createBox());
			});
			
			win.BtnSend = new Node('span', {className:'icon icon-mail', style:'float:right'}, $MUI('Envoyer par e-mail'));
			win.BtnSend.on('click',function(){
				
				System.Agenda.Event.mailSend(win);
				//System.Agenda.Event.remove(win.getData(), win.createBox());
			});
			//
			//
			//
			panel.PanelSwip.addPanel($MUI('Infos'), this.createPanelInfo(win));
			
			panel.PanelSwip.Header().top(win.BtnSend);
			panel.PanelSwip.Header().top(win.BtnRemove);
			
			var submit = new SimpleButton({text:$MUI('Enregistrer')});
						
			submit.on('click', function(){
				
				System.Agenda.Event.submit(win);
				
			});
			
			if(!event.Locked){
				panel.PanelSwip.Footer().appendChild(submit);
			}
			
			$S.fire('agenda.event:open', win);
			
			//win.forms.Comment.load();
			
			return;
		
		}catch(er){$S.trace(er)}
	},
/**
 *
 **/	
	openInWindow:function(event){
		
		var options = {
			instance:	'agenda.event',
			type:		'agenda',
			icon:		'agenda'
		};
				
		var win = $WR.unique(options.instance, {
			autoclose:	true,
			action: function(){
				this.open(event);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		win.options = options;
		
		var self = this;
		//création de l'objet forms
		var forms = win.createForm();		
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.setData(event = new System.Agenda.Event(event));
		
		document.body.appendChild(win);	
		
		win.setTheme('flat white');
		win.NoChrome(true);
		win.Resizable(false);
		win.createBox();
		win.setIcon(options.icon);
		
		win.createHandler($MUI('Chargement en cours'), true);
		//
		// exit
		//
		forms.close =	new SimpleButton({text:$MUI('Fermer')});	
		//
		// submit
		//
		forms.submit =	new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		//
		//forms
		//
		win.createTabControl().addClassName('jpanel');
		win.ChromeSetting(false);
		
		win.BtnSend = new SimpleButton({icon:'mail', text:$MUI('Envoyer par e-mail')});
		win.BtnSend.on('click',function(){
			System.Agenda.Event.mailSend(win);
		});
		
		win.TabControl.addPanel($MUI('Informations'), System.Agenda.Event.createPanelInfo(win).addClassName('html-node'));
		win.TabControl.Header().appendChild(win.BtnSend);
		//win.TabControl.addPanel($MUI('Participants'), System.Agenda.Event.createPanelAttendants(win).addClassName('html-node'));
		
		if(event.Locked){
			win.footer.appendChilds([forms.close]);
		}else{
			win.footer.appendChilds([forms.submit, forms.close]);
		}
		
		win.resizeTo(550, 600); 
							
		//event
		forms.submit.on('click', function(){
			this.submit(win);
		}.bind(this));
		
		forms.close.on('click', function(){
			win.close();
		}.bind(this));	
		
		$S.fire('agenda.event:open', win);
		
		return win;	
	},
/**
 *
 **/	
	createPanelInfo:function(win){
		var panel = new Panel();
		var forms = win.createForm();
		var event = win.getData();
		
		//
		// Titre
		//
		forms.Title = 				new InputMagic({type:'text', value:event.Title});
		forms.Title.placeholder =	$MUI('Objet de votre événement');
		forms.Title.addClassName('icon-edit-element input-event');
		//
		//
		//
		forms.Date_Start = new InputCalendar({
			type:'datetime'
		});
		forms.Date_Start.setDate(event.Date_Start);
		
		forms.Date_Start.on('change', function(){
			System.Agenda.Event.loadAttendants(win);			
		});
		//
		//
		//
		forms.Date_End = new InputCalendar({
			type:'datetime'
		});
		
		forms.Date_End.setDate(event.Date_End);
		forms.Date_End.linkTo(forms.Date_Start);
		
		forms.Date_End.on('change', function(){
			System.Agenda.Event.loadAttendants(win);
		});
		//
		//
		//
		forms.Location = 			new InputCompleter({
			sync:		true, 
			button:		false,
			parameters: 'cmd=agenda.event.distinct&field=Location'
		});
		
		forms.Location.Value(event.Location);
		//
		//
		//
		forms.Statut =		new Select(); 
		forms.Statut.setData($S.Meta('AGENDA_STATUS'));
		
		forms.Statut.Value(event.Statut);
		forms.Statut.addClassName('input-color');
		forms.Statut.StatutBox = new ColoredBox();
		forms.Statut.appendChild(forms.Statut.StatutBox);
		forms.Statut.StatutBox.setColor(forms.Statut.Current().data.color);
		forms.Statut.on('change', function(){
			forms.Statut.StatutBox.setColor(forms.Statut.Current().data.color);
		});
		//
		//
		//
		forms.User_ID = new Select({
			parameters:'cmd=user.list&options=' + Object.EncodeJSON({Users:System.Agenda.getUsersID()})	
		});
		
		if(event.User_ID == 0){
			event.User_ID = $U().User_ID;
		}
		
		forms.User_ID.Value(event.User_ID);
		forms.User_ID.load();
		
		//
		//
		//
		forms.Contact_ID = new InputCompleter({
			minLength: 	1,
			delay:		0,
			parameters:	'op=contact.list&options=' + Object.EncodeJSON({op:'-completer'})
		});
		
		forms.Contact_ID.Value(event.Contact_ID);
		forms.Contact_ID.Text(event.Contact);
		
		forms.addFilters('Contact_ID', function(){
			return this.Contact_ID.Value();
		});
		
		forms.addFilters('Contact', function(){
			return this.Contact_ID.Text();
		});
		//
		//
		//
		forms.Recall =		new Select(); 
		forms.Recall.setData(this.Recalls);
		
		if(event.Event_ID == 0){
			forms.Recall.Value($U().getMeta("AGENDA_RECALL_EVENT") || 0);
		}else{	
			forms.Recall.Value(event.Recall);
		}
		//
		//
		//
		forms.Comment =			new TextArea();
		forms.Comment.placeholder = $MUI('Saisissez vos remarques');
		forms.Comment.css('width', '98%').css('height', '150px');
		forms.Comment.Value(event.Comment);
		
		var btnMapView = 		new SimpleButton({icon:'map-contact', text:$MUI('Localiser'), nofill:true});
		btnMapView.on('click', function(){
			
			System.Opener.open('map', {
				title:			win.forms.Title.Text().trim(),
				location: 		win.forms.Location.Text().trim()
			});
			
		});
		//
		// Itinéraire
		//
		var btnMapItinerary = 	new SimpleButton({icon:'itinerary-contact', text:$MUI('Itinéraire'), nofill:true});
		btnMapItinerary.on('click', function(){
			System.Opener.open('itinerary', {
				destination: win.forms.Location.Text().trim()
			});
		});
		//
		//
		//
		panel.appendChild(forms.Title);
		
		panel.appendChild(new Node('h4', $MUI('Quand')));
		var table = new TableData();
		
		table.addHead($MUI('Début')).addCel(forms.Date_Start).addRow();
		table.addHead($MUI('Fin')).addCel(forms.Date_End).addRow();
			
		panel.appendChild(table);
			
		panel.appendChild(new Node('h4', $MUI('Détails'), [btnMapView, btnMapItinerary]));
		
		var table = new TableData();
		
		
		if(event.Event_ID == 0){
			table.addHead($MUI('Agenda de')).addCel(forms.User_ID).addRow();
		}else{
			table.addHead($MUI('Agenda de')).addCel(event.User, {style:'font-weight:bold'}).addRow();
		}
		
		table.addHead($MUI('Lieu')).addCel(forms.Location).addRow();
		table.addHead($MUI('Contact')).addCel(forms.Contact_ID).addRow();
		table.addHead($MUI('Statut')).addCel(forms.Statut).addRow();
		table.addHead($MUI('Rappel')).addCel(forms.Recall).addRow();
		
		panel.appendChild(table);
		
		this.createAttendants(win, panel);
		
		panel.appendChild(new Node('h4', $MUI('Remarques')));
		
		panel.appendChild(forms.Comment);
		
		return panel;
	},
/**
 *
 **/	
	createAttendants:function(win, panel){
		
		var forms = win.createForm();
		
		panel.appendChild(new Node('h4', $MUI('Participants')));
		
		var input = new Node('div', {className:'area-input', style:'overflow:auto; height:150px;border-radius:0'});
		var table = new TableData();
		input.appendChild(table);
		
		forms.TableUsers = table;
		forms.TableUsers.addClassName('liquid');
		
		forms.addFilters('Users', function(){
			if(!forms.UsersLoaded){
				return win.getData().Users;
			}
			
			var a = [];
			forms.Users.each(function(u){
				if(u.toggle.Value()){
					a.push(u.User_ID);	
				}
			});
			return a;
		});
		
		this.loadAttendants(win);
				
		panel.appendChild(input);
		
		panel.appendChild(new Node('h4', $MUI('Liste de diffusion')));
		//
		//
		//
		forms.Contacts = 	new InputRecipient({
			parameters:	'cmd=system.search.mail',
			button:		false
		});
		forms.Contacts.css('margin', '5px 0px').css('border-radius', 0);
		
		forms.Contacts.Value(win.getData().Contacts);
		
		
		panel.appendChild(forms.Contacts);
		
		return panel;
	},
/**
 *
 **/	
	loadAttendants:function(win){
		var forms = win.createForm();
		var event = win.getData();
		forms.Users = [];
		forms.UsersLoaded = false;
		forms.TableUsers.clear();
		
		var o = event.clone();
		forms.save(o);
		
		System.exec('agenda.event.attendant.free.list',{
			parameters:'options=' + Object.EncodeJSON({'Users':System.Agenda.getUsersID()}) + '&AgendaEvent=' + o.toJSON(),
			onComplete:function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);	
					return;
				}
				
				try{
				forms.UsersLoaded = true;
				
				for(var i = 0, y = 0; i < obj.length; i++){
					
					if(obj[i].User_ID == forms.User_ID.Value()){
						continue;	
					}
					
					if(!System.Agenda.haveCreateRight(new User(obj[i]))){
						continue;	
					}
					
					var icon = new AppButton({
						icon:obj[i].Avatar48 != ''  ? obj[i].Avatar48 : 'men-48',
						type:'mini'
					});
					
					icon.addClassName('user');
					
					var toggle = new ToggleButton({type:'mini', yes:'I', no:'O'});
					toggle.Value(event.Users.indexOf(obj[i].User_ID) != -1);
					
					forms.TableUsers.addCel(icon).addCel(obj[i].Name + ' ' + obj[i].FirstName, {style:'font-size: 13px; padding-left: 5px;width:130px'}).addCel(obj[i].Free ? toggle : $MUI('Indisponible'));
					
					forms.Users.push({User_ID:obj[i].User_ID, toggle:toggle});
					
					if(y % 2 == 1){
						forms.TableUsers.addRow();
					}else{
						forms.TableUsers.addCel(' ',  {style:'width:10px'});	
					}
					
					y++;
				}
				}catch(er){$S.trace(er)}
			}
		});
	},
/**
 * System.Agenda.Event.submit(win) -> void
 **/	
	submit:function(win){
		var flag = win.createFlag();
		flag.hide();
		var forms = win.createForm();
		
		if(forms.Title.Value() == ''){
			flag.setText($MUI('Veuillez choisir un titre pour votre événement !')).setType(FLAG.TOP).show(forms.Title, true);
			return;
		}
				
		$S.fire('agenda.event:open.submit', win);
		
		var event =				win.forms.save(win.getData());
		
		win.AlertBox.wait();
				
		event.free(function(){
			
			event.commit(function(){
				
				win.AlertBox.hide();
				
				$S.fire('agenda.event:open.submit.complete', win);
				
				var splite = new SpliteIcon($MUI('Evènement correctement enregistré'));
				splite.setIcon('filesave-ok-48');
				
				var box = win.createBox();
				box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
											
			});
			
		}, function(){
			var splite = new SpliteIcon($MUI('L\'utilisateur est indisponible sur les dates demandées'));
			splite.setIcon('alert-48');
			
			var box = win.createBox();
			box.setTitle($MUI('Indisponibilité')).a(splite).setType('CLOSE').Timer(5).show();
		});
		
		return this;
		
	},
/**
 * System.Agenda.Event.mailSend(win) -> void
 **/
 	mailSend:function(win){
		var event = win.getData();
		
		event.send(function(){
			
		});
		
		var box = win.createBox();
		var splite = new SpliteIcon($MUI('E-mail en cours d\'envoi'));
		splite.setIcon('valid-48');
		
		box.a(splite).setTitle($MUI('Confirmation')).setIcon('documentinfo').Timer(5).setType('CLOSE').show();
	},
/**
 * System.Agenda.Event.remove(event, box) -> void
 *
 * Cette méthode supprime l'instance `event` de la base de données.
 **/
	remove: function(data, box){
		data = new System.Agenda.Event(data);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer l\'événement') + ' ? ', $MUI('Evènement') + ' : ' + data.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//		
		box.setTheme('flat liquid black');
		box.a(splite).setIcon('delete').setType().show();
		
		$S.fire('agenda.event:remove.open', box);
		
		box.reset(function(){
			box.setTheme();
		});
						
		box.submit({
			text:	$MUI('Supprimer'),
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('agenda.event:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				data.remove(function(){
					box.hide();
					box.setTheme();
						
					$S.fire('agenda.event:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le rendez-vous a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.a(splite).setType('CLOSE').Timer(5).show();
					box.reset(function(){
						box.setTheme();
					});
							
					var win = $WR.getByName('agenda');
					
					if(win){
						win.Panel.Open(false);
						System.Agenda.refresh();
					}
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});

System.Agenda.Event.initialize();