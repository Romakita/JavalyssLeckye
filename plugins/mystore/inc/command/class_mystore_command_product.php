<?php
/** section: MyStore
 * class MyStoreCommandProduct
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_command_product.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreCommandProduct extends ObjectTools{	
	const PRE_OP =				'mystore.command.product.';
/**
 * MystoreCommandProduct.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_command_products';	
/**
 * MystoreCommandProduct.PRIMARY_KEY -> String
 * Clef primaire de la table MystoreCommandProduct.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Detail_ID';
/**
 * MystoreCommandProduct#Detail_ID -> Number
 **/
	public $Detail_ID = 0;
/**
 * MystoreCommandProduct#Command_ID -> Number
 **/
	public $Command_ID = 0;
/**
 * MystoreCommandProduct#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * MystoreCommandProduct#Qte -> Number
 **/
	public $Qte = 0;
/**
 * MystoreCommandProduct#Reference -> String
 * Varchar
 **/
	public $Reference = "";
/**
 * MystoreCommandProduct#Declinaison_ID -> Number
 **/
	public $Declinaison_ID = 0;
/**
 * MystoreCommandProduct#Price -> Float
 * Decimal
 **/
	public $Price = 0.00;
/**
 * MystoreCommandProduct#Cost_Delivery -> Float
 * Decimal
 **/
	public $Cost_Delivery = 0.00;
/**
 * MystoreCommandProduct#Eco_Tax -> Float
 * Decimal
 **/
	public $Eco_Tax = 0.00;
	
	public static $List = 		NULL;
	public static $Instance = 	NULL;
/**
 * new MyStoreCommandProduct()
 * new MyStoreCommandProduct(json)
 * new MyStoreCommandProduct(array)
 * new MyStoreCommandProduct(obj)
 * new MyStoreCommandProduct(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreCommandProduct]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreCommandProduct]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreCommandProduct]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreCommandProduct]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			
			if($arg_list[0] instanceof MyStoreProduct){
				$this->Post_ID = 		$arg_list[0]->Post_ID;
				$this->Price =			$arg_list[0]->getCurrentPrice();
				$this->Cost_Delivery =	$arg_list[0]->Cost_Delivery;
				$this->Eco_Tax =		$arg_list[0]->Eco_Tax;			
				
			}
			elseif(is_numeric($arg_list[0])) {
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
 * MyStoreCommandProduct.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * MyStoreCommandProduct.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `mystore_command_products` (
		  `Detail_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Command_ID` bigint(20) NOT NULL,
		  `Post_ID` bigint(20) NOT NULL,
		  `Qte` int(11) NOT NULL,
		  `Reference` varchar(255) NOT NULL,
		  `Declinaison_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Price` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Cost_Delivery` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Eco_Tax` decimal(10,2) NOT NULL DEFAULT '0.00',
		  PRIMARY KEY (`Detail_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');	
		
		$request->query = 	"ALTER TABLE `mystore_command_products` ADD `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0.00' ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command_products` ADD `Declinaison_ID` BIGINT NOT NULL DEFAULT '0' AFTER `Reference` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command_products` DROP PRIMARY KEY, ADD PRIMARY KEY ( `Detail_ID` )"; 
	}
/**	
 * MyStoreCommandProduct#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if(empty($this->Reference)){
			
			$product = new MyStoreProduct($this->Post_ID);
			
			if($this->Declinaison_ID){
				$declinaison = new MyStoreProductCritere((int) $this->Declinaison_ID);
				
				$this->Reference = 	$product->Collection . ' ' . $product->Title . ' ' . $declinaison->getTitle() . ($declinaison->getCode() == '' ? ' (Déclinaison: ' . $declinaison->getTitle() . ')' :  ' (Ref: ' . $declinaison->getCode() . ')');
				 
			}else{
				$this->Reference =	$product->getTitle() . ($product->Product_Code == '' ? '' :  ' (Ref: ' . $product->Product_Code . ')'); 	
			}
		}
				
		if ($this->Detail_ID == 0){
			
			if($this->exists()){//Vérification de l'instance en base de données
				return false;
			}
			
			
			$request->fields = 	"`Command_ID`,
								`Post_ID`,
								`Qte`,
								`Reference`,
								`Declinaison_ID`,
								`Price`,
								`Cost_Delivery`,
								`Eco_Tax`";
			$request->values = 	"'".Sql::EscapeString($this->Command_ID)."',
								'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Qte)."',
								'".Sql::EscapeString($this->Reference)."',
								'".Sql::EscapeString($this->Declinaison_ID)."',
								'".Sql::EscapeString($this->Price)."',
								'".Sql::EscapeString($this->Cost_Delivery)."',
								'".Sql::EscapeString($this->Eco_Tax)."'";
			
			System::Fire('mystore.command.product:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Detail_ID = $request->exec('lastinsert');
				
				System::Fire('mystore.command.product:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Command_ID` = '".Sql::EscapeString($this->Command_ID)."',
								`Post_ID` = '".Sql::EscapeString($this->Post_ID)."',
								`Qte` = '".Sql::EscapeString($this->Qte)."',
								`Reference` = '".Sql::EscapeString($this->Reference)."',
								`Declinaison_ID` = '".Sql::EscapeString($this->Declinaison_ID)."',
								`Price` = '".Sql::EscapeString($this->Price)."',
								`Cost_Delivery` = '".Sql::EscapeString($this->Cost_Delivery)."',
								`Eco_Tax` = '".Sql::EscapeString($this->Eco_Tax)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Detail_ID."'";
		
		System::Fire('mystore.command.product:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('mystore.command.product:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * MyStoreCommandProduct.ByID(commandID, productID [, declinationID = 0]) -> MyStoreCommandProduct | false
 *
 * Cette méthode retourne une référence de commande en fonction de la commande et du produit ID.
 **/	
	public static function ByID($command, $product, $declination = 0){
		if(empty($product)){
			return false;	
		}
		
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	MyStoreProduct::PRIMARY_KEY." = '".((int) $product)."' 
							AND Declinaison_ID = '". ((int) $declination) ."' 
							AND " . MyStoreCommand::PRIMARY_KEY . " = '" . ((int) $command ) ."'";
							
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::PrintError());
		}
		
		return $result['length'] == 0 ? false : new self($result[0]);
	}
