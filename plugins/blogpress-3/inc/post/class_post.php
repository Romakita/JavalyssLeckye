<?php
/** section: Plugins
 * class Post 
 * includes ObjectTools
 *
 * Cette classe gère l'édition et la lecture des articles et pages enregistrés en base de données.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_post.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define("TABLE_POST", PRE_TABLE.'blogpress_posts');
class Post extends ObjectTools implements iClass{
	const PRE_OP =				'blogpress.post.';
/**
 * Post.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_POST;	
/**
 * Post.PRIMARY_KEY -> String
 * Clef primaire de la table Post.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Post_ID';
/**
 * Post.SECONDARY_KEY -> String
 * Clef secondaire de la table Post.TABLE_NAME gérée par la classe.
 **/	
	const SECONDARY_KEY = 		'Name';
/**
 * Post#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * Post#Parent_ID -> Number
 **/
	public $Parent_ID = 0;
/**
 * Post#User_ID -> Number
 **/
	public $User_ID = 1;
/**
 * Post#Category -> String
 * Varchar
 **/
	public $Category = 			'Non classé';
/**
 * Post#Title -> String
 * Text
 **/
	public $Title = "";
/**
 * Post#Title_Header -> String
 * Varchar
 **/
	public $Title_Header = "";
/**
 * Post#Picture -> String
 * Varchar
 **/
	public $Picture = "";
/**
 * Post#Content -> String
 * Longtext
 **/
	public $Content = "";
/**
 * Post#Summary -> String
 * Text
 **/
	public $Summary = "";
/**
 * Post#Keyword -> String
 * Text
 **/
	public $Keyword = "";
/**
 * Post#Date_Create -> Datetime
 **/
	public $Date_Create = NULL;
/**
 * Post#Date_Update -> Datetime
 **/
	public $Date_Update = NULL;
/**
 * Post#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * Post#Type -> String
 * Varchar
 **/
	public $Type = 'post';
/**
 * Post#Statut -> String
 * Varchar
 **/
	public $Statut = 'publish';
/**
 * Post#Comment_Statut -> String
 * Varchar
 **/
	public $Comment_Statut = 'close';
/**
 * Post#Template -> String
 * Varchar
 **/
	public $Template = "";
/**
 * Post#Menu_Order -> Number
 **/
	public $Menu_Order = 0;
/**
 * Post#Meta -> String
 * Text
 **/
	public $Meta = "";
	
	static $UnTree = 						false;
	protected static $Posts = 				false;
	protected static $MaxLength =		 	0;
	protected static $Post =				false;
	protected static $AllReadySetList = 	false;
	static $Cat =							false;
/**
 * new Post()
 * new Post(json)
 * new Post(array)
 * new Post(obj)
 * new Post(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[Post]].
 * - array (Array): Tableau associatif équivalent à une instance [[Post]]. 
 * - obj (Object): Objet équivalent à une instance [[Post]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Post]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs > 0){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request(DB_BLOGPRESS);
				
				$request->select = 	'P.*, U.Name AS AuthorName, U.FirstName, U.Login, U.Avatar, CONCAT(U.Name, \' \', U.FirstName) as Author';
				$request->from = 	self::TABLE_NAME . " AS P LEFT JOIN " . User::TABLE_NAME . " AS U ON P.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				
				if($u['length'] > 0){
					$this->extend($u[0]);
				
					if($numargs == 1){
						self::Set($this);
					}
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
		
	}
/**
 * Post.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('system.search', array(__CLASS__, 'Search'));
		System::Observe('blog:start', array(__CLASS__, 'onStart'));
		
		include_once('class_post_category.php');
		include_once('class_post_comment.php');
		include_once('class_post_collection.php');
		include_once('class_post_breadcrumb.php');
		
		System::EnqueueScript('blogpress.post', Plugin::Uri().'js/blogpress_post.js');
		System::EnqueueScript('blogpress.page', Plugin::Uri().'js/blogpress_page.js');
	}
/**
 * Post.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = "RENAME TABLE `".PRE_TABLE."posts` TO `".PRE_TABLE."blogpress_posts`";
		$request->exec('query');
				
		$request->query = 	"CREATE TABLE `".PRE_TABLE."blogpress_posts` (
		  `Post_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Parent_ID` bigint(20) NOT NULL DEFAULT '0',
		  `User_ID` bigint(20) NOT NULL,
		  `Category` varchar(300) NOT NULL DEFAULT 'Non classé',
		  `Title` text NOT NULL,
		  `Title_Header` varchar(180) NOT NULL DEFAULT '',
		  `Picture` varchar(255) NOT NULL DEFAULT '',
		  `Content` longtext NOT NULL,
		  `Summary` text NOT NULL,
		  `Keyword` text NOT NULL,
		  `Date_Create` datetime NOT NULL,
		  `Date_Update` datetime NOT NULL,
		  `Name` varchar(200) NOT NULL,
		  `Type` varchar(50) NOT NULL DEFAULT 'post',
		  `Statut` varchar(50) NOT NULL DEFAULT 'publish',
		  `Comment_Statut` varchar(50) NOT NULL DEFAULT 'close',
		  `Template` varchar(100) DEFAULT NULL,
		  `Menu_Order` int(11) NOT NULL DEFAULT '0',
		  `Meta` text NOT NULL,
		  PRIMARY KEY (`Post_ID`),
		  KEY `Parent_ID` (`Parent_ID`,`Name`)
		) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";
		
		$request->exec('query');
		
		
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` CHANGE `Type` `Type` VARCHAR( 50 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'post'";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` CHANGE `Statut` `Statut` VARCHAR( 50 ) NOT NULL DEFAULT 'publish'";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` CHANGE `Comment_Statut` `Comment_Statut` VARCHAR( 50 ) NOT NULL DEFAULT 'close'";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` ADD `Meta` TEXT NOT NULL DEFAULT '' AFTER `Template`";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` ADD `Title_Header` VARCHAR(180) NOT NULL DEFAULT '' AFTER `Title`";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` ADD `Summary` TEXT NOT NULL DEFAULT '' AFTER `Content`";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` ADD `Picture` VARCHAR(255) NOT NULL DEFAULT '' AFTER `Title_Header`";
		$request->exec('query');
		
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts` ADD `Menu_Order` INT(11) NOT NULL DEFAULT '0' AFTER `Template`";
		$request->exec('query');
		
		PostComment::Install();
		PostCategory::Install();
		
	}
/**
 * Post.onStart() -> void
 *
 * Cette méthode est lancé avant le chargement d'une page. 
 * Via cette méthode vous pouvez stopper le processus de chargement d'une page en fonction de son Permalien et charger une autre page de votre choix.
 **/	
	public static function onStart(){
		$link = Permalink::Get();
		
		if(User::IsConnect()){
			if($link->match('/blogpress\/preview/')){
					
				if(!empty($_POST[__CLASS__])){
										
					$o = new self($_POST[__CLASS__]);
					
					Post::Current($o);//on indique que le post en cours est celui-ci.
					//
					// #PHASE 4 : Indiquer à BlogPress que tout va bien
					//
					Template::ImportPage();		//on importe le template.
					BlogPress::StopEvent();		//on stop la propagation de l'événement startpage.
					
					return false;
				}					
			}
		}
	}
