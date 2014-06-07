<?php
/** section: MyEvent
 * class MyEvent 
 * includes ObjectTools
 *
 * Cette classe permet de gérer les différents événements du logiciel Javalyss pour la mise en place des données de l'extension MyEvent.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : abstract_myevent.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEvent extends ObjectTools{
/**
 * MyEvent.TVA_PRINT -> String
 *
 * On se contente d'afficher la TVA sur les récaps et facture.
 **/	
	const TVA_PRINT = 		'print';
/**
 * MyEvent.TVA_DISABLED -> String
 *
 * On n'affiche pas la TVA et donc pas de gestion de TVA.
 **/
	const TVA_DISABLED =	'disabled';
/**
 * MyEvent.TVA_USE -> String
 *
 * On affiche la TVA et on calcul le montant HT et TTC.
 **/
	const TVA_USE =			'use';	
/**
 * MyEvent.Initialize() -> void
 *
 * Cette méthode intercepte les événements du logiciel Javalyss pour créer les pages du logiciel MyEvent.
 **/	
	public static function Initialize(){
		
		//inclusion des classes
		include('account/class_account.php');
		
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('gateway.safe.exec', array(__CLASS__, 'execSafe'));

		System::Observe('blog:start', array(__CLASS__,'onStart'));
		System::Observe('blog:startindex', array(__CLASS__,'onStartIndex'));
		System::Observe('blog:startpage', array(__CLASS__,'onStartPage'));
		System::Observe('blog:form.submit', array(__CLASS__,'onFormSubmit'));
		System::Observe('blog:form.before', array(__CLASS__,'onBeforeForm'));
		System::Observe('blog:form.after', array(__CLASS__,'onAfterForm'));
		System::Observe('blog:header', array(__CLASS__, 'onDrawHeader'));
		/*
		 * Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur installera votre module depuis le menu Extension du logiciel.
		 **/
		System::Observe('plugin.active', array(__CLASS__,'Install')); 
		/*
		 * Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur désinstallera votre module depuis le menu Extension du logiciel.
		 **/
		System::Observe('plugin.deactive', array(__CLASS__,'Deactive'));
		/*
		 * Evenement plugin.configure. Cette événement est lancé lorsque l'utilisateur met à jour l'extension depuis Javalyss.fr ou un autre dépôt d'application.
		 **/
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		
		//
		// Gestionnaire System
		//
		if(class_exists('Blog')){		
			//
			// Backoffice Javalyss
			//
			System::EnqueueScript('myevent', Plugin::Uri().'js/myevent.js');
			System::EnqueueScript('myevent.setting', Plugin::Uri().'js/myevent_setting.js');
			System::AddCss(Plugin::Uri().'css/myevent.css');
			
			include('menu/class_myevent_menu.php');
			include('product/class_myevent_event.php');
			include('command/class_myevent_command.php');
		}
	}
/**
 * MyEvent.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		switch($op){
			case 'myevent.db.configure':
				self::Install();
				echo "Base configurée";
				break;
				
			case 'myevent.pages.create':
				self::CreatePages();
				echo "Pages créées & configurées";
				break;			
		}
	}
/**
 * Module.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/		
	public static function execSafe($op){
		
		if(User::IsConnect()){//transfert des opérations sur le canal sécurisé lorsque l'utilisateur MyEvent est authentifié
		
			define('HOME_POST_ID', Post::ByName('compte', false)->Post_ID);
			
			return System::Fire('myevent:gateway.exec', array($op));	
		}
	}
/**
 * MyEvent.Deactive() -> void
 **/
 	public static function Deactive($erase = false){
	
	}
