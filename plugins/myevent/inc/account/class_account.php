<?php
/** section: MyEvent
 * class MyEventAccount 
 * includes ObjectTools
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
abstract class MyEventAccount extends ObjectTools{
/**
 *
 **/
	public static function Initialize(){
		
		include('class_account_address.php');
		
		//on observe l'evenement myevent:start pour lancer la gestion du front office client
		System::Observe('myevent:startpage', array(__CLASS__, 'onStart')); 
		System::Observe('myevent:startpage', array(__CLASS__, 'onStartPage')); 
		System::Observe('myevent:form.submit', array(__CLASS__, 'onSubmit')); 
		System::Observe('myevent:form.before', array(__CLASS__, 'onBeforeForm'));
						
	}
/**
 *
 **/	
	public static function onStart(){
		
		Blog::EnqueueScript('myevent.account.info', MYEVENT_URI.'inc/account/class_account_info.js');
		Blog::EnqueueScript('myevent.account.address', MYEVENT_URI.'inc/account/class_account_address.js');
	}
/**
 * MyEventAccount.onStartPage() -> void
 *
 * Cette méthode génère le contenu de la page.
 **/	
	public static function onStartPage(){
		
		switch(Post::Name()){
			case 'compte':	
				self::Draw();
				break;
			case 'compte/mes-infos':
				self::DrawMyInfo();
				break;
			
			case 'compte/adresse-livraison':
				MyEventAccountAddress::Draw();
				break;
		}		
	}
/**
 * MyEventAccount.onStartPage() -> void
 *
 * Cette méthode génère le contenu de la page.
 **/	
	public static function onSubmit($op){
		
		switch($op){
			case 'myevent.account.submit':	
				self::onSubmitInfo();
				break;
			
		}		
	}
/**
 * MyEventAccount.onBeforeForm() -> void
 *
 * Cette méthode génère le contenu de la page.
 **/	
	public static function onBeforeForm($op){
		
		switch($op){
			case 'myevent.account.submit':	
				self::onBeforeFormInfo();
				break;
				
			case 'myevent.account.address':
				MyEventAccountAddress::onBeforeForm();			
				break;
		}		
	}
/**
 * MyEventAccount.onStartPage() -> void
 *
 * Cette méthode génère le contenu de la page Compte
 **/	
	public static function Draw(){
		
		?>
        <div class="myevent-dashboard">
        
            <h3>Bonjour <?php MyEvent::Info('user') ?></h3>
            
            <ul class="myevent-account-nav">
            	
                <li class="command">
                    <h3><a href="<?php MyEvent::Info('command') ?>"><span class="title"><?php echo MUI('Mes commandes') ?></span> <span>»</span></a></h3>
                    <p><?php echo MUI('Suivez vos commandes en cours et consultez votre historique'); ?></p>
                </li>
                
                <li class="myinfo">
                    <h3><a href="<?php MyEvent::Info('myinfo') ?>"><span class="title"><?php echo MUI('Mes informations') ?></span> <span>»</span></a></h3>
                    <p><?php echo MUI('Modifiez votre nom, votre adresse e-mail ou votre mot de passe'); ?></p>
                </li>
                
                <li class="address">
                    <h3><a href="<?php MyEvent::Info('address') ?>"><span class="title"><?php echo MUI('Mes adresses de livraison'); ?></span> <span>»</span></a></h3>
                    <p><?php echo MUI('Gérez vos adresses'); ?></p>
                </li>
                
                <li class="share">
                    <h3><a href="<?php MyEvent::Info('cashback') ?>"><span class="title"><?php echo MUI('Mes filleul(e)s'); ?></span> <span>»</span></a></h3>
                    <p><?php echo MUI('Consultez vos bons d\'achat parrainage et invitez vos ami(e)s'); ?></p>
                </li>
            </ul>

        </div>
        <?php
	}
