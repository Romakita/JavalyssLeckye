<?php
/*
Plugin Name: Messenger
Plugin URI:	http://javalyss.fr/extensions/messenger/
Description: Messenger permet de chatter au travers du logiciel Javalyss.
Author: Lenzotti Romain
Version: 1.2
Author URI: http://rom-makita.fr/

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
if(!defined('MESSENGER_PATH')) define('MESSENGER_PATH', Plugin::Path(). 'rooms/');

//inclusion des scripts JS
System::addScript(Plugin::Uri().'js/class_messenger.js');
System::addCSS(Plugin::Uri().'css/style.css');

//inclusion des scripts CSS
//System::addCSS(Plugin::Uri().'css/style.css');
include_once('inc/class_room.php');
include_once('inc/abstract_rooms_users.php');
include_once('inc/class_message.php');
include_once('inc/class_messenger.php');
//Ecoute des événements du logiciel
System::observe('gateway.exec', array('MessengerUI', 'exec'));
System::observe('gateway.exec', array('Room', 'exec'));
System::observe('gateway.exec', array('Message', 'exec'));

System::observe('plugin.active', array('MessengerUI','active')); 
System::observe('plugin.configure', array('MessengerUI','configure'));
/*System::observe('plugin.deactive', array('C2EPhone','deactive'));
*/

?>