/**
 * MyStoreCommandProduct#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		
		if(empty($this->Detail_ID) && !empty($this->Post_ID)){
			$o = self::ByID($this->Command_ID, $this->Post_ID, $this->Declinaison_ID);
			
			if($o){
				$this->Detail_ID = $o->Detail_ID;	
			}
		}
		
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Detail_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('mystore.command.product:remove', array(&$this));
			return true;
		}
		return false;
	}
/**
 * MyStoreCommandProduct#downProductStock() -> Boolean
 *
 * Cette méthode décrémente le stock du produit vendu.
 **/	
	public function downProductStock(){
		if(empty($this->Post_ID)) return true;
		
		if(!empty($this->Declinaison_ID)){
			$declination = new MyStoreProductCritere($this->Declinaison_ID);
			$declination->Value->stock -= $this->Qte;
			return $declination->commit();
		}
		
		$product = new MyStoreProduct($this->Post_ID);
		$product->Stock -= $this->Qte;
		return $product->commit(); 
	}
/**
 * MyStoreCommandProduct.exec(command) -> Number
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
 * MyStoreCommandProduct.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreCommandProduct#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){	
		if($this->Post_ID == 0){
			return false;	
		}
		return Sql::Count(self::TABLE_NAME, MyStoreProduct::PRIMARY_KEY." = '".$this->Post_ID."' AND Declinaison_ID = '". $this->Declinaison_ID ."' AND " . MyStoreCommand::PRIMARY_KEY . " = '" .$this->Command_ID."'") > 0;
	}
/**
 * MyStoreCommandProduct.Distinct(field [, word]) -> Array
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
 * MyStoreCommandProduct.GetList([clauses [, options]]) -> Array | boolean
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
		
		if(isset($options->Command_ID)){
			$request->where .=	' AND '. MyStoreCommand::PRIMARY_KEY . '  = ' . (int) $options->Command_ID;
		}
				
		switch(@$options->op){
			default:
							
				break;
			case '-info':
				$request->select = 	'CONCAT(Reference , " x", Qte) as Description, Price as Amount, "'.MyStore::CurrencyCode().'" AS Currency';
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Field as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Command_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Post_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Qte` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Reference` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('mystore.command.product:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
			
			if(!empty($options->default)){
				
				$result = array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : MUI('Choisissez'), 'value' => 0
				)), $result);
					
				$result['length'] = $result['length']+1;	
			}
			
			self::Set($result);
			unset(self::$List['length'], self::$List['maxLength']);
		}
		
		return $result; 
	}
/**
 * MyStoreCommandProduct.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/		
	public static function onGetList(&$row, &$request){
			
	}
	
	public static function Set($list){
		self::$List = $list;
	}
	
	public static function Get(){
		return self::$List;
	}
/**
 * MyStoreCommandProduct.Next() -> MyStoreCommandProduct | False
 * Cette méthode le prochaine élément du panier.
 **/	
	public static function Next(){
		if(empty(self::$List)){
			return false;	
		}
		
		$o = next(self::$List);
		
		if(is_array($o)){
			return self::$Instance = new self($o);
		}else{
			return false;	
		}
	}
