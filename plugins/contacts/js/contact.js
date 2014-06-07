/** section: Contact
 * Contact
 *
 * Cet espace de nom gère l'extension Contact.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : appsme.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Contact = Class.createAjax({
/**
 * Contact#Contact_ID -> Number
 **/
	Contact_ID:		0,  
/**
 * Contact#Civility -> String
 **/
	Civility:			'',
/**
 * Contact#Avatar -> String
 **/
	Avatar:			'',
/**
 * Contact#FirstName -> String
 **/
	FirstName:			'',
/**
 * Contact#Name -> String
 **/	
	Name:				'', 
/**
 * Contact#Company -> String
 **/	
	Company:			'', 
/**
 * Contact#Address -> String
 **/	  	  	 
	Address:			'',
/**
 * Contact#CP -> String
 **/	  	 
	CP:				'',	  	 
/**
 * Contact#City -> String
 **/ 	 
	City:				'',
/**
 * Contact#County -> String
 **/ 	 
	County:			'',
/**
 * Contact#State -> String
 **/ 	 
	State:				'',
/**
 * Contact#Country -> String
 **/ 	 
	Country:			'',
/**
 * Contact#Phone -> String
 **/  	  	 
	Phone:				'',	
/**
 * Contact#Email -> String
 **/	  	  	 
	Email:				'', 
/**
 * Contact#Web -> String
 **/	  	  	 
	Web:				'',
/**
 * Contact#Comment -> String
 **/	  	  	 
	Comment:			'',
/**
 * Contact#Categories -> String
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
		
		if(this.Email == ''){
			this.Email = {};	
		}
		
		if(this.Phone == ''){
			this.Phone = {};	
		}
		
		if(this.Comment == ''){
			this.Comment = {};	
		}
		
		
		if(this.Categories == ''){
			this.Categories = ['all'];	
		}
		
	},
/**
 * System.Contact#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('contact.commit', {
			
			parameters: 'Contact=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				this.oMeta = Object.toJSON(this.Meta);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.Contact.delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback, error){
		$S.exec('contact.delete',{
			parameters: 'Contact=' + this.toJSON(),
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
		if(!Object.isUndefined(this.Phone.other) && this.Phone.other != ''){
			return true;	
		}
		
		if(!Object.isUndefined(this.Phone.office) && this.Phone.office != ''){
			return true;	
		}
		
		if(!Object.isUndefined(this.Phone.mobile) && this.Phone.mobile != ''){
			return true;	
		}
		
		if(!Object.isUndefined(this.Phone.home) && this.Phone.home != ''){
			return true;	
		}
		
		return false;
	},
	
	haveMail:function(){
		if(!Object.isUndefined(this.Email.other) && this.Email.other != ''){
			return true;	
		}
		
		if(!Object.isUndefined(this.Email.office) && this.Email.office != ''){
			return true;	
		}
		
		if(!Object.isUndefined(this.Email.home) && this.Email.home != ''){
			return true;	
		}
		
		return false;
	}
});

Object.extend(System.Contact, {
	Labels: {
		other:	'Autre',
		office: 'Bureau',
		home:	'Domicile',
		mobile:	'Portable',
		fax:	'Fax'
	},
	
	LabelsOther: {
		remarque:	'Remarques',
		function: 	'Fonction',
		service:	'Service',
		sector:		'Secteur'
	},
/**
 * Contact.initialize()
 **/
	initialize: function(){		
		$S.on('system:startinterface', this.onStartInterface.bind(this));
		
		
		System.observe('contact:open.submit.complete', function(){
			var win = $WR.getByName('contacts');
			
			if(win){
				System.Contact.load();
			}
		});
		
		System.observe('contact:remove.submit.complete', function(){
			var win = $WR.getByName('contacts');
			
			if(win){
				System.Contact.load();
			}
		});
				
	},
/**
 * Contact.onStartInterface() -> void
 **/
 	onStartInterface: function(){
		this.Menu = $S.DropMenu.addMenu($MUI('Contacts'), {
			icon:		'contacts', 
			appName:	'Contacts'
		}).observe('click', function(){this.openUI()}.bind(this));	
		
		this.addCategory($MUI('Toutes catégories'), 'all');
	},
	
	openFromSearch: function(data){
		this.open(data, 'window');
	},
