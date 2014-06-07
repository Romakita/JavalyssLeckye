<?php
/*
Plugin Name: BlogPress
Plugin URI:	http://www.javalyss.fr/extension/blogpress/
Description: <p>Blogpress vous permet de concevoir votre site internet sur mesure tout en ayant accès aux outils de gestion que l'on s'attend à avoir sur un gestionnaire de site.</p><p>Ces outils vont de la gestion de template jusqu'à la configuration des liens en passant par l'édition de pages et d'articles.</p><p> De plus, l'API BlogPress permet à des applications tiers d'ajouter des fonctionnalités supplémentaires très simplement.</p>
Author: Lenzotti Romain
Version: 3.2
Author URI: http://www.javalyss.fr

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/

if(defined('URI_WEB_PATH')){
	define('BLOGPRESS_URI', str_replace(URI_WEB_PATH, URI_PATH, Plugin::Uri()));
	$folder = str_replace(URI_PATH, ABS_PATH, BLOGPRESS_URI).'inc/ui/';
	//inclusion des composants pour le blog
	$folder = new StreamList($folder);
	do{
		require_once('inc/ui/'.$folder->current());
	}while($folder->next());
}else{
	define('URI_WEB_PATH', URI_PATH);
	define('BLOGPRESS_URI', Plugin::Uri());
}
//définition des constantes
define('DB_BLOGPRESS', DB_NAME);
define('BLOGPRESS_PATH', Plugin::Path());
@define('TEMPLATE_PATH', System::Path('themes'));
@define('TEMPLATE_URI', System::Path('themes', false));
@define('DEFAULT_TEMPLATE_NAME', 'javalyss');
/**
 * == BlogPress == 
 * Documentation de l'extension BlogPress
 **/

require_once('inc/abstract_blogpress.php');

BlogPress::Initialize();

?>