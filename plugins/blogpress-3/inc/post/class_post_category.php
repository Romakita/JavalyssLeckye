<?php
/** section: Plugins
 * class PostCategory 
 * includes ObjectTools, iClass
 *
 * Cette classe gère les catégories pouvant être associées aux [[Post]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_category.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define("TABLE_POST_CATEGORY", PRE_TABLE.'blogpress_posts_categories');
class PostCategory extends ObjectTools  implements iClass{
	const PRE_OP =				'blogpress.category.';
/**
 * PostCategory.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_POST_CATEGORY;	
/**
 * PostCategory.PRIMARY_KEY -> String
 * Clef primaire de la table PostCategory.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Category_ID';

/**
 * PostCategory#Category_ID -> Number
 **/
	public $Category_ID = 0;
/**
 * PostCategory#Name -> String
 * Varchar
 **/
	public $Name = 'Non classé';
/**
 * PostCategory#Description -> String
 * Tinytext
 **/
	public $Description = "";
/**
 * PostCategory#Type -> String
 * Varchar
 **/
	public $Type = 'post';
/**
 * new PostCategory()
 * new PostCategory(json)
 * new PostCategory(array)
 * new PostCategory(obj)
 * new PostCategory(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[PostCategory]].
 * - array (Array): Tableau associatif équivalent à une instance [[PostCategory]]. 
 * - obj (Object): Objet équivalent à une instance [[PostCategory]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[PostCategory]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request(DB_BLOGPRESS);
				
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
 * PostCategory.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
		System::EnqueueScript('blogpress.category', Plugin::Uri().'js/blogpress_category.js');
	}
/**
 * PostCategory.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/	
	public static function Install(){
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->query = "RENAME TABLE `".PRE_TABLE."post_categories` TO `".PRE_TABLE."blogpress_posts_categories`";
		$request->exec('query');
		
		
		$request->query = 	"CREATE TABLE `".PRE_TABLE."blogpress_posts_categories` (
		  `Category_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Name` varchar(100) NOT NULL DEFAULT 'Non classé',
		  `Description` tinytext,
		  `Type` varchar(30) NOT NULL DEFAULT 'post',
		  PRIMARY KEY (`Category_ID`),
		  UNIQUE KEY `Name` (`Name`,`Type`)
		) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_categories` ADD UNIQUE (
							`Name` ,
							`Type`
							);";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_categories` ADD `Type` VARCHAR( 50 ) NOT NULL DEFAULT 'post' AFTER `Description`";
		$request->exec('query');
							
		$request->query = "INSERT INTO `".PRE_TABLE."blogpress_posts_categories` (`Category_ID`, `Name`, `Description`, `Type`) VALUES (NULL, 'Liens', NULL, 'link');";
		$request->exec('query');
		
		$request->query = "ALTER TABLE ".PRE_TABLE."blogpress_posts_categories DROP INDEX Name";
		
		$request->exec('query');	
	}
/**	
 * PostCategory#commit() -> Boolean
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit(){
		
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Category_ID == 0){
			
			$request->fields = 	"`Name`,
								`Description`,
								`Type`";
			$request->values = 	"'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->Description)."',
								'".Sql::EscapeString($this->Type)."'";
			
			System::Fire('blogpress.post.category:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Category_ID = $request->exec('lastinsert');
				
				System::Fire('blogpress.post.category:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Name` = '".Sql::EscapeString($this->Name)."',
								`Description` = '".Sql::EscapeString($this->Description)."',
								`Type` = '".Sql::EscapeString($this->Type)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Category_ID."'";
		
		System::Fire('blogpress.post.category:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('blogpress.post.category:commit.complete', array(&$this));
			return true;
		}
		return false;
	}
/**	
 * PostCategory.ByName(name) -> PostCategory | false
 *
 * Cette méthode retourne une instance [[PostCategory]] contenue en base de données si elle existe.
 **/	
	public static function ByName($name){
		$request = new Request(DB_BLOGPRESS);
		
		$request->from = 	self::TABLE_NAME;
		$request->where =	'Name = "' . Sql::EscapeString($name) .'"';
		
		$result = $request->exec('select');
		
		if($result['length'] > 0){
			return new self($result[0]);	
		}
		
		return false;
	}
/**
 * PostCategory#delete() -> Boolean
 *
 * Cette méthode supprime les informations de la classe de la base de données.
 **/
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Category_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('blogpress.post.category:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * PostCategory.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
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
		}
		
		return 0;	
	}
/**
 * PostCategory.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function execSafe($op){
		
	}
/**
 * PostCategory#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Category_ID." AND Name = '".Sql::EscapeString($this->Name)."' AND Type = '".Sql::EscapeString($this->Type)."'") > 0;
	}
/**
 * PostCategory.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_BLOGPRESS);
		
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
 * PostCategory.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = new Request(DB_BLOGPRESS);
		
		$request->select = 	'*, Name as text, Name as value';
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"Type = 'post'";
		$request->order = 	'Name';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(isset($options->Type)){
			$request->where = "Type = '". Sql::EscapeString($options->Type)."'";	
		}
		
		$request->observe(array(__CLASS__, 'onGetList'));
				
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= " AND (
											Name like '%". Sql::EscapeString($clauses->where) . "%' OR 
											Description like '%". Sql::EscapeString($clauses->where) . "%' OR 
											`Type` like '%".Sql::EscapeString($clauses->where)."%'
										)";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
		//
		// Evenement
		//
		System::Fire('blogpress.post.category:list', array(&$request, $options));	
			
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		//echo $request->query;
		
		return $result; 
	}
/**
 * PostCategory.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/	
	public static function onGetList(&$row, &$request){
			
	}
}

PostCategory::Initialize();
?>