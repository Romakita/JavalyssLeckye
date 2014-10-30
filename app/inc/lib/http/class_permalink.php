<?php
/** section: Library
 * class Permalink
 *
 * Cette classe gère l'acquisition d'un permalien. Un permalien est composé de trois éléments HOST + METALIEN + GET comme suivant :
 * 
 * Si on prend le permalien `http://javalyss.fr/mon/meta/lien?param=get` on obtient :
 *
 * * HOST : http://javalyss.fr
 * * METALIEN : /mon/meta/lien
 * * GET : param=get
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_permalink.php
 * * Version : 1.1
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('Permalink')):
class Permalink{
	private static $URI_PATH = 	'';
/**
 * Permalink#uri -> String
 * (protected)
 **/	
	protected $uri = 			'';
/**
 * Permalink.Permalink -> Permalink
 * (protected) Instance permalien.
 **/	
	protected static $Permalink = NULL;
/**
 * Permalink.NbPostPerPage -> Number
 * Nombre d'item par page pour la pagination.
 **/
	static $NbPostPerPage =		5;
/**
 * Permalink#https -> Boolean
 * (private) Indique si le lien est de type https.
 **/	
	private $https =			false;
/**
 * new Permalink()
 * new Permalink(link)
 * - link (String): Lien sur lequel doit travailler l'instance.
 *
 * Cette méthode créée une nouvelle instance [[Permalink]] 
 **/
 	function __construct($uri = NULL){
		
		if(defined('URI_PATH')){
			self::$URI_PATH = URI_PATH;
		}else{
			$dir = 	dirname($_SERVER['SCRIPT_NAME']).'/';
			$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
			$base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME'].$dir);
			self::$URI_PATH = $base;
		}

		if(is_string($uri)){
			$this->setUri($uri);
		}else{
			
			if(!is_string(self::$Permalink)){
				$this->setUri(self::RequestURI());
				self::$Permalink = $this->uri;
			}
			
			$this->uri = self::$Permalink;
		}	
	}
/**
 * Permalink.ToABS(httplink) -> String
 *
 * Cette méthode retourne le chemin absolue.
 **/	
	public static function ToABS($link){	
		
		if(defined('URI_PATH')){
			self::$URI_PATH = URI_PATH;
		}else{
			$dir = 	dirname($_SERVER['SCRIPT_NAME']).'/';
			$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
			$base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME'].$dir);
			self::$URI_PATH = $base;
		}
		
		$link = new Permalink($link);
		$http = $link->https ? 'https://' : 'http://';
		
		$array = array(
			self::$URI_PATH, 
			str_replace('www.', '', self::$URI_PATH), 
			str_replace($http, $http.'www.', self::$URI_PATH) 
		);
			
		return str_replace($array, ABS_PATH, $link);
	}
/**
 * Permalink.ToRel(httplink) -> String
 *
 * Cette méthode retourne le chemin relatif à la racine du site d'un lien.
 **/
 	public static function ToRel($link){
		if(defined('URI_PATH')){
			self::$URI_PATH = URI_PATH;
		}else{
			$dir = 	dirname($_SERVER['SCRIPT_NAME']).'/';
			$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
			$base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME'].$dir);
			self::$URI_PATH = $base;
		}
		
		$link = new Permalink($link);
		$http = $link->https ? 'https://' : 'http://';
		
		$array = array(
			self::$URI_PATH, 
			str_replace('www.', '', self::$URI_PATH), 
			str_replace($http, $http.'www.', self::$URI_PATH) 
		);
			
		return str_replace($array, '', $link);
	}
/**
 * Permalink#clean() -> String
 *
 * Cette méthode nettoie le lien.
 **/	
	public function clean(){
		
		$this->https = $this->strStart('https://');
		
		//suppression des paramètres GET
		$this->uri = explode('?', $this->uri);
		$this->uri = $this->uri[0];	
					
		//suppression du slashe de fin.	
		if($this->strEnd('/')){
			$this->uri = 	substr($this->uri, 0, strlen($this->uri) - 1);	
		}
		
		//suppression des doubles slashes
		$this->uri = trim($this->https ? 'https://' : 'http://') . str_replace(array('https://', 'http://', '//'), array('', '', '/'), $this->uri);
		
		return $this->uri;
	}
/**
 * Permalink#strStart(needle [, host = true]) -> Boolean
 * - needle (String): Sous-chaine à rechercher.
 * - host (String): Si la valeur est à `false` la comparaison se fera sans la partie HOST du lien.
 *
 * Cette méthode determine si le permalien commence bien par la sous-chaine `needle`.
 **/	
	public function strStart($needle, $host = true){
		$len = strlen($needle);
		
		$uri = $host ? $this->uri : $this->getMetaLink();
		
		if($len > strlen($uri)){
			return false;	
		}
		
		return substr_compare($uri, $needle, 0, $len) == 0;
	}
/**
 * Permalink#strEnd(needle) -> Boolean
 * - needle (String): Sous-chaine à rechercher.
 *
 * Cette méthode determine si le permalien fini bien par la sous-chaine `needle`.
 **/	
	public function strEnd($needle){
		$len = strlen($needle);
		
		if($len > strlen($this->uri)){
			return false;	
		}
		return substr_compare($this->uri, $needle, -$len, $len) == 0;
	}
