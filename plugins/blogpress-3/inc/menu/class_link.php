<?php
/** section: BlogPress
 * class BpLink 
 * includes ObjectTools
 *
 * Cette classe gère l'édition et la lecture d'article.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_link.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define("TABLE_LINKS", PRE_TABLE.'blogpress_links');
class BlogPressLink extends ObjectTools implements iClass{
	
	const PRE_OP =				'blogpress.link.';
/**
 * BlogPressLinkTABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_LINKS;
/**
 * BlogPressLinkPRIMARY_KEY -> String
 * Clef primaire de la table BlogPressLinkTABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Link_ID';
/**
 * BlogpresLink#Link_ID -> Number
 **/
	public $Link_ID = 0;
/**
 * BlogpresLink#Title -> String
 * Varchar
 **/
	public $Title = "";
/**
 * BlogpresLink#Uri -> String
 * Varchar
 **/
	public $Uri = "";
/**
 * BlogpresLink#Statut -> Number
 **/
	public $Statut = 1;
/**
 * BlogpresLink#Category -> String
 * Varchar
 **/
	public $Category = "";
/**
 * BlogpresLink#Relation -> String
 * Varchar
 **/
	public $Relation = "";
/**
 * BlogpresLink#Description -> String
 * Varchar
 **/
	public $Description = "";
/**
 * BlogpresLink#Target -> String
 * Varchar
 **/
	public $Target = '_none';
/**
 * BlogpresLink#Order -> Number
 **/
	public $Order = 0;
	
	protected static $List = NULL;
	protected static $Link = NULL;
