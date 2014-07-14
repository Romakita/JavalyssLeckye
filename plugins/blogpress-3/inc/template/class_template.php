<?php
/** section: BlogPress
 * class Template < Multilingual
 *
 * Cette classe gère les paramètres du Template actif. Chaque Template peut désormais avoir un dossier `setting` permettant d'ajouter
 * des fonctions de de paramètrage de se dernier et ainsi ajouter des interfaces dans Javalyss Leckye.
 *
 * Depuis Javalyss 0.6, les fichiers multilingues sont supportés. Chaque Template peut définir un dossier `lang` contenant une liste de fichier
 * XML pour chaque langue.
 * 
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_template.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class BlogPressTemplate extends Multilingual{
	const F_SETTING = 	'settings/';
	const F_LANG = 		'lang/';
	static $stop =		false;
	static $PageInfo =	false;
/**
 * Template.Initialize() -> void
 * Cette méthode est appelée lorsque l'événement `blog:startinterface` est déclenchée. Elle charge les fichiers de langue nécessaire à la traduction du site.
 **/
	static function Initialize(){
		include_once('class_template_list.php');
		
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		
		System::EnqueueScript('blogpress.template', Plugin::Uri().'js/blogpress_template.js');
		
		//
		// Gestion de l'ancien dossier des templates. On le déplace vers le dossier Themes de Javalyss
		//
		
		if(file_exists(BLOGPRESS_PATH . 'themes/')){
			
			$o = new BlogpressTemplateList(BLOGPRESS_PATH . 'themes/', System::Path('self'));
			$list = $o->getList();
			
			foreach($list as $key => $template){
				
				@Stream::Copy(dirname(BLOGPRESS_PATH . 'themes/' . $key), dirname(System::Path('themes') . $key));
				@Stream::Delete(dirname(BLOGPRESS_PATH . 'themes/' . $key));
				
			}
			
			@Stream::Delete(BLOGPRESS_PATH . 'themes/');
			
		}
		
		self::ImportSetting();
		
	}
/**
 * Template.AddScript(script) -> void
 * Cette méthode importe un script JS dans l'administration. Le script importé doit être situé dans le dossier `settings` du template actif.
 **/	
	static function AddScript($script){
		System::EnqueueScript('template'.substr(md5($script), 0, 10), self::Uri().self::F_SETTING.$script);
	}
/**
 * Template.AddCSS(src [, media]) -> void
 * Cette méthode importe un script JS dans l'administration. Le script importé doit être situé dans le dossier `settings` du template actif.
 **/	
	static function AddCSS($src, $media = ''){
		System::AddCSS(self::Uri(), $media);
	}
/**
 * Template.exec(op) -> Mixed
 **/
	public static function exec($op){
		
		switch($op){
			
			case 'blogpress.template.list':
							
				$o = new BlogpressTemplateList(System::Path('themes'), System::Path('self'));
				echo json_encode($o->getList());
				
				break;
			
			case 'blogpress.template.get':
							
				$o = new BlogpressTemplateList(System::Path('themes'), System::Path('self'));
				echo json_encode($o->getCurrent());
				
				break;
				
			/*case 'blogpress.template.import':
				FrameWorker::Start();
				$instance = FrameWorker::GetFileInstance();
				
				$folder = 	self::MkDir();
											
				//récupération du fichier
				$file = 		FrameWorker::Upload($folder, 'zip;');
				$name = 		str_replace(array('.zip', '.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'), '', basename($file));
				
				@Stream::MkDir($folder.$name, 0755);
				@Stream::Depackage($file, $folder.$name);
				FrameWorker::Stop();
				
				break;	*/
		}
		
		return 0;
	}
/**
 * Template.MkDir() -> void
 * Cette méthode créée le repertoire des themes si il n'existe pas.
 **/	
	public static function MkDir($name = ''){
		return System::Path('themes', false);
		/*$path = 			System::Path('themes');
		
		@Stream::MkDir($path, 0711);
		
		if(!empty($name)){
			@Stream::MkDir($path.$name, 0711);
			return $path.$name.'/';
		}
		
		return $path;*/
	}
/**
 * Template.StartInterface() -> void
 * Cette méthode est appelée lorsque l'événement `blog:startinterface` est déclenchée. Elle charge les fichiers de langue nécessaire à la traduction du site.
 **/
	public static function StartInterface(){
		parent::Initialize();
		self::ImportLanguage();	
	}