/**
 * MyEvent.Configure() -> void
 *
 * Configure le logiciel pour l'utilisation de l'extension.
 **/	
	public static function Install(){
		
		Market::RequireApp('BlogPress');
		Market::RequireApp('Agenda');
		Market::RequireApp('MyWallet');
		Market::RequireApp('Contacts');
		Market::RequireApp('jGalery');
		Market::RequireApp('TheMUI');
		Market::RequireApp('ShareThis');
		
		//on lance les scripts d'installation et de mise à jour de la base de données
			
		MyEventMenuCritere::Install();
		MyEventProduct::Install();		
		MyEventProductCritere::Install();	
		MyEventCommand::Install();	
		
		if(class_exists('BlogPress')){
			//creation et configuration des pages du logiciel MyEvent
			self::CreatePages();
			//
			// Création du groupe
			//
			$role = Role::ByName('Client', 3, true);
			$accountid = System::Meta('MYEVENT_PAGE_ACCOUNT_ID');
			
			BlogPress::SetAccessRole($role->Role_ID, $accountid);
			BlogPress::SetRegisterRole($role->Role_ID);
			BlogPress::EnableRegister(true);
			BlogPress::SetModeRegister(BpRegister::ALL);//pro et particulier
		}
	}
/**
 * MyEvent.onStartIndex() -> Boolean
 *
 * Cette méthode permet de gérer l'inclusion de contenu et la création de Page dynamique en fonction du lien.
 **/
	static function onStartIndex(){
		
		$lang = Multilingual::GetLang();
		//
		//importation des librairies standards
		//
		Blog::EnqueueScript('window');
		Blog::EnqueueScript('html5');
		Blog::EnqueueScript('jquery');
		//
		//
		//
		Blog::EnqueueScript('prototype');
		Blog::EnqueueScript('extends', '', 'lang='. $lang);
		Blog::EnqueueScript('window');
		
		
			
		//Multilingual::Import(PHIBEE_PATH. 'lang/'.$lang.'/global.xml');
		//Blog::EnqueueScript('myevent.lang', Blog::GetInfo('uri').$lang.'/global/lang');
				
	}
	
	static function onDrawHeader(){
		if(User::IsConnect()):
		?>
		<script>
            System.UPLOAD_MAX_FILESIZE =	'<?php echo (str_replace('M', '', ini_get('upload_max_filesize')) * 1024 * 1024); ?>';
			System.URI =					'<?php Blog::Info('uri') ?>';
        </script>
		<?php	
		endif;
	}
/**
 * MyEvent.onStart() -> Boolean
 *
 * Cette méthode permet de gérer l'inclusion de contenu et la création de Page dynamique en fonction du lien.
 **/
	static function onStart(){
		
		define('HOME_POST_ID', Post::ByName('compte', false)->Post_ID);
				
		//lien de traitement
		$link = Permalink::Get();
						
		if($link->strEnd('lang')){//importation des langues cotés JS	
		
			BlogPress::StopEvent();
			$parameters = 	Permalink::Parameters();
			$lang =			$parameters[0];
			
			if($parameters[1] != 'lang'){
				$file = $parameters[1];	
			}else{
				$file = 'global';
			}
						
			Multilingual::Import(MYEVENT_PATH. 'lang/'.$lang.'/'.$file.'.xml');
			Multilingual::SetLang($parameters[0]);
			Multilingual::DrawJSONHeader();
						
			return false;
		}
		//
		// Gestion du multilingue
		//
		$lang = User::GetLang();
		
		Multilingual::Import(MYEVENT_PATH. 'lang/'.$lang.'/global.xml');
		//
		//importation des librairies standards
		//
		Blog::EnqueueScript('window');
		Blog::EnqueueScript('html5');
		Blog::EnqueueScript('jquery');
		
		Blog::EnqueueScript('prototype');
		Blog::EnqueueScript('extends', '', 'lang='. $lang);
		Blog::EnqueueScript('window');
		Blog::EnqueueScript('myevent.global.mui', Blog::GetInfo('uri').$lang.'/lang');
		
		//inclusion du script system.js pour la gestion des requêtes AJAX
		Blog::EnqueueScript('myevent', MYEVENT_URI.'js/myevent_system.js');
		
		if(!User::IsConnect()){
			if(!$link->isIndex() && $link->strStart('compte', false)){
				header('Location:' . Blog::GetInfo('uri') . 'admin/?redir=' . rawurlencode((string) Permalink::Get()));
				exit();
			}
		}
		//
		//
		//
		System::Fire('myevent:start');
	}
