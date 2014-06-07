<?php
/*
Plugin Name: jGalery
Plugin URI:	http://www.javalyss.fr/extensions/jgalery/
Description: Cette extension permet de gérer des galeries photos pour votre site web.
Version: 2.2
Author:	Lenzotti Romain
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

//if(!class_exists('BlogPress')){
	//die('L\'extension jCarousel nécessite l\'installation de l\'extension BlogPress pour fonctionner.');	
//}

define('JGALERY_URI', Plugin::Uri());
define('JGALERY_PATH', Plugin::Path());
/**
 * == jCarrousel == 
 * Documentation de l'extension BlogPress
 **/
System::EnqueueScript('galery', Plugin::Uri().'js/class_jgalery.js');
System::EnqueueScript('galery.picture',Plugin::Uri().'js/class_jpicture.js');
System::EnqueueScript('galery.libraries',Plugin::Uri().'js/class_libraries.js');
System::addCSS(Plugin::Uri().'css/style.css');

include('inc/class_jgalery.php');
include('inc/class_jpicture.php');
include('inc/class_jcarousel.php');
include('inc/class_brickarray.php');
include('inc/class_nivoslider.php');

?>