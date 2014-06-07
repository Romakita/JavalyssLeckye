/** section: CRM
 * System.CRM.Client.Call
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : crm_client.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.CRM.Client.Call = Class.createAjax({
/**
 * System.CRM.Client.Call#Call_ID -> Number
 **/
	Call_ID: 0,
/**
 * System.CRM.Client.Call#Client_ID -> Number
 **/
	Client_ID: 0,
/**
 * System.CRM.Client.Call#Contact_ID -> String
 * Varchar
 **/
	Contact_ID:  0,
	
	Contact:	'',
	
	Company:	'',
/**
 * System.CRM.Client.Call#User_ID -> String
 * Varchar
 **/
	User_ID: "",
/**
 * System.CRM.Client.Call#Subject -> String
 * Varchar
 **/
	Subject: "",
/**
 * System.CRM.Client.Call#Date_Call -> Datetime
 **/
	Date_Call: null,
/**
 * System.CRM.Client.Call#Date_Recall -> Date
 **/
	Date_Recall: '0000-00-00 00:00:00',
/**
 * System.CRM.Client.Call#Conclusion -> String
 * Varchar
 **/
	Conclusion: '',
/**
 * System.CRM.Client.Call#Comment -> String
 * Text
 **/
	Comment: '',
/**
 * System.CRM.Client.Call#Statut -> String
 * Varchar
 **/
	Statut: 'draft',
/**
 * System.CRM.Client.Call#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('crm.client.call.commit', {
			
			parameters: 'CRMClientCall=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.CRM.Client.Call#remove(callback [, error]) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback, error){
		$S.exec('cmr.client.call.delete',{
			parameters: 'CRMClientCall=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
		});
	},
/**
 *
 **/	
	createCall:function(callback){
		
		this.Statut = 		'finish recalled';
		this.Date_Recall = 	new Date();
							
		this.commit(function(){
								
			var appel = this.clone();
			
			appel.Call_ID = 			0;
			appel.Statut = 				'finish';
			appel.Date_Call = 			appel.Date_Recall;
			appel.Date_Recall = 		'0000-00-00 00:00:00';
			appel.Comment.remarque = 	'';
			
			appel.commit(function(){
				if(Object.isFunction(callback)) callback.call(this, this);
			});
		});	
	}
});

