<?php
/** section: Contact
 * class CRMClientMedia
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Romain LENZOTTI
 * * Fichier : class_client_media.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_CRM_CLIENTS_MEDIAS', PRE_TABLE.'crm_clients_medias');
class CRMClientMedia extends ObjectTools implements iClass{	
	const PRE_OP =				'crm.client.media.';
/**
 * CRMClientMedia.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_CRM_CLIENTS_MEDIAS;	
/**
 * CRMClientMedia.PRIMARY_KEY -> String
 * Clef primaire de la table CRMClientMedia.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Media_ID';
/**
 * CRMClientMedia#Media_ID -> Number
 **/
	public $Media_ID = 0;
/**
 * CRMClientMedia#Client_ID -> Number
 **/
	public $Client_ID = 0;
/**
 * CRMClientMedia#Title -> String
 * Varchar
 **/
	public $Title = "";
/**
 * CRMClientMedia#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * CRMClientMedia#Link -> String
 * Varchar
 **/
	public $Link = "";
/**
 * CRMClientMedia#Description -> String
 * Text
 **/
	public $Description = "";
	
	public $Type =		'multimedia';

	public $Medias =	NULL;
/**
 * new CRMClientMedia()
 * new CRMClientMedia(json)
 * new CRMClientMedia(array)
 * new CRMClientMedia(obj)
 * new CRMClientMedia(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[CRMClientMedia]].
 * - array (Array): Tableau associatif équivalent à une instance [[CRMClientMedia]]. 
 * - obj (Object): Objet équivalent à une instance [[CRMClientMedia]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[CRMClientMedia]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
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
 * CRMClientMedia.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * CRMClientMedia.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".self::TABLE_NAME." (
		  `Media_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Client_ID` bigint(20) NOT NULL,
		  `Title` varchar(100) NOT NULL,
		  `Name` varchar(100) NOT NULL,
		  `Link` varchar(255) NOT NULL,
		  `Description` text NOT NULL,
		  `Type` varchar(20 NOT NULL DEFAULT 'multimedia',
		  PRIMARY KEY (`Media_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');	
	}
/**	
 * CRMClientMedia#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Media_ID == 0){
			
			$request->fields = 	"`Client_ID`,
								`Title`,
								`Name`,
								`Link`,
								`Description`,
								`Type`";
			$request->values = 	"'".Sql::EscapeString($this->Client_ID)."',
								'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->Link)."',
								'".Sql::EscapeString($this->Description)."',
								'".Sql::EscapeString($this->Type)."'";
			
			System::Fire('crm.client.media:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Media_ID = $request->exec('lastinsert');
				
				System::Fire('crm.client.media:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"	`Client_ID` = '".Sql::EscapeString($this->Client_ID)."',
								`Title` = '".Sql::EscapeString($this->Title)."',
								`Name` = '".Sql::EscapeString($this->Name)."',
								`Link` = '".Sql::EscapeString($this->Link)."',
								`Description` = '".Sql::EscapeString($this->Description)."',
								`Type` = '".Sql::EscapeString($this->Type)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Media_ID."'";
		
		System::Fire('crm.client.media:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('crm.client.media:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * CRMClientMedia#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Media_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('crm.client.media:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * CRMClientMedia.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."commit":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
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
			
			case self::PRE_OP."list":
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
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
 * CRMClientMedia.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * CRMClientMedia#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Media_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}

/**
 * CRMClientMedia.Distinct(field [, word]) -> Array
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
 * CRMClientMedia.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(isset($options->Client_ID)){
			$request->where .= ' AND ' . CRMClient::PRIMARY_KEY. ' = ' . (int) $options->Client_ID;
		}
		
		switch(@$options->op){
			default:
							
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Field as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Media_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Client_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Link` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Description` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('crm.client.media:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row, &$request){
			
	}
}

CRMClientMedia::Initialize();

?>