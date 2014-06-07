<?php
/** section: Interfaces
 * mixin iSearch
 *
 * Interface des classes pouvant retourner des résultats lors d'une recherche globale.
 **/
interface iSearch{
/**
 * iSearch.Search(word) -> void
 * - word (String): Mot recherché.
 *
 * Cette méthode permet d'ajouter un résultat à la recherche globale.
 **/
	public static function Search($word);
/**
 * iSearch.SearchMail(word) -> void
 * - word (String): E-mail recherché.
 *
 * Cette méthode permet d'ajouter un résultat à la recherche globale d'adresse e-mail.
 **/	
	public static function SearchMail($word);
	
}
?>