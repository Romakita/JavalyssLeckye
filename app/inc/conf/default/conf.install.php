<?php
/**
 * Global.NAME_VERSION -> String
 * Nom de la version du logiciel.
 **/
define('NAME_VERSION',		'Javalyss Leckye');	
/**
 * Global.CORE_BASENAME -> String
 * Nom du noyau du logiciel.
 **/
define('CORE_BASENAME',		'Javalyss Leckye');		
/**
 * Global.NAME_CLIENT -> String
 * Nom du client utilisant le logiciel.
 **/									
define('NAME_CLIENT', 		'');
/**
 * Global.CODE_VERSION -> String
 * Numéro de la version du logiciel.
 **/
define('CODE_VERSION', 		'1.0');
/**
 * Global.CODE_SUBVERSION -> String
 * Numéro de la sous-version du logiciel.
 **/
define('CODE_SUBVERSION', 	'.0');
/**
 * Global.DATE_VERSION -> String
 * Date de version du logiciel.
 **/
define('DATE_VERSION',		'2013-07-05');
/**
 * Global.CONTRIBUTORS -> String
 * Noms des contributeurs du logiciel.
 **/
define('CONTRIBUTORS', 		'Lenzotti Romain');		
/**
 * Global.CLIENT_MAIL -> String
 * Adresse e-mail du logiciel.
 **/
define('CLIENT_MAIL', 		'webmaster@javalyss.fr');
/**
 * Global.LICENCE_VERSION -> String
 * Licence sous lequel s'execute le logiciel.
 **/
define('LICENCE_VERSION','This work is licensed under a Creative Commons Attribution 2.5 Generic License <a href="javascript:System.open(\'http://creativecommons.org/licenses/by/2.5/\', \'Licence logiciel\')">http://creativecommons.org/licenses/by/2.5/</a><div style="background:url(http://i.creativecommons.org/l/by/3.0/88x31.png) no-repeat center;height:31px;margin:4px"></div>');
/**
 * Global.LANG -> String
 * Langue par défaut du logiciel.
 **/
define('LANG', 'FR');
/**
 * Global.DEFAULT_THEME -> String
 * Thème par défaut lors de l'installation du logiciel.
 **/
define('DEFAULT_THEME', 'default');
/**
 * Global.NAME_MENU -> String
 * Nom du menu principal à afficher.
 **/
define('NAME_MENU',	'App');			
/**
 * Global.API_KEY -> String
 * Clef d'API du logiciel.
 **/
define('API_KEY', substr(md5(NAME_VERSION), 0, 6).'-'.substr(md5(NAME_CLIENT), 0, 6).'-'.substr(md5(CODE_VERSION.CODE_SUBVERSION), 0,6));									
/**
 * Global.LINK_MARKET -> String
 * Lien du serveur d'application.
 **/
define('LINK_MARKET', 'http://javalyss.fr/');															
/*
 * Global.GATEWAY_KEY_LENGTH -> int
 * Longueur de la clef de sécurité de la passerelle.
 **/
//define('GATEWAY_KEY_LENGTH', 30);
/**
 * Global.SESSION_TIME -> int
 * Temps de durée d'une session inactive avant la déconnexion automatique.
 **/												
define('SESSION_TIME', '');
/**
 * Global.SESSION_TIME_EXCEDED -> String
 * Méthode javascript à exécuter lorsque le temps d'inactivité est dépassé.
 **/
define('SESSION_TIME_EXCEDED', 'System.timeExceded()');
?>