Object.extend(System.CRM.Client.Call, {
/**
 * System.CRM.Client.LabelsOther -> Object
 **/		
	LabelsOther: {
		phone:			'Téléphone',
		email:			'E-mail',
		remarque:		'Remarques'
	},
/**
 * System.CRM.Client.Call.LabelsPhone -> Object
 **/	
	LabelsPhone: {
		call:			'Principal',
		company:		'Société',
		other:			'Autre',
		office: 		'Bureau',
		home:			'Domicile',
		mobile:			'Portable'
	},
/**
 * System.CRM.Client.Call.AdvancedFilters -> Array
 **/	
	AdvancedFilters: [
		{text:'Aucun filtre', value:''},
		{text:'Filtrer par date de rappel', value:'DateRecall'},
		{text:'Filtrer par conclusion', value:'Conclusion'}
	],
/**
 * System.CRM.Client.Call.initialize() -> void
 **/
	initialize: function(){
		
		$S.observe('system:startinterface', function(){
			if(!System.plugins.haveAccess('CRM')){
				return;	
			}
			System.CRM.Client.Call.Count();
		});
		
		System.on('crm.client.call:open.submit.complete', function(){
			System.Agenda.refresh();
			
			var win = $WR.getByName('crm');
			
			if(win){
				System.CRM.Client.Call.listing(win);
			}
			
		});
		
		System.on('crm.client.call:remove.submit.complete', function(){
			System.Agenda.refresh();
			
			var win = $WR.getByName('crm');
			
			if(win){
				System.CRM.Client.Call.listing(win);
			}
		});
		
		System.observe('agenda:refresh', function(options){
			
			if(!System.plugins.haveAccess('CRM')){
				return;	
			}
			
			System.exec('crm.client.call.list', {
				parameters:'options=' + Object.EncodeJSON(options),
				onComplete:function(result){
					try{
						var obj = result.responseText.evalJSON();
					}catch(er){
						$S.trace(result.responseText);
						return;
					}
					
					var hours = {};
					var win = 	$WR.getByName('agenda');
					var bubble = win.createBubble();
					
					for(var i = 0; i < obj.length; i++){
						
						var call = new System.CRM.Client.Call(obj[i]);
						call.icon = 'crm-call-agenda';
						call.date = call.Date_Recall.clone();
						
						if(call.date.format('his') == '000000'){
														
							var key = call.date.format('Ymd');
							
							if(Object.isUndefined(hours[key])){
								hours[key] = call.date.clone();
								hours[key].setHours(8,0,0);
							}else{
								hours[key].setMinutes(hours[key].getMinutes() + 30);
							}
							
							call.date = hours[key].clone();
						}
						
						var title = 	new Node('h2', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Appel à passer'));
												
						var marker = System.Agenda.addMarker(call);
						marker.addClassName('crm-call');
						
						marker.on('click', function(evt){
							evt.stop();
							System.CRM.Client.Call.GetAndOpen(this.Call_ID);
						});
						
						
						
						var html = 	new HtmlNode();
						var table = new TableData();
						
						table.css('margin-bottom', '15px');
						table.addHead($MUI('Client') + ' : ', {width:80}).addField(call.Company, {width:250}).addRow();
						table.addHead($MUI('Contact') + ' : ', {width:80}).addField(call.Contact).addRow();
						table.addHead($MUI('Objet') + ' : ').addField(call.Subject).addRow();
						
						if(marker.Date_Recall.format('his') == '000000'){
							table.addHead($MUI('Heure') + ' : ').addField($MUI('Dans la journée')).addRow();
						}else{
							table.addHead($MUI('Heure') + ' : ').addField($MUI('À') + ' ' + marker.Date_Recall.format('h\\hi')).addRow();
						}
						
						html.appendChilds([
							title,
							table
						]);
						
						bubble.add(marker,{
							text:html
						});
					}
					
				}
				
			});
		});
	},
/*
 *
 **/	
	Count:function(){
		
		$S.exec('crm.client.call.notify', {
			parameters:	'options=' + Object.EncodeJSON({
				Statut:	'draft',
				op:		'-today'
			}),
			
			onComplete:	function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(er);
					return;	
				}
				try{
										
				if(obj.Today != 0){
					
					if(Object.isUndefined(this.LineNotifyToday)){
						this.LineNotifyToday = System.Notify.add({
							appName:	'CRM',
							groupName:	$MUI('Appels'),
							appIcon:	'crm-call',
							title:		$MUI('Vous avez')+' '+ obj.Today +' '+ $MUI('appel(s) à passer aujourd\'hui')
						});
						
						this.LineNotifyToday.on('click', function(){
							//on verra
						});
						
					}else{
						this.LineNotifyToday.setText($MUI('Vous avez')+' '+ obj.Today +' '+ $MUI('appel(s) à passer aujourd\'hui'));	
					}
					
					
				}else{
					
					if(this.LineNotifyToday){
						this.LineNotifyToday.parentNode.removeChild(this.LineNotifyToday);
					}
					
				}
				
				if(obj.Week != 0){
					
					if(Object.isUndefined(this.LineNotifyWeek)){
						this.LineNotifyWeek = System.Notify.add({
							appName:	'CRM',
							groupName:	$MUI('Appels'),
							appIcon:	'crm-call',
							title:		$MUI('Vous avez')+' '+ obj.Week +' '+ $MUI('appel(s) à passer dans les 7 prochains jours')
						});
						
						this.LineNotifyWeek.on('click', function(){
							//on verra
						});
						
					}else{
						this.LineNotifyWeek.setText($MUI('Vous avez')+' '+ obj.Week +' '+ $MUI('appel(s) à passer dans les 7 prochains jours'));	
					}
					
					
				}else{
					
					if(this.LineNotifyWeek){
						this.LineNotifyWeek.parentNode.removeChild(this.LineNotifyWeek);
					}
					
				}
				
				if(obj.Total != 0){
					
					if(Object.isUndefined(this.LineNotifyTotal)){
						this.LineNotifyTotal = System.Notify.add({
							appName:	'CRM',
							groupName:	$MUI('Appels'),
							appIcon:	'crm-call',
							title:		$MUI('Vous avez')+' '+ obj.Week +' '+ $MUI('appel(s) en attente')
						});
						
						this.LineNotifyTotal.on('click', function(){
							//on verra
						});
						
					}else{
						this.LineNotifyTotal.setText($MUI('Vous avez')+' '+ obj.Week +' '+ $MUI('appel(s) en attente'));	
					}
					
					
				}else{
					
					if(this.LineNotifyTotal){
						this.LineNotifyTotal.parentNode.removeChild(this.LineNotifyTotal);
					}
					
				}
				
				}catch(er){$S.trace(er)}
				
			}.bind(this)
		});
		
	},
/**
 * System.CRM.Client.Call.openFromSearch(data) -> void
 *
 * Cette méthode ouvre le formulaire.
 **/	
	openFromSearch: function(data){
		var win = this.open(data);
	},
/**
 * System.CRM.Client.Call.GetAndOpen(id) -> void
 *
 * Cette méthode ouvre le formulaire.
 **/	
	GetAndOpen:function(id){
		System.AlertBox.wait();
		System.exec('crm.client.call.get', {
			parameters:'Call_ID=' + id,
			onComplete:function(result){
				System.AlertBox.hide();
				var o = new System.CRM.Client.Call();
				try{
					o.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);	
					return;
				}
				
				System.CRM.Client.Call.open(o);
			}
		});
	},