/**
 * Contact.open() -> Window
 **/	
	openUI:function(bool){
		var win = $WR.unique('contacts', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) {
			if( this.currentData){
				this.open($WR.getByName('contacts'), this.currentData);
				this.currentData = false;
			}
			
			return $WR.getByName('contacts');
		}
		
		this.winList = win;
		
		win.forms = {};
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('contacts');
		win.addClassName('contact');
		//
		// TabControl
		//
		//win.createTabControl({offset:22});
		win.appendChild(this.createPanel(win));
		//win.TabControl.addSimpleMenu(new SimpleMenu({text:$MUI('Explorer'), icon:'folder'}).on('click', this.explorer.bind(this)));
				
		$Body.appendChild(win);
		
		$S.fire('contacts:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
				
		return win;
	},
/**
 * Contact.createPanel(win) -> Panel
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			'Contacts',
			placeholder:	$MUI('Rechercher un contact'),
			style:			'width:900px',
			parameters:		'cmd=contact.list',
			icon:			'contact-32',
			menu:			false
		});
		
		win.Panel = panel;
		var self =	this;
		
		panel.addClassName('contact');
		panel.setTheme('white flat');
		panel.Progress.addClassName('splashscreen');
		
		panel.BtnAddContact = new SimpleButton({icon:'add-contact', text:$MUI('Créer contact')})
		panel.BtnAddContact.on('click', function(){
			System.Contact.open();
		});
		
		panel.BtnImport = new SimpleButton({icon:'import-contact', text:$MUI('Importer')})
		panel.BtnImport.on('click', function(){
			System.Contact.Import.open(win);
		});
		
		panel.BtnExport = new SimpleButton({icon:'export-contact', text:$MUI('Exporter')})
		panel.BtnExport.on('click', function(){
			System.Contact.Export.open(win.createBox());
		});
		
		panel.Header().appendChild(panel.BtnAddContact);
		
		if($U().getRight() != 3){
			panel.Header().appendChild(panel.BtnImport);
			panel.Header().appendChild(panel.BtnExport);
		}
		//
		//
		//		
		panel.InputCompleter.on('draw', function(line){
			this.Hidden(true);
		});
		
		panel.InputCompleter.on('complete', function(array){
			panel.clearBody();
			this.draw(win, array);
		}.bind(this));
		
		panel.InputCompleter.on('keyup', function(){
			if(panel.InputCompleter.Text() == ''){
				this.listing(win);
			}
		}.bind(this));
		
		this.listing(win);
				
		return panel;
	},
/**
 * System.Contact.setCurrent() -> void
 **/	
	setCurrent:function(currentName){
		var win = $WR.getByName('contact');
		var panel = win.Panel;
		
		panel.Header().select('.selected').invoke('removeClassName', 'selected');
		panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
		
		panel.clearAll();
		win.CurrentName = name;
				
		panel.Open(false);
		win.destroyForm();		
	},
/**
 * System.Contact.open(o) -> Window
 **/	
	open:function(o, mode){
		if(mode == 'window' || !$WR.getByName('contacts')){
			return this.openInWindow(o);
		}
		
		return this.openInPanel(o);
	},
/**
 * System.Contact.openInWindow(o) -> Window
 **/	
	openInWindow:function(contact){
		
		var options = {
			instance:	'crm.contact',
			type:		'contact',
			icon:		'contacts'
		};
				
		var win = $WR.unique(options.instance, {
			autoclose:	true,
			action: function(){
				this.open(contact);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		win.options = options;
		//overide
		//win.overideClose({
		//	submit:this.submit.bind(this), 
		//	change:this.checkChange.bind(this),
		//	close: function(){}.bind(this)
		//});
				
		var self = this;
		//création de l'objet forms
		var forms = win.createForm();		
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.setData(contact = new System.Contact(contact));
		
		$Body.appendChild(win);	
		
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
		
		var button = new System.Contact.AppButton({
			icon:		contact.Avatar, 
			text:		(contact.Name + ' ' + contact.FirstName).trim() == '' ? $MUI('Nouveau contact') : (contact.Name + ' ' + contact.FirstName).trim(),
			subTitle:	contact.Company,
			overable:	false
		});
		
		button.addClassName('taller');
		
		var panel;
		win.TabControl.addPanel($MUI('Informations'), panel = System.Contact.createPanelInfos(win, button).addClassName('html-node'));
		win.BtnMedia = win.TabControl.addPanel($MUI('Média'), System.Contact.createPanelMedia(win).addClassName('html-node'));
		//win.TabControl.addSection($MUI('Actions'));
		
		win.footer.appendChilds([forms.submit, forms.close]);
		panel.top(button);
		
		win.resizeTo(550, 600); 
							
		//event
		forms.submit.on('click', function(){
			this.submit(win);
		}.bind(this));
		
		forms.close.on('click', function(){
			win.close();
		}.bind(this));	
		
		$S.fire('contact:open', win);
		
		win.forms.Categories.setData(System.Contact.getCategories());
		
		if(win.getData().Contact_ID == 0){
			win.BtnMedia.hide();
		}
		
		return win;	
	},
/**
 * System.Contact.openInPanel(o) -> Window
 **/
	openInPanel:function(contact){
		
		var win = $WR.getByName('contacts');
		
		try{
			
			win.setData(contact = new System.Contact(contact));
			win.forms = win.createForm();
					
			var panel = win.Panel;
			
			panel.clearSwipAll();
					
			win.Panel.Open(true, 650);
			
			var button = new System.Contact.AppButton({
				icon:		contact.Avatar, 
				text:		(contact.Name + ' ' + contact.FirstName).trim() == '' ? $MUI('Nouveau contact') : (contact.Name + ' ' + contact.FirstName).trim(),
				subTitle:	contact.Company
			});
			
			panel.PanelSwip.Body().appendChild(button);
			panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win, button));
			win.BtnMedia = panel.PanelSwip.addPanel($MUI('Média'), this.createPanelMedia(win));
			//
			//
			//
			var submit = 	new SimpleButton({text:$MUI('Enregistrer')});
			submit.on('click', function(){
				System.Contact.submit(win);
			});
			
			panel.PanelSwip.footer.removeChilds();
			
			panel.PanelSwip.footer.appendChilds([
				submit
			]);
			
			if(contact.Contact_ID == 0){
				win.BtnMedia.hide();
			}	
			
			$S.fire('contact:open', win);
			
			win.forms.Categories.setData(System.Contact.getCategories());
			
		}catch(er){$S.trace(er)}
		
		return win;
	},
/**
 * System.Contact.createPanelInfos(win) -> void
 *
 * Cette méthode ouvre le panneau de l'application.
 **/
	createPanelInfos:function(win, button){
		var panel = new Panel();
		var contact = win.getData();
		//
		// Raison
		//
		win.forms.Company =			new Input({type:'text', value:contact.Company, maxLength:100});
		//
		//
		//
		win.forms.Categories =		new Select({multiple:true});
		win.forms.Categories.Value(contact.Categories);
		
		win.forms.addFilters('Categories', function(){
			var array = [];
			
			this.Categories.Value().each(function(e){
				array.push(e.value);
			});
			return array;
		});
		//
		//
		//
		win.forms.Avatar = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=contact.avatar.import'
		});
		
		win.forms.Avatar.on('complete', function(){
			button.setIcon(this.Value());
		});
		
		win.forms.Avatar.Value(contact.Avatar);
		
		win.forms.Avatar.DropFile.addDropArea(button);
		win.forms.Avatar.DropFile.addDragArea(button);
		//
		// Civility
		//
		win.forms.Civility =			new Select();
		win.forms.Civility.setData([
			{text:'- Choisissez -', value:''},
			{text:'M.', value:'M.'},
			{text:'Mme.', value:'Mme.'},
			{text:'Mlle.', value:'Mlle.'},
		]);
		
		win.forms.Civility.Value(contact.Civility);
		//
		// Nom
		//
		win.forms.Name =			new Input({type:'text', value:contact.Name, maxLength:100});
		win.forms.Name.on('keyup', function(){
			button.setText((win.forms.Name.Value() + ' ' + win.forms.FirstName.Value()).trim());
		});
		//
		// Nom
		//
		win.forms.FirstName =		new Input({type:'text', value:contact.FirstName, maxLength:100});
		win.forms.FirstName.on('keyup', function(){
			button.setText((win.forms.Name.Value() + ' ' + win.forms.FirstName.Value()).trim());
		});
		//
		// Adresse
		//
		win.forms.Address =			new TextArea({value:contact.Address});
		//
		// CP
		//
		win.forms.CP =				new InputCP({value:contact.CP, button:false});
		//
		// Ville
		//
		win.forms.City =			new InputCity({value:contact.City, button:false});
		win.forms.City.linkTo(win.forms.CP);
		//
		// Pays
		//
		win.forms.Country =			new Select({value:contact.Country, button:false});
		win.forms.Country.setData(Countries.toData());
		//
		// Web
		//
		win.forms.Web =				new Input({type:'text', value:contact.Web, maxLength:255});
		//
		// RCS
		//
		win.forms.Remarque =		new TextArea({value:contact.Remarque});
		//
		// Table
		//
		var buttonAddCat = 			new SimpleButton({icon:'add-element', nofill:true, text:$MUI('Catégorie')});
		buttonAddCat.on('click', function(evt){
			System.Contact.openAddCategory(evt, win);
		});
		
		panel.appendChild(new Node('h4', [$MUI('Nom'), buttonAddCat]));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Civilité')).addCel(win.forms.Civility).addRow();
		table.addHead($MUI('Nom')).addCel(win.forms.Name).addRow();
		table.addHead($MUI('Prénom')).addCel(win.forms.FirstName).addRow();
		table.addHead($MUI('Société')).addCel(win.forms.Company).addRow();
		table.addHead($MUI('Catégorie')).addCel(win.forms.Categories).addRow();
		table.addHead($MUI('Photo')).addCel(win.forms.Avatar).addRow();
		
		panel.appendChild(table);	
		//
		// Localisation
		//
		var btnMapView = 		new SimpleButton({icon:'map-contact', text:$MUI('Localiser'), nofill:true});
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
		var btnMapItinerary = 	new SimpleButton({icon:'itinerary-contact', text:$MUI('Itinéraire'), nofill:true});
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
		// Gestion téléphone
		//
		this.createMultipleField(win, {
			field:	'Phone',
			label:	$MUI('Téléphone'),
			node:	panel
		});
		//
		//
		//
		this.createMultipleField(win, {
			field:	'Email',
			label:	$MUI('Courrier électronique'),
			node:	panel
		});
		
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
 *
 **/	
	createPanelMedia:function(win){
		
		win.forms.addFilters('Medias', function(){
			var a  = [];
			Object.setObject(a, this.Medias);
			return a;			
		});
		
		var panel = new Panel();
		
		var contact = 	win.getData();
		var h4 = 		new Node('h4', $MUI('Gestion des médias'));
		
		panel.appendChild(h4);
		//
		//
		//
		var section =	new Node('div');
		panel.appendChild(section);
		
		
		var array = 	win.forms.Medias =	[];
		var oArray =	contact.Medias ? contact.Medias : [];
		
		for(var i = 0; i < oArray.length; i++){
						
			var data = oArray[i];
			
			var current = {
				Media_ID:	win.getData().Contact_ID == 0 ? 0 : data.Media_ID
			};
			
			var button = new System.Contact.Media({
				icon:		data.Link || '',
				text:		data.Title || $MUI('Média') + ' ' + 'N°' + (array.length+1),
				subText:	data.Description || ''
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
						
			new fThread(function(){this.load();}.bind(button));
		}
			
		//
		// Ajout du product
		//
		var add = new SimpleButton({icon:'add-element', text:$MUI('Ajouter'), nofill:true});
		add.addClassName('top');
		
		add.on('click', function(){
								
			var data = oArray[i];
			
			var current = {
				Media_ID: 	0
			};
			
			var button = new System.Contact.Media({
				icon:		'',
				text:		$MUI('Média') + ' ' + 'N°' + (array.length+1),
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
			
			try{
				win.Panel.PanelSwip.ScrollBar.refresh();
				win.Panel.PanelSwip.ScrollBar.scrollTo(button);
			}catch(er){}
			
			new fThread(function(){this.load();}.bind(button));
		});
				
		h4.appendChild(add);
		
		return panel;
	},
/**
 * System.Contact.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if((forms.Name.Value() + ' ' + forms.FirstName.Value()).trim() == '') {
			win.Flag.setText($MUI('Veuillez saisir un nom ou un prénom pour votre contact'));
			win.Flag.show(forms.Name);
			return true;
		}
		
		win.forms.save(win.getData());
				
		var evt = new StopEvent(win);
		$S.fire('contact:open.submit', evt);
		if(evt.stopped) return;
		
		try{
			win.Panel.Progress.show();
		}catch(er){
			try{win.ActiveProgress();}catch(er){}	
		}
		
		win.getData().commit(function(){
			
			$S.fire('contact:open.submit.complete', win);
			
			win.setData(this);			
			win.BtnMedia.show();
			
		});
		
		return this;
	},
/**
 *
 **/	
	createMultipleField:function(win, options){
		var contact = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		var table = 		new TableData();
		win.forms[options.field] =	{};
		
		win.forms.addFilters(options.field, function(){
			var a  = {};
			
			Object.setObject(a, this[options.field]);
			return a;			
		});
		
		for(var key in contact[options.field]){
			if(contact[options.field][key] == '') continue;
			
			if(key == 'fax'){
				win.forms[options.field][key] = new Input({
					type:		'text', 
					value:		contact[options.field][key], 
					maxLength:	20
				});
			}else{
				win.forms[options.field][key] = new InputButton({
					sync:		true,
					type:		'text', 
					value:		contact[options.field][key], 
					maxLength:	options.field == 'Phone' ? 20 : 200, 
					icon: 		options.field == 'Phone' ? 'phone-contact' : 'mail-contact'
				});
				
				win.forms[options.field][key].SimpleButton.on('click', function(){
					
					if(this.Value() != ''){
						if(options.field == 'Phone'){
							System.Opener.open('tel', this.Value());
						}else{
							System.Opener.open('mailto', this.Value());
						}
					}
					
				}.bind(win.forms[options.field][key]));
				
				if(options.field == 'Phone'){
					win.forms[options.field][key].on('change', function(){
						this.Value(this.Value().replace(/[ #\._-]/g, ''))
					});
				}
			}
			
			table.addHead($MUI(System.Contact.Labels[key])).addCel(win.forms[options.field][key]).addRow();
		}
				
		html.appendChild(table);
		//
		// Ajout du contact
		//
		var add = new SimpleMenu({icon:'add-element', text:options.label, nofill:true});
		add.addClassName('menu-contact bottom');
		
		for(var key in System.Contact.Labels){
			if(options.field == 'Email'){
				if(key == 'fax' || key == 'mobile'){
					continue;
				}
			}
						
			if(Object.isElement(contact[options.field][key])) {
				continue;
			}
			
			var le = new LineElement({text:$MUI(System.Contact.Labels[key])});
			add.appendChild(le);
			le.name = key;
			
			le.on('click', function(){
				
				add.removeChild(this);
				
				if(this.name == 'fax'){
					win.forms[options.field][this.name] = new Input({
						type:		'text',
						maxLength:	20
					});
				}else{
					win.forms[options.field][this.name] = new InputButton({
						sync:		true,
						type:		'text',
						maxLength:	options.field == 'Phone' ? 20 : 200, 
						icon: 		options.field == 'Phone' ? 'phone-contact' : 'mail-contact'
					});
					
					win.forms[options.field][this.name].SimpleButton.on('click', function(){
						
						if(this.Value() != ''){
							if(options.field == 'Phone'){
								System.Opener.open('tel', this.Value());
							}else{
								System.Opener.open('mailto', this.Value());
							}
						}
						
					}.bind(win.forms[options.field][this.name]));
					
					if(options.field == 'Phone'){
						win.forms[options.field][this.name].on('change', function(){
							this.Value(this.Value().replace(/[ #\._-]/g, ''))
						});
					}
				}
				
				//win.forms[options.field][this.name] = new Input({type:'text', maxLength:20});
				table.addHead($MUI(System.Contact.Labels[this.name])).addCel(win.forms[options.field][this.name]).addRow();
				
				try{
					win.Panel.PanelSwip.ScrollBar.refresh();
					win.Panel.PanelSwip.ScrollBar.scrollTo(table);
				}catch(er){}
			});
		}
				
		html.appendChild(add);
	},
/**
 *
 **/	
	createMultipleOtherField:function(win, options){
		var contact = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		var table = 		new TableData();
		win.forms[options.field] =	{};
		
		win.forms.addFilters(options.field, function(){
			var a  = {};
			Object.setObject(a, this[options.field]);
			return a;			
		});
		
		for(var key in contact[options.field]){
			if(contact[options.field][key] == '') continue;
			
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
									
				case 'sector':
					win.forms[options.field][key] = new Select();
					win.forms[options.field][key].maxLength = 100;
					win.forms[options.field][key].setData($S.meta('BP_SECTORS') || []);
					break;
			}
			
			win.forms[options.field][key].Value(contact[options.field][key]);
			
			if(System.Contact.LabelsOther[key]){
				table.addHead($MUI(System.Contact.LabelsOther[key])).addCel(win.forms[options.field][key]).addRow();
			}
		}
				
		html.appendChild(table);
		//
		// Ajout du contact
		//
		var add = new SimpleMenu({icon:'add-element', text:options.label, nofill:true});
		add.addClassName('menu-contact bottom');
		
		for(var key in System.Contact.LabelsOther){
						
			if(Object.isElement(contact[options.field][key])) {
				continue;
			}
			
			var le = new LineElement({text:$MUI(System.Contact.LabelsOther[key])});
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
											
					case 'sector':
						win.forms[options.field][this.name] = new Select();
						win.forms[options.field][this.name].maxLength = 100;
						win.forms[options.field][this.name].setData($S.meta('BP_SECTORS') || []);
						break;
				}
								
				//win.forms[options.field][this.name] = new Input({type:'text', maxLength:20});
				table.addHead($MUI(System.Contact.LabelsOther[this.name])).addCel(win.forms[options.field][this.name]).addRow();
				
				try{
					win.Panel.PanelSwip.ScrollBar.refresh();
					win.Panel.PanelSwip.ScrollBar.scrollTo(table);
				}catch(er){}
			});
		}
				
		html.appendChild(add);
	},
/**
 *
 **/	
	createMultipleWebField:function(win, options){
		var contact = 	win.getData();
		var html = 		options.node;
				
		html.appendChild(new Node('h4', options.label));
		
		var table = 		new TableData();
		win.forms[options.field] =	[];
		
		win.forms.addFilters(options.field, function(){
			var a  = [];
			
			Object.setObject(a, this[options.field]);
			return a;			
		});
		
		for(var i = 0; i < contact[options.field].length; i++){
			if(contact[options.field][i] == '') continue;
			
			var input = new InputButton({
				type:		'text', 
				sync:		true,
				value:		contact[options.field][i], 
				maxLength:	255,
				icon:		'search-contact'
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
		// Ajout du contact
		//
		var add = new SimpleButton({icon:'add-element', text:options.label, nofill:true});
				
		add.on('click', function(){
				
			var input = new InputButton({type:'text', maxLength:255, sync: true, icon: 'search-contact'});
			
			input.SimpleButton.on('click', function(){
				if(this.Value() != ''){
					$S.open('http://' + this.Value().replace('http://', ''), this.Value());
				}
			}.bind(input));
			
			win.forms[options.field].push(input);
			table.addHead(' ').addCel(input).addRow();
			
			try{
				win.Panel.PanelSwip.ScrollBar.refresh();
				win.Panel.PanelSwip.ScrollBar.scrollTo(table);
			}catch(er){}
			
		});
				
		html.appendChild(add);
	},
/**
 * Contact.listing(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	listing:function(win){
		
		var panel = win.Panel;
		//this.setCurrent('');
		
		if(!this.NavBar){
			this.NavBar = new NavBar({
				range1:50,
				range2:100,
				range3:200
			});
			this.NavBar.on('change', this.load.bind(this));
			this.NavBar.setMaxLength(0);
			
			this.NavBar.Category = new Select();
			this.NavBar.Category.setData($S.Meta('CONTACTS_CATEGORIES'));
			this.NavBar.Category.Value('all');
			this.NavBar.Category.setStyle('float:right;width:200px');
			this.NavBar.Category.on('change', function(){
				this.NavBar.getClauses().page = 0;
				this.load(win);
			}.bind(this));
					
			
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		this.NavBar.appendChild(this.NavBar.Category);
		
		
		this.load(win);
		
	},
	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		//var sort = this.NavBar.select('span.sort.selected')[0];
		//var field = sort.value;
				
		//if(sort.hasClassName('desc')){	
		//	sort = 'desc';
		//}else{
		//	sort = 'asc';
		//}
		
		//clauses.order = field + ' ' + sort;
		//clauses.where = $WR.getByName('mystore').Panel.InputCompleter.Text();
		
		var options = {
			category:		this.NavBar.Category.Value() == 'all' ? '' : this.NavBar.Category.Value()
		};
		
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 * Contact.listing(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	load:function(){
		var win = $WR.getByName('contacts');
		
		if(!win){
			return;
		}
		
		win.Panel.Progress.show();
		var panel = win.Panel;
			
		$S.exec('contact.list', {
			parameters:this.getParameters(),
			onComplete:function(result){
				
				this.NavBar.setMaxLength(0);
				
				try{
					var obj = 	result.responseText.evalJSON();
					var array = $A(obj);
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				try{		
				
					panel.clearBody();
					
					this.NavBar.setMaxLength(obj.maxLength);
					
					this.draw(win, array);
					
					if(win.Panel.ProgressBar.hasClassName('splashscreen')){
						new Timer(function(){
							win.Panel.ProgressBar.hide();
							win.Panel.ProgressBar.removeClassName('splashscreen');
						}, 0.5, 1).start();
					}else{
						win.Panel.ProgressBar.hide();
					}
									
				}catch(er){
					$S.trace(er)
				}
			}.bind(this)
		});
		
	},
/**
 * Contact.draw(win, array) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode construit le catalogue à partir de la liste des applications.
 **/	
	draw: function(win, array){
				
		var self = this;
		
		if(array.length > 0){
			var letter = '';
				
			for(var i = 0; i < array.length; i++){
				
				if((array[i].Name + ' ' + array[i].FirstName).trim().slice(0,1).toUpperCase() != letter){
					letter = array[i].Name.slice(0,1).toUpperCase() ;
					win.Panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, letter)); 
				}
				
				var contact = 	new System.Contact(array[i]);
				var button = 	new System.Contact.AppButton({
					icon:		contact.Avatar_LD, 
					text:		(contact.Civility + ' ' + contact.Name + ' ' + contact.FirstName).trim(),
					subTitle:	contact.Company
				});
				
				button.data = array[i];
				//
				// Button
				//
				var actions = [];
				
				if(contact.haveMail()){
					button.Mail = 	new SimpleMenu({icon:'mail-contact', nofill:true});
					
					for(var key in contact.Email){
						var line = new LineElement({text:System.Contact.Labels[key] + ' : ' + contact.Email[key]});
						button.Mail.appendChild(line);
						line.mail =  contact.Email[key];
						line.css('min-width', 250);
						
						line.on('click', function(evt){
							evt.stop();
							
							if(System.Opener){
								System.Opener.open('mailto', this.mail);
							}else{
								window.location = 'mailto:' + this.mail;
							}
						});
					}
										
					actions.push(button.Mail);
				}
				
				if(contact.havePhoneNumber()){
					button.Phone =	new SimpleMenu({icon:'phone-contact', nofill:true});
					
					for(var key in contact.Phone){
						if(key == 'fax') continue;
						
						var line = new LineElement({text:System.Contact.Labels[key] + ' : ' + System.Contact.formatPhone(contact.Phone[key])});
						button.Phone.appendChild(line);
						line.phone =  contact.Phone[key].replace(/[ #\._-]/g, '');
						line.css('min-width', 250);
						
						line.on('click', function(evt){
							evt.stop();
							
							if(System.Opener){
								System.Opener.open('tel', this.phone);
							}else{
								window.location = 'tel:' + this.phone;
							}
						});
					}
					
					actions.push(button.Phone);
				}
				
				var location  = [contact.Address, contact.City, contact.CP, contact.Country || 'FRANCE'].without('', ' ').join(', ').trim();
				
				if(location != 'FRANCE'){
					
					if(System.Opener){
						
						button.Map =	new SimpleButton({icon:'map-contact', nofill:true});
						button.Map.data = contact;
						
						button.Map.on('click', function(){
							
							System.Opener.open('map', {
								
								title:			(this.data.Civility + ' ' + this.data.Name + ' ' + this.data.FirstName).trim(),
								
								location: {
									Address:	this.data.Address,
									CP:			this.data.CP,
									City:		this.data.City,
									Country:	this.data.Country
								}
							});
							
						});
						
						actions.push(button.Map);
					}
				}
				
				button.Remove = new SimpleButton({icon:'remove-element', nofill:true});
				button.Remove.on('click', function(evt){
					evt.stop();
					System.Contact.remove(this.data, win.createBox());
				}.bind(button));
				actions.push(button.Remove);
				//
				//
				//
				var node = 		new Node('div', {className:'wrap-button'}, actions);
				
				button.appendChild(node);
													
				win.Panel.PanelBody.Body().appendChild(button);
				
				button.on('click', function(){
					//alert(document.HasScrolled);
					if(!document.HasScrolled){
						System.Contact.open(this.data);
					}
				});
				
				button.addClassName('hide');
			}
			
			win.Panel.PanelBody.refresh();
			
			new Timer(function(){
				var b = win.Panel.PanelBody.select('.market-button.hide')[0];
				if(b){
					
					b.removeClassName('hide');
					b.addClassName('show');
				}
			}, 0.1, array.length).start();
			
		}else{
			if(!win.isSearch){
				win.Panel.PanelBody.Body().appendChild(new Node('H2', {className:'notfound'}, $MUI('Aucun contact n\'est enregistré') ));
			}else{
				win.Panel.PanelBody.Body().appendChild(new Node('H2', {className:'notfound'}, $MUI('Désolé. Aucun contact ne correspond à votre recherche') + '.'));
			}
		}
		
		return this;
	},
	
	openAddCategory:function(evt, win){
		try{
			
		var bubble = win.createBubble();
		//
		//
		//
		var buttonAdd = 	new SimpleButton({type:'submit', text:$MUI('Ajouter')});
		buttonAdd.css('margin-right', '10px');
		//
		//
		//
		var buttonClose =	new SimpleButton({icon:'close-element', noFill:true, nofill:true});
		buttonClose.setStyle('position:absolute;top:5px; right:5px; margin:0; color:#333');
		
		buttonClose.on('click', function(){
			bubble.hide();
		});
		//
		//
		//
		var input =			new Input({type:'text'});
		input.Large(true);
		input.css('width', '99%').css('margin-bottom', '15px');
		
		var html = new HtmlNode();
		
		html.appendChilds([
			new Node('h4', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Saisissez une nouvelle catégorie')), 
			input,
			buttonAdd,
			buttonClose
		]);
		
		buttonAdd.on('click', function(){
			
			if(input.Value() == ''){
				bubble.hide();
				return;	
			}
			
			System.Contact.addCategory(input.Value(), input.Value().toLowerCase());
			bubble.hide();
			var values = win.forms.Categories.Value();
			win.forms.Categories.setData($S.Meta('CONTACTS_CATEGORIES'));
			win.forms.Categories.Value(values);
		});
		
		bubble.show(evt, html);
		input.focus();
		
		}catch(er){$S.trace(er)}
	},
/**
 *
 **/	
	addCategory:function(name, value){
		
		var categories = $S.Meta('CONTACTS_CATEGORIES') || [
			{value:'all', text:$MUI('Toutes catégories')}
		];
		
		for(var i = 0; i < categories.length; i++){
			if(categories[i].value == value){
				return true;
			}
		}
	
		categories.push({
			text:	name, 
			value:	value
		});
		
		categories = categories.sortBy(function(s){
			return s.text;
		});
		
		$S.Meta('CONTACTS_CATEGORIES', categories);
		return this;
	},
/**
 *
 **/	
	getCategories:function(){
		return $S.Meta('CONTACTS_CATEGORIES') || [
			{value:'all', text:$MUI('Toutes catégories')}
		];
	},
	
	formatPhone: function(str){
				
		var phone = str.replace(/[ #\._-]/g, '');
		
		if(phone.isTel()){//correspond au format téléphonique Français
			phone = '+33 ' + phone.format('## ## ## ## ##').slice(1);
		}
		
		return phone;
	},
/**
 * System.Contact.removeContact(win contact) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(contact, box){
		contact = new System.Contact(contact);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le contact') + ' ' + contact.Name + ' ' + contact.FirstName + ' ? ');
		splite.setIcon('edittrash-48');
		//
		// 
		//
		box.setTheme('flat liquid black');
		box.a(splite).setType().show();
		
		$S.fire('contact:remove.open', box);
		
		box.reset(function(){
			box.setTheme();	
		});
						
		box.submit({
			text:$MUI('Supprimer le contact'),
			
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('contact:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				contact.remove(function(){
					box.hide();
						
					$S.fire('contact:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le contact a bien été supprimé'));
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

System.Contact.AppButton = Class.from(AppButton);
System.Contact.AppButton.prototype = {
	
	className:'wobject market-button contact-button overable',
/**
 * new Contact.AppButton([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			subTitle:	'',
			overable:	false,
			progress:	false,
			version:	''
		};
		
		Object.extend(options, obj || {});
		
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'}, options.subTitle);
		
		this.appendChild(this.SubTitle);
		
		this.Overable(options.overable);
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};

System.Contact.Media =  Class.from(AppButton);
System.Contact.Media.ID  = 0;

System.Contact.Media.prototype = {
	className:'wobject market-button contact-media show',
	
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
		this.Description = new Node('div', {className:'editable-area'});
		this.Description.innerHTML = obj.subText == '' ? ('<p>' + $MUI('Saisissez votre texte') + '...</p>') : obj.subText;
		this.Description.id = 'contact-media-'+System.Contact.Media.ID;
		
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
		
		System.Contact.Media.ID++;
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


System.Contact.initialize();