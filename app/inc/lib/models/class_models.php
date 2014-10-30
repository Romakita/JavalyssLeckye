<?php
/** section: Library
 * class Models
 *
 * Cette classe permet de lister un ensemble de fichier ayant une entête commenté précise.
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
if(!class_exists('Models')):

class Models{
/**
 * Models.VERSION -> String
 * Numéro de version de la bibliothèque.
 **/
	static $VERSION = 	'1.0';
	
	protected $length = 0;
/**
 * Models#Header -> Array
 * `protected` Contient les informations d'entete par défaut.
 **/
	protected $Header = array( 
		'Name' => 			'Model Name',
		'Version' => 		'Version', 
		'Description' => 	'Description', 
		'Author' => 		'Author',
		'TextDomain' => 	'Text Domain', 
		'DomainPath' => 	'Domain Path' 
	);
/**
 * Models#Extensions -> Array
 *
 * Liste des extensions de fichier à analyser.
 **/
	public $Extensions = array('.xml', '.php');
/**
 * Models#Array -> Array
 * `protected` Liste des modèles chargés.
 **/
	protected $Array;
/**
 * Models#HomePath -> Array
 * `protected` Lien absolue du répertoire racine.
 **/
	public $HomePath;
/**
 * Models#AbsPath -> String
 * Lien absolue vers le dossier à analyser.
 **/	
	public $AbsPath;
/**
 * new Models(path [, root [,  header]])
 * - path (String): Répertoire du dossier à analyser.
 * - root (String): Répertoire racine du site.
 *
 * Cette méthode créée une nouvelle instance de [[Models]].
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
							
		$this->Array = $this->GetList();
	}
/**
 * Models#link(key) -> Boolean
 * - key (String): Nom de la clef.
 *
 * Cette méthode retourne le lien du script analysé.
 **/
	public function link($key){
		if(empty($this->Array[$key])) return false;
		
		return $this->AbsPath . $key;
	}
/**
 * Models.CleanComment(str) -> String
 * - str (String): Message à nettoyer.
 *
 * `final` `static` Nettoye l'entete des caractères spéciaux.
 **/
	public static function CleanComment($str) {
		return trim(preg_replace("/\s*(?:\*\/|\?>).*/", '', $str));
	}
/**
 * Models#current() -> Array
 *
 * `final` Cette méthode retourne le modele actuellement pointé.
 **/
	public function current(){
		return is_array($this->Array) ? @current($this->Array) : false;
	}
/**
 * Models#key() -> String
 *
 * `final` Cette méthode retourne la clef actuellement pointé.
 **/
	public function key(){
		return is_array($this->Array) ? @key($this->Array) : false;
	}
/**
 * Models#next() -> Array
 *
 * `final` Cette méthode déplace le pointeur du tableau vers la prochaine position et retourne le plugin.
 **/
	public function next(){
		return is_array($this->Array) ? @next($this->Array) : false;
	}
/** alias of: Models#pathURI
 * Models#uri() -> String 
 *
 * `final` Cette méthode retourne la lien URI du plugin actuellement pointé.
 **/
	public function Uri(){
		$a = current($this->Array);
		return $a['PathURI'];
	}
/** 
 * Models#pathURI() -> String 
 *
 * `final` Cette méthode retourne la lien URI du plugin actuellement pointé.
 **/	
	public function pathURI(){
		$a = current($this->Array);
		return $a['PathURI'];
	}
/**
 * Models#prev() -> Array
 *
 * `final` Cette méthode déplace le pointeur du tableau vers sa précèdente position et retourne le plugin.
 **/
	public function prev(){
		return is_array($this->Array) ? @prev($this->Array) : false;
	}
/**
 * Models#push(key, value) -> void
 * - key (String): Lien du dossier du modele.
 * - value (String): Informations sur le modele.
 *
 * `final` Cette méthode ajoute un modele à l'instance.
 **/
	public function push($key, $value=''){
		if($key != '') {;
			$this->Array[$this->key()][$key] = $value;
		}
	}
/**
 * Models#path() -> String
 *
 * `final` Cette méthode retourne le chemin absolue du modele.
 **/
	public function path(){
		return $this->AbsPath.$this->key();
	}
	
	public function relativePath(){
		return $this->AbsPath.$this->key();
	}