/**
 * MyEvent.onStartPage() -> void
 *
 * Cette méthode permet d'inclure des scripts au lancement d'une page.
 **/	
	static function onStartPage(){
				
		//protection des pages ayant le statut compte
		if(strpos(Post::Statut(), 'compte') !== false){
			
			if(!User::IsConnect()){//utilisateur non connecté et tente d'aller sur une page nécessitant une utilisateur authentifié.
				header('Location:' . Blog::GetInfo('uri') . '?redir=' . rawurlencode((string) Permalink::Get()));
				exit();	
			}
			
			MyEventAccountAddress::Create();
				
			//Mise en buffer du contenu généré par les scripts
			ob_start();
					
			System::Fire('myevent:startpage');
			
			//injection du contenu dans le POST
			Post::Content(ob_get_clean());		
		}
	}
/**
 * Module.onFormSubmit() -> Number
 *
 **/
	public static function onFormSubmit(){
		if(User::IsConnect()){//transfert des opérations sur le canal sécurisé lorsque l'utilisateur MyEvent est authentifié
			System::Fire('myevent:form.submit', array(System::GetCMD()));	
		}
	}
/**
 * Module.onBeforeForm() -> Number
 *
 **/
	public static function onBeforeForm(){
		
		if(User::IsConnect()){//transfert des opérations sur le canal sécurisé lorsque l'utilisateur MyEvent est authentifié
			System::Fire('myevent:form.before', array(System::GetCMD()));	
		}
	}
/**
 * Module.onAfterForm() -> Number
 *
 **/
	public static function onAfterForm(){
		if(User::IsConnect()){//transfert des opérations sur le canal sécurisé lorsque l'utilisateur MyEvent est authentifié
			System::Fire('myevent:form.after', array(System::GetCMD()));	
		}
	}
