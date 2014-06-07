<?php
/** section: Plugins
 * VilleDeFrance
 *
 * Cette classe gère la base de données des villes de france.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Appication: Ville de France
 * * Fichier : class_city.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
namespace VilleDeFrance;
/** section: Plugins
 * class VilleDeFrance.City
 * includes ObjectTools, iPlugin
 *
 * Cette classe gère la completion des villes et code postaux.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Appication: Ville de France
 * * Fichier : class_city.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class City extends \ObjectTools implements \iPlugin{
/**
 * VilleDeFrance.City.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'vf_ville';
	const TABLE_DEP = 			'vf_departement';
	const TABLE_REG = 			'vf_region';
/**
 * VilleDeFrance.City.PRIMARY_KEY -> String
 * Clef primaire de la table VilleDeFrance.City.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Ville_ID';
/**
 * VilleDeFrance.City.GMAP -> String
 **/	
	const GMAP =				'gmap';
/**
 * VilleDeFrance.City.YAHOO -> String
 **/
	const YAHOO = 				'yahoo';
/**
 * VilleDeFrance.City#Ville_ID -> Number
 **/
	public $Ville_ID =			0;
/**
 * VilleDeFrance.City#INSEE -> String
 **/
	public $INSEE =				'';
/**
 * VilleDeFrance.City#CP -> String
 **/
	public $CP =				'';
/**
 * VilleDeFrance.City#Cheflieu -> Boolean
 **/
	public $Cheflieu =			0;
/**
 * VilleDeFrance.City#Departement_ID -> Number
 **/
	public $Departement_ID =	0;
/**
 * VilleDeFrance.City#Departement -> String
 **/
	public $Departement =		'';
/**
 * VilleDeFrance.City#Region -> String
 **/
	public $Region =			'';
	public $ARTMAJ =			'';
	public $ARTMIN =			'';
/**
 * VilleDeFrance.City#Pays -> String
 **/
	public $Pays =				'France';
/**
 * VilleDeFrance.City#Ville -> String
 * Nom de la ville
 **/	
	public $Ville = 			'';
	public $Ville_UP = 			'';
/**
 * VilleDeFrance.City#Latitude -> String
 **/
 	public $Latitude = 			0.0;
/**
 * VilleDeFrance.City#Longitude -> String
 **/
 	public $Longitude = 		'';
/**
 * VilleDeFrance.City#Altitude -> String
 **/
 	public $Altitude = 		'';
/**
 * new VilleDeFrance.City()
 * new VilleDeFrance.City(json)
 * new VilleDeFrance.City(array)
 * new VilleDeFrance.City(obj)
 * new VilleDeFrance.City(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[VilleDeFrance.City]].
 * - array (Array): Tableau associatif équivalent à une instance [[VilleDeFrance.City]]. 
 * - obj (Object): Objet équivalent à une instance [[VilleDeFrance.City]].
 * - id (int): Numéro d'identifiant d'une ville. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[VilleDeFrance.City]].
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
 * VilleDeFrance.City.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	public static function Initialize(){
		\System::Observe('gateway.safe.exec', array(__CLASS__, 'execSafe'));
		\System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		\System::Observe('plugin.active', array(__CLASS__,'Install')); 
		\System::Observe('plugin.deactive', array(__CLASS__,'Uninstall')); 
		
		include_once('class_department.php');
		include_once('class_county.php');
	}
/**
 * VilleDeFrance.City.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
	public static function Install(){		
		@session_commit();
		set_time_limit(0);
		ignore_user_abort(true);
		
		\Sql::Current()->parse(VDF_PATH.'sql/vf_ville.sql');
		\Sql::Current()->parse(VDF_PATH.'sql/vf_departement.sql');
		\Sql::Current()->parse(VDF_PATH.'sql/vf_region.sql');
	}
/**
 * VilleDeFrance.City.Uninstall(eraseData) -> void
 * - eraseData (Boolean): Suppression de données. 
 *
 * Cette méthode désintalle  l'extension et supprime les données liées à l'extension si `eraseData` est vrai.
 **/
	public static function Uninstall($erase = false){
		
		if($erase){
			$request = 			new \Request();
			$request->from = 	self::TABLE_NAME;
			$request->exec('drop');
			
			$request->from = 	Department::TABLE_NAME;
			$request->exec('drop');
			
			$request->from = 	County::TABLE_NAME;
			$request->exec('drop');
		}
	}
