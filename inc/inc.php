<?php
/*
 * == INC ==
 * Ce fichier inclut toutes les librairies et classes nécessaires au fonctionnement du logiciel.
 * 
 **/

/**
 * == Constants ==
 *
 * Cette section décrit toutes les constantes du logiciel.
 **/
 
/**
 * == Interfaces ==
 *
 * Cette section décrit les interfaces pouvant être implémentées par les classes de PMO.
 **/

/** section: Constants
 * Global
 * Espace de nommage global contenant la description de toutes les constantes du logiciel.
 **/
@session_start();

error_reporting(E_ALL & ~E_WARNING);
/*
 * Global.TEST_UPDATE -> Boolean
 * Cette constante permet de simuler une mise à jour du logiciel.
 **/
if(defined('TEST_UPDATE')){
	error_reporting(E_ALL ^ E_NOTICE);
}

if(!defined('ABS_PATH')){
/**
 * Global.ABS_PATH -> String
 * Répertoire de référence du logiciel Javalyss.
 **/
	define('ABS_PATH', str_replace('/inc', '', str_replace('\\','/', dirname(__FILE__)) . '/' ));
}
/**
 * Global.URI_PATH -> String
 * URL du logiciel. Cette constante est vrai seulement lorsque c'est un fichier du logiciel qui inclut le fichier inc.php.
 **/
if(!defined('URI_PATH')){
	$dir = 	dirname($_SERVER['SCRIPT_NAME']).'/';
	$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
	$base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME'].$dir);
	define('URI_PATH', $base);
}

//----------------------------------------------------------------------------
//Fichier de configuration----------------------------------------------------
//----------------------------------------------------------------------------
require_once(ABS_PATH . 'inc/conf/conf.soft.php');
require_once(ABS_PATH . 'inc/conf/conf.db.php');
require_once(ABS_PATH . 'inc/conf/conf.file.php');
//----------------------------------------------------------------------------
//Inclusion des librairies----------------------------------------------------
//----------------------------------------------------------------------------
require_once(ABS_PATH . 'inc/lib/library.php');
//----------------------------------------------------------------------------
//Inclusion du fichier du noyau-----------------------------------------------
//----------------------------------------------------------------------------
require_once(ABS_PATH . 'inc/interface/iclass.php');
require_once(ABS_PATH . 'inc/interface/iplugin.php');
require_once(ABS_PATH . 'inc/interface/isearch.php');
require_once(ABS_PATH . 'inc/core/class_system.php');
System::Initialize();
//----------------------------------------------------------------------------
//Fin-------------------------------------------------------------------------
//----------------------------------------------------------------------------
error_reporting(E_ALL);
?>