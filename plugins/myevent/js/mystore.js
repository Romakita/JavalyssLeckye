/** section: MyEvent
 * class System.MyEvent
 *
 * Cet espace de nom gère l'extension System.MyEvent.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : myevent.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
Import('plugins.inputrecipient');

System.MyEvent = {
/**
 * System.MyEvent.TVA_PRINT -> String
 *
 * On se contente d'afficher la TVA sur les récaps et facture.
 **/	
	TVA_PRINT: 		'print',
/**
 * System.MyEvent.TVA_DISABLED -> String
 *
 * On n'affiche pas la TVA et donc pas de gestion de TVA.
 **/
	TVA_DISABLED:	'disabled',
/**
 * System.MyEvent.TVA_USE -> String
 *
 * On affiche la TVA et on calcul le montant HT et TTC.
 **/
	TVA_USE:		'use',
/**
 * System.MyEvent.Categories -> Array
 **/
	Categories: 	null,
/**
 * new System.MyEvent()
 **/
	initialize: function(){
				
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
	},
/**
 * System.MyEvent.startInterface() -> void
 **/
 	startInterface:function(){
		
		$S.DropMenu.addMenu($MUI('MyEvent'), {icon:'myevent'}).on('click', function(){this.open()}.bind(this));
		//$S.DropMenu.addMenu($MUI('Commandes'), {icon:'myevent'}).on('click', function(){this.open()}.bind(this));
		
		System.Contact.addCategory($MUI('Fournisseurs'), 'providers');
		System.Contact.addCategory($MUI('Designer'), 'designer');
		
	},
/**
 * System.jGalery.open() -> void
 **/
	open:function(bool){
		var win = $WR.unique('myevent', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('myevent');
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('myevent');
		win.addClassName('myevent');
		//
		// TabControl
		//
		win.appendChild(this.createPanel(win));
		
				
		$Body.appendChild(win);
		
		$S.fire('myevent:open', win);
		
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
			title:			'MyEvent',
			placeholder:	$MUI('Rechercher'),
			style:			'width:900px',
			parameters:		'cmd=myevent.aggregate.list',
			icon:			'myevent-32',
			menu:			false
		});
		
		win.MyEvent = panel;
		var self =	this;
		panel.addClassName('myevent');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		
		//
		//
		//
		var btnAddProduct = new SimpleButton({icon:'add-product', text:$MUI('Créer produit')});
		btnAddProduct.on('click', function(){
			try{
				System.MyEvent.Product.listing(win);
			}catch(er){}
			
			System.MyEvent.Product.open(win);
		});
		//
		//
		//
		var btnProduct = new SimpleButton({icon:'edit-product', text:$MUI('Catalogue')});
		btnProduct.addClassName('product selected tab');
		btnProduct.on('click', function(){
			System.MyEvent.Product.listing(win);
		});
		//
		//
		//
		var btnSelection = new SimpleButton({icon:'edit-favorite', text:$MUI('A la une')});
		btnSelection.addClassName('selection tab');
		btnSelection.on('click', function(){
			System.MyEvent.Selection.listing(win);
		});
		//
		//
		//
		var btnMenu = new SimpleButton({icon:'edit-menu', text:$MUI('Menu')});
		btnMenu.on('click', function(){
			System.MyEvent.Menu.listing(win);
		});
		btnMenu.addClassName('menu tab');
		//
		//
		//
		var btnCollection = new SimpleButton({icon:'edit-collection', text:$MUI('Collections')});
		btnCollection.on('click', function(){
			System.MyEvent.Collection.listing(win);
		});
		btnCollection.addClassName('collection tab');
		//
		//
		//
		var btnCommand = new SimpleButton({icon:'edit-command', text:$MUI('Commandes')});
		btnCommand.addClassName('command tab');
		
		btnCommand.on('click', function(){
			System.MyEvent.Command.listing(win);
		});
		//
		//
		//
		var btnDelivery = new SimpleButton({icon:'edit-delivery', text:$MUI('Opt. livraison')});
		btnDelivery.addClassName('delivery tab');
		
		btnDelivery.on('click', function(){
			System.MyEvent.OptionDelivery.listing(win);
		});
		//
		//
		//
		var btnPayment = new SimpleButton({icon:'edit-payment', text:$MUI('Opt. paiement')});
		btnPayment.addClassName('payment tab');
		
		btnPayment.on('click', function(){
			System.MyWallet.open();
		});
		//
		//
		//
		//
		var btnSetting = 	new SimpleButton({icon:'edit-setting', text:$MUI('Configuration')});
		btnSetting.addClassName('setting tab');
		btnSetting.on('click', function(){
			System.MyEvent.Setting.open();
		});
		
		panel.Header().appendChild(btnAddProduct);
		panel.Header().appendChild(btnProduct);
		panel.Header().appendChild(btnCommand);
		panel.Header().appendChild(btnSelection);
		panel.Header().appendChild(btnCollection);
		panel.Header().appendChild(btnMenu);
		
		
		if($U().getRight() != 3){
			panel.Header().appendChild(btnDelivery);
			panel.Header().appendChild(btnPayment);
			panel.Header().appendChild(btnSetting);
		}
		
		
		System.MyEvent.Product.listing(win);
		
		panel.BtnReturn.on('click', function(){
			new fThread(function(){
				panel.select('.cel-date_confirm').invoke('show');
				panel.select('.cel-date_preparation').invoke('show');
				panel.select('.cel-date_delivery_start').invoke('show');
			}, 0.4);
		});
		//
		//
		//
		
		/*panel.InputCompleter.on('draw', function(line){
			this.Hidden(true);
		});
		
		panel.InputCompleter.on('complete', function(array){
			this.draw(win, array);
		}.bind(this));
		
		panel.InputCompleter.on('keyup', function(){
			if(panel.InputCompleter.Text() == ''){
				this.getList(win);
			}
		}.bind(this));*/
		
		
		
		
		return panel;
	},
