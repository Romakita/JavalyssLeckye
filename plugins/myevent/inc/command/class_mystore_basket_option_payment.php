<?php
/** section: MyEvent
 * class MyEventBasketOptionPayment < MyEventBasket
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
class MyEventBasketOptionPayment extends MyEventBasket{
/**
 * MyEventBasketAddress.Initialize() -> void
 **/	
	public static function Initialize(){
		System::Observe('blog:startpage', array(__CLASS__, 'onStartPage'));	
	}
/**
 * MyEventBasketAddress.onStartPage() -> void
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
		$options->Amount = 	self::GetAmount();
		$options->Type =	empty($company) ? 'professional' : 'private';
		
		return MyWalletCard::GetList($options, $options);	
	}
	
	public static function Have(){
		$result = self::Get();
		return $result['length'] > 0;
	}
/**
 * MyEventBasketOptionPayment.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function Draw(){
				
		self::DrawStepNavigation();
		
		?>
        <form class="form formBasket" action="<?php echo self::PermalinkSubmitOption() ?>" method="post">
        	<h1><?php echo MUI('Choisissez le mode paiement') ?></h1>
            
            <div class="myevent-option-payment">
            
            	<?php
					$list = self::Get();
					
					if(empty($list)){
						die(Sql::Current()->getError());	
					}
					
					if(MyWalletCard::Have()):
						
						
						//if(MyWalletCard::Single()):
						?>
						
                        <?php
						//else:
							
							while(MyWalletCard::Current()):
								
								$picture = MyWalletCard::Picture();
								
					?>
                     
						<div class="box-option-payment<?php echo empty($picture) ? '' : ' icon'; ?>" data-cardid="<?php echo MyWalletCard::ID() ?>" data-external="<?php echo json_encode(MyWalletCard::External()); ?>">
                                                        
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
                                <p class="wrap-name"><?php echo MUI('Payer via') ?> <?php echo MUI(MyWalletCard::Name()); ?></p>
                            </div>
                            
                            <div class="wrap-hidden-form" style="display:none">
                            <?php
								if(!MyWalletCard::External()){
									MyWalletCard::Form();	
								}
							?>
                            </div>
                        </div>
                        
					<?php
								
								MyWalletCard::Next();
														
							endwhile;
							
							MyWalletCard::Reset();
							
						//endif;
					else:
					?>
                    	<h1>Il n'y aucun moyen de paiement disponible pour votre achat</h1>
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
 * MyEventBasketOptionPayment.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function DrawConfirmation(){
		
		self::DrawStepNavigation();
		echo Post::Content();
		?>
        <div class="myevent-basket-actions">
            <span class="box-simple-button submit"><a href="<?php Blog::Info('uri'); ?>">&laquo; <?php echo MUI('Retour à la page d\'accueil') ?></a></span>
        </div>
        <?php	
		self::Clear();
		
	}
/**
 * MyEventBasketOptionPayment.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function DrawCancel(){
		
		self::DrawStepNavigation();
		echo Post::Content();
		?>
        <div class="myevent-basket-actions">
            <span class="box-simple-button submit"><a href="<?php Blog::Info('page:panier'); ?>">&laquo; <?php echo MUI('Retourner au panier') ?></a></span>
            <span class="box-simple-button"><a href="<?php MyEvent::Info('basket.clear'); ?>"><?php echo MUI('Annuler ma commande'); ?></a></span>
        </div>
        <?php
	}
}

MyEventBasketOptionPayment::Initialize();
?>