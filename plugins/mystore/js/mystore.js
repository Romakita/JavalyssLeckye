/** section: Plugins
 * class System.MyStore
 *
 * Cet espace de nom gère l'extension System.MyStore.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
Import('plugins.inputrecipient');

System.MyStore = {
/**
 * System.MyStore.TVA_PRINT -> String
 *
 * On se contente d'afficher la TVA sur les récaps et facture.
 **/	
	TVA_PRINT: 		'print',
/**
 * System.MyStore.TVA_DISABLED -> String
 *
 * On n'affiche pas la TVA et donc pas de gestion de TVA.
 **/
	TVA_DISABLED:	'disabled',
/**
 * System.MyStore.TVA_USE -> String
 *
 * On affiche la TVA et on calcul le montant HT et TTC.
 **/
	TVA_USE:		'use',
/**
 * System.MyStore.HT -> String
 *
 * Indique que le prix utilisé est HT.
 **/	
	HT:				'ht',
/**
 * System.MyStore.TTC -> String
 *
 * Indique que le prix utilisé est HT.
 **/
	TTC:			'ttc',
/**
 * System.MyStore.Categories -> Array
 **/
	Categories: 	null,
/**
 * new System.MyStore()
 **/
	initialize: function(){
				
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
	},
/**
 * System.MyStore.startInterface() -> void
 **/
 	startInterface:function(){
		
		$S.DropMenu.addMenu($MUI('MyStore'), {icon:'mystore', appName:'MyStore'}).on('click', function(){this.open()}.bind(this));
		//$S.DropMenu.addMenu($MUI('Commandes'), {icon:'mystore'}).on('click', function(){this.open()}.bind(this));
		
		System.Contact.addCategory($MUI('Fournisseurs'), 'providers');
		System.Contact.addCategory($MUI('Designer'), 'designer');
		
		
		$S.observe('contacts:open', function(){
			var win = $WR.getByName('contacts');
			var panel = win.Panel;
			
			panel.BtnAddDesigner = new SimpleButton({icon:'add-contact', text:$MUI('Créer désigner')})
			panel.BtnAddDesigner.on('click', function(){
				System.Contact.open({
					Categories: ['designer']	
				});
			});
			panel.Header().appendChild(panel.BtnAddDesigner);
			
			panel.BtnAddProvider = new SimpleButton({icon:'add-contact', text:$MUI('Créer fournisseur')})
			panel.BtnAddProvider.on('click', function(){
				System.Contact.open({
					Categories: ['providers']	
				});
			});
			panel.BtnAddProvider.css('width', 100);
			panel.Header().appendChild(panel.BtnAddProvider);
			
		});
		
	},
