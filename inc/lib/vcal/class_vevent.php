<?php
/** section: Library
 * class vEvent
 *
 * Cette classe gère la création d'objet vEvent. Les vEvent sont des événements que l'on peut ajouter à une instance [[vCalendar]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
if(!class_exists('vEvent')):
class vEvent{
/**
 * vEvent.TAG -> String
 * Balise d'ouverture de la vEvent.
 **/
	const TAG = 			'VEVENT';
/**
 * vEvent#Summary -> String
 * Résumé de l'événement.
 **/
	public $Summary = 		'';
/**
 * vEvent#Description -> String
 * Description de l'événement.
 **/
	public $Description = 	'';
/**
 * vEvent#DateStart -> String
 * Début de l'événement. La date doit avoir le format suivant `AAAAMMDDTHHIISSZ` (avec PHP utilisez la fonction date('Ymd\THisZ'));
 **/	
	public $DateStart =		'';
/**
 * vEvent#DateEnd -> String
 * Fin de l'événement. La date doit avoir le format suivant `AAAAMMDDTHHIISSZ` (avec PHP utilisez la fonction date('Ymd\THisZ'));
 **/	
	public $DateEnd =		'';
/**
 * vEvent#Location -> String
 * Localisation de l'événement.
 **/	
	public $Location =		'';
/**
 * vEvent#Categories -> String
 **/	
	public $Categories =	'';
/**
 * vEvent#Status -> String
 **/	
	public $Status =		'';
/**
 * vEvent#Transp -> String
 **/	
	public $Transp =		'';
/**
 * new vEvent()
 *
 * Cette méthode créée une nouvelle instance [[vEvent]].
 **/	
	public function __construc(){}
/**
 * vEvent#toString() -> String
 **/	
	public function __toString(){
		
		$carriage = vCalendar::CARRIAGE;
		
		$str = 	"BEGIN: ".self::TAG.$carriage;
		
		$str .= "SUMMARY: ".vCalendar::FormatString($this->Summary).$carriage;
		
		$str .= "DTSTART: ".vCalendar::FormatDate($this->DateStart).$carriage;
		
		if($this->DateEnd != '') 	$str .= "DTEND: ".vCalendar::FormatDate($this->DateEnd).$carriage;
		if($this->Description != '')$str .= "DESCRIPTION;ENCODING=QUOTED-PRINTABLE: ".vCalendar::FormatString($this->Description).$carriage;
		if($this->Location != '') 	$str .= 'LOCATION: '.vCalendar::FormatString($this->Location).$carriage;
		if($this->Categories != '') $str .= 'CATEGORIES: '.vCalendar::FormatString($this->Categories).$carriage;
		if($this->Status != '') 	$str .= 'STATUS: '.vCalendar::FormatString($this->Status).$carriage;
		if($this->Transp != '') 	$str .= 'STATUS: '.vCalendar::FormatString($this->Transp).$carriage;
				
		$str .= 	"END: ".self::TAG;
		
		return $str;	
	}
}
endif;
?>