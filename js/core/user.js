/** section: Core
 * class System.User
 * Cette classe gère les interfaces de gestion des utilisateurs du logiciel.
 *  
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-theme.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-theme.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-impression.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-impression.png"></a>
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : users.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
var UsersManager = {prototype:{}};
var User =  System.users = System.User = Class.createAjax({
/**
 * System.User#User_ID -> Number
 * Numéro d'identifiant de l'utilisateur.
 **/
	User_ID: 			0,
/**
 * System.User#Civility -> String
 * Civilité de l'utilisateur.
 **/
	Civility: 			'M.',
/**
 * System.User#Role_ID -> Number
 * Numéro d'identifiant du rôle.
 **/
	Role_ID: 			'3',
/**
 * System.User#Name -> String
 * Nom de l'utilisateur.
 **/
	Name: 				'',
/**
 * System.User#FirstName -> String
 * Prénom de l'utilisateur.
 **/
	FirstName: 			'',
/**
 * System.User#Login -> String
 * Identifiant de l'utilisateur.
 **/
	Login:				'',
/**
 * System.User#Password -> String
 * Mot de passe de l'utilisateur.
 **/
	Password: 			'',
/**
 * System.User#EMail -> String
 * Adresse E-mail de l'utilisateur.
 **/
	EMail:				'',
/**
 * System.User#Phone -> String
 * Numéro de téléphone de l'utilisateur.
 **/
	Phone:				'',
/**
 * System.User#Mobile -> String
 * Numéro de mobile de l'utilisateur.
 **/
	Mobile:				'',
/**
 * System.User#Address -> String
 * Adresse de l'utilisateur.
 **/
	Address:			'',
/**
 * System.User#CP -> String
 * Code postal de l'utilisateur.
 **/
	CP:					'',
/**
 * System.User#City -> String
 * Ville de l'utilisateur.
 **/
	City:				'',
/**
 * System.User#Country -> String
 * Pays de l'utilisateur.
 **/
	Country:				'',
/**
 * System.User#Avatar -> String
 * Image attaché au compte de l'utilisateur.
 **/
	Avatar:				'',
	Avatar16:			'',
	Avatar16:			'',
	Avatar48:			'',
/**
 * System.User#Last_Connexion -> Number
 * Dernière connexion de l'utilisateur.
 **/
	Last_Connexion: 	null,
/**
 * System.User#Is_Connect -> Number
 * Indique si l'utilisateur est connecté.
 **/
	Is_Connect: 		false,
/**
 * System.User#Is_Active -> Number
 * Indique si le compte de l'utilisateur est actif.
 * 
 * * `0` Le compte est en attente de confirmation.
 * * `1` Le compte est bloqué.
 * * `2` Le compte est actif.
 **/
	Is_Active:			'2',
/**
 * System.User#Meta -> String
 * Contient les informations méta sous forme JSON ou Object selon le context.
 * Utilisez les méthodes [[User.getMeta]], [[User.setMeta]] ou [[User.Meta]] pour 
 * manipuler les métas.
 **/
	Meta: 			null,
/**
 * new System.User([obj])
 * - obj (Object): Objet anonyme équivalent à `User`.
 *
 * Instancie un nouvelle objet de type `User`.
 **/
	initialize: function(obj){
		
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		
		if(this.Meta == null || this.Meta == '') this.Meta = {};
	},
/**
 * System.User#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		var obj = {
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return 
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
				
			}.bind(this),
			parameters: 'User=' + this.toJSON()
		};
		
		$S.exec('user.commit', obj);
		
	},
/**
 * System.User#remove(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	remove: function(callback, error){
		
		var obj = {
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)) error.call(this, result.responseText);
					return 
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
				
			}.bind(this),
			parameters: 'User=' + this.toJSON()
		};
		
		$S.exec('user.delete', obj);
		
	},
/**
 * System.User#exist(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Vérifie l'existance de l'instance en base de données.
 **/
	exist:function(callback){
		
		var obj = {
			onComplete: callback,
			parameters: 'User=' + this.toJSON()
		};
		
		$S.exec('user.exist', obj);
		
	},
/**
 * System.User#loginExist(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Vérifie l'existance de l'identifiant de l'instance en base de données.
 **/
	loginExist:function(callback){
		
		var obj = {
			onComplete: callback,
			parameters: 'User=' + this.toJSON()
		};
		
		$S.exec('user.login.exist', obj);
		
	},
/**
 * System.User#getAlternativeLogin(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Cette méthode retourne la liste des logins alternatif.
 **/
	getAlternativeLogin: function(callback){
		
		var obj = {
			onComplete: function(result){
				var list = result.responseText.evalJSON();
				
				if(Object.isFunction(callback)) callback.call(this, list);
				
			}.bind(this),
			parameters: 'User=' + this.toJSON()
		};
		
		$S.exec('user.login.alternative.list', obj);
		
	},
/**
 * System.User#emailExist(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Vérifie l'existance de l'adresse e-mail de l'instance en base de données.
 **/
	emailExist:function(callback){
		
		var obj = {
			onComplete: callback,
			parameters: 'User=' + this.toJSON()
		};
		
		$S.exec('user.email.exist', obj);
		
	},
/**
 * System.User#getID() -> String
 *
 * Retourne le numéro d'identifant de l'utilisateur.
 **/
	getID: function(){
		return this.User_ID;
	},
/**
 * System.User#getFullName() -> String
 *
 * Retourne le nom complet de l'utilisateur.
 **/
	getFullName: function(){
		return $MUI(this.Civility) + ' ' + this.Name + ' ' + this.FirstName; 
	},
/**
 * System.User#getRight() -> Number
 *
 * Retourne le niveau de droit d'accès au logiciel de l'utilisateur courant.
 **/
	getRight: function(){
		if(1 <= this.Role_ID && this.Role_ID <= 3) return 1 * this.Role_ID;
		return 1 * this.getRole().Parent_ID;
	},
/**
 * System.User#getRightName() -> String
 * 
 * Retourne le nom du droit d'accès de l'utilisateur courant.
 **/
	getRightName: function(){
		return $RM().getByID(this.getRight()).getName();
	},
/**
 * System.User#getRole() -> Role
 * 
 * Cette méthode retourne le rôle de l'utilisateur.
 **/
	getRole: function(){
		return $RM().getByID(
		this.Role_ID);
	},
/**
 * System.User#getRoleID() -> Number
 *
 * Cette méthode retourne le numero d'identifiant du rôle de l'utilisateur.
 **/
	getRoleID: function(){
		return this.Role_ID;
	},
/**
 * System.User#getRoleName() -> String
 *
 * Cette méthode retourne le nom du rôle de l'utilisateur.
 **/
	getRoleName: function(){
		return this.getRole().getName();	
	},
	
	getAvatar:function(){
		return this.Avatar48 == "" ? '' : this.Avatar48.replace('127.0.0.1', window.location.host);
	},
/**
 * System.User#getMeta(key) -> Mixed
 * - key (String): Nom de la clef.
 *
 * Retourne la valeur d'une clef méta.
 **/
	getMeta: function(key){
		switch(key){
			case 'User_ID':
			case 'Civility': 			
			case 'Role_ID':
			case 'Name':
			case 'FirstName':
			case 'Login':
			case 'Password':
			case 'EMail':
			case 'Phone':
			case 'Mobile':
			case 'Address':
			case 'CP':
			case 'City':
			case 'Country': 
			case 'Is_Active':
				return this[key];
		}

		if(Object.isUndefined(key)) return false;
		return this.Meta[key];
	},
