<?php
/** section: MyStore
 * class MyStoreBasketOptionPayment < MyStoreBasket
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
class MyStoreBasketOptionPayment extends MyStoreBasket{
/**
 * MyStoreBasketAddress.Initialize() -> void
 **/	
	public static function Initialize(){
		System::Observe('blog:startpage', array(__CLASS__, 'onStartPage'));	
	}
/**
 * MyStoreBasketAddress.onStartPage() -> void
 **/	
	public static function onStartPage(){
		
		if(Post::Name() == 'panier/paiement'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
		
		if(Post::Name() == 'panier/confirmation'){
			
			ob_start();
			
			self::DrawConfirmation();
			
			Post::Content(ob_get_clean());
		}
		
		if(Post::Name() == 'panier/annulation'){
			
			ob_start();
			
			self::DrawCancel();
			
			Post::Content(ob_get_clean());
		}
	}
	
	public static function Get(){
		$options = new stdClass();
		
		self::CalculAmount();
		
		$options->Amount = 	parent::Get()->Amount_HT;
		$options->Type =	empty($company) ? 'professional' : 'private';
		
		return MyWallet\Card::GetList($options, $options);	
	}
	
	public static function Have(){
		$result = self::Get();
		return $result['length'] > 0;
	}
/**
 * MyStoreBasketOptionPayment.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function Draw(){
				
		self::DrawStepNavigation();
		
		?>
        <form class="form formBasket" action="<?php echo self::PermalinkSubmitOption() ?>" method="post">
        	<h1><?php echo MUI('Choisissez le mode paiement') ?></h1>
            
            <div class="mystore-option-payment">
            
            	<?php
					$list = self::Get();
					
					if($list === false){
						die(Sql::Current()->getError());	
					}
					
					if(MyWallet\Card::Have()):
						
						
						//if(MyWalletCard::Single()):
						?>
						
                        <?php
						//else:
							
							while(MyWallet\Card::Current()):
							
								$picture = MyWallet\Card::Picture();
					?>
                     
						<div class="box-option-payment<?php echo empty($picture) ? '' : ' icon'; ?>" data-cardid="<?php echo MyWallet\Card::ID() ?>" data-external="<?php echo json_encode(MyWallet\Card::External()); ?>">
                                                        
                            <?php 
								
								if(!empty($picture)):
								
									$picture = SystemCache::Push(array(
													'Src' => 		$picture,
													'Width' => 		128, 
													'Height' => 	128, 
													'ID' => 		basename($picture . '-128')
												));
							?>
                            
                            <div class="wrap-picture">
                            	<img class="picture" src="<?php echo $picture; ?>">
           						<div class="picture" style="background-image:url(<?php echo $picture; ?>)"></div> 
                            </div>
                            <?php
									
								endif;
							?>
                            
                            <div class="wrap-content">
                                <p class="wrap-name"><?php echo MUI('Payer via') ?> <?php echo MUI(MyWallet\Card::Name()); ?></p>
                            </div>
                            
                            <div class="wrap-hidden-form" style="display:none">
                            <?php
								if(!MyWallet\Card::External()){
									MyWallet\Card::Form();	
								}
							?>
                            </div>
                        </div>
                        
					<?php
								
								MyWallet\Card::Next();
														
							endwhile;
							
							MyWallet\Card::Reset();
							
						//endif;
					else:
						
					?>
                    	<h2>Il n'y aucun moyen de paiement disponible pour votre achat</h2>
                        <p>Veuillez-nous excuser pour la gène occasionnée, nous nous efforçons de trouver une solution à votre problème le plus rapidement possible.</p>
                    <?php
					endif;
					
					
				?>
            	<div class="clear clearer"></div>
                
            </div>
                        
            <?php
				
			?>
            
        </form>	
    	<?php
		
	}
/**
 * MyStoreBasketOptionPayment.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function DrawConfirmation(){
		
		self::DrawStepNavigation();
		echo Post::Content();
		?>
        <div class="mystore-basket-actions">
            <span class="box-simple-button submit"><a href="<?php Blog::Info('uri'); ?>">&laquo; <?php echo MUI('Retour à la page d\'accueil') ?></a></span>
        </div>
        <?php
		
	}
/**
 * MyStoreBasketOptionPayment.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function DrawCancel(){
		
		self::DrawStepNavigation();
		echo Post::Content();
		?>
        <div class="mystore-basket-actions">
            <span class="box-simple-button submit"><a href="<?php Blog::Info('page:panier'); ?>">&laquo; <?php echo MUI('Retourner au panier') ?></a></span>
            <span class="box-simple-button"><a href="<?php MyStore::Info('basket.clear'); ?>"><?php echo MUI('Annuler ma commande'); ?></a></span>
        </div>
        <?php
	}
}

MyStoreBasketOptionPayment::Initialize();
?>