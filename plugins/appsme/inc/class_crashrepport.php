<?php
/** section: AppsMe
 * class CrashRepport < ObjectTools
 * Cette classe gère les notifications de rapport d'erreur liées à une application.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_crashrepport.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/
define('TABLE_APP_CRASH', '`'.PRE_TABLE.'applications_crash`');
class CrashRepport extends ObjectTools implements iClass{
/**
 * CrashRepport.TABLE_NAME -> String 
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APP_CRASH;
/**
 * CrashRepport.PRIMARY_KEY -> String
 * Clef primaire de la table CrashRepport.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Crash_ID';
/**
 * CrashRepport.Crash_ID -> int
 * Numéro d'identifiant du rapport d'erreur.
 **/
	public $Crash_ID =			0;
	
	public $Code_Crash =		'';
/**
 * CrashRepport.Application_ID -> int
 * Identifiant de l'application concerné.
 **/
	public $Application_ID =	0;
/**
 * CrashRepport.Name -> String
 * Name permet de retrouver l'Application_ID du rapport d'erreur.
 * Lorsque le rapport sera créé et inseré en base de données, la méthode `CrashRepport.commit`
 * recherchera l'`Application_ID` correspondant à `Name`.
 **/
	public $Name = 	'';
	public $Email =				'';
/**
 * CrashRepport.Version -> String
 * Version concerné par le rapport d'erreur.
 **/
	public $Version =			'';
/**
 * CrashRepport.Function -> String
 * Fonctionnalité du logiciel concerné par la rapport d'erreur.
 **/
	public $Function =			'';
/**
 * CrashRepport.Description -> String
 * Description de l'erreur rencontré par l'utilisateur.
 **/
	public $Description =		'';
/**
 * CrashRepport.Conclusion -> String
 * Conclusion émit par le développeur de l'application concernant le rapport d'erreur.
 **/
	public $Conclusion =		'';
/**
 * CrashRepport.Date_Crash -> String
 * Date de création du rapport.
 **/
	public $Date_Crash =		'';
/**
 * CrashRepport.Statut -> int
 * Statut du rapport. 0 pour en attente de lecture, 1 pour en cours de traitement et 2 pour cloturé.
 **/
	public $Statut =			'';
/**
 * new CrashRepport()
 * new CrashRepport(json)
 * new CrashRepport(array)
 * new CrashRepport(obj)
 * new CrashRepport(crashid)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[CrashRepport]].
 * - array (Array): Tableau associatif équivalent à une instance [[CrashRepport]]. 
 * - obj (Object): Objet équivalent à une instance [[CrashRepport]].
 * - crashid (int): Numéro d'identifiant d'un rapport d'incident. Le rapport sera récupéré depuis la base de données.
 *
 * Créer un nouveau rapport d'incident.
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
 * CrashRepport.exec(command) -> int
 * - command (String): Commande à exécuter.
 *
 * Cette méthode `static` exécute une commande envoyée par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes doivent avoir un objet [[CrashRepport]] au format `JSON` dans `$_POST['CrashRepport']`.
 *
 * * `application.crash.commit`: Enregistre les informations de l'instance en base de données. 
 * * `application.crash.delete`: Supprime l'instance de la base de données. 
 *
 * Les commandes suivantes utilisent des champs spécifiques : 
 *
 * * `user.list` :  Liste les rapports d'incidents en fonction des objets contenus dans `$_POST['clauses']` et `$_POST['options']`.
 *
 **/
	final static function exec($op){
		switch($op){
			case 'application.crash.commit':
				$crash = new CrashRepport($_POST['CrashRepport']);
								
				if(!$crash->commit()){
					return "application.crash.commit.err";	
				}
				
				echo json_encode($crash);
				
				break;
			case 'application.crash.delete':
				$crash = new CrashRepport($_POST['CrashRepport']);
				
				if(!$crash->delete()){
					return "application.crash.delete.err";	
				}
				echo json_encode($crash);
				
				break;
			case 'application.crash.list':
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return 'application.crash.list.err';
				}
				echo json_encode($tab);
				break;
			case 'application.crash.count':
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return 'application.crash.list.err';
				}
				echo json_encode($tab['maxLength']);
				break;
		}
	}
/**
 * CrashRepport.execSafe(command) -> int
 * - command (String): Commande à exécuter.
 *
 * Cette méthode `static` exécute une commande envoyée par une source externe en mode non connecté.
 * 
 * <p class="note">Le mode non connecté indique qu'aucun utilisateur n'est authentifié. Indiquez ici les commandes accessible depuis n'importe quel client</p>
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes doivent avoir un objet [[CrashRepport]] au format `JSON` dans `$_POST['CrashRepport']`.
 *
 * * `application.crash.commit`: Enregistre les informations de l'instance en base de données.
 *
 **/	
	final static function execSafe($op){
		switch($op){
			case 'application.crash.commit':
				//echo $_POST['CrashRepport'];
				$crash = self::Unserialize($_POST['CrashRepport']);
				//echo $crash;		
				if(!($crash instanceof CrashRepport)){
					$crash = new CrashRepport($crash);
				}
							
				if(!$crash->commit()){
					return "application.crash.commit.err";	
				}
				
				//envoi d'un e-mail aux développeurs de l'application 
				$application = 	new App($crash->Application_ID);
				$users = 		$application->getUserList();
				$owner =		new User((int) $application->User_ID);
				
				//Création du mail
				$mail = 		new Mail();
				
				$mail->setType(Mail::HTML);
				$mail->From = 	$owner->EMail;
				
				$mail->addRecipient($owner->EMail);
				
				$mail->setSubject("Rapport d\'erreur : ". $application->Name);
				
				$mail->Message = '<html><title>Rapport d\'erreur : '. $application->Name .'</title></head>
				<body>
					<h3>Rapport d\'erreur : '. $application->Name .'</h3>
					<h4>Bonjour ami développeur,</h4>
					<p>Un nouveau rapport d\'erreur vient d\'être envoyé par un utilisateur de votre application.</p>
					<h4>Détail</h4>
					<p>'.nl2br($crash->Description).'</p>
					<h5>Posté le '.$crash->Date_Crash.'</h5>
					<p>Pour plus de détail sur le rapport d\'erreur merci de vous connecter à l\'adresse suivante : <a href="'.URI_PATH.'">'.URI_PATH.'</a></p>
				</body>
				</html>';
					
				for($i = 0; $i < $users['length']; $i++){
					if($users[$i]['Right'] < 3){		
						$mail->addCc($users[$i]['EMail']);
					}
				}
				
				@$mail->send();
				//
				echo json_encode($crash);
				break;
		}
	}