/**
 * System.User#setMeta(key, value [, noupdate]) -> User
 * - key (String): Nom de la clef.
 * - value (Mixed): Valeur de la clef.
 * - noupdate (Boolean): Si la valeur est vrai l'information ne sera pas envoyé vers le serveur. A utiliser si vous avez plusieurs affectation à faire.
 *
 * Affecte une valeur à une clef méta. 
 **/
	setMeta: function(key, value, bool){
		if(typeof this.Meta != "object") this.Meta = {};
		
		switch(key){
			case 'User_ID':
			case 'Civility': 			
			case 'Role_ID':
			case 'Name':
			case 'FirstName':
			case 'Login':
			case 'Password':
			case 'EMail':
			case 'Phone':
			case 'Mobile':
			case 'Address':
			case 'CP':
			case 'City':
			case 'Country':
			case 'Is_Active':
				this[key] = value;
				return this;
		};
		
		this.Meta[key] = value;

		if(!bool) this.commit();
		
		return this;	
	},
	
	havePhoneNumber:function(){
		return this.Phone != '' || this.Mobile != '';
	},
	
	haveMail:function(){
		return this.EMail != '';
	}
});

Object.extend(System.User, {
/**
 * System.User.ACCESS_ENABLE -> 0
 *
 * Compte en attente de confirmation.
 **/	
	ACCESS_WAIT: 	0,
/**
 * System.User.ACCESS_DISABLE -> 1
 *
 * Compte bloqué.
 **/	
	ACCESS_DISABLE: 1,
/**
 * System.User.ACCESS_ENABLE -> 2
 *
 * Compte actif.
 **/	
	ACCESS_ENABLE: 	2,
/**
 * System.User.ETATS -> Array
 **/
	ETATS:[
		{
			text:	$MUI('En attente'), 
			value:	0,
			style:{
				color:'blue',
				fontWeight:'bold'
			}, 
			icon:'user-pause'
		},
		/**
		 * @type Object
		 */		
		{
			text:	$MUI('Bloqué'),
			value:	1,
			style:{
				color:'red',
				fontWeight:'bold'
			}, 
			icon:'user-block'
		},
		/**
		 * @type Object
		 */	
		{
			text:	$MUI('Actif'), 
			value:	2,
			style:{
			
			}, 
			icon:'user-valid'
		}
	],
/*
 * System.User.user -> User
 * Informations sur l'utilisateur connecté.
 **/	
	user: 		null,
	header: 	null,
	fields:		null,
/*
 * System.User.filters -> Object
 * Contient les différents filtres d'affichage du listing.
 **/
	filters: {	
		connect: function(e,cel){
			cel.setStyle('height:25px');
			var node = new Node('div', {style:'background-repeat: no-repeat; background-position:center;width:16px; height:16px;margin:auto'});
			
			if(e == '0') node.className = 'icon-connect-no';
			else node.className = 'icon-connect-established';
			
			return node;
		}
	},
/**
 * System.User.initialize() -> void
 * 
 * Cette méthode initialise les événements de la classe.
 **/
	initialize: function(){
		
		$S.users = this;
		
		this.header = new HeaderList({
			Avatar:			{title:$MUI(' '), style:'width:30px'},
			Name:			{title:$MUI('Nom')},
			EMail:			{title:$MUI('E-mail'), width:'20', style:'padding:0'}
		});	
		
	},
/**
 * System.User.startInterface() -> void
 *
 * Cette méthode lance les procédures de création de l'interface destinées à la gestion des utilisateurs.
 **/
	startInterface: function(){
		
		try{
						
			switch($U().getRight()) {
				case 2: if($S.Meta('MODERATOR_MODE_USER')) break;
				case 1:
					var btn = $S.DropMenu.addMenu($MUI('Utilisateurs'), {icon:'user-edit'})
					btn.observe('click', function(){this.listing()}.bind(this));				
					break;
				default:
					
			}
			
			$S.observe('user:submit.complete', function(){
				var win = $WR.getByName('user.list');
				if(win){
					win.loadUsers();	
				}
			}.bind(this));
			
			$S.observe('user:remove.complete', function(){
				var win = $WR.getByName('user.list');
				if(win){
					win.loadUsers();	
				}
			}.bind(this));
			
		}catch(er){
			$S.trace(er);
		}
	},
/**
 * System.User.GetAndOpen(userid) -> void
 *
 * Cette méthode récupère les informations d'un compte utilisateur et ouvre le formulaire gestion du compte.
 **/	
	GetAndOpen:function(id){
		return System.exec('user.get', {
			parameters:'User_ID=' + id,
			onComplete:function(result){
				System.User.open(result.responseText.evalJSON());
			}
		});
	},
/**
 * System.User.open(user) -> void
 * - user (System.User | Object): Compte utilisateur.
 *
 * Cette méthode ouvre le formulaire de gestion du compte utilisateur `user`.
 *
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-theme.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-theme.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-impression.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-impression.png"></a>
 **/
	open: function(user){
		try{
		
		user = new User(user);
		
		if(user.User_ID == $U().User_ID){
			this.openMyPreferences();
			return;	
		}
				
		if($S.getUserRight() > user.getRoleID()) {
			$S.Alert.setTitle($MUI('Gestion des droits'));
			$S.Alert.a(new SpliteWait($MUI('Vous n\'avez pas les privilèges suffisants pour éditer le profil')));
			$S.Alert.setType('CLOSE').show();
			return;	
		}
		
		var win = $WR.unique('user.form', {
			autoclose:	true,
			action: function(){
				this.open(user);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
		
		//Création de l'override.		
		win.overrideClose({
			submit:	this.submit.bind(this), 
			change:	this.checkChange.bind(this),
			close:	function(){}.bind(this)
		});
		//Vérification régulière de l'état de la fiche lorsqu'un click est intercepté
		win.body.on('click', function(){
			try{
				if(this.checkChange(win)){
					win.forms.active();	
				}
			}catch(er){$S.trace(er)}
		}.bind(this));
		
		//création de l'objet forms
		var forms = win.forms = 	win.createForm({
			update:	false,
			
			active:	function(){
				if(this.update) return;                                                                                                                                                                                         
				this.update = true;
				//desactivation de la synchro avec la bdd
				win.forms.submit.setTag("<b>!</b>");
				win.forms.submit.css('padding-right', '10px');
				win.forms.submit.Tag.on('mouseover', function(){
					$S.Flag.setText('<p class="icon-documentinfo">' + $MUI('Le formulaire a subi une ou plusieurs modification(s)') + '.</p>').setType(FLAG.RB).color('grey').show(this, true);
				});
			},
			
			deactive: function(){
				this.update = false;
				win.forms.submit.setTag("");
				win.forms.submit.css('padding-right', null);
				win.forms.submit.Tag.stopObserving('mouseover');
			},
			
			onChange:function(key, o, n){
				$S.trace(key + ' => Avant : ' + o + ', Après : ' + n);
				this.active();
			}
		});
		//#pragma region Instance
		//
		//
		//
		win.setData(win.user = user);
		win.createTabControl({type:'top'})
		win.createBox();
		win.createFlag().setType(FLAG.RIGHT);
		win.setIcon('system-account');
		win.MinWin.setIcon('system-account');
		win.Resizable(false);
		win.NoChrome(true);
		win.createHandler($MUI('Chargement en cours') + '...', true);
		//
		// Submit
		//
		forms.submit =		new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		forms.submit.on('click',function(){this.submit(win)}.bind(this));
		
		forms.close =		new SimpleButton({text:$MUI('Fermer')});
		forms.close.on('click',function(){win.close()}.bind(this));
		
		win.Footer().appendChild(forms.submit);
		win.Footer().appendChild(forms.close);
		
		$Body.appendChild(win);
		
		win.TabControl.addPanel($MUI('Compte'), this.createPanelGeneral(win));
		win.TabControl.addPanel($MUI('Sécurité'), this.createPanelSecurity(win)).setIcon('system-account-security');
		
		$S.fire('user:open', win);
					
		//events---------------------------------------------------------------------
		forms.logoNode.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez sur l\'image pour changer l\'avatar du compte') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.Avatar.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez sur le bouton pour charger un avatar ou saisissez directement l\'adresse URL de votre avatar') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.Name.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>Nom</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.FirstName.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>Prénom</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.EMail.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>adresse E-mail</b>') + '.</p><p><i>' + $MUI('L\'adresse e-mail est utilisé par le logiciel pour vous identifier en supplément de votre <b>identifiant</b>. Cette dernière ne doit pas être déjà enregistré en base de données') + '.</i></p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.Phone.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>numéro téléphone</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.Mobile.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>numéro de mobile</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.Password.on('mouseover', function(){
			var text = $MUI('Conseil : votre mot de passe doit faire au moins 7 caractères de long. Pour le rendre plus sûr, utilisez un mélange de majuscule, de minuscules, de chiffres et de symboles comme ! " ? $ % ^ & ).');
			win.Flag.setType(FLAG.RIGHT).color('grey').setText('<p class="icon-documentinfo">' + text + '</div>').show(this, true);
		});
		
		
		forms.Password2.on('mouseover', function(){
			var text = $MUI('Conseil : votre mot de passe doit faire au moins 7 caractères de long. Pour le rendre plus sûr, utilisez un mélange de majuscule, de minuscules, de chiffres et de symboles comme ! " ? $ % ^ & ).');
			win.Flag.setType(FLAG.RIGHT).color('grey').setText('<p class="icon-documentinfo">' + text + '</div>').show(this, true);
		});
		
		
		forms.Login.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'identifiant vous permettra de vous connecter à l\'admininistration') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.Role_ID.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez un rôle pour utilisateur') + '.</p><p>' + $MUI('Ce rôle définira les actions possibles que pourra faire ou non l\'utilisateur') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.Is_Active.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez pour activer ou désactiver le compte de l\'utilisateur') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		forms.FirstName.on('keyup', function(evt){
			if(user.User_ID) return;
			forms.FirstName.value = 	forms.FirstName.value.slice(0,1).toUpperCase() + forms.FirstName.value.slice(1, forms.FirstName.value.length);
			forms.Login.value = 	(forms.FirstName.value.slice(0,1) + forms.Name.value.slice(0,7)).toLowerCase();
		});

		forms.Name.on('keyup', function(evt){
			if(user.User_ID) return;
			forms.Name.value = 	forms.Name.value.slice(0,1).toUpperCase() + forms.Name.value.slice(1, forms.Name.value.length);
			forms.Login.value = (forms.FirstName.value.slice(0,1) + forms.Name.value.slice(0,7)).toLowerCase();
		});
				
		}catch(er){
			$S.trace(er);
		}
	},
