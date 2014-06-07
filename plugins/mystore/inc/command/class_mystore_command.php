<?php
/** section: MyStore
 * class MyStoreCommand
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_command.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreCommand extends ObjectPrint{	
	const PRE_OP =				'mystore.command.';
/**
 * MyStoreCommand.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'mystore_command';	
/**
 * MyStoreCommand.PRIMARY_KEY -> String
 * Clef primaire de la table MyStoreCommand.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Command_ID';

/**
 * MyStoreCommand#Command_ID -> Number
 **/
	public $Command_ID = 0;
/**
 * MyStoreCommand#Command_NB -> String
 * Varchar
 **/
	public $Command_NB = "";
/**
 * MyStoreCommand#User_ID -> Number
 **/
	public $User_ID = 0;
/**
 * MyStoreCommand#Date_Create -> Datetime
 **/
	public $Date_Create = '0000-00-00 00:00:00';
/**
 * MyStoreCommand#Date_Payment -> Datetime
 **/
	public $Date_Payment = '0000-00-00 00:00:00';
/**
 * MyStoreCommand#Date_Confirm -> Datetime
 **/
	public $Date_Confirm = '0000-00-00 00:00:00';
/**
 * MyStoreCommand#Date_Preparation -> Datetime
 **/
	public $Date_Preparation = '0000-00-00 00:00:00';
/**
 * MyStoreCommand#Date_Delivery_Start -> Datetime
 **/
	public $Date_Delivery_Start = '0000-00-00 00:00:00';
/**
 * MyStoreCommand#Date_Delivery_End -> Datetime
 **/
	public $Date_Delivery_End = '0000-00-00 00:00:00';
/**
 * MyStoreCommand#Statut -> String
 * Varchar
 **/
	public $Statut = 'created';
/**
 * MyStoreCommand#Address_Billing -> String
 * Text
 **/
	public $Address_Billing = "";
/**
 * MyStoreCommand#Address_Delivery -> String
 * Text
 **/
	public $Address_Delivery = "";
/**
 * MyStoreCommand#Mode_Delivery -> String
 * Text
 **/
	public $Mode_Delivery = "";
/**
 * MyStoreCommand#In_Store -> String
 * Text
 **/
	public $In_Store = "";
/**
 * MyStoreCommand#Link_Follow_Delivery -> String
 * Text
 **/
	public $Link_Follow_Delivery = "";
/**
 * MyStoreCommand#Delivery_NB -> String
 * Text
 **/
	public $Delivery_NB = "";
/**
 * MyStoreCommand#Amount_HT -> Float
 * Decimal
 **/
	public $Amount_HT = 0.00;
/**
 * MyStoreCommand#Eco_Tax -> Float
 * Decimal
 **/
	public $Eco_Tax = 0.00;
/**
 * MyStoreCommand#Cost_Delivery -> Float
 * Decimal
 **/
	public $Cost_Delivery = 0.00;
/**
 * MyStoreCommand#TVA -> Float
 * Decimal
 **/
	public $TVA = 0.00;
/**
 * MyStoreCommand#Discount -> Float
 * Decimal
 **/
	public $Discount = 0.00;
/**
 * MyStoreCommand#Amount_TTC -> Float
 * Decimal
 **/
	public $Amount_TTC = 0.00;
/**
 * MyStoreCommand#Down_Payment -> Float
 * Decimal
 **/	
	public $Down_Payment = .0;
/**
 * MyStoreCommand#Wallet_Card_ID -> String
 * Text
 **/
	public $Wallet_Card_ID =  0;
/**
 * MyStoreCommand#Transaction_Object -> String
 * Text
 **/
	public $Transaction_Object = "";
/**
 * MyStoreCommand#Mode_Payment -> String
 **/	
	public $Mode_Payment = '';
	
	public $Products = array();
	
	public static $List = 		NULL;
	public static $Instance = 	NULL;
