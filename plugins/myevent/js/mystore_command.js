/** section: MyEvent
 * class MyEvent.Product
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : myevent.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyEvent.Command = Class.createAjax({

/**
 * System.MyEvent.Command#Command_ID -> Number
 **/
	Command_ID: 	0,
/**
 * System.MyEvent.Command#Command_NB -> String
 * Varchar
 **/
	Command_NB: 			"",
/**
 * System.MyEvent.Command#User_ID -> Number
 **/
	User_ID:				0,
/**
 * System.MyEvent.Command#Date_Create -> Datetime
 **/
	Date_Create:			'0000-00-00 00:00:00',
/**
 * System.MyEvent.Command#Date_Payment -> Datetime
 **/
	Date_Payment:			'0000-00-00 00:00:00',
/**
 * System.MyEvent.Command#Date_Confirm -> Datetime
 **/
	Date_Confirm:			'0000-00-00 00:00:00',
/**
 * System.MyEvent.Command#Date_Preparation -> Datetime
 **/
	Date_Preparation: 		'0000-00-00 00:00:00',
/**
 * System.MyEvent.Command#Date_Delivery_Start -> Datetime
 **/
	Date_Delivery_Start: 	'0000-00-00 00:00:00',
/**
 * System.MyEvent.Command#Date_Delivery_End -> Datetime
 **/
	Date_Delivery_End: 		'0000-00-00 00:00:00',
/**
 * System.MyEvent.Command#Statut -> String
 * Varchar
 **/
	Statut: 				'created',
/**
 * System.MyEvent.Command#Address_Billing -> String
 * Text
 **/
	Address_Billing: 		"",
/**
 * System.MyEvent.Command#Address_Delivery -> String
 * Text
 **/
	Address_Delivery:		"",
/**
 * System.MyEvent.Command#Mode_Delivery -> String
 * Text
 **/
	Mode_Delivery: 			"",
/**
 * System.MyEvent.Command#Amount_HT -> Float
 * Decimal
 **/
	Amount_HT: 				0.00,
/**
 * System.MyEvent.Command#Eco_Tax -> Float
 * Decimal
 **/
	Eco_Tax: 				0.00,
/**
 * System.MyEvent.Command#Cost_Delivery -> Float
 * Decimal
 **/
	Cost_Delivery:			0.00,
/**
 * System.MyEvent.Command#TVA -> Float
 * Decimal
 **/
	TVA:					0.00,
/**
 * System.MyEvent.Command#Discount -> Float
 * Decimal
 **/
	Discount:	 			0.00,
/**
 * System.MyEvent.Command#Amount_TTC -> Float
 * Decimal
 **/
	Amount_TTC:				0.00,
/**
 * System.MyEvent.Command#Wallet_Card_ID -> String
 * Text
 **/
	Wallet_Card_ID: 		0,
/**
 * System.MyEvent.Command#Transation_Object -> String
 * Text
 **/
	Transation_Object:		"",
/**
 * System.MyEvent.Command#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('myevent.command.commit', {
			
			parameters: 'MyEventCommand=' + this.toJSON(),
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
 * System.MyEvent.Command#print(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode créée un nouveau document PDF à partir des informations de l'instance.
 **/
	print: function(callback, error){
		
		$S.exec('myevent.command.print', {
			
			parameters: 'MyEventCommand=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					var link = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				
				if(Object.isFunction(callback)) callback.call(this, link);
			}.bind(this)
			
		});
	},
