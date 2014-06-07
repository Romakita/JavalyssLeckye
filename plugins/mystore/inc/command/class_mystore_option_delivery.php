<?php
/** section: MyStore
 * class MyStoreOptionDelivery
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_option_delivery.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreOptionDelivery extends ObjectTools{	
	const ADD =					'add';
	const SET =					'set';
	const PRE_OP =				'mystore.option.delivery.';
/**
 * MyStoreOptionDelivery.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_options_delivery';	
/**
 * MyStoreOptionDelivery.PRIMARY_KEY -> String
 * Clef primaire de la table MyStoreOptionDelivery.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Option_ID';

/**
 * MyStoreOptionDelivery#Option_ID -> Number
 **/
	public $Option_ID = 0;
/**
 * MyStoreOptionDelivery#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * MyStoreOptionDelivery#Picture -> String
 * Varchar
 **/
	public $Picture = "";
/**
 * MyStoreOptionDelivery#Cost_Delivery -> Float
 * Decimal
 **/
	public $Cost_Delivery = 0.00;
/**
 * MyStoreOptionDelivery#Time_Delivery -> String
 * Varchar
 **/
	public $Time_Delivery = "";
/**
 * MyStoreOptionDelivery#Amount_Min -> Float
 * Decimal
 **/
	public $Amount_Min = 0.00;
/**
 * MyStoreOptionDelivery#Amount_Max -> Float
 * Decimal
 **/
	public $Amount_Max = 0.00;
/**
 * MyStoreOptionDelivery#Type -> String
 * Varchar
 **/
	public $Type = "";
/**
 * new MyStoreOptionDelivery()
 * new MyStoreOptionDelivery(json)
 * new MyStoreOptionDelivery(array)
 * new MyStoreOptionDelivery(obj)
 * new MyStoreOptionDelivery(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreOptionDelivery]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreOptionDelivery]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreOptionDelivery]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreOptionDelivery]].
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
 * MyStoreOptionDelivery.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
		System::EnqueueScript('mystore.option.delivery', Plugin::Uri().'js/mystore_option_delivery.js');
	}
/**
 * MyStoreOptionDelivery.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE IF NOT EXISTS `mystore_options_delivery` (
		  `Option_ID` int(11) NOT NULL AUTO_INCREMENT,
		  `Name` varchar(255) NOT NULL DEFAULT '',
		  `Picture` varchar(255) NOT NULL DEFAULT '',
		  `Cost_Delivery` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Time_Delivery` varchar(200) NOT NULL,
		  `Amount_Min` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Amount_Max` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Type` varchar(40) NOT NULL DEFAULT 'professional private',
		  PRIMARY KEY (`Option_ID`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;";
		
		$request->exec('query');
				
		$request->query = 	"ALTER TABLE `mystore_options_delivery` CHANGE `Type` `Type` VARCHAR(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'professional private'";
		$request->exec('query');
	}
/**	
 * MyStoreOptionDelivery#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Option_ID == 0){
			
			$request->fields = 	"`Name`,
								`Picture`,
								`Cost_Delivery`,
								`Time_Delivery`,
								`Amount_Min`,
								`Amount_Max`,
								`Type`";
			$request->values = 	"'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->Picture)."',
								'".Sql::EscapeString($this->Cost_Delivery)."',
								'".Sql::EscapeString($this->Time_Delivery)."',
								'".Sql::EscapeString($this->Amount_Min)."',
								'".Sql::EscapeString($this->Amount_Max)."',
								'".Sql::EscapeString($this->Type)."'";
			
			System::Fire('mystore.option.delivery:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Option_ID = $request->exec('lastinsert');
				
				System::Fire('mystore.option.delivery:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Name` = '".Sql::EscapeString($this->Name)."',
								`Picture` = '".Sql::EscapeString($this->Picture)."',
								`Cost_Delivery` = '".Sql::EscapeString($this->Cost_Delivery)."',
								`Time_Delivery` = '".Sql::EscapeString($this->Time_Delivery)."',
								`Amount_Min` = '".Sql::EscapeString($this->Amount_Min)."',
								`Amount_Max` = '".Sql::EscapeString($this->Amount_Max)."',
								`Type` = '".Sql::EscapeString($this->Type)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Option_ID."'";
		
		System::Fire('mystore.option.delivery:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('mystore.option.delivery:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * MyStoreOptionDelivery#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Option_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('mystore.option.delivery:remove', array(&$this));
			return true;
		}
		return false;

	}
	
	public function inStore(){
		return strpos($this->Type, 'in-store') !== false;
	}
/**
 * MyStoreOptionDelivery.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP . 'import':
				
				self::Import();
				
				break;
				
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
 * MyStoreOptionDelivery.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreOptionDelivery#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Option_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
	
	public static function Import(){
		
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'options/';
		@Stream::MkDir($folder, 0775);
		FrameWorker::Start();
						
		//récupération du fichier
		$file = 		FrameWorker::Upload($folder, 'jpg;jpeg;png;gif;bmp;');
		//on renomme le fichier
		$newfile = 		str_replace(basename($file), substr(md5(date('Ymdhis')), 0, 15) . '.' . FrameWorker::Extension($file), $file);
		
		Stream::Rename($file, $newfile);
		FrameWorker::Resize($newfile);
		FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $newfile));
		
	}
/**
 * MyStoreOptionDelivery.Distinct(field [, word]) -> Array
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
			
			if(!empty($default)){
				$result = 	array_merge(
								array(array('text' => MUI(is_string($default) && $default != 'true' ? $default : MUI('Choisissez')), 'value' => '')), 
								$result
							);
				$result['length']++;
			}
		}
		
		return $result; 
	}
/**
 * MyStoreOptionDelivery.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*, Name as text, Name as value';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(!empty($options->Amount)){
			$request->where .= " 
			AND (
				(Amount_Min = 0 AND Amount_Max = 0)
				OR
				(
					(Amount_Min != 0 AND Amount_Max != 0 AND Amount_Min <= ". ((int) $options->Amount) ." AND ". ((int) $options->Amount) ." <= Amount_Max)
					OR
					(Amount_Min != 0 AND Amount_Max = 0 AND Amount_Min <= ". ((int) $options->Amount) .")
					OR
					(Amount_Max != 0 AND Amount_Min <= ". ((int) $options->Amount) ." AND ". ((int) $options->Amount) ." <= Amount_Max)
				)
			)";
		}
		
		if(!empty($options->Type)){
			$request->where .= " AND Type like '%".Sql::EscapeString($options->Type)."%'";
		}
		
		if(!empty($options->public)){
			$request->where .= " AND Type NOT LIKE '%internal%'";
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
								
				$request->where .= " 	AND (`Option_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Picture` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Cost_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Time_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Amount_Min` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Amount_Max` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Type` like '%".Sql::EscapeString($clauses->Type)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('mystore.option.delivery:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
			
			if(!empty($options->default)){
				
				$result = array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : MUI('Choisissez'), 'value' => 0
				)), $result);
					
				$result['length'] = $result['length']+1;	
			}
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row){
			
	}	
/**
 * MyStoreOptionDelivery#getDiscountPrice(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le cout de livraison formaté.
 **/
	public function getCostDelivery($dec_point = '.' , $thousands_sep = ','){
		return  number_format($this->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency();
	}
/**
 * MyStoreOptionDelivery#getMode() -> String
 *
 * Cette méthode retourne le mode de calcul de la livraison.
 **/
	public function getMode(){
		return strpos($this->Type, 'add') !== false ? self::ADD : self::SET;
	}
}

MyStoreOptionDelivery::Initialize();

?>