/**
 * new BpLink()
 * new BpLink(json)
 * new BpLink(array)
 * new BpLink(obj)
 * new BpLink(id)
 * - json (String): Chaine de caractère JSON équivalent à une instance [[BpLink]].
 * - array (Array): Tableau associatif équivalent à une instance [[BpLink]]. 
 * - obj (Object): Objet équivalent à une instance [[BpLink]].
 * - societeid (int): Numéro d'identifiant d'un lien. Les informations seront récupérés depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[BpLink]].
 *
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request(DB_BLOGPRESS);
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				
				$this->extend($u[0]);
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
	}
/**
 * BlogpresLink.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
		include_once('class_link_collection.php');
		
		System::EnqueueScript('blogpress.link', Plugin::Uri().'js/blogpress_link.js');
		
	}
/**
 * BlogpresLink.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->query = 	"RENAME TABLE `".PRE_TABLE."blogpress_link` TO `".PRE_TABLE."blogpress_links`";
		$request->exec('query');
		
		$request->query = 	"CREATE TABLE `".PRE_TABLE."blogpress_links` (
		  `Link_ID` int(3) NOT NULL AUTO_INCREMENT,
		  `Title` varchar(255) NOT NULL,
		  `Uri` varchar(255) NOT NULL,
		  `Statut` tinyint(1) NOT NULL DEFAULT '1',
		  `Category` varchar(255) NOT NULL,
		  `Relation` varchar(255) NOT NULL,
		  `Description` varchar(255) NOT NULL,
		  `Target` varchar(6) NOT NULL DEFAULT '_none',
		  `Order` int(3) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`Link_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');	
		
		
	}
/**
 * BlogPressLinkcommit() -> boolean
 *
 * Cette méthode ajoute l'instance [[BpLink]] à la base de données si cette dernière n'existe pas. 
 * Si l'instance existe, ses informations seront sauvegardés en base de données.
 *
 * Cette méthode retourne vrai en cas de succès.
 **/
 	public function commit(){
		
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Link_ID == 0){
			
			$request->fields = 	"`Title`,
								`Uri`,
								`Statut`,
								`Category`,
								`Relation`,
								`Description`,
								`Target`,
								`Order`";
			$request->values = 	"'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Uri)."',
								'".Sql::EscapeString($this->Statut)."',
								'".Sql::EscapeString($this->Category)."',
								'".Sql::EscapeString($this->Relation)."',
								'".Sql::EscapeString($this->Description)."',
								'".Sql::EscapeString($this->Target)."',
								'".Sql::EscapeString($this->Order)."'";
			
			System::Fire('blogpress.link:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Link_ID = $request->exec('lastinsert');
				
				System::Fire('blogpress.link:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Title` = '".Sql::EscapeString($this->Title)."',
								`Uri` = '".Sql::EscapeString($this->Uri)."',
								`Statut` = '".Sql::EscapeString($this->Statut)."',
								`Category` = '".Sql::EscapeString($this->Category)."',
								`Relation` = '".Sql::EscapeString($this->Relation)."',
								`Description` = '".Sql::EscapeString($this->Description)."',
								`Target` = '".Sql::EscapeString($this->Target)."',
								`Order` = '".Sql::EscapeString($this->Order)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Link_ID."'";
		
		System::Fire('blogpress.link:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('blogpress.link:commit.complete', array(&$this));
			return true;
		}
		return false;			
	}
/**
 * BlogpresLink#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Link_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('blogpress.link:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * BlogPressLinkexec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes doivent avoir un objet [[BpLink]] au format `JSON` dans `$_POST['BpLink']`.
 *
 * * `societe.commit`: Enregistre les informations de l'instance en base de données.
 *
 **/	
	static public function exec($op){
		
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
				
			case self::PRE_OP."group.list":
				
				echo json_encode(self::GetListByGroup());
				
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
	}
/**
 * BlogpresLink.Distinct(field [, word]) -> Array
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
	
	public static function Title(){
		return self::Current()->Title;
	}
	
	public static function Description(){
		return self::Current()->Description;
	}
	
	public static function Relation(){
		return self::Current()->Relation;
	}
	
	public static function Target(){
		return self::Current()->Target;
	}
	
	public static function Permalink(){	
		return Blog::GetInfo(self::Current()->Uri);
	}
	
	public static function Equals($link, $link2){
		if(!preg_match('/\/$/', $link)){
			$link = $link.'/';
		}
		
		if(!preg_match('/\/$/', $link2)){
			$link2 = $link2.'/';
		}
		
		return str_replace('www.', '', $link) == str_replace('www.', '', $link2);	
	}
	
	public static function ToHTML(){
		$link = self::Current();
		
		$selected = self::Equals(Blog::GetInfo($link->Uri), Blog::GetPermalink()) ? ' selected' : '';
		$target = 	$link->Target == '_none' ? "" : ' target="_blank"';
		
		return '<a href="'.Blog::GetInfo($link->Uri).'"'.$target.' rel="'.$link->Relation.'" title="'.$link->Description.'"><span>'. $link->Title .'</span></a>';
	}
/**
 * BlogpresLink.Next() -> BlogpresLink | False
 * Cette méthode le prochaine élément du panier.
 **/	
	public static function Next(){
		$link = next(self::$List);
		
		if(is_array($link)){
			return self::$Link = new self($link);
		}else{
			return false;	
		}
	}
/**
 * BlogpresLink.Prev() -> BlogpresLink | False
 * Cette méthode l'élément précèdent du panier.
 **/	
	public static function Prev(){
		$link = prev(self::$List);
		
		if(is_array($link)){
			return self::$Link = new self($link);
		}else{
			return false;	
		}
	}
/**
 * MyStoreBasket.Current() -> BlogpresLink | False
 * Cette méthode l'élément courrant du panier.
 **/	
	public static function Current(){
		if(empty(self::$List)){
			return false;	
		}
		
		$link = current(self::$List);
		
		if(is_array($link)){
			return self::$Link = new self($link);
		}else{
			return false;	
		}
	}
/**
 * MyStoreBasket.Reset() -> BlogpresLink | False
 * Remet le pointeur interne de tableau au début.
 **/	
	public static function Reset(){
		$link = reset(self::$List);
		
		if(is_array($link)){
			return self::$Link = new self($link);
		}else{
			return false;	
		}
	}
/**
 * BlogPressLinkByCategory(category) -> jCarousel
 * - name (String): Nom du carrousel.
 *
 * `final` `static` Cette méthode récupère les informations d'un carrousel à partir de son nom.
 **/	
	static public function ByCategory($name, $op = ''){
		$options =	new stdClass();
		
		$cat = new PostCategory();
		$cat->Name = $name;
		$cat->Type = 'link';
		
		if(!$cat->exists()){
			$cat->commit();
		}
				
		if(is_object($op) || is_array($op)){
			foreach($op as $key=>$value){
				$options->$key = $value;	
			}
		}
		
		$options->Category = $name;
		
		return self::GetList($options, $options);
	}
	
	public static function GetListByGroup(){
		$options = 			new stdClass();
		$options->Type = 	'link';
		
		$categories = 		PostCategory::GetList($options, $options);
		$array = array();
		
		for($i = 0; $i < $categories['length']; $i++){
			$options = 				new stdClass();
			$options->Category =	$categories[$i]['Name'];
			
			$array[$categories[$i]['Name']] = self::GetList($options, $options);
					
		}
		return $array;
	}
/**
 * BlogpresLink.GetList([clauses [, options]]) -> Array | boolean
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
				
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 '; 
		$request->order = 	'`Order`, Link_ID';
		
		if(isset($options->Category)){
			$request->where = "Category like '%" . $options->Category . "%'"; 	
		}
		
		$request->onexec = array(__CLASS__, 'onGetList');
			
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Link_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Uri` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Statut` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Category` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Relation` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Description` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Target` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Order` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = str_replace('Order', '`Order`', $clauses->order);
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('blogpress.link:list', array(&$request, $options));
		
		$result = $request->exec('select');
		
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return self::$List = $result; 
	}
	
	public static function onGetList(&$row, &$request){
		if(strpos($row['Uri'], 'post:') !== false){
			
			$row['PostTitle'] = Post::Get($row['Uri']);		
			
			if(!$row['PostTitle']){
				return true;
			}
			
			$row['PostUri'] = 	Blog::GetInfo($row['Uri']);
			$row['PostTitle'] = $row['PostTitle']->Title;
		}
	}
}

class BpLink extends BlogPressLink{
	
}

BlogPressLink::Initialize();
?>