/**
 * VilleDeFrance.City.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){
		
		switch($op){
			case 'city.install':
				self::Install();
				echo "Database installé";
				break;							
						
			case 'department.search':
			case 'department.list':
			case 'departement.search':
			case 'departement.list':
				$tab = Department::Search(@$_POST['word']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				break;
			
			case 'county.search':
			case 'county.list':
			case 'region.search':
			case 'region.list':
				$tab = County::Search(@$_POST['word']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				break;
					
			case 'city.list':
			case 'city.search':
			case 'ville.france.search':
				
				$tab = self::Search($_POST['word']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				
				break;
				
			case 'city.proximity':/**/
			case 'ville.proximity':
				$tab = self::Proximity($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				break;
		}
		return 0;
	}
/**
 * VilleDeFrance.City.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	public static function execSafe($op){
		
		switch($op){
			case 'department.search':
			case 'department.list':
			case 'departement.search':
			case 'departement.list':
				$tab = Department::Search(@$_POST['word']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				break;
			
			case 'county.search':
			case 'county.list':
			case 'region.search':
			case 'region.list':
				$tab = County::Search(@$_POST['word']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				break;
				
			case 'city.list':
			case 'city.search':
			case 'ville.france.search':
					
				$tab = self::Search(@$_POST['word']);
				
				if(!$tab){
					return $op.'err';
				}
			
				echo json_encode($tab);
				break;
			
			case 'city.proximity':/**/
			case 'ville.proximity':
				echo json_encode(self::Proximity($_POST['clauses'], $_POST['options']));
				break;
		}
	}
	
	public function assocDepartement(){
		$request = 			new \Request();
		$request->select = 	'*';
		$request->from = 	Department::TABLE_NAME;
		$request->where =	"Code = '".\Sql::EscapeString($this->Departement_ID)."'";
		
		$result = $request->exec('select');
		if($result){
			if($result['length'] > 0){
				$this->Departement_ID = $result[0]['Departement_ID'];
			}else{
			/*	var_dump('error assocDepartement');
				var_dump($this);
				var_dump($request);
				exit();*/
			}
		}
	}
