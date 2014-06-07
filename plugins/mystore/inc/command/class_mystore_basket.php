<?php
/** section: MyStore
 * class MyStoreCommand
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table MyStoreCommand.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_command.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreBasket extends MyStoreCommand{	
	const OK =							0;
	
	const ERROR_NULL_PRODUCT = 			1;
	
	const ERROR_NO_STOCK = 				2;
	
	protected static $RealAmount =			0;
/**
 * MyStoreBasket.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('blog:start', array(__CLASS__, 'onStart')); 
		System::Observe('blog:startpage', array(__CLASS__, 'onStartPage')); 
	}
			
	public static function eDie($msg, $errorCode = ''){
		$options = new stdClass();
		$options->parameters = Permalink::Get()->getParameters();
		$options->error = $msg;
		
		if(!empty($errorCode)){
			$options->errorCode = $errorCode;
		}
		
		die(json_encode($options));	
	}
/**
 * MyStoreBasket.Clear() -> void
 * Cette méthode supprime le panier.
 **/	
	public static function Clear(){
		
		if(self::SessionExists()){
			if(self::Get()->Statut == 'created'){
				$request = 			new Request(DB_NAME);
				
				$request->from = 	MyStoreCommandProduct::TABLE_NAME;
				$request->where = 	"`".self::PRIMARY_KEY."` = '".self::Get()->Command_ID."' ";				
				
				$o = new self();
				$o->Command_ID = self::Get()->Command_ID;
				$o->commit();
				self::Set($o);
				
				return $request->exec('delete');
			}
		}
		
		$_SESSION[__CLASS__] = NULL;
	}
/**	
 * MyStoreBasket.SessionExists() -> Boolean
 *
 * Cette méthode vérifie que l'instance panier existe en Session.
 **/
	private static function SessionExists(){
		return !empty($_SESSION[__CLASS__]);
	}
/**
 * MyStoreBasket.Set(instance) -> void
 * - instance (Instance): Instance à stocker.
 *
 * Cette méthode permet de stocker une instance.
 **/	
	public static function Set(&$o){
		if($o instanceof self){
			parent::Set($o);
			$_SESSION[__CLASS__] = $o->Command_ID;
		}
	}
/**
 * MyStoreBasket.Get() -> Instance
 * Cette méthode permet de récupérer une instance.
 **/	
	public static function Get(){
		
		if(!self::SessionExists()){//le panier n'a pas encore été créé
			$o = new self();
			$o->commit();
			self::Set($o);
		}
			
		$instance = parent::Get();	
			
		if(empty($instance)){
			parent::Set(new self((int) $_SESSION[__CLASS__])); //récupération des infos du panier
		}
		
			
		return parent::Get();
	}
