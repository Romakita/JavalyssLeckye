/** section: Core
 * System.Directory
 *  
 * Annuaire des utilisateurs du logiciel.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : directory.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Directory = {
/**
 * System.Directory.initialize() -> void
 * 
 * Cette méthode initialise les événements de la classe.
 **/
	initialize:function(){	},
/**
 * System.Directory.startInterface() -> void
 *
 * Cette méthode lance les procédures de création de l'interface destinées à la gestion des utilisateurs.
 **/	
	startInterface:function(){
		switch($U().getRight()) {
			
			case 2: if($S.Meta('MODERATOR_MODE_USER')) break;
			case 1:
				var btn = $S.DropMenu.addMenu($MUI('Utilisateurs'), {icon:'system-user'})
				btn.observe('click', function(){System.Directory.open()});				
				break;
			default:
		}
		
		$S.observe('user:submit.complete', function(){
			var win = $WR.getByName('directory');
			if(win){
				
				switch(win.CurrentName){
					default:
					case 'user':
						System.Directory.User.listing(win);
						break;
						
					case 'user-wait':
						System.Directory.Wait.listing(win);
						break;
					case 'blacklist':
						System.Directory.BlackList.listing(win);
						break;
				}
				
			}
		}.bind(this));
		
		$S.observe('user:remove.complete', function(){
			var win = $WR.getByName('directory');
			if(win){
				switch(win.CurrentName){
					default:
					case 'user':
						System.Directory.User.listing(win);
						break;
						
					case 'user-wait':
						System.Directory.Wait.listing(win);
						break;
					case 'blacklist':
						System.Directory.BlackList.listing(win);
						break;
				}
			}
		}.bind(this));
	},
