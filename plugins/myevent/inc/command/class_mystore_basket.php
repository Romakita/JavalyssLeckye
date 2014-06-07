<?php
/** section: MyEvent
 * class MyEventCommand
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table MyEventCommand.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_myevent_command.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventBasket extends MyEventCommand{	
	const OK =							0;
	
	const ERROR_NULL_PRODUCT = 			1;
	
	const ERROR_NO_STOCK = 				2;
	
	protected static $instance =		NULL;
	
	protected static $Amount =				0;
	protected static $RealAmount =			0;
	protected static $AmountDelivery =		0;
	protected static $EcoTax =				0;
/**
 * MyEventBasket.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		self::Get();
		
		System::Observe('blog:start', array(__CLASS__, 'onStart')); 
		System::Observe('blog:startpage', array(__CLASS__, 'onStartPage')); 
	}
	
	public static function onStartPage(){
		
		if(Post::Name() == 'panier'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
		
	}
	
	public static function eDie($msg, $errorCode = ''){
		$options = new stdClass();
		$options->parameters = Permalink::Get()->getParameters();
		$options->error = $mgs;
		
		if(!empty($errorCode)){
			$options->errorCode = $errorCode;
		}
		
		die(json_encode($options));	
	}
/**
 * MyEventBasket.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function onStart(){
		//
		// #PHASE 1 : Analyse du permalien
		//
		//on récupère le permalien qui nous sert de paramètre pour la génération d'un post.
		$link = Permalink::Get();
			
		//on analyse la chaine
		
		if($link->match('/panier/')){
			Blog::EnqueueScript('myevent.basket', MYEVENT_URI.'inc/command/class_basket.js');
		}
		
		if($link->match('/basket\/(action|api)\/clear/')){//on vide la panier
			self::Clear();
			
			$parameters = $link->getParameters();
			
			if($parameters[1] != 'api'){
				header('Location:' . Blog::GetInfo('uri') . 'panier/confirmation-suppression');
			}else{
				echo self::Encode();
			}
			
			exit();
		}
		
		if($link->match('/basket\/(action|api)\/submit/')){//Validation du panier
			
			if(User::IsConnect()){
				
				if(!empty($_POST['MyEventProduct'])){
					
					foreach($_POST['MyEventProduct'] as $key => $value){
						self::Push($key, $value['Qte']);	
					}
					
				}
				
				header('Location:' . Blog::GetInfo('page:panier/adresse-livraison'));
				
			}else{
				header('Location:' . Blog::GetInfo('admin') . '?redir=' . rawurlencode($link) );
			}
			
			exit();
		}
		
		if($link->match('/basket\/(action|api)\/address\/submit/')){//validation des adresses
			
			if(User::IsConnect()){
				//sauvegarder les informations
								
				self::SetAddressDelivery($_POST['AddressDelivery']);
				self::SetAddressBilling($_POST['SameAddress'] * 1 == 1 ? $_POST['AddressDelivery'] : $_POST['AddressBilling']);
				
				header('Location:' . Blog::GetInfo('page:panier/options-livraison'));
				
			}else{
				header('Location:' . Blog::GetInfo('admin') . '?redir=' . rawurlencode($link) );
			}
			
			exit();
		}
		
		if($link->match('/basket\/(action|api)\/options\/submit/')){//validation de l'option de livraison
			
			if(User::IsConnect()){
				//sauvegarder les informations
				
				if(!empty($_POST['OptionDeliveryID'])){//Il y a une option de choisi
					self::SetOptionDelivery($_POST['OptionDeliveryID']);
				}else{//pas d'option choisi
					if(MyEventBasketOptionDelivery::Have()){// si il y avait des options, le client doit en choisir une
						header('Location:panier/options-livraison');
					}
					
					self::SetOptionDelivery();
				}
								
				header('Location:' . Blog::GetInfo('page:panier/paiement'));
				
			}else{
				header('Location:' . Blog::GetInfo('admin') . '?redir=' . rawurlencode($link) );
			}
			
			exit();
		}
		
		if($link->match('/basket\/(action|api)\/payment\/authorize/')){//demande d'authorisation de paiement.
			
			if(User::IsConnect()){
				
				//Récupération de la méthode paiement
				$parameters = $link->getParameters();
				
				if(empty($parameters[4])){
					header('Location:' . Blog::GetInfo('page:panier/paiement'));
					exit();
				}
				
				//on recupère le mode de paiement
				MyWalletCard::Set((int) $parameters[4]);
				
				$basket = 						self::Get();
				
				//création de la description + montant et reference
				MyWalletCard::Amount($basket->Amount_TTC);
				MyWalletCard::Currency(MyEvent::CurrencyCode());
				MyWalletCard::Description(MUI('Achat de produit d\'un montant de') . ' ' . number_format($basket->Amount_TTC, '2', ',', ' ') . ' ' . MyEvent::CurrencyCode());
				MyWalletCard::Reference($basket->Command_ID);
				//Gestion des événements
				MyWalletCard::Observe('success', array(__CLASS__, 'onSuccessPayment'));
				MyWalletCard::Observe('cancel', array(__CLASS__, 'onCancelPayment'));
				MyWalletCard::Observe('error', array(__CLASS__, 'onErrorPayment'));
				
				//Demande d'authorisation
				
				$result = MyWalletCard::Authorization();
				
				if($result){
					//sauvegarde des information de la transaction
					
					$basket->Statut = 				'authorized';
					$basket->Wallet_Card_ID = 		MyWalletCard::ID();
					$basket->Transaction_Object = 	MyWalletCard::Transaction();
					
					$basket->commit();
					
					if(MyWalletCard::External()){
						//on redirige l'utilisateur.
						header('Location:' . $result);
						
					}//sinon on en fait rien. L'événement onSuccess sera déclenché automatiquement.
					
				}
				exit();
				
			}else{
				header('Location:' . Blog::GetInfo('admin') . '?redir=' . rawurlencode($link) );
			}
			
			exit();
		}
		
		if($link->match('/basket\/(action|api)/')){
			//
			// #PHASE 2 : Sécurisation du permalien
			//
			
			//le lien correspond à l'ouverture d'un module. $link => http://host.fr/panier/api/ACTION/PRODUCT_ID/QTE
			//On vérifie donc que le lien soit complet
			
			$parameters = $link->getParameters();//cette méthode découpe le permalien et stock ses infos dans un tableau.
			
			if(count($parameters) < 3){
			
				if($parameters[1] != 'api'){
					header('Location:' . Blog::GetInfo('page:panier'));
				}else{
					self::eDie("Wrong permalink. You must to use that syntax link : http://host.fr/basket/api/ACTION/PRODUCT_ID[/QTE]", 'bakset 001');	
				}
				
				exit();
			}
			//
			// Produit
			//
			$product = $parameters[3];
			
			
			if(!is_numeric($product)){
				
				if($parameters[1] != 'api'){
					header('Location:' . Blog::GetInfo('page:panier'));
				}else{
					self::eDie("Wrong PRODUCT_ID. Product ID must be an integer.", 'bakset 002');	
				}
				
			}
			
			$product = new MyEventProduct((int) $product);
			
			if($product->Post_ID == 0){
				if($parameters[1] != 'api'){
					header('Location:' . Blog::GetInfo('page:panier'));
				}else{
					self::eDie("Wrong PRODUCT_ID. Product not found.", 'bakset 003');	
				}
			}
			//var_dump($product);
			
			//
			//
			//
			$qte = empty($parameters[4]) || !is_numeric($parameters[4]) ? 1 : ($parameters[4] * 1);
					
			switch(@$parameters[2]){
									
				case 'set':
					
					switch(self::Push($product, $qte)){
						case self::OK:
							//var_dump(self::Get());
							break;
						
						case self::ERROR_NO_STOCK:	
							if($parameters[1] != 'api'){
								header('Location:' . Blog::GetInfo('page:panier'));
							}else{
								self::eDie("Insufficient for the required product stock", 'bakset 004');	
							}
							break;
					}
					
					break;
					
				case 'remove':
					
					self::Remove($product);
					
					break;
					
			}
			
			if($parameters[1] != 'api'){
				header('Location:' . Blog::GetInfo('page:panier'));
			}else{
				self::Encode();
			}
			
			exit();
		}
		
		
	}
/**	
 * MyEventBasket#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		$return = parent::commit();
		
		if($return){
			self::Set($this);
		}
		
		return $return;
	}
/**
 * MyEventBasket.OnSuccesPayment() -> String
 * Cette méthode est appelée lorsque le paiement est un succès.
 **/	
	public static function OnSuccessPayment(){
		//le paiement est déjà récupéré par MyWallet. On enregistre les informations retournées par le mode de paiement choisi
		
		//récupération de la référence		
		$basket = new self((int) MyWalletCard::Reference());
		
		if($basket->paid()){			
			header('Location:' .  Blog::GetInfo('page:panier/confirmation'));
			exit();
		}
		
	}