/**
 * Post#commit([revision = true]) -> Boolean
 * - revision (Boolean): Créée une révision si le paramètre est vrai.
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit($rev = true){
		
		if(empty($this->Title)){
			return false;
		}
		
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		
		if($this->Date_Create == '') $this->Date_Create = date('Y-m-d H:i:s');
		
		if($this->Type != "revision"){
			$this->createPermalink();
		}
				
		if((int) $this->User_ID == 0){
			if(User::Get()){
				$this->User_ID = User::Get()->User_ID;
			}else{
				$this->User_ID = 1;
			}
		}
		
		if($this->Post_ID == 0){
						
			$request->fields = 	"`Parent_ID`, `User_ID`, `Category`, `Title`, `Content`, `Keyword`, `Date_Create`, `Date_Update`, `Name`, `Type`, `Statut`, `Comment_Statut`, `Template`, `Meta`, `Title_Header`, `Summary`, `Picture`, `Menu_Order`";
			
			$request->values = 	"'".Sql::EscapeString($this->Parent_ID)."',  
									'".Sql::EscapeString($this->User_ID)."', 
									'".Sql::EscapeString($this->Category)."', 
									'".Sql::EscapeString($this->Title)."', 
									'".Sql::EscapeString($this->Content)."',
									'".Sql::EscapeString($this->Keyword)."',
									'".Sql::EscapeString($this->Date_Create)."',
									'".Sql::EscapeString($this->Date_Update = date('Y-m-d H:i:s'))."',  
									'', 
									'".Sql::EscapeString($this->Type)."', 
									'".Sql::EscapeString($this->Statut)."',
									'".Sql::EscapeString($this->Comment_Statut)."',
									'".Sql::EscapeString($this->Template)."',
									'".Sql::EscapeString(is_object($this->Meta) ? json_encode($this->Meta) : $this->Meta)."',
									'".Sql::EscapeString($this->Title_Header)."',
									'".Sql::EscapeString($this->Summary)."',
									'".Sql::EscapeString($this->Picture)."',
									'".Sql::EscapeString($this->Menu_Order)."'";
			
			System::Fire('blogpress.post:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Post_ID = $request->exec('lastinsert');
				
				$this->uniqueName();
				
				$request->set = "`Name` = '".Sql::EscapeString($this->Name)."'";
				$request->where = self::PRIMARY_KEY . ' = ' . $this->Post_ID;
				
				System::Fire('blogpress.post:commit.complete', array(&$this));
				
				return $request->exec('update');
			}
			
			return false;
		}
		
		$this->uniqueName();
		
		if($rev){
			if($this->Type == "page" || $this->Type == "post"){//creation de la revision
				$last =				new self((int) $this->Post_ID);
				$last->Post_ID = 	0;
				$last->Type =		"revision";
				$last->Parent_ID = 	$this->Post_ID;
				$last->User_ID =	User::Get()->User_ID;
				$last->commit();
			}
		}
		
		$request->set = "
			`Parent_ID` = '".Sql::EscapeString($this->Parent_ID)."',
			`Category` = '".Sql::EscapeString($this->Category)."',
			`Title` = '".Sql::EscapeString($this->Title)."',
			`Content` = '".Sql::EscapeString($this->Content)."',
			`Keyword` = '".Sql::EscapeString($this->Keyword)."',
			`Date_Update` = '".Sql::EscapeString(date('Y-m-d H:i:s'))."',
			`Name` = '".Sql::EscapeString($this->Name)."',
			`Type` = '".Sql::EscapeString($this->Type)."',
			`Statut` = '".Sql::EscapeString($this->Statut)."',
			`Comment_Statut` = '".Sql::EscapeString($this->Comment_Statut)."',
			`Template` = '".Sql::EscapeString($this->Template)."',
			`Meta` = '".Sql::EscapeString(is_object($this->Meta) ? json_encode($this->Meta) : $this->Meta)."',
			`Summary` = '".Sql::EscapeString($this->Summary)."',
			`Title_Header` = '".Sql::EscapeString($this->Title_Header)."',
			`Picture` = '".Sql::EscapeString($this->Picture)."',
			`Menu_Order` = '".Sql::EscapeString($this->Menu_Order)."'
		";
		
		$request->where = self::PRIMARY_KEY . ' = ' . $this->Post_ID;
				
		System::Fire('blogpress.post:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('blogpress.post:commit.complete', array(&$this));
			return true;
		}
		return false;
		
	}
/*
 *
 **/	
	public function toArchive(){
		
		$this->Statut = str_replace(array('publish', 'draft'), 'archive', $this->Statut);
		
		if(strpos($this->Type, "page") !== false){
			
			$array = array();
			
			$options = new stdClass();
			$options->Parent_ID = $this->Post_ID;
			
			$list = self::GetListForSelect($options);
			
			for($i = 0; $i < count($list); $i++){
				array_push($array, $list[$i]['value']);	
			}
			
			if(count($array)){
				$request = new Request();
				$request->from =	self::TABLE_NAME;
				$request->set =   	'Statut = REPLACE(REPLACE(Statut, "publish", "archive"), "draft", "archive")';
				$request->where = 	'Post_ID IN(' . implode(',', $array) .')'; 
				
				if(!$request->exec('update')){
					die(Sql::Current()->getError());	
				}
			}
		}
		
		
		return $this->commit(false);	
	}
/*
 *
 **/ 
	public function toPublish(){
		
		$this->Statut = str_replace(array('archive', 'draft'), 'publish', $this->Statut);
		
		if(strpos($this->Type, "page") !== false){
			
			$array = array();
			
			$options = new stdClass();
			$options->Parent_ID = 	$this->Post_ID;
			$options->Statut =		'archive';
			
			$list = self::GetListForSelect($options);
			
			for($i = 0; $i < count($list); $i++){
				array_push($array, $list[$i]['value']);	
			}
			
			if(count($array)){
				$request = new Request();
				$request->from =	self::TABLE_NAME;
				$request->set =   	'Statut = REPLACE(REPLACE(Statut, "archive", "publish"), "draft", "publish")';
				$request->where = 	'Post_ID IN(' . implode(',', $array) .')'; 
				
				if(!$request->exec('update')){
					die(Sql::Current()->getError());	
				}
			}
		}
		
		
		return $this->commit(false);	
	}
/**
 * Post#delete() -> Boolean
 *
 * Cette méthode supprime les informations de la classe de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Post_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('blogpress.post:remove', array(&$this));
			
			//mise à jour de l'arborescence des enfants
			$options = new stdClass();
			$options->Parent_ID = 	$this->Post_ID;
			
			$tab = self::GetList('', $options);
			
			for($i = 0; $i < $tab['length']; $i++){
				$post = new self($tab[$i]);
				$post->Parent_ID = $this->Parent_ID;
				$post->commit();
			}
			
			//suppression des révisions
			$request->where =	'Parent_ID = ' . $this->Post_ID ." AND Type = 'revision'";
			
			$request->exec('select');
			
			return true;
		}
		return false;

	}
/**
 * Post.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){
		
		switch($op){
			
			case "post.get":
			case self::PRE_OP."get":
				$post = 	new self((int) $_POST['Post_ID']);
								
				if($post->Post_ID == 0){
					return 'post.get.err';
				}
				
				echo $post->toJSON();
				break;
			
			case "post.name.get":
			case self::PRE_OP."name.get":
				$post = 	Post::ByName(self::RawURLDecode($_POST['Name']));
								
				if($post->Post_ID == 0){
					return $op.'.err';
				}
				
				echo $post->toJSON();
				break;
				
			case 'regenerate.name':
				
				$options->op = '-page';
				$list = Post::GetList($options, $options);
				
				for($i = 0; $i < $list['length']; $i++){
					$post = new self($list[$i]['Post_ID']);
					
					$post->Name = '';
					$post->commit(false);
				}
				
				for($i = 0; $i < $list['length']; $i++){
					$post = new self($list[$i]['Post_ID']);					
					$post->createPermalink();
					$post->commit(false);
				}
				
				break;
				
			case self::PRE_OP."commit":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit(isset($_POST['revision']) ? !($_POST['revision'] == 0) : true)){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP."archive":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->toArchive()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."publish":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->toPublish()){
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
				
				if(!empty($_POST['options']->untree)){
					self::$UnTree = array();
				}

			
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				if(!empty($_POST['options']->untree)){
					$tab = self::$UnTree;
				}
				
				echo json_encode($tab);
				
				break;
				
			case "post.template.list":
			case self::PRE_OP."template.list":
				echo json_encode(self::GetTemplates());
				break;
			
			case self::PRE_OP."select.list":
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
			
				$tab = self::GetListForSelect($_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				break;
			
			/*case "post.parent.all.list":
				if(!$tab = self::GetParents()){
					return $op.".err";
				}
				echo json_encode($tab);
				break;*/
				
			/*case "post.parent.list":
			case self::PRE_OP."parent.list":
				if(!$tab = self::GetParents(@$_POST["Post_ID"])){
					return $op.".err";
				}
				echo json_encode($tab);
				break;
				
			case "post.parent.short.list":
				if(!$tab = self::GetParents(@$_POST["Post_ID"], true)){
					return $op.".err";
				}
				echo json_encode($tab);
				break;*/
		}
		
		return 0;	
	}	
/**
 * Post.execSafe(op) -> Number
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	public static function execSafe($op){
		
		switch($op){
			case "post.get":
				echo json_encode(new self((int) $_POST['Post_ID']));
				break;
			case "post.list":
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				if(!$tab){
					return "post.list.err";	
				}
				
				echo json_encode($tab);
				break;				
			case "post.feed":
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				if(!$tab){
					return "post.list.err";	
				}
				
				echo json_encode($tab);
				break;	
		}
	}
/**
 * Post#publics() -> String
 * Cette méthode indique si l'instance peut être lu par tout le monde
 **/	
	public function publics(){
		if(!User::IsConnect() && strpos($this->Statut, 'private') !== false){
			return false;
		}
		
		return $this->published();
	}
