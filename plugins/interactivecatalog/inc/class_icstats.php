<?php
/** section: InteractiveCatalog
 * class iCStat
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_icstats.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define('TABLE_ICSTATS', '`'.PRE_TABLE.'icatalog_statistics`');
class iCStat extends ObjectTools{
/**
 * iCStat.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const 	TABLE_NAME = 		TABLE_ICSTATS;
/**
 * iCStat.PRIMARY_KEY -> String
 * Clef primaire de la table iCStat.TABLE_NAME gérée par la classe.
 **/
	const 	PRIMARY_KEY = 		'Stat_ID';
/**
 * iCStat#Stat_ID -> Number
 **/	
	public $Stat_ID = 	0;
/**
 * iCStat#User_ID -> Number
 **/	
	public $User_ID = 	0;
/**
 * iCStat#Post_ID -> Number
 **/
	public $Post_ID = 	0;
/**
 * iCStat#Date -> String
 **/
	public $Date = 		0;
/**
 * new iCStat()
 **/
	function __construct(){}
	
/**
 * iCStat#commit() -> Boolean
 *
 * Cette méthode ajoute un post si ce dernier n'existe pas ou enregistre les informations en base de données dans le cas contraire.
 * Cette méthode retourne vrai si la mise à jour des données réussi.
 **/
	public function commit(){
		
		iCManager::Configure();
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
				
		if(User::IsConnect()){
			$this->User_ID = User::Get()->User_ID;
		}else{
			$this->User_ID = 0;
		}
					
		$request->fields = 	"(`User_ID`, `Post_ID`, `Date`, `IP`, `User_Agent`)";
		$request->values = 	"(
								'".Sql::EscapeString($this->User_ID)."',  
								'".Sql::EscapeString($this->Post_ID)."', 
								CURRENT_TIMESTAMP,
								'".Sql::EscapeString($this->IP = $_SERVER['REMOTE_ADDR'])."',
								'".Sql::EscapeString($this->User_Agent = $_SERVER['HTTP_USER_AGENT'])."'
							)";
			
		if($request->exec('insert')){				
			return $request->exec('update');
		}
		
		return false;	
	}
/**
 * iCatalog.exec(op) -> int
 * - op (String): Opération envoyé par l'interface.
 *
 * Cette méthode permet de traiter une opération envoyé par l'interface du logiciel.
 **/
	public static function exec($op){
		switch($op){
			
			case 'icstat.list':
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				break;
		}
	}
	
	public static function GetList($clauses = '', $options = ''){
		
		$request = new Request();
		
		$request->select = 	'U.*, COUNT(I.User_ID) as Total';
		$request->from = 	self::TABLE_NAME.' AS I INNER JOIN '.User::TABLE_NAME.' as U ON I.'.User::PRIMARY_KEY.' = U.'.User::PRIMARY_KEY;
		$request->where = 	'U.Is_Active = 2';
		$request->order = 	'Total DESC';
		$request->group =	'I.User_ID';
		
		$request->onexec = array('iCStat', 'onGetList');
		
		switch(@$options->op){
			default:
				
				break;
		}
		
		
		if(isset($obj) && $obj != ''){
			if($obj->where) {
						
				$request->where = " Name like '%". Sql::EscapeString($obj->where) . "%' 
									OR Description like '%". Sql::EscapeString($obj->where) ."%'";
				
			}
			if($obj->order) 	$request->order = $obj->order;
			if($obj->limits) 	$request->limits = $obj->limits;
		}
		
		$result = $request->exec('select');
				
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		return $result; 
		
		
		
	}
	
	static public function onGetList($row){
		$row['SevenDays'] = Sql::Count(self::TABLE_NAME, '
			User_ID = ' . $row['User_ID'] . '
			AND `Date` <= CURRENT_TIMESTAMP() 
			AND `Date` >= CURDATE() - INTERVAL 7 DAY
		');
	}
}

?>