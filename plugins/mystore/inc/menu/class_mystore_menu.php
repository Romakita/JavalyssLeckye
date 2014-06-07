<?php
/** section: Plugins
 * class MyStoreMenu < Post
 * includes ObjectTools
 *
 * Cette classe gère le menu de la boutique.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Application : MyStore
 * * Fichier : class_mystore_menu.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreMenu extends Post{	
	const PRE_OP =			'mystore.menu.';
/**
 * MyStoreMenu#Category -> String
 * Varchar
 **/
	public $Category = 		'Non classé';
/**
 * MyStoreMenu#Title -> String
 * Text
 **/
	public $Title = 		"";
/**
 * MyStoreMenu#Title_Header -> String
 * Varchar
 **/
	public $Title_Header = 	"";
/**
 * MyStoreMenu#Picture -> String
 * Varchar
 **/
	public $Picture = 		"";
/**
 * MyStoreMenu#Content -> String
 * Longtext
 **/
	public $Content = 		"";
/**
 * MyStoreMenu#Summary -> String
 * Text
 **/
	public $Summary = 		"";
/**
 * MyStoreMenu#Keyword -> String
 * Text
 **/
	public $Keyword = 		"";
/**
 * MyStoreMenu#Date_Create -> Datetime
 **/
	public $Date_Create = 	NULL;
/**
 * MyStoreMenu#Date_Update -> Datetime
 **/
	public $Date_Update = 	NULL;
/**
 * MyStoreMenu#Type -> String
 * Varchar
 **/
	public $Type = 			'page-mystore menu';
/**
 * MyStoreMenu#Statut -> String
 * Varchar
 **/
	public $Statut = 		'publish';
/**
 * MyStoreMenu#Comment_Statut -> String
 * Varchar
 **/
	public $Comment_Statut = 'close';
/**
 * MyStoreMenu#Template -> String
 * Varchar
 **/
	public $Template = 		"page-mystore-menu.php";
/**
 * MyStoreMenu#Menu_Order -> Number
 **/
	public $Menu_Order = 	0;
	
	static $currentOptions;
/**
 * new MyStoreMenu()
 * new MyStoreMenu(json)
 * new MyStoreMenu(array)
 * new MyStoreMenu(obj)
 * new MyStoreMenu(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreMenu]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreMenu]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreMenu]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreMenu]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs > 0){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request(DB_BLOGPRESS);
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
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
 * MyStoreMenu.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize(){
		
		include('class_mystore_menu_critere.php');
				
		System::Observe('gateway.exec', array('MyStoreMenu', 'exec'));
		System::Observe('gateway.exec.safe', array('MyStoreMenu', 'execSafe'));
		
		System::EnqueueScript('mystore.menu', Plugin::Uri().'js/mystore_menu.js');
		
	}
/**	
 * MyStoreMenu#commit() -> Boolean
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit($rev = false){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if(empty($this->Parent_ID)){
			$this->Parent_ID = System::Meta('MYSTORE_PAGE_PRODUCTS_ID');
		}
		
		return parent::commit($rev);
	}
/**
 * MyStoreMenu#delete() -> Boolean
 *
 * Cette méthode supprime les informations de la classe de la base de données.
 **/
	public function delete(){
		//Supression de la facture
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Post_ID."' ";
		
		return $request->exec('delete');
	}
/**
 * MyStoreMenu.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP . 'import':
				
				self::Import();
				
				break;
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
 * MyStoreMenu.execsSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreMenu#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Post_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyStoreMenu.Import()-> void
 *
 * Cette méthode permet d'importer une photo pour le menu.
 **/	
	public static function Import(){
		
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'menu/';
		@Stream::MkDir($folder, 0775);
		FrameWorker::Start();
						
		//récupération du fichier
		$file = 		FrameWorker::Upload($folder, 'jpg;jpeg;png;gif;bmp;');
		//on renomme le fichier
		$newfile = 		str_replace(basename($file), substr(md5(date('Ymdhis')), 0, 15) . '.' . FrameWorker::Extension($file), $file);
		
		Stream::Rename($file, $newfile);
		FrameWorker::Resize($newfile);
		FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $newfile));
		
	}
