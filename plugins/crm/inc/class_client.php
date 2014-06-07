<?php
/** section: CRM
 * class CRMClient < CRMClientIO
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
define('TABLE_CRM_CLIENTS', PRE_TABLE.'crm_clients');
include('class_client_io.php');

class CRMClient extends CRMClientIO implements iClass, iSearch{
	const PRE_OP =				'crm.client.';
/**
 * CRMClient.TABLE_NAME -> String 
 * Name de la table gérée par la classe.
 **/	
	const TABLE_NAME =			TABLE_CRM_CLIENTS;
/**
 * CRMClient.PRIMARY_KEY -> String
 * Clef primaire de la table TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY =			'Client_ID';
/**
 * CRMClient#Client_ID -> Number
 **/
	public $Client_ID = 0;
/**
 * CRMClient#Company -> String
 * Varchar
 **/
	public $Company = "";
/**
 * CRMClient#CompanyName -> String
 * Varchar
 **/
	public $CompanyName = "";
/**
 * CRMClient#Email -> String
 * Varchar
 **/
	public $Email = "";
/**
 * CRMClient#Phone -> String
 * Varchar
 **/
	public $Phone = "";
/**
 * CRMClient#Fax -> String
 * Varchar
 **/
	public $Fax = "";
/**
 * CRMClient#Address -> String
 * Varchar
 **/
	public $Address = "";
/**
 * CRMClient#CP -> String
 * Varchar
 **/
	public $CP = "";
/**
 * CRMClient#City -> String
 * Varchar
 **/
	public $City = "";
/**
 * CRMClient#Country -> String
 * Varchar
 **/
	public $Country = "";
/**
 * CRMClient#Categories -> String
 * Text
 **/
	public $Categories = "";
/**
 * CRMClient#Web -> String
 * Text
 **/
	public $Web = "";
/**
 * CRMClient#Comment -> String
 * Longtext
 **/
	public $Comment = "";
/**
 * CRMClient#Date_Create -> String
 * Longtext
 **/	
	public $Date_Create = '0000-00-00 00:00:00';
	
	public $Medias =			NULL;
