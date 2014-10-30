<?php
/** section: Interfaces
 * mixin iClass
 *
 * Interface des classes Javalyss.
 **/
interface iClass{
/**
 * iClass.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize();
/**
 * iClass#commit() -> Boolean
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit();
/**
 * iClass#delete() -> Boolean
 *
 * Cette méthode supprime les informations de la classe de la base de données.
 **/
	public function delete();
/**
 * iClass.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op);
/**
 * iClass.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/
	public static function GetList($clauses = '', $options = '');
/**
 * iClass.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/
	public static function onGetList(&$row, &$request);
	
}
?>