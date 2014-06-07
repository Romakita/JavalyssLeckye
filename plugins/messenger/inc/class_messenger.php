<?php
/** section: Messenger
 * MessengerUI
 **/
abstract class MessengerUI{
	const PATH = MESSENGER_PATH;
/**
 * Messenger.Get() -> Object
 **/
 	public static function Get(){
		$options = System::Meta('Messenger');
		
		if(empty($options)){
			$obj->length = 		0;
			$obj->rooms =		array();
			$options = 		$obj;
		}
		
		return 	$options;
	}
/**
 * Messenger.SetRoomForced(room) -> void
 **/	
	public static function SetRoomForced($room){
		$options = self::Get();
		
		if(is_array(@$options->roomsForced)){
			unset($options);
			$options->rooms = array();
		}
		
		array_push($options->rooms, $room);
		System::Meta('Messenger', $options);	
	}
/**
 * Messenger.GetRoomForced() -> Array
 **/	
	public static function GetRoomForced(){
		$rooms = 	array();
		$array = 	array();
		$options = 	self::Get();
				
		if(!empty($options->rooms)){
			foreach($options->rooms as $roomid){
				
				$room = new Room((int) $roomid);
				
				if($room->User_Friend == User::Get()->getID()){
					array_push($array, $room);	
				}else{
					array_push($rooms, $room->Room_ID);
				}
			}
			
			$options->rooms = $rooms;
		}else{
			$options->rooms = array();
		}
		
		System::Meta('Messenger', $options);	
		
		return $array;
	}
	
	public static function PathRoom($id){
		return self::PATH . $id.'/';	
	}
/**
 * MessengerUI.RemovePath(id) -> void
 **/
	private static function RemovePath($id){
		$path = self::PATH . $id.'/';
		return @Stream::Delete($path);
	}
/**
 * MessengerUI.CreatePath(type, id) -> String
 **/	
	public static function Path($type, $id){
		$path = MessengerUI::PATH . $id.'/';
		
		if(!file_exists($path)) {
			return false;
		}
		
		switch($type){
			case 'user':
				return $path."users.data";
			case 'message':
				return $path."messages.data";
		}
		
		return false;
	}
/**
 * MessengerUI.ReadMessages(id) -> Array
 **/
 	public static function ReadMessages($id){
		return unserialize(Stream::Read(self::Path('message', $id)));
	}
/**
 * MessengerUI.Active() -> void
 * 
 * `static` `public` Cette méthode est appellé lors de l'activation de l'extension.
 * 
 * Elle installe la base de données et change les données du logiciel.
 **/
	public static function Active(){
		self::Configure();
	}

/**
 * MessengerUI.Deactive() -> void
 * 
 * `static` `public` Cette méthode est appellé lors de la désactivation de l'extension.
 * 
 * Elle désinstalle la base de données et supprime les données modifiés du logiciel lors de l'installation de l'extension.
 **/
	public static function Deactive(){}
/**
 * MessengerUI.Configure() -> void
 * Cette méthode est appellé lors de la mise à jour de l'extension.
 **/
 	public static function Configure(){
		$request = new Request();
		
		$request->query = 'CREATE TABLE IF NOT EXISTS `'.Room::TABLE_NAME.'` (
		  `Room_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `User_ID` bigint(20) NOT NULL DEFAULT \'0\',
		  `User_Friend` bigint(20) NOT NULL DEFAULT \'0\',
		  `Name` varchar(255) NOT NULL,
		  `Group` varchar(100) NOT NULL DEFAULT \'default\',
		  `Private` tinyint(1) NOT NULL,
		  `Password` varchar(10) NOT NULL,
		  `User_Max` tinyint(3) NOT NULL,
		  `Message_Max` tinyint(3) NOT NULL,
		  PRIMARY KEY (`Room_ID`)
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;';
		
		$request->exec('query');
		
		$request->query = 'CREATE TABLE IF NOT EXISTS `'.Message::TABLE_NAME.'` (
		  `Message_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Room_ID` bigint(20) NOT NULL,
		  `User_ID` bigint(20) NOT NULL,
		  `Date_Create` datetime NOT NULL,
		  `Content` longtext NOT NULL,
		  PRIMARY KEY (`Message_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;';
		
		$request->exec('query');
		
		$request->query = 'CREATE TABLE IF NOT EXISTS `'.RoomsUsers::TABLE_NAME.'` (
		  `Room_ID` bigint(20) NOT NULL,
		  `User_ID` bigint(20) NOT NULL,
		  `Last_Connexion` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\',
		  `Is_Connect` tinyint(1) NOT NULL DEFAULT \'0\',
		  PRIMARY KEY (`Room_ID`,`User_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;';
		
		$request->exec('query');
		
		if(file_exists(self::PATH)){
			//les rooms exists
			$rooms = self::Get()->rooms;
			
			foreach($rooms as $room){
				$room_ = new Room($room);
				$room_->Room_ID = 		0;
				$room_->User_Friend = 	$room->withUser_ID;
				$room_->User_Max = 		$room->UserMax;
				$room_->Message_Max = 	$room->MessageMax;
				
				if($room_->commit()){
					$messages = self::ReadMessages($room->Room_ID);
					
					foreach($messages as $message){
						$request = 			new Request();
						$request->from = 	Message::TABLE_NAME;
						
						
						$request->fields = 	"(`Message_ID`, `Room_ID`, `User_ID`, `Date_Create`, `Content`)";
						$request->values = 	"(NULL,
												'".Sql::EscapeString($room_->Room_ID)."',  
												'".Sql::EscapeString($message->User_ID)."',  
												'".Sql::EscapeString($message->Date)."', 
												'".Sql::EscapeString($message->Text)."'
											)";
						
						if(!$request->exec('insert')){
							echo $request->getError();	
						}
					}
				}
			}
			//echo"ii";
			@Stream::Delete(self::PATH);
		}
		
	}
/**
 * MessengerUI.exec(command) -> int
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
			
	}
}
?>