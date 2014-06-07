<?php
/** section: Plugins
 * class MyStoreAccountAddress
 * includes ObjectTools
 *
 * Cette classe gère les adresses de facturation et de livraison d'un compte client.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_account_address.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreAccountAddress extends ObjectTools implements iClass{	
	const PRE_OP =				'mystore.account.address.';
/**
 * MyStoreAccountAddress.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_account_address';	
/**
 * MyStoreAccountAddress.PRIMARY_KEY -> String
 * Clef primaire de la table MyStoreAccountAddress.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Address_ID';

/**
 * MyStoreAccountAddress#Address_ID -> Number
 **/
	public $Address_ID = 0;
/**
 * MyStoreAccountAddress#User_ID -> Number
 **/
	public $User_ID = 0;
/**
 * MyStoreAccountAddress#Name -> String
 * Varchar
 **/
	public $Name = "";
/**
 * MyStoreAccountAddress#FirstName -> String
 * Varchar
 **/
	public $FirstName = "";
/**
 * MyStoreAccountAddress#Address -> String
 * Varchar
 **/
	public $Address = "";
/**
 * MyStoreAccountAddress#Address2 -> String
 * Varchar
 **/
	public $Address2 = "";
/**
 * MyStoreAccountAddress#CP -> String
 * Varchar
 **/
	public $CP = "";
/**
 * MyStoreAccountAddress#City -> String
 * Varchar
 **/
	public $City = "";
/**
 * MyStoreAccountAddress#Country -> String
 * Varchar
 **/
	public $Country = "";
/**
 * MyStoreAccountAddress#Phone -> String
 * Varchar
 **/
	public $Phone = "";
/**
 * MyStoreAccountAddress#Default -> String
 * Varchar
 **/
	public $Default = 0;

/**
 * new MyStoreAccountAddress()
 * new MyStoreAccountAddress(json)
 * new MyStoreAccountAddress(array)
 * new MyStoreAccountAddress(obj)
 * new MyStoreAccountAddress(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreAccountAddress]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreAccountAddress]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreAccountAddress]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreAccountAddress]].
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
 * MyStoreAccountAddress.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('mystore:gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::EnqueueScript('mystore.account.address', Plugin::Uri().'js/mystore_account_address.js');
	}
	
	public static function Create(){}
/**
 * MyStoreAccountAddress.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `mystore_account_address` (
		  `Address_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `User_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Name` varchar(40) NOT NULL DEFAULT '',
		  `FirstName` varchar(40) NOT NULL DEFAULT '',
		  `Address` varchar(200) NOT NULL DEFAULT '',
		  `Address2` varchar(200) NOT NULL DEFAULT '',
		  `CP` varchar(10) NOT NULL DEFAULT '',
		  `City` varchar(100) NOT NULL DEFAULT '',
		  `Country` varchar(100) NOT NULL DEFAULT '',
		  `Phone` varchar(30) NOT NULL DEFAULT '',
		  `Default` BOOLEAN NOT NULL DEFAULT FALSE,
		  PRIMARY KEY (`Address_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
	}
/**	
 * MyStoreAccountAddress#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->User_ID == 0){
			$this->User_ID = User::Get()->User_ID;	
		}
						
		if($this->Address_ID == 0){
						
			$request->fields = 	"`User_ID`,
								`Name`,
								`FirstName`,
								`Address`,
								`Address2`,
								`CP`,
								`City`,
								`Country`,
								`Phone`";
			$request->values = 	"'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString($this->Name)."',
								'".Sql::EscapeString($this->FirstName)."',
								'".Sql::EscapeString($this->Address)."',
								'".Sql::EscapeString($this->Address2)."',
								'".Sql::EscapeString($this->CP)."',
								'".Sql::EscapeString($this->City)."',
								'".Sql::EscapeString($this->Country)."',
								'".Sql::EscapeString($this->Phone)."'";
			
			System::Fire('mystore.account.address:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Address_ID = $request->exec('lastinsert');
				
				if(self::HaveDefault($this->User_ID)){
					$this->toDefault();
				}
				
				System::Fire('mystore.account.address:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`User_ID` = '".Sql::EscapeString($this->User_ID)."',
								`Name` = '".Sql::EscapeString($this->Name)."',
								`FirstName` = '".Sql::EscapeString($this->FirstName)."',
								`Address` = '".Sql::EscapeString($this->Address)."',
								`Address2` = '".Sql::EscapeString($this->Address2)."',
								`CP` = '".Sql::EscapeString($this->CP)."',
								`City` = '".Sql::EscapeString($this->City)."',
								`Country` = '".Sql::EscapeString($this->Country)."',
								`Phone` = '".Sql::EscapeString($this->Phone)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Address_ID."'";
		
		System::Fire('mystore.account.address:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('mystore.account.address:commit.complete', array(&$this));
			
			if(self::HaveDefault($this->User_ID)){
				$this->toDefault();
			}
			
			return true;
		}
		return false;
	}	
/**
 * MyStoreAccountAddress#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Address_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('mystore.account.address:remove', array(&$this));
			return true;
		}
		return false;

	}
	
	public static function HaveDefault($uid){
		return Sql::Count(self::TABLE_NAME, 'User_ID = "' . ((int) $uid) . '" AND Default = "1"') > 0;
	}
/**
 * MyStoreAccountAddress.exec(command) -> Number
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
			
			case self::PRE_OP . 'default':
				$o = new self($_POST[self::PRIMARY_KEY]);
				echo json_encode($o->toDefault());
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
 * MyStoreAccountAddress.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreAccountAddress#toDefault() -> void
 *
 **/	
	public function toDefault(){
		$request = new Request();
		$request->from = self::TABLE_NAME;
		$request->set = 'Default = "0"';
		$request->where = 'User_ID = ' . $this->User_ID;
		
		$request->exec('update');
		
		$request->set = 'Default = "1"';
		$request->where = self::PRIMARY_KEY.' = ' . $this->Address_ID;
		
		return $request->exec('update');
	}
