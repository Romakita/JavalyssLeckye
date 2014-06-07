<?php
namespace VilleDeFrance;
/** section: Plugins
 * class VilleDeFrance.Department
 * includes ObjectTools
 *
 * Cette classe gère la completion des départements.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Appication: Ville de France
 * * Fichier : class_department.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class Department extends \ObjectTools{
/**
 * VilleDeFrance.Department.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'vf_departement';
/**
 * VilleDeFrance.Department.PRIMARY_KEY -> String
 * Clef primaire de la table Departement.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Departement_ID';
/**
 * VilleDeFrance.Department#Departement_ID -> Number
 **/
	public $Departement_ID 	=	0;
/**
 * VilleDeFrance.Department#Region_ID -> Number
 **/
	public $Region_ID =			0;
/**
 * VilleDeFrance.Department#Code -> Number
 **/
	public $Code =				0;
/**
 * VilleDeFrance.Department#Departement_UP -> String
 **/
	public $Departement_UP =	'';
/**
 * VilleDeFrance.Department#Departement -> String
 **/
	public $Departement =		'';
/**
 * new VilleDeFrance.Department()
 * new VilleDeFrance.Department(json)
 * new VilleDeFrance.Department(array)
 * new VilleDeFrance.Department(obj)
 * new VilleDeFrance.Department(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[VilleDeFrance.Department]].
 * - array (Array): Tableau associatif équivalent à une instance [[VilleDeFrance.Department]]. 
 * - obj (Object): Objet équivalent à une instance [[VilleDeFrance.Department]].
 * - id (int): Numéro d'identifiant d'un département. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[VilleDeFrance.Department]].
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
 * VilleDeFrance.Department.Search(word) -> Array
 * Cette méthode recherche une ville.
 **/	
	public static function Search($word){
		$request = 			new \Request();
		$request->select = 	'*, CONTACT(Code, \' - \', Departement) as text, Departement_ID as value, B.Departement, Region as subtext'; 
		$request->from = 	self::TABLE_NAME.' B INNER JOIN '.County::TABLE_NAME.' C ON C.Region_ID = B.Region_ID';
							
		$request->where = 	'(Departement like "'.\Sql::EscapeString($word).'%"
							OR CONTACT(Code, \' - \', Departement) like "'.\Sql::EscapeString($word).'%"
							OR CONTACT(Departement, \' - \', Code) like "'.\Sql::EscapeString($word).'%"
							OR Region like "'.\Sql::EscapeString($word).'%")';
							
		$request->limits =	'0,30';
		$request->order =	'Departement ASC';
		
		return $request->exec('select');		
	}
/**
 * VilleDeFrance.Department.GetCity(departement) -> Array
 * - departement (String): Nom du département.
 *
 * Cette méthode liste les villes du département.
 **/	
	public static function GetCity($department){
		$request = new \Request();
		$request->select = '*';
		$request->from = 	self::TABLE_NAME .' B INNER JOIN '. City::TABLE_NAME .' A ON A.'.self::PRIMARY_KEY.' = B.' .self::PRIMARY_KEY;
		$request->where =  'Departement = "'.\Sql::EscapeString($department).'" 
							OR B.Departement_ID = "'.\Sql::EscapeString($department).'"';
		$request->order =	'Ville_ID ASC';	
						
		return $request->exec('select');
	}
}
?>