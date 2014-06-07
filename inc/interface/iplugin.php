<?php
/** section: Interfaces
 * mixin iPlugin
 *
 * Interface des classes gérant une extension Javalyss.
 **/
interface iPlugin{
/**
 * iPlugin.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize();
/**
 * iPlugin.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
 	static public function Install();
/**
 * iPlugin.Uninstall(eraseData) -> void
 * - eraseData (Boolean): Suppression de données. 
 *
 * Cette méthode désintalle  l'extension et supprime les données liées à l'extension si `eraseData` est vrai.
 **/	
	static public function Uninstall($eraseData = false);
/**
 * iPlugin.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op);
/**
 * iPlugin.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande - en mode non connecté - et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	static public function execSafe($op);
}
?>