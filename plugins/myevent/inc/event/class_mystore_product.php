<?php
/** section: MyEvent
 * class MyEventProduct
 * includes Post
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_myevent_product.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventProduct extends Post{	
	const PRE_OP =				'myevent.product.';
/**
 * MyEventProduct.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'myevent_products';
	
	const EXT_TABLE_NAME = 		'myevent_products_parents';	
/**
 * MyEventProduct.PRIMARY_KEY -> String
 * Clef primaire de la table MyEventProduct.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Post_ID';

/**
 * MyEventProduct#Post_ID -> Number
 **/
	public $Post_ID = 0;
	
	public $Parent_ID_2 = NULL;
/**
 * MyEventProduct#Provider_ID -> Number
 **/
	public $Provider_ID = 0;
/**
 * MyEventProduct#Galery_ID -> Number
 **/
	public $Galery_ID = 0;
/**
 * MyEventProduct#Product_Code -> String
 * Varchar
 **/
	public $Product_Code = "";
/**
 * MyEventProduct#Collection -> String
 * Varchar
 **/
	public $Collection = "";
/**
 * MyEventProduct#Related_Collection -> String
 * Varchar
 **/
	public $Related_Collection = "";
/**
 * MyEventProduct#Expiry_Date -> Datetime
 **/
	public $Expiry_Date = '0000-00-00 00:00:00';
/**
 * MyEventProduct#Price -> Float
 * Decimal
 **/
	public $Price = 0.00;
/**
 * MyEventProduct#Standard_Price -> Float
 * Decimal
 **/
	public $Standard_Price = 0.00;
/**
 * MyEventProduct#Eco_Tax -> Float
 * Decimal
 **/
	public $Eco_Tax = 0.00;
/**
 * MyEventProduct#Discount -> Float
 * Decimal
 **/
	public $Discount = 0.0;
/**
 * MyEventProduct#Stock -> Number
 **/
	public $Stock = 0;
/**
 * MyEventProduct#Cost_Delivery -> Float
 * Decimal
 **/
	public $Cost_Delivery = 0.00;
/**
 * MyEventProduct#Time_Delivery -> String
 * Varchar
 **/
	public $Time_Delivery = "";
/**
 * MyEventProduct#Origin -> String
 * Varchar
 **/
	public $Origin = "";
/**
 * MyEventProduct#Designer -> String
 * Varchar
 **/
	public $Designer = "";
/**
 * MyEventProduct#Criteres -> String
 * Text
 **/
	public $Criteres = "";

