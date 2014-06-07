<?php
/*
Plugin Name: Ville de France
Plugin URI:	http://www.javalyss.fr/marketplace/villefrance/
Description: Cette extension ajoute au logiciel la liste des villes de France que vous pourrez utiliser dans vos formulaires à l'aide des objets InputCity et InputCP. <p class="note">Attention l'installation du module peut pendre un moment.</p>
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

define('VDF_PATH', Plugin::Path());

include_once('inc/class_city.php');

class Region extends VilleDeFrance\County{}
class Departement extends VilleDeFrance\Department{}
class Ville extends VilleDeFrance\City{}
?>