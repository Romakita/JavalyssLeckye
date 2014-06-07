/** section: Plugins
 * class System.MyStore.Command
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_command.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.Command = Class.createAjax({

/**
 * System.MyStore.Command#Command_ID -> Number
 **/
	Command_ID: 	0,
/**
 * System.MyStore.Command#Command_NB -> String
 * Varchar
 **/
	Command_NB: 			"",
/**
 * System.MyStore.Command#User_ID -> Number
 **/
	User_ID:				0,
/**
 * System.MyStore.Command#Date_Create -> Datetime
 **/
	Date_Create:			'0000-00-00 00:00:00',
/**
 * System.MyStore.Command#Date_Payment -> Datetime
 **/
	Date_Payment:			'0000-00-00 00:00:00',
/**
 * System.MyStore.Command#Date_Confirm -> Datetime
 **/
	Date_Confirm:			'0000-00-00 00:00:00',
/**
 * System.MyStore.Command#Date_Preparation -> Datetime
 **/
	Date_Preparation: 		'0000-00-00 00:00:00',
/**
 * System.MyStore.Command#Date_Delivery_Start -> Datetime
 **/
	Date_Delivery_Start: 	'0000-00-00 00:00:00',
/**
 * System.MyStore.Command#Date_Delivery_End -> Datetime
 **/
	Date_Delivery_End: 		'0000-00-00 00:00:00',
/**
 * System.MyStore.Command#Statut -> String
 * Varchar
 **/
	Statut: 				'created',
/**
 * System.MyStore.Command#Address_Billing -> String
 * Text
 **/
	Address_Billing: 		"",
/**
 * System.MyStore.Command#Address_Delivery -> String
 * Text
 **/
	Address_Delivery:		"",
/**
 * System.MyStore.Command#Mode_Delivery -> String
 * Text
 **/
	Mode_Delivery: 			"",
	
	In_Store:				0,
/**
 * System.MyStore.Command#Mode_Delivery -> String
 * Text
 **/
	Link_Follow_Delivery: 	"",
/**
 * System.MyStore.Command#Delivery_NB -> String
 * Text
 **/
	Delivery_NB: 	"",
/**
 * System.MyStore.Command#Amount_HT -> Float
 * Decimal
 **/
	Amount_HT: 				0.00,
/**
 * System.MyStore.Command#Eco_Tax -> Float
 * Decimal
 **/
	Eco_Tax: 				0.00,
/**
 * System.MyStore.Command#Cost_Delivery -> Float
 * Decimal
 **/
	Cost_Delivery:			0.00,
/**
 * System.MyStore.Command#TVA -> Float
 * Decimal
 **/
	TVA:					0.00,
/**
 * System.MyStore.Command#Discount -> Float
 * Decimal
 **/
	Discount:	 			0.00,
/**
 * System.MyStore.Command#Amount_TTC -> Float
 * Decimal
 **/
	Amount_TTC:				0.00,
/**
 * System.MyStore.Command#Down_Payment -> Float
 * Decimal
 **/
	Down_Payment:		.0,
/**
 * System.MyStore.Command#Bank -> String
 * Text
 **/	
	Bank:				'',
/**
 * System.MyStore.Command#Cheque_NB -> String
 * Text
 **/	
	Cheque_NB:			'',
/**
 * System.MyStore.Command#Cheque_Name -> String
 * Text
 **/	
	Cheque_Name:		'',
/**
 * System.MyStore.Command#Wallet_Card_ID -> String
 * Text
 **/
	Wallet_Card_ID: 		0,
/**
 * System.MyStore.Command#Transation_Object -> String
 * Text
 **/
	Transation_Object:		"",
/*
 * new System.MyStore.Command() 
 **/
 	initialize:function(obj){
		
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(Object.isUndefined(this.Meta)){
			this.Meta = {};
		}
		
		if(this.Address_Delivery == ''){
			this.Address_Delivery = new System.MyStore.Address();
		}
		
		if(this.Address_Billing == ''){
			this.Address_Billing = new System.MyStore.Address();
		}
	},
/**
 * System.MyStore.Command#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('mystore.command.commit', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
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
 * System.MyStore.Command#print(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode créée un nouveau document PDF à partir des informations de l'instance.
 **/
	print: function(callback, error){
		
		$S.exec('mystore.command.print', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
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
 * System.MyStore.Command#sendLinkPayment(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Envoye un lien permettant le règlement d'un tableau.
 **/
	sendLinkPayment: function(callback, error){
		
		$S.exec('mystore.command.send.link.payment', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
			onComplete: function(result){
				$S.trace(result.responseText);
				try{
					var link = result.responseText.evalJSON();
				}catch(er){
					
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
	
				if(Object.isFunction(callback)) callback.call(this, link);
			}.bind(this)
			
		});
	},
/**
 * System.MyStore.Command#confirm(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	confirm: function(callback, error){
		
		$S.exec('mystore.command.confirm', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
			onComplete: function(result){
				
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
 * System.MyStore.Command#prepared(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	prepared: function(callback, error){
		
		$S.exec('mystore.command.prepared', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
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
 * System.MyStore.Command#startDelivery(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	startDelivery: function(callback, error){
		
		$S.exec('mystore.command.start.delivery', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
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
 * System.MyStore.Command#finish(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	finish: function(callback, error){
		
		$S.exec('mystore.command.finish', {
			
			parameters: 'MyStoreCommand=' + this.toJSON(),
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
 * System.MyStore.Command#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('mystore.command.delete',{
			parameters: 'MyStoreCommand=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	},
	
	setUser:function(u){
		this.User = 	u.Name + " " + u.FirstName;
		this.User_ID = 	u.User_ID;
	}
});

Object.extend(System.MyStore.Command, {
/**
 * System.MyStore.Command.initialize() -> void
 **/	
	initialize:function(){
		$S.observe('system:startinterface', function(){
			if(!System.plugins.haveAccess('MyStore')){
				return;	
			}
			System.MyStore.Command.Count();
		});
		
		$S.observe('mystore.command:open.submit.complete', function(){
			var win = $WR.getByName('mystore');
			
			if(win){
				System.MyStore.Command.listing();	
			}
		});
		
		$S.observe('mystore.command:remove.submit.complete', function(){
			var win = $WR.getByName('mystore');
			
			if(win){
				System.MyStore.Command.listing();	
			}
		});
	},
/**
 * System.MyStore.Command.Count() -> void
 **/	
	Count:function(){
		
		$S.exec('mystore.command.count', {
			parameters:	'options=' + escape(Object.toJSON({Statut:['created manually', 'paid', 'confirmed', 'prepared', 'delivery']})),
			onComplete:	function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(er);
					return;	
				}
				try{
					
				this.CurrentCount = obj;
					
				if(obj != 0){
					
					try{
						System.MyStore.BtnCommand.setTag(obj);
					}catch(er){}
					
					if(Object.isUndefined(this.LineNotify)){
						this.LineNotify = System.Notify.add({
							appName:	'MyStore',
							groupName:	'Commandes',
							appIcon:	'mystore',
							title:		$MUI('Vous avez')+' '+ obj+' '+ $MUI('commande(s) en attente')
						});
						
						this.LineNotify.on('click', function(){
							var win = System.MyStore.open('command');
							//win.BlogPress.NavBar.PrintDraft.click();
						});
						
					}else{
						this.LineNotify.setText($MUI('Vous avez')+' '+ obj+' '+ $MUI('commande(s) en attente'));	
					}
					
					
				}else{
					
					if(this.LineNotify){
						this.LineNotify.parentNode.removeChild(	this.LineNotify);
					}
					
					try{
						System.MyStore.BtnCommand.setTag('');
					}catch(er){}
				}
				
				}catch(er){$S.trace(er)}
				
			}.bind(this)
		});
	},
/**
 * System.MyStore.Command.openFromSearch() -> void
 **/	
	openFromSearch:function(data){
		System.MyStore.Command.open(data);
	},
