<?php
namespace MyWallet;
/** section: Plugins
 * class MyWallet.Card
 * includes ObjectTools, iClass
 *
 * Cette classe gère les informations d'un mode de paiement.
 * 
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Application : MyWallet
 * * Fichier : class_card.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class Card extends \ObjectTools implements \iClass{
	const PRE_OP =				'mywallet.card.';
/**
 * MyWallet.Card.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mywallet_cards';	
/**
 * MyWallet.Card.PRIMARY_KEY -> String
 * Clef primaire de la table MyWallet.Card.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Card_ID';
	
	protected static $instance = NULL;
/**
 * MyWallet.Card#Card_ID -> Number
 **/
	public $Card_ID = 0;
/**
 * MyWallet.Card#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * MyWallet.Card#Picture -> String
 * Varchar
 **/
	public $Picture = "";
/**
 * MyWallet.Card#Type -> String
 * Varchar
 **/
	public $Type = "";
/**
 * MyWallet.Card#Content -> String
 * Text
 **/
	public $Content = "";
/**
 * MyWallet.Card#Amount_Min -> Float
 * Decimal
 **/
	public $Amount_Min = 0.00;
/**
 * MyWallet.Card#Amount_Max -> Float
 * Decimal
 **/
	public $Amount_Max = 0.00;
/**
 * MyWallet.Card#Statut -> String
 * Varchar
 **/
	public $Statut = 'draft professional private dev';
	
	protected static $List =		NULL;
	protected $Transaction = 		NULL;
	protected $onCancel;
	protected $onSuccess;
	protected $onError;
	
	protected $created = false;
/**
 * new  MyWallet.Card()
 * new  MyWallet.Card(json)
 * new  MyWallet.Card(array)
 * new  MyWallet.Card(obj)
 * new  MyWallet.Card(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[ MyWallet.Card]].
 * - array (Array): Tableau associatif équivalent à une instance [[ MyWallet.Card]]. 
 * - obj (Object): Objet équivalent à une instance [[ MyWallet.Card]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[ MyWallet.Card]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new \Request();
				
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
 * MyWallet.Card.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	public static function Initialize(){
		\System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		\System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
	}
/**
 * MyWallet.Card.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
	public static function Install(){
		
		$request = 			new \Request();
		
		$request->query = 	"CREATE TABLE `mywallet_cards` (
		  `Card_ID` int(11) NOT NULL AUTO_INCREMENT,
		  `Name` varchar(255) NOT NULL,
		  `Picture` varchar(255) NOT NULL,
		  `Type` varchar(30) NOT NULL,
		  `Content` text NOT NULL,
		  `Amount_Min` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Amount_Max` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Statut` VARCHAR( 50 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'draft profesionnal private dev',
		  PRIMARY KEY (`Card_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');
			
	}
	
	public function __call($name, $arguments){
		$instance = self::Get();
		return call_user_func_array(array(&$instance, $name), $arguments);
    }

    /**  Depuis PHP 5.3.0  */
    public static function __callStatic($name, $arguments){
		$class = get_class(self::Get());
       	return call_user_func_array(array($class, $name), $arguments);
    }