/**
 * CrashRepport.commit() -> bool
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 * Elle retourne vrai quand l'enregistrement à réussi et faux dans le cas contraire.
 **/
	public function commit(){
		global $S;
				
		$request = new Request();
		
		if($this->Crash_ID == 0){
			
			if($this->Application_ID == 0 && $this->Name != ''){
				
				$app = App::getByName($this->Name);
				if(!$app) return false;
				
				$this->Application_ID = $app->Application_ID;
			}
						
			$request->from = 	self::TABLE_NAME;
			$request->fields = 	'(`Application_ID`, `Email`, `Version`, `Function`, `Description`, `Date_Crash`, `Statut`)';
			$request->values = 	"(
									'".$this->Application_ID."',
									'".$this->Email."',
									'".mysql_real_escape_string($this->Version)."',
									'".mysql_real_escape_string($this->Function)."',
									'".mysql_real_escape_string($this->Description)."',									
									CURRENT_TIMESTAMP(),
									'".mysql_real_escape_string($this->Statut)."'
								)";
						
			if(!$request->exec('insert')) return false;
			
			$this->Crash_ID = 	$request->exec('lastinsert');
			$this->Date_Crash = date('Y-m-d h:i:s');
			return true;
		
		}
	
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"
							`Conclusion` = '".mysql_real_escape_string($this->Conclusion)."',
							`Statut` = '".mysql_real_escape_string($this->Statut)."'
							";
		$request->where = 	self::PRIMARY_KEY." = '".$this->Crash_ID."'";

		return $request->exec('update');
	}
/**
 * CrashRepport.delete() -> bool
 *
 * Cette méthode supprime l'instance de la base de données.
 **/
	public function delete(){	
		$request = new Request();
		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY." = '".$this->Crash_ID."'";
				
		return $request->exec('delete');
	}
/**
 * CrashRepport.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des rapports d'incident en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 *
 * * `options.op` = "-a" : Retourne la liste des incidents concernant une application. Vous dever mentionner une Application_ID via `options.value`.
 * * `options.op` = "-n" : Retourne la liste des incidents non traité.
 *
 * <p class="note">Uniquement disponible pour la version Javalyss Server</p>
 **/
	public static function GetList($clauses = '', $options = ''){
		//
		// Sous requete pour la recherche dans la table applications_utilisateurs
		//		
		$reqUser = 			new Request();
		$reqUser->select = 	App::PRIMARY_KEY;
		$reqUser->from =	App::EXT_TABLE_NAME;
		$reqUser->where = 	User::PRIMARY_KEY . ' = '.User::Get()->getID();
		//
		// Requete principale
		//
		$request = new Request();
		
		$request->select = 	'B.*, A.*';
		$request->from = 	self::TABLE_NAME. ' A JOIN '.App::TABLE_NAME.' B ON B.'.App::PRIMARY_KEY.' = A.'.App::PRIMARY_KEY;
		$request->order =	'Date_Crash DESC';
		
		switch(@$options->op){
			default: 
				$request->onexec = 	array('CrashRepport', 'onGetList');
				$request->where = 	'(
									B.User_ID = '.User::Get()->getID().'  
									OR B.Application_ID IN ('.$reqUser->compile('select').'))';
				break;
			case '-a': //liste des rapport d'une application
				$request->where = 'B.'.App::PRIMARY_KEY.'= '.$options->value;
				break;
			case '-n': //liste de tous les rapports non traité
				$request->onexec = 	array('CrashRepport', 'onGetList');					
				$request->where = 	'(
									B.User_ID = '.User::Get()->getID().'  
									OR B.Application_ID IN ('.$reqUser->compile('select').')) 
									AND B.Statut = 0';
				break;
			case '-all': //liste des rapports en fonction d'un utilisateur
				//$request->where = 'B.User_ID = '.User::Get()->getID();
				break;
			
		}
				
		if(isset($clauses) && $clauses != ''){
			if($clauses->where) {
					$request->where .= " AND (
									A.Function like '%". mysql_real_escape_string($clauses->where)."%'
									OR A.Version like '%". mysql_real_escape_string($clauses->where)."%')";		
			}
			if($clauses->order) 	$request->order = 	$clauses->order;
			if($clauses->limits) 	$request->limits = 	$clauses->limits;
		}
		
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		//echo $request->query;
		return $result; 
		
	}
	
	final static public function onGetList(&$row){
		
		$request = 			new Request();
		$request->select = 	'`Right`';
		$request->from =	App::EXT_TABLE_NAME;
		$request->where = 	User::PRIMARY_KEY . ' = '.User::Get()->getID(). ' AND '.self::PRIMARY_KEY.' = ' .$row['Application_ID'];
		
		$result = $request->exec('select');
		
		if($result['length'] == 0) $row['Right'] = 0;
		else $row['Right'] = $result[0]['Right'];
	}

}
?>