/**
 * System.MyEvent.Command#confirm(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	confirm: function(callback, error){
		
		$S.exec('myevent.command.confirm', {
			
			parameters: 'MyEventCommand=' + this.toJSON(),
			onComplete: function(result){
				$S.trace(result.responseText);
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
	
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.MyEvent.Command#prepared(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	prepared: function(callback, error){
		
		$S.exec('myevent.command.prepared', {
			
			parameters: 'MyEventCommand=' + this.toJSON(),
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
 * System.MyEvent.Command#startDelivery(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	startDelivery: function(callback, error){
		
		$S.exec('myevent.command.start.delivery', {
			
			parameters: 'MyEventCommand=' + this.toJSON(),
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
 * System.MyEvent.Command#finish(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	finish: function(callback, error){
		
		$S.exec('myevent.command.finish', {
			
			parameters: 'MyEventCommand=' + this.toJSON(),
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
 * System.MyEvent.Command#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('myevent.command.delete',{
			parameters: 'MyEventCommand=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.MyEvent.Command, {
/** 
 * System.MyEvent.Command.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, command){
						
		try{
		
		var panel = win.MyEvent;
		
		win.setData(command = new System.MyEvent.Command(command));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.select('.cel-date_confirm').invoke('hide');
		panel.select('.cel-date_preparation').invoke('hide');
		panel.select('.cel-date_delivery_start').invoke('hide');
		
		panel.clearSwipAll();
		panel.Open(true, 700);
		//
		//
		//
				
		//panel.PanelSwip.Body().appendChild(new Node('h1', $MUI('Gestion du produit')));
			
		panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win));
		panel.PanelSwip.addPanel($MUI('Détails'), this.createPanelDetails(win));
		panel.PanelSwip.addPanel($MUI('Historique'), this.createPanelHistory(win));
		
		//panel.PanelSwip.addPanel($MUI('Details'), this.createPanelDetails(win));
				
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyEvent.Command.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('myevent.command:open', win);
				
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyEvent;	
		var command = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		//
		//
		//
		var btnOpen =	new SimpleButton({icon:'open-user'});
		btnOpen.on('click', function(){
			System.User.GetAndOpen(command.User_ID);
		});		
		
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		$S.trace(command.Mode_Payment);
		
		var table = new TableData();
		
		table.addHead($MUI('N° Commande')).addField(command.Command_NB, {style:'width:300px'}).addRow();
		
		if(Object.isUndefined(command.Meta.Company)){
			table.addHead($MUI('Client')).addField(command.User).addCel(btnOpen, {style:'width:30px'}).addRow();
		}else{
			table.addHead($MUI('Societe')).addField(command.Meta.Company).addCel(btnOpen, {style:'width:30px'}).addRow();
			table.addHead($MUI('Contact')).addField(command.User).addRow();
			table.addHead($MUI('N° TVA intra')).addField(command.Meta.TVA_Intra).addRow();
			table.addHead(' ').addRow();
		}
		
		table.addHead($MUI('Statut')).addField(System.MyEvent.Command.Status(command.Statut).text).addRow();
		table.addHead($MUI('Mode livraison')).addField(command.Mode_Delivery).addRow();
		table.addHead($MUI('Mode paiement')).addField(command.Mode_Payment.Name).addRow();
		table.addHead($MUI('Total TTC')).addField((command.Amount_TTC * 1).toFixed(2) + ' ' + System.MyEvent.Currency()).addRow();
			
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Adresse de livraison')));
		
		var table = new TableData();
		
		table.addHead($MUI('Nom')).addField(command.Address_Delivery.Name + ' ' + command.Address_Delivery.FirstName, {style:'width:300px'}).addRow();
		table.addHead($MUI('Adresse')).addField(command.Address_Delivery.Address).addRow();
		
		if(command.Address_Delivery.Address2 != ''){
			table.addHead($MUI('Adresse')).addField(command.Address_Delivery.Address2).addRow();
		}
		
		table.addHead($MUI('Code postal')).addField(command.Address_Delivery.CP).addRow();
		table.addHead($MUI('Ville')).addField(command.Address_Delivery.City).addRow();
		table.addHead($MUI('Pays')).addField(command.Address_Delivery.Country).addRow();
		table.addHead($MUI('Téléphone')).addField(command.Address_Delivery.Phone).addRow();
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Adresse de facturation')));
		
		var table = new TableData();
		
		table.addHead($MUI('Nom')).addField(command.Address_Billing.Name + ' ' + command.Address_Billing.FirstName, {style:'width:300px'}).addRow();
		table.addHead($MUI('Adresse')).addField(command.Address_Billing.Address).addRow();
		
		if(command.Address_Delivery.Address2 != ''){
			table.addHead($MUI('Adresse')).addField(command.Address_Billing.Address2).addRow();
		}
		
		table.addHead($MUI('Code postal')).addField(command.Address_Billing.CP).addRow();
		table.addHead($MUI('Ville')).addField(command.Address_Billing.City).addRow();
		table.addHead($MUI('Pays')).addField(command.Address_Billing.Country).addRow();
		table.addHead($MUI('Téléphone')).addField(command.Address_Billing.Phone).addRow();
				
		panel.appendChild(table);
						
		return panel;
	},
/**
 *
 **/	
	createPanelDetails:function(win){
		
		var command = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		//
		//
		//
		var btnOpen =	new SimpleButton({icon:'open-user'});
		btnOpen.on('click', function(){
			System.User.GetAndOpen(command.User_ID);
		});	
		
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = new TableData();
		table.addClassName('liquid');
		table.addHead($MUI('N° Commande'), {style:'width:130px'}).addField(command.Command_NB);
		
		if(Object.isUndefined(command.Meta.Company)){
			table.addHead($MUI('Client'), {style:'width:100px'}).addField(command.User, {style:'width:150px'}).addCel(btnOpen, {style:'width:30px'});
		}else{
			table.addHead($MUI('Societe'), {style:'width:100px'}).addField(command.Meta.Company, {style:'width:150px'}).addCel(btnOpen, {style:'width:30px'});
		}
				
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Détails')));
		
		var table = new SimpleTable({
			range1:		2000,
			range2:		2000,
			range3:		2000,
			readOnly:	true,
			parameters:	'cmd=myevent.command.product.list&options=' + Object.EncodeJSON({Command_ID:command.Command_ID})
		});
		
		table.addHeader({
			Reference: 				{title:$MUI('Reference')},
			Price:					{title:$MUI('PU'), style:'text-align:center'},
			//Cost_Delivery:			{title:$MUI('Coût de livraison'), style:'text-align:center'},
			Qte:					{title:$MUI('Quantité'), style:'text-align:center'},
			Total:					{title:$MUI('Total'), style:'text-align:center'}
		});
		
		table.addFilters('Price', function(e, cel, data){
			cel.css('text-align', 'right');
			return (e * 1).toFixed(2)+ ' ' + System.MyEvent.Currency(); 
		});
		
		table.addFilters('Total', function(e, cel, data){
			cel.css('text-align', 'right');
			return (data.Qte * data.Price * 1).toFixed(2)+ ' ' + System.MyEvent.Currency(); 
		});
							
		var tfoot = new Node('tfoot', [
		
			new Node('tr', {className:'amount-ht'}, [
				new Node('th', {style:'text-align:right', colSpan:3}, $MUI('Total HT')), 
				new Node('td', {style:'text-align:right'}, (command.Amount_HT * 1).toFixed(2) + ' ' + System.MyEvent.Currency())
			]),
			
			new Node('tr', {className:'eco-tax'}, [
				new Node('th', {style:'text-align:right', colSpan:3}, $MUI('Dont éco-taxe')), 
				new Node('td', {style:'text-align:right'}, (command.Eco_Tax * 1).toFixed(2) + ' ' + System.MyEvent.Currency())
			])
		]);
			
		table.appendChild(tfoot);
		
		var price = 	(command.Amount_TTC - command.Cost_Delivery) / ((command.TVA / 100) + 1);
		price =			(command.Amount_TTC - command.Cost_Delivery) - price;
				
		switch(System.MyEvent.ModeTVA()){
			case System.MyEvent.TVA_USE:
			case System.MyEvent.TVA_PRINT:
				
				tfoot.appendChild(new Node('tr', {className:'amount-tva'}, [
					new Node('th', {style:'text-align:right', colSpan:3}, $MUI('Dont TVA') + ' ' + command.TVA  + '%'), 
					new Node('td', {style:'text-align:right'}, (price).toFixed(2) + ' ' + System.MyEvent.Currency())
				]));
			
				break;	
		}
		
		tfoot.appendChild(new Node('tr', {className:'cost-delivery'}, [
			new Node('th', {style:'text-align:right', colSpan:3}, $MUI('Livraison')), 
			new Node('td', {style:'text-align:right'}, (command.Cost_Delivery * 1).toFixed(2) + ' ' + System.MyEvent.Currency())
		]));
					
		tfoot.appendChild(new Node('tr', {className:'amount-ttc'}, [
			new Node('th', {style:'text-align:right', colSpan:3}, $MUI('Total TTC')), 
			new Node('td', {style:'text-align:right'}, (command.Amount_TTC * 1).toFixed(2) + ' ' + System.MyEvent.Currency())
		]));
		
		table.load();
		
		panel.appendChild(table);
		
		return panel;
	},