/**
 * Post#published() -> String
 * Cette méthode indique si l'instance est publié.
 **/	
	public function published(){
		return strpos($this->Statut, 'publish') !== false;;
	}	
/**
 * Post#getCommentTracking() -> String
 * Cette méthode indique si l'instance autorise le tracking de la conversation.
 **/		
	public function getCommentTracking(){
		
		//vérifier que l'option est configurée dans blogpress
		$o = BlogPress::Meta('BP_COMMENT');
		if(!$o){
			return false;	
		}
		
		$o = BlogPress::Meta('BP_TRACKING');
		if(!$o){
			return false;	
		}
		
		//if(!BlogPress::Meta('BP_TRACKING')) return false;
		//vérifier que l'option est active pour le post
		if(!self::CommentStatutContain('track')){
			return false;	
		}
		//vérifier que l'utilisateur ne soit pas deja abonnée au flux de conversation
		return true;
	}
/**
 * Post#commentIsOpen() -> Boolean
 *
 * Cette méthode permet de savoir si l'article ou la page authorise l'édition de commentaire par les visteurs, connecté ou non.
 **/	
	public function commentIsOpen(){
		$o = BlogPress::Meta('BP_COMMENT');
		if(!$o){
			return false;	
		}
		return strpos($this->Comment_Statut, 'open') !== false;	
	}
/**
 * Post#uri() -> String
 *
 * Cette méthode retourne l'adresse HTTP de l'instance.
 **/
 	public function uri(){
 		return Blog::GetInfo('uri') . $this->Name . '/';
	}
/**
 * Post#getPermalink() -> String
 *
 * Cette méthode retourne l'adresse HTTP de l'instance.
 **/	
	public function getPermalink(){
 		return Blog::GetInfo('uri') . $this->Name . '/';
	}
/**
 * Post.createPermalink() -> void
 * Cette méthode créée le permalien pour un post si besoin.
 **/	
	protected function createPermalink(){
		
		if(strpos($this->Type, "page") !== false){
			
			if($this->Parent_ID != 0){//on vérifie que le lien est bon
				
				if($this->Name != ''){
					$parentName = str_replace('/'.basename($this->Name), '', $this->Name);	
					
					$parent = new self((int) $this->Parent_ID);
					
					if(empty($parent->Name)){
						$parent->createPermalink();
						$parent->commit(false);
					}
					
					if($parentName != $parent->Name){//erreur de lien
						
						$this->Name = $parent->Name."/".basename($this->Name);
						$parent->commit(false);
						
						return $this->Name;
					}
				}
				
			}else{
				if(!empty($this->Name)){
					$this->Name = basename($this->Name);
				}
			}
			
			if(empty($this->Name)){
				$string = 		Post::Sanitize($this->Title, '-');
				$parent =  		$this;
				
				if($this->Parent_ID != 0){
									
					$parent = 	new self((int) $parent->Parent_ID);
					
					if($parent->Post_ID){
						
						if(empty($parent->Name)){
							$parent->createPermalink();
							$parent->commit(false);
						}
						
						$string = 	$parent->Name . "/" . Post::Sanitize($this->Title, '-');
					}
					//}
				}
				
				$this->Name = $string;
			}
				
		}
	}
/**
 * Post#uniqueName() -> void
 * Cette méthode vérifie l'unicité du permalien en base de données.
 **/
 	public function uniqueName($it = 0){
		
		if($this->Parent_ID != 0 && strpos($this->Name, '/') === false){
			$o = new self((int) $this->Parent_ID);
			$this->Name = $o->Name . '/' . $this->Name;
		}
		
		$request = new Request(DB_BLOGPRESS);
		
		$request->select = 	'COUNT(*) AS NB';
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"Name = '".Sql::EscapeString($this->Name)."' 
							AND (Type like '%post%' OR Type like '%page%')
							AND ".Post::PRIMARY_KEY." != ". ((int) $this->Post_ID);
		
		$result = $request->exec('select');
		
		if($result[0]['NB'] > 0){//on a deja le permalien d'utilisé
			
			if($it == 0) $this->Name = $this->Name .'-'.$this->Post_ID;
			else{
				if($it == 0) $this->Name = $this->Name . $it;	
			}
			
			return $this->uniqueName($it++);
		}
		
		return true;
	}
/**
 * Post#exists() -> void
 * Cette méthode indique si le post existe en base de données.
 **/
 	public function exists(){
		$request = new Request(DB_BLOGPRESS);
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"Name = '".$this->Name."' AND Type like '".$this->Type."%'";
		
		$result = $request->exec('select');
		
		if($result['length'] == 0) return false;
		
		$this->extend($result[0]);
		
		return true;
	}
/**
 * Post#getMeta(key) -> String | Number | Array | Object | Boolean
 * - key (String): Nom de la clef.
 *
 * Cette méthode permet de récuperer une information stockée en base de données dans le champ `Meta`.
 **/
	public function getMeta($key){
		$obj = is_object($this->Meta) ? $this->Meta : json_decode($this->Meta);
		return isset($obj->$key) ? $obj->$key : NULL;
	}
/**
 * Post#setMeta(key, value) -> Boolean
 * - key (String): clef de la valeur à stocker.
 * - value (String | int): Valeur à stocker.
 *
 * Cette méthode permet d'assigner une information stockée en base de données dans le champ `Meta`.
 **/
	public function setMeta($key, $value){
		$obj = json_decode($this->Meta);
		
		$obj->$key = $value;
		
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"Meta = '".addslashes(json_encode($obj))."'";
		$request->where = 	self::PRIMARY_KEY. " = " . $this->Post_ID;

		$result = $request->exec('update');
		
		$this->Meta = json_encode($obj);
		
		return $result;
	}
	
/**
 * Post.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_BLOGPRESS);
		
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
 * Post.GetListForSelect() -> Array
 *
 * Cette méthode retourne la liste des pages publiées.
 **/
	public static function GetListForSelect($options = NULL){
		
		if(empty($options)){
			$options = 				new stdClass();
			$options->Type =		'page';
		}
		
		if(empty($options->Parent_ID)){
			$options->Parent_ID = 	0;	
		}
		
		$options->op = 		'-tree-select';
		
		
		if(!empty($options->default)){
			self::$UnTree =	array(array('value' => 0, 'text' => is_string($options->default) ? $options->default : MUI('Pas de parent'), 'level' => 0));
		}else{
			self::$UnTree =	array();
		}
		
		$_POST['options'] = $options;
		
		if(!self::GetList('', $options)){
			return false;
		}
		
		return self::$UnTree;
	}
/*
 * Post.Search(word) -> Array
 *
 * Méthode de recherche global de Javalyss. 
 **/	
	public static function Search($word){
		
		if(method_exists('Plugin', 'HaveAccess') && !Plugin::HaveAccess('BlogPress')){
			return;
		}
		
		$clauses = new stdClass();
		$clauses->draft = true;
		$clauses->where = $word;
		
		$result = self::GetList($clauses);
		
		for($i = 0; $i < $result['length']; $i++){
			
			$obj = new SystemSearch($result[$i]);
			
			$obj->onClick('System.BlogPress.openFromSearch');
			
			$obj->setAppIcon('blogpress');
						
			if($result[$i]['Type'] == 'page'){
				$obj->setAppName('BlogPress - Page');
			}else{
				$obj->setAppName('BlogPress - Article');
			}
			
			SystemSearch::Add($obj);
		}
	}