/**
 * MyStoreBasket.onStart() -> void
 *
 * Cette méthode est lancée avant le chargement d'une page. 
 * Via cette méthode vous pouvez stopper le processus de chargement d'une page en fonction de son Permalien et charger une autre page de votre choix.
 **/	
	public static function onStart(){
		
		//
		// #PHASE 1 : Analyse du permalien
		//
		//on récupère le permalien qui nous sert de paramètre pour la génération d'un post.
		$link = Permalink::Get();
			
		//on analyse la chaine
		
		if($link->match('/panier/')){
			Blog::EnqueueScript('mystore.basket', MYSTORE_URI.'inc/command/class_basket.js');
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
				
				if(!empty($_POST['MyStoreProduct'])){
					
					foreach($_POST['MyStoreProduct'] as $key => $value){
						$key = explode('/', $key);
						self::Push($key[0], $value['Qte'], $key[1]);	
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
					if(MyStoreBasketOptionDelivery::Have()){// si il y avait des options, le client doit en choisir une
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
				MyWallet\Card::Set((int) $parameters[4]);
				
				$basket = 	self::Get();
				
				//création de la description + montant et reference
				MyWallet\Card::Amount($basket->Amount_TTC);
				MyWallet\Card::Currency(MyStore::CurrencyCode());				
				MyWallet\Card::Description(MUI('Achat de produit d\'un montant de') . ' ' . number_format($basket->Amount_TTC, '2', ',', ' ') . ' ' . MyStore::CurrencyCode());
				
				//Ajout de liste détaillé des produits si supporté
				
				$options = new stdClass();
				$options->Command_ID = 	$basket->Command_ID;
				$options->op = 			'-info';
				
				$products =	MyStoreCommandProduct::GetList('', $options);
				
				//MyWallet\Card::Details($products);
				
				MyWallet\Card::Reference($basket->Command_ID);
				//Gestion des événements
				MyWallet\Card::Observe('success', array(__CLASS__, 'onSuccessPayment'));
				MyWallet\Card::Observe('cancel', array(__CLASS__, 'onCancelPayment'));
				MyWallet\Card::Observe('error', array(__CLASS__, 'onErrorPayment'));
				
				//Demande d'authorisation
				
				$result = MyWallet\Card::Authorization();
				
				if($result){
					//sauvegarde des information de la transaction
					
					$basket->Statut = 				'authorized';
					$basket->Wallet_Card_ID = 		MyWallet\Card::ID();
					$basket->Transaction_Object = 	json_encode(MyWallet\Card::Transaction());
					
					$basket->commit();
					
					if(MyWallet\Card::External()){
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
		
		if($link->match('/basket\/(action|api)\/restore-cmd/')){
			$parameters = $link->getParameters();
			
			if(count($parameters) < 5){
				header('Location:' . Blog::GetInfo('page:panier'));
				exit();
			}
			//
			// Connexion de l'utlisateur
			//
			if(!User::ConnectByPassKey($parameters[4])){
				header('Location:' . Blog::GetInfo('page:panier'));
				exit();
			}
			
			//
			// Restoration de la commande
			//
			if(!is_numeric($parameters[3])){
				header('Location:' . Blog::GetInfo('page:panier'));
				exit();
			}
			
			$cmd = new self((int) $parameters[3]);
			
			self::Set($cmd);
			
			header('Location:' . Blog::GetInfo('page:panier'));
			exit();
		}
		
		if($link->match('/basket\/(action|api)/')){
			//
			// #PHASE 2 : Sécurisation du permalien
			//
			
			//le lien correspond à l'ouverture d'un module. $link => http://host.fr/panier/api/ACTION/PRODUCT_ID/QTE[/DECLINAISON_ID]
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
			
			$product = new MyStoreProduct((int) $product);
			
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
			$qte = 			empty($parameters[4]) || !is_numeric($parameters[4]) ? 1 : ($parameters[4] * 1);
			$declinaison = 	empty($parameters[5]) || !is_numeric($parameters[5]) ? 0 : ($parameters[5] * 1);
			
			switch(@$parameters[2]){
									
				case 'set':
					
					switch(self::Push($product, $qte, $declinaison)){
						case self::OK:
							$result = self::GetCommandProduct($product->Post_ID, $declinaison);
							
							if($parameters[1] == 'api'){
								echo json_encode($result);
							
								exit();
							}
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
					
					self::Remove($product, $declinaison);
					
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
 * iPage.onStart() -> void
 *
 * Cette méthode est lancée pendant le chargement de la page. Il est possible d'afficher du contenu complémentaire dans cette page.
 **/
	public static function onStartPage(){
		
		if(Post::Name() == 'panier'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
		
	}
/**	
 * MyStoreBasket#commit() -> Boolean
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
 * MyStoreBasket.OnSuccesPayment() -> String
 * Cette méthode est appelée lorsque le paiement est un succès.
 **/	
	public static function OnSuccessPayment(){
		//le paiement est déjà récupéré par MyWallet. On enregistre les informations retournées par le mode de paiement choisi
		
		//récupération de la référence		
		$basket = new self((int) MyWallet\Card::Reference());
		
		if($basket->paid()){
			
			self::Clear();
						
			header('Location:' .  Blog::GetInfo('page:panier/confirmation'));
			exit();
		}
		
	}
/**
 * MyStoreBasket.OnSuccesPayment() -> String
 * Cette méthode est appelée lorsque le paiement est un succès.
 **/	
	public static function OnCancelPayment(){
		
		$ref = MyWallet\Card::Reference();
		
		$basket = new self((int) $ref);
		
		if($basket->cancel()){
			header('Location:' .  Blog::GetInfo('page:panier/annulation'));
			exit();
		}
	}
/**
 * MyStoreBasket.OnErrorPayment() -> String
 * Cette méthode est appelée lorsque le paiement est un succès.
 **/	
	public static function OnErrorPayment(){
		//le paiement est déjà récupéré par MyWallet. On enregistre les informations retournées par le mode de paiement choisi
		
		//récupération de la référence
		$ref = MyWallet\Card::Reference();
		
		$basket = new self((int) $ref);
						
		if($basket->error()){
			header('Location:' .  Blog::GetInfo('page:panier/erreur'));
			exit();
		}
		
	}
/**
 * MyStoreBasket.PermalinkAdd([api]) -> String
 * Cette méthode retourne le lien permettant de supprimer le produit du panier.
 **/	
	public static function PermalinkAdd($api = false){		
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/set/';  
	}
/**
 * MyStoreBasket.PermalinkRemove([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de supprimer le produit du panier.
 **/
	public static function PermalinkRemove($post = 0, $api = false){
		
		if(empty($post)){
			$post = MyStoreCommandProduct::ID();
		}
		
		return Blog::GetInfo('uri') . 'basket/' . ( $api ? 'api' : 'action') . '/remove/' . $post. '/'; 
	}
/**
 * MyStoreBasket.PermalinkClear() -> String
 * Cette méthode retourne le lien permettant de vider le panier.
 **/	
	public static function PermalinkClear(){
		return Blog::GetInfo('uri') . 'basket/action/clear'; 
	}
/**
 * MyStoreBasket.PermalinkSubmit([api]) -> String
 * Cette méthode retourne le lien permettant de valider le panier et de passer l'étape suivante.
 **/	
	public static function PermalinkSubmit($api = false){
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/submit';  
	}
/**
 * MyStoreBasket.PermalinkSubmitAddress([api]) -> String
 * Cette méthode retourne le lien permettant de valider le panier et de passer l'étape suivante.
 **/	
	public static function PermalinkSubmitAddress($api = false){
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/address/submit';  
	}
/**
 * MyStoreBasket.PermalinkSubmitOption([postid [, api]]) -> String
 * Cette méthode retourne le lien permettant de valider le panier et de passer l'étape suivante.
 **/	
	public static function PermalinkSubmitOption($post = 0, $api = false){
		
		if(empty($post)){
			$post = MyStoreProduct::ID();
		}
		
		return Blog::GetInfo('uri').'basket/' . ( $api ? 'api' : 'action') . '/options/submit';  
	}

/**
 * MyStoreBasket.GetCommandProduct(product[, qte [, declinaison]]) -> 
 * - product (MyStoreProduct): Produit à ajouter au panier.
 * - declinaison (Number): Numéro de la déclinaison du produit.
 *
 * Cette méthode retourne un produit.
 **/	
	public static function GetCommandProduct($product, $declinaison){
		$basket = 	self::Get();
		$products = self::GetProducts();
		
		for($i = 0, $len = isset($products['length']) ? $products['length'] : count($products); $i < $len; $i++){
			
			$current = new MyStoreCommandProduct($products[$i]);
			
			if($current->Post_ID * 1 == $product * 1 && $current->Declinaison_ID == $declinaison){
				return $current;	
			}
		}
		
		return false;
	}
/**
 * MyStoreBasket.Push(product[, qte [, declinaison]]) -> 
 * - product (MyStoreProduct): Produit à ajouter au panier.
 * - qte (Number): Nombre produit.
 * - declinaison (Number): Numéro de la déclinaison du produit.
 *
 * Cette méthode permet de stocker une instance.
 **/
 	public static function Push($product, $qte = 1, $declinaison = 0){
		
		if(is_numeric($product)){
			$product = new MyStoreProduct((int) $product);
		}
		
		if($product->Post_ID == 0){
			return self::ERROR_NULL_PRODUCT;
		}
		
		if(empty($declinaison) && $product->countDeclinations()){
			$declinaison = $product->getDefaultDeclinationID();
		}
		
		//on sauvegarde l'instance en base dès qu'il y a un ajout de produit au panier pour le décompte du stock des produits
		// pour l'ensemble des visiteurs.

		if(!self::Get()->commit()){
			die(Sql::Current()->getRequest() .' '.Sql::Current()->getError());	
		}
		
		//et on ajoute la nouvelle quantité si possible.
		$basket = 	self::Get();
		$products = self::GetProducts();
		
		for($i = 0, $len = empty($products['length']) ? count($products) : $products['length']; $i < $len; $i++){
			
			$current = new MyStoreCommandProduct($products[$i]);
			
			
			if($current->Post_ID == $product->Post_ID && $current->Declinaison_ID == $declinaison){// le produit est déjà dans la liste
				
				if(MyStore::StockEnable()){
					
					if($declinaison == 0){
						
						if($product->getStock() >= $qte){
							$current->Qte = (int) $qte;
							$current->commit();
						}else{
							return self::ERROR_NO_STOCK;	
						}
						
					}else{//gestion par déclinaison de produit
												
						if($product->getDeclinationStock($declinaison) >= $qte){
							$current->Qte = (int) $qte;
							$current->commit();
						}else{
							return self::ERROR_NO_STOCK;	
						}
					}
					
				}else{
					$current->Qte = (int) $qte;
					$current->commit();
				}
								
				break;	
			}	
		}
		
		//Ajout du nouveau produit au panier.
		if($i >= $len){
			
			if(MyStore::StockEnable()){
				
				if($declinaison == 0){
						
					if($product->getStock() >= $qte){
						$o = 					new MyStoreCommandProduct($product);
				
						$o->Qte =				(int) $qte;
						$o->Command_ID = 		self::ID();
						$o->commit();
						
						//self::GetProducts();
						
					}else{
						return self::ERROR_NO_STOCK;	
					}
					
				}else{//gestion par déclinaison de produit
										
					if($product->getDeclinationStock($declinaison) >= $qte){
						$o = 					new MyStoreCommandProduct($product);
				
						$o->Qte =				(int) $qte;
						$o->Declinaison_ID = 	$declinaison;
						$o->Command_ID = 		self::ID();
												
						if(!$o->commit()){
							die(Sql::Current()->getError());	
						}
						
						self::GetProducts();
					}else{
						return self::ERROR_NO_STOCK;	
					}
				}
				
			}else{
				$o = 					new MyStoreCommandProduct($product);
				
				$o->Qte =				(int) $qte;
				$o->Declinaison_ID = 	$declinaison;
				$o->Command_ID = 		self::ID();
				
				if(!$o->commit()){
					die(Sql::Current()->getError());	
				}
				
				//self::GetProducts();
			}
			
		}
		
		//var_dump($basket);
		//self::Set($basket);
		
		return 0;
	}
/**
 * MyStoreBasket.Remove(product, qte) -> void
 * - product (MyStoreProduct): Produit à ajouter au panier.
 * - qte (Number): Nombre produit.
 *
 * Cette méthode permet de stocker une instance.
 **/	
	public static function Remove($product, $declinaison = 0){
		if(is_numeric($product)){
			$product = new MyStoreProduct((int) $product);
		}
		
		if($product->Post_ID == 0){
			return self::ERROR_NULL_PRODUCT;
		}
		
		if(empty($declinaison) && $product->countDeclinations()){
			$declinaison = $product->getDefaultDeclinationID();
		}
		
		//on sauvegarde l'instance en base dès qu'il y a un ajout de produit au panier pour le décompte du stock des produits
		// pour l'ensemble des visiteurs.
		
		self::Get()->commit();		
		
		//et on supprime la référence.
		$basket = self::Get();
		$current = 					new MyStoreCommandProduct();
		$current->Command_ID = 		$basket->Command_ID;
		$current->Post_ID = 		$product->Post_ID;
		$current->Declinaison_ID = 	(int) $declinaison;
		
		if(!$current->delete()){
			die(Sql::Current()->getRequest() . ' ' . 	Sql::Current()->getError());
		}
				
		//self::GetProducts();		
		self::Set($basket);
							
		return 0;
	}
/**
 * MyStoreBasket.SetAddressDelivery(id) -> Boolean
 * - id (Number): Identifiant de l'adresse de livraison.
 *
 * Cette méthode assigne une adresse de livraison.
 **/
	public static function SetAddressDelivery($id){
		$basket = self::Get();
		
		$basket->Address_Delivery = json_encode(new MyStoreAccountAddress($id));
		
		if($basket->commit()){
			self::Set($basket);
			return true;
		}
		
		return false;
	}
/**
 * MyStoreBasket.SetAddressBilling(id) -> Boolean
 * - id (Number): Identifiant de l'adresse de livraison.
 *
 * Cette méthode assigne une adresse de facturation.
 **/
	public static function SetAddressBilling($id){
		$basket = self::Get();
		
		$basket->Address_Billing = json_encode(new MyStoreAccountAddress($id));
		
		if($basket->commit()){
			self::Set($basket);
			return true;
		}
		
		return false;
	}
/**
 * MyStoreBasket.SetOptionDelivery(id) -> Boolean
 * - id (Number): Identifiant de l'adresse de livraison.
 *
 * Cette méthode assigne une adresse de facturation.
 **/	
	public static function SetOptionDelivery($id = 0){
		
		self::CalculAmount();
		
		$basket = 	self::Get();
		
		//
		// Calcul du cout de livraison
		//
		$cost = 	$basket->Cost_Delivery;
		
		if(!empty($id)){
			$option = new MyStoreOptionDelivery((int) $id);
			
			if($option->getMode() == MyStoreOptionDelivery::ADD){
				$cost += $option->Cost_Delivery;	
			}else{
				$cost = $option->Cost_Delivery;
			}
			
			$basket->In_Store = $option->inStore() ? 1 : 0;
			
		}
				
		$basket->Cost_Delivery = 	$cost;
		//
		// Montant TTC
		//
		$basket->TVA =				MyStore::TVA();
		$basket->Amount_TTC = 		$basket->Amount_HT;
		$basket->Mode_Delivery =	$option->Name;
			
		switch(MyStore::ModeTVA()){
			case MyStore::TVA_DISABLED:
				break;
			case MyStore::TVA_USE:		//calcul classique, les prix sont HT on calcul le montant TTC
				$basket->Amount_TTC = 	$basket->Amount_HT + ($basket->Amount_HT * MyStore::TVA() / 100);
				break;
			case MyStore::TVA_PRINT:	//calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$basket->Amount_HT = 	$basket->Amount_TTC / ((MyStore::TVA() / 100) + 1);
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
 * MyStoreBasket.ID() -> Number
 * Cette méthode retourne l'ID du panier.
 **/	
	public static function ID(){
		return self::Get()->Command_ID;	
	}
/**
 * MyStoreBasket.Count() -> Number
 * Cette méthode retourne le nombre de référence dans le panier.
 **/	
	public static function Count($clauses = '', $options = ''){
		return self::Get()->countProducts();
	}
/**
 * MyStoreBasket.Encode() -> String
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
 * MyStoreBasket.Next() -> MyStoreCommandProduct | False
 * Cette méthode le prochaine élément du panier.
 **/	
	public static function Next(){
		return MyStoreCommandProduct::Next();
	}
/**
 * MyStoreBasket.Prev() -> MyStoreCommandProduct | False
 * Cette méthode l'élément précèdent du panier.
 **/	
	public static function Prev(){
		return MyStoreCommandProduct::Prev();
	}
/**
 * MyStoreBasket.Current() -> MyStoreCommandProduct | False
 * Cette méthode l'élément courrant du panier.
 **/	
	public static function Current(){
		return MyStoreCommandProduct::Current();
	}
/**
 * MyStoreBasket.Reset() -> MyStoreCommandProduct | False
 * Remet le pointeur interne de tableau au début.
 **/	
	public static function Reset(){
		return MyStoreCommandProduct::Reset();
	}
/**
 * MyStoreBasket.Reset() -> MyStoreCommandProduct | False
 * Positionne le pointeur de tableau en fin de tableau
 **/	
	public static function End(){
		return MyStoreCommandProduct::End();
	}
/**
 * MyStoreBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier sans les frais de livraison.
 **/	
	public static function AmountHT($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){		
		return number_format(self::Get()->Amount_HT, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreBasket.Amount(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier sans les frais de livraison.
 **/	
	public static function AmountTVA($dec_point = '.', $thousands_sep = ',', $formatCurrency = 'normal'){
		
		$price = self::Get()->Amount_HT;
		
		switch(MyStore::ModeTVA()){
			
			case MyStore::TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				$price = 	(($price * MyStore::TVA()) / 100);
				break;
			case MyStore::TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$price = 	$price - ($price / ((MyStore::TVA() / 100) + 1));
				break;
		}
		
		return number_format($price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency();
	}
/**
 * MyStoreBasket.CostDelivery(dec_point, thousand_sep) -> String
 * Cette méthode retourne le coût total de la livraison.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){
		return number_format(self::Get()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreBasket.AmountTotal(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier (Montant + Cout de livraison)
 **/	
	public static function AmountTotal($dec_point = '.' , $thousands_sep = ',', $formatCurrency = 'normal'){
		
		$price = self::Get()->Amount_HT;
		
		switch(MyStore::ModeTVA()){
			
			case MyStore::TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				$price = 	$price + (($price * MyStore::TVA()) / 100);
				break;
			case MyStore::TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$price = 	$price / ((MyStore::TVA() / 100) + 1);
				break;
		}
		
		return number_format($price + self::Get()->Cost_Delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreCommand.GetProducts() -> Array<MyStoreCommandProduct>
 * Cette méthode retourne les éléments du panier.
 **/	
	public static function GetProducts($id = 0){
		
		$list = MyStoreCommandProduct::Get();
		
		if(empty($list)){
			$options = new stdClass();
			$options->Command_ID = self::Get()->Command_ID;
		
			MyStoreCommandProduct::GetList($options, $options);
		}
		
		return MyStoreCommandProduct::Get();
	}
/*
 *
 **/	
	public static function CalculAmount(){
		$basket = 		self::Get();
		$products = 	self::GetProducts();
		
		$basket->Amount_HT = 		0;
		$basket->Eco_Tax = 			0;
		$basket->Cost_Delivery = 	0;
		self::$RealAmount =			0;
		
		foreach($products as $product){
			
			$product = 	new MyStoreCommandProduct($product);
			$o = 		new MyStoreProduct((int) self::Current()->Post_ID);
			
			$basket->Amount_HT += 		$product->Price * $product->Qte;
			$basket->Eco_Tax += 		$product->Eco_Tax  * $product->Qte;	
			$basket->Cost_Delivery += 	$product->Cost_Delivery  * $product->Qte;	
			
			self::$RealAmount += 		max(array($product->Price, $o->Price, $o->Standard_Price)) * $product->Qte;
		}	
		
		self::Set($basket);
	}
/**
 * MyStoreBasket.AmountSaved(dec_point, thousand_sep) -> String
 * Cette méthode retourne le montant de l'économie réalisée en achetant dans la boutique.
 **/	
	public static function AmountSaved($dec_point = '.', $thousands_sep = ',', $formatCurrency = 'normal'){
		return number_format(self::$RealAmount - self::Get()->Amount_HT, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreBasket.DrawStepNavigation() -> Number
 * Cette méthode retourne le quantité demandée par le client du produit en cours.
 **/	
	public static function DrawStepNavigation(){
		?>
		<div class="mystore-basket-progress">
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
        
            <table class="form-table table-form table-basket mystore-basket">
            <thead>
                <tr>
                    <th class="col-remove"><?php
						if(self::Get()->Statut != 'created manually'):
					?><span>Supprimer</span><?php
						endif;
					?></th>
                    <th class="col-picture">&nbsp;</th><!-- order-image col -->
                    <th class="col-description">&nbsp;</th><!-- item description col -->
                    <th class="col-qty">Qté</th>
                    <th class="col-price">Prix</th>
                    <th class="col-price-total">Sous-total</th>
                </tr>
            </thead>
            
            <tbody>
            
            <?php
               	    
				self::GetProducts();
				
                while(self::Current()):	
            ?>
                <tr data-action="<?php echo MyStoreBasket::PermalinkAdd(); ?>" data-id="<?php echo MyStoreCommandProduct::ID(); ?>">
                    
                    <td class="col-remove">
                    <?php
						if(self::Get()->Statut != 'created manually'):
					?>	
                        <a href="<?php echo MyStoreBasket::PermalinkRemove(); ?>" class="btn-remove">
                            <img width="13" height="16" alt="Supprimer" src="<?php Blog::Info('template') ?>css/images/icon-bin.gif">
                        </a>
                    <?php
						endif;
					?>    
                   	</td>
       				
                    <td class="col-picture">
                    	
                    	<?php 
							$link = MyStoreCommandProduct::Picture();
							
							if(!empty($link)){
								$picture = SystemCache::Push(array(
									'Src' => $link, 
									'Width' => 117, 
									'Height'=> 67, 
									'ID' => basename($link) . '-117-67'));
							}else{
								$picture = Blog::GetInfo('template').'css/icons/no-picture.png';
							}
						?>
                        
                    	<div class="wrap-picture" style="background-image:url(<?php echo $picture ?>)">
                        	<img height="67" title="<?php echo MyStoreCommandProduct::Reference() ?>" alt="<?php echo MyStoreCommandProduct::Reference() ?>" src="<?php echo $picture ?>">
                        </div>
                    </td>
        
                    <td class="col-description">
                        <p class="description"><?php echo MyStoreCommandProduct::Reference() ?></p>
                        <p class="eco-tax"><?php echo MUI('dont éco-taxe') . ' ' . MyStoreCommandProduct::EcoTax(',', '.'); ?></p>
                    </td>
                    
                    <td class="col-qty">
                    	<?php
							if(self::Get()->Statut == 'created manually'):
						?>
                    		
                           <input type="hidden" name="MyStoreProduct[<?php echo MyStoreCommandProduct::ID() ?>][Qte]" value="<?php echo MyStoreCommandProduct::Qty() ?>">
                           <?php echo MyStoreCommandProduct::Qty(); ?>
                    	<?php
							else:
							$stock = MyStoreCommandProduct::Stock();
						?>
                        <select class="box-select qty" name="MyStoreProduct[<?php echo MyStoreCommandProduct::ID() ?>][Qte]">
                            <?php
								
								for($i = 1; $i <= $stock && $i < 100; $i++):
                            ?>
                                <option value="<?php echo $i ?>"<?php echo MyStoreCommandProduct::Qty() == $i ? ' selected=selected' : ''?>><?php echo $i ?></option>
                            <?php
                                endfor;
                            ?>
                        </select>
                        <?php
							endif;
						?>
                    </td>
						
                    <td class="col-price">
                       	<?php echo MyStoreCommandProduct::Price(',', ' '); ?>
                    </td>
                    
                    <td class="col-price-total">
                        <?php echo MyStoreCommandProduct::Amount(',', ' '); ?>
                    </td>
                </tr>
            <?php
					
               		MyStoreBasket::Next();
				endwhile;
				
				self::CalculAmount();
            ?>
            </tbody>
            
            <tfoot>
            	
                <tr class="row-basket-amount">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Sous-total') ?> <?php echo MyStore::ModeTVA() != MyStore::TVA_DISABLED ? MUI('HT') : '' ?></td>
                    <td class="price amount"><?php echo MyStoreBasket::AmountHT(',', ' ')?></td>
                </tr>
                
                <tr class="row-basket-eco-tax">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont éco-taxe') ?></td>
                    <td class="price eco-tax"><?php echo MyStoreBasket::EcoTax(',', ' ')?></td>
                </tr>
                
                <?php
					switch(MyStore::ModeTVA()){
						case MyStore::TVA_PRINT:
						case MyStore::TVA_USE:
							?>
				<tr class="row-basket-tva">
                    <td colspan="2">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('TVA') . ' ' . MyStore::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyStoreBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;	
					}
				?>
                
                <?php
					if(MyStoreBasket::CostDelivery() != MyStore::NullPrice()):
				?>
                
                <tr class="row-basket-amount-delivery">
                    <td class="info" colspan="4">* <?php echo MUI('Sur la base d\'une livraison standard'); ?></td>                                           
                    <td class="text">* <?php echo MUI('Coût de livraison standard'); ?></td>
                    <td class="price amount-delivery"><?php echo MyStoreBasket::CostDelivery(',', ' ')?></td>
                </tr>
                
                <?php
					endif;
				?>
                
                <tr class="row-basket-amount-total">    
                    <td colspan="2">&nbsp;</td>    
                    <td class="text" colspan="3"><?php echo MUI('Total') ?> <?php echo MyStore::ModeTVA() != MyStore::TVA_DISABLED ? MUI('TTC') : '' ?></td>
                    <td class="price amount-total"><?php echo MyStoreBasket::AmountTotal(',', ' ')?></td>
                </tr>
                <?php
					if(MyStoreBasket::AmountSaved() != MyStore::NullPrice()):
				?>
                <tr class="row-basket-amount-save">
                    <td colspan="2">&nbsp;</td>
                    <td class="text" colspan="3"><?php echo MUI('Économies réalisées sur le prix boutique'); ?></td>
                    <td class="price amount-saved"><?php echo MyStoreBasket::AmountSaved(',', ' ')?></td>
                </tr>
                <?php
					endif;
				?>
            </tfoot>
            </table>
            
            <div class="mystore-basket-actions">
           		<span class="box-simple-button button-continue"><a href="<?php Blog::Info('page:produits'); ?>">&laquo; <?php echo MUI('Continuer mes achats') ?></a></span>
             	<span class="button submit button-valid-basket"><input type="submit" value="<?php echo MUI('Valider ma commande'); ?>" /></span>
            </div>
            <div class="clearfloat"></div>
            <?php
				
			?>
            
        </form>	
    	<?php
		
		MyStoreBasket::Reset();
	}
	
	
}

MyStoreBasket::Initialize();
?>