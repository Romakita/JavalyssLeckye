<?php
/*
Plugin Name: Exposition Manager
Plugin URI:	http://www.javalyss.fr/marketplace/exposition/
Description: Cette extension ajoute la gestion des expositions et notes de frais pour les artisants.
Author: Lenzotti Romain
Version: 1.1
Author URI: http://rom-makita.fr

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
System::addCSS(Plugin::Uri().'css/style.css');
System::addScript(Plugin::Uri().'js/class_expense.js');
System::addScript(Plugin::Uri().'js/class_exposition.js');

System::EnqueueScript('window.schedule');

if(class_exists('Post')){
	include_once('inc/class_exposition.php');
	include_once('inc/class_expense.php');
}
?>