/**
 * MyEventBasket.OnSuccesPayment() -> String
 * Cette méthode est appelée lorsque le paiement est un succès.
 **/	
	public static function OnCancelPayment(){
		
		$ref = MyWalletCard::Reference();
		
		$basket = new self((int) $ref);
		
		if($basket->cancel()){
			header('Location:' .  Blog::GetInfo('page:panier/annulation'));
			exit();
		}
	}
/**
 * MyEventBasket.OnErrorPayment() -> String
 * Cette méthode est appelée lorsque le paiement est un succès.
 **/	
	public static function OnErrorPayment(){
		//le paiement est déjà récupéré par MyWallet. On enregistre les informations retournées par le mode de paiement choisi
		
		//récupération de la référence
		$ref = MyWalletCard::Reference();
		
		$basket = new self((int) $ref);
						
		if($basket->error()){
			//header('Location:' .  Blog::GetInfo('page:panier/erreur'));
			exit();
		}
		
	}
/**
 * MyEventBasket.PermalinkAdd([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de supprimer le produit du panier.
 **/	
	public static function PermalinkAdd($post = 0, $api = false){
		
		if(empty($post)){
			$post = MyEventProduct::ID();
		}
		
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/set/' . $post . '/';  
	}
/**
 * MyEventBasket.PermalinkRemove([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de supprimer le produit du panier.
 **/
	public static function PermalinkRemove(){
		
		if(empty($post)){
			$post = MyEventBasket::ProductID($post = 0, $api = false);
		}
		
		return Blog::GetInfo('uri') . 'basket/' . ( $api ? 'api' : 'action') . '/remove/' . $post; 
	}
