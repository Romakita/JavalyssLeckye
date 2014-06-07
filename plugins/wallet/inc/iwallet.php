<?php
namespace MyWallet;
/** section: Interfaces
 * mixin iClass
 *
 * Interface des classes Javalyss.
 **/
interface iWallet{
/**
 * MyWallet.iWallet.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize();
/**
 * MyWallet.iWallet.onStart() -> void
 *
 * Cette méthode est lancée avant le chargement d'une page. 
 * Via cette méthode vous pouvez stopper le processus de chargement d'une page en fonction de son Permalien et charger une autre page de votre choix.
 **/
	public static function onStart();
/**
 * MyWallet.iWallet.Authorization() -> String | false
 * 
 * Cette méthode demande une authorisation de paiement auprès du serveur de paiement. 
 * Si le mode de paiement est de type Externe (nécessitant une redirection vers le site comme du serveur de paiement pour valider la transaction), 
 * la méthode devra retourner systématiqment le lien permettant de rediriger l'utilisateur vers la page de validation.
 **/	
	public static function Authorization();
/**
 * MyWallet.iWallet.Capture() -> String | Boolean
 * 
 * Cette méthode récupère le paiement après validation du serveur de paiement.
 **/	
	public static function Capture();
/**
 * MyWallet.iWallet.Void() -> Mixed
 * 
 * Cette méthode annule la transation.
 **/
	public static function Void();
/**
 * MyWallet.iWallet#create() -> void
 * 
 * Cette méthode initialise les informations du compte d'une transaction.
 **/
 	public function create();
/**
 * MyWallet.iWallet#setAmount(amount) -> void
 * - amount (Number): Montant de la transaction.
 * 
 * Cette méthode permet d'assigner le montant d'une transaction.
 **/
 	public function setAmount($amount);
/**
 * MyWallet.iWallet#setCurrency(currency) -> void
 * - currency (String): Devise de la transaction.
 * 
 * Cette méthode permet d'assigner la devise d'une transaction.
 **/	
	public function setCurrency($id);
/**
 * MyWallet.iWallet#setDescription(description) -> void
 * - description (String): Description de la transaction.
 * 
 * Cette méthode permet d'assigner la description d'une transaction.
 **/
	public function setDescription($id);
/**
 * MyWallet.iWallet#setReference(ref) -> void
 * - ref (Object): Référence de la transaction.
 * 
 * Cette méthode permet d'assigner une référence en mentionnant.
 **/
	public function setReference($obj);
/**
 * MyWallet.iWallet#getReference() -> Object
 * 
 * Cette méthode retourne la référence attachée à la transaction.
 **/	
	public function getReference();
/**
 * MyWallet.iWallet#getError() -> String
 * 
 * Cette méthode retourne les erreurs.
 **/	
	public function getError();
/**
 * MyWallet.iWallet#setOnSuccess(url) -> void
 * 
 * Cette méthode assigne l'adresse de retour en cas de validation du paiement.
 **/
	public function setOnSuccess($url);
/**
 * MyWallet.Paypal#setOnCancel() -> void
 * 
 * Cette méthode assigne l'adresse de retour en cas d'annulation.
 **/	
	public function setOnCancel($url);
/**
 * MyWallet.iWallet.isExternal() -> Mixed
 * 
 * Cette méthode indique que le mode de paiement courant mène vers un site externe pour la validation du paiement.
 **/	
	public function isExternal();
	
	
}
?>