/**
 * new MyEventProduct()
 * new MyEventProduct(json)
 * new MyEventProduct(array)
 * new MyEventProduct(obj)
 * new MyEventProduct(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventProduct]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventProduct]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventProduct]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventProduct]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	'Pr.*, Po.*, U.Name AS AuthorName, U.FirstName, U.Login, U.Avatar, CONCAT(U.Name, \' \', U.FirstName) as Author';
				$request->from = 	self::TABLE_NAME . ' Pr INNER JOIN ' . Post::TABLE_NAME . ' Po ON Pr.'.Post::PRIMARY_KEY . ' = Po.'.Post::PRIMARY_KEY . '
									LEFT JOIN ' . User::TABLE_NAME . " AS U ON Po.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
									
				$request->where =	'Po.'.self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$request->observe(array(__CLASS__, 'onGetList'));
				
				$u = $request->exec('select');
				
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
 * MyEventProduct.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('blog:post.build', array(__CLASS__, 'onBuildPost')); 
		System::Observe('blog:post.breadcrumbs', array(__CLASS__, 'onBuildBreadCrumbs'));
		
		System::EnqueueScript('myevent.product', Plugin::Uri().'js/myevent_product.js');
		
		include_once('class_myevent_product_critere.php');
		include_once('class_myevent_selection.php');
	}
	
	public static function onBuildPost(){
		
		if(strpos(Post::Type(), 'page-myevent product') !== false){
			$post = 	self::Current();
			$product = 	new self((int) Post::ID());
			
			self::Set($product);
		}
	}
	
	public static function onBuildBreadCrumbs($post){
		
		if(strpos($post->Type, 'page-myevent product') !== false){
			$product = 	new self((int) $post->Post_ID);
			$post->Title = $product->getTitle();
		}
	}
/**
 * MyEventProduct.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `myevent_products` (
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Provider_ID` bigint(20) NOT NULL,
		  `Galery_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Product_Code` varchar(20) NOT NULL,
		  `Collection` varchar(200) NOT NULL DEFAULT '',
		  `Related_Collection` varchar(200) NOT NULL DEFAULT '',
		  `Expiry_Date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Price` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Standard_Price` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0'
		  `Discount` decimal(3,1) NOT NULL DEFAULT '0.0',
		  `Stock` int(11) NOT NULL DEFAULT '0',
		  `Cost_Delivery` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Time_Delivery` varchar(200) NOT NULL,
		  `Origin` varchar(30) NOT NULL,
		  `Designer` `Designer` BIGINT NOT NULL,
		  PRIMARY KEY (`Post_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Table des produits'";
		$request->exec('query');	
		
		$request->query = 	"CREATE TABLE IF NOT EXISTS `myevent_products_parents` (
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Parent_ID` bigint(20) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`Post_ID`,`Parent_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `myevent_products` CHANGE `Designer` `Designer` BIGINT NOT NULL";
		$request->exec('query');
		
		
		$request->query = "ALTER TABLE `myevent_products` ADD `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0' AFTER `Standard_Price`";
		$request->exec('query');
	}
/**	
 * MyEventProduct#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit($rev = false){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		
		
		if ($this->Post_ID == 0){
			
			parent::commit(false);
			
			$request->fields = 	"`Post_ID`,
								`Provider_ID`,
								`Galery_ID`,
								`Product_Code`,
								`Collection`,
								`Related_Collection`,
								`Expiry_Date`,
								`Price`,
								`Standard_Price`,
								`Eco_Tax`,
								`Discount`,
								`Stock`,
								`Cost_Delivery`,
								`Time_Delivery`,
								`Origin`,
								`Designer`";
			$request->values = 	"'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Provider_ID)."',
								'".Sql::EscapeString($this->Galery_ID)."',
								'".Sql::EscapeString($this->Product_Code)."',
								'".Sql::EscapeString($this->Collection)."',
								'".Sql::EscapeString($this->Related_Collection)."',
								'".Sql::EscapeString($this->Expiry_Date)."',
								'".Sql::EscapeString($this->Price)."',
								'".Sql::EscapeString($this->Standard_Price)."',
								'".Sql::EscapeString($this->Eco_Tax)."',
								'".Sql::EscapeString($this->Discount)."',
								'".Sql::EscapeString($this->Stock)."',
								'".Sql::EscapeString($this->Cost_Delivery)."',
								'".Sql::EscapeString($this->Time_Delivery)."',
								'".Sql::EscapeString($this->Origin)."',
								'".Sql::EscapeString($this->Designer)."'";
			
			System::Fire('myevent.product:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Post_ID = $request->exec('lastinsert');
				
				System::Fire('myevent.product:commit.complete', array(&$this));
				
				$this->setCriteres();
				$this->setParents();
				
				return true;
			}
			
			return false;
		}
		
		parent::commit(false);
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Provider_ID` = '".Sql::EscapeString($this->Provider_ID)."',
								`Galery_ID` = '".Sql::EscapeString($this->Galery_ID)."',
								`Product_Code` = '".Sql::EscapeString($this->Product_Code)."',
								`Collection` = '".Sql::EscapeString($this->Collection)."',
								`Related_Collection` = '".Sql::EscapeString($this->Related_Collection)."',
								`Expiry_Date` = '".Sql::EscapeString($this->Expiry_Date)."',
								`Price` = '".Sql::EscapeString($this->Price)."',
								`Standard_Price` = '".Sql::EscapeString($this->Standard_Price)."',
								`Eco_Tax` = '".Sql::EscapeString($this->Eco_Tax)."',
								`Discount` = '".Sql::EscapeString($this->Discount)."',
								`Stock` = '".Sql::EscapeString($this->Stock)."',
								`Cost_Delivery` = '".Sql::EscapeString($this->Cost_Delivery)."',
								`Time_Delivery` = '".Sql::EscapeString($this->Time_Delivery)."',
								`Origin` = '".Sql::EscapeString($this->Origin)."',
								`Designer` = '".Sql::EscapeString($this->Designer)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Post_ID."'";
		
		System::Fire('myevent.product:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('myevent.product:commit.complete', array(&$this));
			
			$this->setCriteres();
			$this->setParents();
			
			return true;
		}
		return false;
	}	
/**
 * MyEventProduct#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		
		parent::delete();
		
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Post_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('myevent.product:remove', array(&$this));
			
			$request->from = 	MyEventProductCritere::TABLE_NAME;
			$request->exec('delete');
			
			$request->from = 	MyEventProduct::EXT_TABLE_NAME;
			$request->exec('delete');
			
			return true;
		}
		
		return false;

	}
/**
 * MyEventProduct#setCriteres() -> void
 *
 * Cette méthode enregistre les critères du produit.
 **/	
	protected function setCriteres(){
		$array = array();
		
		foreach( $this->Criteres as &$groups){
			
			foreach($groups as &$critere){
				if(empty($critere)) continue;
				
				$critere = new MyEventProductCritere($critere);
				$critere->Post_ID = $this->Post_ID;
				$critere->commit();
				array_push($array, $critere->Critere_ID);
			}		
		}
		
		$request = new Request();
		$request->from = MyEventProductCritere::TABLE_NAME;
		$request->where = ' Critere_ID NOT IN(' . implode(',', $array) .') AND Post_ID = ' . $this->Post_ID;
		
		$request->exec('delete');
	}
