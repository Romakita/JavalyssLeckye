<?php
/** section: Core
 * class BlogpressTemplate
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

class BlogpressTemplateList extends Models{
	
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
 * BlogpressTemplateModel.Extensions -> Array
 *
 * Liste des extensions de fichier à analyser.
 **/
	public $Extensions = array('.css');	
	
	public static $Current =	NULL;
/**
 * new BlogpressTemplateModel(path [, root [,  header]])
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
		
	public function getList($root = ''){
		
		if(!empty($_SESSION[__CLASS__])){
			return unserialize($_SESSION[__CLASS__]);
		}
		
		$array = 	parent::getList();
		$options = 	array();
		
		foreach($array as $key => $template){
			
			if(strpos($template['Tags'], 'Javalyss') !== false && strpos($template['Tags'], 'BlogPress') === false) {
				continue;	
			}
			
			if(strpos($template['Tags'], 'editor-style') !== false || strpos($template['Tags'], 'rtl') !== false){
				continue;
			}
			
			$path = dirname(System::Path('themes') . '/' . $key).'/';
			//
			// Récupération des informations complémentaires.
 			//
			$template['Folder'] = 			dirname($key);
			$template['LinkCssEditor'] = 	file_exists($path . 'editor.css') ? File::ToURI($path . 'editor.css') : '';
			
			if(file_exists($path . 'screenshot.png')){
				$template['Picture'] =		@SystemCache::Push(array(
													'Src' => $path . 'screenshot.png',
													'Width' => 590,
													'Height' => 450,
													'ID' => dirname($path . 'screenshot.png') . '-600'
												));
				
				
				$template['Preview'] =		@SystemCache::Push(array(
													'Src' => $path . 'screenshot.png',
													'Width' => 290,
													'Height' => 225,
													'ID' => dirname($path . 'screenshot.png') . '-300'
												));
			}else{
				$template['Picture'] = $template['Preview'] =		'';
			}
			
			$template['Description'] = '<p><strong>' . MUI('Version') .' : </strong>' . $template['Version'] . '</p><p><strong>' . MUI('Description') .' : </strong>' . $template['Description'] . '</p>';
			$template['Description'] .= '<p>' . MUI('Tous les fichiers de ce thème se trouvent dans') . ' <code>/themes/'.$template['Folder'].'</code>.';
			
			
			$options[$key] = $template;
			
			if($template['Folder'] == BlogPress::Meta('BP_THEME')){
				self::$Current = $template;
			}
						
		}
		
		$_SESSION[__CLASS__] = serialize($options);
		 
		return $options;
	}
	
	public function getCurrent(){
		
		$array = 	$this->getList();
		
		return self::$Current;
	}
}

?>