/**
 * new MyStoreCommand()
 * new MyStoreCommand(json)
 * new MyStoreCommand(array)
 * new MyStoreCommand(obj)
 * new MyStoreCommand(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyStoreCommand]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyStoreCommand]]. 
 * - obj (Object): Objet équivalent à une instance [[MyStoreCommand]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyStoreCommand]].
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
 * MyStoreCommand.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('system.search', array(__CLASS__, 'Search'));
		
		include('class_mystore_command_product.php');
		include('class_mystore_option_delivery.php');
		include('class_mystore_basket.php');
		include('class_mystore_basket_address.php');
		include('class_mystore_basket_option_delivery.php');
		include('class_mystore_basket_option_payment.php');
		include('class_mystore_command_pdf.php');
		
		System::EnqueueScript('mystore.command', Plugin::Uri().'js/mystore_command.js');
		System::EnqueueScript('mystore.command.product', Plugin::Uri().'js/mystore_command_product.js');
		System::EnqueueScript('mystore.command.user', Plugin::Uri().'js/mystore_command_user.js');
		
		@Stream::MkDir(System::Path('publics').'mystore/', 0755);
		@Stream::MkDir(System::Path('publics').'mystore/mail/', 0755);
		@Stream::MkDir(System::Path('publics').'mystore/pdf/', 0755);
	}
/**
 * MyStoreCommand.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `mystore_command` (
		  `Command_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Command_NB` varchar(100) NOT NULL,
		  `User_ID` bigint(20) NOT NULL,
		  `Date_Create` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_Payment` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_Confirm` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_Preparation` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_Delivery_Start` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_Delivery_End` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Statut` varchar(100) NOT NULL DEFAULT 'created',
		  `Address_Billing` text NOT NULL,
		  `Address_Delivery` text NOT NULL,
		  `Mode_Delivery` varchar(255) NOT NULL DEFAULT '',
		  `In_Store` tinyint(1) NOT NULL DEFAULT '0',
		  `Link_Follow_Delivery` text NOT NULL,
		  `Delivery_NB` varchar(100) NOT NULL DEFAULT '',
		  `Amount_HT` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Eco_Tax` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Cost_Delivery` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `TVA` decimal(5,2) NOT NULL DEFAULT '0.00',
		  `Discount` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Amount_TTC` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Down_Payment` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Wallet_Card_ID` int(11) NOT NULL DEFAULT '0',
		  `Transaction_Object` text NOT NULL,
		  `Mode_Payment` text NOT NULL,
		  PRIMARY KEY (`Command_ID`)
		) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` ADD `Mode_Delivery` VARCHAR( 255 ) NOT NULL DEFAULT '' AFTER `Address_Delivery`";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` ADD `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0.00' AFTER `Amount_HT` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` ADD `Wallet_Card_ID` INT NOT NULL DEFAULT '0' AFTER `Amount_TTC` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` CHANGE `Transation_Object` `Transaction_Object` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` CHANGE `TVA` `TVA` decimal(5,2) NOT NULL DEFAULT '0.00' ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` ADD `Link_Follow_Delivery`  text NOT NULL AFTER `Mode_Delivery` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` ADD `In_Store`  TINYINT(1) NOT NULL DEFAULT '0' AFTER `Mode_Delivery` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `mystore_command` ADD `Delivery_NB` VARCHAR( 100 ) NOT NULL DEFAULT '' AFTER `Mode_Delivery` ";
		$request->exec('query');
		
		$request->query = 'ALTER TABLE `mystore_command` ADD `Down_Payment` DECIMAL( 10, 2 ) NOT NULL DEFAULT \'0\' AFTER `Amount_TTC`';
		$request->exec('query');
		
		$request->query = 'ALTER TABLE `mystore_command` ADD `Mode_Payment` text NOT NULL';
		$request->exec('query');
		
		$request->query = 'ALTER TABLE `mystore_command` ADD `Bank` VARCHAR( 50 ) NOT NULL DEFAULT \'\' AFTER `Down_Payment` ,
		ADD `Cheque_Name` VARCHAR( 50 ) NOT NULL DEFAULT \'\' AFTER `Bank` ,
		ADD `Cheque_NB` VARCHAR( 50 ) NOT NULL DEFAULT \'\' AFTER `Cheque_Name` ';
		
		MyStoreCommandProduct::Install();
		MyStoreOptionDelivery::Install();		
	}
/**	
 * MyStoreCommand#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->User_ID == 0 && User::IsConnect()){
			$this->User_ID = User::Get()->User_ID;
		}
		
		if($this->Date_Create == '0000-00-00 00:00:00'){
			$this->Date_Create = date('Y-m-d H:i:s');	
		}
		
		if(!in_array($this->Statut, array('created', 'authorized', 'canceled', 'error')) && empty($this->Command_NB) ){
			$this->createCommandNB();
		}
		
		if($this->Command_ID == 0){
			
			$request->fields = 	"`Command_NB`,
								`User_ID`,
								`Date_Create`,
								`Date_Payment`,
								`Date_Confirm`,
								`Date_Preparation`,
								`Date_Delivery_Start`,
								`Date_Delivery_End`,
								`Statut`,
								`Address_Billing`,
								`Address_Delivery`,
								`Mode_Delivery`,
								`In_Store`,
								`Link_Follow_Delivery`,
								`Delivery_NB`,
								`Amount_HT`,
								`Eco_Tax`,
								`Cost_Delivery`,
								`TVA`,
								`Discount`,
								`Amount_TTC`,
								`Down_Payment`,
								`Wallet_Card_ID`,
								`Mode_Payment`";
								
			$request->values = 	"'".Sql::EscapeString($this->Command_NB)."',
								'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString($this->Date_Create)."',
								'".Sql::EscapeString($this->Date_Payment)."',
								'".Sql::EscapeString($this->Date_Confirm)."',
								'".Sql::EscapeString($this->Date_Preparation)."',
								'".Sql::EscapeString($this->Date_Delivery_Start)."',
								'".Sql::EscapeString($this->Date_Delivery_End)."',
								'".Sql::EscapeString($this->Statut)."',
								'".Sql::EscapeString($this->Address_Billing)."',
								'".Sql::EscapeString($this->Address_Delivery)."',
								'".Sql::EscapeString($this->Mode_Delivery)."',
								'".Sql::EscapeString($this->In_Store)."',
								'".Sql::EscapeString($this->Link_Follow_Delivery)."',
								'".Sql::EscapeString($this->Delivery_NB)."',
								'".Sql::EscapeString($this->Amount_HT)."',
								'".Sql::EscapeString($this->Eco_Tax)."',
								'".Sql::EscapeString($this->Cost_Delivery)."',
								'".Sql::EscapeString($this->TVA)."',
								'".Sql::EscapeString($this->Discount)."',
								'".Sql::EscapeString($this->Amount_TTC)."',
								'".Sql::EscapeString($this->Down_Payment)."',
								'".Sql::EscapeString($this->Wallet_Card_ID)."',
								'".Sql::EscapeString($this->Mode_Payment)."'";
			
			System::Fire('mystore.command:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Command_ID = $request->exec('lastinsert');
				
				System::Fire('mystore.command:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Command_NB` = '".Sql::EscapeString($this->Command_NB)."',
								`User_ID` = '".Sql::EscapeString($this->User_ID)."',
								`Date_Create` = '".Sql::EscapeString($this->Date_Create)."',
								`Date_Payment` = '".Sql::EscapeString($this->Date_Payment)."',
								`Date_Confirm` = '".Sql::EscapeString($this->Date_Confirm)."',
								`Date_Preparation` = '".Sql::EscapeString($this->Date_Preparation)."',
								`Date_Delivery_Start` = '".Sql::EscapeString($this->Date_Delivery_Start)."',
								`Date_Delivery_End` = '".Sql::EscapeString($this->Date_Delivery_End)."',
								`Statut` = '".Sql::EscapeString($this->Statut)."',
								`Address_Billing` = '".Sql::EscapeString($this->Address_Billing)."',
								`Address_Delivery` = '".Sql::EscapeString($this->Address_Delivery)."',
								`Mode_Delivery` = '".Sql::EscapeString($this->Mode_Delivery)."',
								`In_Store` = '".Sql::EscapeString($this->In_Store)."',
								`Link_Follow_Delivery` = '".Sql::EscapeString($this->Link_Follow_Delivery)."',
								`Delivery_NB` = '".Sql::EscapeString($this->Delivery_NB)."',
								`Amount_HT` = '".Sql::EscapeString($this->Amount_HT)."',
								`Eco_Tax` = '".Sql::EscapeString($this->Eco_Tax)."',
								`Cost_Delivery` = '".Sql::EscapeString($this->Cost_Delivery)."',
								`TVA` = '".Sql::EscapeString($this->TVA)."',
								`Discount` = '".Sql::EscapeString($this->Discount)."',
								`Amount_TTC` = '".Sql::EscapeString($this->Amount_TTC)."',
								`Down_Payment` = '".Sql::EscapeString($this->Down_Payment)."',
								`Wallet_Card_ID` = '".Sql::EscapeString($this->Wallet_Card_ID)."',
								`Mode_Payment` = '".Sql::EscapeString($this->Mode_Payment)."'";
		
		if(in_array($this->Statut, array('created', 'authorized', 'canceled', 'error', 'paid'))){			
			$request->set .= 	", `Transaction_Object` = '".Sql::EscapeString($this->Transaction_Object)."'";				
		}
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Command_ID."'";
		
		System::Fire('mystore.command:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('mystore.command:commit.complete', array(&$this));
			
			if(isset($this->Details)){
				$this->setDetails($this->Details);
				unset($this->Details);	
			}
			
			if(isset($this->deleteDetails)){
				$this->removeDetails($this->deleteDetails);	
				unset($this->removeDetails);	
			}
			
			return true;
		}
		return false;
	}
/**	
 * MyStoreCommand#setDetails(array) -> Boolean
 *
 * Cette méthode ajoute la liste des produits passés en paramètre à la commande.
 **/	
	public function setDetails($array){
		
		foreach( $array as $o){
			
			$o = new MyStoreCommandProduct($o);
			$o->Command_ID = $this->Command_ID;
			
			if(!$o->commit()){
				die(Sql::Current()->getError());	
			}
				
		}
		
		return true;
	}	
