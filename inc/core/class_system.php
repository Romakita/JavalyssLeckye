<?php
/**
 * == Core ==
 * Cette section est dédié à la documentation du noyau du logiciel.
 * Le noyau gère tous les accès entre les fonctionnalités critiques du logiciel et l'interface.
 *
 * Les fonctionnalités du noyau sont les suivantes :
 *
 * * Gestion des utilisateurs,
 * * Gestion des rôles,
 * * Gestion des extensions,
 * * Gestion des mises à jours,
 * * Gestion des sauvegardes,
 * * Gestion d'impression,
 * * Gestion de connexion au logiciel,
 * * Configuration du logiciel,
 * * Configuration des tâches planifiés.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Version : 1.3
 * * Date :	21/03/2014
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 * #### Convention de nommage
 *
 * Toutes les méthodes du noyau de Javalyss suivent une convention de nommage précise. En voici les détails :
 *
 * * Les méthodes de classe `public` et `private` sont écrites en minuscule. Exemple : System.getUserRight().
 * * Les méthodes de classe `static` commence toujours par une lettre Majuscule, la suite des caractères étant écrit en minuscule. Ex : System.AddScript().
 * * Les méthode [[System.uDie]] et [[System.sDie]] sont les seules exceptions.
 *
 * PHP etant insensible à la case les méthodes peuvent être appellé sans respecter ces conventions.
 **/

/**
 * == Plugins ==
 *
 * Les plugins sont des micros applications développées pour Javalyss. Cette section document les différentes extensions du logiciel. 
 * Attention toutefois, la disponibilité des classes et méthodes ne sont effectives que lorsque l'extension est activée via Javalyss Market.
 **/
define('TABLE_SYSTEM', '`'.PRE_TABLE.'software_meta`');
/** section: Core
 * class System
 * Cette classe gère l'ensemble du logiciel. Elle assure la gestion notamment des mises à jours du logiciel et la connexion d'un utilisateur au système de données.
 **/
require_once('class_plugin.php');

abstract class System{
/**
 * System.VERSION -> String
 * Version du système.
 **/
	const VERSION =			'1.3';
/**
 * System.SAFE -> String
 **/	
	const SAFE = 			'safe';
/**
 * System.CNT -> String
 **/
	const CNT =				'connected';
/**
 * System.instance -> System
 * `private`
 **/
	private static $intance = 	NULL;
	private static $Error =		0;
/**
 * System.TABLE_NAME -> String
 * Table de configuration du système.
 **/
	const TABLE_NAME = 			TABLE_SYSTEM;
/**
 * System.Meta -> Object
 * Liste des informations métas
 **/
	private $Meta =				NULL;
/*
 * System.DB_VERSION -> Array
 * Liste des configurations d'accès des plannings.
 **/
 	static $DB_VERSION =		NULL;
/**
 * System.Initialize() -> void
 *
 * Cette méthode initialize le gestionnaire System.
 **/
	public static function Initialize(){
		global $SQL, $__ERR__, $PM, $FM, $FMPLUG;
		
		date_default_timezone_set('UTC');
/**
 * Global.PM -> PluginManager
 * Instance du gestionnaire des extensions.
 **/												
		$PM = 		Plugin::Initialize();	
/**
 * Global.SQL -> Sql
 * Instance du gestionnaire de requête [[Sql]].
 **/
		if(!defined('DB_TYPE')) define('DB_TYPE', 'MySQL');
		
		switch(DB_TYPE){
			default:
				$type = DB_TYPE;
				break;
			case 'mysql':
				$type = 'MySQL';
				break;
			case 'mssql':	
				$type = 'MsSQL';
				break;
		}
		
		Sql::Create(array(
			'login' => 		DB_LOGIN, 
			'password' => 	DB_PASS, 
			'host' => 		DB_HOST, 
			'db' => 		DB_NAME, 
			'type' =>		$type
		));
		
		Sql::Connect();
								
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		//
		// Inclusion des classes
		//
		$folder = new StreamList(ABS_PATH . 'inc/core/', '', array('class_system.php', 'class_plugin', 'abstract_market.php'));
		
		do{
			require_once(ABS_PATH . 'inc/core/'.$folder->current());
		}while($folder->next());
		//
		//gestion du NullByte
		//
		Stream::CleanNullByte($_POST);
		Stream::CleanNullByte($_GET);
		Stream::CleanNullByte($_COOKIE);
		Stream::CleanNullByte($_REQUEST);
		//
		// Creation de la tache cron
		//
		Cron::Path(System::Path('private'));
		Cron::Uri(System::Path('uri'));
/**
 * Global.__ERR__ -> Number
 * Numéro d'erreur généré par le système ou les extensions lors de leurs éxécution.
 **/
		$__ERR__ = 	0;

/**
 * Global.FM -> FileManager
 * Instance du gestionnaire des médias de l'utilisateur.
 **/
		$FM =		new FileManager();
/**
 * Global.FMPLUG -> FileManager
 * Instance du gestionnaire des extensions via l'explorateur [[FileManager]].
 **/
		$FMPLUG =	new FileManager('plugin');
		//
		// Definition des constantes
		// 
		$array = self::GetMetas();
		
		foreach($array as $key => $value){
			if(!defined($key)){
				if(is_numeric($value) || is_string($value) || is_bool($value)) define($key, $value);
			}
		}
		
		if(defined('MEMORY_MAX_LIMIT')){
			Stream::$MEMORY_MAX_LIMIT = MEMORY_MAX_LIMIT;
		}
		
		
		//
		// Evenements
		//
		System::Observe('gateway.exec', array(&$FM, 'exec'));
		System::Observe('gateway.exec', array(&$FMPLUG, 'exec'));
		
		register_shutdown_function(array(__CLASS__, 'onShutDown'));
				
		if(file_exists(System::Path('plugins').'javalyssmarket/market.php')){
			include_once(System::Path('plugins').'javalyssmarket/market.php');
		}
		//
		// Requete CRON
		//
		if(Cron::HaveProcess()){
			Plugin::Import();
			Cron::ExecProcess();
			exit();
		}
	}
 	
