<?php
/** section: MyStore
 * class MyStoreSelection
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_selection.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreSelection extends ObjectTools{	
	const PRE_OP =				'mystore.selection.';
/**
 * MyStoreSelection.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_selection';	
/**
 * MyStoreSelection.PRIMARY_KEY -> String
 * Clef primaire de la table MyStoreSelection.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Selection_ID';

/**
 * MyStoreSelection#Selection_ID -> Number
 **/
	public $Selection_ID = 0;
	
/**
 * MyStoreSelection#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * MyStoreSelection#Title -> String
 * VarChar
 **/
	public $Title = "";
/**
 * MyStoreSelection#Collection -> String
 * readOnly
 **/
	public $Collection = "";
/**
 * MyStoreSelection#Collection -> Float
 * Float
 **/
	public $Price = 0.00;
/**
 * MyStoreSelection#Picture -> String
 * Varchar
 **/
	public $Picture = "";
/**
 * MyStoreSelection#Content -> String
 * Text
 **/
	public $Content = "";
/**
 * MyStoreSelection#Order -> Number
 **/
	public $Order = 0;

/**
 * new MyStoreSelection()
 * new MyStoreSelection(json)
 * new MyStoreSelection(array)
 * new MyStoreSelection(obj)
 * new MyStoreSelection(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreSelection]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreSelection]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreSelection]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreSelection]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	'S.*, Collection';
				$request->from = 	self::TABLE_NAME . ' as S INNER JOIN '. MyStoreProduct::TABLE_NAME . ' Pr ON S.'. MyStoreProduct::PRIMARY_KEY . ' = Pr.'. MyStoreProduct::PRIMARY_KEY .'
									INNER JOIN '.Post::TABLE_NAME .' Po ON S.'. MyStoreProduct::PRIMARY_KEY . ' = Po.'. MyStoreProduct::PRIMARY_KEY;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$request->observe(array(__CLASS__, 'onGetList'));
				
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
 * MyStoreSelection.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
		System::EnqueueScript('mystore.selection', Plugin::Uri().'js/mystore_selection.js');
	}
/**
 * MyStoreSelection.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `mystore_selection` (
		  `Selection_ID` int(11) NOT NULL AUTO_INCREMENT,
		  `Post_ID` bigint(20) NOT NULL,
		  `Title` VARCHAR( 200 ) NOT NULL ,
		  `Picture` varchar(255) NOT NULL,
		  `Price` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0',
		  `Content` text NOT NULL,
		  `Order` INT( 2 ) NOT NULL DEFAULT '0',
 		  PRIMARY KEY (`Selection_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');
		
		$request->query = 'ALTER TABLE `mystore_selection` CHANGE `Selection_ID` `Selection_ID` int(11) NOT NULL AUTO_INCREMENT';
		
		$request->exec('query');
		
	}
/**	
 * MyStoreSelection#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Selection_ID == 0){
			
			$request->fields = 	"`Selection_ID`,
								`Post_ID`,
								`Title`,
								`Picture`,
								`Price`,
								`Content`,
								`Order`";
			$request->values = 	"'".Sql::EscapeString($this->Selection_ID)."',
								'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Picture)."',
								'".Sql::EscapeString($this->Price)."',
								'".Sql::EscapeString($this->Content)."',
								'".Sql::EscapeString($this->Order)."'";
			
			System::Fire('mystore.selection:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Selection_ID = $request->exec('lastinsert');
				
				System::Fire('mystore.selection:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Selection_ID` = '".Sql::EscapeString($this->Selection_ID)."',
								`Post_ID` = '".Sql::EscapeString($this->Post_ID)."',
								`Title` = '".Sql::EscapeString($this->Title)."',
								`Picture` = '".Sql::EscapeString($this->Picture)."',
								`Price` = '".Sql::EscapeString($this->Price)."',
								`Content` = '".Sql::EscapeString($this->Content)."',
								`Order` = '".Sql::EscapeString($this->Order)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Selection_ID."'";
		
		System::Fire('mystore.selection:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('mystore.selection:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * MyStoreSelection#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Selection_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('mystore.selection:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * MyStoreSelection.exec(command) -> Number
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
 * MyStoreSelection.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreSelection#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Selection_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyStoreSelection#getPrice(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix standard de la selection formaté.
 **/
	public function getPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format($this->Price, 2, $dec_point, $thousands_sep) . ' €';	
	}
/**
 * MyStoreSelection#getContent() -> String
 *
 * Cette méthode retourne le texte de présentation de la séléction.
 **/	
	public function getContent(){
		return nl2br($this->Content);	
	}
/**
 * MyStoreSelection#getPermalink() -> String
 *
 * Cette méthode retourne le lien de la page des collections.
 **/	
	public function getPermalink(){
		return Blog::GetInfo('uri').'collections/' . Post::Sanitize($this->Collection, '-');	
	}
	
	public static function Import(){
		
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'selections/';
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
 * MyStoreSelection.Distinct(field [, word]) -> Array
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
 * MyStoreSelection.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'S.*, Pr.Collection';
		$request->from = 	self::TABLE_NAME . ' as S INNER JOIN '. MyStoreProduct::TABLE_NAME . ' Pr ON S.'. MyStoreProduct::PRIMARY_KEY . ' = Pr.'. MyStoreProduct::PRIMARY_KEY .'
							INNER JOIN '.Post::TABLE_NAME .' Po ON S.'. MyStoreProduct::PRIMARY_KEY . ' = Po.'. MyStoreProduct::PRIMARY_KEY;
		$request->where =	' 1 '; 
		$request->order = 	'`Order` ASC ';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		switch(@$options->op){
			default:
							
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Societe as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Selection_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Post_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Picture` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Price` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		//
		// Evenement
		//
		System::Fire('mystore.selection:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row){
			
	}
}

MyStoreSelection::Initialize();

?>