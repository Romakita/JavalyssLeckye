<?php
/** section: Core
 * class Market
 * includes Plugin
 * Cette classe gère les interactions avec Javalyss Market.
 **/
abstract class Market extends Plugin{
	const NAME = 		'Javalyss Market';
	const VERSION = 	1.3;
	const API_VERSION = '2.0';
/**
 *
 **/
	public static function Initialize(){
		//
		//
		//
		System::Observe('gateway.exec', array('Market', 'exec'));
		System::AddCss(System::Path('plugins', false).'javalyssmarket/css/market.css');
		//
		//
		//
		System::EnqueueScript('javalyss.market', System::Path('plugins', false).'javalyssmarket/js/market.js');
		System::EnqueueScript('javalyss.market.update', System::Path('plugins', false).'javalyssmarket/js/market_update.js');
		System::EnqueueScript('javalyss.market.app', System::Path('plugins', false).'javalyssmarket/js/market_app.js');	
		
	}
/**
 *
 **/	
	public static function Post($cmd, $param = ''){
		$ch = curl_init();		
		
		if(is_array($param)){ 
			$str = '';
			$start = false;
			
			foreach($param as $key=>$value){
				
				if(!$start) $start = true;
				else $str .= '&';
				
				if(is_array($value) || is_object($value)){
					$str .= $key.'='.serialize($value);
				}else{
					$str .= $key.'='.$value;
				}	
			}
			$param = $str;
		}
		
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_URL, $link = self::GetLink($cmd));
							
		if(!empty($param)){
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
		}
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		
		$output = curl_exec($ch);
		
		curl_close($ch);
		
		return $output;
	}
/**
 * Market.exec(command) -> Number
 * - command (String): Commande à exécuter.
 *
 * Cette méthode `static` exécute une commande envoyée par l'interface du logiciel.
 **/
	static function exec($op){
		
		switch($op){
			case 'market.plugin.get':
				global $PM;
				echo json_encode($PM->toObject());
				break;
			//liste des mises à jour
			case 'market.update.list':
				//
				// MAJ du market si besoin
				//
				self::Update();
				//
				// Liste des MAJ
				//
				echo self::AppUpdateList();
				
				break;	
			
			//procédure de récupération de l'archive
			case 'market.app.get':			
				echo json_encode(self::AppGet($_POST['App']));
				break;
				
			case 'market.app.install': 
				echo json_encode(self::AppInstall($_POST['App']));				
				break;
			
			case 'market.app.configure':	
				echo json_encode(self::AppConfigure($_POST['App']));
				break;
						
			case 'market.category.list':
				echo Stream::Post(self::GetLink('categories'));
				break;
				
			case 'market.app.list':
				echo self::AppList();
				break;
			
			case 'market.release.list':
				echo self::ReleaseList($_POST['Name']);
				break;
				
			case 'market.app.local.list':
				echo json_encode(self::AppLocalList($_POST['options']));
				break;
			
		}
	}
	
	public static function GetLink($cmd = ''){
		if(!empty($cmd)){
			$cmd = explode('/', $cmd);
			foreach($cmd as $key =>$value){
				$cmd[$key] = rawurlencode($value);
			}
			$cmd = implode('/', $cmd);
		}
		return trim(str_replace(array('ajax/', 'ajax', 'gateway.safe.php'), '', LINK_MARKET) .'rest/appsme/' . self::API_VERSION .'/' . $cmd);
	}
	
	public static function ModeBeta(){
		$beta = System::Meta('USE_BETA');
		return empty($beta);	
	}
/**
 * Market.AppUpdateList() -> String
 *
 * Cette méthode liste les applications pouvant être mise à jour.
 **/	
	public static function AppUpdateList(){
		$options = new stdClass();
		$options->op = '-enable';
		
		$args = array(
			'Beta' =>		self::ModeBeta(),
			'Apps' => 		Plugin::GetList('', $options)
		);
		
		return self::Post('apps/update/'. CORE_BASENAME . '/' . CODE_VERSION.CODE_SUBVERSION, $args);
	}
/**
 * Market.Update() -> void
 *
 * Cette méthode récupère la MAJ du Market.
 **/	
	public static function Update(){
		
		$app = self::AppGetInfo(self::NAME);	
			
		if((float) $app->Version >= (float) self::VERSION){
			$app->Version = substr($app->Version .'.0', 0, 3);
			
			self::AppGet($app);
			self::AppInstall($app);
		}
	}
