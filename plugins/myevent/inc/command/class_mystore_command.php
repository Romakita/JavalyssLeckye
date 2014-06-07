<?php
/** section: MyEvent
 * class MyEventCommand
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_myevent_command.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventCommand extends ObjectPrint{	
	const PRE_OP =				'myevent.command.';
/**
 * MyEventCommand.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'myevent_command';	
/**
 * MyEventCommand.PRIMARY_KEY -> String
 * Clef primaire de la table MyEventCommand.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Command_ID';

/**
 * MyEventCommand#Command_ID -> Number
 **/
	public $Command_ID = 0;
/**
 * MyEventCommand#Command_NB -> String
 * Varchar
 **/
	public $Command_NB = "";
/**
 * MyEventCommand#User_ID -> Number
 **/
	public $User_ID = 0;
/**
 * MyEventCommand#Date_Create -> Datetime
 **/
	public $Date_Create = '0000-00-00 00:00:00';
/**
 * MyEventCommand#Date_Payment -> Datetime
 **/
	public $Date_Payment = '0000-00-00 00:00:00';
/**
 * MyEventCommand#Date_Confirm -> Datetime
 **/
	public $Date_Confirm = '0000-00-00 00:00:00';
/**
 * MyEventCommand#Date_Preparation -> Datetime
 **/
	public $Date_Preparation = '0000-00-00 00:00:00';
/**
 * MyEventCommand#Date_Delivery_Start -> Datetime
 **/
	public $Date_Delivery_Start = '0000-00-00 00:00:00';
/**
 * MyEventCommand#Date_Delivery_End -> Datetime
 **/
	public $Date_Delivery_End = '0000-00-00 00:00:00';
/**
 * MyEventCommand#Statut -> String
 * Varchar
 **/
	public $Statut = 'created';
/**
 * MyEventCommand#Address_Billing -> String
 * Text
 **/
	public $Address_Billing = "";
/**
 * MyEventCommand#Address_Delivery -> String
 * Text
 **/
	public $Address_Delivery = "";
/**
 * MyEventCommand#Mode_Delivery -> String
 * Text
 **/
	public $Mode_Delivery = "";
/**
 * MyEventCommand#Amount_HT -> Float
 * Decimal
 **/
	public $Amount_HT = 0.00;
/**
 * MyEventCommand#Eco_Tax -> Float
 * Decimal
 **/
	public $Eco_Tax = 0.00;
/**
 * MyEventCommand#Cost_Delivery -> Float
 * Decimal
 **/
	public $Cost_Delivery = 0.00;
/**
 * MyEventCommand#TVA -> Float
 * Decimal
 **/
	public $TVA = 0.00;
/**
 * MyEventCommand#Discount -> Float
 * Decimal
 **/
	public $Discount = 0.00;
/**
 * MyEventCommand#Amount_TTC -> Float
 * Decimal
 **/
	public $Amount_TTC = 0.00;
/**
 * MyEventCommand#Wallet_Card_ID -> String
 * Text
 **/
	public $Wallet_Card_ID =  0;
/**
 * MyEventCommand#Transaction_Object -> String
 * Text
 **/
	public $Transaction_Object = "";
	
	public $Products = array();