/**
 * Post.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des sociétés du logiciel en fonction des paramètres `clauses` et `options`.
 *
 * #### Les attributs du paramètre options
 *
 * * `Type` (String|Array) : Liste des types de page à compter séparés par des `;`.
 * * `Name` (String) : Schéma du permalien.
 * * `Role_ID` (Number) : Compte le nombre de page du groupe.
 * * `exclude` (String|Array): Liste des Post_ID à exclure du résultat.
 * * `Parent_ID` (String|Array): Liste les Post ayant le Parent_ID mentionné.
 * * `Category` (String): Liste les Post correspondant à la catégorie demandée.
 * * `Keyword` (String): Liste les Post correspondant au mot clef demandé.
 *
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->select = 	'P.*, P.Title as text, P.Post_ID as value, U.Name AS AuthorName, U.FirstName, U.Login, U.Avatar, CONCAT(U.Name, \' \', U.FirstName) as Author';
		$request->from = 	self::TABLE_NAME . " AS P LEFT JOIN " . User::TABLE_NAME . " AS U ON P.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->where =	" 1 ";
		$request->order = 	'Parent_ID ASC, Menu_Order ASC, P.Title ASC, Date_Create DESC, Post_ID DESC';
				
		if(User::IsConnect()){
			
			if(!empty($options->draft)){
				$request->where =	" Role_ID >= '" . User::Get()->getRight()."'";
				
				if(!empty($options->Statut)){
					$request->where .=	" AND P.Statut LIKE '%".Sql::EscapeString($options->Statut)."%'";
				}
			}else{
				if(!empty($options->Statut)){
					$request->where .=	" AND P.Statut LIKE '%".Sql::EscapeString($options->Statut)."%'";
				}else{
					$request->where =	" (
						P.Statut LIKE '%publish%'
					)";	
				}
			}
		}else{
			$request->where =	" 
				P.Statut LIKE '%publish%'
				AND P.Statut NOT LIKE '%private%'";
		}
		
		//
		// Gestion du type
		//
		if(!empty($options->Type)){
						
			if(is_string($options->Type)){
				if(strpos($options->Type, 'like') !== false){
					
					$options->Type = explode(';', trim(str_replace('like', '', strtolower($options->Type))));
										
					$request->where .= " AND (P.Type like '%". implode("%' OR P.Type like '%", $options->Type) . "%')";
										
				}else{
					$options->Type = explode(';', $options->Type);
					$request->where .= " AND P.Type IN ('". implode("','", $options->Type) ."')";
				}
			}elseif(is_array($options->Type)){
				$request->where .= " AND P.Type IN ('". implode("','", $options->Type) ."')";
			}
			
		}else{
			$request->where .= " AND P.Type IN ('page', 'post')";	
		}
		
		//
		// Gestion du Name
		//
		if(!empty($options->Name)){
			$request->where .= 	" AND P.Name like '".Sql::EscapeString($options->Name) ."'";
		}
		
		if(!empty($options->Role_ID)){
			$request->where .= 	" AND U.Role_ID = '".Sql::EscapeString($options->Role_ID) ."'";
		}
		//
		//
		//
		if(!empty($options->exclude)){
			
			if(is_numeric($options->exclude)){
				$options->exclude = explode(';', $options->exclude);
			}
			$request->where .= " AND P.Post_ID NOT IN ('". implode("','", $options->exclude) ."')";
		}
		//
		//
		//
		if(isset($options->Parent_ID)){
			
			if(is_numeric($options->Parent_ID)){
				$options->Parent_ID = explode(';', $options->Parent_ID);
			}
			$request->where .= " AND P.Parent_ID IN ('". implode("','", $options->Parent_ID) ."')";
		}
		//
		//
		//
		if(!empty($options->Category)){
			$request->where .= 	" AND P.Category like '%".Sql::EscapeString($options->Category) ."%'";
		}
		//
		//
		//
		if(!empty($options->Keyword)){
			$request->where .= 	" AND P.Keyword like '%".Sql::EscapeString($options->Keyword) ."%'";
		}
				
		switch(@$options->op){
			default:
				$request->observe(array(__CLASS__, 'onGetList')); 
				break;
			
			case '-completer': //liste des posts et pages en fonction d'une recherche de mot pour un completer
				
				
				
				$request->select .= ', P.Title as text, CONCAT(\'post:\', P.Post_ID) as value';
				
				$request->where .= 	 " AND 
										(
											Title LIKE '%".Sql::EscapeString($options->word)."%'
											OR P.Name LIKE '%".Sql::EscapeString($options->word)."%'
											OR CONCAT('post:', P.Post_ID) LIKE '".Sql::EscapeString($options->word)."'
										)
										";
				break;
					
			case '-tree-select':
				
				$request->select = 	self::PRIMARY_KEY.' as value, Title as text, Post_ID, Parent_ID, P.Name';
					
			case '-tree':
				if(empty($options->level)){
					$options->level = 0;	
				}
				
				$request->select .= ', "' . $options->level . '" AS level ';
			
				$request->observe(array(__CLASS__, 'onGetList')); 
				$request->observe(array(__CLASS__, 'onGetChildren'));
				
				break;
			
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " AND (
											Title like '%". Sql::EscapeString($clauses->where) . "%'
											OR U.Name like '%". Sql::EscapeString($clauses->where) . "%'
											OR U.FirstName like '%". Sql::EscapeString($clauses->where) . "%'
											OR Content like '%". Sql::EscapeString($clauses->where) . "%'
											OR Keyword like '%". Sql::EscapeString($clauses->where) . "%'
											OR Category like '%". Sql::EscapeString($clauses->where) . "%'
											OR Date_Create like '%". Sql::EscapeString($clauses->where) . "%'
											OR Date_Update like '%". Sql::EscapeString($clauses->where) . "%'
											OR P.Name like '%". Sql::EscapeString(Post::Sanitize($clauses->where)) . "%'
										)";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
			
			if(!empty($options->statistics)){
				
				$o = new stdClass();
				$o->Type =	$options->Type;
				$o->Statut = 'draft';
				
				$result['NbDraft'] = 		self::Count($o);
				//
				//
				//
				$o->Statut = '';
				$result['NbAll'] = 			self::Count($o);
				//
				//
				//
				$o->Statut = 'publish';
				$result['NbPublish'] = 		self::Count($o);
				//
				//
				//
				$o->Statut = 'archive';
				$result['NbArchive'] = 		self::Count($o);
			}
			
			if(!in_array(@$options->op, array( '-tree-select', '-completer'))){
				
				if(!self::$AllReadySetList){
					self::$AllReadySetList = true;
					self::SetList($result);
					self::$AllReadySetList = false;
				}
				
				
				//if($result['length']){
				//	self::Current($result[0]);
				//}else{
				//	self::$Post = false;
				//}
			}else{
				self::$Posts = $result;	
			}
		}else{
			self::$Posts = self::$Post = false;
		}
		
		return $result; 
	}
/**
 * Post.SetList(posts) -> void
 **/	
	public static function SetList($posts, $build = true){
		
		self::$Posts = $posts;
		
		if(is_array(self::$Posts)){
			unset(self::$Posts['length'], self::$Posts['maxLength']);
			
			if(!empty($posts['maxLength'])){
				self::$MaxLength = $posts['maxLength'];
			}else{
				self::$MaxLength = count(self::$Posts);
			}
			
			if(count(self::$Posts)){
				if($build){
					self::Current(@self::$Posts[0]);
				}else{
					self::$Post = @self::$Posts[0];
				}
			}else{
				self::$Post = false;
				self::$MaxLength = 0;
			}
			
		}else{
			self::$Posts = self::$Post = false;
			self::$MaxLength = 0;
		}			
	}
/**
 * Post.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/	
	public static function onGetList(&$row, &$request){
		
		if(!empty($row['Avatar']) && strpos($row['Avatar'], 'http://') !== false){
			$row['Avatar']	= 	SystemCache::Push(array(
									'Src' => 	$row['Avatar'], 
									'Width'=> 	32, 
									'Height' => 32, 
									'ID' => 	basename($row['Avatar']) . '-32-32'
								));
		}
		
		if(!empty($row['Post_ID'])){
			$row['NbComments'] = 	PostComment::Count($row['Post_ID']);
			$row['Note'] = 			Post::Note($row['Post_ID']);
		}
		
		$row['level'] = 0;
		$row['hierarchy'] = '';
		
		if(!empty($row['Parent_ID'])){
			if(isset($row['level'])){
				$row['level'] = 		self::LevelOf($row['Post_ID']);
			}
			$row['hierarchy'] = 	self::TitleHierarchy($row['Post_ID']);
		}
	}
/**
 * Post.onGetChildren(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/
	public static function onGetChildren(&$row, &$request){
		
		$row['children'] = self::HaveChildren($row['Post_ID']);
				
		if(is_array(self::$UnTree)){
			array_push(self::$UnTree, $row);
		}
		//$_POST['options']->op = 	$_POST['options']->op;
		$_POST['options']->Parent_ID = 	$row['Post_ID'];
		
		if(empty($_POST['clauses'])){
			$_POST['clauses'] = new stdClass();
		}
		$_POST['clauses']->limits =	'';
		
		if($row['children']){
			$_POST['options']->level = $row['level'] + 1;
			$children = self::GetList(@$_POST['clauses'], $_POST['options']);
		}				
	}
	
	// STATIC
	
/**
 * Post.Author() -> String
 * Cette méthode retourne le nom de l'auteur du post courant.
 **/	
	static public function Author(){
		return is_object(self::$Post) ? @self::$Post->Author : @self::$Post['Author'];	
	}
/**
 * Post.ByCategory(category [, clauses]) -> Array
 * - category (String): Catégorie
 *
 * Cette méthode retourne la liste des post de type `article` en fonction de la categorie demandée.
 **/
 	static public function ByCategory($category, $clauses = ''){
		self::$Cat = $category;
		
		$options =	new stdClass();
		$options->Category = rawurldecode($category);
		
		return self::GetList($clauses, $options);	
	}
