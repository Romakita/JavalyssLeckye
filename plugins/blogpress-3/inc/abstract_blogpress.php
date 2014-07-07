<?php
/** section: Plugins
 * BlogPress
 * includes iPlugin
 *
 * BlogPress gère l'application, le lancement et l'affichage des pages ainsi que la validation des formulaires.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_blogpress.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class BlogPress implements iPlugin{
	private static $MetaLink = 	'';
	private static $Err =		'';
	private static $stop =		false;
	const REG_EMAIL =			"/([@]([a-z0-9]+)[\-]?([a-z0-9]+)[\.](([a-z]+)[\.]?([a-z]+)))/";
/**
 * BlogPress.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	static public function Initialize(){
		//
		//
		//
		System::EnqueueScript('window.editor');
		System::EnqueueScript('blogpress', Plugin::Uri().'js/blogpress.js');
		System::EnqueueScript('blogpress.setting', Plugin::Uri().'js/blogpress_setting.js');
		System::AddCSS(Plugin::Uri().'css/style.css');
		
		include_once('interface/iform.php');
		include_once('interface/ipage.php');
		include_once('core/class_blog.php');
		include_once('core/class_multilingual.php');	
		include_once('post/class_post.php');
		include_once('menu/class_link.php');
		
		include_once('template/class_template.php');
		include_once('form/class_register.php');
		include_once('form/class_contact.php');
		
		Permalink::$NbPostPerPage = BlogPress::Meta('BP_NB_POST_PER_PAGE');
		
		System::observe('gateway.exec', array('BlogPress', 'exec'));
		//System::observe('gateway.exec', array('BpLink', 'exec'));		
		
		System::observe('plugin.active', array(__CLASS__,'Install'));
		System::observe('plugin.deactive', array(__CLASS__,'Uninstall'));
		System::observe('plugin.configure', array(__CLASS__,'Install'));
		System::observe('blogpress:startinterface', array(__CLASS__,'StartInterface'));
		System::observe('system:index', array(__CLASS__,'SystemIndex'));
		System::observe('system:connexion', array(__CLASS__,'SystemConnexion'));
		System::observe('system:admin', array(__CLASS__,'SystemAdmin'));
		System::observe('system:htaccess.write', array(__CLASS__,'WriteHTACCESS'));
		
		
		System::EnqueueScript('javalyss.professional', Plugin::Uri().'js/javalyss_professional.js');
		
		//self::Install();
	}
/**
 * BlogPress.WriteRobotsTXT() -> void
 *
 * Cette méthode écrit le fichier robots.txt.
 **/
	static public function WriteRobotsTXT(){
		if(file_exists(System::Path('self').'robots.txt')){
			$str = Stream::Read(System::Path('self').'robots.txt');
		}
		
		if(!self::Meta('BP_ENABLE_INDEXED_CONTENT')){
			$str = "User-Agent: *".Stream::CARRIAGE;
			$str .="Disallow: /";
		}
		
		System::Fire('blogpress:robots.write', array(&$str));
		
		Stream::Write(System::Path('self').'robots.txt', $str);
	}
