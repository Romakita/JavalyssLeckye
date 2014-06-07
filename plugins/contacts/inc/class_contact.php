<?php
/** section: Contact
 * class Contact 
 * includes ObjectTools
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_contact.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_CONTACTS', PRE_TABLE.'contacts');

include('class_contact_io.php');

class Contact extends ContactIO implements iClass, iPlugin, iSearch{
	const PRE_OP =				'contact.';
/**
 * Contact.TABLE_NAME -> String 
 * Name de la table gérée par la classe.
 **/	
	const TABLE_NAME =			TABLE_CONTACTS;
/**
 * Contact.PRIMARY_KEY -> String
 * Clef primaire de la table TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY =			'Contact_ID';
/**
 * Contact#Contact_ID -> Number
 **/
	public $Contact_ID =		0; 
/**
 * Contact#Avatar -> String
 **/
	public $Avatar =			'';
/**
 * Contact#Avatar -> String
 **/
	public $Avatar_LD =			'';
/**
 * Contact#Civility -> String
 **/
	public $Civility =			'';
/**
 * Contact#FirstName -> String
 **/
	public $FirstName =			'';
/**
 * Contact#Name -> String
 **/	
	public $Name =				''; 
/**
 * Contact#Company -> String
 **/	
	public $Company =			''; 
/**
 * Contact#Company -> String
 **/	
	public $Categories =		'';
/**
 * Contact#Address -> String
 **/	  	  	 
	public $Address =			'';
/**
 * Contact#CP -> String
 **/	  	 
	public $CP =				'';	  	 
/**
 * Contact#City -> String
 **/ 	 
	public $City =				'';
/**
 * Contact#County -> String
 **/ 	 
	public $County =			'';
/**
 * Contact#State -> String
 **/ 	 
	public $State =				'';	
/**
 * Contact#Country -> String
 **/ 	 
	public $Country =			'';
/**
 * Contact#Phone -> String
 **/  	  	 
	public $Phone =				'';	
/**
 * Contact#Email -> String
 **/	  	  	 
	public $Email =				''; 
/**
 * Contact#Web -> String
 **/	  	  	 
	public $Web =				'';
/**
 * Contact#Comment -> String
 **/	  	  	 
	public $Comment =			'';
	
	public $Medias =			NULL;
/**
 * new Contact()
 * new Contact(json)
 * new Contact(array)
 * new Contact(obj)
 * new Contact(societeid)
 * - json (String): Chaine de caractère JSON équivalent à une instance [[Contact]].
 * - array (Array): Tableau associatif équivalent à une instance [[Contact]]. 
 * - obj (Object): Objet équivalent à une instance [[Contact]].
 * - societeid (int): Numéro d'identifiant d'une société. Les informations de la société seront récupérés depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Contact]].
 *
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request(DB_NAME);
				
				$request->select =	self::TABLE_NAME.'.*, SUBSTR(Name, 1, 1) as Letter, CONCAT(Name, " ", FirstName) as text, Contact_ID as value';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY . ' = ' . (int) $arg_list[0];
				$request->onexec = 	array('Contact', 'onGetList');
				
				System::Fire('contact:list', array(&$request));
				
				$u = $request->exec('select');
				
				if($u){
					if($u['length']> 0){
						$this->extend($u[0]);
					}
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
		
		if(self::IsJSON($this->Phone)){
			$this->Phone = json_decode($this->Phone);
		}
		
		if(self::IsJSON($this->Email)){
			$this->Email = json_decode($this->Email);
		}
		
		if(self::IsJSON($this->Web)){
			$this->Web = json_decode($this->Web);
		}
	}
/**
 * Contact.Initialize() -> void
 **/	
	static public function Initialize(){
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('plugin.active', array(__CLASS__,'Install')); 
		System::observe('plugin.deactive', array(__CLASS__,'Deactive'));
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		System::Observe('system.search', array(__CLASS__, 'Search'));
		System::Observe('system.search.mail', array(__CLASS__, 'SearchMail'));
		
		System::EnqueueScript('contact', Plugin::Uri().'js/contact.js');
		System::EnqueueScript('contact.import', Plugin::Uri().'js/contact_import.js');
		System::EnqueueScript('contact.export', Plugin::Uri().'js/contact_export.js');
		
		System::AddCss(Plugin::Uri().'css/contacts.css');
			
	}