/**
 * Market.AppList() -> String
 *
 * Cette méthode liste les applications du catalogue.
 **/	
	public static function AppList(){
		
		return self::Post('apps', array(
			'Name' => 		CORE_BASENAME,
			'Version' => 	CODE_VERSION.CODE_SUBVERSION,
			'Type' =>		'plugin',
			'Category' => 	empty($_POST['Category']) ? 'All' : $_POST['Category'],
			'Needle' => 	empty($_POST['word']) ? '' : $_POST['word'],
			'Order' => 		empty($_POST['Order']) ? '' : $_POST['Order'],
			'FieldOrder' => empty($_POST['FieldOrder']) ? '' : $_POST['FieldOrder'],
			'ItemPerPage' => 0
		));	
	}
/**
 * Market.AppGetInfo(app) -> Object
 * - app (String): Nom de l'Application.
 *
 * Cette méthode récupère les informations d'une application à partir de son nom.
 **/	
	public static function AppGetInfo($app){		
		return json_decode(self::Post('apps/'. $app));
	}
/**
 * Market.AppGet(app) -> Object
 * - app (Object): Application.
 *
 * Cette méthode récupère l'archive d'une application depuis le serveur d'application.
 **/	
	public static function AppGet($app){
		set_time_limit(0);
		ignore_user_abort(true);
		//
		//création du nom de l'archive
		//
		$tmp2 = Stream::Sanitize($app->Name).'.'.$app->Version.'.zip';
		
		@Stream::MkDir(System::Path('private'), 0700);
		
		if(file_exists(System::Path('private').$tmp2)){
			
			$f = new File(System::Path('private').$tmp2);
			
			if($f->size == 0){
				@Stream::Delete((string) $f);	
			}			
		}
		
		$link = self::GetLink('releases/download/'. $app->Name . '/' . $app->Version);
		$args = array(
			'Beta' =>		self::ModeBeta(),
			'Api_Key' =>	System::Meta('API_KEY')
		);
		
		$file = Stream::Download($link, $args, System::Path('private'));
		
		Stream::Rename($file, System::Path('private').$tmp2);
				
		return $app;
	}
/**
 * Market.ReleaseList() -> String
 *
 * Cette méthode liste les releases disponibles pour une application.
 **/	
	public static function ReleaseList($app){
				
		return Stream::Post('releases/download/'. $app, array(
			'Needle' => 	empty($_POST['word']) ? '' : $_POST['word'],
			'Order' => 		empty($_POST['Order']) ? '' : $_POST['Order'],
			'FieldOrder' => empty($_POST['FieldOrder']) ? '' : $_POST['FieldOrder'],
			'ItemPerPage' => 0
		));	
	}
/**
 * Market.AppInstall(app) -> Object
 * - app (Object): Application.
 *
 * Cette méthode installe une application.
 **/
	public static function AppInstall($app){
		
		$tmp2 = Stream::Sanitize($app->Name).'.'.$app->Version.'.zip';
	
		if(file_exists(System::Path('private').$tmp2)){
					
			$file = System::Path('private').$tmp2;
			
			switch($app->Type){
				
				default://le type de l'archive n'est pas pris en charge par Javalyss. Il se peut que les extensions
					//puissent traiter le paquet.
					System::Fire('system.app.install', $app, $file);
					break;
					
				case '0':
				case 'app':
					//depackage du zip depuis la racine
					Stream::Depackage($file, ABS_PATH);
					@Stream::Delete($file);
					break;
					
				case '1':
				case 'plugin':
					
				
					//mise à jour de l'extension
					//depackage du zip depuis la racine de l'extension
					$plugin = Plugin::ByName($app->Name);							
					
					if($plugin){//mise à jour
						if(System::Path('plugins') == $plugin->Folder()){
							echo $op.'.err';
							break;
						}
						
						$folder = System::Path('plugins').str_replace(array(System::Path('plugins'), ABS_PATH), '', $plugin->folder());
					}else{//installation d'une nouvelle extension
						//création du dossier
						$folder = System::Path('plugins') . strtolower(Stream::Sanitize($app->Name,'')).'/';
						@Stream::MkDir($folder);
					}
					
					//echo $plugin->Folder();
					Stream::Depackage($file, $folder);
					
					break;
				
				case 'theme':
					
					break;
			}
		}else{
			return $op.".err";
		}
		
		return $app;	
	}