/**
 * System.MyStore.Command.openCreate() -> void
 *
 * Cette méthode ouvre le formulaire de création d'une commande.
 **/	
	openCreate:function(){
		
		var win = 	$WR.getByName('mystore');
		var box = 	win.createBox();
		var forms = box.createForm();
		
		var splite = new SpliteIcon($MUI('Création d\'une commande'));
		splite.setIcon('mystore-create-command-48');
		box.a(splite);
		//
		//
		//
		forms.User_ID = new Select({
			parameters:'cmd=user.list&options=' + Object.EncodeJSON({default:true, Role_ID:'Client'})	
		});
		forms.User_ID.Large(true);
		forms.User_ID.load();
		forms.User_ID.Value(0);
		forms.User_ID.css('width', '99%');
		forms.User_ID.Input.Value(' - Choisissez -');
		
		box.a(new Node('h4', $MUI('Choisissez un client')));
		
		var table = new TableData();
		table.css('width', '99%');
		table.addHead($MUI('Client') + ' : ', {style:'width:150px'}).addCel(forms.User_ID).addRow();
		box.a(table);
		
		box.a(new Node('h4', $MUI('Ou créer fiche client')));
		//
		//
		//
		forms.Civility = new Select();
		forms.Civility.Large(true);
		forms.Civility.setData([
			{text:$MUI('M.'), value: 'M.'},
			{text:$MUI('Mme.'), value: 'Mme.'},
			{text:$MUI('Mlle.'), value: 'Mlle.'}
		]);
		forms.Civility.selectedIndex(0);
		//
		//Civility
		//
		forms.Name = 	new Input({type:'text', maxLength: 100});
		forms.Name.Large(true);
		forms.Name.css('width', '98%');
		//
		//FirstName
		//
		forms.FirstName = 	new Input({type:'text', maxLength: 100});
		forms.FirstName.Large(true);
		forms.FirstName.css('width', '98%');
		
		forms.addFilters('Login', function(){
			return (forms.FirstName.Value()+'.'+forms.Name.Value()).toLowerCase();
		});
		
		forms.addFilters('Password', function(){
			return (forms.FirstName.Value()+'.'+forms.Name.Value()).toLowerCase().md5(10);
		});
		//
		//Email
		//
		forms.EMail = 	new InputButton({type:'text', maxLength: 100, sync:true, icon:'system-mail'});
		forms.EMail.Large(true);
		forms.EMail.css('width', '99%');
		forms.EMail.SimpleButton.on('click', function(){
			if(win.forms.EMail.Text() == '') return;
			System.Opener.open('mailto', win.forms.EMail.Text());
		});
		
		forms.addFilters('EMail', 'Text');
		//
		//Phone
		//
		forms.Phone = 	new InputButton({type:'text', maxLength: 30, sync:true, icon:'system-phone'});
		forms.Phone.Large(true);
		forms.Phone.css('width', '99%');
		forms.Phone.SimpleButton.on('click', function(){
			if(forms.Phone.Text() == '') return;
			System.Opener.open('tel', win.forms.Phone.Text());
		});
		
		forms.addFilters('Phone', 'Text');
		//
		//Mobile
		//
		forms.Mobile = 	new InputButton({type:'text', maxLength: 30, sync:true, icon:'system-phone'});
		forms.Mobile.Large(true);
		forms.Mobile.css('width', '99%');
		forms.Mobile.SimpleButton.on('click', function(){
			if(win.forms.Mobile.Text() == '') return;
			System.Opener.open('tel', win.forms.Mobile.Text());
		});
		
		forms.addFilters('Mobile', 'Text');
		
		var table = 	new TableData();
		table.css('width', '99%');
		table.addHead($MUI('Civilité'), {style:'width:150px'}).addCel(forms.Civility).addCel(' ').addRow();
		table.addHead($MUI('Nom')).addCel(forms.Name).addRow();
		table.addHead($MUI('Prénom')).addCel(forms.FirstName).addRow();
		table.addHead($MUI('E-mail')).addCel(forms.EMail).addRow();
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addRow();
		table.addHead($MUI('Téléphone')).addCel(forms.Phone).addRow();
		table.addHead($MUI('Mobile')).addCel(forms.Mobile).addRow();
		
		box.a(table);
				
		box.setTheme('flat liquid white');
		box.setType().show();
				
		box.submit({
			text:$MUI('Créer la commande'),
			click:function(){
				var flag = box.box.createFlag();
				
				if(forms.User_ID.Value() == 0){
					
					if(forms.Name.Value() == ''){
						flag.setText($MUI('Veuillez choisir un client')).color('red').setType(Flag.RIGHT).show(forms.User_ID, true);
						return true;
					}
					
					if(forms.FirstName.Value() == ''){
						flag.setText($MUI('Veuillez choisir le prénom de votre client')).color('red').setType(Flag.RIGHT).show(forms.FirstName, true);
						return true;
					}
					
					if(forms.EMail.Text() == ''){
						flag.setText($MUI('Veuillez choisir une adresse e-mail pour votre client')).color('red').setType(Flag.RIGHT).show(forms.EMail, true);
						return true;
					}
					
					//Creation de la fiche client
					var user = new System.User(forms.save());
					user.User_ID = 		0;
					user.Is_Active = 	System.User.ACCESS_ENABLE;
					user.Role_ID = 		'Client';
					
					box.box.createBox().wait();
									
					user.commit(function(){
						box.box.createBox().hide();
						box.hide();
						
						var command = new System.MyStore.Command();
						command.setUser(user);
						command.Statut = 'created manually';
						
						System.MyStore.Command.open(command);
						System.User.open(user);
						
						$S.fire('mystore.command:open.submit.complete');
						
					}, function(responseText){
						
						box.box.createBox().hide();
						
						switch(responseText){
							case 'user.name.exist':
								flag.setText($MUI('L\'utilisateur (nom et prénom) est déjà enregistré') + ' !');
								flag.color('red').show(forms.Name);
								return;
							
							case 'user.login.exist':
								box.box.createBox().show();
								user.getAlternativeLogin(function(list){
									
									user.Login = list[0];
									
									user.commit(function(){
										
										var command = new System.MyStore.Command();
										command.User_ID = user.User_ID;
										command.Statut = 'created manually';
										
										
										System.User.open(user);
										
										command.commit(function(){
											box.box.createBox().hide();
											box.hide();
											System.MyStore.Command.open(command);
											
											$S.fire('mystore.command:open.submit.complete');
										}, function(){
											
										});
										
									});
									
								});
								
								
								return;
							
							case 'user.email.exist':
								flag.setText('<p class="icon-documentinfo">' + $MUI('L\'adresse E-mail est déjà enregistré par un autre utilisateur') + '.</p>')
								flag.color('grey').show(forms.EMail);
								return;	
						}
						
					});
					
					return true;
				}
				
				var command = new System.MyStore.Command();
				command.setUser(forms.User_ID.getSelectedData());
				command.Statut = 'created manually';
				
				command.commit(function(){
					box.box.createBox().hide();
					box.hide();
					
					System.MyStore.Command.open(command);
					
					$S.fire('mystore.command:open.submit.complete');
				}, function(){
					
				});
				return true;
			}
		});
		
		box.reset({
			click:function(){
				box.setTheme();
			}
		});
	},