/**
 * BlogPress.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
 	static public function Install(){
        Post::Install();
        BlogPressLink::Install();

		$installed = self::Meta('BP_INSTALLED');
		
		$post = Post::ByName('accueil');
		
		if($post->Post_ID == 0){
			
			$post->Type = 	'page';
			$post->Name = 	'accueil';
			$post->Title = 	'Accueil';
			
			$post->commit(false);
		}
		
		$post = Post::ByName('blog');
		
		if($post->Post_ID == 0 && empty($installed)){
			
			$post->Type = 	'page';
			$post->Name = 	'blog';
			$post->Title = 	'Blog';
			
			$post->commit(false);
		}
		
		$post = Post::ByName('contact');
		
		if($post->Post_ID == 0 && empty($installed)){
			
			$post->Type = 	'page';
			$post->Name = 	'contact';
			$post->Title = 	'Contact';
			
			$post->commit(false);
			
		}
		
		$id = self::Meta('CONTACT_PAGE');
		
		if($id == NULL){
			self::Meta('CONTACT_PAGE', $post->Post_ID);
		}
		
		if(empty($installed)){
			self::Meta('BP_REDIR_INDEX', 1);
		}
		
		self::Meta('BP_INSTALLED', 1);
			
		$empty = self::Meta('BP_USE_POST');
		
		if($empty){
			self::Meta('BP_USE_POST', 1);
			self::Meta('BP_USE_PAGE', 1);
			self::Meta('BP_THEME', 'javalyss');
			self::Meta('BP_TITLE', '');
			self::Meta('BP_SLOGAN', '');
			self::Meta('BP_HOME_STATIC', false);
			self::Meta('BP_HOME_PAGE', '');
			self::Meta('BP_BLOG_PAGE', '');
			self::Meta('BP_NB_POST_PER_PAGE', 5);
			self::Meta('BP_SUMMARY', 1);
			self::Meta('BP_CHARSET', 'utf-8');
			
			self::Meta('BP_REDIR_INDEX', 1);
		}
		
		$value = self::Meta('BP_NB_POST_PER_PAGE');
		if(empty($value)){
			self::Meta('BP_NB_POST_PER_PAGE', 5);
		}
		$value = self::Meta('BP_SUMMARY');
		if(empty($value)){
			self::Meta('BP_NB_POST_PER_PAGE', 1);
		}
		
		$value = self::Meta('BP_CHARSET');
		if(empty($value)){
			self::Meta('BP_CHARSET', 'utf-8');
		}
		
		$value = self::Meta('BP_THEME');
		
		if(empty($value)){
			if(defined('DEFAULT_TEMPLATE_NAME')){
				self::Meta('BP_THEME', DEFAULT_TEMPLATE_NAME);
			}else{
				self::Meta('BP_THEME', 'javalyss');
			}
		}
		
		$options = array(
			array('text' => 'Fabricant/industrie', 'type' =>'group'),
			array('text' => 'Éléments de construction, matériaux', 'category' => 'Fabricant/industrie'),
			array('text' => 'Habillement, mode', 'category' => 'Fabricant/industrie'),
			array('text' => 'Papeterie, papier, imprimerie', 'category' => 'Fabricant/industrie'),
			array('text' => 'Chimie, produits de beauté, pharmacie, pétrole', 'category' => 'Fabricant/industrie'),
			array('text' => 'Appareils électriques, mécanique de précision, optique', 'category' => 'Fabricant/industrie'),
			array('text' => 'Véhicules, accessoires', 'category' => 'Fabricant/industrie'),
			array('text' => 'Produits domestiques, verre, céramique', 'category' => 'Fabricant/industrie'),
			array('text' => 'Construction mécanique, installations', 'category' => 'Fabricant/industrie'),
			array('text' => 'Métallurgie, sidérurgie', 'category' => 'Fabricant/industrie'),
			array('text' => 'Ameublement, décoration intérieure', 'category' => 'Fabricant/industrie'),
			array('text' => 'Aliments, boissons', 'category' => 'Fabricant/industrie'),
			array('text' => 'Bijouterie, horlogerie', 'category' => 'Fabricant/industrie'),
			array('text' => 'Appareils: sport, jeux, musique', 'category' => 'Fabricant/industrie'),
			array('text' => 'Autres fabricants', 'category' => 'Fabricant/industrie'),
			array('text' => 'Construction, Industries extractives, Énergie, Agriculture', 'type' =>'group'),
			array('text' => 'Métiers du bâtiment', 'category' => 'Construction, Industries extractives, Énergie, Agriculture'),
			array('text' => 'Entreprises de construction', 'category' => 'Construction, Industries extractives, Énergie, Agriculture'),
			array('text' => 'Industries extractives, charbon, pétrole', 'category' => 'Construction, Industries extractives, Énergie, Agriculture'),
			array('text' => 'Énergie', 'category' => 'Construction, Industries extractives, Énergie, Agriculture'),
			array('text' => 'Agriculture, industrie forestière', 'category' => 'Construction, Industries extractives, Énergie, Agriculture'),
			array('text' => 'Autres', 'category' => 'Construction, Industries extractives, Énergie, Agriculture'),
			array('text' => 'Commerce de gros, export, import', 'type' => 'group'),
			array('text' => 'Éléments de construction, matériaux', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Habillement, mode', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Bureau, papier, imprimerie, livres', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Chimie, produits de beauté, pharmacie, pétrole', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Appareils électriques, mécanique de précision, optique', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Véhicules, accessoires', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Produits domestiques, verre, céramique', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Machines, installations', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Produits en métal et en fer', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Ameublement, décoration intérieure', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Aliments, boissons', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Bijouterie, horlogerie', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Appareils: sport, jeux, musique', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Autres activités de commerce de gros', 'category' => 'Commerce de gros, export, import'),
			array('text' => 'Commerce de détail', 'type' =>'group'),
			array('text' => 'Matériaux de construction, magasins de bricolage', 'category' => 'Commerce de détail'),
			array('text' => 'Habillement, mode', 'category' => 'Commerce de détail'),
			array('text' => 'Bureau, papier, imprimerie, livres', 'category' => 'Commerce de détail'),
			array('text' => 'Chimie, produits de beauté, pharmacie, pétrole', 'category' => 'Commerce de détail'),
			array('text' => 'Appareils électriques, mécanique de précision, optique', 'category' => 'Commerce de détail'),
			array('text' => 'Véhicules, accessoires', 'category' => 'Commerce de détail'),
			array('text' => 'Produits domestiques (verre, céramique)', 'category' => 'Commerce de détail'),
			array('text' => 'Grands magasins, centres commerciaux', 'category' => 'Commerce de détail'),
			array('text' => 'Produits en métal, quincaillerie', 'category' => 'Commerce de détail'),
			array('text' => 'Ameublement, décoration intérieure', 'category' => 'Commerce de détail'),
			array('text' => 'Aliments, boissons', 'category' => 'Commerce de détail'),
			array('text' => 'Bijouterie, horlogerie', 'category' => 'Commerce de détail'),
			array('text' => 'Appareils: sport, jeux, musique', 'category' => 'Commerce de détail'),
			array('text' => 'Vente par correspondance, sur Internet', 'category' => 'Commerce de détail'),
			array('text' => 'Autres activités de commerce de détail', 'category' => 'Commerce de détail'),
			array('text' => 'Services/Organisation', 'type' =>'group'),
			array('text' => 'Promoteurs, immobilier, ingénieurs', 'category' => 'Services/Organisation'),
			array('text' => 'Administrations, services publics', 'category' => 'Services/Organisation'),
			array('text' => 'Écoles, établissements de formation', 'category' => 'Services/Organisation'),
			array('text' => 'Centrales d´achat', 'category' => 'Services/Organisation'),
			array('text' => 'Finances (banques, assurances)', 'category' => 'Services/Organisation'),
			array('text' => 'Loisirs, gastronomie, culture', 'category' => 'Services/Organisation'),
			array('text' => 'Santé', 'category' => 'Services/Organisation'),
			array('text' => 'IT, informatique', 'category' => 'Services/Organisation'),
			array('text' => 'Médias', 'category' => 'Services/Organisation'),
			array('text' => 'Nettoyage, recyclage, déchets', 'category' => 'Services/Organisation'),
			array('text' => 'Institutions religieuses', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: autres', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: architectes', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: médecins', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: conseillers fiscaux', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: avocats', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: notaires', 'category' => 'Services/Organisation'),
			array('text' => 'Indépendants/prof. libérales: dentistes', 'category' => 'Services/Organisation'),
			array('text' => 'Sécurité', 'category' => 'Services/Organisation'),
			array('text' => 'Administrations municipales, communales', 'category' => 'Services/Organisation'),
			array('text' => 'Services techniques', 'category' => 'Services/Organisation'),
			array('text' => 'Transports', 'category' => 'Services/Organisation'),
			array('text' => 'Association, parti, groupement', 'category' => 'Services/Organisation'),
			array('text' => 'Clubs', 'category' => 'Services/Organisation'),
			array('text' => 'Location, médiation', 'category' => 'Services/Organisation'),
			array('text' => 'Publicité, marketing, distribution', 'category' => 'Services/Organisation'),
			array('text' => 'Autres services', 'category' => 'Services/Organisation')
		);
		
		$value = self::Meta('BP_SECTORS');
		if(empty($value)){
			self::Meta('BP_SECTORS', $options);
		}
		
		$options = array(
			array('text' => 'Effectif inconnu'),
			array('text' => '0 salarié'),
			array('text' => '1 à 9 salariés'),
			array('text' => '10 à 19 salariés'),
			array('text' => '20 à 49 salariés'),
			array('text' => '50 à 99 salariés'),
			array('text' => '100 à 499 salariés'),
			array('text' => '500 à 1000 salariés'),
			array('text' => 'plus de 1000 salariés')
		);
		
		$value = self::Meta('BP_WORKFORCE');
		if(empty($value)){
			self::Meta('BP_WORKFORCE', $options);
		}
		
		$options = array(
			array('text' => 'Micro-Entreprise'),
			array('text' => 'EURL'),
			array('text' => 'SARL'),
			array('text' => 'SA'),
			array('text' => 'SCI'),
			array('text' => 'Profession libérale')
		);
		
		$value = self::Meta('BP_LEGAL_STATUTES');
		if(empty($value)){
			self::Meta('BP_LEGAL_STATUTES', $options);
		}
	}
/**
 * BlogPress.Uninstall(eraseData) -> void
 * - eraseData (Boolean): Suppression de données. 
 *
 * Cette méthode désintalle  l'extension et supprime les données liées à l'extension si `eraseData` est vrai.
 **/
 	static public function Uninstall($erase = false){
		
		if($erase){
			$request = new Request(DB_BLOGPRESS);
			
			$request->from(Post::TABLE_NAME)->exec('drop');
			$request->from(PostComment::TABLE_NAME)->exec('drop');
			$request->from(PostCategory::TABLE_NAME)->exec('drop');
			$request->from(BlogPressLink::TABLE_NAME)->exec('drop');
			
		}
		
	}
