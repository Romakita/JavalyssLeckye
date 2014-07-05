/**
 * == MinCore ==
 * Cette section traite uniquement du noyau minimal du logiciel. Ce noyau est optimisé pour la gestion de connexion au logiciel
 * et de son installation. Ce noyau intègre donc les méthodes de base afin de gérer toutes ses transactions.
 **/

/** section: MinCore
 * Install
 * Cette classe singleton est le gestionnaire d'installation et de connexion au logiciel.
 **/
var Install = {
/**
 * Install.JAVALYSS -> String
 * Lien du serveur de script.
 **/
	JAVALYSS:			'',
/**
 * Install.body -> Element
 * Instance de l'élément pour l'écriture de formulaire.
 **/
	body:				null,
/**
 * Install.VERSION -> String
 * Version de l'installateur Javalyss Install.
 **/
	VERSION:			0.1,
/**
 * Install.NAME_VERSION -> String
 **/	
	NAME_VERSION:		'Javalyss Leckye',
/**
 * Install.LOCAL -> Boolean
 **/
 	LOCAL:				false,
/**
 * Install.ListVersion -> String
 **/
	ListVersion:		[
		{app:'Javalyss Leckye', cgu:'http://javalyss.fr/cgu/javalyss.html'}
	],
/**
 * Install.link -> String
 * Lien de la passerelle pour la connexion au logiciel.
 **/
	link:				'install.php',
/**
 * Install.AlertBox -> AlertBox
 * 
 **/
	Alert:				null,
/**
 * Install.Flag -> Flag
 * 
 **/
	Flag:				null,
/**
 * Install.initialize()
 *
 * Initialise le gestionnaire d'installation Install
 **/
	initialize: function(mybody){
			
		try{
			Extends.ready(this.startInterface.bind(this));
		}catch(er){}
	},
/**
 * Install.open() -> void
 *
 * Ouvre le formulaire de connexion au logiciel.
 **/
 	open: function(win){
		
		//
		// Window
		//
		if(Object.isUndefined(win)){
			var win = new Window();
			win.addClassName('carbon-window');
			$Body.appendChild(win);
			
			win.NoChrome(true);
			win.Closable(false);
			win.Resizable(false);
			win.Cacheable(false);
			win.createBox();
			win.createFlag().setType(FLAG.RIGHT);
			
			win.forms = {};
			//
			// Table
			//
			win.forms.submit = new SimpleButton({text:$MUI('Suivant'), icon:'next'});
			//
			// Table
			//
			win.forms.reset = new SimpleButton({text:$MUI('Précèdent'), icon:'prev'});
			win.forms.reset.hide();
			
			win.footer.appendChild(win.forms.reset);
			win.footer.appendChild(win.forms.submit);
			
			win.ProgressBar = new ProgressBar();
			win.ProgressBar.hide();
			
		}else{
			win.body.removeChilds();
			win.forms.submit.stopObserving('click');
			win.forms.reset.stopObserving('click');	
			win.forms.reset.hide();
			win.forms.submit.show();
		}
		
		win.setTitle($MUI('Assistant d\'installation')).setIcon('device-harddrive');
		win.resizeTo(610, 'auto');
		//
		//Logo
		//
		var Logo = new Picture();
		Logo.src = this.URI + 'themes/system/images/software-logo.png';
		//
		// Header
		//
		var Header = new Node('div', {className:'carbon-logo'}, [
			Logo, 
			new Node('div', [
				new Node('b', this.NAME_VERSION.split(' ')[1]), ' version ' + this.VERSION
			])
		]);		
		win.a(Header);
		win.forms.Logo = Header;
		//
		// Input
		//
		win.forms.Password = new Node('input', {type:'text', style:'width:55px; font-size:16px; font-family:WTF;height:25px;color:#333;', maxLength:5});
		win.forms.PassKey = new Node('input', {type:'text', style:'width:105px; font-size:16px; font-family:WTF;height:25px;color:#333;', maxLength:10});
		//
		//
		//
		var tablePass = new TableData();
		tablePass.addHead(new Node('p', $MUI('Entrez la clef'))).addField(win.forms.Password).addField(win.forms.PassKey);
		tablePass.setStyle('margin:auto;margin-top:10px');
		//
		// Table
		// 
		var table = new TableData();
		
		table.setStyle('margin:auto;');
		//table.addClassName('system-form');
		
		for(var i = 0; i < this.ListVersion.length; i++){
			
			if(!Object.isElement(this.ListVersion[i])){
				var node = new Node('input', {type:'radio', name: 'install-rad', id:"rad"+i, value:i});
				Object.extend(node, this.ListVersion[i]);
				
				this.ListVersion[i] = node;					
			}
			
			this.ListVersion[i].on('click', function(){
				if(!this.password){
					tablePass.hide();
				}else{
					tablePass.show();
					win.forms.Password.select();
				}
			});
			
			table.addCel(this.ListVersion[i], {style:'text-align:center; width:50px'}).addCel(new Node('label', {htmlFor:"rad"+i}, this.ListVersion[i].app));
						
			if(i % 2 == 0 && i != 0) table.addRow();
			
			if(i == 0) {
				this.ListVersion[i].checked = true;
				if(Object.isUndefined(this.ListVersion[i].password)){
					tablePass.hide();
				}
			}
					
		}
		//
		// info
		//
		var info = new SimpleButton({icon:'documentinfo'});
		//
		// div
		//
		var div = new Node('div', {style:'width:590px', className:'html-node'});
		div.innerHTML =  '<h1>Bienvenue dans ' + this.NAME_VERSION +'</h1>';
		
		if(this.LOCAL){
			div.innerHTML += '<p>Cette utilitaire va vous permettre d\'installer le logiciel sur votre serveur. '+
			'Au cours de l\'installation il vous sera demandé certaines informations sur votre base de données.</p>';
		}else{
			div.innerHTML +=
			'<p>Cette utilitaire va vous permettre d\'installer l\'un des logiciels proposés plus bas sur votre serveur. '+
			'Au cours de l\'installation il vous sera demandé certaines informations sur votre base de données.</p>'+
			'<p>Pour commencer, veuillez selectionner une version à installer :</p>';
		}
		
		win.a(div);		
		
		if(!this.LOCAL){
			win.a(table);
			win.a(tablePass);
		}
		
		//
		// div
		//
		div = new Node('div', {style:'margin-bottom:10px; width:590px', className:'html-node'});
		div.innerHTML =  '<p>Ci-contre la liste des conditions requises pour pouvoir installer le logiciel sur votre serveur : </p>' +
			'<ul class="checklist" style="margin-bottom:0px">' + 
			'<li class="icon-' + ($S.Php >= '5.0.0' ? 'valid' : 'cancel')  +'">Version PHP 5 (version : ' + $S.Php + ')</li>' + 
			'<li class="icon-' + ($S.Writable ? 'valid' : 'cancel')  +'">Dossier racine accessible en écriture</li>'+
			'<li class="icon-' + ($S.Curl ? 'valid' : 'cancel')  +'">Extension Curl</li>' +
			'<li class="icon-' + ($S.MySQL ? 'valid' : 'cancel')  +'">Extension MySQL</li>' +
			//'<li class="icon-' + ($S.MsSQL ? 'valid' : 'cancel')  +'">Extension SQL Server</li>' +
			'<li class="icon-' + ($S.Zip ? 'valid' : 'cancel')  +'">Extension ZIP</li>' + 
			'</ul>';
			
		win.a(div);	
				
		win.centralize();
				
		win.forms.Password.on('keyup', function(evt){
			if(this.value.length == 5) win.forms.PassKey.select();
		});
		
		win.forms.PassKey.keyupcode(8, function(evt){
			if(this.value.length == 0) win.forms.Password.focus();
		});
		
		win.forms.submit.on('click', function(){
			
			var splite = new SpliteWait($MUI('Le logiciel ne peut être installé sur votre serveur'));
			
						
			if($S.Php < '5.0.0'){
				splite.appendChild(new Node('p', {style:'width:300px'}, $MUI('La version de PHP est insufissante. Il vous faut au minimum PHP 5 pour installer le logiciel.')));
				
				win.AlertBox.setTitle($MUI('Impossible de lancer l\'installation')).a(splite).setType('CLOSE').show();
				win.AlertBox.getBtnReset().setText($MUI('Fermer'));
				return;	
			}
			
			if(!$S.Writable) {
							
				splite.appendChild(new Node('p', {style:'width:300px'}, $MUI('Le dossier racine n\'a pas les droits en écriture. Veuillez remedier à ce problème avant de procéder à l\'installation du logiciel.')));
				
				win.AlertBox.setTitle($MUI('Impossible de lancer l\'installation')).a(splite).setType('CLOSE').show();
				win.AlertBox.getBtnReset().setText($MUI('Fermer'));
				return;	
			}
			
			if(!$S.Curl) {
								
				splite.appendChild(new Node('p', {style:'width:300px'}, $MUI('Votre serveur ne possède pas l\'extension Curl. Cette dernière est necéssaire pour récupérer le logiciel depuis le serveur distant.')));
				
				win.AlertBox.setTitle($MUI('Impossible de lancer l\'installation')).a(splite).setType('CLOSE').show();
				win.AlertBox.getBtnReset().setText($MUI('Fermer'));
				return;	
			}
			
			if(!$S.Zip) {
								
				splite.appendChild(new Node('p', {style:'width:300px'}, $MUI('Votre serveur ne possède pas l\'extension Zip. Cette dernière est necéssaire pour décompresser le logiciel sur votre serveur.')));
				
				win.AlertBox.setTitle($MUI('Impossible de lancer l\'installation')).a(splite).setType('CLOSE').show();
				win.AlertBox.getBtnReset().setText($MUI('Fermer'));
				return;	
			}
			
			//
			// Current
			//
			var current = false;
			
			if(this.LOCAL){
				for(var i = 0; i < this.ListVersion.length && this.ListVersion[i].app != this.NAME_VERSION; i++) continue;
			}else{
				for(var i = 0; i < this.ListVersion.length && !this.ListVersion[i].checked; i++) continue;
			}
			
			current =  this.ListVersion[i];
			
			if(current.password){
				//alert('9e0ac');
				if(current.password != win.forms.Password.value.md5(current.password.length) || win.forms.PassKey.length < 10){
					splite.addClassName('icon-lock');
					splite.appendChild(new Node('p', {style:'width:300px'}, $MUI('La clef d\'authenfication est incorrect !')));
					
					win.AlertBox.setTitle($MUI('Impossible de lancer l\'installation')).a(splite).setType('CLOSE').Timer(10).show();
					win.AlertBox.getBtnReset().setText($MUI('Fermer'));
					return;
				}
			}
			win.Application = current;
			
			this.openCGU(win);
			
		}.bind(this));
	},
/**
 * Install.openCGU(win) -> void
 **/	
	openCGU: function(win){
		
		win.body.removeChilds();
		win.forms.reset.show();
		win.forms.submit.show();
		win.forms.reset.stopObserving("click");
		win.forms.submit.stopObserving("click");
		
		//
		// div
		//
		var div = new Node('div', {style:'width:590px', className:'html-node'});
		div.innerHTML =  '<h1>Conditions générales d\'utilisation</h1>';
		
		win.a(div);
		//
		// Widget
		//
		var widget = new Widget();
		widget.setStyle('width:auto; display:block; margin:5px;');
		widget.setStyle('height:305px; overflow:hidden');
		win.a(widget);
		//
		//
		//
		var iframe = new Node('iframe', {src:win.Application.cgu, style:'width:100%;height:305px'});
		widget.appendChild(iframe);
		//
		//
		//
		win.forms.Accept = new Checkbox();
		win.forms.Accept.Checked(false);
		win.forms.Accept.css('display', 'block');
		win.forms.Accept.css('margin-right', '5px');
		
		var lbl = new Node('label', $MUI('J\'accepte les conditions générales d\'utilisation.'));
		lbl.on('click', function(){
			win.forms.Accept.Checked(!win.forms.Accept.Checked());
		});
		//
		//
		//
		var table2 = 		new TableData();
		table2.setStyle('margin-left:15px');
		table2.addCel(win.forms.Accept);
		table2.addCel(new Node('p', lbl));
		
		win.a(table2);
						
		win.forms.reset.on('click', function(){
			this.open(win);
		}.bind(this));
		
		win.forms.submit.on('click', function(){
			win.AlertBox.hide();
			
			if(!win.forms.Accept.Checked()){
				var splite = new SpliteWait($MUI('Vous devez accepter les conditions générales d\'utilisation avant d\'installer le logiciel ' + win.Application.app));
				win.AlertBox.setTitle($MUI('Validation requise')).a(splite).setType('CLOSE').Timer(10).show();
				win.AlertBox.getBtnReset().setText($MUI('Fermer'));
				return;	 	
			}
			
			if(this.LOCAL){
				this.openConfigDB(win);
			}else{
				this.openDownload(win);
			}
		}.bind(this))
	},
/**
 * Install.openDownload() -> void
 **/
	openDownload: function(win){
		
		win.body.removeChilds();
		win.forms.reset.hide();
		win.forms.submit.hide();
		win.forms.reset.stopObserving("click");
		win.forms.submit.stopObserving("click");
		
		//
		// div
		//
		var div = new Node('div', {style:'width:590px', className:'html-node'});
		div.innerHTML =  '<h1>' + $MUI('Téléchargement du logiciel') + '</h1>';
		
		win.appendChild(div);
		//
		// ProgressBar
		//
		var progressBar = new ProgressBar();
		progressBar.setStyle('margin:20px');
		
		
		win.appendChild(progressBar);
				
		progressBar.setProgress(1, 5, $MUI('Récupération des préférences'));
		win.setIcon('loading-gif');
		
		$S.exec('install.application.get', {
			
			parameters: 'Application=' + win.Application.app,
			onComplete:function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					var splite = new SpliteWait($MUI('Une erreur de connexion est survenue et/ou que le serveur soit injoignable'));
				
					win.AlertBox.setTitle($MUI('Erreur de connexion')).a(splite).a(new Node('div', result.responseText));
					win.AlertBox.setType('CLOSE').Timer(10).show();
					win.AlertBox.getBtnReset().setText($MUI('Fermer'));
					
					win.setIcon('device-harddrive');
					this.openCGU(win);
					return;
				}
				
				progressBar.setProgress(2, 5, $MUI('Téléchargement des archives'));
				
				$S.exec('install.application.download', {
					onComplete: function(result){
						//alert(result.responseText);
						progressBar.setProgress(3, 5, $MUI('Décompression de l\'application'));
						
						$S.exec('install.application.depackage', {
							onComplete: function(result){
								//alert(result.responseText);
								
								progressBar.setProgress(4, 5, $MUI('Décompression des icônes'));
								
								$S.exec('install.icons.depackage', {
									onComplete: function(result){
										//alert(result.responseText);
										
										this.openConfigDB(win);
									}.bind(this)
								});
							}.bind(this)
						});
							
					}.bind(this)
				});
				
			}.bind(this)
		});
	},
