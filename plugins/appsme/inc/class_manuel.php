<?php
define('TABLE_APP_MAN', '`'.PRE_TABLE.'applications_man`');
/** section: AppsMe
 * class Manuel < ObjectTools
 * Cette classe gère l'édition de guide utilisateur d'une application.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_manuel.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/
class Manuel extends ObjectTools{
/**
 * Manuel.TABLE_NAME -> String 
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APP_MAN;
/**
 * Manuel.PRIMARY_KEY -> String
 * Clef primaire de la table TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Man_ID';
/**
 * Manuel.Man_ID -> int
 * Clef primaire du rapport d'erreur.
 **/
	public $Man_ID =			0;
/**
 * Manuel.Parent_ID -> int
 * Clef primaire d'une page parente à l'instance. Laisser à zéro si le cette page n'a pas de page parente.
 **/
	public $Parent_ID =			0;
/**
 * Manuel.Application_ID -> int
 * Identifiant de l'application concerné.
 **/
	public $Application_ID =	0;
/**
 * Manuel.Title -> String
 **/
	public $Title = 			'';
/**
 * Manuel.Description -> String
 **/
	public $Description =		'';
/**
 * Manuel.Level -> int
 **/
	public $Level =				0;
/**
 * Manuel.Statut -> int
 **/
	public $Statut =			0;
/**
 * new Manuel([mixed])
 * - mixed (array | int | Object | String): restitution du context.
 *
 * Créer un nouvelle page pour le manuel utilisateur de l'application.
 *
 * #### Paramètre mixed
 *
 * Le paramètre `mixed` permet de restituer le context de l'objet à partir de différente source. Si le type de `mixed` est :
 *
 * * Integer : c'est-à-dire un numéro Application_ID, alors l'objet sera reconstitué à partir de son image en base de données.
 * * String : Si la chaine est format JSON, elle sera évalué et ses attributs seront copiés dans l'instance.
 * * Array et Object : Les attributs du tableau associatif ou de l'objet seront copiés dans l'instance.
 *
 **/	
 	final function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs >0){
			if(is_int($arg_list[0])) {
	
				$request = 			new Request();
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY.' = '.$arg_list[0];

				$u = $request->exec('select');
				$this->setArray($u[0]);
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);
		}
	}
/**
 * Manuel.exec(op) -> int
 * - op (String): Opération envoyé par l'interface.
 *
 * Cette méthode permet de traiter une opération envoyé par l'interface du logiciel.
 **/
	final static function exec($op){
		switch($op){
			case 'application.manuel.commit':
				$man = new Manuel($_POST['Manuel']);
								
				if(!$man->commit()){
					return "application.manuel.commit.err";	
				}
				
				echo json_encode($man);
				
				break;
			case 'application.manuel.delete':
				$man = new Manuel($_POST['Manuel']);
				
				if(!$man->delete()){
					return "application.manuel.delete.err";	
				}
				echo json_encode($man);
				
				break;
			case 'application.manuel.list':
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return 'application.manuel.list.err';
				}
				echo json_encode($tab);
				break;
		}
	}
/**
 * Manuel.exec(op) -> int
 * - op (String): Opération envoyé par une application.
 *
 * Cette méthode permet de traiter une opération envoyé par une application externe au logiciel.
 *
 * <p class="note">Le mode safe est un mode non connecté. Il permet de faire des traitements de base mais restreint.</p>
 **/	
	final static function execSafe($op){
		switch($op){
			case 'application.manuel.get':	
				
				$man = new Manuel((int) $_POST['Man_ID']);
								
				if($man->Man_ID == ''){
					return "application.manuel.get.err";
				}
				
				echo json_encode($man);
				break;
		}
	}
/**
 * Manuel.commit() -> bool
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 * Elle retourne vrai quand l'enregistrement réussi.
 **/
	public function commit(){
		global $S;
				
		$request = new Request();
		
		if($this->Man_ID == 0){
									
			$request->from = 	self::TABLE_NAME;
			$request->fields = 	'(`Parent_ID`, `Application_ID`, `Title`, `Description`, `Level`, `Statut`)';
			$request->values = 	"(
									'".$this->Parent_ID."',
									'".$this->Application_ID."',
									'".mysql_real_escape_string($this->Title)."',
									'".mysql_real_escape_string($this->Description)."',
									'".mysql_real_escape_string($this->Level)."',
									'".mysql_real_escape_string($this->Statut)."'
								)";
						
			if(!$request->exec('insert')) return false;
			
			$this->Man_ID = $request->exec('lastinsert');
			return true;
		
		}
	
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"
							`Parent_ID` = '" . $this->Parent_ID . "',
							`Description` = '" . mysql_real_escape_string($this->Description) . "',
							`Title` = '" . mysql_real_escape_string($this->Title) . "',
							`Level` = '" . mysql_real_escape_string($this->Level) . "',
							`Statut` = '" . mysql_real_escape_string($this->Statut) . "'
							";
							
		$request->where = 	self::PRIMARY_KEY." = '" . $this->Man_ID . "'";

		return $request->exec('update');
	}
/**
 * Manuel.delete() -> bool
 *
 * Supprime l'instance en base de données.
 **/
	public function delete(){	
		$request = new Request();
		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY." = '".$this->Man_ID."'";
				
		return $request->exec('delete');
	}
/**
 * Manuel.GetList(clauses, options) -> array
 * - clauses (Object): Clause de restriction de la liste.
 * - options (Object): Options de construction de la liste.
 * 
 * <pre><code>Méthode static</pre></code>
 *
 * Cette méthode retourne une liste de données de la table self::TABLE_NAME.
 *
 * #### Les options
 *
 **/
	public static function GetList($clauses = '', $options = ''){
		global $S;
				
		$request = new Request();
		
		$request->select = 	'A.*';
		$request->from = 	self::TABLE_NAME. ' A JOIN '.App::TABLE_NAME.' B ON B.'.App::PRIMARY_KEY.' = A.'.App::PRIMARY_KEY;
		$request->order =	'Level, Man_ID';
		$request->where = 	'A.Parent_ID = 0 AND User_ID = '.User::Get()->getID();
		
		switch(@$options->op){
			case '-a':
				$request->where =  'B.'.App::PRIMARY_KEY.' = ' . $options->value;
				break;				
		}
				
		if(isset($clauses) && $clauses != ''){
			if(isset($clauses->where)) {
					$request->where .= " AND (
						Man_ID like '%".mysql_real_escape_string($clauses->where)."%'
						OR A.Title like '%".mysql_real_escape_string($clauses->where)."%'
						OR A.Description like '%".mysql_real_escape_string($clauses->where)."%')";
			}
			if(isset($clauses->order)) 	$request->order = 	$clauses->order;
			if(isset($clauses->limits)) 	$request->limits = 	$clauses->limits;
		}
		
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		//echo $request->query;
		return $result; 
		
	}
}
?>