/**	
 * MyWallet.Card#commit() -> Boolean
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit(){
		
		$request = 			new \Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Card_ID == 0){
			
			$request->fields = 	"`Name`,
								`Picture`,
								`Type`,
								`Content`,
								`Amount_Min`,
								`Amount_Max`,
								`Statut`";
			$request->values = 	"'".\Sql::EscapeString($this->Name)."',
								'".\Sql::EscapeString($this->Picture)."',
								'".\Sql::EscapeString($this->Type)."',
								'".\Sql::EscapeString($this->Content)."',
								'".\Sql::EscapeString($this->Amount_Min)."',
								'".\Sql::EscapeString($this->Amount_Max)."',
								'".\Sql::EscapeString($this->Statut)."'";
			
			\System::Fire('mywallet:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Card_ID = $request->exec('lastinsert');
				
				\System::Fire('mywallet:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Name` = '".\Sql::EscapeString($this->Name)."',
								`Picture` = '".\Sql::EscapeString($this->Picture)."',
								`Type` = '".\Sql::EscapeString($this->Type)."',
								`Content` = '".\Sql::EscapeString($this->Content)."',
								`Amount_Min` = '".\Sql::EscapeString($this->Amount_Min)."',
								`Amount_Max` = '".\Sql::EscapeString($this->Amount_Max)."',
								`Statut` = '".\Sql::EscapeString($this->Statut)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Card_ID."'";
		
		\System::Fire('mywallet:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			\System::Fire('mywallet:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * MyWallet.Card#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new \Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Card_ID."' ";
		
		if($request->exec('delete')){
			\System::Fire('mywallet:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * MyWallet.Card.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
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
		}
		
		return 0;	
	}
/**
 * MyWallet.Card.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande - en mode non connecté - et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function execSafe($op){
		
	}
/**
 * MyWallet.Card#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return \Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Card_ID." AND UniqueKey = '".\Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyWallet.Card.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new \Request(DB_NAME);
		
		$request->select = 	"distinct " . \Sql::EscapeString($field) ." as text";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
							
		if(!empty($word)){
			$request->where .= ' 
				AND '.\Sql::EscapeString($field)." LIKE '". \Sql::EscapeString($word)."%'";
		}
		
		$request->where .= 	" AND TRIM(".\Sql::EscapeString($field).") != ''";
		$request->order =	\Sql::EscapeString($field);
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = \Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 * MyWallet.Card.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/	
	public static function GetList($clauses = '', $options = ''){
				
		$request = 			new \Request();
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(!empty($options->Amount)){
			$request->where .= " 
			AND (
				(Amount_Min = 0 AND Amount_Max = 0)
				OR
				(
					(Amount_Min != 0 AND Amount_Max != 0 AND Amount_Min <= ". ((int) $options->Amount) ." AND ". ((int) $options->Amount) ." <= Amount_Max)
					OR
					(Amount_Min != 0 AND Amount_Max = 0 AND Amount_Min <= ". ((int) $options->Amount) .")
					OR
					(Amount_Max != 0 AND Amount_Min <= ". ((int) $options->Amount) ." AND ". ((int) $options->Amount) ." <= Amount_Max)
				)
			)";
		}
		
		if(!\User::IsConnect()){
			$request->where .=	' AND Statut LIKE "%publish%" ';
		}else{
			if(empty($options->draft)){
				$request->where .=	' AND Statut LIKE "%publish%" ';	
			}
		}
		
		if(!empty($options->Statut)){
			$request->where .= " AND Statut like '%".\Sql::EscapeString($options->Statut)."%'";
		}
		
		switch(@$options->op){
			default:
							
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Card_ID` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Name` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Picture` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Type` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Amount_Min` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Amount_Max` like '%".\Sql::EscapeString($clauses->where)."%' OR 
								`Statut` like '%".\Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		\System::Fire('mywallet:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			unset($result['length']);		
		}
				
		return self::$List = $result; 
	}
/**
 * MyWallet.Card.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/
	public static function onGetList(&$row, &$request){
		$row['Picture'] = 	MYWALLET_PATH.'inc/class/'.$row['Type'].'/icon-70.png';
		$row['Picture'] =	file_exists($row['Picture']) ? \File::ToURI($row['Picture']) : 'custom-70';
		
		$row['icon'] = 	MYWALLET_PATH.'inc/class/'.$row['Type'].'/icon.png';
		$row['icon'] =	file_exists($row['icon']) ? \File::ToURI($row['icon']) : 'custom';
	}
/**
 * MyWallet.Card.Have() -> Boolean
 * Cette méthode indique si il existe des méthodes de paiment.
 **/	
	public static function Have(){
		return !empty(self::$List) && self::Count() != 0;
	}
/**
 * MyWallet.Card.Single() -> Boolean
 * Cette méthode indique si il n'y qu'un seul moyen de paiement.
 **/	
	public static function Single(){
		return !empty(self::$List) && self::Count() == 1;
	}	
/**
 * MyWallet.Card.Next() -> MyWallet.Card | False
 * Cette méthode retourne le prochain élément.
 **/	
	public static function Next(){
		$current = next(self::$List);
		
		if($current){
			$base =		new self($current);
			$current =  $base->getExtendedObject();
			self::Set($current);
		}
		
		return $current;
	}
/**
 * MyWallet.Card.Prev() -> MyWallet.Card | False
 * Cette méthode l'élément précèdent.
 **/	
	public static function Prev(){
		$current = prev(self::$List);
		
		if($current){
			$base =		new self($current);
			$current =  $base->getExtendedObject();
			self::Set($current);
		}
		
		return $current;
	}
/**
 * MyStoreBasket.Current() -> MyWallet.Card | False
 * Cette méthode l'élément courant.
 **/	
	public static function Current(){
		$current = current(self::$List);
		
		if($current){
			$base =		new self($current);
			self::Set($base->getExtendedObject());
			return self::Get();
		}
		
		return false;
	}
/**
 * MyStoreBasket.Reset() -> MyWallet.Card | False
 * Remet le pointeur interne de tableau au début.
 **/	
	public static function Reset(){
		$current = reset(self::$List);
		
		if($current){
			$base =		new self($current);
			$current =  $base->getExtendedObject();
			self::Set($current);
		}
		
		return $current;
	}
