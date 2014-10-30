<?php
/** section: Library
 * class vTodo
 *
 * Cette classe gère la création d'objet vTodo. Les vTodo sont des tâches que l'on peut ajouter à une instance [[vCalendar]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Version : 2.0
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
if(!class_exists('vTodo')):
class vTodo{
/**
 * vTodo.TAG -> String
 * Balise d'ouverture de la vTodo.
 **/
	const TAG = 			'VTODO';
/**
 * vTodo#Summary -> String
 * Résumé de la tâche.
 **/
	public $Summary	=		'';
/**
 * vTodo#DateStamp -> String 
 **/
	public $DateStamp = 	'';
/**
 * vTodo#Sequence -> Number 
 **/
	public $Sequence =		1;
/**
 * vTodo#UID -> String 
 **/
    public $UID = 			'';
/**
 * vTodo#Organizer -> String 
 **/
	public $Organizer = 	'';
/**
 * vTodo#Due -> String 
 **/	
	public $Due =			'';
/**
 * vTodo#Status -> String 
 **/	
	public $Status = 		'';
/**
 * vTodo#vAlarm -> String 
 **/	
	public $vAlarm;
/**
 * new vTodo()
 *
 * Cette méthode créée une nouvelle instance [[vTodo]].
 **/	
	public function __construc(){}
/**
 * vTodo#toString() -> String
 **/	
	public function __toString(){
		
		$carriage = self::CARRIAGE;
		
		$str = 	"BEGIN: ".self::TAG.$carriage;
		
		$str .= "SUMMARY: ".vCalendar::FormatString($this->Summary).$carriage;
		$str .= "DTSTART: ".vCalendar::FormatDate($this->DateStamp).$carriage;
		
		
						
		$str .= 	"END: ".self::TAG;
		
		return $str;	
	}
}
endif;
?>