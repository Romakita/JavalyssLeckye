<?php
/** section: InteractiveCatalog
 * class ICManager
 *
 * Cet espace de nom gère l'extension [[InteractiveCatalog]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class ICManager{
/**
 * jCManager.Active() -> void
 * Méthode gérant l'activation de l'extension.
 **/
 	static public function Active(){
		@Stream::MkDir(System::Path('publics') . 'icatalog/', 0711);		
		self::Configure();
	}
/**
 * jCManager.Active() -> void
 * Méthode gérant l'activation de l'extension.
 **/
 	static public function Configure(){
		$request = new Request();	
		$request->query = 'CREATE TABLE IF NOT EXISTS '.iCStat::TABLE_NAME.' (
		  `Stat_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `User_ID` bigint(20) NOT NULL,
		  `Post_ID` bigint(20) NOT NULL,
		  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  `IP` varchar(100) NOT NULL,
		  `User_Agent` varchar(200) NOT NULL,
		  PRIMARY KEY (`Stat_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;';
		
		$request->exec('query');
	}		
/**
 * jCManager.Deactive() -> void
 * Méthode gérant l'activation de l'extension.
 **/
 	static public function Deactive(){
				
	}
/**
 * jCarousel.exec(op) -> int
 * - op (String): Opération envoyé par l'interface.
 *
 * Cette méthode permet de traiter une opération envoyé par l'interface du logiciel.
 **/
 	static public function exec($op){
		switch($op){
			
		}
	}	
}

?>