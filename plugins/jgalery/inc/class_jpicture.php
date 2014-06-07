<?php
/** section: jGalery
 * class jPicture
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_jgalerie_picture.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class jPicture extends ObjectTools{
	const PRE_OP =				'jgalery.jpicture.';
/**
 * jPicture.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'jgaleries_pictures';	
/**
 * jPicture.PRIMARY_KEY -> String
 * Clef primaire de la table jPicture.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Picture_ID';

/**
 * jPicture#Picture_ID -> Number
 **/
	public $Picture_ID = 0;
/**
 * jPicture#Galery_ID -> Number
 **/
	public $Galery_ID = 0;
/**
 * jPicture#Title -> String
 * Varchar
 **/
	public $Title = "";
/**
 * jPicture#Src -> String
 * Text
 **/
	public $Src = "";
/**
 * jPicture#Thumbnail -> String
 * Text
 **/
	public $Thumbnail = "";
/**
 * jPicture#Content -> String
 * Text
 **/
	public $Content = "";
/**
 * jPicture#Link -> String
 * Text
 **/
	public $Link = "";
/**
 * jPicture#ClassName -> String
 * Varchar
 **/
	public $ClassName = "";
/**
 * jPicture#Button -> Number
 **/
	public $Button = 1;
/**
 * jPicture#Order -> Number
 **/
	public $Order = 0;

/**
 * new jPicture()
 * new jPicture(json)
 * new jPicture(array)
 * new jPicture(obj)
 * new jPicture(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[jPicture]].
 * - array (Array): Tableau associatif équivalent à une instance [[jPicture]]. 
 * - obj (Object): Objet équivalent à une instance [[jPicture]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[jPicture]].
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
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);

		}
	}
/**
 * jPicture.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array('jPicture', 'exec'));
		System::Observe('gateway.exec.safe', array('jPicture', 'execSafe'));
	}
/**
 * jPicture.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `jgaleries_pictures` (
		  `Picture_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Galery_ID` bigint(20) NOT NULL,
		  `Title` varchar(100) NOT NULL,
		  `Src` text NOT NULL,
		  `Content` text NOT NULL,
		  `Link` text NOT NULL,
		  `ClassName` varchar(100) NOT NULL,
		  `Button` varchar(255) NOT NULL DEFAULT '1',
		  `Order` tinyint(4) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`Picture_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
	}
/**	
 * jPicture#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		//on force la création de la miniature.
		self::GetMiniature($this->Src, true);
		
		if ($this->Picture_ID == 0){
			
			$request->fields = 	"(`Galery_ID`,
								`Title`,
								`Src`,
								`Content`,
								`Link`,
								`ClassName`,
								`Button`,
								`Order`)";
			$request->values = 	"('".Sql::EscapeString($this->Galery_ID)."',
								'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Src)."',
								'".Sql::EscapeString($this->Content)."',
								'".Sql::EscapeString($this->Link)."',
								'".Sql::EscapeString($this->ClassName)."',
								'".Sql::EscapeString($this->Button)."',
								'".Sql::EscapeString($this->Order)."')";
			
			if($request->exec('insert')){
				$this->Picture_ID = $request->exec('lastinsert');
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Galery_ID` = '".Sql::EscapeString($this->Galery_ID)."',
								`Title` = '".Sql::EscapeString($this->Title)."',
								`Src` = '".Sql::EscapeString($this->Src)."',
								`Content` = '".Sql::EscapeString($this->Content)."',
								`Link` = '".Sql::EscapeString($this->Link)."',
								`ClassName` = '".Sql::EscapeString($this->ClassName)."',
								`Button` = '".Sql::EscapeString($this->Button)."',
								`Order` = '".Sql::EscapeString($this->Order)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Picture_ID."'";
		//print $request->compile('update');
		return $request->exec('update');
	}
/**
 * jPicture#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Picture_ID."' ";
		
		return $request->exec('delete');
	}
/**
 * jGalery.GetMiniature(link) -> String
 **/
 	public static function GetMiniature($link, $bool = false){
			
		$link = SystemCache::Push(array(
			'Src' => 	$link,
			'Width'=> 	250,
			'Height' =>	250,
			'ID' =>		basename($link) . '-250-250'
		));
		
		if($bool){
			@Stream::Delete(File::ToABS($link));
			
			$link = SystemCache::Push(array(
				'Src' => 	$link,
				'Width'=> 	250,
				'Height' =>	250,
				'ID' =>		basename($link) . '-250-250'
			));	
		}
		
		return $link;
	}
	
	public function getThumbnail(){
		if(file_exists(File::ToABS($this->Thumbnail))){
			return $this->Thumbnail;	
		}
		
		return $this->Thumbnail = self::GetMiniature($this->Src);
	}
/**
 * jPicture.exec(command) -> Number
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
				
			case self::PRE_OP."order.commit":
				$array = self::DecodeJSON($_POST['Pictures']);
				
				foreach($array as $picture){
					$o = new self($picture->Picture_ID);
					$o->Order = $picture->Order;
					$o->commit();	
				}
				
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
			
			case self::PRE_OP."import":
				$obj =  	new jGalery((int) $_POST[jGalery::PRIMARY_KEY]);
				
				FrameWorker::Start();
				
				$obj->mkDir();
				$folder = $obj->path();
				
				FrameWorker::Draw('upload -o="'.$folder.'"');
				
				//récupération du fichier
				$file = 		FrameWorker::Upload($folder, 'jpg;jpeg;png;gif;bmp;');
				//on renomme le fichier
				$newfile = 		str_replace(basename($file), substr(md5(date('Ymdhis')), 0, 15) . '.' . FrameWorker::Extension($file), $file);
				
				Stream::Rename($file, $newfile);
				FrameWorker::Resize($newfile);
				FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $newfile));
				
				break;
		}
		
		return 0;	
	}
/**
 * jPicture.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * jPicture#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Picture_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * jPicture.Distinct(field [, word]) -> Array
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
 * jPicture.GetList([clauses [, options]]) -> Array | boolean
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
		$request->where =	' 1 '; 
		$request->order = 	'`Order` ASC';
				
		if(isset($options->Galery_ID)){
			$request->where .= ' AND ' .jGalery::PRIMARY_KEY. ' = ' . (int) $options->Galery_ID;
		}
		
		switch(@$options->op){
			default:
							
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Societe as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Picture_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Galery_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Src` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Link` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`ClassName` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Button` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 *
 **/	
	static function onGetList(&$row){
		$row['Miniature'] = self::GetMiniature($row['Src']);
	}
}

jPicture::Initialize();

?>