/**
 *
 **/	
	createPanelHistory:function(win){
		
		var command = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		//
		//
		//
		var btnOpen =	new SimpleButton({icon:'open-user'});
		btnOpen.on('click', function(){
			System.User.GetAndOpen(command.User_ID);
		});	
		
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = new TableData();
		
		table.addHead($MUI('N° Commande')).addField(command.Command_NB).addRow();
		
		if(Object.isUndefined(command.Meta.Company)){
			table.addHead($MUI('Client')).addField(command.User).addCel(btnOpen, {style:'width:30px'}).addRow();
		}else{
			table.addHead($MUI('Societe')).addField(command.Meta.Company).addCel(btnOpen, {style:'width:30px'}).addRow();
			table.addHead($MUI('Contact')).addField(command.User).addRow();
			table.addHead($MUI('N° TVA intra')).addField(command.Meta.TVA_Intra).addRow();
			table.addHead(' ').addRow();
		}
		
		table.addHead($MUI('Statut')).addField(System.MyEvent.Command.Status(command.Statut).text).addRow();
		table.addHead($MUI('Mode livraison')).addField(command.Mode_Delivery).addRow();
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Historique')));
				
		var table = new TableData();		
		
		table.addHead($MUI('Créée le')).addField(command.Date_Create.toDate().format('l d F Y à h\\hi')).addRow();
		
		if(command.Date_Payment != '0000-00-00 00:00:00'){
			table.addHead($MUI('Payée le')).addField(command.Date_Payment.toDate().format('l d F Y à h\\hi')).addRow();
		}
		
		if(command.Date_Confirm != '0000-00-00 00:00:00'){
			table.addHead($MUI('Confirmée le')).addField(command.Date_Confirm.toDate().format('l d F Y à h\\hi')).addRow();
		}
		
		if(command.Date_Preparation != '0000-00-00 00:00:00'){
			table.addHead($MUI('Préparée le')).addField(command.Date_Preparation.toDate().format('l d F Y à h\\hi')).addRow();
		}
		
		if(command.Date_Delivery_Start != '0000-00-00 00:00:00'){
			table.addHead($MUI('Remise au transporteur le')).addField(command.Date_Delivery_Start.toDate().format('l d F Y à h\\hi')).addRow();
			
			if(command.Date_Delivery_End != '0000-00-00 00:00:00'){
				table.addHead($MUI('Livrée le')).addField(command.Date_Delivery_End.toDate().format('l d F Y à h\\hi')).addRow();
			}
			
		}else{
		
			if(command.Date_Delivery_End != '0000-00-00 00:00:00'){
				table.addHead($MUI('Récupéré par le client le')).addField(command.Date_Delivery_End.toDate().format('l d F Y à h\\hi')).addRow();
			}
			
		}
		
		panel.appendChild(table);
		
		return panel;
	},