/**
 * MyEvent.CreatePages() -> void
 *
 * Cette méthode créée les pages du logiciel MyEvent
 **/
	static function CreatePages(){
		$post = Post::ByName('accueil');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Accueil';
			$post->Content = 		'';
			$post->Name =			'accueil';
			$post->Type = 			'page';
			$post->Template =		'home.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
				
			if(!$post->commit(false)){
				return false;
			}
		}
				
		System::Meta('BP_HOME_PAGE', $homeid = $post->Post_ID);
		
		$post = Post::ByName('actualite');
		
		if($post->Post_ID == 0){
			$post = new Post();
		
			$post->Title = 			'Actualité';
			$post->Content = 		'';
			$post->Name =			'actualite';
			$post->Type = 			'page';
			$post->Template =		'blog.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		
		System::Meta('BP_BLOG_PAGE', $post->Post_ID);
		//
		// Page Produits
		//
		$post = Post::ByName('evenements');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Événements';
			$post->Content = 		'';
			$post->Name =			'evenements';
			$post->Type = 			'page';
			$post->Template =		'page-myevent-events.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		//on retient l'id de cette page
		System::Meta('MYEVENT_PAGE_PRODUCTS_ID', $post->Post_ID);
		//
		// Page CGU
		//
		$post = Post::ByName('cgu');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Conditions générales d\'utilisation';
			$post->Content = 		'';
			$post->Name =			'cgu';
			$post->Type = 			'page';
			$post->Template =		'page-frame.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		//
		// Page CGV
		//
		$post = Post::ByName('cgv');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Conditions générales de vente';
			$post->Content = 		'';
			$post->Name =			'cgv';
			$post->Type = 			'page';
			$post->Template =		'page-frame.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}		
		//
		// Page à propos
		//
		$post = Post::ByName('a-propos');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'A propos';
			$post->Content = 		'';
			$post->Name =			'a-propos';
			$post->Type = 			'page';
			$post->Template =		'page.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		//
		// Page des comptes
		//
		$post = Post::ByName('compte');
		
		if($post->Post_ID == 0){
			$post = 			new Post();
			$post->Title = 			'Mon compte';
			$post->Content = 		'';
			$post->Name =			'compte';
			$post->Type = 			'page-myevent page-mystore';
			$post->Template =		'page-account.php';
			$post->Statut =			'publish compte';
			$post->Comment_Statut =	'close';
			
			if(!$post->commit(false)){
				return false;
			}
		}
		
		//on retient l'id de cette page
		System::Meta('MYEVENT_PAGE_ACCOUNT_ID', $compteid = $post->Post_ID);
		//
		// Compte historique des commandes
		//
		$post = Post::ByName('compte/commandes');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Historique de mes commandes';
			$post->Content = 		'';
			$post->Name =			'compte/commandes';
			$post->Parent_ID =		$compteid;
			$post->Type = 			'page-myevent page-mystore';
			$post->Template =		'page-command.php';
			$post->Statut =			'publish compte';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		
		
		$commandid = $post->Post_ID;		
		//
		// Compte : Adresse de livraison
		//
		$post = Post::ByName('compte/adresse-facturation');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Mes adresses de facturation';
			$post->Content = 		'';
			$post->Name =			'compte/adresse-facturation';
			$post->Parent_ID =		$compteid;
			$post->Type = 			'page-myevent';
			$post->Template =		'page-address.php';
			$post->Statut =			'publish compte';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		//
		// Compte : Info compte
		//
		$post = Post::ByName('compte/mes-infos');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Mes informations';
			
			$post->Content = 		'';
			$post->Name =			'compte/mes-infos';
			$post->Parent_ID =		$compteid;
			$post->Type = 			'page-myevent page-mystore';
			$post->Template =		'page-account-info.php';
			$post->Statut =			'publish compte';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}		
		//
		// Compte : Panier
		//
		$post = Post::ByName('panier');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Mon panier';
			$post->Content = 		'';
			$post->Name =			'panier';
			$post->Type = 			'page-myevent page-mystore';
			$post->Template =		'page-myevent-basket.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		
		$parentid = $post->Post_ID;
		
		$post->Template =		'page-myevent-basket.php';
		$post->Parent_ID =		$parentid;
			
		if(!$post->commit(false)){
			return false;
		}
				
		$post = Post::ByName('panier/paiement');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Paiement de votre panier';
			$post->Parent_ID =		$parentid;
			$post->Content = 		'';
			$post->Name =			'panier/paiement';
			$post->Type = 			'page-myevent';
			$post->Template =		'page-myevent-basket.php';
			$post->Statut =			'publish compte';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		
		$post = Post::ByName('panier/confirmation');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Confirmation de votre commande';
			$post->Parent_ID =		$parentid;
			$post->Content = 		'';
			$post->Name =			'panier/confirmation';
			$post->Type = 			'page';
			$post->Template =		'page-myevent-command-confirm.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
		}
		
		$post->Type = 			'page';	
		
		
		if(!$post->commit(false)){
			return false;
		}
		
		$post = Post::ByName('panier/annulation');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Annulation de votre commande';
			$post->Parent_ID =		$parentid;
			$post->Content = 		'';
			$post->Name =			'panier/annulation';
			$post->Type = 			'page';	
			$post->Template =		'page-myevent-command-cancel.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
		}
		
		if(!$post->commit(false)){
			return false;
		}		
		//
		//
		//
		$post = Post::ByName('panier/securite');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Paiement sécurisé';
			$post->Parent_ID =		$parentid;
			$post->Content = 		'';
			$post->Name =			'panier/securite';
			$post->Type = 			'page';
			$post->Template =		'page.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
					
			if(!$post->commit(false)){
				return false;
			}
		}
		//
		//
		//
		$post = Post::ByName('panier/confirmation-suppression');
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			'Panier supprimé';
			$post->Parent_ID =		$parentid;
			$post->Content = 		'';
			$post->Name =			'panier/confirmation-suppression';
			$post->Type = 			'page';
			$post->Template =		'page-myevent-basket.php';
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
		}
		
		$post->Type = 			'page';	
		
		if(!$post->commit(false)){
			return false;
		}
	}
/**
 * MyEvent.GetInfo(keyname) -> String
 * 
 * Cette méthode affiche une information sur le blog. Si `echo` est faux l'information ne sera pas affiché mais retourné par la méthode.
 *
 * #### Liste des mots clefs
 *
 * 
 **/
	static public function GetInfo($key){
		 return self::Info($key, false);
	}