/**	
 * MyStoreCommand#removeDetails(array) -> Boolean
 *
 * Cette méthode supprime la liste de produits passés en paramètre de la commande.
 **/
	public function removeDetails($array){
		
		foreach( $array as $o){
			
			$o = new MyStoreCommandProduct($o);
			$o->Command_ID = $this->Command_ID;
			
			if(!$o->delete()){
				die(Sql::Current()->getError());	
			}
				
		}
		
		return true;
	}
/**	
 * MyStoreCommand#createCommandNB() -> Boolean
 *
 * Cette méthode créée le numéro de commande en fonction des paramètres de MyStore.
 **/
 	protected function createCommandNB(){
		$nb = System::Meta('MYSTORE_COMMAND_INCREMENT');
		
		if(empty($nb)){
			$nb = 0;	
		}
		
		$nb++;
		
		System::Meta('MYSTORE_COMMAND_INCREMENT', $nb);
		//
		// Format
		//
		
		$format = System::Meta('MYSTORE_COMMAND_FORMAT');
		
		if(empty($format)){
			$format = '#NB';
		}
		
		$date = 		explode(' ', $this->Date_Payment);
		$date[0] = 		explode('-', $date[0]);
		$date[1] = 		explode(':', $date[1]);
		
		$keys = array(
			'#NB' => 		str_pad($nb, 10, "0", STR_PAD_LEFT),
			'#Y' =>			$date[0][0],
			'#M' =>			$date[0][1],
			'#D' =>			$date[0][2],
			'#H' =>			$date[1][0],
			'#I' =>			$date[1][1],
			'#S' =>			$date[1][2],
			'#CLIENTID' =>	$this->User_ID
		);
		
		foreach($keys as $key => $value){
			$format	= str_replace($key, $value, $format);
		}
		
		$this->Command_NB =	$format;
	}	
	
	public static function GetUser(){
		$command = self::Get();
		return new User((int) $command->User_ID);
	}
