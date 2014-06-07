<?php
/** section: Library
 * mixin Multilingual
 * Cette classe gère la traduction de contenu d'une langue vers une autre à partir de fichier XML contenant les règles de traduction.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_multilingual.php
 * * Version : 1.0
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('Multilingual')):

abstract class Multilingual{
	const DEF =						'default'; 
	const AUTO =					'auto';
	const SESSION =					'session';
/**
 * Multilingual.VERSION -> String
 * Numéro de version de la bibliothèque.
 **/
	const VERSION = 				'1.0';
	
	public static $MODE	= 			'auto';
/**
 * Multilingual.Lang -> String
 * Numéro de version de la bibliothèque.
 **/	
	protected static $Lang = 		'fr';
/**
 * Multilingual.text -> String
 * Numéro de version de la bibliothèque.
 **/
	protected static $text =		array();
/**
 * Multilingual.Initialize() -> void
 **/	
	public static function Initialize(){
		if(!empty($_SESSION['MUI'])){
			Multilingual::setLang($_SESSION['MUI']);
			self::$MODE = self::SESSION;
		}
	}
/**
 * Multilingual.AddWord(key, word, lang) -> void
 * - key (String): Mot clef de l'application cible.
 * - word (String): Traduction du mot clef dans la langue cible.
 * - lang (String): Langue associée à la traduction.
 *
 * Cette méthode ajoute une traduction d'un mot au dictionnaire de mot.
 **/
	public static function AddWord($key, $word, $lang = 'fr'){
		self::$text[strtolower($lang)][strtolower($key)] = $word;
	}
/**
 * Multilingual.AddWords(obj, lang) -> void
 * - obj (Object): Dictionnaire de mot à ajouter.
 * - lang (String): Langue associée à la traduction.
 *
 * Cette méthode ajoute un dictionnaire de mot au dictionnaire courrant.
 *
 * ##### Description du paramètre obj
 *
 * Le paramètre obj doit être décrit de la façon suivante :
 *	
 *     var obj = {
 *         'mot cible': 'mot traduit',
 *         'mot cible2': 'mot traduit 2',
 *         //etc...
 *     }
 *
 *
 **/
	public static function AddWords($obj, $lang = 'fr'){
		foreach($obj as $key => $value){
			self::addWord($key, $value, $lang);	
		}
	}
/**
 * Multilingual.ImportLang(file) -> void
 * Cette méthode importe un fichier de traduction au format XML.
 **/	
	static public function Import($file){
		
		if(file_exists($file)){
			$array = Stream::ParseXML($file);
			
			if(!empty($array)){
				
				$lang = $array['lang']['@attributes']['type'];
				
				$items = $array['lang']['item'];
				
				foreach($items as $option){
					if(is_array($option)){
						self::AddWord($option['key'], $option['value'], $lang);
					}else{
						self::AddWord($items['key'], $items['value'], $lang);
						break;
					}
				}
				
			}
		}
	}
/**
 * Multilingual.Translate(word) -> String
 * - word (String): Mot à traduire.
 *
 * Traduit le mot à partir de langue par défaut et de son dictionnaire associé.
 * 
 * ##### Exemple
 *
 * Voici un exemple simple d'utilisation :
 * 
 *     MUI.addWord('bonjour le monde', 'hello world', 'en');
 *     
 *     MUI.lang = 'en';
 *     alert(MUI.translate('bonjour le monde')); //hello world
 *     //autre fonction plus rapide à écrire
 *     alert($MUI('bonjour le monde')); //hello world
 *
 **/
	static public function Translate($text){
		
		switch(self::$MODE){
			default:
			case 'default':
				break;
				
			case 'session':
				if(empty($_SESSION['MUI'])){
					$_SESSION['MUI'] = self::$Lang;
				}
				
				self::$Lang = $_SESSION['MUI'];
				break;
				
			case 'auto':
				self::$Lang = @explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE']);
				self::$Lang = @strtolower(substr(chop(self::$Lang[0]), 0, 2));
				break;
		}
		
		if(empty(self::$text[self::$Lang])){
			return $text;
		}
		
		if(empty(self::$text[self::$Lang][strtolower($text)])){
			return $text;
		}
				
		return  self::$text[self::$Lang][strtolower($text)];
	}
	
	public static function SetLang($lang){
		self::$Lang = substr(strtolower($lang), 0, 2);
		$_SESSION['MUI'] = self::$Lang;
	}
	
	public static function GetLang(){
		return self::$Lang;
	}
	
	public static function VarDump(){
		var_dump(self::$text);
	}
	
	public static function EncodeJSON(){
		return json_encode(self::$text[self::$Lang]);
	}
	
	public static function DrawJSONHeader(){
		header('Content-Type:text/javascript');
		echo "MUI.addWords(" . @self::EncodeJSON() . ", '".self::GetLang()."');"; 
		exit();
	}
}

function MUI($text){
	return Multilingual::Translate($text);
}
endif;