/**
 * VilleDeFrance.City.Geocode(addr, type) -> Ville
 *
 * Cette méthode permet de récupérer le géocode de la ville, adresse ou autre position.
 **/	
	static function Geocode($addr, $type = 'gmap'){
		
		$ville = new self();
		$addr = str_replace('%2B', '+', rawurlencode(str_replace(' ', '+', $addr)));
		
		switch($type){
			case 'gmap':
				$uri = 		'http://maps.googleapis.com/maps/api/geocode/json?address='. $addr.  '&sensor=false';
				$object = 	json_decode(Stream::Get($uri));
				
				if(is_object($object)){
					if(@$object->results){
						//var_dump($object->results[0]);
												
						foreach($object->results[0]->address_components as $component){
							switch($component->types[0]){
								case 'postal_code':
									$ville->CP = $component->short_name;
									break;
								case 'locality':
									$ville->Ville =	$component->short_name;
									break;
								case 'administrative_area_level_2':
									$ville->Departement =		$component->long_name;
									$ville->Departement_ID =	$component->short_name;
									break;
								case 'administrative_area_level_1':
									$ville->Region =			$component->long_name;
									break;
								case 'country':
									$ville->Pays =			$component->long_name;
									break;
							}
						}
											
						$ville->Latitude = 			$object->results[0]->geometry->location->lat;
						$ville->Longitude =			$object->results[0]->geometry->location->lng;
						$ville->Ville = $ville->adress_formated = 	str_replace(array($ville->CP, ', France', '  '), array('', '', ' '), $object->results[0]->formatted_address);
						//$ville->assocDepartement();
						//$ville->extend($object->results[0]);
						return $ville;
					}
				}
				
				break;
				
			case 'yahoo':
				$uri = 		'http://where.yahooapis.com/geocode?q='. $addr .'&appid=&flags=J';
				$object = 	json_decode(Stream::Get($uri));
				
				if(is_object($object)){
					
					if(@$object->ResultSet->Results[0]){
						//var_dump($object->ResultSet->Results[0]->name);
						if(!(empty($object->ResultSet->Results[0]->city) && empty($object->ResultSet->Results[0]->name) && empty($object->ResultSet->Results[0]->line2))){
							//$ville->extend($object->ResultSet->Results[0]);
							
							$ville->Pays =			$object->ResultSet->Results[0]->country;
							$ville->Departement = 	$object->ResultSet->Results[0]->county;
							$ville->Departement_ID = $object->ResultSet->Results[0]->countycode;
							$ville->Region = 		$object->ResultSet->Results[0]->state;
							$ville->Latitude = 		$object->ResultSet->Results[0]->latitude;
							$ville->Longitude = 	$object->ResultSet->Results[0]->longitude;
							
							if(!empty($object->ResultSet->Results[0]->city)){
								$ville->Ville = $object->ResultSet->Results[0]->city;
							}elseif(!empty($object->ResultSet->Results[0]->name)){
								$ville->Ville = $object->ResultSet->Results[0]->name;
							}elseif(!empty($object->ResultSet->Results[0]->line2)){
								$ville->Ville =	$object->ResultSet->Results[0]->line2;
							}
														
							if(!empty($object->ResultSet->Results[0]->uzip)) $ville->CP = $object->ResultSet->Results[0]->uzip;
							
							if(!empty($object->ResultSet->Results[0]->neighborhood)){
								$ville->Ville = $object->ResultSet->Results[0]->neighborhood . ', ' . $ville->Ville;
							}
							
							if($ville->Departement_ID == ''){
								
									if(substr($ville->CP, 0, 2) < '96'){
										$ville->Departement_ID = substr($ville->CP, 0, 2);
										$ville->assocDepartement();
									}else{
										//var_dump('error switch departement');
										//var_dump($object->ResultSet->Results[0]);
										//var_dump($ville);
										//exit();
									}
								/*switch($ville->Departement){
									default:
										if($ville->Pays != 'France'){
											switch($ville->Pays){
												case 'Saint Pierre and Miquelon':
													$ville->Departement_ID = substr($ville->CP, 0, 3);
													break;
											}
										}else{
											
										}
									case 'Rhone-Alpes':
											
									case 'Southern Corsica':
										$ville->Departement_ID = '2A';
										break;
									case 'Northern Corsica':
										$ville->Departement_ID = '2B';
										break;
								}*/
									
							}else{
								$ville->assocDepartement();	
							}
							
							
							
							return $ville;
						}
					}
				}
				break;
		}
							
		return $ville;
	}
/**
 * VilleDeFrance.City.Proximity([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste les villes proches des coordonnées demandées.
 **/	
	static function Proximity($clauses = NULL, $options = NULL){
		
		if(empty($options)){
			return false;	
		}
			
		if(!empty($options->address)){//geolocalisation à partir d'une adresse
			$tab = self::Search($options->address);
			
			if($tab['length'] == 0){
				return false;
			}
			
			$ville = new self($tab[0]);
			$options->latitude = $ville->Latitude;
			$options->longitude = $ville->Longitude;
		}		
		
		if(!is_numeric($options->radius)){
			$options->radius = 20;
		}
		
		$request = 			new \Request();
		$request->select = 	'A.*, Ville as Nom, Ville as text, Ville_ID as value, B.Departement, C.Region,';
		$request->select .= '( 6371 * acos( cos( radians('.(float) $options->latitude.') ) * cos( radians( Latitude) ) * cos( radians( Longitude ) - radians('. (float) $options->longitude.') ) + sin( radians('.(float) $options->latitude.') ) * sin( radians( Latitude) ) ) ) AS distance';
		
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.self::TABLE_DEP.' B ON A.Departement_ID = B.Departement_ID
							INNER JOIN '.self::TABLE_REG.' C ON C.Region_ID = B.Region_ID';
		$request->where = 	' 1 ';			
		$request->order =	'distance ASC, Ville';
		$request->limits =	'0,30';
		
		if(is_array(@$options->includeAddress)){
			$array = array();
			
			foreach($options->includeAddress as $value){
				$array = \Sql::EscapeString($value);
			}
			
			$array = implode('\', \'');
			
			$request->where .= " AND (
				Ville IN('".$array."')
				OR CONCAT(CP, ' ', Ville) IN('".$array."')
				OR CONCAT(Ville, ' ', CP) IN('".$array."')
			)";
		}
		
		if(is_array(@$options->includeID)){
			$array = array();
			
			foreach($options->includeID as $value){
				$array = \Sql::EscapeString($value);
			}
			
			$array = implode('\', \'');
			
			$request->where .= " AND Ville_ID IN('".$array."')";
		}
		
		
		if(!empty($clauses)){
			if(@$clauses->where) {
								
				$request->where .= " AND (
										Ville like '%". \Sql::EscapeString($clauses->where) . "%'
										OR CP like '%". \Sql::EscapeString($clauses->where) . "%'
										OR Departement like '%". \Sql::EscapeString($clauses->where) . "%'
										OR Region like '%". \Sql::EscapeString($clauses->where) . "%'
										OR CONCAT(CP, ' ', Ville) like '".\Sql::EscapeString($word)."%'
										OR CONCAT(Ville, ' ', CP) like '".\Sql::EscapeString($word)."%'
									)";
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
		
		$request->where .= ' HAVING distance < '.$options->radius; 
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = \Sql::Count($request->from, $request->where);
		}
		
		return $result;
	}
