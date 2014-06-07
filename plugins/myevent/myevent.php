<?php
/*
Plugin Name: MyEvent
Plugin URI:	http://www.javalyss.fr/extensions/myevent/
Description: Créez votre boutique en ligne avec MyEvent.
Author: Analemme
Version: 1.0
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

define('MYSTORE_URI', Plugin::Uri());
define('MYEVENT_PATH', Plugin::Path());
error_reporting(E_ALL);


include('inc/abstract_myevent.php');

?>