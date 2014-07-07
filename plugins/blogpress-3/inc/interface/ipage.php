<?php
/** section: Interfaces
 * mixin iPage
 *
 * Interface des classes de gestion des formulaires BlogPress.
 **/
interface iPage{
/**
 * iPage.onStart() -> void
 *
 * Cette méthode est lancée avant le chargement d'une page. 
 * Via cette méthode vous pouvez stopper le processus de chargement d'une page en fonction de son Permalien et charger une autre page de votre choix.
 **/
	public static function onStart();
/**
 * iPage.onStart() -> void
 *
 * Cette méthode est lancée pendant le chargement de la page. Il est possible d'afficher du contenu complémentaire dans cette page.
 **/
	public static function onStartPage();
/**
 * iPage.Draw() -> void
 *
 * Cette méthode permet de contruire le contenu du page.
 **/	
	public static function Draw();
}
?>