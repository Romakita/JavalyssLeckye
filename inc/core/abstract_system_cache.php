<?php
/** section: Core
 * class System.Cache
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
namespace System;

class Cache extends \ObjectTools{
/**
 * System.Cache#Width -> Number
 **/
	public $Width = 	120;
/**
 * System.Cache#Width -> Number
 **/
	public $Height = 	120;
/**
 * System.Cache#ID -> Number
 **/
	public $ID = 				'';
	
	protected $IDEncrypted = 	'';
/**
 * System.Cache#Src -> String
 * Lien du fichier source.
 **/
	public $Src =		'';
/**
 * System.Cache#SrcCache -> String
 * Lien du fichier source dans le cache.
 **/	
	public $SrcCache =		'';
/**
 * new System.Cache()
 * new System.Cache(object)
 * new System.Cache(array)
 * new System.Cache(fileSrc)
 *
 * Cette méthode créée une nouvelle instance [[System.Cache]] permettant d'ajouter ou de supprimer un fichier du cache.
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
		$this->Src = \File::ToABS($this->Src);
		
		if(!file_exists($this->Src)){
			$this->Src = $file;
		}
	}
/**
 * System.Cache.Push(fileSrc) -> String
 * System.Cache.Push(object) -> String
 * System.Cache.Push(array) -> String
 * System.Cache.Push(systemCache) -> String
 * - fileSrc (String): Lien du fichier à mettre en cache.
 *
 * Cette méthode ajoute un fichier au gestionnaire du cache.
 **/	
	public static function Push($o){
		
		if($o instanceof Cache === false){
			$o = new self($o);
		}
		
		if($o->Src == '' || $o->Src == ABS_PATH){//protection du dossier root
			return '';
		}
		
		if(!file_exists($o->Src)){
			return $o->Src;	
		}
		
		$o->createFileID();
		//
		//
		//
		@\Stream::MkDir(\System::Path('publics').'cache/', 0711);
		
		if(!$o->exists()){
			\Stream::Copy($o->Src, $o->SrcCache);
			chmod($o->SrcCache, 0775);
			\Stream::Resize($o->SrcCache, $o->Width, $o->Height);
		}
		
		return \File::ToURI($o->SrcCache);
	}
/**
 * System.Cache.Remove(fileSrc) -> void
 * System.Cache.Remove(object) -> void
 * System.Cache.Remove(array) -> void
 * System.Cache.Remove(systemCache) -> void
 *
 * Cette méthode supprime un fichier du gestionnaire du cache.
 **/	
	public static function Remove($o){
		
		if(!($o instanceof Cache)){
			$o = new self($o);
		}
		
		$o->createFileID();
		
		@\Stream::MkDir(\System::Path('publics').'cache/', 0711);
		
		if($o->Src == '' || $o->Src == ABS_PATH){//protection du dossier root
			return;
		}
		
		if($o->exists()){
			@\Stream::Delete($o->Src, $o->SrcCache);
		}
	}
	
	protected function createFileID(){
		
		if(empty($this->ID)){
			$id = \File::ToRel($this->Src);
		}else{
			$id = $this->ID;	
		}
		
		
		$this->IDEncrypted = 	substr(md5($id), 0, 32) . '.' . \Stream::Extension($this->Src);
		$this->SrcCache =		$file = \System::Path('publics').'cache/' . $this->IDEncrypted;
	}
	
	protected function exists(){
		return file_exists($this->SrcCache);
	}
}