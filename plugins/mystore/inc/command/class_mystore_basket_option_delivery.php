<?php
/** section: MyStore
 * class MyStoreBasketOptionDelivery < MyStoreBasket
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
class MyStoreBasketOptionDelivery extends MyStoreBasket{
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
		
		if(Post::Name() == 'panier/options-livraison'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
	}
	
	public static function Get(){
		
		
		self::CalculAmount();
		
		$options = 			new stdClass();
		$options->Amount = 	parent::Get()->Amount_HT;
		$options->Type =	empty($company) ? 'professional' : 'private';
		$options->public =	true;
		
		$result = MyStoreOptionDelivery::GetList($options, $options);	
		if(!$result){
			die(Sql::PrintError());	
		}
		return $result;
	}
	
	public static function Have(){
		$result = self::Get();
		return $result['length'] > 0;
	}
/**
 * MyStoreBasketOptionDelivery.CostDelivery(dec_point, thousand_sep) -> String
 * Cette méthode retourne le coût total de la livraison.
 **/	
	public static function CostDelivery($dec_point = '.' , $thousands_sep = ',', $price = 0){
		return number_format(parent::Get()->Cost_Delivery + $price, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreBasketOptionDelivery.AmountTotal(dec_point, thousand_sep) -> String
 * Cette méthode retourne le prix total du panier (Montant + Cout de livraison)
 **/	
	public static function AmountTotal($dec_point = '.' , $thousands_sep = ',', $delivery = 0){
				
		$price = parent::Get()->Amount_HT;
		
		switch(MyStore::ModeTVA()){
			
			case MyStore::TVA_USE://calcul classique, les prix sont HT on calcul le montant TTC
				$price = 	$price + (($price * MyStore::TVA()) / 100);
				break;
			case MyStore::TVA_PRINT://calcul inverse, les prix sont deja en TTC on calcul le montant HT
				$price = 	$price / ((MyStore::TVA() / 100) + 1);
				break;
		}
		
		return number_format($price + $delivery, 2, $dec_point, $thousands_sep) . ' ' . MyStore::Currency() ;
	}
/**
 * MyStoreBasketOptionDelivery.Draw() -> void
 *
 * Cette méthode génère le contenu de la page de gestion des options de livraison.
 **/		
	public static function Draw(){
		
		self::DrawStepNavigation();
		
		?>
        <form class="form formBasket" action="<?php echo self::PermalinkSubmitOption() ?>" method="post">
        	
            <div class="mystore-option-delivery">
            
            	<?php
					
					$result = self::Get();
					
					for($i = 0; $i < $result['length']; $i++):
						$current = new MyStoreOptionDelivery($result[$i]);
						
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
									if(!($current->getMode() == MyStoreOptionDelivery::ADD && $current->Cost_Delivery == 0)){
										
										if($current->Cost_Delivery == 0){
											echo MUI('Gratuit');	
										}else{
											if($current->getMode() == MyStoreOptionDelivery::ADD){
												echo number_format(parent::Get()->Cost_Delivery + $current->Cost_Delivery, 2, '.', ' ') . ' ' . MyStore::Currency();	
											}else{
												echo $current->getCostDelivery();
											}
										}
										
									}
									
								?>
                                </p>
                            </div>
                            
                        </div>
                        
					<?php
					endfor;
					
					//if($result['length'] == 0){
					//	echo "<h3> Pas d'options de livraison de disponible</h3>";
					//}
				?>
            	<div class="clearfloat clearer"></div>
                
            </div>
            
            <table class="form-table table-form table-basket mystore-basket">
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
				   
                while(MyStoreBasket::Current()):
				
            ?>
                <tr data-action="<?php echo self::PermalinkAdd(MyStoreCommandProduct::ID()); ?>">
                   	        
                    <td class="col-picture">
                        <?php 
							$link = MyStoreCommandProduct::Picture();
							$picture = SystemCache::Push(array(
								'Src' => $link, 
								'Width' => 117, 
								'Height'=> 67, 
								'ID' => basename($link) . '-117-67'))
						?>
                        
                    	<div class="wrap-picture" style="background-image:url(<?php echo $picture ?>)">
                        	<img height="67" title="<?php echo MyStoreCommandProduct::Reference() ?>" alt="<?php echo MyStoreCommandProduct::Reference() ?>" src="<?php echo $picture ?>">
                        </div>
                    </td>
        
                    <td class="col-description">
                        <p class="description"><?php echo MyStoreCommandProduct::Reference() ?></p>
                        <p class="eco-tax"><?php echo MUI('dont éco-taxe') . ' ' . MyStoreCommandProduct::EcoTax('.', ' '); ?></p>
                    </td>
                    
                    <td class="col-qty">
                        <?php echo MyStoreCommandProduct::Qty(); ?>
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
            ?>
            </tbody>
            <tfoot>
                <tr class="row-basket-amount">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Sous-total') ?> <?php echo MyStore::ModeTVA() != MyStore::TVA_DISABLED ? MUI('HT') : '' ?></td>
                    <td class="price amount"><?php echo MyStoreBasket::AmountHT(',', ' '); ?></td>
                </tr>
                
                <tr class="row-basket-eco-tax">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont éco-taxe') ?></td>
                    <td class="price eco-tax"><?php echo MyStoreBasket::EcoTax(',', ' ')?></td>
                </tr>
                
                <?php
					switch(MyStore::ModeTVA()){
						case MyStore::TVA_PRINT:
						?>
				<tr class="row-basket-tva">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('Dont TVA') . ' ' . MyStore::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyStoreBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;
						case MyStore::TVA_USE:
							?>
				<tr class="row-basket-tva">
                    <td colspan="1">&nbsp;</td>  
                    <td class="text" colspan="3"><?php echo MUI('TVA') . ' ' . MyStore::TVA() . '%' ?> </td>
                    <td class="price tva"><?php echo MyStoreBasket::AmountTVA(',', ' ')?></td>
                </tr>
						<?php
							break;	
					}
				?>
                <?php
					if($result['length'] > 0):
				?>
                <tr class="row-basket-amount-delivery">
                    <td class="info" colspan="3">* <?php echo MUI('Sur la base d\'une livraison standard'); ?></td>                                           
                    <td class="text">* <?php echo MUI('Coût de livraison standard'); ?></td>
                    <td class="price amount-delivery" data-cost-delivery="<?php echo MyStoreBasket::CostDelivery('.', ' ') ?>"><?php 
						
						
						$current = new MyStoreOptionDelivery($result[0]);
						
						if($current->getMode() == MyStoreOptionDelivery::ADD){
							echo self::CostDelivery(',', ' ', $current->Cost_Delivery);
						}else{
							echo $current->getCostDelivery(',', ' ');
						}
					?></td>
                </tr>
                <?php
					endif;
				?>
                
                <tr class="row-basket-amount-total">    
                    <td colspan="1">&nbsp;</td>    
                    <td class="text" colspan="3"><?php echo MUI('Total'); ?> <?php echo MyStore::ModeTVA() != MyStore::TVA_DISABLED ? MUI('TTC') : '' ?></td>
                    <td class="price amount-total" data-amount="<?php echo MyStoreBasket::AmountHT('.', '', 0) ?>" data-cost-delivery="<?php echo MyStoreBasket::CostDelivery('.', '') ?>"><?php 
						
						if($result['length'] > 0){
							$current = new MyStoreOptionDelivery($result[0]);
							
							if($current->getMode() == MyStoreOptionDelivery::ADD){
								echo self::AmountTotal(',', ' ', parent::Get()->Cost_Delivery + $current->Cost_Delivery);
							}else{
								echo self::AmountTotal(',', ' ', $current->Cost_Delivery);
							}
						}else{
							echo self::AmountTotal(',', ' ');	
						}
						
					?></td>
                </tr>
                <?php
					if(MyStoreBasket::AmountSaved() != MyStore::NullPrice()):
				?>
                <tr class="row-basket-amount-save">
                    <td colspan="1">&nbsp;</td>
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
             	<span class="button submit button-valid-basket"><input type="submit" value="<?php echo MUI('Confirmer ma commande'); ?>" /></span>
            </div>
            <?php
				
			?>
            
        </form>	
    	<?php
		
		MyStoreBasket::Reset();
	}
}

MyStoreBasketOptionDelivery::Initialize();
?>