/**
 * Models#reset() -> Array
 * 
 * `final` Cette méthode réinitialise le pointeur du tableau et retourne le premier modele du tableau.
 **/
	public function reset(){
		return is_array($this->Array) ? reset($this->Array) : false;
	}

	public function toJSON(){
		return json_encode($this->Array);
	}
	
	public function toObject(){
		return json_decode(json_encode($this->Array));
	}
	
	public function size(){
		return $this->length;
	}
/**
 * Models#getURI() -> String
 *
 * `final` Cette méthode retourne le lien URI du répertoire des plugins.
 **/
	public function getURI(){
	
		$dir = 	explode('/',$_SERVER['PHP_SELF']);
			
		$dir = 	str_replace($dir[count($dir) - 1], '', $_SERVER['PHP_SELF']);
		
		$uri =  '';
		
		if(@$_SERVER['HTTPS'] == 'on'){
			$uri = 'https://'. $_SERVER['SERVER_NAME'].$dir.str_replace($this->HomePath, '', $this->AbsPath);
		}else{
			$uri = 'http://'. $_SERVER['SERVER_NAME'].$dir.str_replace($this->HomePath, '', $this->AbsPath);
		}
		
		if(!preg_match('/\\//', $uri)) $uri .= '/';
		
		return $uri;
	}
/**
 * Models#getList(root) -> Array
 * - root (String): Chemin du dossier à analyser.
 *
 * `final` Cette méthode retourne la liste des modeles contenu dans le répertoire ciblé par `root`.
 **/
	public function GetList($root="") {
		
		//Declarations des variables-----------------------------------------------
		$array = array();
		
		$root .= $this->AbsPath;
		
		// Files in wp-content/plugins directory
		$dir = @opendir($root);

		if(!$dir) return false;
		
		$files = array();
		
		if ($dir) {
			
			while (($file = readdir( $dir ) ) !== false ) {
				
				if ( substr($file, 0, 1) == '.' ) continue;
				if ( substr($file, 0, 1) == '..' ) continue;
							
				if ( is_dir( $root.$file ) ) {
					
					$subdir = @ opendir( $root.$file );

					if($subdir){
							
						while (($subfile = readdir( $subdir ) ) !== false) {
							
							if(substr($subfile, 0, 1) == '.' ) 		continue;
							if(substr($subfile, 0, 1) == '..' ) 	continue;
							
							if(in_array(substr($subfile, -4), $this->Extensions)) {
								$files[] = "$file/$subfile";
							}
						}
					}
					
				} else {
					if (in_array(substr(@$file, -4), $this->Extensions)) {
						$files[] = $file;
					}
				}
			}
		}
		@closedir( $dir );
		@closedir( $subdir );
				
		if ( !$dir || empty($files) ) return $array;
		$this->length = 0;
		
		foreach ( $files as $file ) {
			
			if (!is_readable( "$root$file" ) ) continue;
			
			$data = $this->getFileData("$root$file", $this->Header); 
			
			if ( empty ( $data['Name'] ) ) continue;
			
			$basename = $this->basename( $file );
			
			$array[$basename] = $data;
			$array[$basename]['PathURI'] = $this->getURI().$basename;
			
			$pathuri =  explode('/',$array[$basename]['PathURI']);
			
			$array[$basename]['PathURI'] = str_replace($pathuri[count($pathuri) -1], '', $array[$basename]['PathURI']);
			
			$this->length++;
			
		}
	
		uasort( $array, create_function( '$a, $b', 'return strnatcasecmp( $a["Name"], $b["Name"] );' ));
	
		return $array;
	}