/**
 * Template.ImportLanguage([folder]) -> void
 * - folder (String): Chemin du dossier de langue à importer.
 *
 * Cette méthode importe l'ensemble des fichiers de langue du Template.
 **/	
	static function ImportLanguage($folder = ''){
		$files = self::GetLanguageFiles($folder);
		foreach($files as $file){
			self::Import($file);	
		}
	}
/*
 * Template.GetLanguageFiles() -> void
 *
 * Cette méthode retourne la liste des fichiers XML du dossier.
 **/	
	static private function GetLanguageFiles($folder = ''){
		
		if(!file_exists($folder)){
			$folder = self::Path().self::F_LANG;
			if(!file_exists(self::Path().self::F_LANG)) return array();
		}
		
		return new StreamList($folder, array('/\.xml/'));
	}
/**
 * Template.Path() -> String
 * Cette méthode retourne le chemin absolue du template activé.
 **/	
	static public function Path(){
		$path = System::Path('themes').BlogPress::Meta('BP_THEME').'/';
		
		if(file_exists($path)){
			return $path;	
		}
		
		return System::Path('themes', true).BlogPress::Meta('BP_THEME', DEFAULT_TEMPLATE_NAME).'/';
	}
/**
 * Template.Uri() -> String
 * Cette méthode retourne l'adresse HTTP du template activé.
 **/	
	static function Uri(){
		self::Path();
		return System::Path('themes', false).BlogPress::Meta('BP_THEME').'/';
	}
/*
 * Template.HaveSetting() -> void
 **/	
	static private function HaveSetting(){
		return file_exists(self::Path().self::F_SETTING.'settings.php');
	}
/**
 * Template.ImportSetting() -> void
 * Cette méthode importe le fichier `settings.php` situé dans le dossier `settings` du template actif.
 **/	
	static function ImportSetting(){
		
		if(self::HaveSetting()){
			include(self::Path().self::F_SETTING.'settings.php');
		}	
	}
/**
 * Template.FileExists(file) -> Boolean
 * Cette méthode vérifie que le fichier demandé existe dans le dossier du template.
 **/	
	static function FileExists($fl){
		return file_exists(self::Path().$fl);
	}
/**
 * Template.Import(file) -> Boolean
 * Cette méthode importe le fichier demandé.
 **/	
	static function Import($fl){
		return include(self::Path().$fl);
	}
/**
 * Template.PageInfo(file) -> Boolean
 * Cette méthode les informations de la page demandée
 **/	
	static function PageInfo($fl = ''){
		
		if(empty($fl)){
			return self::$PageInfo;	
		}
		
		self::$PageInfo = $pageinfo = PageInfo::Get(self::Path().$fl);
		
		if($pageinfo){
			if(!empty($pageinfo->Title)){		
				Blog::Title($pageinfo->Title);
			}
			
			if(!empty($pageinfo->Description)){
				Blog::Description($pageinfo->Description);
			}
			
			if(!empty($pageinfo->Keywords)){
				Blog::Keywords($pageinfo->Keywords);
			}
		}
	}
	
	static function HavePageInfo(){
		$pageinfo = self::PageInfo();
		
		if(!$pageinfo){
			return false;	
		}
		
		return !empty($pageinfo->Title);
	}
	
	static function ImportComponent(){
		if(self::FileExists('inc/inc.php')){
			include_once(self::Path().'inc/inc.php');
		}
	}
/**
 * Template.ImportHomePage() -> void
 * Cette méthode tente d'importer la page d'accueil en fonction de la configuration de BlogPress.
 **/
	static function ImportHomePage(){
		
		self::ImportComponent();
		
		System::Fire('blog:startindex');
		
		if(BlogPress::Meta('BP_HOME_STATIC')){
			new Post((int) BlogPress::Meta('BP_HOME_PAGE'));			
			self::ImportPage();
		}else{
			
			$options = BlogPress::GetOptions();
			$options->Type = 'post';
			$options->Name = '';
			
			Post::GetList($options, $options);
			
			if(Template::FileExists('index.php')){
				Template::Import('index.php');
				return;
			}
			//on a pas de page d'accueil ni d'index donc pas de template possible
			header('Location:' . URI_PATH . 'index_admin.php');
			//self::Import404();
		}
	}
