/**
 * JavalyssConnexion
 **/
var JavalyssConnexion = Class.create();
JavalyssConnexion.prototype = {
/**
 * JavalyssConnexion.link -> String
 * Lien de la passerelle pour la connexion au logiciel.
 **/
	link:				'ajax/',
	/** 
	 * @type String
	 */
	current:			'',
/**
 * JavalyssConnexion.initialize() -> void
 *
 **/
	initialize: function(form){
		
		this.form = $(form);
		this.form.observe('submit', this.connect.bind(this));
		
		if(this.form.LostPassword){
			$(this.form.LostPassword).observe('click', this.openLost.bind(this));
		}
		
		this.AlertBox = new AlertBox();
		$Body.appendChild(this.AlertBox);
	},
/**
 * JavalyssConnexion.openAdmin(link) -> void
 *
 * Cette méthode ouvre la page d'administration du logiciel.
 **/	
	openAdmin: function(bool){
		window.location = 'index_admin.php?PHPSESSID='+this.PHPSESSID;
	},
/**
 * JavalyssConnexion.openLost() -> void
 * 
 * Cette méthode ouvre le formulaire de récupération de mot de passe depuis l'adresse e-mail.
 **/
 	/**
 * MinSys.openLost() -> void
 * 
 * Cette méthode ouvre le formulaire de récupération de mot de passe depuis l'adresse e-mail.
 **/
 	openLost: function(){
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Réinitialisation de votre mot de passe'), $MUI('Merci de saisir votre adresse de messagerie. Un e-mail contenant votre nouveau mot de passe vous sera envoyé à cette adresse') + '.');
		splite.setStyle('width:500px');
		splite.setIcon('password-48')
		//
		// Email
		//
		var email = new Node('input', {type:'text'});
		email.setStyle('width:200px;');
		//
		// table
		//
		var table = new TableData();
		
		table.setStyle('margin:auto; margin-top:10px; margin-bottom:10px;');
		table.addHead($MUI('E-mail') + ' : ').addField(email);
		
		this.AlertBox.setIcon('password');
		this.AlertBox.setTitle($MUI('Mot de passe perdu')).a(splite).a(new Node('div', {style:'text-align:center'}, table)).setType().show();
		this.AlertBox.getBtnSubmit().setText('Générer un mot de passe');
		
		var flag = this.AlertBox.box.createFlag();
		this.AlertBox.box.createHandler('Envoi du message en cours', true);
		
		this.AlertBox.submit(function(){
						
			if(!email.value.isMail()){
				flag.setText($MUI('Veuillez saisir une adresse e-mail correcte')).setType(FLAG.RIGHT).show(email, true);	
				return true;
			}
			
			this.AlertBox.box.ActiveProgress();
			
			$S.exec('user.password.send', {
				parameters:	'EMail=' + email.value,
				onComplete: function(result){
					
										
					switch(result.responseText){
						case 'user.email.send.ok':
							this.AlertBox.hide();
							
							var splite2 = new SpliteIcon($MUI('Votre mot de passe vient d\'être envoyé sur votre adresse e-mail'));
							splite2.setIcon('valid-48');
							
							this.AlertBox.ti($MUI('Erreur')+'...').a(splite2).ty('CLOSE').Timer(5).show();
							break;
						case 'user.email.err':
							flag.setText('<p class="icon-documentinfo">' + $MUI('L\'adresse e-mail saisie n\'existe pas') + '</p>');
							flag.color('grey').setType(FLAG.RIGHT).show(email, true);
							break;
						default:
							this.AlertBox.hide();
							
							var splite2 = new SpliteWait($MUI('Une erreur est survenue lors de la tentative d\'envoi de votre mot de passe') + '.');
							var node = new Node('div', result.responseText);
							this.AlertBox.ti($MUI('Erreur')+'...').a(splite2).a(node).ty('CLOSE').show();
							break;
					}
					
					
				}.bind(this)
			});
			
			return true;
		}.bind(this));
	},
/**
 * JavalyssConnexion.connect() -> void
 *
 * Cette méthode prépare la connexion au logiciel. Si l'utilisateur est bien identifié par le logiciel
 * ce dernier sera redirigé vers l'administration du logiciel. L'ensemble de ses informations et préférence
 * seront chargées.
 **/
	connect: function(evt){
		evt.stop();
		var flag = $WR.Flag;
		flag.hide();
		
		if(this.form.Login.value == '' || (this.form.Login.value.length < 3)){
			flag.setText('<p class="icon-documentinfo">' + $MUI('Votre <b>identifiant</b> saisie doit comporter au moins <b>3 caractères</b>.') + '</p>').setType(FLAG.RIGHT).color('grey');
			flag.show(this.form.Login);
			return false;
		}
		
		if(this.form.Password.value == '' || (this.form.Password.value.length < 6 && this.form.Password.value.length > 15)){
			flag.setText('<p class="icon-documentinfo">' + $MUI('Votre <b>mot de passe</b> doit comporter au moins <b>6 caractères</b>.') + '</p>').setType(FLAG.RIGHT).color('grey');
			flag.show(this.form.Password);
			return false;
		}
		
		this.AlertBox.wait();
		
		this.exec('system.connect', {
			parameters:	'Login='+ this.form.Login.value + '&Password=' + this.form.Password.value,
			onComplete: function(result){
				this.AlertBox.hide();
				
				try{
					var obj = result.responseText.evalJSON();
					
					if(obj.error == 'user.connect.err'){
						flag.setText($MUI('L\'identifiant et/ou le mot de passe saisis sont incorrects'));
						flag.show(this.form.Login);
						return;
					}
					
					if(obj.error == 'user.connect.login'){
						flag.setText($MUI('L\'identifiant et/ou le mot de passe saisis sont incorrects'));
						flag.show(this.form.Login);
						return;
					}
					
					if(obj.error == 'user.connect.password'){
						flag.setText($MUI('Le mot de passe saisi est incorrect'));
						flag.show(this.form.Password);
						return;
					}
					
					if(obj.statut == 'system.connect.ok'){
						try{
							
							if(document.navigator.$_GET('redir')){
								window.location = unescape(decodeURI(document.navigator.$_GET('redir')));
							}else{
								if(window.location.href.match(/\/admin/)){
									window.location.reload();
								}else{
									window.location = 'admin/';
								}
							}
							
						}catch(er){
							flag.setText('<p class="icon-documentinfo">' + $MUI('Vous devez accepter les pop-up pour l\'utilisation du logiciel') + '.</p>').setType(FLAG.LB).color('grey');
							flag.show($WR.TaskBar());
							flag.decalTo(-40, -$WR.TaskBar().getHeight());
							flag.setStyle('z-index:10000');
						}
						
						return;
					}
				}catch(er){
					
					if(result.responseText.match(/sql\.connect\.err/) || result.responseText.match(/sql\.select\.db\.err/)){
						var splite = SpliteWait($MUI('Une erreur est survenue lors de la connexion à la base de données.<br />Si le problème persiste, veuillez contacter l\'administrateur du logiciel. (code:' + result.responseText+')'));
						
						this.AlertBox.setTitle($MUI('La connexion a échoué')).a(splite).setType('CLOSE').show();
						return;
					}					
				}
				
				var splite = 	new SpliteWait($MUI('Une erreur est survenue lors de la tentative de connexion au logiciel') + '.');
				var node = 		new Node('div', result.responseText);
				this.AlertBox.ti($MUI('Erreur')+'...').a(splite).a(node).ty('CLOSE').show();
				return;
			}.bind(this)
		});

		return false;
	},
/**
 * JavalyssConnexion.disconnect() -> void
 * 
 * Cette méthode informe le logiciel que l'utilisateur c'est déconnecté du logiciel et affiche un message de confirmation à l'utlisateur.
 **/
	disconnect: function(){
		try{

			$S.exec('system.disconnect', function(result){
				this.AlertBox.hide();
				
				var splite = new SpliteInfo($MUI('Vous avez été deconnecté du logiciel') + '.');
				this.AlertBox.ti($MUI('Message d\'information')).a(splite).ty('CLOSE').show();
			}.bind(this));
			
		}catch(er){}
	},
/**
 * JavalyssConnexion.timeExceded() -> void
 * 
 * Cette méthode informe l'utilisateur que son délais de connexion est dépassé.
 **/
	timeExceded: function(){
		try{
			var splite = new SpliteInfo($MUI('Votre session est arrivé à expiration. Veuillez-vous reconnecter.') + '.');
			
			this.AlertBox.ti($MUI('Message d\'information')).a(splite).ty('CLOSE').show();
			
			$S.exec('system.disconnect');
			
		}catch(er){}
	},
/**
 * JavalyssConnexion.exec(cmd , obj) -> void
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

	}
};

Extends.after(function(){
	
	$$('.form-connexion').each(function(form){
		try{
			new JavalyssConnexion(form);
		}catch(er){if(window['console']){console.log(er)}}
	});
});