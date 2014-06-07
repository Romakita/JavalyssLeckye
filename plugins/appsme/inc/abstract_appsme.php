<?php
/** section: AppsMe
 * mixin AppsMe
 *
 * Outil de gestion de l'extension AppsMe
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : abstract_appsme.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/
abstract class AppsMe extends ObjectTools implements iPlugin{ 
	const NAME = 			'AppsMe';
	const VERSION = 		'2.0';
	const AUTHOR = 			'Lenzotti Romain';
	const ARC_NAME = 		'Javalyss AppsMe';
	const ENC =				'JSON, PHP, XML';
	const EXT =				'';
/**
 * AppsMe.Initialize() -> void
 **/
 	static function Initialize(){
		
		System::addCss(Plugin::Uri().'css/style.css');
		System::EnqueueScript('apssme.lang', Plugin::Uri().'lang/FR_fr.js');
		System::EnqueueScript('apssme', Plugin::Uri().'js/appsme.js');
		System::EnqueueScript('apssme.setting', Plugin::Uri().'js/appsme_setting.js');
		System::EnqueueScript('apssme.release', Plugin::Uri().'js/class_release.js');
		System::EnqueueScript('apssme.app', Plugin::Uri().'js/class_application.js');
		
		include('class_appcomment.php');
		include('class_application.php');
		include('class_release.php');
		include('class_release_statistic.php');
		include('class_filemanager.php');
		include('class_category.php');
		/**
		 * Global.FMAPP -> FileManager
		 * Instance du gestionnaire des applications via l'explorateur [[FileManager]].
		 **/
		$FMAPP =	new AppFileManager('application');
		
		System::Observe('gateway.exec', array('App', 'exec'));
		System::Observe('gateway.exec', array('AppCategory', 'exec'));
		System::Observe('gateway.exec', array('AppComment', 'exec'));
		System::Observe('gateway.exec', array('Release', 'exec'));
		System::Observe('gateway.safe.exec', array('Release', 'execSafe'));	
		System::Observe('gateway.exec', array(&$FMAPP, 'exec'));
		
		//
		// AppsMe
		//
		System::Observe('gateway.safe.exec', array('AppsMe', 'execSafe'));
		System::Observe('gateway.exec', array('AppsMe', 'execSafe'));
		System::Observe('gateway.exec', array('AppsMe', 'exec'));
		System::Observe('plugin.active', array('AppsMe','Install'));
		System::Observe('plugin.deactive', array('AppsMe','Uninstall'));
		System::Observe('plugin.configure', array('AppsMe','Install'));
		
		if(!class_exists('BlogPress')){
			System::Observe('system:index', array(__CLASS__, 'StartInterface'));
		}else{
			System::Observe('blogpress:startinterface', array(__CLASS__, 'StartInterface'));
		}
	}
/**
 * AppsMe.Install() -> void
 * Méthode gérant la configuration de l'extension.
 **/
 	static public function Install(){
		
		App::Install();
		Release::Install();
		AppCategory::Install();
		AppComment::Install();
		ReleaseStatistic::Install();
					
		$op = System::Meta('AppsMe_Options');
		
		if(empty($op)){
			$options->Broadcast_Update_Apps = 	1;
			$options->Enable_Incidents = 		1;
			$options->Beta = 					1;
			System::Meta('AppsMe_Options', $options);	
		}
	}
/**
 * AppsMe.Uninstall() -> void
 * Méthode gérant la désactivation de l'extension.
 **/
 	static public function Uninstall($eraseData = false){}
/**
 * AppsMe.PrintTag() -> String
 **/	
	static function PrintTag(){
		$ext = '';
		
		if(self::EXT != ''){
			$ext = '; extension: '.self::EXT;	
		}
		
		return self::NAME.' '.self::VERSION.' (by ' . self::AUTHOR . '; ' . self::ARC_NAME.'; ' . AppsMeRestAPI::ARC_VERSION . '; encoding: ' . self::ENC . $ext.')';	
	}