/**
 * MyEventProduct#setParents() -> void
 *
 * Cette méthode enregistre les sections parents du produits.
 **/
 	protected function setParents(){
		
		if(!is_array($this->Parent_ID_2)) return;
		
		$request = new Request();
		$request->from = self::EXT_TABLE_NAME;
		$request->where = self::PRIMARY_KEY . ' = ' . $this->Post_ID;
		
		$request->exec('remove');
		
		
		$request->where = '';
		
		$request->fields = 'Post_ID, Parent_ID';
		$request->values = 	'(' . $this->Post_ID . ', ' . implode('), (' . $this->Post_ID . ', ',  $this->Parent_ID_2). ')';
		
		$request->exec('insert');
	}
/**
 * MyEventProduct.exec(command) -> Number
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
				//var_dump($_POST[__CLASS__]);
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
				
				$tab = self::Distinct($_POST['field'], @$_POST['word'], @$_POST['default']);
				
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
 * MyEventProduct.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
	
	public static function Import(){
		
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'produits/';
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
 * MyEventProduct#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Post_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyEventProduct.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = '', $default = false){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct " . Sql::EscapeString($field) ." as text, " . Sql::EscapeString($field) ." as value";		
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
			
			if(!empty($default)){
				$result = 	array_merge(
								array(array('text' => MUI(is_string($default) && $default != 'true' ? $default : MUI('Choisissez')), 'value' => '')), 
								$result
							);
				$result['length']++;
			}
		}
		
		return $result; 
	}
/**
 * MyEventProduct.Title() -> String
 *
 * Cette méthode retourne le titre complet du produit.
 **/	
	static public function Title(){
		$array = 	array(self::Collection(), parent::Title());
		$criteres = self::Criteres('Color');
		
		if(count($criteres) > 0){
			array_push($array, $criteres[0]->Value->name);
		}
		
		return implode(', ', $array);	
	}
/**
 * MyEventProduct#getTitle() -> String
 *
 * Cette méthode retourne le titre complet du produit.
 **/	
	public function getTitle(){
		$array = 	array($this->Collection, $this->Title);
		$criteres = $this->getCriteres('Color');
		
		if(count($criteres) > 0){
			array_push($array, $criteres[0]->Value->name);
		}
		
		return implode(', ', $array);	
	}
/**
 * MyEventProduct.Collection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	static public function Collection(){
		return self::Current()->Collection;
	}
/**
 * MyEventProduct#getCollection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	public function getRelatedCollection(){
		return $this->Related_Collection;
	}
/**
 * MyEventProduct.Collection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	static public function RelatedCollection(){
		return self::Current()->Related_Collection;
	}
/**
 * MyEventProduct#getCollection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	public function getCollection(){
		return $this->Collection;
	}
/**
 * MyEventProduct#GetProductRelatedCollection() -> String
 *
 * Cette méthode retourne le liste des produits d'une collection.
 **/	
	static public function GetProductRelatedCollection($clauses = ''){
		$options = 						new stdClass();
		$options->Collection = 	self::RelatedCollection();
		//$options->exclude =				Post::ID();
		
		return self::GetList($clauses, $options);
	}
