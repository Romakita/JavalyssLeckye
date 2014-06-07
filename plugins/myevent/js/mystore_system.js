/**
 * == MyEvent ==
 * Cette section est dédié au noyau du logiciel Javalyss. Il gère tous les traitements de base du logiciel.
 * 
 * Ces gestions de base sont :
 *
 * * Gestion des modules statiques et dynamique
 * * Lancement de l'interface
 * * Gestion des clefs, constantes, utilisateurs du système.
 *  
 **/

/** section: MyEvent
 * System
 * Cet espace de nom gère tous les paramètres du système Javalyss. Sa tâche est d'assurer la communication 
 * entre Javascript et PHP via AJAX de façon sécurisé.
 **/
var System = {
/**
 * System.link -> String
 * Lien de la passerelle PHP.
 **/
	link:				'',
/**
 * System.PATH -> String
 * Dossier de référence des fichiers JS de la version en cours.
 **/
	PATH:				'',
/**
 * System.AlertBox -> AlertBox
 * Instance de la boite de dialogue principale du système.
 **/
	Alert:		null,
	AlertBox:	null,
/**
 * System.LightBox -> AlertBox
 * Instance le diaporama principale du système.
 **/	
	LightBox:	null,
/*
 * System.Observer -> Observer
 * Instance du gestionnaire d'événement.
 **/
	Observer:	null,
/**
 * System.initialize() -> void
 * Cette méthode initialise le système.
 **/
	initialize: function(){
		this.link = 'ajax/';
		//
		// Observer
		//
		this.Observer = 				new Observer();
		this.Observer.bind(this);
		//
		// Terminal
		//
/**
 * System.trace(message) -> void
 * - message (String): Message à afficher.
 *
 * Affiche un message dans le terminal.
 * Le terminal permet de débugguer un programme s'éxécutant dans le logiciel.
 **/
		this.trace = function(){
			if(!System.Terminal){
				console.log($A(arguments));
				return;
			}
			return System.Terminal.trace.apply(this.Terminal, $A(arguments));
		}.bind(this);
		
		//#pragma region Def Function
		try{
			
/**
 * System.fire(eventName [, args]) -> void
 * - eventName (String): Nom de l'événement à déclencher.
 * - args (Mixed): Argument à passer au fonction écoutant l'événement.
 *
 * Execute un événement. L'ensemble des écouteurs enregistrés sur le nom de l'événement
 * via la methode [[System.observe]] seront éxécutés.
 *
 **/
			this.fire = 	this.Observer.fire.bind(this.Observer);
/**
 * System.observe(eventName, callback) -> void
 * - eventName (String): Nom de l'événement à écouter.
 * - callback (Function): Fonction écoutant l'événement.
 *
 * Ajoute un écouteur sur un nom d'événement.
 **/
			this.observe =  this.Observer.observe.bind(this.Observer);
/**
 * System.observePattern(pattern, callback) -> void
 * - pattern (String): Motif des événéments à écouter.
 * - callback (Function): Fonction écoutant l'événement.
 *
 * Cette méthode observe tous les noms d'événements personnalisés ressemblant au motif `pattern`. La fonction enregistré sera appellé lors de l'utilisation
 * de la méthode [[Observer.fire]] avec comme paramètre le même nom d'événement proche du `pattern`.
 **/
			this.observePattern =  this.Observer.observePattern.bind(this.Observer);
/** alias of: System.observe
 * System.on(eventName, callback) -> void
 * - eventName (String): Nom de l'événement à écouter.
 * - callback (Function): Fonction écoutant l'événement.
 *
 * Ajoute un écouteur sur un nom d'événement.
 **/
			this.on =		this.Observer.observe.bind(this.Observer);
/**
 * System.stopObserving(eventName, callback) -> void
 * - eventName (String): Nom de l'événement à stopper.
 * - callback (Function): Fonction écoutant l'événement.
 *
 * Supprime un écouteur sur un nom d'événement.
 **/
			this.stopObserving =  this.Observer.stopObserving.bind(this.Observer);
			
		
			//#pragma endregion Def Function
			
			//lancement de la première action du systeme. Chargement des données.
			Extends.observe('dom:loaded', this.start.bind(System));
			
		}catch(er){}
		
		//copie de la methode open et remplacement de cette derniere par la méthode System.open
		//window.open_ = window.open;
		//window.open = $S.open;
		
		this.unload = true;
		
		$WR.ready(function(){
			System.startInterface();
		});
	},
/**
 * System.exec(cmd [, options]) -> Ajax.Request 
 * System.exec(cmd [, callback]) -> Ajax.Request 
 * - cmd (String): Nom de la commande à executer.
 * - options (Object): Object de configuration de requête AJAX.
 * - callback (Function): Fonction executée une fois que la méthode est terminée.
 *
 * Cette méthode envoie une commande vers le fichier `gateway.php`. Le script analysera et traitera la commande.
 *
 * <p class="note">Cette méthode assure une communication sécurisé entre le fichier <code>gateway.php</code> et Javascript.</p>
 * 
 * <p class="note">Cette méthode offre les mêmes options que la méthode <code>Ajax.Request</code> de <a href="http://api.prototypejs.org/ajax/Ajax/Request/">prototypejs</a>.</p>
 *
 * #### Paramètres options
 *
 * Le paramètre options possède plusieurs attributs permettant de configurer la connexion AJAX. 
 *
 * - `parameters` (String | Object): Paramètres à envoyer au script PHP.
 * - `link` (String): Lien du script PHP. Par défaut link vaut "gateway.php".
 * - `method` (String): POST ou GET.
 * 
 * Et tous les événements du cycle de vie d'une requête AJAX.
 *
 * #### Exemple
 *
 * Ci-après un exemple d'utilisation de la méthode :
 *
 *     System.exec('user.list', function(result){
 *          try{
 *               var obj = result.responseText.evalJSON();
 *          }catch(er){
 *               System.trace(result.responseText);
 *               return;
 *          }
 *          //suite des instructions
 *     });
 *
 * Ci-après un autre exemple d'utilisation de la méthode en envoyant des paramètres :
 *
 *     System.exec('user.list', {
 *          parameters:'options=active&param2=toto',
 *          onComplete:function(result){ 
 *                try{
 *                    var obj = result.responseText.evalJSON();
 *               }catch(er){
 *                    System.trace(result.responseText);
 *                    return;
 *               }
 *               //suite des instructions
 *          }
 *     });
 *
 * #### Cycle de vie de la requête (extrait prototype.js)
 * 
 * Underneath our nice requester objects lies, of course, `XMLHttpRequest`. The defined life-cycle is as follows:
 *
 * * Created
 * * Initialized
 * * Request sent
 * * Response being received (can occur many times, as packets come in)
 * * Response received, request complete
 *
 * As you can see under the "Ajax options" heading of the Ajax, Prototype's AJAX objects define a whole slew of callbacks, which are triggered in the following order:
 * 
 * * `onCreate` (this is actually a callback reserved to Ajax.Responders)
 * * `onUninitialized` (maps on Created)
 * * `onLoading` (maps on Initialized)
 * * `onLoaded` (maps on Request sent)
 * * `onInteractive` (maps on Response being received)
 * * `onXYZ` (numerical response status code), onSuccess or onFailure (see below)
 * * `onComplete`
 *
 * The two last steps both map on Response received, in that order. If a status-specific callback is defined, it gets invoked. Otherwise, if onSuccess is defined and the response is deemed a success (see below),
 * it is invoked. Otherwise, if onFailure is defined and the response is not deemed a sucess, it is invoked. Only after that potential first callback is onComplete called.
 *
 * <p class="related-to">Pour en savoir plus sur la méthode Ajax.Request rendez-vous sur cette <a href="http://api.prototypejs.org/ajax/Ajax/Request/">page</a>.</p>
 *
 **/
	exec: function(cmd, obj){
		
		if(Object.isUndefined(cmd)) throw('Error System::exec : arg[0] is undefined');
		
		var options = {
			method:		'post',
			parameters: '',
			trace:		true, 
			onComplete:	new Function(),
			link:		$S.link
		};
		
		if(Object.isFunction(obj)){
			options.onComplete = obj;	
		}else{
			if(!Object.isUndefined(obj)){
				Object.extend(options, obj);	
			}
		}
		
		var callback = 		options.onComplete;
		$S.activedTrace = 	options.trace;
		
		options.onComplete = function(result){
			try{
				if(Object.isFunction(callback)) return callback.call(this, result);
			}catch(er){
				this.trace(er);
			}
		}.bind(this);
		
		if(typeof options.parameters == 'object'){
			options.parameters = Object.toQueryString(options.parameters);	
		}
		
		options.parameters += 	options.parameters != '' ? 
						'&' + $WR().getGlobals('parameters') + '&cmd='+cmd : 
						$WR().getGlobals('parameters') + '&cmd='+cmd;
						
		try{
			var ajax = new Ajax.Request(options.link, options);
		}catch(er){
			this.trace(er);	
		}
		
		return ajax;
	},
/**
 * System.Meta(key [, value [, callback]]) -> Mixed
 * - key (String): Nom de la clef méta à utiliser.
 * - value (Mixed): Valeur à affecter.
 * - callback (Function): Fonction appelée après sauvegarde des données.
 *
 * Cette méthode retourne une valeur stocké en fonction du paramètre `key` dans la table `software_meta`. 
 * Si le paramètre `value` est mentionné alors la méthode enregistrera cette valeur dans la table au nom de clef indiqué `key`.
 *
 * <p class="note">Si la clef n'existe pas et que `value` n'est pas mentionné la méthode retournera NULL.</p>
 *
 * Cette méthode gère les clefs du système. Une clef est une information ou méta donnée
 * stocké en base de données. Elle peut être utilisé par n'importe quel module pour
 * stocker des informations. Les clefs enregistrés sont automatiquements sauvegardé et
 * restauré au lancement du logiciel.
 *
 * Les clefs système sont des clefs sensibles puisqu'elles contiennent les valeurs de configuration
 * du système même. Il est conseillé pour un module dynamique d'utiliser les clefs de stockage
 * du module PluginManager si les informations sont relatives au plugin plutot qu'au système.
 **/
	meta: function(key, value, callback){
		//clef protégé
		var key_reserved = ['link', 'Observer', 'themes', 'plugins', 'roles', 'users', 'tools', 'notify', 'isInit', 'NbNotify', 'files'];
		
		if(key_reserved.indexOf(key) != -1) throw('System:meta.key.exception (La clef demandé ne peut être ni lu ni écrite)');
		
		if(Object.isUndefined(value)){
			if(Object.isUndefined(this[key])) return null;
			if(Object.isFunction(this[key])) throw('System:meta.function.exception (La clef demandé ne peut être ni lu ni écrite)');
			if(Object.isElement(this[key])) throw('System:meta.element.exception (La clef demandé ne peut être ni lu ni écrite)');
			
			return this[key];
		}
		
		if(Object.isFunction(this[key])) throw('System:meta.function.exception (La clef demandé ne peut être ni lu ni écrite)');
		if(Object.isElement(this[key])) throw('System:meta.element.exception (La clef demandé ne peut être ni lu ni écrite)');
		
		this[key] = value;
		
		var obj = {key:key, value:System.serialize(value)};
		
		$S.exec('system.meta.commit', {
			parameters:	'meta=' + escape(Object.toJSON(obj)),
			onComplete:	callback
		});
		
		
		return value;
	},

	Meta: function(key, value, callback){return this.meta(key, value, callback);},
/*
 * System.onEval(evt, argv) -> void
 * - evt (StopEvent): Objet d'événement personnalisé.
 * - argv (Array): Liste des arguments de la commande.
 *
 * Cette méthode évalue les commandes du terminal.
 **/
	onEval: function(evt, argv){
		if(argv.length == 0) return;
		
		var original = argv[0];
		
		switch(argv[0]){
			case 'help':
				evt.stop();
				
				var help = 	'<table style="padding-bottom:20px">';
				help += 	'<tr><td width=100><code>clear</code></td><td>Vide la fenêtre du terminal.</td></tr>';
				help += 	'<tr><td><a onclick="$S.Terminal.eval(\'configure\')"><code>configure</code></a></td><td>Force la reconfiguration des applications. Cette méthode permet de régler certains problèmes suite à une mise à jour fait manuellement.</td></tr>';
				help += 	'<tr><td><a onclick="$S.Terminal.eval(\'exec -h\')"><code>exec</code></a></td><td>Execute une commande AJAX.</td></tr>';
				help += 	'<tr><td width=100><code>disconnect</code></td><td>Ferme le logiciel javalyss.</td></tr>';
				help += 	'<tr><td><a onclick="$S.Terminal.eval(\'meta -h\')"><code>meta</code></a></td><td>Retourne la valeur de System.Meta(key).</td></tr>';
				
				help += 	'<tr><td><a onclick="$S.Terminal.eval(\'compile -h\')"><code>compile</code></a></td><td>Créer une archive du logiciel.</td></tr>';
				help += 	'<tr><td><code>whoimy</code></td><td>Affiche le nom de l\'utilisateur connecté.</td></tr>';
				help +=		'</table><p>Pour plus d\'information sur la commande tapez le nom de la commande suivi du flag <code>-h</code>';
				
				return help;
				
			case 'configure':
				evt.stop();
				$S.exec('system.db.update');
				return;
				
			case 'disconnect':
				evt.stop();
				$S.exec('system.disconnect');
				break;
				
			case "whoimy":
				evt.stop();
				return 'whoimy > ' + $U().Name + ' ' + $U().FirstName;
				
			case "meta":
				evt.stop();
				
				if(argv[1] == '-h'){
					var help = 	'<code>usage: meta &lt;key&gt;</code><p></p>';
					help += 	'Retourne la valeur de System.Meta(key).';
					return help;
				}
				
				return 'System:Meta[' + argv[1] +'] > ' + $S.Meta(argv[1]);
				
			case "exec":
				evt.stop();
				
				if(argv[1] == '-h'){
					var help = 	'<code>usage: exec &lt;command&gt;</code><p></p>';
					help += 	'Execute une commande AJAX.';
					return help;
				}
				
				var parameters = {cmd: argv[1]};
				break;
			
			case "compile":
			case 'zipsys'://création d'une archive du logiciel.
				evt.stop();
				
				if(argv[1] == '-h'){
					
					var help = 	'<code>usage: compile [options] &lt;filename&gt;</code><p></p><code>usage 2: zipsys [options] &lt;-v=version&gt;</code><br />';
					help += 	'Créer une archive du logiciel et la stocke dans votre dossier public au nom indiqué par filename.<br /><br />';
					help += 	'Par défaut l\'archivage du logiciel sera complet. La liste des options suivantes permet de modifier l\'archive construite :<br /><table>';
					help += 	'<tr><td width=30><code>-i</code></td><td>Archivage sans le dossiers des icônes.</td></tr>';
					help += 	'<tr><td><code>-c</code></td><td>Archivage sans les fichiers de configuration.</td></tr></table>';
					return help;
				}
				
				//création de la commande
				argv = $S.parseArgs(argv);
								
				var parameters = {cmd: 'system.create.archive', options:{op:argv.flag(), value:''}};
				parameters.options.version = !Object.isUndefined(argv.get('v')) ? argv.get('v') : false; 
				
				
										
				if(argv.length > 0) {
					parameters.options.value = argv.get(0);
				}
				else{
					if(!parameters.options.version){
						return $MUI('compile > Erreur de syntaxe sur la commande, utilisez l\'option -h pour avoir les détails de la commande.');	
					}
						
					parameters.options.value = $S.CORE_BASENAME.replace(/ /g, '_').toLowerCase() + '_' + parameters.options.version;
				}
				
				break;
				
		}
		
		if(evt.stopped){
			
			$S.trace(evt.text);
			$S.Terminal.setTag(original + ' > ');
						
			$S.exec(parameters.cmd, {
				parameters: 'options=' + escape(Object.toJSON(parameters.options)),
				trace:		false,
				
				onLoading:	function(){
					$S.trace('wait...');	
				},
				
				onComplete:	function(result){
					var str = result.responseText;
					$S.trace(str == '' ? 'Aucune réponse' : str);
					$S.Terminal.unTag();
				}
			});
		}
	},
/*
 * System.onCompleteAjax(text) -> Boolean
 * - text (Number): Resultat à analyser
 * 
 * Analyse le resultat à la recherche de commande de deconnexion du logiciel.
 **/	
	onCompleteAjax: function(result){
		try{
		var text = 	result.transport.responseText;
		var box = 	$S.AlertBox;
				
		if(text.match(/system\.gateway\.time\.exceded|system\.gateway\.key\.err/)){//utilisateur déconnecté
				
				box.hide();
			try{
				//
				//
				//
				var flag = 	box.box.createFlag();
				box.PasswordSecurity = new Input({type:'password', style:'width:100%'});
				//
				//
				//
				var widget = 	new Widget();
				widget.Table = 	new TableData();
				widget.Title($MUI('Sécurité - Saisissez votre mot de passe'));
				widget.setIcon('locked');
				widget.Table.setStyle('width:100%');
				
				widget.Table.addHead($MUI('Mot de passe') + ' : ', {width:120}).addField(box.PasswordSecurity);
				widget.appendChild(widget.Table);
							
				box.PasswordSecurity.on('mouseover', function(){
					flag.setText('<p class="icon-locked">' +  $MUI('Pour valider cette action, merci de saisir le mot de passe de votre compte utilisateur') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
				});
				//
				// Splite
				//
				var splite = new SpliteIcon($MUI('Votre compte est déconnecté'), $MUI('Votre compte est resté trop longtemps inactif. Merci de saisir votre mot de passe pour vous reconnecter !'));
				splite.setIcon('connect-no-48');
				splite.setStyle('width:400px');
				
				box.a(splite).a(widget).setType().show();
				
				box.PasswordSecurity.focus();
				
				box.submit({
					text: $MUI('Me connecter'),
					icon: 'connect-creating',
					click:function(){
						return $S.connect(result);
					}.bind(this)
				});
				
				box.reset({
					text:$MUI('Quitter l\'application'),
					icon:'exit',
					click: function(){
						window.location = 'index.php';	
					}
				});
			}catch(er){$S.trace(er)}
			return;	
		}
		
		if(text.match(/system\.user\.noright/)){//privilège insuffisant
			box.hide();
			var splite = new SpliteIcon($MUI('Vos privilèges sont insuffisants pour effectuer cette action'), $MUI('Merci de vous connecter avec un compte ayant les privilèges suffisants') + ' !');
			splite.setIcon('alert-48');
			splite.setStyle('width:400px');
			box.a(splite).a(widget).setType('CLOSE').Timer(5).show();
			return;	
		}
		
		if(text.match(/{"error":/) || text.match(/{<b>Fatal error<\/b>/gi)){
			
			try{
				var error = text.evalJSON();
				var str = 	'<strong>Commande : <span style="color:#069">' + (error.cmd ? error.cmd : 'null') + '</span></strong>';
				str += 		'<br>Code d\'erreur : <span style="color:red">' +  error.error + '</span>';
				
				if(error.queryError){
					str += 		'<br>Requête SQL : <pre class="sql"><code>' +  error.query + '</code></pre>';
					str += 		'<br>Erreur SQL : <pre class="sql"><code>' +  error.queryError + '</code></pre>';
				}
				
				if(error.options){
					str += '<br>Données : ' + Object.isString(error.options) ? error.options : Object.toJSON(error.options);
				}
				
				$S.trace(str);
				
				result.transport.responseText = 'Une erreur est survenue lors du traitement de votre requête, ouvrez le terminal pour afficher l\'erreur';
				
			}catch(er){
				
				$S.trace(text);
				result.transport.responseText = 'Erreur du parser JSON, ouvrez le terminal pour afficher l\'erreur';
			}
				
		}else{
		
			if(text.match(/<pre/)){
				$S.trace(text);
			}
		}
		
		
		
		/*if($S.Meta('MODE_DEBUG') && $S.activedTrace){
			
			if(!Object.isUndefined(result.parameters.trace)){
				return;
			}
			
			try{
				$S.trace($MUI('Réponse de la passerelle à la commande : ' + result.parameters.cmd));
				
				try{
					var str = text.evalJSON();
				}catch(er){}

				$S.trace(text == '' ? $MUI('Aucune réponse') : text);
			}catch(er){
				this.trace(er);
			}
		}*/
			
		
		}catch(er){$S.trace(er)}
	},
/*
 * System.onOpenRemoveItem(box) -> void
 * - box (AlertBox): Instance de la boite de dialogue.
 *
 * Cette méthode crée un formulaire de vérification de mot de passe lorsque l'utilisateur tente de supprimer une ressource du logiciel.
 **/	
	onOpenRemoveItem: function(box){
		var flag = box.box.createFlag();
		box.PasswordSecurity = new Input({type:'password', style:'width:100%'});
		//
		//
		//
		var widget = 	new Widget();
		widget.Table = 	new TableData();
		widget.Title($MUI('Sécurité - Saisissez votre mot de passe'));
		widget.setIcon('locked');
		widget.Table.setStyle('width:100%');
		
		widget.Table.addHead($MUI('Mot de passe') + ' : ', {width:120}).addField(box.PasswordSecurity);
		widget.appendChild(widget.Table);
		
		box.a(widget);
		
		box.PasswordSecurity.focus();
		
		box.PasswordSecurity.on('mouseover', function(){
			flag.setText('<p class="icon-locked">' +  $MUI('Pour valider cette action, merci de saisir le mot de passe de votre compte utilisateur') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
	},
/*
 * System.onSubmitRemoveItem(evt) -> void
 *
 * Cette méthode vérifie le mot de passe lorsque le formulaire de suppression d'une ressource du logiciel est validé.
 **/
	onSubmitRemoveItem:function(evt){
		evt.target.box.Flag.hide();
		if(evt.target.PasswordSecurity.value == ''){
			evt.stop();
			evt.target.box.Flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').color('red').setType(FLAG.RIGHT).show(evt.target.PasswordSecurity, true);
			return true;
		}
		
		if(evt.target.PasswordSecurity.value.md5(15) != $U().Password){
			evt.stop();
			evt.target.box.Flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').color('red').setType(FLAG.RIGHT).show(evt.target.PasswordSecurity, true);
			return true;
		}
		
	},
/*
 * System.parseArgs() -> Object
 **/	
	parseArgs: function empileFlag(argv){
		var str = '';
		var argv_ = {};
		argv_.length = 0;
				
		for(var i = 1; i < argv.length; i++){
			
			if(argv[i].slice(0, 1) == '-'){
				if(!argv[i].match(/=/)){//verification d'une option avec égalité
					str += argv[i].replace(/-/g, '');
				}else{
			
					var arg = argv[i].split('=');						
					argv_[arg[0].replace(/-/g, '')] = arg[1];
					continue;			
				}
				continue;
			}
							
			argv_[argv_.length] = argv[i];
			argv_.length++;
		}
				
		return {
			options:	argv_, 
			value:		str,
			length:		argv_.length * 1,
			
			get: function(key){
				if(!Object.isUndefined(key)) return this.options[key];
				return this.options;
			}, 
			
			flag: function(){
				return this.value != '' ? '-' + this.value : ''
			}
		}
	},
/**
 * System.reload() -> void
 * Cette méthode redémarre le logiciel.
 **/	
	reload: function(){
		window.onbeforeunload = function(){};
		window.location.reload();
	},
/**
 * System.serialize(value) -> String
 * - value (String | Number | Object | Date): Valeur à sérialiser.
 *
 * Cette méthode sérialize le paramètre `value` en vue d'être envoyé via AJAX.
 **/	
	serialize: function(value){

		switch(typeof value){
			case "function":
				return false;
			case "boolean":
			case "number":
			case "string":
				value = encodeURIComponent(value);
				break;
			case "object":
				if(Object.isFunction(value.toString_)){
					value = value.toString_('datetime');	
				}else{
					var obj = Object.isArray(value) ? [] : {};
					
					for(var key in value){
						if(Object.isFunction(value[key])) continue;
						obj[key] = System.serialize(value[key]);
					}
					
					value = obj;
				}
				break;	
		};
		
		return value;
	},
/**
 * System.open(link, name [, options]) -> Window
 * - link (String): Lien de la page à ouvrir.
 * - name (String): Nom à afficher pour l'instance Window.
 * - options (Object): Objet de configuration de l'instance Window.
 *
 * Ouvre une fenêtre `Iframe` pour afficher une page externe au logiciel.
 * Cette méthode remplace la méthode `window.open` afin d'éviter l'ouverture de `popup` supplémentaire.
 *
 * <img src="http://www.javalyss.fr/sources/system-open.png" />
 **/
	open: function(link, name, obj){
		
		var win = new Window();
		
		win.IFrame = new Node('iframe', {src:link, style:'height:100%; width:100%; position:absolute'});
		win.IFrame.on('click', function(){win.focus()});
		win.setTitle(name).setIcon('browser-alt').appendChild(win.IFrame);
	
		document.body.appendChild(win);

		var options = {
			fullScreen: true,
			width:		0,
			height:		0,
			left:		0,
			top:		0
		};
		
		if(Object.isString(obj)){
			obj = obj.split(',');
			var obj_ = {};
	
			for(var i = 0; i < obj.length; i+=1){
			
				var t = obj[i].split('=');
				
				if(t.length ==1){
					obj_[t[0]] = true;	
				}else{
					obj_[t[0]] = t[1];	
				}
			}
			obj = obj_;
		}
		
		Object.extend(options, obj); 
		
		options.fullScreen =  options.width == 0 && options.height == 0;
		
		if(options.fullScreen){
			win.fullscreen();
		}else{
			win.resizeTo(options.width ? options.width : document.stage.stageWidth, options.height ? options.height : document.stage.stageWidth);
		}
		
		win.moveTo(options.left, options.top);
		
		//overide methode iframe
		win.IFrame.contentWindow.close = win.close.bind(win);
				
		$S.fire('system:external.open', win, obj);
				
		return win;
	},
/**
 * System.openPDF(link) -> Window
 * - link (String): Lien du fichier pdf à ouvrir.
 *
 * Cette méthode est conçue pour l'ouverture de fichier PDF au sein du logiciel.
 **/
	openPDF:function(uri){
		var win = new Window();
		
		win.IFrame = new Node('object', {style:'height:100%; width:100%; position:absolute; top:0px; left:0px;margin:0px', type:'application/pdf', data:uri});
		
		//win.IFrame.innerHTML = 'alt : <a href="'+ uri +'">'+uri+'</a>';
		
		win.setTitle(name).setIcon('acroread').appendChild(win.IFrame);
		document.body.appendChild(win);
		win.Fullscreen(true);
				
		return win;
	},
/**
 * System.openObject(data, type) -> Window
 * - data (String): Lien data de la balise Object.
 * - type (String): Type de l'application à ouvrir.
 *
 * Cette méthode permet l'ouverture de document quelconque (sous condition que le navigateur le prenne en charge)
 * dans une fenêtre du logiciel.
 **/
	openObject:function(data, type){
		var win = new Window();
		
		win.Object = new Node('object', {style:'height:100%; width:100%; position:absolute; top:0px; left:0px;margin:0px', type:type, data:data});
		
		win.setTitle(name).setIcon('object').appendChild(win.Object);
		document.body.appendChild(win);
		win.Fullscreen(true);
				
		return win;
	},
/**
 * System.openPicture(file, array) -> Window
 * - file (String): Lien de l'image à afficher
 * - array (String): Liste des images pour la diaporama
 *
 * Cette méthode permet l'ouverture de photo dans l'instance LightBox.
 **/	
	openPicture: function(file, array){
		var index = 0;
		var i = 0;
		
		if(array){
			if(array.length){
				array.each(function(e){
									
					if(e.src == file.uri || e.src == file || e.src == file.src){
						index = i;	
					}
					i++;
				});
				this.LightBox.setData(array);
				this.LightBox.selectedIndex(index);
			}else{
				this.LightBox.setData([file]);
			}
			
		}else{
			this.LightBox.setData([{src: file, title:''}]);
		}
		
		this.LightBox.show();
	},
/**
 * System.ready(fn) -> System
 * - fn (Function): Fonction à appeller
 * 
 * Cette méthode enregistre une fonction qui sera appelée après le chargement complet de Javalyss.
 **/	
	ready:function(fn){
		this.observe('system:loaded', fn);
		return this;
	},
/**
 * System.startInterface() -> void
 *
 * Initialise l'interface d'administration en fonction de l'utilisateur courant.
 **/
	startInterface:function(){
		try{
			
		this.Terminal = 				new Terminal();
		this.AlertBox = this.Alert = 	new AlertBox();
		this.AlertBox.box.createFlag();
		
		this.LightBox = 				$WR.LightBox || new LightBox();
		this.Flag =						$WR.Flag || new Flag();	
		
		$WR().setGlobals('link', this.link);
		
		Ajax.Responders.register({onComplete:this.onCompleteAjax.bind(this)});
		//mise à jour de la constante de la taille des fichiers de FrameWorker
		FrameWorker.prototype.maxSize = 	System.UPLOAD_MAX_FILESIZE;
		DropFile.prototype.maxSize = 		System.UPLOAD_MAX_FILESIZE;
		
		FrameWorker.prototype.parameters = 	'cmd=frameworker.default.import';
		DropFile.prototype.parameters = 	'cmd=frameworker.default.import';
		
		Extends.fixScroll();
		
		this.fire('system:startinterface');
		
		document.body.appendChild(this.AlertBox);
		document.body.appendChild(this.Flag);
		document.body.appendChild(this.LightBox);
				
		document.observe('keydown', function(evt){
			var code = (!document.all)? evt.which : evt.button;
			
			if(code == 121 || code == 120){
				if(this.Terminal.opened){
					try{
						this.Terminal.window.close();
					}catch(er){}
					this.Terminal.opened = false;
				}else{
					this.Terminal.open();
					this.Terminal.opened = true;
				}					
			}
		}.bind(this));
		
		//if($S.Meta('USE_SECURITY')){
		//	$S.observePattern('remove.open', this.onOpenRemoveItem.bind(this));
		//	$S.observePattern('remove.submit', this.onSubmitRemoveItem.bind(this));
		//}
						
		}catch(er){console.log(er)}
		
	},
/** deprecated
 * System.timeExceded(uri) -> void
 *
 * Informe l'utilisateur qu'il est rester trop longtemps inactif et que la fenêtre va se fermer.
 **/
	timeExceded:function(){},	
};

var $S = System;
//lancement du system
System.initialize();