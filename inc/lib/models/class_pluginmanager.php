 <?php
/** section: Library
 * class PluginManager < Models
 *
 * Gestionnaire des plugins pour un logiciel. Il permet de recupérer la liste des plugins dans un 
 * dossier de référence. 
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_pluginmanager.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 * #### Utilisation de PluginManager
 *
 * Voici un exemple de chargement des plugins (conseillé) :
 *
 *      //Déclation du dossier des extensions
 *      $PM = new PluginManager($pathofplugins);
 *      //Inclusion des fichiers principaux des extensions
 *      do{
 *           include_once($PM->path());
 *      }while($PM->next());
 *
 * #### Exemple d'entete
 *
 * L'exemple suivant permet de créer un plugin. Collez l'entête dans un fichier PHP et personnalisez là.
 * Ensuite enregistrez votre fichier dans un sous-dossier - nommé par exemple `monplugin` - situé dans le dossier principal des plugins. 
 * 
 * <pre><code>/*
 * Plugin Name: Name of Plugin
 * Plugin URI: Link to plugin information
 * Description: Plugin Description
 * Author: Plugin author's name
 * Author URI: Link to the author's web site
 * Version: Must be set in the plugin for WordPress 2.3+
 * Text Domain: Optional. Unique identifier, should be same as the one used in plugin_text_domain()
 * Domain Path: Optional. Only useful if the translations are located in a folder above the plugin's 
 * base path. For example, if .mo files are located in the locale folder then Domain Path will 
 * be "/locale/" and must have the first slash. Defaults to the base folder the plugin is located in.
 * * / # Remove the space to close comment
 * </code></pre>
 *
 * Description des différentes données de l'entete :
 *
 * * `Name` : Nom du plugin, ce dernier doit être unique.
 * * `Description` : Description of what the plugin does and/or notes from the author.
 * * `Author` : The author's name
 * * `AuthorURI` : The authors web site address.
 * * `Version` : The plugin version number.
 * * `PluginURI` : Plugin web site address.
 * * `TextDomain` : Plugin's text domain for localization.
 * * `DomainPath` : Plugin's relative directory path to .mo files.
 *
 * Some users have issues with opening large files and manipulating the contents
 * for want is usually the first 1kiB or 2kiB. This function stops pulling in
 * the plugin contents when it has all of the required plugin data.
 *
 * The first 8kiB of the file will be pulled in and if the plugin data is not
 * within that first 8kiB, then the plugin author should correct their plugin
 * and move the plugin data headers to the top.
 *
 * The plugin file is assumed to have permissions to allow for scripts to read
 * the file. This is not checked however and the file is only opened for
 * reading.
 *
 **/
if(!class_exists('PluginManager')):
require_once('class_models.php');
class PluginManager extends Models{
/**
 * PluginManager.VERSION -> const
 **/
	const VERSION =				'0.6';
/**
 * PluginManager.stopped -> Boolean
 **/
	private static $stopped =  false;
	
	public $Extensions = array('.php');	
	
	protected $Header = array( 
		'Name' => 'Plugin Name', 
		'PluginURI' => 'Plugin URI', 
		'Version' => 'Version', 
		'Description' => 'Description', 
		'Author' => 'Author', 
		'AuthorURI' => 'Author URI', 
		'TextDomain' => 'Text Domain', 
		'DomainPath' => 'Domain Path' 
	);
/**
 * PluginManager#listerners -> Array
 * (private) Liste des écouteurs d'un événement.
 **/
	private $listeners = array();
/**
 * PluginManager#css -> Array
 * (private) Liste des filtres.
 **/
	private $css = array();
/**
 * PluginManager#tags -> Array
 * (private) Liste des tags HTML à inserer dans une page cible entre les balises `head`.
 **/
	private $tags = array();
/**
 * PluginManager#script -> Array
 * (private) Liste des scripts Javascript.
 **/
	private $script = array();
/**
 * PluginManager#observe(eventName, callback) -> void
 * - eventName (String): Nom de l'événement à écouter.
 * - callback (Array | String): Nom de la fonction ou tableau de noms => array(className, methodName).
 *
 * `final` Cette méthode observe un nom d'événement `eventName`. La fonctions associée à `eventName` sera executé par la méthode [[PluginManager.fire]].
 **/
	/*public function add_action($eventName, $callback){
		if(!@$this->listeners[$eventName]){
			$this->listeners[$eventName] = array();
		}
		
		array_push($this->listeners[$eventName], $callback);
	}*/
	
	public function observe($eventName, $callback){
		
		if(!@$this->listeners[$eventName]){
			$this->listeners[$eventName] = array();
		}
		
		array_push($this->listeners[$eventName], $callback);
	}
/**
 * PluginManager#stopObserving(eventName) -> void
 * - eventName (String): Nom de l'événement à écouter.
 *
 * `final` Cette méthode stop l'observation d'un nom d'événement `eventName`.
 **/
	public function stopObserving($eventName){
		@$this->listeners[$eventName] = array();
	}
/**
 * PluginManager#addCSS(link [, media]) -> void
 * - link (String): Lien du fichier CSS à inclure.
 * - media (String): media ciblé par la feuille de style.
 *
 * `final` Cette méthode enregistre un lien vers une feuille CSS à inclure dans une page cible.
 **/
	public function addCSS($link, $media='all'){
		array_push($this->css, array('link'=>$link, 'media'=>$media));
	}
	
