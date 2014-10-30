<?php

/** section: Library
 * class vAlarm
 *
 * Cette classe gère la création d'objet vAlarm. Les vAlarm sont des alarmes que l'on peut ajouter à une instance [[vCalendar]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
if(!class_exists('vAlarm')):
class vAlarm{
/**
 * vAlarm.TAG -> String
 * Balise d'ouverture de la vAlarm.
 **/	
	const TAG = 			'VALARM';
/**
 * vAlarm#Action -> AUDIO
 **/   
	public $Action =		'AUDIO';
/**
 * vAlarm#Trigger -> String
 **/
    public $Trigger =		'';
/**
 * vAlarm#Attach -> String
 **/
	public $Attach =		'FMTTYPE=audio/basic:http://host.com/pub/audio-files/ssbanner.aud';
/**
 * vAlarm#Repeat -> Number
 **/ 
	public $Repeat = 		4;
/**
 * vAlarm#Duration -> String
 **/
    public $Duration = 		'PT1H';	
/**
 * new vAlarm()
 *
 * Cette méthode créée une nouvelle instance [[vAlarm]].
 **/	
	public function __construc(){}
/**
 * vAlarm#toString() -> String
 **/	
	public function __toString(){
		
		$carriage = self::CARRIAGE;
		
		$str = 	"BEGIN: ".self::TAG.$carriage;
						
		$str .= 	"END: ".self::TAG;
		
		return $str;	
	}
}
endif;
?>