/**
 * MyEventBasket.PermalinkClear() -> String
 * Cette méthode retourne le lien permettant de vider le panier.
 **/	
	public static function PermalinkClear(){
		return Blog::GetInfo('uri') . 'basket/action/clear'; 
	}
/**
 * MyEventBasket.PermalinkSubmit([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de valider le panier et de passer l'étape suivante.
 **/	
	public static function PermalinkSubmit($post = 0, $api = false){
		
		if(empty($post)){
			$post = MyEventProduct::ID();
		}
		
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/submit';  
	}
/**
 * MyEventBasket.PermalinkSubmitAddress([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de valider le panier et de passer l'étape suivante.
 **/	
	public static function PermalinkSubmitAddress($post = 0, $api = false){
		
		if(empty($post)){
			$post = MyEventProduct::ID();
		}
		
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/address/submit';  
	}
/**
 * MyEventBasket.PermalinkSubmitOption([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de valider le panier et de passer l'étape suivante.
 **/	
	public static function PermalinkSubmitOption($post = 0, $api = false){
		
		if(empty($post)){
			$post = MyEventProduct::ID();
		}
		
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/options/submit';  
	}
/**	
 * MyEventBasket.SessionExists() -> Boolean
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
 * MyEventBasket.Push(product, qte) -> void
 * - product (MyEventProduct): Produit à ajouter au panier.
 * - qte (Number): Nombre produit.
 *
 * Cette méthode permet de stocker une instance.
 **/
 	public static function Push($product, $qte = 1){
		
		if(is_numeric($product)){
			$product = new MyEventProduct((int) $product);
		}
		
		if($product->Post_ID == 0){
			return self::ERROR_NULL_PRODUCT;
		}
		
		//on sauvegarde l'instance en base dès qu'il y a un ajout de produit au panier pour le décompte du stock des produits
		// pour l'ensemble des visiteurs.

		if(!self::Get()->commit()){
			die(Sql::Current()->getRequest() .' '.Sql::Current()->getError());	
		}
		
		//et on ajoute la nouvelle quantité si possible.
		$basket = 	self::Get();
		$products = self::GetProducts();
		
		for($i = 0, $len = count($products); $i < $len; $i++){
			
			$current = new MyEventCommandProduct($products[$i]);
			
			if($current->Post_ID == $product->Post_ID){// le produit est déjà dans la liste
								
				if($product->Stock >= $qte || !MyEvent::StockEnable()){
					$current->Qte = (int) $qte;
					
					$current->commit();
					
				}else{
					return self::ERROR_NO_STOCK;	
				}
				
				break;	
			}	
		}
		
		//Ajout du nouveau produit au panier.
		if($i >= $len){
			
			if($product->Stock >= $qte || !MyEvent::StockEnable()){
				
				$o = 				new MyEventCommandProduct($product);
				
				$o->Qte =			(int) $qte;
				
				$o->Command_ID = 	self::ID();
				$o->commit();
				
				self::GetProducts();
				//array_push($basket->Products, $o);
				
			}else{
				return self::ERROR_NO_STOCK;	
			}
			
		}
		
		self::Set($basket);
		
		return 0;
	}