/**
 * System.User.checkChange(win) -> void
 * - win (Window): Fenêtre du formulaire.
 * 
 * Cette méthode vérifie si le formulaire a été modifié par l'utilisateur.
 **/
	checkChange: function(win){
		if(win.forms.update) return true;
		return win.forms.checkChange(win.getData());
	},
/**
 * System.User.submit(win) -> void
 * - win (Window): Fenêtre du formulaire.
 * - noclose (Boolean): Si la valeur est vrai la fermeture sera interompue.
 *
 * Enregistre les données du formulaire.
 **/
 	submit:function(win){
		try{
		
		win.Flag.hide();
		
		if(win.forms.FirstName.Value() == '') {
			win.TabControl.select(0);
			win.Flag.setText($MUI('Le Prénom est obligatoire'));
			win.Flag.show(win.forms.FirstName);
			return true;
		}

		if(win.forms.Name.Value() == '') {
			win.TabControl.select(0);
			win.Flag.setText($MUI('Le Nom est obligatoire'));
			win.Flag.show(win.forms.Name);
			return true;
		}

		if(win.forms.EMail.Text() == '') {
			win.TabControl.select(0);
			win.Flag.setText($MUI('L\'e-mail est obligatoire afin de vous joindre<br />ou de vous fournir un mot de passe de rechange'));
			win.Flag.show(win.forms.EMail);
			return true;
		}

		if(!win.forms.EMail.Text().toLowerCase().isMail()) {
			win.TabControl.select(0);
			win.Flag.setText($MUI('La syntaxe de l\'e-mail est incorrect'));
			win.Flag.show(win.forms.EMail);
			return true;
		}
				
		if(win.forms.Password.Value().length < 7){
			win.TabControl.select(1);
			win.Flag.setText($MUI('Veuillez choisir un mot de passe correct'));
			win.Flag.show(win.forms.Password);
			return true;
		}
		
		if(win.forms.Password.Value() != win.forms.Password2.Value()) {
			win.TabControl.select(1);
			win.Flag.setText($MUI('Les mots de passe ne sont pas identique'));
			win.Flag.show(win.forms.Password);
			return true;
		}
		
		if(win.forms.Login.Value() == ''){
			win.forms.Login.value == (win.forms.FirstName.value.slice(0,1) + win.forms.Name.value.slice(0,7)).toLowerCase();
		}
		
		}catch(er){$S.trace(er)}
		
		if(!this.checkChange(win)) return;
		
		var evt = new StopEvent(win);
		$S.fire('user:open.submit', evt);
		if(evt.stopped) return;
			
		var current = win.forms.save(win.getData());	
						
		win.AlertBox.wait();
		
		win.getData().commit(function(responseText){
			win.AlertBox.hide();
											
			$S.fire('user:submit.complete', win.getData());
			
			var splite = new SpliteIcon($MUI('La fiche a été correctement sauvegardé'), $MUI('Utilisateur') +' : ' + win.getData().Name + ' ' + win.getData().FirstName);
			splite.setIcon('filesave-ok-48');
				
			win.AlertBox.a(splite).setIcon('system-account').setTitle($MUI('Gestion compte utilisateur')).ty('NONE').Timer(3).show();
			
			win.forms.deactive();
			win.focus();
			
		}.bind(this), function(responseText){
			
			switch(responseText){
				case 'user.name.exist':
					win.TabControl.select(0);
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'utilisateur (Nom et Prénom) est déjà enregistré') + ' !</p>');
					win.Flag.color('grey').show(win.forms.Name);
					return;
				
				case 'user.login.exist':
					win.TabControl.select(0);
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'identifiant est déjà utilisé par un autre utilisateur') + ' !</p>');
					win.Flag.color('grey').show(win.forms.Login);
					return;
				
				case 'user.email.exist':
					win.TabControl.select(0);
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'adresse E-mail est déjà enregistré par un autre utilisateur') + '.</p>')
					win.Flag.color('grey').show(win.forms.EMail);
					return;	
			}
			
		});
	},