/**	
 * MyStoreCommand#paid() -> Boolean
 *
 * Cette méthode indique que la commande est payée par le client.
 **/	
	public function paid(){
		
		$this->Statut = 				'paid';
		$this->Wallet_Card_ID = 		MyWallet\Card::ID();
		$this->Transaction_Object = 	json_encode(MyWallet\Card::Transaction());
		$this->Date_Payment =			date('Y-m-d H:i:s');
				
		$this->createCommandNB();
		
		if($this->commit()){
			
			if(MyStore::StockEnable()){
				$list = self::GetProducts($this->Command_ID);
				
				for($i = 0; $i < $list['length']; $i++){
					$ref = new MyStoreCommandProduct($list[$i]);
					
					if(!$ref->downProductStock()){
						die(Sql::PrintError());
					}
				}
			}
			
			//$contacts = MyStore::Contacts();
			$mail = new Mail();
							
			$mail->Subject =	"Paiement accepté [".Blog::GetInfo('name')."]";
			$mail->From =		"info@" . Blog::GetInfo('host');
			$mail->Message =	' ';
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);//$mail->addMailTo('rom.lenzotti@gmail.com');
			
			$list = MyStore::MailList();
			
			$mail->addMailTo($list, Mail::BCC);
			
			$mail->setType(Mail::HTML);
			$mail->addAttach(File::ToABS($link = $this->printPDF()));
			
			$mail->importTemplate(self::Path('mail', 'model-command-paid.php'));
						
			$mail->send();
			
			return true;
		}
		
		return false;
	}
