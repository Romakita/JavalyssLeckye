<?php
/** section: Library
 * class Cron
 * 
 * Cette classe gère les tâches planifiés via script PHP à l'image de Cron. Attention, c'est librairie ne créée pas de règle avec CronTab !
 * 
 * * Auteur : Lenzotti Romain
 * * Fichier : class_cron.php
 * * Version : 21/01/2014
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * * Librairie requise : [[Stream]]
 *
 **/

require_once('class_cron_parser.php');
require_once('class_cron_task.php');

class Cron{
/**
 * Cron.YEARLY = 0 0 1 1 *
 **/
	const YEARLY =	'0 0 1 1 *';
/**
 * Cron.MONTHLY = 0 0 1 * *
 **/
	const MONTHLY =	'0 0 1 * *';
/**
 * Cron.WEEKLY = 0 0 * * 0
 **/
	const WEEKLY =	'0 0 * * 0';
/**
 * Cron.DAILY = 0 0 * * *
 **/
	const DAILY =	'0 0 * * *';
/**
 * Cron.HOURLY = 0 * * * *
 **/
	const HOURLY =	'0 * * * *';
/**
 * Cron.Cron -> Cron
 **/
	protected static $Cron = NULL;
/**
 * Cron.Path -> String
 **/
	protected static $Path = NULL;
	
	protected static $Uri = NULL;
/**
 * Cron.VERSION -> String
 **/
	const VERSION = 	'0.6';
/**
 * Cron.FILENAME -> String
 **/
	const FILENAME = 	'conf.cron';
/**
 * Cron.LOG_FILENAME -> String
 **/	
	const LOG_FILENAME = 'log.cron';
/**
 * Cron.PATTERN -> String
 **/	
	const PATTERN =		'/cron\/task/';
/**
 * Cron.CURL_LINK -> String
 **/	
	const CURL_LINK =	'cron/task/';
/**
 * Cron#tasks -> Array
 **/	
	protected $tasks;
/**
 * Cron#active -> Boolean
 **/
	protected $active;
	protected $isStop;
/**
 * Cron#link -> String
 **/
	public $link;
/**
 * Cron#time -> String
 **/
	public $time;
	
	private function __construct(){}
/**
 * Cron.Path() -> void
 *
 * `static` Cette méthode permet de configurer le `path` du fichier d'execution [[Cron]].
 **/	
	public static function Path($path){
		self::$Path = $path;
	}
	
	public static function Uri($path){
		self::$Uri = $path;
	}
	
	
	public static function HaveProcess(){
		$link = new Permalink();
		
		return $link->match(self::PATTERN)/* && !empty($_POST['CronTask']) && unserialize($_POST['CronTask']) instanceof CronTask*/;		
	}
/**
 * Cron.Create() -> Cron
 *
 * `private` `static` Cette méthode créée une instance unique [[Cron]].
 **/
	private static function Create(){
		
		$cron = 		new Cron;
		$cron->tasks =	array();
		$cron->active =	false;
		$cron->link =	self::$Path.'/'.self::FILENAME;
		
		self::$Cron = $cron;
		
		self::Write();
		
		return $cron;
	}
/**
 * Cron.Exists(path) -> Cron
 * - path (String): chemin du fichier d'execution
 *
 * `static` Cette méthode vérifie que le fichier d'execution de l'instance [[Cron]] existe.
 **/
	public static function Exists(){
		return is_file(self::$Path.'/'.self::FILENAME); 
	}
/**
 * Cron.Write(cron) -> void
 * - cron (Cron): instance [[Cron]]
 *
 * `private` `static` Cette méthode écrit les informations de l'instance [[Cron]] dans le fichier d'execution
 **/
	private static function Write(){
		
		if(empty(self::$Cron)){
			return;
		}
		
		Stream::Write(self::$Cron->link, serialize(self::$Cron));	
	}
	
	public static function WriteLog($log){
		if(empty($log)){
			return;
		}
		$file = 	dirname(self::$Cron->link) . '/' . self::LOG_FILENAME;
		$content = 	self::ReadLog();
		
		$content = date('Y-m-d H:i:s') . ' : ' . $log . ";". Stream::CARRIAGE . $content;
		
		Stream::Write($file, trim($content));
	}
	