/**
 * MyEventBasket.Remove(product, qte) -> void
 * - product (MyEventProduct): Produit à ajouter au panier.
 * - qte (Number): Nombre produit.
 *
 * Cette méthode permet de stocker une instance.
 **/	
	public static function Remove($product){
		if(is_numeric($product)){
			$product = new MyEventProduct((int) $product);
		}
		
		if($product->Post_ID == 0){
			return self::ERROR_NULL_PRODUCT;
		}
		
		//on sauvegarde l'instance en base dès qu'il y a un ajout de produit au panier pour le décompte du stock des produits
		// pour l'ensemble des visiteurs.
		
		self::Get()->commit();		
		
		//et on ajoute la nouvelle quantité si possible.
		$basket = self::Get();
		$current = new MyEventCommandProduct();
		$current->Command_ID = 	$basket->Command_ID;
		$current->Post_ID = 	$product->Post_ID;
		
		$current->delete();
		
		self::GetProducts();		
		self::Set($basket);
							
		return 0;
	}
/**
 * MyEventBasket.SetAddressDelivery(id) -> Boolean
 * - id (Number): Identifiant de l'adresse de livraison.
 *
 * Cette méthode assigne une adresse de livraison.
 **/
	public static function SetAddressDelivery($id){
		$basket = self::Get();
		
		$basket->Address_Delivery = json_encode(new MyEventAccountAddress($id));
		
		if($basket->commit()){
			self::Set($basket);
			return true;
		}
		
		return false;
	}
/**
 * MyEventBasket.SetAddressBilling(id) -> Boolean
 * - id (Number): Identifiant de l'adresse de livraison.
 *
 * Cette méthode assigne une adresse de facturation.
 **/
	public static function SetAddressBilling($id){
		$basket = self::Get();
		
		$basket->Address_Billing = json_encode(new MyEventAccountAddress($id));
		
		if($basket->commit()){
			self::Set($basket);
			return true;
		}
		
		return false;
	}
/**
 * MyEventBasket.SetOptionDelivery(id) -> Boolean
 * - id (Number): Identifiant de l'adresse de livraison.
 *
 * Cette méthode assigne une adresse de facturation.
 **/	
	public static function SetOptionDelivery($id = 0){
		
		$cost = self::GetCostDelivery();
		
		if(!empty($id)){
			$option = new MyEventOptionDelivery((int) $id);
			
			if($option->getMode() == MyEventOptionDelivery::ADD){
				$cost += $option->Cost_Delivery;	
			}else{
				$cost = $option->Cost_Delivery;
			}
		}
		
		$basket = self::Get();
				
		$basket->Amount_HT = 		self::GetAmount();
		$basket->Cost_Delivery = 	$cost;
		$basket->TVA =				MyEvent::TVA();
		$basket->Amount_TTC = 		$basket->Amount_HT;
		$basket->Eco_Tax =			self::GetEcoTax();
		$basket->Mode_Delivery =	$option->Name;
				
		switch(MyEvent::ModeTVA()){
			case MyEvent::TVA_DISABLED:
				break;
			case MyEvent::TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				$basket->Amount_TTC = 	MyEvent::CalculateTVA($basket->Amount_HT);
				break;
			case MyEvent::TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$basket->Amount_HT = 	MyEvent::CalculateTVA($basket->Amount_TTC);
				break;
		}
		
		//on fini par ajouter le cout de livraison au montant TTC Total.
		$basket->Amount_TTC += $basket->Cost_Delivery;
		
		if($basket->commit()){
			self::Set($basket);
			return true;
		}
		
		return false;
	}