/*
 * MyEventAccount.onSubmitInfo() -> void
 **/	
	public static function onSubmitInfo(){
		
		if(System::Meta('BP_REGISTER_TYPE') > 0){
			if(@$_POST['TypeAccount'] == 1){
				//
				// Gestion des informations de type pro
				//
				if(empty($_POST['Company'])){
					BlogPress::SetError('Merci de saisir le nom de votre sociéte');
				}
			}
		}
		//
		// Vérification du Nom
		//
		if(empty($_POST['Name'])){
			BlogPress::SetError('Merci de saisir votre nom');
		}
		//
		// Vérification du Prénom
		//
		if(empty($_POST['FirstName'])){
			BlogPress::SetError('Merci de saisir votre prénom');
		}
		//
		// Vérification de l'adresse e-mail
		//				
		if(empty($_POST['EMail'])){
			BlogPress::SetError('Merci de saisir une adresse e-mail valide');
		}else{
			$mail = preg_replace('/[_\\-]/', '', $_POST['EMail']);
			
			if(!preg_match_all(BlogPress::REG_EMAIL, $mail, $matches)){
				BlogPress::SetError('Veuillez saisir une adresse e-mail valide');
			}
		}
		
		if(!empty($_POST['ChangePassword'])){
			if(empty($_POST['OldPassword'])){
				
				BlogPress::SetError('Veuillez saisir votre ancien mot de passe');
				
			}elseif(User::PasswordEncrypt($_POST['OldPassword']) != User::Get()->Password){
				
				BlogPress::SetError('Votre ancien mot de passe est incorrect');
			}
			
			if(empty($_POST['NewPassword'])){
				BlogPress::SetError('Veuillez saisir votre nouveau mot de passe');
			}
		}
		//
		// Vérification de l'identifiant
		//
		if(empty($_POST['Login']) && !empty($_POST['LoginAlternate'])){
			$_POST['Login'] = $_POST['LoginAlternate'];
		}
		
		if(empty($_POST['Login']) && empty($_POST['LoginAlternate'])){
			BlogPress::SetError('Merci de saisir un pseudo pour votre compte');
		}
		//
		// Vérification du numéro de téléphone
		//
		if(System::Meta('BP_REGISTER_PHONE') && @$_POST['TypeAccount'] == 1){
			if(empty($_POST['Phone'])){
				BlogPress::SetError('Merci de saisir votre numéro de téléphone pour votre compte');
			}
		}
		//
		// Vérification de redondance d'informations
		//	
		$user = User::ByMail($_POST['EMail']);
		
		if($user){	
			if($user->User_ID != User::Get()->User_ID){
				BlogPress::SetError('Votre adresse e-mail existe déjà dans notre base de données. Merci de vous connecter avec votre adresse e-mail ou d\'utiliser une autre adresse !');
			}
		}
		
		$user = User::ByLogin($_POST['Login']);
		
		if($user){
			if($user->User_ID != User::Get()->User_ID){
				BlogPress::SetError('Votre pseudo est déjà utilisé par un autre compte. Merci d\'en choisir un autre.');
			}
		}
		
		if(!BlogPress::IsError()){
			
			$account = 				User::Get();
			
			$account->extend($_POST);
			unset($account->cmd);
												
			if(System::Meta('BP_REGISTER_TYPE') > 0){//création des métas pour les comptes de type pro
				if(@$_POST['TypeAccount'] == 1){
					$options = new stdClass();
					//
					//
					//
					if(!empty($_POST['Siret'])){
						$options->Siret = 		substr(@$_POST['Siret'], 0, min(14, strlen($_POST['Siret'])));
					}else{
						$options->Siret = '';
					}
					
					$options->Company = 	substr(@$_POST['Company'], 0, min(100, strlen($_POST['Company'])));
					
					if(!empty($_POST['LegalStatut'])){
						$options->LegalStatut = substr(@$_POST['LegalStatut'], 0, min(50, strlen($_POST['LegalStatut'])));
					}else{
						$options->LegalStatut = '';
					}
					
					if(!empty($_POST['Service'])){
						$options->Service = 	substr(@$_POST['Service'], 0, min(100, strlen($_POST['Service'])));
					}else{
						$options->Service = '';
					}
					
					if(!empty($_POST['Sector'])){
						$options->Sector = 	substr(@$_POST['Sector'], 0, min(100, strlen($_POST['Sector'])));
					}else{
						$options->Sector = '';
					}
					
					if(!empty($_POST['Workforce'])){
						$options->Workforce = 	substr(@$_POST['Workforce'], 0, min(100, strlen($_POST['Workforce'])));
					}else{
						$options->Workforce = '';
					}
					
					$account->setMeta($options);
				}
			}
			//Gérer le changement de mot de passe
			
			if(!empty($_POST['ChangePassword'])){
				$account->Password = $_POST['NewPassword'];
			}
						
			//$mdp =	$account->Password;
			
			if(!$account->commit(false)){
				BlogPress::SetError('code001');
			}//else{
				//User::Set($account);	
			//}
		}
	}
