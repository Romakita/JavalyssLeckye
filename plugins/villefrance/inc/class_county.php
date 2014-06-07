<?php
namespace VilleDeFrance;
/** section: Plugins
 * class VilleDeFrance.County
 * includes ObjectTools
 *
 * Cette classe gère la completion des régions
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Appication: Ville de France
 * * Fichier : class_county.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class County extends \ObjectTools{
/**
 * VilleDeFrance.County.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'vf_region';
/**
 * VilleDeFrance.County.PRIMARY_KEY -> String
 * Clef primaire de la table VilleDeFrance.County.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Region_ID';
/**
 * VilleDeFrance.County#Region_ID -> Number
 **/
	public $Region_ID = 		0;
/**
 * VilleDeFrance.County#Region_UP -> String
 **/
 	public $Region_UP =			'';
/**
 * VilleDeFrance.County#Region_UP -> String
 **/
 	public $Region =			'';
/**
 * new VilleDeFrance.County()
 * new VilleDeFrance.County(json)
 * new VilleDeFrance.County(array)
 * new VilleDeFrance.County(obj)
 * new VilleDeFrance.County(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[VilleDeFrance.County]].
 * - array (Array): Tableau associatif équivalent à une instance [[VilleDeFrance.County]]. 
 * - obj (Object): Objet équivalent à une instance [[VilleDeFrance.County]].
 * - id (int): Numéro d'identifiant d'une région. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[VilleDeFrance.County]].
 *
 **/	
	public function __construct(){
		$numargs = 	func_num_args();
		$arg_list = func_get_args();

		if($numargs == 1){
				if(is_numeric($arg_list[0])) {
					$request = 			new \Request();
					$request->from = 	self::TABLE_NAME;
					$request->where =	self::PRIMARY_KEY.' = '.$arg_list[0];
				
					$u = $request->exec('select');
					
					if($u['length'] > 0){
						$this->extend($u[0]);
					}
				}
				elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
				elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
				elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
	}	
/**
 * VilleDeFrance.County.Search(word) -> Array
 * Cette méthode recherche une région.
 **/	
	public static function Search($word){
		$request = 			new \Request();
		$request->select = 	'*, Region as text, Region_ID as value'; 
		$request->from = 	self::TABLE_NAME;
							
		$request->where = 	'Region like "'.\Sql::EscapeString($word).'%"';
							
		$request->limits =	'0,30';
		$request->order =	'Region ASC';
		
		return $request->exec('select');		
	}
/**
 * VilleDeFrance.County.GetCity(departement) -> Array
 * - departement (String): Nom du département.
 *
 * Cette méthode liste les villes de la région.
 **/
	public static function GetCity($county){
		$request = new Request();
		$request->select = '*';
		$request->from = 	County::TABLE_NAME .' B INNER JOIN '. Department::TABLE_NAME .' A ON A.'.County::PRIMARY_KEY.' = B.' .County::PRIMARY_KEY
							. ' INNER JOIN ' . City::TABLE_NAME .' C ON C.'.Department::PRIMARY_KEY.' = A.' .Department::PRIMARY_KEY;
							
		$request->where =  'Region = "'.\Sql::EscapeString($county).'" 
							OR B.'.County::PRIMARY_KEY.' = "'.\Sql::EscapeString($county).'"';
		$request->order =	'Ville_ID ASC';	
		
		return $request->exec('select');
	}
}
?>