/**	
 * MyStoreCommand#cancel() -> Boolean
 *
 * Cette méthode annule la commande
 **/	
	public function cancel(){
		
		$this->Statut = 				'canceled';
		$this->Wallet_Card_ID = 		MyWallet\Card::ID();
		$this->Transaction_Object = 	json_encode(MyWallet\Card::Transaction());
		
		if($this->commit()){
			
			
			return true;
		}
		
		return false;
	}
/**	
 * MyStoreCommand#sendLinkPayment() -> Boolean
 *
 * Cette méthode envoye un lien de paiement au client.
 **/	
	public function sendLinkPayment(){
		
		
		self::Set($this);
		$user = self::GetUser();
		
		$link = Blog::GetInfo('uri').'basket/action/restore-cmd/'.$this->Command_ID.'/' . $user->getPasskey();
		//
		// Création de l'objet
		// 
		$options = new stdClass();
		$options->printDetails = 	true;
		$options->Title = 			'Réglement de votre commande'; 
		$options->User = 			$user->Name . ' ' . $user->FirstName;
		$options->Content = 		'<p>Vous avez passé commande par téléphone auprès de notre site. Veuillez trouvez ci-après le lien pour effectuer le réglement votre commande : </p>
									<p><a href="'.$link.'">'.$link.'</a></p>';
		
		self::SetOptions($options); 
			
		$mail = new Mail();
						
		$mail->Subject =	"Réglement de votre commande [".Blog::GetInfo('name')."]";
		$mail->From =		"info@" . Blog::GetInfo('host');
		$mail->Message =	' ';
		
		$user = new User((int) $this->User_ID);
		$mail->addMailTo($user->EMail);//$mail->addMailTo('rom.lenzotti@gmail.com');
		
		$list = MyStore::MailList();
		$mail->addMailTo($list, Mail::BCC);
		
		$mail->setType(Mail::HTML);
		//$mail->addAttach(File::ToABS($this->printPDF()));
		
		@$mail->importTemplate(self::Path('mail', 'model-custom.php'));
					
		$mail->send();
				
		return $link;
	}
/**	
 * MyStoreCommand#confirm() -> Boolean
 *
 * Cette méthode confirme la commande.
 **/	
	public function confirm(){
		$this->Statut = 				'confirmed';
		$this->Date_Confirm =			date('Y-m-d H:i:s');
				
		if($this->commit()){
			
			self::Set($this);
			
			$mail = new Mail();
							
			$mail->Subject =	"Confirmation de votre commande [".Blog::GetInfo('name')."]";
			$mail->From =		"info@" . Blog::GetInfo('host');
			$mail->Message =	' ';
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);//$mail->addMailTo('rom.lenzotti@gmail.com');
			
			$list = MyStore::MailList();
			$mail->addMailTo($list, Mail::BCC);
			
			$mail->setType(Mail::HTML);
			$mail->addAttach(File::ToABS($this->printPDF()));
			
			$mail->importTemplate(self::Path('mail', 'model-command-confirmed.php'));
						
			$mail->send();	
			return true;
		}
		
		return false;
	}
/**	
 * MyStoreCommand#prepared() -> Boolean
 *
 * Cette méthode indique que la commande est préparée.
 **/	
	public function prepared(){
		$this->Statut = 				'prepared';
		$this->Date_Preparation =		date('Y-m-d H:i:s');
		
		if($this->commit()){
			
			self::Set($this);
			
			$mail = new Mail();
			$mail->Subject =	"Commande préparée [".Blog::GetInfo('name')."]";
			$mail->From =		"info@" . Blog::GetInfo('host');
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);
			
			$mail->setType(Mail::HTML);
			
			$mail->importTemplate(self::Path('mail', 'model-command-prepared.php'));
						
			$mail->send();
			
			return true;	
		}
		
		return false;
	}
