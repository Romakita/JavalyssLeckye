/** section: MyStore
 * class System.MyStore.Setting
 **/
System.MyStore.Setting = {
/**
 * new System.BlogPress.Setting()
 **/
	initialize: function(){
		$S.observe('system:open.settings', function(win){
			var button = new SimpleButton({text:'MyStore', icon:'mystore'});
			
			win.TabControl.Header().appendChild(button);
			button.on('click', function(){
				System.MyStore.open('setting');
			});
		});
	},
		
	open:function(){
		
		var win = 		$WR.getByName('mystore');
		var panel = 	win.MyStore;
		var forms = 	win.createForm();
		
		System.MyStore.setCurrent('setting');
		panel.Open(true, 650);
		
		panel.PanelSwip.addPanel($MUI('Paramètres'), this.createPanel(win));
		panel.PanelSwip.addPanel($MUI('Impression'), this.createPanelPrint(win));
		
				
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyStore.Setting.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('mystore.setting:open', win);
		
	},
/**
 *
 **/	
	createPanel:function(win){
		var panel = new Panel();
		var forms = win.createForm();
		//
		//
		//
		forms.MYSTORE_STOCK_ENABLE = new ToggleButton();
		forms.MYSTORE_STOCK_ENABLE.Value(System.Meta('MYSTORE_STOCK_ENABLE'));
		//
		//
		//
		forms.MYSTORE_CURRENCY = new Select();
		forms.MYSTORE_CURRENCY.setData([
			{value:'€', text:'Euro (€)'},
			{value:'£', text:'GBP (£)'},
			{value:'$', text:'USD (£)'}
		]);
		
		forms.MYSTORE_CURRENCY.Value(System.Meta('MYSTORE_CURRENCY') || '€');
		//
		//
		//
		forms.MYSTORE_TVA = new Input({type:'number', decimal:1, maxLength:5});
		forms.MYSTORE_TVA.Value(System.Meta('MYSTORE_TVA') || 19.6);
		//
		//
		//
		forms.MYSTORE_TVA_MODE = new Select();
		forms.MYSTORE_TVA_MODE.setData([
			{value:'disabled', text:$MUI('Désactiver la TVA')},
			{value:'use', text:$MUI('Calculer la TVA à partir du total HT')},
			{value:'print', text:$MUI('Calculer la TVA à partir du total TTC')}
		]);
		
		forms.MYSTORE_TVA_MODE.Value(System.Meta('MYSTORE_TVA_MODE') || 'print');
		//
		//
		//
		forms.MYSTORE_COMMAND_FORMAT = new Input({maxLength:100, value:System.Meta('MYSTORE_COMMAND_FORMAT') || "#NB"});
		forms.MYSTORE_COMMAND_FORMAT.on('keyup', function(){
			System.MyStore.Setting.refreshResultFormat(win);
		});
		//
		//
		//
		forms.MYSTORE_MAIL_LIST = new InputRecipient({
			button:		false,
			parameters:	'cmd=mail.aggregate.list'///flux d'aggregation standard des mails de Javalyss
		});
		
		forms.MYSTORE_MAIL_LIST.Value(System.Meta('MYSTORE_MAIL_LIST') || []);
		
		
		panel.appendChild(new Node('h4', $MUI('Paramètres')));
		
		var table = new TableData();
		
		table.addHead($MUI('Gestion des stocks')).addCel(forms.MYSTORE_STOCK_ENABLE).addRow();
		table.addHead($MUI('Devise')).addCel(forms.MYSTORE_CURRENCY).addRow();
		table.addHead($MUI('Valeur TVA')).addCel(forms.MYSTORE_TVA).addRow();
		table.addHead($MUI('Mode TVA')).addCel(forms.MYSTORE_TVA_MODE).addRow();
		
		panel.appendChild(table);
		panel.appendChild(new Node('h4', $MUI('Format des numéros de commande')));
		
		var table = new TableData();
		table.addClassName('liquid');
		//
		//
		//
		var buttons = {};
		//
		//
		//
		buttons.NB = 		new SimpleButton({text:$MUI('Commande')});
		buttons.NB.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#NB'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.CLIENTID = 	new SimpleButton({text:'Client ID'});
		buttons.CLIENTID.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#CLIENTID'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.Y = 		new SimpleButton({text:$MUI('Année')});
		buttons.Y.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#Y'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.M = 		new SimpleButton({text:$MUI('Mois')});
		buttons.M.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#M'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.D = 		new SimpleButton({text:$MUI('Jour')});
		buttons.D.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#D'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.H = 		new SimpleButton({text:$MUI('Heure')});
		buttons.H.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#H'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.I = 		new SimpleButton({text:$MUI('Minute')});
		buttons.I.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#I'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		//
		//
		//
		buttons.S = 		new SimpleButton({text:$MUI('Seconde')});
		buttons.S.on('click', function(){
		
			forms.MYSTORE_COMMAND_FORMAT.Value(forms.MYSTORE_COMMAND_FORMAT.Value() + forms.MYSTORE_COMMAND_FORMAT.Value('#S'));
			System.MyStore.Setting.refreshResultFormat(win);
				
		});
		
		
		buttons.IDS = 		new GroupButton();
		buttons.IDS.appendChilds([buttons.NB, buttons.CLIENTID]);
		
		buttons.DATE = 		new GroupButton();
		buttons.DATE.appendChilds([buttons.D, buttons.M, buttons.Y, buttons.H, buttons.I, buttons.S]);
		
		
		table.addHead('Numéro').addCel(buttons.IDS).addHead('Date').addCel(buttons.DATE).addRow();
		
		
		panel.appendChild(table);
		
		var table = new TableData();
		
		table.addHead($MUI('Format')).addCel(forms.MYSTORE_COMMAND_FORMAT).addRow();
		table.addHead($MUI('Résultat')).addField(' ').addRow();
		
		forms.RESULT_FORMAT = table.getCel(1,1);
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Liste de diffusion')));
		
		panel.appendChild(forms.MYSTORE_MAIL_LIST);
				
		this.refreshResultFormat(win);
		
		return panel;
	},
/**
 * System.Setting.createPanelPrint() -> Node
 *
 * Créer le panneau de configuration d'impression
 **/
	createPanelPrint: function(win){
		
		//#pragma region Instance
		
		//
		//Node
		//
		var panel = 	new Panel();
		
		var options  =	System.Meta('Prints') || {
			Name:		$U('PRINT_FIELD_HEAD') || '',
			Address:	$U('PRINT_FIELD_ADR') || '',
			City:		$U('PRINT_FIELD_VILLE') || '',
			Phone:		$U('PRINT_FIELD_TEL') || '',
			Fax:		$U('PRINT_FIELD_FAX') || '',
			RCS:		$U('PRINT_FIELD_RCS') || '',
			TVA_Intra:	'',
			Logo:		$U('PRINT_FIELD_LOGO') || ''
		};
		
		var forms = 	win.createForm();
		//
		//Name
		//
		forms.Name = 			new Input({type:'text', maxLength: 100, value: options.Name});
		forms.Name.on('keyup', function(){forms.Preview.draw();});
		//
		// Address
		//
		forms.Address = 		new Input({type:'text', maxLength: 255, value: options.Address});
		forms.Address.on('keyup', function(){forms.Preview.draw();});
		//
		// City
		//
		forms.City = 			new Input({type:'text', maxLength: 100, value: options.City});
		forms.City.on('keyup', function(){forms.Preview.draw();});
		//
		// Phone
		//
		forms.Phone = 			new Input({type:'text', maxLength: 100, value: options.Phone});
		forms.Phone.on('keyup', function(){forms.Preview.draw();});
		//
		// Fax
		//
		forms.Fax = 			new Input({type:'text', maxLength: 100, value: options.Fax});
		forms.Fax.on('keyup', function(){forms.Preview.draw();});
		//
		// RCS
		//
		forms.RCS = 			new Input({type:'text', maxLength: 100, value: options.RCS});
		forms.RCS.on('keyup', function(){forms.Preview.draw();});
		//
		// TVA_Intra
		//
		forms.TVA_Intra = 		new Input({type:'text', maxLength: 100, value: options.TVA_Intra});
		forms.TVA_Intra.on('keyup', function(){forms.Preview.draw();});
		//
		// Logo
		//
		forms.Logo = 		new FrameWorker({
			multiple: false
		}); 
		
		forms.Logo.css('width', 'auto');
		
		forms.Logo.Value(options.Logo);
		
		forms.Logo.on('complete', function(){
			forms.Preview.draw();
		});
		
		//
		// Preview
		//
		forms.Preview = 		new Node('div', {className:'system-print-preview'});
		forms.Preview.css('margin-left', 0);
		
		forms.Preview.Logo = 	new Node('img', {className:'print-logo', width:50});
		
		forms.Preview.Text = 	new Node('div', {className:'print-text'}, [
			forms.Preview.Name = 		new Node('h1'),
			forms.Preview.Address = 	new Node('p'),
			forms.Preview.City = 		new Node('p'),
			forms.Preview.Phone = 		new Node('p'),
			forms.Preview.Fax = 		new Node('p'),
			forms.Preview.RCS = 		new Node('p'),
			forms.Preview.TVA_Intra = 	new Node('p')					
		]);
		
		forms.Preview.draw = function(){
			this.Name.innerHTML = 			forms.Name.Value();
			this.Address.innerHTML = 		forms.Address.Value();
			this.City.innerHTML = 			forms.City.Value();
			this.Phone.innerHTML = 			forms.Phone.Value();
			this.Fax.innerHTML = 			forms.Fax.Value();
			this.RCS.innerHTML = 			forms.RCS.Value();
			this.TVA_Intra.innerHTML = 		forms.TVA_Intra.Value();
			this.Logo.src = 				forms.Logo.Value();
			
			if(forms.Phone.Value() == '') this.Phone.hide();
			else this.Phone.show();
			
			if(forms.Fax.Value() == '') this.Fax.hide();
			else this.Fax.show();
			
			if(forms.RCS.Value() == '') this.RCS.hide();
			else this.RCS.show();
			
			if(forms.TVA_Intra.Value() == '') this.TVA_Intra.hide();
			else this.TVA_Intra.show();
			
			if(forms.Logo.Value() == '') this.Logo.hide();
			else this.Logo.show();
		};
		//
		//Table1
		//
		var table = 	new TableData();	
		table.addHead($MUI('Nom / Société')).addCel(forms.Name).addRow();
		
		table.addHead($MUI('Adresse')).addCel(forms.Address).addCel(' ').addRow();
		table.addHead($MUI('CP & Ville')).addCel(forms.City).addRow();
		table.addHead($MUI('Tel')).addCel(forms.Phone).addRow();
		table.addHead($MUI('Fax')).addCel(forms.Fax).addRow();
		table.addHead($MUI('RCS')).addCel(forms.RCS).addRow();
		table.addHead($MUI('TVA Intra')).addCel(forms.TVA_Intra).addRow();
		table.addHead($MUI('Logo')).addCel(forms.Logo).addRow();
				
		var tablep = new TableData();
		tablep.className = '';
		
		tablep.addCel(forms.Preview.Logo)
		tablep.addCel(forms.Preview.Text);
		
		forms.Preview.appendChild(tablep);
		forms.Preview.draw();
		
		
		forms.Prints_Bank = new TextArea();	
		forms.Prints_Bank.Value(System.Meta('Prints_Bank') || '');
		forms.Prints_Bank.css('height', '100px').css('width', '590px');
		//#pragma endregion Instance
		
		panel.appendChilds([
			new Node('h4', $MUI('Informations entreprise')),
			table,
			new Node('h4', $MUI('Informations bancaires')),
			forms.Prints_Bank,
			
			new Node('h4', $MUI('Prévisualisation')),
			forms.Preview
		]);
						
					
		return panel;
	},
	
	refreshResultFormat:function(win){
		
		var forms = win.createForm();
		var date =		new Date();
		var options = {
			'#NB': 			'12'.padLeft(10, "0"),
			'#Y':			date.format('Y'),
			'#M':			date.format('m'),
			'#D':			date.format('d'),
			'#H':			date.format('H'),
			'#I':			date.format('i'),
			'#S':			date.format('s'),
			'#CLIENTID':	1
		};
		
		var value = forms.MYSTORE_COMMAND_FORMAT.Value();
		
		for(var key in options){
			value = value.replace(new RegExp(key, 'ig'), options[key]);	
		}
		
		forms.RESULT_FORMAT.innerHTML = value;
		
	},
	
	submit:function(win){
		var forms = win.createForm();
		
		System.Meta('MYSTORE_STOCK_ENABLE', forms.MYSTORE_STOCK_ENABLE.Value());
		System.Meta('MYSTORE_CURRENCY', forms.MYSTORE_CURRENCY.Value());
		System.Meta('MYSTORE_TVA', forms.MYSTORE_TVA.Value());
		System.Meta('MYSTORE_TVA_MODE', forms.MYSTORE_TVA_MODE.Value());
		System.Meta('MYSTORE_COMMAND_FORMAT', forms.MYSTORE_COMMAND_FORMAT.Value());
		System.Meta('MYSTORE_MAIL_LIST', forms.MYSTORE_MAIL_LIST.Value());
		
		var options = {
			Name:			forms.Name.Value(),
			Address:		forms.Address.Value(),
			City:			forms.City.Value(),
			Phone:			forms.Phone.Value(),
			Fax: 			forms.Fax.Value(),
			RCS:			forms.RCS.Value(),
			TVA_Intra: 		forms.TVA_Intra.Value(),
			Logo: 			forms.Logo.Value()	
		};
		
		System.Meta('Prints', options);
		
		System.Meta('Prints_Bank', forms.Prints_Bank.Value());
		
		var splite = new SpliteIcon($MUI('Les paramètres de MyStore ont bien été modifié'));
		splite.setIcon('filesave-ok-48');
		win.AlertBox.setTheme('flat liquid white');
		win.AlertBox.setIcon('documentinfo').a(splite).ty('CLOSE').Timer(5).show();
	}
};

System.MyStore.Setting.initialize();