<?php
/** section: Library
 * class Geocode
 * Cette classe permet de récuperer la localisation d'une adresse en utilisant les services Google Map ou Yahoo.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_geocode.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('Geocode')):

require_once('class_stream.php');
require_once('class_object_tools.php');

class Geocode extends ObjectTools{
	const URI_GMAP = 	'http://maps.googleapis.com/maps/api/geocode/json?address={ADDR}&sensor=false';
	const URI_YAHOO = 	'http://where.yahooapis.com/geocode?q={ADDR}&appid=&flags=J';
/**
 * Geocode.GMAP -> String
 **/	
	const GMAP =		'gmap';
/**
 * Geocode.YAHOO -> String
 **/
	const YAHOO = 		'yahoo';
/**
 * Geocode#CP -> String
 **/
	public $CP =			'';
/**
 * Geocode#City -> String
 **/
	public $City =			'';
/**
 * Geocode#CityFormated -> String
 **/
	public $CityFormated = 	'';
/**
 * Geocode#State -> String
 **/
	public $State =			'';
/**
 * Geocode#County -> String
 **/
	public $County =		'';
/**
 * Geocode#CountyCode -> String
 **/
 	public $CountyCode =	'';
/**
 * Geocode#Country -> String
 **/
	public $Country =	'';
/**
 * Geocode#CountryCode -> String
 **/
	public $CountryCode =	'';
/**
 * Geocode#Latitude -> String
 **/
 	public $Latitude = 			'';
/**
 * Geocode.Longitude -> String
 **/
 	public $Longitude = 		'';
		
	static protected function GetRawObject($addr, $type){
		$addr = 	str_replace('%2B', '+', rawurlencode(str_replace(' ', '+', $addr)));
		return Stream::Get(str_replace('{ADDR}', $addr, $type == self::GMAP ? self::URI_GMAP : self::URI_YAHOO));	
	}
/**
 * Geocode.Get(addr, type) -> Ville
 *
 * Cette méthode permet de récupérer le géocode de la ville, adresse ou autre position.
 **/	
	static public function Get($addr, $type = 'gmap'){
		
		$raw = 		self::GetRawObject($addr, $type);
		$object = 	json_encode($raw);
		$location =	new self();
		
		if(!is_object($object)){
			$location->error = $raw;
		}
		
		switch($type){
			case 'gmap':
				
				if(@$object->results){
					//var_dump($object->results[0]);
					$object = $object->results[0]; 
											
					foreach($object->address_components as $component){
						switch($component->types[0]){
							case 'postal_code':
								$location->CP = 			$component->short_name;
								break;
							case 'locality':
								$location->City =			$component->short_name;
								break;
							case 'administrative_area_level_2':
								$location->County =			$component->long_name;
								$location->CountyCode =		$component->short_name;
								break;
							case 'administrative_area_level_1':
								$location->State =			$component->long_name;
								break;
							case 'country':
								$location->Country =		$component->long_name;
								$location->CountryCode =	$component->short_name;
								break;
						}
					}
										
					$location->Latitude = 			$object->geometry->location->lat;
					$location->Longitude =			$object->geometry->location->lng;
					$location->CityFormated = 		$object->formatted_address;
				}else{
					$location->error = $raw;	
				}
				
				
				break;
				
			case 'yahoo':
				$object = $object->ResultSet->Results[0];	
				if(!(empty($object->city) && empty($object->name) && empty($object->line2))){
										
					$location->Country =			$object->country;
					$location->County = 			$object->county;
					$location->CountyCode = 		$object->countycode;
					$location->State = 				$object->state;
					$location->Latitude = 			$object->latitude;
					$location->Longitude = 			$object->Rlongitude;
					
					if(!empty($object->city)){
						$ville->City = 	$object->city;
					}elseif(!empty($object->name)){
						$ville->City = 	$object->name;
					}elseif(!empty($object->line2)){
						$ville->City =	$object->line2;
					}
												
					if(!empty($object->uzip)) $ville->CP = $object->uzip;
					
					if(!empty($object->neighborhood)){
						$location->City = $object->neighborhood . ', ' . $location->City;
					}
																	
				}else{
					$location->error = $raw;	
				}
					
				break;
		}
							
		return $location;
	}
/**
 * Geocode#getCity() -> String
 **/	
	public function getCity(){
		return $this->City;
	}
/**
 * Geocode#getCityFormated() -> String
 **/	
	public function getCityFormated(){
		return $this->CityFormated;
	}
/**
 * Geocode#getState() -> String
 **/	
	public function getState(){
		return $this->State;
	}
/**
 * Geocode#getCounty() -> String
 **/	
	public function getCounty(){
		return $this->County;
	}
	
	public function getCountyCode(){
		return $this->CountyCode;
	}
/**
 * Geocode#getCP() -> String
 **/	
	public function getCP(){
		return $this->CP;
	}
/**
 * Geocode#getCountry() -> String
 **/	
	public function getCountry(){
		return $this->Country;
	}
/**
 * Geocode#getCountryCode() -> String
 **/	
	public function getCountryCode(){
		return $this->CountryCode;
	}
/**
 * Geocode#getLongitude() -> Float
 **/	
	public function getLongitude(){
		return (float) $this->Longitude;
	}
/**
 * Geocode#getLatitude() -> Float
 **/	
	public function getLatitude(){
		return (float) $this->Latitude;
	}
	
}
endif;
?>