	/*public function add_css($link, $media='all'){
		$this->addCSS($link, $media);
	}*/
/**
 * PluginManager#addScript(link) -> void
 * - link (String): Lien du fichier Javascript à inclure.
 *
 * `final` Cette méthode enregistre un lien vers une feuille Javascript à inclure dans une page cible.
 **/
	public function addScript($link){
		array_push($this->script, array('link'=>$link));
	}
	
	/*public function add_script($link){
		$this->addScript($link);
	}*/
/**
 * PluginManager#addTag(content) -> void
 * - content (String): Balise à inclure dans l'entete du fichier HTML.
 *
 * `final` Cette méthode enregistre une balise et sont contenue qui sera inclut dans une page cible.
 **/
	public function addTag($tag){
		array_push($this->tags, $tag);
	}
/**
 * PluginManager#fire(eventName [, argv]) -> Boolean
 * - eventName (String): Nom d'événement à déclencher.
 * - argv (Array): Liste d'argument à passer aux fonctions. 
 *
 * `final` Cette méthode déclenche un nom d'événement.
 **/
	public function fire($event, $args = array()){
		self::$stopped = false;
		
		$event = @$this->listeners[$event];
		
		if(!is_array($args)){
			$args = array($args);
		}
		
		if(!empty($event)){
			foreach($event as $value){
				
				if(is_callable($value)){
					if(!$this->error = call_user_func_array($value, $args)){
						continue;
					}else return $this->error;
				}
			}
		}
		return 0;
	}
/**
 * PluginManager.Stop() -> void
 * 
 * Stop l'événement déclenché.
 **/
 	final static public function Stop(){
		self::$stopped = true;
		return self::$stopped;
	}
/**
 * PluginManager.IsStop() -> Boolean
 * 
 * Indique si l'événement a été stoppé.
 **/
 	final static public function IsStop(){
		return self::$stopped;
	}
/*	
	public function fire_action($action, $args = array()){
		return $this->fire($action, $args);
	}*/
/**
 * PluginManager#printCSS() -> void
 *
 * `final` Cette méthode affiche les balises CSS enregistrées avec la méthode [[PluginManager.addCSS]].
 **/
 	public function printCSS(){
		echo $this->getCSS();
	}
/**
 * PluginManager#getCSS() -> String
 *
 * `final` Cette méthode retourne les balises CSS enregistrées avec la méthode [[PluginManager.addCSS]].
 **/
 	public function getCSS(){
		$str = '';
		foreach($this->css as $css){
			$str .= '
			<link rel="stylesheet" type="text/css" href="'.$css['link'].'" media="'.$css['media'].'" />
			';
		}
		return $str;
	}
 	
	/*public function print_css_header(){
		echo $this->getCSS();	
	}*/
/**
 * PluginManager#getScript() -> String
 *
 * `final` Cette méthode retourne les balises script enregistrées avec la méthode [[PluginManager.addSCript]].
 **/
 	public function getScript(){
		$str = '';
		foreach($this->script as $script){
			$str .= '
			<script type="text/javascript" src="'.$script['link'].'"></script>
			';
		}
		return $str;
	}
/**
 * PluginManager.printScript() -> void
 *
 * `final` Cette méthode affiche les balises script enregistrées avec la méthode [[PluginManager.addSCript]].
 **/
	public function printScript(){
		echo $this->getScript();	
	}
	
	/*public function print_script_header(){
		foreach($this->script as $script){
			echo '
			<script type="text/javascript" src="'.$script['link'].'"></script>
			';
		}
	}*/
/**
 * PluginManager#printTags() -> Array
 *
 * `final` Cette méthode affiche les balises enregistrées avec la méthode [[PluginManager.addTags]].
 **/	
	public function printTags(){
		foreach($this->tags as $tag){
			echo $tag."\n";
		}
	}
/**
 * PluginManager#setCurrent(key) -> void
 * - key (String): Nom du dossier du plugin.
 *
 * `final` Cette méthode place le pointeur sur le plugin ciblé par `key`.
 **/
	public function setCurrent($key){
		if(!isset($this->Array[$key])) return false;
		
		reset($this->Array);
		
		while(key($this->Array) != $key && each($this->Array)) continue;
	}
	/**
	 * @Retourne les informations d'un plugins en fonction de sa clef
	 * @param key : Clef du plugin
	 * @return Information du plugin
	 */
	public function get($key){
		return $this->Array[$key];
	}
	/**
	 * Retourne la liste des plugins
	 * @return Tableau des plugins
	 */
	public function gets(){
		return $this->Array;
	}		
}
endif;
?>