/**
 * Post.ByName(name) -> Post
 * - name (String): Permalien
 *
 * Cette méthode retourne le post à partir du permalien.
 **/
 	static public function ByName($name){
		$request = 			new Request(DB_BLOGPRESS);
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	self::SECONDARY_KEY ." LIKE '".Sql::EscapeString(File::ToRel($name))."'";
		
		$u = $request->exec('select');
		if(!$u){
			die(Sql::Current()->getError());
		}
		if($u['length'] > 0){
			return new self($u[0], false);
		}
		return new self();
	}
/**
 * Post.BreadCrumbs([home [, sep]]) -> String 
 * - home (String): Nom du premier lien.
 * - sep (String): Caractère de séparation des liens.
 * 
 * Cette méthode créée un fil d'ariane.
 **/
 	static public function BreadCrumbs($home = '', $sep = ">>", $topParent = -1){
		return PostBreadCrumb::Draw($home, $sep, $topParent);
	}
/**
 * Post.Category() -> String
 *
 * Cette méthode retourne l'ensemble des catégories du Post courant sous forme HTML.
 **/	
	static public function Category($type = ''){
		$keyword = is_object(self::$Post) ? self::$Post->Category : self::$Post['Category'];
				
		if($keyword == '') return '';
				
		if($keyword[strlen($keyword) -1] == ';'){
			$keyword = utf8_encode(substr(utf8_decode($keyword), 0, strlen($keyword) - 1));
		}
		
		if($type == 'linked'){
			$keyword = explode(';', $keyword);
			
			$array =	array();
			foreach($keyword as $key => $word){
				if($word != ''){
					array_push($array, '<a href="'.Blog::GetInfo('uri').self::Sanitize($word).'/">'.$word.'</a>');
				}
			}
			
			$keyword  = implode(', ', $array);
		}else{
			$keyword = str_replace(';', ', ', $keyword);
		}
		
		return $keyword;
	}
/**
 * Post.Children([clauses]) -> Array
 * - clauses (Object): Critère de tri de la liste.
 *
 * Cette méthode retourne la liste des posts enfants du Post courant.
 **/
 	static public function Children($clauses = ''){
		$options = new stdClass();
		$options->Parent_ID = 	Post::ID();
		return self::GetList($clauses, $options);
	}
/**
 * Post.ClassName([className]) -> String
 * - className (String): Classe CSS à ajouter.
 * 
 * Cette méthode construit le ou les classe(s) CSS du Post courant.
 **/	
	static public function ClassName($str = ''){
		$o = explode(' ', self::Type());
		
		foreach($o as $key => $value){
			$o[$key] = self::Sanitize($value);
		}
		
		$o = implode(' ', $o);
		
		return strtolower("post " . $o . " post-" . self::ID() . ' ' .$str); 
	}
/**
 * Post.Count([options]) -> Number
 * - options (Object): Critère de selection.
 *
 * Cette méthode compte le nombre de Post.
 *
 * #### Attributs du paramètres options
 *
 * * `Type` (String|Array) : Liste des types de page à compter séparés par des `;`.
 * * `Name` (String) : Schéma du permalien.
 * * `Role_ID` (Number) : Compte le nombre de page du groupe.
 * * `exclude` (String|Array): Liste des Post_ID à exclure du résultat.
 * * `Parent_ID` (String|Array): Liste les Post ayant le Parent_ID mentionné.
 * * `Category` (String): Liste les Post correspondant à la catégorie demandée.
 * * `Keyword` (String): Liste les Post correspondant au mot clef demandé.
 *
 **/	
	static public function Count($options = NULL){
		if(empty($options)){
			return count(self::$Posts);
		}
		
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->select = 	'COUNT(*) as NB';
		$request->from = 	self::TABLE_NAME . " AS P LEFT JOIN " . User::TABLE_NAME . " AS U ON P.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->where =	" 1 ";
		$request->order = 	'Parent_ID ASC, Menu_Order ASC, P.Title ASC, Date_Create DESC, Post_ID DESC';
		
		if(User::IsConnect()){
			$request->where =	" Role_ID >= '" . User::Get()->getRight()."'";
			
			if(!empty($options->Statut)){
				$request->where .=	" AND P.Statut LIKE '%".Sql::EscapeString($options->Statut)."%'";
			}
		}
		//
		// Gestion du type
		//
		if(!empty($options->Type)){
			
			if(is_string($options->Type)){
				if(strpos($options->Type, 'like') !== false){
					
					$options->Type = explode(';', trim(str_replace('like', '', strtolower($options->Type))));
									
					$request->where .= " AND (P.Type like '%". implode("%' OR P.Type like '%", $options->Type) . "%')";
				}else{
					$options->Type = explode(';', $options->Type);
					$request->where .= " AND P.Type IN ('". implode("','", $options->Type) ."')";
				}
			}elseif(is_array($options->Type)){
				$request->where .= " AND P.Type IN ('". implode("','", $options->Type) ."')";
			}	
		}else{
			$request->where .= " AND P.Type IN ('page', 'post')";	
		}
		
		//
		// Gestion du Name
		//
		if(!empty($options->Name)){
			$request->where .= 	" AND P.Name = '".Sql::EscapeString($options->Name) ."'";
		}
		
		if(!empty($options->Role_ID)){
			$request->where .= 	" AND P.Role_ID = '".Sql::EscapeString($options->Role_ID) ."'";
		}
		//
		//
		//
		if(!empty($options->exclude)){
			
			if(is_string($options->exclude)){
				$options->exclude = explode(';', $options->exclude);
			}
			$request->where .= " AND P.Post_ID IN ('". implode("','", $options->exclude) ."')";
		}
		//
		//
		//
		if(isset($options->Parent_ID)){
			
			if(is_string($options->Parent_ID)){
				$options->Parent_ID = explode(';', $options->Parent_ID);
			}
			$request->where .= " AND P.Parent_ID IN ('". implode("','", $options->Parent_ID) ."')";
		}
		//
		//
		//
		if(!empty($options->Category)){
			$request->where .= 	" AND P.Category like '%".Sql::EscapeString($options->Category) ."%'";
		}
		//
		//
		//
		if(!empty($options->Keyword)){
			$request->where .= 	" AND P.Keyword like '%".Sql::EscapeString($options->Keyword) ."%'";
		}
		
		/*switch(@$options->op){
			case '-all':break;
			case '-draft':
				$request->where .= ' P.Statut like = "%draft%';
				break;
			
			case '-publish':
				$request->where .= ' P.Statut like = "%publish%';
			
			case '-archive':
				$request->where .= ' P.Statut like = "%archive%';	
		}*/
		
		$result = $request->exec('select');
				
		return $result && $result['length'] > 0 ? $result[0]['NB'] : 0;
	}
/**
 * Post.CountMax() -> Number
 *
 * Cette méthode retourne le nombre maximal de Post contenu dans la liste d'article à afficher.
 **/
	static public function CountMax(){
		return self::$MaxLength;	
	}
/**
 * Post.MaxLength() -> Number
 *
 * Cette méthode retourne le nombre maximal de Post contenu dans la liste d'article à afficher.
 **/	
	static public function MaxLength(){
		return self::$MaxLength;	
	}
/**
 * Post.Content([str]) -> String
 * - str (String): Contenu à assigner.
 *
 * Cette méthode permet d'assigner du contenu au Post courant. La méthode retourne le contenu du Post courant.
 **/	
	static public function Content($str = ''){
		
		if($str != ''){
			if(is_object(self::$Post)){
				self::$Post->Content = $str;	
			}else{
				self::$Post['Content'] = $str;
			}
		}
			
		return is_object(self::$Post) ? self::$Post->Content : self::$Post['Content'];	
	}
/**
 * Post.ContentText([length = 400]) -> String
 * - length (Number): Nombre de caractère à retourner.
 *
 * Cette méthode retourne le contenu du Post sans balise HTML.
 **/	
	static public function ContentText($length = 400){
		return utf8_encode(substr(utf8_decode(Stream::StripTags(is_object(self::$Post) ? self::$Post->Content : self::$Post['Content'])), 0, $length));
	}
/**
 * Post.CommentTracking() -> Boolean
 *
 * Cette méthode indique que les commentaires peuvent être suivi par l'utilisateur.
 **/	
	static public function CommentTracking(){		
		$post = is_object(self::$Post) ? self::$Post : new self(self::$Post);	
		return $post->getCommentTracking();	
	}