/**
 * MyEventProduct#GetProductCollection() -> String
 *
 * Cette méthode retourne le liste des produits d'une collection.
 **/	
	static public function GetProductCollection($clauses = ''){
		$options = 				new stdClass();
		$options->Collection = 	self::Collection();
		//$options->exclude =		Post::ID();
		
		return self::GetList($clauses, $options);
	}
	
	static public function PermalinkCollection(){
		return Blog::GetInfo('uri').'collections/' . Post::Sanitize(self::Collection(), '-');	
	}
	
	static public function PermalinkRelatedCollection(){
		return Blog::GetInfo('uri').'collections/' . Post::Sanitize(self::RelatedCollection(), '-');	
	}
/**
 * MyEventProduct.Criteres(type) -> Array
 * - type (String): Type de critères à lister.
 * 
 * Cette méthode retourne une collection de critère [[MyEventProductCritere]] liés au produit.
 **/	
	static public function Criteres($type = ''){
		$options =			new stdClass();
		$options->Post_ID = self::ID();
		$options->Type = 	$type;
			
		$array = 			MyEventProductCritere::GetList('', $options);
		$o =				array();
		
		for($i = 0; $i < $array['length']; $i++){
			array_push($o, new MyEventProductCritere($array[$i]));
		}
		
		return $o;
	}
/**
 * MyEventProduct#getCriteres(type) -> Array
 * - type (String): Type de critères à lister.
 * 
 * Cette méthode retourne une collection de critère [[MyEventProductCritere]] liés au produit.
 **/	
	public function getCriteres($type = ''){
		$options =			new stdClass();
		$options->Post_ID = $this->Post_ID;
		$options->Type = 	$type;
			
		$array = 			MyEventProductCritere::GetList('', $options);
		$o =				array();
		
		for($i = 0; $i < $array['length']; $i++){
			array_push($o, new MyEventProductCritere($array[$i]));
		}
		
		return $o;
	}
/**
 * MyEventProduct.Picture(number) -> Object
 * - number (Number): Numéro de la photo à récupérer
 * 
 * Cette méthode retourne une photo du produit.
 **/	
	static public function Picture($id = 0, $width = 0, $height = 0){
		$pictures =  self::Pictures();
		
		if(empty($pictures[$id])){
			return false;	
		}
		
		if(!empty($width) && !empty($height)){//demande de mise en cache de la photo
			
			return SystemCache::Push(array(
				'Src' => 	$pictures[$id],
				'Width' => 	$width,
				'Height' => $height,
				'ID' =>		self::ID() . '-' . basename($pictures[$id]) . '-' . $width . 'x'.$height
			));
			
		}
		
		return $pictures[$id];
	}
/**
 * MyEventProduct.Pictures() -> Array
 *
 * Cette méthode retourne une collection de photos [[MyEventProductCritere]] liées au produit.
 **/
	static public function Pictures(){
		return self::Criteres('Picture');			
	}
/**
 * MyEventProduct.Pictures() -> Array
 *
 * Cette méthode retourne une collection de photos [[MyEventProductCritere]] liées au produit.
 **/
	static public function Galery(){
		return self::Criteres('Galery');			
	}
/**
 * MyEventProduct.Showcases() -> Array
 *
 * Cette méthode retourne une collection de showcase [[MyEventProductCritere]] liés au produit.
 **/
	static public function Showcases(){
		return self::Criteres('Showcase');			
	}
/**
 * MyEventProduct.Dimensions() -> Array
 *
 * Cette méthode retourne une collection de dimension [[MyEventProductCritere]] liés au produit.
 **/
	static public function Dimensions(){
		return self::Criteres('Dimension');			
	}
/**
 * MyEventProduct.Matters() -> Array
 *
 * Cette méthode retourne une collection de spécifité [[MyEventProductCritere]] liés au produit.
 **/	
	static public function Matters(){
		return self::Criteres('Matter');			
	}