/**
 * BlogPress.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	static public function exec($op){
		switch($op){
			case 'blogpress.db.configure':
				self::Install();
				echo "Base configurée";
				break;
				
			case 'blogpress.write.robots.txt':
				self::WriteRobotsTXT();
				break;	
		}
	}
/*
 * BlogPress.Observe(eventName, callback) -> void
 **/	
	static public function Observe($eventName, $callback){
		return System::Observe('blog:'.$eventName, $callback);
	}
/*
 * BlogPress.StopObserving(eventName, callback) -> void
 **/	
	static public function StopObserving($eventName, $callback){
		return System::StopObserving('blog:'.$eventName, $callback);
	}
/*
 * BlogPress.Fire(eventName, array) -> void
 **/	
	static public function Fire($eventName, $array = array()){
		return System::Fire('blog:'.$eventName, $array);
	}
/**
 * BlogPress.SetError(error) -> String
 * - error (String): Erreur à stocker.
 *
 * Cette méthode permet de stocker une erreur lors de la validation d'un formulaire. En assignant une erreur les méthodes [[iForm.onFormCommit]] ne seront pas déclenchées.
 * Les erreurs pourront ensuite être affichées dans le formulaire via la méthode [[iForm.onBeforeForm]] et la méthode [[BlogPress.GetError]].
 **/	
	static public function SetError($txt){
		if(empty($txt)){
			return;
		}
		
		self::$Err .= '<li>'.$txt.'</li>';
	}
