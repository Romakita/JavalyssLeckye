<?php
/*
 * == Index ==
 **/

define('MODE_FINSTALL', false);

if(@!file_exists('inc/conf/conf.db.php') || MODE_FINSTALL){
	include('install.php');
}else{
	define('TEST_UPDATE', true);
	include('inc/conf/default/conf.install.php');
	include('inc/inc.php');
}
?>