<?php
/** section: jGalery
 * class jGalery
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_jgalerie.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class jGalery extends ObjectTools{	
	const PRE_OP =				'jgalery.';
/**
 * jGalery.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'jgaleries';	
/**
 * jGalery.PRIMARY_KEY -> String
 * Clef primaire de la table jGalery.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Galery_ID';
/**
 * jGalery#Galery_ID -> Number
 **/
	public $Galery_ID = 0;
/**
 * jGalery#User_ID -> Number
 **/
	public $User_ID = 0;
/**
 * jGalery#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * jGalery#Settings -> String
 * Text
 **/
	public $Settings = "";
/**
 * jGalery#Private -> Number
 **/
	public $Private = 0;
/**
 * jGalery#Password -> String
 * Varchar
 **/
	public $Password = "";
/**
 * jGalery#Type -> String
 * Varchar
 **/
	public $Type = "brickarray";
/**
 * new jGalery()
 * new jGalery(json)
 * new jGalery(array)
 * new jGalery(obj)
 * new jGalery(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[jGalery]].
 * - array (Array): Tableau associatif équivalent à une instance [[jGalery]]. 
 * - obj (Object): Objet équivalent à une instance [[jGalery]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[jGalery]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				//echo $request->compile();
				if($u['length']){
					$this->extend($u[0]);
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
	}
/**
 * jGalery.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array('jGalery', 'exec'));
		System::Observe('gateway.exec.safe', array('jGalery', 'execSafe'));
		
		System::observe('plugin.active', array('jGalery','Active'));
		System::observe('plugin.deactive', array('jGalery','Deactive'));
		
		System::observe('blog:startinterface', array('jGalery','onStartInterface'));
		System::Observe('blog:post.build', array('jGalery', 'onBuildPost'));
	}
/**
 * jGalery.onStartInterface() -> void
 **/
	public static function onStartInterface(){
		
		//on liste les librairies utilisées
		
		$list = self::Distinct('Type');
		
		Blog::EnqueueScript('prototype');
		Blog::EnqueueScript('jquery');
		
		Blog::EnqueueScript('extends', '', 'lang=fr');
		Blog::EnqueueScript('window');
		
		for($i = 0; $i < $list['length']; $i++){
			switch($list[$i]['text']){
				
				case 'jcarousel':
					Blog::EnqueueScript('jquery.migrate');
					Blog::EnqueueScript('jgalery.jcarousel', JGALERY_URI.'js/lib/jquery.jcarousel.js');	
					Blog::ImportCSS(JGALERY_URI.'css/lib/jcarousel/tango/skin.css');
					Blog::ImportCSS(JGALERY_URI.'css/lib/jcarousel/ie7/skin.css');
					
					break;
					
				case 'nivoslider':
					
					Blog::EnqueueScript('jgalery.nivoslider', JGALERY_URI.'js/lib/jquery.nivo.slider.min.js');
					Blog::ImportCSS(JGALERY_URI.'css/lib/nivoslider/default/default.css');
					Blog::ImportCSS(JGALERY_URI.'css/lib/nivoslider/light/light.css');
					Blog::ImportCSS(JGALERY_URI.'css/lib/nivoslider/dark/dark.css');
					Blog::ImportCSS(JGALERY_URI.'css/lib/nivoslider/bar/bar.css');
					Blog::ImportCSS(JGALERY_URI.'css/lib/nivoslider/nivo-slider.css');
								
					break;
				
				case 'brickarray':
					
					Blog::EnqueueScript('jgalery.galerybrick', JGALERY_URI.'js/lib/window.galerybrick.js');
					Blog::ImportCSS(JGALERY_URI.'css/lib/galerybrick/window.galery.css');
							
					break;
			}
		}
	}
