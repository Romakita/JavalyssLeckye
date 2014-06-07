<?php
/** section: AppsMe
 * class AppCategory 
 * includes ObjectTools
 *
 * Cette classe gère l'édition et la lecture d'article.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_AppCategory.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define("TABLE_APP_CATEGORY", PRE_TABLE.'applications_categories');
class AppCategory extends ObjectTools implements iClass{
/**
 * AppCategory.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APP_CATEGORY;
/**
 * AppCategory.PRIMARY_KEY -> String
 * Clef primaire de la table AppCategory.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Category_ID';
/**
 * AppCategory.Category_ID -> Number
 * Numéro d'identification de la categorie.
 **/
	public $Category_ID = 		0;
/**
 * AppCategory.Title -> String
 **/
	public $Title =				'';
/**
 * AppCategory.Description -> String
 **/
 	public $Description =		'';
/**
 * AppCategory.Type -> String
 **/	
	public $Level =				0;
/**
 * Posts.limits -> Number
 **/
	public $limits = 			'';
/**
 * Posts.order -> Number
 **/
	public $order = 			'Title';
/**
 * Posts.where -> String
 **/
	public $where =				'';
/**
 * new AppCategory()
 * new AppCategory(json)
 * new AppCategory(array)
 * new AppCategory(obj)
 * new AppCategory(id)
 * - json (String): Chaine de caractère JSON équivalent à une instance [[AppCategory]].
 * - array (Array): Tableau associatif équivalent à une instance [[AppCategory]]. 
 * - obj (Object): Objet équivalent à une instance [[AppCategory]].
 * - societeid (int): Numéro d'identifiant d'une categorie. Les informations seront récupérés depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[AppCategory]].
 *
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_int($arg_list[0])) {
				//Informations de société
				$request = 			new Request();
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				
				$this->extend($u[0]);
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
	}
/**
 * AppCategory.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".TABLE_APP_CATEGORY." (
		  `Category_ID` int(2) NOT NULL AUTO_INCREMENT,
		  `Title` varchar(200) NOT NULL,
		  `Description` text NOT NULL,
		  `Level` tinyint(2) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`Category_ID`)
		) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 PACK_KEYS=0";
		$request->exec('query');	
	}
	
	public static function Initialize(){
		
	}
/**
 * AppCategory.commit() -> boolean
 *
 * Cette méthode ajoute l'instance [[AppCategory]] à la base de données si cette dernière n'existe pas. 
 * Si l'instance existe, ses informations seront sauvegardés en base de données.
 *
 * Cette méthode retourne vrai en cas de succès.
 **/
 	public function commit(){
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Category_ID == 0){
			
			$request->fields = "(`Category_ID`, `Title`, `Description`, `Level`)";
			$request->values = "(	NULL,
									'".Sql::EscapeString($this->Title)."',
									'".Sql::EscapeString($this->Description)."',
									'".Sql::EscapeString($this->Level)."')";

			
			if(!$request->exec('insert')) return false;
			$this->Event_ID = $request->exec('lastinsert');
						
			return true;
		}
					
		$request->where = "`Category_ID` = ".$this->Category_ID;
		$request->set = "
						`Title` = '".Sql::EscapeString($this->Title)."', 
						`Description` = '".Sql::EscapeString($this->Description)."',
						`Level` = '".Sql::EscapeString($this->Level)."'";
	
		return $request->exec('update');			
	}
/**
 * AppCategory.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes doivent avoir un objet [[Post]] au format `JSON` dans `$_POST['Post']`.
 *
 * * `societe.commit`: Enregistre les informations de l'instance en base de données.
 *
 **/	
	public static function exec($op){
		
		switch($op){
			case "appcategory.commit":
				$category = new AppCategory($_POST['Category']);
				
				if(!$category->commit()){
					return $op.'.err';	
				}
				
				echo json_encode($category);
				
				break;
				
			case "appcategory.list.commit":
				
				$categories = self::DecodeJSON($_POST['Categories']);
				
				foreach($categories as $category){
					$category = new AppCategory($category);
					
					if($category->Category_ID == 0){
						continue;
					}
					
					if(!$category->commit()){
						return $op.'.err';	
					}
				}
				
				echo json_encode(true);
				
				break;
				
			case "appcategory.delete":
				$category = new AppCategory($_POST['Category']);
				
				if(!$category->delete()){
					return $op.'.err';	
				}
				
				echo json_encode($category);
				
				break;
				
			case "appcategory.list":			
				
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;	
		}
	}
/**
 * AppCategory.delete() -> Boolean
 *
 * Cette méthode supprime l'événement de la base de données.
 **/	
	public function delete(){
		$request =			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY.' = '.$this->Category_ID;
		
		return $request->exec('delete');
	}
/**
 * AppCategory.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des sociétés du logiciel en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * Pas d'option.
 *
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = new Request();
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->order = 	'Category_ID';
		
		if(empty($options->empty)){
			$request->where = 	' Title != ""';	
		}
		
		if(!empty($options->exclude)){
			if(is_array($options->exclude)){
				$options->exclude = implode("', '", $options->exclude);
			}else{
				$options->exclude = Sql::EscapeString($options->exclude);
			}
			
			$request->where = "Category_ID NOT IN ('".$options->exclude."')";
		}
		
		switch(@$options->op){
			case '-select':
				$request->select = 	'*, Title as text, Category_ID as value';
				break;
			default:break;
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= " AND (
											Title like '%". Sql::EscapeString($clauses->where) . "%'
											OR Description like '%". Sql::EscapeString($clauses->where) . "%'
										)";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		//echo $request->query;
		
		return $result; 
	}
	
	public static function onGetList(&$row, &$request){
		
	}
	
	public static function Draw($options = NULL){
		$options = new self($options);
		
		if($options->order == ''){
			$options->order = 'Title';
		}
		
		$options = 				self::GetList($options, $options);
		
		$string =				'';		
		$string .= 				'<ul class="list app-category-list">';
		
		for($i = 0; $i < $options['length']; $i++){
			$string .= '<li class="app-category appcat-'.$options[$i]['Category_ID'].' appcat-'.Post::Sanitize($options[$i]['Title']).'"><a href="">'.$options[$i]['Title'].'</a></li>';	
		}
		
		$string .= 				'<div class="clearfloat"></div></ul>';
		
		echo $string;
	}
	
}
?>