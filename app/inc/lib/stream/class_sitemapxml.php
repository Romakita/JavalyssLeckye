<?php
/** section: Library
 * class SiteMapXML
 *
 * Cette classe permet de générer un SiteMap pour votre site.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_sitemapxml.php
 * * Version : 0.1
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
require_once('class_stream.php');

class SiteMapXML{
	const VERSION =			'0.1';
/**
 * SiteMapXML#stylesheet -> String
 * Lien HTTP de la feuille de style XSL du document.
 **/
	public $stylesheet = 	'';
/**
 * SiteMapXML#generator -> String
 * Nom du CMS générant le document.
 **/	
	public $generator =		'javalyss/0.6.0';
/**
 * SiteMapXML#encoding -> String
 * Encodage du document. Par défaut UTF-8; 
 **/
	public $encoding =		'UTF-8';
/**
 * SiteMapXML.GMT -> String
 * Différence avec l'heure Greenwich (GMT) avec un deux-points entre les heures et les minutes.
 **/	
	static $GMT =			'+01:00';
	
	protected $childs =		array();
/**
 * new SiteMapXML([options])
 * - options (Object | Array): Options de configuration.
 *
 * Créée une nouvelle instance [[SiteMapXML]].
 **/	
	function __construct($options = ''){
		
		if(is_object($options) || is_array($options)){
			foreach($options as $key => $value){
				$this->$key = $value;
			}
		}
		
	}
/**
 * SiteMapXML#write(link) -> Boolean
 * - link (String): Lien du fichier à écrire.
 *
 * Cette méthode écrire le contenu du document dans le fichier ciblé par `link`.
 **/
	public function write($link){
		return Stream::Write($link, $this.'');
	}
/**
 * SiteMapURL#setArray(array) -> void
 * - array (Array): Tableau associatif.
 *
 * Assigne un tableau de données à l'instance
 **/	
	function setArray($options){
		if(is_object($options) || is_array($options)){
			foreach($options as $value){
				if(is_object($value) || is_array($value)){
					array_push($this->childs, new SiteMapURL($value));
				}
			}
		}
	}
/**
 * SiteMapXML#toString() -> String
 * 
 * Convertie l'instance en chaine de caractère.
 **/	
	function __toString(){
		
		$str = 	'<?xml version="1.0" encoding="UTF-8"?>'. Stream::CARRIAGE;
		
		if(!empty($this->stylesheet)){
			$str .= '<?xml-stylesheet type="text/xsl" href="'.$this->stylesheet.'"?>'. Stream::CARRIAGE;
		}
		
		if(!empty($this->generator)){
			$str .= '<!-- generator="'.$this->generator.'" -->'. Stream::CARRIAGE;
		}
		
		$str .= '<!-- sitemap-generator-url="http://javalyss.fr" sitemap-generator-version="'.self::VERSION.'" -->'. Stream::CARRIAGE;
		$str .= '<!-- generated-on="'.date('d l Y h \h i').' min" -->'. Stream::CARRIAGE;
		
		$str .= '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'. Stream::CARRIAGE;
		
		foreach($this->childs as $url){
			$str .= $url;
		}
		
		$str .= '</urlset>';
		
		return 	$str;
	}
}

/** section: Library
 * class SiteMapURL
 * Lien HTTP de la feuille de style XSL du document.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_sitemapxml.php
 * * Version : 0.1
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/
class SiteMapURL{
/**
 * SiteMapURL#link -> String
 * Lien de la page à référencer dans le SiteMap.
 **/
	public $link = 		'';
/**
 * SiteMapURL#date -> String
 * Date de modification de la page au format (YYYY-MM-DD HH:II:SS).
 **/
	public $date =		'';
/**
 * SiteMapURL#frequency -> String
 * Fréquence de mise à jour de la page.
 **/
	public $frequency = 'daily';
/**
 * SiteMapURL#priority -> String
 * Priorité de référencement de la page.
 **/
	public $priority =	'1.0';
/**
 * new SiteMapURL([options])
 * - options (Object | Array): Options de configuration.
 *
 * Créée une nouvelle instance [[SiteMapURL]].
 **/	
	public function __construct($options = ''){
		if(is_object($options) || is_array($options)){
			foreach($options as $key => $value){
				$this->$key = $value;
			}
		}
	}
/**
 * SiteMapURL#setObject(obj) -> void
 * - obj (Object): Tableau associatif.
 *
 * Assigne un objet à l'instance.
 **/	
	function setObject($options){
		if(is_object($options) || is_array($options)){
			foreach($options as $key => $value){
				$this->$key = $value;
			}
		}
	}
/**
 * SiteMapURL#setArray(array) -> void
 * - array (Array): Tableau associatif.
 *
 * Assigne un tableau associatif à l'instance.
 **/	
	function setArray($options){
		if(is_object($options) || is_array($options)){
			foreach($options as $key => $value){
				$this->$key = $value;
			}
		}
	}
/**
 * SiteMapURL#toString() -> String
 * 
 * Convertie l'instance en chaine de caractère.
 **/	
	function __toString(){
		
		if(empty($this->link)){
			return '';	
		}
		
		$str = 	"\t".'<url>'. Stream::CARRIAGE;
		$str .= "\t\t".'<loc>' . $this->link .'</loc>'. Stream::CARRIAGE;
		$str .= "\t\t".'<lastmod>' . str_replace(' ', 'T', $this->date) . SiteMapXML::$GMT .'</lastmod>'. Stream::CARRIAGE;
		$str .= "\t\t".'<changefreq>' . $this->frequency .'</changefreq>'. Stream::CARRIAGE;
		$str .= "\t\t".'<priority>' . $this->priority .'</priority>'. Stream::CARRIAGE;
		$str .= 	"\t".'</url>'. Stream::CARRIAGE;
		
		return $str;
	}
	
}
?>