	public static function Get(){
		global $PM;
		
		$options =			new stdClass();	
		$options->User = 	User::Get()->toObject();
		$options->Roles = 	Role::GetList();
		$options->Plugins = Plugin::GetList();
		
		return $options;	
	}
/**
 * System.iDie([safemode]) -> void
 * - safemode (Boolean): Si la valeur est vrai le teste sur `safemode` ne sera pas fait.
 *
 * Emet une erreur si le système est non initialisé.
 *
 * #### SafeMode
 *
 * Ce mode est activé par défaut lorsque le système est initialisé sans utilisateur connecté. Certaines méthodes du système émetterons l'erreur `system.init.err`
 * si `safemode` est actif.
 **/
	public static function iDie($bool = false){
		if(!User::IsConnect() && !$bool) {
			self::eDie('system.init.err');
		}
	}
/**
 * System.eDie(error [, options]) -> void
 * - error (String): Code de l'erreur.
 * - options (Object): Données à transmettre.
 *
 * Cette méthode affiche un rapport d'erreur vers le buffer et arrête la propagation du système.
 **/	
	public static function eDie($errCode, $options = NULL){
			
		$obj = 			new stdClass();
		$obj->error = 	$errCode;
		$obj->cmd =		System::GetCMD();
		$obj->options =	$options;
		$obj->parameters =	$_POST;
		
		$err = 			utf8_encode(Sql::Current()->getError());
		
		if($err){
			$obj->query = 		Sql::Current()->getRequest();
			$obj->queryError = 	"".$err;
		}
		
		if(empty($_REQUEST['callback'])){
			die(json_encode($obj));
		}else{
			die(@$_REQUEST['callback'].'('.json_encode($obj).')');
		}	
	}
/**
 * System.sDie() -> void
 * 
 * Emet une erreur si le mode d'installation n'est pas initialisé lors de l'utilisation de cette méthode.
 **/
	public static function sDie(){
		if(defined('MODE_INSTALL')){
			if(!MODE_INSTALL){
				self::eDie('system.install.write.config.err');
			}
		}else {
			self::eDie('system.install.write.config.err');	
		}
	}
/**
 * System.AddCSS(link [, media]) -> void
 * - link (String): Lien du fichier CSS à ajouter
 * 
 * Cette méthode enregistre un lien d'un script CSS et sera ajouter au lancement du logiciel.
 **/
	public static function AddCSS($link, $media='all'){
		global $PM;
		return $PM->addCSS($link, $media);
	}
/** alias of: System.AddScript
 * System.AddJS(link) -> void
 * - link (String): Lien du fichier Javascript à ajouter
 * 
 * Cette méthode enregistre un lien d'un script Javascript et sera ajouter au lancement du logiciel.
 **/
	public static function AddJS($link){
		global $PM;		
		return $PM->addScript($link);
	}
/**
 * System.AddScript(link) -> void
 * - link (String): Lien du fichier Javascript à ajouter
 * 
 * Cette méthode enregistre un lien d'un script Javascript et sera ajouter au lancement du logiciel.
 **/
	public static function AddScript($link){
		global $PM;
		return $PM->addScript($link);
	}
/**
 * System.EnqueueScript(scriptname [, src = null[, parameters = null]]) -> void
 * - scriptname (String): Nom du script tel que `jquery`, `prototype` etc...
 * - src (String): Lien du script à charger
 * - parameters (String): Paramètre à passer au script JS.
 * 
 * Cette méthode gère l'inclusion sans doublon des script Javascript vers le template.
 **/
	public static function EnqueueScript($scriptname, $src = '', $parameters = ''){
		return CoreUI::EnqueueScript($scriptname, $src, $parameters);
	}
	