/**
 * System.MyStore.Command.open([facture]) -> Window
 *
 * Cette méthode ouvre le formulaire de gestion d'une commande.
 **/	
	open:function(data){
		try{
		$S.trace(data);	
		var options = {
			instance:	'mystore.command',
			type:		'command',
			icon:		'mystore-command'
		};
				
		var win = $WR.unique(options.instance, {
			autoclose:	true,
			action: function(){
				this.open(data);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		win.options = options;
		//overide
		win.overideClose({
			submit:this.submit.bind(this), 
			change:this.checkChange.bind(this),
			close: function(){}.bind(this)
		});
				
		var self = this;
		//création de l'objet forms
		var forms = win.createForm({
			update:	false,
			
			active:	function(){
				if(this.update) return;                                                                                                                                                                                         
				this.update = true;
				//desactivation de la synchro avec la bdd
				win.forms.submit.setTag("<b>!</b>");
				
				win.forms.submit.Tag.on('mouseover', function(){
					$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('Le formulaire a subi une ou plusieurs modification(s)') + '.</p>').setType(FLAG.RT).color('grey').show(this, true);
				});
			},
			
			deactive: function(){
				this.update = false;
				
				win.forms.submit.setTag("");
			//	win.forms.submit.css('padding-right', win.forms.submit.paddingRight);
				
				win.forms.submit.setText($MUI('Enregistrer'));
				win.forms.submit.Tag.stopObserving('mouseover');
				
				win.Details.load();
			},
			
			onChange:function(key, o, n){
				$S.trace(key + ' => Avant : ' + Object.toJSON(o) + ', Après : ' + Object.toJSON(n));
				this.active();
			}
		});
		
		//Vérification régulière de l'état de la fiche lorsqu'un click est intercepté
		win.body.on('click', function(){
			try{
				this.checkChange(win);
			}catch(er){}
		}.bind(this));
		//
		// Window
		//
		
		var flag = 	win.createFlag().setType(FLAG.RIGHT);
		
		win.setData(new System.MyStore.Command(data));
		
		//win.setTheme('flat white');
		win.NoChrome(true);
		win.Resizable(false);
		win.Cacheable(true);
		win.createBox();
		win.setIcon(options.icon);
		win.ChromeSetting(true);
		
		//win.setTitle($MUI('Gestion du client') + ' ' + client.Nom);
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
		
		forms.BtnGeneral = 		win.TabControl.addPanel($MUI('Informations'), this.createPanel(win));
		forms.BtnDelivery = 	win.TabControl.addPanel($MUI('Suivi'), this.createPanelInfos(win)).setIcon('mystore-delivery');
		
		
		
		
		
		//
		//
		//
		/*forms.BtnSend = new SimpleButton({icon:'mail', text:'Envoyer'});
		forms.BtnSend.on('click', function(){
			
			if(System.MyStore.Command.checkChange(win)){
				System.MyStore.Command.submit(win, function(){
					forms.BtnSend.click();
				});
				return;
			}
			
			var box = win.createBox();
			
			var splite = new SpliteIcon($MUI('Voulez-vous vraiment envoyer le document au client') + ' ?');
			splite.setIcon('question-48');
			
			box.a(splite);
			
			if(win.getData().Statut.match(/draft/)){
				
				var model = new Select();
				model.Large(true);
				
				if(win.getData().Statut == 'draft'){
					model.setData([
						{text:'Bon de commande', value:'bc'},
						{text:'Devis', value:'devis'},
						{text:'Facture', value:'facture'}
					]);
				}else{
					model.setData([
						{text:'Devis', value:'devis'},
						{text:'Facture', value:'facture'}
					]);	
				}
				
				model.selectedIndex(0);
				
				var table = new TableData();
				table.addHead($MUI('Modèle d\'impression') + ' : ').addCel(model);
				box.a(table);
			}
			
			box.setTheme('flat liquid black');
			box.setType().show();
			
			box.submit({
				text:$MUI('Envoyer'),
				click:function(){	
					
					win.createBox().hide();
					win.createBox().wait();
					
					win.getData().send(win.getData().Statut.match(/draft/) ? model.Value() : '', function(){
								
						var box = 		win.createBox();
						
						box.hide();
						
						var splite = 	new SpliteIcon($MUI('E-mail envoyé au client'));
						splite.setIcon('mail-forward-48');
						
						box.setTitle('Confirmation').setIcon('documentinfo').a(splite).setType('CLOSE').show();
						
					});
					
					return true;
				}
			});
			
		});
		//
		//
		//
		forms.BtnPrint = new SimpleButton({icon:'print', text:'Imprimer'});
		forms.BtnPrint.on('click', function(){
			
			if(System.MyStore.Command.checkChange(win)){
				System.MyStore.Command.submit(win, function(){
					forms.BtnPrint.click();
				});
				return;
			}
					
			var box = win.createBox();
			
			var splite = new SpliteIcon($MUI('Impression du document'), $MUI('Veuillez choisir le modèle d\'impression') + ' : ');
			splite.setIcon('print-48');
			
			box.a(splite);
			
			var model = new Select();
			model.Large(true);
			
			if(win.getData().Statut == 'draft'){
				model.setData([
					{text:'Bon de commande', value:'bc'},
					{text:'Devis', value:'devis'},
					{text:'Facture', value:'facture'}
				]);
				
				model.selectedIndex(0);
			}else{
				model.setData([
					{text:'Devis', value:'devis'},
					{text:'Facture', value:'facture'}
				]);	
				
				if(win.getData().Statut.match(/paid/)){
					model.selectedIndex(1);
				}else{
					model.selectedIndex(0);	
				}
			}
			
			var table = new TableData();
			table.addHead($MUI('Modèle d\'impression') + ' : ').addCel(model);
			box.a(table);
			
			box.setTheme('flat liquid white');
			box.setType().show();
			
			box.submit({
				text:$MUI('Imprimer'),
				click:function(){
					
					box.hide();
					box.wait();
										
					win.getData().print(model.Value(), function(link){
						box.hide();		
						System.openPDF(link);
						
					});
					
					return true;
				}
			});
			
		});
		
		//
		//
		//
		forms.BtnDuplicate = new SimpleButton({icon:'system-duplicate', text:'Dupliquer'});
		forms.BtnDuplicate.on('click', function(){
						
			if(System.MyStore.Command.checkChange(win)){
				System.MyStore.Command.submit(win, function(){
					forms.BtnDuplicate.click();
				});
				return;
			}
			
			var box = win.createBox();
			
			var splite = new SpliteIcon($MUI('Voulez-vous vraiment dupliquer ce document') + ' ?');
			splite.setIcon('question-48');
			
			box.a(splite);
			
			box.setTheme('flat liquid black');
			box.setType().show();
			
			box.submit({
				text:$MUI('Dupliquer'),
				click:function(){
					box.hide();
					
					var data = win.getData();
										
					System.AlertBox.wait();
					
					win.close();
					
					data.duplicate(function(){
					
						System.AlertBox.hide();
						
						win = System.MyStore.Command.open(this);
						
						$S.fire('pmo:billing.open.submit.complete', win);
						
						var splite = new SpliteIcon($MUI('La facture a correctement été dupliqué'));
						splite.setIcon('filesave-ok-48');
						
						var box = win.createBox();
						
						box.setTitle($MUI('Confirmation')).setIcon('documentinfo');	
						box.a(splite).setType('NONE').Timer(5).show();
					});
					
					return true;
				}
			});
			
		});
		
		win.TabControl.Header().appendChild(forms.BtnSend);
		win.TabControl.Header().appendChild(forms.BtnPrint);
		win.TabControl.Header().appendChild(forms.BtnDuplicate);*/
		
		//if(!win.getData().Statut.match(/paid/)){
			win.footer.appendChilds([forms.submit, forms.close]);		
		//}else{
		//	win.footer.appendChilds([forms.close]);
		//}
		
		document.body.appendChild(win);	
		
		win.resizeTo(1024, document.stage.stageHeight);
		
		win.centralize(true);
		//event
		forms.submit.on('click', function(evt){
			evt.stop();
			this.submit(win);
		}.bind(this));
		
		forms.close.on('click', function(){
			win.close();
		}.bind(this));	
		
		$S.fire('mystore.command:open', win);
		
		return win;	
		}catch(er){$S.trace(er)}
	},
/**
 * System.MyStore.Command.checkChange(win) -> Boolean
 **/	
	checkChange:function(win){
		if(win.readOnly) return false;
		if(win.forms.update) return true;
		
		return win.forms.checkChange(win.getData());
	},
/**
 * System.MyStore.Command.submit(win) -> Panel
 **/
	submit:function(win){
		
		var flag = 	win.createFlag();
		var forms = win.createForm();
		var box =	win.createBox();
		
		var evt = new StopEvent(win);
		$S.fire('mystore.command:open.submit', evt);
		
		if(evt.stopped) return true;

		//sauvegarde des informations
		win.forms.save(win.getData());
		
		win.getData().Details = [];
		
		if(forms.deleteDetails){
			win.getData().deleteDetails = forms.deleteDetails;
		}
		
		win.Details.getData().each(function(e){
			win.getData().Details.push(new System.MyStore.Command.Product(e));
		});
			
		win.ActiveProgress();
		
		$S.trace(win.getData());
		
		win.getData().commit(function(){
			
			forms.deactive();
			
			$S.fire('mystore.command:open.submit.complete', win);
			
			var splite = new SpliteIcon($MUI('La commande a correctement été mise à jour'));
			splite.setIcon('valid-48');
			
			box.setTheme('flat white');
			box.setIcon('documentinfo');
				
			box.a(splite).setType('CLOSE').Timer(5).show();
													
		}.bind(this));
		
		return ;
		
	},
/**
 * System.MyStore.Command.createPanel(win) -> Panel
 **/
	createPanel:function(win){
		var panel = new Panel();
		var data =	win.getData();
		var forms = win.createForm();
		//
		//
		//
		forms.loadedDelivery = false;
		forms.Mode_Delivery = new Select({
			parameters: 'cmd=mystore.option.delivery.list&options=' + Object.EncodeJSON({default:'- ' + $MUI('choisissez') +' -' })
		});
		forms.Mode_Delivery.Value(data.Mode_Delivery == '' ? 0 : data.Mode_Delivery);
		forms.Mode_Delivery.load();
		forms.Mode_Delivery.on('complete', function(){
			forms.loadedDelivery = true;
		});
		forms.Mode_Delivery.css('width', '99%');
		
		forms.Mode_Delivery.on('change', function(){
			win.Details.removeClassName('no-cost-delivery');
			
			forms.Total.select('.delivery').each(function(e){
				e.parentNode.show();	
			});
			
			if(forms.Mode_Delivery.Value() != 0){
				var data = forms.Mode_Delivery.getSelectedData();
							
				if(data.Type.match(/in-store/)){//pas de coût de livraison
					
					win.Details.addClassName('no-cost-delivery');
					
					forms.Total.select('.delivery').each(function(e){
						e.parentNode.hide();	
					});
					
				}else{
					
					if(!data.Type.match(/add/)){//Cout de livraison fixe
						
						forms.Cost_Delivery.Value(data.Cost_Delivery);
						 
						win.Details.addClassName('no-cost-delivery');
						
						forms.Total.select('.delivery-calc').each(function(e){
							e.parentNode.hide();	
						});
					}
					
				}			
			}
			
			this.update(win);
			
		}.bind(this));
		//
		//
		//
		forms.TVA = new Input({type:'number', decimal:1, empty:false});
		forms.TVA.Value(data.TVA);
		forms.TVA.addClassName('tiny');
		forms.TVA.on('keyup', function(){
			win.forms.active();
			
			System.MyStore.Command.update(win);
		});
		
		//
		//
		//
		forms.Cost_Delivery = new Input({type:'number', decimal:2, empty:false});
		forms.Cost_Delivery.Value(data.Cost_Delivery);
		forms.Cost_Delivery.css('width', 'calc(100% - 6px)');
		forms.Cost_Delivery.on('keyup', function(){
			win.forms.active();
			System.MyStore.Command.update(win);
		});
		//
		//
		//
		forms.Discount = new Input({type:'number', decimal:1, empty:false});
		forms.Discount.Value(data.Discount);
		forms.Discount.addClassName('tiny');
		forms.Discount.on('keyup', function(){
			win.forms.active();
			System.MyStore.Command.update(win);
		});
		//
		//
		//
		forms.Down_Payment = new Input({type:'number', decimal:2, empty:false});
		forms.Down_Payment.Value(data.Down_Payment);
		forms.Down_Payment.css('width', 'calc(100% - 6px)');
		forms.Down_Payment.on('keyup', function(){
			win.forms.active();
			
			System.MyStore.Command.update(win);
		});
		
		var table = new TableData();
		table.addClassName('liquid mystore-summary-info');
				
		table.addHead($MUI('N° Commande')).addCel(data.Command_NB, {style:'width:150px;font-weight:bold'});
		table.addHead($MUI('Date création')).addCel(data.Date_Create.format('l d F Y'), {style:'width:200px;font-weight:bold'});
		table.addHead($MUI('Mode livraison')).addCel(forms.Mode_Delivery, {style:'font-weight:bold; width:230px;'});
		
		table.addRow();
		
		table.addHead($MUI('Client')).addCel(data.User, {style:'font-weight:bold; background-position: right center; cursor: pointer;', className:'icon-search'});
		table.addHead($MUI('Date paiement')).addCel(data.Date_Payment == '0000-00-00 00:00:00' ? $MUI('Non payé') : data.Date_Payment.format('l d F Y'), {style:'font-weight:bold'});
		
		table.getCel(1,1).on('click', function(){
			System.User.GetAndOpen(win.getData().User_ID);
		});
		
		if(data.Wallet_Card_ID == 0){//transaction manuelle par chèque ou RIB 
		
			var tableInfo = new TableData();
			//
			// Mode paiement
			//
			forms.Mode_Payment = 	new Select();
			forms.Mode_Payment.setData(this.getPaymentMethods())
			forms.Mode_Payment.Value(data.Mode_Payment.Name);
			forms.Mode_Payment.css('width', '99%');
						
			forms.addFilters('Mode_Payment', function(){
				
				if(this.Bank.Text() != ''){
					System.MyStore.Command.addBankName(	this.Bank.Text());
				}
				
				return {
					Name: 			this.Mode_Payment.Value(),
					Bank: 			this.Bank.Text(),
					Cheque_NB: 		this.Cheque_NB.Value(),
					Cheque_Name: 	this.Cheque_Name.Value()
				};
			});
			
			forms.Mode_Payment.on('change', function(){
				if(this.Value() == 'Chèque'){
					tableInfo.show();
				}else{
					tableInfo.hide();
				}
			});
			//
			//
			//
			forms.Bank = new Select();
			forms.Bank.Input.readOnly = false;
			forms.Bank.Value(data.Mode_Payment.Bank);
			forms.Bank.setData(this.getBankNames());
			forms.Bank.css('width', '99%');	
			//
			//
			//
			forms.Cheque_NB = new Input({type:'text', value:data.Mode_Payment.Cheque_NB});
			forms.Cheque_NB.css('width', '95%');
			//
			//
			//
			forms.Cheque_Name =	new Input({type:'text', value:data.Mode_Payment.Cheque_Name});
			forms.Cheque_Name.css('width', '95%');	
			
			table.addHead($MUI('Mode Paiement')).addCel(forms.Mode_Payment, {style:'font-weight:bold'});
						
			tableInfo.addClassName('liquid mystore-summary-info');
			tableInfo.addHead('Banque').addCel(forms.Bank, {colSpan:2, style:'font-weight:bold'}).addRow();
			tableInfo.addHead('N° / Nom chèque').addCel(forms.Cheque_NB, {style:'font-weight:bold;width:100px'}).addCel(forms.Cheque_Name, {style:'font-weight:bold;width:100px'});
			
			if(forms.Mode_Payment.Value() == 'Chèque'){
				tableInfo.show();
			}else{
				tableInfo.hide();
			}	
			
		}else{//transaction automatique
			table.addHead($MUI('Mode Paiement')).addCel(data.Mode_Payment.Name, {style:'font-weight:bold'});
			
			var tableInfo = new TableData();
			
			tableInfo.addClassName('liquid mystore-summary-info');
			
			switch(data.Mode_Payment.Type){
				case 'paypal':
					tableInfo.addCel('Compte paypal').addCel(data.Transaction_Object.EMAIL, {style:'font-weight:bold'}).addRow();
					tableInfo.addCel('Paypal ID').addCel(data.Transaction_Object.PAYERID, {style:'font-weight:bold'});
					break;	
			}
		}
		
		table.addRow();
				
		var nodeStatut;
		table.addHead('Statut', {style:'vertical-align:top'}).addCel(System.MyStore.Command.Status(data.Statut).text, {style:'font-weight:bold;vertical-align:top', colSpan:2}).addCel('', {style:'vertical-align:top'}).addCel(tableInfo, {colSpan:2});
						
		panel.appendChild(table);
		
		var nodeStatut = table.getCel(2, 1);
		var tdStatut = table.getCel(2, 2);
		
		switch(data.Statut){
			case 'created manually':
				var button = new SimpleButton({text:$MUI('Envoyer le lien de paiement')});
				button.on('click', function(evt){
					
					System.MyStore.Command.openSendLinkPayment(evt, data, this, function(){
						//win.createBox();
					});
					
				});
				
				tdStatut.appendChild(button);
				
				break;				
			case 'paid':
				var button = new SimpleButton({text:$MUI('Confirmer commande')});
				button.on('click', function(evt){
					
					System.MyStore.Command.openConfirm(evt, win, data, this, function(o){
						win.getData().Statut = 	o.Statut;
						nodeStatut.innerHTML = 'Commande confirmée';
						button.hide();
					});
					
				});
				
				tdStatut.appendChild(button);
				
				break;
				
			case 'confirmed':
				var button = new SimpleButton({text:$MUI('Commande préparée')});
				
				button.on('click', function(evt){
					
					System.MyStore.Command.openPreparation(evt, win, data, this);
					
					win.getData().Statut = 	o.Statut;
					nodeStatut.innerHTML = 'Commande préparée';
					button.hide();
					
				});
				
				tdStatut.appendChild(button);
				
				break;
				
			case 'prepared':
				
				if(data.In_Store == 1){
					var button =	new SimpleButton({text:$MUI('Colis récupéré')});
					
					button.on('click', function(evt){
						System.MyStore.Command.openFinish(evt, win, data, this);
						
						win.getData().Statut = 	o.Statut;
						nodeStatut.innerHTML = 'Colis récupéré';
						button.hide();
					
					});
					
				}else{
					var button =	new SimpleButton({text:$MUI('Livraison en cours')});
					
					button.on('click', function(evt){
						System.MyStore.Command.openStartDelivery(evt, win, data, this);
						win.getData().Statut = 	o.Statut;
						nodeStatut.innerHTML = 'Livraison en cours';
						button.hide();
					});
				}
				
				tdStatut.appendChild(button);
				
				break;
			
			case 'delivery':
				var button = new SimpleButton({text:$MUI('Terminer')});
				
				button.on('click', function(evt){
					
					System.MyStore.Command.openFinish(evt, win, data, this);
					
					win.getData().Statut = 	o.Statut;
					nodeStatut.innerHTML = 'Facturé';
					button.hide();
					
				});
				
				tdStatut.appendChild(button);
				
				break;
			
			default:
			
				break;
		}
				
		var button = new SimpleButton({nofill:true, icon:'add-element', text:$MUI('Ajouter un détail')});
		button.on('click', function(){
			
			System.MyStore.Command.Product.open(win, function(data){
				
				if(Object.isArray(data)){
					win.Details.addRows(data);
				}else{
					win.Details.addRows([data]);
				}
				
				forms.active();
				
				System.MyStore.Command.update(win);
			});
			
		});
		
		panel.appendChild(new Node('h4', [$MUI('Détails'), button]));
				
		win.Details = new SimpleTable({
			range1:		2000,
			range2:		2000,
			range3:		2000,
			sort:		false,
			readOnly:	true,
			scrollbar:	true,
			sum:		'Qte',
			text:		'Qte',
			parameters: 'cmd=mystore.command.product.list&options=' + Object.EncodeJSON({Command_ID:data.Command_ID})
		});
		
		win.Details.body.css('height', '250px');
		win.Details.setTheme('excel');
		
		var options = {};
		var ispaid = data.Statut.match(/paid/);
				
		win.Details.addHeader({
			Action: 				{title:'', width:20, type:'action', style:'text-align:center'},
			Reference: 				{title:$MUI('Référence'), style:'text-align:center;padding: 0px'},
			Eco_Tax: 				{title:$MUI('Eco. taxe') + ' (' + System.MyStore.Currency()+')', width:75, style:'text-align:center;padding:0px;'},
			Cost_Delivery:			{title:$MUI('Coût livraison') + ' (' + System.MyStore.Currency()+')', width:100, style:'text-align:center; padding:0px'},
			Price:					{title:$MUI('PUHT') + ' (' + System.MyStore.Currency()+')', width:100, style:'text-align:center; padding:0px'},
			Qte:					{title:$MUI('Qté'), width:75, style:'text-align:center; padding:0px'},
			Total:					{title:$MUI('Total' + ' (' + System.MyStore.Currency())+')', width:100, style:'text-align:center;'}
		});
			
		panel.appendChild(win.Details);
		
		win.Details.addFilters('Action', function(e, cel, data){
			e.open.hide();
			
			data.row = cel.parentNode;
			
			return e;
		});
		
		win.Details.addFilters('Reference', function(e, cel, data){
			cel.css('text-align', 'left');
			
			data.Reference = new Input({type:'text', value:e});
			return data.Reference;
				
		});
		
		win.Details.addFilters('Eco_Tax', function(e, cel, data){
			cel.css('text-align', 'right');
			
			data.Eco_Tax = new Input({type:'number', value:1 * e, decimal:2, empty:false});
			data.Eco_Tax.css('text-align', 'right');
			
			data.Eco_Tax.on('keyup', function(){
				win.forms.active();				
				System.MyStore.Command.update(win);
				
			});
			
			
			return data.Eco_Tax;
		});
		
		win.Details.addFilters('Price', function(e, cel, data){
			cel.css('text-align', 'right');
			
			data.Price = new Input({type:'number', value:1 * e, decimal:2, empty:false});
			data.Price.css('text-align', 'right');
			
			data.Price.on('keyup', function(){
				win.forms.active();
				cel.parentNode.select('.cel-total')[0].innerHTML = (data.Price.Value() * data.Qte.Value()).toFixed(2) + ' ' + System.MyStore.Currency();
				
				System.MyStore.Command.update(win);
				
			});
			
			return data.Price;
				
		});
		
		win.Details.addFilters('Cost_Delivery', function(e, cel, data){
			cel.css('text-align', 'right');
			
			data.Cost_Delivery = new Input({type:'number', value:1 * e, decimal:2, empty:false});
			data.Cost_Delivery.css('text-align', 'right');
			
			data.Cost_Delivery.on('keyup', function(){
				win.forms.active();				
				System.MyStore.Command.update(win);
			});
			
			return data.Cost_Delivery;
				
		});
				
		win.Details.addFilters('Qte', function(e, cel, data){
			cel.css('text-align', 'right');
			
			
				data.Qte = new Input({type:'number', value:e, decimal:0, empty:false});
				data.Qte.css('text-align', 'right');
				
				data.Qte.on('keyup', function(){
					win.forms.active();
					cel.parentNode.select('.cel-total')[0].innerHTML = (data.Price.Value() * data.Qte.Value()).toFixed(2) + ' ' + System.MyStore.Currency();
					
					System.MyStore.Command.update(win);
					
				});
				
				return data.Qte;
				
		});
		
		
		win.Details.addFilters('Total', function(e, cel, data){
			cel.css('text-align', 'right');
			
			return (1 * data.Price.Value() * data.Qte.Value()).toFixed(2) + ' '+ System.MyStore.Currency();
		});
		
		win.Details.on('complete', function(){
			new Timer(function(pe){
				if(forms.loadedDelivery){
					System.MyStore.Command.update(win);
					pe.stop();
				}
			}, 0.1).start();
		});
		
		win.Details.on('remove', function(evt, data){
			var detail = 	new System.MyStore.Command.Product(data);
			var box = 		win.createBox();
			
			var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer ce détail du document') + ' ? ', $MUI("Détail") + ' : ' + detail.Reference);
			splite.setIcon('question-48'); 
			
			box.setTheme('flat liquid black');
			box.a(splite);
			box.setType().show();
			
			box.submit({
				text:$MUI('Supprimer'),
				click:function(){
					
					box.setTheme();
					
					var forms = win.createForm();
						
					data.row.parentNode.removeChild(data.row);
										
					if(!forms.deleteDetails){
						forms.deleteDetails = [];
					}
					
					forms.deleteDetails.push(detail);
					forms.active();
					
					var array = win.Details.getData();
					
					win.Details.clear();
					
					array.each(function(e){
						e.Reference = 		e.Reference.Value();
						e.Eco_Tax = 		e.Eco_Tax.Value();
						e.Price = 			e.Price.Value();
						e.Cost_Delivery =	e.Cost_Delivery.Value();
						e.Qte = 			e.Qte.Value();
					});
					
					win.Details.addRows(array);
					
					System.MyStore.Command.update(win);
					
				}				
			});
			
			box.reset({
				click:function(){
					box.setTheme();
				}
			});
			
		});
		
		win.Details.load();
		//
		//
		//
		forms.Address_Billing = new System.MyStore.AddressNode(data.Address_Billing);
		forms.Address_Billing.setTitle('Adresse de facturation').setUserID(data.User_ID);
				
		panel.appendChild(forms.Address_Billing);
		//
		//
		//
		forms.Address_Delivery = new System.MyStore.AddressNode(data.Address_Delivery);
		forms.Address_Delivery.setTitle('Adresse de livraison').setUserID(data.User_ID);
				
		panel.appendChild(forms.Address_Delivery);
		//
		//
		//
		forms.Total = new TableData();
		forms.Total.addClassName('liquid mystore-result-billing');
		
		forms.Total.addHead('Total HT :', {colSpan:3}).addField(' ', {style:'font-weight:bold;width:100px'}).addRow();
		forms.Total.addHead('dont éco-taxe :', {colSpan:3}).addCel(' ', {style:'width:100px;text-align:right'}).addRow();
		
		forms.Total.addHead('Remise').addCel(forms.Discount, {style:'width:40px; text-align:right'}).addCel('% :').addField('', {style:'background:transparent'}).addRow();
		forms.Total.addHead('TVA').addCel(forms.TVA, {style:'text-align:right'}).addCel("% :").addField('', {style:'background:transparent'}).addRow();
		forms.Total.addHead('Coût livraison calculé :', {className:'delivery delivery-calc', colSpan:3}).addField(' ', {style:'background:transparent;'}).addRow();
		forms.Total.addHead('Coût livraison appliqué :', {className:'delivery delivery-custom', colSpan:3}).addField(forms.Cost_Delivery, {style:'background:transparent;padding:0px'}).addRow();
		forms.Total.addHead('Total TTC :', {colSpan:3}).addField('', {style:'font-weight:bold;'}).addRow();
		
		forms.Total.addHead('Acompte :', {colSpan:3}).addField(forms.Down_Payment, {style:'background:transparent;padding:0px'}).addRow();
		forms.Total.addHead('A payer :', {colSpan:3}).addField(' ',{style:'font-weight:bold;'}).addRow();
		
		panel.appendChild(forms.Total);
		
		return panel;
	},
/**
 * System.MyStore.Command.update(win) -> void
 **/	
	update:function(win){
		try{
			var array = 		win.Details.getData();
			var data =			win.getData();
			var forms =			win.createForm();
			
			data.Amount_HT = 		0;
			data.Eco_Tax = 			0;
			
			var costDelivery = 		0;
			
			$A(array).each(function(e){
				try{
					data.Amount_HT += e.Price.Value() * e.Qte.Value();
				}catch(er){
					data.Amount_HT += e.Price * e.Qte;
				}
				
				costDelivery += +e.Cost_Delivery.Value();
				data.Eco_Tax += +e.Eco_Tax.Value();
			});
			
			var strCostDelivery = costDelivery.toFixed(2)  + ' ' + System.MyStore.Currency();	
			
			if(forms.Mode_Delivery.Value() != 0){
				
				var obj = forms.Mode_Delivery.getSelectedData();
				
				if(obj.Type.match(/add/)){//application du cout de livraison fixe + cout de livraison cumulé.
					forms.Cost_Delivery.Value(costDelivery + +obj.Cost_Delivery);
					
					if(+obj.Cost_Delivery > 0){
						strCostDelivery = costDelivery.toFixed(2)  + ' ' + System.MyStore.Currency() + ' (+' + (+obj.Cost_Delivery).toFixed(2) + ' ' + System.MyStore.Currency() + ')';
					}
				}	
			}
						
			var discount = 		data.Amount_HT * forms.Discount.Value() / 100;
			var tva =			(data.Amount_HT - discount ) * forms.TVA.Value() / 100;
			data.Amount_TTC =	data.Amount_HT - discount + tva + +forms.Cost_Delivery.Value();
			
			forms.Total.getCel(0, 1).innerHTML = data.Amount_HT.toFixed(2) + ' ' + System.MyStore.Currency();
			forms.Total.getCel(1, 1).innerHTML = data.Eco_Tax.toFixed(2)  + ' ' + System.MyStore.Currency();
			forms.Total.getCel(2, 3).innerHTML = discount.toFixed(2)  + ' ' + System.MyStore.Currency();
			forms.Total.getCel(3, 3).innerHTML = tva.toFixed(2)  + ' ' + System.MyStore.Currency();
			forms.Total.getCel(4, 1).innerHTML = strCostDelivery;
			
			forms.Total.getCel(6, 1).innerHTML = data.Amount_TTC.toFixed(2)  + ' ' + System.MyStore.Currency();
			forms.Total.getCel(8, 1).innerHTML = (data.Amount_TTC - forms.Down_Payment.Value()).toFixed(2)  + ' ' + System.MyStore.Currency();
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyStore;	
		var command = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		var widgets = 	new WidgetContainer({number:2});
		panel.appendChild(widgets);
		//
		//
		//
		var btnOpen =	new SimpleButton({icon:'open-user'});
		btnOpen.on('click', function(){
			System.User.GetAndOpen(command.User_ID);
		});		
		
		widgets[0].appendChild(new Node('h4', $MUI('Informations')));
		
		var table = new TableData();
		
		table.addHead($MUI('N° Commande')).addCel(command.Command_NB, {style:'width:300px; font-weight:bold'}).addRow();
		
		if(Object.isUndefined(command.Meta.Company)){
			table.addHead($MUI('Client')).addField(command.User).addRow();
		}else{
			table.addHead($MUI('Societe')).addField(command.Meta.Company).addRow();
			table.addHead($MUI('Contact')).addField(command.User).addRow();
			table.addHead($MUI('N° TVA intra')).addField(command.Meta.TVA_Intra).addRow();
			table.addHead(' ').addRow();
		}
		
		table.addHead($MUI('Statut')).addField(System.MyStore.Command.Status(command.Statut).text).addRow();
		table.addHead($MUI('Mode livraison')).addField(command.Mode_Delivery).addRow();
		//table.addHead($MUI('Mode paiement')).addField(command.Mode_Payment.Name).addRow();
		//table.addHead($MUI('Total TTC')).addField((command.Amount_TTC * 1).toFixed(2) + ' ' + System.MyStore.Currency()).addRow();
			
		widgets[0].appendChild(table);
		
		widgets[1].appendChild(new Node('h4', $MUI('Adresse de livraison')));
		
		var table = new TableData();
		
		table.addHead($MUI('Nom')).addField(command.Address_Delivery.Name + ' ' + command.Address_Delivery.FirstName, {style:'width:300px'}).addRow();
		table.addHead($MUI('Adresse')).addField(command.Address_Delivery.Address).addRow();
		
		if(command.Address_Delivery.Address2 != ''){
			table.addHead($MUI('Adresse')).addField(command.Address_Delivery.Address2).addRow();
		}
		
		table.addHead($MUI('Code postal')).addField(command.Address_Delivery.CP).addRow();
		table.addHead($MUI('Ville')).addField(command.Address_Delivery.City).addRow();
		table.addHead($MUI('Pays')).addField(command.Address_Delivery.Country).addRow();
		table.addHead($MUI('Téléphone')).addField(System.MyStore.formatPhone(command.Address_Delivery.Phone)).addRow();
		
		widgets[1].appendChild(table);
				
		widgets[0].appendChild(new Node('h4', $MUI('Suivi de commande')));
		var table = new TableData();		
		
		table.addHead($MUI('Créée le')).addField(command.Date_Create.toDate().format('l d F Y à h\\hi'), {style:'width:300px'}).addRow();
		
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
		
		widgets[0].appendChild(table);
						
		return panel;
	},
/**
 * System.MyStore.Command.listing(win) -> void
 **/	
	listing:function(){
		
		var win = 	$WR.getByName('mystore');
		var panel = win.MyStore;
		
		System.MyStore.setCurrent('command');
		
		if(!this.NavBar){
			var options = {
				range1:			50,
				range2:			100,
				range3:			300,
				groupBy:		'Statut',
				readOnly:		true,
				progress:		false
			};
			
			this.NavBar = new NavBar(options);			
			this.NavBar.on('change', this.load.bind(this));
			//
			//
			//
			this.NavBar.BtnCreate = new Node('span', {className:'action icon icon-add-element'}, $MUI('Créer commande'));			
						
			this.NavBar.BtnCreate.on('click', function(){
				System.MyStore.Command.openCreate();
			});
									
			this.NavBar.PrintNew = 		new Node('span', {className:'action new selected'}, $MUI('Nouvelles commandes'));
			this.NavBar.PrintExpired = 	new Node('span', {className:'action not-expired'}, $MUI('Factures'));
						
			this.NavBar.appendChilds([
				this.NavBar.BtnCreate,
				this.NavBar.PrintNew,
				//this.NavBar.PrintCurrent,
				this.NavBar.PrintExpired
			]);
			
			this.NavBar.PrintExpired.on('click', function(){
				this.load(['finish']);
				
				this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintExpired.addClassName('selected');
			}.bind(this));
			
			this.NavBar.PrintNew.on('click', function(){
				this.load();
				
				this.NavBar.select('span.action.selected').invoke('removeClassName', 'selected');
				this.NavBar.PrintNew.addClassName('selected');
			}.bind(this));
						
			this.Table = new SimpleTable(options);
			this.Table.clauses = this.NavBar.getClauses();
			
			this.Table.addHeader({
				Action:					{title:' ', type:'action', style:'text-align:center; width:80px;', sort:false},
				Command_NB: 			{title:$MUI('N°'), style:'width:60px; text-align:right'},
				User: 					{title:$MUI('Client')},
				Mode_Delivery:			{title:$MUI('Mode de livraison'), style:'width:150px'},
				Date_Payment:			{title:$MUI('Payée le'), style:'text-align:center;width:130px', order:'asc'},
				Date_Confirm:			{title:$MUI('Confirmée le'), style:'text-align:center;width:130px'},
				Date_Preparation:		{title:$MUI('Préparée le'), style:'text-align:center;width:130px'},
				Date_Delivery_Start:	{title:$MUI('Début livraison'), style:'text-align:center;width:130px'},
				Date_Delivery_End:		{title:$MUI('Fin livraison'), style:'text-align:center;width:130px'},
				Amount_TTC:				{title:$MUI('Montant TTC'), style:'text-align:center;width:130px'},
				Statut:					{title:$MUI(' '), style:'text-align:center;width:160px', sort:false}
				
			});
			
			this.Table.onWriteName = function(key){
				switch(key){
					case 'created manually':
						return $MUI('En attente de paiement <small>(créée manuellement)</small>');
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
				
				var button = new SimpleButton({icon:'print-element'});
				button.Mini(true);
				
				button.on('click', function(){
					//panel.ProgressBar.show();
					new System.MyStore.Command(data).print(function(link){
						//panel.ProgressBar.hide();
						System.openPDF(link, $MUI('Commande N°') +  ' ' + data.Command_NB);
					});
				});
				
				e.appendChild(button);
				
				return e;
			});
			
			this.Table.addFilters('Statut', function(e, cel, data){
				switch(e){
					case 'created':
						return '';
					case 'created manually':
						var button = new SimpleButton({text:$MUI('Envoyer lien de paiement')});
						button.on('click', function(evt){
							
							System.MyStore.Command.openSendLinkPayment(evt, data, button);
							
						});
						break;	
					
					case 'paid':
						var button = new SimpleButton({text:$MUI('Confirmer')});
						button.on('click', function(evt){
							
							System.MyStore.Command.openConfirm(evt, win, data, button);
							
						});
						break;
						
					case 'confirmed':
						var button = new SimpleButton({text:$MUI('Préparation terminée')});
						
						button.on('click', function(evt){
							
							System.MyStore.Command.openPreparation(evt, win, data, button);
							
						});
						
						break;
						
					case 'prepared':
						
						if(data.In_Store == 1){
							var button =	new SimpleButton({text:$MUI('Colis récupéré')});
							
							button.on('click', function(evt){
								System.MyStore.Command.openFinish(evt, win, data, button);
							});
							
						}else{
							var button =	new SimpleButton({text:$MUI('Livraison en cours')});
							
							button.on('click', function(evt){
								System.MyStore.Command.openStartDelivery(evt, win, data, button);
							});
						}
						
						break;
					
					case 'delivery':
						var button = new SimpleButton({text:$MUI('Terminer')});
						
						button.on('click', function(evt){
							
							System.MyStore.Command.openFinish(evt, win, data, button);
							
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
					
					if(!Object.isUndefined(meta.Company) && meta.Company != ''){
						return meta.Company + ' <b style="color:#666">(pro) </b>';
					}
				}catch(er){}
				
				return e;
			});
			
			this.Table.addFilters(['Date_Payment','Date_Confirm', 'Date_Preparation', 'Date_Delivery_Start', 'Date_Delivery_End'], function(e, cel, data){
				if(e == '0000-00-00 00:00:00'){
					return '';	
				}
				
				return e.toDate().format('d/m/Y à h\\hi');
			});
			
			this.Table.addFilters('Amount_TTC', function(e, cel){
				cel.css('text-align', 'right');
				return (e *1).toFixed(2) + ' ' + System.MyStore.Currency(); 
			});
			
			this.Table.on('complete', function(obj){
				var win = $WR.getByName('mystore');
				var panel = win.MyStore;
				
				System.MyStore.Command.NavBar.setMaxLength(obj.maxLength);
								
				panel.PanelBody.refresh();
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			});
			
			this.Table.on('remove', function(evt, data){
				System.MyStore.Command.remove(data, win.createBox());
			});
			
			this.Table.on('open', function(evt, data){
				System.MyStore.Command.open(data);
			});
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		panel.PanelBody.Body(this.Table);
		
		this.NavBar.getClauses().page = 0;
		
		this.load();
		
	},
/**
 * System.MyStore.Command.load() -> void
 **/	
	load:function(type){
		
		var win = $WR.getByName('mystore');
		
		win.MyStore.ProgressBar.show();
		win.createBubble().hide();
		
		if(Object.isUndefined(type)){
			var parameters = 'cmd=mystore.command.list&options=' + Object.EncodeJSON({Statut:['created manually', 'paid', 'confirmed', 'prepared', 'delivery']});
		}else{
			var parameters = 'cmd=mystore.command.list&options=' + Object.EncodeJSON({Statut:type});
		}
		
		this.Table.setParameters(parameters);
		
		this.NavBar.setMaxLength(0);
		this.Table.load();
		
	},
/**
 * System.MyStore.Command.openConfirm() -> void
 **/	
	openSendLinkPayment:function(evt, data, button, callback){
		
		var command = new System.MyStore.Command(data);
		
		button.setIcon('loading-gif');
		
		command.sendLinkPayment(function(link){
			
			$S.open(link, 'Prévisualisation lien paiement');
			
			if(Object.isFunction(callback)){
				callback.call(null, command); 
			}
		}, function(result){
			alert(result.responseText);	
		});	
		
	},
/**
 * System.MyStore.Command.openConfirm() -> void
 **/
	openConfirm:function(evt, win, data, button, callback){
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
			var command = new System.MyStore.Command(data);
			
			button.setIcon('loading-gif'); 
					
			command.confirm(function(){
				System.MyStore.Command.load();
				
				if(Object.isFunction(callback)){
					callback.call(null, command); 
				}
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
 * System.MyStore.Command.openPreparation() -> void
 **/	
	openPreparation:function(evt, win, data, button, callback){
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
			var command = new System.MyStore.Command(data);
						
			button.setIcon('loading-gif'); 
			
			command.prepared(function(){
				System.MyStore.Command.load();
				
				if(Object.isFunction(callback)){
					callback.call(null, command); 
				}
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
 * System.MyStore.Command.openStartDelivery() -> void
 **/
	openStartDelivery:function(evt, win, data, button, callback){
		
		var box = win.createBox();
		box.setTheme('flat white');
		box.hide();
		
		var forms = box.createForm();
		
		var html = 		new HtmlNode();
		var title  =	new Node('h1', $MUI('Indiquer que le colis a été remis au transporteur') + ' ?');
		//
		//
		//
		forms.Link_Follow_Delivery =		new Input({type:'text', value:data.Link_Follow_Delivery, style:'width:300px'});
		forms.Link_Follow_Delivery.Large(true);
		//
		//
		//
		forms.Delivery_NB =		new Input({type:'text', value:data.Delivery_NB, style:'width:300px'});
		forms.Delivery_NB.Large(true);
		
		var table =		new TableData();
		//table.css('margin', '5px').css('margin-bottom', '15px');
		table.addHead($MUI('Numéro de livraison')).addCel(forms.Delivery_NB).addRow();
		table.addHead($MUI('Lien de suivi')).addCel(forms.Link_Follow_Delivery);
		
		html.appendChilds([title, table]);
		
		box.a(html).setType().show();
		
		box.submit({
			text:	$MUI('Valider'),
			click:	function(){
				
				if(forms.Link_Follow_Delivery.Value() == ''){
					win.Flag.setText($MUI('Veuillez saisir le lien de suivi du colis')).setType(Flag.RIGHT).show(input, true);
					return true;
				}
				
				var command = new System.MyStore.Command(data);
							
				button.setIcon('loading-gif'); 
				
				command.Link_Follow_Delivery = 	forms.Link_Follow_Delivery.Value();
				command.Delivery_NB = 			forms.Delivery_NB.Value();
				
				command.startDelivery(function(){
					System.MyStore.Command.load();
					
					if(Object.isFunction(callback)){
						callback.call(null, command); 
					}
				});	
			}
		});
		
		return;
	},
/**
 * System.MyStore.Command.openFinish() -> void
 **/	
	openFinish:function(evt, win, data, callback){
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
			var command = new System.MyStore.Command(data);
			
			command.finish(function(){
				System.MyStore.Command.load();
				System.MyStore.Command.Count();
				
				if(Object.isFunction(callback)){
					callback.call(null, command); 
				}
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
 * System.MyStore.Command.remove(command, box) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(command, box){
		command = new System.MyStore.Command(command);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer la commande') + ' N°' + command.Command_NB + ' ? ');
		splite.setIcon('edittrash-48');
		//
		// 
		//		
		box.setTheme('flat black liquid');
		box.a(splite).setIcon('delete').setType().show();
		
		$S.fire('mystore.command:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('mystore.command:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				command.remove(function(){
					box.hide();
					System.MyStore.Command.listing();
						
					$S.fire('mystore.command:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('La commande a bien été supprimé'));
					splite.setIcon('valid-48');
					
					
					box.setTheme('flat liquid white');
					box.a(splite).setType('CLOSE').Timer(5).show();				
					
				}.bind(this));
				
			}.bind(this)
		});
	},
/**
 * System.MyStore.Command.getPaymentMethods() -> Array
 *
 * Cette méthode retourne la liste de méthode de paiement.
 **/
 	getPaymentMethods:function(){
		
		return [
			{value:'', text:$MUI('- choisissez -')},
			{value:'Carte bancaire', text:$MUI('Carte bancaire')},
			{value:'Chèque', text:$MUI('Chèque bancaire')},
			{value:'Espèces', text:$MUI('Espèces')},
			{value:'Virement bancaire', text:$MUI('Virement bancaire')}
		];
		
	},
/**
 * System.MyStore.Command.getBankNames() -> Array
 *
 * Cette méthode retourne la liste de nom de banque.
 **/	
	getBankNames:function(){
		
		var array = System.Meta('MYSTORE_BANKS') || [
			{value:'Axa', text:'Axa'},
			{value:'Banque Populaire', text:'Banque Populaire'},
			{value:'Barclays', text:'Barclays'},
			{value:'BNP', text:'BNP'},
			{value:'Caisse Epargne', text:'Caisse Epargne'},
			{value:'CIC', text:'CIC'},
			{value:'Crédit Agricole', text:'Crédit Agricole'},
			{value:'Crédit Coopératif', text:'Crédit Coopératif'},
			{value:'Crédit du Nord', text:'Crédit du Nord'},
			{value:'Crédit Lyonnais', text:'Crédit Lyonnais'},
			{value:'Crédit Mutuel', text:'Crédit Mutuel'},
			{value:'Hervet', text:'Hervet'},
			{value:'HSBC', text:'HSBC'},
			{value:'La Poste', text:'La Poste'},
			{value:'Martin Maurel', text:'Martin Maurel'},
			{value:'Société Générale', text:'Société Générale'},
			{value:'Société Générale', text:'Société Générale'},
			{value:'Société Marseillaise de Crédit', text:'Société Marseillaise de Crédit'},
			{value:'Union de Banques', text:'Union de Banques'}
		];
		
		return array;				
	},
/**
 * System.MyStore.Command.addBankName() -> Array
 *
 * Ajoute un nom de banque.
 **/	
	addBankName:function(name){
		
		var array = this.getBankNames();
		
		for(var i = 0; i < array.length; i++){
			if(array[i].value == name){
				return true;
			}
		}
	
		array.push({
			text:	name, 
			value:	name
		});
		
		array = array.sortBy(function(s){
			return s.text;
		});
		
		$S.Meta('MYSTORE_BANKS', array);
		return this;
	},
/*
 * System.MyStore.Command.Status(id) -> Array
 *
 * Cette méthode retourne un statut
 **/	
	Status:function(value){
		var list = [
			{value:'created', text:$MUI('Créée')},
			{value:'created manually', text:$MUI('Créée manuellement')},
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

System.MyStore.Command.initialize();