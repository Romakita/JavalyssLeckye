<?php
/*
Plugin Name: TheMUI
Plugin URI:	http://www.javalyss.fr/market/themui/
Description: Déployez votre site à l'international avec l'extension TheMUI. TheMUI ajoute toutes les fonctionnalités nécessaires à la rédaction d'articles et de pages dans différentes langues !
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

if(class_exists('Multilingual')):
	System::addCSS(Plugin::Uri().'css/style.css');
	System::addScript(Plugin::Uri().'js/class_mui.js');

	include_once('inc/class_themui.php');
	
	System::observe('gateway.exec', array('TheMUI', 'exec'));
	System::observe('blog:startinterface', array('TheMUI', 'onStartInterface'));
	
	if(class_exists('BlogPress')){
		Blog::Observe('post.build', array('TheMUI', 'onBuildPost'));
		Blog::Observe('posts.draw', array('TheMUI', 'onDrawPost'));
	}
endif;

?>