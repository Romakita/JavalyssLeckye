<?php
/** section: Messenger
 * class Room < ObjectTools
 *
 * Cette classe gère les salles de l'extension messenger.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_room.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_MESSENGER_ROOM', PRE_TABLE.'messenger_rooms');
class Room extends ObjectTools{
/**
 * Room.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_MESSENGER_ROOM;
/**
 * Room.PRIMARY_KEY -> String
 * Clef primaire de la table Post.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Room_ID';
/**
 * Room.Room_ID -> Number
 **/
	public $Room_ID = 			0;
/**
 * Room.User_ID -> Number
 * Créateur du salon.
 **/
	public $User_ID = 			0;
/**
 * Room.User_Friend -> Number
 * Participant de la conversion à deux.
 **/
	public $User_Friend = 		0;
/**
 * Room.Name -> String
 * Nom de la salle de tchat.
 **/
	public $Name = 				'';
/**
 * Room.Group -> String
 * Groupe de la salle.
 **/
	public $Group = 			'';
/**
 * Room.Private -> Boolean
 * Salle privée ou non.
 **/
	public $Private =			false;
/**
 * Room.Password -> String
 * Mot de passe d'accès à la salle.
 **/
	public $Password =			'';
/**
 * Room.User_Max -> Number
 * Nombre maximal d'utilisateur pouvant acceder à la salle.
 **/
	public $User_Max =			10;
/** obselete
 * Room.Message_Max -> Number
 * Nombre de message affiché au lancement du tchat
 **/
	public $Message_Max =  		100;
/**
 * new Room()
 * new Room(json)
 * new Room(array)
 * new Room(obj)
 * new Room(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[Room]].
 * - array (Array): Tableau associatif équivalent à une instance [[Room]]. 
 * - obj (Object): Objet équivalent à une instance [[Room]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Room]].
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
 * Room.commit() ->  Boolean
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
						
		if($this->Room_ID == 0){
			
			if($this->User_Friend != 0){								
				if($this->conversationExists()) return true;
			}
			
			if($this->User_ID == 0) $this->User_ID = User::Get()->getID();
			
			$request->fields = 	"(`User_ID`, `User_Friend`, `Name`, `Group`, `Private`, `Password`, `User_Max`, `Message_Max`)";
			$request->values = 	"(
									'".Sql::EscapeString($this->User_ID)."',  
									'".Sql::EscapeString($this->User_Friend)."', 
									'".Sql::EscapeString($this->Name)."',
									'".Sql::EscapeString($this->Group)."', 
									'".Sql::EscapeString($this->Private)."', 
									'".Sql::EscapeString($this->Password)."',
									'".Sql::EscapeString($this->User_Max)."',
									'".Sql::EscapeString($this->Message_Max)."'
								)";
			
			if($request->exec('insert')){
				$this->Room_ID = $request->exec('lastinsert');
				
				if($this->User_Friend != 0){
					MessengerUI::SetRoomForced($this->Room_ID);
				}
				
				return true;
			}
			
			return false;
		}
			
		$request->set = "
			`User_Friend` = '".Sql::EscapeString($this->User_Friend)."',
			`Name` = '".Sql::EscapeString($this->Name)."',
			`Group` = '".Sql::EscapeString($this->Group)."',
			`Private` = '".Sql::EscapeString($this->Private)."',
			`Password` = '".Sql::EscapeString($this->Password)."',
			`User_Max` = '".Sql::EscapeString($this->User_Max)."',
			`Message_Max` = '".Sql::EscapeString($this->Message_Max)."'
		";
		$request->where = self::PRIMARY_KEY . ' = ' . $this->Room_ID;
				
		return $request->exec('update');
		
	}
	
	public function conversationExists(){
		$request = 			new Request();
		$request->select =	'*';
		$request->from = 	self::TABLE_NAME;
		
		$request->where = 	'(User_ID = '.(int) $this->User_ID.' AND User_Friend = '.(int) $this->User_Friend.') OR (User_ID = '.(int) $this->User_Friend.' AND User_Friend = '.(int) $this->User_ID.')';
		
		$result = $request->exec('select');
		
		if($result['length'] > 0){
			$this->extend($result[0]);
			
			MessengerUI::SetRoomForced($this->Room_ID);
			
			return true;
		}
		return false;
	}
/**
 * Room.delete() ->  Boolean
 **/
	public function delete(){
		
		//suppression de la salle
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where =	self::PRIMARY_KEY . ' = ' . $this->Room_ID;
		
		if(!$request->exec('delete')){
			return false;
		}
		
		//suppression des utilisateurs
		$request->from = 	RoomsUsers::TABLE_NAME;
		
		if(!$request->exec('delete')){
			return false;
		}
		
		$request->from = 	Message::TABLE_NAME;
		
		return $request->exec('delete');
	}
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
			case 'room.commit':
				$room = new Room($_POST['Room']);
				
				if(!$room->commit()){
					return $op . '.err';
				}
				
				echo json_encode($room);				
				break;
				
			case 'room.remove':
			case 'room.delete':
				$room = new Room($_POST['Room']);
				
				if(!$room->delete()){
					return $op . '.err';
				}
				
				echo json_encode($room);
				break;
					
			case 'room.list':
				MessengerUI::Configure();
				RoomsUsers::GetList();
				echo json_encode(self::GetList());
							
				break;
				
			case 'room.user.count':
				$room = new Room($_POST['Room']);
				echo json_encode(RoomsUsers::Count($room->Room_ID));
				break;
			
			case 'room.history.get':
				$room = new Room($_POST['Room']);
				$tab = $room->getHistory();
				
				if(!$tab){
					return $op . '.err';
				}
			
				echo json_encode($tab);
				
				break;
				
			case 'room.group.list':
				
				$tab = self::GetGroups(@$_POST['word']);
				
				if(!$tab){
					return $op . '.err';
				}
			
				echo json_encode($tab);
				
				break;
			case 'room.user.list':
				$room = new Room($_POST['Room']);
								
				if(!$room->exists()){
					echo "room.force.disconnect";	
					return;
				}
				
				$room->connect();
				
				$obj = 					$room->getUsers();
				$obj['Messages'] = 		$room->getMessages(@$_POST['LAST_INCREMENT']);
				$obj['RoomsForced'] = 	MessengerUI::GetRoomForced();
				//$obj['length'] =	0;
				
				echo json_encode($obj);
				break;
				
			case 'room.connect':
				$room = new Room($_POST['Room']);
				
				if(!$room->exists()){
					echo "room.force.disconnect";	
					return;
				}
				
				if(!$room->connect()){
					return $op . '.err';
				}
				echo json_encode($room);
				break;
				
			case 'room.disconnect':
				$room = new Room($_POST['Room']);
								
				if(!$room->disconnect()){
					return $op . '.err';
				}
				echo json_encode($room);
				break;
				
			case 'room.message.add':
				$room = 	new Room($_POST['Room']);
				$message = 	rawurldecode($_POST['Message']);
				
				if(!$room->addMessage($message)){
					return $op . '.err';
				}
				
				echo json_encode($room);
				break;
				
			case 'room.pictures.add':
				$room = 		new Room($_POST['Room']);
				$pictures = 	json_decode(stripslashes(rawurldecode($_POST['Pictures'])));
				
				$room->addPictures($pictures);
				echo json_encode($room);
				break;
		}
	}
