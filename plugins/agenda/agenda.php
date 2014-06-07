<?php
/*
Plugin Name: Agenda
Plugin URI:	http://www.javalyss.fr/extensions/mystore/
Description: Gérez votre employe du temps avec Agenda.
Author: Romain Lenzotti - Analemme
Version: 1.2
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

define('AGENDA_URI', Plugin::Uri());
define('AGENDA_PATH', Plugin::Path());

include('inc/abstract_agenda.php');

?>