/**
 * MyStoreAccountAddress#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Address_ID." 
			AND CONCAT(User_ID, Name, FirstName, Address, Address2, CP, City, Country, Phone) = '".Sql::EscapeString($this->User_ID . $this->Name . $this->FirstName . $this->Address . $this->Address2 . $this->CP . $this->City . $this->Country . $this->Phone)."'") > 0;
	}
/**
 * MyStoreAccountAddress.Distinct(field [, word]) -> Array
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
 * MyStoreAccountAddress.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*, Address_ID AS value, CONCAT(Name," ", FirstName, " - ", Address, " ", Address2, " ", CP, " ", City, " ", Country) as text';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 '; 
		$request->order = 	'';
		
		if(!empty($options->User_ID)){
			$request->where .= ' AND User_ID = "' . ($options->User_ID) . '"';
		}
		
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
								
				$request->where .= " 	AND (								
								`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`FirstName` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address2` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`CP` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`City` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Country` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Phone` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('mystore.account.address:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
			
			if(!empty($options->default)){
				$result = array_merge(array(array(
					'text' => is_string($options->default) ? $options->default : MUI('Choisissez'), 'value' => 0
				)), $result);
				
				$result['length'] += 1;
			}
		}
		
		return $result; 
	}
/**
 * iClass.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/	
	public static function onGetList(&$row, &$request){
			
	}
	
	public static function Draw(){
		
		$options = new stdClass();
		$options->User_ID = User::Get()->User_ID;
		
		$carnet = self::GetList('', $options);
		
		?>
        <div class="mystore-address">
            <p>
                <b>
                    <?php echo MUI('Important : Toute modification de votre adresse de livraison dans cette section n\'est pas prise en compte pour vos commandes en cours.'); ?><br>
                    <?php echo MUI('Pour modifier l\'adresse de livraison de commandes en cours, rendez-vous sur la page'); ?> <a href="<?php MyStore::Info('command'); ?>"><?php echo MUI('Mes commandes') ?></a>. 
                </b>
            </p>
            
            <div class="toolbar gradient">
                <p><?php echo MUI('Cliquez ici pour ajouter une nouvelle adresse') ?></p>
                <span class="box-simple-button button-add-address">
                	<a href="#"><!-- Note : button-add-address est important pour la gestion d'ajout d'une adresse via JS -->
                    	<?php echo MUI('Ajouter une nouvelle adresse') ?> »
                	</a>
                </span>
            </div>
            
            <div class="content-address">
            <?php
								
				for($i = 0; $i < $carnet['length']; $i++):
					$address = new self($carnet[$i]);
					
					if(!is_object($address)) continue;
					
					
			?>
				<div class="box-address<?php echo $address->Default == 1 ? ' selected': ''; ?>" data-id="<?php echo $address->Address_ID ?>" data-name="<?php echo addslashes($address->Name) ?>" data-firstname="<?php echo addslashes($address->FirstName) ?>" data-address="<?php echo addslashes($address->Address) ?>" data-address2="<?php echo addslashes($address->Address2) ?>" data-city="<?php echo addslashes($address->City) ?>" data-cp="<?php echo addslashes($address->CP) ?>" data-country="<?php echo addslashes($address->Country) ?>" data-phone="<?php echo addslashes($address->Phone) ?>">
                	<div class="wrap-default">
                    	<input type="radio" name="AddressDefault" class="box-checkbox checkbox-set-default" <?php echo $address->Default == 1 ? ' checked=checked': ''; ?>/>
                    </div>
                	
                    <div class="wrap-content">
                    	<p class="wrap-name"><?php echo $address->FirstName . ' ' . $address->Name; ?></p>
                        <p class="wrap-address"><?php echo $address->Address . ' ' . $address->Address2; ?></p>
                        <p class="wrap-city"><?php echo $address->CP . ' ' . $address->City . ' ' . $address->Country; ?></p>
                        <p class="wrap-phone"><?php echo MUI('Téléphone') . ' : ' . $address->Phone; ?></p>
                    </div>
                    
                    <ul class="wrap-actions">
                    	<li><span class="box-simple-button button-edit-address"><a href="#"><?php echo MUI('Modifier'); ?></a></span></li>
                        <li><span class="box-simple-button button-remove-address"><a href="#"><?php echo MUI('Supprimer'); ?></a></span></li>
                    </ul>
                </div>
			<?php	
				endfor;
			?>
            	<div class="clear"></div>
            </div>
        
        </div>
        <?php
		//User::Meta('MYSTORE_ADR_BOOK', $obj);
	}
	
	public function __toString(){
		return 	$this->FirstName . ' ' . $this->Name . "\n" . $this->Address . ' ' . @$this->Address2 ."\n" . $this->CP . ' ' . $this->City . ' ' . $this->Country . "\n" . $this->Phone;
	}
}

MyStoreAccountAddress::Initialize();

?>