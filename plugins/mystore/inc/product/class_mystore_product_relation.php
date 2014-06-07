<?php
/** section: MyStore
 * class MystoreProductRelation
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_product_relation.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MystoreProductRelation extends ObjectTools{	
	const PRE_OP =				'mystore.product.relation.';
/**
 * MystoreProductRelation.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_products_relations';	
/**
 * MystoreProductRelation.PRIMARY_KEY -> String
 * Clef primaire de la table MystoreProductRelation.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Post_ID, Related_ID';

/**
 * MystoreProductRelation#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * MystoreProductRelation#Related_ID -> Number
 **/
	public $Related_ID = 0;
/**
 * new MystoreProductRelation()
 * new MystoreProductRelation(json)
 * new MystoreProductRelation(array)
 * new MystoreProductRelation(obj)
 * new MystoreProductRelation(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MystoreProductRelation]].
 * - array (Array): Tableau associatif équivalent à une instance [[MystoreProductRelation]]. 
 * - obj (Object): Objet équivalent à une instance [[MystoreProductRelation]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MystoreProductRelation]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 2){
			$this->Post_ID = 		$arg_list[0];
			$this->Related_ID = 	$arg_list[1];
		}
	}
/**
 * MystoreProductRelation.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
		System::EnqueueScript('mystore.product.relation', Plugin::Uri().'js/mystore_product_relation.js');
	}
/**
 * MystoreProductRelation.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `mystore_products_relations` (
		  `Post_ID` bigint(20) NOT NULL,
		  `Related_ID` bigint(20) NOT NULL,
		  PRIMARY KEY (`Post_ID`,`Related_ID`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
	}
/**	
 * MystoreProductRelation#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if (!$this->exists()){
			
			$request->fields = 	"`Post_ID`,
								`Related_ID`";
								
			$request->values = 	"'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Related_ID)."'";
			
			System::Fire('mystore.product.relation:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Related_ID = $request->exec('lastinsert');
				
				System::Fire('mystore.product.relation:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		return true;
	}	
/**
 * MystoreProductRelation#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		
		$keys = explode(',', self::PRIMARY_KEY);
		$request->where =	'
			(' . $keys[0] .' = '.$this->Post_ID . ' AND ' .$keys[1] .' = '. $this->Related_ID . ')
			OR
			(' . $keys[1] .' = '.$this->Post_ID . ' AND ' .$keys[0] .' = '. $this->Related_ID . ')';
		
		if($request->exec('delete')){
			System::Fire('mystore.product.relation:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * MystoreProductRelation.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."commit":
				$postID = 	$_POST['Post_ID'];
				$list = 	$_POST['options'];
				
				foreach($list as $relatedID){
					$relation = new self($postID, $relatedID);
					$relation->commit();
				}
				
				break;
				
			case self::PRE_OP."delete":
				$postID = 	$_POST['Post_ID'];
				$list = 	$_POST['options'];
				
				foreach($list as $relatedID){
					$relation = new self($postID, $relatedID);
					$relation->delete();
				}
				
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
 * MystoreProductRelation.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MystoreProductRelation#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){	
		$keys = explode(',', self::PRIMARY_KEY);		
		
		$where =	'
			(' . $keys[0] .' = '.$this->Post_ID . ' AND ' .$keys[1] .' = '. $this->Related_ID . ')
			OR
			(' . $keys[1] .' = '.$this->Post_ID . ' AND ' .$keys[0] .' = '. $this->Related_ID . ')';
		
		return Sql::Count(self::TABLE_NAME, $where) > 0;
	}
/**
 * MystoreProductRelation.Distinct(field [, word]) -> Array
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
 * MystoreProductRelation.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*, CONCAT(Pr.Collection, ", ", Po.Title, " (Code: ", Product_Code, ")") as text, Po.Post_ID as value';
		$request->from = 	MyStoreProduct::TABLE_NAME . ' Pr INNER JOIN '. Post::TABLE_NAME. ' Po ON Po.'.Post::PRIMARY_KEY . ' = Pr.'.Post::PRIMARY_KEY;
		$request->where =	'Type like "%page-mystore product%"'; 
		$request->order = 	'Po.Title ASC';
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array('MyStoreProduct', 'onGetList'));
		
		//$request->observe(array(__CLASS__, 'onGetList'));
		
		if(!User::IsConnect()){
			$request->where .=	' AND Po.Statut LIKE "%publish%" ';	
			$request->where .=	' AND Po.Statut NOT LIKE "%private%" ';
		}else{
			if(empty($options->draft)){
				$request->where .=	' AND Po.Statut LIKE "%publish%" ';	
			}
		}		
		
		switch(@$options->op){
			default:
				if(isset($options->Post_ID)){
			
					$request->where .=	' 
							AND (
								Pr.' . MyStoreProduct::PRIMARY_KEY . ' IN (
									SELECT Related_ID
									FROM '.self::TABLE_NAME . '
									WHERE Post_ID = ' . (int) $options->Post_ID . '
								)
								OR Pr.' . MyStoreProduct::PRIMARY_KEY . ' IN(
									SELECT Post_ID
									FROM '.self::TABLE_NAME . '
									WHERE Related_ID = ' . (int) $options->Post_ID . '
								)
							)';
				}
				
				break;
				
			case '-not':
				
				$request->where .=	' AND Pr.'.MyStoreProduct::PRIMARY_KEY.' != ' . (int) $options->Post_ID;
				
				if(!empty($options->exclude)){
					$request->where .=	' AND Pr.'.MyStoreProduct::PRIMARY_KEY.' NOT IN (' . implode(',', $options->exclude) . ')';
				}else{
					$request->where .=	' 
									AND Pr.' . MyStoreProduct::PRIMARY_KEY . ' NOT IN(
											SELECT Related_ID
											FROM '.self::TABLE_NAME . '
											WHERE Post_ID = ' . (int) $options->Post_ID . '
										)
										
									AND Pr.' . MyStoreProduct::PRIMARY_KEY . ' NOT IN(
										SELECT Post_ID
										FROM '.self::TABLE_NAME . '
										WHERE Related_ID = ' . (int) $options->Post_ID . '
									)';	
				}
				
				if(isset($options->word)){
					
					$request->where .= " AND (
						`Title` like '%".Sql::EscapeString($options->word)."%' OR 
						`Product_Code` like '%".Sql::EscapeString($options->word)."%' OR 
						`Collection` like '%".Sql::EscapeString($options->word)."%'
					)";
				}
				
				
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Field as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('mystore.product.relation:list', array(&$request, $options));
			
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row){
			
	}
}

MystoreProductRelation::Initialize();

?>