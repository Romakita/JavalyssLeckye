<?php
/** section: Plugins
 * class MyStoreProduct
 * includes Post
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_product.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreProduct extends Post{	
	const PRE_OP =				'mystore.product.';
/**
 * MyStoreProduct.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_products';
	
	const EXT_TABLE_NAME = 		'mystore_products_parents';	
/**
 * MyStoreProduct.PRIMARY_KEY -> String
 * Clef primaire de la table MyStoreProduct.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Post_ID';

/**
 * MyStoreProduct#Post_ID -> Number
 **/
	public $Post_ID = 0;
	
	public $Parent_ID_2 = NULL;
/**
 * MyStoreProduct#Provider_ID -> Number
 **/
	public $Provider_ID = 0;
/**
 * MyStoreProduct#Galery_ID -> Number
 **/
	public $Galery_ID = 0;
/**
 * MyStoreProduct#Product_Code -> String
 * Varchar
 **/
	public $Product_Code = "";
/**
 * MyStoreProduct#Collection -> String
 * Varchar
 **/
	public $Collection = "";
/**
 * MyStoreProduct#Related_Collection -> String
 * Varchar
 **/
	public $Related_Collection = "";
/**
 * MyStoreProduct#Expiry_Date -> Datetime
 **/
	public $Expiry_Date = '0000-00-00 00:00:00';
/**
 * MyStoreProduct#Price -> Float
 * Decimal
 **/
	public $Price = 0.00;
/**
 * MyStoreProduct#Standard_Price -> Float
 * Decimal
 **/
	public $Standard_Price = 0.00;
/**
 * MyStoreProduct#Eco_Tax -> Float
 * Decimal
 **/
	public $Eco_Tax = 0.00;
/**
 * MyStoreProduct#Discount -> Float
 * Decimal
 **/
	public $Discount = 0.0;
/**
 * MyStoreProduct#Stock -> Number
 **/
	public $Stock = 0;
/**
 * MyStoreProduct#Cost_Delivery -> Float
 * Decimal
 **/
	public $Cost_Delivery = 0.00;
/**
 * MyStoreProduct#Time_Delivery -> String
 * Varchar
 **/
	public $Time_Delivery = "";
/**
 * MyStoreProduct#Origin -> String
 * Varchar
 **/
	public $Origin = "";
/**
 * MyStoreProduct#Designer -> String
 * Varchar
 **/
	public $Designer = "";
/**
 * MyStoreProduct#Criteres -> String
 * Text
 **/
	public $Criteres = "";