	public static function ReadLog(){
		$file = 	dirname(self::$Cron->link) . '/' . self::LOG_FILENAME;
		$content = 	'';
		if(file_exists($file)){
			$content = Stream::Read($file);
			$content = implode(";". Stream::CARRIAGE , array_slice(explode(";". Stream::CARRIAGE, $content), 0, 199));
		}
		return $content;
	}
/**
 * Cron.Read(path) -> Cron
 * - path (String): chemin du fichier d'execution
 *
 * `private` `static` Cette méthode lit les information dans le fichier d'execution.
 **/
	public static function Read(){
		
		$conf = self::$Path.'/'.self::FILENAME;
		
		if(self::Exists()) {
		  	$obj = @unserialize(Stream::Read($conf));
			
			if($obj == NULL || $obj == ''){
				@Stream::Delete($conf);
				return false;
			}
			
			self::$Cron = $obj;
			
			return $obj;
		}
		
		return false;
	}
/**
 * Cron.Exec() -> void
 * - cron (Cron): instance [[Cron]]
 *
 * `public` `static` Cette méthode éxécute les tâches planifiés.
 **/
	public static function exec(){
		ob_start();
		
		$list = 	array();
		$start = 	date ('Y-m-d H:i:s');
		$nbTasks = 	0;
		
		foreach(self::$Cron->tasks as $task){
			
			if($task->nextDate < date('Y-m-d H:i')){
				$task->calculate();
			}
			
			if($task->nextDate . ':00' == $start){
				
				$task->calculate();
				
				echo self::Post(array(
					'CronTask' => $task
				));
				
				$nbTasks++;
			}
			
		}
			
		$end = date ('Y-m-d H:i:s');
		
		if($nbTasks){
			$start = 	explode(' ', $start);
			$end = 		explode(' ', $end);
			
			self::WriteLog($nbTasks . ' task(s) executed ['.$start[1] . ' -> ' . $end[1] .']');
		}
		
		$get = ob_get_clean();
		self::WriteLog($get);
	}
	
	public static function ExecProcess(){
		if(empty($_POST['CronTask'])){
			die('cron task empty');
		}
		
		$task = unserialize(stripslashes($_POST['CronTask']));
		
		if(!$task instanceof CronTask){
			die('no cron instance');
		}
		
		$task->exec();
	}
/*
 * Cron.Post(url [, params = null]) -> bool
 * - url (String): Lien de la page.
 * - params (String | array): Paramètre à envoyer en Post.
 *
 * Cette méthode envoi les informations `params` à la page indiqué par l'`url` en méthode `POST` et retourne le résultat.
 **/
	public static function Post($param = ''){
		$url = self::$Uri . self::CURL_LINK;
		$ch = curl_init();		
		
		if(is_array($param)){ 
			$str = '';
			$start = false;
			
			foreach($param as $key=>$value){
				
				if(!$start) $start = true;
				else $str .= '&';
				
				if(is_array($value) || is_object($value)){
					$str .= $key.'='.serialize($value);	
				}else{
					$str .= $key.'='.$value;
				}	
			}
			$param = $str;
		}
		
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_URL, $url);
		
		if(!empty($param)){
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
		}
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		
		$output = curl_exec($ch);
		
		curl_close($ch);
		
		return $output;
	}
/**
 * Cron.Observe(eventName, periodicity, callback) -> Cron
 * - eventName (String): Nom unique de la tâche.
 * - periodicity (String): Périodicité de la tâche
 * - callback (String|Array): nom de fonction à appeler
 *
 * `static` Cette méthode enregistre une tâche.
 **/
	public static function Observe($eventName, $periodicity, $callback){
		if(empty(self::$Cron)){
			
			if(self::Exists()){
				self::Read();
			}else{
				self::Create();
			}
		}
		
		self::$Cron->tasks[$eventName] = new CronTask($eventName, $periodicity, $callback);
		//var_dump(self::$Cron->tasks);
		self::Write();
	}