/**
 * Permalink#contain(needle) -> Boolean
 * - needle (String): Sous-chaine à rechercher.
 *
 * Cette méthode determine si le permalien contient la sous-chaine `needle`.
 **/	
	public function contain($needle){
		return strpos($this->uri, $needle) !== false;
	}
	
	public function contains($needle){
		return strpos($this->uri, $needle) !== false;
	}
/**
 * Permalink#equals(uri) -> Boolean
 * - uri (String | Permalink): Lien à comparer.
 *
 * Cette méthode compare deux liens.
 **/	
	public function equals($uri){
		
		if($uri instanceof Permalink){
			return $this->uri == $uri.'';	
		}
		
		return $this->uri == $uri;
	}
/**
 * Permalink#match(pattern [, matches = null [, flags = 0 [, offset = 0]]]) -> Boolean
 * - pattern (String): Sous-chaine à rechercher.
 * - matches (Array): Si matches est fourni, il sera rempli par les résultats de la recherche. matches\[0\] contiendra le texte qui satisfait le masque complet, $matches\[1\] contiendra le texte qui satisfait la première parenthèse capturante, etc. 
 * 
 * Expression rationnelle standard.
 **/
	public function match($pattern, &$matches = NULL, $flags = 0, $offset = 0){
		return preg_match($pattern, $this->uri, $matches, $flags, $offset);
	}
/**
 * Permalink#isIndex() -> Boolean
 *
 * Cette méthode indique si le permalien correspond à la page d'index.
 **/	
	public function isIndex(){
		if($this->equals(self::$URI_PATH.'index.php')) return true;
		if($this->equals(self::$URI_PATH)) return true;
				
		return str_replace('www.', '', $this->uri.'/') == str_replace('www.', '', self::$URI_PATH);	
	}
/**
 * Permalink#getParameters() -> Array
 * Cette méthode retourne les paramètres du lien sous forme de tableau.
 **/	
	public function getParameters(){
		return explode('/', $this->getMetaLink());
	}
/**
 * Permalink#getMetaLink() -> String
 * Cette méthode retourne les paramètres du lien.
 **/	
	public function getMetaLink(){
		$uri = 	str_replace(array('https://', 'http://'), '', strtolower($this->uri));
		$base = str_replace(array('https://', 'http://'), '', strtolower(self::$URI_PATH));
		
		return str_replace($base, '', $uri);
	}
/**
 * Permalink.Parameters() -> Array
 * Cette méthode retourne les paramètres du lien sous forme de tableau.
 **/	
	public static function Parameters(){
		return explode('/', self::MetaLink());
	}
/**
 * Permalink.MetaLink() -> String
 * Cette méthode retourne les paramètres du lien.
 **/	
	public static function MetaLink(){
		$uri = 	str_replace(array('https://', 'http://'), '', strtolower(new Permalink()));
		$base = str_replace(array('https://', 'http://'), '', strtolower(self::$URI_PATH));
		
		return str_replace($base, '', $uri);
	}
		
	public static function Get(){
		return new self();
	}