/**
 * BlogPress.GetError() -> String
 *
 * Cette méthode retourne les erreurs stockées par via la méthode [[BlogPress.SetError]].
 **/	
	static public function GetError(){
		return '<ul class="form-error">'.self::$Err.'</ul>';
	}
/**
 * BlogPress.IsError() -> String
 *
 * Cette méthode indique si une erreur a été stocké via la méthode [[BlogPress.SetError]].
 **/
	static public function IsError(){
		$p = trim(self::$Err);
		return !empty($p);
	}
/** alias of: BlogPress.IsError
 * BlogPress.HasError() -> String
 *
 * Cette méthode indique si une erreur a été stocké via la méthode [[BlogPress.SetError]].
 **/
	static public function HasError(){
		$p = trim(self::$Err);
		return !empty($p);
	}
/*
 * BlogPress.Uri() -> String
 *
 * Lien HTTP du dossier du site Web.
 **/
	static public function Uri(){
		if(!defined('URI_WEB_PATH')){
			return URI_PATH;
		}
		return self::Meta('BP_REDIR_INDEX') != '0' ? URI_PATH : URI_WEB_PATH;
	}
/*
 * BlogPress.RegisterOpen() -> Boolean
 * Cette méthode indique si le formulaire d'inscription est ouvert au public.
 **/
 	static public function RegisterOpen(){
		return (bool) self::Meta('BP_REGISTER');	
	}