/**
 * Post.GetListForSelect() -> Array
 *
 * Cette méthode retourne la liste des pages publiées.
 **/
	public static function GetListForSelect($options = NULL){
		
		if(empty($options)){
			$options = new stdClass();
			$options->Post_ID =	0;
		}
		
		$options->op = 		'-tree-select';
		
		if(!empty($options->default)){
			$id = System::Meta('MYSTORE_PAGE_PRODUCTS_ID');
			
			self::$UnTree =	array(array('value' => $id, 'text' => is_string($options->default) ? $options->default : MUI('Pas de parent'), 'level' => 0));
		}else{
			self::$UnTree =	array();
		}
		
		$_POST['options'] = $options;
		
		if(!self::GetList('', $options)){
			return false;
		}
		
		return self::$UnTree;
	}
/**
 * Post.GetChildrenPostID(postid) -> Array
 *
 * Cette méthode retourne la liste des Post_ID enfant.
 **/	
	public static function GetChildrenPostID($id){
		
		$options = 			new stdClass();
		$options->op = 		'-tree-select';
		$options->Post_ID =	$id;
		
		self::$UnTree =	array();
		
		$_POST['options'] = $options;
		
		if(!self::GetList('', $options)){
			
			die('<pre><code>'. Sql::Current()->getRequest() . '<br />' . Sql::Current()->getError() .'</code></pre>');
			return false;
		}
		
		$array = array();
		
		for($i = 0, $len = count(self::$UnTree); $i < $len; $i++){
			array_push($array, 	self::$UnTree[$i]['Post_ID']);
		}
		
		return $array;
	}
/**
 * Post.GetParentPostID(postid) -> Array
 *
 * Cette méthode retourne la liste des Post_ID parent.
 **/	
	public static function GetParentPostID($id){
		$array = 		array();
		$parent =  		new self((int) $id, false);
		$i =			0;
		
		while($parent->Parent_ID != 0 && $i < 10){
			$parent = 	new self((int) $parent->Parent_ID, false);
			$i++;
			
			array_push($array, $parent->Post_ID);
		}
		
		return $array;
	}
/**
 * MyStoreMenu.Distinct(field [, word]) -> Array
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
	
	static function Get($options = NULL){
		if(!(is_object($options) || is_array($options))){
			$options = new stdClass();	
		}
		
		$options = self::ArrayToObject($options);
		
		switch($options->order == ''){
			default:
			case 'Order':
				$options->order = 'Menu_Order ASC, Title ASC';
				break;
				
			case 'Title':
				$options->order = 'Title ASC';
				break;
				
			case 'ID':
				$options->order = 'Post_ID ASC';
				break;
		}
		
		if(empty($options->after)){
			$options->after = '';
		}
		
		if(empty($options->before)){
			$options->before = '';
		}
		
		$options->op =			'-tree'; 
		
		self::$currentOptions = 	$options;
		
		return self::GetList($options, $options);	
	}
/**
 *
 **/	
	static function Draw($options = NULL){
		
		$result = 		self::Get($options);
		
		$string = 		'<ul class="myshop-nav'. ( empty($options->className) ? '' : ' ' . $options->className ).'">';
		
		$string .= 		self::onDraw($result);
		
		if(!empty($options->append)){
			$string .= 			$options->append;	
		}
		
		$string .= 		'<div class="clearfloat"></div></ul>';
		
		echo $string;
	}