/**
 * jGalery.onBuildPost() -> void
 **/	
	public static function onBuildPost(){
		
		preg_match_all('/\[jgalery\](.*?)\[\/jgalery\]/', Post::Content(), $match);
		
		if(!empty($match)){
			for($i = 0; $i < count($match[0]); $i++){
				
				preg_match('/\[name\](.*?)\[\/name\]/', $match[1][$i], $name);
							
				if(!empty($name)){
					$name = $name[1];
				}else{
					$name = $match[1][$i];
				}
								
				if(empty($name)){//liste des galeries enfants si possible
					$clauses = new stdClass();
					$clauses->order = 'Menu_Order ASC, Title';
					
					
					$posts = Post::Children($clauses);
					$array = array();
									
					for($y = 0; $y < $posts['length']; $y++){
						$post = $posts[$y];
						
						preg_match_all('/\[jgalery\](.*?)\[\/jgalery\]/', $post['Content'], $match_);
						
						if(!empty($match_)){
							
							for($x = 0; $x < count($match_[0]); $x++){
								
								preg_match('/\[name\](.*?)\[\/name\]/', $match_[1][$x], $name);
								
								if(!empty($name)){
									$name = $name[1];
								}else{
									$name = $match_[1][$i];
								}
								
								if(is_numeric($name)){
									$galery = new self((int) $name);
								}else{
									$galery = self::ByName(html_entity_decode($name));
								}
								
								if(!empty($name)){
									array_push($array, $galery);
								}
								
							}							
						}
					}
					
					Post::Content(str_replace($match[0][$i], (string) BrickArray::DrawArray($array), Post::Content()));
					
				}else{
				
					if(is_numeric($name)){
						$galery = new self((int) $name);
					}else{
						$galery = self::ByName(html_entity_decode($name));
					}
					
					//récupération du type
					switch($galery->Type){
						case 'jcarousel':
							$o = new jCarousel($galery);
							break;
						default:
						case 'brickarray':
							$o = new BrickArray($galery);
							break;
						case 'nivoslider':
							$o = new NivoSlider($galery);
							break;
					}
					
					Post::Content(str_replace($match[0][$i], (string) $o, Post::Content()));
				}
			}
		}
		
	}
/**
 * jGalery.Active() -> void
 *
 * Cette méthode active l'extension.
 **/	
	public static function Active(){
		self::Install();
		jPicture::Install();	
	}
/**
 * jGalery.Deactive() -> void
 *
 * Cette méthode désinstalle l'extension.
 **/	
	public static function Deactive($erase = false){
		if($erase){
			//$request->query = 	"Drop TABLE	
		}
	}
/**
 * jGalery.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".self::TABLE_NAME." (
		  	`Galery_ID` int(2) NOT NULL AUTO_INCREMENT,
			`User_ID` bigint(20) NOT NULL DEFAULT '0',
			`Name` varchar(255) NOT NULL,
			`Type` varchar(100) NOT NULL DEFAULT 'jcarousel',
			`Settings` text NOT NULL,
			`Private` tinyint(1) NOT NULL DEFAULT '0',
			`Password` varchar(20) NOT NULL,
		  	PRIMARY KEY (`Galery_ID`)
		) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
		
		$request->query = 	"ALTER TABLE ".self::TABLE_NAME." CHANGE `Carousel_ID` `Galery_ID` INT( 2 ) NOT NULL AUTO_INCREMENT";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE ".self::TABLE_NAME." ADD `Private` BOOLEAN NOT NULL DEFAULT '0' AFTER `Settings` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE ".self::TABLE_NAME." ADD `Password` VARCHAR( 20 ) NOT NULL AFTER `Private`";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE ".self::TABLE_NAME." ADD `Type` varchar(100) NOT NULL DEFAULT 'jcarousel' AFTER `Name`";
		$request->exec('query');
		
	}
/**	
 * jGalery#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Name == ''){
			return false;
		}
		
		if ($this->Galery_ID == 0){
			
			if($this->exists()){
				return false;
			}
			
			$this->User_ID = User::Get()->User_ID;
			
			$request->fields = 	"`User_ID`,
								`Name`,
								`Settings`,
								`Private`,
								`Password`,
								`Type`";
			$request->values = 	"'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString(is_object($this->Settings) ? json_encode($this->Settings) : $this->Settings)."',
								'".Sql::EscapeString($this->Private)."',
								'".Sql::EscapeString($this->Password)."',
								'".Sql::EscapeString($this->Type)."'";
			
			
			if($request->exec('insert')){
				$this->Galery_ID = $request->exec('lastinsert');
				
				$this->mkDir();
				
				return true;
			}
			
			return false;
		}
		
		if($this->User_ID == 0){
			$this->User_ID = User::Get()->User_ID;	
		}
		
		$this->mkDir();
				
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`User_ID` = '".Sql::EscapeString($this->User_ID)."',
								`Name` = '".Sql::EscapeString($this->Name)."',
								`Settings` = '".Sql::EscapeString(is_object($this->Settings) ? json_encode($this->Settings) : $this->Settings)."',
								`Private` = '".Sql::EscapeString($this->Private)."',
								`Password` = '".Sql::EscapeString($this->Password)."',
								`Type` = '".Sql::EscapeString($this->Type)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Galery_ID."'";
		//print $request->compile('update');
		return $request->exec('update');
	}
/**
 * jGalery#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Galery_ID."' ";
		
		return $request->exec('delete');
	}
/**
 * jGalery#mkDir() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function mkDir(){
		Stream::MkDir(System::Path('publics') . 'jgalery/', 0755);
		Stream::MkDir($this->path(), 0755);
	}
/**
 * jGalery#path() -> String
 *
 * Cette méthode retourne le chemin absolue du dossier de la galerie.
 **/	
	public function path(){
		return System::Path('publics') . 'jgalery/' . $this->Galery_ID . '/';
	}