/**	
 * MyStoreCommand#startDelivery() -> Boolean
 *
 * Cette méthode indique que la commande est en cours de livraison
 **/	
	public function startDelivery(){
		$this->Statut = 				'delivery';
		$this->Date_Delivery_Start =	date('Y-m-d H:i:s');
		
		if($this->commit()){
			
			self::Set($this);
			
			$mail = new Mail();
			$mail->Subject =	"Livraison de votre commande en cours [".Blog::GetInfo('name')."]";
			$mail->From =		"info@" . Blog::GetInfo('host');
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);
			
			$mail->setType(Mail::HTML);
			
			$mail->importTemplate(self::Path('mail', 'model-command-delivery.php'));
						
			$mail->send();
			
			return true;	
		}
		
		return false;
	}
/**	
 * MyStoreCommand#finish() -> Boolean
 *
 * Cette méthode indique que la commande est terminée.
 **/	
	public function finish(){
		$this->Statut = 				'finish';
		$this->Date_Delivery_End =		date('Y-m-d H:i:s');
		
		if($this->commit()){
			return true;	
		}
		
		return false;
	}
/**	
 * MyStoreCommand#error() -> Boolean
 *
 * Cette méthode indique que la commande est préparée.
 **/	
	public function error(){
		
		$this->Statut = 				'error';
		$this->Wallet_Card_ID = 		MyWallet\Card::ID();
		$this->Transaction_Object = 	json_encode(MyWallet\Card::Transaction());
		
		if($this->commit()){
			
			return true;	
		}
		
		return false;
	}
/**
 * MyStoreCommand#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Command_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('mystore.command:remove', array(&$this));
			
			$request->from = 	MyStoreCommandProduct::TABLE_NAME;
			return $request->exec('delete');
		}
		return false;

	}
	
	public static function Path($folder = 'pdf', $file = ''){
		$link = Template::Path().'mystore/'.$folder.'/' . $file;
		
		if(file_exists($link)){
			return $link;
		}
		
		$link = System::Path('publics').'mystore/'.$folder.'/' . $file;
		
		if(file_exists($link)){
			return $link;
		}
		
		return MYSTORE_PATH . 'models/'.$folder.'/' . $file;
	}
/**
 * MyStoreCommand#printPDF() -> Boolean
 *
 * Cette méthode créée une document PDF à partir des informations de l'instance.
 **/	
	public function printPDF($model = 'default'){
		
		self::Set($this);
		
		switch($this->Statut){
			
			default:
				return '';
				
			case 'paid':
				
				self::SetLink(System::Path('publics').'cache/command-'.date('Ymd').'.pdf');
				
				include_once(self::Path('pdf', 'model-bon-command.php'));
				
				break;
				
			case 'confirmed':
			case 'prepared':
			case 'delivery':
			case 'finish':
				
				self::SetLink(System::Path('publics').'cache/billing-'.date('Ymd').'.pdf');
				
				include_once(self::Path('pdf', 'model-billing.php'));
								
				break;	
		}
		
		return File::ToURI(self::GetLink());	
	}
/**
 * MyStoreCommand.exec(command) -> Number
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
				
			case self::PRE_OP."print":
				$o = new self($_POST[__CLASS__]);
				$pdf = $o->printPDF();
				
				echo json_encode($pdf);
								
				break;
			
			case self::PRE_OP."send.link.payment":
				$o = new self($_POST[__CLASS__]);
				$link = $o->sendLinkPayment();
				
				echo json_encode($link);
				
				break;
				
			case self::PRE_OP."confirm":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->confirm()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP."prepared":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->prepared()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP."start.delivery":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->startDelivery()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP."finish":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->finish()){
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
				
			case self::PRE_OP."count":
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
			
				$tab = self::Count($_POST['clauses'], $_POST['options']);
								
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
 * MyStoreCommand.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreCommand#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Command_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyStoreCommand.Distinct(field [, word]) -> Array
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
 * MyStoreCommand.ID() -> Number
 * Cette méthode retourne l'ID du panier.
 **/	
	public static function ID(){
		return self::Get()->Command_ID;	
	}
/**
 * MyStoreCommand.NB() -> String
 * Cette méthode retourne le numéro de facture/Commande du panier.
 **/	
	public static function NB(){
		return self::Get()->Command_NB;	
	}
	
	public static function Statut(){
		return self::Get()->Statut;	
	}
/**
 * MyStoreCommand.InStore() -> Boolean
 **/	
	public static function InStore(){
		return self::Get()->In_Store == 1;	
	}