/**
 * Template.ImportBlogPage() -> void
 **/
	static function ImportBlogPage(){
		
		self::ImportComponent();
		
		System::Fire('blog:startblog');
		
		//$options = BlogPress::GetOptions();
		//Post::GetList($options, $options);
				
		if(Template::FileExists('index.php')){
			Template::Import('index.php');
			return;
		}
		
		self::Import404();
	}
/**
 * Template.ImportPage() -> void
 * Cette méthode tente d'importer le template d'une page.
 **/
	static function ImportPage(){
		
		self::ImportComponent();
		
		System::Fire('blog:startpage');
		
		if(Post::Template()){//il y a un Template
			
			if(Template::FileExists(Post::Template())){
				Template::Import(Post::Template());	
				return;
			}
		}
		
		//pas de template on tente de charger la page single.php si elle existe
		if(!Post::IsPage()){
			if(Template::FileExists('single.php')){
				Template::Import('single.php');	
				return;
			}
		}else{
			//pas de page single.php, on tente page.php
			if(Template::FileExists('page.php')){
				Template::Import('page.php');	
				return;
			}
			
		}
		
		if(Template::FileExists('index.php')){
			$post = Post::Get();
			Post::Prev();
			Post::Set($post);
			Template::Import('index.php');	
			return;
		}
		
		//pas de page page.php, on tente la page par défaut
		if(BlogPress::Meta('BP_PAGE') && Template::FileExists(BlogPress::Meta('BP_PAGE'))){
			Template::Import(BlogPress::Meta('BP_PAGE'));	
			return;
		}
		
		//on affiche une erreur de template
		self::ErrorTemplate();
	}
/**
 * Template.ImportRegisterPage() -> void
 **/	
	static function ImportRegisterPage(){
		
		if(BlogPress::RegisterOpen()){
			
			Blog::EnqueueScript('prototype');
			Blog::EnqueueScript('extends', '', 'lang=fr');
			Blog::EnqueueScript('window');
			Blog::EnqueueScript('connexion');
			Blog::EnqueueScript('register');
			
			self::ImportComponent();
			
			System::Fire('blog:startregister');
			
			if(BlogPress::Meta('BP_PAGE_REGISTER')){
				new Post((int) BlogPress::Meta('BP_PAGE_REGISTER'));
				self::ImportPage();
			}else{
				$post = 				new Post();
				
				$post->Type = 		'page';
				$post->Title = 		'Inscription';
				$post->Template = 	'register.php';
				$post->Content = 	Blog::Register(false);
				$post->Post_ID =	-1;
				
				Post::Set($post);
				
				self::ImportPage();
			}
		}else{
			self::Import404();	
		}
	}
/**
 * Template.ImportSearchPage() -> void
 **/	
	static function ImportSearchPage(){
		
		self::ImportComponent();
		
		System::Fire('blog:startsearch');
		
		$options = BlogPress::GetOptions();
		
		Post::GetList($options, $options);
				
		if(Template::FileExists('search.php')){
			$post = 			new Post();
			$post->Post_ID = 	-1;
			$post->Type =		'page';
			$post->Title = 		MUI('Rechercher');
			$post->Name = 		'search';
			
			Post::Current($post);
		
			Template::Import('search.php');
			return;
		}
		
		if(Template::FileExists('index.php')){
			Template::Import('index.php');
			return;
		}
		
		Template::Import404();
	}
/**
 * Template.Import404() -> voi
 **/
	static function Import404(){
		
		self::ImportComponent();
		
		System::Fire('blog:start404');
		
		if(BlogPress::IsStopEvent()){
			return;	
		}
		
		if(Template::FileExists('404.php')){//Document non trouvé
			Template::Import('404.php');
			return;		
		}
		
		echo '<html>
				<head>
					<title>404 - '.Blog::Info('title', false).'</title>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<meta http-equiv="bulletin-text" content="'. Blog::Info('description', false).'">
					<meta name="Description" content="'.Blog::Info('description', false).'">
					<meta name="Keywords" content="'.Blog::Info('keywords', false).'">
					
					<link rel="stylesheet" type="text/css" media="all" href="'.Blog::Info('cssuri', false).'" />
					<style>
						body{
							font-family:\'Segoe UI\', \'Calibri\', Arial;
							font-size:12px;	
						}
						body h1{
							font-size:20px;	
						}
						.wrapper-404{
							padding:10px;
						}
					</style>
				</head>
				<body>
				<div class="body">
					<div class="wrapper-404">
						<h1>Erreur 404 - Not Found</h1>
						<p>La page demand&eacute;e est introuvable</p>
						<p><a href="'.Blog::Info('uri', false).'">Retour à la page d\'accueil <span>>></span></a></p>
					</div>
				</div>
				</body>
			</html>';
	}
