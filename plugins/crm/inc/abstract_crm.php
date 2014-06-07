<?php
/** section: CRM
 * class CRMPlugin 
 * includes ObjectTools
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_contact.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

abstract class CRMPlugin extends ObjectTools implements iPlugin{
	const PRE_OP =				'crm.';
	
	private static $CATEGORIES = '';
/**
 * CRMPlugin.Initialize() -> void
 **/	
	static public function Initialize(){
		
		include('class_client.php');
		include('class_client_media.php');
		include('class_client_call.php');
		include('class_contact.php');
		include('class_event.php');
		include('class_statistics.php');
		
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('plugin.active', array(__CLASS__,'Install'));
		System::observe('plugin.deactive', array(__CLASS__,'Uninstall'));
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		System::Observe('newsletter:broadcast', array(__CLASS__,'onBroadCastMail'));
		
		System::EnqueueScript('highchartsjs');
		System::EnqueueScript('hightcharts.exporting');
		
		System::EnqueueScript('crm', Plugin::Uri().'js/crm.js');
		System::EnqueueScript('crm.client', Plugin::Uri().'js/crm_client.js');
		System::EnqueueScript('crm.import', Plugin::Uri().'js/crm_import.js');
		System::EnqueueScript('crm.contact', Plugin::Uri().'js/crm_contact.js');
		System::EnqueueScript('crm.event', Plugin::Uri().'js/crm_event.js');
		System::EnqueueScript('crm.client.call', Plugin::Uri().'js/crm_client_call.js');
		System::EnqueueScript('crm.client.print', Plugin::Uri().'js/crm_client_print.js');
		System::EnqueueScript('crm.client.list.print', Plugin::Uri().'js/crm_client_list_print.js');
		System::EnqueueScript('crm.client.list.export', Plugin::Uri().'js/crm_client_list_export.js');
		System::EnqueueScript('crm.client.list.send', Plugin::Uri().'js/crm_client_list_sendmail.js');
		System::EnqueueScript('crm.setting', Plugin::Uri().'js/crm_setting.js');
		System::EnqueueScript('crm.statistics', Plugin::Uri().'js/crm_statistics.js');
		
		System::AddCss(Plugin::Uri().'css/crm.css');
		
		if(method_exists('Market', 'RequireApp')){
			Market::RequireApp('Contacts');
			Market::RequireApp('Agenda');
			Market::RequireApp('PHPExcel');
		}
	}
/**
 * CRMPlugin.Install() -> void
 **/	
	static public function Install(){
		CRMClient::Install();
		CRMClientMedia::Install();
		CRMContact::Install();
		CRMEvent::Install();
		CRMClientCall::Install();
		//
		// Création du groupe
		//
		$role = Role::ByName('Commerciaux', 3, true);
		//
		//
		//
		$callers = System::Meta('CRM_GROUP_CALLER');
		
		if(empty($callers)){
			$callers = array();
			$groups = Role::GetList();
			
			for($i = 0; $i < $groups['length']; $i++){
				array_push($callers, $groups[$i]['Role_ID']);	
			}
			
			System::Meta('CRM_GROUP_CALLER', $callers);
		}
		
		if(class_exists('NewsletterPlugin')){
			NewsletterPlugin::addBroadcastGroup('CRM Client', 'client@crm.fr');	
			NewsletterPlugin::addBroadcastGroup('CRM Contact', 'contact@crm.fr');	
		}
	}
/**
 * CRMPlugin.Uninstall() -> void
 **/
 	public static function Uninstall($erase = false){
		if($erase){
			$request = new Request();
			
			$request->from(CRMClient::TABLE_NAME)->exec('drop');
			$request->from(CRMClientMedia::TABLE_NAME)->exec('drop');
			$request->from(CRMClientCall::TABLE_NAME)->exec('drop');
			
		}
	}
/**
 * CRMPlugin.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			
			case self::PRE_OP . 'db.configure':
			case self::PRE_OP . 'db.update':
				self::Install();
				echo "Base configurée";
				break;
		}
		
		return 0;	
	}
/**
 * CRMPlugin.onBroadCastMail() -> void
 **/		
	static function onBroadCastMail($group, &$mails){
		if($group == 'client@crm.fr'){
			$options = new stdClass();
			$options->op = '-newsletter';
			
			$list = CRMClient::GetList($options, $options);
			
			unset($list['length'], $list['maxLength']);
			
			array_merge($mails, $list);
		}
		
		if($group == 'contact@crm.fr'){
			$options = new stdClass();
			$options->op = '-mail';
			$options->crm = true;
			
			$list = Contact::GetList($options, $options);
			
			for($i = 0; $i < $list['length']; $i++){
				array_push($mails, $list[0]['value']);
			}
		}
	}
/**
 * CRMPlugin.addCategory(title, value) -> void
 **/	
	static function addCategory($name, $value = ''){
		$name = trim($name);
		
		if(empty($name)){
			return;
		}
		
		if(empty($value)){
			$value = $name;	
		}
			
		$value = strtolower(trim($value));
		$array = System::Meta('CRM_CLIENTS_CATEGORIES');
		
		if(empty($array)){
			$o = new stdClass();
			$o->value = 'all';
			$o->text = 	'Toutes catégories';
			
			$array = array($o);
		}
		
		for($i = 0; $i < count($array); $i++){
			if(strtolower(trim($array[$i]->value)) == $value){
				return true;
			}
		}
		
		$o = new stdClass();
		$o->value = $value;
		$o->text = 	$name;
		
		array_push($array, $o);
		usort($array, array(__CLASS__, 'onSort'));
				
		System::Meta('CRM_CLIENTS_CATEGORIES', $array);

	}
/*
 * CRMPlugin.onSort() -> void
 **/		
	public static function onSort($a, $b){
		return strcmp(basename($a->text), basename($b->text));
	}
/**
 * CRMPlugin.getCategory() -> void
 **/	
	static function getCategory($value){
		
		$array = empty(self::$CATEGORIES) ? self::getCategories() : self::$CATEGORIES;
		
		for($i = 0; $i < count($array); $i++){
			if(strtolower(trim($array[$i]->value)) == $value){
				return $array[$i]->text;
			}
		}
		
		return '';
	}
/**
 * CRMPlugin.getCategories() -> void
 **/	
	static function getCategories(){
		$array = System::Meta('CRM_CLIENTS_CATEGORIES');
		
		if(empty($array)){
			$o = new stdClass();
			$o->value = 'all';
			$o->text = 	'Toutes catégories';
			
			$array = array($o);
		}
		
		return $array;
	}
}

CRMPlugin::Initialize();
?>