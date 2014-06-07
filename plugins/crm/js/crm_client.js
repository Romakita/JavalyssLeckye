/** section: CRM
 * System.CRM.Client
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : crm_client.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.CRM.Client = Class.createAjax({
/**
 * System.CRM.Client#Client_ID -> Number
 **/
	Client_ID:		0, 
/**
 * System.CRM.Client#Avatar -> String
 **/
	Avatar:			'',
/**
 * System.CRM.Client#Company -> String
 **/
	Company:			'',
/**
 * System.CRM.Client#CompanyName -> String
 **/	
	CompanyName:				'', 
/**
 * System.CRM.Client#Address -> String
 **/	  	  	 
	Address:			'',
/**
 * System.CRM.Client#CP -> String
 **/	  	 
	CP:				'',	  	 
/**
 * System.CRM.Client#City -> String
 **/ 	 
	City:				'',
/**
 * System.CRM.Client#County -> String
 **/ 	 
	County:			'',
/**
 * System.CRM.Client#State -> String
 **/ 	 
	State:				'',
/**
 * System.CRM.Client#Country -> String
 **/ 	 
	Country:			'',
/**
 * System.CRM.Client#Phone -> String
 **/  	  	 
	Phone:				'',	
/**
 * System.CRM.Client#Fax -> String
 **/  	  	 
	Fax:				'',	
/**
 * System.CRM.Client#Email -> String
 **/	  	  	 
	Email:				'', 
/**
 * System.CRM.Client#Web -> String
 **/	  	  	 
	Web:				'',
/**
 * System.CRM.Client#Comment -> String
 **/	  	  	 
	Comment:			'',
/**
 * System.CRM.Client#Categories -> String
 **/	
	Categories:			'',
/**
 *
 **/		
	initialize:function(obj){
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(this.Web == ''){
			this.Web = [];	
		}
		
		if(this.Comment == ''){
			this.Comment = {};	
		}
		
		if(this.Categories == ''){
			this.Categories = ['all'];	
		}
		
	},
/**
 * System.CRM.Client#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('crm.client.commit', {
			
			parameters: 'CRMClient=' + this.toJSON(),
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
 * System.CRM.Client#print(options, callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Imprime les données de l'instance.
 **/
 	print: function(options, callback){
				
		$S.exec('crm.client.print', {
			parameters: 'CRMClient=' + this.toJSON() + '&options=' + Object.EncodeJSON(options),
			onComplete: callback
		});
	},
/**
 * System.CRM.Client#remove(callback [, error]) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback, error){
		$S.exec('crm.client.delete',{
			parameters: 'CRMClient=' + this.toJSON(),
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
	
	havePhoneNumber:function(){
		return this.Phone != '';
	},
	
	haveMail:function(){
		return this.Email != '';
	}
});

Object.extend(System.CRM.Client, {
/**
 * System.CRM.Client.initialize()
 **/		
	LabelsOther: {
		activity:			'Activité',
		remarque:			'Remarques',
		siren:				'N° Siren',
		siret:				'N° Siret',
		rcs:				'RCS',
		tvaintra: 			'N° TVA Intra',
		sizeofcompany:		'Taille société'
	},
/**
 * System.CRM.Client.Call.AdvancedFilters -> Array
 **/	
	AdvancedFilters: [
		{text:'Aucun filtre', value:''},
		{text:'Voir par catégorie', value:'Category'},
		{text:'Voir par date de rappel', value:'DateRecall'},
		{text:'Voir par conclusion', value:'Conclusion'},
		{text:'Voir client non appelé', value:'Uncall'}
	],
/**
 * System.CRM.Client.initialize()
 **/
	initialize: function(){
		
		System.on('crm.client:open.submit.complete', function(){
						
			var win = $WR.getByName('crm');
			
			if(win){
				System.CRM.Client.listing(win);
			}
			
		});
		
		System.on('crm.client:remove.submit.complete', function(){
			System.Agenda.refresh();
			
			var win = $WR.getByName('crm');
			
			if(win){
				System.CRM.Client.listing(win);
			}
		});
		
		System.on('crm.client.call:open.submit.complete', function(){
			System.Agenda.refresh();
			
			var win = $WR.getByName('crm.client') || $WR.getByName('crm');
			
			if(win){
				win.createForm().WidgetCalls.setParameters('cmd=crm.client.call.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID})).load();
			}
			
		});
		
		System.on('crm.client.call:remove.submit.complete', function(){
			System.Agenda.refresh();
			
			var win = $WR.getByName('crm.client') || $WR.getByName('crm') ;
			
			if(win){
				win.createForm().WidgetCalls.setParameters('cmd=crm.client.call.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID})).load();
			}
		});
		
		
		System.fire('agenda.event:open.submit.complete', function(){
			
			var win = $WR.getByName('crm.client') || $WR.getByName('crm') ;
			
			if(win){
				win.createForm().WidgetEvents.load();
			}
			
		});
		
		System.fire('agenda.event:remove.submit.complete', function(){
			
			var win = $WR.getByName('crm.client') || $WR.getByName('crm') ;
			
			if(win){
				win.createForm().WidgetEvents.load();
			}
			
		});
		
	},
/**
 *
 **/	
	openFromSearch: function(data){
		this.open(data, 'window');
	},
/**
 *
 **/	
	GetAndOpen:function(id, mode){
		var win = $WR.getByName('crm');
		System.AlertBox.wait();
		
		System.exec('crm.client.get', {
			parameters:'Client_ID=' + id,
			onComplete:function(result){
				System.AlertBox.hide();
				var o = new System.CRM.Client.Call();
				o.evalJSON(result.responseText);
				
				System.CRM.Client.open(o, mode);
			}
		});
	},
/**
 * System.Market.open(client, mode) -> void
 *
 * Cette méthode ouvre le panneau de l'application.
 **/	
	open:function(client, mode){
		//if(mode == 'window' || !$WR.getByName('crm')){
			return this.openInWindow(client);
		//}
		
		return this.openInPanel(client);
	},
/**
 *
 **/	
	openInPanel:function(client){
		var win = $WR.getByName('crm');
		try{
			win.setData(client = new System.CRM.Client(client));
			win.forms = win.createForm();
					
			var panel = win.Panel;
			
			panel.clearSwipAll();
					
			win.Panel.Open(true, 650);
			
			win.forms.Medias =	[];
			
			var button = new Node('H1', client.Company.trim() == '' ? $MUI('Nouveau client') : client.Company.trim());
			
			panel.PanelSwip.Body().appendChild(button);
			panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win, button)).on('click', function(){
				win.Panel.Open(true, 650);
			});
					
			win.BtnContacts = 	panel.PanelSwip.addPanel($MUI('Contacts'), System.CRM.Contact.createPanelListing(win));
			win.BtnEvents = 	panel.PanelSwip.addPanel($MUI('RDV'), System.CRM.Event.createPanelListing(win));
			win.BtnCalls = 		panel.PanelSwip.addPanel($MUI('Appels'), this.createPanelCall(win));
			win.BtnMedias = 	panel.PanelSwip.addPanel($MUI('Médias'), this.createPanelMedia(win));
			win.BtnNotes = 		panel.PanelSwip.addPanel($MUI('Notes'), this.createPanelNote(win));
			
			win.BtnContacts.on('click', function(){
				win.Panel.Open(true, 700);
			});
			
			win.BtnEvents.on('click', function(){
				win.Panel.Open(true, 700);
			});
			
			win.BtnMedias.on('click', function(){
				win.Panel.Open(true, 650);
			});
			
			win.BtnNotes.on('click', function(){
				win.Panel.Open(true, 650);
			});
			//
			//
			//
			var submit = 	new SimpleButton({text:$MUI('Enregistrer')});
			submit.on('click', function(){
				System.CRM.Client.submit(win);
			});
			
			panel.PanelSwip.footer.removeChilds();
			
			panel.PanelSwip.footer.appendChilds([
				submit
			]);
		
			$S.fire('crm.client:open', win);
			
		}catch(er){$S.trace(er)}
		
		return win;		
	},
