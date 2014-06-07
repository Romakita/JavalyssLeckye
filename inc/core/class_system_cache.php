<?php
/** section: Core
 * class SystemCache
 * includes ObjectTools
 *
 * Cette utilitaire gère la mise en cache de fichier.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_system_cache.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class SystemCache extends ObjectTools{
/**
 * SystemCache#Width -> Number
 **/
	public $Width = 	120;
/**
 * SystemCache#Width -> Number
 **/
	public $Height = 	120;
/**
 * SystemCache#ID -> Number
 **/
	public $ID = 				'';
	
	protected $IDEncrypted = 	'';
/**
 * SystemCache#Src -> String
 * Lien du fichier source.
 **/
	public $Src =		'';
/**
 * SystemCache#SrcCache -> String
 * Lien du fichier source dans le cache.
 **/	
	public $SrcCache =		'';
/**
 * new SystemCache()
 * new SystemCache(object)
 * new SystemCache(array)
 * new SystemCache(fileSrc)
 *
 * Cette méthode créée une nouvelle instance [[SystemCache]] permettant d'ajouter ou de supprimer un fichier du cache.
 **/	
	function __construct($o = NULL){
		if(!empty($o)){
			
			if(is_array($o) || is_object($o)){
				$this->extend($o);
			}elseif(is_string($o)){
				$this->Src = $o;	
			}
		}
		$file = $this->Src;
		$this->Src = File::ToABS($this->Src);
		
		if(!file_exists($this->Src)){
			$this->Src = $file;
		}
	}
/**
 * SystemCache.Push(fileSrc) -> String
 * SystemCache.Push(object) -> String
 * SystemCache.Push(array) -> String
 * SystemCache.Push(systemCache) -> String
 * - fileSrc (String): Lien du fichier à mettre en cache.
 *
 * Cette méthode ajoute un fichier au gestionnaire du cache.
 **/	
	public static function Push($o){
		
		if($o instanceof SystemCache === false){
			$o = new self($o);
		}
		
		if($o->Src == '' || $o->Src == ABS_PATH){//protection du dossier root
			return;
		}
		
		if(!file_exists($o->Src)){
			return $o->Src;	
		}
		
		$o->createFileID();
		//
		//
		//
		@Stream::MkDir(System::Path('publics').'cache/', 0711);
		
		if(!$o->exists()){
			Stream::Copy($o->Src, $o->SrcCache);
			chmod($o->SrcCache, 0775);
			Stream::Resize($o->SrcCache, $o->Width, $o->Height);
		}
		
		return File::ToURI($o->SrcCache);
	}
/**
 * SystemCache.Remove(fileSrc) -> void
 * SystemCache.Remove(object) -> void
 * SystemCache.Remove(array) -> void
 * SystemCache.Remove(systemCache) -> void
 *
 * Cette méthode supprime un fichier du gestionnaire du cache.
 **/	
	public static function Remove($o){
		
		if(!($o instanceof  SystemCache)){
			$o = new self($o);
		}
		
		$o->createFileID();
		
		@Stream::MkDir(System::Path('publics').'cache/', 0711);
		
		if($o->Src == '' || $o->Src == ABS_PATH){//protection du dossier root
			return;
		}
		
		if($o->exists()){
			@Stream::Delete($o->Src, $o->SrcCache);
		}
	}
	
	protected function createFileID(){
		
		if(empty($this->ID)){
			$id = File::ToRel($this->Src);
		}else{
			$id = $this->ID;	
		}
		
		
		$this->IDEncrypted = 	substr(md5($id), 0, 32) . '.' . Stream::Extension($this->Src);
		$this->SrcCache =		$file = System::Path('publics').'cache/' . $this->IDEncrypted;
	}
	
	protected function exists(){
		return file_exists($this->SrcCache);
	}
}

?>