/**
 * jGalery#uri() -> String
 *
 * Cette méthode retourne le chemin http du dossier de la galerie.
 **/	
	public function uri(){		
		return System::Path('publics', true) . 'jgalery/' . $this->Galery_ID . '/';	
	}
/**
 * jGalery#getPictures() -> Array
 *
 * Cette méthode retourne la liste des photos contenues dans la galerie.
 **/	
	public function getPictures(){
		$options =	new stdClass();
		$options->Galery_ID = $this->Galery_ID;
		return jPicture::GetList($options, $options);
	}
/**
 * jGalery#getSettings() -> Object
 *
 * Cette méthode retourne la configuration d'une galerie.
 **/	
	public function getSettings($options = NULL){
		$settings = is_object($this->Settings) ? $this->Settings : json_decode($this->Settings);
		
		if(is_object($options)){
			foreach($options as $key => $value){
				if(isset($settings->$key)){
					$options->$key = $settings->$key;	
				}
				
			}
			
			$settings = $options;
		}
		
		return $settings;	
	}
/**
 * jGalery.ByName(name) -> jCarousel
 * - name (String): Nom du carrousel.
 *
 * `final` `static` Cette méthode récupère les informations d'un carrousel à partir de son nom.
 **/	
	static function ByName($name){
		
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"Name  = '".Sql::EscapeString($name)."'";
		$request->limits = 	'0,1';
		
		$u = $request->exec('select');
		
		if($u['length'] == 0) {//creation automatique
			$o = 				new self();
			$o->Name = 			$name;
			$o->Settings =		new stdClass();	
			$o->commit();
		}else{
			
			$o = new self($u[0]);
			
			switch($o->Type){
				case 'jcarousel':
					$o = new jCarousel($o);
					
					break;
				case 'brickarray':	
					$o = new BrickArray($o);
					break;	
				case 'nivoslider':	
					$o = new NivoSlider($o);
					break;
			}
		}
		
		return $o;
	}
/**
 * jGalery.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."commit":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP."delete":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->delete()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."exists":
				
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->exists());
				
				break;
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."list":
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
			
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."print":
			
				$_POST['clauses']->limits ='';
				
				$pdf = self::PrintList($_POST['clauses'], $_POST["options"]);
				
				if(!$pdf){
					return $op.'.err';	
				}
				
				@Stream::MkDir(System::Path('prints'), 0777);
				$link = System::Path('prints') . str_replace('.', '-', self::PRE_OP) . 'list-' . date('ymdhis') .'.pdf';
				@unlink($link);
				$pdf->Output($link, 'F');
				
				echo json_encode(str_replace(ABS_PATH, URI_PATH, $link));
				
				break;
		}
		
		return 0;	
	}
/**
 * jGalery.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * jGalery#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Galery_ID." AND Name = '".Sql::EscapeString($this->Name)."'") > 0;
	}
/**
 * jGalery.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct " . Sql::EscapeString($field) ." as text";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
							
		if(!empty($word)){
			$request->where .= ' 
				AND '.Sql::EscapeString($field)." LIKE '". Sql::EscapeString($word)."%'";
		}
		
		$request->where .= 	" AND TRIM(".Sql::EscapeString($field).") != ''";
		$request->order =	Sql::EscapeString($field);
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 * jGalery.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des instances en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * Pas d'options.
 *
 **/	
	public static function GetList($clauses = '', $options = ''){
				
		$request = 			new Request();
		
		$request->select = 	'G.*, TRIM(CONCAT(FirstName," ", U.Name)) as Author';
		$request->from = 	self::TABLE_NAME . ' G LEFT JOIN ' . User::TABLE_NAME . ' U ON G.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY;
		$request->where =	' Private = 0 '; 
		$request->order = 	'G.Name ASC';
		$request->onexec = 	array('jGalery', 'onGetList');
		
		switch(@$options->op){
			default:
				
				break;
				
			case '-owner':
				if(User::Get()->getRight() == 1){
					$request->where = ' ( G.' . User::PRIMARY_KEY . ' = ' . ((int) User::Get()->User_ID ). ' OR  G.' . User::PRIMARY_KEY . ' = 1) ';
				}
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, G.Name as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Carousel_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`FirstName` like '%".Sql::EscapeString($clauses->where)."%' OR
								U.`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								G.`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								)";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
				
		$result = $request->exec('select', $request->onexec);
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row){
		
		
	
	}
/**
 * jGalery.
 **/	
	public function __toString(){
		return '';
	}
}

jGalery::Initialize();

?>