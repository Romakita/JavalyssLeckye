<?php
/*
Plugin Name: AppsMe
Plugin URI:	http://www.javalyss.fr/extension/appsme/
Description: Gérer et maitrisez le déploiement d'applications pour Javalyss. AppsMe est le remplaçant du gestionnaire d'application intégré aux premières versions de Javalyss Leckye.<p class="note">Cette extension peut être couplé avec BlogPress pour la mise en place d'un catalogue d'application en ligne.</p>
Author: Lenzotti Romain
Version: 2.0
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
//if(defined('URI_WEB_PATH')){
//	define('APPSME_URI', str_replace(URI_WEB_PATH, URI_PATH, Plugin::Uri()));
//}

define('APPSME_PATH', Plugin::Path());

include('inc/abstract_appsme.php');

?>