/** section: Contact
 * System.CRM
 *
 * Cet espace de nom gère l'extension CRM.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : crm.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.CRM = {};

Object.extend(System.CRM, {
/**
 * System.CRM.initialize()
 **/
	initialize: function(){		
		$S.on('system:startinterface', this.onStartInterface.bind(this));
	},
/**
 * System.CRM.onStartInterface() -> void
 **/
 	onStartInterface: function(){
		
		this.Menu = $S.DropMenu.addMenu($MUI('CRM'), {
			icon:		'crm',
			appName:	'CRM'
		}).observe('click', function(){this.open()}.bind(this));	
		
		System.CRM.addCategory($MUI('Toutes catégories'), 'all');
	},
/**
 * System.CRM.open() -> Window
 **/	
	open:function(type){
		var win = $WR.unique('crm', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) {			
			return $WR.getByName('crm');
		}
				
		win.forms = {};
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('crm');
		win.addClassName('crm');
		//
		// TabControl
		//
		//win.createTabControl({offset:22});
		win.appendChild(this.createPanel(win));
				
		document.body.appendChild(win);
		
		$S.fire('crm:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		switch(type){
			default:
			case 'client':
				System.CRM.Client.listing(win);
				break;
			
			case 'call':
				System.CRM.Call.listing(win);
				break;
			
			case 'setting':
				System.Setting.open(win);
				break;
		}
				
		return win;
	},
/**
 * System.CRM.createPanel(win) -> Panel
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			'CRM',
			placeholder:	$MUI('Rechercher un client (nom, ville, code postal, etc...)'),
			parameters:		'cmd=crm.client.list',
			//icon:			'crm-32',
			menu:			false
		});
		win.Panel = panel;
		var self =	this;
		panel.addClassName('crm');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		//
		//
		panel.BtnAddClient = new SimpleButton({icon:'add-client', text:$MUI('Créer client')});
		panel.BtnAddClient.on('click', function(){
			System.CRM.Client.open();
		});
		
		//
		//
		//
		panel.BtnAddCall = new SimpleButton({icon:'add-call', text:$MUI('Créer appel')});
		panel.BtnAddCall.on('click', function(){
			System.CRM.Client.Call.open();
		});
		//
		// Clients
		//
		panel.BtnClient = new SimpleButton({icon:'edit-client', text:$MUI('Clients')});
		
		panel.BtnClient.addClassName('client selected tab');
		panel.BtnClient.on('click', function(){
			System.CRM.Client.listing(win);
		});
		//
		// Call
		//
		panel.BtnCall = new SimpleButton({icon:'edit-call', text:$MUI('Appels')});
		
		panel.BtnCall.addClassName('call tab');
		panel.BtnCall.on('click', function(){
			System.CRM.Client.Call.listing(win);
		});
		//
		// Call
		//
		panel.BtnStatistics = new SimpleButton({icon:'edit-statistics', text:$MUI('Statistiques')});
		
		panel.BtnStatistics.addClassName('statistics tab');
		panel.BtnStatistics.on('click', function(){
			System.CRM.Statistics.open(win);
		});
		//
		//
		//
		panel.BtnClientImport = new SimpleButton({icon:'edit-import', text:$MUI('Importer')});
		
		panel.BtnClientImport.addClassName('import');
		panel.BtnClientImport.on('click', function(){
			System.CRM.Import.open(win);
		});
		//
		//
		//
		panel.BtnSetting = new SimpleButton({icon:'edit-setting', text:$MUI('Configuration')});
		panel.BtnSetting.addClassName('setting');
		panel.BtnSetting.on('click', function(){
			System.Settings.open().TabControl.get($MUI('CRM')).click();
		});
		
		panel.Header().appendChild(panel.BtnAddClient);
		panel.Header().appendChild(panel.BtnAddCall);
		panel.Header().appendChild(panel.BtnClient);
		panel.Header().appendChild(panel.BtnCall);
		
		if($U().getRight() != 3){
			panel.Header().appendChild(panel.BtnStatistics);
			panel.Header().appendChild(panel.BtnClientImport);
			panel.Header().appendChild(panel.BtnSetting);
		}
		//
		//
		//		
		panel.InputCompleter.on('draw', function(line){
			this.Hidden(true);
		});
		
		panel.InputCompleter.on('complete', function(array){
			
			switch(win.CurrentName){
				case 'client':
					System.CRM.Client.onSearch(array);
					break;
				
				case 'call':
					System.CRM.Client.Call.onSearch(array);
					break;
			}
			
		}.bind(this));
		
		panel.InputCompleter.on('keyup', function(){
			if(panel.InputCompleter.Text() == ''){
				switch(win.CurrentName){
					case 'client':
						System.CRM.Client.listing(win);
						break;
						
					case 'call':
						System.CRM.Client.Call.listing(win);
						break;
				}
			}
			
		}.bind(this));
		
		return panel;
	},
/**
 * System.CRM.setCurrent() -> void
 **/	
	setCurrent:function(name){
		var win = $WR.getByName('crm');
		var panel = win.Panel;
		
		if(name != 'setting'){
			panel.Header().select('.selected').invoke('removeClassName', 'selected');
			panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
			
			//new fThread(function(){
			//	panel.select('.cel-date_confirm').invoke('show');
			//	panel.select('.cel-date_preparation').invoke('show');
			//	panel.select('.cel-date_delivery_start').invoke('show');
			//}, 0.4);
			
			panel.clearAll();
			win.CurrentName = name;
		}else{
			panel.clearSwipAll();
		}
		
		switch(name){
			case 'client':
				panel.InputCompleter.Input.placeholder = $MUI('Rechercher un client (nom, ville, code postal, etc...)');
				break;
				
			case 'call':
				panel.InputCompleter.Input.placeholder = $MUI('Rechercher un appel');
				break;
		}
		
		panel.Open(false);
		win.destroyForm();
		
		panel.InputCompleter.Text('');		
	},
/**
 * System.CRM.openAddCategory() -> void
 **/	
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
			
			System.CRM.addCategory(input.Value(), input.Value().toLowerCase());
			bubble.hide();
			var values = win.forms.Categories.Value();
			win.forms.Categories.setData($S.Meta('CRM_CLIENTS_CATEGORIES'));
			win.forms.Categories.Value(values);
		});
		
		bubble.show(evt, html);
		input.focus();
		
		}catch(er){$S.trace(er)}
	},
/**
 * System.CRM.addCategory(name, value) -> System.CRM
 **/	
	addCategory:function(name, value){
		var categories = $S.Meta('CRM_CLIENTS_CATEGORIES') || [
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
		
		$S.Meta('CRM_CLIENTS_CATEGORIES', categories);
		return this;
	},
/**
 * System.CRM.getCategories() -> System.CRM
 **/	
	getCategories:function(){
		return $S.Meta('CRM_CLIENTS_CATEGORIES') || [
			{value:'all', text:$MUI('Toutes catégories')}
		];
	},
	
	getCallConlusions:function(){
		return [{text:'NRP - Appel non répondus ', value:1},
			{text:'NRA - Appel sans avoir eu de contact avec le destinataire final', value:2},
			{text:'CTINF - Contact avec le destinataire ou son assistante', value:3},
			{text:'PROJ - Contact avec le destinataire ou son assistante', value:4},
			{text:$MUI('Autre'), value:''}];
	},
	
	formatPhone: function(str){
				
		var phone = str.replace(/[ #\._-]/g, '');
		
		if(phone.isTel()){//correspond au format téléphonique Français
			phone = '+33 ' + phone.format('## ## ## ## ##').slice(1);
		}
		
		return phone;
	}
});

System.CRM.initialize();