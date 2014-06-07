<?php
/** section: Messenger
 * class Message < ObjectTools
 *
 * Cette classe gère les salles de l'extension messenger.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_Message.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_MESSENGER_MESSAGE', PRE_TABLE.'messenger_rooms_messages');
class Message extends ObjectTools{
/**
 * Message.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = TABLE_MESSENGER_MESSAGE;
/**
 * Message.PRIMARY_KEY -> String
 * Clef primaire de la table Message.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 	'Message_ID';
/**
 * Message.Message_ID -> Number
 **/
	public $Message_ID = 			0;
/**
 * Message.Room_ID -> Number
 * Identifiant du salon.
 **/
	public $Room_ID = 			0;
/**
 * Message.User_ID -> Number
 * Auteur du message.
 **/
	public $User_ID = 			0;
/**
 * Message.Date_Create -> String
 * Date de création du message.
 **/
	public $Date_Create = 		'';
/**
 * Message.Content -> Boolean
 * Detail du message.
 **/
	public $Content =			'';
/**
 * new Message()
 * new Message(json)
 * new Message(array)
 * new Message(obj)
 * new Message(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[Message]].
 * - array (Array): Tableau associatif équivalent à une instance [[Message]]. 
 * - obj (Object): Objet équivalent à une instance [[Message]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Message]].
 *
 **/	
	public function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs > 0){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request();
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				
				if($u['length'] > 0){
					$this->extend($u[0]);
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
	}
/**
 * Message.Count(room) ->  Number
 **/	
	final static public function Count($room){
		return Sql::Count(self::TABLE_NAME, Room::PRIMARY_KEY.' = '. ((int) $room));
	}
/**
 * Message.commit() ->  Boolean
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
						
		if($this->Message_ID == 0){
			
			$request->fields = 	"(`Room_ID`, `User_ID`, `Date_Create`, `Content`)";
			$request->values = 	"(
									'".Sql::EscapeString($this->Room_ID)."',  
									'".Sql::EscapeString($this->User_ID = User::Get()->getID())."',  
									CURRENT_TIMESTAMP(), 
									'".Sql::EscapeString(stripslashes($this->Content))."'
								)";
			
			if($request->exec('insert')){
				$this->Message_ID = $request->exec('lastinsert');
				return true;
			}
			
			return false;
		}
		
	}
/**
 * Message.delete() ->  Boolean
 **/
	public function delete(){}
/**
 * Messenger.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * `static` `public` Cette méthode `static` éxécute une commande envoyé par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * * `messenger.install`:
 *
 **/	
	public static function exec($op){
		switch($op){
			case 'message.commit':
				$obj = new Message($_POST['Message']);
				
				if(!$obj->commit()){
					return $op . '.err';
				}
				
				echo json_encode($obj);				
				break;
							
			case 'message.list':
				$obj = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$obj->commit()){
					return $op . '.err';
				}
				
				echo json_encode($obj);		
				break;			
		}
	}
/**
 * Message.GetLast() -> Array
 **/	
	public static function GetLast($room, $last){
		$options->id = 		$room;
		$options->last = 	$last;
		return self::GetList('', $options);
	}
/**
 * Message.GetList() -> Array
 **/	
	public static function GetList($clauses = '', $options = ''){
		$request = 			new Request();
		
		$request->select = 	'U.Avatar, U.Login as Pseudo, U.Meta, A.*, DATE_FORMAT(Date_Create, \'%Y-%m-%d\') as Date_Section';
		$request->from = 	self::TABLE_NAME . " AS A LEFT JOIN " . User::TABLE_NAME . " AS U ON A.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->order = 	'Date_Create';
		
		$request->onexec = 	array('Message', 'OnGetList');
				
		switch(@$options->op){
			default:
				$request->where = 'Room_ID = ' . ((int) $options->id);
				
				if(!empty($options->last)){
					if($options->last == -1){
						$size = self::Count($options->id);
						
						$request->limits =  max(array(0, $size - $options->max)).','.$options->max;
					}else{
						$request->where .= ' AND '.self::PRIMARY_KEY.' > '.((int) $options->last);
					}
				}
				
				break;
			case '-h':
				$request->order = 	'Date_Create DESC';
				$request->where = 	'Room_ID = ' . ((int) $options->id);			
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= " AND (
										Content like '%".Sql::EscapeString($clauses->where)."%'
										OR Login like '%".Sql::EscapeString($clauses->where)."%'
									)";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
		
		$result = $request->exec('select');
		$result['history'] = $request->query;
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
				
		return $result; 
	}
/**
 *
 **/
	public static function OnGetList($row){
		$user = new User($row);

		$row['TextColor'] =		$user->getMeta('Messenger_Text_Color');
		$row['BgColor'] =		$user->getMeta('Messenger_Bg_Color');
	}
}
?>