<?php
/** section: Plugins
 * Blog
 *
 * Utilitaire mettant à disposition des méthodes pour créer des pages web sous BlogPress.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_blog.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class Blog{
/**
 * Blog.Title -> String
 **/	
	protected static $Title = 			'';
/**
 * Blog.Description -> String
 **/
	protected static $Description = 	'';
/**
 * Blog.Keywords -> String
 **/
	protected static $Keywords = 		'';
/*
 * Blog.ScriptLink -> Array
 **/	
	private static $ScriptLink = array(
		'prototype' => 		'$path/prototype/prototype.1.7.1.js',
		'jquery' => 		'$path/jquery/jquery.min-1.9.js',
		'jquery.migrate' => '$path/jquery/jquery.migrate-1.1.1.js',
		'extends' => 		'$path/window/extends.min.js',
		'window' => 		'$path/window/window.min.js',
		'googlemap' => 		'http://maps.google.com/maps/api/js?sensor=false&language=fr',
		'jlightbox' => 		'$path/jquery/jquery.lightbox.min.js',
		'html5' 	=>		'$path/html5/html5.js',
		'canvas' 	=>		'$path/html5/canvas.js',
		'jquery.history' => '$path/jquery/jquery.history.js',
		'connexion' => 		'$bp/javalyss_connexion.js',
		'register' => 		'$bp/javalyss_register.js',
		'system' =>			'$bp/blogpress_system.js'
	);
	
	private static $Script = 	array();
	private static $Css = 		'';
/**
 * Blog.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
 	static public function Initialize(){}
/**
 * Blog.Title() -> String
 *
 * Cette méthode retourne le titre du site internet.
 **/	
	static public function Title($str = ''){
		if(empty($str)){
			return self::Info('title');
		}
		
		self::$Title = $str;
	}
/**
 * Blog.Description() -> String
 *
 * Cette méthode retourne le description du site internet.
 **/	
	static public function Description($str = ''){
		if(empty($str)){
			return self::Info('description');
		}
		
		self::$Description = $str;
	}
/**
 * Blog.Keywords() -> String
 *
 * Cette méthode retourne les mots clefs de référencement du site interne.
 **/	
	static public function Keywords($str = ''){
		if(empty($str)){
			return self::Info('keywords');
		}
		
		self::$Keywords = $str;
	}
/*
 * Blog.Observe(eventName, callback) -> void
 **/	
	static public function Observe($eventName, $callback){
		return System::Observe('blog:'.$eventName, $callback);
	}
/*
 * Blog.StopObserving(eventName, callback) -> void
 **/	
	static public function StopObserving($eventName, $callback){
		return System::StopObserving('blog:'.$eventName, $callback);
	}
/*
 * Blog.Fire(eventName, array) -> void
 **/	
	static public function Fire($eventName, $array = array()){
		return System::Fire('blog:'.$eventName, $array);
	}
/**
 * Blog.RegisterOpen() -> Boolean
 * Cette méthode indique si le formulaire d'inscription est ouvert au public.
 **/
	static public function RegisterOpen(){
		return BlogPress::RegisterOpen();
	}
/**
 * Blog.ContactOpen() -> Boolean
 * Cette méthode indique si le formulaire de contact est ouvert au public.
 **/	
	static public function ContactOpen(){
		return BlogPress::ContactOpen();
	}
/**
 * Blog.Uri() -> String
 *
 * Lien HTTP du dossier du site Web.
 **/
	static public function Uri(){
		if(!defined('URI_WEB_PATH')){
			return URI_PATH;
		}
		return BlogPress::Meta('BP_REDIR_INDEX') != '0' ? URI_PATH : URI_WEB_PATH;
	}
/**
 * Blog.GetInfo(keyname) -> String
 * - keyname (String): Nom de la donnée à récupérer.
 *
 * Cette méthode affiche une information concernant le site.
 *
 * <p class="related-to related">Voir la méthode [[Blog.Info]]</p>
 **/
	static public function GetInfo($key){
		 return self::Info($key, false);
	}