/**
 * MyStoreCommand.LinkFollowDelivery() -> String
 **/	
	public static function LinkFollowDelivery(){
		return self::Get()->LinkFollowDelivery;	
	}
/**
 * MyStoreCommand.DeliveryNB() -> String
 **/	
	public static function DeliveryNB(){
		return self::Get()->DeliveryNB;	
	}
/**
 * MyStoreCommand.DateCreate() -> String
 * Cette méthode retourne la date de création de la commande.
 **/	
	public static function DateCreate($format = '', $lang = 'fr', $encode = 'uft8'){
		return self::DateFormat(self::Get()->Date_Create, $format, $lang, $encode);
	}
/**
 * MyStoreCommand.DateFinish() -> String
 * Cette méthode retourne la date de création de la commande.
 **/	
	public static function DateFinish($format = '', $lang = 'fr', $encode = 'uft8'){
		return self::DateFormat(self::Get()->Date_Delivery_End, $format, $lang, $encode);
	}
/**
 * MyStoreCommand#countProducts() -> Number
 * Cette méthode retourne le nombre d'élément d'une commande.
 **/	
	public function countProducts(){
		return Sql::Count(MyStoreCommandProduct::TABLE_NAME, self::PRIMARY_KEY . ' = ' .((int) $this->Command_ID)); 
	}
/**
 * MyStoreCommand.GetProducts() -> Array<MyStoreCommandProduct>
 * Cette méthode retourne les éléments du panier.
 **/	
	public static function GetProducts($id = 0){
		$options = new stdClass();
		if(empty($id)){
			$options->Command_ID = self::Get()->Command_ID;
		}else{
			$options->Command_ID = $id;
		}
		$list = MyStoreCommandProduct::GetList($options, $options);
		
		return $list;
	}