/**
 * MyEventBasket.ID() -> Number
 * Cette méthode retourne l'ID du panier.
 **/	
	public static function ID(){
		return self::Get()->Command_ID;	
	}
/**
 * MyEventBasket.Count() -> Number
 * Cette méthode retourne le nombre de référence dans le panier.
 **/	
	public static function Count(){
		return MyEventCommandProduct::Count();	
	}
/**
 * MyEventBasket.Clear() -> void
 * Cette méthode supprime le panier.
 **/	
	public static function Clear(){
		if(self::Get()->Statut == 'created'){
			self::Get()->delete();
		}
		self::Set(new self());
	}
/**
 * MyEventBasket.Set(instance) -> void
 * - instance (Instance): Instance à stocker.
 *
 * Cette méthode permet de stocker une instance.
 **/	
	public static function Set($o){
		if($o instanceof self){
			self::$instance = $o;
			parent::Set($o);
			$_SESSION[__CLASS__] = serialize($o);
		}
	}
/**
 * MyEventBasket.Get() -> Instance
 * Cette méthode permet de récupérer une instance.
 **/	
	public static function Get(){
		
		if(!self::SessionExists()){
			self::Set(new self());
		}
		
		if(empty(self::$instance)){
			self::$instance = unserialize($_SESSION[__CLASS__]);
			parent::Set(self::$instance);
			
			self::GetProducts();
			
			if(self::Current()){
				$product =					MyEventCommandProduct::Product();
				
				self::$Amount = 			self::Current()->Price * self::Current()->Qte;
				self::$AmountDelivery = 	self::Current()->Cost_Delivery * self::Current()->Qte;
				self::$EcoTax =				self::Current()->Eco_Tax * self::Current()->Qte;
				
				self::$RealAmount = 		max(array(self::Current()->Price, $product->Price, $product->Standard_Price))  * self::Current()->Qte;
			}
		}
		
			
		return self::$instance;
	}
/**
 * MyEventBasket.Encode() -> String
 * Cette méthode retourne les infos du panier encodé.
 **/	
	public static function Encode(){
		$options = new stdClass();
		
		$options->Basket_ID = 	self::ID();
		$options->Statut =		self::Get()->Statut;
		$options->Products = 	self::GetProducts();
		
		return json_encode($options);
	}
/**
 * MyEventBasket.Next() -> MyEventCommandProduct | False
 * Cette méthode le prochaine élément du panier.
 **/	
	public static function Next(){
		$current = MyEventCommandProduct::Next();
		
		if($current){
			$product = MyEventCommandProduct::Product();
	
			self::$Amount += 			$current->Price * $current->Qte;
			self::$AmountDelivery += 	$current->Cost_Delivery * $current->Qte;
			self::$EcoTax +=			$current->Eco_Tax * $current->Qte;
			 
			self::$RealAmount += 		max(array($current->Price, $product->Price, $product->Standard_Price)) * $current->Qte;
		}
		
		return $current;
	}
/**
 * MyEventBasket.Prev() -> MyEventCommandProduct | False
 * Cette méthode l'élément précèdent du panier.
 **/	
	public static function Prev(){
		$current = MyEventCommandProduct::Prev();
		
		if($current){
			$product = MyEventCommandProduct::Product();
	
			self::$Amount -= 			$current->Price * $current->Qte;
			self::$AmountDelivery -= 	$current->Cost_Delivery * $current->Qte;
			self::$EcoTax -=			$current->Eco_Tax * $current->Qte;
			
			self::$RealAmount -= 		max(array($current->Price, $product->Price, $product->Standard_Price))  * $current->Qte;
		}
		return $current;
	}