/**
 * Template.ErrorTemplate() -> voi
 **/
	static function ErrorTemplate(){
				
		echo '<html>
				<head>
					<title>'.Blog::Info('title', false).'</title>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<meta http-equiv="bulletin-text" content="'. Blog::Info('description', false).'">
					<meta name="Description" content="'.Blog::Info('description', false).'">
					<meta name="Keywords" content="'.Blog::Info('keywords', false).'">
					
					<link rel="stylesheet" type="text/css" media="all" href="'.Blog::Info('cssuri', false).'" />
					<style>
						body{
							font-family:\'Segoe UI\', \'Calibri\', Arial;
							font-size:12px;	
						}
						body h1{
							font-size:20px;	
						}
						.wrapper-404{
							padding:10px;
						}
					</style>
				</head>
				<body>
				<div class="body">
					<div class="wrapper-404">
						<h1>Erreur - Template</h1>
						<p>Le template ne contient pas de page pour afficher son contenu. Veuillez créer un template comportant au moins un modèle nommée <code>index.php</code></p>
						<p><a href="'.Blog::Info('uri', false).'">Retour à la page d\'accueil <span>>></span></a></p>
					</div>
				</div>
				</body>
			</html>';
	}

/**
 * Template.ImportActiveAccount() -> void
 **/	
	static function ImportActiveAccount(){
		
		if(BlogPress::RegisterOpen()){
			
			System::Fire('blog:startvalidateemail');
			
			$user = User::ByMail($_GET['email']);
			
			if($user){
				
				if($user->getMeta('idActive') == substr($_GET['id'], 0, 30)){
					
					$user->Is_Active = 2;
					$user->commit(false);
					$user->connect();
					
					User::Set();
					
					$post = 			new Post();
					$post->Type = 		'page';
					$post->Title = 		MUI('Validation de votre adresse');
					$post->Template = 	'active-account.php';
					$post->Content = 	'<p>' . MUI('Votre compte est désormais validé') .'.</p><p>' . MUI('L\'équipe vous remercie de vous être inscrit sur le site') . ' !<p>';
					$post->Post_ID =	-1;
					
					Post::Set($post);
																				
					self::ImportPage();
					return;
				}
				
			}
			
			self::Import404();	
						
		}else{
			self::Import404();	
		}
	}
/**
 * Template.ImportConnexionPage() -> void
 **/	
	static function ImportConnexionPage(){
				
		System::Fire('blog:startconnexion');
		
		if(BlogPress::Meta('BP_PAGE_CONNEXION')){
			new Post((int) BlogPress::Meta('BP_PAGE_CONNEXION'));
			self::ImportPage();
		}else{
			$post = 				new Post();
			$post->Name =			'admin/connexion';
			$post->Type = 		'page';
			$post->Title = 		MUI('Connexion');
			$post->Template = 	'connexion.php';
			$post->Content = 		Blog::Connexion(false);
			$post->Post_ID =		-1;
			
			Post::Set($post);
			
			self::ImportPage();
		}
	}
/**
 * Template.ImportRetrievePaswordPage() -> void
 **/	
	static function ImportRetrievePaswordPage(){
				
		//System::Fire('blog:startconnexion');
		
		$post = 			new Post();
		$post->Name =		'admin/password-lost';
		$post->Type = 		'page';
		$post->Title = 		'Récupération de votre mot de passe';
		$post->Template = 	'password-lost.php';
		$post->Post_ID =	-1;
		
		Post::Set($post);
		
		self::ImportPage();
		
	}
}

abstract class Template extends BlogPressTemplate{

}

abstract class TemplateSetting extends BlogPressTemplate{

} 

BlogPressTemplate::Initialize();
?>