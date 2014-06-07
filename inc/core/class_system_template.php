<?php
/** section: Core
 * class SystemTemplate
 *
 * Cette classe permet de récupérer les templates du logiciel dans le dossier cible.
 * 
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_models.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
//require_once('../lib/models/class_models.php');

class SystemTemplate extends Models{
	
	protected $Header = array( 
		'Name' => 			'Theme Name', 
		'ThemeURI' => 		'Theme URI', 
		'Version' => 		'Version', 
		'Description' => 	'Description', 
		'Author' => 		'Author', 
		'AuthorURI' => 		'Author URI', 
		'TextDomain' => 	'Text Domain', 
		'DomainPath' => 	'Domain Path',
		'Tags' =>			'Tags'
	);
/**
 * SystemTemplate.Extensions -> Array
 *
 * Liste des extensions de fichier à analyser.
 **/
	public $Extensions = array('.xml', '.php', '.css');	
/**
 * new SystemTemplate(path [, root [,  header]])
 * - path (String): Répertoire du dossier à analyser.
 * - root (String): Répertoire racine du site.
 *
 * Cette méthode créée une nouvelle instance de [[SystemTemplate]].
 **/
	function __construct($path, $root = '', $header = NULL){
		
		if(is_array($header)){
			$this->Header = $header;
		}
		//
		// AbsolutePath
		//
		$this->AbsPath = 		$path;
		//
		// HomePath
		//
		$this->HomePath	=		$root;
							
		//$this->Array = $this->GetList();
		
	}	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
	}
	
	public static function exec($op){
		
		switch($op){
			case 'system.template.list':
				
				$o = new self(System::Path('themes'), System::Path('self'));
				
				echo json_encode($o->getList());
				break;	
		}
	}
	
	public function getList($root = ''){
		$array = 	parent::getList();
		$options = 	array();
		
		foreach($array as $key => $template){
			
			if(strpos($template['Tags'], 'Javalyss') !== false) {
				$options[$key] = $template;	
			}
				
		}
		
		return $options;
	}
}

SystemTemplate::Initialize();

?>