/**
 * MyEventBasket.Current() -> MyEventCommandProduct | False
 * Cette méthode l'élément courrant du panier.
 **/	
	public static function Current(){
		return MyEventCommandProduct::Current();
	}
/**
 * MyEventBasket.Reset() -> MyEventCommandProduct | False
 * Remet le pointeur interne de tableau au début.
 **/	
	public static function Reset(){
		$current = MyEventCommandProduct::Reset();
		
		if($current){
			$product = MyEventCommandProduct::Product();
			
			self::$Amount = 			self::Current()->Price * self::Current()->Qte;
			self::$AmountDelivery = 	self::Current()->Cost_Delivery * self::Current()->Qte;
			self::$EcoTax =				self::Current()->Eco_Tax * self::Current()->Qte;
			
			self::$RealAmount = 		max(array(self::Current()->Price, $product->Price, $product->Standard_Price )) * self::Current()->Qte;
		}
		
		return $current;
	}
/**
 * MyEventBasket.Reset() -> MyEventCommandProduct | False
 * Positionne le pointeur de tableau en fin de tableau
 **/	
	public static function End(){
		return MyEventCommandProduct::End();
	}
/**
 * MyEventBasket.Picture() -> String
 * Cette méthode retourne la photo principale du produit en cours.
 **/	
	public static function Picture(){
		$product = MyEventCommandProduct::Product();
		return $product->Criteres->Pictures[0]['Value'];
	}
/**
 * MyEventBasket.ProductID() -> String
 * Cette méthode retourne l'id du produit en cours.
 **/	
	public static function ProductID(){
		return MyEventCommandProduct::ID();
	}
/**
 * MyEventBasket.Reference() -> String
 * Cette méthode retourne la référence du produit en cours.
 **/	
	public static function Reference(){
		return MyEventCommandProduct::Reference();
	}
