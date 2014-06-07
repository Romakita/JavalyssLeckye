<?php
define('TABLE_APPLICATION', '`'.PRE_TABLE.'applications`');
define('TABLE_APP_USERS', '`'.PRE_TABLE.'applications_utilisateurs`');
/** section: AppsMe
 * class Application < ObjectTools
 *
 * Gestion d'application. Les applications sont gérées par la version serveur de Javalyss
 * et permettent de les publiés sur le site internet. Les développeurs peuvent ainsi créer et
 * maintenir leur application depuis le logiciel Javalyss Server. 
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_application.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 * #### Les types d'application
 *
 * Il existe deux types d'applications géré par Javalyss Server :
 *
 * * Application complète basé sur l'architecture Javalyss Leckye.
 * * Les extensions visant à apporter de nouvelles fonctionnalités aux différents logiciel.
 *
 * #### Le sub-versionning
 *
 * Le module de gestion des applications impose le système de sub-version afin de pouvoir propoger les mises
 * à jour des applications et des extensions vers une application données.
 *
 * Par définition, une application se distingue par son nom de version (unique), possède des informations sur l'auteur de l'application
 * et possède une ou plusieurs sous-version. Ce sont les sous-version qui seront déployés le cas échéant.
 *
 * 
 **/
class App extends ObjectTools implements iClass{
/**
 * App.TABLE_NAME -> String 
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APPLICATION;
/**
 * App.EXT_TABLE_NAME -> String 
 * Nom de la table externe associé à la table principale.
 **/
	const EXT_TABLE_NAME = 		TABLE_APP_USERS;
/**
 * App.PRIMARY_KEY -> String
 * Clef primaire de la table TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Application_ID';
/**
 * App.Application_ID -> Number
 * Clef primaire de l'application.
 **/
	public $Application_ID =	0;
/**
 * App.Parent_ID -> Number
 **/
	public $Parent_ID =			0;
/**
 * App.Post_ID -> Number
 **/	
	public $Post_ID =			0;
/**
 * App.Category_ID -> Number
 **/	
	public $Category_ID =		0;
/**
 * App.Application_ID -> Number
 * Identifiant de l'utilisateur propriétaire de l'application.
 **/
	public $User_ID =			0;
/**
 * App.Name -> String
 * Nom de l'application. Cette dernière doit être unique.
 **/
	public $Name =				'';
/**
 * App.Icon -> String
 **/
	public $Icon =				'';
/**
 * App.Market -> String
 **/
	public $Statut =			'publish';
/**
 * App.Price -> String
 **/
	public $Price =				0.;
/**
 * App.Author -> String
 * Auteur de l'application.
 **/
	public $Author = 			'';
/**
 * App.Author_URI -> String
 * Site internet de l'auteur.
 **/
	public $Author_URI =		'';
/**
 * App.Application_ID -> String
 * Site internet de l'application.
 **/
	public $Application_URI =	'';
/**
 * App.Date_Publication -> String
 * Date de publication de l'application.
 **/
	public $Date_Publication = 	'';
/**
 * App.Date_Publication -> String
 * Description de l'application. Cette description sera affiché sur la page principale de l'application.
 **/
	public $Description =		'';
	//virtual fields
	public $Category =			'';
	public $Nb_Downloads =		'';
	public $Version =			'';
	public $Date_Update =		'';
	public $Weight =			0;
/**
 * App.Type -> Number
 * Type de l'application. "app" pour application, "plugin" pour extension.
 **/
	public $Type =				'app';
	public $Note =				0;
	public $Nb_Note =			0;
	
