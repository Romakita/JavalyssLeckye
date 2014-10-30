<?php
/** section: Library
 * mixin ObjectPrint 
 * includes ObjectSingleton
 *
 * Cet utilitaire ajoute les méthodes utile à l'impression.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_object_print.php
 * * Version : 0.7
 * * Date : 20/07/2011
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('ObjectPrint')):
require_once('class_object_singleton.php');

abstract class ObjectPrint extends ObjectSingleton{
/**
 * ObjectPrint.Link -> String
 * Lien du fichier FPDF.
 **/
	public static $OptionsPrint = NULL;
/**
 * ObjectPrint.Link -> String
 * Lien du fichier FPDF.
 **/
	public static $Link =		NULL;
/**
 * ObjectPrint.Link -> String
 * Lien du fichier FPDF.
 **/
	public static $Pdf =		NULL;
/**
 * ObjectPrint.SetLink(link) -> void
 * - link (String): Chemin du PDF.
 *
 * Cette méthode permet d'assigner le chemin du PDF.
 **/	
	public static function SetLink($o){
		self::$Link = $o;
	}
/**
 * ObjectPrint.GetLink(link) -> String
 *
 * Cette méthode permet de récuperer le lien du PDF.
 **/	
	public static function GetLink(){
		return self::$Link;
	}
/**
 * ObjectPrint.SetOptions(link) -> void
 * - link (String): Chemin du PDF.
 *
 * Cette méthode permet d'assigner le chemin du PDF.
 **/	
	public static function SetOptions($o){
		self::$OptionsPrint = $o;
	}
/**
 * ObjectPrint.GetOptions(link) -> String
 *
 * Cette méthode permet de récuperer le lien du PDF.
 **/	
	public static function GetOptions(){
		return self::$OptionsPrint;
	}
/**
 * ObjectPrint.SetPDF(link) -> void
 * - link (String): Chemin du PDF.
 *
 * Cette méthode permet d'assigner une ressource PDF 
 **/	
	public static function SetPDF($o){
		self::$Pdf = $o;
	}
/**
 * ObjectPrint.GetPDF(link) -> String
 *
 * Cette méthode permet de récuperer le lien du PDF.
 **/	
	public static function GetPDF(){
		return self::$Pdf;
	}
/**
 * ObjectPrint#printPDF([mode = default]) -> String
 *
 * `abstract` Cette méthode créée un PDF à partir des informations de l'instance.
 **/
 	abstract public function printPDF($model = 'default');
/**
 * ObjectPrint.PrintList([clauses = null [, options = null]]) -> String
 *
 * `abstract` Cette méthode créée un PDF du listing.
 **/
 	static public function PrintList($clauses = '', $options = ''){}
}
endif;
?>