/*
 * BlogPress.ContactOpen() -> Boolean
 * Cette méthode indique si le formulaire de contact est ouvert au public.
 **/
 	static public function ContactOpen(){
		return (bool) self::Meta('BP_CONTACT');	
	}
/*
 * BlogPress.SystemAdmin() -> void
 **/
 	static public function SystemAdmin(){
		
		$enable = self::Meta('BP_ADMIN_ENABLE');
		
		if($enable){
			$options = 	self::Meta('BP_ADMIN_OPTIONS');
			
			if(User::IsConnect()){
				
				if(!empty($_GET['redir'])){//demande de redirection
					header('Location:' . rawurldecode($_GET['redir']));
					exit();	
				}
				
				$role = ''.User::Get()->getRole()->Role_ID;
				
				if(!empty($options[$role])){
					$post = Post::Get((int) $options[$role]);
					
					if($post){
						$post->getPermalink();
						header('Location:' . $post->getPermalink());
						System::StopEvent();
						return true;
					}
				}
			}		
		}	
	}
/*
 * BlogPress.SystemIndex() -> void
 **/	
	static public function SystemIndex(){
				
		if(BlogPress::Meta('BP_REDIR_INDEX') != '0'){
						
			//define('URI_WEB_PATH', URI_PATH);
					
			$folder = BLOGPRESS_PATH.'inc/ui/';
			
			//inclusion des composants pour le blog
			$folder = new StreamList($folder);
			do{
				require_once('ui/'.$folder->current());
			}while($folder->next());
			
			System::Fire('blogpress:startinterface');
			
			System::StopEvent();
			return true;
		}else{
			self::SystemConnexion();
		}
	}
/*
 * BlogPress.SystemConnexion() -> void
 **/	
	static public function SystemConnexion(){
		
		if(Template::FileExists('connexion.php')){
			
			//define('BLOGPRESS_URI', str_replace(ABS_PATH, URI_PATH, BLOGPRESS_PATH));
			
			$folder = BLOGPRESS_PATH.'inc/ui/';
			
			//inclusion des composants pour le blog
			$folder = new StreamList($folder);
			do{
				require_once('ui/'.$folder->current());
			}while($folder->next());
			
			Blog::EnqueueScript('prototype');
			Blog::EnqueueScript('extends', '', 'lang=fr');
			Blog::EnqueueScript('window');
			Blog::EnqueueScript('connexion');
			Blog::EnqueueScript('register');
							
			System::Fire('blog:startinterface');
			//
			// On a une commande d'activée
			//
			if(System::GetCMD()){
				System::Fire('blog:form.submit', array(System::GetCMD()));
				
				if(!BlogPress::IsError()){
					System::Fire('blog:form.commit', array(System::GetCMD()));
				}
			}
									
			Template::ImportConnexionPage();
			
			
			System::StopEvent();
			return true;
		}
		
	}
