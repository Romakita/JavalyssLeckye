<?php
define('TABLE_APP_RELEASE', '`'.PRE_TABLE.'applications_releases`');
/** section: AppsMe
 * class Release
 * Gestion des sous-version d'une application.
 * 
 * Les sous-versions constituent une application donnée. Une sous-version est en d'autre terme une mise à jour de l'application principale.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_release.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/
class Release extends ObjectTools implements iClass{
/**
 * Release.TABLE_NAME -> String 
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APP_RELEASE;
/**
 * Release.PRIMARY_KEY -> String
 * Clef primaire de la table TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Release_ID';
/**
 * Release#Release_ID -> int
 * Clef primaire d'une release.
 **/
	public $Release_ID = 			0;
/**
 * Release#Required_Version -> String
 **/
	public $Required_Version =		'';
/**
 * Release#Application_ID -> int
 * Clef primaire d'une application.
 **/
	public $Application_ID = 	0;
/**
 * Release#Title -> String
 * Titre de la sous-version.
 **/
	public $Title =				'';
/**
 * Release#Release_ID -> String
 * Date de publication de l'application.
 **/
	public $Date_Publication = 	'';
/**
 * Release#Version -> String
 * Version de la release.
 **/
	public $Version =			'';
/**
 * Release#Description -> String
 * Description des corrections apportés par rapport à l'anciènne version de l'application.
 **/
	public $Description =		'';
/**
 * Release#Link_Release -> String
 * Lien de la release.
 **/
	public $Link_Release = 		'';
	public $Beta =				0;
	public $Nb_Downloads =		0;
/**
 * Release#Statut -> String
 * Statut la release. Si le statut de la release est paramètré à 0 alors cette dernière ne sera pas prise en compte par le gestionnaire de mise à jours.
 * Pour déployé la release assigner la valeur 1 à `Release#Statut`. 
 **/
	public $Statut =			'draft';
	static $TheList =			array();
/**
 * new Release([mixed])
 * - mixed (array | int | Object | String): restitution du context.
 *
 * Cette méthode créée une nouvelle instance [[Release]].
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
			if(is_numeric($arg_list[0])) {
	
				$request = 			new Request();
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY.' = '.(int) $arg_list[0];

				$u = $request->exec('select');
				
				if($u['length'] > 0){
					$this->setArray($u[0]);
				}

			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);
		}
	}
	
	public static function Initialize(){
		
	}
/**
 * Release.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".Release::TABLE_NAME." (
		  `Release_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Application_ID` tinyint(2) NOT NULL,
		  `Required_Version` varchar(10) NOT NULL,
		  `Title` varchar(255) NOT NULL,
		  `Date_Publication` datetime NOT NULL,
		  `Version` varchar(10) NOT NULL,
		  `Description` text NOT NULL,
		  `Link_Release` text NOT NULL,
		  `Statut` varchar(30) NOT NULL DEFAULT 'draft',
		  `Beta` tinyint(1) NOT NULL DEFAULT '0',
		  `Nb_Downloads` int(11) NOT NULL DEFAULT '0',
		  `IP_List` text NOT NULL,
		  PRIMARY KEY (`Release_ID`)
		) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";
		$request->exec('query');	
	}
/**
 * Release#commit() -> bool
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 * Elle retourne vrai quand l'enregistrement réussi.
 **/
	public function commit(){
		global $S;
				
		$request = new Request();
		
		if(is_numeric($this->Statut)){
			$this->Statut = $this->Statut == '0' ? 'draft' : 'publish';
		}		
		
		if($this->Release_ID == 0){
			$request->from = 	self::TABLE_NAME;
			$request->fields = 	'(`Release_ID`, `Application_ID`, `Title`, `Date_Publication`, `Version`, `Required_Version`, `Description`, `Link_Release`, `Statut`, `Beta`)';
			$request->values = 	"(
									NULL,
									'".$this->Application_ID."',
									'".Sql::EscapeString($this->Title)."',
									NOW(),
									'".Sql::EscapeString($this->Version)."',
									'".Sql::EscapeString($this->Required_Version)."',
									'".Sql::EscapeString($this->Description)."',
									'".Sql::EscapeString($this->Link_Release)."',
									'".Sql::EscapeString($this->Statut)."',
									'".Sql::EscapeString($this->Beta)."'
								)";
						
			if(!$request->exec('insert')) return false;
			
			$this->Release_ID = $request->exec('lastinsert');
			return true;
		
		}
		
		$last = new Release($this->Release_ID);
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"
							`Title` = '".Sql::EscapeString($this->Title)."',
							`Version` = '".Sql::EscapeString($this->Version)."',
							`Required_Version` = '".Sql::EscapeString($this->Required_Version)."',
							`Description` = '".Sql::EscapeString($this->Description)."',
							`Link_Release` = '".Sql::EscapeString($this->Link_Release)."',
							`Statut` = '".Sql::EscapeString($this->Statut)."',
							`Beta` = '".Sql::EscapeString($this->Beta)."',
							`Nb_Downloads` = '".Sql::EscapeString($this->Nb_Downloads)."'
							";
		
		if($last->Statut == 0 && $this->Statut == 1){
			$request->set .= ", Date_Publication = NOW()";
		}
	
		$request->where = 	self::PRIMARY_KEY." = '".$this->Release_ID."'";

		return $request->exec('update');
	}
	
	function addDownload(){
		$stat = new ReleaseStatistic();
		$stat->Release_ID = $this->Release_ID;	
		$stat->commit();
	}