/**
 * Post.CommentOpen() -> Boolean
 *
 * Cette méthode permet de savoir si l'article ou la page authorise l'édition de commentaire par les visteurs, connecté ou non.
 **/	
	static public function CommentOpen(){
		$o = BlogPress::Meta('BP_COMMENT');
		if(!$o){
			return false;	
		}
		return self::CommentStatutContain('open');
	}
/**
 * Post.Current() -> Boolean
 *
 * Cette méthode retourne l'article courant.
 **/
	public static function Current($post = NULL){
		
		if(empty($post)){
			
			if(empty(Post::$Posts)) {
				if(empty(Post::$Post)){
					return false;
				}
				
				return self::Get();
			}
			
			$post = current(Post::$Posts);
						
			if(is_array($post) || is_object($post)){
				return self::Get();	
			}
			
			return false;
		}
		
		self::$Post = $post;
		
		System::Fire('blog:post.build');
				
		Post::GetComments();
				
		return self::$Post;
	}
/**
 * Post.CommentStatut() -> String
 * Cette méthode retourne le statut des commentaires du Post courant.
 **/
 	static public function CommentStatut(){
		$o = BlogPress::Meta('BP_COMMENT');
		if(!$o){
			return 'close';	
		}
		return is_object(self::$Post) ? self::$Post->Comment_Statut : self::$Post['Comment_Statut'];
	}
/**
 * Post.CommentStatutContain(needle) -> Boolean
 * - needle (String): Mot recherché.
 *
 * Cette méthode recherche le paramètre `needle` dans la chaine [[Post#Comment_Statut]] du Post courant.
 **/	
	static public function CommentStatutContain($needle){
		return strpos(self::CommentStatut(), $needle) !== false;
	}
/**
 * Post.Date([format = '' [, lang = fr [, encode = utf8]]]) -> String
 * - format (String): Format de la date à afficher (voir la document PHP pour strftime).
 * - lang (String): Langue pour l'affichage des dates.
 * - encode (String): Encodage de la chaine de caractère.
 *
 * Cette méthode retourne la date du Post en courant.
 **/	
	static public function Date($format = '', $lang = 'fr', $encode = 'uft8'){
		if($format == '') return is_object(self::$Post) ? self::$Post->Date_Create : self::$Post['Date_Create'];
		
		return ObjectPrint::DateFormat(self::Date(), $format, $lang, $encode);		
	}
/**
 * Post.DateFormat([format = '' [, lang = fr [, encode = utf8]]]) -> String
 * - format (String): Format de la date à afficher (voir la document PHP pour strftime).
 * - lang (String): Langue pour l'affichage des dates.
 * - encode (String): Encodage de la chaine de caractère.
 *
 * Cette méthode retourne la date du Post en courant.
 **/	
	static public function DateFormat($date, $format = '', $lang = 'fr', $encode = 'uft8'){
		return ObjectPrint::DateFormat($date, $format, $lang, $encode);
	}
	
	public static function DeleteClass($class){
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->where =	"Type = '" . Sql::EscapeString($class)."'";
		
		return $request->exec('delete');
	}
/**
 * Post.Get() -> Post
 * Post.Get(str) -> Post
 * Post.Get(link) -> Post
 * Post.Get(id) -> Post
 * - id (Number): Identifiant du Post.
 * - link (String): Lien HTTP du Post.
 * - str (String): Lien symbolique du Post tel que page:contact ou post:154.
 *
 * Cette méthode retourne un post à part du paramètre `str`, `link` ou `id`. 
 *
 * <p class="note">Cette méthode ne retourne que les Post ayant le statut `publish`.</p>
 * <p class="note">Les post ayant le statut `private` ne sont retourné que lorsque l'utilisateur est connecté</p>
 *
 **/
 	static public function Get($name = ''){
		$post = false;
		
		if(empty($name)){
			return is_object(self::$Post) ? self::$Post : ( new self(self::$Post, false) );	
		}
		
		if(is_numeric($name)){
			$post = new self((int) $name);
		}elseif(is_string($name)){
			
			if(strpos($name, ':') !== false){
				$string = explode(':', $name);
			
				switch(strtolower($string[0])){
					case "http":
						$post = Post::ByName($name);
						break;
					case "post":
					case "page":
						
						if(is_numeric($string[1])){
							$post = new self((int) $string[1], false);
						}else{
							$post = Post::ByName($string[1]);
						}
										
						break;	
				}
			}else{//permalien
				$post = Post::ByName($name);
			}
		}
		
		if($post){
			if($post->Post_ID > 0 && $post->publics()){
				return $post;
			}
		}
		
		return false;
	}
/**
 * Post.GetParents([exclude [, short = false]]) -> Array
 * - exclude (Array): Liste des posts devant être exclut du résultat.
 * - short (Boolean): ?
 *
 * Cette méthode retourne la liste des pages regroupé par arborescence pour un champ select.
 **/
	public static function GetParents($exclude = NULL, $short = false){
		
		$options->op = 		'-page-tree';
		$options->exclude = $exclude;
		$options->short =	$short;
		$options->type =	empty($_POST['options']->type) ? NULL : $_POST['options']->type;
		
		@$_POST['clauses']->limits = '';
		
		$_POST['options'] = $options;
		
		self::$UnTree =	array(array('value' => 0, 'text' => 'Pas de parent', 'level' => 0));
		
		if(!self::GetList(@$_POST['clauses'], $options)){
			return false;
		}
		
		return self::$UnTree;
	}
/**
 * Post.GetTemplates() -> Array
 *
 * Cette méthode retourne la liste des modèles de page disponible dans le template actif.
 **/
	public static function GetTemplates(){
		
		$models  = new Models(Template::Path(), System::Path('self'), array( 
			'Name' => 'Template Name'
		));
				
		$models = $models->toObject();
		
		$default =			new stdClass();
		$default->text = 	'Modèle par defaut';
		$default->value = 	file_exists(Template::Path().'page.php') ? 'page.php' : 'index.php';
		
		$array = 	array($default);
		
		foreach($models as $key => $row){
			$row->value =	$key;
			$row->text = 	$row->Name;
			array_push($array, $row);
		}
		
		return $array;
	}
/**
 * Post.GetCategories() -> Array
 *
 * Cette méthode retourne la liste des catégories.
 **/	
	public static function GetCategories(){
		return Category::GetList();
	}
/**
 * Post.GetComments() -> Array
 *
 * Cette méthode retourne la liste des commentaires du Post courant.
 **/	
	public static function GetComments(){
		$o = BlogPress::Meta('BP_COMMENT');
		
		if(!$o){
			return array();	
		}
		
		$page = 		Permalink::GetPage();
		$nb = 			BlogPress::Meta('BP_COMMENT_NB_PER_PAGE');
		
		$nb =  			empty($nb) ? Permalink::$NbPostPerPage : 1 * $nb;
				
		$clauses =		new stdClass();
		$options =		new stdClass();
		
		$clauses->order = 	'';
		$clauses->limits = 	($page * $nb) .','.$nb;
		$options->post =	Post::ID();
		
		return PostComment::GetList($clauses, $options);
	}
/**
 * Post.Have() -> Boolean
 * 
 * Cette méthode indique si [[Post.GetList]] a retourné des articles.
 **/
	public static function Have(){
		
		if(is_array(self::$Posts)){
			return self::Count() > 0;
		}
		
		return !empty(self::$Post);
	}
/**
 * Post.HaveChildren([postid]) -> Boolean
 * - postid (Number): ID du post parent.
 *
 * Cette méthode indique si le Post possède des pages enfants.
 **/
	public static function HaveChildren($postid = 0){
		if(empty($postid)){
			$postid = Post::ID();
		}
		
		return Sql::Count(self::TABLE_NAME, 'Parent_ID = ' . (int) $postid) > 0;
	}
/**
 * Post.ID() -> Number
 *
 * Cette méthode retourne l'ID du post courant.
 **/	
	static public function ID(){
		return is_object(self::$Post) ? self::$Post->Post_ID : self::$Post['Post_ID'];	
	}
/**
 * Post.IsPrivate() -> Boolean
 *
 * Cette méthode indique si le Post courant est privé auquel cas l'utilisateur devra être connecté pour visualiser le contenu.
 **/	
	static public function IsPrivate(){
		return self::StatutContain('private');
	}
/**
 * Post.IsPage() -> Boolean
 *
 * Cette méthode indique si le Post est de type `page`.
 **/	
	static public function IsPage(){
		return self::TypeContain('page');
	}
/**
 * Post.IsPublished() -> Boolean
 *
 * Cette méthode indique si le Post est ouvert à la lecture.
 **/	
	static public function IsPublished(){
		return self::StatutContain('publish');
	}
