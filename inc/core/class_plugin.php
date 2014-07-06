<?php
/** section: Core
 * class Plugin
 * includes ObjectTools
 * Cette classe gère les extensions du logiciel.
 **/
define('TABLE_PLUGIN', '`'.PRE_TABLE.'plugins`');

$PM;

class Plugin extends ObjectTools{
	private static $Manager = 	NULL;
/**
 * Plugin.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const 	TABLE_NAME = 		TABLE_PLUGIN;
/**
 * Plugin.PRIMARY_KEY -> String
 * Clef primaire de la table Plugin.TABLE_NAME gérée par la classe.
 **/
	const 	PRIMARY_KEY = 		'Plugin_ID';
	const 	SECONDARY_KEY = 	'Name';
	const 	FOLDER_KEY = 		'Folder';
/**
 * Plugin#Folder -> String
 * Dossier relatif de l'extension
 **/
	public $Folder =		'';
/**
 * Plugin#Name -> String
 * Nom de l'extension
 **/
	public $Name =		'';
/**
 * Plugin#Author -> String
 * Nom de l'auteur de l'extension
 **/
	public $Author =		'';
/**
 * Plugin#URI -> String
 * Adresse web de l'extension
 **/
	public $URI =		'';
/**
 * Plugin#Author_URI -> String
 * Adresse du site web de l'auteur
 **/
	public $Author_URI = '';
/**
 * Plugin#Version -> String
 * Version de l'extension
 **/
	public $Version =		'';
/**
 * Plugin#Description -> String
 * Description de l'extension
 **/
	public $Description = 	'';
/**
 * Plugin#Active -> String
 * Etat de l'extension
 **/
	public $Active =		0;
	