/**
 * Release.Get() -> Release | Boolean
 **/	
	static function Get($options){
		
		$request = 			new Request();
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.App::TABLE_NAME.' B ON B.'.App::PRIMARY_KEY.' = A.'.App::PRIMARY_KEY;
		$request->limits = '0,1';
		
		if(is_numeric($options)){
			$request->where = self::PRIMARY_KEY .' = ' . (int) $options;
		}else{
			if(!empty($options->Release_ID)){
				$request->where = self::PRIMARY_KEY .' = ' . (int) $options->Release_ID;
			}else{
				if(!empty($options->Name)){
					$request->where = "B.Name = '".Sql::EscapeString($options->Name)."'";
				}else{
					
					if(!empty($options->Application_ID)){
						$request->where = "A.Application_ID = '".Sql::EscapeString($options->Application_ID)."'";
					}else{
						return false;
					}
				}
				
				if(!empty($options->Version)){
					$request->where .= " AND Version = '".Sql::EscapeString($options->Version)."'";
				}else{
					return false;
				}
			}
			
			if(!empty($options->Statut) || !empty($options->Beta)){
				
				$request->where .= " AND (";
				
				if(!empty($options->Statut)){
					$request->where .= " A.Statut LIKE '%".Sql::EscapeString($options->Statut == 0 ? 'draft' : 'publish')."%'";
				}
				
				if(!empty($options->Statut) && !empty($options->Beta)){
					$request->where .= " OR ";
				}
				
				if(!empty($options->Beta)){
					$request->where .= " beta = '".Sql::EscapeString($options->Beta)."'";
				}
				
				$request->where .= " )";
			}
		}
		
		$result = $request->exec('select');
		
		if(!$result){
			return false;
		}
				
		return $result['length'] > 0 ? new Release($result[0]) : false;	
	}
/**
 * Release.GetLastVersion() -> Release | Boolean
 **/	
	static function GetLastVersion($app, $beta = 0, $version = false){
		$request = 			new Request();
		$request->select = 	'B.*, A.*';
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.App::TABLE_NAME.' B ON B.'.App::PRIMARY_KEY.' = A.'.App::PRIMARY_KEY;
		$request->limits =  '0,1';
		$request->order =	'Version DESC';
		
		if(!empty($beta)){
			$beta = " OR Beta = 1";
		}else{
			$beta = "";	
		}
		
		$request->where =	'A.'.App::PRIMARY_KEY .' = ' . ($app instanceof App ? $app->Application_ID : $app);
		$request->where .= 	" AND (A.Statut LIKE '%publish%'".$beta.")";
		
		if($version){
			$request->from .= 	' INNER JOIN '.self::TABLE_NAME. ' P ON P.'.self::PRIMARY_KEY.' = A.Required_Version';
			$request->where .= 	" AND P.Version <= '" . Sql::EscapeString($version)."'"; 	
		}
		
		$result = $request->exec('select');
		
		//echo $request->query;
		if(!$result){
			return false;
		}
		
		if($result['length'] > 0){
			$release = new Release($result[0]);
			
			if($app instanceof App){
				$app->Date_Update	= 	$release->Date_Publication;
			
				$file = str_replace(array(
					'http://javalyss.fr/server/', 
					'http://www.javalyss.fr/server/', 
					'http://server.javalyss.fr/', 
					URI_PATH
				), ABS_PATH, $release->Link_Release);
							
				$file = 				new File($file);
				
				$app->Weight = 			$file->size;
				$app->Release_ID =		$release->Release_ID;
				$app->Version =			$release->Version;		
				
				unset($release->Link_Release);		
			}
			
			return $release;
			
		}
		return false;
	}
