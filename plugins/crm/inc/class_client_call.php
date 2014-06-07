<?php
/** section: CRM
 * class CRMClientCall
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Romain LENZOTTI
 * * Fichier : class_crm_client_call.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_CRM_CLIENTS_CALLS', PRE_TABLE.'crm_clients_calls');
class CRMClientCall extends ObjectTools implements iClass{	
	const PRE_OP =				'crm.client.call.';
/**
 * CRMClientCall.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_CRM_CLIENTS_CALLS;	
/**
 * CRMClientCall.PRIMARY_KEY -> String
 * Clef primaire de la table CRMClientCall.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Call_ID';

/**
 * CRMClientCall#Call_ID -> Number
 **/
	public $Call_ID = 0;
/**
 * CRMClientCall#Client_ID -> Number
 **/
	public $Client_ID = 0;
/**
 * CRMClientCall#Contact_ID -> Number
 * Varchar
 **/
	public $Contact_ID = 0;
/**
 * CRMClientCall#Contact -> String
 * Varchar
 **/
	public $Contact = "";
/**
 * CRMClientCall#User_ID -> String
 * Varchar
 **/
	public $User_ID = "";
/**
 * CRMClientCall#Subject -> String
 * Varchar
 **/
	public $Subject = "";
/**
 * CRMClientCall#Date_Call -> Datetime
 **/
	public $Date_Call = NULL;
/**
 * CRMClientCall#Date_Recall -> Date
 **/
	public $Date_Recall = NULL;
/**
 * CRMClientCall#Conclusion -> String
 * Varchar
 **/
	public $Conclusion = "";
/**
 * CRMClientCall#Comment -> String
 * Text
 **/
	public $Comment = "";
/**
 * CRMClientCall#Statut -> String
 * Varchar
 **/
	public $Statut = 'draft';