	static private $VersionOptions = NULL;
/**
 * new App([mixed])
 * - mixed (array | int | Object | String): restitution du context.
 *
 * Cette méthode créée une nouvelle instance d'[[Application]].
 *
 * #### Paramètre mixed
 *
 * Le paramètre `mixed` permet de restituer le context de l'objet à partir de différente source. Si le type de `mixed` est :
 *
 * * Integer : c'est-à-dire un numéro Application_ID, alors l'objet sera reconstitué à partir de son image en base de données.
 * * String : Si la chaine est format JSON, elle sera évalué et ses attributs seront copiés dans l'instance.
 * * Array et Object : Les attributs du tableau associatif ou de l'objet seront copiés dans l'instance.
 *
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs > 0){
			if(is_numeric($arg_list[0])) {
	
				$request = 			new Request();
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY.' = '.$arg_list[0];

				$u = $request->exec('select');
				//echo $request->query;
				if($u['length'] > 0){
					$this->setArray($u[0]);
				}

			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);
		}
		
		if($this->Application_ID){
			$this->Version = Release::GetLastVersion($this->Application_ID);
			
			if($this->Version){
				$this->Date_Update	= 	$this->Version->Date_Publication;
				
				$file = str_replace(array(
					'http://javalyss.fr/server/', 
					'http://www.javalyss.fr/server/', 
					'http://server.javalyss.fr/', 
					URI_PATH
				), ABS_PATH, $this->Version->Link_Release);
				
				$file = 				new File($file);			
				$this->Weight = 		$file->size;
				$this->Version =		$this->Version->Version;
			}
			
			if(empty($this->Note)){
				$this->Note = 0;
			}	
		}
	}
	
	public static function Initialize(){
		
	}
/**
 * Application.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".TABLE_APPLICATION." (
		  `Application_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Parent_ID` int(2) NOT NULL DEFAULT '0',
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Category_ID` bigint(20) NOT NULL DEFAULT '0',
		  `User_ID` bigint(20) NOT NULL,
		  `Name` varchar(100) NOT NULL,
		  `Author` varchar(100) NOT NULL,
		  `Author_URI` text NOT NULL,
		  `Application_URI` text NOT NULL,
		  `Price` float NOT NULL DEFAULT '0',
		  `Date_Publication` datetime NOT NULL,
		  `Description` text NOT NULL,
		  `Type` varchar(30) NOT NULL DEFAULT 'app',
		  `Icon` varchar(255) NOT NULL,
		  `Statut` varchar(30) NOT NULL DEFAULT 'draft',
		  PRIMARY KEY (`Application_ID`)
		) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";
		$request->exec('query');	
		
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".TABLE_APP_USERS." (
		  `Application_ID` bigint(20) NOT NULL,
		  `User_ID` bigint(20) NOT NULL,
		  `Right` tinyint(1) NOT NULL DEFAULT '3',
		  PRIMARY KEY (`Application_ID`,`User_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');	
	
	}
/**
 * App.exec(op) -> Number
 * - op (String): Opération envoyé par l'interface.
 *
 * Cette méthode permet de traiter une opération envoyé par l'interface du logiciel.
 **/
	static function exec($op){
		global $S;
		
		switch($op){
			case 'application.commit':
				$app = new App($_POST['App']);
				
				if($app->exists()){
					echo "application.name.exists";
					return 0;	
				}
								
				if(!$app->commit()){
					return "application.commit.err";	
				}
				
				echo json_encode($app);
				break;
			
			case 'application.delete':
				$app = new App($_POST['Application']);
				if(!$app->delete()){
					return "application.delete.err";	
				}
				echo json_encode($app);
				break;
								
			case 'application.list':
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return 'application.list.err';
				}
				echo json_encode($tab);
				break;
			
			case 'application.user.commit':
				$app = 	new App((int) $_POST['Application_ID']);
				$user =	User::ByMail($_POST['EMail']);
				
				if(!$user){
					return "user.mail.err";	
				}
															
				if(!$app->commitUser($user, $_POST['Right'])){
					return "application.user.commit.err";	
				}
				
				echo 'application.user.commit';
				break;
				
			case 'application.user.delete':
				$app = new App((int) $_POST['Application_ID']);
					
				if(!$app->deleteUser($_POST['User_ID'])){
					return "application.user.delete.err";	
				}
				
				echo 'application.user.delete';
				break;
				
			case 'application.user.list':
				$app = new App((int) $_POST['Application_ID']);
				
				if(!$tab = $app->getUserList($_POST['clauses'], $_POST['options'])){
					return 'application.user.list.err';
				}
				echo json_encode($tab);
				break;
				
			case 'application.author.list':
				if(!$tab = self::Distinct('Author')){
					return "application.author.list.err";	
				}
				echo json_encode($tab);
				break;
			
			case 'application.author.uri.list':
				if(!$tab = self::Distinct('Author_URI')){
					return "application.author.uri.list.err";	
				}
				echo json_encode($tab);
				break;
			
			case 'application.uri.list':
				if(!$tab = self::Distinct('Application_URI')){
					return "application.uri.list.err";	
				}
				echo json_encode($tab);
				break;
			case 'application.name.exists':
				$application = new App($_POST['App']);
				
				json_encode($application->exists());
				break;
			
			//récupère les données complémentaires de prévisualisation
			case 'application.get.data':
				$object = new stdClass();
				//
				// Statistics
				//
				$object->ByMonth = 			ReleaseStatistic::ByMonth((int) $_POST['Application_ID']);
				$object->ByVersion = 		ReleaseStatistic::ByVersion((int) $_POST['Application_ID']);
				$object->ByLang = 			ReleaseStatistic::ByLang((int) $_POST['Application_ID']);
								
				echo json_encode($object);
				break;
			
			case 'application.picture.import':
				self::ImportPicture($_POST['Application_ID'], $_POST['Version']);				
				exit();
		}
	}
