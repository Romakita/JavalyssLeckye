/** section: MyStore
 * class System.Newsletter
 *
 * Cet espace de nom gère l'extension System.Newsletter.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : newsletter.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
Import('plugins.inputrecipient');

System.Newsletter = {
/**
 * System.Newsletter.initialize() -> void
 *
 * Cette méthode initialise les écouteurs de l'extension. 
 **/
	initialize: function(){
				
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
		System.Opener.add('mailto', {
			text: 	'Newsletter',
			icon:	'newsletter-32',
			
			click:	function(mail){
				$S.trace(mail);
				System.Newsletter.Email.open({Recipients:mail});
			},
			
			onList:	function(){
				return false;
			}
		});
		
		this.addBroadcastGroup($MUI('Abonnées de la newsletter'), 'subscribers@newsletter');
	},
/**
 * System.Newsletter.startInterface() -> void
 *
 * Cette méthode permet d'ajouter des éléments à l'interface du logiciel une fois l'événement `system.:startinterface` déclenché.
 **/
 	startInterface:function(){
				
		$S.DropMenu.addMenu($MUI('Newsletter'), {icon:'newsletter', appName:'Newsletter'}).observe('click', function(){this.open()}.bind(this));
				
	},
/**
 * System.Newsletter.open() -> void
 *
 * Cette méthode ouvre la fenêtre principale de l'extension.
 **/
	open:function(type){
		var win = $WR.unique('newsletter', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('newsletter');
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(Flag.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('newsletter');
		win.addClassName('newsletter');
		//
		// TabControl
		//
		win.appendChild(this.createInterface(win));
				
		document.body.appendChild(win);
		
		$S.fire('newsletter:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		switch(type){
			default:
			case 'model':
				System.Newsletter.Model.listing(win);
				break;
			
			case 'newsletter':
				System.Newsletter.Email.listing(win);
				break;
		}
				
		return win;
	},

/**
 * System.Newsletter.createInterface(win) -> Panel
 * Cette méthode créée l'interface de la fenêtre.
 **/
 	createInterface: function(win){
		
		var self =	this;
		var panel = new System.jPanel({
			title:			'Newsletter',
			placeholder:	$MUI('Rechercher dans les news'),
			//style:			'width:900px',
			menu:			false,
			search:			true
		});
		
		win.Panel = panel;
		
		panel.addClassName('newsletter');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		// Bouton
		//
		panel.BtnCreateMail = new SimpleButton({icon:'edit-mail', text:$MUI('Créer newsletter')});
		panel.BtnCreateMail.on('click', function(){
			System.Newsletter.Email.open();
		});
		//
		// Bouton
		//
		panel.BtnAddModel = new SimpleButton({icon:'add-model', text:$MUI('Créer un modèle')});
		panel.BtnAddModel.on('click', function(){
			System.Newsletter.Model.open();
		});
		//
		// Accueil
		//
		panel.BtnModel = new SimpleButton({icon:'edit-model', text:$MUI('Modèles')});
		
		panel.BtnModel.addClassName('model selected tab');
		panel.BtnModel.on('click', function(){
			System.Newsletter.Model.listing(win);
		});
		//
		// Accueil
		//
		panel.BtnSent = new SimpleButton({icon:'edit-mails', text:$MUI('Newsletter')});
		
		panel.BtnSent.addClassName('emails tab');
		panel.BtnSent.on('click', function(){
			System.Newsletter.Email.listing(win);
		});
		//
		//
		//
		panel.BtnSetting = new SimpleButton({icon:'edit-setting', text:$MUI('Configuration')});
		panel.BtnSetting.addClassName('setting');
		
		panel.BtnSetting.on('click', function(){
			System.Newsletter.openSetting();
		});
		
		panel.Header().appendChild(panel.BtnCreateMail);
		panel.Header().appendChild(panel.BtnAddModel);
		panel.Header().appendChild(panel.BtnModel);	
		panel.Header().appendChild(panel.BtnSent);	
		
		if($U().getRight() != 3){
			panel.Header().appendChild(panel.BtnSetting);
		}
		//
		// Gestion de la recherche
		//
		
		panel.InputCompleter.on('draw', function(line){
			this.Hidden(true);
		});
		
		panel.InputCompleter.on('complete', function(array){
			
			switch(win.CurrentName){
				case 'model':
					System.Newsletter.Model.onSearch(array);
					break;
				
				case 'newsletter':
					System.Newsletter.Email.onSearch(array);
					break;
			}
			
		}.bind(this));
		
		panel.InputCompleter.on('keyup', function(){
			if(panel.InputCompleter.Text() == ''){
				switch(win.CurrentName){
					
					case 'model':
						System.Newsletter.Model.listing(win);
						break;
						
					case 'newsletter':
						System.Newsletter.Email.listing(win);
						break;
				}
			}
			
		}.bind(this));
		
		return panel;
	},
/**	
 *
 **/
	setCurrent:function(name){
		var win = 	$WR.getByName('newsletter');
		var panel =	win.Panel;
		
		if(name != 'setting'){
			panel.Header().select('.selected').invoke('removeClassName', 'selected');
			panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
			
			new fThread(function(){
			//	panel.select('.cel-date_confirm').invoke('show');
			//	panel.select('.cel-date_preparation').invoke('show');
			//	panel.select('.cel-date_delivery_start').invoke('show');
			}, 0.4);
			
			panel.clearAll();
			win.CurrentName = name;
		}else{
			panel.clearSwipAll();
		}
		
		panel.Open(false);
		win.destroyForm();
		
		panel.InputCompleter.Text('');
		
	},
/**
 *
 **/	
	openSetting:function(){
		var win = 		$WR.getByName('newsletter');
		var panel = 	win.Panel;
		var forms = 	win.createForm();
		
		System.Newsletter.setCurrent('setting');
		panel.Open(true, 650);
		
		panel.PanelSwip.addPanel($MUI('Paramètres'), this.createPanelParameters(win));
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.Newsletter.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('newsletter.setting:open', win);
	},
/**
 *
 **/	
	createPanelParameters:function(win){
		var panel = new Panel();
		var forms = win.createForm();
		//
		//
		//
		forms.NEWSLETTER_FROM = new Input({type:'email'});
		forms.NEWSLETTER_FROM.Value(System.Meta('NEWSLETTER_FROM') || '');
			
		panel.appendChild(new Node('h4', $MUI('Options d\'envoi')));
		
		var table = new TableData();
		
		table.addHead($MUI('Adresse e-mail d\'envoi')).addCel(forms.NEWSLETTER_FROM).addRow();
		
		panel.appendChild(table);
		
		return panel;
	},
	
	submit:function(win){
		var forms = win.createForm();
		
		System.Meta('NEWSLETTER_FROM', forms.NEWSLETTER_FROM.Value());
				
		var splite = new SpliteIcon($MUI('Les paramètres ont bien été modifié'));
		splite.setIcon('filesave-ok-48');
		
		win.AlertBox.setTitle($MUI('Confirmation')).a(splite).ty('CLOSE').Timer(5).show();
		win.AlertBox.reset({icon:'exit'});
		
		
	},
/**
 *
 **/	
	addBroadcastGroup:function(name, value){
		
		var array = $S.Meta('NEWSLETTER_GROUPS') || [
			{value:'subscribers@newsletter.fr', text:$MUI('Abonnées de la newsletter')}
		];
		
		for(var i = 0; i < array.length; i++){
			if(array[i].value == value){
				return true;
			}
		}
	
		array.push({
			text:	name, 
			value:	value
		});
		
		array = array.sortBy(function(s){
			return s.text;
		});
		
		$S.Meta('NEWSLETTER_GROUPS', array);
		return this;
	},
/**
 *
 **/	
	getBroadcastGroups:function(){
		return $S.Meta('NEWSLETTER_GROUPS') || [
			{value:'subscribers@newsletter.fr', text:$MUI('Abonnées de la newsletter')}
		];
	}
};

System.Newsletter.initialize();