/**
 * Release.ByVersion() -> Release | Boolean
 **/	
	static function ByVersion($appid, $versionid){
		$request = 			new Request();
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.App::TABLE_NAME.' B ON B.'.App::PRIMARY_KEY.' = A.'.App::PRIMARY_KEY;
		
		$request->where =	'A.'.App::PRIMARY_KEY .' = ' . (int) $appid. ' 
							AND A.Statut = "publish" 
							AND Version = "'. Sql::EscapeString($versionid).'"';
		
		$result = $request->exec('select');
		//echo $request->query;
		if(!$result){
			return false;
		}
				
		return $result['length'] > 0 ? new Release($result[0]) : false;	
	}
/**
 * Release.exec(op) -> int
 * - op (String): Opération envoyé par l'interface.
 *
 * Cette méthode permet de traiter une opération envoyé par l'interface du logiciel.
 **/
	static function exec($op){
		global $S;
		
		switch($op){
			case 'application.release.commit':
				$app = new Release($_POST['Release']);
								
				if(!$app->commit()){
					return "application.release.commit.err";	
				}
				
				echo json_encode($app);
				break;
			
			case 'application.release.delete':
				$app = new Release($_POST['Release']);
				if(!$app->delete()){
					return "application.release.delete.err";	
				}
				echo json_encode($app);
				break;
				
			case 'application.release.list':
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return 'application.release.list.err';
				}
				echo json_encode($tab);
				break;
								
			case 'application.release.title.list':
				if(!$tab = self::Distinct('Title')){
					return "application.release.title.list.err";	
				}
				echo json_encode($tab);
				break;
			case "application.release.import":
				$obj =  	new App((int) $_POST['Application_ID']);
				
				FrameWorker::Start();
				
				$folder = 	App::MkDir($obj->Application_ID).'releases/';
				
				FrameWorker::Draw('upload -o="'.$folder.'"');
				
				//récupération du fichier
				$file = 		FrameWorker::Upload($folder, 'zip;');
				FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $file));
				
				break;
		}
	}
/**
 * Release.exec(op) -> int
 * - op (String): Opération envoyé par une application.
 *
 * Cette méthode permet de traiter une opération envoyé par une application externe au logiciel.
 *
 * <p class="note">Le mode safe est un mode non connecté. Il permet de faire des traitements de base mais restreint.</p>
 **/
	static function execSafe($op){
		foreach($_GET as $key => $value){
			if(empty($_POST[$key])){
				$_POST[$key] = $value;
			}
		}
		switch($op){
			case 'application.release.get':
				
				$options->op = 		'-description';
				$options->Name = 	$_POST['Name'];
				$options->Version = $_POST['Version'];
	
				if(!$tab = self::GetList('', $options)){
					return 'application.release.get.err';
				}
				
				if($tab['length'] == 0) {
					echo "Aucune données correspondantes";
					break;	
				}
				
				echo $tab[0]['Description'];
				
				break;
			
			case 'application.release.last':
				//echo "ici";
				$options->op = 		'-last';
				$options->Name = 	$_POST['NAME_VERSION'];
				$app = self::GetList('', $options);
				
				echo serialize($app[0]);
								
				break;
				
			case 'application.release.list':
				
				if(!empty($_POST['NAME_VERSION'])){
					$options->Name = 	ObjectTools::RawURLDecode($_POST['NAME_VERSION']);
				}else{
					AppsMe::eDie($op.'.name.version.err');
				}
				
				if(!empty($_POST['CODE_VERSION'])){
					$options->Version = ObjectTools::RawURLDecode($_POST['CODE_VERSION'].$_POST['CODE_SUBVERSION']);
				}else{
					AppsMe::eDie($op.'.code.version.err');
				}
				
				$options->op = 		'-update';
				$options->Version = $_POST['CODE_VERSION'].$_POST['CODE_SUBVERSION'];
						
				if(!$tab = Release::GetList('', $options)){
					AppsMe::eDie($op.'.err');
				}
								
				$options->rootName = 'Releases';
				$options->itemName = 'Release {id}';
				
				//unset($tab['maxLength']);
				
				echo json_encode($tab);
				break;
			
		}
		
	}	