/** deprecated
 * System.User.listing(options) -> void
 * - options (Object): options de filtrage du listing.
 *
 * Cette méthode ouvre la fenêtre listant les utilisateurs du logiciel. Cette méthode n'est plus utilisé par le logiciel. Repportez-vous à la classe [[System.Directory]] pour plus d'informations.
 **/
	listing: function(options){
		
		options = Object.isUndefined(options) ? '' : options;
		
		//ouverture de la fenêtre
		var win = $WR.unique('user.list', {
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
		win.setIcon('user-edit');
		win.MinWin.setIcon('user-24');
		win.MinWin.addLine($MUI('Créer compte'), {icon:'user-add', position:0});
		win.Body().setStyle('overflow:visible');
		win.createHandler($MUI('Chargement en cours'), true);
		//
		//
		//
		win.forms.add = new SimpleMenu({text:$MUI('Créer compte'), icon:'user-add'});	
		win.forms.add.on('click', function(){this.open()}.bind(this));
		//
		//
		//
		win.forms.print = new SimpleMenu({text:('Imprimer'), icon:'print'}).on('click',function(){
			$S.exec('user.list.print', {
				parameters: 'clauses=' + escape(Object.toJSON(win.Widget.clauses)) + '&' + win.Widget.parameters,
				onComplete: function(result){
					try{
						var link = result.responseText.evalJSON();
					}catch(er){return}
					var win = $S.openPDF(link);
					win.setTitle($MUI('Listing des utilisateurs'));							
				}
			});
		}.bind(this)).on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez ici pour imprimer le listing') + '.<p>')
			win.Flag.setType(FLAG.BOTTOM).color('grey').show(this, true);
		});
		
		//
		// TabControl
		//
		win.createTabControl({offset:22})		
		win.TabControl.addPanel($MUI('Utilisateurs'), this.createPanelUsers(win));
		win.TabControl.addSimpleMenu(win.forms.print);
		win.TabControl.addSimpleMenu(win.forms.add);
						
		win.appendChild(win.TabControl);
		$Body.appendChild(win);
		
		win.moveTo(0,0);
		win.resizeTo('auto', document.stage.stageHeight);
		
		//win.load();
		
		//Lancement de l'événement openlist
		$S.fire('users:open.list', win);
		$S.fire('user:list.open', win);
				
		return win;
	},
/**
 * System.User.createPanelUsers(win) -> Panel
 * - win (Window): Fenêtre du formulaire.
 *
 * Cette méthode créée le panneau listant les utilisateurs.
 **/	
	createPanelUsers: function(win){
		var panel = new Panel({style:'padding:0px; padding:0px', background:'user'});
		//
		//
		//
		win.Widget = this.createWidgetUsers(win, {lastConnexion:true});
		win.Widget.BorderRadius(false);
		
		win.Widget.DropMenu.addMenu($MUI('Supprimer'), {icon:'delete'}).on('click', function(){
			this.removes(win, win.Widget.Table.getDataChecked());
		}.bind(this));
		
		win.Widget.Table.observe('click', function(evt, u){
			if(win.Widget.ScrollBar.isMove()) return;
			this.open(u);
		}.bind(this));
		
		panel.appendChild(win.Widget);
		
		win.Widget.load();
				
		return panel;
	},
/**
 * System.User.createWidgetUsers(win [, obj]) -> WidgetTable
 * - win (Window): Fenêtre du formulaire.
 *
 * Cette méthode créée le widget du listing des utilisateurs.
 **/	
	createWidgetUsers: function(win, obj){
		var options = {
			range1:		25,
			range2:		50,
			range3:		100,
			link: 		$S.link,
			select:		false,
			complex: 	true,
			field:		'Letter',
			parameters: 'cmd=user.list',
			empty:		'- ' + $MUI('Aucun compte utilisateur d\'enregistré') + ' -',
			lastConnexion:	false
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		//
		// Widget
		//
		var widget = new WidgetTable(options);
		
		widget.setStyle('margin-bottom:0px');
		widget.Table.Header().hide();
		widget.setStyle('margin:0');
		widget.Body().setStyle('min-height:400px');		
		widget.addHeader(this.header);
										
		//configuration de la table-----------------------------------------------		
		widget.addFilters(['Avatar'], function(e, cel, data){
			
			var deficon = 	data.Avatar48 == "" ? ((data.Civility == 'Mme.' || data.Civility == 'Mlle.') ? 'woman-48' : 'men-48') : data.Avatar48.replace('127.0.0.1', window.location.host);
			var button = 	new AppButton({icon: deficon, type:'mini'});
			button.addClassName('user');
			
			if(data.User_ID == $U().User_ID){
				button.css('border-color', '#DF0059');
			}
			
			if(1 * data.Is_Active == 1){
				button.appendChild(new Node('div', {className:'icon-block', style:'position:absolute;bottom:-3px;right:-3px;height:16px;width:16px'}));
			}
						
			return button;
		}.bind(this));
		
		widget.addFilters(['Name'], function(e, cel, data){
			
			
			//
			// HTML
			//
			var html = new HtmlNode();
			html.addClassName('user-list-node');
			html.setStyle('padding:4px');
			
			html.append('<h1><span class="user-lastname">' + data.FirstName + '</span> <span class="user-name">' + data.Name + '</span><p style="font-size:11px">Alias ' + data.Login + '</p></h1>');
						
			return html;
		});
		
		widget.addFilters('EMail', function(e, cel, data){
			var group = 	new GroupButton();
			var array =		[];
			//
			// mail
			//
			var button = 	new SimpleButton({icon:'mail-new'});
			
			button.on('click', function(evt){
				evt.stop();
				window.location = 'mailto:' + data.EMail;
			});
			
			button.on('mouseover', function(){
				win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez ici pour contacter l\'utilisateur') + '.</p><p>E-mail : ' + data.EMail + '</p>');
				win.Flag.setType(FLAG.LEFT).color('grey').show(this, true);
				//win.Flag.decalTo(0, -widget.ScrollBar.getScrollTop());
			});
			
			array.push(button);
			//
			// mail
			//
			if(data.Phone != ''){
				var button = 	new SimpleButton({icon:'device-mobile'});
			
				button.on('click', function(evt){
					evt.stop();
					window.location = 'tel:' + data.Phone;
				});
				
				win.Flag.add(button, {
					orientation: 	Flag.TOP,
					text:			$MUI('N° téléphone') + ' : ' + data.Phone,
					icon:			'device-mobile',
					color:			'grey'
				});
				
				array.push(button);
			}
			//
			// mail
			//
			if(data.Mobile != ''){
				var button = 	new SimpleButton({icon:'device-mobile'});
			
				button.on('click', function(evt){
					evt.stop();
					window.location = 'tel:' + data.Mobile;
				});
				
				win.Flag.add(button, {
					orientation: 	Flag.TOP,
					text:			$MUI('N° mobile') + ' : ' + data.Mobile,
					icon:			'device-mobile',
					color:			'grey'
				});
				
				array.push(button);
			}
			
			if(options.lastConnexion){
				cel.setStyle('width:100px;text-align:center;');		
						
				if(data.Last_Connexion.toDate().minsDiff(new Date()) > 10){	
					var button = new SimpleButton({icon:'14-layer-visible'});
				}else{
					var button = new SimpleButton({icon:'14-layer-novisible'});
				}
				
				button.on('mouseover', function(){
					if(data.Last_Connexion && data.Last_Connexion != "0000-00-00 00:00:00"){
						win.Flag.setText('<p class="icon-clock">' + $MUI('Dernière connexion le') + ' ' + data.Last_Connexion.toDate().format('l d F Y ' + $MUI('à') + ' h\\hi') + '</p>');
					}else{
						win.Flag.setText('<p class="icon-clock">' + $MUI('Jamais connecté') + '</p>');
					}
					
					win.Flag.setType(FLAG.LT).color('grey').show(this, true);
					//win.Flag.decalTo(3, 3);
				});
				array.push(button);
			}
			
			group.appendChilds(array);
					
			return group;
		});
				
		widget.addFilters(['FirstName'], function(e, cel){
			cel.hide();
			return e;
		});
		
		win.loadUsers = function(){
			widget.load();
		};
						
		//Lancement de l'événement openlistfilter---------------------------------	
		$S.fire('user:list.filters', function(filterName, filterFn){widget.addFilters(filterName, filterFn);}.bind(this));
		
		return widget;
	},
