/** section: Core
 * class System.Role
 *
 * Cette classe gère les données et formulaires des rôles. Un rôle identifie le niveau d'accès d'un utilisateur à une ressource dans le logiciel
 * Javalyss.
 *
 * Ci-contre, le gestionnaire des rôles :
 *
 * <a href="http://javalyss.fr/public/1/doc/role/listing.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/listing.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/role/info.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/info.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/role/acces.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/acces.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/role/utilisateurs.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/utilisateurs.png"></a>
 *
 **/
System.Role = System.roles = Class.createAjax({
/**
 * System.Role#Role_ID -> Number
 * Numéro d'identifiant du role.
 **/
	Role_ID: 			0,
/**
 * System.Role#Role_ID -> Number
 * Numéro d'identifiant du role parent.
 **/
	Parent_ID:		3,
/**
 * System.Role#Name -> String
 * Titre du rôle.
 **/
	Name: 		'',
/**
 * System.Role#Description -> Number
 * Commentaire associé au role.
 **/
	Description: 	'',
/**
 * System.Role#Is_Active -> Number
 **/
	Is_Active: 		1,
/**
 * System.Role#Role_Meta -> Object
 * Information méta.
 **/
	Role_Meta:		null,
/**
 * new System.Role([obj])
 * - obj (Object): Objet anonyme équivalent à `Role`.
 *
 * Instancie un nouvelle objet de type `Role`.
 **/
	initialize: function(obj){
		
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(this.Role_Meta == null || this.Role_Meta == ''){
			this.Role_Meta = {};	
		}
	},
/**
 * System.Role#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback){
		var obj = {
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, result);
			}.bind(this),
			parameters: 'Role=' + this.toJSON()
		};

		System.exec('role.commit', obj);
	},
/**
 * System.Role#exist(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Vérifie l'existance de l'instance en base de données.
 **/
	exist:function(callback){
		
		var obj = {
			onComplete: function(result){
				try{
					var response = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return;
				}
				
				if(Object.isFunction(callback)) callback.call(this, response);
			},
			parameters: 'Role=' + this.toJSON()
		};
		
		$S.exec('role.exist', obj);
		
	},
/**
 * System.Role#Enable(bool) -> Boolean
 *
 * Cette méthode indique si le groupe est actif ou pas
 **/
	Enable: function(){
		return this.IsActive == 1;
	},
/**
 * System.Role#enabled(bool) -> Boolean
 *
 * Cette méthode indique si le groupe est actif ou pas
 **/
	enabled: function(){
		return this.IsActive == 1;
	},
/**
 * System.Role#getID() -> Number
 *
 * Retourne le numéro d'identifiant.
 **/
	getID: function(){
		return this.Role_ID;
	},
/**
 * System.Role#getID() -> Number
 *
 * Retourne le nom du rôle.
 **/
	getName: function(){
		return this.Name;
	},
/**
 * System.Role#getParentRole() -> Role
 *
 * Retourne le role parent de l'instance.
 **/
	getParentRole: function(){
		return $RM().getByID(this.Parent_ID);
	},
/**
 * System.Role#getComents() -> String
 *
 * Retourne le commentaire explicatif du role.
 **/
	getComents: function(){
		return this.Description;
	},
/**
 * System.Role#getMeta() -> String
 *
 * Retourne des informations supplémentaire stocké sous forme d'objet en base de données.
 * La clef permet de retourner une valeur stocké dynamiquement.
 **/
	getMeta: function(key){
		if(Object.isUndefined(key)) return this.Role_Meta;
		return this.Role_Meta[key];
	},
/**
 * System.Role#setMeta(key, value) -> String
 *
 **/
	setMeta: function(key, value){
		this.Role_Meta[key] = value;
		return this;
	}
});