/**
 * App.commit() -> bool
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 * Elle retourne vrai quand l'enregistrement réussi.
 **/
	public function commit(){
		global $S;
				
		$request = new Request();
		
		if(is_numeric($this->Statut)){
			$this->Statut = $this->Statut == '0' ? 'draft' : 'publish';
		}
		
		if(is_numeric($this->Type)){
			$this->Type = $this->Type == '0' ? 'app' : 'plugin';
		}
		
		
		if($this->Application_ID == 0){
			$request->from = 	self::TABLE_NAME;
			$request->fields = 	'(`Parent_ID`, `User_ID`, `Category_ID`, `Name`, `Author`, `Author_URI`, `Application_URI`, `Statut`, `Price`, `Date_Publication`, `Description`, `Type`, `Icon`)';
			$request->values = 	"(
									'".((int) $this->Parent_ID)."',
									'".((int) User::Get()->getID())."',
									'".Sql::EscapeString($this->Category_ID)."',
									'".Sql::EscapeString($this->Name)."',
									'".Sql::EscapeString($this->Author)."',
									'".Sql::EscapeString($this->Author_URI)."',
									'".Sql::EscapeString($this->Application_URI)."',
									'".Sql::EscapeString($this->Statut)."',
									'0',
									CURRENT_TIMESTAMP(),
									'".Sql::EscapeString($this->Description)."',
									'".$this->Type."',
									'".Sql::EscapeString($this->Icon)."'
								)";
						
			if(!$request->exec('insert')) return false;
			
			$this->Application_ID = $request->exec('lastinsert');
			
			//creation du dossier
			self::MkDir($this->Application_ID);
			return true;
		
		}
	
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"
							`Parent_ID` = '".Sql::EscapeString($this->Parent_ID)."',
							`Category_ID` = '".Sql::EscapeString($this->Category_ID)."',
							`Name` = '".Sql::EscapeString($this->Name)."',
							`Author` = '".Sql::EscapeString($this->Author)."',
							`Author_URI` = '".Sql::EscapeString($this->Author_URI)."',
							`Application_URI` = '".Sql::EscapeString($this->Application_URI)."',
							`Statut` = '".Sql::EscapeString($this->Statut)."',
							`Description` = '".Sql::EscapeString($this->Description)."',
							`Type` = '".Sql::EscapeString($this->Type)."',
							`Icon` = '".Sql::EscapeString($this->Icon)."',
							`Price` = '".Sql::EscapeString($this->Price)."'
							";
		$request->where = 	self::PRIMARY_KEY." = '".$this->Application_ID."'";
		
		$folder = $this->path();
		
		if(!file_exists($folder)){
			self::MkDir($this->Application_ID);
		}

		return $request->exec('update');
	}
/**
 * FileManager.ImportPicture() -> void
 *
 * Cette méthode importe un élément dans le dossier `public/import/`.
 **/	
	static function ImportPicture($id, $version = ''){
		
		if(empty($id)){
			FileManager::DefaultImport();
			exit();	
		}
		
		self::MkDir($id);
		
		$app = 				new self((int) $id);
		$path = 			$app->path().'/';
		
		$folder =			$path.'pictures/';
		
		if(!empty($version)){
			$folder .= '/' . Stream::Sanitize($version).'/';
		}
		
		@Stream::MkDir($folder, 0771);
		FrameWorker::Start();
		FrameWorker::Upload($folder, 'jpg;jpeg;bmp;png;gif');				
		FrameWorker::Stop();
		exit();
	}	
/**
 * App.MkDir(applicationid) -> String
 * - applicationid (Number): Numéro d'identifiant de l'application.
 * 
 * `final` `static` `public` Cette méthode créée le répertoire de référence de l'application.
 **/
	public static function MkDir($application_id){
		$app = 				new self((int) $application_id);
		$path = 			$app->path().'/';
		
		@Stream::MkDir($path, 0711);
		@Stream::MkDir($path.'releases/', 0711);
	//	@Stream::MkDir($path.'manuels/', 0711);
		@Stream::MkDir($path.'pictures/', 0711);
		return $path;
	}