/**
 * Room.addPictures(array) -> Boolean
 **/
 	public function addPictures($array){
		
		foreach($array as $picture){
			$picture->data = 	explode(',', $picture->data);
			$extension = 		explode('/', $picture->data[0]);
			$extension =		explode(';', $extension[1]);
			
			$file =  			System::Path('public') . $picture->id . '.' . $extension[0];
			
			Stream::Write($file, base64_decode($picture->data[1]));
			
		}
	}
/**
 * Room.GetGroups() -> Array
 **/	
	public static function GetGroups($word = ''){
		$options->op = '-g';
		$options->value = $word;
		
		return self::GetList('', $options);
	}
/**
 * Room.addMessage() -> Boolean
 **/
 	public function addMessage($msg){
		
		$message = new Message($this);
		$message->Content = $msg;
		
		return $message->commit();
	}
/**
 * Room.connect() -> Boolean
 **/
 	public function connect(){
		return RoomsUsers::Commit($this->Room_ID);
	}
/**
 * Room.disconnect() -> Boolean
 **/
 	public function disconnect(){
		return RoomsUsers::Commit($this->Room_ID, NULL, 0);
	}
/**
 * Room.exists(id) -> Boolean
 **/
	public function exists(){
		return Sql::Count(self::TABLE_NAME, self::PRIMARY_KEY.' = '.((int) $this->Room_ID)) * 1 > 0;
	}
/**
 * Room.getHistory() -> Boolean
 **/
	public function getMessages($last = -1){
		$_POST['options']->id = 	$this->Room_ID;
		$_POST['options']->last = 	empty($last) ? -1 : $last;
		$_POST['options']->max = 	$this->Message_Max;
		
		return Message::GetList('', $_POST['options']);
	}
/**
 * Room.getHistory() -> Boolean
 **/
	public function getHistory(){
		$_POST['options']->op = '-h';
		$_POST['options']->id = $this->Room_ID;
		return Message::GetList($_POST['clauses'], $_POST['options']);
	}
/**
 * Room.getUsers() -> Boolean
 **/
	public function getUsers(){
		$options->id = $this->Room_ID;
		return RoomsUsers::GetList($_POST['clauses'], $options);
	}
/**
 * Room.GetList() -> Array
 **/	
	public static function GetList($clauses = '', $options = ''){
		$request = 			new Request();
		
		$request->select = 	'U.Avatar, U.Login as Pseudo, A.*';
		$request->from = 	self::TABLE_NAME . " AS A INNER JOIN " . User::TABLE_NAME . " AS U ON A.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->order = 	'`Group`';
			
		$request->onexec = array('Room', 'OnGetList');
						
		switch(@$options->op){
			default:
				$request->where = '(
					A.User_Friend = 0 
					OR A.User_Friend = '.User::Get()->getID().' 
					OR (
						A.User_ID = ' . User::Get()->getID() . '
						AND A.User_Friend != 0
					)
				)';
					
				break;
			case '-g'://listing des groupes
				$request->select = 'DISTINCT `Group` as text, `Group` as value';
				$request->from = 	self::TABLE_NAME;
				$request->onexec =	'';
				$request->where = 	"`Group` != '' AND `Group` != 'Conversations'";
				
				if(!empty($options->value)){
					$request->where = " AND `Group` like '".$options->value."%'";				
				}
				break;
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= "";
				
			}
			if(@$clauses->order) 	$request->order = 	$clauses->order;
			if(@$clauses->limits) 	$request->limits = 	$clauses->limits;
		}
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
				
		return $result; 
	}
	
	public static function OnGetList($row){
	 	
		if(!empty($row['Room_ID'])){
			$row['NbUser'] = RoomsUsers::CountConnected($row['Room_ID']);
		}
		
		if(!empty($row['User_Friend'])){
			$row['Group'] = 'Conversations';
		}
	}
}
?>