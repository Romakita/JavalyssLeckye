<?php
/** section: Core
 * class MyEventProductCritere
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_myevent_product_critere.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventProductCritere extends ObjectTools{	
	const PRE_OP =				'myevent.product.critere.';
/**
 * MyEventProductCritere.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'myevent_products_criteres';	
/**
 * MyEventProductCritere.PRIMARY_KEY -> String
 * Clef primaire de la table MyEventProductCritere.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Critere_ID';

/**
 * MyEventProductCritere#Critere_ID -> Number
 **/
	public $Critere_ID = 0;
/**
 * MyEventProductCritere#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * MyEventProductCritere#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * MyEventProductCritere#Type -> String
 * Varchar
 **/
	public $Type = "";
/**
 * MyEventProductCritere#Value -> String
 * Text
 **/
	public $Value = "";

/**
 * new MyEventProductCritere()
 * new MyEventProductCritere(json)
 * new MyEventProductCritere(array)
 * new MyEventProductCritere(obj)
 * new MyEventProductCritere(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventProductCritere]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventProductCritere]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventProductCritere]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventProductCritere]].
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
 * MyEventProductCritere.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array('MyEventProductCritere', 'exec'));
		System::Observe('gateway.exec.safe', array('MyEventProductCritere', 'execSafe'));
	}
/**
 * MyEventProductCritere.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `myevent_products_criteres` (
		  `Critere_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Name` varchar(100) NOT NULL,
		  `Type` varchar(100) NOT NULL,
		  `Value` text NOT NULL,
		  PRIMARY KEY (`Critere_ID`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
	}
/**	
 * MyEventProductCritere#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Critere_ID == 0){
			
			$request->fields = 	"`Post_ID`,
								`Name`,
								`Type`,
								`Value`";
			$request->values = 	"'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->Type)."',
								'".Sql::EscapeString($this->Value)."'";
			
			System::Fire('myevent.product.critere:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Critere_ID = $request->exec('lastinsert');
				
				System::Fire('myevent.product.critere:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Post_ID` = '".Sql::EscapeString($this->Post_ID)."',
								`Name` = '".Sql::EscapeString($this->Name)."',
								`Type` = '".Sql::EscapeString($this->Type)."',
								`Value` = '".Sql::EscapeString($this->Value)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Critere_ID."'";
		
		System::Fire('myevent.product.critere:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('myevent.product.critere:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * MyEventProductCritere#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Critere_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('myevent.product.critere:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * MyEventProductCritere.exec(command) -> Number
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
 * MyEventProductCritere.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyEventProductCritere#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Critere_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyEventProductCritere.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct Value as value, Value as text, Type";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' Type = "' .  Sql::EscapeString($field) . '"';
							
		if(!empty($word)){
			$request->where .= " 
				AND Value LIKE '%". Sql::EscapeString($word)."%'";
		}
		
		$request->where .= 	" AND TRIM(Value) != ''";
		$request->order =	'Value';
		
		$request->observe(array(__CLASS__, 'onDistinct'));
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onDistinct(&$row){
		
		switch($row['Type']){
			case 'Color':
				$value = json_decode($row['value']);
				$row['text'] = $value->name;
				$row['color'] = $value->color;
				break;
		}
	}
/**
 * MyEventProductCritere#getTitle() -> String
 *
 * Cette méthode retourne le titre/nom du critère
 **/
	public function getTitle(){
		
		switch($this->Type){
			default:	
				return $this->Name;
			case 'Color':
				return $this->Value->name;
		}
		
	}
/**
 * MyEventProductCritere#getColor() -> String
 *
 * Cette méthode retourne le code couleur.
 **/	
	public function getColor(){
		return $this->Value->color;
	}
/**
 * MyEventProductCritere#getWidth() -> Number
 *
 * Cette méthode retourne une largeur.
 **/
	public function getWidth(){
		return $this->Value->width * 1;
	}
/**
 * MyEventProductCritere#getHeight() -> Number
 *
 * Cette méthode retourne une hauteur.
 **/
	public function getHeight(){
		return $this->Value->height * 1;
	}
/**
 * MyEventProductCritere#getDepth() -> Number
 *
 * Cette méthode retourne une profondeur.
 **/	
	public function getDepth(){
		return $this->Value->depth * 1;
	}
/**
 * MyEventProductCritere#getDepth() -> String
 *
 * Cette méthode retourne l'unité de mesure.
 **/	
	public function getUnit(){
		return $this->Value->unit;
	}
/**
 * MyEventProductCritere#getContent() -> String
 *
 * Cette méthode retourne le contenu.
 **/	
	public function getContent(){
		return $this->Value->content;	
	}
/**
 * MyEventProductCritere#getSrc() -> String
 *
 * Cette méthode retourne le lien de l'image.
 **/	
	public function getSrc(){
		
		switch($this->Type){
			case 'Showcase':
				return $this->Value->src;
			default:	
				return $this->getValue();
		}
		
	}
/**
 * MyEventProductCritere#getValue() -> String
 *
 * Cette méthode retourne la valeur stockée.
 **/	
	public function getValue(){
		return $this->Value;	
	}
/**
 * MyEventProductCritere.GetList([clauses [, options]]) -> Array | boolean
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
		$request->order = 	'Type, Critere_ID, Post_ID';
		
		
		if(!empty($options->Post_ID)){
			$request->where .=	' AND Post_ID = ' . (int) $options->Post_ID; 
		}
		
		if(!empty($options->Type)){
			$request->where .=	' AND Type = "' . Sql::EscapeString($options->Type).'"'; 
		}
		
		switch(@$options->op){
			default:
							
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Societe as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Critere_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Post_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Type` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Value` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('myevent.product.critere:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public function __toString(){
		
		switch($this->Type){
			case 'Picture':
				return $this->Value;	
		}
	}
}

MyEventProductCritere::Initialize();

?>