/**
 * System.MyEvent.Command.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Title.Value() == '') {
			win.Flag.setText($MUI('Veuillez saisir un titre pour votre produit'));
			win.Flag.show(forms.Title);
			return true;
		}
		
		if(forms.Name.Value() == ''){
			forms.Name.Value(forms.Title.Value().sanitize('-').toLowerCase());	
		}
		
		var command =				win.forms.save(win.getData());
		command.Type = 				'page-myevent command';
		command.Template = 			'page-myevent-command.php';
		command.Comment_Statut = 	'close';
				
		$S.fire('myevent.command:open.submit', win);
		
		win.MyEvent.Progress.show();
		
		command.commit(function(){
			$S.trace(this);
			//System.MyEvent.Command.open(win, command);
			win.setData(this);
			System.MyEvent.Command.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.MyEvent;
		
		System.MyEvent.setCurrent('command');
		
		if(!this.NavBar){
			var options = {
				range1:			50,
				range2:			100,
				range3:			300,
				field:			'Statut',
				readOnly:		true
			};
			
			this.NavBar = new NavBar(options);
			
			this.NavBar.on('change', this.load.bind(this));
									
			this.NavBar.PrintNew = 		new Node('span', {className:'action new selected'}, $MUI('Nouvelles commandes'));
			//this.NavBar.PrintCurrent = 	new Node('span', {className:'action current'}, $MUI('Commandes en cours'));
			this.NavBar.PrintExpired = 	new Node('span', {className:'action not-expired'}, $MUI('Commandes terminées'));
						
			this.NavBar.appendChilds([
				this.NavBar.PrintNew,
				//this.NavBar.PrintCurrent,
				this.NavBar.PrintExpired
			]);
			
			//this.NavBar.PrintAll.on('click', function(){
				/*this.load();*/
				
			//	this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
			//	this.NavBar.PrintAll.addClassName('selected');
			//}.bind(this));
			
			//this.NavBar.PrintExpired.on('click', function(){
				/*this.load('-expired');*/
				
			//	this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
			//	this.NavBar.PrintExpired.addClassName('selected');
			//}.bind(this));
			
			
			/*this.NavBar.PrintNotExpired.on('click', function(){
				this.load('-not-expired');
				
				this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintNotExpired.addClassName('selected');
			}.bind(this));*/
			
			this.Table = new ComplexTable(options);
			this.Table.addHeader({
				
				Command_NB: 			{title:$MUI('N°'), style:'width:60px; text-align:right'},
				User: 					{title:$MUI('Client')},
				Mode_Delivery:			{title:$MUI('Mode de livraison')},
				Date_Payment:			{title:$MUI('Payée le'), wstyle:'text-align:center;width:130px', order:'asc'},
				Date_Confirm:			{title:$MUI('Confirmée le'), style:'text-align:center;width:130px'},
				Date_Preparation:		{title:$MUI('Préparée le'), style:'text-align:center;width:130px'},
				Date_Delivery_Start:	{title:$MUI('Sortie des entreprôts le'), style:'text-align:center;width:130px'},
				Date_Delivery_Start:	{title:$MUI('Livrée le'), style:'text-align:center;width:130px'},
				Amount_TTC:				{title:$MUI('Montant TTC'), style:'text-align:center;width:130px'},
				Statut:					{title:$MUI(' '), style:'text-align:center;width:150px', sort:false},
				Action:					{title:' ', type:'action', style:'text-align:center; width:50px;', sort:false}
			});
			
			this.Table.onWriteName = function(key){
				switch(key){
					case 'paid':
						return $MUI('Payée <small>(en attende de confirmation)</small>');
						
					case 'confirmed':
						return $MUI('Confirmée <small>(en attente de préparation)</small>');
					
					case 'prepared':
						return $MUI('Préparée <small>(en attente de distribution)</small>');
						
					case 'delivery':
						return $MUI('Livraison en cours');
					
					case 'finish':
						return $MUI('Terminée');
						
					case 'created':
						return $MUI('Créée');
				}
			};
			
			this.Table.addFilters('Action', function(e, cel, data){
				e.open.hide();
				
				var button = new SimpleButton({icon:'print-element'});
				button.Mini(true);
				
				button.on('click', function(){
					//panel.ProgressBar.show();
					new System.MyEvent.Command(data).print(function(link){
						//panel.ProgressBar.hide();
						System.openPDF(link, $MUI('Commande N°') +  ' ' + data.Command_NB);
					});
				});
				
				e.top(button);
				
				return e;
			});
			
			this.Table.addFilters('Statut', function(e, cel, data){
				switch(e){
					case 'created':
						return '';
					case 'paid':
						var button = new SimpleButton({text:$MUI('Confirmer')});
						button.on('click', function(evt){
							
							System.MyEvent.Command.openConfirm(evt, win, data);
							
						});
						break;
						
					case 'confirmed':
						var button = new SimpleButton({text:$MUI('Préparation terminée')});
						
						button.on('click', function(evt){
							
							System.MyEvent.Command.openPreparation(evt, win, data);
							
						});
						
						break;
						
					case 'prepared':
						var button = 	new SimpleMenu({text:$MUI('Choisissez une action')});
						var line1 =		new LineElement({text:$MUI('Le colis a été remis au transporteur')});
						var line2 =		new LineElement({text:$MUI('Le client a récupéré le colis')});
						
						button.appendChild(line1);
						button.appendChild(line2);
						
						line1.on('click', function(evt){
							
							System.MyEvent.Command.openStartDelivery(evt, win, data);
							
						});
						
						line2.on('click', function(evt){
							
							System.MyEvent.Command.openFinish(evt, win, data);
							
						});
						
						break;
					
					case 'delivery':
						var button = new SimpleButton({text:$MUI('Terminer')});
						
						button.on('click', function(evt){
							
							System.MyEvent.Command.openFinish(evt, win, data);
							
						});
						
						break;
						
					case 'finish':
						return '';
				}
				
				
				return button;
			});
			
			this.Table.addFilters('User', function(e, cel, data){
				try{
					var meta = data.Meta.evalJSON();
				}catch(er){
					return e;	
				}
				if(!Object.isUndefined(meta.Company) && meta.Company != ''){
					return meta.Company + ' <b style="color:#666">(pro) </b>';
				}
			});
			
			this.Table.addFilters(['Date_Payment','Date_Confirm', 'Date_Preparation', 'Date_Delivery_Start', 'Date_Delivery_End'], function(e, cel, data){
				if(e == '0000-00-00 00:00:00'){
					return '';	
				}
				
				return e.toDate().format('d/m/Y à h\\hi');
			});
			
			this.Table.addFilters('Amount_TTC', function(e, cel){
				cel.css('text-align', 'right');
				return (e *1).toFixed(2) + ' ' + System.MyEvent.Currency(); 
			});
			
			this.Table.on('complete', function(){
				
				if(panel.Open()){
					new fThread(function(){
						panel.select('.cel-date_confirm').invoke('hide');
						panel.select('.cel-date_preparation').invoke('hide');
						panel.select('.cel-date_delivery_start').invoke('hide');
					}, 0.4);	
				}
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			});
			
			this.Table.on('click', function(evt, data){
				System.MyEvent.Command.open(win, data);
			});
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		panel.PanelBody.Body().appendChild(this.Table);
		
		this.NavBar.getClauses().page = 0;
		
		this.load();
		
	},
	
	load:function(){
		
		var win = $WR.getByName('myevent');
		
		win.MyEvent.ProgressBar.show();
		win.createBubble().hide();
		
		var parameters = 'cmd=myevent.command.list&options=' + Object.EncodeJSON({Statut:['paid', 'confirmed', 'prepared', 'delivery']}) + '&clauses=' + this.NavBar.getClauses().toJSON();
		this.Table.setParameters(parameters);
		this.Table.load();
		
	},
	
	openConfirm:function(evt, win, data){
		var html = 		new HtmlNode();
		var title  =	new Node('h2', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Confirmer cette commande') + ' ?');
		var bubble =	win.createBubble(); 
		bubble.hide();
		//
		//
		//
		var submit = 	new SimpleButton({type:'submit', text:$MUI('Confirmer la commande')});
		submit.css('margin-right', '10px');
		
		submit.on('click', function(){
			bubble.hide();
			var command = new System.MyEvent.Command(data);
			
			command.confirm(function(){
				System.MyEvent.Command.load();
			});	
		});
		//
		//
		//
		var reset =	new SimpleButton({text:$MUI('Annuler')});
		reset.css('margin-right', '10px');
		
		reset.on('click', function(){
			bubble.hide();
		});
		
		html.appendChilds([
			title,
			submit,
			reset
		]);
		
		bubble.show(evt, html);
	},
	
	openPreparation:function(evt, win, data){
		var html = 		new HtmlNode();
		var title  =	new Node('h2', {style:'margin-top:0;margin-bottom:20px; font-size:15px'}, $MUI('Indiquer que la préparation de cette commande est terminée') + ' ?');
		var bubble =	win.createBubble(); 
		bubble.hide();
		//
		//
		//
		var submit = 	new SimpleButton({type:'submit', text:$MUI('Préparation terminée')});
		submit.css('margin-right', '10px');
		
		submit.on('click', function(){
			bubble.hide();
			var command = new System.MyEvent.Command(data);
			
			command.prepared(function(){
				System.MyEvent.Command.load();
			});	
		});
		//
		//
		//
		var reset =	new SimpleButton({text:$MUI('Annuler')});
		reset.css('margin-right', '10px');
		
		reset.on('click', function(){
			bubble.hide();
		});
		
		html.appendChilds([
			title,
			submit,
			reset
		]);
		
		bubble.show(evt, html);
	},
	
	openStartDelivery:function(evt, win, data){
		var html = 		new HtmlNode();
		var title  =	new Node('h2', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Indiquer que le colis a été remis au transporteur') + ' ?');
		var bubble =	win.createBubble(); 
		bubble.hide();
		//
		//
		//
		var submit = 	new SimpleButton({type:'submit', text:$MUI('Livraison en cours')});
		submit.css('margin-right', '10px');
		
		submit.on('click', function(){
			bubble.hide();
			var command = new System.MyEvent.Command(data);
			
			command.startDelivery(function(){
				System.MyEvent.Command.load();
			});	
		});
		//
		//
		//
		var reset =	new SimpleButton({text:$MUI('Annuler')});
		reset.css('margin-right', '10px');
		
		reset.on('click', function(){
			bubble.hide();
		});
		
		html.appendChilds([
			title,
			submit,
			reset
		]);
		
		bubble.show(evt, html);
	},
	
	openFinish:function(evt, win, data){
		var html = 		new HtmlNode();
		var title  =	new Node('h2', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Voulez-vous vraiment terminer la commande') + ' ?');
		var bubble =	win.createBubble(); 
		bubble.hide();
		//
		//
		//
		var submit = 	new SimpleButton({type:'submit', text:$MUI('Terminer la commande')});
		submit.css('margin-right', '10px');
		
		submit.on('click', function(){
			bubble.hide();
			var command = new System.MyEvent.Command(data);
			
			command.finish(function(){
				System.MyEvent.Command.load();
			});	
		});
		//
		//
		//
		var reset =	new SimpleButton({text:$MUI('Annuler')});
		reset.css('margin-right', '10px');
		
		reset.on('click', function(){
			bubble.hide();
		});
		
		html.appendChilds([
			title,
			submit,
			reset
		]);
		
		bubble.show(evt, html);
	},
	
/**
 * System.MyEvent.Command.remove(win command) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, command){
		command = new System.MyEvent.Command(command);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer le produit') + ' ' + command.Title + ' ? ', $MUI('Collection') + ' : ' +  command.Collection);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		
		box.setTitle($MUI('Suppression du produit')).a(splite).setIcon('delete').setType().show();
		
		$S.fire('myevent.command:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer le produit'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('myevent.command:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				command.remove(function(){
					box.hide();
						
					$S.fire('myevent.command:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('Le produit a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
					box.setIcon('documentinfo');
					
					System.MyEvent.setCurrent('command');
				}.bind(this));
				
			}.bind(this)
		});
	},
	
	Status:function(value){
		var list = [
			{value:'created', text:$MUI('Créée')},
			{value:'authorized', text:$MUI('Transaction authorisée par le serveur')},
			{value:'canceled', text:$MUI('Transaction annulée')},
			{value:'error', text:$MUI('Une erreur est survenue lors de la transaction')},
			{value:'paid', text:$MUI('Commande payée')},
			{value:'confirmed', text:$MUI('Vous avez confirmé la commande')},
			{value:'prepared', text:$MUI('La commande est prête à être livré')},
			{value:'delivery', text:$MUI('La commande est en cours de livraison')},
			{value:'finish', text:$MUI('Terminée')},
		];	
		
		for(var i = 0; i < list.length; i++){
			if(value == list[i].value){
				return  list[i];	
			}
		}
		
		return false;
	}
});