/**
 * MyStoreBasket.AmountHT(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total de la commande Hors taxe.
 **/	
	public static function AmountHT($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){		
		return trim(number_format(self::Get()->Amount_HT, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency( $formatCurrency)) ;
	}
/**
 * MyStoreBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier sans les frais de livraison.
 **/	
	public static function AmountTVA($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){	
		return trim(number_format((self::Get()->Amount_HT * self::Get()->TVA) / 100, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency( $formatCurrency)) ;
	}
/**
 * MyStoreBasket.CostDelivery(dec_point, thousand_sep) -> String
 * Cette méthode retourne le coût total de la livraison.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){	
		return trim(number_format(self::Get()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency( $formatCurrency)) ;
	}
/**
 * MyStoreBasket.AmountTTC(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier (Montant + Cout de livraison)
 **/
	public static function AmountTTC($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){
		return trim(number_format(self::Get()->Amount_TTC, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency( $formatCurrency)) ;
	}
/**
 * MyStoreBasket.EcoTax(dec_point, thousand_sep) -> String
 * Cette méthode retourne l'écotaxe total formaté.
 **/	
	public static function EcoTax($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){	
		return trim(number_format(self::Get()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency( $formatCurrency)) ;
	}	
	
	public static function AddressDelivery(){
		$options = self::Get()->Address_Delivery;
		return '<p><strong>'.$options->Name . ' ' . $options->FirstName.'</strong><br>' . 
		$options->Address . ' ' . $options->Address2 . '<br>' .$options->CP . ' ' . $options->City . '<br>'. $options->Country . '<br>' . $options->Phone . '</p>';
	}
	
	public static function AddressBilling(){
		$options = self::Get()->Address_Billing;
		return '<p><strong>'.$options->Name . ' ' . $options->FirstName.'</strong><br>' . 
		$options->Address . ' ' . $options->Address2 . '<br>' .$options->CP . ' ' . $options->City . '<br>'. $options->Country . '<br>' . $options->Phone . '</p>';
	}
/**
 * MyStoreCommand.Search(word) -> void
 **/	
	public static function Search($word){
		
		if(!Plugin::HaveAccess('MyStore')){
			return;
		}
		
		$clauses = new stdClass();
		$clauses->where = $word;
		$clauses->Statut = array('created manually', 'paid', 'confirmed', 'prepared', 'delivery', 'finish');
		
		$result = self::GetList($clauses, $clauses);
		
		if(!$result){
			die(Sql::Current()->getError());
		}
		
		for($i = 0; $i < $result['length']; $i++){
			
			$obj = new IntelliSearch($result[$i]);
			
			$obj->onClick('System.MyStore.Command.openFromSearch');
			$obj->text = $result[$i]['Command_NB'] . ' - ' . $result[$i]['User'];	
			$obj->setAppIcon('mystore');
			$obj->setAppName(MUI('Commandes'));
			
			IntelliSearch::Add($obj);
		}
	}	
/**
 * MyStoreCommand.GetList([clauses [, options]]) -> Array | boolean
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
 	public static function Count($clauses = '', $options = ''){
		if(is_array(self::$List)){
			return count(self::$List);	
		}
		
		$where = 	' 1 ';
		
		if(!empty($options->Statut)){
			if(is_array($options->Statut)){
				$options->Statut = implode('", "', $options->Statut);	
			}
			
			$where .= ' AND C.Statut IN("' . $options->Statut .'")';
		}
		
		if(!empty($options->User_ID)){
			$request->where .= ' AND U.User_ID = ' . (int) $options->User_ID;
		}
				
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$where .= " 	AND (
								`Command_NB` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Create` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Payment` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Confirm` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Preparation` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Delivery_Start` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Delivery_End` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address_Billing` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Amount_HT` like '%".Sql::EscapeString($clauses->where)."%' OR
								`Amount_TTC` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
		}
		
		return Sql::Count(self::TABLE_NAME . ' C LEFT JOIN '.User::TABLE_NAME . ' U ON C.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY, $where);
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
			self::Set(new self($o));
			return self::Get();
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
			self::Set(new self($o));
			return self::Get();
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
			self::Set(new self($o));
			return self::Get();
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
			self::Set(new self($o));
			return self::Get();
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
			self::Set(new self($o));
			return self::Get();
		}else{
			return false;	
		}
	}
/**
 * MyStoreCommandProduct.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 *
 **/		
	public static function GetList($clauses = '', $options = ''){
		
		self::$List =		array();
				
		$request = 			new Request();
		
		$request->select = 	'C.*, CONCAT(U.Name," ", U.FirstName) as User, Meta';
		$request->from = 	self::TABLE_NAME . ' C LEFT JOIN '.User::TABLE_NAME . ' U ON C.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY;
		$request->where =	' 1 '; 
		$request->order = 	"FIELD( Statut, 'created manually', 'paid', 'confirmed', 'prepared', 'delivery', 'finish' )";
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(!empty($options->Statut)){
			if(is_array($options->Statut)){
				$options->Statut = implode('", "', $options->Statut);	
			}
			
			$request->where .= ' AND C.Statut IN("' . $options->Statut .'")';
		}
		
		if(!empty($options->User_ID)){
			$request->where .= ' AND U.User_ID = ' . (int) $options->User_ID;
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
								
				$request->where .= " 	AND (
								`Command_NB` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Create` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Payment` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Confirm` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Preparation` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Delivery_Start` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Delivery_End` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address_Billing` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Amount_HT` like '%".Sql::EscapeString($clauses->where)."%' OR
								`Amount_TTC` like '%".Sql::EscapeString($clauses->where)."%' OR
								CONCAT(U.Name,\" \", U.FirstName) like '%".Sql::EscapeString($clauses->where)."%' OR
								CONCAT(U.FirstName,\" \", U.Name) like '%".Sql::EscapeString($clauses->where)."%' 
							)";
				
			}
			if(!empty($clauses->order)) 	$request->order .= ' ,' . $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('mystore.command:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
			
			self::$List = $result;
			unset(self::$List['length'], self::$List['maxLength']);
			
			@self::Set(@self::$List[0]);
			
		}
		
		return $result; 
	}
/**
 * MyStoreCommand.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/
	public static function onGetList(&$row){
		
		if(!empty($row['Wallet_Card_ID'])){
			if(class_exists('MyWallet\Card')){
				$row['Mode_Payment'] = new MyWallet\Card((int) $row['Wallet_Card_ID']);
			}
		}else{
			if(empty($row['Mode_Payment'])){
				$row['Mode_Payment'] = new stdClass();
				$row['Mode_Payment']->Name = 		'';
				$row['Mode_Payment']->Bank = 		'';
				$row['Mode_Payment']->Cheque_NB = 	'';
				$row['Mode_Payment']->Cheque_Name = '';
			}
		}
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

MyStoreCommand::Initialize();

?>