/**
 * Post.IsNotable() -> Boolean
 *
 * Cette méthode indique que l'article peut être noté par le visiteur.
 **/	
	static public function IsNotable(){
		$o = BlogPress::Meta('BP_COMMENT');
		if(!$o){
			return false;	
		}
		$o = BlogPress::Meta('BP_NOTE');
		if(!$o){
			return false;	
		}
		return self::CommentStatutContain('note');
	}
/**
 * Post.Note([postid]) -> Number
 * - postid (Number): Identifiant du post.
 *
 * Cette méthode retourne la note du Post courant ou celui du `postid`.
 **/	
	static public function Note($postid = ''){
		if(empty($postid)){
			$postid = Post::ID();
		}
		
		$request = new Request(DB_BLOGPRESS);
		$request->select = 'AVG(Note) as Average';
		$request->from = 	PostComment::TABLE_NAME;
		$request->where = 	Post::PRIMARY_KEY . ' = ' . (int) $postid . ' AND Statut = "publish"';
		
		$result = $request->exec('select');
		
		return $result && $result['length'] > 0 ? $result[0]['Average'] : 0;	
	}
/**
 * Post.DrawNote() -> String
 *
 * Cette méthode affiche la note de l'article au format HTML.
 **/	
	public static function DrawNote(){
		
		$note = self::Note();
		$note = (round($note * 2) / 2) * 2;
		
		?>
        <span class="object-stars-note">
        <?php
		for ($i = 0; $i < 10; $i += 2){
			if ($i + 1 == $note) {
				?>
				<span class="star-split"></span>
				<?php
			} elseif ($i < $note){
				?>
				<span class="star-full"></span>
				<?php
			} else {
				?>
				<span class="star-empty"></span>
				<?php
			}
		}
		?>
		</span>
		<?php
	}
/**
 * Post.Keyword() -> String
 * Cette méthode retourne les mots clefs du Post courant au format HTML.
 **/	
	static public function Keyword($type = ''){
		return self::Keywords($type);
	}
/**
 * Post.Keywords() -> String
 * Cette méthode retourne les mots clefs du Post courant au format HTML.
 **/
 	static public function Keywords($type = ''){
		$keyword = is_object(self::$Post) ? self::$Post->Keyword : self::$Post['Keyword'];
		
		if($keyword == '') return '';
		
		if($keyword[strlen($keyword) -1] == ';'){
			$keyword = utf8_encode(substr(utf8_decode($keyword), 0, strlen($keyword)-1));
		}
		
		
		if($type == 'linked'){
			$keyword = 	explode(';', $keyword);
			$array = 	array();
		
			foreach($keyword as $key => $word){
				if($word != '') {
					array_push($array, '<a href="'.Blog::GetInfo('uri').'keyword/'.self::Sanitize($word).'/">'.$word.'</a>');
				}
			}
			
			$keyword = implode(', ', $array);
		}else{
			$keyword = str_replace(';', ', ', $keyword);
		}
		
		return $keyword;
	}
/**
 * Post.LevelOf(id) -> Number
 * - id (Number): Identifiant du Post.
 *
 * Cette méthode retourne le niveau de profondeur du Post dans l'arborescence.
 **/	
	public static function LevelOf($id){
		
		$i = 0;
		
		$request = new Request();
		$request->select('Parent_ID, Type')->from(self::TABLE_NAME)->where(self::PRIMARY_KEY . ' = "' . ((int) $id) .'"');
		
		$parent =  		$request->exec('select');
		
		if($parent){
			if(strpos($parent[0]['Type'], "page") !== false){
				
				while($parent[0]['Parent_ID'] != 0 && $i < 5){
					
					$request->where(self::PRIMARY_KEY . ' = "' . ((int) $parent[0]['Parent_ID']) .'"');
					$parent =  $request->exec('select');
					$i++;
				}
			}
		}else{
			die(Sql::PrintError());	
		}
				
		return $i;
	}
/**
 * Post.Meta(key [, value]) -> Mixed
 * - key (String): Nom de la clef attachée au post.
 * - value (String | Number | Object | Array): Valeur à assigner à la clef.
 *
 * Cette méthode retourne la valeur d'une clef attachée au post courant.
 * Si le paramètre `value` est utilisé alors la valeur de `value` sera assigné à la clef `key` dans les informations attachées au post courant.
 **/	
	static public function Meta($key){
		
		$post = self::Current();
		$num = 	func_num_args();
						
		if($num == 1){	
			return $post->getMeta($key);
		}
		
		if($num == 2){
			if($key == '') return false;
			return $User->setMeta($key, func_get_arg(1));
		}
		
		return false;
	}
/**
 * Post.Miniature([width = 120 [, height = 120]]) -> String
 * - width (String): Largeur de la miniature.
 * - height (String): Hauteur de la miniature.
 *
 * Cette méthode retourne le lien de la miniature associée au Post courant.
 **/
 	static public function Miniature($width = 120, $height = 120){
		$picture = self::Picture();
		if(empty($picture)){
			return "";	
		}
		
		return SystemCache::Push(array(
			'Src' => self::Picture(),
			'Height' => $height,
			'Width' => $width,
			'ID' => basename(self::Picture()) . '-' . $width . 'x'.$width
		));
	}
/**
 * Post.Name() -> String
 * Cette méthode le permalien sans l'adresse HTTP du serveur hôte.
 **/	
	static public function Name(){
		return is_object(self::$Post) ? self::$Post->Name : self::$Post['Name'];	
	}
/**
 * Post.NameContain(needle) -> Boolean
 * - needle (String): Mot à rechercher.
 *
 * Cette méthode recherche la chaine `needle` dans l'attribut [[Post#Name]] du post courant.
 **/	
	static public function NameContain($needle){
		return strpos(self::Name(), $needle) !== false;	
	}
/**
 * Post.NameStrEnd(needle) -> String
 * - needle (String): Mot à rechercher.
 *
 * Cette méthode regarde l'attribut [[Post#Name]]courant se fini par la chaine `needle`.
 **/	
	static public function NameStrEnd($needle){
		
		$len = strlen($needle);
		
		if($len > strlen(self::Name())){
			return false;	
		}
		
		return substr_compare(self::Name(), $needle, -$len, $len) == 0;
	}
/**
 * Post#Next() -> Boolean
 *
 * Cette méthode passe à l'article suivant.
 **/
	public static function Next(){
				
		if(empty(Post::$Posts)) {
			if(Post::Have() && Post::Single()){
				Post::$Posts = array(0 =>Post::$Post, 'length' => 1, 'maxLength' => 1);
				return true;
			}
			return false;
		}
		
		$post = next(self::$Posts);
				
		//traitement du post
		if(is_array($post) || is_object($post)){
			self::$Post = $post;
			
			System::Fire('blog:post.build');
			Post::GetComments();
				
			return $post;	
		}
		
		return self::$Post = false;
	}
/**
 * Post#Prev() -> Boolean
 *
 * Cette méthode retourne à l'article précédent.
 **/
	public static function Prev(){
		if(empty(Post::$Posts)) {
			return;
		}
		
		$post = prev(self::$Posts);
		
		if(is_array($post) || is_object($post)){
			self::$Post = $post;
			System::Fire('blog:post.build');
			Post::GetComments();
			return $post;	
		}
		
		return self::$Post = false;
	}
/**
 * Post.Page() -> String
 *
 * Cette méthode indique si le Post courant est une page.
 **/	
	static public function Page(){
		return strpos($this->Type, 'page') !== false;
	}

/**
 * Post.Parent() -> Post | false
 * Cette méthode retourne le Post parent du post courant si il existe.
 **/	
	static public function Parent(){
		if(self::ParentID() == 0){
			return false;
		}
				
		return new self((int) self::ParentID(), false);	
	}
/**
 * Post.ParentID() -> Number | false
 * Cette méthode retourne l'ID du post parent.
 **/	
	static public function ParentID(){
		return is_object(self::$Post) ? self::$Post->Parent_ID : self::$Post['Parent_ID'];
	}
/**
 * Post.Permalink() -> String
 *
 * Cette méthode retourne le permalien du Post courant.
 **/	
	static public function Permalink(){
		
		if(self::Type() == 'post'){
			$cat = explode(';', (is_object(self::$Post) ? self::$Post->Category : self::$Post['Category']));
			
			if(count($cat) > 0){
				if($cat[0] != ''){
					$cat = self::Sanitize($cat[0]) . '/';
				}else{
					$cat = '';
				}
			}else{
				$cat = '';	
			}
			
			return Blog::Info('uri', false) . str_replace('//', '/', $cat . self::Name() . '/');
		}
				
		return Blog::Info('uri', false) . self::Name() . '/';
	}
