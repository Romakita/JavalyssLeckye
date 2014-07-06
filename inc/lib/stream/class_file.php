<?php
/** section: Library
 * class File
 * Cette classe gère les informations d'un fichier ou d'un dossier.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_file.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('File')):

class File{
/**
 * File#childs -> Array
 * Liste des fichiers et dossiers enfants.
 **/
	public $childs;
/**
 * File#link -> String
 **/
	public $link;
/**
 * File#nlink -> String
 **/
	public $nlink;
/**
 * File#name -> String
 **/
	public $name;
/**
 * File#extension -> String
 **/
	public $extension;
/**
 * File#dev -> String
 **/
	public $dev;
/**
 * File#mode -> int
 **/
	public $mode;
/**
 * File#uid -> int
 **/
	public $uid;
/**
 * File#gid -> int
 **/
	public $gid;
/**
 * File#size -> int
 **/
	public $size;
/**
 * File#ino -> int
 **/
	public $ino;
/**
 * File#atime -> int
 **/
	public $atime;
/**
 * File#mtime -> int
 **/
	public $mtime;
/**
 * File#ctime -> int
 **/
	public $ctime;
	
	public $ATime;
	public $MTime;
	public $CTime;
	
	private static $URI_PATH = NULL;
/**
 * new File()
 *
 * Cette méthode créée une nouvelle instance de File.
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs >= 1){
				if(is_file($arg_list[0])){
					$this->setLink($arg_list[0]);
					
					if($numargs == 2 && $arg_list[1]){
						$this->link = utf8_encode($this->link);	
						$this->name = utf8_encode($this->name);	
					}
					
				}elseif(is_dir($arg_list[0])){
					$this->setLink($arg_list[0]);
				}elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
				elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
				elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);
		}
	}
/**
 * File#isDir() -> bool
 * 
 * Indique si l'instance [[File]] est un dossier.
 **/	
	public function isDir(){
		return !$this->extension;
	}
/**
 * File#setLink(link) -> void
 * - link (String): Lien du fichier.
 *
 * Assigne le lien du fichier et récupère ses informations.
 **/	
	public function setLink($link){

		if(is_file($link)){
			$this->link = 		$link;
			//$this->setArray();
			$stat = lstat($this->link);
			
			$this->dev = 	$stat["dev"];
			$this->mode = 	$stat["mode"];
			$this->nlink = 	$stat["nlink"];	
			$this->uid = 	$stat["uid"];
			$this->gid = 	$stat["gid"];
			$this->size = 	$stat["size"];
			$this->ino = 	$stat["ino"];
			$this->atime = 	$stat["atime"];
			$this->mtime = 	$stat["mtime"];
			$this->ctime = 	$stat["ctime"];
			$this->ATime = 	date('Y-m-d h:i:s', $stat["atime"]);
			$this->MTime = 	date('Y-m-d h:i:s', $stat["mtime"]);
			$this->CTime =  date('Y-m-d h:i:s', $stat["ctime"]);
			
			$this->name = 		Stream::FileName($this->link);
			$this->extension = 	Stream::Extension($this->link);
		}
		if(is_dir($link)){
			
			$this->link = 		$link;
			$this->name = 		str_replace(dirname($this->link).'/', '', $this->link);
			$this->extension = 	false;
			
			$stat = lstat($this->link);
			
			$this->dev = 	$stat["dev"];
			$this->mode = 	$stat["mode"];
			$this->nlink = 	$stat["nlink"];	
			$this->uid = 	$stat["uid"];
			$this->gid = 	$stat["gid"];
			$this->size = 	$stat["size"];
			$this->ino = 	$stat["ino"];
			$this->atime = 	$stat["atime"];
			$this->mtime = 	$stat["mtime"];
			$this->ctime = 	$stat["ctime"];
			$this->ATime = 	date('Y-m-d h:i:s', $stat["atime"]);
			$this->MTime = 	date('Y-m-d h:i:s', $stat["mtime"]);
			$this->CTime =  date('Y-m-d h:i:s', $stat["ctime"]);
		}
	}
/** aliasof: Stream.Rename
 * File#rename(newname) -> void
 * - newname (String): Nouveau nom du fichier.
 * 
 * Cette méthode tente de renommer le nom de l'instance.
 **/
	public function rename($link){
		$this->link = Stream::Rename($this->link, $link);
	}
/** aliasof: Stream.Copy
 * File#copy(link) -> File
 * - link (String): Lien du nouveau fichier copié.
 * 
 * Cette méthode crée une copie du fichier et de l'instance.
 **/
	public function copy($link, $erase = false){
		$link = Stream::Copy($this->link, $link, $erase);
		return new File($link);
	}
/** aliasof: Stream.Write
 * File#write(content) -> bool
 * - content (String): Contenu à écrire dans le fichier.
 * 
 * Cette méthode écrit le contenu `content` dans le fichier [[File]].
 **/
	public function write($content){
		return Stream::Write($this->link, $content);
	}
/** aliasof: Stream.Read
 * File#read() -> String
 * - content (String): Contenu à écrire dans le fichier.
 * 
 * Cette méthode lit le contenu `content` dans le fichier [[File]].
 **/
	public function read(){
		return Stream::Read($this->link);
	}
/**
 * File#getLink() -> String
 * 
 * Cette méthode retourne le lien du fichier sur le serveur.
 **/
	public function getLink(){
		return $this->link;	
	}
/**
 * File#getExtension() -> String
 * 
 * Cette méthode retourne l'extension de l'instance si il  s'agit d'un fichier, false dans le cas d'un dossier.
 **/
	public function getExtension(){
		return $this->extension;
	}