Object.extend(System.Role, {
	/** @type Object */
	options: 	{},
	/** @type Array */
	array: 		[],
	/** @type Number */
	length:		0,
/**
 * System.Role.startInterface() -> void
 *
 * Méthode appeleé lors du chargement de l'interface du logiciel.
 **/
	startInterface: function(){
		
		$S.observe('role:open.submit.complete', function(){
			var win = $WR.getByName('role.list');
			
			if(win){
				win.loadRoles();	
			}
			
		}.bind(this));

	},
/**
 * System.Role.open(role, force) -> void
 * - role (System.Role | Object): Information du rôle à modifier.
 *
 * Cette méthode ouvre le formulaire gérant un role.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/listing.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/listing.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/role/info.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/info.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/role/acces.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/acces.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/role/utilisateurs.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/utilisateurs.png"></a>
 *
 **/
	open: function(role){
		try{
				
		var win = $WR.unique('role.form', {
			autoclose:	true,
			action: function(){
				this.open(role);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		//#pragma region Instance
		var forms = win.createForm();
		win.setData(role = new System.Role(role));
		
		win.role = 			role;
		win.forms =			forms;
		win.createBox();
		win.createFlag().setType(FLAG.RIGHT);
		win.createTabControl();
		win.NoChrome(true);
		win.Resizable(false);
		
		win.setIcon('system-group');
		win.createHandler($MUI('Chargement en cours') + '...', true);
					
		document.body.appendChild(win);
		
		
		win.TabControl.addPanel($MUI('Informations'), this.createPanelInfo(win));
		
		if(role.Role_ID != 1){
			win.TabControl.addPanel($MUI('Droits'), this.createPanelAppAccess(win)).on('click', function(){
				win.Widget.ScrollBar.refresh();
			});
		}
		
		win.TabControl.addPanel($MUI('Utilisateurs'), this.createPanelUsers(win)).on('click', function(){
			win.Widget.ScrollBar.refresh();
		});
		
		//submit
		//
		forms.submit =		new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		forms.reset =		new SimpleButton({text:$MUI('Fermer')});

		
		forms.submit.on('click',function(){this.submit(win)}.bind(this));
		forms.reset.on('click',function(){win.close()}.bind(this));
		
		win.Footer().appendChild(forms.submit);
		win.Footer().appendChild(forms.reset);
				
		$S.fire('role:open', win);
					
		forms.exist = function(){				
			var role = new System.Role({Name:forms.Name.value, Role_ID:win.role.Role_ID});

			role.exist(function(response){
			
				if(response){
					//forms.Name.select();
					var text = $MUI('Le nom du rôle existe déjà. Veuillez en choisir un autre.');
					win.Flag.setType(FLAG.RIGHT).color('red').setText(text).show(forms.Name, true);
				}
				
			}.bind(this));
		}
		
		win.resizeTo(600, 500);
		
		//forms.Name.observe('blur', forms.exist.bind(this));
						
		}catch(er){
			$S.trace(er);	
		}		
	},
/**
 * System.Role.createPanelInfo(win) -> Panel
 * - win (Window): Fenêtre du formulaire.
 *
 * Cette méthode créée le panneau contenant les informations modifiable du rôle.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/info.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/info.png"></a>
 **/
	createPanelInfo:function(win){
		var role = win.getData();
		var forms = win.createForm();
		var flag = win.createFlag();
		
		var panel = new Panel({background:'', style:''});
		//
		//Splite
		//
		var splite = 		new SpliteIcon($MUI('Gestion du groupe'));
		splite.setIcon('system-group-48');
		//
		//Parent_ID
		//
		forms.Parent_ID =	new Select();
		
		var array = [];
		for(var i = 0; i < this.array.length && i < 3; i++){
			this.array[i].text = 	this.array[i].Name;
			this.array[i].value = 	this.array[i].Role_ID;
			array.push(this.array[i]);
		}
		
		forms.Parent_ID.setData(array);
		forms.Parent_ID.Value(this.options[role.Parent_ID].Role_ID);
		//
		//
		//
		forms.Is_Active = new ToggleButton();
		forms.Is_Active.Value(role.Is_Active == 1);
		
		forms.addFilters('Is_Active', function(){
			return this.Is_Active.Value() ? 1 : 0	
		});
		//
		//Name
		//
		forms.Name = 	new Node('input', {type:'text', value:role.Name});
		forms.Name.css('width', '400px');
		
		if(role.Role_ID <= 3){
			forms.Name.readOnly = true;
		}
		//
		//Description
		//
		forms.Description = 	new Node('textarea', {rows:5, cols:30, style:'width:394px; height:100px; padding:5px;'}, role.Description);
		//
		//Table
		//
		
		forms.table = 		new TableData();
		
		forms.table.addHead($MUI('Nom du groupe')).addCel(forms.Name).addRow();
		forms.table.addHead($MUI('Rôle associé')).addCel(forms.Parent_ID).addRow();
		forms.table.addHead($MUI('Groupe activé')).addCel(forms.Is_Active).addRow();
		forms.table.addHead($MUI('Description'), {style:'vertical-align:top;padding-top:2px'}).addCel(forms.Description).addRow();
		forms.table.addHead(' ', {style:'height:10px'}).addRow();	
		
		
		if(role.Role_ID < 4){
			forms.table.getCel(1,0).parentNode.hide();
			forms.table.getCel(2,0).parentNode.hide();
		}
				
		panel.appendChild(splite);		
		panel.appendChild(forms.table);
		
		flag.add(forms.Name, {
			orientation: Flag.RIGHT,
			text:		$MUI('Le titre permet à l\'utilisateur d\'identifier le rôle rapidement') + '.',
			icon:		'info',
			color:		'grey'
		});
		
		flag.add(forms.Parent_ID, {
			orientation: Flag.RIGHT,
			text:		$MUI('Le rôle associé permet au logiciel de gérer la façon dont les données sont accessibles pour l\'utilisateur') + '.',
			icon:		'info',
			color:		'grey'
		});
		
		flag.add(forms.Description, {
			orientation: Flag.RIGHT,
			text:		$MUI('Il est conseillé d\'ajouter une description pour indiquer comment le groupe modifie l\'utilisation du logiciel') + '.',
			icon:		'info',
			color:		'grey'
		});
		
		return panel;
	},
/**
 * System.Role.createPanelAppAccess(win) -> Panel
 * - win (Window): Fenêtre du formulaire.
 *
 * Cette méthode créée le panneau de gestion des droits d'accès d'un groupe d'utilisateur aux applications.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/acces.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/acces.png"></a>
 **/	
	createPanelAppAccess:function(win){
		var role = win.getData();
		var forms = win.createForm();
		var flag = win.createFlag();
		
		var panel = new Panel({background:'', style:''});
		//
		//
		//
		var splite = 		new SpliteIcon($MUI('Gestion des accès aux applications du groupe'), $MUI('Choissisez les applications auxquelles le groupe peut accéder') + ' : ');
		splite.setIcon('system-account-security-48');
		
		var table = new TableData();
		
		var apps = 				System.plugins.getData();
		var access = 			role.getMeta('AppsAccess') || {};
		forms.AppsAccess = 		{};
				
		win.forms.addFilters('AppsAccess', function(){
			var a = role.getMeta('AppsAccess') || {}
			Object.setObject(a, forms.AppsAccess);
			role.setMeta('AppsAccess', a);
			
			return a;			
		});
				
		for(var i = 0, y = 0; i < apps.length; i++){
			if(!apps[i].Active) continue;
			var icon = new AppButton({
				icon:apps[i].Icon,
				type:'mini'
			});
			icon.addClassName('user');
			
			var toggle = new ToggleButton({type:'mini', yes:'I', no:'O'});
			toggle.Value(Object.isUndefined(access[apps[i].Name]) ? true : access[apps[i].Name]);
			
			table.addCel(icon).addCel(apps[i].Name, {style:'font-size: 13px; padding-left: 5px;width:130px'}).addCel(toggle);
			
			forms.AppsAccess[apps[i].Name] = toggle;
			
			if(y % 2 == 1){
				table.addRow();
			}else{
				table.addCel(' ',  {style:'width:10px'});	
			}
			
			y++;
		}
		
		panel.appendChild(splite);
		panel.appendChild(table);
		
		return panel;		
	},
/**
 * System.Role.createPanelUsers(win) -> Panel
 * - win (Window): Fenêtre du formulaire.
 *
 * Cette méthode créée le panneau listant les utilisateurs du groupe.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/utilisateurs.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/utilisateurs.png"></a>
 **/	
	createPanelUsers: function(win){
		var panel = new Panel({style:'padding:0px; padding:0px'});
		//
		//
		//
		win.Widget = $S.users.createWidgetUsers(win, {
			lastConnexion:	false,
			parameters:		'cmd=user.list&options=' + escape(Object.toJSON({op:'-role', value:win.role.Role_ID}))
		});
		win.Widget.BorderRadius(false);
		win.Widget.setStyle('border-top:0px');
		win.Widget.Body().css('height', '580px');
		
		win.Widget.DropMenu.addMenu($MUI('Supprimer'), {icon:'delete'}).on('click', function(){
			$S.users.removes(win, win.Widget.Table.getDataChecked());
		}.bind(this));
		
		win.Widget.Table.observe('click', function(evt, u){
			if(win.Widget.ScrollBar.isMove()) return;
			$S.users.open(u);
		}.bind(this));
		
		panel.appendChild(win.Widget);
		
		win.Widget.load();
		
		
		return panel;
	},
/**
 * System.Role.submit(win) -> void
 * - win (Window): Fenêtre du formulaire.
 *
 * Cette méthode enregistre les données du formulaire.
 **/
	submit:function(win){
	try{
		
		//if(!this.checkChange(win)) return win.close();
		if(win.forms.Name.value == ''){
			win.Flag.setText($MUI('Veuillez renseigner le titre du rôle'));
			win.Flag.show(win.forms.Name);
			return;
		}
		
		win.forms.save(win.getData());
				
		var evt = new StopEvent(win);
		$S.fire('role:open.submit', evt);
		if(evt.stopped) return;	
					
		win.ActiveProgress();
		
		win.getData().commit(function(){
			
			$S.fire('role:open.submit.complete', win);
			
			var splite = new SpliteIcon($MUI('Le rôle a été correctement enregistré'), win.role.Name);
			splite.setIcon('filesave-ok-48');
			win.AlertBox.setTitle($MUI('Confirmation') + '...').a(splite).setType('NONE').Timer(3).show();
			
			
		});
				
	}catch(er){$S.trace(er)}
	},
/**
 * System.Role.createPanel(win) -> Panel
 * - win (Window): Instance window. 
 *
 * Cette méthode créée le panneau du listing des rôles.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/listing.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/listing.png"></a> 
 **/	
	createPanel: function(win){
		var panel = new Panel({style:'padding:0px;height:600px', background:'user'});
		//
		//
		//
		win.Widget = this.createWidget(win);
		win.Widget.BorderRadius(false);
		win.Widget.setStyle('border-top:0px');
		win.Widget.Header().hide();
				
		panel.appendChild(win.Widget);
		
		win.Widget.load();
		
		return panel;
	},
/**
 * System.Role.createWidget(win [, obj]) -> WidgetTable
 * - win (Window): Instance window. 
 *
 * Cette méthode créée le widget du listing des rôles.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/listing.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/listing.png"></a> 
 **/	
	createWidget: function(win, obj){
		var options = {
			range1:		25,
			range2:		50,
			range3:		100,
			link: 		$S.link,
			select:		false,
			completer: 	false,
			readOnly:	true,
			complex:	true,
			count:		false,
			field:		'Is_Active',
			parameters: 'cmd=role.list&options=' + escape(Object.toJSON({op:'-all'})),
			empty:		'- ' + $MUI('Aucun groupe d\'enregistré') + ' -'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		//
		// Widget
		//
		var widget = new WidgetTable(options);
		widget.css('width', '500px');
			
		widget.addHeader({
			Name:			{title:$MUI('Description du groupe')},
			Is_Active:		{title:$MUI('Activé'), width:90}
		});
		
		widget.Table.onWriteName = function(key){
			if(key == 1) return $MUI('Groupes activés');
			if(key == 0) return $MUI('Groupes désactivés');
		};
		
		widget.removeClassName('menu');
										
		//configuration de la table-----------------------------------------------		
		
		widget.addFilters(['Name'], function(e, cel, data){
			//
			// HTML
			//
			var html = new HtmlNode();
			html.addClassName('user-list-node');
			html.setStyle('padding:4px');
			
			html.append('<h1>' + e + (data.Parent_ID != data.Role_ID ? '<p style="font-size:11px">Parent : ' + System.Role.getByID(data.Parent_ID).getName() + '</p>' : '') + '</h1>');
			
			if(data.Description !='') {
				html.append('<p>' + data.Description + '</p>');
			}
			
			return html;
		}.bind(this));
		
		widget.addFilters(['Is_Active'], function(e, cel, data){
			if(data.Role_ID == 1 || data.Role_ID == 2 || data.Role_ID == 3){
				return '';
			}
			
			var button = new ToggleButton();
			button.Value(e == 1);
			
			button.on('change', function(){
				try{
				var role = new System.Role(data);
				role.Is_Active = button.Value() ? 1 : 0;
				role.commit(function(){
					widget.load();
				});
				}catch(er){console.log(er)}
			});
			
			button.on('click', function(evt){
				evt.stop();
				return;
			});
			
			return button;
			
		});
		
		widget.Table.observe('click', function(evt, u){
			if(widget.ScrollBar.isMove()) return;
			this.open(u);
		}.bind(this));
		
		win.loadRoles = function(){
			widget.load();
		};
						
		//Lancement de l'événement openlistfilter---------------------------------	
		$S.fire('role:list.filters', function(filterName, filterFn){widget.addFilters(filterName, filterFn);}.bind(this));
		
		return widget;
	},
/**
 * System.Role.listing(options) -> void
 * - options (Object): options de filtrage du listing.
 *
 * Cette méthode ouvre la fenêtre listant les roles.
 *
 * <a href="http://javalyss.fr/public/1/doc/role/listing.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/role/listing.png"></a>
 **/
	listing: function(options){
		
		options = Object.isUndefined(options) ? '' : options;
		
		//ouverture de la fenêtre
		var win = $WR.unique('role.list', {
			autoclose:	true,
			action: function(){
				this.listing(options);
			}.bind(this)
		});
		//on regarde si l'instance a été créée
		if(!win) return;
				
		win.forms = {};
		win.Resizable(false);
		win.ChromeSetting(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();
		win.createBubble();
		win.setIcon('system-group');
		win.MinWin.setIcon('system-group');
		win.createHandler($MUI('Chargement en cours'), true);
		//
		// TabControl
		//
		win.createTabControl({offset:22})		
		win.TabControl.addPanel($MUI('Groupes'), this.createPanel(win));
						
		win.appendChild(win.TabControl);
		$Body.appendChild(win);
				
		//win.load();
		
		//Lancement de l'événement openlist
		$S.fire('role:list.open', win);
				
		return win;
	},
/**
 * System.Role.getRole(it) -> Role
 * - it (Number): Indice du tableau de rôle.
 *
 * Cette méthode retourne le rôle en fonction de sa position dans le tableau.
 **/
	getRole: function(it){
		return this.array[it];
	},
/**
 * System.Role.getArray() -> Array
 *
 * Cette méthode retourne le tableau de rôle.
 **/
	getArray: function(){
		return this.array;
	},
/**
 * System.Role.getObject() -> Object
 *
 * Cette méthode retourne un tableau associatif de Role. Les clefs correspondent aux ID du rôle.
 **/
	getObject: function(){
		return this.options;
	},
/**
 * System.Role.getByID(id) -> Role
 * - id (Number): Numéro d'identifiant du rôle.
 * 
 * Cette méthode retourne un rôle en fonction de son ID.
 **/
	getByID: function(id){
		return this.options[id];
	},
/**
 * System.Role.setObject(obj) -> void
 * - obj (Object): Numéro d'identifiant du rôle.
 * 
 * Assigne une liste de role pour le gestionnaire de role.
 **/
	setObject: function(obj){

		if(!Object.isUndefined(obj.length)){
			this.options = 	{};
			this.array = 	[];
			
			for(var i = 0; i < obj.length; i+=1){
				var role = new System.Role(obj[i]);
				
				this.options[role.getID()] = role;
				this.array.push(role);
			}
			
		}else{
			this.options = 	{};
			this.array = 	[];
			
			for(var key in obj){
				var role = new System.Role(obj[key]);
				
				this.options[role.getID()] = role;
				this.array.push(role);
			}
		}
		
		this.length = this.array.length;
		//$S.trace(this.length + ' role(s) chargé(s)');
		return this;
	}
});
/*
 * $RM() -> System.Role
 * Retourne le gestionnaire [[System.Role]].
 **/
function $RM(){
	return $S.Role;
};