/**
 * System.MyStore.open() -> void
 **/
	open:function(type){
		var win = $WR.unique('mystore', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('mystore');
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('mystore');
		win.addClassName('mystore');
		//
		// TabControl
		//
		win.appendChild(this.createPanel(win));
				
		$Body.appendChild(win);
		
		$S.fire('mystore:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		switch(type){
			
			case 'setting':
				System.MyStore.Product.listing(win);
				this.BtnSetting.click();
				break;
			default:	
			case 'product':
				System.MyStore.Product.listing(win);
				break;
				
			case 'command':
				System.MyStore.Command.listing(win);
				break;
		}
				
		return win;
	},
/**
 * System.MyStore.createPanel() -> Panel
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			'',
			placeholder:	$MUI('Rechercher'),
			style:			'width:900px',
			//parameters:		'cmd=mystore.aggregate.list',
			icon:			'mystore-32',
			menu:			false,
			search:			false
		});
		
		win.MyStore = panel;
		var self =	this;
		panel.addClassName('mystore');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		//
		//
		var btnAddProduct = new SimpleButton({icon:'add-product', text:$MUI('Créer produit')});
		btnAddProduct.on('click', function(){
			try{
				System.MyStore.Product.listing(win);
			}catch(er){}
			
			System.MyStore.Product.open(win);
		});
		//
		//
		//
		var btnProduct = new SimpleButton({icon:'edit-product', text:$MUI('Catalogue')});
		btnProduct.addClassName('product selected tab');
		btnProduct.on('click', function(){
			System.MyStore.Product.listing(win);
		});
		//
		//
		//
		var btnOutOfStock = new SimpleButton({icon:'edit-outofstock', text:$MUI('Hors stock')});
		btnOutOfStock.addClassName('outofstock selected tab');
		btnOutOfStock.on('click', function(){
			System.MyStore.OutOfStock.listing(win);
		});
		//
		//
		//
		var btnSelection = new SimpleButton({icon:'edit-favorite', text:$MUI('A la une')});
		btnSelection.addClassName('selection tab');
		btnSelection.on('click', function(){
			System.MyStore.Selection.listing(win);
		});
		//
		//
		//
		var btnMenu = new SimpleButton({icon:'edit-menu', text:$MUI('Menu')});
		btnMenu.on('click', function(){
			System.MyStore.Menu.listing(win);
		});
		btnMenu.addClassName('menu tab');
		//
		//
		//
		var btnCollection = new SimpleButton({icon:'edit-collection', text:$MUI('Collections')});
		btnCollection.on('click', function(){
			System.MyStore.Collection.listing(win);
		});
		btnCollection.addClassName('collection tab');
		//
		//
		//
		var btnCommand = this.BtnCommand = new SimpleButton({icon:'edit-command', text:$MUI('Commandes')});
		btnCommand.addClassName('command tab');
		
		btnCommand.on('click', function(){
			System.MyStore.Command.listing(win);
		});
		
		if(System.MyStore.Command.CurrentCount){
			btnCommand.setTag(System.MyStore.Command.CurrentCount);
		}
		//
		//
		//
		var btnDelivery = new SimpleButton({icon:'edit-delivery', text:$MUI('Opt. livraison')});
		btnDelivery.addClassName('delivery tab');
		
		btnDelivery.on('click', function(){
			System.MyStore.OptionDelivery.listing(win);
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
		var btnSetting = this.BtnSetting = new SimpleButton({icon:'edit-setting', text:$MUI('Configuration')});
		btnSetting.addClassName('setting tab');
		btnSetting.on('click', function(){
			System.MyStore.Setting.open();
		});
		
		panel.Header().appendChild(btnAddProduct);
		panel.Header().appendChild(btnProduct);
		
		if(System.MyStore.StockEnable()){
			panel.Header().appendChild(btnOutOfStock);
		}
		
		panel.Header().appendChild(btnCommand);
		panel.Header().appendChild(btnSelection);
		panel.Header().appendChild(btnCollection);
		panel.Header().appendChild(btnMenu);
		
		
		if($U().getRight() != 3){
			panel.Header().appendChild(btnDelivery);
			panel.Header().appendChild(btnPayment);
			panel.Header().appendChild(btnSetting);
		}
			
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
 * System.MyStore.setCurrent() -> void
 **/
	setCurrent:function(name){
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		
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
/**
 * System.MyStore.Currency() -> String
 *
 * Cette méthode retourne la devise configurée.
 **/	
	Currency: function(){
		var char = System.Meta('MYSTORE_CURRENCY');
		return char == null ? '€' : char;
	},
/**
 * System.MyStore.Currency() -> String
 *
 * Cette méthode retourne la devise configurée.
 **/	
	Currency: function(){
		var char = System.Meta('MYSTORE_CURRENCY');
		return char == null ? '€' : char;
	},
/**
 * System.MyStore.StockEnable() -> Boolean
 *
 * Cette méthode indique la gestion des stocks est activée.
 **/	
	StockEnable: function(){
		return System.Meta('MYSTORE_STOCK_ENABLE');
	},
/**
 * System.MyStore.CalculateTVA(price[, mode]) -> Float
 *
 * Cette méthode retourne la tva à partir du prix HT si le paramètre `mode = System.MyStore.HT` ou à partir du prix TTC si `mode = System.MyStore.TTC`
 **/
	CalculateTVA: function CalculateTVA(price, mode){
		price = 1 * price;
		
		var tva = this.TVA();	
				
		switch(mode){
			default:
			case System.MyStore.HT:
				return ((price * tva) / 100);
				
			case System.MyStore.TTC:
				return 	price - (price / ((tva / 100) + 1));
		}
		
	},
/**
 * System.MyStore.ModeTVA() -> String
 *
 * Cette méthode retourne le mode de calcul de la TVA.
 **/	
	ModeTVA: function ModeTVA(){
		value = System.Meta('MYSTORE_TVA_MODE');
		return value == null ? this.TVA_PRINT : value;
	},
/**
 * System.MyStore.TVA() -> Float
 *
 * Cette méthode retourne la valeur de la tva.
 **/
	TVA: function(){
		value = System.Meta('MYSTORE_TVA');
		return value == null ? 19.6 : (value * 1);
	},
/**
 * System.MyStore.formatPhone() -> Float
 *
 * Cette méthode un numéro de téléphone formaté.
 **/	
	formatPhone: function(str){
		if(Object.isUndefined(str)) return '';
			
		var phone = str.replace(/[ #\._-]/g, '');
		
		if(phone.isTel()){//correspond au format téléphonique Français
			phone = '+33 ' + phone.format('## ## ## ## ##').slice(1);
		}
		
		return phone;
	}
};

System.MyStore.initialize();