/**
 * new MyEventCommand()
 * new MyEventCommand(json)
 * new MyEventCommand(array)
 * new MyEventCommand(obj)
 * new MyEventCommand(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventCommand]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventCommand]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventCommand]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventCommand]].
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
 * MyEventCommand.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		
		include('class_myevent_command_product.php');
		include('class_myevent_option_delivery.php');
		include('class_myevent_basket.php');
		include('class_myevent_basket_address.php');
		include('class_myevent_basket_option_delivery.php');
		include('class_myevent_basket_option_payment.php');
		include('class_myevent_command_pdf.php');
		
		System::EnqueueScript('myevent.command', Plugin::Uri().'js/myevent_command.js');
		
		@Stream::MkDir(System::Path('publics').'myevent/', 0755);
		@Stream::MkDir(System::Path('publics').'myevent/mail/', 0755);
		@Stream::MkDir(System::Path('publics').'myevent/pdf/', 0755);
	}
/**
 * MyEventCommand.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `myevent_command` (
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
		  `Mode_Delivery` VARCHAR( 255 ) NOT NULL DEFAULT '',
		  `Amount_HT` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0.00',
		  `Cost_Delivery` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `TVA` decimal(5,2) NOT NULL DEFAULT '0.00',
		  `Discount` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Amount_TTC` decimal(10,2) NOT NULL DEFAULT '0.00',
		  `Transaction_Object` text NOT NULL,
		  PRIMARY KEY (`Command_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `myevent_command` ADD `Mode_Delivery` VARCHAR( 255 ) NOT NULL DEFAULT '' AFTER `Address_Delivery`";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `myevent_command` ADD `Eco_Tax` DECIMAL( 10, 2 ) NOT NULL DEFAULT '0.00' AFTER `Amount_HT` ";
		$request->exec('query');
			
		
		$request->query = 	"ALTER TABLE `myevent_command` ADD `Wallet_Card_ID` INT NOT NULL DEFAULT '0' AFTER `Amount_TTC` ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `myevent_command` CHANGE `Transation_Object` `Transaction_Object` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `myevent_command` CHANGE `TVA` `TVA` decimal(5,2) NOT NULL DEFAULT '0.00' ";
		$request->exec('query');
		
		MyEventCommandProduct::Install();
		MyEventOptionDelivery::Install();		
	}
/**	
 * MyEventCommand#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->User_ID == 0 && User::IsConnect()){
			$this->User_ID = User::Get()->User_ID;
		}
		
		if ($this->Command_ID == 0){
			
			$this->Date_Create = date('Y-m-d H:i:s'); 
			
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
								`Amount_HT`,
								`Eco_Tax`,
								`Cost_Delivery`,
								`TVA`,
								`Discount`,
								`Amount_TTC`,
								`Wallet_Card_ID`,
								`Transaction_Object`";
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
								'".Sql::EscapeString($this->Amount_HT)."',
								'".Sql::EscapeString($this->Eco_Tax)."',
								'".Sql::EscapeString($this->Cost_Delivery)."',
								'".Sql::EscapeString($this->TVA)."',
								'".Sql::EscapeString($this->Discount)."',
								'".Sql::EscapeString($this->Amount_TTC)."',
								'".Sql::EscapeString($this->Wallet_Card_ID)."',
								'".Sql::EscapeString($this->Transaction_Object)."'";
			
			System::Fire('myevent.command:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Command_ID = $request->exec('lastinsert');
				
				System::Fire('myevent.command:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		if(!in_array($this->Statut, array('created', 'authorized', 'canceled', 'error')) && empty($this->Command_NB) ){
			$this->createCommandNB();
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
								`Amount_HT` = '".Sql::EscapeString($this->Amount_HT)."',
								`Eco_Tax` = '".Sql::EscapeString($this->Eco_Tax)."',
								`Cost_Delivery` = '".Sql::EscapeString($this->Cost_Delivery)."',
								`TVA` = '".Sql::EscapeString($this->TVA)."',
								`Discount` = '".Sql::EscapeString($this->Discount)."',
								`Amount_TTC` = '".Sql::EscapeString($this->Amount_TTC)."',
								`Wallet_Card_ID` = '".Sql::EscapeString($this->Wallet_Card_ID)."'";
						
		if(in_array($this->Statut, array('created', 'authorized', 'canceled', 'error', 'paid'))){
			$request->set .= 	", `Transaction_Object` = '".Sql::EscapeString($this->Transaction_Object)."'";				
		}
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Command_ID."'";
		
		System::Fire('myevent.command:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('myevent.command:commit.complete', array(&$this));
			
			return true;
		}
		return false;
	}
/**
 *
 **/
 	protected function createCommandNB(){
		$nb = System::Meta('MYEVENT_COMMAND_INCREMENT');
		
		if(empty($nb)){
			$nb = 0;	
		}
		
		$nb++;
		
		System::Meta('MYEVENT_COMMAND_INCREMENT', $nb);
		//
		// Format
		//
		
		$format = System::Meta('MYEVENT_COMMAND_FORMAT');
		
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
 * MyEventCommand#paid() -> Boolean
 *
 * Cette méthode indique que la commande est payée par le client.
 **/	
	public function paid(){
		
		$this->Statut = 				'paid';
		$this->Wallet_Card_ID = 		MyWalletCard::ID();
		$this->Transaction_Object = 	MyWalletCard::Transaction();
		$this->Date_Payment =			date('Y-m-d H:i:s');
				
		$this->createCommandNB();
		
		if($this->commit()){
			
			//$contacts = MyEvent::Contacts();
			$mail = new Mail();
							
			$mail->Subject =	"Paiement accepté [".Blog::GetInfo('name')."]";
			$mail->From =		'romain.lenzotti@analemme.fr'; //"info@" . Blog::GetInfo('host');
			$mail->Message =	' ';
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);//$mail->addMailTo('rom.lenzotti@gmail.com');
			
			$list = MyEvent::MailList();
			
			$mail->addMailTo($list, Mail::BCC);
			
			$mail->setType(Mail::HTML);
			$mail->addAttach(File::ToABS($this->printPDF()));
			
			if(file_exists(System::Path('publics').'myevent/mail/model-command-paid.php')){
				$mail->importTemplate(System::Path('publics').'myevent/mail/model-command-paid.php');
			}else{
				$mail->importTemplate(MYEVENT_PATH.'models/mail/model-command-paid.php');
			}
			
			return $mail->send();
			
			return true;
		}
		
		return false;
	}