/**
 * Blog.Info(keyname) -> void
 * Blog.Info(keyname, false) -> String
 * - keyname (String): Nom de la donnée à récupérer.
 *
 * Cette méthode affiche une information sur le blog. Si `echo` est faux l'information ne sera pas affiché mais retourné par la méthode.
 *
 * #### Liste des mots clefs
 *
 * * `account` : Retourne le lien vers la page des comptes si elle existe.
 * * `admin` : Retourne le lien vers le backoffice javalyss.
 * * `ajax` : Retourne le lien vers la passerelle AJAX.
 * * `ajax.safe` : Retourne le lien vers la passerelle AJAX en mode déconnecté.
 * * `blog` : Retourne le lien de la page des articles.
 * * `description` : Retourne la description du site internet.
 * * `canonical` : Retourne le lien canonique de la page en cours.
 * * `current` : Retourne le lien de la page actuelle.
 * * `charset` : Retourne l'encodage de la page.
 * * `contact` : Retourne l'adresse e-mail principale de contact.
 * * `contacts` : Retourne la liste des contacts du site internet.
 * * `mailinfo` : Retourne l'adresse e-mail info@monsite.fr
 * * `mailregister` : Retourne l'adresse d'inscription.
 * * `login` ou `connexion` : Retourne le lien de la page de connexion.
 * * `logout` : Retourne le lien de la page de déconnexion.
 * * `password.lost` : Retourne le lien de la page de récupération du mot de passe.
 * * `google.valid` : Retourne le hashtag de Google pour le référencement du site internet.
 * * `name` : Retourne le nom du site internet.
 * * `host` : Retourne le nom d'hôte du domaine.
 * * `title` : Retourne le titre du site internet.
 * * `keywords` : Retourne les mots clefs de référencement du site internet.
 * * `register` : Retourne le lien de page d'inscription.
 * * `slogan` : Retourne le slogan du site internet.
 * * `logo` : Retourne le lien du logo du site internet.
 * * `submit` : Retourne le lien de soumition d'un formulaire.
 * * `lang` : Retourne la langue du site internet.
 * * `icon` : Retourne le lien du fichier CSS des icônes Javalyss.
 * * `searchValue` : Retourne le mot recherché. 
 * * `template` : Retourne le lien du dossier du template du site internet. 
 * * `cssuri` : Retourne le lien du fichier de style du template.
 * * `uri` : Retourne le lien actuel.
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
			
			$string = explode(':', $key);
			
			switch($string[0]){
				case "https":
				case "http":
					$string = $key;
					break;
				case "post":
				case "page":
					
					if(is_numeric($string[1])){
						$post = new Post((int) $string[1], false);
						
						if($post->Post_ID != 0 && $post->published()){
							$string = $post->uri();
						}else{
							$string = '';	
						}
					}else{
						
						$post = Post::ByName($string[1]);		
						
						if($post->Post_ID > 0 && $post->published()){
							$string = $post->uri();	
						}else{
							if($string[1] == 'contact'){
								$string = Blog::Uri().'contact/';
							}else{
								$string = '';
							}
						}
					}
									
					break;	
			}
			
		}else{
			
			switch($key){
				default:break;
				case 'account':
					$string = Blog::Uri().'admin/account/';
					break;
					
				case 'admin':
					$string = Blog::Uri().'admin/';
					break;
					
				case 'ajax'://lien de la passerelle ajax
					if(User::IsConnect()){
						$string = URI_PATH.'ajax/connected/';
					}else{
						$string = URI_PATH.'ajax/';
					}
					break;
					
				case 'ajax.safe':
					$string = URI_PATH.'ajax/';
					break;
					
				case 'articles':
				case 'blog'://lien de la page du blog
					if(!BlogPress::Meta('BP_HOME_STATIC')){
						$string = Blog::Uri().'blog/';
					}else{
						$post = new Post((int) BlogPress::Meta('BP_BLOG_PAGE'));
						if($post->Post_ID == 0){
							$string = Blog::Uri() . 'blog/';
						}else{
							$string = Blog::Uri() . $post->Name.'/';
						}
					}				
					//$string = Blog::Uri().'blog'
					break;
					
				case 'canonical'://lien canonique de la page
					
					if(Post::Single()){
						$string = Post::Permalink();
					}else{
						$string = new Permalink() . '/';	
					}
					
					break;
					
				case 'current':
					$string = new Permalink() .'/';
					break;	
					
				case 'charset'://Jeu de caractère des flux
					$string = 'text/html; charset='.strtolower(BlogPress::Meta('BP_CHARSET'));
					if(empty($string)){
						$string = 'text/html; charset='.strtolower(BlogPress::Meta('BP_CHARSET', 'utf-8'));
					}
					break;
					
				case 'contact'://Adresse e-mail à contacter
					$string = BlogPress::Meta('BP_EMAIL');
					
					if(is_array($string)){
						$string = $string[0];	
					}
					
					break;
					
				case 'contacts'://Retourne la liste des contacts
					$string = BlogPress::Meta('BP_EMAIL');
					
					break;
					
				case 'mailinfo':
					$string = 'info@' . self::GetInfo('host');
					break;
				
				case 'mailregister':
					$string = BlogPress::Meta('BP_REGISTER_FROM_EMAIL');
					
					if(empty($string)){
						$string = 'register@' . self::GetInfo('host');
					}
					
					break;
								
				case 'login':
				case "connexion"://lien de la page de connexion ou d'administration
					$string = Blog::Uri().'login/';
					break;
					
				case 'logout':
					$string = Blog::Uri().'logout/';
					break;
				case "password.lost":
				case "lost.password"://lien de la page de connexion ou d'administration
					$string = Blog::Uri().'password-lost/';
					break;			
				
				case 'blog.description'://description du site internet
					$string = BlogPress::Meta('BP_DESCRIPTION');
					break;
				case 'description'://description du site internet
										
					if(!empty(self::$Description)){
						$string = self::$Description;
					}else{
						if(Post::Have()){
							if(Post::Single()){
								$summary = 	Post::Summary();
								$string = 	empty($summary) ? Post::ContentText() : Post::Summary();
							}
						}
						
						
					}
					
					if(empty($string)){
						$string = BlogPress::Meta('BP_DESCRIPTION');
					}	
									
					break;
					
				case 'google.valid':
					$string = BlogPress::Meta('BP_GOOGLE_VERIFICATION');
					break;
					
				case 'name':
					$string = BlogPress::Meta('BP_TITLE');
					break;
				
				case 'host':
									
					$string = Permalink::Host(Post::Sanitize(self::GetInfo('name'), '-') . '.com');
					
					break;	
					
				case 'title'://Titre du site internet
										
					if(!empty(self::$Title)){
						$string = self::$Title;
					}else{
						
						if(Post::Have()){
							if(Post::Single()){
								
								$string = Post::TitleHeader();
														
								if(empty($string)){
									$schemes = BlogPress::Meta('BP_SCHEME_TITLE');
								
									if(empty($schemes)){
										$string = Post::Title() . ' | ' .BlogPress::Meta('BP_TITLE');
									}else{
										$string = str_replace(array('#POST', '#TITLE'), array(Post::Title(),  BlogPress::Meta('BP_TITLE')), $schemes);
									}
								}
								
							} 
						}
					}
					
					if(empty($string)){
						$string = BlogPress::Meta('BP_TITLE');
					}
					
					break;
					
				case 'keywords'://mot clef de référencement du site internet
									
					if(!empty(self::$Keywords)){
						$string = self::$Keywords;
					}else{
						if(Post::Have()){
							if(Post::Single()){
								
								$string = Post::Keywords();
																
								if(empty($string)){
									$string = BlogPress::Meta('BP_KEYWORDS');
								}
							}
						}
					}
					
					if(empty($string)){
						$string = BlogPress::Meta('BP_KEYWORDS');
					}					
						
					break;
					
				case 'register':
					$string = Blog::Uri().'register/';
					break;
					
				case 'slogan'://Description du site internet
					$string = BlogPress::Meta('BP_SLOGAN');
					break;
				
				case 'logo'://Description du site internet
					$string = BlogPress::Meta('BP_LOGO');
					break;
				
				case 'submit':	
				case 'self':
					$string = (string) new Permalink();
					break;
					
				case 'lang':
					$string = str_replace(URI_PATH, ABS_PATH, self::GetInfo('template'). 'lang/');
					break;
					
				case 'icon': //répertoire des icônes
					$string = System::Path('icon', false);
					break;
					
				case "search": //lien de recherche d'une page
					$string = Blog::Uri().'search/';
					break;	
					
				case "searchValue"://Valeur de la recherche
					$string = @$_GET['search'];
					
					if(isset($_GET['search'])){
						$string = $_GET['search'];
					}else{
						if(isset($_POST['search'])){
							$string = $_POST['search'];
						}
					}
					break;
				
				case 'systheme'://repertoire du dossier des thèmes de l'administration
					$string = System::Path('theme', false);
					break;
					
				case 'template'://Dossier du template
					$string = Template::Uri();
					break;
					
				case 'stylesheet_url':
				case 'cssuri'://Lien du fichier style du template
					$string = Template::Uri().'style.css';
					break;
				
				case 'window.import.css':
					if(CODE_VERSION . CODE_SUBVERSION < '0.9.0'){
						$path = '../' . str_replace(URI_PATH, '', self::GetInfo('template'));
						$string = Blog::GetInfo('systheme').'window.css.php?themes=' . $path . $echo . '&amp;all=no';
					}else{
						$path = 	str_replace(URI_PATH, '', self::GetInfo('template')) . $echo;
					
						$string = 	Blog::GetInfo('systheme').'compile/custom/window/minified/' . $path;//window.css.php?themes=' . $path . $echo . '&amp;all=no';
					}
					
					break;
					
				case 'uri'://lien du site internet
					$string = Blog::Uri();
					break;
				
				case 'user':
					$string = '';
					if(User::IsConnect()){
						$string = User::Get()->Name . ' '. User::Get()->FirstName;
					}	
					break;
			}
		}
		
		if($echo){
			echo $string;
		}
		
		return $string;
	}
/**
 * Blog.Head() -> void
 * 
 * Cette affiche les balises metas, les balises scripts et les balises de style importé par les différentes extensions. 
 * Cette méthode est à utiliser dans les templates entres les balises HEAD.
 *
 * <p class="related-to related">Voir la méthode [[Blog.EnqueueScript]] pour inclure des scripts JS.</p>
 * <p class="related-to related">Voir la méthode [[Blog.ImportCSS]] pour inclure des feuilles de style.</p>
 * <p class="note">La méthode déclenche l'événement `blog:head`, permettant d'affiche du contenu entres les balises HEAD.</p>
 *
 **/	
	static public function Head(){
		
		if(self::GetInfo('google.valid')){
			?>
	
    <meta name="google-site-verification" content="<?php self::Info('google.valid'); ?>" /><?php
		}
		
		if(!empty(self::$Script['googlemap'])){
			if(empty(self::$Script['prototype']) || empty(self::$Script['extends'])){
				Blog::EnqueueScript('prototype');
				Blog::EnqueueScript('extends', '', 'lang='.Multilingual::GetLang());
			}
		}
		
		//si on a scriptaculous qui est dans la file d'attente
		if(!empty(self::$Script['prototype']) && !empty(self::$Script['jquery'])){
?>	
	<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$Script['prototype']); ?>"></script>
    <script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$Script['jquery']); ?>"></script>
