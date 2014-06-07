<?php
/** section: Newsletter
 * class NewsletterModel
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_newsletter_model.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class NewsletterModel extends ObjectTools{	
	const PRE_OP =				'newsletter.model.';
/**
 * NewsletterModel.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'newsletter_models';	
/**
 * NewsletterModel.PRIMARY_KEY -> String
 * Clef primaire de la table NewsletterModel.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Model_ID';

/**
 * NewsletterModel#Model_ID -> Number
 **/
	public $Model_ID = 0;
/**
 * NewsletterModel#Title -> String
 * Varchar
 **/
	public $Title = "";
/**
 * NewsletterModel#Content -> String
 * Longtext
 **/
	public $Content = "";
	
	public $Preview = "";

/**
 * new NewsletterModel()
 * new NewsletterModel(json)
 * new NewsletterModel(array)
 * new NewsletterModel(obj)
 * new NewsletterModel(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[NewsletterModel]].
 * - array (Array): Tableau associatif équivalent à une instance [[NewsletterModel]]. 
 * - obj (Object): Objet équivalent à une instance [[NewsletterModel]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[NewsletterModel]].
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
 * NewsletterModel.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * NewsletterModel.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `newsletter_models` (
		  `Model_ID` int(11) NOT NULL AUTO_INCREMENT,
		  `Title` varchar(100) NOT NULL,
		  `Content` longtext NOT NULL,
		  `Preview` varchar(255) NOT NULL,
		  PRIMARY KEY (`Model_ID`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8";
		$request->exec('query');	
	}
/**	
 * NewsletterModel#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
				
		if ($this->Model_ID == 0){
			
			$request->fields = 	"`Title`,
								`Content`";
			$request->values = 	"'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Content)."'";
			
			System::Fire('newsletter.model:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Model_ID = $request->exec('lastinsert');
				$this->setPreview();
				
				System::Fire('newsletter.model:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Title` = '".Sql::EscapeString($this->Title)."',
								`Content` = '".Sql::EscapeString($this->Content)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Model_ID."'";
		
		System::Fire('newsletter.model:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('newsletter.model:commit.complete', array(&$this));
			$this->setPreview();
				
			return true;
		}
		return false;
	}	
	
	public function setPreview(){
		if(strpos($this->Preview, 'http') === false && !empty($this->Preview)){
			$filename = System::Path('publics').'cache/preview-model-'.$this->Model_ID .'.png';	
			
			$data = explode(',',$this->Preview);
			$data = base64_decode($data[1]);
			
			@Stream::Write($filename, $data);
			@Stream::Resize($filename, 300, 300);
			
			$this->Preview = File::ToURI($filename);
			
			$request = 			new Request();
			$request->from = 	self::TABLE_NAME;
		
			$request->from = 	self::TABLE_NAME;
			$request->set = 	"`Preview` = '".Sql::EscapeString($this->Preview)."'";
								
			$request->where = 	self::PRIMARY_KEY." = '".$this->Model_ID."'";
			
			$request->exec('update');
						
		}	
	}
/**
 * NewsletterModel#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Model_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('newsletter.model:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * NewsletterModel.exec(command) -> Number
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
 * NewsletterModel.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * NewsletterModel#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Model_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * NewsletterModel.Distinct(field [, word]) -> Array
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
 * NewsletterModel.GetList([clauses [, options]]) -> Array | boolean
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
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		switch(@$options->op){
			default:
							
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Field as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Model_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('newsletter.model:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row){
			
	}
}

NewsletterModel::Initialize();

?>