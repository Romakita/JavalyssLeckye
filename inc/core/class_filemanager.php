<?php
/** section: Core
 * class FileManager
 *
 * Cette classe gère permet la gestion des médias sur le serveur web.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_filemanger.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class FileManager{
/**
 * FileManager.Path -> String
 * Dossier de référence des médias.
 **/	
	public $Path;
/**
 * FileManager#AbsPath -> String
 **/
	protected $AbsPath;
/**
 * FileManager#UriPath -> String
 **/
	protected $UriPath;
/**
 * FileManager#extension -> String
 * Liste des extensions autorisées
 **/
	public $extension = '';
/**
 * FileManager#exclude -> String
 * Liste des extensions interdites.
 **/
	public $exclude =	'';
/**
 * FileManager#prefixe -> String
 **/
	public 	$prefixe = '';
/*
 * FileManager.TABLE_NAME -> String
 **/
	const TABLE_NAME = 	'';
/*
 * FileManager.PRIMARY_KEY -> String
 **/
	const PRIMARY_KEY = '';
/**
 * new FileManager([prefixe])
 *
 * Crée une nouvelle instance [[FileManager]].
 **/
	function __construct($prefixe = ''){
		$this->prefixe = 	$prefixe;
		$this->AbsPath = 	ABS_PATH;
		$this->UriPath = 	URI_PATH;
		$this->extension = 	System::Meta('EXT_FILE_AUTH');
		$this->exclude = 	System::Meta('EXT_FILE_EXCLUDE');
		
		if($this->extension == ''){
			$this->extension = 'accdb;avi;bmp;csv;css;doc;dot;docx;eml;flv;gif;html;java;jpg;jpeg;js;mp3;mpg;mpeg;mov;ods;one;php;psd;pub;pps;ppsx;ppt;pptx;png;pdf;rar;sql;swf;tar;txt;vcs;vcf;vsd;xls;xlsx;zip';
			System::Meta('EXT_FILE_AUTH', $this->extension);	
		}
		
		if(empty($this->exclude) && $this->exclude != ''){
			$this->exclude = 	System::Meta('EXT_FILE_EXCLUDE', '');
		}
	}
/**
 * FileManager#initialize() -> void
 * 
 * Cette méthode initialise le lien du dossier de référence et les extensions autorisées à être manipulés.
 **/	
	public function Initialize(){
		global $S;	
		
		if(!User::IsConnect()) return;
		
		switch($this->prefixe){
			default:
				$this->Path = 		System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path();
				break;
			case 'plugin':
				$this->Path = 		System::Path('plugin');
				$this->extension = 'bmp;sql;doc;docx;dot;gif;jpeg;jpg;pdf;png;pps;ppt;psd;pub;xls;xlsx;txt;rar;swf;zip;php;js;css;xml;';
				break;
		}
		
		//echo $this->Path;
		$this->AbsPath = 	ABS_PATH;
		
		$dir = 				explode('/',$_SERVER['PHP_SELF']);
		$dir = 				str_replace($dir[count($dir) - 1], '', $_SERVER['PHP_SELF']);
		
		$this->UriPath = 	'http://'.$_SERVER['SERVER_NAME'].$dir;
	}
/**
 * FileManager.DefaultImport() -> void
 *
 * Cette méthode importe un élément dans le dossier `public/import/`.
 **/	
	static function DefaultImport(){
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'import/';
		@Stream::MkDir($folder, 0771);
		FrameWorker::Start();
		FrameWorker::Upload($folder, System::Meta('EXT_FILE_AUTH'));				
		FrameWorker::Stop();
	}
/**
 * FileManager#tree(folder) -> Array
 *
 * Cette méthode retourne l'arborescence d'un dossier.
 **/	
	public function tree($folder = NULL){
		
		$path = @$folder ? $this->Path.$folder.'/' : $this->Path;
		
		
				
		$tree = Stream::Tree($path, false);
		
		if(!$tree){
			return false;
		}
		
		for($i = 0; $i < $tree['length']; $i++){
			self::UriTree($tree[$i]);
		}
		
		return $tree;
	}
/**
 * FileManager#create(folder) -> Boolean
 * - folder (String): Chemin du nouveau dossier à créer.
 *
 * Cette méthode créée un nouveau dossier dans le gestionnaire des médias.
 **/	
	public function create($folder){
		return Stream::MkDir($this->toAbs(@$folder), 0751);
	}
