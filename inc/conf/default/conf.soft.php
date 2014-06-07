<?php
/**
 * Global.DEFAULT_THEME -> String
 * Thème par défaut lors de l'installation du logiciel.
 **/
define('DEFAULT_THEME', 'default');
/*
 * Global.GATEWAY_KEY_LENGTH -> int
 * Longueur de la clef de sécurité de la passerelle.
 **/
//define('GATEWAY_KEY_LENGTH', 30);
/**
 * Global.SESSION_TIME -> int
 * Temps de durée d'une session inactive avant la déconnexion automatique.	
 **/												
define('SESSION_TIME', "");
/**
 * Global.SESSION_TIME_EXCEDED -> String
 * Méthode javascript à exécuter lorsque le temps d'inactivité est dépassé.
 **/
define('SESSION_TIME_EXCEDED', 'System.timeExceded()');
?>