	private static $Role = NULL;
/**
 * new Plugin()
 * new Plugin(json)
 * new Plugin(array)
 * new Plugin(obj)
 * new Plugin(pluginid)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[Plugin]].
 * - array (Array): Tableau associatif équivalent à une instance [[Plugin]]. 
 * - obj (Object): Objet équivalent à une instance [[Plugin]].
 * - pluginid (int): Numéro d'identifiant d'une extension. Les informations de l'extension seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Plugin]].
 *
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		
		if($numargs == 1){
			if(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
	}
/**
 * Plugin.Initialize() -> void
 *
 * Cette méthode initialise le gestionnaire des extensions.
 **/	
	public static function Initialize(){
		self::$Manager =	new PluginManager(ABS_PATH.PATH_PLUGIN, ABS_PATH);
		
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		
		return self::$Manager;
	}
/**
 * Plugin.Get() -> PluginManager
 *
 * Cette méthode retourne le gestion des extensions.
 **/	
	public static function Get(){
		return self::$Manager;	
	}
/**
 * Plugin.Import() -> void
 *
 * Cette méthode importe les extensions dans le logiciel.
 **/	
	public static function Import($mode = System::SAFE){
		
		//inclusion des plugins
		$plugins = Plugin::GetList();
		
		if(!empty($_POST['Plugin'])){
			$plugin = new Plugin($_POST['Plugin']);
		}
		
		if(!empty($_POST['App'])){
			$plugin = new Plugin($_POST['App']);
		}
		
		for($i = 0; $i < $plugins['length']; $i++){
			
			if($mode == System::CNT){
				if(System::GetCMD() == 'plugin.active'){
					if(!empty($plugin) && empty($plugin->Folder)){
						if($plugin->Name == $plugins[$i]['Name']){
							$plugin->Folder = $plugins[$i]['Folder'];
							$_POST['App'] = $_POST['Plugin'] = $plugin;
						}
					}
				}
				
				if(System::GetCMD() == 'plugin.configure'){//on inclut pas immédiatement le plugin en cours d'inclusion
					if(!empty($plugin) && empty($plugin->Folder)){
						if($plugin->Name == $plugins[$i]['Name']){
							continue;	
						}
					}
				}
			}
			
			if(!@$plugins[$i]['Active']) continue;
			//if(!$plugins[$i]['Is_Active']) continue;
			
			if($mode == System::CNT){
				if(System::GetCMD() == 'plugin.deactive'){//on n'inclut pas le plugin en cours de désactivation ou en cours de configuration
					
					if($plugin->Name == $plugins[$i]['Name']){
						 continue; 
					}
				}
			}
			
			self::Get()->setCurrent($plugins[$i]['Folder']);
			
			if(file_exists(self::Get()->path())){
				include_once(self::Get()->path());
			}
		}
	}
/**
 * Plugin.ByName(name) -> Plugin
 * - name (String): Nom de l'extension
 * 
 * Cette méthode récupère une extension à partir de son nom.
 **/
 	public static function ByName($name){
		$plugins = self::GetList();
		
		for($i = 0; $i < $plugins['length'] && $plugins[$i]['Name'] != $name; $i++){
			continue;
		}
		
		if($i < $plugins['length']){
			return new Plugin($plugins[$i]);
		}
		
		return false;
	}
/*
 * Plugin.ByFolder(foldername) -> Plugin
 * - foldername (String): Nom deu dossier de l'extension
 * 
 * Cette méthode récupère une extension à partir de son nom de dossier.
 **/
	public static function ByFolder($folder){
		return new Plugin(array(self::FOLDER_KEY => $folder));
	}
/**
 * Plugin.Uri() -> String
 * 
 * Cette méthode retourne l'adresse URI du dossier de l'extension.
 **/	
	static public function Uri(){
		return self::$Manager->pathURI();
	}
/**
 * Plugin.Path() -> String
 * 
 * Cette méthode retourne l'adresse absolue du dossier de l'extension.
 **/
	static public function Path(){
		return str_replace(basename(self::$Manager->path()), '', self::$Manager->path());
	}
/**
 * Plugin#folder() -> String
 * 
 * Cette méthode retourne le chemin du répertoire de l'extension.
 **/
	public function folder(){
		$folder = ABS_PATH.PATH_PLUGIN.$this->Folder;
		$folder = str_replace($this->BaseName(), '', $folder);
		return $folder;
	}
/**
 * Plugin#baseName() -> String
 * 
 * Cette méthode retourne le nom de répertoire de l'extension.
 **/	
	public function BaseName(){
		return basename($this->Folder);
	}
/**
 * Plugin#enable() -> Boolean
 * 
 * Cette méthode active l'extension.
 **/	
	public function enable(){

		$activeList = System::Meta('ACTIVE_PLUGINS');
		
		if(!in_array($this->Folder, $activeList)){

            self::$Manager->setCurrent($this->Folder);
			//on stop l'observation de l'événement plugin.active
			System::StopObserving('plugin.active');
			//inclusion du plugin à activer
			include(self::$Manager->path());
			
			ob_start();
			//on exécute l'événement plugin.active
			System::Fire('plugin.active');
						
			$this->Active = 1;
			
			array_push($activeList, $this->Folder);
			
			$str = ob_get_clean();
			
			System::Meta('ACTIVE_PLUGINS', $activeList);
			
			return  trim($str) == '' ? false : $str;
		}
		
		return false;
	}
/**
 * Plugin#disable([erase]) -> Boolean
 * 
 * Cette méthode désactive l'extension.
 **/	
	public function disable($erase = false){

		$activeList = 	System::Meta('ACTIVE_PLUGINS');
		
		if(in_array($this->Folder, $activeList)){

            self::$Manager->setCurrent($this->Folder);
					
			//on stop l'observation de l'événement plugin.deactive
            System::StopObserving('plugin.deactive');
			
			//inclusion du plugin à activer
			include(self::$Manager->path());
			
			ob_start();
			//on exécute l'événement plugin.deactive
			System::Fire('plugin.deactive', array($erase));
			
			$this->Active = 0;
			
			$str = ob_get_clean();
			
			$newList = array();
			
			foreach($activeList as $value){
				if($value != $this->Folder){
					array_push($newList, $value);	
				}
			}
			
			System::Meta('ACTIVE_PLUGINS', $newList);
			
			return  trim($str) == '' ? false : $str;
		}
		
		return false;
	}
/**
 * Plugin#remove([erase]) -> Boolean
 * 
 * Cette méthode supprime le répertoire de l'extension.
 **/	
	public function remove(){

		if($this->Folder == ''){
			$this->Folder = Plugin::ByName($this->Name);
			
			if($this->Folder){
				$this->Folder = $this->Folder->Folder;	
			}else{
				return false;
			}
		}
		
		$path = System::Path('plugins').dirname($this->Folder);
		//var_dump($path);	
		if($path != System::Path('plugins') && $path.'/' != System::Path('plugins')){
			if(file_exists($path)){
				$this->disable(true);
				return @Stream::Delete($path);
			}
		}
		
		
		return false;
	}
/**
 * Plugin.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){

		switch($op){
							
			case 'plugin.active':

				$plugin = new Plugin($_POST['Plugin']);
								
				if($str = $plugin->enable()){
					return $str;
				}			
				
				echo "plugin.active.ok";
				break;
							
			case 'plugin.deactive':
				$plugin = new Plugin($_POST['Plugin']);
								
				if($str = $plugin->disable($_POST['Erase'])){
					return $str;
				}			
				
				echo "plugin.deactive.ok";
				break;
			
			case 'plugin.remove':
				
				$plugin = new Plugin($_POST['Plugin']);
								
				if(!$plugin->remove()){
					return $op.'.err';
				}
				
				echo $op.".ok";
				break;
											
			case 'plugin.update.find':
				echo 'plugin.update.find.ko';
				break;
				
			//Importation du plugin depuis l'ordinateur----------------------------------------------------------
			case 'plugin.import':
				
				System::HasRight(1);
				FrameWorker::Start();
				
				$folder = System::Path('plugin').'tmp/';
				
				@Stream::MkDir($folder, 0711);
				FrameWorker::Draw('stream upload -o="'.$folder.'"');
				
				$file = FrameWorker::Upload($folder, 'zip;');
				
				//FrameWorker::Draw('stream depackage -f='.$file.' -o='. $folder);
				
				Stream::Depackage($file, $folder);
				//recherche du nom du plugin
				$myPM = 	new PluginManager($folder, ABS_PATH);
				$plugin = 	$myPM->current();
				
				$newname = 	str_replace(' ', '', strtolower($plugin['Name']));
				
				Stream::Copy($folder, str_replace('tmp/', $newname, $folder));
				@Stream::Delete(str_replace('tmp/', $newname, $file));
				//fin du chargement
				FrameWorker::Stop();
				
				System::Fire('plugin.configure');
				
				break;
				
			case 'plugin.configure':
				
				if(!empty($_POST['redir_cmd'])){//redirection de la commande
					$_POST['cmd'] = $_POST['redir_cmd'];
					
					System::Error(System::fire('gateway.exec', array(System::GetCMD())));
					
				}
				
				break;
								
			case 'plugin.list':	
				
				if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
					return 'plugin.list.err';
				}
				
				echo json_encode($tab);
				break;
			case 'plugin.reload':
				echo json_encode(self::$Manager->toObject());
		}
	}
/**
 * Plugin.Configure() -> void
 *
 * Cette méthode configure la liste des extensions.
 **/	
	public static function Configure(){
		$options = System::Meta('ACTIVE_PLUGINS');
		
		if(empty($options)){
					
			$request = new Request();
			$request->select = 	"Folder";
			$request->from = 	self::TABLE_NAME;
			$request->where = 	'Active = 1';
			
			$list = $request->exec('select');
			$array  = array();
			
			if($list){
				for($i = 0; $i < $list['length']; $i++){
					array_push($array, $list[$i]['Folder']);
				}
			}
			
			System::Meta('ACTIVE_PLUGINS', $array);
			
			//suppression de la table
			$request->query = 'DROP TABLE ' .self::TABLE_NAME;
			$request->exec('query');
		}
	}
/**
 * Plugin.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/
	public static function GetList($clauses = '', $options = ''){
		
		self::Configure();
		
		if(!empty($options->clear)){
			if(method_exists('PluginManager', 'clearFileData')){
				self::Get()->clearFileData();
			}
		}
		
		$activeList = System::Meta('ACTIVE_PLUGINS');
		self::Get()->reset();
				
		//array contiendra les Plugin_ID des plugins en BDD et on fera la différence 
		$array = array();
		$array['length'] = 0;
		
		if(!self::Get()->current()){
			return $array;
		}
		
		do{
			$plugin = self::Get()->current();
			if(!$plugin || empty($plugin['PluginURI'])) continue;
			 						
			//création de la nouvelle version du plugin
			$plugin['Folder'] =		self::Get()->key();		
			$plugin['Active'] =		in_array(self::Get()->key(), $activeList);
			
			$folder = 	explode('/', @$plugin['Folder']);
			$folder = 	$folder[0];
			$file = 	System::Path('plugin').$folder.'/icon.png';
			
			if(file_exists($file)){
				$plugin['Icon'] = str_replace(System::Path('self'), URI_PATH, $file);
			}else{
				$plugin['Icon'] = 'fifteenpieces';	
			}
			
			if(User::IsConnect()){
				$plugin['GroupAccess'] = self::HaveAccess($plugin['Name']);
			}
			
			if(!empty($options->op) && $options->op == '-enable'){
				if($plugin['Active']){
					array_push($array, $plugin);	
				}
			}else{
				array_push($array, $plugin);	
			}
			
			
			$array['length']++;
			
		}while(@self::Get()->next());
		
		return $array;
	}
/**
 * Plugin.HaveAccess(appName) -> Boolean
 * - appName (String): Nom de l'application.
 * 
 * Cette méthode indique si l'application est accessible pour l'utilisateur connecté.
 **/	
	public static function HaveAccess($appName){
		
		if(User::IsConnect()){
			$role = self::$Role = empty(self::$Role) ? User::Get()->getRole() : self::$Role;
			$access = $role->getMeta('AppsAccess');
			
			if($role->Role_ID != 1){
				return isset($access->{$appName}) ? $access->{$appName} : true;
			}			
		}
		
		return true;
	}
}