/**
 * MyEvent.Info(keyname) -> void
 * MyEvent.Info(keyname, false) -> String
 *
 * Cette méthode affiche une information sur le blog. Si `echo` est faux l'information ne sera pas affiché mais retourné par la méthode.
 *
 * #### Liste des mots clefs
 *
 * 
 **/
	static public function Info($key, $echo = true){
		if(is_bool($key)){
			if($echo){
				echo '';
			}
			
			return '';	
		}
		
		$string = '';
		
		if(strpos($key, ':') !== false){
			
			$string = Blog::GetInfo($key);
			
		}else{
			
			switch($key){
				default:
					$string = Blog::GetInfo($key);
					break;
				
				case 'account':
					$string = Blog::Uri().'compte/';
					break;
					
				case 'basket':
					$string = Blog::Uri().'panier/';
					break;
				
				case 'basket.submit':
					$string = Blog::Uri().'basket/action/submit';
					break;
				
				case 'basket.clear':
					$string = MyEventBasket::PermalinkClear();
					break;
				
				case 'command':
					$string = Blog::Uri().'compte/commandes';
					break;
					
				case 'track':
					$string = Blog::Uri().'compte/commandes/suivi';
					break;	
				
				case 'address':
					$string = Blog::Uri().'compte/adresse-livraison';
					break;
				
				case 'myinfo':
					$string = Blog::Uri().'compte/mes-infos';
					break;
					
				//case 'siret':
			}
		}
		
		if($echo){
			echo $string;
		}
		
		return $string;
	}
/**
 * MyEvent.StockEnable() -> Boolean
 *
 * Cette méthode indique si la gestion des stocks est activée.
 **/
	public static function StockEnable(){
		$bool = System::Meta('MYEVENT_STOCK_ENABLE');
		
		return !empty($bool);
	}
/**
 * MyEvent.Currency() -> String
 *
 * Cette méthode retourne la devise par défaut de la boutique.
 **/	
	public static function Currency($format = 'normal'){
				
		switch($format){
			
			case '':
				return '';
				
			case 'normal':
				$char = System::Meta('MYEVENT_CURRENCY');
				return empty($char) ? '€' : $char;
			case 'pdf':
				return chr(ord(MyEvent::Currency())-98);
				break;
			case 'code':
				return self::CurrencyCode();
		}
	}
	
	public static function CurrencyCode(){
		$char = self::Currency();
		
		switch($char){
			case '€':
				return 'EUR';
			case '£':
				return 'GBP';
			case '$':	
				return 'USD';
		}
		
		return '';
	}
	
	public static function CurrencyPDF(){
		return chr(ord(MyEvent::Currency())-98);
	}
/**
 * MyEvent.TVA() -> Float
 *
 * Cette méthode retourne la valeur de la tva.
 **/
	public static function TVA(){
		$value = System::Meta('MYEVENT_TVA');
		return empty($value) ? 19.6 : ($value * 1);
	}
/**
 * MyEvent.CalculateTVA(price) -> Float
 *
 * Cette méthode retourne la valeur de la tva.
 **/
	public static function CalculateTVA($price){
		
		switch(self::ModeTVA()){
			case self::TVA_DISABLED:break;
			case self::TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				$price = 	$price + (($price * self::TVA()) / 100);
				break;
			case self::TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$price = 	$price / ((self::TVA() / 100) + 1);
				break;
		}
		return $price;
	}
/**
 * MyEvent.ModeTVA() -> String
 *
 * Cette méthode retourne le mode de calcul de la TVA.
 **/	
	public static function ModeTVA(){
		$value = System::Meta('MYEVENT_TVA_MODE');
		return empty($value) ? self::TVA_PRINT : $value;
	}
/**
 * MyEvent.NullPrice() -> String
 *
 * Cette méthode retourne le prix nul formaté.
 **/
	public static function NullPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format(0, 2, $dec_point, $thousands_sep)  . ' '.MyEvent::Currency();
	}
/**
 * MyEvent.MailList() -> Array
 *
 * Cette méthode retourne les adresses e-mail de la liste de diffusion.
 **/	
	public static function MailList(){
		$value = System::Meta('MYEVENT_MAIL_LIST');
		return empty($value) ? array() : $value;
	}
}

MyEvent::Initialize();
?>