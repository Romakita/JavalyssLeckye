<?php 
/** section: Core
 * class System.Role
 * includes ObjectTools, iClass
 *
 * Cette classe gère les informations d'un rôle du [[System]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_role.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
namespace System\User{

define('TABLE_ROLE', '`'.PRE_TABLE.'roles`');

class Role extends \ObjectTools implements \iClass{	
	const PRE_OP =				'role.';
/**
 * System.Role.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/	
	const 	TABLE_NAME = 		TABLE_ROLE;
/**
 * System.Role.PRIMARY_KEY -> String
 * Clef primaire de la table System.Role.TABLE_NAME gérée par la classe.
 **/
	const 	PRIMARY_KEY = 		'Role_ID';
/**
 * System.Role#Role_ID -> int
 * Numéro d'identifiant du rôle.
 **/
	public $Role_ID = 			0;
/**
 * System.Role#Parent_ID -> int
 * Numéro d'identifiant du rôle parent.
 **/
	public $Parent_ID = 		3;
/**
 * System.Role#Name -> int
 * Titre du rôle.
 **/
	public $Name = 			'';	
/**
 * System.Role#Description -> int
 * Description du rôle
 **/
	public $Description = 	'';	
/**
 * System.Role#Is_Active -> Boolean
 * Indique que le groupe d'utilisateur peut accèder à l'administration ou pas.
 **/
	public $Is_Active = 	'';	
/*
 * System.Role#Role_Meta -> int
 * Information complémentaire concernant le rôle. Ces informations sont encodées au format JSON.
 **/
	public $Role_Meta = 	'{}';
/**
 * new System.Role()
 * new System.Role(json)
 * new System.Role(array)
 * new System.Role(obj)
 * new System.Role(roleid)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[System.Role]].
 * - array (Array): Tableau associatif équivalent à une instance [[System.Role]].
 * - obj (Object): Objet équivalent à une instance [[System.Role]].
 * - roleid (int): Numéro d'identifiant d'un rôle. Les informations du rôle seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[System.Role]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){

				if(is_numeric($arg_list[0])){
					
					$request = 			new \Request();
					$request->select = 	'*';
					$request->from = 	self::TABLE_NAME;
					$request->where = 	self::PRIMARY_KEY .' = '.$arg_list[0];

					$result = $request->exec('select');
					
					if($result['length'] > 0) $this->extend($result[0]);
				}
				elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
				elseif(is_object($arg_list[0])){
					$this->extend($arg_list[0]); 
					if(!empty($arg_list[0]->Name)){
						$this->Name = $arg_list[0]->Name;
					}
				}elseif(is_array($arg_list[0])){
					
					$this->extend($arg_list[0]); 
					if(!empty($arg_list[0]['Name'])){
						$this->Name = $arg_list[0]['Name'];	
					}
				}
			
		}
	}
	
	public static function Initialize(){
		\System::Observe('gateway.exec', array('\System\User\Role', 'exec'));
	}
/**
 * System.Role.exec(op) -> int
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes doivent avoir un objet [[Role]] au format `JSON` dans `$_POST['Role']`.
 *
 * * `role.commit`: Enregistre les informations de l'instance en base de données.
 *
 * Les commandes suivantes utilisent des champs spécifiques : 
 *
 * * `role.list` :  Liste les utilisateurs en fonction des objets contenus dans `$_POST['clauses']` et `$_POST['options']`.
 *
 **/
	public static function exec($cmd){
		switch($cmd){
			
			case self::PRE_OP."commit":
				$o = new self($_POST['Role']);
				
				if(!$o->commit()){
					return $cmd.'.err';
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."exists":
				
				$o = new self($_POST['Role']);
				
				echo json_encode($o->exists());
				
				break;

			case self::PRE_OP."list":
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new \stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
			
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $cmd.'.err';
				}
				
				echo json_encode($tab);
				
				break;
			
		}
		return 0;
	}
/**
 * System.Role#commit() -> Boolean
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit(){
	    $request = 			new \Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Role_ID == 0){
			
			$request->fields = 	"`Parent_ID`,
								`Name`,
								`Description`,
								`Is_Active`,
								`Role_Meta`";
			$request->values = 	"'".\Sql::EscapeString($this->Parent_ID)."',
								'".\Sql::EscapeString($this->Name)."',
								'".\Sql::EscapeString($this->Description)."',
								'".\Sql::EscapeString($this->Is_Active)."',
								'".\Sql::EscapeString($this->Role_Meta)."'";
			
			\System::Fire('role:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Role_ID = $request->exec('lastinsert');
				
				\System::Fire('role:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Parent_ID` = '".\Sql::EscapeString($this->Parent_ID)."',
								`Name` = '".\Sql::EscapeString($this->Name)."',
								`Description` = '".\Sql::EscapeString($this->Description)."',
								`Is_Active` = '".\Sql::EscapeString($this->Is_Active)."',
								`Role_Meta` = '".\Sql::EscapeString($this->Role_Meta)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Role_ID."'";
		
		\System::Fire('role:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			\System::Fire('role:commit.complete', array(&$this));
			return true;
		}
		return false;
	}
/*
 * System.Role#delete() -> boolean
 *
 * Cette méthode supprime l'instance [[Role]] de la base de données et retourne vrai en cas de succès.
 *
 * <p class="note">Cette méthode emet une erreur si les privilèges de l'utilisateur connecté au logiciel sont insufisants.</p>
 **/
	public function delete(){}