/**
 * Post.ParentPermalink() -> String
 *
 * Cette méthode retourne le permalien du post parent du Post courant.
 **/	
	static public function ParentPermalink(){
		$post = 	Post::Current();
		
		new Post((int) $post->Parent_ID);
		
		$link = Post::Permalink();
		
		Post::Set($post);
		return $link;
	}
/**
 * Post.Picture() -> String
 *
 * Cette méthode retourne le lien de la photo associée au Post courant.
 **/
 	static public function Picture(){
		return is_object(self::$Post) ? self::$Post->Picture : self::$Post['Picture'];
	}
/**
 * Post#Rebuild() -> Boolean
 *
 * Cette méthode reconstruit le Post courant.
 **/	
	public static function Rebuild(){
		
		new self((int) Post::ID());
		
		//Post::Current();
		System::Fire('blog:post.build');
		Post::GetComments();
	}
/**
 * Post.Set(post) -> Post
 * - post (Post): Instance Post.
 *
 * Cette méthode assigne une instance [[Post]] comme instance courante. Toutes les méthodes reposant sur [[Post.Current]] travaillerons sur le nouveau post assigné.
 **/
 	static public function Set($post){
		if($post instanceof	Post){
			self::$Post = $post;	
		}else{
			self::$Post = new self($post);
		}
	}
/**
 * Post.Single() -> Boolean
 * 
 * Cette méthode indique si [[Post.GetList]] a retourné un seul article (Post ou Page).
 **/
	public static function Single(){
		return self::Count() <= 1;
	}
/**
 * Post.Statut() -> String
 *
 * Cette méthode retourne le contenu du champ [[Post#Statut]] du post courant.
 **/
	static public function Statut(){
		return is_object(self::$Post) ? self::$Post->Statut : self::$Post['Statut'];	
	}
/**
 * Post.StatutContain(needle) -> Boolean
 * - needle (String): Mot à rechercher.
 *
 * Cette méthode recherche le paramètre [[needle]] dans le [[Post.Statut]] du post courant.
 **/
	static public function StatutContain($needle){
		return strpos(self::Statut(), $needle) !== false;		
	}
/**
 * Post.Summary() -> String
 *
 * Cette méthode retourne un résumé du Post courant.
 **/	
	static public function Summary(){				
		$str = Stream::StripTags(is_object(self::$Post) ? @self::$Post->Summary : @self::$Post['Summary']);	
		
		if(empty($str)){
			$str = self::ContentText(); 
		}
		
		return $str;
	}
/**
 * Post.Title() -> String
 *
 * Cette méthode retourne le titre du Post courant.
 **/	
	static public function Title(){
		return is_object(self::$Post) ? self::$Post->Title : self::$Post['Title'];	
	}
/**
 * Post.TitleHeader() -> String
 *
 * Cette méthode retourne le titre de référencement du Post courant.
 **/	
	static public function TitleHeader(){
		return is_object(self::$Post) ? self::$Post->Title_Header : self::$Post['Title_Header'];	
	}
/**
 * Post.TitleHierarchy(id) -> Array
 * - id (Number): ID du post.
 *
 * Cette méthode retourne la liste des titres des posts entres le post courant et le post parent le plus haut dans l'arborescence des pages.
 **/	
	protected static function TitleHierarchy($id){
		$i =			0;
		$array = 		array();
		
		$request = new Request();
		$request->select('Parent_ID, Type, Title')->from(self::TABLE_NAME)->where(self::PRIMARY_KEY . ' = "' . ((int) $id) .'"');
		
		$parent =  		$request->exec('select');
		
		if($parent){
			if(strpos($parent[0]['Type'], "page") !== false){
				while($parent[0]['Parent_ID'] != 0 && $i < 5){
					$request->where(self::PRIMARY_KEY . ' = "' . ((int) $parent[0]['Parent_ID']) .'"');
					$parent =  $request->exec('select');
					array_push($array, $parent[0]['Title']);
					$i++;
				}
			}
		}else{
			die(Sql::PrintError());	
		}
		
		$final = array();
		
		for($i = count($array)-1; $i >= 0; $i--){
			array_push($final, $array[$i]);	
		}
		
		return $final;
	}
/**
 * Post.Type() -> String
 *
 * Cette méthode retourne le contenu du [[Post.Type]] du post courant.
 **/
	static public function Type(){
		return is_object(self::$Post) ? self::$Post->Type : self::$Post['Type'];	
	}
/**
 * Post.TypeContain(needle) -> Boolean
 * - needle (String): Mot à rechercher.
 *
 * Cette méthode recherche le paramètre [[needle]] dans le [[Post.Type]] du post courant.
 **/	
	static public function TypeContain($needle){
		return strpos(self::Type(), $needle) !== false;		
	}
/**
 * Post.Template() -> String
 *
 * Cette méthode retourne le contenu du [[Post.Template]] du post courant.
 **/
	public static function Template(){
		
		if(is_object(self::$Post)){
			return 	self::$Post->Template == '' ? false : self::$Post->Template;
		}
		
		return self::$Post['Template'] == '' ? false : self::$Post['Template'];
	}
/**
 * Post.TheContent() -> String
 *
 * Cette méthode retourne le contenu résumé ou complet du Post courant en fonction de la configuration de BlogPress.
 **/	
 	static public function TheContent(){
		
		if(BlogPress::Meta('BP_SUMMARY')){
			if(!Post::Single()){
				return self::ContentText();
			}
		}	
		
		return is_object(self::$Post) ? self::$Post->Content : self::$Post['Content'];	
	}
/*
 * Post#SocialLink() -> String
 **/
	public static function SocialLink($options = NULL){
		
		if(empty($options)){
			$options = new stdClass();
			$options->title = 		'';
			$options->className = 	'post-socialbar socialbar';	
		}
		
		if(is_array($options)){
			$obj = new stdClass();
			$obj->title = '';
			foreach($options as $key => $value){
				$obj->$key = $value;	
			}
		}
		
		$permalink = Post::Permalink();
		
		$facebook = new IconButton('http://www.facebook.com/sharer.php?u='.$permalink.'" target="socialbookmark" rel="nofollow', 'facebook-32');
		$twitter = 	new IconButton('http://twitter.com/timeline/home?status='.rawurlencode(Blog::GetInfo('title').' &quot;'.Post::Title().'&quot; sur '.$permalink).'" target="socialbookmark" rel="nofollow', 'twitter-32');
		$myspace = 	new IconButton('http://www.myspace.com/Modules/PostTo/Pages/?u='.$permalink.'&t='.Blog::GetInfo('title').' &quot;'.Post::Title().'&quot;" target="socialbookmark" rel="nofollow', 'myspace-32');
		$linkedin = new IconButton('http://www.linkedin.com/shareArticle?mini=true&url='.$permalink.'&title='.Blog::GetInfo('title').' &quot;'.Post::Title().'&quot;"  target="socialbookmark" rel="nofollow', 'linkedin-32');
		
		//$facebook->pushAttr('class', 'box-flag type-top');
		$facebook->pushAttr('title', MUI('Partager'));
		
		//$twitter->pushAttr('class', 'box-flag type-top');
		$twitter->pushAttr('title', MUI('Twitter'));
		
		//$myspace->pushAttr('class', 'box-flag type-top');
		$myspace->pushAttr('title', MUI('Partager vers MySpace'));
		
		//$linkedin->pushAttr('class', 'box-flag type-top');
		$linkedin->pushAttr('title', MUI('Partager vers LinkedIn'));
		
		return '<div class="'.$options->className.'"><span class="social-title">'.@MUI($options->title).'</span><div class="social-body">'.$facebook.$twitter.$myspace.$linkedin.'</div></div>';
	}
/** deprecated
 * Post#Pagination() -> String
 *
 * Cette méthode retourne la liste des boutons permettant de naviguer dans la liste des articles retournés par la méthode [[Post.GetList]].
 *
 * Il est préférable d'utiliser directement le classe [[Permalink]] pour une meilleur mise en forme.
 **/
 	public static function Pagination($flag = false){
		
		if(!empty(self::$Cat)){
			return Permalink::DrawPaging(array('length' => self::CountMax(), 'link' => Blog::GetInfo('uri') . self::Sanitize(self::$Cat)));
		}
		
		return Permalink::DrawPaging(array('length' => self::CountMax()));
	}
/**
 * Post#Sanitize(link) -> String
 * - link (String): Lien à formaté.
 *
 * Cette méthode retourne une lien `link` correctement formaté.
 **/	
	public static function Sanitize($str){
		 return str_replace(array('&', '--', '---', '----'), array('', '-', '-', '-'), strtolower(Stream::Sanitize($str, '-')));
	}
}

Post::Initialize();
?>