/**
 * MyEventProduct.Colors() -> Array
 *
 * Cette méthode retourne une collection de spécifité [[MyEventProductCritere]] liés au produit.
 **/	
	static public function Colors(){
		return self::Criteres('Color');			
	}
/**
 * MyEventProduct.Specificities() -> Array
 *
 * Cette méthode retourne une collection de spécifité [[MyEventProductCritere]] liés au produit.
 **/	
	static public function Specificities(){
		return self::Criteres('Specificity');			
	}
/**
 * MyEventProduct.StandardPrice(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix standard du produit formaté.
 **/
	static public function StandardPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Standard_Price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;	
	}
/**
 * MyEventProduct.HaveStandardPrice() -> Boolean
 *
 * Cette méthode indique si le produit a un prix standard.
 **/	
	static public function HaveStandardPrice(){
		return 1 * self::Current()->Standard_Price != 0;	
	}
/**
 * MyEventProduct.Price(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix du produit formaté.
 **/	
	static public function Price($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;	
	}
/**
 * MyEventProduct.EcoTax(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne l'éco taxe du produit.
 **/	
	static public function EcoTax($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;	
	}
/**
 * MyEventProduct.HaveEcoTax() -> Boolean
 *
 * Cette méthode indique si le produit possède un eco taxe.
 **/	
	static public function HaveEcoTax(){
		return 1 * self::Current()->Eco_Tax != 0;	
	}
/**
 * MyEventProduct.HaveDiscount() -> Boolean
 *
 * Cette méthode indique si le produit bénéficie d'une remise.
 **/	
	static public function HaveDiscount(){
		return 1 * self::Current()->Discount != 0 && self::Current()->Expiry_Date != '0000-00-00 00:00:00';	
	}
	
	static public function HaveExpiryDate(){
		return self::Current()->Expiry_Date != '0000-00-00 00:00:00';	
	}
	
	static public function ExpiryDate($format = '', $lang = 'fr', $encode = 'uft8'){
		return ObjectPrint::DateFormat(self::Current()->Expiry_Date, $format, $lang, $encode);
	}
/**
 * MyEventProduct#getCurrentPrice() -> Number
 *
 * Cette méthode retourne le prix du produit en fonction du prix de base et de sa remise éventuelle en fonction de la date du jour.
 **/	
	public function getCurrentPrice(){
		
		if(1 * $this->Discount != 0){
			if($this->Expiry_Date != '0000-00-00 00:00:00'){
				
				if($this->Expiry_Date >= date('Y-m-d H:i:s')){//remise temporaire
					return 	$this->Price - ($this->Price * $this->Discount / 100);
				}
				
			}else{//remise permanente
				return 	$this->Price - ($this->Price * $this->Discount / 100);
			}
		}
		
		// pas de remise
		return $this->Price;
	}
/**
 * MyEventProduct.Discount(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne la remise en %.
 **/	
	static public function Discount($dec_point = '.' , $thousands_sep = ','){
		return '-' . number_format(self::Current()->Discount, 1, $dec_point, $thousands_sep) . '%';	
	}
/**
 * MyEventProduct.DiscountPrice(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix du produit formaté remisé.
 **/	
	static public function DiscountPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price - (self::Current()->Price * self::Current()->Discount / 100), 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;	
	}
/**
 * MyEventProduct.Stock() -> String
 *
 * Cette méthode retourne le nombre de produit en stock.
 **/	
	static public function Stock(){
		return self::Current()->Stock;	
	}
/**
 * MyEventProduct.HaveStock() -> String
 *
 * Cette méthode indique si il y a du stock disponible pour le produit.
 **/	
	static public function HaveStock(){
		
		if(!MyEvent::StockEnable()){
			return true;
		}
		
		if(self::Current()->Stock == -1) return true;
		
		return self::Current()->Stock > 0;	
	}
/**
 * MyEventProduct.TimeDelivery() -> String
 *
 * Cette méthode retourne le temps de livraison du produit.
 **/	
	static public function TimeDelivery(){
		return self::Current()->Time_Delivery;
	}
/**
 * MyEventProduct.CostDelivery(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le coût de livraison du produit.
 **/	
	static public function CostDelivery($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;	
	}
