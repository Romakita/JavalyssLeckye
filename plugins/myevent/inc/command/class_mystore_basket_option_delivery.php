<?php
/** section: MyEvent
 * class MyEventBasketOptionDelivery < MyEventBasket
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
class MyEventBasketOptionDelivery extends MyEventBasket{
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
		
		if(Post::Name() == 'panier/options-livraison'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
	}
	
	public static function Get(){
		$options = new stdClass();
		$options->Amount = 	self::GetAmount();
		$options->Type =	empty($company) ? 'professional' : 'private';
		
		return MyEventOptionDelivery::GetList($options, $options);	
	}
	
	public static function Have(){
		$result = self::Get();
		return $result['length'] > 0;
	}
/**
 * MyEventBasketOptionDelivery.AmountDelivery(dec_point, thousand_sep) -> String
 * Cette méthode retourne le coût total de la livraison.
 **/	
	public static function AmountDelivery($dec_point = '.' , $thousands_sep = ',', $price = 0){
		return number_format(self::$AmountDelivery + $price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasketOptionDelivery.AmountTotal(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier (Montant + Cout de livraison)
 **/	
	public static function AmountTotal($dec_point = '.' , $thousands_sep = ',', $price = 0){
		
		$tva = 		MyEvent::CalculateTVA(self::$Amount);
		$amount = 	self::$Amount;
		
		if(MyEvent::ModeTVA() == MyEvent::TVA_USE){
			$amount = $tva + $amount;
		}
		
		return number_format($amount + $price, 2, $dec_point, $thousands_sep) . ' ' . MyEvent::Currency() ;
	}
/**
 * MyEventBasketOptionDelivery.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function Draw(){
		
		self::DrawStepNavigation();
		
		?>
        <form class="form formBasket" action="<?php echo self::PermalinkSubmitOption() ?>" method="post">
        	
            <div class="myevent-option-delivery">
            
            	<?php
					
					$result = self::Get();
					
					for($i = 0; $i < $result['length']; $i++):
						$current = new MyEventOptionDelivery($result[$i]);
						
					?>
                    
						<div class="box-option-delivery<?php echo empty($current->Picture) ? '' : ' icon'; ?>" data-price="<?php echo $current->Cost_Delivery ?>" data-mode="<?php echo $current->getMode(); ?>">
                            <div class="wrap-default">
                                <input type="radio" name="OptionDeliveryID" value="<?php echo $current->Option_ID; ?>" class="box-checkbox set-cost-delivery" <?php echo $i == 0 ? ' checked=checked': ''; ?>  />
                            </div>
                            
                            <?php 
								if(!empty($current->Picture)):
								
									$picture = SystemCache::Push(array(
													'Src' => $current->Picture,
													'Width' => 128, 
													'Height' => 128, 
													'ID' => basename($current->Picture . '-128')
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
                                <p class="wrap-name"><?php echo MUI($current->Name); ?></p>
                                <p class="wrap-time-delivery"><?php echo $current->Time_Delivery; ?></p>
                                
                                <p class="wrap-price">
                                <?php
									if(!($current->getMode() == MyEventOptionDelivery::ADD && $current->Cost_Delivery == 0)){
										
										if($current->Cost_Delivery == 0){
											echo MUI('Gratuit');	
										}else{
											if($current->getMode() == MyEventOptionDelivery::ADD){
												echo '+';	
											}
											echo $current->getCostDelivery();
										}
										
									}
									
								?>
                                </p>
                            </div>
                            
                        </div>
                        
					<?php
					endfor;
				?>
            	<div class="clear clearer"></div>
                
            </div>
            
            <table class="form-table table-form table-basket myevent-basket">
            <thead>
                <tr>
                    <th class="col-picture"><strong><?php echo MUI('Récapitulatif') ?></strong></th><!-- order-image col -->
                    <th class="col-description">&nbsp;</th><!-- item description col -->
                    <th class="col-qty">Qté</th>
                    <th class="col-price">Prix</th>
                    <th class="col-price-total">Sous-total</th>
                </tr>
            </thead>
            
            <tbody>
            
            <?php
				   
                while(MyEventBasket::Current()):
				
            ?>
                <tr data-action="<?php echo self::PermalinkAdd(MyEventBasket::ProductID()); ?>">
                   	        
                    <td class="col-picture">
                        <img width="117" height="67" title="<?php echo MyEventBasket::Reference() ?>" alt="<?php echo MyEventBasket::Reference() ?>" src="<?php echo SystemCache::Push(array('Src' => MyEventBasket::Picture(), 'Width' => 117, 'Height'=> 67, 'ID' => basename(MyEventBasket::Picture()) . '-117-67')) ?>">
                    </td>
        
                    <td class="col-description">
                        <p><?php echo MyEventBasket::Reference() ?></p>
                        <p class="eco-tax"><?php echo MUI('dont éco-taxe') . ' ' . MyEventBasket::EcoTax(',', '.'); ?></p>
                    </td>
                    
                    <td class="col-qty">
                        <?php echo MyEventBasket::Qty(); ?>
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
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Sous-total') ?> <?php MyEvent::ModeTVA() == MyEvent::TVA_USE ? MUI('HT') : '' ?></td>
                    <td class="price amount"><?php echo MyEventBasket::Amount(',', ' '); ?></td>
                </tr>
                
                <tr class="row-basket-eco-tax">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont éco-taxe') ?></td>
                    <td class="price eco-tax"><?php echo MyEventBasket::EcoTaxTotal(',', ' ')?></td>
                </tr>
                
                <?php
					switch(MyEvent::ModeTVA()){
						case MyEvent::TVA_PRINT:
						?>
				<tr class="row-basket-tva">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont TVA') . ' ' . MyEvent::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyEventBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;
						case MyEvent::TVA_USE:
							?>
				<tr class="row-basket-tva">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('TVA') . ' ' . MyEvent::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyEventBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;	
					}
				?>
                
                <tr class="row-basket-amount-delivery">
                    <td class="info" colspan="3">* <?php echo MUI('Sur la base d\'une livraison standard'); ?></td>                                           
                    <td class="text">* <?php echo MUI('Coût de livraison standard'); ?></td>
                    <td class="price amount-delivery" data-cost-delivery="<?php echo MyEventBasket::AmountDelivery('.', '') ?>"><?php 
						
						$current = new MyEventOptionDelivery($result[0]);
						
						if($current->getMode() == MyEventOptionDelivery::ADD){
							echo self::AmountDelivery(',', ' ', $current->Cost_Delivery);
						}else{
							echo $current->getCostDelivery(',', ' ');
						}
					?></td>
                </tr>
                
                <tr class="row-basket-amount-total">    
                    <td colspan="1">&nbsp;</td>    
                    <td class="text" colspan="3"><?php echo MUI('Total'); ?> <?php MyEvent::ModeTVA() == MyEvent::TVA_USE ? MUI('TTC') : '' ?></td>
                    <td class="price amount-total" data-amount="<?php echo MyEventBasket::Amount('.', '') ?>" data-cost-delivery="<?php echo MyEventBasket::AmountDelivery('.', '') ?>"><?php 
						
						$current = new MyEventOptionDelivery($result[0]);
						
						if($current->getMode() == MyEventOptionDelivery::ADD){
							echo self::AmountTotal(',', ' ', self::$AmountDelivery + $current->Cost_Delivery);
						}else{
							echo self::AmountTotal(',', ' ', $current->Cost_Delivery);
						}
						
					?></td>
                </tr>
                <?php
					if(MyEventBasket::AmountSaved() != MyEvent::NullPrice()):
				?>
                <tr class="row-basket-amount-save">
                    <td colspan="1">&nbsp;</td>
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
             	<span class="button submit button-valid-basket"><input type="submit" value="<?php echo MUI('Confirmer ma commande'); ?>" /></span>
            </div>
            <?php
				
			?>
            
        </form>	
    	<?php
		
		MyEventBasket::Reset();
	}
}

MyEventBasketOptionDelivery::Initialize();
?>