/**
 * new CRMClient()
 * new CRMClient(json)
 * new CRMClient(array)
 * new CRMClient(obj)
 * new CRMClient(societeid)
 * - json (String): Chaine de caractère JSON équivalent à une instance [[CRMClient]].
 * - array (Array): Tableau associatif équivalent à une instance [[CRMClient]]. 
 * - obj (Object): Objet équivalent à une instance [[CRMClient]].
 * - societeid (int): Numéro d'identifiant d'une société. Les informations de la société seront récupérés depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[CRMClient]].
 *
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request(DB_NAME);
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY . ' = ' . (int) $arg_list[0];
				$request->onexec = 	array(__CLASS__, 'onGetList');
				
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
	
	static public function Initialize(){
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('system.search', array(__CLASS__, 'Search'));
		System::Observe('system.search.mail', array(__CLASS__, 'SearchMail'));
	}
	
	static public function Install(){
		$request = new Request();
		
		$request->query = "CREATE TABLE IF NOT EXISTS `".TABLE_CRM_CLIENTS."` (
		  `Client_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Company` varchar(100) NOT NULL,
		  `CompanyName` varchar(100) NOT NULL,
		  `Email` varchar(255) NOT NULL,
		  `Phone` varchar(30) NOT NULL,
		  `Fax` varchar(30) NOT NULL,
		  `Address` TEXT NOT NULL DEFAULT '',
		  `CP` VARCHAR( 10 ) NULL DEFAULT '',
		  `City` VARCHAR( 100 ) NULL DEFAULT '',
		  `Country` VARCHAR( 100 ) NULL DEFAULT '',
		  `Categories` TEXT NOT NULL DEFAULT  '',
		  `Web`  TEXT NOT NULL,
		  `Comment` LONGTEXT,
		  PRIMARY KEY (`Client_ID`)		  
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".TABLE_CRM_CLIENTS."` ADD `Date_Create` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' AFTER `Comment` ";
		$request->exec('query');
				
	}
/**
 * CRMClient#commit() -> Boolean
 *
 * Cette méthode ajoute une société si ce dernier n'existe pas ou enregistre les informations en base de données dans le cas contraire.
 * Cette méthode retourne vrai si la mise à jour des données réussi.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Client_ID == 0){
			
			$request->fields = 	"`Company`,
								`CompanyName`,
								`Email`,
								`Phone`,
								`Fax`,
								`Address`,
								`CP`,
								`City`,
								`Country`,
								`Categories`,
								`Web`,
								`Comment`";
			$request->values = 	"'".Sql::EscapeString($this->Company)."',
								'".Sql::EscapeString($this->CompanyName)."',
								'".Sql::EscapeString($this->Email)."',
								'".Sql::EscapeString($this->Phone)."',
								'".Sql::EscapeString($this->Fax)."',
								'".Sql::EscapeString($this->Address)."',
								'".Sql::EscapeString($this->CP)."',
								'".Sql::EscapeString($this->City)."',
								'".Sql::EscapeString($this->Country)."',
								'".Sql::EscapeString($this->Categories)."',
								'".Sql::EscapeString($this->Web)."',
								'".Sql::EscapeString($this->Comment)."'";
			
			System::Fire('crm.client:commit', array(&$this, &$request));

			if($request->exec('insert')){
				$this->Client_ID = $request->exec('lastinsert');
				
				System::Fire('crm.client:commit.complete', array(&$this));
				
				$this->setMedias();
				
				return true;	
			}
						
			//echo $request->query;
			return false;
		}
		
		$request->where = 	self::PRIMARY_KEY . " = " . $this->Client_ID;
		$request->set = 	"`Company` = '".Sql::EscapeString($this->Company)."',
								`CompanyName` = '".Sql::EscapeString($this->CompanyName)."',
								`Email` = '".Sql::EscapeString($this->Email)."',
								`Phone` = '".Sql::EscapeString($this->Phone)."',
								`Fax` = '".Sql::EscapeString($this->Fax)."',
								`Address` = '".Sql::EscapeString($this->Address)."',
								`CP` = '".Sql::EscapeString($this->CP)."',
								`City` = '".Sql::EscapeString($this->City)."',
								`Country` = '".Sql::EscapeString($this->Country)."',
								`Categories` = '".Sql::EscapeString($this->Categories)."',
								`Web` = '".Sql::EscapeString($this->Web)."',
								`Comment` = '".Sql::EscapeString($this->Comment)."'";
								
		System::Fire('crm.client:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('crm.client:commit.complete', array(&$this));
			
			$this->setMedias();
			
			return true;	
		}
		
		return false;
	}
/**
 * CRMClient#setMedia() -> void
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
			if (is_object($media)){
				$media = new CRMClientMedia($media);
				$media->Client_ID = $this->Client_ID;
				
				$media->commit();
				
				array_push($array, $media->Media_ID);
				array_push($list, $media);
			}
		}
		
		$this->Medias = $list;
		
		$request = new Request();
		$request->from = 	CRMClientMedia::TABLE_NAME;
		$request->where = 	CRMClientMedia::PRIMARY_KEY.' NOT IN(' . implode(',', $array) .') AND '.CRMClient::PRIMARY_KEY.' = ' . $this->Client_ID;
		
		$request->exec('delete');	
	}
/**
 * CRMClient.ByMail(mail [, pseudo]) -> User
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
		
		return $u['length'] == 0 ? false : new Company($u[0]);
	}
	
	public function getCategoriesName(){
		$categories = array();
		
		for($i = 0; $i < count($this->Categories); $i++){
			
			$c = $this->Categories[$i];
			
			if($c == 'all') continue;
			
			$c = CRMPlugin::GetCategory($c);
			
			if(!empty($c)){
				array_push($categories, $c);	
			}
			
		}
		
		return $categories;
	}
/**
 * CRMClient.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."get":
				echo json_encode(new self($_POST[self::PRIMARY_KEY]));//récupération des données manquantes
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
		
			case self::PRE_OP."statistics":
				echo json_encode(self::Statistics());
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
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['clauses'])){
						$_POST['clauses']->where = 	$_POST['word'];
					}else{
						$_POST['clauses'] = new stdClass();
						$_POST['clauses']->where = 	$_POST['word'];
					}
					
					if(!empty($_POST['clauses']->limits)){
						$_POST['clauses']->limits = explode(',', $_POST['clauses']->limits);
						$_POST['clauses']->limits = '0,'.$_POST['clauses']->limits[1];
					}
				}
						 
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return $op.'.err';
				}
				
				echo json_encode($tab);
				break;
				
			case self::PRE_OP."model.get":
				$o = new ModelPDF(CRM_PATH . 'models/prints/clients/', System::Path('self'));
				
				echo json_encode($o->getList());
				break;
				
			case self::PRE_OP."model.list.get":
				$o = new ModelPDF(CRM_PATH . 'models/prints/listing/clients/', System::Path('self'));
				
				echo json_encode($o->getList());
				break;	
			
			case self::PRE_OP."get.data":
				self::GetDataFromImportedFile();
				break;
			
			case self::PRE_OP."import":
				set_time_limit(0);
				ignore_user_abort();
				
				echo json_encode(self::ImportFile($_POST['options']));
				break;
				
			case self::PRE_OP."print":
				$o = new self($_POST[__CLASS__]);
				
				if(!$link = $o->printPDF($_POST['options'])){
					return $op.".err";	
				}
				
				echo json_encode($link);
				break;
			
			case self::PRE_OP."list.print":
				
				$link = self::PrintList($_POST['clauses'], $_POST["options"]);
				
				if(!$link){
					return $op.'.err';	
				}
				
				echo json_encode($link);
				
				break;
				
			case self::PRE_OP.'export':
				
				FrameWorker::Start();
				$file = self::Export($_POST['clauses'], $_POST['options']);
				FrameWorker::Stop(File::ToURI($file));
				break;
		}
		
		return 0;	
	}
/**
 * CRMClient.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * CRMClient#delete() -> Boolean 
 **/
	public function delete(){
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY . " = " . $this->Client_ID;
		
		if($request->exec('delete')){
			System::Fire('crm.client:remove', array(&$this));
			
			
			
			return true;
		}
		
		return false;
	}
