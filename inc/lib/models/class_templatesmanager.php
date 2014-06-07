<?php
require_once('class_models.php');
/** section: Library
 * class TemplatesManager < Models
 *
 * Cette classe gère la destection des templates CSS pour votre site Web.
 **/
if(!class_exists('TemplatesManager')):
class TemplatesManager extends Models{
	
	protected $Header = array( 
		'Name' => 'Theme Name', 
		'ThemeURI' => 'Theme URI', 
		'Version' => 'Version', 
		'Description' => 'Description', 
		'Author' => 'Author', 
		'AuthorURI' => 'Author URI', 
		'TextDomain' => 'Text Domain', 
		'DomainPath' => 'Domain Path' 
	);
/**
 * TemplatesManager.Extensions -> Array
 *
 * Liste des extensions de fichier à analyser.
 **/
	public $Extensions = array('.xml', '.php', '.css');
}

class ThemesManager extends TemplatesManager{}
endif;
?>