/**
 * Contact.Install() -> void
 **/	
	static public function Install(){
		$request = new Request();
		
		$request->query = "CREATE TABLE IF NOT EXISTS `".TABLE_CONTACTS."` (
		  `Contact_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Name` varchar(100) NOT NULL,
		  `FirstName` varchar(100) NOT NULL,
		  `Company` varchar(100) NOT NULL,
		  `Email` TEXT,
		  `Phone` TEXT,
		  `Address` TEXT NOT NULL DEFAULT '',
		  `CP` VARCHAR( 10 ) NULL DEFAULT '',
		  `City` VARCHAR( 100 ) NULL DEFAULT '',
		  `Country` VARCHAR( 100 ) NULL DEFAULT '',
		  `Avatar` varchar(255) NOT NULL DEFAULT '',
		  `Categories` TEXT,
		  `Web` TEXT,
		  `Comment` LONGTEXT,
		  PRIMARY KEY (`Contact_ID`)		  
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` CHANGE `Phone` `Phone` TEXT NOT NULL ";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` CHANGE `Web` `Web` TEXT NOT NULL ";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` CHANGE `Email` `Email` TEXT NOT NULL ";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` ADD `Categories` TEXT NOT NULL DEFAULT  ''";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` ADD `Civility` VARCHAR(30) NOT NULL DEFAULT  ''";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` CHANGE `Comment` `Comment` LONGTEXT";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CONTACTS."` CHANGE `Address` `Address` TEXT NOT NULL DEFAULT ''";
		$request->exec('query');
		
		ContactMedia::Install();
		
		if(method_exists('Market', 'RequireApp')){
			Market::RequireApp('Google Map JS');
		}
	}
/**
 * Contact.Uninstall() -> void
 **/
 	public static function Uninstall($erase = false){
		if($erase){
			$request = new Request();
			
			$request->from(self::TABLE_NAME)->exec('drop');
			$request->from(ContactMedia::TABLE_NAME)->exec('drop');
			
		}
	}
/**
 * Contact#commit() -> Boolean
 *
 * Cette méthode ajoute une société si ce dernier n'existe pas ou enregistre les informations en base de données dans le cas contraire.
 * Cette méthode retourne vrai si la mise à jour des données réussi.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Contact_ID == 0){
			
				$request->fields = 	"`Civility`, `FirstName`, `Name`, `Company`, `Address`, `CP`, `City`, `Country`, `Phone`, `Email`, `Web`, `Comment`, `Avatar`, `Categories`";
				$request->values = 	"'".Sql::EscapeString($this->Civility)."', 
										'".Sql::EscapeString($this->FirstName)."',  
										'".Sql::EscapeString($this->Name)."',
										'".Sql::EscapeString($this->Company)."',
										'".Sql::EscapeString($this->Address)."', 
										'".Sql::EscapeString($this->CP)."', 
										'".Sql::EscapeString($this->City)."',
										'".Sql::EscapeString($this->Country)."', 
										'".Sql::EscapeString($this->Phone)."',
										'".Sql::EscapeString($this->Email)."',
										'".Sql::EscapeString($this->Web)."',
										'".Sql::EscapeString($this->Comment)."',
										'".Sql::EscapeString($this->Avatar)."',
										'".Sql::EscapeString($this->Categories)."'";
			
			System::Fire('contact:commit', array(&$this, &$request));

			if($request->exec('insert')){
				$this->Contact_ID = $request->exec('lastinsert');
				
				System::Fire('contact:commit.complete', array(&$this));
				
				$this->setMedias();
				
				return true;	
			}
						
			//echo $request->query;
			return false;
		}
		
		$request->where = 	self::PRIMARY_KEY . " = " . $this->Contact_ID;
		$request->set = 	"	`Civility` = '".Sql::EscapeString($this->Civility)."',  
								`FirstName` = '".Sql::EscapeString($this->FirstName)."',  
								`Name` = '".Sql::EscapeString($this->Name)."',  
								`Company` = '".Sql::EscapeString($this->Company)."',
								`Address` = '".Sql::EscapeString($this->Address)."', 
								`CP` =	'".Sql::EscapeString($this->CP)."', 
								`City` = '".Sql::EscapeString($this->City)."',
								`Country` =	'".Sql::EscapeString($this->Country)."',
								`Phone` =	'".Sql::EscapeString($this->Phone)."',
								`Email` = '".Sql::EscapeString($this->Email)."', 
								`Web` = '".Sql::EscapeString($this->Web)."', 
								`Comment` =	'".Sql::EscapeString($this->Comment)."', 
								`Avatar` =	'".Sql::EscapeString($this->Avatar)."', 
								`Categories` =	'".Sql::EscapeString($this->Categories)."'";
								
		System::Fire('contact:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('contact:commit.complete', array(&$this));
			
			$this->setMedias();
			
			return true;	
		}
		
		return false;
	}
/**
 * Contact#setMedia() -> void
 *
 * Cette méthode enregistre les médias liés au contact.
 **/	
	public function setMedias(){
		if(!is_array($this->Medias)){
			return;	
		}
		
		$array = array();
		$list =	array();
		
		foreach($this->Medias as $media){
			
			$media = new ContactMedia($media);
			$media->Contact_ID = $this->Contact_ID;
			
			$media->commit();
			
			array_push($array, $media->Media_ID);
			array_push($list, $media);
		}
		
		$this->Medias = $list;
		
		$request = new Request();
		$request->from = 	ContactMedia::TABLE_NAME;
		$request->where = 	ContactMedia::PRIMARY_KEY.' NOT IN(' . implode(',', $array) .') AND '.Contact::PRIMARY_KEY.' = ' . $this->Contact_ID;
		
		$request->exec('delete');	
	}