/**
 * new MyStoreProduct()
 * new MyStoreProduct(json)
 * new MyStoreProduct(array)
 * new MyStoreProduct(obj)
 * new MyStoreProduct(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreProduct]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreProduct]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreProduct]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreProduct]].
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
 * MyStoreProduct.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('system.search', array(__CLASS__, 'Search'));
		
		System::Observe('blog:post.build', array(__CLASS__, 'onBuildPost')); 
		System::Observe('blog:post.breadcrumbs', array(__CLASS__, 'onBuildBreadCrumbs'));
		
		System::EnqueueScript('mystore.product', Plugin::Uri().'js/mystore_product.js');
		System::EnqueueScript('mystore.outofstock', Plugin::Uri().'js/mystore_outofstock.js');
		
		include_once('class_mystore_product_critere.php');
		include_once('class_mystore_product_relation.php');
		include_once('class_mystore_selection.php');
		include_once('class_mystore_product_designer.php');
	}
	
	public static function onBuildPost(){
		
		if(strpos(Post::Type(), 'page-mystore product') !== false){
			$post = 	self::Current();
			$product = 	new self((int) Post::ID());
			$product->Picture = MyStoreProduct::Picture(0, 400, 400);
			
			self::Set($product);
			
		}
	}
	
	public static function onBuildBreadCrumbs($post){
		
		if(strpos($post->Type, 'page-mystore product') !== false){
			$product = 	new self((int) $post->Post_ID);
			$post->Title = $product->getTitle();
		}
	}
/**
 * MyStoreProduct.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `mystore_products` (
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Provider_ID` bigint(20) NOT NULL,
		  `Galery_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Product_Code` varchar(20) NOT NULL,
		  `Collection` varchar(200) NOT NULL DEFAULT '',
		  `Related_Collection` varchar(200) NOT NULL DEFAULT '',
		  `Expiry_Date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Price` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Standard_Price` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0',
		  `Discount` decimal(3,1) NOT NULL DEFAULT '0.0',
		  `Stock` int(11) NOT NULL DEFAULT '0',
		  `Cost_Delivery` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Time_Delivery` varchar(200) NOT NULL,
		  `Origin` varchar(30) NOT NULL,
		  `Designer` BIGINT NOT NULL,
		  PRIMARY KEY (`Post_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Table des produits'";
		$request->exec('query');	
		
		$request->query = 	"CREATE TABLE IF NOT EXISTS `mystore_products_parents` (
		  `Post_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Parent_ID` bigint(20) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`Post_ID`,`Parent_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');
		
		$request->query = "ALTER TABLE `mystore_products` CHANGE `Designer` `Designer` BIGINT NOT NULL";
		$request->exec('query');
		
		
		$request->query = "ALTER TABLE `mystore_products` ADD `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0' AFTER `Standard_Price`";
		$request->exec('query');
		
		MyStoreSelection::Install();
		MyStoreProductRelation::Install();
	}
/**	
 * MyStoreProduct#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit($rev = false){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Post_ID == 0){
			
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
			
			System::Fire('mystore.product:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Post_ID = $request->exec('lastinsert');
				
				System::Fire('mystore.product:commit.complete', array(&$this, &$request));
				
				$this->setCriteres();
				$this->setParents();
				$this->setCollection();
				
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
		
		System::Fire('mystore.product:commit', array(&$this, &$request));
		
		if($request->exec('update')){
		
			System::Fire('mystore.product:commit.complete', array(&$this, &$request));
			
			$this->setCriteres();
			$this->setParents();
			$this->setCollection();
			
			return true;
		}
		return false;
	}
	
	public function setCollection(){
		
		if(!empty($this->Collection)){
			$post = Post::ByName('collections/'.Post::Sanitize($this->Collection));
			
			if($post->Post_ID == 0){
				
				$post = new Post();
				$post->Title = 			$this->Collection;
				$post->Template = 		'page-mystore-collection.php';
				$post->Type =			'page-mystore collection';
				$post->Name =			'collections/'.Post::Sanitize($this->Collection);
				$post->Parent_ID =		Post::ByName('collections')->Post_ID;
				$post->Statut =			'publish';
				$post->Comment_Statut =	'close';
				
				$post->commit();
			}
			
		}
		
		if(!empty($this->Related_Collection)){
			$post = Post::ByName('collections/'.Post::Sanitize($this->Related_Collection));
			
			if($post->Post_ID == 0){
				
				$post = new Post();
				$post->Title = 			$this->Related_Collection;
				$post->Template = 		'page-mystore-collection.php';
				$post->Type =			'page-mystore collection';
				$post->Name =			'collections/'.Post::Sanitize($this->Related_Collection);
				$post->Parent_ID =		Post::ByName('collections')->Post_ID;
				$post->Statut =			'publish';
				$post->Comment_Statut =	'close';
				
				$post->commit();
			}
		}
					
	}
	
	public function refreshPermalink(){
		$this->Name = explode('/', $this->Name);
					
		$criteres = $this->getCriteres('Color');
		$title = 	$this->getTitle();
		
		if(count($criteres) > 1){
			$title .= ' ' . $criteres[1]->Value->name;
		}
		
		$this->Name[count($this->Name) -1] = Post::Sanitize(trim($title));
		$this->Name = implode('/', $this->Name);	
		
		return $this->commit();	
	}
/**
 * MyStoreProduct#delete() -> Boolean
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
			System::Fire('mystore.product:remove', array(&$this));
			
			$request->from = 	MyStoreProductCritere::TABLE_NAME;
			$request->exec('delete');
			
			$request->from = 	MyStoreProduct::EXT_TABLE_NAME;
			$request->exec('delete');
			
			return true;
		}
		
		return false;

	}
/**
 * MyStoreProduct#setCriteres() -> void
 *
 * Cette méthode enregistre les critères du produit.
 **/	
	protected function setCriteres(){
		$array = array();
		
		foreach( $this->Criteres as &$groups){
			
			foreach($groups as &$critere){
				if(empty($critere)) continue;
				
				$critere = new MyStoreProductCritere($critere);
				$critere->Post_ID = $this->Post_ID;
				$critere->commit();
				array_push($array, $critere->Critere_ID);
			}		
		}
		
		$request = new Request();
		$request->from = MyStoreProductCritere::TABLE_NAME;
		
		if(empty($array)){
			$request->where = ' Post_ID = ' . $this->Post_ID;
		}else{
			$request->where = ' Critere_ID NOT IN(' . implode(',', $array) .') AND Post_ID = ' . $this->Post_ID;
		}
		
		$request->exec('delete');
	}