/**
 * Release.Distinct(field) -> Array
 * - field (String): Champs de recherche.
 *
 * Recherche la liste distinct des mots contenu dans la colonne `field` et retourne la liste.
 **/
	public static function Distinct($field){
		global $S;
		
		$request = 			new Request();
		$request->select =	"DISTINCT ".addslashes($field)."  AS text, ".addslashes($field)." as value";
		$request->from = 	self::TABLE_NAME.' AS A JOIN '.App::TABLE_NAME.' as B ON A.'.App::PRIMARY_KEY. ' = B.'.App::PRIMARY_KEY;
		$request->where = 	"User_ID = ".User::Get()->getID();
		
		return $request->exec('select');
	}

/**
 * Release#delete() -> bool
 *
 * Supprime l'instance en base de données.
 **/
	public function delete(){	
		$request = new Request();
		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY." = '".$this->Release_ID."'";
				
		return $request->exec('delete');
	}
/**
 * Release#GetList(clauses, options) -> array
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
		
		$request->select = 	'A.Release_ID, A.Application_ID, A.Required_Version, A.Title, A.Date_Publication, A.Version, A.Description, A.Link_Release, A.Statut, A.Beta, A.Nb_Downloads, B.Type, B.Name, 0 Note, 0 Nb_Note, B.Icon';
		$request->from = 	self::TABLE_NAME. ' A INNER JOIN '.App::TABLE_NAME.' B ON B.'.App::PRIMARY_KEY.' = A.'.App::PRIMARY_KEY;
		$request->order =	'A.Statut DESC, Version DESC';
		$request->where =	' 1 ';
			
		$appOptions = System::Meta('AppsMe_Options');
		
		if(isset($options->Application_ID)){
			$request->where .= ' AND B.Application_ID = '. (int) $options->Application_ID;
		}
		
		if(!empty($options->Name) && is_string($options->Name)){
			$request->where .= 	" AND B.Name = '". Sql::EscapeString($options->Name) . "'";
		}
		
		$request->observe(array(__CLASS__, 'onGetStat'));
				
		switch(@$options->op){
			
			default: break;
			
			case '-version':
				$request->select = 	'DISTINCT CONCAT(B.Name, " ", Version) as text, Release_ID as value';
				$request->order =	'Version DESC';
				break;
						
			case '-publish':
								
				$beta = '';
				
				if(!empty($options->Beta)){
					$beta = " AND Beta IN(0, 1)";
				}
				
				if(!empty($options->Version)){
					$beta .= " AND Version > '". Sql::EscapeString($options->Version)."'";
				}
								
				$request->where .= " AND (A.Statut LIKE '%publish%'".$beta.")";
				$request->order = 	"Version DESC";
				
				$request->onexec = 	array('Release', 'onGetPublish');
				
				break;
				
			case '-last':
			case '-l'://Release la plus récentes
								
				$beta = '';
				
				if(!empty($appOptions->Beta)){
					if(!empty($options->Beta)){
						$beta = " OR Beta = 1";
					}
				}
								
				$request->where .= " AND (A.Statut LIKE '%publish%'".$beta.")";
				$request->order = 	"Version DESC";
				$request->limits = 	"0, 1";
				break;
				
			case '-description':
			case '-d': //Description d'une version
												
				$beta = '';
				if(!empty($appOptions) && empty($appOptions->Beta)){
					if(!empty($options->Beta)){
						$beta = " OR Beta = 1";
					}
				}
				
				$request->where .= " AND A.Version = '".Sql::EscapeString($options->Version)."' 
									AND (A.Statut LIKE '%publish%'".$beta.")";// 
				break;
				
			case '-update':
				$request->onexec = 	array('Release', 'onGetList');
				
				$beta = '';
				
				if(!empty($appOptions->Beta)){
					if(!empty($options->Beta)){
						$beta = " OR Beta = 1";
					}
				}
				
				$request->where .= 	" AND (A.Statut LIKE '%publish%'".$beta.")";
				
				$str = '';
				
				if(empty($options->Apps)){
					$options->Apps = array('length' => 0);
				}
								
				array_push($options->Apps, array('Name' => $options->Name, 'Version' => $options->Version));
				
				unset($options->Apps['length']);
				unset($options->Apps['maxLength']);
				
				if(@$appOptions->Broadcast_Update_Apps == 0){
					$request->where .= 	" AND Type = 'plugin'";
				}
				
				for($i = 0, $len = count($options->Apps); $i < $len; $i++){
					$str .= " (B.Name = '".Sql::EscapeString($options->Apps[$i]['Name'])."' AND A.Version >= '".Sql::EscapeString($options->Apps[$i]['Version'])."')";//
					if($i < $len - 1){
						$str .= ' OR ';
					}
				} 
								
				if(!empty($str)) $request->where .= " AND (" . $str . ")";
				
				$request->order = 'Type ASC, Release_ID DESC, Version DESC';
				
				break;
		}
		
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " AND (
									A.Title like '%". Sql::EscapeString($clauses->where)."%'
									OR A.Version like '%". Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = 	$clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = 	$clauses->limits;
		}
		
		$result = $request->exec('select');

		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}

		return $result; 
		
	}
/**
 *
 **/	
	static public function onGetStat(&$row){
		if(!empty($row['Release_ID'])){
			$row['Release_Nb_Download'] = 	ReleaseStatistic::CountReleaseDownload($row['Release_ID']);
		}
	}