/**
 * Contact.ByMail(mail [, pseudo]) -> User
 * - mail (String): Address e-mail du compte recherché.
 * - pseudo (String): Pseudo du compte recherché.
 *
 * `static` Cette méthode recherche un utilisateur ayant la même adresse e-mail que le paramètre `mail`.
 * La méthode retourne une instance [[User]] si le compte existe, `false` dans le cas contraire.
 **/
 	public function ByMail($mail){
		$request = new Request(DB_NAME);
		
		$request->select = 	'*';	
		$request->from = 	self::TABLE_NAME;
		$request->where =	"Email = '".Sql::EscapeString($mail)."'";
		//print $request->compile('select');
		$u = $request->exec('select');
		
		return $u['length'] == 0 ? false : new self($u[0]);
	}
/**
 * Contact.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP . 'avatar.import':
				self::ImportAvatar();
				break;
							
			case self::PRE_OP . 'db.configure':
			case self::PRE_OP . 'db.update':
				self::Install();
				echo "Base configurée";
				break;
			case self::PRE_OP . 'add':
				
				break;
				
			case self::PRE_OP."commit":
				$o = 	new self($_POST[__CLASS__]);
								
				if(!$o->commit()){
					return $op.'.err';
				}
				
				echo $o->toJSON();
				break;
				
			case self::PRE_OP."delete":
				$o = 	new self($_POST[__CLASS__]);
								
				if(!$o->delete()){
					return $op.'.err';
				}
				
				echo $o->toJSON();
				break;
								
			case self::PRE_OP."list":
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
						 
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return $op.'.err';
				}
				
				echo json_encode($tab);
				break;
			
			
			case self::PRE_OP."get.data"://Importe le fichier de données et l'analyse.
				self::GetDataFromImportedFile();
				break;
			
			case self::PRE_OP."import"://importe les données du fichier
				set_time_limit(0);
				ignore_user_abort(true);
				
				echo json_encode(self::ImportFile($_POST['options']));
				break;
			
			case self::PRE_OP.'export':
				
				FrameWorker::Start();
				$file = self::Export($_POST['options']);
				FrameWorker::Stop(File::ToURI($file));
				break;
				
		}
		
		return 0;	
	}
/**
 * Contact.execSafe(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * Contact#delete() -> Boolean
 *
 * Cette méthode supprime le contact de la base données.
 **/
	public function delete(){
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY . " = " . $this->Contact_ID;
		
		if($request->exec('delete')){
			System::Fire('contact:remove', array(&$this));
			
			$request->from = ContactMedia::TABLE_NAME;
			$request->exec('delete');
			
			return true;
		}
		
		return false;
	}