/*
 * MyEventAccount.onBeforeFormInfo() -> void
 **/
	public static function onBeforeFormInfo(){
				
		if(BlogPress::IsError()){
					
			if(strpos(BlogPress::GetError(), 'code002') !== false){
				echo '<div class="box-form-error">
					<h2>' . MUI('Une erreur est survenue lors de la modification des informations de votre compte') .' (code: 002)</h2>
					<p>' . MUI('Une erreur technique est survenue. L\'équipe technique travail à la résolution du problème, merci de retenter cette opération un peu plutard !').'</p>
					<p>' . MUI('Cordialement').',</p>
					<p>' . MUI('L\'équipe de') .' '. Blog::GetInfo('title').'</p>
				</div>';
				
			}elseif(strpos(BlogPress::GetError(), 'code002') !== false){
				echo '<div class="box-form-error">
						<h2>' . MUI('Une erreur est survenue lors de la modification des informations de votre compte').' (code: 001)</h2>
						<p>' . MUI('Une erreur technique est survenue. L\'équipe technique travail à la résolution du problème, merci de retenter cette opération un peu plutard !').'</p>
						<p>' . MUI('Cordialement').',</p>
						<p>' . MUI('L\'équipe de') . ' '. Blog::GetInfo('title').'</p>
					</div>';
			}else{
				echo '
					<div class="box-form-error">
						<h2>' . MUI('Erreur dans le formulaire').'</h2>
						<p>' . MUI('Le formulaire a rencontré une ou plusieurs erreurs indiquées ci-après').' :</p>
						'.BlogPress::GetError().'
					</div>';
			}
		}else{
									
			echo '
				<div class="box-form-valid">
					<h2>' . MUI('Vos informations ont correctement enregistrés !') . '</h2>
				</div>				
				';
						
		}
	}
