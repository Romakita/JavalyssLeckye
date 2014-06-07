<?php
/** section: MyEvent
 * class MyEventBasketAddress < MyEventBasket
 *
 * Cette classe permet de gérer les différents événements du logiciel Javalyss pour la mise en place des données de l'extension MyEvent.
 *
 * #### Informations
 *
 * * Auteur : Paul Tabet
 * * Fichier : class_account.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventBasketAddress extends MyEventBasket{
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
		
		if(Post::Name() == 'panier/adresse-livraison'){
			
			ob_start();
			
			self::Draw();
			
			Post::Content(ob_get_clean());
		}
	}
/**
 * MyEventBasketAddress.DrawAddressDelivery() -> void
 *
 * Cette méthode liste les addresses de livraison.
 **/
	public static function DrawAddressDelivery(){
		
		$carnet = MyEventAccountAddress::GetList();
				
		?>
        <div class="myevent-address myevent-address-billing">
                        
            <div class="content-address">
            <?php
				
				$id = User::Meta('MYEVENT_ADR_DEFAULT');
				
				foreach($carnet as $key => $address):
					
					if(!is_object($address)) continue;
					
					
			?>
				<div class="box-address<?php echo $id == $address->Address_ID ? ' selected': ''; ?>" data-id="<?php echo $address->Address_ID ?>">
                	<div class="wrap-default">
                    	<input type="radio" name="AddressDelivery" value="<?php echo $address->Address_ID; ?>" class="box-checkbox" <?php echo $id == $address->Address_ID ? ' checked=checked': ''; ?>/>
                    </div>
                	
                    <div class="wrap-content">
                    	<p class="wrap-name"><?php echo $address->FirstName . ' ' . $address->Name; ?></p>
                        <p class="wrap-address"><?php echo $address->Address . ' ' . @$address->Address2; ?></p>
                        <p class="wrap-city"><?php echo $address->CP . ' ' . $address->City . ' ' . $address->Country; ?></p>
                        <p class="wrap-phone"><?php echo MUI('Téléphone') . ' : ' . $address->Phone; ?></p>
                    </div>
                    
                </div>
			<?php	
				endforeach;
			?>
            	<div class="clear"></div>
            </div>
        
        </div>
        <?php
	}
/**
 * MyEventBasketAddress.DrawAddressBilling() -> void
 *
 * Cette méthode liste les addresses de facturation.
 **/	
	public static function DrawAddressBilling(){
		
		$carnet = MyEventAccountAddress::GetList();
		
		?>
        <div class="myevent-address">
            
            <div class="wrap-switch-address">
                <p><?php echo MUI('Utiliser mon adresse de livraison par défaut') ?> ?</p>
                <p class="wrap-toggle-switch-address">
                    <select class="box-toggle-button myevent-switch-address" name="SameAddress">
                        <option value="0"><?php echo MUI('Non'); ?></option>
                        <option value="1" selected><?php echo MUI('Oui') ?></option>
                    </select>
                </p>
            </div>
                        
            <div class="myevent-content-address" style="display:none">
            <?php
				
				$id = User::Meta('MYEVENT_ADR_DEFAULT');
				
				foreach($carnet as $key => $address):
					
					if(!is_object($address)) continue;
					
					
			?>
				<div class="box-address<?php echo $id == $address->Address_ID ? ' selected': ''; ?>" data-id="<?php echo $address->Address_ID ?>">
                	<div class="wrap-default">
                    	<input type="radio" name="AddressBilling" value="<?php echo $address->Address_ID; ?>" class="box-checkbox" <?php echo $id == $address->Address_ID ? ' checked=checked': ''; ?>/>
                    </div>
                	
                    <div class="wrap-content">
                    	<p class="wrap-name"><?php echo $address->FirstName . ' ' . $address->Name; ?></p>
                        <p class="wrap-address"><?php echo $address->Address . ' ' . @$address->Address2; ?></p>
                        <p class="wrap-city"><?php echo $address->CP . ' ' . $address->City . ' ' . $address->Country; ?></p>
                        <p class="wrap-phone"><?php echo MUI('Téléphone') . ' : ' . $address->Phone; ?></p>
                    </div>
                    
                </div>
			<?php	
				endforeach;
			?>
            	<div class="clear"></div>
            </div>
        
        </div>
        <?php
	}
/**
 * MyEventBasketAddress.DrawAddressDelivery() -> void
 *
 * Cette méthode génère le contenu de la page des adresses de livraison et facturation du panier.
 **/	
	public static function Draw(){
		
		self::DrawStepNavigation();
		
		?>
        <form class="form formBasketAddress" action="<?php echo self::PermalinkSubmitAddress() ?>" method="post">
        
        	<div class="col2-set">
            	<div class="col-1 address-delivery">
                	<h2><?php echo MUI('Adresse de livraison'); ?> :</h2>
                    <?php
						echo self::DrawAddressDelivery();
					?>
                </div>
                <div class="col-2 address-billing">
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
        	
            <div class="myevent-basket-actions">
           		<span class="box-simple-button button-continue"><a href="<?php Blog::Info('page:produits'); ?>">&laquo; <?php echo MUI('Continuer mes achats') ?></a></span>
             	<span class="button submit button-valid-basket"><input type="submit" value="<?php echo MUI('Valider'); ?> &raquo;" /></span>
            </div>
        </form>
        <?php
	}
}


MyEventBasketAddress::Initialize();
?>