<?php
			if(isset(self::$Script['extends'])):
?>
	<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$Script['extends']); ?>"></script>
<?php
			else:
			?>
            
            <?php
			endif;
		}else{
			if(!empty(self::$Script['prototype'])){
?>	
	<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$Script['prototype']); ?>"></script>
<?php
			}
			if(!empty(self::$Script['extends'])){
?>	
	<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$Script['extends']); ?>"></script>
<?php
			}
			
			if(!empty(self::$Script['jquery'])){
?>
	<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$Script['jquery']); ?>"></script>
<?php
			}
		}
		
		foreach(self::$Script as $key => $value){
			if(in_array($key, array('extends', 'jquery', 'prototype'))) continue;
			
			switch($key){
				case 'googlemap':
?>
	<script type="text/javascript" src="<?php echo self::Resolve(self::$Script[$key]); ?>"></script>
<?php
	if(class_exists('GoogleMapAPI')):
?>
    <script src="<?php echo GoogleMapAPI::GetClustererPath() ?>" type="text/javascript"></script>
<?php
					GoogleMapAPI::DrawClassJS();
					endif;
					break;
				case 'canvas':
?>
    <!--[if IE]><script type="text/javascript" src="<?php echo self::Resolve(self::$Script[$key]); ?>"></script><![endif]-->
<?php
					break;
				case 'html5':
?>
    <!--[if lt IE 9]>
    <script type="text/javascript" src="<?php echo self::Resolve(self::$Script[$key]); ?>" ></script>
    <![endif]-->
<?php
					break;
				default:
?>
	<script type="text/javascript" src="<?php echo self::Resolve(self::$Script[$key]); ?>"></script>
<?php
					break;
			}			
		}
		
		echo self::$Css ."\n\t";
		System::Fire('blog:header');
		System::Fire('blog:head');
	}