/**
 * System.User.openMyPreferences() -> void
 *
 * Cette méthode créée une nouvelle fenêtre des préférences de l'utilisateur connecté.
 *
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-theme.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-theme.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png"></a>
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-impression.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-impression.png"></a>
 **/
	openMyPreferences: function(it){
		try{
		var win = $WR.unique('user.preference', {
			autoclose:	true,
			action: function(){
				this.openMyPreferences(it);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
				
		//#pragma region Instance
		
		//
		//Window
		//
		var forms = win.forms = win.createForm({});
		
		win.setData(win.user = $U());
		
		win.setTitle($MUI('Gestionnaire du compte'));
		win.setIcon('system-account');
		win.Resizable(false);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();
		win.createBubble();
		win.NoChrome(true);
		win.createHandler($MUI('Chargement en cours') + '...', true);
		win.createTabControl({offset:22, type:'left'});
		
		$Body.appendChild(win);				
		//
		// Panel Générale
		//	
		var panel = this.createPanelGeneral(win);
		panel.submit = new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		panel.appendChild(panel.submit);
		
		panel.submit.on('click', function(){
			this.submitGeneral(win);
		}.bind(this));
		
		win.TabControl.addPanel($MUI('Mon compte'), panel).setIcon('system-account');
		//
		// Panel Thème
		//
		if($S.Meta('USE_THEMES')){
			win.TabControl.addPanel($MUI('Thème'), $S.themes.createPanelChoice(win)).setIcon('system-account-template').on('click',function(){
				win.refresh();
			});
			win.TabControl.addPanel($MUI('Fond d\'écran'), $S.themes.createPanelBackground(win)).setIcon('system-account-background');
		}
		//
		// Panel sécurity
		//
		panel = this.createPanelSecurity(win);
		panel.submit = new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		panel.appendChild(panel.submit);
		
		panel.submit.on('click', function(){
			this.submitSecurity(win);
		}.bind(this));
				
		win.TabControl.addPanel($MUI('Sécurité'), panel).setIcon('system-account-security');
		
		if($U().getRight() <= 2){
			win.TabControl.addPanel($MUI('Impression'), System.Settings.createPanelPrint(win)).setIcon('system-account-print');
		}
		
		win.TabControl.addPanel($MUI('Pref. avancées'), this.createPanelAdvanced(win)).setIcon('system-account-advanced').hide();
		win.TabControl.addPanel($MUI('A propos'), $S.Settings.createPanelInfo(win)).setIcon('system-info');
		win.TabControl.addSection($MUI('Apps'));
				
		//#pragma endregion Instance
		
		win.appendChilds([win.TabControl]);

		//génération des principaux panneaux
		$S.fire('user:open.preferences', win);
		
		win.resizeTo();
								
		win.TabControl.select(Object.isNumber(it) ? it : 0);
		
		if($S.Meta('USE_THEMES') && it == 1){win.refresh();}
		
		win.forms.Name.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>Nom</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		win.forms.FirstName.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>Prénom</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		win.forms.EMail.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>adresse E-mail</b>') + '.</p><p><i>' + $MUI('L\'adresse e-mail est utilisé par le logiciel pour vous identifier en supplément de votre <b>identifiant</b>.') + '.</i></p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		win.forms.Phone.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>numéro téléphone</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		win.forms.Mobile.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre <b>numéro de mobile</b>') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		win.forms.Avatar.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez sur le bouton pour charger un avatar ou saisissez directement l\'adresse URL de votre avatar') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});
		
		var sender = this;
		
		win.forms.Password.observe('mouseover', function(){
			
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Conseil : votre mot de passe doit faire au moins 7 caractères de long. Pour le rendre plus sûr, utilisez un mélange de majuscule, de minuscules, de chiffres et de symboles comme ! " ? $ % ^ & )') +'.</p>').setStyle(FLAG.RIGHT).color('grey').show(this, true);
			
		});
				
		win.forms.Password2.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Confirmez ici votre nouveau <b>mot de passe</b>') + '.</p>').setStyle(FLAG.RIGHT); 
			win.Flag.color('grey');
			win.Flag.show(this, true);
		});
				
		return win;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 * System.User.createPanelGeneral(win) -> Panel
 * - win (Window): instance window.
 *
 * Cette méthode créée le panneau générale contenant les informations du compte utilisateur.
 *
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur.png"></a>
 **/
	createPanelGeneral: function(win){
		
		//#pragma region Instance
		//
		//Node
		//
		var panel = 	new Panel({background:"user", style:'width:500px;min-height:500px;'});	
		var deficon = 	win.getData().getAvatar();
		//
		//
		//
		win.forms.logoNode = 			new Node('div', {className:"bookmark-avatar"});
		win.forms.logoNode.picture = 	new Node('img', {height:60});
		win.forms.logoNode.appendChild(win.forms.logoNode.picture);
		win.forms.logoNode.picture.src = deficon;
		
		win.forms.logoNode.on('click', function(){
			$FM().join(null, function(file){
				win.forms.Avatar.Text(file.uri);
				win.forms.Avatar.Value(file.uri);
				
				win.forms.logoNode.picture.src = file.uri;
			});
		});
		
		win.forms.logoNode.observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez sur l\'image pour changer l\'avatar du compte') + '.</p>'); 
			win.Flag.color('grey').setType(FLAG.RIGHT);
			win.Flag.show(this, true);
		});	
		//
		//Splite
		//
		var splite =	new SpliteIcon($MUI('Information sur le compte'), win.user.FirstName + ' ' +  win.user.Name);
		splite.left.appendChild(win.forms.logoNode);
		splite.addClassName('splite-avatar');
		//
		//Civility
		//
		win.forms.Civility = new Select();
		win.forms.Civility.setData([
			{text:$MUI('M.'), value: 'M.'},
			{text:$MUI('Mme.'), value: 'Mme.'},
			{text:$MUI('Mlle.'), value: 'Mlle.'}
		]);
		
		win.forms.Civility.selectedIndex(0);
		win.forms.Civility.Value(win.user.Civility);
		
		//
		//Login
		//
		win.forms.Login = 	new Input({type:'text', maxLength: 50, value: win.user.Login});
		//
		//Civility
		//
		win.forms.Name = 	new Input({type:'text', maxLength: 100, value: win.user.Name});
		//
		//FirstName
		//
		win.forms.FirstName = 	new Input({type:'text', maxLength: 100, value: win.user.FirstName});
		//
		//Email
		//
		win.forms.EMail = 	new InputButton({type:'text', maxLength: 100, value: win.user.EMail, sync:true, icon:'system-mail'});
		win.forms.EMail.SimpleButton.on('click', function(){
			if(win.forms.EMail.Text() == '') return;
			System.Opener.open('mailto', win.forms.EMail.Text());
		});
		
		win.forms.addFilters('EMail', 'Text');
		//
		//Phone
		//
		win.forms.Phone = 	new InputButton({type:'text', maxLength: 30, value: win.user.Phone, sync:true, icon:'system-phone'});
		win.forms.Phone.SimpleButton.on('click', function(){
			if(win.forms.Phone.Text() == '') return;
			System.Opener.open('tel', win.forms.Phone.Text());
		});
		
		win.forms.addFilters('Phone', 'Text');
		//
		//Mobile
		//
		win.forms.Mobile = 	new InputButton({type:'text', maxLength: 30, value: win.user.Mobile, sync:true, icon:'system-phone'});
		win.forms.Mobile.SimpleButton.on('click', function(){
			if(win.forms.Mobile.Text() == '') return;
			System.Opener.open('tel', win.forms.Mobile.Text());
		});
		
		win.forms.addFilters('Mobile', 'Text');
		//
		//Mobile
		//
		win.forms.Address = new Input({type:'text', maxLength: 255, value: win.user.Address});
		//
		//
		//
		win.forms.CP =	new InputCP();
		win.forms.CP.Text(win.user.CP);
		//
		//
		//
		win.forms.City =	new InputCity();
		win.forms.City.Text(win.user.City);
		win.forms.City.linkTo(win.forms.CP);
		//
		//
		//
		win.forms.Country = new InputCompleter({minLength:0, delay:0, button:false});
     	win.forms.Country.setData(Countries.toData());
		//win.forms.Country.Input.addClassName('icon-cell-edit');
		win.forms.Country.Value(win.user.Country);
		//
		// Role
		//
		win.forms.Role_ID = new Select({
			link:$S.link,
			parameters: 'cmd=role.list&options=' + escape(Object.toJSON({op:'-all'}))
		});
		win.forms.Role_ID.Value(win.user.Role_ID);
		win.forms.Role_ID.load();
		//
		//
		//
		win.forms.Is_Active = new ToggleButton();
		win.forms.Is_Active.Value(win.user.Is_Active == 2);
		
		win.forms.addFilters('Is_Active', function(){
			if(this.Is_Active.Value()){
				return 2;
			}
			
			return 1;
		});
		//
		// Avatar
		//
		win.forms.Avatar = new InputButton({icon:'system-attach', sync:true});
		win.forms.Avatar.setText(win.user.Avatar);
		
		win.forms.Avatar.SimpleButton.on('click', function(){
			$FM().join(null, function(file){
				win.forms.Avatar.Text(file.uri);
				win.forms.Avatar.Value(file.uri);
				win.forms.logoNode.picture.src = file.uri;
			});
		});
		
		win.forms.addFilters('Avatar', 'Text');
		//
		//Table1
		//
		var table = 	new TableData();	
		if(win.user.User_ID != 0) table.addHead($MUI('Identifiant')).addField(win.forms.Login).addRow();
		
		table.addHead($MUI('Civilité')).addField(win.forms.Civility).addCel(' ').addRow();
		table.addHead($MUI('Nom')).addField(win.forms.Name).addRow();
		table.addHead($MUI('Prénom')).addField(win.forms.FirstName).addRow();
		if(win.user.User_ID == 0) table.addHead($MUI('Identifiant')).addField(win.forms.Login).addRow();
		table.addHead($MUI('Avatar')).addField(win.forms.Avatar).addRow();
		
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addRow();
		
		if(win.user.User_ID == $U().User_ID){
			table.addHead($MUI('Groupe')).addField(win.user.getRoleName()).addRow();
		}else{
			
			if($U().getRight() == 2){
				table.addHead($MUI('Groupe')).addField(win.user.getRoleName()).addRow();	
			}else{
				table.addHead($MUI('Groupe')).addField(win.forms.Role_ID).addRow();
			}
			
			table.addHead($MUI('Compte activé')).addCel(win.forms.Is_Active).addRow();
		}
		
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addRow();
		table.addHead($MUI('Adresse')).addField(win.forms.Address).addRow();
		table.addHead($MUI('Code postal')).addField(win.forms.CP).addRow();
		table.addHead($MUI('Ville')).addField(win.forms.City).addRow();
		table.addHead($MUI('Pays')).addField(win.forms.Country).addRow();
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addRow();
		table.addHead($MUI('E-mail')).addField(win.forms.EMail).addRow();
		table.addHead($MUI('Téléphone')).addField(win.forms.Phone).addRow();
		table.addHead($MUI('Mobile')).addField(win.forms.Mobile).addRow();
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addRow();
		
		//#pragma endregion Instance
				
		panel.appendChilds([splite, table]);
			
		if(win.user.User_ID == $U().User_ID){
			$S.fire('user:account.open', win, panel);
		}
		
		win.forms.Login.on('blur', function(){
			
			var u = 	win.user.clone();
			u.Login = 	win.forms.Login.value;
			
			u.loginExist(function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(er);
					return;
				}
			
				if(obj > 0){
					win.forms.Login.value = win.forms.Login.value + '-' + obj;
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'identifiant est déjà utilisé. Nous vous proposons celui-ci !') + '</p>');
					win.Flag.color('grey').show(win.forms.Login);
				}
			})
		});
		
		return panel;
	},