	public static function RemoveScript($scriptname){
		return CoreUI::RemoveScript($scriptname);
	}
/**
 * System.Ajax([mode]) -> void
 * 
 * Cette méthode execute les procedures en provenance d'AJAX.
 **/
 	public static function Ajax($mode = System::SAFE){
				
		SystemBuffer::Start("ob_gzhandler");
		
		self::$Error = 0;
		//Vérification de la commande
		if(@self::GetCMD() == ''){
			self::eDie("system.unitiliazed.cmd");
			return;
		}
		
		//Exception de vérification d'instance
		switch(self::GetCMD()){
			case 'user.demo.connect':
				User::exec('user.demo.connect');
				break;
			case 'user.connect':
			case 'system.connect':
				User::exec('user.connect');
				break;
			case 'user.disconnect':
			case 'system.disconnect':
				User::exec('system.disconnect');
				break;
			case 'user.send.password':
			case 'user.password.send':
				User::exec('user.send.password');
				break;
			default:
				if($mode == self::CNT){	
					
					//Récupération des données de l'utilisateur connecté
					if(!User::IsConnect()){
						System::eDie('system.gateway.time.exceded');
					}
					
				}
				
				//Décodage des champs POST
				self::DecodeFields();
				
				if($mode == self::SAFE){
					
					SystemBuffer::Store("ob_gzhandler");
				}
				
				Plugin::Import($mode);
				
				if($mode == self::SAFE){					
					SystemBuffer::Restore("ob_gzhandler");
				}
				
				//declenchement des actions
				
				switch($mode){
					case self::SAFE:
						self::Error(System::fire('gateway.safe.exec', array(self::GetCMD())));
						break;
					case self::CNT:
						self::Error(System::fire('gateway.exec', array(self::GetCMD())));
						
						User::Set();
						break;
				}
				
				//traitement d'erreur éventuelle
				if("". self::Error() != "0"){ 
					$str = SystemBuffer::GetClean();
					SystemBuffer::Start("ob_gzhandler");
					self::eDie(self::Error(), str_replace("\n", '<br>', $str));
				} 
			}
						
			if(empty($_REQUEST['callback'])){
				SystemBuffer::EndFlush();
			}else{//retour JSONP
				$str = SystemBuffer::GetClean();
				
				if(!is_numeric($str) && !preg_match('/^["\[{]/', $str)){
					$str = '"'.$str.'"';
				}
				
				SystemBuffer::Start("ob_gzhandler");
							
				echo @$_REQUEST['callback'].'('.$str.')';
				
				SystemBuffer::EndFlush();
			}
		
	}
/**
 * System.Configure() -> void
 * 
 * Cette méthode configure et effectue la mise à jour de la base de données.
 *
 * <p class="note">Cette méthode utilise le fichier update.sxml présent dans le dossier inc/conf/default pour mettre à jour la base de données.</p>
 **/	
	public static function Configure(){
		self::ParseSXML(System::Path('conf').'/default/update.sxml');		
		System::fire('plugin.configure');
		return true;
	}
/**
 * System.Compile(filename, version [, options]) -> String
 *
 * Cette méthode créée une archive du logiciel.
 *
 * #### Les options
 *
 * * -noicon : Créée une archive sans les icônes. Les icônes seront téléchargées automatiquement depuis le serveur Javalyss.
 * * -icon : Créée une archive avec les icônes.
 *
 **/
	public static function Compile($file, $version, $options = '-noicon'){
		$tmp = self::Path(). '/compile/';
		@Stream::MkDir($tmp);
				
		switch(@$options){
			case '-all':
				Stream::Copy(ABS_PATH, $tmp, '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|\.ini$|zipsys|compile|old|archives$|private$|psd$|\.db$|_notes|\.sxmllog$|sitemap\.xml|doc\/php$|doc\/js$/');
				break;
			case '-icon':
			case '-c':
				Stream::Copy(ABS_PATH, $tmp, '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|zipsys|compile|private$|public$|plugins$|psd$|\.db$|_notes$|themes$|doc\/php$|doc\/js$/');
				Stream::Delete($tmp.'inc/conf/conf.soft.php');
				Stream::Delete($tmp.'inc/conf/conf.db.php');
				Stream::Delete($tmp.'inc/conf/conf.file.php');
				break;
			default:
			case '-noicon':
			case '-ic':
				Stream::Copy(ABS_PATH, $tmp, '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|\.ini$|zipsys|compile|old|archives$|private$|public$|plugins$|psd$|sitemap\.xml|doc\/php$|\.db$|_notes$|themes$|doc\/js$/');
				Stream::Delete($tmp.'inc/conf/conf.soft.php');
				Stream::Delete($tmp.'inc/conf/conf.db.php');
				Stream::Delete($tmp.'inc/conf/conf.file.php');
				break;
		}
		
		$flag = '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|\.ini$|zipsys|compile|old|archives$|private$|public$|plugins$|psd$|\.db$|_notes$|sitemap\.xml|doc\/php$|doc\/js$/';
		
		@Stream::Delete($tmp.'.htaccess');		
		@Stream::Delete($tmp.'robots.txt');
		
		Stream::Copy(self::Path('js').'tiny_mce/plugins/', $tmp.'js/tiny_mce/plugins/');
		Stream::Copy(self::Path('js').'window/plugins/', $tmp.'js/window/plugins/');
		
		@Stream::MkDir($tmp.'themes/', 0751);
		@Stream::MkDir($tmp.'themes/window/', 0751);
		@Stream::MkDir($tmp.'themes/plugins/', 0751);
		
		Stream::Copy(self::Path('themes').'window/plugins/', $tmp.'themes/window/plugins/');
		
		Stream::Copy(self::Path('themes').'window/', $tmp.'themes/window/', $flag);
		Stream::Copy(self::Path('themes').'system/', $tmp.'themes/system/', $flag);
		Stream::Copy(self::Path('themes').'system.min.css', $tmp.'themes/system.min.css', $flag);
		
		//
		// Intégration des packets complémentaires.
		//
		@Stream::MkDir($tmp.'plugins/', 0751);
		Stream::Copy(self::Path('plugins').'javalyssmarket/', $tmp.'plugins/javalyssmarket/', '/^\.svn|\.yaml$|\.bak$|\.git$|\.ini$|zipsys|compile|old|archives$|private$|public$|plugins$|psd$|\.db$|_notes|\.sxmllog$|\.zip$|sitemap\.xml/');
		
		if($version){
			
			$subversion = 	substr($version, 3, strlen($version) -1);
			$version =		substr($version, 0, 3);
			
			$str = Stream::Read(self::Path('conf').'/default/conf.schemes.php');
			
			$str = str_replace(array(
				'#NAME_VERSION',
				'#CORE_BASENAME',
				'#NAME_CLIENT',
				'#CODE_VERSION',
				'#CODE_SUBVERSION',
				'#DATE_VERSION'
			),
			array(
				CORE_BASENAME,
				CORE_BASENAME,
				'',
				$version,
				$subversion,
				date('Y-m-d')
			), $str);
			
			Stream::Write($tmp.'inc/conf/default/conf.install.php', $str);
		}
						
		Stream::Package($tmp, $file = self::Path('publics').$file.'_'.date('Y-m-d').'.zip');
		Stream::Delete($tmp);
		
		return $file;
	}
/**
 * System.CronStart() -> void
 * Cette méthode lance le gestionnaire des tâches périodique.
 **/
 	public static function CronStart(){		
		Cron::Path(self::Path('private'));
		
		if(!Cron::IsStarted()){
			Cron::Start();
			
		}
		
		self::Fire('system:cron.start');
	}
/**
 * System.Define() -> void
 * 
 * Cette méthode définie toutes les constantes du logiciel qui sont stockées dans la table `software_meta`.
 **/
	public static function Define(){
		$array = self::GetMetas();
		
		foreach($array as $key => $value){
			if(!defined($key)){
				if(is_numeric($value) || is_string($value) || is_bool($value)) define($key, $value);
			}
		}	
	}
/**
 * System.DecodeFields() -> void
 * Cette méthode décode les champs POST, GET, COOKIE et REQUEST.
 **/
 	public static function DecodeFields(){
		
		//post	
		foreach($_POST as $key => $value){
			
			switch($key){
				default:
					$_POST[$key] = ObjectTools::RawUrlDecode($_POST[$key]);
					break;
					
				case 'word':
					if(!empty($_POST[$key])){
						$_POST[$key] = ObjectTools::RawUrlDecode($_POST[$key]);	
					}
					break;
					
				case 'options':
					if($_POST[$key] == 'undefined'){
						$_POST[$key] = '';
					}else{
						
						$_POST[$key] = ObjectTools::DecodeJSON($_POST[$key]);
						
						if(is_string($_POST[$key])) {
							$o = new stdClass();
							$o->op = $_POST[$key];
							$_POST[$key] = $o;
						}
					}
					break;
					
				case 'clauses':	
				case 'meta':
					if($_POST[$key] == 'undefined'){
						$_POST[$key] = '';
					}else{
						//var_dump($_POST[$key]);
						$_POST[$key] = ObjectTools::DecodeJSON($_POST[$key]);
					}
					break;
			}
		}
					
		if(empty($_POST['clauses'])){
			$_POST['clauses'] ='';
		}
		
		
		if(empty($_POST['options'])){
			$_POST['options'] = 		new stdClass();
			$_POST['options']->op = 	'';
		}
		
		if(empty($_POST['meta'])){
			$_POST['meta'] = '';
		}
		
		//GET
		foreach($_GET as $key => $value){
			switch($key){
				default:
					$_GET[$key] = ObjectTools::RawUrlDecode($_GET[$key]);
					break;
					
				case 'word':
					if(!empty($_GET[$key])){
						$_GET[$key] = ObjectTools::RawUrlDecode($_GET[$key]);	
					}
					break;
					
				case 'options':
					if($_GET[$key] == 'undefined'){
						$_GET[$key] = '';
					}else{
						$_GET[$key] = ObjectTools::DecodeJSON($_GET[$key]);
				
						if(is_string($_POST[$key])) {
							$o->op = $_POST[$key];
							$_POST[$key] = $o;
						}
					}
					break;
					
				case 'clauses':	
				case 'meta':
					if($_GET[$key] == 'undefined'){
						$_GET[$key] = '';
					}else{
						$_GET[$key] = ObjectTools::DecodeJSON($_GET[$key]);
					}
					break;
			}
		}
					
		if(empty($_GET['clauses'])){
			$_GET['clauses'] ='';
		}
		
		if(empty($_GET['options'])){
			$_GET['options'] = 		new stdClass();
			$_GET['options']->op = 	'';
		}
		
		if(empty($_GET['meta'])){
			$_GET['meta'] = '';
		}
		
		//COOKIE
		foreach($_COOKIE as $key => $value) $_COOKIE[$key] = ObjectTools::RawUrlDecode($value);
		//REQUEST
		foreach($_REQUEST as $key => $value) $_REQUEST[$key] = ObjectTools::RawUrlDecode($value);
		
	}
/**
 * System.Download(url) -> String | Number | Object | Array
 * - url (String): Lien du fichier à récupérer depuis un serveur distant.
 *
 * Cette méthode télécharge un fichier et le stocke dans le dossier public 
 **/
	public static function Download($url){
		return Stream::Download($url, self::Path());	
	}
/**
 * System.onSelectDB(sql) -> Boolean
 *
 * Cette méthode permet de selectionner une base de données à partir de son nom.
 **/
	public static function onDBSelect($sql){
			
		if(is_array($sql->getDatabase())){
			$dbinfo = $sql->getDatabase();
		}else{
			$dbinfo = self::$DB_VERSION[$sql->getDatabase()];
		}
	
		$sql->setLogin($dbinfo['login']);
		$sql->setPassword($dbinfo['pass']);
		$sql->setHost($dbinfo['host']);
		$sql->setDatabase($dbinfo['db'], false);
		
		if(self::$DB_VERSION['Clients Master']['host'] == self::$DB_VERSION[NAME_VERSION]['host']){
			return false;
		}
		
		$sql->connect();
			
		return true;
	}
/**
 * System.Dump() -> String
 *
 * Cette méthode sauvegarde la base de données du logiciel dans un fichier `.sql`.
 **/
	public static function Dump($list = NULL){
		
		$request = 	new Request();
		$str = 		$request->exec(Request::DUMP, $list);
		
		if(!$str) return false;
		
		$filename = self::Path('private').'bck_db_'.date("Y_m_d_H_i_s").'.sql';
		
		Stream::Write($filename, $str);
		
		return $filename;
	}
/**
 * System.Error() -> String
 * System.Error(err) -> String
 **/	
	public static function Error($err = NULL){
		
		if($err != NULL){
			self::$Error = $err;
		}
		
		return self::$Error;
	}
/**
 * System.Export(list [, dumpfile]) -> void
 * 
 * Cette méthode crée une sauvegarde de la base de données et l'envoi vers le poste client.
 **/
	private static function Export($list, $dumpfile = 0){
		self::HasRight(1);
		
		switch($fl = self::Dump($list)){
			case 'system.initerr':
			case 'system.usernoright':
			case 'system.file.export.err':
				return false;
		}
		
		$tmp = self::Path('publics').'compile/';
		Stream::MkDir($tmp, 0700);
		
		@Stream::Delete($tmp.'backup_db.sql');
		
		Stream::Copy($fl, $tmp.'backup_db.sql');
		
		if(!empty($dumpfile)){
			$file = self::Compile('javalyss_leckye_'.CODE_VERSION.CODE_SUBVERSION, CODE_VERSION.CODE_SUBVERSION);
		}else{
			$file = self::Path('publics').'backup_db_'.date('Y-m-d').'.sql.zip';
			Stream::Package($tmp, $file);
			@Stream::Delete($tmp);	
		}
						
		return $file;
	}
/**
 * System.Fire(eventName, args) -> Mixed
 * - eventName (String): Nom de l'événement à déclencher.
 * - args (Array): Tableau d'argument à passer aux méthodes enregistrées sur l'événement.
 *
 * Cette méthode déclenche un nom d'événement `eventName`. Toutes les fonctions associées à `eventName` seront executés.
 **/
	public static function Fire(){
		global $PM;
		$args = func_get_args();
		return call_user_func_array(array(&$PM, 'fire'), $args);
	}
/**
 * System.FixRight([folder]) -> void
 * 
 * Cette méthode fixe les problèmes de droits d'accès aux dossiers et fichiers.
 **/	
	public static function FixRight($folder = ABS_PATH){
	
		$list = new StreamList($folder, NULL, NULL, array());
		
		if(!$list->current()){
			return;
		}
		
		do{
			$file = new File($folder . $list->current());	
			if($file->equals(ABS_PATH)) continue;
			if($file->contain('old')) continue;
			
			if($file->isDir()){
				//if($file->contain('public')){
					chmod($file, 0711);	
					echo '<strong>chmod</strong> <span style="color:red">'.$file ."</span> <strong style=\"color:#069\">0711</strong><br>";
				//}else{
				//	chmod($file, 0775);	
				//	echo '<strong>chmod</strong> <span style="color:red">'.$file ."</span> <strong style=\"color:#069\">0775</strong><br>";
				//}
				
				self::FixRight($file.'/');
				
			}//else{
			//	chmod($file, 0664);	
			//	echo '<strong>chmod</strong> <span style="color:red">'.$file ."</span> <strong style=\"color:#069\">0664</strong><br>";
			//}
			
		}while($list->next());
	}
/**
 * System.HasRight() -> void
 *
 * Cette méthode teste le niveau de droit d'accès de l'utilisateur connecté. Si l'utilisateur 
 * ne dispose pas des privilères suffisant la méthode émettera une erreur de type `die()` et ayant pour valeur `system.user.noright`.
 **/	
	static public function HasRight($lvl, $user = NULL){
		System::iDie();
		
		if($user != NULL){
			if(User::Get()->getID() == $user->User_ID) return true;
			
			if(User::Get()->getRoleParent()->getID() > $user->getRoleParent()->getID()) {
				die('system.user.noright');
			}
		}
		
		if(User::Get()->getRoleParent()->getID() > $lvl) {
			die('system.user.noright');
		}
	}
/**
 * System.Import() -> void
 *
 * Cette méthode importe une sauvegarde de la base de données.
 **/
	private static function Import(){
		self::iDie();
				
		FrameWorker::Start();
		
		//récupération du fichier
		FrameWorker::Draw('upload -o="'.self::Path('private').'"');
		
		$file = FrameWorker::Upload(self::Path('private'), System::Meta('EXT_FILE_AUTH'), System::Meta('EXT_FILE_EXCLUDE'));
				
		FrameWorker::Draw('sql dump database');
		//sauvegarde préalable de la base de données.				
		self::Dump();
						
		//vérification du fichier, suppression des anciennes entrées et importation des données.
		switch(Stream::Extension($file)){
			case 'zip':
				Stream::Depackage($file, ABS_PATH.PATH_PLUGIN);
				$file = str_replace('.zip', '.sql', $file);
				
			case 'sql':
			
				$request = 	new Request();
				$result = 	System::ShowTable();
				
				FrameWorker::Draw('sql show table');
				/*
				for($i = 0; $i < $result['length']; $i++){	
					$request->query = 'TRUNCATE TABLE '.$result[$i]['text'];
					
					FrameWorker::Draw('sql truncate -t='.$result[$i]['text']);
					
					if(!$request->exec('query')){
						FrameWorker::Draw($request->getError());
					}
				}*/
				
				echo Stream::ParseSQL($file);
				
				break;
		}
		
		FrameWorker::Stop();
		return 0;
	}
/**
 * System.IsAjaxRequest() -> Boolean
 *
 * Cette méthode si il s'agit de requête AJAX.
 **/
	public static function IsAjaxRequest(){
		$link = new Permalink();
		return $link->strEnd('/ajax') || $link->strEnd('/ajax/connected') || $link->strEnd('/adminajax') || $link->strStart('gateway.php', false) || $link->strStart('gateway.safe.php', false);
	}
/**
 * System.AjaxType() -> String
 *
 * Cette méthode détecte le type de connexion AJAX souhaitée.
 **/	
	public static function AjaxType(){
		$link = new Permalink();
		return $link->strEnd('/ajax/connected') || $link->strStart('gateway.php', false) ? self::CNT : self::SAFE;
	}

/**
 * System.IsCompileCSSRequest() -> Boolean
 *
 * Cette méthode indique si il s'agit d'une demande de récupération du fichier des icônes.
 **/	
	public static function IsCompileCSSRequest(){
		$link = new Permalink();
		
		if($link->strStart('themes/window.css.php', false)){
			$path = '';
			$theme = empty($_GET['themes']) ? 'system' : $_GET['themes'];
			
			if(strpos($theme, '/') !== false){
				$theme = 	'custom';
				$path = 	str_replace('../', '', $_GET['themes']);
			}
			
			header('Location:'.URI_PATH.'themes/compile/' . $theme . '/window/minified/' . $path);
			exit();	
		}
				
		return $link->strStart('themes/compile', false);
	}
/**
 * System.IsAdminPageRequest() -> Boolean
 *
 * Cette méthode indique si il s'agit d'une requête de lancement de la page d'administration du logiciel.
 **/	
	public static function IsAdminPageRequest(){
		$link = new Permalink();
		
		if(file_exists(System::Path('self').'index_admin.php')){
			@Stream::Delete(System::Path('self').'index_admin.php');
			@Stream::Delete(System::Path('self').'gateway.safe.php');
			@Stream::Delete(System::Path('self').'gateway.php');
		}
		
		return $link->strStart('admin', false) || $link->strStart('index_admin.php', false);
	}
/**
 * System.Meta(key [, value]) -> String | Number | Array | Object
 * - key (String): Nom de la valeur stockée.
 * - value (String | Number | Array | Object): Valeur à stocker.
 *
 * Cette méthode retourne une valeur stocké en fonction du paramètre `key` dans la table `software_meta`. 
 * Si le paramètre `value` est mentionné alors la méthode enregistrera cette valeur dans la table au nom de clef indiqué `key`.
 *
 * <p class="note">Si la clef n'existe pas et que `value` n'est pas mentionné la méthode retournera NULL.</p>
 *
 * <p class="note">Si la clef n'existe pas et que `value` est mentionné la méthode créera une nouvelle entrée dans la table.</p>
 *
 **/
	public static function Meta($key){
		if($key == '') return false;
		
		self::iDie(true);
		
		$num = func_num_args();
		
		$request = 			new Request();
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	"Meta_Key = '".Sql::EscapeString($key)."'";
		
		$meta = $request->exec('select');				
		
		if($num == 1){	
			return $meta['length'] == 0 ? false : unserialize($meta[0]['Meta_Value']);
		}
				
		if($num == 2){
				
			$value = func_get_arg(1);
			
			if($value === "false") 	$value = false;
			if($value === "true") 	$value = true;
			
			if($meta['length'] == 0){
				
				$request->fields = '(Meta_Key, Meta_Value)';
				$request->values = "('".Sql::EscapeString($key)."', '".Sql::EscapeString(serialize($value))."')";
				
				if($request->exec('insert')) return func_get_arg(1);
				
			}else{
				
				$request->set = 	"Meta_Value = '".Sql::EscapeString(serialize($value))."'";
				$request->where = 	"Meta_ID = ".$meta[0]['Meta_ID'];
								
				if($request->exec('update')) {
					return func_get_arg(1);
				}
			}
		}
		return false;
	}
/**
 * System.Path([type]) -> String
 * - type (String): type de dossier cible
 *
 * Cette méthode retourne le chemin absolue vers le dossier publique de l'utilisateur.
 *
 * Cette méthode prend en paramètre optionnel un `type`. Ce paramètre peut prendre différente valeur comme suivants :
 *
 * * `public` par défaut :  retourne le chemin absolue vers le dossier publique de l'utilisateur.
 * * `private` : retourne le chemin absolue du dossier privé du système.
 * * `plugin` : retourne le chemin absolue du dossier des extensions.
 * 
 * Depuis la version 0.2.1 d'autres constantes sont disponibles :
 *
 * * `self` : retourne le chemin du logiciel (Equivalent à `Global.ABS_PATH`).
 * * `theme` : retourne le chemin absolue du dossier des thèmes du système.
 * * `lib` : retourne le chemin absolue du dossier des librairies.
 * * `core` : retourne le chemin absolue du dossier des fichiers système.
 * * `conf` : retourne le chemin absolue du dossier des fichiers de configuration.
 * * `icon` : retourne le chemin absolue du dossier des icônes.
 * * `panel` : retourne le chemin absolue du dossier des panneaux.
 *
 **/	
	public static function Path($type = "public", $abs = true){
						
		switch($type){
			
			case "prints":
				return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC.'Prints/';
			case "models":
				return ($abs ? ABS_PATH : URI_PATH).'models/';
			case "models.default":
			case 'model.default':
				return self::Path('models.version', $abs). '/'. '/default/';
			
			default:
			case "publics":
				return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC;
				
			case "publics.global":
				return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC . 'global/';
				
			case "public":
				self::iDie(true);
				return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC.User::Get()->getID().'/';
			case "private":
				return ($abs ? ABS_PATH : URI_PATH).PATH_PRIVATE;
			case 'plugins':
			case "plugin":
				return ($abs ? ABS_PATH : URI_PATH).PATH_PLUGIN;
			case "self":
				return ABS_PATH;
			case 'uri':
				return URI_PATH;
			case "theme":
			case "themes":
				return ($abs ? ABS_PATH : URI_PATH).PATH_THEME;
			case 'icons':
			case "icon":
				return ($abs ? ABS_PATH : URI_PATH).PATH_THEME.'icons/';
			case "panel":
				return ($abs ? ABS_PATH : URI_PATH).PATH_THEME.'panel/';
			case "flag":
				return ($abs ? ABS_PATH : URI_PATH).PATH_THEME.'flag/';
			case "lib":
				return ($abs ? ABS_PATH : URI_PATH).'inc/lib/';
			case "core":
				return ($abs ? ABS_PATH : URI_PATH).'inc/core/';
			case "conf":
				return ($abs ? ABS_PATH : URI_PATH).'inc/conf/';
			case 'js':
				return ($abs ? ABS_PATH : URI_PATH).'js/';
			case 'mail':
				return ABS_PATH.'inc/core/model-mail.php';
		}
	}
/**
 * System.Observe(eventName, callback) -> void
 * - eventName (String): Nom de l'événement à écouter.
 * - callback (Array | String): Nom de la fonction ou tableau de noms => array(className, methodName).
 *
 * Cette méthode observe un nom d'événement `eventName`. La fonctions associée à `eventName` sera executé par la méthode [[System.Fire]].
 **/
	public static function Observe($event, $callback){
		global $PM;
		if(!empty($PM)){
			return $PM->observe($event, $callback);
		}
	}
/**
 * System.OnShutDown() -> void
 **/	
	public static function OnShutDown(){
		@session_start();
		if(!is_string(@$_SESSION['User'])){
			$_SESSION['User'] = @serialize($_SESSION['User']);
		}
		session_commit();
	}
/**
 * System.ParseSXML(file) -> Boolean
 * - file (String): Nom du fichier SXML à parser.
 *
 * Cette méthode parse et execute un fichier SXML.
 **/
 	public static function ParseSXML($file, $db = ''){
		if(!file_exists($file)){
			return;	
		}
		$request = 	new Request($db);
		$array = 	Stream::ParseXML($file);
		
		$querylog = new XmlNode();
		$querylog->Name = 'sql';
		
		$ok = new XmlNode();
		$ok->Name = 'ok';
		
		$warning = new XmlNode();
		$warning->Name = 'warning';
		
		$fail = new XmlNode();
		$fail->Name = 'fail';
		
		if(empty($array)) return true;
		if(empty($array['sql'])) return true;
		if(empty($array['sql']['query'])) return true;
		
		if(is_string($array['sql']['query'])){
			$array['sql']['query'] = array($array['sql']['query']);	
		}
					
		foreach($array['sql']['query'] as $query){
			$query = trim(str_replace('#PRE_TABLE', PRE_TABLE, $query));
			if(empty($query)) continue;	
			if(preg_match_all('/\[\[(.*)\]\]/', $query, $matches)){
				for($i = 0, $len = count($matches[0]); $i < $len; $i++){
					if(defined($matches[1][$i])){
						$query = str_replace($matches[0][$i], constant($matches[1][$i]), $query);
					}
				}			
			}
			
			if(preg_match_all('/\[serialize\[(.*)\]\]/', $query, $matches)){
				for($i = 0, $len = count($matches[0]); $i < $len; $i++){
					if(defined($matches[1][$i])){
						$query = str_replace($matches[0][$i], serialize(Sql::EscapeString(constant($matches[1][$i]))), $query);
					}
				}			
			}
						
			$request->query = $query;
						
			if(preg_match('/(TRY )/i', $request->query, $match)){//indique que la requête ne doit pas bloquer le script
				$request->query = str_replace($match[1], '', $request->query);				
				
				if(!$request->exec('query')){
					$o = new XmlNode('query');
					$o->Text = $request->getError();
					$warning->push($o);
					
				}else{
					$o = new XmlNode('query');
					$o->Text = $request->query;
					
					$ok->push($o);
				}
								
			}else{
			
				if(!$request->exec('query')){
					
					$o = new XmlNode('query');
					$o->Text = $request->getError();
					$fail->push($o);
					
					$querylog->push($ok);
					$querylog->push($warning);
					$querylog->push($fail);
					
					Stream::WriteXML($file.'log', $querylog);
		
					return false;
				}else{
					$o = new XmlNode('query');
					$o->Text = $request->query;
					
					$ok->push($o);
				}
			}
		}
		
		//écriture du fichier log
		$querylog->push($ok);
		$querylog->push($warning);
		$querylog->push($fail);
		
		Stream::WriteXML($file.'log', $querylog);
		
		return true;
	}
/**
 * System.ShowTable() -> Mixed
 * - eventName (String): Nom de l'événement à écouter.
 *
 * Cette méthode stop l'événement `eventName`.
 **/
 	public static function ShowTable(){
		$request = new Request();
		return $request->exec(Request::SHOWTAB, array('System', 'onShowTable'));
	}
	