/**
 * App.path() -> String
 * 
 * Cette méthode retourne le chemin absolue du dossier de référence de l'application.
 **/
	public function path(){
		return System::Path('publics'). str_replace(' ', '', strtolower(Stream::Sanitize($this->Name, '')));
	}
/**
 * App.commitUser(user, right) -> Boolean
 * - user (User): Compte utilisateur à associer à l'application.
 * - right (int): Niveau d'accès de l'utilisateur à l'application.
 *
 * Cette méthode ajoute un utilisateur à l'application.
 **/	
	public function commitUser($user, $right){
		
		if($user->User_ID == $this->User_ID) return true;
		
		$request = 			new Request();
		$request->from = 	self::EXT_TABLE_NAME;
		$request->where = 	User::PRIMARY_KEY . ' = ' . $user->User_ID . ' AND ' . self::PRIMARY_KEY . ' = ' . $this->Application_ID;
		
		$result = $request->exec('select');
		
		if($result['length'] > 0){
			$request->set = "`Right` = '".Sql::EscapeString($right)."'";
			return $request->exec('update');
		}
		
		$request->fields = '(`Application_ID` ,`User_ID`, `Right`)';
		$request->values = '('. $this->Application_ID . ' ,' . $user->User_ID . ', '. Sql::EscapeString($right) . ')';
		
		//envoi d'un e-mail au nouveau développeur
		$owner =		User::Get();
		
		//Création du mail
		$mail = 		new Mail();
		
		$mail->setType(Mail::HTML);
		$mail->From = 	$owner->EMail;
		$mail->addRecipient($user->EMail);
		
		$mail->setSubject("Accès à l\'application : ". $this->Name);
		
		$mail->Message = '<html><title>Accès à l\'application : '. $this->Name .'</title></head>
		<body>
			<h3>Application : '. $this->Name .'</h3>
			<h4>Bonjour '.$user->Name.' '. $user->FirstName.',</h4>
			<p>Votre compte utilisateur vient d\'être associé à l\'application '. $this->Name .'</p>
			<p>Cet accès vous permettra de gérer en collaboration avec l\'auteur '. $owner->Name.' '.$owner->FirstName .' cette application depuis l\'adresse suivante : <a href="'.URI_PATH.'">'.URI_PATH.'</a></p>
			<p>&nbsp;</p>
			<p>Cordialement,</p>
			
			<p>'. $owner->Name.' '.$owner->FirstName .'</p>
		</body>
		</html>';
		
		@$mail->send();
		
		return $request->exec('insert');
	}
/**
 * App.getByName(name) -> Application
 * - name (String): Nom de l'application.
 * 
 * `final` `static` `public` Cette méthode retourne une instance application en fonction du nom.
 **/	
 	public static function ByName($name){
		return self::GetByName($name);	
	}
	
	public static function GetByName($name){
		$request = 			new Request();
		$request->select = 	'A.*, C.Title as Category, COUNT(Note) Nb_Note, SUM(Note) / COUNT(Note) Note';
		$request->from = 	self::TABLE_NAME. ' A LEFT JOIN ' . AppCategory::TABLE_NAME . ' C ON A.'.AppCategory::PRIMARY_KEY.' = C.'.AppCategory::PRIMARY_KEY;
		$request->from .= 	' LEFT JOIN ' . Release::TABLE_NAME . ' R ON A.'.self::PRIMARY_KEY.' = R.'.self::PRIMARY_KEY;
		$request->from .= 	' LEFT JOIN ' . AppComment::TABLE_NAME . ' D ON R.'.Release::PRIMARY_KEY.' = D.'.Release::PRIMARY_KEY;
		
		$request->where =	"Name like '".Sql::EscapeString($name)."'";
		
		$request->onexec = 	array('App', 'onGetList');
		
		
		$result = $request->exec('select');
			//echo $request->query;	
		if(!$result) return false;
		if($result['length'] == 0) return false;
		
		return new App($result[0]); 
	}
	
	public function uri(){
		if(class_exists('BlogPress')){
			return System::Path('uri')."adminajax/?cmd=depot.release.get&Name=" . $this->Name . "&Version=" . $this->Version;
		}
		return System::Path('uri')."gateway.safe.php?cmd=depot.release.get&Name=" . $this->Name . "&Version=" . $this->Version;	
	}