/**
 * System.User.submitGeneral(win) -> void
 *
 * Cette méthode enregistre les données du panneau d'information générale du compte utilisateur.
 **/	
	submitGeneral: function(win){
		if(win.forms.Login.Value() == ''){
			win.forms.Login.select();
			win.Flag.setText($MUI('Veuillez saisir une <b>adresse e-mail</b> pour votre compte')).color('red').setType(FLAG.RIGHT);
			win.Flag.show(win.forms.Login);
			return;	
		}
		
		if(!win.forms.EMail.Value().isMail()){
			win.forms.EMail.select();
			win.Flag.setText($MUI('Veuillez saisir une <b>adresse e-mail valide</b> pour votre compte')).color('red').setType(FLAG.RIGHT);
			win.Flag.show(win.forms.EMail);
			return;	
		}
		
		if(win.forms.Name.Value() == ''){
			win.forms.Name.select();
			win.Flag.setText($MUI('Veuillez saisir un <b>nom</b> pour votre compte')).color('red').setType(FLAG.RIGHT);
			win.Flag.show(win.forms.Name);
			return;	
		}
		
		if(win.forms.FirstName.Value() == ''){
			win.forms.FirstName.select();
			win.Flag.setText($MUI('Veuillez saisir un <b>prénom</b> pour votre compte')).color('red').setType(FLAG.RIGHT);
			win.Flag.show(win.forms.FirstName);
			return;	
		}
		
		var evt = new StopEvent(win);
		$S.fire('user:account.submit', evt);
		if(evt.stopped) return;
		
		var current = win.createForm().save(win.getData());
		
		win.ActiveProgress();
		
		current.commit(function(responseText){
			win.setData(current);
			
			switch(responseText){
				case 'user.name.exist':
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'utilisateur (Nom et Prénom) est déjà enregistré') + ' !</p>');
					win.Flag.color('grey').show(win.forms.Name);
					return;
					
				case 'user.login.exist':
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'identifiant est déjà utilisé par un autre utilisateur') + ' !</p>');
					win.Flag.color('grey').show(win.forms.Login);
					return;
				
				case 'user.email.exist':
					win.Flag.setText('<p class="icon-documentinfo">' + $MUI('L\'adresse E-mail est déjà enregistrée par un autre utilisateur') + '.</p>')
					win.Flag.color('grey').show(win.forms.EMail);
					return;	
			}
					
			$S.fire('user:account.submit.complete', current);
		
			var splite = new SpliteIcon($MUI('Vos informations ont correctement été modifié'));
			splite.setIcon('filesave-ok-48');
			
			win.AlertBox.setTitle($MUI('Mon compte')).setIcon('system-account').a(splite).ty('CLOSE').Timer(5).show();
			win.AlertBox.getBtnReset();
			
		}.bind(this));
	},