/**
 * FileManager#delete(file) -> Boolean
 * - file (String): Chemin de l'élément à supprimer.
 *
 * Cette méthode supprime un élément du gestionnaire des médias.
 **/		
	public function delete($file){
		$file = $this->toAbs(@$file);
		return Stream::Delete($file, array($this->Path, ABS_PATH));	
	}
/**
 * FileManager#copy(src, dest) -> Boolean
 * - src (String): Chemin  source de l'élément à copier
 * - dest (String): Chemin de destination.
 *
 * Cette méthode copie un élément du gestionnaire des médias.
 **/	
	public function copy($src, $dest){
		$src = 	$this->toAbs($src);
		$dest = $this->toAbs($dest);
												
		return Stream::Copy($src, $dest);
	}
/**
 * FileManager#cut(src, dest) -> Boolean
 * - src (String): Chemin  source de l'élément à déplacer.
 * - dest (String): Chemin de destination.
 *
 * Cette méthode déplace un élément du gestionnaire des médias.
 **/	
	public function cut($src, $dest){
		$old = $this->toAbs($src);
		$new = $this->toAbs($dest);
												
		if(Stream::Copy($old, $new)){
			Stream::Delete($old);	
			return true;
		}
		
		return false;
	}
/**
 * FileManager#rename(old, new) -> Boolean
 * - old (String): Nom de l'élément à renommer.
 * - new (String): Nouveau nom de l'élément.
 *
 * Cette méthode renomme un élément du gestionnaire des médias.
 **/
	public function rename($old, $new){
		$old = $file = $this->toAbs($old);
		$new = $file = $this->toAbs($new);
		
		return Stream::Rename($old, $new);
	}
/**
 * FileManager#touch(file) -> void
 * - file (String): Chemin du fichier à modifier.
 *
 * Cette méthode modifie la date d'accès d'un élément du gestionnaire des médias.
 **/	
	public function touch($file){
		$file = $this->toAbs(@$file);
		@touch($file);	
	}
/**
 * FileManager#import(folder) -> String
 * - folder (String): Dossier de reception.
 *
 * Cette méthode importe un élément stocké dans le buffer `$_FILES` dans le dossier `folder`.
 **/
	public function import($file){
		$folder = $file = $this->toAbs(@$file);
				
		FrameWorker::Start();
		//récupération du fichier
		$file = FrameWorker::Upload($folder, $this->extension);	
		
		//vérification du Quota
		if(@$_POST['Quota'] != 0){
			if($_POST['Quota'] <= Stream::Quota($this->Path)){
				//suppression du fichier téléchargé.
				Stream::Delete($file, array(ABS_PATH, $this->Path));
				FrameWorker::Error('filemanager.import.err', 'You no longer have storage space available');
				return 0;
			}
		}
						
		FrameWorker::Stop($this->toURI($file));
		return $file;
	}
/**
 * FileManager.exec(command) -> Number
 * - command (String): Commande à exécuter.
 *
 * Cette méthode `static` exécute une commande envoyée par l'interface du logiciel.
 **/
	public function exec($op){
		System::iDie();
		
		$this->Initialize();
		
		switch($op){
			case 'frameworker.default.import':
				self::DefaultImport();				
				exit();
				
			case $this->prefixe.'filemanager.arborescence':
				
				if(!$tab = $this->tree(@$_POST['Folder'])){
					return $op.'.err';
				}
				
				echo json_encode($tab);
				
				break;
				
			case $this->prefixe.'filemanager.import':
				$file = $this->import(@$_POST['Folder']);
				break;
				
			case $this->prefixe.'filemanager.export':
			
				$file = $this->toAbs(@$_POST['file']);
				
				if(!in_array(Stream::Extension($file), array('zip', 'rar', 'tar'))){
					Stream::Package($file,  $file.'.zip');	
					FrameWorker::Download($file.'.zip');
					@Stream::Delete($file.'.zip');
				}else{
					FrameWorker::Download($file);
				}				
				break;
				
			case $this->prefixe.'filemanager.list':
				
				$tab = $this->GetList(@$_POST['Folder']);
				if(!$tab){
					return $op.'.err';
				}
				echo json_encode($tab);
				break;
				
			case $this->prefixe.'filemanager.create':
				if(!$this->create(@$_POST['Folder'])){
					return $op.'.err';
				}
				break;
				
			case $this->prefixe.'filemanager.rename':
										
				if(!$this->rename(@$_POST['File'], @$_POST['toFile'])){
					return $op.'.err';
				}
								
				break;
				
			case $this->prefixe.'filemanager.copy':
				
				if(!$this->copy(@$_POST['Src'], @$_POST['Dest'])){
					return $op.'.err';
				}
								
				break;
				
			case $this->prefixe.'filemanager.cut':
								
				if(!$this->cut(@$_POST['Src'], @$_POST['Dest'])){
					return $op.'.err';
				}
				
				break;

			case $this->prefixe.'filemanager.delete':
				
				if(!$this->delete(@$_POST['File'])){
					return $op.'.err';
				}
				
				break;

			case $this->prefixe.'filemanager.touch':
				$this->touch(@$_POST['File']);				
				break;
			
			case $this->prefixe.'filemanager.zip':
								
				break;
				
			case $this->prefixe.'filemanager.unzip':
								
				break;
		}
		return 0;
	}