/**
 * Market.AppConfigure(app) -> Object
 * - app (Object): Application.
 *
 * Cette méthode lance la procédure de configuration d'une application.
 **/	
	public static function AppConfigure($app){
		
		switch($app->Type){
			default:break;
			
			case '0':
			case 'app'://on donne la main au System pour la mise à jour.
				System::Update();
				break;
				
			case '1':
			case 'plugin'://on donne la main à l'extension.
				$plugin = Plugin::ByName($app->Name);
				Plugin::Get()->setCurrent($plugin->Folder);
				//on stop l'observation de l'événement plugin.active
				Plugin::Get()->stopObserving('plugin.configure');
				//inclusion du plugin à activer
				include(Plugin::Get()->path());
				//on exécute l'événement plugin.active
				System::fire('plugin.configure');
				break;							
		}
		
		return $app;
	}
/**
 * Market.AppLocalList(app) -> Object
 * - app (Object): Application.
 *
 * Cette méthode liste les applications dans le dossier local.
 **/
	public static function AppLocalList($postOptions){
		$options = new stdClass();
		$options->order = 'Name';
				
		if(!$tab = Plugin::GetList($options, $postOptions)){
			return $op.'.err';
		}
		//construction de la list
		$list = array();
		
		for($i = 0; $i < $tab['length']; $i++){
			array_push($list, $tab[$i]['Name']);
		}
		
		$apps = json_decode(self::Post('apps', array(
			'NameList' => 	$list
		)));
							
		for($i = 0, $len = count($apps); $i < $tab['length']; $i++){
			
			$current = $tab[$i];
			$current['Local'] = 			true;
			$current['Note'] = 				0;
			$current['Nb_Note'] = 			0;
			$current['Category'] = 			'';
			$current['Nb_Downloads'] = 		0;
			$current['Date_Publication'] = 	date('Y-m-d H:i:s');
				
			for($y = 0; $y < $len; $y++){//restitution des infos
				
				$app = $apps[$y];
				
				if($app->Name == $current['Name']){
					
					$current['Local'] = 			false;
					
					if($current['Active']){
						$current['Update'] = 			$app->Version > $current['Version'];
						$current['Version_MAJ'] =		$app->Version;
					}
					
					$current['Icon'] = 				$app->Icon;
					$current['Description'] = 		$app->Description;
					$current['Note'] = 				$app->Note;
					$current['Nb_Note'] = 			$app->Nb_Note;
					$current['Category'] = 			$app->Category;
					$current['Nb_Downloads'] = 		$app->Nb_Downloads;
					$current['Date_Publication'] = 	$app->Date_Publication;
					
					
					if(!empty($app->Weight)){
						$current['Weight'] = 			$app->Weight;
						$current['Date_Update'] = 		$app->Date_Update;
					}
					
					break;	
				}
			}
			
			$tab[$i] = $current;		
		}
		
		return $tab;
	}
/**
 * Market.RequireApp(name) -> Object
 * - name (String): Nom de l'application requise.
 *
 * Cette méthode permet à une extension d'importer une autre requise pour son fonctionnement. Si l'extension n'existe pas sur le serveur, la méthode tentera de la récupérer depuis le market.
 * Si l'extension n'est pas activée, cette dernière sera activée.
 **/	
	public static function RequireApp($name, $version = ''){
		
		$tab = Plugin::GetList();
		
		for($i = 0; $i < $tab['length']; $i++){
			if($tab[$i]['Name'] == $name){
				
				if($version != ''){// MAJ possible
					if($tab[$i]['Version'] < $version){
						$app = new stdClass();
						
						$app->Name = 	$name;
						$app->Version = $version;
						
						self::AppGet($app);
						self::AppInstall($app);
						
						$app->Folder = 'plugins/'. strtolower(Stream::Sanitize($app->Name,''));
						
						$plugin = new Plugin($app);
						$plugin->enable();
						return;
					}
				}
								
				if($tab[$i]['Active']){//'extension est active
					return;
				}
				
				// on active l'extension
				$plugin = new Plugin($tab[$i]);
				$plugin->enable();
				
				return;
			}
		}
		
		//l'extension n'existe pas sur le serveur;
		
		$app = self::AppGetInfo($name);	
		self::AppGet($app);
		self::AppInstall($app);
		
		$app->Folder = 'plugins/'. strtolower(Stream::Sanitize($app->Name,''));
	
		$plugin = new Plugin($app);
		$plugin->enable();
		
	}
}

Market::Initialize();

?>