/**
 * System.User.createPanelSecurity(win) -> Panel
 * - win (Window): instance window.
 *
 * Cette méthode créée le panneau de sécurité lié à l'utilisateur connecté.
 *
 * <a href="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png" rel="lightbox" class="picture-galery"><img src="http://javalyss.fr/public/1/doc/directory/compte-utilisateur-securite.png"></a>
 *
 **/
	createPanelSecurity: function(win){
		
		//#pragma region Instance
		//
		//Panel
		//
		var panel = 	new Panel({background:"security", style:'width:500px;min-height:500px;'});
		//
		//Splite
		//		
		var splite =	new SpliteIcon($MUI('Centre de sécurité'));
		splite.setIcon('system-account-security-48');
		//
		//passEval
		//
		var passEval =			new PasswordEval();
		passEval.css('width','100%');
		//
		//Password
		//
		win.forms.Password = 	new Input({type:'password', maxLength: 15, value: win.user.Password});
		//
		//Password2
		//
		win.forms.Password2 = 	new Input({type:'password', maxLength: 15, value: win.user.User_ID == $U().User_ID ? '' : win.user.Password});
		//
		//Node
		//		
		var table = 			new TableData();
		var lastConnexion =		$MUI('jamais connecté');
		
		try{
		if(Object.isFunction(win.user.Last_Connexion.toString_)){
			lastConnexion = win.user.Last_Connexion.toString_('date', MUI.lang) +' '+$MUI('à') + ' ' + win.user.Last_Connexion.format('h:i');
		}
		}catch(er){}
		
		table.addHead($MUI('Identifiant')).addField(win.user.Login).addCel(' ').addRow();
		table.addHead($MUI('Mot de passe')).addField(win.forms.Password).addRow();
		
		table.addHead($MUI('Confirmer')).addField(win.forms.Password2).addRow();
		
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addCel(' ').addRow();
		table.addHead($MUI('Niveau du mot de passe')).addCel(passEval).addRow();
		table.addHead(' ', {style:'height:10px'}).addCel(' ').addCel(' ').addRow();
		
		table.addHead($MUI('Dernière connexion')).addField(lastConnexion).addCel(' ').addRow();
		
		if(win.user.User_ID == 0) {
			table.getRow(0).hide();
		}
		if(win.user.User_ID == $U().User_ID){
			table.addHead(' ', {style:'height:10px'}).addRow();
			table.addHead($MUI('Mes droits')).addField(win.user.getRole().getComents(), {style:'text-align:justify'});
		}
		
		//#pragma endregion Instance
		
		panel.appendChilds([splite, table]);
				
		win.forms.Password.observe('keyup', function(){
			passEval.eval(this.value);
		});
		
		table.getCel(4,1).observe('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('La jauge indique le niveau de sécurité de votre mot de passe') + '.</p> <p><i>' + $MUI('Plus la jauge sera rempli plus votre mot de passe sera sécurisé') + '.</i></p>').setStyle(FLAG.RIGHT); 
			win.Flag.color('grey');
			win.Flag.show(this, true);
		});		
		
		return panel;
	},
/*
 * System.User.submitSecurity(win) -> void
 **/	
	submitSecurity: function(win){
		if(win.forms.Password.value != win.forms.Password2.value){
			win.Flag.select();
			win.Flag.setText($MUI('Les mots de passe saisie ne correspondent pas')).setStyle(FLAG.RIGHT);
			win.Flag.show($U().forms.Password);
			return;
		}
		
		if(win.forms.Password.value.length < 7){
			win.Flag.select();
			win.Flag.setText($MUI('Le mot de passe doit faire 7 caratères de long')).setStyle(FLAG.RIGHT);
			win.Flag.show(win.forms.Password);
			return;
		}
		
		$U().Password =	win.forms.Password.value;
		
		win.AlertBox.wait();
		
		win.ActiveProgress();
		
		$U().commit(function(){
			win.AlertBox.hide();
			
			var splite = new SpliteIcon($MUI('Votre mot de passe a correctement été modifié'));
			splite.setIcon('valid-48');
			
			win.AlertBox.a(splite).ty('CLOSE').Timer(5).show();
			win.AlertBox.getBtnReset();
			
		}.bind(this));
	},
/** deprecated
 * System.User.createPanelAdvanced(win) -> Panel
 * - win (Window): Instance window.
 *
 * Cette méthode créée le panneau de gestion des paramètres avancés du compte utilisateur.
 **/
	createPanelAdvanced: function(win){
		//#pragma region Instance
		//
		//Panel
		//
		var Panel = 	new Node('div', {className:"panel panel-advanced", style:'width:500px;min-height:500px;'});
		//
		//Splite
		//
		var splite =	new SpliteIcon($MUI('Gestion des préférences avancées'),  $MUI('Changez la valeurs des champs du formulaire ci-contre (Toutes les modifications seront automatiquement enregistrées)') + ' :');
		splite.setIcon('system-account-advanced-48');
		//
		//
		//
		var submit = 	new SimpleButton({icon:'reload', text:$MUI('Redémarrer le logiciel')});
		
		submit.setStyle('margin-top:5px');
		
		//
		// forms
		//
		var forms =			win.forms;
		//
		// Gestion des langues
		//
		forms.LANG = new Select();
		forms.LANG.setData([ {value:'ENG', text:$MUI('Anglais')}, {value:'FR', text:$MUI('Français')}]);
		forms.LANG.setValue($U('LANG') || $S.Meta('LANG'));
		//
		//Table
		//		
		var table = 		new TableData();
		
		table.addHead($MUI('Langue par défaut'), {style:'width:150px',className:'icon-messenger system-icon-field'}).addField(forms.LANG).addRow();

		Panel.appendChilds([
			splite,
			table,
			submit
		]);
		
		new ButtonInteract(win, {
			manuelid:	5,
			incident:	'Formulaire mon compte - Préférences avancées',
			node:		Panel
		});
		
		forms.LANG.on('change', function(){
			$U('LANG', this.value);
		});
		
		forms.LANG.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une langue parmi celle proposé dans la liste') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		submit.on('click',function(){
			window.location.reload();
		});
		
		submit.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez sur ce bouton pour redémarrer le logiciel avec les nouveaux paramètres') + '.</p>').setType(FLAG.TOP).color('grey').show(this, true);
		});
		
		return Panel;
	},
