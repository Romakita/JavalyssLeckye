<?php
/** section: Core
 * class PageInfo < Models
 **/
if(!class_exists('PageInfo')):
class PageInfo{
	public $Title = 		'';
	public $ShortTitle = 	'';
	public $Author =		'';
	public $Date =			'';
	public $Description = 	'';
	public $Keywords = 		'';
	
	protected static $Header = array( 
		'Name' => 			'Title',
		'ShortTitle' =>		'ShortTitle',
		'Author' => 		'Author', 
		'Date' => 			'Date',
		'Keywords' => 		'Keywords',
		'Description' => 	'Description'
	);
/**
 * PageInfo.Extensions -> Array
 *
 * Liste des extensions de fichier à analyser.
 **/
	public $Extensions = array('.php');
	
	public static function GetList($folder){
		
		$root =		$folder;
		$files = 	self::FileList($folder);
		$array = 	array();
		
		foreach($files as $file){
			if (!is_readable( $file ) ) continue;
			
			$data = Models::GetFileData($file, self::$Header); 
			
			if ( empty ( $data['Name'] ) ) continue;
			
			$data['Path'] =		$file;
			
			array_push($array, $data);			
		}
		
		return $array;
	}
	
	private static function FileList($folder){
		$root = $folder;
		
		$dir = @opendir($root);
		
		if(!$dir) return array();
		
		$files = array();
		
		if ($dir) {
			
			while (($file = readdir( $dir ) ) !== false ) {
				
				if ( substr($file, 0, 1) == '.' ) continue;
				if ( substr($file, 0, 1) == '..' ) continue;
							
				if ( is_dir( $root.$file ) ) {
					
					$files = array_merge($files, self::FileList( $root.$file.'/'));
					
				} else {
					if (Stream::Extension($file) == 'php') {
						array_push($files, $root.$file);
					}
				}
			}
		}
				
		@closedir( $dir );
		
		return $files;
	}
		
		
	public static function Get($link){
		//$info = new self(dirname($link).'/', ABS_PATH);
		if(is_readable($link)){
			$data = Models::GetFileData($link, self::$Header); 
			
			foreach($data as $key => $value){
				$info->$key = $value;	
			}
			
			return $info;
		}
		
		return false;
	}
}
endif;
?>