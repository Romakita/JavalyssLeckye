<?php
/** section: MyEvent
 * class MyEventCommandProduct
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_myevent_command_product.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventCommandProduct extends ObjectTools{	
	const PRE_OP =				'myevent.command.product.';
/**
 * MyEventCommandProduct.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'myevent_command_products';	
/**
 * MyEventCommandProduct.PRIMARY_KEY -> String
 * Clef primaire de la table MyEventCommandProduct.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Post_ID';

/**
 * MyEventCommandProduct#Command_ID -> Number
 **/
	public $Command_ID = 0;
/**
 * MyEventCommandProduct#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * MyEventCommandProduct#Qte -> Number
 **/
	public $Qte = 0;
/**
 * MyEventCommandProduct#Reference -> String
 * Varchar
 **/
	public $Reference = "";
/**
 * MyEventCommandProduct#Price -> Number
 * Decimal
 **/
	public $Price = 0.0;
/**
 * MyEventCommandProduct#Eco_Tax -> Number
 * Decimal
 **/
	public $Eco_Tax = 0.0;
/**
 * MyEventCommandProduct#Cost_Delivery -> Number
 * Decimal
 **/
	public $Cost_Delivery = 0.0;
	
	public static $List = 		NULL;
	public static $Instance = 	NULL;
/**
 * new MyEventCommandProduct()
 * new MyEventCommandProduct(json)
 * new MyEventCommandProduct(array)
 * new MyEventCommandProduct(obj)
 * new MyEventCommandProduct(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventCommandProduct]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventCommandProduct]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventCommandProduct]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventCommandProduct]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			
			if($arg_list[0] instanceof MyEventProduct){
				$this->Post_ID = 		$arg_list[0]->Post_ID;
				$this->Price =			$arg_list[0]->getCurrentPrice();
				$this->Cost_Delivery =	$arg_list[0]->Cost_Delivery;
				$this->Eco_Tax =		$arg_list[0]->Eco_Tax;
				$this->Reference =		$arg_list[0]->getTitle() . ($arg_list[0]->Product_Code == '' ? '' :  ' (Ref: ' . $arg_list[0]->Product_Code . ')'); 	
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
 * MyEventCommandProduct.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * MyEventCommandProduct.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `myevent_command_products` (
		  `Command_ID` bigint(20) NOT NULL,
		  `Post_ID` bigint(20) NOT NULL,
		  `Qte` int(11) NOT NULL,
		  `Reference` varchar(255) NOT NULL,
		  `Price` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0',
		  `Cost_Delivery` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0',
		  `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0.00',
		  PRIMARY KEY (`Command_ID`,`Post_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');	
		
		$request->query = 	"ALTER TABLE `myevent_command_products` ADD `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0.00' ";
		$request->exec('query');
	}
/**	
 * MyEventCommandProduct#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if(!$this->exists()){
			
			$request->fields = 	"`Command_ID`,
								`Post_ID`,
								`Qte`,
								`Reference`,
								`Price`,
								`Cost_Delivery`,
								`Eco_Tax`";
			$request->values = 	"'".Sql::EscapeString($this->Command_ID)."',
								'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->Qte)."',
								'".Sql::EscapeString($this->Reference)."',
								'".Sql::EscapeString($this->Price)."',
								'".Sql::EscapeString($this->Cost_Delivery)."',
								'".Sql::EscapeString($this->Eco_Tax)."'";
			
			System::Fire('myevent.command.product:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				//$this->Post_ID = $request->exec('lastinsert');
				
				System::Fire('myevent.command.product:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Qte` = '".Sql::EscapeString($this->Qte)."',
								`Reference` = '".Sql::EscapeString($this->Reference)."',
								`Price` = '".Sql::EscapeString($this->Price)."',
								`Cost_Delivery` = '".Sql::EscapeString($this->Cost_Delivery)."',
								`Eco_Tax` = '".Sql::EscapeString($this->Eco_Tax)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Post_ID."' AND " . MyEventCommand::PRIMARY_KEY . " = '" .$this->Command_ID."'";
		
		System::Fire('myevent.command.product:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('myevent.command.product:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * MyEventCommandProduct#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	self::PRIMARY_KEY." = '".$this->Post_ID."' AND " . MyEventCommand::PRIMARY_KEY . " = '" .$this->Command_ID."'";
		
		if($request->exec('delete')){
			System::Fire('myevent.command.product:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * MyEventCommandProduct.exec(command) -> Number
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
 * MyEventCommandProduct.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyEventCommandProduct#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, self::PRIMARY_KEY." = '".$this->Post_ID."' AND " . MyEventCommand::PRIMARY_KEY . " = '" .$this->Command_ID."'") > 0;
	}
/**
 * MyEventCommandProduct.Distinct(field [, word]) -> Array
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
 * MyEventCommandProduct.GetList([clauses [, options]]) -> Array | boolean
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
		
		if(!empty($options->Command_ID)){
			$request->where .=	' AND '. MyEventCommand::PRIMARY_KEY . '  = ' . (int) $options->Command_ID;
		}
				
		switch(@$options->op){
			default:
							
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
		System::Fire('myevent.command.product:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
			
			self::$List = $result;
			unset(self::$List['length'], self::$List['maxLength']);
		}
		
		return $result; 
	}
		
	public static function onGetList(&$row){
			
	}
/**
 * MyEventCommandProduct.Next() -> MyEventCommandProduct | False
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
 * MyEventCommandProduct.Prev() -> MyEventCommandProduct | False
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
 * MyEventCommandProduct.Current() -> MyEventCommandProduct | False
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
 * MyEventCommandProduct.Reset() -> MyEventCommandProduct | False
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
 * MyEventCommandProduct.End() -> MyEventCommandProduct | False
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
 * MyEventCommandProduct.Count() -> Number
 * Cette méthode retourne le nombre de référence dans le panier.
 **/	
	public static function Count(){
		return count(self::$List);	
	}
/**
 * MyEventCommandProduct.ID() -> String
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function ID(){
		return self::Current()->Post_ID;
	}
/**
 * MyEventCommandProduct.Product() -> MyEventProduct
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function Product(){
		return new MyEventProduct((int) self::Current()->Post_ID);
	}
/**
 * MyEventCommandProduct.Reference() -> String
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function Reference(){
		return self::Current()->Reference;
	}
/**
 * MyEventCommandProduct.Price() -> String
 * Cette méthode retourne le prix du produit en cours.
 **/	
	public static function Price($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventCommandProduct.CostDelivery() -> String
 * Cette méthode retourne le coût de livraison du produit en cours.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventCommandProduct.EcoTax(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne l'éco taxe du produit.
 **/	
	static public function EcoTax($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventCommandProduct.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total d'une référence sans les frais de livraison.
 **/	
	public static function Amount($dec_point = '.' , $thousands_sep = ','){		
		return number_format(self::Current()->Qte * self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventCommandProduct.Qty() -> Number
 * Cette méthode retourne la quantité demandée par le client d'une référence.
 **/	
	public static function Qty(){
		return self::Current()->Qte;
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

MyEventCommandProduct::Initialize();

?>