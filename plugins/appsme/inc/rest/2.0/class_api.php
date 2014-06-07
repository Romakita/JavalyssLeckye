<?php
/** section: AppsMe
 * class AppsMeRestAPI
 **/
class AppsMeRestAPI extends AppsMe{
	
	const ARC_VERSION =		'2.0';
/**
 * AppsMeRestAPI.Initialize() -> void
 **/	
	public static function Initialize(){
		
		$link = 		new Permalink();
		$parameters = 	$link->getParameters();
		//http://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps
		
		if($link->match('/\/categories/')){
			$o = self::createOptions();
			echo self::GetCategories($o->clauses, $o->options);
			exit();
		}
		
		if($link->match('/\/apps\//')){
			//
			// Apps Note
			//
			if($link->match('/\/apps\/note\/add\/(.*)/')){
				
				$_POST['Name'] = $parameters[6];
				
				if(!empty($parameters[7])){
					$_POST['Version'] = $parameters[7];
				}
				
				$o = self::createOptions();
													
				echo self::SetAppNote($o->clauses, $o->options);
						
				exit();
			}
			//
			// Mise à jour
			//
			if($link->match('/\/apps\/update\/(.*)\/(.*)/')){
				
				$_POST['Name'] = 	$parameters[5];
				$_POST['Version'] = $parameters[6];
				
				$o = self::createOptions();
													
				echo self::GetAppsUpdate($o->clauses, $o->options);
				exit();
			}
			//
			// Recherche
			//
			if($link->match('/\/apps\/search\/(.*)/')){
							
				$_POST['Needle'] =	$parameters[5];
				
				$o = self::createOptions();
				
				echo self::GetApp($o->clauses, $o->options);
				
				exit();
			}
			//
			// Application
			//
			if($link->match('/\/apps\/(.*)/')){
				
				if(is_numeric($parameters[4])){
					$_POST['Application_ID'] = $parameters[4];
				}else{
					$_POST['Name'] = $parameters[4];
				}
				
				$o = self::createOptions();
				
				echo self::GetApp($o->clauses, $o->options);
						
				exit();
			}
		}
		//
		// Listing des applications
		//
		if($link->match('/appsme\/(.*)\/apps$/')){
			$o = self::createOptions();
			echo self::GetApps($o->clauses, $o->options);
			exit();	
		}
		
		//
		// Groupe Release
		//
				
		if($link->match('/\/releases\/download\/(.*)\/(.*)/')){
			
			if(is_numeric($parameters[5])){
				$_POST['Application_ID'] = $parameters[5];
			}else{
				$_POST['Name'] = $parameters[5];
			}
			
			$_POST['Version'] = $parameters[6];
			
			$o = self::createOptions();
			
			self::DownloadRelease($o->clauses, $o->options);
			
			exit();
		}
		
		if($link->match('/\/releases\/download\/(.*)/')){//Téléchargement
						
			if(is_numeric($parameters[5])){
				$_POST['Release_ID'] = $parameters[5];
			}else{//derniere version de l'application
				$_POST['Name'] = $parameters[5];
			}
			
			$o = self::createOptions();
			
			self::DownloadRelease($o->clauses, $o->options);
			
			exit();
		}
		
		if($link->match('/\/releases\/description\/(.*)\/(.*)/')){//Téléchargement
			
			if(is_numeric($parameters[5])){
				$_POST['Application_ID'] = $parameters[5];
			}else{
				$_POST['Name'] = $parameters[5];
			}
			
			$_POST['Version'] = $parameters[6];
			
			$o = self::createOptions();
			
			echo self::GetReleaseDescription($o->clauses, $o->options);
			
			exit();
		}
		
		if($link->match('/\/releases\/description\/(.*)/')){//Téléchargement
			
			if(is_numeric($parameters[5])){
				$_POST['Release_ID'] = $parameters[5];
			}else{
				$_POST['Name'] = $parameters[5];
			}
						
			$o = self::createOptions();
			
			echo self::GetReleaseDescription($o->clauses, $o->options);
			
			exit();
		}
				
		if($link->match('/\/releases\/last\/(.*)/')){//release précise
		
			if(is_numeric($parameters[5])){
				$_POST['Application_ID'] = $parameters[5];
			}else{
				$_POST['Name'] = $parameters[5];
			}
						
			$o = self::createOptions();
			
			echo self::GetLastRelease($o->clauses, $o->options);
			
			exit();
		}
		
		if($link->match('/\/releases\/(.*)\/(.*)/')){
			
			$_POST['Name'] = 	$parameters[4];		
			$_POST['Version'] = $parameters[5];
			
			$o = self::createOptions();
			
			echo self::GetRelease($o->clauses, $o->options);
			
			exit();
		}
		if($link->match('/\/releases\/(.*)/')){
			
			if(is_numeric($parameters[4])){
				$_POST['Release_ID'] = $parameters[4];
			}
						
			$o = self::createOptions();
			
			echo self::GetRelease($o->clauses, $o->options);
			
			exit();
		}
		
		
		//
		// Informations du dépot
		//
		if($link->match('/\/info\/array/')){
			$depot->rootName = 'Depot';
				
			echo self::Encode(array(
				'Name' => 			self::NAME,
				'Version' => 		self::VERSION,
				'Author' => 		self::AUTHOR,
				'Arc_Name' => 		self::ARC_NAME,
				'Arc_Version' => 	self::ARC_VERSION,
				'Encoding' => 		self::ENC,
				'Extensions' => 	self::EXT
			), $depot);
			
			exit();
		}
		//
		// Informations du dépot
		//
		if($link->match('/\/info/')){
			echo self::PrintTag();			
			exit();
		}
	}
/**
 *
 **/	
	public static function createOptions(){
		
		foreach($_GET as $key => $value){
			if(empty($_POST[$key])){
				$_POST[$key] = $value;
			}
		}
		//
		// Clauses
		//
		$clauses = new stdClass();
		$clauses->where = 	'';
		$clauses->limits = 	'';
		$clauses->order = 	'';
		
		if(!empty($_POST['Page'])){
			$clauses->page = (int) $_POST['Page'];
		}else{
			$clauses->page = 0;	
		}
		
		if(isset($_POST['ItemPerPage'])){
			if($_POST['ItemPerPage'] == 0){//pas de limite
				$clauses->itemPerPage = 0;	
			}else{
				if(in_array((int) $_POST['ItemPerPage'], array(5,10,25, 50))){
					$clauses->itemPerPage = (int) $_POST['ItemPerPage'];
				}else{
					$clauses->itemPerPage = 10;	
				}
			}
		}else{
			$clauses->itemPerPage = 10;	
		}
		
		if($clauses->itemPerPage != 0){
			$clauses->limits = ($clauses->page * $clauses->itemPerPage) .  ', ' .$clauses->itemPerPage;
		}
		
		if(!empty($_POST['FieldOrder'])){
			
			$_POST['FieldOrder'] = strtolower(substr($_POST['FieldOrder'], 0, min(50, strlen($_POST['FieldOrder']))));
			
			if(!empty($_POST['Order']) && in_array(strtolower($_POST['Order']), array('up', 'down'))){
				$_POST['Order'] = str_replace(array('up', 'down'), array('ASC', 'DESC'), strtolower($_POST['Order']));
			}else{
				$_POST['Order'] = 'DESC';	
			}
						
			if(in_array($_POST['FieldOrder'], array('name', 'date', 'update', 'note', 'version', 'popularity'))){
				$clauses->order = $_POST['FieldOrder']. ' '.$_POST['Order'];
			}
		}
		
		if(!empty($_POST['Needle'])){
			$clauses->where = substr($_POST['Needle'], 0, min(100, strlen($_POST['Needle'])));
		}
		//
		// Récupération des variables
		//
		$options = new stdClass();
		
		if(!empty($_POST['Beta'])){
			$options->Beta = 	$_POST['Beta'] == 1 ? 1 : 0;
		}
		
		if(!empty($_POST['Category'])){
			$options->Category = 		ObjectTools::RawURLDecode($_POST['Category']);
		}
		
		if(!empty($_POST['Type'])){
			$options->Type = 			ObjectTools::RawURLDecode($_POST['Type']);
		}
		
		if(!empty($_POST['Name'])){
			$options->Name = 			ObjectTools::RawURLDecode($_POST['Name']);
		}
		
		if(!empty($_POST['NameList'])){
			$options->Name = 			ObjectTools::Unserialize($_POST['NameList']);
		}
		
		if(!empty($_POST['Application_ID'])){
			$options->Application_ID = 	(int) ObjectTools::RawURLDecode($_POST['Application_ID']);
		}
		
		if(!empty($_POST['Release_ID'])){
			$options->Release_ID = 		(int) ObjectTools::RawURLDecode($_POST['Release_ID']);
		}
		
		if(!empty($_POST['Version'])){
			$options->Version = 		ObjectTools::RawURLDecode($_POST['Version']);
		}
		
		if(!empty($_POST['Apps'])){
			$options->Apps =			ObjectTools::IsJSON($_POST['Apps']) ? ObjectTools::DecodeJSON($_POST['Apps']) : ObjectTools::Unserialize($_POST['Apps']);
		}	
		
		if(isset($_POST['Note'])){
			$options->Note = 			(int) ObjectTools::RawURLDecode($_POST['Note']);
		}
		
		if(!empty($_POST['Content'])){
			$options->Content = 		ObjectTools::RawURLDecode($_POST['Content']);
		}
		
		if(!empty($_POST['Author'])){
			$options->Author = 			ObjectTools::RawURLDecode($_POST['Author']);
		}
		
		if(!empty($_POST['Email'])){
			$options->Email = 			ObjectTools::RawURLDecode($_POST['Email']);
		}
		
		if(!empty($_POST['Login'])){
			$options->Login = 			substr(ObjectTools::RawURLDecode($_POST['Login']), 0, 50);
		}
		
		if(!empty($_POST['Password'])){
			$options->Password = 		substr(ObjectTools::RawURLDecode($_POST['Password']), 0, 15);
		}
		
		if(!empty($_POST['FirstName'])){
			$options->FirstName = 		ObjectTools::RawURLDecode($_POST['FirstName']);
		}	
		
		$o = new stdClass();
		$o->clauses = $clauses;
		$o->options = $options;
		
		return $o;
	}
/**
 * AppsMeRestAPI.exec(op) -> Mixed
 **/	
	public static function exec($op){
		
		$o = self::createOptions();
		
		$clauses = $o->clauses;
		$options = $o->options;
		//
		// Traitement
		//
		switch(strtolower($op)){
			case 'depot.test':
				include('test_unit.php');
				exit();
							
			case 'depot.info'://retourne la version du dépot
				echo self::PrintTag();
				break;
			
			//retourne la version du dépot sous forme de tableau
			case 'depot.info.array':
				$depot->rootName = 'Depot';
				
				echo self::Encode(array(
					'Name' => 			self::NAME,
					'Version' => 		self::VERSION,
					'Author' => 		self::AUTHOR,
					'Arc_Name' => 		self::ARC_NAME,
					'Arc_Version' => 	self::ARC_VERSION,
					'Encoding' => 		self::ENC,
					'Extensions' => 	self::EXT
				), $depot);
				
				break;
				
			//retourne la liste des catégories du dépot
			case 'depot.category.list':
				
				echo self::GetCategories($clauses, $options);
				
				break;
			
			//retourne la liste des apllications du catalogue.	
			case 'depot.app.list':
				
				echo self::GetApps($clauses, $options);
				
				break;
			
			//récupère les données d'une application	
			case 'depot.app.info':
								
				echo self::GetApp($clauses, $options);
				
				break;
			
			//retourne la liste des mises à jour
			case 'depot.update.list':
				
				echo self::GetAppsUpdate($clauses, $options);
				
				break;
			
			//
			// Gestion des releases
			//
			case 'depot.release.list'://récupère la liste des releases d'une application
				
				echo self::GetReleases($clauses, $options);
				
				break;
				
			case 'depot.release.last'://récupère les données de la release la plus récente
				
				echo self::GetLastRelease($clauses, $options);
							
				break;
				
			case 'depot.release.description'://récupère la description d'une release
				
				echo self::GetReleaseDescription($clauses, $options);
				
				break;
				
			case 'depot.release.info'://récupère les données d'une release d'une application donnée
				
				echo self::GetRelease($clauses, $options);
				
				break;
				
			case 'depot.release.get'://envoie les données de l'archive
				
				self::DownloadRelease($clauses, $options);
				
				exit();
			//
			// Gestion des commentaires
			//
			case 'depot.app.note.add':
				
				echo self::SetAppNote($clauses, $options);
				
				break;
			//
			// Authentification du compte
			//
			case 'depot.account.test':
				
				echo self::AccountTest($clauses, $options);
				
				break;
			
			case 'depot.account.create':
				
				echo self::AccountCreate($clauses, $options);
				
				break;
				
			case 'depot.account.login.exists':
			
				echo self::AccountLoginExists($clauses, $options);
				
				break;
			
			case 'depot.account.email.exists':
			
				echo self::AccountEmailExists($clauses, $options);
				
				break;				
		}	
	}
/**
 * AppsMeRestAPI.GetCategories() -> Mixed
 *
 * Cette commande retourne la liste des catégories des extensions.
 **/
	public static function GetCategories($clauses, $options){
		
		if(!empty($clauses->order)){
			if(in_array($_POST['FieldOrder'], array('title'))){
				$clauses->order = str_replace(array('title'), array('Title'), Sql::EscapeString($clauses->order));
			}else{
				$clauses->order = '';
			}
		}else{
			$clauses->order = '';
		}
		
		$list = AppCategory::GetList($clauses, $options);
		
		if(!$list){
			self::eDie('api.error');	
		}
		
		$options->rootName = 'Categories';
		$options->itemName = 'Category {id}';
		
		unset($list['maxLength']);
		
		return self::Encode($list, $options);	
		
	}
/**
 * AppsMeRestAPI.GetApps() -> Mixed
 *
 * Cette commande retourne la liste des applications du dépôt.
 **/	
	public static function GetApps($clauses, $options){
		$options->op = '-publish';
				
		if(!empty($clauses->order)){
			if(in_array($_POST['FieldOrder'], array('date', 'note', 'version', 'popularity'))){
				$clauses->order = str_replace(array('date', 'note', 'version', 'popularity'), array('Date_Publication', 'Note', 'Version', 'Nb_Downloads'), Sql::EscapeString($clauses->order));
			}else{
				$clauses->order = '';
			}
		}else{
			$clauses->order = '';
		}
		
		$list = App::GetList($clauses, $options);
		
		$options->rootName = 'Apps';
		$options->itemName = 'App {id}';
		
		unset($list['maxLength']);
		
		if(!$list){
			self::eDie('api.error');	
		}
		
		return self::Encode($list, $options);	
	}
/**
 * AppsMeRestAPI.GetApp() -> Mixed
 *
 * Cette commande retourne un objet contenant les informations d’une application..
 **/
 	public static function GetApp($clauses, $options){
		
		if(!empty($options->Application_ID)){
					
			$app = new App($options->Application_ID);
			
			if(empty($app->Application_ID)){
				self::eDie('application.notfound');	
			}
			
		}else{
			
			if(empty($options->Name) && empty($options->NameList)){
				self::eDie('name.empty');	
			}
			
			if(!is_array($options->Name)){
				$app = App::GetByName($options->Name);
			}else{
				$options->op = '-publish';
				$app = App::GetList($clauses, $options);
				unset($app['maxLength']);
			}
			
			if(!$app){
				self::eDie('application.notfound');	
			}
		}
		
		if(!$app){
			self::eDie('api.error');	
		}
		
		return self::Encode($app);	
	}
/**
 * AppsMeRestAPI.GetAppsUpdate() -> Mixed
 *
 * Cette commande retourne la liste des applications ayant une mise à jour en attente
 **/	
	public static function GetAppsUpdate($clauses, $options){
		
		$options->op = 	'-update';
				
		if(empty($options->Name)){
			self::eDie($op.'.name.version.err');
		}
		
		if(empty($options->Version)){
			self::eDie($op.'.code.version.err');
		}
					
		if(!$tab = App::GetList('', $options)){
			self::eDie('api.error');
		}
										
		$options->rootName = 'Apps';
		$options->itemName = 'App {id}';
		
		unset($tab['maxLength']);
		
		return self::Encode($tab, $options);	
	}
/**
 * AppsMeRestAPI.GetReleases() -> Mixed
 *
 * Cette commande retourne la liste des packages d’une application.
 **/	
	public static function GetReleases($clauses, $options){
		$options->op = '-publish';
				
		if(empty($options->Application_ID) && empty($options->Name)){
			self::eDie('name.empty');
		}
		
		if(!empty($clauses->order)){
			if(in_array($_POST['FieldOrder'], array('date', 'note', 'version'))){
				$clauses->order = str_replace(array('date', 'note', 'version'), array('Date_Publication', 'Note', 'Version'), Sql::EscapeString($clauses->order));
			}else{
				$clauses->order = '';
			}
		}else{
			$clauses->order = '';
		}
		
		$list = Release::GetList($clauses, $options);
		
		if(!$list){
			self::eDie('api.error');	
		}
		
		$options->rootName = 'Releases';
		$options->itemName = 'Release {id}';
		
		unset($list['maxLength']);
		
		return self::Encode($list, $options);	
	}
/**
 * AppsMeRestAPI.GetLastRelease() -> Mixed
 *
 * Cette commande retourne les informations du package le plus récent d’une application sous forme d’objet.
 **/	
	public static function GetLastRelease($clauses, $options){
		$options->op = 	'-last';
				
		if(empty($options->Application_ID) && empty($options->Name)){
			self::eDie('name.empty');
		}
														
		$app = 	Release::GetList('', $options);
		
		if(!$app){
			self::eDie('api.error');	
		}
		
		$options->rootName = 'Release';
		
		return self::Encode($app[0], $options);	
	}
/**
 * AppsMeRestAPI.GetReleaseDescription() -> Mixed
 *
 * Cette commande retourne la description d’un package à partir du nom de l’application et de la version de la release.
 **/	
	public static function GetReleaseDescription($clauses, $options){
		
		$options->op = 	'-description';
				
		if(!empty($options->Release_ID)){
			
			$release = new Release((int) $options->Release_ID);
			
			if($release->Release_ID != 0){
				return $release->Description;	 	
			}else{
				self::eDie('release.notfound');
			}
			
		}else{
		
			if(empty($options->Name)){
				self::eDie('name.empty');
			}
			
			if(empty($options->Version)){
				self::eDie('version.empty');
			}
			
		}
			
		if(!$tab = Release::GetList('', $options)){
			self::eDie('api.error');
		}
		
		if($tab['length'] == 0) {
			self::eDie('release.notfound');
		}
		
		return $tab[0]['Description'];	
	}
/**
 * AppsMeRestAPI.GetRelease() -> Mixed
 *
 * Cette commande retourne un objet contenant les informations d’un package.
 **/	
	public static function GetRelease($clauses, $options){
		$options->op = 			'-description';
		$options->rootName = 	'Release';
		
		if(!empty($options->Release_ID)){
			
			$release = new Release((int) $options->Release_ID);
			
			if($release->Release_ID != 0){
				
				unset($release->Link_Release);
				
				return self::Encode($release, $options);	 	
			}else{
				self::eDie('release.notfound');
			}
			
		}else{
		
			if(empty($options->Name)){
				self::eDie('name.empty');
			}
			
			if(empty($options->Version)){
				self::eDie('version.empty');
			}
			
		}
						
		if(!$tab = Release::GetList('', $options)){
			self::eDie('api.error');
		}
		
		if($tab['length'] == 0) {
			self::eDie('release.notfound');
		}
		
		unset($tab[0]['Link_Release']);
		
		return self::Encode($tab[0], $options);	
	}
/**
 * AppsMeRestAPI.DownloadRelease() -> Mixed
 *
 * Cette commande retourne l’archive de l’application.
 **/	
	public static function DownloadRelease($clauses, $options){
		
		if(empty($options->Release_ID)){
					
			if(empty($options->Application_ID) && empty($options->Name)){
				self::eDie('name.empty');
			}
			
			if(!empty($options->Application_ID)){
				$app = new App($options->Application_ID);
			}else{
				$app = App::ByName($options->Name);
			}
			
			if(empty($options->Version)){			
				if(is_object($app) && $app->Application_ID != 0){
					$options->Version = $app->Version;
				}else{
					self::eDie('app.notfound');
				}
			}
		}
		
		$appsme = System::Meta('AppsMe_Options');
		
		if(!empty($appsme->Enable_API_KEY)){//gestion des clefs API
			if(empty($_POST['Api_Key'])){
				self::eDie('api.key.empty');
			}
			
			if(!self::HaveAPIAccess($_POST['Api_Key'])){
				self::eDie('api.no.access');
			}
		}
						
		$options->Statut = 1;
		
		$release = Release::Get($options);
		
		if(!$release){
			self::eDie('release.notfound');
		}
		
		$release->addDownload();
		
		FrameWorker::Download(str_replace(array(
			'http://javalyss.fr/server/', 
			'http://www.javalyss.fr/server/', 
			'http://server.javalyss.fr/', 
			URI_PATH
		), ABS_PATH, $release->Link_Release));
	}
/**
 * AppsMeRestAPI.SetAppNote() -> Mixed
 *
 * Cette commande permet à un utilisateur d’ajouter une note à une version de l’application.
 **/	
	public static function SetAppNote($clauses, $options){
		
		$comment = new AppComment();
				
		if(empty($options->Application_ID) && empty($options->Name)){
			self::eDie('name.empty');
		}
		
		if(!empty($options->Application_ID)){
			$app = new App($options->Application_ID);
		}else{
			$app = App::ByName($options->Name);
		}
		
		if(!(is_object($app) && $app->Application_ID != 0)){
			self::eDie('application.notfound');
		}
		
		if(empty($options->Release_ID)){
			if(!empty($options->Version)){
				$releaseid = 		Release::ByVersion($app->Application_ID, ObjectTools::RawURLDecode($options->Version));
			}
			
			if(empty($releaseid)){
				$releaseid = 		Release::GetLastVersion($app->Application_ID);
				
				$options->Version = 	$releaseid->Version;
				$options->Release_ID = 	$releaseid->Release_ID;	
				$releaseid =			$releaseid->Release_ID;	
			}
		}
		
		if(empty($options->Release_ID)){
			self::eDie('release.notfound');	
		}
		
		$comment->Release_ID = $options->Release_ID;
					
		if(!empty($options->Note)){
			$comment->Note = 	$options->Note;
		}else{
			self::eDie('note.empty');	
		}
		
		if(!empty($options->Content)){
			$comment->Content = 	$options->Content;
		}else{
			self::eDie('content.empty');	
		}
		
		$appOptions = System::Meta('AppsMe_Options');
		
		if(empty($appOptions->Enable_Anonymous)){
			if(empty($_POST['Passkey'])){
				self::eDie('user.auth.required');	
			}					
		}
		
		if(!empty($_POST['Passkey'])){
			if(User::ConnectByPassKey($_POST['Passkey'])){
				$comment->User_ID = User::Get()->User_ID;
				$comment->Author = 	User::Get()->Login;
				$comment->Email =	User::Get()->EMail;
			}else{
				self::eDie('user.notfound');
			}
		}else{
			if(!empty($options->Author)){
				$comment->Author = 	$options->Author;
			}else{
				self::eDie('author.empty');	
			}
			
			if(!empty($options->Email)){
				$comment->Email = 	ObjectTools::RawURLDecode($options->Email);
			}else{
				self::eDie('email.empty');	
			}
		}
		
		if(!$comment->commit()){
			self::eDie('internal.error');
		}
		
		$comment = 				$comment->toArray();
		$comment['Name'] = 		$options->Name;
		$comment['Version'] = 	$options->Version;
		
		unset($comment['User_ID']);
		unset($comment['Comment_ID']);
		unset($comment['Tracking']);
		unset($comment['Url']);
		unset($comment['IP']);
		unset($comment['User_Agent']);
		unset($comment['Statut']);
						
		return self::Encode($comment);	
	}
/**
 * AppsMeRestAPI.AccountTest() -> Mixed
 *
 * Cette commande retourne une clef d’authentification d’un compte enregistré dans le dépôt.
 **/	
	public static function AccountTest($clauses, $options){
		if(empty($options->Login)){
			self::eDie('login.empty');	
		}
		
		if(empty($options->Password)){
			self::eDie('password.empty');	
		}
		
		$user = User::ByLogin($options->Login);
		
		if(!$user){
			self::eDie('user.notfound');	
		}
		
		if($user->Password != substr(md5(Sql::EscapeString($options->Password)), 0,15)){
			self::eDie('user.notfound');
		}
		
		return self::Encode($user->getPasskey());	
	}
/**
 * AppsMeRestAPI.AccountCreate() -> Mixed
 *
 * Cette commande créée un nouveau compte utilisateur.
 **/	
	public static function AccountCreate($clauses, $options){
		$user = 			new User();
		$user->Role_ID = 	Role::ByName('AppsMe');
				
		if(!empty($options->Login)){
			self::eDie('login.empty');	
		}
		
		if(!empty($options->Password)){
			self::eDie('password.empty');
		}
		
		if(empty($options->Email)){
			self::eDie('email.empty');
		}
		
		if(!empty($options->Name)){
			self::eDie('name.empty');
		}
		
		if(!empty($options->FirstName)){
			self::eDie('firstname.empty');
		}
		
		if(User::ByLogin($options->Login)){
			self::eDie('login.exists');
		}
		
		if(User::ByMail($options->Email)){
			self::eDie('email.exists');
		}
		
		$user->Login = 		$options->Login;
		$user->Password = 	$options->Password;
		$user->EMail = 		substr($options->Email, 0, 130);
		$user->Name = 		substr($options->Name, 0, 100);
		$user->FirstName = 	substr($options->FirstName, 0, 100);
		$user->Is_Active = 	true;
		
		if($user->commit(false)){
			$appOptions = 	System::Meta('AppsMe_Options');
			
			if(@$appOptions->Confirm_Create_Account == 1){
				
				$mail = 		new Mail();
			
				$mail->setType(Mail::HTML);
				
				$mail->From = 	empty($appOptions->Email_Contact) ? "info@javalyss.fr" : $appOptions->Email_Contact;
								
				$mail->addMailTo($this->EMail);
				
				$mail->setSubject("Création de votre compte utilisateur");
										
				$mail->Message = '<html><head><title>Création de votre compte Utilisateur</title></head>
				<body>
					<p>Bonjour '.$user->Name.' '. $user->FirstName.',</p>
					
					<p>Votre compte utilisateur vient d\'être créé sur <a href="'.URI_PATH.'">'.URI_PATH.'</a> et est désormais actif</p>
					<p>Pour rappel, vos informations de connexion sont les suivantes :</p>
					<p>Identifiant : '. $this->EMail . '</p>
					<p>Mot de passe : '. $password . '</p> 
					<p>&nbsp;</p>					
					<p>Cordialement,<br />
					L\'équipe informatique</p>
				</body>
				</html>';

				
				@$mail->send();
			
			}
			
			return self::Encode($user->getPasskey());
		}
		
		self::eDie('internal.error');
	}
/**
 * AppsMeRestAPI.AccountLoginExists() -> Mixed
 *
 * Cette commande indique si l'identifiant est déjà utilisée par un autre compte utilisateur.
 **/
 	public static function AccountLoginExists($clauses, $options){
		
		if(!empty($options->Login)){
			$login = 	substr($options->Login, 0, 50);
			
			if(User::ByLogin($login)){
				return self::Encode('login.exists');
			}
			
			return self::Encode('login.free');	
		}
		
		self::eDie('login.empty');	
					
	}
/**
 * AppsMeRestAPI.AccountEmailExists() -> Mixed
 *
 * Cette commande indique si l’adresse e-mail est déjà utilisée par un autre compte utilisateur.
 **/	
	public static function AccountEmailExists($clauses, $options){
		if(!empty($options->Email)){
			$email = 	substr($options->Email, 0, 130);
			
			if(User::ByLogin($email)){
				return self::Encode('email.exists');
			}
			
			return self::Encode('email.free');			
		}
		
		self::eDie('email.empty');
	}
}

AppsMeRestAPI::Initialize();
?>