/**
 * System.CRM.Client.Call.open(call) -> void
 *
 * Cette méthode ouvre le formulaire.
 **/	
	open:function(call){
		//creation de l'instance unique
		var win = $WR.unique('crm.call', {
			autoclose:	true,
			action: function(){
				this.open(call);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
				
		var self = this;
				
		win.createForm();
		win.setData(new System.CRM.Client.Call(call));
				
		win.setIcon('crm-call');
		
		win.readOnly = 				false;
		win.Resizable(false);
		//win.setTheme('flat white');
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();
		win.createHandler($MUI('Chargement en cours') + '...', true);
		
		win.forms.submit = 		new SimpleButton({text:$MUI('Enregistrer'), type:'submit'}).on('click', function(){this.submit(win)}.bind(this));
		win.forms.reset = 		new SimpleButton({text:$MUI('Fermer')}).on('click', function(){win.close()}.bind(this));
						
		win.Footer().appendChilds([win.forms.submit, win.forms.reset]);
		
		document.body.appendChild(win);
		
		win.createTabControl().addClassName('jpanel');
		win.ChromeSetting(false);
		
		win.forms.Info = 		win.TabControl.addPanel($MUI('Informations'), this.createPanelInfo(win).addClassName('html-node'));
						
		$S.fire('crm.call:open', win);
		
		win.setMaxHeight(document.stage.stageHeight);
		win.centralize();
		
		return win;
	
	},
/**
 * System.CRM.Client.Call.createPanelInfo(win) -> Panel
 **/
	createPanelInfo:function(win){
		var call = 	win.getData();
		var forms = win.createForm();
		var flag =	win.createFlag().setType(FLAG.RIGHT);
		
		//#pragma region Instance
		
		var splite = new SpliteIcon($MUI('Gestionnaire d\'appel'));
		splite.setIcon('crm-call-48');
		
		var panel = new Panel({style:'width:550px;'});
		//
		//
		//
		forms.User_ID = 		new Select({
			parameters:'cmd=user.list&options='+Object.EncodeJSON({
				op:			'-select',
				Roles:		System.Meta('CRM_GROUP_CALLER'),
				default:	true
			})
		});
		forms.User_ID.Value(call.User_ID);
		forms.User_ID.load();
		//
		// Client
		//
		forms.Client_ID = 	new InputCompleter({
			minLength: 	3,
			delay:		0,
			
			parameters:'cmd=crm.client.list&options='+Object.EncodeJSON({
				op:			'-completer'
			})			
		});
		
		forms.Client_ID.Value(call.Client_ID);
		forms.Client_ID.Text(call.Company);
						
		forms.Client_ID.on('change',function(){
			
			if(forms.Contact_ID.Value() != 0){
				forms.Contact_ID.Value('');
				forms.Contact_ID.Text('');	
			}		
			
					
			forms.Contact_ID.setParameters('cmd=contact.list&options=' + Object.EncodeJSON({
				Client_ID: 	forms.Client_ID.Value(),
				op:			'-select'
			})).load();
			
		});
		//
		//
		//
		forms.Contact_ID = new Select({
			parameters:	'cmd=contact.list&options=' + Object.EncodeJSON({
				Client_ID: 	call.Client_ID,
				op:			'-select'
			})	
		});
		
		forms.Contact_ID.Input.readOnly = false;
		
		if(call.Client_ID != 0){
			forms.Contact_ID.load();
		}
		
		forms.Contact_ID.Value(call.Contact_ID);
		forms.Contact_ID.Text(call.Contact_ID == 0 ? '' : call.Contact);
		
		forms.Contact_ID.on('complete', function(){
			if(this.Value() == 0){
				this.Text('');
			}
		});
		
		forms.addFilters('Contact_ID', function(){
			return this.Contact_ID.Value();
		});
		
		forms.addFilters('Contact', function(){
			return this.Contact_ID.Text();
		});
		
		/*forms.Contact_ID.observe('change', function(e, line){
			this.selectedIndex(0);
		});
		
		forms.Contact_ID.observe('change', function(e, line){
			this.Value(line.data.Nom + ', ' + line.data.Prenom);
		});*/
		//
		//
		//
		forms.Subject =			new Input({type:'text', value:call.Subject});	
		//
		//
		//
		forms.Conclusion =		new Select();
		
		forms.Conclusion.setData(System.CRM.getCallConlusions());
		forms.Conclusion.Value(isNaN(+call.Conclusion) ? '' : call.Conclusion);
		
		forms.Conclusion.on('change', function(){
			if(this.Value() == ''){
				forms.Conclusion_Other.parentNode.parentNode.show();
			}else{
				forms.Conclusion_Other.parentNode.parentNode.hide();	
			}
		});
		
		forms.addFilters('Conclusion', function(){
			return this.Conclusion.Value() == '' ? forms.Conclusion_Other : forms.Conclusion.Value();
		});
		//
		//
		//
		forms.Conclusion_Other = new Input({type:'text', value:call.Conclusion});		
		//
		//
		//
		forms.Recall =			new ToggleButton();
		forms.Recall.Value(call.Date_Recall != '0000-00-00 00:00:00');
		
		forms.Recall.on('change', function(){
			
			if(this.Value()){
				forms.RecallNoHours.parentNode.parentNode.show();
				forms.Date_Recall.parentNode.parentNode.show();	
			}else{
				forms.RecallNoHours.parentNode.parentNode.hide();
				forms.Date_Recall.parentNode.parentNode.hide();	
			}
		});
		//
		//
		//
		forms.RecallNoHours =			new ToggleButton();
		forms.RecallNoHours.Value(call.Date_Recall == '0000-00-00 00:00:00' || call.Date_Recall.format('his') == '000000');
		
		
		forms.RecallNoHours.on('change', function(){
			forms.Date_Recall.removeClassName('datetime');
			
			if(!this.Value()){
				forms.Date_Recall.addClassName('datetime');
			}
		});
				
		forms.Date_Recall = 	new InputCalendar({
			type:forms.RecallNoHours.Value() ? 'date' : 'datetime'	
		});
				
		forms.Date_Recall.setDate(call.Date_Recall);
		
		forms.addFilters('Date_Recall', function(){
			if(!forms.Recall.Value()){
				return '0000-00-00 00:00:00';
			}
			
			var date = forms.Date_Recall.getDate();
			
			if(forms.RecallNoHours.Value()){
				date.setHours(0,0,0);
			}
			
			return date.format('Y-m-d h:i:s');
		});
		//
		// Statut
		//
		forms.Statut = new Select();
		
		forms.Statut.on('draw', function(line){
			
			if(line.Text() == $MUI('Rappel terminé')){
				if(win.getData().Date_Recall == '0000-00-00 00:00:00'){
					line.hide();
				}else{
					if(win.getData().Statut != 'finish recalled'){
						win.createFlag().add(line, {
							orientation: 	Flag.RIGHT,
							text:			$MUI('La fiche sera dupliqué à l\'enregistrement de cette dernière')
						});
					}
				}
			}
		});
		
		forms.Statut.setData([
			{text:$MUI('Appel à passer'), icon:'crm-call-checked', value:'draft'},
			{text:$MUI('Appel terminé'), icon:'valid', value:'finish'},
			{text:$MUI('Rappel terminé'), icon:'crm-duplicate-call', value:'finish recalled'}
		]);
		forms.Statut.Value(call.Statut);
		
		var table = 			new TableData();
		
		table.addHead($MUI('Appelant'), {style:'width:180px'}).addCel(forms.User_ID).addRow();
		table.addHead($MUI('Client')).addCel(forms.Client_ID).addRow();
		table.addHead($MUI('Contact')).addCel(forms.Contact_ID).addRow();
		table.addHead(' ', {height:8}).addRow();
		table.addHead($MUI('Objet')).addCel(forms.Subject).addRow();
		table.addHead($MUI('Conclusion de l\'appel')).addCel(forms.Conclusion).addRow();
		table.addHead($MUI('Préciser conclusion')).addCel(forms.Conclusion_Other).addRow();
		table.addHead($MUI('Statut')).addCel(forms.Statut).addRow();
		table.addHead($MUI('Rappeler') + ' ?').addCel(forms.Recall).addRow();
		table.addHead($MUI('Dans la journée') + ' ?').addCel(forms.RecallNoHours).addRow();
		table.addHead($MUI('Rappeler le')).addCel(forms.Date_Recall).addRow();
				
		if(call.Date_Recall == '0000-00-00 00:00:00'){
			forms.RecallNoHours.parentNode.parentNode.hide();
			forms.Date_Recall.parentNode.parentNode.hide();	
		}
		
		if(forms.Conclusion.Value() != ''){
			forms.Conclusion_Other.parentNode.parentNode.hide();
		}
		//#pragma endregion Instance
		
		panel.appendChilds([
			splite,
			table
		]);
		//
		//
		//
		if(call.Phone != ''){
			win.forms.BtnPhone = 	new SimpleMenu({text:$MUI('Appeler'), icon:'phone'});
			win.forms.BtnPhone.css('position','absolute').css('top','5px').css('right','5px');
			win.forms.BtnPhone.Popup.css('left', 'auto').css('right', 0);
			
			panel.appendChild(win.forms.BtnPhone);
			
			for(var key in call.Phone){
			
				var line = new LineElement();
				
				line.setText(System.CRM.Client.Call.LabelsPhone[key] + ' : ' + System.CRM.formatPhone(call.Phone[key]));
				line.phone = call.Phone[key].replace(/[ #\._-]/g, '');
				line.css('min-width', 250);
						
				line.on('click', function(evt){
					evt.stop();
					
					System.Opener.open('tel', this.phone);
				});
				
				win.forms.BtnPhone.appendChild(line);
			}
		}
		//
		//
		//
		this.createMultipleOtherField(win, {
			field:	'Comment',
			label:	$MUI('Autres informations'),
			node:	panel
		});
		
		//#pragma region Event
		
	/*	flag.add(forms.Objet, {
			orientation: Flag.RIGHT,
			icon:		'documentinfo',
			text:		$MUI('Saisissez ici l\'<b>objet</b> de l\'appel'),
			color:		'grey'
		});
		
		flag.add(forms.Conclusion, {
			orientation: Flag.RIGHT,
			icon:		'documentinfo',
			text:		$MUI('Saisissez ici la <b>conclusion</b> de l\'appel'),
			color:		'grey'
		});*/
		
		return panel;		
	},
/**
 * System.CRM.Client.Call.createMultipleOtherField(win) -> Panel
 **/	
	createMultipleOtherField:function(win, options){
		var call = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		var table = 		new TableData();
		win.forms[options.field] =	{};
		
		win.forms.addFilters(options.field, function(){
			var a  = {};
			Object.setObject(a, this[options.field]);
			return a;			
		});
		
		for(var key in call[options.field]){
			if(call[options.field][key] == '') continue;
			
			switch(key){
				default:
					win.forms[options.field][key] = new Input({
						type:		'text',
						maxLength:	255
					});
					break;
					
				case 'remarque':
					win.forms[options.field][key] = new TextArea({
						maxLength:1024
					});
					break;
					
				case 'email':
					win.forms[options.field][key] = new InputButton({
						sync:		true,
						type:		'text', 
						value:		call[options.field][key], 
						maxLength:	200, 
						icon: 		'mail'
					});
					
					win.forms[options.field][key].SimpleButton.on('click', function(){
						
						if(this.Value() != ''){
							System.Opener.open('mailto', this.Value());
						}
						
					}.bind(win.forms[options.field][key]));
					break;
					
				case 'phone':
					win.forms[options.field][key] = new InputButton({
						sync:		true,
						type:		'text', 
						value:		call[options.field][key], 
						maxLength:	20, 
						icon: 		'phone'
					});
					
					win.forms[options.field][key].SimpleButton.on('click', function(){
						
						if(this.Value() != ''){
							System.Opener.open('tel', this.Value());
						}
						
					}.bind(win.forms[options.field][key]));
					
					win.forms[options.field][key].on('change', function(){
						this.Value(this.Value().replace(/[ #\._-]/g, ''))
					});
					
					break;
			}
			
			win.forms[options.field][key].Value(call[options.field][key]);
			
			if(System.CRM.Client.Call.LabelsOther[key]){//label exist
				table.addHead(System.CRM.Client.Call.LabelsOther[key]).addCel(win.forms[options.field][key]).addRow();
			}			
		}
				
		html.appendChild(table);
		//
		// Ajout du client
		//
		var add = new SimpleMenu({icon:'add-element', text:options.label, nofill:true});
		add.addClassName('menu-client bottom');
		
		for(var key in System.CRM.Client.Call.LabelsOther){
						
			if(Object.isElement(win.forms[options.field][key])) {
				continue;
			}
			
			var le = new LineElement({text:System.CRM.Client.Call.LabelsOther[key]});
			add.appendChild(le);
			le.name = key;
			
			le.on('click', function(){
				
				add.removeChild(this);
				
				switch(this.name){
					default:
						win.forms[options.field][this.name] = new Input({
							type:		'text',
							maxLength:	255
						});
						break;
						
					case 'remarque':
						win.forms[options.field][this.name] = new TextArea({
							maxLength:1024
						});
						break;
						
					case 'email':
						win.forms[options.field][this.name] = new InputButton({
							sync:		true,
							type:		'text',
							maxLength:	200, 
							icon: 		'mail'
						});
						
						win.forms[options.field][this.name].SimpleButton.on('click', function(){
							
							if(this.Value() != ''){
								System.Opener.open('mailto', this.Value());
							}
							
						}.bind(win.forms[options.field][this.name]));
						break;
						
					case 'phone':
						win.forms[options.field][this.name] = new InputButton({
							sync:		true,
							type:		'text',
							maxLength:	20, 
							icon: 		'phone'
						});
						
						win.forms[options.field][this.name].SimpleButton.on('click', function(){
							
							if(this.Value() != ''){
								System.Opener.open('tel', this.Value());
							}
							
						}.bind(win.forms[options.field][this.name]));
						
						win.forms[options.field][this.name].on('change', function(){
							this.Value(this.Value().replace(/[ #\._-]/g, ''))
						});
						
						break;
						
				}
								
				//win.forms[options.field][this.name] = new Input({type:'text', maxLength:20});
				table.addHead(System.CRM.Client.Call.LabelsOther[this.name]).addCel(win.forms[options.field][this.name]).addRow();
				
				win.Panel.PanelSwip.ScrollBar.refresh();
				win.Panel.PanelSwip.ScrollBar.scrollTo(table);
			});
		}
				
		html.appendChild(add);
	},
/**
 * System.CRM.Client.Call.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
		var flag = win.createFlag();		
		win.Flag.hide();
		
		if(forms.Subject.value == ''){
			forms.Subject.focus();
			flag.setText($MUI('Vous <b>devez</b> saisir un <b>objet</b> pour cet appel')+'.').setType(FLAG.RIGHT).color('red').show(forms.Subject, true);
			return true;
		};
		
		if(forms.Conclusion.Value() == '' && forms.Conclusion_Other.Value() == ''){
			forms.Conclusion.focus();
			flag.setText($MUI('Vous <b>devez</b> saisir une <b>conclusion</b> pour cet appel')+'.').setType(FLAG.RIGHT).color('red').show(forms.Conclusion_Other, true);
			return true;
		};
		
		var oldStatut = win.getData().Statut != 'finish recalled';
			
		win.forms.save(win.getData());
		
		var evt = new StopEvent(win);
		$S.fire('crm.client.call:open.submit', evt);
		if(evt.stopped) return;
		
		win.ActiveProgress();
		
		if(oldStatut && win.forms.Statut.Value() == 'finish recalled'){
			
			win.getData().createCall(function(data){
				
				win.close();
				
				win = System.CRM.Client.Call.open(data);
			
				$S.fire('crm.client.call:open.submit.complete', win);
				
				var splite = new SpliteIcon($MUI('Appel correctement enregistré'));
				splite.setIcon('filesave-ok-48');
				
				var box = win.createBox();
				box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
				
			});
			
		}else{
			win.getData().commit(function(){
				
				$S.fire('crm.client.call:open.submit.complete', win);
				
				var splite = new SpliteIcon($MUI('Appel correctement enregistré'));
				splite.setIcon('filesave-ok-48');
				
				var box = win.createBox();
				box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
				
			});
		}
			
		return this;
	},
/**
 *
 **/	
	openFilterDateRecall: function(){
		
		var win = $WR.getByName('crm');
		var forms = {};
		//
		//
		//
		forms.Date_Start = new InputCalendar({type:'date'});
		forms.Date_Start.css('width', 280);
		
		if(!Object.isUndefined(this.NavBar.CurrentFilter.startRecall)){
			forms.Date_Start.setDate(this.NavBar.CurrentFilter.startRecall);
		}
		//
		//
		//
		forms.Date_End = new InputCalendar({type:'date'});
		forms.Date_End.linkTo(forms.Date_Start);
		forms.Date_End.css('width', 280);
		
		if(!Object.isUndefined(this.NavBar.CurrentFilter.endRecall)){
			forms.Date_End.setDate(this.NavBar.CurrentFilter.endRecall);
		}
		
		var panel = win.Panel;
		
		panel.clearSwipAll();
		panel.PanelSwip.footer.removeChilds();
		
		win.Panel.Open(true, 300);
		
		panel.PanelSwip.Body().appendChild(new Node('h4', $MUI('Filtrer par date de rappel')));
		
		var table = new TableData();
		table.addClassName('liquid');
		table.addCel($MUI('Début') + ' : ', {style:'font-weight:bold'}).addRow();
		table.addCel(forms.Date_Start).addRow();
		table.addCel($MUI('Fin') + ' : ', {style:'font-weight:bold'}).addRow();
		table.addCel(forms.Date_End).addRow();
				
		
		panel.PanelSwip.Body().appendChild(table);
		
		var submit = 	new SimpleButton({text:$MUI('Rechercher')});
		submit.on('click', function(){
			this.NavBar.CurrentFilter = {};
			this.NavBar.getClauses().page = 0;
			
			this.NavBar.CurrentFilter.startRecall = forms.Date_Start.getDate().format('Y-m-d') + ' 00:00:00';
			this.NavBar.CurrentFilter.endRecall = 	forms.Date_End.getDate().format('Y-m-d') + ' 23:59:59';
			
			this.load();
			
		}.bind(this));
		
		panel.PanelSwip.footer.appendChild(submit);
				
		return win;
		
	},
/**
 *
 **/	
	openFilterConclusion: function(){
		
		var win = $WR.getByName('crm');
		var forms = {};
		//
		//
		//
		forms.Conclusion = new Select();
		
		forms.Conclusion.setData(System.CRM.getCallConlusions());
		forms.Conclusion.css('width', 280);
		
		forms.Conclusion.on('change', function(){
			
			if(this.Value() == ''){
				table.getRow(2).show();
				table.getRow(3).show();
			}else{
				table.getRow(2).hide();
				table.getRow(3).hide();
			}
			
		});		//
		//
		//
		forms.Conclusion_Other = new Input();
		forms.Conclusion_Other.css('width', 276);
		
		if(!Object.isUndefined(this.NavBar.CurrentFilter.Conclusion)){
			forms.Conclusion.setDate(this.NavBar.CurrentFilter.Conclusion);
			forms.Conclusion_Other.setDate(this.NavBar.CurrentFilter.Conclusion_Other);
		}
		
		var panel = win.Panel;
		
		panel.clearSwipAll();
		panel.PanelSwip.footer.removeChilds();
		
		win.Panel.Open(true, 300);
		
		panel.PanelSwip.Body().appendChild(new Node('h4', $MUI('Filtrer par conclusion')));
		
		var table = new TableData();
		table.addClassName('liquid');
		table.addCel($MUI('Conclusion') + ' : ', {style:'font-weight:bold'}).addRow();
		table.addCel(forms.Conclusion).addRow();
		table.addCel($MUI('Précisez') + ' : ', {style:'font-weight:bold'}).addRow();
		table.addCel(forms.Conclusion_Other).addRow();
		
		
		if(forms.Conclusion.Value() != ''){
			table.getRow(2).hide();
			table.getRow(3).hide();
		}
				
		panel.PanelSwip.Body().appendChild(table);
		
		var submit = 	new SimpleButton({text:$MUI('Rechercher')});
		submit.on('click', function(){
			this.NavBar.CurrentFilter = {};
			this.NavBar.getClauses().page = 0;
			
			this.NavBar.CurrentFilter.Conclusion = 	forms.Conclusion.Value() == '' ? forms.Conclusion_Other.Value() : forms.Conclusion.Value();
			
			this.load();
			
		}.bind(this));
		
		panel.PanelSwip.footer.appendChild(submit);
				
		return win;
		
	},
/**
 * System.CRM.Client.Call.listing(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	listing:function(win){
		
		var panel = win.Panel;
		
		try{
			System.CRM.setCurrent('call');
		}catch(er){$S.trace(er)};
		
		if(!this.NavBar){
			
			var options = {
				range1:			50,
				range2:			100,
				range3:			300,
				readOnly:		true,
				progress:		false,
				//groupBy:		'Date_Group',
				emtpy:			$MUI('Désolé. Aucun client ne correspond à votre recherche')
			};
			
			this.NavBar = new NavBar(options);
			
			this.NavBar.on('change', this.load.bind(this));
			this.NavBar.setMaxLength(0);
			//
			//
			//		
			this.NavBar.AdvancedFilter = new Select();
			this.NavBar.AdvancedFilter.setData(System.CRM.Client.Call.AdvancedFilters);
			this.NavBar.AdvancedFilter.setStyle('float:right;width:200px');
			
			this.NavBar.AdvancedFilter.on('change', function(){
								
				if(this.NavBar.AdvancedFilter.Value() == ''){
					this.NavBar.CurrentFilter = {};
					this.NavBar.getClauses().page = 0;
			
					this.load();
					win.Panel.Open(false);
				}else{
					System.CRM.Client.Call['openFilter' + this.NavBar.AdvancedFilter.Value()].call(System.CRM.Client.Call);
				}
								
			}.bind(this));
			
			this.NavBar.PrintAll = 		new Node('span', {className:'action statut user selected', value:''}, $MUI('Tous'));
			this.NavBar.PrintDraft = 	new Node('span', {className:'action statut', value:'-unfinish'}, $MUI('À traiter'));
			this.NavBar.PrintFinish = 	new Node('span', {className:'action statut', value:'-finish'}, $MUI('Traités'));
			this.NavBar.PrintMy = 		new Node('span', {className:'action user my icon icon-system-unchecked', value:$U().User_ID}, $MUI('Mes appels'));
									
			this.NavBar.appendChilds([
				this.NavBar.PrintAll,
				this.NavBar.PrintDraft,
				this.NavBar.PrintFinish,
				this.NavBar.PrintMy,
				this.NavBar.AdvancedFilter
			]);
			
			this.NavBar.PrintDraft.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.select('span.action.statut.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintDraft.addClassName('selected');
				
				this.load();
				
			}.bind(this));
			
			this.NavBar.PrintAll.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.select('span.action.statut.selected').invoke('removeClassName', 'selected');
				this.NavBar.select('span.action.user.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintAll.addClassName('selected');
				
				this.load();
				
			}.bind(this));
			
			this.NavBar.PrintFinish.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.select('span.action.statut.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintFinish.addClassName('selected');
				
				this.load();
				
			}.bind(this));
			
			this.NavBar.PrintMy.on('click', function(){
				this.NavBar.getClauses().page = 0;
				
				this.NavBar.PrintMy.removeClassName('icon-system-unchecked');
				this.NavBar.PrintMy.removeClassName('icon-system-checked');
				
				if(this.NavBar.PrintMy.hasClassName('selected')){
					this.NavBar.select('span.action.user.selected').invoke('removeClassName', 'selected');
					 this.NavBar.PrintMy.addClassName('icon-system-unchecked');
				}else{
					this.NavBar.PrintMy.addClassName('selected');
					 this.NavBar.PrintMy.addClassName('icon-system-checked');
				}
				
				this.load();
				
			}.bind(this));
			
			this.Table = new SimpleTable(options);
			this.Table.clauses = this.NavBar.getClauses();
					
			this.Table.addHeader({
				Action:			{title:'', width:100, style:'text-align:center', type:'action'},
				Statut:			{title:$MUI('Statut'), width:30, style:'text-align:center'},
				Date_Call:		{title:$MUI('Appel'), width:150, style:'text-align:center', sort:true, order:'DESC'},
				Date_Recall:	{title:$MUI('Rappel'), width:150, style:'text-align:center'},
				User:			{title:$MUI('Appelant'), width:150, style:'text-align:center'},
				Company:		{title:$MUI('Client'), style:'text-align:center'},
				Contact:		{title:$MUI('Contact'), width:150, style:'text-align:center'},
				Subject:		{title:$MUI('Objet'), width:200, style:'text-align:center'},
				Conclusion:		{title:$MUI('Conclusion appel'), width:200, style:'text-align:center'},
				
			});	
			
			this.Table.addFilters('Action', function(e, cel, data){
				
				e.remove.css('margin-right', '5px');
				cel.css('text-align', 'left');
				
				var call = new System.CRM.Client.Call(data);
				
				var button = new SimpleButton({icon:'open-customer', type:'mini'});
				
				button.on('click', function(){
					System.CRM.Client.GetAndOpen(call.Client_ID);
				});
				
				e.appendChild(button);
				
				if(call.Phone != ''){
					var button = new SimpleMenu({icon:'phone', type:'mini'});
					e.appendChild(button);
					
					for(var key in call.Phone){
						
						if(key == 'fax') continue;
						
						var line = new LineElement();
						
						line.setText($MUI(System.CRM.Client.Call.LabelsPhone[key])  + ' : ' + System.CRM.formatPhone(call.Phone[key]));
						line.phone = call.Phone[key].replace(/[ #\._-]/g, '');
						line.css('min-width', 250);
								
						line.on('click', function(evt){
							evt.stop();
							
							System.Opener.open('tel', this.phone);
						});
						
						button.appendChild(line);
					}
					
				}
										
				return e;
			});
			
			this.Table.onWriteName = function(key){
				if(key){
					return key.toDate().format('l d F Y');
				}
				return '';
			};
			
			this.Table.addFilters('Statut', function(e, cel, data){
				
				var button = new SimpleButton();
				
				switch(e){
					case 'draft':
						button.setIcon('call-checked');
						
						win.Flag.add(button, {
							orientation:Flag.RIGHT,
							color:		'grey',
							icon:		'documentinfo',
							text:		$MUI('Cliquez ici pour terminer l\'appel')
						});
						
						button.observe('click', function(){
							this.setIcon('valid');
							this.noFill(true);
							this.stopObserving('click');
							this.stopObserving('mouseover');
							
							var appel = new System.CRM.Client.Call(data);
							
							appel.Statut = 'finish'; 
														
							appel.commit(function(){
								$S.fire('crm.client.call:open.submit.complete', this);
							});
							
						});
						
						break;
						
					case 'finish':
						
						if(data.Date_Recall == '0000-00-00 00:00:00'){
							button.setIcon('valid');
							button.noFill(true);							
							break;
						}
						
						button.setIcon('crm-duplicate-call');
						
						win.Flag.add(button, {
							orientation:Flag.RIGHT,
							color:		'grey',
							icon:		'documentinfo',
							text:		$MUI('Cliquez ici pour clôturer le rappel et créer un nouvel appel')
						});
						
						button.observe('click', function(){
							this.setIcon('valid');
							this.noFill(true);
							this.stopObserving('click');
							this.stopObserving('mouseover');
							
							var recall = new System.CRM.Client.Call(data);
							
							win.createBox().wait();
							
							recall.createCall(function(){
								win.createBox().hide();
								
								$S.fire('crm.client.call:open.submit.complete', this);
								
								System.CRM.Client.Call.open(this);
								
							});
							
						});
						break;
						
					case 'finish recalled':
						button.setIcon('crm-duplicate-call');
						button.noFill(true);						
						break;	
				}
				
				return button;
			});
			
			this.Table.addFilters('Date_Call', function(e, cel, data){	
				cel.setStyle('text-align:left');
				cel.colSpan = 2;
				
				var node = new Node('ul', {style:'padding-left:15px'});
				
				try{
					
					if(data.Statut != 'draft'){
						var li = new Node('li', [
							new Node('strong', $MUI('Appelé le') + ' : '),
							e.toDate().format('D. d M. Y à h\\hi')
						]);
					}else{
						var li = new Node('li', {style:'color:#D24726'}, [
							new Node('strong', $MUI('Appel prévu le') + ' : '),
							e.toDate().format('D. d M. Y à h\\hi')
						]);
					}
					node.appendChild(li);
				}catch(er){
					return e;	
				}
				
				if(data.Date_Recall != '0000-00-00 00:00:00'){
					date = data.Date_Recall.toDate();
					
					if(data.Statut != 'finish recalled'){
						var li = new Node('li', {style:'color:#D24726'}, [
							new Node('strong', $MUI('Rappel prévu le') + ' : '),
							date.format('his') == '000000' ? date.format('D. d M. Y') : date.format('D. d M. Y à h\\hi')
						]);	
					}else{
						var li = new Node('li', {style:'color:green'}, [
							new Node('strong', $MUI('Rappelé le') + ' : '),
							date.format('his') == '000000' ? date.format('D. d M. Y') : date.format('D. d M. Y à h\\hi')
						]);	
					}
					
					node.appendChild(li);
				}
				
				return node;
			});		
					
			this.Table.addFilters('Date_Recall', function(e, cel, data){	
				cel.hide();
				return e;
			});	

			this.Table.addFilters(['User', 'Contact', 'Subject'], function(e, cel, data){	
				cel.setStyle('text-align:left;');
				return e;
			});	
			
			this.Table.addFilters(['Contact'], function(e, cel, data){	
				cel.setStyle('text-align:left;');
				return e == '0' ? '' : e;
			});	
			
			this.Table.addFilters('Company', function(e, cel, data){
				
				cel.css('text-align', 'left');
				
				var node = 	new Node('h5', {style:'margin:0px'}, e);
				
				if(data.CompanyComment != null){
					var p = 	new Node('p', {style:'font-weight:normal; font-size:11px;margin:0'}, data.CompanyComment.evalJSON().activity);
				
					node.appendChild(p);
				}
						
				return node;
			});
			
			this.Table.addFilters('Conclusion', function(e, cel){
				cel.setStyle('text-align:left;');
				switch(+e){
					default: return e;
					case 1: return $MUI('NRP - Appel non répondus');
					case 2: return $MUI('NRA - Appel sans avoir eu de contact avec le destinataire final');
					case 3: return $MUI('CTINF - Contact avec le destinataire ou son assistante');
					case 4: return $MUI('PROJ - Contact avec le destinataire ou son assistante');
				}
			});
						
			this.Table.on('open', function(evt, data){
				System.CRM.Client.Call.open(data);
			});
			
			this.Table.on('remove', function(evt, data){				
				System.CRM.Client.Call.remove(data, win.boxCreate());
			});
					
			this.Table.on('complete', function(obj){
				
				System.CRM.Client.Call.NavBar.setMaxLength(obj.maxLength);			
				
				//panel.PanelBody.refresh();
				
				var win =	$WR.getByName('crm');
				
				win.Panel.BtnCall.setTag(obj.maxLength);
				
				if(win.Panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						win.Panel.ProgressBar.hide();
						win.Panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					win.Panel.ProgressBar.hide();
				}
				
				if(obj.length == 0){
					this.empty.show();
				}
				
			});
			
			this.Table.empty = new Node('H2', {className:'notfound'}, $MUI('Aucun appel n\'est enregistré ou ne correspond à votre recherche')+'.' );
			this.Table.empty.hide();
			
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		//this.NavBar.appendChild(this.NavBar.Category);
		
		//permet d'ajouter un element en dehors de la scrollbare défini par jPanel
		panel.PanelBody.addTable(this.Table);
		
		this.NavBar.getClauses().page = 0;
		this.NavBar.AdvancedFilter.Value('');
		this.NavBar.CurrentFilter = {};
		
		this.load();		
	},
/**
 * System.CRM.Client.Call.getParameters() -> void
 *
 * Cette méthode créée les paramètres de recherche de données.
 **/	
	getParameters:function(page){
		
		var clauses = this.NavBar.getClauses();
		clauses.where = $WR.getByName('crm').Panel.InputCompleter.Text();
		
		var options = {
			statistics:	true
		};
		
		var statut = this.NavBar.select('.action.statut.selected');
		if(statut.length){
			options.op = 	statut[0].value;
		}
		
		var user = this.NavBar.select('.action.user.my.selected');
		
		if(user.length == 1){
			options.User_ID = $U().User_ID;
		}
		
		if(this.NavBar.AdvancedFilter.Value() != ''){
			Object.extend(options, this.NavBar.CurrentFilter);			
		}
		
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 * System.CRM.Client.Call.load() -> void
 *
 * Cette méthode charge les données du tableau.
 **/	
	load:function(){
		var win = $WR.getByName('crm');
		
		if(win){
			win.Panel.ProgressBar.show();
			win.createBubble().hide();
			
			this.Table.empty.hide();
			this.Table.setParameters('cmd=crm.client.call.list&' + this.getParameters());
			win.Panel.InputCompleter.setParameters('cmd=crm.client.call.list&' + this.getParameters());
			
			this.Table.load();	
		}
	},
/**
 * System.CRM.Client.Call.onSearch() -> void
 *
 * Cette méthode charge les données du tableau.
 **/	
	onSearch:function(obj){
		var win = $WR.getByName('crm');
		
		this.NavBar.setMaxLength(obj.maxLength);
		this.NavBar.clauses.where = win.Panel.InputCompleter.Text();
		this.Table.clear();
		this.Table.addRows(obj);
	},
/**
 * System.CRM.Client.Call.remove(win, client) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(data, box){
		data = new System.CRM.Client.Call(data);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer l\'appel') + ' "' + data.Subject + '" ? ');
		splite.setIcon('edittrash-48');
		//
		// 
		//
		box.setTheme('flat liquid black');
		box.a(splite).setType().show();
		
		$S.fire('crm.client.call:remove.open', box);
		
		box.reset(function(){
			box.setTheme();	
		});
						
		box.submit({
			text:$MUI('Supprimer l\'appel'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('crm.client.call:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				data.remove(function(){
					box.hide();
						
					$S.fire('crm.client.call:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('L\'appel a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.a(splite).setType('CLOSE').Timer(5).show();
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});

System.CRM.Client.Call.initialize();