/*
 * BlogPress.StartInterface() -> void
 **/
 	static public function StartInterface(){
		
		self::StartAdmin();
		
		if(self::IsAjax()){
			if(method_exists('System', 'Ajax')) System::Ajax(System::SAFE);
			else self::FireAjax();
			return;
		}
		//start external tools
		Template::StartInterface();
		//
		//
		//
		System::Fire('blog:startinterface');
		//
		// On a une commande d'activée
		//
		if(System::GetCMD()){
			System::Fire('blog:form.submit', array(System::GetCMD()));
			
			if(!BlogPress::IsError()){
				System::Fire('blog:form.commit', array(System::GetCMD()));
			}
		}
				
		if(self::IsIndex()){//Page d'index
			Template::ImportHomePage();
			return;
		}
		
		if(self::IsBlog()){//page listant les articles
			$options = BlogPress::GetOptions();
		
			Post::GetList($options, $options);
			
			Template::ImportBlogPage();
			return;
		}
		
		if(self::IsSearch()){//Recherche de contenu
			Template::ImportSearchPage();
			return;
		}
		
		if(self::IsRegister()){//Page d'enregistrement
			Template::ImportRegisterPage();
			return;
		}
		
		if(self::IsActiveAccount()){//Page de validation de l'adresse e-mail
			Template::ImportActiveAccount();
			return;
		}
		
		self::$stop = false;
		
		System::Fire('blog:start');
		
		if(self::$stop){
			return;	
		}
		//
		// Récupération du post ou des Post en fonction
		//
		$options = 	self::GetOptions();
		$result = 	Post::GetList($options, $options);
		
		if(!$result){
			//echo '<pre><code>' . Sql::Current()->getRequest() . ' '.Sql::Current()->getError() .'</code></pre>';
			Template::Import404();
			exit();
		}
		
		if(Post::Have()){
			
			if(Post::Single()){//création de la page ou de l'article
								
				if(Post::IsPrivate() && !User::IsConnect()){//rediriger vers la page de connexion
					 header('Location:' . URI_PATH . 'index_admin.php?redir=' . rawurlencode(Permalink::Get()));
					 exit();
				}	
				
				Template::ImportPage();
				
				return;
		
			}else{//création du listing des pages
				Template::ImportBlogPage();
			}
			
		}else{
			$options = 	self::GetOptions();
			$options->limits = '0,5';
			
			$result = Post::GetList($options, $options);
			
			if(Post::Have()){//gestion d'une pagination particulière
				if(Post::Single()){//création de la page ou de l'article
					
					if(Post::IsPrivate() && !User::IsConnect()){//rediriger vers la page de connexion
						 header('Location:' . URI_PATH . 'index_admin.php?redir=' . rawurlencode(Permalink::Get()));
						 exit();
					}	
					
					Template::ImportPage();
					
					return;
			
				}
			}
					
			Template::Import404();	
		}
		
	}
/*
 * BlogPress.FireAjax() -> void
 **/
 	final private static function FireAjax(){
		global $__ERR__, $__SQL__;
		
		if(@System::GetCMD() == ''){
			echo "system.unitiliazed.cmd";
			return;
		}
		
		System::DecodeFields();
		//-------------------------------------------------------------------------------------
		//Execution de l'evenement gatway.exec-------------------------------------------------
		//-------------------------------------------------------------------------------------
		System::Error(System::fire('gateway.safe.exec', array(System::GetCMD())));
		//-------------------------------------------------------------------------------------
		//Envoi des erreurs si besoin----------------------------------------------------------
		//-------------------------------------------------------------------------------------
		if("". System::Error() != "0"){
			echo "<h2>Code erreur : " . System::Error() . "</h2>";
			
			//on tente de récupérer la dernière erreur de MySQL.
			if($err = Sql::Current()->getError()){
				echo "<br />Requête SQL : <pre><code>".Sql::Current()->getRequest()."</code></pre><br />MySQL erreur : <pre><code>".Sql::Current()->getError()."</code></pre>";
			}
		}
	}
/*
 * BlogPress.StartAdmin() -> void
 **/	
	static public function StartAdmin(){
		
		if(self::Meta('BP_REDIR_INDEX') == '0'){
			return false;
		}
						
		$page = URI_PATH.'admin/';
		$link = new Permalink();
		
		$enable = self::Meta('BP_ADMIN_ENABLE');
		
		if($enable){
			$options = 	self::Meta('BP_ADMIN_OPTIONS');
			
			if(User::IsConnect()){
				$role = User::Get()->getRole()->Role_ID;
				$post = Post::Get((int) $options[$role]);
				$page = !$post ? $page : $post->getPermalink();
			}		
		}
		
		/*if($link->strEnd('admin')){//page de connexion			
			header('Location:' . $page);
			return true;
		}*/
		
		if($link->strEnd('admin/account')){//page d'administration avec affichage de mon compte
			header('Location:' . $page .'?blogpress=account');
			return true;	
		}
		
		if($link->strEnd('login')){//page de connexion	
			header('Location:' . $page);
			return true;
		}
		
		if($link->strEnd('logout')){
			User::Disconnect();
			header('Location:' . Blog::GetInfo('uri'));
			return false;
		}
				
		return false;
	}
/*
 * BlogPress.IsAjax() -> void
 *
 * Cette méthode indique si la demande de contenu est fait via l'adresse AJAX.
 **/	
	static public function IsAjax(){
		$link = new Permalink();
		return $link->contain('adminajax');
	}
