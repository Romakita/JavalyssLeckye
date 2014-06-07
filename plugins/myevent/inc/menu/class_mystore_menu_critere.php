<?php
/** section: MyEvent
 * class MyEventMenuCritere
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_myevent_menu_critere.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventMenuCritere extends ObjectTools{	
	const PRE_OP =				'myevent.menu.critere.';
/**
 * MyEventMenuCritere.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'myevent_menu_criteres';	
/**
 * MyEventMenuCritere.PRIMARY_KEY -> String
 * Clef primaire de la table MyEventMenuCritere.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Critere_ID';
/**
 * MyEventMenuCritere#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * MyEventMenuCritere#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * MyEventMenuCritere#Order -> Number
 **/
	public $Order = 0;

/**
 * new MyEventMenuCritere()
 * new MyEventMenuCritere(json)
 * new MyEventMenuCritere(array)
 * new MyEventMenuCritere(obj)
 * new MyEventMenuCritere(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventMenuCritere]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventMenuCritere]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventMenuCritere]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventMenuCritere]].
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
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);

		}
	}
/**
 * MyEventMenuCritere.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * MyEventMenuCritere.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `myevent_menu_criteres` (
		  `Post_ID` bigint(20) NOT NULL,
		  `Name` varchar(255) NOT NULL,
		  `Order` int(2) NOT NULL,
		  UNIQUE KEY `Post_ID` (`Post_ID`,`Name`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
	}
/**	
 * MyEventMenuCritere#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public static function Set($list){
		
		if(empty($list)){
			return true;
		}
		
		$post = $list[0]->Post_ID;
		//
		//Suppression
		// 
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".Post::PRIMARY_KEY."` = '".(int) $post."' ";
		
		$request->exec('delete');
		
		//
		// Insertion
		//
		
		for($i = 0, $len = count($list); $i < $len; $i++){
			$o = new self($list[$i]);
			$o->commit();
		}
		
		return true;
	}
			
	public function commit(){	
	
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
				
		$request->fields = 	"`Post_ID`,
								`Name`,
								`Order`";
								
		$request->values = 	"'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->Order)."'";
								
		return $request->exec('insert');
	}
/**
 * MyEventMenuCritere.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."set":
				
				if(!self::Set($_POST['Criteres'])){
					return $op.'.err';	
				}
				
				echo json_encode(true);
				
				break;
			
			case self::PRE_OP."exists":
				
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->exists());
				
				break;
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word'], @$_POST['Post_ID']);
				
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
 * MyEventMenuCritere.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyEventMenuCritere#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Critere_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyEventMenuCritere.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = '', $id = 0){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct " . Sql::EscapeString($field) ." as text";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
							
		if(!empty($word)){
			$request->where .= ' AND '.Sql::EscapeString($field)." LIKE '". Sql::EscapeString($word)."%'";
		}
		
		if(!empty($id)){
			$array = MyEventMenu::GetParentPostID($id);	
			array_push($array, $id);
			$request->where .= ' AND Post_ID IN(' . implode(',', $array).')';
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
 * MyEventMenuCritere.GetList([clauses [, options]]) -> Array | boolean
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
		$request->order = 	'Order ASC';
		
		if(isset($options->Post_ID)){
			$request->where .=	' AND Post_ID = ' . $options->Post_ID; 
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
								`Order` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
			
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
}

MyEventMenuCritere::Initialize();

?>