/**
 * MyStoreCommandProduct.Prev() -> MyStoreCommandProduct | False
 * Cette méthode l'élément précèdent du panier.
 **/	
	public static function Prev(){
		if(empty(self::$List)){
			return false;	
		}
		
		$o = prev(self::$List);
		
		if(is_array($link)){
			return self::$Instance = new self($o);
		}else{
			return false;	
		}
	}
/**
 * MyStoreCommandProduct.Current() -> MyStoreCommandProduct | False
 * Cette méthode l'élément courrant du panier.
 **/	
	public static function Current(){
		if(empty(self::$List)){
			return false;	
		}
		
		$o = current(self::$List);
		
		if(is_array($o)){
			return self::$Instance = new self($o);
		}else{
			return false;	
		}
	}
/**
 * MyStoreCommandProduct.Reset() -> MyStoreCommandProduct | False
 * Remet le pointeur interne de tableau au début.
 **/	
	public static function Reset(){
		if(empty(self::$List)){
			return false;	
		}
		
		$o = reset(self::$List);
		
		if(is_array($o)){
			return self::$Instance = new self($o);
		}else{
			return false;	
		}
	}
/**
 * MyStoreCommandProduct.End() -> MyStoreCommandProduct | False
 * Remet le pointeur interne de tableau à la fin.
 **/	
	public static function End(){
		if(empty(self::$List)){
			return false;	
		}
		
		$o = end(self::$List);
		
		if(is_array($o)){
			return self::$Instance = new self($o);
		}else{
			return false;	
		}
	}
/**
 * MyStoreCommandProduct.Count() -> Number
 * Cette méthode retourne le nombre de référence dans le panier.
 **/	
	public static function Count(){		
		return count(self::$List);	
	}
/**
 * MyStoreCommandProduct.ID() -> String
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function ID(){
		return self::Current()->Post_ID . '/' . self::Current()->Declinaison_ID;
	}
/**
 * MyStoreCommandProduct.Product() -> MyStoreProduct
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function Product(){
		return new MyStoreProduct((int) self::Current()->Post_ID);
	}
/**
 * MyStoreCommandProduct.Reference() -> String
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function Reference(){
		return self::Current()->Reference;
	}
/**
 * MyStoreBasket.Picture() -> String
 * Cette méthode retourne la photo principale du produit en cours.
 **/	
	public static function Picture(){
		$product = self::Product();
		
		if(empty($product->Criteres->Pictures)){
			return '';	
		}
		
		return $product->Criteres->Pictures[0]['Value'];
	}
