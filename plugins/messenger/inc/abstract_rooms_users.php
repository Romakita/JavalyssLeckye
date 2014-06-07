<?php
/** section: Messenger
 * class RoomsUsers < ObjectTools
 *
 * 0: Dec
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : abstract_rooms_users.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_MESSENGER_ROOMS_USERS', PRE_TABLE.'messenger_rooms_users');
abstract class RoomsUsers{
/**
 * RoomsUsers.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = TABLE_MESSENGER_ROOMS_USERS;
/**
 * RoomsUsers.Count(room) -> void
 **/	
	static public function Count($room){
		return Sql::Count(self::TABLE_NAME, Room::PRIMARY_KEY .' = ' . (int) $room);
	}
/**
 * RoomsUsers.CountConnected(room) -> void
 **/	
	static public function CountConnected($room){
		return Sql::Count(self::TABLE_NAME, Room::PRIMARY_KEY .' = ' . (int) $room . ' AND Is_Connect = 1');
	}
/**
 * RoomsUsers.Commit(room) -> void
 **/
 	static public function Commit($room, $user = NULL, $connect = 1){
				
		$user = 			!is_numeric($user) ? User::Get()->getID() : $user;
		$request = 			new Request();
		$request->from =	self::TABLE_NAME;
		$request->where =  	Room::PRIMARY_KEY .' = ' . ((int) $room) . ' AND '.User::PRIMARY_KEY.' = '. ((int) $user);
		$nb = 				Sql::count(self::TABLE_NAME, $request->where);
		
		if($nb == 0){
			$request->fields = 	"(`Room_ID`, `User_ID`, `Last_Connexion`, `Is_Connect`)";
			$request->values = 	"(	'".mysql_real_escape_string($room)."',  
									'".mysql_real_escape_string($user)."',  
									NOW(),
									".((int) $connect)."
								)";
			
			return $request->exec('insert');
		}
	
		$request->set = "
		`Last_Connexion` = '".date('Y-m-d H:i:s')."',
		`Is_Connect` = ".((int) $connect)."
		";
				
		return $request->exec('update');	
	}
	
/**
 * RoomsUsers.Delete(room, user [, statut]) -> void
 **/
 	static public function Delete($room, $user){
		$request = 			new Request();
		$request->from =	self::TABLE_NAME;
		$request->where =  	Room::PRIMARY_KEY .' = ' . $room . ' AND '.User::PRIMARY_KEY.' = '. $user;
		
		return $request->exec('delete');	
	}
/**
 * RoomsUsers.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des sociétés du logiciel en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 *
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = 			new Request();
		
		$request->select = 	'U.Avatar, U.Login as Pseudo, A.*, TIMESTAMPDIFF(MINUTE , A.Last_Connexion, NOW( ) ) as MinuteDiff';
		$request->from = 	self::TABLE_NAME . " AS A INNER JOIN " . User::TABLE_NAME . " AS U ON A.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->order = 	'A.Is_Connect DESC, U.Login';
		$request->onexec = 	array('RoomsUsers', 'OnGetList');
		
		if(@$options->id){
			$request->where = 	Room::PRIMARY_KEY . ' = '. ((int) $options->id);
		}
		
		switch(@$options->op){
						
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= "";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		//echo $request->query;
		
		return $result; 
	}
/**
 * RoomsUsers.OnGetList(row) -> void
 **/
 	public static function OnGetList($row){
				
		$row['Statut'] = 0;
		
		if($row['Is_Connect'] == 0){
			$row['Statut'] = 2;	
		}else{	
			
			if($row['MinuteDiff'] * 1 > 1){
				$row['Statut'] = 1;
			}
			
			if($row['MinuteDiff'] * 1 > 15){
				$row['Statut'] = 2;
				self::Commit($row['Room_ID'], $row['User_ID'], 0);
			}
		}
	}
	
}



?>