/**
 * MyEventProduct.Children() -> Array
 * Cette méthode retourne la liste des posts enfants du post courant.
 **/
 	static public function Children($clauses = ''){
		$options =			new stdClass();
		$options->op = 		'-child';
		$options->value = 	Post::ID();
		
		$result = self::GetList($clauses, $options);
		
		return $result;
	}
/**
 * MyEventProduct.GetParentsID(id) -> Number
 * Cette méthode retourne la liste des id des parents secondaire (et direct) du produit.
 **/	
	static public function GetParentsID($id = NULL){
		if(empty($id)){
			$id = Post::ID();
		}
		
		$request = 			new Request();
		$request->from = 	self::EXT_TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY . ' = ' . (int) $id;
		
		$result = 	$request->exec('select');
		$array = 	array();
		
		for($i = 0; $i < $result['length']; $i++){
			array_push($array, $result[$i]['Parent_ID']);	
		}
				
		return $array;
	}
	
	public static function Count($options = NULL){
		$request = 			new Request();
		
		$request->select = 	'COUNT(*) as NB';
		$request->from = 	self::TABLE_NAME . ' Pr INNER JOIN '. Post::TABLE_NAME. ' Po ON Po.'.Post::PRIMARY_KEY . ' = Pr.'.Post::PRIMARY_KEY;
		$request->where =	'Type like "%page-myevent product%"'; 
		$request->order = 	'';
		//
		// Protection des pages privées et non publiées
 		//
		if(!User::IsConnect()){
			$request->where .=	' AND Po.Statut LIKE "%publish%" ';	
			$request->where .=	' AND Po.Statut NOT LIKE "%private%" ';
		}else{
			if(empty($options->draft)){
				$request->where .=	' AND Po.Statut LIKE "%publish%" ';	
			}
		}
		//
		// Gestion de l'exclusion de contenu
		//
		if(!empty($options->exclude)){
			if(is_array($options->exclude)){
				$request->where .=	" AND Po.Post_ID NOT IN(" . implode(',', $options->exclude) . ')';
			}else{
				$request->where .=	" AND Po.Post_ID != " . ((int) $options->exclude);
			}
		}
		//
		// Collection
		//
		if(!empty($options->Collection)){
			$request->where .= ' AND Collection = "' . Sql::EscapeString($options->Collection). '"'; 
		}
				
		switch(@$options->op){
			default:break;
				
			case '-expired':
				$request->where .= ' AND (Expiry_Date != "0000-00-00 00:00:00" AND Expiry_Date < "'.date('Y-m-d H:i:s') .'")';
				break;
				
			case '-not-expired':
				$request->where .= ' AND (Expiry_Date != "0000-00-00 00:00:00" AND Expiry_Date >= "'.date('Y-m-d H:i:s') .'")';
				break;
		}
		
		$nb = $request->exec('select');
		
		return $nb['length'] == 0 ? 0 : $nb[0]['NB'];
	}