/**
 * Install.openConfigDB() -> void
 **/
	openConfigDB: function(win, obj){
		
		win.body.removeChilds();
		win.forms.reset.show();
		win.forms.submit.show();
		win.forms.reset.stopObserving("click");
		win.forms.submit.stopObserving("click");
		win.setIcon('device-harddrive');
		win.ProgressBar.hide();
		
		var options = {
			DB_TYPE: 	$S.MySQL ? 'MySQL' : 'MsSQL',
			DB_NAME: 	this.NAME_VERSION.toLowerCase().replace(' ', '_'),
			DB_LOGIN: 	'root',
			DB_PASS:	'',
			DB_HOST:	'localhost',
			PRE_TABLE:	''
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		//#pragma region Instance
		
		//
		// div
		//
		var div = new Node('div', {style:'width:590px', className:'html-node'});
		div.innerHTML =  '<h1>' + $MUI('Configuration de la base de données') 
		+ '</h1><p>Entrez ci-dessous les détails de connexion à votre base de données. '
		+ 'Si vous ne les connaissez pas avec certitude, contactez votre hébergeur.</p>';
		
		var forms = win.forms;
		//
		// DB
		//
		forms.DB_TYPE = 	new Select();
		forms.DB_TYPE.setData([
			{value:'MySQL', text:'MySQL'},
			{value:'MySQLi', text:'MySQLi'},
			{value:'MsSQL', text:'SQL Server (beta)'}
		]);
		
		forms.DB_TYPE.Value(options.DB_TYPE);
		
		forms.DB_NAME = 	new Node('input', {type:'text', value:options.DB_NAME});
		forms.DB_LOGIN = 	new Node('input', {type:'text', value:options.DB_LOGIN});
		forms.DB_PASS = 	new Node('input', {type:'text', value:options.DB_PASS});
		forms.DB_HOST = 	new Node('input', {type:'text', value:options.DB_HOST});
		forms.PRE_TABLE = 	new Node('input', {type:'text', value:options.PRE_TABLE});
		//
		// Table
		//
		var table = new TableData();
		table.setStyle('margin:auto; margin-bottom:15px;');
		table.addHead($MUI('Type de la base de données')).addField(forms.DB_TYPE).addRow();
		table.addHead($MUI('Nom de la base de données')).addField(forms.DB_NAME).addRow();
		table.addHead($MUI('Identifiant')).addField(forms.DB_LOGIN).addRow();
		table.addHead($MUI('Mot de passe')).addField(forms.DB_PASS).addRow();
		table.addHead($MUI('Hôte de la base de données')).addField(forms.DB_HOST).addRow();
		table.addHead($MUI('Préfixe')).addField(forms.PRE_TABLE);
		
		//#pragma endregion Instance
		win.appendChild(div);
		win.appendChild(table);
		
		
	
		//#pragma region Event
		forms.DB_TYPE.on('focus', function(){
			win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Choisissez le type de la base à utiliser') + '.</p>'));
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);	
		});
		
		forms.DB_NAME.on('focus', function(){
			win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Saisissez ici le nom de la base dans laquelle vous voulez installer Javalyss') + '.</p>'));
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);	
		});
		
		forms.DB_LOGIN.on('focus', function(){
			win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Saisissez ici votre identifiant MySQL') + '.</p>'));
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);	
		});
		
		forms.DB_PASS.on('focus', function(){
			win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Saisissez ici votre mot de passe MySQL') + '.</p>'));
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);	
		});
		
		forms.DB_HOST.on('focus', function(){
			win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Saisissez ici le nom d\'hôte du serveur MySQL') + '.</p>'));
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);	
		});
		
		forms.PRE_TABLE.on('focus', function(){
			win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Saisissez ici un préfixe (optionnel) pour installer plusieurs logiciel Javalyss sur une même base de données') + '.</p>'));
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);	
		});
		
		forms.DB_NAME.on('blur', function(){win.Flag.hide()});
		forms.DB_LOGIN.on('blur', function(){win.Flag.hide()});
		forms.DB_PASS.on('blur', function(){win.Flag.hide()});
		forms.DB_HOST.on('blur', function(){win.Flag.hide()});
		forms.PRE_TABLE.on('blur', function(){win.Flag.hide()});
		
		win.forms.reset.on('click', function(){
			if(this.LOCAL) this.openCGU(win);
			else{
				this.openDownload(win);
			}
		}.bind(this));
		
		win.forms.submit.on('click', function(){
			
			if(forms.DB_NAME.value == ''){
				win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Veuillez le nom de la base dans laquelle vous voulez installer Javalyss') + '.</p>'));
				win.Flag.setType(FLAG.RIGHT).color('grey').show(forms.DB_NAME);
				return;	
			}
			
			if(forms.DB_LOGIN.value == '' && forms.DB_TYPE.Value().match(/mysql/i)){
				win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Veuillez saisir votre identifiant MySQL') + '.</p>'));
				win.Flag.setType(FLAG.RIGHT).color('grey').show(forms.DB_LOGIN);	
				return;	
			}
			
			if(forms.DB_HOST.value == ''){
				win.Flag.setText($MUI('<p class="icon-documentinfo">' +  $MUI('Veuillez saisir le nom d\'hôte du serveur MySQL') + '.</p>'));
				win.Flag.setType(FLAG.RIGHT).color('grey').show(forms.DB_HOST);	
				return;	
			}
			
			win.forms.DB = {
				DB_TYPE: 	win.forms.DB_TYPE.Value(),
				DB_NAME: 	win.forms.DB_NAME.value,
				DB_LOGIN: 	win.forms.DB_LOGIN.value,
				DB_PASS:	win.forms.DB_PASS.value,
				DB_HOST:	win.forms.DB_HOST.value,
				PRE_TABLE:	win.forms.PRE_TABLE.value
			};
			
			this.startConnection(win);
		}.bind(this));
		
	
		forms.DB_NAME.select();
		forms.DB_NAME.fire('focus');
	},