/**
 * new CRMClientCall()
 * new CRMClientCall(json)
 * new CRMClientCall(array)
 * new CRMClientCall(obj)
 * new CRMClientCall(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[CRMClientCall]].
 * - array (Array): Tableau associatif équivalent à une instance [[CRMClientCall]]. 
 * - obj (Object): Objet équivalent à une instance [[CRMClientCall]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[CRMClientCall]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	'A.*, DATE_FORMAT(Date_Call, \'%Y-%m-%d\') as Date_Group, IFNULL(CONCAT(U.Name, " ", U.FirstName), "NC") User, Company, C.Phone CompanyPhone';
				$request->from = 	self::TABLE_NAME . ' A LEFT JOIN ' . User::TABLE_NAME . ' U on A.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY . ' 
				LEFT JOIN ' . CRMClient::TABLE_NAME . ' C ON A.' . CRMClient::PRIMARY_KEY . ' = C.' .CRMClient::PRIMARY_KEY;
				
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$request->observe(array(__CLASS__, 'onGetList'));
				
				$u = $request->exec('select');
				//echo $request->compile();
				if($u['length']){
					$this->extend($u[0]);
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
	}
/**
 * CRMClientCall.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * CRMClientCall.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".TABLE_CRM_CLIENTS_CALLS." (
		  `Call_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Client_ID` bigint(20) NOT NULL,
		  `Contact_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Contact` varchar(100) NOT NULL DEFAULT '',
		  `User_ID` varchar(20) NOT NULL,
		  `Subject` varchar(255) NOT NULL,
		  `Date_Call` datetime NOT NULL,
		  `Date_Recall` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Conclusion` varchar(255) NOT NULL,
		  `Comment` mediumtext NOT NULL,
		  `Statut` varchar(20) NOT NULL DEFAULT 'draft',
		  PRIMARY KEY (`Call_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');
		
		
		$request->query = 	"CREATE VIEW ".TABLE_CRM_CLIENTS_CALLS . "_view AS SELECT DISTINCT(Client_ID) FROM ".TABLE_CRM_CLIENTS_CALLS;
		$request->exec('query');
	}
/**	
 * CRMClientCall#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Call_ID == 0){
			
			$this->Date_Call = date('Y-m-d H:i:s');
			
			$request->fields = 	"`Client_ID`,
								`Contact_ID`,
								`Contact`,
								`User_ID`,
								`Subject`,
								`Date_Call`,
								`Date_Recall`,
								`Conclusion`,
								`Comment`,
								`Statut`";
			$request->values = 	"'".Sql::EscapeString($this->Client_ID)."',
								'".Sql::EscapeString($this->Contact_ID)."',
								'".Sql::EscapeString($this->Contact)."',
								'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString($this->Subject)."',
								'".Sql::EscapeString($this->Date_Call)."',
								'".Sql::EscapeString($this->Date_Recall)."',
								'".Sql::EscapeString($this->Conclusion)."',
								'".Sql::EscapeString($this->Comment)."',
								'".Sql::EscapeString($this->Statut)."'";
			
			System::Fire('crm.client.call:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Call_ID = $request->exec('lastinsert');
				
				System::Fire('crm.client.call:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Client_ID` = '".Sql::EscapeString($this->Client_ID)."',
								`Contact_ID` = '".Sql::EscapeString($this->Contact_ID)."',
								`Contact` = '".Sql::EscapeString($this->Contact)."',
								`User_ID` = '".Sql::EscapeString($this->User_ID)."',
								`Subject` = '".Sql::EscapeString($this->Subject)."',
								`Date_Call` = '".Sql::EscapeString($this->Date_Call)."',
								`Date_Recall` = '".Sql::EscapeString($this->Date_Recall)."',
								`Conclusion` = '".Sql::EscapeString($this->Conclusion)."',
								`Comment` = '".Sql::EscapeString($this->Comment)."',
								`Statut` = '".Sql::EscapeString($this->Statut)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Call_ID."'";
		
		System::Fire('crm.client.call:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('crm.client.call:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * CRMClientCall#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Call_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('crm.client.call:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * CRMClientCall.exec(command) -> Number
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
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
					return $op.'.err';	
				}
				
				echo json_encode(new self($o->Call_ID));//récupération des données manquantes
				
				break;
				
			case self::PRE_OP."delete":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->delete()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."exists":
				
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->exists());
				
				break;
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP.'notify':
				$o = new stdClass();
				$o->op = '-today';
				$o->Statut = 'draft';
				$o->User_ID = User::Get()->User_ID;
				
				$options = new stdClass();
				$options->Today = self::Count($o);
				
				$o->op = '-week';
				$options->Week = self::Count($o);
				
				$o->op = '';
				$options->Total = self::Count($o);
				
				echo json_encode($options);
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
			
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."print":
			
				$_POST['clauses']->limits ='';
				
				$pdf = self::PrintList($_POST['clauses'], $_POST["options"]);
				
				if(!$pdf){
					return $op.'.err';	
				}
				
				@Stream::MkDir(System::Path('prints'), 0777);
				$link = System::Path('prints') . str_replace('.', '-', self::PRE_OP) . 'list-' . date('ymdhis') .'.pdf';
				@unlink($link);
				$pdf->Output($link, 'F');
				
				echo json_encode(str_replace(ABS_PATH, URI_PATH, $link));
				
				break;
		}
		
		return 0;	
	}
/**
 * CRMClientCall.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * CRMClientCall#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Call_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * CRMClientCall#Last(clientid) -> CRMClientCall
 *
 * Cette méthode retourne le dernier appel d'un client.
 **/	
	public static function Last($clientID){
		$request = new Request(DB_NAME);
		$request->from = self::TABLE_NAME;
		
		$request->where = CRMClient::PRIMARY_KEY . ' = ' . (int) $clientID;
		$request->order = 'Call_ID DESC';
		$request->limits = '0,1';
		//$request->observe(array(__CLASS__, 'onGetList'));
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::Current()->GetError());	
		}

		return $result['length'] == 0 ? false : new self($result[0]);
	}