/**
 * System.Role#exists() -> Boolean
 *
 * Cette méthode indique si le nom du rôle est déjà attribué.
 **/
	public function exist(){
		return \Sql::count(Role::TABLE_NAME, "Role_ID != '".$this->Role_ID."' AND `Name` = '".$this->getName()."'") > 0;
	}
/**
 * System.Role.ByName(name [, parentid = 3 [, enable = false]]) -> Role
 * - name (String): Nom du rôle.
 * - parentid (Number): Role parent si le role n'existe pas.
 * - enable (Boolean): Indique si le groupe doit être activé lors de sa création.
 * 
 * Cette méthode retourne un groupe à partir de son nom. Si le groupe n'existe pas, il sera automatiquement créé.
 **/	
	public static function ByName($name, $parent = 3, $enable = false){
		
		$request = 			new \Request();
		$request->from = 	self::TABLE_NAME;
		$request->where =	'Name = "'.\Sql::EscapeString($name).'"';
		
		$result = $request->exec('select');
		
		if($result['length'] > 0){
			return new self($result[0]);
		}
		
		$request->where =	'Name like "[%]"';
		
		$result = $request->exec('select');
		
		if($result['length'] > 0){
			$role = new self($result[0]);
		}else{
			$role = new self();
		}
		
		$role->Name = 		$name;
		$role->Parent_ID = 	$parent;
		$role->Is_Active = 	$enable;
		
		$role->commit();
		
		return $role;
	}
/**
 * System.Role.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/
	public static function GetList($obj = '', $options = ''){
		$request = new \Request();
		
		$request->select = 	'*, Name as text, Role_ID as value';
		$request->from = 	self::TABLE_NAME;
		$request->order = 	self::PRIMARY_KEY;
		
		switch(@$options->op){
			default:
				$request->where = 'Is_Active = 1';
				break;
			case "-all":
				
				break;
		}
		
		
		if(isset($obj) && $obj != ''){
			if($obj->where) {
								
				$request->where = " Name like '%". \Sql::EscapeString($obj->where) . "%' 
									OR Description like '%". \Sql::EscapeString($obj->where) ."%'";
				
			}
			if($obj->order) 	$request->order = $obj->order;
			if($obj->limits) 	$request->limits = $obj->limits;
		}
		//
		// Evenement
		//
		\System::Fire('role:list', array(&$request, $options));
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = \Sql::Count($request->from, $request->where);
		}
		return $result; 
	}
/**
 * System.Role.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (\Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet Requete lors de son exécution.
 *
 **/	
	public static function onGetList(&$row, &$request){}

	public function __toString(){
		return $this->Name;
	}
	/**
	 * Retourne l'identifiant du role.
	 * @return {Integer} User_ID
	 */
	public function getID(){
		return $this->Role_ID;
	}
	/**
	 * Retourne le Role parent.
	 * @return {Role}
	 */
	public function getRoleParent(){
		return new self($this->Parent_ID);
	}
	/**
	 * Retourne le nom du role.
	 * @return {String}
	 */
	public function getName(){
		return $this->Name;
	}
	/**
	 * Retourne la description du role.
	 * @return {String}
	 */
	public function getComents(){
		return $this->Description;
	}
	
	public function getDescription(){
		return $this->Description;
	}
/**
 * System.Role#getMeta(key) -> String | int
 * - key (String): Nom de la clef.
 *
 * Cette méthode permet de récuperer une information stockée en base de données dans le champ `Meta`.
 **/
	public function getMeta($key){
		$obj = is_object($this->Role_Meta) ? $this->Role_Meta : json_decode($this->Role_Meta);
		return @$obj->$key ? $obj->$key : false;
	}
/**
 * System.Role#setMeta(key, value) -> Boolean
 * System.Role#setMeta(obj) -> Boolean
 * - key (String): clef de la valeur à stocker.
 * - value (String | int): Valeur à stocker.
 * - obj (Object): 
 *
 * Cette méthode permet d'assigner une information stockée en base de données dans le champ `Meta`.
 **/
	public function setMeta($key, $value = NULL){
		if(empty($key)){
			return true;
		}
		if(is_object($key)){
			$obj = is_object($this->Role_Meta) ? $this->Role_Meta : json_decode($this->Role_Meta);
			
			foreach($key as $name => $value){
				$obj->$name = $value;
			}
			
		}else{
			
			if(empty($this->Role_Meta)){
				$this->Role_Meta = new \stdClass();	
			}
			
			$obj = is_object($this->Role_Meta) ? $this->Role_Meta : json_decode($this->Role_Meta);
			
			$obj->$key = $value;
		}
		
		if($this->Role_ID != 0){
			
			$request = 			new \Request();
			$request->from = 	self::TABLE_NAME;
			$request->set = 	"Role_Meta = '".\Sql::EscapeString(json_encode($obj))."'";
			$request->where = 	self::PRIMARY_KEY. " = " . $this->Role_ID;
	
			$result = $request->exec('update');
					
			return $result;
		}
		
		$this->Role_Meta = json_encode($obj);
				
		return true;
	}

}

}

namespace{
    class Role extends \System\User\Role{}
}