/**
 * Contact#havePhoneNumber() -> Boolean
 *
 * Cette méthode indique si le contact à un numéro de téléphone.
 **/	
	public function havePhoneNumber(){
		
		$this->Phone = is_object($this->Phone) ? $this->Phone : json_decode($this->Phone);
		
		if(!empty($this->Phone->other)){
			return true;	
		}
		
		if(!empty($this->Phone->office)){
			return true;	
		}
		
		if(!empty($this->Phone->mobile)){
			return true;	
		}
		
		if(!empty($this->Phone->home)){
			return true;	
		}
		
		return false;
	}
/**
 * Contact#haveMail() -> Boolean
 *
 * Cette méthode indique si le contact à un numéro de téléphone.
 **/	
	public function haveMail(){
		
		$this->Email = is_object($this->Email) ? $this->Email : json_decode($this->Email);
		
		if(!empty($this->Email->other)){
			return true;	
		}
		
		if(!empty($this->Email->office)){
			return true;	
		}
		
		if(!empty($this->Email->home)){
			return true;	
		}
		
		return false;
	}
/**
 * Contact#getFunction() -> String
 *
 * Cette méthode retourne la fonction qu'occupe le contact dans son entreprise.
 **/	
	public function getCategoriesName(){
		$categories = array();
		
		for($i = 0; $i < count($this->Categories); $i++){
			
			$c = $this->Categories[$i];
			
			if($c == 'all') continue;
			
			$c = Contact::GetCategory($c);
			
			if(!empty($c)){
				array_push($categories, $c);	
			}
			
		}
		
		return $categories;
	}
/**
 * Contact#getFunction() -> String
 *
 * Cette méthode retourne la fonction qu'occupe le contact dans son entreprise.
 **/	
	public function getFunction(){
		$this->Comment = is_object($this->Comment) ? $this->Comment : json_decode($this->Comment);
		
		return empty($this->Comment->function) ? '' : $this->Comment->function;
	}
/**
 * Contact#getService() -> String
 *
 * Cette méthode retourne le service du contact.
 **/	
	public function getService(){
		$this->Comment = is_object($this->Comment) ? $this->Comment : json_decode($this->Comment);
		
		return empty($this->Comment->service) ? '' : $this->Comment->service;
	}
/**
 * Contact#getRemarque() -> String
 *
 * Cette méthode retourne les remarques liées au contact.
 **/	
	public function getRemarque(){
		$this->Comment = is_object($this->Comment) ? $this->Comment : json_decode($this->Comment);
		
		return empty($this->Comment->remarque) ? '' : $this->Comment->remarque;
	}
/**
 * Contact#getSector() -> String
 *
 * Cette méthode retourne le secteur d'activité du contact.
 **/	
	public function getSector(){
		$this->Comment = is_object($this->Comment) ? $this->Comment : json_decode($this->Comment);
		
		return empty($this->Comment->sector) ? '' : $this->Comment->sector;
	}
/**
 * Contact.ImportAvatar() -> Boolean
 *
 * Cette méthode importe un avatar.
 **/	
	public static function ImportAvatar(){
		
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'contacts/';
		@Stream::MkDir($folder, 0775);
		FrameWorker::Start();
		
		$file = FrameWorker::Upload($folder, 'jpg;jpeg;png;gif;bmp;');
		//récupération du fichier
		$file = SystemCache::Push(array(
			'Src' => 	$file,
			'Width' =>	300,
			'Height' => 300,
			'ID' => 	basename($file) . '-300x300'
		));
				
		FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $file));
	}
/**
 * Contact.Count() -> Number
 *
 * Cette méthode compte le nombre d'élement dans la table. 
 **/
	public static function Count($clauses = ''){
		$request = 			new Request(DB_NAME);
				
		$request->select = 	'COUNT(*) NB';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 ';
		$request->order =	'Nom ASC';
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (
					Name like '%". Sql::EscapeString($clauses->where) . "%'
					OR FirstName like '%". Sql::EscapeString($clauses->where) . "%'
					OR Company like '%". Sql::EscapeString($clauses->where) . "%'
					OR Address like '%". Sql::EscapeString($clauses->where) . "%'
					OR CP like '%". Sql::EscapeString($clauses->where) . "%'
					OR City like '%". Sql::EscapeString($clauses->where) . "%'
					OR Country like '%". Sql::EscapeString($clauses->where) . "%'
					OR Phone like '%". Sql::EscapeString($clauses->where) . "%'
					OR Email like '%". Sql::EscapeString($clauses->where) . "%'
					OR Comment like '%". Sql::EscapeString($clauses->where) . "%'
				)";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			return 0;
		}
		
		return $result[0]['NB'] * 1;
	}