/**
 * MyStoreProduct#setParents() -> void
 *
 * Cette méthode enregistre les sections parents du produits.
 **/
 	protected function setParents(){
		
		if(!is_array($this->Parent_ID_2)) return;
		
		$request = new Request();
		$request->from = self::EXT_TABLE_NAME;
		$request->where = self::PRIMARY_KEY . ' = ' . $this->Post_ID;
		
		$request->exec('delete');
		
		$request->where = '';
		
		$request->fields = 'Post_ID, Parent_ID';
		$request->values = 	'(' . $this->Post_ID . ', ' . implode('), (' . $this->Post_ID . ', ',  $this->Parent_ID_2). ')';
		
		$request->exec('insert');
	}
/**
 * MyStoreProduct.exec(command) -> Number
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
 * MyStoreProduct.execSafe(command) -> Number
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
 * MyStoreProduct#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Post_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyStoreProduct.Distinct(field [, word]) -> Array
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
 * MyStoreProduct.Search(word) -> void
 **/	
	public static function Search($word){
		if(!Plugin::HaveAccess('MyStore')){
			return;
		}
		
		$clauses = new stdClass();
		$clauses->where = $word;
		$clauses->draft = true;
		
		$result = self::GetList($clauses, $clauses);
		
		if(!$result){
			die(Sql::Current()->getError());
		}
		
		for($i = 0; $i < $result['length']; $i++){
			
			$o = new self($result[$i]);
			self::Set($o);
			
			$obj = new IntelliSearch($o);
			
			$obj->onClick('System.MyStore.Product.openFromSearch');
			
			$obj->setIcon(self::Picture(0, 40, 40));
			
			$obj->setAppIcon('mystore');
			$obj->setAppName(MUI('Produits'));
			
			IntelliSearch::Add($obj);
		}
	}
	
	static public function Categories($char = ' > '){
		$cat = '';
		
		$parent = self::Current();
		
		$i = 0;
		
		while($parent->Parent_ID != 0 && $i < 5){
			
			$parent = 	new Post((int) $parent->Parent_ID, false);
			
			$cat = $parent->Title . ($cat == '' ? '' : $char) . $cat;
			
			$i++;
		}
		
		return $cat;
	}
/**
 * MyStoreProduct.Title() -> String
 *
 * Cette méthode retourne le titre complet du produit.
 **/	
	static public function Title(){
		$array = 	array(self::Collection(), parent::Title());
		$criteres = self::Criteres('Color');
		
		if(count($criteres) > 0){
			array_push($array, $criteres[0]->Value->name);
		}
		
		return implode(' ', $array);
	}
