/** section: MyWallet
 * class MyWallet
 *
 * Cet espace de nom gère l'extension System.MyWallet.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mywallet.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

System.MyWallet = {
/**
 * System.MyWallet.Types() -> void
 **/
 	Types: [
		//{value:'paypal', text:'Compte paypal', icon:'wallet-paypal', link:'Paypal'},
		//{value:'mastercard', text:'Mastercard - Ventiv', icon:'wallet-mastercard', link:'Mastercard'},
		//{value:'simplify', text: 'Simplify Commerce by mastercard', icon:'wallet-simplify', link:'Simplify'},
		//{value:'kwixo', text: 'Kwixo', icon:'wallet-kwixo', link:'Kwixo'}//,
		//{value:'custom', text: $MUI('Personnalisé'), icon:'wallet-custom'}
	],
/**
 * new System.MyWallet()
 **/
	initialize: function(){
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
		$S.exec('mywallet.list', function(result){
			System.MyWallet.Types = result.responseText.evalJSON();
		});
	},
/**
 * System.MyWallet.startInterface() -> void
 **/
 	startInterface:function(){
		$S.DropMenu.addMenu($MUI('MyWallet'), {icon:'mywallet', appName:'MyWallet'}).on('click', function(){this.open()}.bind(this));		
	},
/**
 * System.jGalery.open() -> void
 **/
	open:function(bool){
		var win = $WR.unique('mywallet', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('mywallet');
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('mywallet');
		win.addClassName('mywallet');
		//
		// TabControl
		//
		win.appendChild(this.createPanel(win));
		
		$Body.appendChild(win);
		
		$S.fire('mywallet:open', win);
		
		win.resizeTo(800, 800);
		win.centralize(false);
				
		return win;
	},
/**
 * Contact.createPanel(win) -> Panel
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			'MyWallet',
			style:			'width:600px',
			icon:			'mywallet-32',
			menu:			false,
			search:			false
		});
		
		win.MyWallet = panel;
		var self =	this;
		panel.addClassName('mywallet');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		//
		//
		var btnAdd = new SimpleButton({icon:'add-card', text:$MUI('Ajouter')});
		btnAdd.on('click', function(){
			try{
				System.MyWallet.listing(win);
			}catch(er){}
			
			System.MyWallet.openCard(win);
		});
				
		panel.Header().appendChild(btnAdd);
		
		panel.Header().observe('mousedown', win.onDragMouseDown.bind(win));
				
		System.MyWallet.listing(win);		
		
		return panel;
	},
/**	
 *
 **/
	setCurrent:function(name){
		var win = $WR.getByName('mywallet');
		var panel = win.MyWallet;
		
		panel.Header().select('.selected').invoke('removeClassName', 'selected');
		panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
		
		panel.clearAll();
		win.CurrentName = name;
				
		panel.Open(false);
		win.destroyForm();
		
	},
/**
 *
 **/	
	openCard:function(win, card){
		var panel = win.MyWallet;
		
		win.setData(card = new System.MyWallet.Card(card));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		//
		//
		//
				
		panel.PanelSwip.Body().appendChild(new Node('h1', $MUI('Gestion du compte bancaire')));
				
		panel.PanelSwip.addPanel($MUI('Informations'), this.createPanelInfos(win));
		panel.PanelSwip.addPanel($MUI('Paramètres'), this.createPanelParameters(win));
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyWallet.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('mywallet:open', win);
		
		return;
	},
/**
 * System.MyStore.Menu.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Name.value == '') {
			win.Flag.setText($MUI('Le nom de votre compte est obligatoire'));
			win.Flag.show(forms.Name);
			return true;
		}
				
		win.forms.save(win.getData());
		
		$S.fire('mywallet:open.submit', win);
		
		win.MyWallet.Progress.show();
		
		win.getData().commit(function(){
						
			$S.fire('mywallet:open.submit.complete', win);
					
			System.MyWallet.listing(win);
			System.MyWallet.openCard(win, win.getData());
			
		});
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyStore;	
		var card = 	win.getData();
		var forms = win.createForm();
		
		var panel = 		new Panel();
		//
		// Titre
		//
		forms.Name = 		new Input({type:'text', value:card.Name});
		//
		// Prix concurrent/fournisseur/constaté
		//
		forms.Amount_Min = 	new Input({type:'number', value:card.Amount_Min, decimal:2, empty:false});
		forms.Amount_Min.css('width', 80).css('text-align', 'right');
		//
		// Prix concurrent/fournisseur/constaté
		//
		forms.Amount_Max = 	new Input({type:'number', value:card.Amount_Max, decimal:2, empty:false});
		forms.Amount_Max.css('width', 80).css('text-align', 'right');
		//
		//
		//
		forms.Private = new ToggleButton();
		forms.Private.Value(card.Statut.match(/private/));
		//
		//
		//
		forms.Professional = new ToggleButton();
		forms.Professional.Value(card.Statut.match(/professional/));
		//
		//
		//
		forms.Mode = new ToggleButton();
		forms.Mode.Value(card.Statut.match(/prod/));
		//
		//
		//
		forms.Publish = new ToggleButton();
		forms.Publish.Value(card.Statut.match(/publish/));
		//
		//
		//
		forms.Picture = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mywallet.picture.import'
		});
				
		forms.Picture.Value(card.Picture);
		//
		//
		//
		forms.Type = new Select();
		forms.Type.setData(System.MyWallet.Types);
		
		forms.Type.Value(card.Type);
		
		//forms.Statut = new Input();
		
		forms.addFilters('Statut', function(){
			
			var statut = 	this.Professional.Value() ? 'professional' : '';
			statut +=		' ' + (this.Private.Value() ? 'private' : '');
			statut +=		' ' + (this.Mode.Value() ? 'prod' : 'dev');
			statut +=		' ' + (this.Publish.Value() ? 'publish' : 'draft');
				
			return statut.trim();
		});
		
		panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Nom du compte')).addCel(win.forms.Name).addRow();
		table.addHead($MUI('Type de compte')).addCel(win.forms.Type).addRow();
		table.addHead($MUI('Professionnel') + ' ?').addCel(win.forms.Professional).addRow();
		table.addHead($MUI('Particulier') + ' ?').addCel(win.forms.Private).addRow();
		table.addHead($MUI('Mode production') + ' ?').addCel(win.forms.Mode).addRow();
		table.addHead($MUI('Activé') + ' ?').addCel(win.forms.Publish).addRow();
		
		panel.appendChild(table);
		
		var table = 		new TableData();
		table.addClassName('liquid');
		table.addHead($MUI('Montant minimum de la commande'), {style:'width:230px'}).addCel(win.forms.Amount_Min).addRow();
		table.addHead($MUI('Montant maximal de la commande')).addCel(win.forms.Amount_Max).addRow();
		
		panel.appendChild(table);
				
		return panel;
	},
/**
 *
 **/	
	createPanelParameters:function(win){
		var card = 	win.getData();
		var forms = win.createForm();
		
		var panel = 	new Panel();
		var options = 	System.MyWallet.Types;
		forms.Content = {};
		
		for(var i = 0; i < options.length; i++){
			try{
				
				forms.Content[options[i].value] = {}
				
				var form = System.MyWallet[options[i].link].createForm(win, forms.Content[options[i].value]);
				form.addClassName('mywallet-form-libraries form-' + options[i].value );
				panel.appendChild(form);
				
				if(card.Type != options[i].value){
					form.hide();
				}
				
			}catch(er){$S.trace(options[i].link)}
		}
		
		forms.addFilters('Content', function(){
			var a  = {};
			Object.setObject(a, this.Content[this.Type.Value()]);
			return a;		
		});
		
		return panel;
	},
	
	listing:function(win){
		var win = $WR.getByName('mywallet');
		var panel = win.MyWallet;
		panel.Progress.show();
					
		$S.exec('mywallet.card.list', {
			parameters:'options=' + Object.EncodeJSON({draft:true}),
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
				
				try{		
					
					for(var i = 0; i < array.length;  i++){
												
						var button =	new System.MyWallet.Button({
							icon:		array[i].Picture,
							text:		array[i].Name
						});
												
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyWallet.openCard(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyWallet.remove(win, this.data);
						}.bind(button));
						
					}	
					
					panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = panel.PanelBody.select('.market-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
										
				}catch(er){$S.trace(er)}
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			}.bind(this)
		});
	}
};