/*
 * BlogPress.IsIndex() -> void
 *
 * Cette méthode si la page en cours est la page d'index.
 **/
	static public function IsIndex(){
		$link = new Permalink();
		return $link->isIndex();
	}
/*
 * BlogPress.IsBlog() -> void
 *
 * Cette méthode si la page en cours est la page du blog.
 **/	
	static public function IsBlog(){
		$link = new Permalink();
		if(!self::Meta('BP_HOME_STATIC')){//page classique
			return $link->contain('blog');
		}
		
		$post = new Post((int) self::Meta('BP_BLOG_PAGE'));
		if($post->Post_ID == 0) return $link->contain('blog');
		
		return str_replace('www.', '', $link) == URI_WEB_PATH . $post->Name;
	}
/*
 * BlogPress.IsSearch() -> void
 *
 * Cette méthode si la page en cours est la page du recherche.
 **/	
	static public function IsSearch(){
		$link = new Permalink();
		return $link->contain('search');
	}
/*
 * BlogPress.IsRegister() -> void
 *
 * Cette méthode si la page en cours est la page d'enregistrement.
 **/	
	static public function IsRegister(){
		$link = new Permalink();
		return $link->strEnd('register');
	}
/*
 * BlogPress.IsActiveAccount() -> void
 *
 * Cette méthode si la page en cours est la page d'activation du compte.
 **/
	static public function IsActiveAccount(){
		$link = new Permalink();
		return $link->strEnd('active-account');
	}
/**
 * BlogPress.StopEvent() -> void
 *
 * Cette méthode stop le processus de chargement d'une page ou d'un post. Cette méthode n'a d'effet que lors de l'utilisation des méthodes [[iPage.onStart]].
 **/	
	static function StopEvent(){
		return self::$stop = true;	
	}
/**
 * BlogPress.IsStopEvent() -> Boolean
 *
 * Cette méthode indique si l'arrêt du processus de chargement d'une page a été demandé.
 **/	
	static function IsStopEvent(){
		return self::$stop;	
	}
/**
 * BlogPress.GetPermalink() -> String
 * 
 * Cette méthode retourne le permalien demandé par le poste client.
 **/	
	static public function GetPermalink($bool = false){
		$permalink = new Permalink();
		return $bool ? $permalink->getParameters() : $permalink;
	}
/**
 * BlogPress.GetParameters() -> Array
 * 
 * Cette méthode retourne les paramètres du permalien demandée par le client.
 **/	
	static public function GetParameters($op = ''){
		
	}
/*
 * BlogPress.GetClauses() -> String | Array
 **/	
	static public function GetClauses(){
			
		return '';	
	}
/**
 * BlogPress.GetOptions() -> String | Array
 *
 * Cette méthode retourne des informations sur la pagination, le type de page et d'autres informations nécessaires à l'affichage d'une page d'un article ou d'une recherche.
 **/
	static function GetOptions($nbpostperpage = 0){
		$permalien = 	Permalink::Get();		
		$parameters =  	Permalink::Parameters();
		
		$page = 		Permalink::GetPage();
		$nb = 			empty($nbpostperpage) ? Permalink::$NbPostPerPage : 1 * $nbpostperpage;
		
		$object = 			new stdClass();
		$object->limits = 	($page * $nb) .','.$nb;	
		$object->Type =		'like page;post';
		
		//$object->op = 	'';
		//$object->value = 	'';
		
		if($permalien->strStart('blog', false)){
			$object->Type = 'like post';
			return $object;	
		}
		
		if($permalien->strStart('search', false)){
			$object->where =	@$_GET['search'];
			
			return $object;	
		}
			
		if($permalien->strStart('keyword', false)){//demande de liste par mot clef
			$object->op = 		'-keyword';
			$object->Keyword = 	str_replace('-', ' ', $parameters[1]);
			
			return $object;
		}
		//
		// Vérification de catégorie
		//
		$category = PostCategory::ByName($parameters[0]);
		
		if($category){//on a une categorie
		
			if(count($parameters) > 1 && @$parameters[1] != 'page'){
				$object->Name = 	$parameters[1];
			}else{	
				$object->Category = 	$category->Name;
			}
			
			return $object;
		}
					
		//$object->op = 		'-permalien';
		$object->Name = 	str_replace('.php', '', Permalink::Metalink());
		$object->Name =		explode('/page', $object->Name);
		$object->Name = 	$object->Name[0];
		
		return $object;
	}