/**
 * System.Directory.open([name]) -> void
 * - name (String): Nom de l'onglet à afficher au lancement de l'application.
 *
 * Cette méthode ouvre la fenêtre principale de gestion de l'annuaire.
 **/	
	open:function(type){
		
		var win = $WR.unique('directory', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('directory');
				
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(Flag.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('system-user');
		win.addClassName('directory');
		//
		// TabControl
		//
		win.appendChild(this.createInterface(win));
				
		document.body.appendChild(win);
		
		$S.fire('directory:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		switch(type){
			default:
			case 'user':
				System.Directory.User.listing(win);
				break;
			
			case 'blacklist':
				System.Directory.BlackList.listing(win);
				break;
				
			case 'role':
			//	System.Newsletter.Client.listing(win);
				break;
		}
				
		return win;
	},
/**
 * System.Directory.createInterface(win) -> Panel
 * - win (Window): Instance Window.
 *
 * Cette méthode créée le panneau de gestion de l'annuaire utilisateur.
 **/
 	createInterface: function(win){
		
		var self =	this;
		
		var panel = new System.jPanel({
			title:			'Directory',
			placeholder:	$MUI('Rechercher'),
			menu:			false,
			search:			true
		});
		
		win.Panel = panel;
		
		panel.addClassName('directory');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		// Bouton
		//
		panel.BtnAddUser = new SimpleButton({icon:'add-user', text:$MUI('Créer utilisateur')});
		panel.BtnAddUser.on('click', function(){
			System.User.open();
		});
		//
		// Annuaire utilisateur
		//
		panel.BtnUser = new SimpleButton({icon:'edit-user', text:$MUI('Utilisateurs')});
		
		panel.BtnUser.addClassName('user selected tab');
		panel.BtnUser.on('click', function(){
			System.Directory.User.listing(win);
		});
		//
		// BlackList
		//
		panel.BtnWaitUser = new SimpleButton({icon:'edit-user-new', text:$MUI('En attente')});
		
		panel.BtnWaitUser.addClassName('user-wait tab');
		panel.BtnWaitUser.on('click', function(){
			System.Directory.Wait.listing(win);
		});
		//
		// New
		//
		panel.BtnBlackList = new SimpleButton({icon:'edit-blacklist', text:$MUI('Blacklist')});
		
		panel.BtnBlackList.addClassName('blacklist tab');
		panel.BtnBlackList.on('click', function(){
			System.Directory.BlackList.listing(win);
		});
		
		//
		// Role
		//
		panel.BtnGroup = new SimpleButton({icon:'edit-group', text:$MUI('Groupes')});
		
		panel.BtnGroup.addClassName('group tab');
		panel.BtnGroup.on('click', function(){
			System.Role.listing();
		});
		
		
		switch($U().getRight()){
			case 1:
				panel.Header().appendChild(panel.BtnAddUser);
				panel.Header().appendChild(panel.BtnUser);
				panel.Header().appendChild(panel.BtnWaitUser);
				panel.Header().appendChild(panel.BtnBlackList);
				panel.Header().appendChild(panel.BtnGroup);
				break;
			case 2:
				panel.Header().appendChild(panel.BtnAddUser);
				panel.Header().appendChild(panel.BtnUser);
				panel.Header().appendChild(panel.BtnWaitUser);
				panel.Header().appendChild(panel.BtnBlackList);
				break;
			case 3:
				
				break;
		}
		
		panel.BtnReturn.on('click', function(){
			new fThread(function(){
			//	panel.select('.cel-date_confirm').invoke('show');
		//		panel.select('.cel-date_preparation').invoke('show');
		//		panel.select('.cel-date_delivery_start').invoke('show');
			}, 0.4);
		});
		//
		// Gestion de la recherche
		//
		
		panel.InputCompleter.on('draw', function(line){
			this.Hidden(true);
		});
		
		panel.InputCompleter.on('complete', function(array){
			
			switch(win.CurrentName){
				case 'user':
					System.Directory.User.onSearch(array);
					break;
				case 'user-wait':
					System.Directory.Wait.onSearch(array);
					break;
				
				case 'blacklist':
					System.Directory.BlackList.onSearch(array);
					break;
			}
			
		}.bind(this));
		
		panel.InputCompleter.on('keyup', function(){
			if(panel.InputCompleter.Text() == ''){
				switch(win.CurrentName){
					case 'user':
						System.Directory.User.listing(win);
						break;
					case 'user-wait':
						System.Directory.Wait.listing(win);
						break;
					
					case 'blacklist':
						System.Directory.BlackList.listing(win);
						break;
				}
			}
			
		}.bind(this));		
		
		return panel;
	},
/**
 * System.Directory.setCurrent(name) -> void
 * - name (String): Identifiant de l'onglet à afficher.
 *
 * Cette méthode affiche le contenu d'un onglet de l'annuaire.
 **/
	setCurrent:function(name){
		var win = 	$WR.getByName('directory');
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
	
	getCurrentName:function(){
		var win = 	$WR.getByName('directory');
		return win.CurrentName;
	}
};
/** section: Core
 * System.Directory.User
 *  
 * Gère le listing des utilisateurs dans l'annuaire. 
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : directory.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Directory.User = {
/**
 * System.Directory.User.setCurrent() -> void
 * 
 * Cette méthode positionne l'annuaire sur le listing de utilisateur.
 **/	
	setCurrent:function(){
		System.Directory.setCurrent('user');
	},
/**
 * System.Directory.User.listing(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode prépare le listing des utilisateurs.
 **/	
	listing:function(win){
		
		var panel = win.Panel;
		this.setCurrent();
		
		if(!this.SelectGroup){
			this.SelectGroup = new Select();
			this.SelectGroup.setData([{value:'', text:$MUI('Afficher tous les groupes')}].concat($S.getRoles()));
			this.SelectGroup.Value('');
			this.SelectGroup.setStyle('float:right;width:200px');
			
			this.SelectGroup.on('change', function(){
				this.NavBar.getClauses().page = 0;
				this.load(win);
			}.bind(this));
					
			this.NavBar = new NavBar({
				range1:50,
				range2:100,
				range3:200
			});
			
			this.NavBar.Print = new Node('span', {className:'action', value:'all'}, $MUI('Imprimer listing'));
			this.NavBar.Print.on('click', function(){
								
				$S.exec('user.list.print', {
					parameters: System.Directory.getParameters(),
					onComplete: function(result){
						try{
							var link = result.responseText.evalJSON();
						}catch(er){return}
						var win = $S.openPDF(link);
						win.setTitle($MUI('Listing des utilisateurs'));							
					}
				});
				
			});
						
			this.NavBar.SortByName = 		new Node('span', {className:'icon action sort name asc selected', value:'U.Name'}, $MUI('Nom'));
			//
			//
			//		
			this.NavBar.BtnSendMail = new Node('span', {className:'action icon icon-mail'}, $MUI('Envoyer e-mail'));
			this.NavBar.BtnSendMail.on('click', function(){
				var array = [];
				var win = $WR.getByName('directory');
				
				win.Panel.PanelBody.Body().select('.checkbox.checked').each(function(e){
					if(e.parentNode.data.EMail != ''){
						array.push(e.parentNode.data.EMail);
					}
				});
				
				if(array.length > 0){
					System.Opener.open('mailto', array);
				}
				
			});
			//
			//
			//
			this.NavBar.BtnRemoveSelection = new Node('span', {className:'action icon icon-system-remove'}, $MUI('Supprimer'));
			this.NavBar.BtnRemoveSelection.on('click', function(){
				var array = [];
				var win = $WR.getByName('directory');
				
				win.Panel.PanelBody.Body().select('.checkbox.checked').each(function(e){
					array.push(e.parentNode.data);
				});
								
				if(array.length > 0){
					System.User.removes(win, array);
				}
				
			});
			
			
			this.NavBar.appendChilds([
				this.NavBar.Print,
				this.NavBar.SortByName,
				this.NavBar.BtnSendMail,
				this.NavBar.BtnRemoveSelection
			]);
			
			this.NavBar.SortByName.on('click', function(){
				this.NavBar.select('span.sort.selected').invoke('removeClassName', 'selected');
				this.NavBar.SortByName.addClassName('selected');
				
				if(this.NavBar.SortByName.hasClassName('desc')){
					this.NavBar.SortByName.removeClassName('desc');
					this.NavBar.SortByName.addClassName('asc');
				}else{
					this.NavBar.SortByName.removeClassName('asc');
					this.NavBar.SortByName.addClassName('desc');	
				}
				
				this.load(win);
			}.bind(this));
			
			this.NavBar.on('change', this.listing.bind(this));
			
		}
		
		this.NavBar.appendChild(this.SelectGroup);
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
				
		this.load(win);
		
		panel.InputCompleter.setParameters('cmd=user.list&' + this.getParameters());
		
	},
/**
 * System.Directory.User.load(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode récupère la liste des utilisateurs.
 **/
	load:function(win){
		
		win.Panel.Progress.show();
		var panel = win.Panel;
		
		this.NavBar.setMaxLength(0);
				
		$S.exec('user.list', {
			parameters:this.getParameters(win),
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				try{		
										
					this.NavBar.setMaxLength(result.maxLength);
					
					this.draw(win, array);
					
					if(win.Panel.ProgressBar.hasClassName('splashscreen')){
						new Timer(function(){
							win.Panel.ProgressBar.hide();
							win.Panel.ProgressBar.removeClassName('splashscreen');
						}, 0.5, 1).start();
					}else{
						win.Panel.ProgressBar.hide();
					}
								
				}catch(er){$S.trace(er)}
			}.bind(this)
		});
		
	},
	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		var sort = this.NavBar.select('span.sort.selected')[0];
		var field = sort.value;
				
		if(sort.hasClassName('desc')){	
			sort = 'desc';
		}else{
			sort = 'asc';
		}
		
		clauses.order = field + ' ' + sort;
		clauses.where = $WR.getByName('directory').Panel.InputCompleter.Text();
		
		return 'options=' + Object.EncodeJSON({Role_ID:this.SelectGroup.Value(), Is_Active:2}) + '&clauses=' + clauses.toJSON();
	},
	
	onSearch:function(obj){
		var win = $WR.getByName('directory');
		var panel = win.Panel;
		
		this.NavBar.setMaxLength(obj.maxLength);
		this.NavBar.clauses.where = panel.InputCompleter.Text();
		
		this.draw(win, obj);
	},
