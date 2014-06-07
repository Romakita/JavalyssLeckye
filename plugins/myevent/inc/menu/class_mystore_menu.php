<?php
/** section: MyEvent
 * class MyEventMenu < Post
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_post.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventMenu extends Post{	
	const PRE_OP =				'myevent.menu.';
/**
 * MyEventMenu#Category -> String
 * Varchar
 **/
	public $Category = 'Non classé';
/**
 * MyEventMenu#Title -> String
 * Text
 **/
	public $Title = 		"";
/**
 * MyEventMenu#Title_Header -> String
 * Varchar
 **/
	public $Title_Header = 	"";
/**
 * MyEventMenu#Picture -> String
 * Varchar
 **/
	public $Picture = 		"";
/**
 * MyEventMenu#Content -> String
 * Longtext
 **/
	public $Content = 		"";
/**
 * MyEventMenu#Summary -> String
 * Text
 **/
	public $Summary = 		"";
/**
 * MyEventMenu#Keyword -> String
 * Text
 **/
	public $Keyword = 		"";
/**
 * MyEventMenu#Date_Create -> Datetime
 **/
	public $Date_Create = 	NULL;
/**
 * MyEventMenu#Date_Update -> Datetime
 **/
	public $Date_Update = 	NULL;
/**
 * MyEventMenu#Type -> String
 * Varchar
 **/
	public $Type = 			'page-myevent menu';
/**
 * MyEventMenu#Statut -> String
 * Varchar
 **/
	public $Statut = 		'publish';
/**
 * MyEventMenu#Comment_Statut -> String
 * Varchar
 **/
	public $Comment_Statut = 'close';
/**
 * MyEventMenu#Template -> String
 * Varchar
 **/
	public $Template = 		"page-myevent-menu.php";
/**
 * MyEventMenu#Menu_Order -> Number
 **/
	public $Menu_Order = 	0;
	
	static $currentOptions;
/**
 * new MyEventMenu()
 * new MyEventMenu(json)
 * new MyEventMenu(array)
 * new MyEventMenu(obj)
 * new MyEventMenu(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventMenu]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventMenu]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventMenu]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventMenu]].
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
 * MyEventMenu.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		
		include('class_myevent_menu_critere.php');
				
		System::Observe('gateway.exec', array('MyEventMenu', 'exec'));
		System::Observe('gateway.exec.safe', array('MyEventMenu', 'execSafe'));
		
		System::EnqueueScript('myevent.menu', Plugin::Uri().'js/myevent_menu.js');
		
	}
/**	
 * MyEventMenu#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit($rev = false){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Post_ID == 0){
			
			$request->fields = 	"(`Parent_ID`,
								`User_ID`,
								`Category`,
								`Title`,
								`Title_Header`,
								`Picture`,
								`Content`,
								`Summary`,
								`Keyword`,
								`Date_Create`,
								`Date_Update`,
								`Name`,
								`Type`,
								`Statut`,
								`Comment_Statut`,
								`Template`,
								`Menu_Order`,
								`Meta`)";
			$request->values = 	"('".Sql::EscapeString($this->Parent_ID)."',
								'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString($this->Category)."',
								'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Title_Header)."',
								'".Sql::EscapeString($this->Picture)."',
								'".Sql::EscapeString($this->Content)."',
								'".Sql::EscapeString($this->Summary)."',
								'".Sql::EscapeString($this->Keyword)."',
								'".Sql::EscapeString($this->Date_Create)."',
								'".Sql::EscapeString($this->Date_Update)."',
								'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->Type)."',
								'".Sql::EscapeString($this->Statut)."',
								'".Sql::EscapeString($this->Comment_Statut)."',
								'".Sql::EscapeString($this->Template)."',
								'".Sql::EscapeString($this->Menu_Order)."',
								'".Sql::EscapeString($this->Meta)."')";
			
			if($request->exec('insert')){
				$this->Post_ID = $request->exec('lastinsert');
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Parent_ID` = '".Sql::EscapeString($this->Parent_ID)."',
								`User_ID` = '".Sql::EscapeString($this->User_ID)."',
								`Category` = '".Sql::EscapeString($this->Category)."',
								`Title` = '".Sql::EscapeString($this->Title)."',
								`Title_Header` = '".Sql::EscapeString($this->Title_Header)."',
								`Picture` = '".Sql::EscapeString($this->Picture)."',
								`Content` = '".Sql::EscapeString($this->Content)."',
								`Summary` = '".Sql::EscapeString($this->Summary)."',
								`Keyword` = '".Sql::EscapeString($this->Keyword)."',
								`Date_Create` = '".Sql::EscapeString($this->Date_Create)."',
								`Date_Update` = '".Sql::EscapeString($this->Date_Update)."',
								`Name` = '".Sql::EscapeString($this->Name)."',
								`Type` = '".Sql::EscapeString($this->Type)."',
								`Statut` = '".Sql::EscapeString($this->Statut)."',
								`Comment_Statut` = '".Sql::EscapeString($this->Comment_Statut)."',
								`Template` = '".Sql::EscapeString($this->Template)."',
								`Menu_Order` = '".Sql::EscapeString($this->Menu_Order)."',
								`Meta` = '".Sql::EscapeString($this->Meta)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Post_ID."'";
		//print $request->compile('update');
		return $request->exec('update');
	}
/**
 * Post#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Post_ID."' ";
		
		return $request->exec('delete');
	}
/**
 * MyEventMenu.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
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
 * MyEventMenu.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyEventMenu#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Post_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
	
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
 * MyEventMenu.Distinct(field [, word]) -> Array
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
 * MyEventMenu.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	'Type like "%page-myevent menu%"'; 
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
				
				if(empty($options->Post_ID)){
					$options->Post_ID = 0;	
				}
				
				$request->where .= ' AND Parent_ID = '.$options->Post_ID;
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
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		//echo $request->query;
		
		if(!empty($options->default)){
			$result = array_merge(array(array('value' => 0, 'text' => MUI('Pas de parent'), 'level' => 0)), $result);
			$result['length']++;
		}
		
		return $result; 
	}
	
	public static function onGetChildren(&$row){
		
		$options = 			new stdClass();
		
		$options->op = 		empty($_POST['options']->op) ? '-tree' : $_POST['options']->op;
		$options->Post_ID = $row['Post_ID'];
		$options->exclude = @$_POST['options']->exclude;
		
		$row['level'] = 	MyEventMenu::LevelOf($row['Post_ID']);
		
		if(is_array(self::$UnTree)){
			array_push(self::$UnTree, $row);
		}
		
		$result = self::GetList('', $options);
		
		$row['Children'] = false;
		
		if(!is_array(self::$UnTree)){
			$row['Children'] = $result;
		}
	}
	
	public static function onGetList(&$row){
		$row['level'] = 	MyEventMenu::LevelOf($row['Post_ID']);
	}
}

MyEventMenu::Initialize();

?>