/**
 *
 **/	
	public static function onDraw($posts){
		
		$string = '';
		
		for($i = 0; $i < $posts['length']; $i++){
			$post = new self($posts[$i]);
			
			$current = $post->Post_ID == Post::ID() ? ' post-current' : '';
			
			System::Fire('blog:posts.draw', array(&$post));
						
			$string .= '<li class="post-entry post-'.$i.' post-'.$post->Post_ID.' post-'.$post->Post_ID.' post-'.Post::Sanitize($post->Title).$current.' level-' . $post->level . '"><a href="'.Blog::Info('uri', false).$post->Name.'">'. self::$currentOptions->before. MUI($post->Title) . self::$currentOptions->after .'</a>';
			
			if($posts[$i]['Children']){
				
				$sub = self::onDraw($posts[$i]['Children']);
				
				if($sub){
					$sub = '<ul class="children">'.$sub.'</ul>';	
				}
				
				$string .= $sub;
			}
			
			$string .= '</li>';
		}
		return $string;
	}
/**
 * MyStoreMenu.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/	
	public static function GetList($clauses = '', $options = ''){
		
		$request = 			new Request();
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	'Type like "%page-mystore menu%"'; 
		$request->order = 	'Menu_Order ASC, Title ASC';
		
		if(!User::IsConnect()){
			$request->where .=	' AND Statut LIKE "%publish%" ';	
			$request->where .=	' AND Statut NOT LIKE "%private%" ';
		}else{
			if(empty($options->draft)){
				$request->where .=	' AND Statut LIKE "%publish%" ';	
			}
		}
				
		if(!empty($options->exclude)){
			if(is_array($options->exclude)){
				$request->where .=	" AND Post_ID NOT IN(" . implode(',', $options->exclude) . ')';
			}else{
				$request->where .=	" AND Post_ID != " . ((int) $options->exclude);
			}
		}
				
		switch(@$options->op){
			default:
				$request->observe(array(__CLASS__, 'onGetList'));
				break;
			
			case '-tree-select':
				
				$request->select = 	self::PRIMARY_KEY.' as value, Title as text, Post_ID';
					
			case '-tree':
				
				if(empty($options->level)){
					$options->level = 0;	
				}
				
				$request->select .= ', "' . $options->level . '" AS level ';
				
				if(empty($options->Post_ID)){
					$options->Post_ID = System::Meta('MYSTORE_PAGE_PRODUCTS_ID');	
				}
				
				$request->where .= ' AND Parent_ID IN(0, ' . $options->Post_ID.')';
				$request->observe(array(__CLASS__, 'onGetChildren'));
				
				break;
								
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Title as text, Post_ID, Name';
				$request->observe(array(__CLASS__, 'onGetList'));
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Post_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Parent_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`User_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Category` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title_Header` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Picture` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Summary` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Keyword` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Create` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Update` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Type` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Statut` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Comment_Statut` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Template` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Menu_Order` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		//echo $request->query;
		
		if(!empty($options->default)){
			$id = System::Meta('MYSTORE_PAGE_PRODUCTS_ID');
			
			$result = array_merge(array(array('value' => $id, 'text' => is_string($options->default) ? $options->default : MUI('Pas de parent'), 'level' => 0)), $result);
			$result['length']++;
		}
		
		return $result; 
	}
/**
 * MyStoreMenu.onGetChildren(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 **/	
	public static function onGetChildren(&$row, &$request){
		
		$options = 			new stdClass();
		
		$options->op = 		empty($_POST['options']->op) ? '-tree' : $_POST['options']->op;
		$options->Post_ID = $row['Post_ID'];
		$options->exclude = @$_POST['options']->exclude;
		$options->level =	$row['level'] + 1;
		
		//$row['level'] = 	MyStoreMenu::LevelOf($row['Post_ID'])-1;
		
		if(is_array(self::$UnTree)){
			array_push(self::$UnTree, $row);
		}
		
		$result = self::GetList('', $options);
		
		$row['Children'] = false;
		
		if(!is_array(self::$UnTree)){
			$row['Children'] = $result;
		}
	}
/**
 * MyStoreMenu.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 **/
	public static function onGetList(&$row, &$request){
		$row['level'] = 	MyStoreMenu::LevelOf($row['Post_ID']);
	}
}

MyStoreMenu::Initialize();

?>