/**
 * Blog.Connexion() -> void
 * Cette méthode affiche le formulaire de connexion au back office.
 **/
 	static public function Connexion($echo = true){
		
		if(!$echo) ob_start();
		?>
        <form action="<?php Blog::Info('submit'); ?>" method="post" name="formConnexion" class="form form-connexion">
            <input type="hidden" name="cmd" value="blogpress.connexion.submit" />
                       
        	<table class="table-form form-table">
            <tbody>
            <tr><th><label for="Login">Identifiant</label></th>
            <td>
            	<input id="Login" type="text" name="Login" maxlength="255" value="<?php echo @$_POST['Login'] ?>" />
            </td>
            </tr>
            <tr >
                <th><label for="Password">Mot de passe</label></th>
                <td><input id="Password" type="password" name="Password" maxlength="50" value="<?php echo @$_POST['Password'] ?>" /></td>
            </tr>
            </tbody>
            </table>
           	            
			<?php 
                self::Fire('form.after', 'connexion'); 
            ?>
            
        	<p><span class="button submit"><input type="submit" value="Me connecter" class="icon-connect-creating" name="Submit" /></span>
            <span class="button password-lost"><input type="button" value="Mot de passe oublié" class="icon-password" name="LostPassword" /></span></p>
        </form>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * Blog.Contact() -> void
 * Cette méthode retourne le formulaire de contact.
 **/
 	static public function Contact($echo = true){
		return BlogPressContact::Draw($echo);
	}
/**
 * Blog.Register() -> void
 * Cette méthode retourne le formulaire d'inscription.
 **/
 	static public function Register($echo = true){
		return BlogPressRegister::Draw($echo);
	}
/*
 * Blog.Resolve(link) -> String
 **/
	static public function Resolve($link){
		return str_replace(array('$bp/', '$path/'), array(BLOGPRESS_URI.'js/', System::Path('js', false)), $link);
	}
/**
 * Blog.EnqueueScript(scriptname [, src [, parameters]]) -> void
 * - scriptname (String): Nom du script tel que `jquery`, `prototype` etc...
 * - src (String): Lien du script à charger
 * - parameters (String): Paramètre à passer au script JS.
 * 
 * Cette méthode gère l'inclusion sans doublon des script Javascript vers une page du template.
 **/	
	static public function EnqueueScript($scriptname, $src = '', $parameters = ''){
		//if(!isset(self::$Script[$scriptname])){
			@self::$Script[$scriptname] = $src == '' ? @self::$ScriptLink[$scriptname] : $src;
		//}else{
			//self::$Script[$scriptname] = $src == '' ? self::$ScriptLink[$scriptname] : $src;
		//}
		
		if($parameters != ''){
			if(!preg_match('/\\?/', self::$Script[$scriptname])){
				self::$Script[$scriptname] .= '?'.$parameters;
			}else{
				self::$Script[$scriptname] .= "&".$parameters;
			}
		}
	}
/**
 * Blog.ImportCSS(src[, media = "screen"]) -> void
 * - src (String): Lien du script css à importer.
 * - media (String): Média cible du script css.
 * 
 * Cette méthode permet d'importer un script CSS en vue d'être inséré dans l'entête du template.
 **/
	static public function ImportCSS($style, $media = 'screen'){
		self::$Css .= "\n\t".'<link type="text/css" href="'.$style.'" media="'.$media.'" rel="stylesheet" />';
	}
/** deprecated
 * Blog.SocialLink() -> String
 * Cette méthode créée les liens de partages vers les réseaux sociaux. 
 * <p class="note">La méthode utilise des protocoles déprécié par les réseaux sociaux !</p>
 **/
	public static function SocialLink($list = array('google', 'facebook', 'twitter', 'myspace', 'linkedin'), $icons = ""){
		
		if(!is_array($icons)){
			$icons = array('google'=>'', 'facebook' => 'facebook-32', 'twitter' => 'twitter-32', 'myspace' => 'myspace-32', 'linkedin' => 'linkedin-32', 'rss' => 'rss-32');
		}
		
		$google = 	'<span class="googleplus"><g:plusone size="medium"></g:plusone></span>';	
		$facebook = new IconButton('http://www.facebook.com/sharer.php?u='.self::Info('uri', false).'" target="socialbookmark" rel="nofollow', @$icons['facebook']);
		$twitter = 	new IconButton('http://twitter.com/timeline/home?status='.rawurlencode(self::Info('title', false) . ' sur '.self::Info('uri', false)).'" target="socialbookmark" rel="nofollow', @$icons['twitter']);
		$myspace = 	new IconButton('http://www.myspace.com/Modules/PostTo/Pages/?u='.self::Info('uri', false).'&t='.self::Info('title', false).'" target="socialbookmark" rel="nofollow', @$icons['myspace']);
		$linkedin = new IconButton('http://www.linkedin.com/shareArticle?mini=true&url='.self::Info('title', false).'&title='.self::Info('title', false).'&quot;"  target="socialbookmark" rel="nofollow', @$icons['linkedin']);
		$rss =		new IconButton(self::Info('rss'), $icons['rss']);
		
		$facebook->pushAttr('class', 'box-flag type-top');
		$facebook->pushAttr('title', 'Partager');
		
		$twitter->pushAttr('class', 'box-flag type-top');
		$twitter->pushAttr('title', 'Twitter');
		
		$myspace->pushAttr('class', 'box-flag type-top');
		$myspace->pushAttr('title', 'Partager vers MySpace');
		
		$linkedin->pushAttr('class', 'box-flag type-top');
		$linkedin->pushAttr('title', 'Partager vers LinkedIn');
		
		$rss->pushAttr('class', 'box-flag type-top');
		$rss->pushAttr('title', 'Suivre le flux');
		
		$social = '<div class="socialbar">';
		
		if(in_array('google', $list)) 	$social .= $google;
		if(in_array('facebook', $list)) $social .= $facebook;
		if(in_array('twitter', $list)) 	$social .= $twitter;
		if(in_array('myspace', $list)) 	$social .= $myspace;
		if(in_array('linkedin', $list)) $social .= $linkedin;
		if(in_array('rss', $list)) 		$social .= $rss;
		
		return $social.'</div>';
	}
}

Blog::Initialize();
?>