/**	
 * MyEventCommand#cancel() -> Boolean
 *
 * Cette méthode annule la commande
 **/	
	public function cancel(){
		
		$this->Statut = 				'canceled';
		$this->Wallet_Card_ID = 		MyWalletCard::ID();
		$this->Transaction_Object = 	MyWalletCard::Transaction();
		
		if($this->commit()){
			
			
			return true;
		}
		
		return false;
	}
/**	
 * MyEventCommand#confirm() -> Boolean
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
			$mail->From =		'romain.lenzotti@analemme.fr'; //"info@" . Blog::GetInfo('host');
			$mail->Message =	' ';
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);//$mail->addMailTo('rom.lenzotti@gmail.com');
			
			$list = MyEvent::MailList();
			$mail->addMailTo($list, Mail::BCC);
			
			$mail->setType(Mail::HTML);
			$mail->addAttach(File::ToABS($this->printPDF()));
			
			if(file_exists(System::Path('publics').'myevent/mail/model-command-confirmed.php')){
				$mail->importTemplate(System::Path('publics').'myevent/mail/model-command-confirmed.php');
			}else{
				$mail->importTemplate(MYEVENT_PATH.'models/mail/model-command-confirmed.php');
			}
			
			return $mail->send();	
		}
		
		return false;
	}
/**	
 * MyEventCommand#prepared() -> Boolean
 *
 * Cette méthode indique que la commande est préparée.
 **/	
	public function prepared(){
		$this->Statut = 				'prepared';
		$this->Date_Preparation =		date('Y-m-d H:i:s');
		
		if($this->commit()){
			
			$mail = new Mail();
			$mail->Subject =	"Commande préparée [".Blog::GetInfo('name')."]";
			$mail->From =		"info@" . Blog::GetInfo('host');
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);
			
			$mail->setType(Mail::HTML);
			
			if(file_exists(System::Path('publics').'myevent/mail/model-command-prepared.php')){
				$mail->importTemplate(System::Path('publics').'myevent/mail/model-command-prepared.php');
			}else{
				$mail->importTemplate(MYEVENT_PATH.'models/mail/model-command-prepared.php');
			}
			
			$mail->send();
			
			return true;	
		}
		
		return false;
	}
/**	
 * MyEventCommand#startDelivery() -> Boolean
 *
 * Cette méthode indique que la commande est en cours de livraison
 **/	
	public function startDelivery(){
		$this->Statut = 				'delivery';
		$this->Date_Start_Delivery =	date('Y-m-d H:i:s');
		
		if($this->commit()){
			
			$mail = new Mail();
			$mail->Subject =	"Livraison de votre commande en cours [".Blog::GetInfo('name')."]";
			$mail->From =		"info@" . Blog::GetInfo('host');
			
			$user = new User((int) $this->User_ID);
			$mail->addMailTo($user->EMail);//$mail->addMailTo('rom.lenzotti@gmail.com');
			
			$mail->setType(Mail::HTML);
			
			if(file_exists(System::Path('publics').'myevent/mail/model-command-delivery.php')){
				$mail->importTemplate(System::Path('publics').'myevent/mail/model-command-delivery.php');
			}else{
				$mail->importTemplate(MYEVENT_PATH.'models/mail/model-command-delivery.php');
			}
			
			$mail->send();
			
			return true;	
		}
		
		return false;
	}
/**	
 * MyEventCommand#finish() -> Boolean
 *
 * Cette méthode indique que la commande est terminée.
 **/	
	public function finish(){
		$this->Statut = 				'finish';
		$this->Date_End_Delivery =		date('Y-m-d H:i:s');
		
		if($this->commit()){
			
			
			return true;	
		}
		
		return false;
	}
/**	
 * MyEventCommand#error() -> Boolean
 *
 * Cette méthode indique que la commande est préparée.
 **/	
	public function error(){
		
		$this->Statut = 				'error';
		$this->Wallet_Card_ID = 		MyWalletCard::ID();
		$this->Transaction_Object = 	MyWalletCard::Transaction();
		
		if($this->commit()){
			
			return true;	
		}
		
		return false;
	}