/**
 * App.exists() -> Boolean
 * 
 * Cette méthode vérifie l'existance de l'application en base de données.
 **/
	public function exists(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where =	"Name = '".Sql::EscapeString($this->Name)."' AND Application_ID != ".$this->Application_ID;
		
		$result = $request->exec('select');
		if(!$result) return false;
		
		return $result['length'] > 0;
	}
/**
 * App.Distinct(field) -> Array
 * - field (String): Champs de recherche.
 *
 * Recherche la liste distinct des mots contenu dans la colonne `field` et retourne la liste.
 **/
	public static function Distinct($field){
		global $S;
		
		$request = 			new Request();
		$request->select =	"DISTINCT ".addslashes($field)."  AS text, ".addslashes($field)." as value";
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"User_ID = ".User::Get()->getID();
		
		return $request->exec('select');
	}
/**
 * App.delete() -> bool
 *
 * Supprime l'instance en base de données.
 **/
	public function delete($options = ''){	
		$request = new Request();
		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY." = '".$this->Application_ID."'";
		
		//creation de l'archive des données
		if(@$options->backup){
			Stream::Package($this->path(), System::Path('public'). 'backup-' . Stream::Sanitize($this->Name, '-').'.zip');
		}
				
		if($request->exec('delete')){//on ne supprime pas les archives
			
			$request->from = Release::TABLE_NAME;
			$request->exec('delete');
					
			
			$request->from = self::EXT_TABLE_NAME;
			$request->exec('delete');
			
			if(@$options->remove){
				@Stream::Remove($this->path());
			}
			
			return true;
		}
				
		return false;
	}
/**
 * App.deleteUser(userid) -> bool
 *
 * Supprime l'utilisateur de l'équipe de développement.
 **/
	public function deleteUser($userid){	
		$request = new Request();
		
		$request->from = 	self::EXT_TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY." = ".$this->Application_ID." AND " . User::PRIMARY_KEY . " = " . Sql::EscapeString($userid);
		
		return $request->exec('delete');
	}
/**
 * App.getUserList() -> array
 * 
 * Cette méthode retourne une liste des utilisateurs associés à l'instance.
 **/
	public function getUserList($clauses = '', $options = ''){
		global $S;
				
		$request = new Request();
		
		$request->select = 	'*';
		$request->from = 	self::EXT_TABLE_NAME . ' AS A INNER JOIN ' . User::TABLE_NAME . ' as U ON A.'. User::PRIMARY_KEY . ' = U.'. User::PRIMARY_KEY;
		
		$request->where = 'Application_ID = '. $this->Application_ID;
		$request->order = 'Name, FirstName';
		
		switch(@$options->op){}
		
		if(isset($clauses) && $clauses != ''){
			if($clauses->where) {
								
				$request->where .= " AND ()";
				
			}
			if($clauses->order) 	$request->order = 	$clauses->order;
			if($clauses->limits) 	$request->limits = 	$clauses->limits;
		}
		
		$result = $request->exec('select', array('User', 'onGetList'));
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		//echo $request->query;
		return $result; 
		
	}