/**
 * FileManager#toAbs(link) -> String
 * - link (String): Lien à convertir.
 *
 * `protected` Cette méthode contervit un lien HTTP ou relatif en lien absolue.
 **/	
	protected function toAbs($link = ''){
		if($link == '') return $this->Path;
		$folder = str_replace(ABS_PATH, '', rawurldecode($this->Path));
		return ABS_PATH.$folder.str_replace($folder, '', $this->toRel(rawurldecode($link)));
	}
/**
 * FileManager#toUri(link) -> String
 * - link (String): Lien à convertir.
 *
 * `protected` Cette méthode contervit un lien absolue en lien HTTP.
 **/
	protected function toURI($link){
		return str_replace(ABS_PATH, URI_PATH, rawurldecode($link));
	}
/**
 * FileManager#toRel(link) -> String
 * - link (String): Lien à convertir.
 *
 * `protected` Cette méthode contervie un lien absolue ou HTTP en lien relatif.
 **/	
	protected function toRel($link){
		return str_replace(array(ABS_PATH, URI_PATH), '', $link);
	}
	
	protected function UriTree($node){
					
		$node->uri = $this->toURI($node->link);
		$node->rel = $this->toRel($node->link);
		
		for($i = 0; $i < $node->childs['length']; $i++){
			self::UriTree($node->childs[$i]);
		}
	}
/**
 * FileManager.GetList([folder = '']) -> Array | Boolean
 * - folder
 *
 * Cette méthode liste l'ensemble des élements du dossier `folder`.
 *
 **/
	public function GetList($folder = ''){
		
		$folder = $this->toAbs($folder);
		
		//tentative de création du dossier si inexistant
		Stream::MkDir($this->Path, 0751);
		
		//récupération de la liste
		$list = Stream::FileList($folder, '', array('php'));
		
		usort($list, array('FileManager', 'onSort'));
		
		$array['length'] = 0;
		
		foreach ($list as $file) {

			if($file->isDir()){
				foreach($file as $key => $value){
					$array[$array['length']][$key] = $value;
				}
								
			}else{
								
				//convertion de l'objet File en Array
				foreach($file as $key => $value){
					$array[$array['length']][$key] = utf8_decode($value);
				}
				
			}
			//reconstitution de l'uri
			if(in_array(Stream::Extension($array[$array['length']]['link']), array('jpg', 'gif', 'png'))){
				
				$array[$array['length']]['miniature'] = 	SystemCache::Push($array[$array['length']]['link']);
				
				/*$miniature = 	System::Path('publics').'cache/' . 'min-' . substr(md5(basename($current)), 0, 30) .'.'. Stream::Extension($current);
				
				if(!file_exists($miniature)){
					@Stream::MkDir(System::Path('publics').'cache/', 0775);
					Stream::Copy($current, $miniature);
					Stream::Resize($miniature, 120, 120);
				}
				
				$array[$array['length']]['miniature'] = $miniature);*/
				 				  
			}
			$array[$array['length']]['uri'] = $this->toURI($array[$array['length']]['link']);
			$array[$array['length']]['rel'] = $this->toRel($array[$array['length']]['link']);
				
			$array['length']++;
		}
		
		$array['Quota'] =  Stream::Quota($this->Path);
		
		return $array;
	}
	
	public static function onSort($a, $b){
		return strcmp(basename($a->link), basename($b->link));
	}
}