/**
 * BlogPress.SetAccessRole(roleid, postid) -> void
 * - roleid (Number): Numéro d'identifiant du groupe.
 * - postid (Number): Numéro d'identifiant d'une page.
 *
 * Cette méthode permet de changer l'accès d'un groupe lors de la connexion d'un membre du groupe. Si `postid = 0`, l'utilisateur du groupe `roleid` sera redirigé vers le back office Javalyss.
 * Si `postid` est différent de 0 alors l'utilisateur du groupe sera redirigé vers la page défini par postid.
 **/	
	static function SetAccessRole($roleid, $postid = 0){
		self::Meta('BP_ADMIN_ENABLE', true);
		$options = self::Meta('BP_ADMIN_OPTIONS');
		
		if(empty($options)){
			$options = array(
				1 => 0,
				2 => 0,
				3 => 0
			);
		}
		
		$options[$roleid instanceof Role ? $roleid->Role_ID : $roleid] = $postid;
		self::Meta('BP_ADMIN_OPTIONS', $options);
	}
	
	static function SetRegisterRole($roleid){
		self::Meta('BP_REGISTER_ROLE', $roleid);
	}
	
	static function EnableRegister($bool){
		self::Meta('BP_REGISTER', $bool ? true : false);
	}
	
	static function SetModeRegister($type){
		self::Meta('BP_REGISTER_TYPE', $type);
	}
/**
 * BlogPress.Sanitize(str) -> String
 * - str (String): Chaine à nettoyer.
 *
 * Cette méthode retourne une chaine sans caractères spéciaux et sans espace.
 **/	
	static function Sanitize($str){
		return strtolower(Stream::Sanitize($str, '-'));
	}
/*
 * BlogPress.PluginUri() -> String
 * Cette méthode retourne l'url du dossier des extensions.
 **/
 	static public function PluginUri(){
		if(defined('URI_WEB_PATH')){
			return str_replace(URI_WEB_PATH, URI_PATH, Plugin::Uri());
		}
		return Plugin::Uri();
	}
/**
 * BlogPress.Meta(key [, value]) -> String | Number | Array | Object
 * - key (String): Nom de la valeur stockée.
 * - value (String | Number | Array | Object): Valeur à stocker.
 *
 * Cette méthode retourne une valeur stocké en fonction du paramètre `key` dans la table `software_meta`. 
 * Si le paramètre `value` est mentionné alors la méthode enregistrera cette valeur dans la table au nom de clef indiqué `key`.
 *
 * <p class="note">Si la clef n'existe pas et que `value` n'est pas mentionné la méthode retournera NULL.</p>
 *
 * <p class="note">Si la clef n'existe pas et que `value` est mentionné la méthode créera une nouvelle entrée dans la table.</p>
 *
 **/
	public static function Meta($key){
		if($key == '') return false;
		
		//self::iDie(true);
		
		$num = func_num_args();
		
		$request = 			new Request(DB_BLOGPRESS);
		$request->select = 	'*';
		$request->from = 	System::TABLE_NAME;
		$request->where =	"Meta_Key = '".Sql::EscapeString($key)."'";
		
		$meta = $request->exec('select');			
		
		if($num == 1){	
			return $meta['length'] == 0 ? false : unserialize($meta[0]['Meta_Value']);
		}
				
		if($num == 2){
				
			$value = func_get_arg(1);
			
			if($value == "false") 	$value = false;
			if($value == "true") 	$value = true;
			
			if($meta['length'] == 0){
				
				$request->fields = '(Meta_Key, Meta_Value)';
				$request->values = "('".Sql::EscapeString($key)."', '".Sql::EscapeString(serialize($value))."')";
				
				if($request->exec('insert')) return func_get_arg(1);
				
			}else{
				
				$request->set = 	"Meta_Value = '".Sql::EscapeString(serialize($value))."'";
				$request->where = 	"Meta_ID = ".$meta[0]['Meta_ID'];
				
				if($request->exec('update')) return func_get_arg(1);
			}
		}
				
		return false;
	}
}
?>