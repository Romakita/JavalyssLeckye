<?php
/** section: Library
 * mixin ObjectSingleton
 * includes ObjectTools
 *
 * Cet utilitaire ajoute les méthodes utiles à la création de singleton.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_object_print.php
 * * Version : 1.0
 * * Date : 29/04/2013
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('ObjectSingleton')):

include_once('class_object_tools.php');

abstract class ObjectSingleton extends ObjectTools{
	protected static $instance = 	NULL;
/**
 * ObjectPrint.Set(instance) -> void
 * - instance (Instance): Instance à stocker.
 *
 * Cette méthode permet de stocker une instance.
 **/	
	public static function Set(&$o){
		self::$instance = $o;
	}
/**
 * ObjectPrint.Get() -> Instance
 * Cette méthode permet de récupérer une instance.
 **/	
	public static function Get(){
		return self::$instance;
	}
}

endif;
?>