/**
 * App.GetList(clauses, options) -> array
 * - clauses (Object): Clause de restriction de la liste.
 * - options (Object): Options de construction de la liste.
 * 
 * <pre><code>Méthode static</pre></code>
 *
 * Cette méthode retourne une liste de données de la table self::TABLE_NAME.
 *
 * #### Les options
 *
 **/
	public static function GetList($clauses = '', $options = ''){
		global $S;
				
		$request = 			new Request();
		$request->select = 	'A.*, C.Title as Category';
		$request->from = 	self::TABLE_NAME. ' A LEFT JOIN ' . AppCategory::TABLE_NAME . ' C ON A.'.AppCategory::PRIMARY_KEY.' = C.'.AppCategory::PRIMARY_KEY;
		$request->where = 	' 1 ';
		$beta = '';
		
		$appOptions = System::Meta('AppsMe_Options');
		
		if(!empty($appOptions->Beta)){
			if(!empty($options->beta)){
				$beta = " OR Beta = 1";
			}
		}
		
		$request->where = 	" (A.Statut LIKE '%publish%'".$beta.")";
		$request->onexec =	 array('App', 'onGetList');
		
		switch(@$options->op){
			default:break;
			
			case "-owner"://liste des applications de l'utilisateur connecté.
				$reqUser = 			new Request();
				$reqUser->select = 	self::PRIMARY_KEY;
				$reqUser->from =	self::EXT_TABLE_NAME;
				$reqUser->where = 	User::PRIMARY_KEY . ' = '.User::Get()->getID();
				
				$request = new Request();
				
				$request->select = 	'A.*, C.Title as Category';
				$request->select .= ', COUNT(Note) Nb_Note, SUM(Note) / COUNT(Note) Note';
				
				$request->from = 	self::TABLE_NAME. ' A LEFT JOIN ' . AppCategory::TABLE_NAME . ' C ON A.'.AppCategory::PRIMARY_KEY.' = C.'.AppCategory::PRIMARY_KEY;
				$request->from .= 	' LEFT JOIN ' . Release::TABLE_NAME . ' R ON A.'.self::PRIMARY_KEY.' = R.'.self::PRIMARY_KEY;
				$request->from .= 	' LEFT JOIN ' . AppComment::TABLE_NAME . ' D ON R.'.Release::PRIMARY_KEY.' = D.'.Release::PRIMARY_KEY;
				$request->where =	'(A.User_ID = '.User::Get()->getID().' OR A.Application_ID IN  (' . $reqUser->compile('select') . '))';
				$request->order =	'Type ASC, Name ASC';
				$request->group =	'A.Application_ID';
				
				$request->onexec =  array('App', 'onGetAppsOwner');
					
				break;
			
			case '-publish'://liste des applications publiées
				
				$request->select = 	'A.Application_ID, A.Parent_ID, A.Category_ID, A.Name, A.Icon, A.Price, A.Author, A.Author_URI, A.Application_URI, A.Date_Publication, A.Description, A.Type, C.Title as Category, COUNT(Note) Nb_Note, SUM(Note) / COUNT(Note) Note';
				$request->from = 	self::TABLE_NAME. ' A LEFT JOIN ' . AppCategory::TABLE_NAME . ' C ON A.'.AppCategory::PRIMARY_KEY.' = C.'.AppCategory::PRIMARY_KEY;
				$request->from .= 	' LEFT JOIN ' . Release::TABLE_NAME . ' R ON A.'.self::PRIMARY_KEY.' = R.'.self::PRIMARY_KEY;
				$request->from .= 	' LEFT JOIN ' . AppComment::TABLE_NAME . ' D ON R.'.Release::PRIMARY_KEY.' = D.'.Release::PRIMARY_KEY;
				
				$request->where =	' (A.Statut LIKE "%publish%"'.$beta.')'; 
				$request->order =	' Name';
				$request->group =	'A.Application_ID';
				
				if(!empty($options->Name)){
					if(is_array($options->Name)){
						foreach($options->Name as $key => $value){
							$options->Name[$key] = Sql::EscapeString($value);	
						}
						
						$options->Name = implode("', '", $options->Name);
						$request->where .= " AND A.Name IN ('".$options->Name."')";
					}
					
					$options->appid = 		self::ByName($options->Name);
					$options->appid =		$options->appid->Application_ID;
					self::$VersionOptions = $options;
				}
												
				if(!empty($options->Category)){
					if(strtolower($options->Category) != 'all'){
						$request->where .= ' AND C.Title like "%'.Sql::EscapeString($options->Category).'%"';
					}
				}
				
				if(!empty($options->Type)){
					$request->where .= ' AND A.Type = "'.Sql::EscapeString($options->Type).'"';
				}
				
				break;
				
			//Liste des mises à jour disponible
			case '-update':
				
				$request->select = 	'A.Application_ID, A.Parent_ID, A.Category_ID, A.Name, A.Icon, A.Price, A.Author, A.Author_URI, A.Application_URI, A.Date_Publication, A.Description, A.Type, C.Title as Category, COUNT(Note) Nb_Note, SUM(Note) / COUNT(Note) Note';
				$request->from = 	self::TABLE_NAME. ' A LEFT JOIN ' . AppCategory::TABLE_NAME . ' C ON A.'.AppCategory::PRIMARY_KEY.' = C.'.AppCategory::PRIMARY_KEY;
				$request->from .= 	' LEFT JOIN ' . Release::TABLE_NAME . ' R ON A.'.self::PRIMARY_KEY.' = R.'.self::PRIMARY_KEY;
				$request->from .= 	' LEFT JOIN ' . AppComment::TABLE_NAME . ' D ON R.'.Release::PRIMARY_KEY.' = D.'.Release::PRIMARY_KEY;
				
				$request->where =	' (A.Statut LIKE "%publish%"'.$beta.')'; 
				
				$request->order =	' Type, Name';
				$request->group =	'A.Application_ID';
				
				if(empty($options->Apps)){
					$options->Apps = array('length' => 0);
				}
												
				array_push($options->Apps, array('Name' => $options->Name, 'Version' => $options->Version));
				
				unset($options->Apps['length']);
				unset($options->Apps['maxLength']);
				
				if(@$appOptions->Broadcast_Update_Apps == 0){
					$request->where .= 	" AND Type = 'plugin'";
				}
				
				$str = '';
				
				for($i = 0, $len = count($options->Apps); $i < $len; $i++){
					$app = $options->Apps[$i];
					
					if(is_array($app)){
						$app = new stdClass();
						$app->Name = $options->Apps[$i]['Name'];
						$app->Version = $options->Apps[$i]['Version'];
					}
					
					
					$str .= " (A.Name = '".Sql::EscapeString($app->Name)."' AND R.Version > '".Sql::EscapeString($app->Version)."')";//
					if($i < $len - 1){
						$str .= ' OR ';
					}
				} 
								
				if(!empty($str)){
					$request->where .= " AND A.Application_ID IN (
						SELECT R.Application_ID
						FROM ".Release::TABLE_NAME." R INNER JOIN ".App::TABLE_NAME." A ON A.Application_ID = R.Application_ID
						WHERE (R.Statut LIKE \"%publish%\"".$beta.")
						AND (
							" . $str . "
						)
					)";
				}
							
				break;
				
			case '-select'://liste des applications pour un champ select
				$request->select = 	'*, Name as text, Application_ID as value';
				$request->where = 	' 1 ';
				$request->order =	'Type, Name';
				 
				if(!empty($options->Statut)) $request->where .=		" AND Statut = '" . Sql::EscapeString($options->Statut)."'";
				if(!empty($options->Type)) $request->where .=		" AND Type = '" . Sql::EscapeString($options->Type)."'";
				if(!empty($options->exclude)) $request->where .=	" AND Application_ID = '" . Sql::EscapeString($options->exclude)."'";
				
				break;
				
			/*case '-c': //les applications ayants des rapports d'erreurs
				$request2 = 			new Request();
				$request2->select = 	self::PRIMARY_KEY;
				$request2->from =		CrashRepport::TABLE_NAME;
				
				$request->where .= 		' AND ' . self::PRIMARY_KEY . ' IN (' . $request2->compile('select') . ') ';
				break;
				
			case '-n':
				//$request->select = 	"A.*";
				//$request->from = 	self::TABLE_NAME . " AS A INNER JOIN " . CrashRepport::TABLE_NAME . " AS B ON A." . self::PRIMARY_KEY . "
				$request2 = 			new Request();
				$request2->select = 	self::PRIMARY_KEY;
				$request2->from =		CrashRepport::TABLE_NAME;
				$request2->where = 		"Statut = 0";
				
				$request->where .= ' AND ' . self::PRIMARY_KEY . ' IN (' . $request2->compile('select') . ') ';
				break;
				
			case '-e':
				//$request->select = 	"A.*";
				//$request->from = 	self::TABLE_NAME . " AS A INNER JOIN " . CrashRepport::TABLE_NAME . " AS B ON A." . self::PRIMARY_KEY . "
				$request2 = new Request();
				$request2->select = 	self::PRIMARY_KEY;
				$request2->from =		CrashRepport::TABLE_NAME;
				$request2->where = 		"Statut = 1";
				
				$request->where .= ' AND ' . self::PRIMARY_KEY . ' IN (' . $request2->compile('select') . ') ';
				break;
				
			case '-f':
				//$request->select = 	"A.*";
				//$request->from = 	self::TABLE_NAME . " AS A INNER JOIN " . CrashRepport::TABLE_NAME . " AS B ON A." . self::PRIMARY_KEY . "
				$request2 = new Request();
				$request2->select = 	self::PRIMARY_KEY;
				$request2->from =		CrashRepport::TABLE_NAME;
				$request2->where = 		"Statut = 2";
				
				$request->where .= ' AND ' . self::PRIMARY_KEY . ' IN (' . $request2->compile('select') . ') ';
				break;*/
				
		}		
		
		if(isset($clauses) && $clauses != ''){
			if(!empty($clauses->where)) {
								
				$request->where .= " AND (
										A.Name like '%".Sql::EscapeString($clauses->where)."%'
										OR A.Author like '%".Sql::EscapeString($clauses->where)."%'
										OR A.Author_URI like '%".Sql::EscapeString($clauses->where)."%'
										OR A.Application_URI like '%".Sql::EscapeString($clauses->where)."%'
										OR A.Description like '%".Sql::EscapeString($clauses->where)."%'
									)";
				
			}
			if(!empty($clauses->order)) 	$request->order = 	$clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = 	$clauses->limits;
		}
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
			
			if(!empty($options->default)){
				$result = array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : ('- ' . MUI('Choisissez') .' -'), 'value' => 0
				)), $result);
					
				$result['length']++;	
			}
		}
		
		//echo $request->query;
		return $result; 
		
	}
	
	static public function onGetAppsOwner(&$row){
		$request = new Request();
		$request->select = 	'`Right`';
		$request->from =	self::EXT_TABLE_NAME;
		$request->where = 	User::PRIMARY_KEY . ' = '.User::Get()->getID() . ' AND '.self::PRIMARY_KEY.' = ' .$row['Application_ID'];
		
		$result = $request->exec('select');
		
		if($result['length'] == 0) $row['Right'] = 0;
		else $row['Right'] = $result[0]['Right'];	
		
		if(!empty(self::$VersionOptions)){
			$release = new Release($row['Parent_ID']);
			
			if($release->Application_ID == self::$VersionOptions->appid){
				$row['Version'] = 	Release::GetLastVersion($row['Application_ID'], 0, @self::$VersionOptions->version);
			}else{
				$row['Version'] = 	Release::GetLastVersion($row['Application_ID']);
			}
		}else{
			$row['Version'] = 		Release::GetLastVersion($row['Application_ID']);
		}
		
		$row['Link_Release'] = 	'';
				
		if($row['Version']){
			$row['Date_Update']	= 	$row['Version']->Date_Publication;
			
			$file = str_replace(array(
				'http://javalyss.fr/server/', 
				'http://www.javalyss.fr/server/', 
				'http://server.javalyss.fr/', 
				URI_PATH
			), ABS_PATH, $row['Version']->Link_Release);
						
			$file = 				new File($file);
									
			$row['Weight'] = 		$file->size;
			$row['Release_ID'] =	$row['Version']->Release_ID;
			$row['Version'] =		$row['Version']->Version;
		}
		
		if(empty($row['Note'])){
			$row['Note'] = 0;
		}
		
		//$row['Stats'] = 	array();
		
		if(!empty($row['Release_ID'])){
			$row['Nb_Downloads'] = 			ReleaseStatistic::CountAppSingleDownload($row['Application_ID']);
		}else{
			$row['Nb_Downloads'] = 			0;
		}
		
	}
	
	static public function onGetList(&$row, &$request){
		global $S;
				
		unset($row['Right']);
		
		if(!empty(self::$VersionOptions)){
			$release = new Release($row['Parent_ID']);
			
			if($release->Application_ID == self::$VersionOptions->appid){
				$row['Version'] = 		Release::GetLastVersion($row['Application_ID'], 0, @self::$VersionOptions->version);
			}else{
				$row['Version'] = 		Release::GetLastVersion($row['Application_ID']);
			}
		}else{
			$row['Version'] = 		Release::GetLastVersion($row['Application_ID']);
		}
		
		unset($row['Link_Release']);
		
		if($row['Version']){
			$row['Date_Update']	= 	$row['Version']->Date_Publication;
			
			$file = str_replace(array(
				'http://javalyss.fr/server/', 
				'http://www.javalyss.fr/server/', 
				'http://server.javalyss.fr/', 
				URI_PATH
			), ABS_PATH, $row['Version']->Link_Release);
						
			$file = 				new File($file);
									
			$row['Weight'] = 		$file->size;
					
			$row['Release_ID'] =	$row['Version']->Release_ID;
			$row['Version'] =		$row['Version']->Version;
		}
		
		if(!empty($row['Release_ID'])){
			$row['Nb_Downloads'] = ReleaseStatistic::CountAppSingleDownload($row['Application_ID']);
		}else{
			$row['Nb_Downloads'] = 0;	
		}
		
		if(empty($row['Note'])){
			$row['Note'] = 0;
		}
	}
}
?>