/**
 * VilleDeFrance.City.Search(word) -> Array
 * - word (String): Ville à rechercher.
 *
 * Cette méthode recherche une ville.
 **/	
	public static function Search($word){
		$request = new \Request();
		$request->select = 'A.*, Ville as Nom, CONCAT(Ville,\', \', CP, \' (\', B.Departement, \')\') as text, Ville_ID as value, B.Departement, C.Region'; 
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.Department::TABLE_NAME.' B ON A.Departement_ID = B.Departement_ID
							INNER JOIN '.County::TABLE_NAME.' C ON C.Region_ID = B.Region_ID';
							
		$request->where = 	'Ville like "'.\Sql::EscapeString($word).'%" 
							OR CP like "'.\Sql::EscapeString($word).'%" 
							OR Departement like "'.\Sql::EscapeString($word).'%"
							OR Region like "'.\Sql::EscapeString($word).'%"
							OR CONCAT(CP, " ", Ville) like "'.\Sql::EscapeString($word).'%"
							OR CONCAT(Ville, " ", CP) like "'.\Sql::EscapeString($word).'%"
							';
							
		$request->limits =	'0,30';
		$request->order =	'Ville ASC';
		
		return $request->exec('select');		
	}
/**
 * VilleDeFrance.City.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/
	public static function GetList($clauses = '', $options = ''){
		$request = 			new \Request();
		
		$request->select = 'A.*, Ville as Nom, CONCAT(Ville,\', \', CP, \' (\', B.Departement, \')\') as text, Ville_ID as value, B.Departement, C.Region'; 
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.Department::TABLE_NAME.' B ON A.Departement_ID = B.Departement_ID
							INNER JOIN '.County::TABLE_NAME.' C ON C.Region_ID = B.Region_ID';
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(isset($options->Departement_ID)){
			$request->where .=	' AND A.'. Department::PRIMARY_KEY . '  = ' . (int) $options->Departement_ID;
		}
		
		if(isset($options->Region_ID)){
			$request->where .=	' AND B.'. County::PRIMARY_KEY . '  = ' . (int) $options->Region_ID;
		}
				
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= ' 	
							AND (Ville like "'.\Sql::EscapeString($word).'%" 
							OR CP like "'.\Sql::EscapeString($word).'%" 
							OR Departement like "'.\Sql::EscapeString($word).'%"
							OR Region like "'.\Sql::EscapeString($word).'%"
							OR CONCAT(CP, " ", Ville) like "'.\Sql::EscapeString($word).'%"
							OR CONCAT(Ville, " ", CP) like "'.\Sql::EscapeString($word).'%")';
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		\System::Fire('city:list', array(&$request, $options));
				
		$request->exec('select');
		
		if($result){
			$request['maxLength'] = \Sql::Count($request->from, $request->where);
			
			if(!empty($options->default)){
				$request->setResult(array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : MUI('Choisissez'), 'value' => 0
				)), $request->getResult()));
					
				$request['length'] = $request['length']+1;	
			}
		}
		
		return $request->getResult(); 	
	}
/**
 * VilleDeFrance.City.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/
	public static function onGetList(&$row, &$request){
		
	}
}

City::Initialize();
?>