/**
 * MyEventCommand#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Command_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('myevent.command:remove', array(&$this));
			
			$request->from = 	MyEventCommandProduct::TABLE_NAME;
			return $request->exec('delete');
		}
		return false;

	}
/**
 * MyEventCommand#printPDF() -> Boolean
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
				
				if(file_exists(System::Path('publics').'myevent/pdf/model-bon-command.php')){
					include(System::Path('publics').'myevent/pdf/model-bon-command.php');
				}else{
					include(MYEVENT_PATH.'models/pdf/model-bon-command.php');
				}
				
				break;
				
			case 'confirmed':
			case 'prepared':
			case 'delivery':
			case 'finish':
				
				self::SetLink(System::Path('publics').'cache/billing-'.date('Ymd').'.pdf');
				
				if(file_exists(System::Path('publics').'myevent/pdf/model-billing.php')){
					
					include(System::Path('publics').'myevent/pdf/model-billing.php');
					
				}else{
					
					include(MYEVENT_PATH.'models/pdf/model-billing.php');
					
				}
				
				break;	
		}
		
		return File::ToURI(self::GetLink());	
	}
/**
 * MyEventCommand.exec(command) -> Number
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
 * MyEventCommand.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyEventCommand#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Command_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * MyEventCommand.Distinct(field [, word]) -> Array
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
 * MyEventCommand.ID() -> Number
 * Cette méthode retourne l'ID du panier.
 **/	
	public static function ID(){
		return self::Get()->Command_ID;	
	}
/**
 * MyEventCommand.NB() -> String
 * Cette méthode retourne le numéro de facture/Commande du panier.
 **/	
	public static function NB(){
		return self::Get()->Command_NB;	
	}
/**
 * MyEventCommand.DateCreate() -> String
 * Cette méthode retourne la date de création de la commande.
 **/	
	public static function DateCreate($format = '', $lang = 'fr', $encode = 'uft8'){
		return self::DateFormat(self::Get()->Date_Create, $format, $lang, $encode);
	}
/**
 * MyEventCommand.GetProducts() -> Array<MyEventCommandProduct>
 * Cette méthode retourne les éléments du panier.
 **/	
	public static function GetProducts(){
		
		$options = new stdClass();
		$options->Command_ID = self::Get()->Command_ID;
		$list = MyEventCommandProduct::GetList($options, $options);
		
		return $list;
	}
/**
 * MyEventBasket.AmountHT(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total de la commande Hors taxe.
 **/	
	public static function AmountHT($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){		
		return trim(number_format(self::Get()->Amount_HT, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency( $formatCurrency)) ;
	}
/**
 * MyEventBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier sans les frais de livraison.
 **/	
	public static function AmountTVA($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){	
		return trim(number_format((self::Get()->Amount_HT * self::Get()->TVA) / 100, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency( $formatCurrency)) ;
	}
/**
 * MyEventBasket.CostDelivery(dec_point, thousand_sep) -> String
 * Cette méthode retourne le coût total de la livraison.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){	
		return trim(number_format(self::Get()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency( $formatCurrency)) ;
	}
/**
 * MyEventBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier (Montant + Cout de livraison)
 **/	
	public static function Amount($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){
		return trim(number_format(self::Get()->Amount_TTC, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency( $formatCurrency)) ;
	}
/**
 * MyEventBasket.EcoTaxTotal(dec_point, thousand_sep) -> String
 * Cette méthode retourne l'écotaxe total formaté.
 **/	
	public static function EcoTax($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){	
		return trim(number_format(self::Get()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency( $formatCurrency)) ;
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
 * MyEventCommand.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'C.*, CONCAT(U.Name," ", U.FirstName) as User, Meta';
		$request->from = 	self::TABLE_NAME . ' C LEFT JOIN '.User::TABLE_NAME . ' U ON C.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY;
		$request->where =	' 1 '; 
		$request->order = 	"FIELD( Statut, 'paid', 'confirmed', 'prepared', 'delivery', 'finish' )";
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(!empty($options->Statut)){
			if(is_array($options->Statut)){
				$options->Statut = implode('", "', $options->Statut);	
			}
			
			$request->where .= ' AND C.Statut IN("' . $options->Statut .'")';
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
								`Command_NB` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`User_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Create` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Payment` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Confirm` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Preparation` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Delivery_Start` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Delivery_End` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Statut` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address_Billing` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Address_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Amount_HT` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Cost_Delivery` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`TVA` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Discount` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Amount_TTC` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Transaction_Object` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order .= ' ,' . $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('myevent.command:list', array(&$request, $options));
				
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}

	public static function onGetList(&$row){
		if(class_exists('MyWalletCard')){
			$row['Mode_Payment'] = new MyWalletCard((int) $row['Wallet_Card_ID']);
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

MyEventCommand::Initialize();

?>