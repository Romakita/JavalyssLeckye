<?php
/** section: MyStore
 * class MyStoreBasketAddress < MyStoreBasket
 *
 * Cette classe permet de gérer les différents événements du logiciel Javalyss pour la mise en place des données de l'extension MyStore.
 *
 * #### Informations
 *
 * * Auteur : Paul Tabet
 * * Fichier : class_account.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreBasketAddress extends MyStoreBasket{
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
		
		if(Post::Name() == 'panier/adresse-livraison'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
	}
/**
 * MyStoreBasketAddress.DrawAddressDelivery() -> void
 *
 * Cette méthode liste les addresses de livraison.
 **/
	public static function DrawAddressDelivery(){
		
		$options = new stdClass();
		$options->User_ID = User::Get()->User_ID;
		
		$carnet = MyStoreAccountAddress::GetList('', $options);
			
		?>
        <div class="mystore-address mystore-address-billing">
                        
            <div class="content-address">
            <?php
			
				if(!MyStoreAccountAddress::HaveDefault(User::Get()->User_ID)){
					if($carnet['length']){
						$carnet[0]['Default'] = 1;
					}
				}
								
				for($i = 0; $i < $carnet['length']; $i++):
					$address = new self($carnet[$i]);
					
					if(!is_object($address)) continue;
					
					
			?>
				<div class="box-address<?php echo $address->Default == 1 ? ' selected': ''; ?>" data-id="<?php echo $address->Address_ID ?>">
                	<div class="wrap-default">
                    	<input type="radio" name="AddressDelivery" value="<?php echo $address->Address_ID; ?>" class="box-checkbox" <?php echo $address->Default == 1 ? ' checked=checked': ''; ?>/>
                    </div>
                	
                    <div class="wrap-content">
                    	<p class="wrap-name"><?php echo $address->FirstName . ' ' . $address->Name; ?></p>
                        <p class="wrap-address"><?php echo $address->Address . ' ' . @$address->Address2; ?></p>
                        <p class="wrap-city"><?php echo $address->CP . ' ' . $address->City . ' ' . $address->Country; ?></p>
                        <p class="wrap-phone"><?php echo MUI('Téléphone') . ' : ' . $address->Phone; ?></p>
                    </div>
                    
                </div>
			<?php	
				endfor;
			?>
            	<div class="clear"></div>
            </div>
        
        </div>
        <?php
	}
/**
 * MyStoreBasketAddress.DrawAddressBilling() -> void
 *
 * Cette méthode liste les addresses de facturation.
 **/	
	public static function DrawAddressBilling(){
		
		$options = new stdClass();
		$options->User_ID = User::Get()->User_ID;
		
		$carnet = MyStoreAccountAddress::GetList('', $options);
		
		?>
        <div class="mystore-address">
            
            <div class="wrap-switch-address">
                <p><?php echo MUI('Utiliser mon adresse de livraison par défaut') ?> ?</p>
                <p class="wrap-toggle-switch-address">
                    <select class="box-toggle-button mystore-switch-address" name="SameAddress">
                        <option value="0"><?php echo MUI('Non'); ?></option>
                        <option value="1" selected><?php echo MUI('Oui') ?></option>
                    </select>
                </p>
            </div>
                        
            <div class="mystore-content-address" style="display:none">
            <?php
				
				
				
				for($i = 0; $i < $carnet['length']; $i++):
					$address = new self($carnet[$i]);
					
					if(!is_object($address)) continue;
					
					
			?>
				<div class="box-address<?php echo $address->Default == 1 ? ' selected': ''; ?>" data-id="<?php echo $address->Address_ID ?>">
                	<div class="wrap-default">
                    	<input type="radio" name="AddressBilling" value="<?php echo $address->Address_ID; ?>" class="box-checkbox" <?php echo $address->Default == 1 ? ' checked=checked': ''; ?>/>
                    </div>
                	
                    <div class="wrap-content">
                    	<p class="wrap-name"><?php echo $address->FirstName . ' ' . $address->Name; ?></p>
                        <p class="wrap-address"><?php echo $address->Address . ' ' . @$address->Address2; ?></p>
                        <p class="wrap-city"><?php echo $address->CP . ' ' . $address->City . ' ' . $address->Country; ?></p>
                        <p class="wrap-phone"><?php echo MUI('Téléphone') . ' : ' . $address->Phone; ?></p>
                    </div>
                    
                </div>
			<?php	
				endfor;
			?>
            	<div class="clear"></div>
            </div>
        
        </div>
        <?php
	}
/**
 * MyStoreBasketAddress.DrawAddressDelivery() -> void
 *
 * Cette méthode génère le contenu de la page des adresses de livraison et facturation du panier.
 **/	
	public static function Draw(){
		
		self::DrawStepNavigation();
		
		?>
        <form class="form formBasketAddress" action="<?php echo self::PermalinkSubmitAddress() ?>" method="post">
        
        	<div class="col2-set">
            	<div class="col-1 mystore-adresss-list address-delivery">
                	<h2><?php echo MUI('Adresse de livraison'); ?> :</h2>
                    <?php
						echo self::DrawAddressDelivery();
					?>
                </div>
                <div class="col-2 mystore-adresss-list address-billing">
               		<h2><?php echo MUI('Adresse de facturation'); ?> :</h2>
                    <?php
						echo self::DrawAddressBilling();
					?>
                </div>
                <div class="clear"></div>
            </div>
            
            <div class="toolbar gradient">
                <p><?php echo MUI('Cliquez ici pour ajouter une nouvelle adresse') ?></p>
                <span class="box-simple-button button-add-address">
                	<a href="#"><!-- Note : button-add-address est important pour la gestion d'ajout d'une adresse via JS -->
                    	<?php echo MUI('Ajouter une nouvelle adresse') ?> »
                	</a>
                </span>
            </div>
        	
            <div class="mystore-basket-actions">
           		<span class="box-simple-button button-continue"><a href="<?php Blog::Info('page:produits'); ?>">&laquo; <?php echo MUI('Continuer mes achats') ?></a></span>
             	<span class="button submit button-valid-basket"><input type="submit" value="<?php echo MUI('Valider'); ?> &raquo;" /></span>
            </div>
        </form>
        <?php
	}
}


MyStoreBasketAddress::Initialize();
?>