/**
 * MyStoreCommandProduct.Price() -> String
 * Cette méthode retourne le prix du produit en cours.
 **/	
	public static function Price($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreCommandProduct.PriceHT() -> String
 * Cette méthode retourne le prix du produit en cours - l'éco-taxe
 **/	
	public static function PriceHT($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price - self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreCommandProduct.CostDelivery() -> String
 * Cette méthode retourne le coût de livraison du produit en cours.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreCommandProduct.EcoTax(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne l'éco taxe du produit.
 **/	
	static public function EcoTax($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreCommandProduct.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total d'une référence sans les frais de livraison.
 **/	
	public static function Amount($dec_point = '.' , $thousands_sep = ','){		
		return number_format(self::Current()->Qte * self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}	
/**
 * MyStoreCommandProduct.AmountHT(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total d'une référence sans les frais de livraison et sans l'éco taxe.
 **/	
	public static function AmountHT($dec_point = '.' , $thousands_sep = ','){		
		return number_format(self::Current()->Qte * self::Current()->Price - self::Current()->Qte * self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreCommandProduct.Qty() -> Number
 * Cette méthode retourne la quantité demandée par le client d'une référence.
 **/	
	public static function Qty(){
		return self::Current()->Qte;
	}
/**
 * MyStoreCommandProduct.Stock() -> Number
 * - product (MyStoreProduct): Produit du catalogue.
 *
 * Cette méthode retourne le stock disponible en excluant le stock immobilisé par la commande en cours.
 **/	
	public static function Stock(){
		
		$ref = self::Current();
		
		if(!MyStore::StockEnable()){
			return 100;
		}
		
		$request = new Request();
		$request->select = 	'SUM(Qte) as Stock';
		$request->from = 	self::TABLE_NAME . ' D INNER JOIN ' . MyStoreCommand::TABLE_NAME . ' F ON D.' . MyStoreCommand::PRIMARY_KEY . ' = F.' . MyStoreCommand::PRIMARY_KEY;
		$request->where = 	MyStoreProduct::PRIMARY_KEY . ' = ' . (int) $ref->Post_ID . ' 
							AND Declinaison_ID = "' . (int) $ref->Declinaison_ID .'"
							AND F.Command_ID != "' . (int) $ref->Command_ID .'"
							AND Statut IN ("created", "created manually", "paid", "authorized", "confirmed")'; 
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::PrintError());
		}
		
		$lockedStock = 	$result[0]['Stock'];
		
		if(!empty($ref->Declinaison_ID)){
			$declination = new MyStoreProductCritere((int) $ref->Declinaison_ID);
			return $declination->Value->stock - $lockedStock;
		}else{
			$product = 		self::Product();
			return $product->Stock - $lockedStock;
		}
	}
/**
 * MyStoreCommandProduct.Stock(product[, declination = 0]) -> Number
 * - product (MyStoreProduct): Produit du catalogue.
 *
 * Cette méthode retourne le stock immobilisé pour un produit.
 **/	
	public static function LockedStock($product, $declination = 0){
		
		$request = new Request();
		$request->select = 	'SUM(Qte) as Stock';
		$request->from = 	self::TABLE_NAME . ' D INNER JOIN ' . MyStoreCommand::TABLE_NAME . ' F ON D.' . MyStoreCommand::PRIMARY_KEY . ' = F.' . MyStoreCommand::PRIMARY_KEY;
		$request->where = 	MyStoreProduct::PRIMARY_KEY . ' = ' . (int) $product->Post_ID . ' 
							AND Declinaison_ID = "' . (int) $declination .'"
							AND Statut IN ("created", "created manually", "paid", "authorized", "confirmed")'; 
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::PrintError());
		}
		
		return  (int) $result[0]['Stock'];
	}
	
	
	public function __sleep(){
		
		$i = 0;
		
    	foreach($this as $key => $value){
			if(method_exists($this, $key)) continue;
			
			$array[$i] = $key;
			$i++;
		}
		
		return $array;
    }
    /*
	 * Methode appellée par la fonction de désérialisation
	 */
    public function __wakeup(){}
}

MyStoreCommandProduct::Initialize();

?>