/**
 * System.User.removes(win, list) -> void
 * - list (Array): Liste d'instance utilisateur.
 *
 * Cette méthode supprime une liste d'utilisateur de la base de données.
 **/
	removes: function(win, list){
				
		if(list.length == 0){
			win.Flag.setText($MUI('Veuillez cocher au moins un<br />utilisateur pour le supprimer !'));
			win.Flag.show(win.SimpleTable.getElementsByTagName('input')[1]);
			return;	
		}
		//
		// Splite
		//
		var splite = 	new SpliteIcon($MUI('Voulez-vous vraiment supprimer le ou les utilisateur(s) séléctionnés') + ' ?');
		splite.setIcon('edittrash-48');
		//
		// Box
		//	
		var box = win.AlertBox;
		
		var array = [];
		for(var i = 0; i < list.length; i+=1){
			array.push({User_ID:list[i].User_ID});	
		}
		
		box.setTheme('flat black liquid');
		box.appendChild(splite);
		
		$S.fire('user:remove.open', box);
		
		box.setType().show();
		
		box.submit({
			text:	$MUI('Supprimer les comptes'),
			click:	function(){

				box.setTheme();
				
				var evt = new StopEvent(box);
				$S.fire('user:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				box.wait();
				
				$S.exec('user.delete', {
					parameters: 'data=' + Object.EncodeJSON(array),
					onComplete:function(result){
	
						try{
							var obj = result.responseText.evalJSON();
						}catch(er){
							$S.trace(result.responseText);
							return;
						}
						
						$S.fire('user:remove.complete', evt);
						
						box.hide();
						
					}.bind(this)
					
					
				});	
				
				return true;
			}.bind(this)
		});
								
		box.reset(function(){
			box.setTheme();
		});
		
	},
/**
 * System.User.remove(user, box) -> void
 * - list (Array): Liste d'instance utilisateur.
 *
 * Cette méthode supprime une liste d'utilisateur de la base de données.
 **/
	remove: function(user, box){
		
		user = new System.User(user);	
		//
		// Splite
		//
		var splite = 	new SpliteIcon($MUI('Voulez-vous vraiment supprimer ce compte utilisateur') + ' ?', $MUI('Le compte de ') + ' "' + user.Name + ' ' + user.FirstName +'" ' + $MUI('sera définitivement supprimé !'));
		splite.setIcon('edittrash-48');
		//
		// Box
		//	
		var box = box || $S.AlertBox;
		
		box.setTheme('flat black liquid');
		box.appendChild(splite);
		
		$S.fire('user:remove.open', box);
		box.setType().show();
		
		box.submit({
			text:	$MUI('Supprimer le compte'),
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('user:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				box.setTheme();
				box.wait();
				
				user.remove(function(){
					
					box.hide();
					
					var splite = new SpliteIcon($MUI('Compte utilisateur correctement supprimé'), $MUI('Utilisateur') + ' : ' + user.Name + ' ' + user.FirstName );
					splite.setIcon('valid-48');
					
					box.a(splite).setTitle($MUI('Confirmation')).setType('CLOSE').Timer(5).show();
					
					$S.fire('user:remove.complete', evt);
					
				}.bind(this), function(response){
					
				});	
				
				return true;
					
			}.bind(this)
		
		});
		
		box.reset(function(){
			box.setTheme();
		});
		
		
	},
	/**
	 * Retourne les informations complète de l'utilisateur connecté.
	 * @type User
	 */
	getConnectingUser: function(){
		return this.user;
	},
	/**
	 * Ajoute les informations de l'utilisateur connecté.
	 * @param {Object} obj Objet d'information utilisateur.
	 * @type Void
	 */
	setConnectingUser: function(obj){
		this.user = new User(obj);
	}
});

UsersManager.prototype = System.User;
/*
 * $UM() -> Users
 * Retourne l'instance courante du gestionnaire des utilisateurs
 **/
function $UM(){
	return $S.users;	
}
/** section: Core
 * $U([key [, value]]) -> Mixed
 * - key (String): Clef à récupérer
 * - value (Mixed): Valeur à affecter à la clef.
 * 
 * Cette fonction retourne une valeur de l'instance utilisateur en fonction du paramètre `key`. 
 * Elle permet aussi d'assigner une valeur à l'instance utilisateur en mentionnant un second paramètre `value`.
 * Enfin si aucun paramètre n'est passé, l'objet compte utilisateur connecté au logiciel sera retourné.
 *
 **/
function $U(key, value, bool){
	
	if(Object.isUndefined(key)){
		return $UM().user; 
	}
	if(Object.isUndefined(value)){
		return $UM().user.getMeta(key);
	}
	
	if(Object.isFunction($UM().user[key])) return $UM().user.getMeta(key);
	
	return $UM().user.setMeta(key, value, bool);
};
/** section: Core
 * class UserButton
 * 
 * Cette classe permet de créer un bouton avec les informations de l'utilisateur.
 *
 * #### Informations
 *
 * * Fichier : user.js
 * * Classe parente : AppButton
 *
 **/
var UserButton = Class.from(AppButton);

UserButton.prototype = {
	className: 'wobject user-button',
/**
 * new UserButton()
 *
 * Cette méthode créée une nouvelle instance [[UserButton]].
 **/
 	initialize:function(){
		var deficon = 	$U().Avatar48 == "" ? (($U().Civility == 'Mme.' || $U().Civility == 'Mlle.') ? 'woman-48' : 'men-48') : $U().Avatar48.replace('127.0.0.1', window.location.host);
		this.setIcon(deficon);
		this.setText($U().Login);
		//
		// Body
		//
		this.body = new Node('div', {className:'wrap-body'});
		this.appendChild(this.body);
		
		this.appendChild = function(e){
			this.body.appendChild(e);
			return this;
		};
		
		this.removeChild = function(e){
			this.body.removeChild(e);
			return this;
		};
		
		if(!document.navigator.mobile){
			this.on('mouseover', function(){
				this.addClassName('show');
			}.bind(this));
			
			this.on('mouseout', function(){
				this.removeClassName('show');
			}.bind(this));
		}else{
			
			this.on('click', function(event){
				event.stop();
				this.addClassName('show');
			}.bind(this));
			
			this.on('touchend', function(event){
				event.stop();
				this.addClassName('show');
			}.bind(this));
			
			document.observe('touchend', function(){
				this.removeClassName('show');
			}.bind(this));
			
			document.observe('click', function(){
				this.removeClassName('show');
			}.bind(this));
		}
	},
	
	hide:function(){
		this.removeClassName('show');
	}
};

System.User.initialize();