/**
 * MyEventProduct.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*, CONCAT(Pr.Collection, ", ", Po.Title, " (Code: ", Product_Code, ")") as text, Po.Post_ID as value';
		$request->from = 	self::TABLE_NAME . ' Pr INNER JOIN '. Post::TABLE_NAME. ' Po ON Po.'.Post::PRIMARY_KEY . ' = Pr.'.Post::PRIMARY_KEY;
		$request->where =	'Type like "%page-myevent product%"'; 
		$request->order = 	'Po.Title ASC';
		//
		// Protection des pages privées et non publiées
 		//
		if(!User::IsConnect()){
			$request->where .=	' AND Po.Statut LIKE "%publish%" ';	
			$request->where .=	' AND Po.Statut NOT LIKE "%private%" ';
		}else{
			if(empty($options->draft)){
				$request->where .=	' AND Po.Statut LIKE "%publish%" ';	
			}
		}
		//
		// Gestion de l'exclusion de contenu
		//
		if(!empty($options->exclude)){
			if(is_array($options->exclude)){
				$request->where .=	" AND Po.Post_ID NOT IN(" . implode(',', $options->exclude) . ')';
			}else{
				$request->where .=	" AND Po.Post_ID != " . ((int) $options->exclude);
			}
		}
		//
		// Collection
		//
		if(!empty($options->Collection)){
			$request->where .= ' AND Collection = "' . Sql::EscapeString($options->Collection). '"'; 
		}
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		switch(@$options->op){
			default:
							
				break;
				
			case '-expired':
				$request->where .= ' AND (Expiry_Date != "0000-00-00 00:00:00" AND Expiry_Date < "'.date('Y-m-d H:i:s') .'")';
				break;
				
			case '-not-expired':
				$request->where .= ' AND (Expiry_Date != "0000-00-00 00:00:00" AND Expiry_Date >= "'.date('Y-m-d H:i:s') .'")';
				break;
				
			case "-children":
			case "-child":
				
				//récupérer l'arborescence des produits
				$array = 			MyEventMenu::GetChildrenPostID($options->value);
				
				array_push($array, $options->value);
								
				$request->select = 	'Pr.*, Po.*, U.Name AS AuthorName, U.FirstName, U.Login, U.Avatar, CONCAT(U.Name, \' \', U.FirstName) as Author';
				$request->from = 	self::TABLE_NAME . ' Pr INNER JOIN ' . Post::TABLE_NAME . ' Po ON Pr.'.Post::PRIMARY_KEY . ' = Po.'.Post::PRIMARY_KEY . '
									LEFT JOIN ' . User::TABLE_NAME . " AS U ON Po.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
									
				$request->where .=	" AND (
					Parent_ID IN(" . implode(',', $array).")
					OR Po.Post_ID IN(
						SELECT Post_ID
						FROM " . self::EXT_TABLE_NAME . "
						WHERE Parent_ID = ". (int) $options->value . "
					)
				)";
				
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Societe as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Post_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Provider_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Galery_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Product_Code` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Collection` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Related_Collection` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Expiry_Date` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Price` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Standard_Price` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Discount` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Stock` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Cost_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Time_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Origin` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Designer` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('myevent.product:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
			
			if(!empty($options->statistics)){
				$options->op = '-expired';
				$result['NbExpired'] = 		self::Count($options);
				$options->op = '';
				$result['NbAll'] = 			self::Count($options);
				$options->op = '-not-expired';
				$result['NbNotExpired'] = 	self::Count($options);
			}
			
		}
		
		Post::$Post = $result['length'] > 0 ? $result[0] : false;
		
		return Post::$Posts = $result; 
	}
	
	public static function onGetList(&$row){
		$options = new stdClass();
		$options->Post_ID = $row['Post_ID'];
		
		$criteres = MyEventProductCritere::GetList('', $options);
		
		$row['Criteres'] = new stdClass();
		
		for($i = 0; $i < $criteres['length']; $i++){
			$type = $criteres[$i]['Type'] . 's';
			
			if($criteres[$i]['Type'] == 'Galery'){
				$type = 'Galery';
			}elseif($criteres[$i]['Type'] == 'Specificity'){
				$type = 'Specificities';
			}
			
			if(empty($row['Criteres']->{$type})){
				$row['Criteres']->{$type} = array(); 
			}
			
			array_push($row['Criteres']->{$type}, $criteres[$i]);
		}
		
		
		if(!empty($row['Criteres']->Pictures)){
			$picture = new MyEventProductCritere($row['Criteres']->Pictures[0]);
			
			$row['icon'] = SystemCache::Push(array(
				'Src' => $picture->getSrc(),
				'Width' => 24,
				'Height' => 24,
				'ID' => basename($picture->getSrc()) . '-24-24'
			));
		}
		
		$row['Parent_ID_2'] = self::GetParentsID($row['Post_ID']);
		//
		// Création des pages collections au besoin
		//
		$post = Post::ByName('collections/'.Post::Sanitize($row['Collection'], '-'));
		
		if($post->Post_ID == 0){
			$post = new Post();
			$post->Title = 			$row['Collection'];
			$post->Template = 		'page-myevent-collection.php';
			$post->Type =			'page-myevent collection';
			$post->Name =			'collections/'.Post::Sanitize($row['Collection'], '-');
			$post->Parent_ID =		System::Meta('MYEVENT_PAGE_COLLECTIONS_ID');
			$post->Statut =			'publish';
			$post->Comment_Statut =	'close';
			
			$post->commit();
		}
	}
}

MyEventProduct::Initialize();

?>