/**
 * CRMClient.Count() -> Number
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
/*
 *
 **/
	public static function Search($word){
		
		if(!Plugin::HaveAccess('CRM')){
			return;
		}
		
		$clauses = new stdClass();
		$clauses->where = $word;
		
		$result = self::GetList($clauses);
		
		for($i = 0; $i < $result['length']; $i++){
			
			$obj = new IntelliSearch($result[$i]);
			
			$obj->onClick('System.CRM.Client.openFromSearch');
			
			//$obj->setIcon($result[$i]['Avatar'] == '' ? 'contact-empty' : $result[$i]['Avatar']);
			
			$obj->setAppIcon('crm');
			$obj->setAppName(MUI('CRM - Clients'));
			
			IntelliSearch::Add($obj);
		}
	}
/*
 *
 **/	
	public static function SearchMail($word){
		if(!Plugin::HaveAccess('CRM')){
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
 * CRMClient.GetList([clauses [, options]]) -> Array | boolean
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
		$request->select =	'C.*, SUBSTR(Company, 1, 1) as Letter, Company as text, C.Client_ID as value';
		
		
		$request->from = 	self::TABLE_NAME . ' C';
		$request->where =	' 1 ';
		$request->order =	'Company  ASC';
		
		
		if(isset($options->category)){
			$options->Category = $options->category;
		}
		
		if(!empty($options->Category)){
			if(is_string($options->Category)){
				$options->Category = explode(';', $options->Category);
			}
			
			$request->where = ' (Categories LIKE "%' . implode('%" OR Categories LIKE "%', $options->Category) . '%" OR Categories = "")';
		}
		
		if(isset($options->word)){			
			if(!is_object($clauses)){
				$clauses = new stdClass();
			}
			
			$clauses->where = $options->word;
		}
		
		if(isset($options->Clients)){
			if(is_string($options->Clients)){
				$options->Clients = explode(';', $options->Clients);
			}
			
			$request->where .= ' AND '.self::PRIMARY_KEY.' IN(' . implode(', ', $options->Clients) . ')';	
		}
		
		if(isset($options->Conclusion)){
			
			$request->select .= ', CONCAT(GROUP_CONCAT(Conclusion ORDER BY Date_Call DESC SEPARATOR "|"), "|") as Ccl';		
			$request->from .= 	' INNER JOIN ' . CRMClientCall::TABLE_NAME . ' A ON C.Client_ID = A.Client_ID'; 
			
			if(is_numeric($options->Conclusion)){
				$request->group = ' C.Client_ID HAVING Ccl LIKE "' .  (int) $options->Conclusion .'|%"';
			}elseif(empty($options->Conclusion)){
				$request->group = ' C.Client_ID HAVING Ccl NOT LIKE "1|%" AND Ccl NOT LIKE "2|%" AND Ccl NOT LIKE "3|%" AND Ccl NOT LIKE "4|%" ';	
			}else{
				$request->group = ' C.Client_ID HAVING Ccl LIKE "' .  Sql::EscapeString($options->Conclusion) .'|%"';
			}
			
		}
		
		if(!empty($options->uncall)){
			$request->where .= ' AND NOT EXISTS (
				SELECT *
				FROM '.CRMClientCall::TABLE_NAME . '_view A
				WHERE A.Client_ID = C.Client_ID
			)';
		}
		
		if(!empty($options->startRecall) && !empty($options->endRecall)){//Filtre de recherche par date de rappel
			$request->from .= ' INNER JOIN ' . CRMClientCall::TABLE_NAME . ' A ON C.Client_ID = A.Client_ID';
			$request->group = 'C.Client_ID HAVING "' . Sql::EscapeString($options->startRecall) . '" <= MAX(Date_Recall) AND MAX(Date_Recall) <= "' . Sql::EscapeString($options->endRecall) . '"';
		}
		
		
		if(!empty($options->lastCall)){
			$request->observe(array(__CLASS__, 'onGetListCall'));	
		}
		
		if(!empty($options->nextEvent)){
			$request->observe(array(__CLASS__, 'onGetListEvent'));	
		}
		
		switch(@$options->op){
			default:
				$request->observe(array(__CLASS__, 'onGetList'));
				break;
				
			case '-select':
				$request->select =	'Company as text, C.Client_ID as value';
				break;
				
			case '-mail':
				
				$request->onexec = 	'';
				$request->select = 	'C.*, Company as text, Email as value';
				$request->where =	"Email != ''";
									
				//$request->observe(array(__CLASS__, 'onGetListMail'));
				
				break;
		
			case '-newsletter':
				
				$request->onexec = 	'';
				$request->select = 	'DISTINCT(Email)';
				$request->where =	"Email != ''";
									
				//$request->observe(array(__CLASS__, 'onGetListMail'));
				
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (
					Company like '%". Sql::EscapeString($clauses->where) . "%'
					OR CompanyName like '%". Sql::EscapeString($clauses->where) . "%'
					OR Company like '%". Sql::EscapeString($clauses->where) . "%'
					OR Address like '%". Sql::EscapeString($clauses->where) . "%'
					OR CP like '%". Sql::EscapeString($clauses->where) . "%'
					OR City like '%". Sql::EscapeString($clauses->where) . "%'
					OR Country like '%". Sql::EscapeString($clauses->where) . "%'
					OR Phone like '%". Sql::EscapeString($clauses->where) . "%'
					OR Fax like '%". Sql::EscapeString($clauses->where) . "%'
					OR Email like '%". Sql::EscapeString($clauses->where) . "%'
				)";
				
			}
			if(!empty($clauses->order)) 	$request->order = 	$clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = 	$clauses->limits;
		}
		
		System::Fire('crm.client:list', array(&$request, $options));
		
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where .' ' . $request->group);
			
			if(!empty($options->default)){
				$result = array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : ('- ' . MUI('Choisissez') . ' -'), 'value' => 0
				)), $result);
					
				$result['length']++;	
			}
		}
		
		return $result;
	}
/**
 *
 **/	
	public static function onGetList(&$row, &$request){
		$options = new stdClass();
		$options->Client_ID = $row['Client_ID'];
		$row['Medias'] = CRMClientMedia::GetList($options, $options);
		
		/*$row['Avatar_LD'] = SystemCache::Push(array(
			'Src' => 	$row['Avatar'],
			'Width' =>	70,
			'Height' => 70,
			'ID' => 	basename($row['Avatar']) . '-70x70'
		));
		
		if(empty($row['Avatar_LD'])){
			$row['Avatar_LD'] = '';	
		}*/
	}
	
	public static function onGetListCall(&$row, &$request){
		$row['Call'] = CRMClientCall::Last($row['Client_ID']);	
	}
	
	public static function onGetListEvent(&$row, &$request){
		$row['Event'] = CRMEvent::Next($row['Client_ID']);	
	}
}

CRMClient::Initialize();
?>