/**
 * MyStoreProduct#getTitle() -> String
 *
 * Cette méthode retourne le titre complet du produit.
 **/	
	public function getTitle(){
		$array = 	array($this->Collection, $this->Title);
		$criteres = $this->getCriteres('Color');
		
		if(count($criteres) > 0){
			array_push($array, $criteres[0]->Value->name);
		}
		
		return implode(' ', $array);	
	}
/**
 * MyStoreProduct#getDeclinations() -> Array
 *
 * Cette méthode retourne la liste des déclinaisons avec le stocks total et stock réel par déclinaison si la gestion des stocks est activée.
 **/	
	public function getDeclinations(){
		
		$array = $this->getCriteres('Declination');
		
		if(!MyStore::StockEnable()){
			return $array;
		}
		
		$array['length'] = 		count($array);
		$array['Stock'] =  		0;
		$array['OutOfStock'] = 	false;
				
		for($i = 0; $i < $array['length']; $i++){
			
			$array[$i]->Value->realStock = $this->getDeclinationStock($array[$i]);
				
			if($array[$i]->Value->realStock <= 0){
				$array['OutOfStock'] = true;	
			}
				
			$array['Stock'] += $array[$i]->Value->realStock;
		}
				
		return $array;
	}
/**
 * MyStoreProduct#getDeclinationStock(id) -> Number
 * MyStoreProduct#getDeclinationStock(obj) -> Number
 * - id (Number): Identifiant de la déclinaison.
 * - obj (Object|Array|MyStoreProductCritere): Objet contenant les informations d'une déclinaison.
 *
 * Cette méthode retourne le stock réel d'une déclinaison.
 **/	
	public function getDeclinationStock($id){
		$declination = new MyStoreProductCritere($id);
		$nb = MyStoreCommandProduct::LockedStock($this, $declination->Critere_ID);	
		return $declination->getStock() - $nb;
	}
/**
 * MyStoreProduct#getDefaultDeclinationID() -> Number
 *
 * Cette méthode retourne l'id de la déclinaison par défaut.
 **/	
	public function getDefaultDeclinationID(){
		$array = $this->getCriteres('Declination');
		
		foreach($array as $declination){
			if($declination->isDefault()){
				return $declination->Critere_ID;
			}
		}
		
		return 0;
	}
/**
 * MyStoreProduct#countDeclinations() -> Number
 *
 * Cette méthode retourne le nombre de déclinaison du produit.
 **/	
	public function countDeclinations(){
		return count($this->getCriteres('Declination'));
	}
/**
 * MyStoreProduct.Collection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	static public function Collection(){
		
		
		return self::Current()->Collection;
	}
/**
 * MyStoreProduct#getCollection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	public function getCollection(){
		return $this->Collection;
	}
/**
 * MyStoreProduct#GetProductCollection() -> String
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
/**
 * MyStoreProduct#getCollection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	public function getRelatedCollection(){
		return $this->Related_Collection;
	}
/**
 * MyStoreProduct.Collection() -> String
 *
 * Cette méthode retourne le nom de la collection du produit.
 **/	
	static public function RelatedCollection(){
		return self::Current()->Related_Collection;
	}
/**
 * MyStoreProduct#GetProductRelatedCollection() -> String
 *
 * Cette méthode retourne le liste des produits d'une collection.
 **/	
	static public function GetProductRelatedCollection($clauses = ''){
		$options = 						new stdClass();
		$options->Collection = 	self::RelatedCollection();
		//$options->exclude =				Post::ID();
		
		return self::GetList($clauses, $options);
	}
	
	static public function PermalinkRelatedCollection(){
		return Blog::GetInfo('uri').'collections/' . Post::Sanitize(self::RelatedCollection(), '-');	
	}