/**	
 *
 **/
	setCurrent:function(name){
		var win = $WR.getByName('myevent');
		var panel = win.MyEvent;
		
		if(name != 'setting'){
			panel.Header().select('.selected').invoke('removeClassName', 'selected');
			panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
			
			new fThread(function(){
				panel.select('.cel-date_confirm').invoke('show');
				panel.select('.cel-date_preparation').invoke('show');
				panel.select('.cel-date_delivery_start').invoke('show');
			}, 0.4);
			
			panel.clearAll();
			win.CurrentName = name;
		}else{
			panel.clearSwipAll();
		}
		panel.Open(false);
		win.destroyForm();
		
	},
	
	Currency:	function(){
		var char = System.Meta('MYEVENT_CURRENCY');
		return char == null ? '€' : char;
	},
/**
 * MyEvent.CalculateTVA(price) -> Float
 *
 * Cette méthode retourne la valeur de la tva.
 **/
	CalculateTVA:function CalculateTVA(price, tva){
		
		if(Object.isUndefined(tva)){
			tva = this.TVA();	
		}
		
		switch(System.MyEvent.ModeTVA()){
			case this.TVA_DISABLED:break;
			case this.TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				price = 	price + ((price * tva) / 100);
				break;
			case this.TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				price = 	price / ((tva / 100) + 1);
				break;
		}
		
		return price;
	},
/**
 * MyEvent.ModeTVA() -> String
 *
 * Cette méthode retourne le mode de calcul de la TVA.
 **/	
	ModeTVA: function ModeTVA(){
		value = System.Meta('MYEVENT_TVA_MODE');
		return value == null ? this.TVA_PRINT : value;
	},
/**
 * MyEvent.TVA() -> Float
 *
 * Cette méthode retourne la valeur de la tva.
 **/
	TVA: function(){
		value = System.Meta('MYEVENT_TVA');
		return value == null ? 19.6 : (value * 1);
	}
};

System.MyEvent.initialize();