/**
 * System.Directory.User.draw(win, array) -> void
 * - win (Window): Instance Window.
 * - array (Array): Liste des utilisateurs à afficher dans le listing.
 *
 * Cette méthode affiche les utilisateurs au listing.
 **/	
	draw: function(win, array){
				
		var self = this;
		var panel = win.Panel;
		
		panel.clearBody();
		
		if(array.length > 0){
			var letter = '';
						
			for(var i = 0; i < array.length; i++){
				
				if(array[i].Name.slice(0,1).toUpperCase() != letter){
					letter = array[i].Name.slice(0,1).toUpperCase() ;
					win.Panel.PanelBody.Body().appendChild(new Node('h2', {className:'letter-group'}, letter)); 
				}
				
				var user =		new System.User(array[i]);
				var button = 	new System.Directory.User.AppButton({
					icon:		user.getAvatar(), 
					text:		user.Name + ' ' + user.FirstName,
					subTitle:	user.getRoleName()
				});
				
				button.data = array[i];
				
				if(user.User_ID == $U().User_ID){
					button.css('border-color', '#DF0059');
				}
				//
				// Button
				//
				var actions = [];
				
				button.Checkbox = new Checkbox();
				button.appendChild(button.Checkbox);
								
				if(user.haveMail()){
					button.Mail = 	new SimpleButton({icon:'mail', nofill:true});
					button.Mail.mail = user.EMail;			
					
					button.Mail.on('click', function(evt){
						evt.stop();
						System.Opener.open('mailto', this.mail);
					});
										
					actions.push(button.Mail);
				}
				
				if(user.havePhoneNumber()){
					button.Phone =	new SimpleMenu({icon:'phone', nofill:true});
					
					if(user.Phone != ''){
						var line = new LineElement({text: $MUI('Téléphone') + ' : ' + user.Phone});
						line.phone =  user.Phone;
						line.css('min-width', 250);
						
						line.on('click', function(evt){
							evt.stop();
							System.Opener.open('tel', this.phone);
						});
						
						button.Phone.appendChild(line);
					}
					
					if(user.Mobile != ''){
						var line = new LineElement({text: $MUI('Mobile') + ' : ' + user.Mobile});
						line.phone =  user.Mobile;
						line.css('min-width', 250);
						
						line.on('click', function(evt){
							evt.stop();
							System.Opener.open('tel', this.phone);
						});
						
						button.Phone.appendChild(line);
					}
						
					actions.push(button.Phone);
				}
				
				var location  = [user.Address, user.City, user.CP, user.Country || 'FRANCE'].without('', ' ').join(', ').trim();
				
				if(location != 'FRANCE'){
					button.Map =	new SimpleButton({icon:'maps', nofill:true});
					button.Map.data =  {
						title:		user.Name + ' ' + user.LastName,
						location:	location,
						Address:	user.Address,
						City:		user.City,
						CP:			user.CP,
						Country:	user.Country || 'FRANCE'
					};
					
					button.Map.on('click', function(evt){
						evt.stop();
						System.Opener.open('map', this.data);
					});
					
					actions.push(button.Map);
				}
				
				if($U().User_ID != user.User_ID){
					button.Remove = new SimpleButton({icon:'remove-element', nofill:true});
					button.Remove.on('click', function(evt){
						evt.stop();
						System.User.remove(this.data);
					}.bind(button));
					actions.push(button.Remove);
					
					
				}else{
					button.Checkbox.hide();	
				}
				//
				//
				//
				var node = 		new Node('div', {className:'wrap-button'}, actions);
				
				button.appendChild(node);
													
				win.Panel.PanelBody.Body().appendChild(button);
				
				button.on('click', function(){
					//alert(document.HasScrolled);
					if(!document.HasScrolled){
						System.User.open(this.data);
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
			win.Panel.PanelBody.Body().appendChild(new Node('h2', {className:'notfound'}, $MUI('Désolé. Aucun utilisateur ne correspond à votre recherche') + '.'));
		}
		
		return this;
	}

};
/** section: Core
 * System.Directory.BlackList
 * includes System.Directory.User
 *
 * Gère le listing des utilisateurs étant blacklistés
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : directory.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Directory.BlackList  = {};

Object.extend(System.Directory.BlackList, System.Directory.User);
Object.extend(System.Directory.BlackList, {
/**
 * System.Directory.BlackList.setCurrent() -> void
 * 
 * Cette méthode positionne l'annuaire sur le listing des utilisateurs blacklistés.
 **/
	setCurrent:function(){
		System.Directory.setCurrent('blacklist');
	},
	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		var sort = this.NavBar.select('span.sort.selected')[0];
		var field = sort.value;
				
		if(sort.hasClassName('desc')){	
			sort = 'desc';
		}else{
			sort = 'asc';
		}
		
		clauses.order = field + ' ' + sort;
		clauses.where = $WR.getByName('directory').Panel.InputCompleter.Text();
		
		return 'options=' + Object.EncodeJSON({Role_ID:this.SelectGroup.Value(), Is_Active:1}) + '&clauses=' + clauses.toJSON();
	}
});
/** section: Core
 * System.Directory.Wait
 * includes System.Directory.User
 *
 * Gère le listing des utilisateurs étant en attente de validation.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : directory.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.Directory.Wait  = {};

Object.extend(System.Directory.Wait, System.Directory.User);
Object.extend(System.Directory.Wait, {
/**
 * System.Directory.Wait.setCurrent() -> void
 * 
 * Cette méthode positionne l'annuaire sur le listing des utilisateurs blacklistés.
 **/	
	setCurrent:function(){
		System.Directory.setCurrent('user-wait');
	},
	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		var sort = this.NavBar.select('span.sort.selected')[0];
		var field = sort.value;
				
		if(sort.hasClassName('desc')){	
			sort = 'desc';
		}else{
			sort = 'asc';
		}
		
		clauses.order = field + ' ' + sort;
		clauses.where = $WR.getByName('directory').Panel.InputCompleter.Text();
		
		return 'options=' + Object.EncodeJSON({Role_ID:this.SelectGroup.Value(), Is_Active:0}) + '&clauses=' + clauses.toJSON();
	}
});

System.Directory.User.AppButton = Class.from(AppButton);
System.Directory.User.AppButton.prototype = {
	
	className:'wobject market-button directory-user-button overable',
/*
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
	}
};


System.Directory.initialize();