/**
 * CRMClientCall.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct " . Sql::EscapeString($field) ." as text";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
							
		if(!empty($word)){
			$request->where .= ' 
				AND '.Sql::EscapeString($field)." LIKE '". Sql::EscapeString($word)."%'";
		}
		
		$request->where .= 	" AND TRIM(".Sql::EscapeString($field).") != ''";
		$request->order =	Sql::EscapeString($field);
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 * CRMClientCall.Count([options]) -> Number
 * - options (Object): Objet de configuration de la liste.
 *
 **/	
	public static function Count($options = ''){
		$request = 			new Request();
		
		$request->select = 	'COUNT(A.Call_ID) as NB';
		$request->from = 	self::TABLE_NAME . ' A LEFT JOIN ' . User::TABLE_NAME . ' U on A.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY . ' 
							LEFT JOIN ' . CRMClient::TABLE_NAME . ' C ON A.' . CRMClient::PRIMARY_KEY . ' = C.' .CRMClient::PRIMARY_KEY;
							
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(isset($options->Client_ID)){
			$request->where .= ' AND A.' . CRMClient::PRIMARY_KEY . ' = ' . ((int) $options->Client_ID);
		}
		
		if(isset($options->Contact_ID)){
			$request->where .= ' AND ' . CRMContact::PRIMARY_KEY . ' = ' . ((int) $options->Contact_ID);
		}
		
		if(isset($options->User_ID)){
			$request->where .= ' AND U.' . User::PRIMARY_KEY . ' = ' . ((int) $options->User_ID);
		}
		
		if(!empty($options->Statut)){
			$request->where .= ' AND A.Statut = "' . strtolower(Sql::EscapeString($options->Statut)) . '"';	
		}
				
		switch(@$options->op){
			default:
						
				break;
			case '-today':
				$request->where .= ' AND A.Date_Recall = NOW()';
				break;
			
			case '-next-week':
				$request->where .= ' AND TO_DAYS(NOW()) - TO_DAYS(A.Recall) <= 7 AND A.Date_Recall != NOW()';
				break;
				
			case '-date':
			
				$request->where .= ' AND A.Date_Call like "' . Sql::EscapeString($options->Date) . '%"';
				
				switch(@$options->Conclusion){
					default:break;
					case 'NRP':
						$request->where .= ' AND A.Conclusion like "1"';	
						break;
					case 'NRA':
						$request->where .= ' AND A.Conclusion like "2"';	
						break;
					
					case 'CTINF':
						$request->where .= ' AND A.Conclusion like "3"';	
						break;
						
					case 'PROJ':
						$request->where .= ' AND A.Conclusion like "4"';	
						break;
					
					case 'OTH':
						$request->where .= ' AND A.Conclusion NOT IN("1","2","3","4")';	
						break;
				}
				
				break;
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::Current()->getError());	
		}
		
		return empty($result['length']) ? 0 : $result[0]['NB'] ;
	}
/**
 * CRMClientCall.MinMax([options]) -> Number
 * - options (Object): Objet de configuration de la liste.
 *
 **/	
	public static function MinMax($options = ''){
		$request = 			new Request();
		
		
		$request->from = 	self::TABLE_NAME . ' A LEFT JOIN ' . User::TABLE_NAME . ' U on A.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY . ' 
							LEFT JOIN ' . CRMClient::TABLE_NAME . ' C ON A.' . CRMClient::PRIMARY_KEY . ' = C.' .CRMClient::PRIMARY_KEY;
							
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
				
		if(isset($options->Contact_ID)){
			$request->where .= ' AND ' . CRMContact::PRIMARY_KEY . ' = ' . ((int) $options->Contact_ID);
		}
		
		if(isset($options->User_ID)){
			$request->where .= ' AND U.' . User::PRIMARY_KEY . ' = ' . ((int) $options->User_ID);
		}
		
		if(!empty($options->Statut)){
			$request->where .= ' AND A.Statut = "' . strtolower(Sql::EscapeString($options->Statut)) . '"';	
		}
		
		switch($options->op){
			case '-min-am':
				$request->select = 	'Min(A.Date_Call) as Date';
				$request->where .= ' AND A.Date_Call >= "' . Sql::EscapeString($options->Date . ' 00:00:00') . '" AND  A.Date_Call < "' . Sql::EscapeString($options->Date . ' 13:00:00') .'"';
				
				break;
			case '-max-am':
				$request->select = 	'Max(A.Date_Call) as Date';
				$request->where .= ' AND A.Date_Call >= "' . Sql::EscapeString($options->Date . ' 00:00:00') . '" AND  A.Date_Call < "' . Sql::EscapeString($options->Date . ' 13:00:00') .'"';
				break;
				
			case '-min-pm':
				$request->select = 	'Min(A.Date_Call) as Date';
				$request->where .= ' AND A.Date_Call >= "' . Sql::EscapeString($options->Date . ' 13:00:00') . '" AND  A.Date_Call <= "' . Sql::EscapeString($options->Date . ' 23:59:59') .'"';
				break;
				
			case '-max-pm':
				$request->select = 	'Max(A.Date_Call) as Date';
				$request->where .= ' AND A.Date_Call >= "' . Sql::EscapeString($options->Date . ' 13:00:00') . '" AND  A.Date_Call <= "' . Sql::EscapeString($options->Date . ' 23:59:59') .'"';
				break;
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::Current()->getError());	
		}
		
		return empty($result['length']) ? 0 : $result[0]['Date'];
	}
