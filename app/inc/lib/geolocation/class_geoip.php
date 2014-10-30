<?php
/** section: Library
 * class GeoIP
 * Cette classe permet de récuperer la localisation de l'utilisateur à partir de son adresse IP en utilisant l'extension GeoIP.
 * Si ce dernier n'est pas disponible sur le serveur, le script utilisateur le service web GeoPlugin.
 *
 * #### Informations
 * 
 * * Package : Geolocation
 * * Fichier : class_geoip.php
 * * Version : 1.0
 * * Auteur : Lenzotti Romain
 * * Statut : BETA
 * * Service web utilisé : http://www.geoplugin.com/
 *
 **/
if(!class_exists('GeoIP')):

require_once('class_stream.php');
require_once('class_object_tools.php');

class GeoIP extends ObjectTools{
/**
 * GeoIP.URI -> String
 * Adresse de l'API GeoPlugin.
 **/
	const URI = 			'http://www.geoplugin.net/json.gp?ip={IP}';	
/**
 * GeoIP#ip -> String
 **/
	public $ip = 			null;
/**
 * GeoIP#city -> String
 **/
	public $city = 			null;
/**
 * GeoIP#region -> String
 **/
	public $region = 		null;
/**
 * GeoIP#areaCode -> String
 **/
	public $areaCode = 		null;
/**
 * GeoIP#dmaCode -> String
 **/
	public $dmaCode = 		null;
/**
 * GeoIP#countryCode -> String
 **/
	public $countryCode = 	null;
/**
 * GeoIP#countryName -> String
 **/
	public $countryName = 	null;
/**
 * GeoIP#continentCode -> String
 **/
	public $continentCode = null;
/**
 * GeoIP#latitude -> Float
 **/
	public $latitude = 		null;
/**
 * GeoIP#longitude -> Float
 **/
	public $longitude = 	null;
/**
 * new GeoIP()
 *
 * Cette méthode créée une nouvelle instance [[GeoIP]].
 **/	
	function __construct(){}
/**
 * GeoIP.Get([ip]) -> GeoIP
 * Cette méthode récupère la géolocalisation de l'adresse IP fournit en paramètre.
 **/	
	public static function Get($ip = NULL) {
		global $_SERVER;
		
		if ( empty( $ip ) ) {
			$ip = $_SERVER['REMOTE_ADDR'];
			if($ip == '127.0.0.1'){ 
				$ip = '82.241.12.126';
			}
		}
		 
		if(extension_loaded('mod_geoip') || extension_loaded('geoip')){
			$o = new GeoIP();
			
			if(!empty($_SERVER['GEOIP_AREA_CODE'])){
				$o->areaCode = $_SERVER['GEOIP_AREA_CODE'];
			}
			
			if(!empty($_SERVER['GEOIP_COUNTRY_NAME'])){
				$o->countryName = $_SERVER['GEOIP_COUNTRY_NAME'];
			}
			
			if(!empty($_SERVER['GEOIP_DMA_CODE'])){
				$o->dmaCode = $_SERVER['GEOIP_DMA_CODE'];
			}
			
			if(!empty($_SERVER['GEOIP_LATITUDE'])){
				$o->latitude = $_SERVER['GEOIP_LATITUDE'];
			}
			
			if(!empty($_SERVER['GEOIP_LONGITUDE'])){
				$o->longitude = $_SERVER['GEOIP_LONGITUDE'];
			}
			
			if(!empty($_SERVER['GEOIP_REGION'])){
				$o->region = $_SERVER['GEOIP_REGION'];
			}
						
		}else{
		
			$host = str_replace( '{IP}', $ip, self::URI);
			
			$data = array();
			
			$response = Stream::Get($host);
			
			if($response){
				$data = json_decode(str_replace(array('geoPlugin(', 'geoplugin_', ')'), '', $response));
				
				if($data){
					$obj = new self();
					$obj->extend($data);
					$obj->ip = $ip;
					return $obj;
				}		
			}
		}
		
		return false;
	}
/**
 * GeoIP#getCity() -> String
 **/	
	public function getCity(){
		return $this->city;
	}
/**
 * GeoIP#getState() -> String
 **/	
	public function getState(){
		return $this->region;
	}
/**
 * GeoIP#getCountry() -> String
 **/	
	public function getCountry(){
		return $this->countryName;
	}
/**
 * GeoIP#getCountryCode() -> String
 **/	
	public function getCountryCode(){
		return $this->countryCode;
	}
/**
 * GeoIP#getLongitude() -> Float
 **/	
	public function getLongitude(){
		return (float) $this->longitude;
	}
/**
 * GeoIP#getLatitude() -> Float
 **/	
	public function getLatitude(){
		return (float) $this->latitude;
	}
}
endif;


?>