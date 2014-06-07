<?php
namespace MyWallet;
/*
Name: Paypal
Version: 1.0
Author: Lenzotti Romain
Tags:
*/

/** section: Plugins
 * class MyWallet.Paypal < MyWalletCard
 *
 * 
 **/
class Paypal extends Card implements iWallet{
/**
 * MyWallet.Paypal.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	public static function Initialize(){
		\System::EnqueueScript('mywallet.paypal', \MyWallet::LibraryURI(). '/class_mywallet_paypal.js');
		\System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		//
		// Evenement système
		//
		\System::Observe('system:index', array(__CLASS__, 'onStart'));
		//
		// Ou événement BlogPress si il existe
		//
		\System::Observe('blog:start', array(__CLASS__, 'onStart'));
	}
/**
 * MyWallet.Paypal.onStart() -> void
 *
 * Cette méthode est lancée avant le chargement d'une page. 
 * Via cette méthode vous pouvez stopper le processus de chargement d'une page en fonction de son Permalien et charger une autre page de votre choix.
 **/	
	public static function onStart(){
		$link = \Permalink::Get();
		
		if($link->match('/mywallet\/paypal\/success/')){//on vide la panier
						
			self::Capture();
			
			exit();
		}
		
		if($link->match('/mywallet\/paypal\/cancel/')){//on vide la panier
						
			self::Void();
			
			exit();
		}
	}
/**
 * MyWallet.Paypal.Authorization() -> String | false
 * 
 * Cette méthode demande une authorisation de paiement auprès du serveur de paiement. 
 * Si le mode de paiement est de type Externe (nécessitant une redirection vers le site comme du serveur de paiement pour valider la transaction), 
 * la méthode devra retourner systématiqment le lien permettant de rediriger l'utilisateur vers la page de validation.
 **/
	public static function Authorization(){
		$transaction = 	Card::Get()->getTransaction();
		$token = 		$transaction->getToken();
		
		if(!$token){
			die($transaction->getError());
		}
		
		if($transaction->isSuccess()){
			$url = $transaction->getUrlPayment();
			
			Card::Set(Card::Get());
			return $url;
		}
		
		return false;
	}
/**
 * MyWallet.Paypal.Capture() -> String | Boolean
 * 
 * Cette méthode récupère le paiement après validation du serveur de paiement.
 **/	
	public static function Capture(){
		$instance = 	Card::Get();
		$instance->create();
		
		$transaction = Card::Transaction();
		
		if($transaction->getCheckoutDetails()){
			if($transaction->getCheckoutPayment()){
				
				Card::Fire('success');
				
				return;
			}
		}
		
		Card::Fire('error');
	}
/**
 * MyWallet.Paypal.Void() -> Mixed
 * 
 * Cette méthode annule la transation.
 **/	
	public static function Void(){
		$instance = 	Card::Get();
		$instance->create();
		
		$transaction = Card::Transaction();
		
		if($transaction->getCheckoutDetails()){
			Card::Fire('cancel');	
		}
		
		Card::Fire('error');
	}
/**
 * MyWallet.Paypal#create() -> void
 * 
 * Cette méthode initialise les informations du compte.
 **/	
	public function create(){
		
		$setting = $this->getSetting();
		
		\PaypalInfo::Set($setting->User, $setting->Password, $setting->Signature, $this->getMode() ? \PaypalInfo::PROD : \PaypalInfo::SANDBOX);
		
		$this->setTransaction(new \Paypal());
		$this->getTransaction()->extend($setting);
		
		$this->getTransaction()->observe('success', URI_PATH . 'mywallet/paypal/success/');
		$this->getTransaction()->observe('cancel', URI_PATH . 'mywallet/paypal/cancel/');
		//
		// Configuration du paiement
		//
		$payment = $this->getTransaction()->current();
		$payment->setAction(\PaypalPayment::SALE);
	}
/**
 * MyWallet.Paypal#isExternal() -> Boolean
 * 
 * Cette méthode indique que le mode de paiement courant mène vers un site externe pour la validation du paiement.
 **/	
	public function isExternal(){
		return true;//mettez à true si l'utilisateur doit etre rediriger vers un site externe.
	}
/**
 * MyWallet.Paypal#setAmount(amount) -> void
 * - amount (Number): Montant de la transaction.
 * 
 * Cette méthode permet d'assigner le montant d'une transaction.
 **/	
	public function setAmount($amount){
		$payment = $this->getTransaction()->current();
		$payment->setAmount($amount);
	}
/**
 * MyWallet.Paypal#setCurrency(currency) -> void
 * - currency (String): Devise de la transaction.
 * 
 * Cette méthode permet d'assigner la devise d'une transaction.
 **/	
	public function setCurrency($currency){
		$payment = $this->getTransaction()->current();
		$payment->setCurrency($currency);
	}
/**
 * MyWallet.Paypal#setDescription(description) -> void
 * - description (String): Description de la transaction.
 * 
 * Cette méthode permet d'assigner la description d'une transaction.
 **/
	public function setDescription($s){
		$payment = $this->getTransaction()->current();
		$payment->setDescription($s);
	}
/**
 * MyWallet.Paypal#setReference(ref) -> void
 * - ref (Object): Référence de la transaction.
 * 
 * Cette méthode permet d'assigner une référence en mentionnant.
 **/	
	public function setReference($s){
		$payment = $this->getTransaction()->current();
		$payment->setCustom($s);
	}
/**
 * MyWallet.Paypal#getReference() -> Object
 * 
 * Cette méthode retourne la référence attachée à la transaction.
 **/	
	public function getReference(){
		$payment = $this->getTransaction()->current();
		return $payment->getCustom();
	}
/**
 * MyWallet.Paypal#setDetails(array) -> void
 * - array (Arrau): Liste des produits à vendre.
 *
 * Cette méthode permet d'ajouter le détail des produits de la transaction.
 **/
 	//public function setDetails($array){
		