	public static function onShowTable(&$row){
		$row['text'] = $row['value'] = current($row);
	}
/**
 * System.StopEvent() -> void
 *
 * Cette méthode stop l'événement déclenché par la méthode [[System.Fire]].
 **/
	public static function StopEvent(){
		return PluginManager::Stop();
	}
	
	public static function IsStopEvent(){
		return PluginManager::IsStop();
	}
/**
 * System.StopObserving(eventName) -> Mixed
 * - eventName (String): Nom de l'événement à écouter.
 *
 * Cette méthode stop l'événement `eventName`.
 **/
	public static function StopObserving($eventName){
		global $PM;
		return $PM->stopObserving($eventName);
	}
/**
 * System.Upload(file) -> String
 * - file (FILES): Tableau de données du fichier envoyé et stocké dans `$_FILE['nomchamp']`.
 *
 * Cette méthode charge un fichier en provenance du formulaire client.
 **/
	public static function Upload($FILES){
		return Stream::Upload($FILES, self::Path(), self::Meta('EXT_FILE_AUTH'), self::Meta('EXT_FILE_EXCLUDE'));
	}
/**
 * System.Update() -> Boolean
 *
 * Cette méthode lance la routine de mise à jour du système. Si la méthode retourne `true`, cela indique
 * que la routine a effectué une mise à jour du logiciel.
 **/
 	public static function Update(){
			
		if(CODE_VERSION.CODE_SUBVERSION > System::Meta('CODE_VERSION').System::Meta('CODE_SUBVERSION')) {
			//
			// Configuration de la base de données.
			//		
			self::Configure();
			
			if(System::Meta('LINK_MARKET') == 'http://server.javalyss.fr/gateway.safe.php' || System::Meta('LINK_MARKET') == 'http://javalyss.fr/gateway.safe.php'){
				System::Meta('LINK_MARKET', 'http://javalyss.fr/ajax/');
			}
			//
			// Mise à jour du numéro de version, de la date de mise à jour et de l'historique des mises à jour.
			//
			self::Meta('UPDATE_STORY', '');
			self::Meta('CODE_VERSION', CODE_VERSION);
			self::Meta('CODE_SUBVERSION', CODE_SUBVERSION);
			self::Meta('DATE_VERSION', DATE_VERSION);
			
			return true;
		}
		//
		// Création des fichiers nécessaires à Javalyss
		//
		self::WriteHTACCESS();
		
		return false;
	}
/**
 * System.ReadHTACCESS() -> void
 *
 * Cette méthode écrit les règles dans le fichier .htaccess du dossier racine. Si le fichier n'existe pas il sera créé.
 **/	
 	public static function ReadHTACCESS(){
		$home = str_replace('http://'.$_SERVER['SERVER_NAME'], '', URI_PATH);
		$file = self::Path('self').'.htaccess';
		
		if($home == '') $home = '/';
		$rules  = '';
		
		if(file_exists($file)){
			$rules = Stream::Read(ABS_PATH.'.htaccess') ."\n";
		}
		
		return $rules;
	}
/**
 * System.WriteHTACCESS(str) -> void
 *
 * Cette méthode écrit les règles dans le fichier .htaccess du dossier racine. Si le fichier n'existe pas il sera créé.
 **/
	public static function WriteHTACCESS($str = NULL){
		
		if(!empty($str)){
			Stream::Write(ABS_PATH.'.htaccess', $str);
			return;
		}
		
		$rules = $oldRules = self::ReadHTACCESS();
		
		//expiration des fichiers
		if(!(strpos($rules, 'mod_expires.c') !== false)){
			$rules .= "\n# BEGIN Expire headers\n";
			$rules .= "<IfModule mod_expires.c>\n";
			$rules .= "ExpiresActive On\n";
			$rules .= "ExpiresDefault \"access plus 1 seconds\"\n";
			$rules .= "ExpiresByType text/css \"access plus 1 seconds\"\n";
			$rules .= "ExpiresByType text/javascript \"access plus 1 seconds\"\n";
			$rules .= "ExpiresByType text/html \"access plus 1 seconds\"\n";
			$rules .= "ExpiresByType application/xhtml+xml \"access plus 1 seconds\"\n";
			$rules .= "ExpiresByType application/javascript \"access plus 1 seconds\"\n";
			$rules .= "</IfModule>\n";
			$rules .= "# END Expire headers\n\n";
		}
		//réécriture des url
		if(!(strpos($rules, 'mod_rewrite.c') !== false)){
			$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
			$base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME']);
			
			$home = str_replace($base, '', URI_PATH);
			if($home == '') $home = '/';
		
			$rules .= "\n# BEGIN BlogPress\n";
			$rules .= "<IfModule mod_rewrite.c>\n";
			$rules .= "RewriteEngine On\n";
			$rules .= "RewriteBase ".$home."\n";
			$rules .= "RewriteRule ^index\.php$ - [L]\n";
			$rules .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
			$rules .= "RewriteCond %{REQUEST_FILENAME} !-d\n";
			$rules .= "RewriteRule . ".$home."index.php [L]\n";
			$rules .= "</IfModule>\n";
			$rules .= "# END BlogPress\n\n";
		}
		
		if($rules != $oldRules){
			Stream::Write(ABS_PATH.'.htaccess', trim($rules));
		}
		
		System::Fire('system:htaccess.write', array($rules));
	}
/**
 * System.WriteConfig(login, pass, host, db [, pre]) -> void
 * - login (String): Identifiant de la base de données.
 * - pass (String): Mot de passe de connexion à la base de données.
 * - host (String): Nom d'hôte de la base de données.
 * - db (String): Nom de la base de données.
 *
 * Cette méthode crée le fichier de configuration du logiciel.
 **/
	public static function WriteConfig($login, $pass, $host, $db, $type, $pre = ""){
		
		self::sDie();
		
		if(!is_writable(ABS_PATH)) 				die('minsys.dir.unwritable');
		if(!is_writable(ABS_PATH.'inc/conf/')) 	die('minsys.conf.unwritable');
		
		//ouverture du fichier modèle
		$str = Stream::Read(ABS_PATH.'inc/conf/default/conf.db.php');

		//remplacement des chaines
		$str = str_replace('#DB_NAME', $db, $str);
		$str = str_replace('#DB_LOGIN', $login, $str);
		$str = str_replace('#DB_PASS', $pass, $str);
		$str = str_replace('#DB_HOST', $host, $str);
		$str = str_replace('#DB_TYPE', $type, $str);
		$str = str_replace('#PRE_TABLE', $pre, $str);
		
		Stream::Write(ABS_PATH.'inc/conf/conf.db.php', $str) or die('minsys.config.write.err');
		
		@Stream::MkDir(ABS_PATH.PATH_PUBLIC, 0711);
		@Stream::MkDir(ABS_PATH.PATH_PRIVATE, 0700);
		@Stream::MkDir(ABS_PATH.PATH_PLUGIN, 0751);
		@Stream::Copy(ABS_PATH.'inc/conf/default/conf.soft.php', ABS_PATH.'inc/conf/conf.soft.php');
		@Stream::Copy(ABS_PATH.'inc/conf/default/conf.cron.php', ABS_PATH.'inc/conf/conf.cron.php'); 
		@Stream::Copy(ABS_PATH.'inc/conf/default/conf.file.php', ABS_PATH.'inc/conf/conf.file.php');
	}
/**
 * System.WriteDatabase() -> void
 *
 * Cette méthode installe la base de données.
 *
 * <p class="note">Cette méthode utilise le fichier install.sxml présent dans le dossier inc/conf/default pour installer le logiciel.</p>
 **/
	public static function WriteDatabase(){
		self::sDie();
		if(!self::ParseSXML(System::Path('conf').'/default/install.sxml')){
			return "query.error ".Sql::Current()->getError();
		}
		return false;
	}
/**
 * System.GetMetas() -> Array
 *
 * Cette méthode retourne l'ensemble des données stockés en table `software_meta`.
 **/
	public static function GetMetas(){
		
		$request = 			new Request();
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		
		$meta = $request->exec('select');
		
		if(!$meta){
			Sql::PrintError();	
		}
				
		if($meta['length'] == 0) return false;
		
		$array = new stdClass();
		
		for($i = 0; $i < $meta['length']; $i++){
			$key = $meta[$i]['Meta_Key'];
			
			if($meta[$i]['Meta_Value'] == '') {
				$array->$key = '';
			}else{
				$array->$key = @unserialize($meta[$i]['Meta_Value']);
			}
		}
		
		return $array;
	}
/**
 * System.GetMeta(key) -> String | Number | Array | Object
 * - key (String): Nom de la valeur stockée.
 *
 * Cette méthode retourne la valeur d'une clef stockée dans la table `software_meta`.
 **/	
	static public function GetMeta($key){
		return self::Meta($key);
	}
/**
 * System.GetCMD() -> String
 *
 * Cette méthode retourne la valeur du champs `cmd` stocké dans POST.
 **/		
	static public function GetCMD(){
		if(empty($_POST['cmd'])){
			$_POST['cmd'] = '';
			
			if(!empty($_GET['cmd'])){
				foreach($_GET as $key => $value){
					$_POST[$key] = $value;
				}
							
			}elseif(!empty($_GET['op'])){
				$_POST['op'] = $_GET['op'];
			}elseif(!empty($_POST['op'])){
				$_POST['cmd'] = $_POST['op'];
			}
		}
		return 	@$_POST['cmd'] ? $_POST['cmd'] : '';
	}
/**
 * System.exec(command) -> int
 * - command (String): Commande à exécuter.
 *
 * Cette méthode `static` exécute une commande envoyée par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes utilisent des champs spécifiques : 
 *
 * * `system.init` : Initialise le système et renvoi les informations vers l'interface.
 * * `system.connect` : Etablie une connexion avec un utilisateur. Les champs `$_POST['Login']` et `$_POST['Password']` doivent être utilisé.
 * * `system.disconnect` : Déconnecte l'utilisateur du logiciel.
 * * `system.feed.get` : Récupère un flux RSS d'un serveur distant. Mentionnez l'addresse du flux dans `$_POST['Uri']`.
 *
 * Les commandes suivantes utilisent le champs `$_POST['meta']` : 
 *
 * * `system.metas.commit` : Enregistre les informations méta du système.
 * * `system.meta.commit` : Enregistre une information méta.
 *
 **/
	public static function exec($cmd){
		global $PM, $__ERR__;
		
		switch($cmd){
			//---------------------------------------------------------------------------
			//Gestion System-------------------------------------------------------------
			//---------------------------------------------------------------------------
			case 'system.init':
				System::iDie();				
				
				echo json_encode(self::Get());
				
				break;
				
			case 'system.db.update':
				self::Configure();
				echo "Configuration terminée";
				break;
				
			case 'system.fix.right':
				self::HasRight(1);
				self::FixRight();
				chmod(System::Path('publics'), 0751);
				chmod(System::Path('publics').'cache/', 0711);
				chmod(System::Path('self').'inc/', 0711);
				chmod(System::Path('themes').'inc/', 0711);
				chmod(System::Path('js').'inc/', 0711);
				chmod(System::Path('private'), 0700);
				
				break;
			
			//---------------------------------------------------------------------------
			// /!\ Gestion méta----------------------------------------------------------
			//---------------------------------------------------------------------------	
			case 'system.metas.commit'://enregistrement des métas depuis JS				
				foreach($_POST['meta'] as $row){
					$row->value = self::Meta($row->key, @$row->value);
				}
				
				echo json_encode($_POST['meta']);
				break;
			case 'system.meta.commit'://enregistrement du méta depuis JS
				
				$_POST['meta']->value = self::Meta($_POST['meta']->key, @$_POST['meta']->value);
				echo json_encode($_POST['meta']);
				break;
			//---------------------------------------------------------------------------
			// /!\ Gestion des flux RSS--------------------------------------------------
			//---------------------------------------------------------------------------
			case 'system.feed.get':
				echo json_encode(Stream::Feed(rawurldecode($_POST['Uri'])));
				break;
			//---------------------------------------------------------------------------
			// /!\ Gestion sauvegarde----------------------------------------------------
			//---------------------------------------------------------------------------
			case 'system.table.list':
				self::HasRight(1);
				echo json_encode(self::ShowTable());
				break;
				
			case 'system.file.import':
				return self::Import();	
							
			case 'system.file.export':
				set_time_limit(0);
				ignore_user_abort(true);
								
				$file = self::Export(ObjectTools::DecodeJSON($_POST['List']), @$_POST['Compile']);
				
				if(!$file){
					return 'system.file.export.err';	
				}
								
				echo json_encode(File::ToURI($file));
				
				break;
								
			case 'system.create.archive':
				self::HasRight(1);
				set_time_limit(0);
				ignore_user_abort(true);
				
				$datedep = microtime(true);
				
				self::Compile($_POST['options']->value, $_POST['options']->version, $_POST['options']->op);
				
				$dateret = microtime(true);
				$diff = round(($dateret - $datedep) * 100) / 100;
				
				echo "Archive créée en ". $diff ." secondes dans votre dossier \"public\".";
				
				break;
			//---------------------------------------------------------------------------
			// /!\ Gestion Application---------------------------------------------------
			//---------------------------------------------------------------------------	
			//envoi d'un rapport d'erreur vers le serveur Javalyss.	
			case 'system.crash.send':
				$crash = $_POST['CrashRepport'];
				
				echo Stream::Post(LINK_MARKET, array(
					'cmd'=> 				'depot.crash.add',
					'Name' => 				CORE_BASENAME,
					'Version' => 			CODE_VERSION.CODE_SUBVERSION,
					'CrashRepport' => 		json_encode($_POST['CrashRepport'])
				));
				
				break;
			
			//Récupération d'une page du guide utilisateur.
			case 'system.manuel.get':
				//var_dump($_POST['Man_ID']);
				//var_dump(CORE_BASENAME);
				echo Stream::Post(LINK_MARKET, array(
					'cmd'=> 				'depo.manuel.get',
					'Name' => 				CORE_BASENAME,
					'Version' => 			CODE_VERSION.CODE_SUBVERSION,
					'Man_ID' => 			$_POST['Man_ID'],
					'options' =>			json_encode($_POST['options'])
				));
				
				break;

			//---------------------------------------------------------------------------
			//Gestion du CRON------------------------------------------------------------
			//---------------------------------------------------------------------------
			case 'system.cron.start':
				self::CronStart();
				echo "start process";
				break;
				
			case 'system.cron.stop':
				Cron::Stop();
				echo "shutdown process";
				break;
				
			case 'system.cron.statut':
				if(Cron::IsStarted()){
					echo "started";
				}else{
					echo "stopped";	
				}
				break;
							
			case 'system.cron.task':
				$array = Cron::GetTask();	
				echo json_encode($array);		
				break;
			
			case 'system.cron.info':
				echo json_encode(Cron::GetInfo());
				break;
		}
		
		
		return 0;
	}
}

?>