/** section: Core
 * class System.MyStore.Product.Button
 **/
System.MyWallet.Button = Class.from(AppButton);
System.MyWallet.Button.prototype = {
	
	className:'wobject market-button store-button overable',
/**
 * new System.MyStore.Product.Button([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			subTitle:	'',
			overable:	true,
			checkbox:	false,
			tag:		false,
			version:	''
		};
		
		Object.extend(options, obj || {});
		
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'});
		this.SubTitle.innerHTML = options.subTitle;
		//
		//
		//
		this.BtnRemove = new SimpleButton({nofill:true, icon:'remove-element-2'});
		this.BtnRemove.addClassName('btn-remove');
		
		this.appendChild(this.SubTitle);
		this.appendChild(this.BtnRemove);
				
		this.Overable(options.overable);
	},
/**
 * System.MyStore.Product.Button#setSubTitle(price) -> System.MyStore.Product.Button
 **/	
	setSubTitle:function(title){
		this.SubTitle.innerHTML = $MUI(title);
		return this;
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};

System.MyWallet.initialize();

System.MyWallet.Card = Class.createAjax({
/**
 * System.MyWallet.Card#Card_ID -> Number
 **/
	Card_ID:	0,
/**
 * System.MyWallet.Card#Name -> String
 * Varchar
 **/
	Name:		"",
/**
 * System.MyWallet.Card#Picture -> String
 * Varchar
 **/
	Picture:	"",
/**
 * System.MyWallet.Card#Type -> String
 * Varchar
 **/
	Type:		"",
/**
 * System.MyWallet.Card#Content -> String
 * Text
 **/
	Content:	"",
/**
 * System.MyWallet.Card#Amount_Min -> Float
 * Decimal
 **/
	Amount_Min:	0.00,
/**
 * System.MyWallet.Card#Amount_Max -> Float
 * Decimal
 **/
	Amount_Max:	0.00,
/**
 * System.MyWallet.Card#Statut -> String
 * Varchar
 **/
	Statut:		'draft professional private dev',
/**
 * System.MyWallet.Card#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('mywallet.card.commit', {
			
			parameters: 'MyWalletCard=' + this.toJSON(),
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
 * System.MyWallet.Card#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('mywallet.card.delete',{
			parameters: 'MyWalletCard=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}	
});