/**
 * Models.GetFileData(file) -> Array
 * - file (String): Lien du fichier à analyser.
 *
 * Cette méthode parse le fichier `file` et retourne les metadatas contenus dans le fichier.
 *
 * The metadata of the plugin's data searches for the following in the plugin's
 * header. All plugin data must be on its own line. For plugin description, it
 * must not have any newlines or only parts of the description will be displayed
 * and the same goes for the plugin data. The below is formatted for printing.
 *
 * #### Exemple
 * 
 * <pre><code>/*
 * Plugin Name: Name of Plugin
 * Plugin URI: Link to plugin information
 * Description: Plugin Description
 * Author: Plugin author's name
 * Author URI: Link to the author's web site
 * Version: Must be set in the plugin for WordPress 2.3+
 * Text Domain: Optional. Unique identifier, should be same as the one used in plugin_text_domain()
 * Domain Path: Optional. Only useful if the translations are located in a folder above the plugin's 
 * base path. For example, if .mo files are located in the locale folder then Domain Path will 
 * be "/locale/" and must have the first slash. Defaults to the base folder the plugin is located in.
 * * / # Remove the space to close comment
 * </code></pre>
 *
 * Plugin data returned array contains the following:
 *
 * * `Name` : Name of the plugin, must be unique.
 * * `Description` : Description of what the plugin does and/or notes from the author.
 * * `Author` : The author's name
 * * `AuthorURI` : The authors web site address.
 * * `Version` : The plugin version number.
 * * `PluginURI` : Plugin web site address.
 * * `TextDomain` : Plugin's text domain for localization.
 * * `DomainPath` : Plugin's relative directory path to .mo files.
 *
 * Some users have issues with opening large files and manipulating the contents
 * for want is usually the first 1kiB or 2kiB. This function stops pulling in
 * the plugin contents when it has all of the required plugin data.
 *
 * The first 8kiB of the file will be pulled in and if the plugin data is not
 * within that first 8kiB, then the plugin author should correct their plugin
 * and move the plugin data headers to the top.
 *
 * The plugin file is assumed to have permissions to allow for scripts to read
 * the file. This is not checked however and the file is only opened for
 * reading.
 *
 **/
	public static function GetFileData($file, $headers){
		
		$hash = md5($file . json_encode($headers));
		
		if(!empty($_SESSION['FileData']) && !empty($_SESSION['FileData'][$hash])){
			return $_SESSION['FileData'][$hash];
		}
		
		//$headers = self::$Header;
		// We don't need to write to the file, so just open for reading.
		$fp = fopen( $file, 'r' );
	
		// Pull only the first 8kiB of the file in.
		$data = fread( $fp, 8192 );
	
		// PHP will close file handle, but we are good citizens.
		fclose( $fp );
	
		$all_headers = $headers;
		
		foreach ( $all_headers as $field => $regex ) {
			preg_match( '/' . preg_quote( $regex, '/' ) . ':(.*)$/mi', $data, ${$field});
			if ( !empty( ${$field} ) )
				${$field} = self::CleanComment( ${$field}[1] );
			else
				${$field} = '';
		}
	
		$data = compact( array_keys( $all_headers ) );
		$data['Title'] = $data['Name'];
		
		if(empty($_SESSION['FileData'])){
			$_SESSION['FileData'] = array();
		}
		
		$_SESSION['FileData'][$hash] = $data;
		
		return $data;
	}
	
	public function clearFileData(){
		$_SESSION['FileData'] = NULL;
		$this->Array = $this->getList();
	}
/**
 * Models#basename(file) -> String
 * - file (String): The filename of model.
 *
 * Gets the basename of a plugin.
 * This method extracts the name of a model from its filename.
 *
 **/
	protected function basename($file) {
		$file = str_replace('\\','/',$file); // sanitize for Win32 installs
		$file = str_replace('//','/',$file); // sanitize for Win32 installs
		//$file = str_replace(str_replace('\\','/',$this->HomePath), '', $file);
		$file = preg_replace('|/+|','/', $file); // remove any duplicate slash
		$plugin_dir = str_replace('\\','/', $this->AbsPath); // sanitize for Win32 installs
		$plugin_dir = preg_replace('|/+|','/', $plugin_dir); // remove any duplicate slash
		$mu_plugin_dir = str_replace('\\','/', $this->AbsPath); // sanitize for Win32 installs
		$mu_plugin_dir = preg_replace('|/+|','/', $mu_plugin_dir); // remove any duplicate slash
		$file = preg_replace('#^' . preg_quote($plugin_dir, '#') . '/|^' . preg_quote($mu_plugin_dir, '#') . '/#','',$file); // get relative path from plugins dir
		$file = trim($file, '/');
		$file = str_replace($this->HomePath, '', $file);
		return $file;
	}
}
endif;
?>