/**
 * MyStoreProduct#GetProductRelated() -> String
 *
 * Cette méthode retourne le liste des produits directement reliés entres eux.
 **/	
	static public function GetProductRelated($clauses = ''){
		$options = 				new stdClass();
		$options->Post_ID =	self::ID();
		
		$list = MyStoreProductRelation::GetList($clauses, $options);
		
		self::SetList($list);
		
		return $list;
	}
/**
 * MyStoreProduct.Criteres(type) -> Array
 * - type (String): Type de critères à lister.
 * 
 * Cette méthode retourne une collection de critère [[MyStoreProductCritere]] liés au produit.
 **/	
	static public function Criteres($type = ''){
		$options =			new stdClass();
		$options->Post_ID = self::ID();
		$options->Type = 	$type;
			
		$array = 			MyStoreProductCritere::GetList('', $options);
		$o =				array();
		
		for($i = 0; $i < $array['length']; $i++){
			array_push($o, new MyStoreProductCritere($array[$i]));
		}
		
		return $o;
	}
/**
 * MyStoreProduct#getCriteres(type) -> Array
 * - type (String): Type de critères à lister.
 * 
 * Cette méthode retourne une collection de critère [[MyStoreProductCritere]] liés au produit.
 **/	
	public function getCriteres($type = ''){
		$options =			new stdClass();
		$options->Post_ID = $this->Post_ID;
		$options->Type = 	$type;
			
		$array = 			MyStoreProductCritere::GetList('', $options);
		$o =				array();
		
		for($i = 0; $i < $array['length']; $i++){
			array_push($o, new MyStoreProductCritere($array[$i]));
		}
		
		return $o;
	}
/**
 * MyStoreProduct.Designer() -> MyStoreProductDegigner
 *
 * Cette méthode retourne le designer du produit.
 **/	
	static public function Designer(){
		return new MyStoreProductDesigner((int) self::Current()->Designer);
	}
	
	static public function HaveDesigner(){
		return self::Current()->Designer != 0;
	}
/**
 * MyStoreProduct#getCollection() -> String
 *
 * Cette méthode retourne le designer du produit.
 **/	
	public function getDesigner(){
		return new MyStoreProductDesigner((int) $this->Designer);
	}
/**
 * MyStoreProduct.Picture(number) -> Object
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
 * MyStoreProduct.Pictures() -> Array
 *
 * Cette méthode retourne une collection de photos [[MyStoreProductCritere]] liées au produit.
 **/
	static public function Pictures(){
		return self::Criteres('Picture');			
	}
/**
 * MyStoreProduct.Pictures() -> Array
 *
 * Cette méthode retourne une collection de photos [[MyStoreProductCritere]] liées au produit.
 **/
	static public function Galery(){
		return self::Criteres('Galery');			
	}
/**
 * MyStoreProduct.Showcases() -> Array
 *
 * Cette méthode retourne une collection de showcase [[MyStoreProductCritere]] liées au produit.
 **/
	static public function Showcases(){
		return self::Criteres('Showcase');			
	}
/**
 * MyStoreProduct.Dimensions() -> Array
 *
 * Cette méthode retourne une collection de dimension [[MyStoreProductCritere]] liées au produit.
 **/
	static public function Dimensions(){
		return self::Criteres('Dimension');			
	}
/**
 * MyStoreProduct.Matters() -> Array
 *
 * Cette méthode retourne une collection de matière [[MyStoreProductCritere]] liées au produit.
 **/	
	static public function Matters(){
		return self::Criteres('Matter');			
	}
/**
 * MyStoreProduct.HaveDeclination() -> Boolean
 *
 * Cette méthode indique si le produit à des déclinaisons.
 **/	
	static public function HaveDeclination(){
		return count(self::Criteres('Declination')) > 0;
	}
/**
 * MyStoreProduct.Declinations() -> Array
 *
 * Cette méthode retourne une collection de déclinaison [[MyStoreProductCritere]] liées au produit.
 **/	
	static public function Declinations(){
		return self::Current()->getDeclinations();
	}
