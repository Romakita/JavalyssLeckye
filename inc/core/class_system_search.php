<?php
/** section: Core
 * class System.Search
 * includes ObjectTools
 *
 * Cette classe gère les extensions du logiciel.
 **/
namespace System;

class Search extends \ObjectTools{
/**
 * System.Search#text -> String
 *
 * Texte à afficher en fonction du résultat.
 **/	
	public $text = 			'';
/**
 * System.Search#appName -> String
 *
 * Nom de l'application source des données.
 **/	
	public $appName =		'';
/**
 * System.Search#appIcon -> String
 *
 * Icone de l'application.
 **/	
	public $appIcon =			'';
/**
 * System.Search#icon -> String
 *
 * Icone de la ligne du résultat.
 **/	
	public $icon =			'';
/**
 * System.Search#value -> String
 *
 * Données à transmettre.
 **/	
	public $value = 		'';
/**
 * System.Search#onClick -> String
 *
 * Action Javascript.
 **/	
	public $onClick = 		'';
/*
 *
 **/	
	protected static $Array =	array();	
	
	protected static $keyword =	'';
	
	protected static $currentAppName = '';
/**
 * new System.Search(object)
 * new System.Search(array)
 * new System.Search(object)
 *
 * Cette méthode créée une nouvelle instance de résultat.
 **/
	function __construct($options = ''){
		
		if(!empty($options)){
			if(is_object($options) || is_array($options)){
				$this->extend($options);	
			}
		}
	}
/*
 *
 **/	
	public static function Initialize() {
		\System::Observe('gateway.exec', array('\System\Search', 'exec'));
	}
/**
 * System.Search.Add(options) -> void
 * - options (Object|System.Search): Resultat à ajouter.
 * 
 * Cette méthode ajoute un résultat au gestionnaire de recherche global.
 **/	
	public static function Add($options){
		
		if(!($options instanceof self)){
			$options = new self($options);
		}
		
		array_push(self::$Array, $options);
		
	}
/*
 *
 **/	
	public static function exec($op){
		switch($op){
			case 'system.search':
				echo json_encode(self::Search($_POST['word'], @$_POST['appName']));
				break;
			
			case 'system.search.mail':
				echo json_encode(self::SearchMail($_POST['word']));
				break;
		}
	}
/*
 *
 **/	
	public static function SearchMail($word, $appName = ''){
		
		self::$keyword = $word;
		self::$currentAppName = $appName;
		
		\System::Fire('system.search.mail', array($word));
		
		return self::$Array;
	}
	
	public static function Search($word, $appName = ''){
		
		
		switch($word){
			case '':break;
			case 'terminal'://reserved keywork
			case 'user':
			case 'system':
			case 'configuration':
			case 'setting':
			case 'role':
			case 'group':
			case 'media':
			case 'about':
			case 'info':
				
				break;
				
			default:
				self::$keyword = $word;
				self::$currentAppName = $appName;
				
				\System::Fire('system.search', array($word, $appName));
					
		}
		
		return self::$Array;
		
	}
/**
 * System.Search.GetKeyword() -> String
 *
 * Cette méthode retourne le mot clef recherché par l'utilisateur.
 **/	
	public static function GetKeyword(){
		return self::$keyword;
	}
/*
 * System.Search.GetAppName() -> String
 *
 * Cette méthode retourne l'application courante.
 **/	
	public static function GetAppName(){
		return self::$currentAppName;
	}
/**
 * System.Search#onClick(jsaction) -> void
 *
 * Cette méthode permet d'ajouter une action javascript au clique du résultat par l'utilisateur.
 **/	
	public function onClick($o){
		$this->onClick = $o;	
	}
/**
 * System.Search#setAppName(name) -> void
 * - name (String): Nom de l'application lié au résultat.
 *
 * Cette méthode permet de spécifier le nom de l'application ayant retourné le résultat en fonction du mot clef.
 **/
	public function setAppName($o){
		$this->appName = $o;	
	}
/**
 * System.Search#setAppIcon(icon) -> void
 * - icon (String): Icone de l'application lié au résultat.
 *
 * Cette méthode permet de spécifier une icone associée à l'application.
 **/	
	public function setAppIcon($o){
		$this->appIcon = $o;	
	}
/**
 * System.Search#setIcon(icon) -> void
 * - icon (String): Icone lié au résultat.
 *
 * Cette méthode permet de spécifier une icone associée au résultat.
 **/
	public function setIcon($o){
		$this->icon = $o;	
	}
	
	
}