/**
 * Install.openUser(win) -> void
 **/	
	openUser:function(win){
		
		win.body.removeChilds();
		
		win.forms.reset.hide();
		win.forms.submit.show();
		win.forms.reset.stopObserving("click");
		win.forms.submit.stopObserving("click");
		win.setIcon('device-harddrive');
		
		win.forms.submit.setText($MUI('Commencer à utiliser Javalyss Leckye !'));
		win.forms.submit.setIcon('');
		win.forms.submit.Submit();
		
		win.ProgressBar.hide();
		
		var options = {
			Civility:	'M.',
			Name:		'Administrateur',
			FirstName:	'Super',
			Login:		'sadmin',
			Password:	'',
			EMail:		'',
			Role_ID:	1,
			Is_Active:	2,
			User_Meta:	'{}'
		};
		
		//#pragma region Instance
		var forms = win.forms;
		//
		// div
		//
		var div = new Node('div', {style:'width:590px', className:'html-node'});
		div.innerHTML =  '<h1>' + $MUI('Création du compte utilisateur')
		+ '</h1><p>' + $MUI('Veuillez remplir le formulaire suivant afin de créer votre compte d\'administration') +' :</p>';
		
		//
		// Password
		//
		forms.Login = 		new Node('input', {type:'text', value:options.Login, maxLength: 50});
		//
		// Password
		//
		forms.Name = 		new Node('input', {type:'text', value:options.Name, maxLength: 100});
		//
		// Password
		//
		forms.FirstName = 	new Node('input', {type:'text', value:options.FirstName, maxLength: 100});
		//
		// Password
		//
		forms.Password = 	new Node('input', {type:'password', value:options.Password, maxLength: 30});
		forms.Password2 = 	new Node('input', {type:'password', value:options.Password, maxLength: 30});
		//
		// Email
		//
		forms.Email = 		new Node('input', {type:'text', value:options.EMail});
		//
		// PasswordEval
		//
		forms.passEval =	new PasswordEval();
		//
		//
		//
		var table = new TableData();
		table.setStyle('margin:auto; margin-bottom:15px;');
		table.addHead($MUI('Identifiant')).addField(forms.Login).addRow();
		table.addHead($MUI('Nom')).addField(forms.Name).addRow();
		table.addHead($MUI('Prénom')).addField(forms.FirstName).addRow();
		table.addHead($MUI('Mot de passe')).addField(forms.Password).addRow();
		table.addHead($MUI('Confirmation')).addField(forms.Password2).addRow();
		table.addHead('', {}).addField(forms.passEval).addRow();
		table.addHead($MUI('E-mail')).addField(forms.Email);

		//#pragma endregion Instance
		
		win.appendChild(div);
		win.appendChild(table);
				
		//#pragma region Event
		
		forms.Password.on('keyup', function(){
			forms.passEval.eval(this.value);
		});
		
		forms.Login.on('focus', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici un identifiant pour votre compte. Votre identifiant doit faire au moins 6 caractères de long') +'.</p><p>' + $MUI('L\'identifiant vous permettra de vous connecter au logiciel par la suite') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);
		});
		
		forms.Login.on('blur', function(){win.Flag.hide()});
		
		forms.Name.on('focus', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre nom') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);
		});
		
		forms.Name.on('blur', function(){win.Flag.hide()});
		
		forms.FirstName.on('focus', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici votre prénom') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);
		});
		
		forms.FirstName.on('blur', function(){win.Flag.hide()});
		
		forms.Password.on('focus', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Conseil : votre mot de passe doit faire au moins 7 caractères de long. Pour le rendre plus sûr, utilisez un mélange de majuscule, de minuscules, de chiffres et de symboles comme ! " ? $ % ^ & )') +'.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);
		});
		
		forms.Password.on('blur', function(){win.Flag.hide()});
		
		forms.Email.on('focus', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Indiquez une adresse e-mail afin que le logiciel puisse vous envoyez des notifications') +'.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this);
		});
		
		forms.Email.on('blur', function(){win.Flag.hide()});
		
		win.forms.submit.on('click', function(){
			try{
			
			if(forms.Login.value == '' || forms.Login.value.length < 3){
				win.Flag.setText($MUI('Veuillez saisir un identifiant d\'au moins 3 caractères'));
				win.Flag.setType(FLAG.RIGHT).show(forms.Password);
				return true;
			}
						
			if(forms.Password.value != forms.Password2.value){
				win.Flag.setText($MUI('Les mots de passe saisies ne correspondent pas'));
				win.Flag.setType(FLAG.RIGHT).show(forms.Password);
				return true;
			}
			
			if(forms.Password.value.length < 7){
				win.Flag.setText($MUI('Veuillez saisir un mot de passe d\'au moins 7 caractères de long'));
				win.Flag.setType(FLAG.RIGHT).show(forms.Password);
				return true;
			}
			
			if(!forms.Email.value.isMail()){
				win.Flag.setText($MUI('Veuillez saisir un l\'e-mail correct'));
				win.Flag.setType(FLAG.RIGHT).show(forms.Email);
				return true;	
			}
			
			options.Password = 	forms.Password.value;
			options.EMail = 	forms.Email.value;
			options.Login = 	forms.Login.value;
			options.Name = 		forms.Name.value;
			options.FirstName = forms.FirstName.value;
			
			win.AlertBox.wait();
			
			$S.exec('install.user.commit', {
				parameters: 'User=' + Object.EncodeJSON(options),
				onComplete: function(result){
                    alert(result.responseText);
					win.AlertBox.hide();
					
					if(result.responseText.match(/install\.user\.commit\.err/)){
						this.openUser(win);
						return;	
					}
					
					window.location = "index.php";
					
				}.bind(this)
			});
						
			}catch(er){if(window['console']){console.log(er)}}
			
			return true;
		}.bind(this));
		
		forms.Password.select();
	},