/**
 * File#getName() -> String
 *
 * Cette méthode retourne le nom du fichier.
 **/
	public function getName(){
		return $this->name;	
	}
/**
 * File#getSize() -> int
 *
 * Cette méthode retourne la taille du fichier en bit.
 **/
	public function getSize(){
		return $this->size;	
	}
/**
 * File#toJSON() -> String
 *
 * Cette méthode retourne l'instance au format JSON.
 **/
	public function toJSON(){
		return json_encode($this->toObject());
	}
/**
 * File#evalJSON(json) -> void
 * - json (String): Chaine de caractère au format JSON.
 *
 * Cette méthode évalue la chaine `json` et restaure les informations du fichier.
 **/
	public function evalJSON($json){

		$json = json_decode(stripslashes($json));
		
		foreach($this as $key=>$value){
			@$this->$key = rawurldecode(@$json->$key);
		}
		
	}
/**
 * File#toObject() -> Object
 *
 * Cette méthode retourne un objet anonyme équivalent à l'instance.
 **/
	public function toObject(){
        $obj = new stdClass();
		foreach($this as $key=>$value){
			$obj->$key = $value;
		}
		return @$obj;
	}
/**
 * File#toObject() -> Object
 *
 * Cette méthode retourne un tableau associatif équivalent à l'instance.
 **/
	public function toArray(){
        $obj = array();
		foreach($this as $key=>$value){
			$obj[$key] = $value;
		}
		return @$obj;
	}
/**
 * File#setObject(obj) -> Object
 * - obj (Object): Objet anonyme contenant les informations d'un fichier.
 *
 * Cette méthode copie les attributs d'un objet vers l'instance.
 **/
	public function setObject($obj){
		foreach($this as $key=>$value){
			$this->$key = rawurldecode(@$obj->$key);
		}
	}
/**
 * File#setArray(array) -> Object
 * - array (array): Tableau associatif.
 *
 * Cette méthode copie les données du tableau associatif vers l'instance.
 **/
	public function setArray($obj){
		foreach($this as $key=>$value){
			$this->$key = rawurldecode(@$obj[$key]);
		}
	}
/**
 * File#strStart(needle) -> Boolean
 * - needle (String): Sous-chaine à rechercher.
 *
 * Cette méthode determine si le permalien commence bien par la sous-chaine `needle`.
 **/	
	public function strStart($needle){
		$len = strlen($needle);
		
		$uri = $this->link;
		
		if($len > strlen($uri)){
			return false;	
		}
		
		return substr_compare($uri, $needle, 0, $len) == 0;
	}
/**
 * File#strEnd(needle) -> Boolean
 * - needle (String): Sous-chaine à rechercher.
 *
 * Cette méthode determine si le permalien fini bien par la sous-chaine `needle`.
 **/	
	public function strEnd($needle){
		$len = strlen($needle);
		
		if($len > strlen($this->link)){
			return false;	
		}
		return substr_compare($this->link, $needle, -$len, $len) == 0;
	}
/**
 * File#contain(needle) -> Boolean
 * - needle (String): Sous-chaine à rechercher.
 *
 * Cette méthode determine si le permalien contient la sous-chaine `needle`.
 **/	
	public function contain($needle){
		return strpos($this->link, $needle) !== false;
	}
/**
 * File#equals(uri) -> Boolean
 * - uri (String | Permalink): Lien à comparer.
 *
 * Cette méthode compare deux liens.
 **/	
	public function equals($uri){
		
		if($uri instanceof Link){
			return $this->link == $uri.'';	
		}
		
		return $this->link == $uri;
	}
/**
 * File#match(pattern [, matches = null [, flags = 0 [, offset = 0]]]) -> Boolean
 * - pattern (String): Sous-chaine à rechercher.
 * - matches (Array): Si matches est fourni, il sera rempli par les résultats de la recherche. matches\[0\] contiendra le texte qui satisfait le masque complet, $matches\[1\] contiendra le texte qui satisfait la première parenthèse capturante, etc. 
 * 
 * Expression rationnelle standard.
 **/
	public function match($pattern, &$matches = NULL, $flags = 0, $offset = 0){
		return preg_match($pattern, $this->link, $matches, $flags, $offset);
	}
/**
 * File#ToRel(link) -> String
 *
 * Cette méthode retourne le chemin relatif à la racine du site d'un lien.
 **/
 	public static function ToRel($link){
		
		$array = array(
			ABS_PATH,
			URI_PATH, 
			str_replace('https://', 'https://www.', URI_PATH),
			str_replace('http://', 'http://www.', URI_PATH),
			str_replace('www.', '', URI_PATH)
		);
			
		return str_replace($array, '', $link);
				
		return Permalink::ToRel(str_replace(ABS_PATH, '', $o));
	}
/**
 * File#ToAbs(link) -> String
 *
 * Cette méthode retourne le chemin absolu d'un lien.
 **/
 	public static function ToAbs($link){		
		return ABS_PATH.self::ToRel($link);	
	}
/**
 * File#ToUri(link) -> String
 *
 * Cette méthode retourne le chemin HTTP du lien.
 **/
 	public static function ToUri($link){
		return URI_PATH.self::ToRel($link);	
	}
/**
 * File#toString() -> String
 * 
 * Cette méthode retourne le permalien sous forme de chaine de caractère.
 **/
	function __toString(){
		return ''.self::ToAbs($this->link);	
	}
}
endif;
?>