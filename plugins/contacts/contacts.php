<?php
/*
Plugin Name: Contacts
Plugin URI:	http://www.javalyss.fr/marketplace/clients-manager/
Description: Gestion des contacts
Author: Lenzotti Romain
Version: 1.1
Author URI: http://www.planningmaster.fr

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
define('CONTACTS_PATH', Plugin::Path());//chemin absolue du répertoire de l'extension ex : /www/plugins/pmo/

include('inc/class_contact.php');
include('inc/class_contact_media.php');
?>