/**
 * Contact.Search(word) -> void
 **/	
	public static function Search($word){
		
		if(!Plugin::HaveAccess('Contacts')){
			return;
		}
		
		$clauses = new stdClass();
		$clauses->where = $word;
		
		$result = self::GetList($clauses);
		
		for($i = 0; $i < $result['length']; $i++){
			
			$obj = new IntelliSearch($result[$i]);
			
			$obj->onClick('System.Contact.openFromSearch');
			
			$obj->setIcon($result[$i]['Avatar'] == '' ? 'contact-empty' : $result[$i]['Avatar']);
			
			$obj->setAppIcon('contacts');
			$obj->setAppName(MUI('Contacts'));
			
			IntelliSearch::Add($obj);
		}
	}
/**
 * Contact.SearchMail(word) -> void
 **/	
	public static function SearchMail($word){
		
		if(!Plugin::HaveAccess('Contacts')){
			return;
		}
		
		$clauses = new stdClass();
		$clauses->where = $word;
		$options = new stdClass();
		$options->op = '-mail';
		
		$result = self::GetList($clauses, $options);
		
		for($i = 0; $i < $result['length']; $i++){
			
			$obj = new SystemSearch($result[$i]);
			$obj->setIcon(empty($result[$i]['Avatar_LD']) ? 'men-48' : $result[$i]['Avatar_LD']);
			
			SystemSearch::Add($obj);
		}
	}
/**
 * Contact.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des sociétés du logiciel en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * Pas d'options.
 *
 **/	
	public static function GetList($clauses = '', $options = ''){
				
		$request = 			new Request(DB_NAME);
		$request->select =	self::TABLE_NAME.'.*, SUBSTR(Name, 1, 1) as Letter, CONCAT(Name, " ", FirstName) as text, Contact_ID as value';
		
		
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 ';
		$request->order =	'TRIM(CONCAT(Name , \' \', FirstName))  ASC';
		$request->observe(array('Contact', 'onGetList'));
		
		if(isset($options->category)){
			$options->Category = $options->category;
		}
		
		if(!empty($options->Category)){
			if(is_string($options->Category)){
				$options->Category = explode(';', $options->Category);
			}
			
			//array_push($options->category, 'all');
			
			$request->where = ' (Categories LIKE "%' . implode('%" OR Categories LIKE "%', $options->Category) . '%" OR Categories = "")';
			
		}
		
		switch(@$options->op){
			default:
				
				if(isset($options->word)){
					//$request->select = 	'*, SUBSTR(Name, 1, 1) as Letter, CONCAT(Name, " ", FirstName) as text, Contact_ID as value';
					
					if(!is_object($clauses)){
						$clauses = new stdClass();
					}
					
					$clauses->where = $options->word;
					
				}
			
				break;
			
			case '-select':
				$request->select =	self::TABLE_NAME.'.*, CONCAT(Name, " ", FirstName) as text, Contact_ID as value';
				break;
				
			case '-completer':
				
				$request->select =	self::TABLE_NAME.'.*, CONCAT(Name, " ", FirstName) as text, Contact_ID as value';
				
				$request->where .= " 	AND (
					".self::TABLE_NAME .".Name like '%". Sql::EscapeString($options->word) . "%'
					OR ".self::TABLE_NAME .".FirstName like '%". Sql::EscapeString($options->word) . "%'
					OR CONCAT(".self::TABLE_NAME .".Name, ' ', ".self::TABLE_NAME .".FirstName) LIKE '%". Sql::EscapeString(str_replace(array(', ', '- '), ' ', $options->word)) . "%'
					OR CONCAT(".self::TABLE_NAME .".FirstName, ' ', ".self::TABLE_NAME .".Name) LIKE '%". Sql::EscapeString(str_replace(array(', ', '- '), ' ', $options->word)) . "%'
				)";
				
				break;
				
			case '-mail':
				
				$request->onexec = 	'';
				$request->select = 	self::TABLE_NAME.'.*, CONCAT(Name, " ", FirstName) as text, Email as value';
				$request->where =	"Email != '' AND Email != '{}'";
									
				$request->observe(array(__CLASS__, 'onGetListMail'));
				
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (
					".self::TABLE_NAME .".Name like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".FirstName like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".Company like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".Address like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".CP like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".City like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".Country like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".Phone like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".Email like '%". Sql::EscapeString($clauses->where) . "%'
					OR ".self::TABLE_NAME .".Comment like '%". Sql::EscapeString($clauses->where) . "%'
					OR CONCAT(".self::TABLE_NAME .".Name, ' ', ".self::TABLE_NAME .".FirstName) LIKE '%". Sql::EscapeString(str_replace(array(', ', '- '), ' ', $clauses->where)) . "%'
					OR CONCAT(".self::TABLE_NAME .".FirstName, ' ', ".self::TABLE_NAME .".Name) LIKE '%". Sql::EscapeString(str_replace(array(', ', '- '), ' ', $clauses->where)) . "%'
				)";
				
			}
			if(!empty($clauses->order)) 	$request->order = 	$clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = 	$clauses->limits;
		}
		
		System::Fire('contact:list', array(&$request, $options));
		
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
			
			if(!empty($options->default)){
				$result = array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : MUI('Choisissez'), 'value' => 0
				)), $result);
					
				$result['length']++;	
			}
		}
		
		return $result;
	}