/**
 * MyStoreBasket.Reset() -> MyStoreCommandProduct | False
 * Positionne le pointeur de tableau en fin de tableau.
 **/	
	public static function End(){
		$current = end(self::$List);
		
		if($current){
			$base =		new self($current);
			$current =  $base->getExtendedObject();
			self::Set($current);
		}
		
		return $current;
	}
/**
 * MyWallet.Card.ID() -> Number
 * Cette méthode retourne l'ID du panier.
 **/	
	public static function ID(){
		return self::Get()->Card_ID;	
	}
/**
 * MyStoreBasket.Count() -> Number
 * Cette méthode retourne le nombre de référence dans le panier.
 **/	
	public static function Count(){
		return count(self::$List);	
	}
/**	
 * MyWallet.Card.SessionExists() -> Boolean
 *
 * Cette méthode vérifie que l'instance panier existe en Session.
 **/
	private static function SessionExists(){
		if(empty($_SESSION[__CLASS__])){
			return false;
		}
		return unserialize($_SESSION[__CLASS__]) instanceof self;
	}
/**
 * MyWallet.Card.Get() -> MyWallet.Card
 * 
 * Cette méthode retourne l'instance [[MyWallet.Card]].
 **/	
	public static function &Get($id = NULL){
		
		if(!empty($id)){
			self::Set($id);	
		}
		
		if(!self::SessionExists()){
			return false;
		}
		
		if(empty(self::$instance)){
			self::$instance = unserialize($_SESSION[__CLASS__]);	
		}
		
		return self::$instance;
	}
/**
 * MyWallet.Card.Set(card) -> MyWallet.Card
 * - card (Object|MyWallet.Card): Carte.
 *
 * Cette méthode permet d'assigner  une instance [[MyWallet.Card]].
 **/
	public static function Set($o){
		
		if(is_numeric($o)){
			$base = 	new self($o);
			$o = $base->getExtendedObject();
			
			self::Set($o);
			
		}else{
			
			if($o instanceof Card){
								
				self::$instance = $o;
				//
				// Configuration du compte
				//
				if(!$o->created){
					$o->create();
					$o->created = true;
				}
				
				
				$_SESSION[__CLASS__] = serialize($o);
			}
		}
	}
/**
 * MyWallet.Card.External() -> Mixed
 * 
 * Cette méthode indique que le mode de paiement courant mène vers un site externe pour la validation du paiement.
 **/	
	public static function External(){
		return self::Get()->isExternal();
	}
/**
 * MyWallet.Card.Amount([amount]) -> Number
 * - amount (Number): Montant de la transaction.
 * 
 * Cette méthode retourne le montant de total de la transaction. Il est possible d'assigner une nouvelle valeur en mentionnant le paramètre `amount`.
 **/	
	public static function Amount($o){
		return self::Get()->setAmount($o); 	
	}
/**
 * MyWallet.Card.Currency([currency]) -> String
 * - currency (String): Devise de la transaction.
 * 
 * Cette méthode retourne la devise de la transaction. Il est possible d'assigner une nouvelle devise en mentionnant le paramètre `currency`.
 **/	
	public static function Currency($o){
		return self::Get()->setCurrency($o); 	
	}
/**
 * MyWallet.Card.Description([description]) -> String
 * - description (String): Description de la transaction.
 * 
 * Cette méthode retourne la description de la transaction. Il est possible d'assigner une nouvelle description en mentionnant le paramètre `description`.
 **/	
	public static function Description($o){
		return self::Get()->setDescription($o); 	
	}
/**
 * MyWallet.Card.Reference([ref]) -> String
 * - ref (Object): Référence de la transaction.
 * 
 * Cette méthode retourne la référence de la transaction. Il est possible d'assigner une nouvelle référence en mentionnant le paramètre `ref`.
 **/	
	public static function Reference($o = NULL){
		if(!empty($o)){
			self::Get()->setReference($o);
		}
		
		return self::Get()->getReference();
	}
/*
 * MyWallet.Card.SetDetails(array) -> void
 * - array (Array): Liste des produits de la vente.
 * 
 * Cette méthode permet d'assigner une liste de détail pour la transaction.
 **/	
	//public static function Details($o){
	//	return self::Get()->setDetails($o);
	//}
/**
 * MyWallet.Card.Name() -> String
 * Cette méthode retourne le nom de la méthode de paiement courante.
 **/	
	public static function Name(){
		return self::Get()->Name;	
	}
/*
 * MyWallet.Card.Name() -> String
 * Cette méthode retourne le nom de la méthode de paiement courante.
 **/	
	public static function Picture(){
		return self::Get()->Picture;	
	}