/**
 * Cron.TaskExists(eventName [, callback]) -> Boolean
 * - eventName (String): Nom unique de la tâche.
 * - callback (String|Array): nom de fonction à appeler
 *
 * `static` Cette méthode vérifie que la tâche est enregistrée.
 **/
	public static function IsObserve($eventName, $callback = NULL){
		
		if(empty(self::$Cron)){
			if(self::Exists()){
				$cron = self::Read();
			}else{
				$cron = self::Create();
				return false;
			}
		}
		
		if(empty($cron->tasks[$eventName])){//tache non enregistrée
			return false;	
		}
		
		if(!empty($callback)){
			if(serialize($callback) != serialize($cron->tasks[$eventName])){
				return false;
			}
		}
		
		return true;
	}
	
	public static function TaskExists($eventName, $callback = NULL){
		return self::IsObserve($eventName, $callback);
	}
/**
 * Cron.StopObserving(eventName) -> void
 * - eventName (String): Nom unique de la tâche.
 *
 * `static` Cette méthode éxécute les tâches planifiés.
 **/
	public static function StopObserving($eventName){
		if(empty(self::$Cron)){
			if(self::Exists()){
				self::Read();
			}else{
				self::Create();
				return false;
			}
		}
		
		if(empty(self::$Cron->tasks[$eventName])){//tache non enregistrée
			return false;	
		}
		
		unset(self::$Cron->tasks[$eventName]);
		
		self::Write();
		
		return true;
	}
/**
 * Cron.IsStarted() -> void
 *
 * `static` Cette méthode indique si l'instance [[Cron]] est active.
 **/	
	public static function IsStarted(){
		
		if(empty(self::$Path)){
			return false;
		}
		
		if(empty(self::$Cron)){
			if(self::Exists()){
				$cron = self::Read();
			}else{
				$cron = self::Create();
				return false;
			}
		}
		
		if(self::$Cron->active) {
			return abs(self::$Cron->time - time()) < 60;
		}	
		
		return false;
	}
/**
 * Cron.Start() -> void
 *
 * `static` Cette méthode démarre le service [[Cron]].
 **/
	public static function Start(){
		if(empty(self::$Path)){
			throw new Exception('Cron path is undefined');
			return false;
		}
		
		if(self::IsStarted()) {
			return;
		}
		
		self::$Cron->isStop = false;
		self::$Cron->active = true;
		self::$Cron->time =	time();
		self::Write();
		
		@session_commit();

		set_time_limit(0);
		ignore_user_abort(true);
		
		self::WriteLog('started');
		
		while(self::Exists() && self::$Cron->active){
			
			sleep(1);
			//Stream::Append('public/stat.txt', 'Execution '. date('Y-m-d H:i:s')."\n\r");
			 
			self::Read();					
			self::exec();
			
			self::$Cron->time = time();
			
			self::Write();
		}
		
		self::WriteLog('stopped');
		
		self::$Cron->isStop = true;
		self::Write();
	}
/**
 * Cron.Stop() -> void
 *
 * `static` Cette méthode stop le service [[Cron]].
 **/
	public static function Stop(){
				
		if(self::Exists()){
			self::Read();
			
			if(self::$Cron->active){
				
				set_time_limit(120);
				
				$loop = 120;
				
				while(!self::$Cron->isStop && $loop > 0){
					self::$Cron->active = false;
					self::Write();
				
					sleep(1);
					self::Read();
					$loop--;
				}
				
				if($loop == 0){
					return false;
				}
			}
		}
		
		return true;
	}
/**
 * Cron.GetTask() -> void
 *
 * `static` Cette méthode retourne la liste des tâches.
 **/
	public static function GetTask(){
				
		if(empty(self::$Path)){
			return false;
		}
		
		if(empty(self::$Cron)){
			if(self::Exists()){
				self::Read();
			}else{
				self::Create();
				return array();
			}
		}
		return	json_decode(json_encode(self::$Cron->tasks));
	}
/**
 * Cron.GetInfo() -> void
 *
 * `static` Cette méthode les informations CRON.
 **/
	public static function GetInfo(){
		$object = new stdClass();
		
		$object->Statut =	self::IsStarted();
		$object->Version = 	self::VERSION;
		$object->Tasks =	self::GetTask();
		$object->Log =		self::ReadLog();
		
		return $object;
	}
	
	public function __wakeup(){
		//$this->tasks = unserialize($this->tasks);
	}
	
	public function __sleep(){
		//$this->tasks = serialize($this->tasks);
		return array('time', 'active', 'tasks', 'link', 'isStop');
	}
}

?>