/**
 * Permalink.RequestURI() -> String
 * 
 * `static` Cette méthode retourne l'adresse URL + METALIEN + GET non nettoyé demandée par le client 
 **/	
	public static function RequestURI(){
		return (@$_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	}
	
	public static function IsHTTPS(){
		return isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on';
	}
	
	public function https(){
		return $this->https = $this->strStart('https://');	
	}
/**
 * Permalink#getURI() -> String
 * 
 * `static` Cette méthode retourne le permalien.
 **/	
	public function getURI(){
		return $this->uri;
	}
/**
 * Permalink#setURI(uri) -> void
 * - uri (String): Lien à manipuler.
 *
 * `static` Cette méthode retourne le permalien.
 **/	
	public function setUri($uri){
		if(is_string($uri)){
			$this->uri =  rawurldecode($uri);
			$this->clean();
		}
	}
/**
 * Permalink.GetPage() -> Number
 * 
 * `static` Cette méthode retourne le numéro de page demandé.
 **/	
	public static function GetPage(){
		
		if(preg_match('/page\/([0-9]*)\//', self::Get().'/', $match)){
			return $match[1]-1;
		}
		
		return 0;
	}
/**
 * Permalink.GetOrder() -> Array | Boolean
 * Permalink.GetOrder(replace [, default]) -> String
 * 
 * `static` Cette méthode retourne l'ordre de tri demandé.
 **/	
	public static function GetOrder($assoc = NULL, $default = ''){
		
		if(preg_match('/order\/([a-z]*)\/(down|up)\//', self::Get().'/', $match)){
			if(is_array($assoc)){
				if(!empty($assoc[$match[1]]) && !empty($assoc[$match[2]])){
					return $assoc[$match[1]]. ' '.$assoc[$match[2]];
				}
				
				return $default;
			}
			
			return array($match[1], $match[2]);
		}
		
		return $default;
	}
/**
 * Permalink.GetPaging() -> Array | Boolean
 * Permalink.GetPaging(replace) -> String
 * 
 * `static` Cette méthode retourne le nombre d'élément à afficher par page.
 **/	
	public static function GetPaging($default = 10){
	
		if(preg_match('/by\/([0-9]*)\//', self::Get().'/', $match)){
			if(is_numeric($match[1])) return (int) $match[1];
		}
		
		return $default;
	}
/**
 * Permalink.DrawPaging() -> String
 **/	
	public static function DrawPaging($options){
		
		if(is_array($options)){
			$o =			new stdClass();
			$o->current = 	0;
			
			foreach($options as $key => $value){
				$o->$key = $value;
			}
			
			$options = $o;	
		}
		
		if(empty($options->length)){
			return '';
		}
		
		if(empty($options->pagination)){
			$options->pagination = 	self::GetPaging(self::$NbPostPerPage);
		}
		
		if(empty($options->current)){	
			$options->current =		self::GetPage();
		}
		
		if(empty($options->offset)){	
			$options->offset =		10;
		}
		
		if(empty($options->link)){
			$options->link =	self::Get().'/';
		}else{
			$options->link .=	'/';
		}
		
		$paginations = 	'';
		$get = 			'';
		$pasoffset = 	10;
		
		if(isset($_GET['search'])){
			$get = '?search='.$_GET['search'];
		}
		
		if($options->length > $options->pagination){
						
			$pages = ceil($options->length / $options->pagination);
				
			if(preg_match('/page\/([0-9]*)\//', $options->link, $match)){
				$options->link = 	str_replace($match[0], '', $options->link);
			}		
			
			$offsetend = 	0;
			$offsetstart = 	0;
			$markerend = 	false;
			
			for($i = 0; $i < $pages; $i++){
				
				if($pages > 20){
					
					/*if($current  - $pasoffset * 4 < $i && $i > 2){
						continue;	
					}*/
					
					if(!($options->current - 1 < $i && $i < $options->current + 4)){						
						if( $i % $pasoffset != $pasoffset-1){
							continue;
						}
						
						if($i < $options->current - $pasoffset * 3){
							//$offsetstart++;
							
							continue;
						}
						
						
						if($options->current + 4 <=$i ){
							$offsetend++;
							
							if($offsetend > 3 && !($pages - $pasoffset * 3 < $i) ){
							
								if(!$markerend	){
									$markerend = true;
									$button = 		'<span class="box-simple-button"><a href="' . $options->link.'page/'.($i+1).'/'.$get .'">...</a></span>';
									$paginations .= $button.'';	
								}
								
								continue;	
							}
						}
						
						
					}
				}
				
				if($i == $options->current){
					$button = '<span class="box-simple-button selected"><a href="#">'.( $i+1). '</a></span>';
					$paginations .= $button.'';
					continue;
				}
				
				$button = '<span class="box-simple-button"><a href="' . $options->link.'page/'.($i+1).'/'.$get .'">'.( $i+1). '</a></span>';
				$paginations .= $button.'';
				
				
			}
			
			if($options->current == 0){
				$button = '<span class="box-simple-button button-next"><a href="' . $options->link.'page/'.($options->current + 2).'/'.$get .'">'. MUI('Suivant'). '</a></span>';
				$paginations .= $button.'';
				
			}elseif($options->current == $pages-1){
				
				$button = 		'<span class="box-simple-button button-previous"><a href="' . $options->link.'page/'.($options->current).'/'.$get .'">'. MUI('Précèdent'). '</a></span>';
				$paginations = $button.$paginations;
				
			}else{
				if($pages > 20 && $options->current > 0){
					$button = 		'<span class="box-simple-button button-previous"><a href="' . $options->link.'page/'.$options->link.'page/1/'.$get .'">1</a></span>';
					$paginations = $button.$paginations;
				}
				
				$button = 		'<span class="box-simple-button button-previous"><a href="' . $options->link.'page/'.($options->current).'/'.$get .'">'. MUI('Précèdent'). '</a></span>';
				$paginations = $button.$paginations;
								
				$button = '<span class="box-simple-button button-next"><a href="' . $options->link.'page/'.($options->current + 2).'/'.$get .'">'. MUI('Suivant'). '</a></span>';
				$paginations .= $button.'';
			}
			
			if(!empty($options->before)){
				$paginations = $options->before.$paginations;
			}
			if(!empty($options->after)){
				$paginations = $paginations.$options->after;
			}
		}
		
		return $paginations;
	}
/**
 * Permalink.Host() -> String
 *
 * Cette méthode retourne le nom d'hôte du site.
 **/	
	public static function Host($default = ''){
		
		if(strpos(self::$URI_PATH, '127.0.0.1') !== false && $default != ''){
			return $default;
		}
		
		return str_replace(array('http://', 'https://', 'www'), '', self::$URI_PATH);
	}
/**
 * Permalink#toString() -> String
 * 
 * Cette méthode retourne le permalien sous forme de chaine de caractère.
 **/
	function __toString(){
		return ''.self::$Permalink;	
	}
}
endif;
?>