/**
 * MyEventBasket.Price() -> String
 * Cette méthode retourne le prix du produit en cours.
 **/	
	public static function Price($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.CostDelivery() -> String
 * Cette méthode retourne le coût de livraison du produit en cours.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.EcoTax(dec_point, thousand_sep) -> String
 *
 * Cette méthode retourne l'éco taxe du produit.
 **/	
	static public function EcoTax($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Current()->Eco_Tax, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.TotalPrice() -> String
 * Cette méthode retourne le prix total du produit (Qte * PU).
 **/
	public static function TotalPrice($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::Qty() * self::Current()->Price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier sans les frais de livraison.
 **/	
	public static function Amount($dec_point = '.' , $thousands_sep = ','){		
		return number_format(self::$Amount, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier sans les frais de livraison.
 **/	
	public static function AmountTVA($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::$Amount - MyEvent::CalculateTVA(self::$Amount * 1), 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency();
	}
/**
 * MyEventBasket.AmountDelivery(dec_point, thousand_sep) -> String
 * Cette méthode retourne le coût total de la livraison.
 **/	
	public static function AmountDelivery($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::$AmountDelivery, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.AmountTotal(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier (Montant + Cout de livraison)
 **/	
	public static function AmountTotal($dec_point = '.' , $thousands_sep = ','){
		
		$tva = 		MyEvent::CalculateTVA(self::$Amount);
		$price = 	self::$Amount;
		
		if(MyEvent::ModeTVA() == MyEvent::TVA_USE){
			$price = $tva + $price;
		}
		
		return number_format($price + self::$AmountDelivery, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.EcoTaxTotal(dec_point, thousand_sep) -> String
 * Cette méthode retourne l'écotaxe total formaté.
 **/	
	public static function EcoTaxTotal($dec_point = '.' , $thousands_sep = ','){
		return number_format(self::$EcoTax, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.GetAmount() -> Float
 * Cette méthode retourne le prix total du panier non formaté et Hors taxe.
 **/	
	public static function GetAmount(){
		$products = self::GetProducts();
		
		$amount = 0;
		
		foreach($products as $product){
			$product = new MyEventCommandProduct($product);
			$amount += $product->Price * $product->Qte;	
		}
		
		return $amount;
	}
/**
 * MyEventBasket.GetCostDelivery() -> Float
 * Cette méthode retourne le cout de livraison cumulé des produits.
 **/	
	public static function GetCostDelivery(){
		$products = self::GetProducts();
		
		$amount = 0;
		
		foreach($products as $product){
			$product = new MyEventCommandProduct($product);
			$amount += $product->Cost_Delivery  * $product->Qte;	
		}
		
		return $amount;
	}
/**
 * MyEventBasket.GetEcoTax() -> Float
 * Cette méthode retourne l'eco taxe cumulé.
 **/	
	public static function GetEcoTax(){
		$products = self::GetProducts();
		
		$amount = 0;
		
		foreach($products as $product){
			$product = new MyEventCommandProduct($product);
			$amount += $product->Eco_Tax  * $product->Qte;	
		}
		
		return $amount;
	}
/**
 * MyEventBasket.AmountSaved(dec_point, thousand_sep) -> String
 * Cette méthode retourne le montant de l'économie réalisée en achetant dans la boutique.
 **/	
	public static function AmountSaved($dec_point = '.', $thousands_sep = ','){
		return number_format(self::$RealAmount - self::$Amount, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasket.Qty() -> Number
 * Cette méthode retourne le quantité demandée par le client du produit en cours.
 **/	
	public static function Qty(){
		return MyEventCommandProduct::Qty();
	}
	
	public static function Stock(){
		$product = MyEventCommandProduct::Product();
		
		if(!MyEvent::StockEnable()){
			return 100;
		}
		
		return $product->Stock;
	}
/**
 * MyEventBasket.DrawStepNavigation() -> Number
 * Cette méthode retourne le quantité demandée par le client du produit en cours.
 **/	
	public static function DrawStepNavigation(){
		?>
		<div class="myevent-basket-progress">
            <h3 class="<?php echo Post::Name() == 'panier' ? 'selected' : '' ?>"><span><?php echo MUI('Mon panier'); ?></span></h3>    
            <h3 class="<?php echo Post::Name() == 'panier/adresse-livraison' ? 'selected' : '' ?>"><span><?php echo MUI('Adresse de livraison'); ?></span></h3>    
            <h3 class="<?php echo Post::Name() == 'panier/options-livraison' ? 'selected' : '' ?>"><span><?php echo MUI('Options de livraison'); ?></span></h3>    
            <h3 class="<?php echo Post::Name() == 'panier/paiement' ? 'selected' : '' ?>"><span><?php echo MUI('Paiement'); ?></span></h3>    
            <h3 class="<?php echo Post::Name() == 'panier/confirmation' ? 'selected' : '' ?> last"><span><?php echo MUI('Confirmation'); ?></span></h3>
        </div>
        <?php
	}
	
	public static function Draw(){
		
		self::DrawStepNavigation();
		
		?>
        
        <form class="form formBasket" action="<?php echo self::PermalinkSubmit() ?>" method="post">
        
            <table class="form-table table-form table-basket myevent-basket">
            <thead>
                <tr>
                    <th class="col-remove">Supprimer</th>
                    <th class="col-picture">&nbsp;</th><!-- order-image col -->
                    <th class="col-description">&nbsp;</th><!-- item description col -->
                    <th class="col-qty">Qté</th>
                    <th class="col-price">Prix</th>
                    <th class="col-price-total">Sous-total</th>
                </tr>
            </thead>
            
            <tbody>
            
            <?php
               	    
                while(self::Current()):
                	
            ?>
                <tr data-action="<?php echo MyEventBasket::PermalinkAdd(MyEventBasket::ProductID()); ?>">
                    <td class="col-remove">
                        <a href="<?php echo MyEventBasket::PermalinkRemove(); ?>">
                            <img width="13" height="16" alt="Supprimer" src="<?php Blog::Info('template') ?>css/images/icon-bin.gif">
                        </a>
                    </td>
        
                    <td class="col-picture">
                        <img width="117" height="67" title="<?php echo MyEventBasket::Reference() ?>" alt="<?php echo MyEventBasket::Reference() ?>" src="<?php echo SystemCache::Push(array('Src' => MyEventBasket::Picture(), 'Width' => 117, 'Height'=> 67, 'ID' => basename(MyEventBasket::Picture()) . '-117-67')) ?>">
                    </td>
        
                    <td class="col-description">
                        <p><?php echo MyEventBasket::Reference() ?></p>
                        <?php
						
						?>
                        <p class="eco-tax"><?php echo MUI('dont éco-taxe') . ' ' . MyEventBasket::EcoTax(',', '.'); ?></p>
						<?php
						
						?>
                    </td>
                    
                    <td class="col-qty">
                    	<?php
							$stock = MyEventBasket::Stock();
						?>
                        <select class="box-select qty" name="MyEventProduct[<?php echo MyEventBasket::ProductID() ?>][Qte]">
                            <?php
								
								for($i = 1; $i <= $stock && $i < 100; $i++):
                            ?>
                                <option value="<?php echo $i ?>"<?php echo MyEventBasket::Qty() == $i ? ' selected=selected' : ''?>><?php echo $i ?></option>
                            <?php
                                endfor;
                            ?>
                        </select>
                    </td>
						
                    <td class="col-price">
                       	<?php echo MyEventBasket::Price(',', ' '); ?>
                    </td>
                    
                    <td class="col-price-total">
                        <?php echo MyEventBasket::TotalPrice(',', ' '); ?>
                    </td>
                </tr>
            <?php
					
               		MyEventBasket::Next();
				endwhile;
            ?>
            </tbody>
            <tfoot>
            	
                <tr class="row-basket-amount">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Sous-total') ?> <?php MyEvent::ModeTVA() == MyEvent::TVA_USE ? MUI('HT') : '' ?></td>
                    <td class="price amount"><?php echo MyEventBasket::Amount(',', ' ')?></td>
                </tr>
                
                <tr class="row-basket-eco-tax">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont éco-taxe') ?></td>
                    <td class="price eco-tax"><?php echo MyEventBasket::EcoTaxTotal(',', ' ')?></td>
                </tr>
                
                <?php
					switch(MyEvent::ModeTVA()){
						case MyEvent::TVA_PRINT:
						?>
				<tr class="row-basket-tva">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont TVA') . ' ' . MyEvent::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyEventBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;
						case MyEvent::TVA_USE:
							?>
				<tr class="row-basket-tva">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('TVA') . ' ' . MyEvent::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyEventBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;	
					}
				?>
                
                <?php
					if(MyEventBasket::AmountDelivery() != MyEvent::NullPrice()):
				?>
                
                <tr class="row-basket-amount-delivery">
                    <td class="info" colspan="4">* <?php echo MUI('Sur la base d\'une livraison standard'); ?></td>                                           
                    <td class="text">* <?php echo MUI('Coût de livraison standard'); ?></td>
                    <td class="price amount-delivery"><?php echo MyEventBasket::AmountDelivery(',', ' ')?></td>
                </tr>
                
                <?php
					endif;
				?>
                
                <tr class="row-basket-amount-total">    
                    <td colspan="2">&nbsp;</td>    
                    <td class="text" colspan="3"><?php echo MUI('Total') ?> <?php MyEvent::ModeTVA() == MyEvent::TVA_USE ? MUI('TTC') : '' ?></td>
                    <td class="price amount-total"><?php echo MyEventBasket::AmountTotal(',', ' ')?></td>
                </tr>
                <?php
					if(MyEventBasket::AmountSaved() != MyEvent::NullPrice()):
				?>
                <tr class="row-basket-amount-save">
                    <td colspan="2">&nbsp;</td>
                    <td class="text" colspan="3"><?php echo MUI('Économies réalisées sur le prix boutique'); ?></td>
                    <td class="price amount-saved"><?php echo MyEventBasket::AmountSaved(',', ' ')?></td>
                </tr>
                <?php
					endif;
				?>
            </tfoot>
            </table>
            
            <div class="myevent-basket-actions">
           		<span class="box-simple-button button-continue"><a href="<?php Blog::Info('page:produits'); ?>">&laquo; <?php echo MUI('Continuer mes achats') ?></a></span>
             	<span class="button submit button-valid-basket"><input type="submit" value="<?php echo MUI('Valider ma commande'); ?>" /></span>
            </div>
            <?php
				
			?>
            
        </form>	
    	<?php
		
		MyEventBasket::Reset();
	}
}

MyEventBasket::Initialize();
?>