/*
 *
 **/	
	public static function onGetList(&$row, &$request){
		$options = new stdClass();
		$options->Contact_ID = $row['Contact_ID'];
		$row['Medias'] = ContactMedia::GetList($options, $options);
		
		$row['Avatar_LD'] = SystemCache::Push(array(
			'Src' => 	$row['Avatar'],
			'Width' =>	70,
			'Height' => 70,
			'ID' => 	basename($row['Avatar']) . '-70x70'
		));
		
		if(empty($row['Avatar_LD'])){
			$row['Avatar_LD'] = '';	
		}
		
	}
/*
 *
 **/	
	public static function onGetListMail(&$row, &$request){
		$o = new self($row);
		$nbMail = 0;
		
		foreach($o->Email as $mail){
			$nbMail++;
		}
				
		if($nbMail == 1){
			
			foreach($o->Email as $mail){
				$row['value'] =  $mail;
			}
			
		}else{
			$i = 0;	
			foreach($o->Email as $key => $mail){
				$c = new self($o);
				$c->value = $mail;
				$c->text .=  ' (' . self::$LABELS[$key]. ')';
				
				if($nbMail == $i + 1){
					$row['value'] =  $mail;
					$row['text'] .=  ' (' . self::$LABELS[$key]. ')';	
				}else{
					
					$request[] = $c->toArray();
				
				}
				
				$i++;
			}
			
		}
	}
/**
 * Contact.AddCategory(title, value) -> void
 **/	
	static function AddCategory($name, $value = ''){
		$name = trim($name);
		
		if(empty($name)){
			return;
		}
		
		if(empty($value)){
			$value = $name;	
		}
			
		$value = strtolower(trim($value));
		$array = System::Meta('CONTACTS_CATEGORIES');
		
		if(empty($array)){
			$o = new stdClass();
			$o->value = 'all';
			$o->text = 	'Toutes catégories';
			
			$array = array($o);
		}
		
		for($i = 0; $i < count($array); $i++){
			if(strtolower(trim($array[$i]->value)) == $value){
				return true;
			}
		}
		
		$o = new stdClass();
		$o->value = $value;
		$o->text = 	$name;
		
		array_push($array, $o);
		usort($array, array(__CLASS__, 'onSort'));
				
		System::Meta('CONTACTS_CATEGORIES', $array);

	}
/**
 * Contact.getCategory(value) -> String
 **/	
	static function getCategory($value){
		$array = self::getCategories();
		
		for($i = 0; $i < count($array); $i++){
			if(strtolower(trim($array[$i]->value)) == $value){
				return $array[$i]->text;
			}
		}
		
		return '';
	}
/**
 * Contact.getCategories() -> Array
 **/	
	static function getCategories(){
		$array = System::Meta('CONTACTS_CATEGORIES');
		
		if(empty($array)){
			$o = new stdClass();
			$o->value = 'all';
			$o->text = 	'Toutes catégories';
			
			$array = array($o);
		}
		
		return $array;
	}
	
	public static function onSort($a, $b){
		return strcmp(basename($a->text), basename($b->text));
	}
}

Contact::Initialize();
?>