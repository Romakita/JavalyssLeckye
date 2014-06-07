<?php
/*
Plugin Name: Interactive Catalog
Plugin URI:	http://www.javalyss.fr/extensions/interactive-catalogue/
Description: Cette extension permet de gérer une collection de catalogue.
Version: 1.0
Author: Lenzotti Romain
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

define('IC_URI', Plugin::Uri());
/**
 * == InteractiveCarousel == 
 * Documentation de l'extension BlogPress
 **/
System::addCSS(Plugin::Uri().'css/style.css');
System::addScript(Plugin::Uri().'js/class_icui.js');

include('inc/class_icmanager.php');
include('inc/class_icatalog.php');
include('inc/class_icstats.php');

System::observe('gateway.exec', array('ICManager', 'exec'));
System::observe('gateway.exec', array('iCatalog', 'exec'));
System::observe('gateway.exec', array('iCStat', 'exec'));
System::observe('gateway.safe.exec', array('iCatalog', 'execSafe'));
System::observe('plugin.active', array('ICManager','Active'));
System::observe('plugin.deactive', array('ICManager','Deactive'));
//System::observe('blog:startinterface', array('InteractiveCatalog','onStartInterface'));
//System::Observe('blog:post.build', array('InteractiveCatalog', 'onBuildPost'));

?>