		/*unset($array['length'], $array['maxLength']);
		
		$i = 			0;
		$description = 	'';
		
		foreach($array as $obj){
			
			$obj = new ItemDetail($obj);
			
			
		}*/
			
	//}	
/**
 * MyWallet.Paypal#setOnSuccess(url) -> void
 * 
 * Cette méthode assigne l'adresse de retour en cas de validation du paiement.
 **/
	public function setOnSuccess($url){
		$obj = $this->getTransaction();
		$obj->observe('success', $url);
	}

/**
 * MyWallet.Paypal#setOnCancel() -> void
 * 
 * Cette méthode assigne l'adresse de retour en cas d'annulation.
 **/	
	public function setOnCancel($url){
		$obj = $this->getTransaction();
		$obj->observe('cancel', $url);
	}

	
/**
 * MyWallet.Paypal#getError() -> String
 * 
 * Cette méthode retourne les erreurs.
 **/
	public function getError(){
		$transaction = 	Card::Get()->getTransaction();
		return $transaction->getError();
	}
	
	public static function exec($op){
		switch($op){
			
			case 'mywallet.paypal.preview':
				
				Card::Set(new self($_POST[__CLASS__]));
				
				Card::Amount(10);
				Card::Currency('EUR');
				Card::Description('Prévisualisation achat via Javalyss 100 EUR');
				
				Card::setDetails();
				
				Card::Observe('success', array(__CLASS__, 'onTestSuccess'));
				Card::Observe('cancel', array(__CLASS__, 'onTestCancel'));
				Card::Observe('error', array(__CLASS__, 'onTestError'));
				
				if($url = self::Authorization()){	
					Card::Set(Card::Get());				
					echo json_encode($url);
				}else{
					return false;	
				}
				
		}
	}
	
	public static function onTestSuccess(){
		die("Transaction réussi et terminée");	
	}
	
	public static function onTestCancel(){
		die("Transaction annulée");	
	}
	
	public static function onTestError(){
		die(Card::Get()->getError());	
	}
}

Paypal::Initialize();
?>