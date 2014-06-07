<?php
/** section: Agenda
 * class Agenda
 * includes ObjectTools
 *
 * Cette classe permet de gérer les différents événements du logiciel Javalyss pour la mise en place des données de l'extension Agenda.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : abstract_agenda.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class Agenda extends ObjectTools implements iPlugin{
	const PRE_OP = 'agenda.';
	
	static $Status;
/**
 * Agenda.Initialize() -> void
 *
 * Cette méthode intercepte les événements du logiciel Javalyss pour créer les pages du logiciel Agenda.
 **/	
	static public function Initialize(){
		
		
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('gateway.safe.exec', array(__CLASS__, 'execSafe'));
		/*
		 * Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur installera votre module depuis le menu Extension du logiciel.
		 **/
		System::Observe('plugin.active', array(__CLASS__,'Install')); 
		/*
		 * Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur désinstallera votre module depuis le menu Extension du logiciel.
		 **/
		System::Observe('plugin.deactive', array(__CLASS__,'Uninstall'));
		/*
		 * Evenement plugin.configure. Cette événement est lancé lorsque l'utilisateur met à jour l'extension depuis Javalyss.fr ou un autre dépôt d'application.
		 **/
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		//
		// Backoffice Javalyss
		//
		
		System::EnqueueScript('window.schedule');
		
		System::EnqueueScript('agenda', Plugin::Uri().'js/agenda.js');
		System::EnqueueScript('agenda.list.print', Plugin::Uri().'js/agenda_list_print.js');
		System::EnqueueScript('agenda.setting', Plugin::Uri().'js/agenda_setting.js');
		System::AddCss(Plugin::Uri().'css/agenda.css');
		
		include('class_agenda_event.php');
		
		if(!Cron::TaskExists('agenda')){
			Cron::Observe('agenda', '* * * * *', array(__CLASS__, 'onTick'));
		}		
	}
/**
 * Agenda.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		switch($op){
			case self::PRE_OP . 'db.configure':
				self::Install();
				echo "Base configurée";
				break;
			case 'agenda.tick':
				self::onTick();
		}
	}
/**
 * Agenda.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/		
	public static function execSafe($op){
		
	}

/**
 * Agenda.Configure() -> void
 *
 * Configure le logiciel pour l'utilisation de l'extension.
 **/	
	public static function Install(){
		
		Market::RequireApp('Contacts');
		Market::RequireApp('Google Map JS');
		//Market::RequireApp('SabreDav');
		
		//on lance les scripts d'installation et de mise à jour de la base de données
			
		AgendaEvent::Install();	
		
	}
/**
 * Agenda.Uninstall() -> void
 **/
 	public static function Uninstall($erase = false){
		if($erase){
			$request = new Request();
			
			$request->from(AgendaEvent::TABLE_NAME)->exec('drop');
			
		}
	}
/**
 * Agenda.onTick() -> void
 *
 **/	
	public static function onTick(){
		if(AgendaEvent::HaveRecall()){
			$options = new stdClass();
			$options->op = '-recall';
			
			$events = AgendaEvent::GetList($options, $options);
			
			for($i = 0; $i < $events['length']; $i++){
				$event = new AgendaEvent($events[$i]);
				$event->send();
			}
		}
	}
	
	public static function Status($value = ''){
		
		if(empty(self::$Status)){
			self::$Status = System::Meta('AGENDA_STATUS');
		}
		
		if(empty($value)){
			return self::$Status;	
		}
		
		for($i = 0; $i < count(self::$Status); $i++){
			
			if(self::$Status[$i]->value == $value){
				return self::$Status[$i];	
			}
		}
		
		return false;
		
	}
}

Agenda::Initialize();
?>