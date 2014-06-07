<?php
/** section: CRM
 * class CRMEvent < Contact
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

class CRMEvent extends AgendaEvent{
/**
 * CRMEvent#Contact_ID -> Number
 **/
	public $Client_ID =		0;

	
	static public function Initialize(){
		//System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('agenda.event:commit', array(__CLASS__, 'onCommit'));
		System::observe('agenda.event:list', array(__CLASS__, 'onList'));
		//System::observe('contact:field.import.create', array(__CLASS__, 'onCreateFieldImport'));
	}
/**
 * CRMEvent.Install() -> void
 **/	
	static public function Install(){
		$request = new Request();
		$request->query = "ALTER TABLE `".self::TABLE_NAME."` ADD `Client_ID` BIGINT(20) NOT NULL DEFAULT '0'";
		$request->exec('query');
	}
/**
 * CRMEvent.onCommit(o, request) -> void
 **/	
	static public function onCommit(&$o, &$request){
		if(!empty($o->Client_ID)){
			if($o->Event_ID == 0){
				$request->fields .= 	", `Client_ID`";
				$request->values .= 	", '".Sql::EscapeString($o->Client_ID)."'";		
			}else{
				$request->set .= 		",`Client_ID` = '".Sql::EscapeString($o->Client_ID)."'";
			}
		}
	}
/**
 * CRMEvent.onList(o) -> void
 **/	
	static public function onList(&$request){
		
		if(isset($_POST['options']->Client_ID)){
			$request->where .= ' AND '.CRMEvent::TABLE_NAME.'.'.CRMClient::PRIMARY_KEY.' = ' . ((int) $_POST['options']->Client_ID);
 		}
		
		if(@$_POST['options']->op == '-select' || @$_POST['options']->op == '-completer'){
			return;	
		}
		
		$request->select .= ', Company, IF(Company IS NULL, Title, CONCAT(Title, " - ", Company)) as title ';
		$request->from .= ' LEFT JOIN '.CRMClient::TABLE_NAME.' ON '.CRMClient::TABLE_NAME.'.'.CRMClient::PRIMARY_KEY.' = '. self::TABLE_NAME . '.' .CRMClient::PRIMARY_KEY;
		
	}
/**
 * CRMEvent#Next(clientid) -> CRMClientCall
 *
 * Cette méthode retourne le dernier appel d'un client.
 **/	
	public static function Next($clientID){
		$request = new Request(DB_NAME);
		$request->from = self::TABLE_NAME;
		
		$request->where = 	CRMClient::PRIMARY_KEY . ' = ' . (int) $clientID . ' AND Date_End >= NOW()';
		$request->order = 'Event_ID DESC';
		$request->limits = '0,1';
		//$request->observe(array(__CLASS__, 'onGetList'));
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::Current()->GetError());	
		}

		return $result['length'] == 0 ? false : new self($result[0]);
	}	
/**
 * CRMClientCall.Count([options]) -> Number
 * - options (Object): Objet de configuration de la liste.
 *
 **/	
	public static function Count($options = ''){
		$request = 			new Request();
		
		$request->select = 	'COUNT(E.Event_ID) as NB';
		$request->from = 	self::TABLE_NAME . ' E INNER JOIN ' . CRMClient::TABLE_NAME . ' C on E.' . CRMClient::PRIMARY_KEY . ' = C.' . CRMClient::PRIMARY_KEY;
							
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		if(isset($options->User_ID)){
			$request->where .= ' AND Owner_ID = ' . ((int) $options->User_ID);
		}
			
		switch(@$options->op){
			default:
						
				break;
				
			case '-date':
				$request->where .= ' AND E.Date_Start like "' . Sql::EscapeString($options->Date) . '%"';
				break;
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::Current()->getError());	
		}
		
		return empty($result['length']) ? 0 : $result[0]['NB'] ;
	}
}

CRMEvent::Initialize();
?>