/**
 * MyStoreProduct.DrawDeclinations() -> void
 *
 * Cette méthode affiche une liste Select de déclinaison.
 **/	
	static public function DrawDeclinations($value = ''){
		
		$declinations = self::Declinations();
		
		?>
        <select class="box-select declinations" name="Declinaison_ID">
        <?php		
		for($i = 0; $i < count($declinations); $i++):
			$declination = $declinations[$i];
			
			if(MyStore::StockEnable()){
				if($declination->Value->realStock < 1){//pas de stock dispo
					continue;
				}
			}
			
			$selected = $value != '' ? ($value == $declination->Critere_ID) : $declination->Value->default;
			
		?>
        
        	<option value="<?php echo $declination->Critere_ID?>"<?php echo $selected ? ' selected=selected' : '' ?>><?php echo $declination->getTitle() ?></option>
            
        <?php
		endfor;
		?>
        </select>
      	<?php
			
	}

/**
 * MyStoreProduct.Colors() -> Array
 *
 * Cette méthode retourne une collection de spécifité [[MyStoreProductCritere]] liés au produit.
 **/	
	static public function Colors(){
		return self::Criteres('Color');			
	}
/**
 * MyStoreProduct.Specificities() -> Array
 *
 * Cette méthode retourne une collection de spécifité [[MyStoreProductCritere]] liés au produit.
 **/	
	static public function Specificities(){
		return self::Criteres('Specificity');			
	}
/**
 * MyStoreProduct.StandardPrice(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix standard du produit formaté.
 **/
	static public function StandardPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Standard_Price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.HaveStandardPrice() -> Boolean
 *
 * Cette méthode indique si le produit a un prix standard.
 **/	
	static public function HaveStandardPrice(){
		return 1 * self::Current()->Standard_Price != 0;	
	}