/**
 *
 **/	
	static public function onGetPublish(&$row){
				
		//array_push(self::$TheList, $row['Name']);
		
		$file = str_replace(array(
			'http://javalyss.fr/server/', 
			'http://www.javalyss.fr/server/', 
			'http://server.javalyss.fr/', 
			URI_PATH
		), ABS_PATH, $row['Link_Release']);
		
		$file = 				new File($file);			
		$row['Taille']	= 		$file->size;
		$row['Weight'] =		$row['Taille'];
		
		//Protection du contenu à télécharger (!Bug pour les anciennes versions du dépôt à cause du lien
		
		/*$row['Link_Release'] = str_replace(array(
			'http://javalyss.fr/server/', 
			'http://www.javalyss.fr/server/', 
			'http://server.javalyss.fr/'
		), URI_PATH, $row['Link_Release']);	*/
		
		$row['Type'] = 0;
		
		//traiter 
		if(!empty($row['Required_Version'])){
			$row['Required'] = new Release((int) $row['Required_Version']);
			
			if($row['Required']->Release_ID != 0){
				
				$app = new App((int) $row['Required']->Application_ID);
				
				if($app->Application_ID > 0){
					$row['Required_Version'] = $row['Required']->Version;
					$row['Required']->Icon = $app->Icon;
					$row['Required']->Name = $app->Name;
					$row['Required']->Type = $app->Type;
				}else{
					unset($row['Required']);
				}
			}else{
				unset($row['Required']);
			}
		}
	}
/**
 *
 **/		
	static public function onGetList(&$row, &$request){
		
		if(in_array($row['Name'], self::$TheList)){
			return true;
		}
		
		array_push(self::$TheList, $row['Name']);
		
		$file = str_replace(array(
			'http://javalyss.fr/server/', 
			'http://www.javalyss.fr/server/', 
			'http://server.javalyss.fr/', 
			URI_PATH
		), ABS_PATH, $row['Link_Release']);
		
		$file = 				new File($file);			
		$row['Taille']	= 		$file->size;
		$row['Weight'] =		$row['Taille'];
		
		//Protection du contenu à télécharger (!Bug pour les anciennes versions du dépôt à cause du lien
		
		/*$row['Link_Release'] = str_replace(array(
			'http://javalyss.fr/server/', 
			'http://www.javalyss.fr/server/', 
			'http://server.javalyss.fr/'
		), URI_PATH, $row['Link_Release']);	*/
		
		$row['Type'] = 0;
		
		
		//traiter 
		if(!empty($row['Required_Version'])){
			$row['Required'] = new Release((int) $row['Required_Version']);
			
			if($row['Required']->Release_ID != 0){
				
				$app = new App((int) $row['Required']->Application_ID);
				
				if($app->Application_ID > 0){
					$row['Required_Version'] = $row['Required']->Version;
					$row['Required']->Icon = $app->Icon;
					$row['Required']->Name = $app->Name;
					$row['Required']->Type = $app->Type;
				}else{
					unset($row['Required']);
				}
			}else{
				unset($row['Required']);
			}
		}
		
		
	}
}
?>