/**
 * MyEventAccount.DrawMyInfo() -> void
 *
 * Cette méthode génère le contenu de la page Info du compte client.
 **/	
	public static function DrawMyInfo(){
		
		$info = User::Get();
		
		foreach( $info as $key => $value){
			if(empty($_POST[$key])){
				$_POST[$key] = $value;
			}
		}
		
		$_POST['LegalStatut'] = User::Meta('LegalStatut');
		$_POST['Service'] = 	User::Meta('Service');
		$_POST['Sector'] = 		User::Meta('Sector');
		$_POST['Workforce'] = 	User::Meta('Workforce');
		$_POST['Company'] = 	User::Meta('Company');
		$_POST['Siret'] = 		User::Meta('Siret');
		
		?>
        <div class="col2-set myevent-account-info">
        	
            <div class="col-1">
                <p><?php echo MUI('Voici les informations personnelles que vous avez enregistrées dans notre système. Pour toute modification, mise à jour ou ajout, renseignez ces champs et sauvegardez avant de passer à l\'étape suivante.'); ?></p>
            </div>
            
            <div class="col-2">
                <form action="<?php Blog::Info('submit'); ?>" method="post" name="formInfo" class="form form-account-info">
                    <input type="hidden" name="cmd" value="myevent.account.submit" />
                    <input type="hidden" name="Password" value="<?php echo $_POST['Password']; ?>" />
                    
                    <?php 
						
                        Blog::Fire('form.before'); 
                        
                        switch(System::Meta('BP_REGISTER_TYPE')):
                            default:
                            case 0:break;
                            case 2:
                                ?>
                                <table class="table-form form-table type-account">
                                <tbody>
                                <tr class="row-type"><th><label for="TypeAccount"><?php echo MUI('Vous êtes un') ?></label></th>
                                <td>
                                    <?php BpRegister::DrawFieldTypeAccount(); ?>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                
                                <?php
                            case 1:
                                ?>
                                                
                                <fieldset class="company type-pro">
                                <legend><?php echo MUI('Votre société') ?></legend>
                                    <table class="table-form form-table">
                                    <tbody>
                                    <tr class="type-pro row-statut"><th><label for="LegalStatut"><?php echo MUI('Statut') ?></label></th>
                                    <td>
                                        <?php BpRegister::DrawFieldLegalStatutes()?>
                                    </td>
                                    </tr>
                                    <tr class="type-pro row-societe"><th><label for="Company"><?php echo MUI('Raison sociale') ?> *</label></th>
                                    <td class="box-flag type-right" title="<?php echo MUI('Saisissez ici le nom de votre société') ?>">
                                        <?php BpRegister::DrawFieldCompany()?>
                                        
                                    </td>
                                    </tr>
                                    
                                    <tr class="type-pro row-siret"><th><label for="Siret"><?php echo MUI('N° Siret') ?></label></th>
                                    <td class="box-flag type-right" title="<?php echo MUI('Saisissez ici le numéro de siret de votre société'); ?>">
                                        <?php BpRegister::DrawFieldSiretNumber()?></td>
                                    </tr>
                                    
                                    </tbody>
                                    </table>
                                </fieldset>
                                
                                <?php
                                break;
                                ?>
                    <?php
                        endswitch;
                    ?>
                    
                    <!-- Vous -->
                    
                    <fieldset class="user">
                    <legend><?php echo MUI('Vous'); ?></legend>
                        <table class="table-form form-table user">
                        <tbody>
                        <tr class="row-civility"><th><label for="Civility"><?php echo MUI('Civilité'); ?></label></th>
                        <td><?php BpRegister::DrawFieldCivility(); ?></td>
                        </tr>
                        <tr class="box-flag type-right row-name" title="<?php echo MUI('Saisissez ici votre nom entre 3 et 100 caractères') ?>">
                            <th><label for="Name"><?php echo MUI('Nom') ?> *</label></th>
                            <td><?php BpRegister::DrawFieldName(); ?></td>
                        </tr>
                        <tr class="box-flag type-right row-firstname" title="<?php echo MUI('Saisissez ici votre prénom entre 3 et 100 caractères'); ?>">
                            <th><label for="FirstName"><?php echo MUI('Prénom') ?> *</label></th>
                            <td><?php BpRegister::DrawFieldFirstName(); ?></td>
                        </tr>
                        <tr class="box-flag type-right row-login" title="<?php echo MUI('Saisissez ici votre pseudo entre 3 et 50 caractères') ?>">
                            <th><label for="Login"><?php echo MUI('Pseudo'); ?> *</label></th>
                            <td><?php BpRegister::DrawFieldLogin(); ?></td>
                        </tr>
                        
                        <!--gestion du login-->
                        <?php
                            if(!empty($_POST['Login']) && User::ByLogin($_POST['Login']) && User::Get()->Login != $_POST['Login']):
                        ?>
                        
                        <tr>
                            <th colspan="2" class="login-switch"><label ><?php echo MUI('Nous vous proposons les pseudos suivants') ?> :</label></th>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <?php 
									BpRegister::DrawLoginProposed();
                                ?>
                            </td>
                        </tr>
                        
                        <?php
                            endif;
                        ?>
                        <!-- fin de gestion du login -->
                        </tbody>
                        </table>
                    </fieldset>    
                    
                    <!-- Coordonnées -->
                    <fieldset class="coordinates">
                        <legend><?php echo MUI('Vos coordonnées') ?></legend>
                        <table class="table-form form-table">
                        <tbody>
                                        
                        <tr class="row-mail">
                            <th><label for="EMail"><?php echo MUI('E-mail') ?> *</label></th>
                            <td><?php BpRegister::DrawFieldEmail(); ?></td>
                        </tr>
                        
                        <?php
                            if(System::Meta('BP_REGISTER_PHONE')):
                        ?>
                        
                        <tr class="row-phone">
                            <th><label for="Phone"><?php echo MUI('Téléphone') ?> <span class="type-pro">*</span></label></th>
                            <td><?php BpRegister::DrawFieldPhone(); ?></td>
                        </tr>
                        
                        <tr class="row-mobile">
                            <th><label for="Mobile"><?php echo MUI('Portable') ?></label></th>
                            <td><?php BpRegister::DrawFieldMobile(); ?></td>
                        </tr>
                        
                        <?php
                            endif;
                        ?>
                        
                        <?php
                            if(!System::Meta('BP_REGISTER_PASS_AUTO')):
                            
                        ?>
                       	<tr class="row-change-pass">
                            <td style="text-align:right" class="cell-box"><input type="checkbox" class="box-checkbox" name="ChangePassword" id="ChangePassword" /></td>
                            <td class="cell-text"><?php echo MUI('Changer le mot de passe') ?></td>
                        </tr>
                        <tr class="box-flag type-right row-pass" title="<?php echo MUI('Saisissez ici le mot de passe de votre compte. Votre mot de passe doit être entre 7 et 15 caractères') ?>">
                            <th><label for="OldPassword"><?php echo MUI('Ancien mot de passe'); ?> *</label></th>
                            <td><?php self::DrawFieldOldPassword(); ?></td>
                        </tr>
                        <tr class="box-flag type-right row-pass" title="<?php echo MUI('Saisissez ici le mot de passe de votre compte. Votre mot de passe doit être entre 7 et 15 caractères') ?>">
                            <th><label for="Password"><?php echo MUI('Nouveau mot de passe'); ?> *</label></th>
                            <td><?php self::DrawFieldPassword(); ?></td>
                        </tr>
                        <tr class="row-show-pass">
                            <td style="text-align:right" class="cell-box"><input type="checkbox" class="box-checkbox" name="ShowPassword" id="ShowPassword" /></td>
                            <td class="cell-text"><?php echo MUI('Afficher mot de passe') ?></td>
                        </tr>
                        
                        <?php
                            endif;
                        ?>
                        
                        
                        </tbody>
                        </table>
                    </fieldset>
                    <!-- Mieux vous connaitre -->
                    
                    <?php
                        if(System::Meta('BP_REGISTER_TYPE') != 0):
                    ?>
                    <fieldset class="complementary type-pro">
                        <legend><?php echo MUI('Mieux vous connaitre') ?></legend>
                    
                        <table class="table-form form-table">
                        <tbody>  
                        
                        <?php if(BpRegister::HaveService()) : ?>
                        <tr class="row-service"><th><label for="Service"><?php echo MUI('Service') ?></label></th>
                        <td>
                            <?php BpRegister::DrawFieldServices(); ?>
                        </td>
                        </tr>
                        <?php endif; ?>
                        
                        <?php if(BpRegister::HaveSector()) : ?>
                        <tr class="row-secteur"><th><label for="Sector"><?php echo MUI('Secteur d\'activité') ?></label></th>
                        <td>
                            <?php BpRegister::DrawFieldSectors(); ?>
                        </td>
                        </tr>
                        <?php endif; ?>
                        
                        <?php if(BpRegister::HaveWorkforce()) : ?>
                        <tr class="row-effectif"><th><label for="Workforce"><?php echo MUI('Effectif de la société') ?></label></th>
                        <td>
                            <?php BpRegister::DrawFieldWorkforce(); ?>
                        </td>
                        </tr>
                        <?php endif; ?>
                        
                        </tbody>
                        </table>
                        
                    </fieldset>
                    <?php
                        endif;
                    ?>
                                   
                    <p class="p-submit"><span class="button"><input type="submit" value="<?php echo MUI('Enregistrer'); ?>" /></span></p>
                </form>
            </div>
        </div>
        <?php	
	}
/**
 * BpRegister.DrawFieldOldPassword([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du mot de passe.
 **/	
	final static function DrawFieldOldPassword($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['OldPassword']) ? '' : @$_POST['OldPassword'];
		
		?>
       	<input id="OldPassword" type="password" name="OldPassword" maxlength="15" value="<?php echo $default; ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BpRegister.DrawFieldPassword([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du mot de passe.
 **/	
	final static function DrawFieldPassword($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['NewPassword']) ? '' : @$_POST['NewPassword'];
		
		?>
       	<input id="NewPassword" type="password" name="NewPassword" maxlength="15" value="<?php echo $default; ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
}

MyEventAccount::Initialize();
?>