/**
 * Install.writeDB() -> void
 **/
	startConnection: function(win){
		
		win.body.removeChilds();
		win.forms.reset.hide();
		win.forms.submit.hide();
		win.forms.reset.stopObserving("click");
		win.forms.submit.stopObserving("click");
		win.addClassName('progress');
		//
		// div
		//
		var div = new Node('div', {style:'width:590px', className:'html-node'});
		div.innerHTML =  '<h1>' + $MUI('Installation du logiciel') + '</h1>' +
		'<p>Merci de patientez pendant l\'installation du logiciel sur votre serveur.</p>';
		
		win.appendChild(div);		
		//
		// ProgressBar
		//
		
		win.Footer().appendChild(win.ProgressBar);
		win.ProgressBar.show();
		var progressBar = win.ProgressBar;
		//
		// 
		//
		var htmlNode = 	new HtmlNode();
		
		var ul = 		new Node('ul', {className:'checklist'});
		
		htmlNode.appendChild(ul);
		
		win.forms.List = 		[
			$MUI('Tentative de connexion'),
			$MUI('Création du fichier de conguration'),
			$MUI('Création de la base de données'),
			$MUI('Création du compte administrateur')
		];
		
		for(var i = 0; i < win.forms.List.length; i++){
			win.forms.List[i] = new Node('li', win.forms.List[i]);
			ul.appendChild(win.forms.List[i]);
		}
			
		win.appendChild(htmlNode);	
		$S.AlertBox.setTitle($MUI('Mise à jours'));
		
		
		win.setIcon('loading-gif');
		
		progressBar.setProgress(1, 4, $MUI('Installation en cours'));
		win.forms.List[0].addClassName('icon-1right');
		
		new Timer(function(){
		$S.exec('install.connection', {
			parameters: 'DB=' + escape(Object.toJSON(win.forms.DB)),
			onComplete:function(result){
				
				switch(result.responseText.split(' ')[0]){
					case 'sql.connect.err': //Le nom de la base de données fournit est éronnée
						 
						progressBar.setProgress(0, 4, $MUI('Erreur lors de la tentative de connexion. Patientez svp') + '...');
						win.forms.List[0].className = 'icon-cancel';
						
						new Timer(function(){
							win.removeClassName('progress');
							this.openConfigDB(win, win.forms.DB);
							
							win.Flag.setText('<p class="icon-documentinfo">' 
							+ $MUI('Le nom de la base de données est incorrect') + '.</p><p>' + $MUI('La connexion à l\'hôte c\'est correctement déroulé mais le nom de la base de données est sans doute éronnée') + '.</p>');
							
							win.Flag.setType(FLAG.RIGHT).color('grey').show(win.forms.DB_NAME);
						
						}.bind(this), 5, 1).start();
						
						break;

					case "install.connection.ok":
						progressBar.setProgress(2, 4, '');
						win.forms.List[0].className = 'icon-valid';
						win.forms.List[1].className = 'icon-1right';
							
						new Timer(function(){
							this.writeConfig(win);
						}.bind(this), 1, 1).start();
						
						break;
					default:
						console.log(result.responseText);

                        progressBar.setProgress(0, 4, $MUI('Une erreur inconnue est survenue. Patientez svp') + '...');
                        win.forms.List[0].className = 'icon-cancel';

                        new Timer(function(){
                            win.removeClassName('progress');
                            this.openConfigDB(win, win.forms.DB);

                            win.Flag.setText('<p class="icon-documentinfo">'
                                + $MUI('Veuillez contacter le support Javalyss pour plus d\'information sur le problème rencontré') + '.</p>');

                            win.Flag.setType(FLAG.RIGHT).color('grey').show(win.forms.DB_NAME);

                        }.bind(this), 5, 1).start();
				}
			}.bind(this)
		});
		}.bind(this), 1, 1).start();
	},