/**
 * AppsMe.eDie() -> void
 **/
	static public function eDie($err){
		$options = new stdClass();
		$options->repository = 	self::PrintTag();
		
		$options->cmd =			System::GetCMD();
		$options->error = 		$err;
		
		unset($_POST['options']);
		unset($_POST['clauses']);
		unset($_POST['meta']);
		
		$options->parameters = 	$_POST;
		$obj = new stdClass();
		$obj->rootName = 'Error';
		die(self::Encode($options, $obj));
	}
/**
 * AppsMe.Encode(obj) -> String
 * Cette méthode gère la conversion des données dans les formats supportés.
 **/	
	static public function Encode($obj, $options = NULL){
		$array = 	explode(', ', strtolower(self::ENC));
		$type = 	$array[0];
		
		if(!empty($_POST['Output'])){
			if(in_array(strtolower($_POST['Output']), $array)){
				$type = strtolower($_POST['Output']);	
			}
		}
		
		if(is_array($obj)){ 
			//unset($obj['maxLength']);
			unset($obj['length']);	
		}
		
		if($obj instanceof Application){
			unset($obj->SK_Model);
			unset($obj->Market);
			unset($obj->Statut);
			unset($obj->User_ID);
			unset($obj->Price);
		}
		
		if($obj instanceof Release){
			unset($obj->Statut);
		}
			
		switch($type){
			case 'json':
				$obj = json_encode($obj);
				break;
			case 'php':
				$obj = serialize($obj);
				break;
			case 'xml':
				header('Content-Type: text/xml');
				
				$obj = XmlNode::Encode($obj,empty($options->itemName) ? NULL : $options->itemName);
				
				if($obj->Name == 'array' || $obj->Name == 'stdClass'){
					$obj->Name = empty($options->rootName) ? 'Result' : $options->rootName;
				}
								
				$str = 	'<?xml version="1.0" encoding="utf-8"?>'.Stream::CARRIAGE;
				$str .= '<!--'.self::NAME.' '.self::VERSION.' (by ' . self::AUTHOR . '; ' . self::ARC_NAME.'; ' . self::ARC_VERSION . '; encoding: ' . self::ENC . ')'.'-->'.Stream::CARRIAGE;
				$obj = $str.$obj;
				
				break;
			default: die('depot.format.unsupported'); 	
		}
		return $obj;
	}
/**
 * AppsMe.StartInterface() -> Mixed
 **/	
	static public function StartInterface(){
		$link = new Permalink();
		
		if($link->match('/rest\/appsme\/([0-9].*\.[0-9])/')){
			
			$parameters = $link->getParameters();
			
			$file = APPSME_PATH . 'inc/rest/' . $parameters[2] . '/class_api.php';
			
			if(file_exists($file)){
				include_once($file);
				
				if($parameters[2] == '1.0'){
					AppsMeRestAPI::exec(System::GetCMD());	
				}
				
			}
			
			exit();
		}
	}
/**
 * AppsMe.exec() -> Mixed
 **/	
	static public function exec($op){
		switch($op){
			case 'appsme.db.configure':
			case 'appsme.db.update':
				self::Install();
				echo "Updated !";
				break;
		}
		
	}
/**
 * AppsMe.execSafe() -> Mixed
 **/	
	static public function execSafe($op){
		
		$file = APPSME_PATH . 'inc/rest/1.0/class_api.php';
		include_once($file);
		
		return AppsMeRestAPI::exec($op);
	}
/**
 * AppsMe.HaveAPIAccess() -> Boolean
 **/	
	static final function HaveAPIAccess($apikey){
		$appsme = System::Meta('AppsMe_Options');
		
		return Sql::Count($appsme->Table_API_KEY, $appsme->Field_API_KEY . ' = "' . Sql::EscapeString($apikey) . '" AND '.$appsme->Field_Enable_API_KEY . ' = 1') > 0;
	}
}

AppsMe::Initialize();
?>