/**
 *
 **/	
	openInWindow:function(client){
		
		var options = {
			instance:	'crm.client',
			type:		'crm',
			icon:		'crm'
		};
				
		var win = $WR.unique(options.instance, {
			autoclose:	true,
			action: function(){
				this.open(client);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		win.options = options;
		
		var self = this;
		//création de l'objet forms
		var forms = win.forms = win.createForm();		
		win.forms.Medias =	[];
		
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.setData(client = new System.CRM.Client(client));
		
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
		
		var button = new Node('H1', client.Company.trim() == '' ? $MUI('Nouveau client') : client.Company.trim());
		var panel;
		
		win.TabControl.addPanel($MUI('Info'), panel = this.createPanelInfos(win, button));
		panel.css('width', 550);
		panel.top(button);
				
		win.BtnContacts = 	win.TabControl.addPanel($MUI('Contacts'), panel = System.CRM.Contact.createPanelListing(win));
		panel.Maximize(true);
		panel.css('width', 700);
		
		
		win.BtnEvents = 	win.TabControl.addPanel($MUI('RDV'), panel = System.CRM.Event.createPanelListing(win));
		panel.Maximize(true);
		panel.css('width', 700);
		
		win.BtnCalls = 		win.TabControl.addPanel($MUI('Appels'),panel = this.createPanelCall(win));
		panel.Maximize(true);
		panel.css('width', 700);
		
		win.BtnMedias = 	win.TabControl.addPanel($MUI('Médias'), panel = this.createPanelMedia(win));
		panel.css('width', 600);
		
		win.BtnNotes = 		win.TabControl.addPanel($MUI('Notes'), panel = this.createPanelNote(win));
		panel.css('width', 600);
		
		win.footer.appendChilds([forms.submit, forms.close]);
		
		win.resizeTo('auto', 600); 
							
		//event
		forms.submit.on('click', function(){
			this.submit(win);
		}.bind(this));
		
		forms.close.on('click', function(){
			win.close();
		}.bind(this));	
		
		$S.fire('crm.client:open', win);
		
		return win;	
	},
	
/**
 * System.CRM.Client.createPanelInfo(win) -> Panel
 **/	
	createPanelInfos:function(win,button){
		var panel = new Panel();
		var client = win.getData();
		//
		// Raison
		//
		win.forms.Company =			new Input({type:'text', value:client.Company, maxLength:100});
		//
		//
		//
		win.forms.Categories =		new Select({multiple:true}); 
		win.forms.Categories.setData(System.CRM.getCategories());
		
		win.forms.Categories.Value(client.Categories);
		
		win.forms.addFilters('Categories', function(){
			var array = [];
			
			this.Categories.Value().each(function(e){
				array.push(e.value);
			});
			return array;
		});
		//
		// Nom
		//
		win.forms.Company =			new Input({type:'text', value:client.Company, maxLength:100});
		win.forms.Company.on('keyup', function(){
			button.innerHTML  = win.forms.Company.Value();
		});
		//
		// Nom
		//
		win.forms.CompanyName =		new Input({type:'text', value:client.CompanyName, maxLength:100});
		//
		//Email
		//
		win.forms.Email = 	new InputButton({type:'email', maxLength: 255, value: client.EMail, sync:true, icon:'system-mail'});
		win.forms.Email.SimpleButton.on('click', function(){
			if(win.forms.Email.Text() == '') return;
			System.Opener.open('mailto', win.forms.Email.Text());
		});
		
		win.forms.addFilters('EMail', 'Text');
		//
		//Phone
		//
		win.forms.Phone = 	new InputButton({type:'text', maxLength: 30, value: client.Phone, sync:true, icon:'system-phone'});
		
		win.forms.Phone.SimpleButton.on('click', function(){
			if(win.forms.Phone.Text() == '') return;
			System.Opener.open('tel', win.forms.Phone.Text());
		});
		
		win.forms.addFilters('Phone', 'Text');
		
		win.forms.Phone.on('change', function(){
			this.Value(this.Value().replace(/[ #\._-]/g, ''))
		});
		//
		// Fax
		//
		win.forms.Fax = 	new Input({type:'text', maxLength: 30, value: client.Fax});
		win.forms.Fax.on('change', function(){
			this.Value(this.Value().replace(/[ #\._-]/g, ''))
		});
		
		//
		// Adresse
		//
		win.forms.Address =			new TextArea({value:client.Address});
		//
		// CP
		//
		win.forms.CP =				new InputCP({value:client.CP, button:false});
		//
		// Ville
		//
		win.forms.City =			new InputCity({value:client.City, button:false});
		win.forms.City.linkTo(win.forms.CP);
		//
		// Pays
		//
		win.forms.Country =			new Select({value:client.Country, button:false});
		win.forms.Country.setData(Countries.toData());
		//
		// Web
		//
		win.forms.Web =				new Input({type:'text', value:client.Web, maxLength:255});
		//
		// RCS
		//
		win.forms.Remarque =		new TextArea({value:client.Remarque});
		//
		// Table
		//
		var buttonAddCat = 			new SimpleButton({icon:'add-element', nofill:true, text:$MUI('Catégorie')});
		buttonAddCat.on('click', function(evt){
			System.CRM.openAddCategory(evt, win);
		});
		
		var buttonPrint = 			new SimpleButton({icon:'print', nofill:true, text:$MUI('Imprimer')});
		buttonPrint.on('click', function(){
			
			var o = new System.CRM.Client(win.getData());
			win.forms.save(o);
			System.CRM.Client.Print.open(o, win.createBox());
			
		});
		
		panel.appendChild(new Node('h4', [$MUI('Informations'), buttonAddCat, buttonPrint]));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Société')).addCel(win.forms.Company).addRow();
		table.addHead($MUI('Raison sociale')).addCel(win.forms.CompanyName).addRow();
		table.addHead($MUI('Catégorie')).addCel(win.forms.Categories).addRow();
		
		table.addHead($MUI('E-mail')).addCel(win.forms.Email).addRow();
		table.addHead($MUI('Téléphone')).addCel(win.forms.Phone).addRow();
		table.addHead($MUI('Fax')).addCel(win.forms.Fax).addRow();
						
		panel.appendChild(table);	
		//
		// Localisation
		//
		var btnMapView = 		new SimpleButton({icon:'map', text:$MUI('Localiser'), nofill:true});
		btnMapView.on('click', function(){
			
			System.Opener.open('map', {
				
				title:			win.forms.Name.Value() + ' ' + win.forms.FirstName.Value(),
				
				location: {
					Address:	win.forms.Address.Value(),
					CP:			win.forms.CP.Value(),
					City:		win.forms.City.Value(),
					Country:	win.forms.Country.Value()
				}
			});
			
		});
		
		//
		// Itinéraire
		//
		var btnMapItinerary = 	new SimpleButton({icon:'itinerary', text:$MUI('Itinéraire'), nofill:true});
		btnMapItinerary.on('click', function(){
			
			System.Opener.open('itinerary', {
				destination: {
					Address:	win.forms.Address.Value(),
					CP:			win.forms.CP.Value(),
					City:		win.forms.City.Value(),
					Country:	win.forms.Country.Value()
				}
			});
			
		});
				
		panel.appendChild(new Node('h4', $MUI('Adresse'), [btnMapView, btnMapItinerary]));
		//
		//
		//
		var table = 		new TableData();
		
		table.addHead($MUI('Adresse'),{style:'vertical-align:top'}).addCel(win.forms.Address, {style:'padding:0'}).addRow();
		table.addHead($MUI('Code Postal')).addCel(win.forms.CP).addRow();
		table.addHead($MUI('Ville')).addCel(win.forms.City).addRow();
		table.addHead($MUI('Pays')).addCel(win.forms.Country);
				
		panel.appendChild(table);
		//
		//
		//		
		this.createMultipleWebField(win, {
			field:	'Web',
			label:	$MUI('Site internet'),
			node:	panel
		});
		
		this.createMultipleOtherField(win, {
			field:	'Comment',
			label:	$MUI('Autres informations'),
			node:	panel
		});
		
		return panel;
	},
/**
 * System.CRM.Client.createPanelMedia() -> Panel
 **/	
	createPanelMedia:function(win){
		
		win.forms.addFilters('Medias', function(){
			var a  = [];
			Object.setObject(a, this.Medias);
			return a;			
		});
		
		var panel = new Panel();
		
		var client = 	win.getData();		
		//
		// Media
		//
		
		var h4 = 		new Node('h4', $MUI('Gestion des médias'));
		
		panel.appendChild(h4);
		//
		//
		//
		var section =	new Node('div');
		panel.appendChild(section);
		
		
		var array = 	win.forms.Medias ? win.forms.Medias : [];
		var oArray =	client.Medias ? client.Medias : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			if(data.Type == 'note') continue;
			
			var current = {
				Media_ID:	win.getData().Client_ID == 0 ? 0 : data.Media_ID
			};
			
			var button = new System.CRM.Client.Media({
				icon:		data.Link || '',
				text:		data.Title,
				subText:	data.Description || ''
			});
			
			button.it = array.length;
									
			current.Title = 			button.Title;
			current.Link = 				button.Link;
			current.Description = 		button.Description;
			current.Type = 				data.Type;
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
						
			new fThread(function(){button.load();});
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Ajouter'), nofill:true});
		add.addClassName('top');
		
		add.on('click', function(){
								
			var data = oArray[i];
			
			var current = {
				Media_ID: 	0,
				Type:		'multimedia'
			};
			
			var button = new System.CRM.Client.Media({
				icon:		'',
				text:		$MUI('Média'),
				subText:	''
			});
			
			button.it = array.length;
									
			current.Title = 			button.Title;
			current.Link = 				button.Link;
			current.Description = 		button.Description;
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
			
			try {
				win.Panel.PanelSwip.ScrollBar.refresh();
				win.Panel.PanelSwip.ScrollBar.scrollTo(button);
			} catch(err) {}
			
			button.load();
		});
				
		h4.appendChild(add);
		
		return panel;
	},
/**
 * System.CRM.Client.createPanelCall() -> void
 **/	
	createPanelCall:function(win){
		var panel = new Panel();
		
		var options = {
			range1:			2000,
			range2:			2000,
			range3:			2000,
			readOnly:		true,
			progress:		false,
			emtpy:			$MUI('Désolé. Aucun appel ne correspond à votre recherche')
		};
		
		var button = new SimpleButton({nofill:true, icon:'add-element', text:$MUI('Ajouter')});
		button.on('click', function(){
			System.CRM.Client.Call.open({Client_ID:win.getData().Client_ID, Company:win.getData().Company});
		});
		
		panel.appendChild(new Node('h4', [$MUI('Liste des appels passés avec le client'), button]));
						
		var table = win.createForm().WidgetCalls = panel.Table = new SimpleTable({
			parameters:	'cmd=crm.client.call.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID}),
			selectable:	false,
			readOnly:	true
		});
		
		table.addHeader({
			Action:			{title:'', width:50, style:'text-align:center', type:'action'},
			Statut:			{title:$MUI('Statut'), width:20, style:'text-align:center'},
			Date_Call:		{title:$MUI('Date appel'), width:260, style:'text-align:center', sort:true, order:'DESC'},
			Conclusion:		{title:$MUI('Informations'), style:'text-align:center', sort:false}
		});
				
		table.Body().css('height', '490px');
		
		
		table.addFilters('Statut', function(e, cel, data){
			var button = new SimpleButton();
				
			switch(e){
				case 'draft':
					button.setIcon('crm-call-checked');
					
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
		
		table.addFilters('Conclusion', function(e, cel, data){
			
			cel.setStyle('text-align:left;');
			
			var node = new Node('ul', {style:'padding-left:15px'});
			
			var li = new Node('li', [
				new Node('strong', $MUI('Sujet') + ' : '),
				data.Subject
			]);
			
			node.appendChild(li);
			
			li = new Node('li', [
				new Node('strong', $MUI('Appellant') + ' : '),
				data.User
			]);
			
			node.appendChild(li);
			
			switch(+e){
				default: 
					li = new Node('li', [
						new Node('strong', $MUI('Conclusion') + ' : '),
						e
					]);
					break;
				case 1: 
					li = new Node('li', [
						new Node('strong', $MUI('Conclusion') + ' : '),
						$MUI('NRP')
					]);
					break;
					
				case 2: 
					li = new Node('li', [
						new Node('strong', $MUI('Conclusion') + ' : '),
						$MUI('NRA')
					]);
					break;
					
				case 3: 
					li = new Node('li', [
						new Node('strong', $MUI('Conclusion') + ' : '),
						$MUI('CTINF')
					]);
					break;
					
				case 4: 
					var li = new Node('li', [
						new Node('strong', $MUI('Conclusion') + ' : '),
						$MUI('PROJ')
					]);
					break;
			}
			
			node.appendChild(li);
			
			return node;
		});
		
		table.addFilters('Date_Call', function(e, cel, data){	
			cel.setStyle('text-align:left');
			
			var node = new Node('ul', {style:'padding-left:15px'});
			
			try{
				
				if(data.Statut != 'draft'){
					var li = new Node('li', [
						new Node('strong', $MUI('Appelé le') + ' : '),
						e.toDate().format('d/m/Y à h\\hi')
					]);
				}else{
					var li = new Node('li', {style:'color:#D24726'}, [
						new Node('strong', $MUI('Appel prévu le') + ' : '),
						e.toDate().format('d/m/Y à h\\hi')
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
						date.format('his') == '000000' ? date.format('d/m/Y') : date.format('d/m/Y à h\\hi')
					]);	
				}else{
					var li = new Node('li', {style:'color:green'}, [
						new Node('strong', $MUI('Rappelé le') + ' : '),
						date.format('his') == '000000' ? date.format('d/m/Y') : date.format('d/m/Y à h\\hi')
					]);	
				}
				
				node.appendChild(li);
			}
			
			return node;
		});
	
		table.addFilters(['User', 'Contact'], function(e, cel, data){	
			cel.setStyle('text-align:left;');
			return e;
		});	
					
		table.on('open', function(evt, data){
			System.CRM.Client.Call.open(data);
		});
		
		table.on('remove', function(evt, data){				
			System.CRM.Client.Call.remove(data, win.boxCreate());
		});
				
		panel.appendChild(table);
		
		table.load();
		
		return panel;
	},
/**
 * System.CRM.Client.createPanelNote() -> Panel
 **/	
	createPanelNote:function(win){
		
		var panel = new Panel();
		
		var client = 	win.getData();		
		//
		// Media
		//
		
		var h4 = 		new Node('h4', $MUI('Gestion des notes'));
		
		panel.appendChild(h4);
		//
		//
		//
		var section =	new Node('div');
		panel.appendChild(section);
		
		
		var array = 	win.forms.Medias ? win.forms.Medias : [];
		var oArray =	client.Medias ? client.Medias : [];
		
		for(var i = 0; i < oArray.length; i++){
			var data = oArray[i];
			if(data.Type == 'multimedia') continue;
						
			var current = {
				Media_ID:	win.getData().Client_ID == 0 ? 0 : data.Media_ID
			};
			
			var button = new System.CRM.Client.Note({
				text:		data.Title,
				subText:	data.Description || ''
			});
			button.it = array.length;
									
			current.Title = 			button.Title;
			current.Description = 		button.Description;
			current.Type = 				data.Type;
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
						
			new fThread(function(){button.load();});
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Ajouter'), nofill:true});
		add.addClassName('top');
		
		add.on('click', function(){
								
			var data = oArray[i];
			
			var current = {
				Media_ID: 	0,
				Type:		'note'
			};
			
			var button = new System.CRM.Client.Note({
				icon:		'',
				text:		$MUI('Note'),
				subText:	''
			});
			
			button.it = array.length;
									
			current.Title = 			button.Title;
			current.Description = 		button.Description;
			
			button.BtnRemove.on('click', function(){
				section.removeChild(this);
				array[this.it] = null;
			}.bind(button));
			
			section.appendChild(button);
			array.push(current);
			
			try	{
				win.Panel.PanelSwip.ScrollBar.refresh();
				win.Panel.PanelSwip.ScrollBar.scrollTo(button);
			} catch(err) {}
			
			button.load();
		});
				
		h4.appendChild(add);
		
		return panel;
	},
/**
 * System.CRM.Client.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Company.Value() == '') {
			win.Flag.setText($MUI('Veuillez saisir un nom pour votre client'));
			win.Flag.show(forms.Company);
			return true;
		}
		
		if(win.forms.Email.Value() != '' && !win.forms.Email.Value().isMail()){
			win.Flag.setText($MUI('L\'adresse <b>e-mail</b> saisie n\'est pas valide')+' !').setType(FLAG.RIGHT).show(win.forms.Email);
			return true;
		};
		
		var client =	win.forms.save(win.getData());
		
		var evt = new StopEvent(win);
		$S.fire('crm.client:open.submit', evt);
		if(evt.stopped) return;
		
		try{
			win.Panel.Progress.show();
		}catch(er){
			try{win.ActiveProgress();}catch(er){}	
		}
		
		win.getData().commit(function(){
			
			$S.fire('crm.client:open.submit.complete', win);
			
			var splite = new SpliteIcon($MUI('Fiche correctement enregistré'));
			splite.setIcon('filesave-ok-48');
			
			var box = win.createBox();
			box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
			
			win.BtnMedias.show();
			win.BtnCalls.show();
			win.BtnContacts.show();
			win.BtnEvents.show();
			win.BtnNotes.show();
				
		});
		
		return this;
	},
/**
 *
 **/	
	createMultipleOtherField:function(win, options){
		var client = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		var table = 		new TableData();
		win.forms[options.field] =	{};
		
		win.forms.addFilters(options.field, function(){
			var a  = {};
			Object.setObject(a, this[options.field]);
			return a;			
		});
		
		for(var key in client[options.field]){
			if(client[options.field][key] == '') continue;
			
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
					
				case 'sizeofcompany':
						var select = win.forms[options.field][key] = new Select();
						select.setData([
							{value:'0', text:'0'},
							{value:'0-9', text:'0-9'},
							{value:'10-19', text:'10-19'},
							{value:'20-49', text:'20-49'},
							{value:'50-249', text:'50-249'},
							{value:'250 et plus', text:'250 et plus'}
						]);
						
						select.Input.readOnly = false;
						
						select.Input.on('change', function(){
							this.Value(this.Input.Value());
						}.bind(this));
						
						break;	
			}
			
			win.forms[options.field][key].Value(client[options.field][key]);
			
			if(System.CRM.Client.LabelsOther[key]){//label exist
				table.addHead($MUI(System.CRM.Client.LabelsOther[key])).addCel(win.forms[options.field][key]).addRow();
			}			
		}
				
		html.appendChild(table);
		//
		// Ajout du client
		//
		var add = new SimpleMenu({icon:'add-element', text:options.label, nofill:true});
		add.addClassName('menu-client bottom');
		
		for(var key in System.CRM.Client.LabelsOther){
						
			if(Object.isElement(client[options.field][key])) {
				continue;
			}
			
			var le = new LineElement({text:$MUI(System.CRM.Client.LabelsOther[key])});
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
					
					case 'sizeofcompany':
						var select = win.forms[options.field][this.name] = new Select();
						select.setData([
							{value:'0', text:'0'},
							{value:'0-9', text:'0-9'},
							{value:'10-19', text:'10-19'},
							{value:'20-49', text:'20-49'},
							{value:'50-249', text:'50-249'},
							{value:'250 et plus', text:'250 et plus'}
						]);
						
						select.Input.readOnly = false;
						
						select.Input.on('change', function(){
							this.Value(this.Input.Value());
						}.bind(this));
						
						break;
						
				}
								
				//win.forms[options.field][this.name] = new Input({type:'text', maxLength:20});
				table.addHead($MUI(System.CRM.Client.LabelsOther[this.name])).addCel(win.forms[options.field][this.name]).addRow();
				
				win.Panel.PanelSwip.ScrollBar.refresh();
				win.Panel.PanelSwip.ScrollBar.scrollTo(table);
			});
		}
				
		html.appendChild(add);
	},
/**
 *
 **/	
	createMultipleWebField:function(win, options){
		var client = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		var table = 		new TableData();
		win.forms[options.field] =	[];
		
		win.forms.addFilters(options.field, function(){
			var a  = [];
			
			Object.setObject(a, this[options.field]);
			return a;			
		});
		
		for(var i = 0; i < client[options.field].length; i++){
			if(client[options.field][i] == '') continue;
			
			var input = new InputButton({
				type:		'text', 
				sync:		true,
				value:		client[options.field][i], 
				maxLength:	255,
				icon:		'search'
			});
			
			input.SimpleButton.on('click', function(){
				if(this.Value() != ''){
					$S.open('http://' + this.Value().replace('http://', ''), this.Value());
				}
			}.bind(input));
			
			win.forms[options.field].push(input);
			
			table.addHead(' ').addCel(input).addRow();
		}
				
		html.appendChild(table);
		//
		// Ajout du client
		//
		var add = new SimpleButton({icon:'add-element', text:options.label, nofill:true});
				
		add.on('click', function(){
				
			var input = new InputButton({type:'text', maxLength:255, sync: true, icon: 'search-client'});
			
			input.SimpleButton.on('click', function(){
				if(this.Value() != ''){
					$S.open('http://' + this.Value().replace('http://', ''), this.Value());
				}
			}.bind(input));
			
			win.forms[options.field].push(input);
			table.addHead(' ').addCel(input).addRow();
			
			win.Panel.PanelSwip.ScrollBar.refresh();
			win.Panel.PanelSwip.ScrollBar.scrollTo(table);
		});
				
		html.appendChild(add);
	},
/**
 *
 **/	
	openFilterCategory: function(){
		
		var win = $WR.getByName('crm');
		var forms = {};
		//
		//
		//
		forms.Category = new Select();
		forms.Category.setData(System.CRM.getCategories());
		forms.Category.Value('all');
		forms.Category.css('width', 280);
		
		if(!Object.isUndefined(this.NavBar.CurrentFilter.Category)){
			forms.Category.Value(this.NavBar.CurrentFilter.Category);
		}
		//
		//
		//		
		var panel = win.Panel;
		
		panel.clearSwipAll();
		panel.PanelSwip.footer.removeChilds();
		
		win.Panel.Open(true, 300);
		
		panel.PanelSwip.Body().appendChild(new Node('h4', $MUI('Filtrer par categorie')));
		
		var table = new TableData();
		table.addClassName('liquid');
		table.addCel($MUI('Categorie') + ' : ', {style:'font-weight:bold'}).addRow();
		table.addCel(forms.Category).addRow();
				
		
		panel.PanelSwip.Body().appendChild(table);
		
		var submit = 	new SimpleButton({text:$MUI('Rechercher')});
		submit.on('click', function(){
			this.NavBar.CurrentFilter = {};
			this.NavBar.getClauses().page = 0;
			
			this.NavBar.CurrentFilter.Category = forms.Category.Value() == 'all' ? '' : forms.Category.Value();
			
			this.load();
			
		}.bind(this));
		
		panel.PanelSwip.footer.appendChild(submit);
				
		return win;
		
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
			
			this.NavBar.CurrentFilter.startRecall = 	forms.Date_Start.getDate().format('Y-m-d') + ' 00:00:00';
			this.NavBar.CurrentFilter.endRecall = 		forms.Date_End.getDate().format('Y-m-d') + ' 23:59:59';
			
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
			
		});
		//
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
 *
 **/	
	openFilterUncall: function(){
		
		var win = $WR.getByName('crm');
		this.NavBar.CurrentFilter = {};
		this.NavBar.getClauses().page = 0;
			
		this.NavBar.CurrentFilter.uncall = true;
			
		this.load();
				
		return win;
		
	},
/**
 * System.CRM.Client.listing(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	listing:function(win){
		var panel = win.Panel;
		
		if(!this.NavBar){
			
			var options = {
				range1:			50,
				range2:			100,
				range3:			300,
				progress:		false,
				emtpy:			$MUI('Désolé. Aucun client ne correspond à votre recherche')
			};
			
			this.NavBar = new NavBar(options);
			
			this.NavBar.on('change', this.load.bind(this));
			this.NavBar.setMaxLength(0);
			
			this.NavBar.AdvancedFilter = new Select();
			this.NavBar.AdvancedFilter.setData(System.CRM.Client.AdvancedFilters);
			this.NavBar.AdvancedFilter.setStyle('float:right;width:200px');
			
			this.NavBar.AdvancedFilter.on('change', function(){
								
				if(this.NavBar.AdvancedFilter.Value() == ''){
					this.NavBar.CurrentFilter = {};
					this.NavBar.getClauses().page = 0;
				
					this.load();
					win.Panel.Open(false);
				}else{
					System.CRM.Client['openFilter' + this.NavBar.AdvancedFilter.Value()].call(System.CRM.Client);
				}
				
			}.bind(this));
			//
			//
			//
			this.NavBar.BtnPrint = new Node('span', {className:'action icon icon-print'}, $MUI('Imprimer'));
			
			this.NavBar.BtnPrint.on('click',function(){
				try{	
					var obj = this.getObjectParameters();
					System.CRM.Client.PrintList.open(obj.clauses, obj.options, $WR.getByName('crm').createBox());
					
				}catch(er){$S.trace(er)}				
			}.bind(this));
			
			this.NavBar.appendChild(this.NavBar.BtnPrint);
			//
			//
			//
			this.NavBar.BtnExport = new Node('span', {className:'action icon icon-export'}, $MUI('Exporter'));
			
			this.NavBar.BtnExport.on('click',function(){
				try{	
									
					var obj = this.getObjectParameters();
					System.CRM.Client.Export.open(obj.clauses, obj.options, $WR.getByName('crm').createBox());
				}catch(er){$S.trace(er)}
				
				
			}.bind(this))
			
			this.NavBar.appendChild(this.NavBar.BtnExport);
			//
			//
			//
			this.NavBar.BtnSend = new Node('span', {className:'action icon icon-mail'}, $MUI('Envoyer e-mail'));
			
			this.NavBar.BtnSend.on('click',function(){
				try{	
					var obj = this.getObjectParameters();										
					System.CRM.Client.Send.open(obj.clauses, obj.options, $WR.getByName('crm').createBox());
				}catch(er){$S.trace(er)}				
			}.bind(this))
			
			this.NavBar.appendChild(this.NavBar.BtnSend);
			//
			// TABLE
			//				
			this.Table = new SimpleTable(options);
			this.Table.clauses = this.NavBar.getClauses();
					
			this.Table.addHeader({
				Action:			{title:' ', type:'action', style:'text-align:center; width:120px;', sort:false},
				Company:		{title:$MUI('Société'), style:'text-align:center;'},
				Address:		{title:$MUI('Adresse'), style:'text-align:center', width:110},
				CP:				{title:$MUI('CP'), style:'text-align:center', width:110},
				City:			{title:$MUI('Ville'), style:'text-align:center', width:110},
				Phone:			{title:$MUI('Info. contact'), style:'text-align:center', width:200, sort:false},
				Call:			{title:$MUI('Appel & RDV'), style:'text-align:center', width:280, sort:false},
				OpenCall:		{title:$MUI(' '), style:'text-align:center', width:20, sort:false}
			});	
			
			this.Table.addFilters('Action', function(e, cel, data){
				e.remove.css('margin-right', 5);
				
				cel.css('text-align', 'left');
				
				if(data.Email != ''){
					var button = new SimpleButton({icon:'mail', type:'mini'});
					e.appendChild(button);
					
					button.mail = data.Email;
					
					button.on('click', function(evt){
						evt.stop();
						
						if(System.Opener){
							System.Opener.open('mailto', this.mail);
						}else{
							window.location = 'mailto:' + this.mail;
						}
					});
				}
				
				if(data.Phone != ''){
					var button = new SimpleButton({icon:'phone', type:'mini'});
					e.appendChild(button);
					button.phone = data.Phone;
					button.on('click', function(evt){
						evt.stop();
						
						if(System.Opener){
							System.Opener.open('tel', this.phone);
						}else{
							window.location = 'tel:' + this.phone;
						}
					});
				}				
				
				var location  = [data.Address, data.City, data.CP, data.Country].without('', ' ').join(', ').trim();
				
				if(location != 'FRANCE'){
					
					
					if(System.Opener){
						
						var button  = new SimpleButton({icon:'map', type:'mini'});
						button.data = data;
						
						e.appendChild(button);
												
						button.on('click', function(){
							
							System.Opener.open('map', {
								
								title:			this.data.Company,
								
								location: {
									Address:	this.data.Address,
									CP:			this.data.CP,
									City:		this.data.City,
									Country:	this.data.Country
								}
							});
							
						});
					}
				}
												
				return e;
			});
			
			this.Table.addFilters('Company', function(e, cel, data){
				
				cel.css('text-align', 'left');
				
				var node = 	new Node('h5', {style:'margin:0px'}, e);
				var p = 	new Node('p', {style:'font-weight:normal; font-size:11px;margin:0'}, data.Comment.evalJSON().activity);
				
				node.appendChild(p);
						
				return node;
			});
			
			this.Table.addFilters('Phone', function(e, cel, data){
				cel.css('text-align','left');
				
				var node = new Node('ul', {style:'padding-left:15px'});
				
				if(data.Phone != ''){
					var li = new Node('li', [
						new Node('strong', $MUI('N° Tel') + ' : '),
						System.CRM.formatPhone(data.Phone)
					]);
					
					node.appendChild(li);
				}
				
				if(data.Fax != ''){
					var li = new Node('li', [
						new Node('strong', $MUI('N° Fax') + ' : '),
						System.CRM.formatPhone(data.Fax)
					]);
					
					node.appendChild(li);
				}
				
				if(data.Email != ''){
					var li = new Node('li', [
						new Node('strong', $MUI('E-mail') + ' : '),
						data.Email
					]);
					
					node.appendChild(li);
				}
				
				return node;	
			});
			
			this.Table.addFilters(['CP', 'City'], function(e, cel, data){
				cel.hide();
				return '';
			});
			
			this.Table.addFilters('Address', function(e, cel, data){
				cel.colSpan = 3;
				cel.css('text-align', 'left');
				
				var node = 			new Node('h5', {style:'margin:0px'});
				node.innerHTML = 	e.replace(/\n/, '<br />');
				
				var p = 			new Node('p', {style:'font-weight:normal; font-size:11px;margin:0'}, data.CP + ' ' + data.City + ' ' + data.Country);
				
				node.appendChild(p);
				
				return node;
			});
			
			this.Table.addFilters('Call', function(e, cel, data){
				cel.css('text-align', 'left');
				var node = new Node('ul', {style:'padding-left:15px'});
				var call = new System.CRM.Client.Call(e);
				
				if(e === false){
					return ' - ' + $MUI('Jamais') + ' - ';
				}
				
				if (call.Date_Call != null){
					var li = new Node('li', [
						new Node('strong', $MUI('Le') + ' : '),
						call.Date_Call.format('d/m/Y') + ' ' + $MUI('à') + ' ' +call.Date_Call.format('h\\hi')
					]);
					
					node.appendChild(li);
				}
				
				var li = new Node('li', [
					new Node('strong', $MUI('Conclusion') + ' : '),
					(function(e){
						switch(+e){
							default: return e;
							case 1: return $MUI('NRP');
							case 2: return $MUI('NRA');
							case 3: return $MUI('CTINF');
							case 4: return $MUI('PROJ');
						}	
					})(call.Conclusion)
				]);
				node.appendChild(li);
				
				if (call.Date_Recall != null){
					var li = new Node('li', [
						new Node('strong', $MUI('Prochain appel') + ' : '),
						call.Date_Recall.format('d/m/Y')
					]);
					
					node.appendChild(li);
				} 
				
				if (data.Event){
					var li = new Node('li', [
						new Node('strong', $MUI('Prochain RDV') + ' : '),
						data.Event.Date_Start.toDate().format('d/m/Y')
					]);
					
					node.appendChild(li);
				} 
				
				return node;
			});
			
			this.Table.addFilters('OpenCall', function(e, cel, data){
				var button = new SimpleButton({
					icon:'crm-call',
					type:'mini'
				});
				
				if(e === false){
					
					button.on('click', function(){
						System.CRM.Client.Call.open({
							Client_ID: data.Client_ID
						});
					});
					
				}else{
					button.on('click', function(){
						System.CRM.Client.Call.GetAndOpen(data.Call.Call_ID);
					});	
				}
				
				return button;
			});
			
			this.Table.on('open', function(evt, data){
				System.CRM.Client.open(data);
			});
			
			this.Table.on('remove', function(evt, data){				
				System.CRM.Client.remove(data, win.createBox());
			});
					
			this.Table.on('complete', function(obj){
				System.CRM.Client.NavBar.setMaxLength(0);
				System.CRM.Client.NavBar.setMaxLength(obj.maxLength);			
				
				//panel.PanelBody.refresh();
				
				var win =	$WR.getByName('crm');
				
				win.Panel.BtnClient.setTag(obj.maxLength);
				
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
			
			this.Table.empty = new Node('H2', {className:'notfound'}, $MUI('Aucun client n\'est enregistré ou ne correspond à votre recherche')+'.' );
			this.Table.empty.hide();
			
			this.NavBar.appendChild(this.NavBar.AdvancedFilter);
		}
		
		if(win.CurrentName != 'client'){
			this.NavBar.getClauses().page = 0;
			this.NavBar.AdvancedFilter.Value('');
			this.NavBar.CurrentFilter = {};
		}
		
		System.CRM.setCurrent('client');
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
				
		//permet d'ajouter un element en dehors de la scrollbare défini par jPanel
		panel.PanelBody.addTable(this.Table);
		
		this.load();		
	},
/**
 *
 **/	
	getObjectParameters:function(){
		var clauses = this.NavBar.getClauses();
				
		clauses.where = $WR.getByName('crm').Panel.InputCompleter.Text();
		
		var options = {
			//category:		this.NavBar.Category.Value() == 'all' ? '' : this.NavBar.Category.Value(),
			clients:		this.Table.getDataChecked(),
			lastCall:		true,
			nextEvent:		true
		};
		
		if(this.NavBar.AdvancedFilter.Value() != ''){
			Object.extend(options, this.NavBar.CurrentFilter);			
		}
		
		return {clauses:clauses, options:options};
	},
/**
 *
 **/	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		clauses.where = $WR.getByName('crm').Panel.InputCompleter.Text();
		
		var options = {
			//category:		this.NavBar.Category.Value() == 'all' ? '' : this.NavBar.Category.Value(),
			lastCall:		true,
			nextEvent:		true
		};
		
		if(this.NavBar.AdvancedFilter.Value() != ''){
			Object.extend(options, this.NavBar.CurrentFilter);			
		}
		
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 * System.CRM.Client.load() -> void
 *
 * Cette méthode charge les données du tableau.
 **/	
	load:function(){
		var win = $WR.getByName('crm');
		
		win.Panel.ProgressBar.show();
		win.createBubble().hide();
		
		this.Table.empty.hide();
		this.Table.setParameters('cmd=crm.client.list&' + this.getParameters());
		win.Panel.InputCompleter.setParameters('cmd=crm.client.list&' + this.getParameters());
		
		
		this.Table.load();		
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
 * System.CRM.Client.remove(data, box) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(data, box){
		data = new System.CRM.Client(data);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le client') +' ? ', $MUI('Client') +  ' : ' + data.Company);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		box.setTheme('flat liquid black');
		box.a(splite).setType().show();
		
		$S.fire('crm.client:remove.open', box);
		
		box.reset(function(){
			box.setTheme();	
		});
						
		box.submit({
			text:$MUI('Supprimer le client'),
			
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('crm.client:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				data.remove(function(){
					box.hide();
						
					$S.fire('crm.client:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le client a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.a(splite).setType('CLOSE').Timer(5).show();
					
					box.reset(function(){
						box.setTheme();	
					});
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});

System.CRM.Client.Media =  Class.from(AppButton);
System.CRM.Client.Media.ID  = 0;

System.CRM.Client.Media.prototype = {
	className:'wobject market-button crm client-media show',
	
	initialize:function(obj){
		var self = this;
		//
		//
		//
		this.Title = new InputMagic({type:'text', maxLength:100, value:obj.text});
		this.Title.addClassName('icon-edit-element');
		this.Title.Large(true);
		//
		//
		//
		this.Link = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mystore.product.import'
		});
		
		this.Link.on('complete', function(file){
			self.Link.Value(file);
			self.setIcon(file);
		});
		
		if(obj.icon){
			this.Link.Value(obj.icon);
		}
		
		this.Link.DropFile.addDropArea(this);
		this.Link.DropFile.addDragArea(this);
		
		this.Link.SimpleButton.setText('');
		this.Link.SimpleButton.setIcon('import-element');
		this.Link.SimpleButton.css('width', 'auto');
		this.Link.SimpleButton.css('right', '63px');
		
		this.BtnFileManager = new SimpleButton({icon:'browse-element'});
		this.BtnFileManager.css('right', '33px');
		this.BtnFileManager.css('width', 'auto');
		this.Link.DropFile.appendChild(this.BtnFileManager);
		
		this.BtnFileManager.on('click', function(){
			System.FileManager.join(null, function(file){
				self.Link.Value(file.uri);
				self.setIcon(file.uri);
			});
		});
		//
		//
		//
		this.BtnRemove = new SimpleButton({icon:'remove-element'});
		this.BtnRemove.addClassName('remove');
		this.BtnRemove.css('right', '3px');
		this.BtnRemove.css('width', 'auto');
		
		this.Link.DropFile.appendChild(this.BtnRemove);
		
		this.SpanText.innerHTML = '';
		this.SpanText.appendChild(this.Title);
		this.appendChild(this.Link);
		//
		//
		//
		this.addClassName('have-textarea');
		this.Description = new Node('div', {className:'editable-area', tabIndex:System.CRM.Client.Media.ID});
		this.Description.innerHTML = obj.subText == '' ? ('<p>' + $MUI('Saisissez votre texte') + '...</p>') : obj.subText;
		this.Description.id = 'client-media-'+System.CRM.Client.Media.ID;
		
		this.Description.on('focus', function(){
			self.addClassName('focus');
			if(this.innerHTML.trim() == '<p>' + $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
			
			if(this.innerHTML.trim() == $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
		});
		
		this.Description.on('blur', function(){
			self.removeClassName('focus');
			if(this.innerHTML.trim() == ''){
				this.innerHTML = '<p>' + $MUI('Saisissez votre texte') + '...</p>';	
			}
		});
		
		this.Description.Value = function(){
			if(this.innerHTML.trim() == '<p>' + $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
			
			if(this.innerHTML.trim() == $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
			
			return this.innerHTML;
		};
				
		this.appendChild(this.Description);
		
		System.CRM.Client.Media.ID++;
	},
	
	load:function(){
		
		this.tinyMCE = tinymce.init({
			selector: 	'#' + this.Description.id,
			inline: 	true,
			language: 	'fr',
        	toolbar_items_size:	'small',
			menubar:	false,
			extended_valid_elements:	'article[*],aside[*],audio[*],canvas[*],command[*],datalist[*],details[*],embed[*],figcaption[*],figure[*],footer[*],header[*],hgroup[*],keygen[*],mark[*],meter[*],nav[*],output[*],progress[*],section[*],source[*],summary,time[*],video[*],wbr',
			
			plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime media table contextmenu paste"
			],
			toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
		});
			
	}
};

System.CRM.Client.Note =  Class.from(AppButton);

System.CRM.Client.Note.prototype = {
	className:'wobject market-button client-media media-note show',
	
	initialize:function(obj){
		var self = this;
		//
		//
		//
		this.Title = new InputMagic({type:'text', maxLength:100, value:obj.text});
		this.Title.addClassName('icon-edit-element');
		this.Title.Large(true);
		//
		//
		//
		this.BtnRemove = new SimpleButton({icon:'remove-element'});
		this.BtnRemove.addClassName('remove');
		
		this.appendChild(this.BtnRemove);
		
		this.SpanText.innerHTML = '';
		this.SpanText.appendChild(this.Title);
		//
		//
		//
		this.addClassName('have-textarea');
		this.Description = new Node('div', {className:'editable-area', tabIndex:System.CRM.Client.Media.ID});
		this.Description.innerHTML = obj.subText == '' ? ('<p>' + $MUI('Saisissez votre texte') + '...</p>') : obj.subText;
		this.Description.id = 'client-media-'+System.CRM.Client.Media.ID;
		
		this.Description.on('focus', function(){
			self.addClassName('focus');
			
			if(this.innerHTML.trim() == '<p>' + $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
			
			if(this.innerHTML.trim() == $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
		});
		
		this.Description.on('blur', function(){
			self.removeClassName('focus');
			
			if(this.innerHTML.trim() == ''){
				this.innerHTML = '<p>' + $MUI('Saisissez votre texte') + '...</p>';	
			}
		});
		
		this.Description.Value = function(){
			if(this.innerHTML.trim() == '<p>' + $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
			
			if(this.innerHTML.trim() == $MUI('Saisissez votre texte') + '...</p>'){
				this.innerHTML = '';	
			}
			
			return this.innerHTML;
		};
				
		this.appendChild(this.Description);
		
		System.CRM.Client.Media.ID++;
	},
	
	load:function(){
		
		this.tinyMCE = tinymce.init({
			selector: 	'#' + this.Description.id,
			inline: 	true,
			language: 	'fr',
        	toolbar_items_size:	'small',
			menubar:	false,
			extended_valid_elements:	'article[*],aside[*],audio[*],canvas[*],command[*],datalist[*],details[*],embed[*],figcaption[*],figure[*],footer[*],header[*],hgroup[*],keygen[*],mark[*],meter[*],nav[*],output[*],progress[*],section[*],source[*],summary,time[*],video[*],wbr',
			
			plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime media table contextmenu paste"
			],
			toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
		});
			
	}
};


System.CRM.Client.initialize();