/**
 * Install.writeConfig() -> void
 **/	
	writeConfig: function(win){
		$S.exec('install.write.config', {
			parameters: 'DB=' + escape(Object.toJSON(win.forms.DB)),
			onComplete:function(result){
				try{
				switch(result.responseText){
					case "install.write.config.ok":
						win.ProgressBar.setProgress(3, 4, '');
						win.forms.List[1].className = 'icon-valid';
						win.forms.List[2].className = 'icon-1right';
							
						new Timer(function(){
							this.writeDB(win);
						}.bind(this), 1, 1).start();
						
						break;
					case "install.method.notfound":
					case "install.class.notfound":
						
						win.ProgressBar.setProgress(0, 4, $MUI('Certains fichier sont manquants. Récupération des paquets. Patientez svp') + '...');
						win.forms.List[1].className = 'icon-cancel';
						
						new Timer(function(){//téléchargement des paquets manquants
							
													
						}.bind(this), 5, 1).start();
						
						break;
					case "install.folder.unwritable":
						win.ProgressBar.setProgress(0, 4, $MUI('Permission refusée lors de la tentative d\'écriture du fichier de configuration') + '.');
						win.forms.List[1].className = 'icon-cancel';
						
						new Timer(function(){
							win.removeClassName('progress');
							this.openConfigDB(win, win.forms.DB);
													
						}.bind(this), 5, 1).start();
						break;
					default:
						this.openConfigDB(win, win.forms.DB);
						break;
				}
				}catch(er){if(window['console']){console.log(er)}}
			}.bind(this)
		});
	},
