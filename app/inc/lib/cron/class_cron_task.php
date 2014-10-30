<?php
/** section: Library
 * class CronTask < CronParser
 * Cette classe gère les informations d'une tâche planifiée.
 **/
class CronTask extends CronParser{
/**
 * CronTask#name -> String
 * Nom de la tâche planifiée.
 **/
	public $name =		'';
/**
 * CronTask#callback -> Function
 *
 * Fonction à executer lors de l'activation de la tâche planifiée.
 **/
	public $callback =	NULL;
/**
 * new CronTask(name, time [, callback])
 * - name (String): Nom de la tâche (unique).
 * - time (String): Règle cron.
 * - callback (Function): Fonction à executer.
 *
 * Cette méthode créée une nouvelle tâche planifiée.
 **/
	public function __construct($name, $string, $callback = NULL){
		$this->name = 		$name;
		$this->setTime($string);
		$this->callback = 	$callback;
	}
/**
 * CronTask#exec() -> void
 *
 * Cette méthode tente d'éxécuter la tâche planifiée.
 **/	
	public function exec(){
				
		call_user_func_array($this->callback, array($this));
	}
				
	public function __wakeup(){
		//$this->bits = json_decode($this->bits);
	}
	
	public function __sleep(){		
		return array('name', 'callback', 'bits', 'nextDate');
	}
}

?>