/**
 * MyWallet.Card.Fire(eventName) -> Mixed
 * 
 * Cette méthode déclenche un événement.
 **/	
	protected static function Fire($eventName){
		switch($eventName){
			
			case 'success':
				if(is_callable(self::Get()->onSuccess)){
					if(!self::Get()->error = call_user_func_array(self::Get()->onSuccess, array(self::Get()))){
						continue;
					}
				}
				break;
				
			case 'cancel':
				if(is_callable(self::Get()->onCancel)){
					if(!self::Get()->error = call_user_func_array(self::Get()->onCancel, array(self::Get()))){
						continue;
					}
				}
				break;
				
			case 'error':
				if(is_callable(self::Get()->onError)){
					if(!self::Get()->error = call_user_func_array(self::Get()->onError, array(self::Get()))){
						continue;
					}
				}
				break;
		}
	}
/**
 * MyWallet.Card.Observe(eventName, callback) -> Mixed
 * 
 * Cette méthode attache une fonction à un événement.
 **/	
	public static function Observe($eventName, $callback){
		switch($eventName){
			
			case 'success':
				self::Get()->onSuccess = $callback;
				break;
				
			case 'cancel':
				self::Get()->onCancel = $callback;
				break;
				
			case 'error':
				self::Get()->onError = $callback;
				break;
		}
	}
/**
 * MyWallet.Card.Transaction([transaction]) -> TransactionObject
 * - transaction (TransactionObject): Transaction.
 * 
 * Cette méthode permet de récupérer les informations d'une transaction. Il est possible de restorer les informations d'une transaction en passant un objet TransactionObject à la méthode. 
 **/	
	public static function Transaction($o = NULL){
		if(!empty($o)){
			self::Get()->Transaction = $o;
		}
		
		return self::Get()->Transaction;
	}
/**
 * MyWallet.Card#setTransaction(transaction) -> void
 * - transaction (TransactionObject): Transaction.
 * 
 * Cette méthode permet d'assigner les informations d'une transaction.
 **/
	public function setTransaction($o){
		$this->Transaction = $o;
	}
/**
 * MyWallet.Card#getTransaction() -> TransactionObject
 * 
 * Cette méthode retourne un objet transaction.
 **/	
	public function getTransaction(){
		return $this->Transaction;
	}

		
	private function getClassName(){
		return 'MyWallet\\' .ucfirst($this->Type);	
	} 
		
	private function getExtendedObject(){
		$class = $this->getClassName();
		
		if(class_exists($class)){
			return new $class($this);	
		}
		return $this;
	}
/**
 * MyWallet.Card#getSetting() -> Object
 *
 * Cette méthode retourne les informations de configuration d'une transaction.
 **/	
	public function getSetting(){
		if(is_object($this->Content)){
			return $this->Content;
		}
		
		return self::IsJSON($this->Content) ? $this->evalJSON($this->Content) : new stdClass();
	}
/**
 * MyWallet.Card#getMode() -> Boolean
 *
 * Cette méthode indique si le compte est en mode production ou en mode développeur pour les tests.
 **/
	public function getMode(){
		return strpos($this->Statut, 'prod') !== false;
	}
/**
 * MyWallet.Card#isPublish() -> Boolean
 *
 * Cette méthode indique si le moyen de paiement peut être affiché sur le site.
 **/	
	public function isPublish(){
		return strpos($this->Statut, 'publish') !== false;
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

Card::Initialize();

/** section: Plugins
 * class MyWallet.ItemDetail
 * includes ObjectTools, iClass
 *
 * Cette classe gère d'un détail d'une transaction.
 * 
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Application : MyWallet
 * * Fichier : class_card.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class ItemDetail extends \ObjectTools {
/**
 * MyWallet.ItemDetail#Amount -> Float
 * Montant du produit.
 **/	
	public $Amount = 0;
/**
 * MyWallet.ItemDetail#Description -> String
 * Description du produit.
 **/
	public $Description = '';
/**
 * MyWallet.ItemDetail#Amount -> Number
 * Coût de livraison du produit.
 **/
	public $CostDelivery = 0;
/**
 * MyWallet.ItemDetail#Currency -> String
 * Devise du montant du produit du produit.
 **/
	public $Currency =	'EUR';
/**
 * new  MyWallet.ItemDetail(array)
 * new  MyWallet.ItemDetail(obj)
 * - array (Array): Tableau associatif équivalent à une instance [[ MyWallet.ItemDetail]]. 
 * - obj (Object): Objet équivalent à une instance [[ MyWallet.ItemDetail]].
 *
 * Cette méthode créée une nouvelle instance de [[ MyWallet.ItemDetail]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
	}	
}
?>