/**
 * Install.writeDB() -> void
 **/	
	writeDB: function(win){
		$S.exec('install.write.db', {
			parameters: 'DB=' + escape(Object.toJSON(win.forms.DB)),
			onComplete:function(result){
				
				switch(result.responseText){
					case 'install.install.db.ok':
						win.ProgressBar.setProgress(4, 4, '');
						win.forms.List[2].className = 'icon-valid';
						win.forms.List[3].className = 'icon-1right';
							
						new Timer(function(){
							win.removeClassName('progress');
							this.openUser(win);
						}.bind(this), 1, 1).start();
						
						break;
					default:
						win.ProgressBar.setProgress(0, 4, $MUI('La création de la base de données a échoué') + '. (code: ' + result.responseText + ')');
						win.forms.List[2].className = 'icon-cancel';
						
						/*new Timer(function(){
							win.removeClassName('progress');
							this.openConfigDB(win, win.forms.DB);		
						}.bind(this), 5, 1).start();*/
				}
				
			}.bind(this)
		});
	},
/**
 * Install.exec(cmd , obj) -> void
 * - cmd (String): Nom de la commande.
 * - obj (Object): Soit il s'agit d'une fonction qui sera appellé après traitement de la commande
 * par le serveur. Soit Object tel que {parameters => String, onComplete => Function}.
 *
 * Envoi une commande vers la passerelle PHP. Cette dernière analysera, traitera la commande et renvoiera un résultat.
 **/
	exec: function(cmd, obj){
		
		if(Object.isUndefined(cmd)) throw('Error System::exec : arg[0] is undefined');
		
		if(Object.isUndefined(obj)){
			obj = {
				parameters: ''
			};
		}
		
		if(Object.isFunction(obj)){
			var callback = obj;
			
			obj = {
				parameters: '',
				onComplete:function(result){

					try{
						var str = result.responseText.evalJSON();
					}catch(er){}

					callback.call(this, result);
	
				}.bind(this)
			};
		}else{
			if(Object.isFunction(obj.onComplete)){
				var callback = obj.onComplete;
				
				obj.onComplete = function(result){
					
					try{
						var str = result.responseText.evalJSON();
					}catch(er){}
					
					callback.call(this, result);
				}.bind(this);
			}else{
				obj.onComplete = function(result){
					
					try{
						var str = result.responseText.evalJSON();
					}catch(er){}

				}.bind(this);
			}
		}
		
		obj.method = 		'post';
		
		obj.parameters += 	obj.parameters !='' ? '&cmd=' + cmd : 'cmd=' + cmd;
						
		try{	
			new Ajax.Request(this.link, obj);
		}catch(er){}

	},
/**
 * Install.startInterface() -> void
 *
 * Cette méthode initialise l'interface minimal.
 **/
	startInterface:function(){
		try{
			//
			// AlertBox
			//
			this.AlertBox = this.Alert = new AlertBox();
			//
			// Flag
			//
			this.Flag = 		new Flag(Flag.RIGHT);
					
			//$WR.createTaskBar(this.NAME_MENU + 'Start');	
			//$WR.TaskBar.addLine($MUI('Déconnexion'), this.close.bind(this), {icon:'exit', bold:true});
			
			$WR.ALERT_USE_STRING = true;
			
			//this.MenuApplication = $WR.TaskBar().PanelMenu;
						
			$Body.appendChild(this.Alert);
			$Body.appendChild(this.Flag);
			//$Body.appendChild(this.DropMenu);
			$Body.css('height', document.stage.stageHeight);
			
			//$WR.Constraint({left:0, bottom: document.stage.stageHeight, right:document.stage.stageWidth, top:0});
			
			Extends.fire('minsys:startinterface');
			
			this.open();
			
			if(!this.Icons) this.exec('install.icons.download');
			
		}catch(er){if(window['console']){console.log(er)}};
	}
}
$S = Install; 