/**
 * MyStoreProduct.Price(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix du produit formaté.
 **/	
	static public function Price($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.Price(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix du produit formaté.
 **/	
	static public function PriceHT($dec_point = '.' , $thousands_sep = ','){
		
		$price = self::Current()->Price;
		
		switch(MyStore::ModeTVA()){
				
			case MyStore::TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$price = 	$price / ((MyStore::TVA() / 100) + 1);
				break;
		}
				
		return number_format($price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.PriceTTC(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix du produit formaté.
 **/	
	static public function PriceTTC($dec_point = '.' , $thousands_sep = ','){
		
		$price = self::Current()->Price;
		
		switch(MyStore::ModeTVA()){
			case MyStore::TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				$price = 	$price + (($price * MyStore::TVA()) / 100);
				break;
		}
		
		return number_format($price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.EcoTax(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne l'éco taxe du produit.
 **/	
	static public function EcoTax($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.HaveEcoTax() -> Boolean
 *
 * Cette méthode indique si le produit possède un eco taxe.
 **/	
	static public function HaveEcoTax(){
		return 1 * self::Current()->Eco_Tax != 0;	
	}
/**
 * MyStoreProduct.HaveDiscount() -> Boolean
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
 * MyStoreProduct#getCurrentPrice() -> Number
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
 * MyStoreProduct.Discount(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne la remise en %.
 **/	
	static public function Discount($dec_point = '.' , $thousands_sep = ','){
		return '-' . number_format(self::Current()->Discount, 1, $dec_point, $thousands_sep) . '%';	
	}
/**
 * MyStoreProduct.DiscountPrice(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le prix du produit formaté remisé.
 **/	
	static public function DiscountPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price - (self::Current()->Price * self::Current()->Discount / 100), 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.Stock([id]) -> Number
 * MyStoreProduct.Stock([obj]) -> Number
 * - obj(MyStoreProduct): Produit.
 *
 * Cette méthode retourne le nombre de produit en stock réel.
 **/	
	static public function Stock($id = 0){
			
		if(empty($id)){
			$product = self::Current();
		}else{
			$product = new self($id);	
		}
		
		return $product->getStock();	
	}
/**
 * MyStoreProduct#getStock() -> Number
 * MyStoreProduct#getStock() -> Number
 *
 * Cette méthode retourne le nombre de produit en stock réel.
 **/	
	public function getStock(){
		
		$declinations = $this->getDeclinations();
		
		if(!empty($declinations) && $declinations['length'] > 0){
			$stocks = $this->getDeclinations();
			return $stocks['Stock'];
		}
		
		$nb = MyStoreCommandProduct::LockedStock($this);
			
		return $this->Stock - $nb;		
	}
/**
 * MyStoreProduct.HaveStock() -> String
 *
 * Cette méthode indique si il y a du stock disponible pour le produit.
 **/	
	static public function HaveStock(){
		
		if(!MyStore::StockEnable()){
			return true;
		}
		
		if(self::HaveDeclination()){
			$array = self::Criteres('Declination');
			
			for($i = 0; $i < count($array); $i++){			
				$nb = MyStoreCommandProduct::LockedStock(self::Current(), $array[$i]->Critere_ID);		
				
				$array[$i]->Value->realStock = $array[$i]->Value->stock - $nb;
					
				if($array[$i]->Value->realStock > 0){
					return true;
				}
			}
			
			return false;
		}
		
		return self::Stock() > 0;	
	}
/**
 * MyStoreProduct.TimeDelivery() -> String
 *
 * Cette méthode retourne le temps de livraison du produit.
 **/	
	static public function TimeDelivery(){
		return self::Current()->Time_Delivery;
	}
/**
 * MyStoreProduct.CostDelivery(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne le coût de livraison du produit.
 **/	
	static public function CostDelivery($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;	
	}
/**
 * MyStoreProduct.Children() -> Array
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
 * MyStoreProduct.GetParentsID(id) -> Number
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
		$request->where =	'Type like "%page-mystore product%"'; 
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
			case '-draft':
				$request->where .=	' AND Po.Statut LIKE "%draft%" ';
				break;	
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
 * MyStoreProduct.GetList([clauses [, options]]) -> Array | boolean
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
		$request->where =	'Type like "%page-mystore product%"'; 
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
		//
		// Categorie
		//
		if(!empty($options->Category)){
			$array = 			MyStoreMenu::GetChildrenPostID($options->Category);
				
			array_push($array, $options->Category);
			
			$request->where .=	" AND (
				Po.Parent_ID IN(" . implode(',', $array).")
				OR Po.Post_ID IN(
					SELECT Post_ID
					FROM " . self::EXT_TABLE_NAME . "
					WHERE Parent_ID IN(" . implode(',', $array).")
				)
			)";
			
		}
		
		if(!empty($options->Designer)){
						
			$request->where .=	" AND Designer = " . (int) $options->Designer;
			
		}
		
		
		switch(@$options->op){
			default:			
				break;
			
			case '-outofstock':
				$options->unset = true;
				
				$request->onexec = array(__CLASS__, 'onGetOutOfStock');
				
				break;
					
			case '-distinct-designer':
				$options->unset = true;
				$request->select = 	'De.*';
				$request->from .= 	' INNER JOIN ' . MyStoreProductDesigner::TABLE_NAME . ' De ON Designer = De.Contact_ID';
				$request->group =	'Contact_ID';
				$request->order =	'De.Name, De.FirstName';
				break;
								
			case '-expired':
				$request->where .= ' AND (Expiry_Date != "0000-00-00 00:00:00" AND Expiry_Date < "'.date('Y-m-d H:i:s') .'")';
				break;
				
			case '-not-expired':
				$request->where .= ' AND (Expiry_Date != "0000-00-00 00:00:00" AND Expiry_Date >= "'.date('Y-m-d H:i:s') .'")';
				break;
			case '-draft':
				$request->where .=	' AND Po.Statut LIKE "%draft%" ';	
				break;
				
			case "-children":
			case "-child":
				
				//récupérer l'arborescence des produits
				$array = 			MyStoreMenu::GetChildrenPostID($options->value);
				
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
		
		if(empty($options->unset)){
			$request->observe(array(__CLASS__, 'onGetList'));	
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
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
		System::Fire('mystore.product:list', array(&$request, $options));
				
		$result = $request->exec('select');
	//	echo $request->query;
			
		if($result){
			
			$result['maxLength'] = Sql::Count($request->from, $request->where . ($request->group != '' ? 'GROUP BY '. $request->group : ''));
			
			if(!empty($options->statistics)){
				$options->op = '-expired';
				$result['NbExpired'] = 		self::Count($options);
				$options->op = '';
				$result['NbAll'] = 			$result['maxLength'];
				$options->op = '-not-expired';
				$result['NbNotExpired'] = 	self::Count($options);
				$options->op = '-draft';
				$result['NbDraft'] = 		self::Count($options);
			}
			
			if(!empty($options->default)){
				
				$o = new self();
				$o->Title = $o->text = 	is_string($options->default) ? $options->default : MUI('Choisissez');
				$o->value = 0;
				
				$result = array_merge(array($o), $result);
					
				$result['length'] = $result['length']+1;	
			}
			
			if(empty($options->unset)){
				self::SetList($result);
			}
			
		}else{
			self::$Posts = self::$Post = false;
		}
		
		return $result; 
	}
/**
 * MyStoreProduct.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/		
	public static function onGetList(&$row, &$request){
		$options = new stdClass();
		$options->Post_ID = $row['Post_ID'];
		
		$criteres = MyStoreProductCritere::GetList('', $options);
		
		$row['Criteres'] = new stdClass();
		
		if(!empty($row['Post_ID'])){
			$row['NbComments'] = 	PostComment::Count($row['Post_ID']);
			$row['Note'] = 			PostComment::Note($row['Post_ID']);
		}
		
		for($i = 0; $i < $criteres['length']; $i++){
			$type = $criteres[$i]['Type'] . 's';
			
			switch($criteres[$i]['Type']){
				case 'Galery':
					$type = 'Galery';
					break;
				case 'Specificity':
				$type = 'Specificities';
					break;
			}
						
			if(empty($row['Criteres']->{$type})){
				$row['Criteres']->{$type} = array(); 
			}
			
			array_push($row['Criteres']->{$type}, $criteres[$i]);
		}
		
		
		if(!empty($row['Criteres']->Pictures)){
			$picture = new MyStoreProductCritere($row['Criteres']->Pictures[0]);
			
			if(file_exists($picture->getSrc())){
				$row['icon'] = SystemCache::Push(array(
					'Src' => 	$picture->getSrc(),
					'Width' => 	24,
					'Height' => 24,
					'ID' => 	basename($picture->getSrc()) . '-24-24'
				));
			}
		}
				
		$row['Parent_ID_2'] = self::GetParentsID($row['Post_ID']);
		//
		// Calcul Stock réel
		//
		if(MyStore::StockEnable()){
			if(!empty($row['Criteres']->Declinations)){
				
				$product = new self($row);
				$row['Criteres']->Declinations = $product->getDeclinations();
				
			}else{
				$row['Real_Stock'] = self::Stock($row);
			}
		}
	}
/**
 * MyStoreProduct.onGetOutOfStock(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/		
	public static function onGetOutOfStock(&$row, &$request){
		
		self::onGetList($row, $request);
		
		if(MyStore::StockEnable()){
			if(!empty($row['Criteres']->Declinations)){
				
				if(!$row['Criteres']->Declinations['OutOfStock']){
					return true;
				}
				
			}else{
				if($row['Real_Stock'] > 0){
					return true;
				}
			}
		}
	}
}

MyStoreProduct::Initialize();

?>