/**
 * CRMClientCall.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des instances en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * Pas d'options.
 *
 **/	
	public static function GetList($clauses = '', $options = ''){
				
		$request = 			new Request();
		
		$request->select = 	'A.*, DATE_FORMAT(Date_Call, \'%Y-%m-%d\') as Date_Group, IFNULL(CONCAT(U.Name, " ", U.FirstName), "NC") User, Company, C.Comment as CompanyComment, C.Phone CompanyPhone';
		$request->from = 	self::TABLE_NAME . ' A LEFT JOIN ' . User::TABLE_NAME . ' U on A.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY . ' 
							LEFT JOIN ' . CRMClient::TABLE_NAME . ' C ON A.' . CRMClient::PRIMARY_KEY . ' = C.' .CRMClient::PRIMARY_KEY;
							
		$request->where =	' 1 '; 
		$request->order = 	'';
				
		if(isset($options->Client_ID)){
			$request->where .= ' AND A.' . CRMClient::PRIMARY_KEY . ' = ' . ((int) $options->Client_ID);
		}
		
		if(isset($options->Contact_ID)){
			$request->where .= ' AND ' . CRMContact::PRIMARY_KEY . ' = ' . ((int) $options->Contact_ID);
		}
		
		if(isset($options->User_ID)){
			$request->where .= ' AND U.' . User::PRIMARY_KEY . ' = ' . ((int) $options->User_ID);
		}
		
		if(!empty($options->Statut)){
			$request->where .= ' AND A.Statut = "' . strtolower(Sql::EscapeString($options->Statut)) . '"';	
		}
		
		if(!empty($options->startRecall) && !empty($options->endRecall)){//Filtre de recherche par date de rappel
			
			$request->where .= ' AND A.Date_Recall >= "' . Sql::EscapeString($options->startRecall) . '" AND A.Date_Recall <= "' . Sql::EscapeString($options->endRecall) . '"';
			
		}
		
		if(isset($options->Conclusion)){
			if(is_numeric($options->Conclusion)){
				$request->where .= ' AND Conclusion like "' .  (int) $options->Conclusion .'"';
			}elseif(empty($options->Conclusion)){
				$request->where .= ' AND Conclusion NOT IN("1","2","3","4")';	
			}else{
				$request->where .= ' AND Conclusion like "' .  Sql::EscapeString($options->Conclusion) .'"';
			}
		}
		
		if(!empty($options->start) && !empty($options->end)){//Gestion du planning. On liste les appels ayant une date de rappel
			
			$request->select = 'A.*, Company, C.Comment as CompanyComment';
			$request->where .= ' AND  (
				(
					A.Date_Recall >= "' . Sql::EscapeString($options->start) . '" AND A.Date_Recall <= "' . Sql::EscapeString($options->end) . '"
					AND A.Statut != "finish recalled"	
				)
				OR (
					A.Date_Call >= "' . Sql::EscapeString($options->start) . '" AND A.Date_Call <= "' . Sql::EscapeString($options->end) . '"
					AND A.Statut = "draft"
				)
			)
			';
			
		}else{
			$request->observe(array(__CLASS__, 'onGetList'));	
		}
		
		switch(@$options->op){
			default:
							
				break;
			
			case '-unfinish':
				$request->where .= 'AND (A.Statut = "draft" OR (A.Statut = "finish" AND A.Date_Recall != "0000-00-00 00:00:00"))';
				
				break;
			
			case '-finish':
				$request->where .= ' AND ((A.Statut = "finish" AND A.Date_Recall = "0000-00-00 00:00:00" ) OR A.Statut = "finish recalled")';
				
				break;
				
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (
					
					A.`Contact` like '%".Sql::EscapeString($clauses->where)."%' OR 
					A.`Subject` like '%".Sql::EscapeString($clauses->where)."%' OR 
					A.`Date_Call` like '%".Sql::EscapeString($clauses->where)."%' OR 
					A.`Date_Recall` like '%".Sql::EscapeString($clauses->where)."%' OR 
					A.`Conclusion` like '%".Sql::EscapeString($clauses->where)."%' OR 
					A.`Comment` like '%".Sql::EscapeString($clauses->where)."%' OR
					U.`Name` like '%".Sql::EscapeString($clauses->where)."%' OR
					U.`FirstName` like '%".Sql::EscapeString($clauses->where)."%' OR
					C.`Company` like '%".Sql::EscapeString($clauses->where)."%'
								
				)";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('crm.client.call:list', array(&$request, $options));
				
		$result = $request->exec('select');
		//var_dump($options);
		//var_dump($request->query);
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row, &$request){
		
		//récupération des numéros de téléphone et e-mail
		
		$row['Phone'] = new stdClass();
		
		$o = new self($row);
		
		if(!empty($o->Comment->phone)){
			$row['Phone']->call = $o->Comment->phone;	
		}
		
		if(!empty($row['Contact_ID'])){
			$contact = new Contact($row['Contact_ID']);
			
			if(is_object($contact->Phone)){
				foreach($contact->Phone as $key => $mail){
					$row['Phone']->$key = $mail;
				}
			}
		}
		
		if(!empty($row['CompanyPhone'])){
			$row['Phone']->company = $row['CompanyPhone'];
		}
		
	}
}

CRMClientCall::Initialize();

?>