<?php
/** section: CRM
 * class CRMContact < Contact
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

class CRMContact extends Contact{
	const PRE_OP =			'crm.contact.';
/**
 * CRMContact#Contact_ID -> Number
 **/
	public $Client_ID =		0;

	
	static public function Initialize(){
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('contact:commit', array(__CLASS__, 'onCommit'));
		System::observe('contact:list', array(__CLASS__, 'onList'));
		System::observe('contact:field.import.create', array(__CLASS__, 'onCreateFieldImport'));
	}
/**
 * CRMContact.Install() -> void
 **/	
	static public function Install(){
		$request = new Request();
		$request->query = "ALTER TABLE `".self::TABLE_NAME."` ADD `Client_ID` BIGINT(20) NOT NULL DEFAULT '0'";
		$request->exec('query');
		
		Contact::AddCategory('CRM');
	}
/**
 * CRMContact.onCommit(o, request) -> void
 **/	
	static public function onCommit(&$o, &$request){
		
		if(!empty($o->Comment->clientid) && $o->Comment->clientid > 0 && empty($o->Client_ID)){//recherche du client à partir de son ancien ID
			$request2 = new Request();
			$request2->from = 	CRMClient::TABLE_NAME;
			$request2->where =	"Comment like '%\"id\":\"".$o->Comment->clientid."\"%'";
			
			$result = $request2->exec('select');
			
			if($result['length'] == 1){
				$o->Client_ID = $result[0]['Client_ID'];
			}else{
				echo $request2->query;
				exit();	
			}
			
			$o->Comment->clientid *=  -1;
		}
		
		if(!empty($o->Client_ID)){
			
			if(is_array($o->Categories)){//
				if(!in_array('crm', $o->Categories)){
					array_push($o->Categories, 'crm');	
				}
			}
			
			if($o->Contact_ID == 0){
				$request->fields .= 	", `Client_ID`";
				$request->values .= 	", '".Sql::EscapeString($o->Client_ID)."'";		
			}else{
				$request->set .= 		",`Client_ID` = '".Sql::EscapeString($o->Client_ID)."'";
			}
		}
	}
/**
 * CRMContact.onCreateFieldImport(o) -> void
 **/	
	static public function onCreateFieldImport(&$o, $file = ''){
		if(!empty($file)){
			if(Stream::Extension($file) == 'xml'){
				array_push($o, array(
					'text' => MUI('N° Client'), 'value' => 'Client_ID'
				));
			}else{
				array_push($o, array(
					'text' => MUI('Client_ID'), 'value' => 'Client_ID'
				));
				array_push($o, array(
					'text' => MUI('N° Client'), 'value' => 'Comment.clientid'
				));
			}
		}else{
			array_push($o, array(
				'text' => MUI('Client_ID'), 'value' => 'Client_ID'
			));
			array_push($o, array(
				'text' => MUI('N° Client'), 'value' => 'Comment.clientid'
			));
		}
	}
/**
 * CRMContact.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			
			case self::PRE_OP."get.data"://Importe le fichier de données et l'analyse.
				self::GetDataFromImportedFile();
				break;
			
			case self::PRE_OP."import"://importe les données du fichier
				set_time_limit(0);
				ignore_user_abort();
				
				echo json_encode(self::ImportFile($_POST['options']));
				break;
				
		}
		
		return 0;	
	}
/**
 * CRMContact.ByName(name) -> CRMContact
 * CRMContact.ByName(options) -> CRMContact
 *
 **/
 	public function ByName($obj){
		
		if(is_string($obj)){
			$options = new stdClass();
			$options->Name = $obj;	
		}else{
			$options = $obj;	
		}
		
		$request = new Request(DB_NAME);
		
		$request->select = 	'*';	
		$request->from = 	self::TABLE_NAME;
		
		$request->where =	"Name = '".Sql::EscapeString($options->Name)."'";
		
		if(!empty($options->FirstName)){
			$request->where .=	" AND FirstName = '".Sql::EscapeString($options->FirstName)."'";
		}
		
		if(!empty($options->Client_ID)){
			$request->where .=	" AND Comment like '%\"clientid\":\"".Sql::EscapeString($options->Client_ID)."\"%'";
		}
		
		$u = $request->exec('select');
		
		return $u['length'] == 0 ? false : new self($u[0]);
	}
/**
 * CRMContact.onList(o) -> void
 **/	
	static public function onList(&$request){
		
		if(!empty($_POST['options']->Category)){
			
			if(is_string($_POST['options']->Category)){
				$_POST['options']->Category = explode(';', $_POST['options']->Category);
			}
			
			if(in_array('crm', $_POST['options']->Category)){
				//array_push($options->category, 'all');
				
				$request->where = ' (
					Categories LIKE "%' . implode('%" OR Categories LIKE "%', $_POST['options']->Category) . '%" OR Categories = ""';
				
				$request->where .= ' OR '.CRMContact::TABLE_NAME.'.Client_ID != 0)';
				
			}
		}
		
		
		if(isset($_POST['options']->Client_ID)){
			$request->where .= ' AND '.CRMContact::TABLE_NAME.'.'.CRMClient::PRIMARY_KEY.' = ' . ((int) $_POST['options']->Client_ID);
 		}
		
		if(isset($_POST['options']->crm)){
			$request->where .= ' AND '.CRMContact::TABLE_NAME.'.'.CRMClient::PRIMARY_KEY.' != 0';
 		}
		
		if(@$_POST['options']->op == '-select' || @$_POST['options']->op == '-completer'){
			return;	
		}
		
		$request->select .= ', IFNULL('.CRMClient::TABLE_NAME.'.Company, ' . Contact::TABLE_NAME . '.Company) AS Company';
		$request->from .= ' LEFT JOIN '.CRMClient::TABLE_NAME.' ON '.CRMClient::TABLE_NAME.'.'.CRMClient::PRIMARY_KEY.' = '.Contact::TABLE_NAME . '.' .CRMClient::PRIMARY_KEY;
		$request->where = str_replace('Categories', Contact::TABLE_NAME . '.Categories', $request->where);
		$request->order = str_replace('Categories', Contact::TABLE_NAME . '.Categories', $request->order);
		
	}
	
}

CRMContact::Initialize();
?>