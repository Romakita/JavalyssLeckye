<?php
/** section: Plugins
 * class BlogPressRegister
 * includes iForm
 *
 * Cette classe gère l'enregistrement des utilisateurs depuis le blog.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_register.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class BlogPressRegister implements iForm{
	const NORMAL = 	0;
	const PRO =		1;
	const ALL =		2;
/**
 * BlogPressRegister.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	public static function Initialize(){
		System::Observe('blog:form.submit', array(__CLASS__,'onFormSubmit'));
		System::Observe('blog:form.commit', array(__CLASS__,'onFormCommit'));
		System::Observe('blog:form.before', array(__CLASS__,'onBeforeForm'));	
	}
/**
 * BlogPressRegister.onFormSubmit() -> void
 *
 * Cette méthode teste les champs envoyés par le formulaire affiché dans la page source.
 *
 * Utilisez les méthodes [[System.GetCMD]] pour connaitre la commande et [[BlogPress.SetError]] pour indiquer une erreur dans le formulaire.
 **/
	public static function onFormSubmit(){
		
		if(System::GetCMD() != 'blogpress.register.submit') return;
		
		if(BlogPress::Meta('BP_REGISTER_TYPE') > 0){
			if(@$_POST['TypeAccount'] == 1){
				//
				// Gestion des informations de type pro
				//
				if(empty($_POST['Company'])){
					BlogPress::SetError('Merci de saisir le nom de votre société pour la création de votre compte');
				}
				
			}
		}
		//
		// Vérification du Nom
		//
		if(empty($_POST['Name'])){
			BlogPress::SetError('Merci de saisir votre nom pour la création de votre compte');
		}
		//
		// Vérification du Prénom
		//
		if(empty($_POST['FirstName'])){
			BlogPress::SetError('Merci de saisir votre prénom pour la création de votre compte');
		}
		//
		// Vérification de l'adresse e-mail
		//				
		if(empty($_POST['EMail'])){
			BlogPress::SetError('Merci de saisir votre adresse e-mail pour la création de votre compte');
		}else{
			$mail = preg_replace('/[_\\-]/', '', $_POST['EMail']);
			
			if(!preg_match_all(BlogPress::REG_EMAIL, $mail, $matches)){
				BlogPress::SetError('Veuillez saisir une adresse e-mail valide');
			}
		}
		//
		// Vérification de l'identifiant
		//
		if(empty($_POST['Login']) && !empty($_POST['LoginAlternate'])){
			$_POST['Login'] = $_POST['LoginAlternate'];
		}
		
		if(empty($_POST['Login']) && empty($_POST['LoginAlternate'])){
			BlogPress::SetError('Merci de saisir votre pseudo pour la création de votre compte');
		}
		//
		// Vérification de mot de passe
		//
		if(!BlogPress::Meta('BP_REGISTER_PASS_AUTO')){
			if(empty($_POST['Password'])){
				BlogPress::SetError('Merci de saisir votre mot de passe pour la création de votre compte');
			}else{
				if(strlen($_POST['Password']) < 6){
					BlogPress::SetError('Votre <b>mot de passe</b> doit comporter au moins <b>6 caractères</b>');
				}
			}
		}
		//
		// Vérification du numéro de téléphone
		//
		if(BlogPress::Meta('BP_REGISTER_PHONE') && @$_POST['TypeAccount'] == 1){
			if(empty($_POST['Phone'])){
				BlogPress::SetError('Merci de saisir votre numéro de téléphone pour la création de votre compte');
			}
		}
		//
		// Vérification de redondance d'informations
		//				
		if(User::ByMail($_POST['EMail'])){
			BlogPress::SetError('Votre adresse e-mail existe déjà dans notre base de données. Merci de vous connecter avec votre adresse e-mail ou d\'utiliser une autre adresse !');
		}
		
		if(User::ByLogin($_POST['Login'])){
			BlogPress::SetError('Votre pseudo est déjà utilisé par un autre compte. Merci d\'en choisir un autre.');
		}
	}
/**
 * BlogPressRegister.onFormCommit() -> void
 *
 * Cette méthode permet d'enregistrer les données du formulaire seulement si aucune erreur n'a été signalé via la méthode [[BlogPress.SetError]].
 **/
	public static function onFormCommit(){
		
		if(System::GetCMD() != 'blogpress.register.submit') return;
				
		$account = 				new User($_POST);
		$account->Is_Active = 	0; 
		$account->User_ID = 	0;
		
		$account->Role_ID = 	BlogPress::Meta('BP_REGISTER_ROLE');
		
		if(empty($account->Role_ID)){
			$account->Role_ID = 3;
		}
		
		if(BlogPress::Meta('BP_REGISTER_TYPE') > 0){//création des métas pour les comptes de type pro
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
				
				if(!empty($_POST['TVA_Intra'])){
					$options->TVA_Intra = 		substr(@$_POST['TVA_Intra'], 0, min(30, strlen($_POST['TVA_Intra'])));
				}else{
					$options->TVA_Intra = '';
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
		
		if(BlogPress::Meta('BP_REGISTER_PASS_AUTO')){//creation auto du password
			$account->generateAccess();
		}
		
		$mdp =	$account->Password;
		
		if($account->commit(false)){//enregistrement de l'utilisateur
			
			$validation = 	BlogPress::Meta('BP_REGISTER_VALID_REQ');
			$idactive = 	substr(md5($account->User_ID.$account->EMail.( rand() * 100)), 0, 30);
			
			if(!$validation){
			 	$account->setMeta('idActive', $idactive);
			}
			
			$link = Blog::GetInfo('uri').'active-account/?id='.$idactive.'&email=' . $account->EMail;
			
			//envoi de l'e-mail d'activation
			$mail = 		new Mail();
			$mail->From = 	Blog::GetInfo('mailregister');
			$mail->addMailTo($account->EMail);

			$mail->setType(Mail::HTML);
			$mail->setSubject(MUI("Confirmation de votre adresse e-mail sur") ." ".Blog::GetInfo('name'));
			
			$mail->Message = '
				<html>
				<head>
					<title>' . MUI("Confirmation de votre adresse e-mail") . '</title>
				</head>
				<body>
					
					<p>' . MUI("Bonjour") . ' '.$account->Name . ' ' . $account->FirstName .',</p>
					
					<p>' . MUI("Vous avez reçu ce message de") . ' '.Blog::GetInfo('name').' ' . MUI("parce que votre adresse de messagerie a été utilisée pour vous enregistrer sur notre site.") . '
					' . MUI("Si vous pensez que ce fut une erreur d'ignorer ce message ou le supprimer") . '.</p>
					<p>
					------------------------------------------------<br />
					' . MUI("Vos codes d'accès").'<br />
					------------------------------------------------</p>
					<p>
					' . MUI("Identifiant") . ' : '.$account->Login.'<br />
					' . MUI("Mot de passe"). ' : '.$mdp.'
					</p>';
			
			if(!$validation){// le compte ne doit pas être validé par un admin
				$mail->Message .= '<p>
					------------------------------------------------<br />
					' . MUI("Instructions") . '<br />
					------------------------------------------------
					</p>
					<p>' . MUI("Merci de vous être enregistré sur notre site.") . '<br />
					' . MUI("Vous devez vérifier votre compte de messagerie électronique, pour empêcher les abus dans le système et de spam"). '.<br />
					' . MUI("Pour activer votre compte, vous devez visiter le lien suivant") . ' :</p>
					<p>
					<a href="'.$link.'">'.$link.'</a>
					</p>';
			
			}else{//validation par un admin
				$mail->Message .= '<p>
					------------------------------------------------<br />
					' . MUI("Instructions") . '<br />
					------------------------------------------------
					</p>
					<p>' . MUI("Merci de vous être enregistré sur notre site.") . '<br />
					' . MUI("Votre compte est actuellement en attente de validation par un administrateur. Vous serez informé par e-mail lorsque votre compte sera activé"). '
					</p>';
			}
			
			$mail->Message .= '
					<p>' . MUI("Contactez un administrateur pour résoudre le problème") . ' : <a href="'.Blog::GetInfo('page:contact').'">'.Blog::GetInfo('page:contact').'</a></p>
					
					<p>
					' . MUI("Cordialement") . ',<br />
					' . MUI("L'équipe de") . ' '.Blog::GetInfo('title').'</p>
				</body>
				</html>';
			//
			// Envoi du message à l'utilisateur
			//	
			if(!@$mail->send()){
				if(!(strpos(URI_PATH, '127.0.0.1') !== false)){
					$account->delete();
					BlogPress::SetError('code002');
				}				
			}
			//
			// Création du message pour les administrateurs
			//
			$string = $validation ? MUI('Vous devez valider ce compte afin qu\'il accède à votre site !') : MUI('Aucune action de votre part n\'est requise.');
				
			$mail = 		new Mail();
			$mail->From = 	Blog::GetInfo('mailinfo');
			$mail->addMailTo(Blog::GetInfo('contacts'));

			$mail->setType(Mail::HTML);
			$mail->setSubject(MUI("Nouvelle inscription sur") ." ".Blog::GetInfo('name'));
			
			$mail->Message = '
				<html>
				<head>
					<title>' . MUI("Nouvelle inscription sur") . '</title>
				</head>
				<body>
					
					<p>' . MUI("Bonjour") .',</p>
					
					<p>' . MUI("Un nouveau compte vient d'être crée  sur") .' ' . Blog::GetInfo('host') . '.
					
					<p>
					------------------------------------------------<br />
					' . MUI("Informations").'<br />
					------------------------------------------------</p>
					<p>
					' . MUI("Utilisateur") . ' : '. ' '.$account->Name . ' ' . $account->FirstName .',</p>
					' . MUI("E-mail") . ' : '.$account->EMail.'<br />
					' . MUI("Identifiant") . ' : '.$account->Login.'<br />
					' . MUI("Mot de passe"). ' : '.$mdp.'
					</p>
					<p>' . $string . '</p>
					<p>
					' . MUI("Cordialement") . ',<br />
					' . MUI("L'équipe de") . ' '.Blog::GetInfo('title').'</p>
				</body>
				</html>';
			
			@$mail->send();
				
		}else{
			BlogPress::SetError('code001');
		}
		
	}	
/**
 * BlogPressRegister.onBeforeForm() -> void
 *
 * Cette méthode permet d'afficher des données en tête du formulaire si le formulaire déclenche l'événement `blog:form.before`.
 *
 * #### Exemple
 *
 *     <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
 *     <?php
 *         Blog::Fire('form.before'); 
 *     ?>
 *     Formulaire
 *     <?php
 *         Blog::Fire('form.after'); 
 *     ?>
 *     </form>
 *
 **/
	public static function onBeforeForm(){
		if(System::GetCMD() != 'blogpress.register.submit') return;
		
		if(BlogPress::IsError()){
					
			if(strpos(BlogPress::GetError(), 'code002') !== false){
				echo '<div class="box-form-error">
					<h2>' . MUI('Une erreur est survenue lors de la création de votre compte') .' (code: 002)</h2>
					<p>' . MUI('Une erreur technique est survenue. L\'équipe technique travail à la résolution du problème, merci de retenter votre inscription un peu plutard !').'</p>
					<p>' . MUI('Cordialement').',</p>
					<p>' . MUI('L\'équipe de') .' '. Blog::GetInfo('title').'</p>
				</div>';
				
			}elseif(strpos(BlogPress::GetError(), 'code002') !== false){
				echo '<div class="box-form-error">
						<h2>' . MUI('Une erreur est survenue lors de la création de votre compte').' (code: 001)</h2>
						<p>' . MUI('Une erreur technique est survenue. L\'équipe technique travail à la résolution du problème, merci de retenter votre inscription un peu plutard !').'</p>
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
					<h2>' . MUI('Vos compte est créé !') . '</h2>
					<p>' . MUI('Un e-mail vient de vous être envoyé afin de valider votre compte. Merci de verifier et cliquer sur le lien qui vous a été transmis.').'</p>
				</div>				
				';
				
				foreach($_POST as $key => $value){
					if($key == 'cmd') continue;
					$_POST[$key] = '';	
				}				
		}
	}
/**
 * BlogPressRegister.onAfterForm() -> void
 *
 * Cette méthode permet d'afficher des données en pied de formulaire si le formulaire déclenche l'événement `blog:form.after`.
 *
 * #### Exemple
 *
 *     <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
 *     <?php
 *         Blog::Fire('form.before'); 
 *     ?>
 *     Formulaire
 *     <?php
 *         Blog::Fire('form.after'); 
 *     ?>
 *     </form>
 *
 **/
	public static function onAfterForm(){
		
	}
/**
 * BlogPressRegister.DrawFieldTypeAccount([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de selection du type de compte `Particulier` ou `Professionnel`.
 **/	
	static function DrawFieldTypeAccount($echo = true){
		if(!$echo) ob_start();	
			
		$default = empty($_POST['TypeAccount']) ? '0' : @$_POST['TypeAccount'];
		
		?>
        <select name="TypeAccount" class="box-select typeaccount" id="TypeAccount">
            <option value="0"<?php echo $default == '0' ? ' selected' : ''; ?>><?php echo MUI('Particulier') ?></option>
            <option value="1"<?php echo $default == '1' ? ' selected' : ''; ?>><?php echo MUI('Professionnel') ?></option>
        </select>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldLegalStatutes([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de selection du type de la société.
 **/	
	static function DrawFieldLegalStatutes($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['LegalStatut']) ? '0' : @$_POST['LegalStatut'];
		
		?>
        <select name="LegalStatut" class="box-select legalstatut" id="LegalStatut">
            <option value="0" selected><?php echo MUI('- Choisissez -') ?></option>
            <?php self::DrawLegalStatutes($default)?>
        </select>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldServices([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de selection du service de l'entreprise.
 **/	
	static function DrawFieldServices($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Service']) ? '' : @$_POST['Service'];
		
		?>
     	<select name="Service" class="box-select">
            <option value="" selected><?php echo MUI('- Choisissez -') ?></option>
            <?php self::DrawServices($default); ?>
        </select>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldSectors([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de selection du secteur d'activité de l'entreprise.
 **/	
	static function DrawFieldSectors($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Sector']) ? '' : @$_POST['Sector'];
		
		?>
     	<select name="Sector" class="box-select">
            <option value="" selected><?php echo MUI('- Choisissez -') ?></option>
            <?php self::DrawSectors($default); ?>
        </select>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldWorkforce([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de selection de l'effectif de l'entreprise.
 **/	
	static function DrawFieldWorkforce($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Workforce']) ? '' : @$_POST['Workforce'];
		
		?>
     	<select name="Workforce" class="box-select">
            <option value="" selected><?php echo MUI('- Choisissez -') ?></option>
            <?php self::DrawWorkforce($default); ?>
        </select>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldCivility([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de selection de la civilité.
 **/	
	static function DrawFieldCivility($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Civility']) ? 'M.' : @$_POST['Civility'];
		
		?>
        <select class="box-select" name="Civility" id="Civility">
            <option value="M."<?php echo $default == 'M.' ? ' selected' : ''; ?>><?php echo MUI('M.') ?></option>
            <option value="Mlle."<?php echo $default == 'Mlle.' ? ' selected' : ''; ?>><?php echo MUI('Mlle.') ?></option>
            <option value="Mme."<?php echo $default == 'Mme.' ? ' selected' : ''; ?>><?php echo MUI('Mme.') ?></option>
        </select>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldCompany([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie société.
 **/	
	static function DrawFieldCompany($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Company']) ? '' : @$_POST['Company'];
		
		?>
        <input id="Company" type="text" name="Company" maxlength="100" value="<?php echo @$default ?>" />
        <?php
		
		if(BlogPress::Meta('BP_REGISTER_TYPE') == 1):
		?>
        	<input type="hidden" value="1" name="TypeAccount" />
		<?php
		endif;
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldSiretNumber([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie Numéro de Siret.
 **/	
	static function DrawFieldSiretNumber($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Siret']) ? '' : @$_POST['Siret'];
		
		?>
       	<input id="Siret" type="text" name="Siret" maxlength="14" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldTvaIntraNumber([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie Numéro de TVA Intra.
 **/	
	static function DrawFieldTvaIntraNumber($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['TVA_Intra']) ? '' : @$_POST['TVA_Intra'];
		
		?>
       	<input id="TVA_Intra" type="text" name="TVA_Intra" maxlength="30" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldName([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du nom.
 **/	
	static function DrawFieldName($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Name']) ? '' : @$_POST['Name'];
		
		?>
       	<input id="Name" type="text" name="Name" maxlength="100" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldFirstName([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du prénom.
 **/	
	static function DrawFieldFirstName($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['FirstName']) ? '' : @$_POST['FirstName'];
		
		?>
       	<input id="FirstName" type="text" name="FirstName" maxlength="100" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldLogin([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du login.
 **/	
	static function DrawFieldLogin($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Login']) ? '' : @$_POST['Login'];
		
		?>
       	<input id="Login" type="text" name="Login" maxlength="50" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldEmail([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie de l'e-mail.
 **/	
	static function DrawFieldEmail($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['EMail']) ? '' : @$_POST['EMail'];
		
		?>
       	<input id="EMail" type="text" class="box-input type-email" name="EMail" maxlength="50" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldPassword([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du mot de passe.
 **/	
	static function DrawFieldPassword($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Password']) ? '' : @$_POST['Password'];
		
		?>
       	<input id="Password" type="password" name="Password" maxlength="15" value="<?php echo $default; ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldPhone([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du mot de passe.
 **/	
	static function DrawFieldPhone($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Phone']) ? '' : @$_POST['Phone'];
		
		?>
       	<input id="Phone" type="text" name="Phone" maxlength="20" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldMobile([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du mot de passe.
 **/	
	static function DrawFieldMobile($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Mobile']) ? '' : @$_POST['Mobile'];
		
		?>
       	<input id="Mobile" type="text" name="Mobile" maxlength="20" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldAddress([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie de l'adresse.
 **/	
	static function DrawFieldAddress($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Address']) ? '' : @$_POST['Address'];
		
		?>
       	<input id="Address" type="text" name="Address" maxlength="255" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldCP([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie de l'adresse.
 **/	
	static function DrawFieldCP($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['CP']) ? '' : @$_POST['CP'];
		
		?>
       	<input id="CP" type="text" class="box-cp field-cp" data-link="<?php Blog::Info('ajax.safe'); ?>" name="CP" maxlength="5" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldCity([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie de l'adresse.
 **/	
	static function DrawFieldCity($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['City']) ? '' : @$_POST['City'];
		
		?>
       	<input id="City" type="text" name="City" maxlength="100" class="box-city" data-link="<?php Blog::Info('ajax.safe'); ?>" data-linkto="field-cp" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawFieldCountry([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie de l'adresse.
 **/	
	static function DrawFieldCountry($echo = true){
		if(!$echo) ob_start();	
		
		$default = empty($_POST['Country']) ? '' : @$_POST['Country'];
		
		?>
       	<input id="Country" type="text" name="Country" maxlength="100" class="box-input-completer" data-type="countries" value="<?php echo $default ?>" />
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawLoginProposed([echo]) -> void | String
 * - echo (Boolean): Si la valeur est false, la méthode retournera la balise sous forme de chaine.
 *
 * Cette méthode affiche le champ de saisie du login.
 **/	
	static function DrawLoginProposed($echo = true){
		if(!$echo) ob_start();
		     
		if(!empty($_POST['Login']) && User::ByLogin($_POST['Login'])):
		
			$nb = 		Sql::Count(User::TABLE_NAME, 'Login like "'.$_POST['Login'].'%"');
			$array = 	array(
							strtolower($_POST['Name'].'.'.$_POST['FirstName']),
							strtolower($_POST['FirstName'].'.'.$_POST['Name']), 
							$_POST['Login'].$nb, 
							$_POST['Login'].($nb+1)
						);
			?>
            <table class="login-alternate">
            <tbody>
            <?php
				foreach($array as $value):
					if(!User::ByLogin($value)) :
					?>
						<tr><td><input type="radio" class="box-checkbox type-radio" name="LoginAlternate" value="<?php echo $value; ?>" /></td><td><?php echo $value; ?></td></tr>			
					<?php
					endif;
				endforeach;
			?>
            </tbody>
			</table>
            <?php
			
		endif;
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.Draw() -> void
 * Cette méthode créée le formulaire d'enregistrement à partir des paramètres configurés dans BlogPress.
 **/
 	static function Draw($echo = true){
		
		if(!$echo) ob_start();
		?>
        <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
            <input type="hidden" name="cmd" value="blogpress.register.submit" />
            <?php 
				Blog::Fire('form.before'); 
				
				switch(BlogPress::Meta('BP_REGISTER_TYPE')):
					default:
					case 0:break;
					case 2:
						?>
                        <table class="table-form form-table type-account">
            			<tbody>
						<tr class="row-type"><th><label for="TypeAccount"><?php echo MUI('Vous êtes un') ?></label></th>
                        <td>
                        	<?php self::DrawFieldTypeAccount(); ?>
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
                                <?php self::DrawFieldLegalStatutes()?>
                            </td>
                            </tr>
                            <tr class="type-pro row-societe"><th><label for="Company"><?php echo MUI('Raison sociale') ?> *</label></th>
                            <td class="box-flag type-right" title="<?php echo MUI('Saisissez ici le nom de votre société') ?>">
                                <?php self::DrawFieldCompany()?>
                                
                            </td>
                            </tr>
                            
                            <tr class="type-pro row-siret"><th><label for="Siret"><?php echo MUI('N° Siret') ?></label></th>
                            <td class="box-flag type-right" title="<?php echo MUI('Saisissez ici le numéro de siret de votre société'); ?>">
                                <?php self::DrawFieldSiretNumber()?></td>
                            </tr>
                            
                            <tr class="type-pro row-tva-intra"><th><label for="TVA_Intra"><?php echo MUI('N° TVA intracommunautaire') ?></label></th>
                            <td class="box-flag type-right" title="<?php echo MUI('Saisissez ici le numéro de TVA intracommunautaire de votre société'); ?>">
                                <?php self::DrawFieldTVAIntraNumber()?></td>
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
                <td><?php self::DrawFieldCivility(); ?></td>
                </tr>
                <tr class="box-flag type-right row-name" title="<?php echo MUI('Saisissez ici votre nom entre 3 et 100 caractères') ?>">
                    <th><label for="Name"><?php echo MUI('Nom') ?> *</label></th>
                    <td><?php self::DrawFieldName(); ?></td>
                </tr>
                <tr class="box-flag type-right row-firstname" title="<?php echo MUI('Saisissez ici votre prénom entre 3 et 100 caractères'); ?>">
                    <th><label for="FirstName"><?php echo MUI('Prénom') ?> *</label></th>
                    <td><?php self::DrawFieldFirstName(); ?></td>
                </tr>
                <tr class="box-flag type-right row-login" title="<?php echo MUI('Saisissez ici votre pseudo entre 3 et 50 caractères') ?>">
                    <th><label for="Login"><?php echo MUI('Pseudo'); ?> *</label></th>
                    <td><?php self::DrawFieldLogin(); ?></td>
                </tr>
                
                <!--gestion du login-->
                <?php
                    if(!empty($_POST['Login']) && User::ByLogin($_POST['Login'])):
                ?>
                
                <tr>
                    <th colspan="2" class="login-switch"><label ><?php echo MUI('Nous vous proposons les pseudos suivants') ?> :</label></th>
                </tr>
                <tr>
                    <td colspan="2">
                        <?php self::DrawLoginProposed(); ?>
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
                
                <?php
                    if(BlogPress::Meta('BP_REGISTER_ADDRESS')):
                ?>
                
                <tr class="row-address">
                    <th><label for="Address"><?php echo MUI('Adresse') ?></label></th>
                    <td><?php self::DrawFieldAddress(); ?></td>
                </tr>
                
                <tr class="row-cp">
                    <th><label for="Address"><?php echo MUI('Code postal') ?></label></th>
                    <td><?php self::DrawFieldCP(); ?></td>
                </tr>
                
                <tr class="row-city">
                    <th><label for="City"><?php echo MUI('Ville') ?></label></th>
                    <td><?php self::DrawFieldCity(); ?></td>
                </tr>
                
                <tr class="row-country">
                    <th><label for="Country"><?php echo MUI('Pays') ?></label></th>
                    <td><?php self::DrawFieldCountry(); ?></td>
                </tr>
                
                <?php
                    endif;
                ?>
                
                <tr class="row-mail">
                    <th><label for="EMail"><?php echo MUI('E-mail') ?> *</label></th>
                    <td><?php self::DrawFieldEmail(); ?></td>
                </tr>
				
				<?php
                    if(BlogPress::Meta('BP_REGISTER_PHONE')):
                ?>
                
                <tr class="row-phone">
                    <th><label for="Phone"><?php echo MUI('Téléphone') ?> <span class="type-pro">*</span></label></th>
                    <td><?php self::DrawFieldPhone(); ?></td>
                </tr>
                
                <tr class="row-mobile">
                    <th><label for="Mobile"><?php echo MUI('Portable') ?></label></th>
                    <td><?php self::DrawFieldMobile(); ?></td>
                </tr>
                
                <?php
                    endif;
                ?>
                
                <?php
                    if(!BlogPress::Meta('BP_REGISTER_PASS_AUTO')):
                ?>
                
                <tr class="box-flag type-right row-pass" title="<?php echo MUI('Saisissez ici le mot de passe de votre compte. Votre mot de passe doit être entre 7 et 15 caractères') ?>">
                    <th><label for="Password"><?php echo MUI('Mot de passe'); ?> *</label></th>
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
				if(BlogPress::Meta('BP_REGISTER_TYPE') != 0):
			?>
            <fieldset class="complementary type-pro">
            	<legend><?php echo MUI('Mieux vous connaitre') ?></legend>
            
                <table class="table-form form-table">
                <tbody>  
                
                <?php if(self::HaveService()) : ?>
                <tr class="row-service"><th><label for="Service"><?php echo MUI('Service') ?></label></th>
                <td>
                	<?php self::DrawFieldServices(); ?>
                </td>
                </tr>
                <?php endif; ?>
                
                <?php if(self::HaveSector()) : ?>
                <tr class="row-secteur"><th><label for="Sector"><?php echo MUI('Secteur d\'activité') ?></label></th>
                <td>
                    <?php self::DrawFieldSectors(); ?>
                </td>
                </tr>
                <?php endif; ?>
                
                <?php if(self::HaveWorkforce()) : ?>
                <tr class="row-effectif"><th><label for="Workforce"><?php echo MUI('Effectif de la société') ?></label></th>
                <td>
                    <?php self::DrawFieldWorkforce(); ?>
                </td>
                </tr>
                <?php endif; ?>
                
                </tbody>
                </table>
                
            </fieldset>
           	<?php
				endif;
			?>
                
			<?php 
                Blog::Fire('form.after', 'register'); 
            ?>
            
        	<p class="p-submit"><span class="button"><input type="submit" value="<?php echo MUI('M\'inscrire'); ?>" class="icon-user-add" /></span></p>
        </form>
        <?php
		
		if(!$echo){
			return ob_get_clean();
		}
	}
/**
 * BlogPressRegister.DrawLegalStatutes() -> void
 * Cette méthode affiche la liste des secteurs d'activités.
 **/
 	static public function DrawLegalStatutes($default = NULL){
		
		$array = BlogPress::Meta('BP_LEGAL_STATUTES');
		
		if(!is_array($array)){
			BlogPress::Configure();
			$array = BlogPress::Meta('BP_LEGAL_STATUTES');
		}
		$opentag = false;
		foreach($array as $options):
			
			$options =  new BpFormOption($options);
			
			if(empty($options->type)):
			?>
				<option value="<?php echo $options->text; ?>"<?php echo $default == $options->text ? ' selected' : ''; ?>><?php echo MUI($options->text); ?></option>
			<?php
			else:
				if($opentag):
				?></optgroup><?php
				endif;
				$opentag = true;
			?>
				<optgroup label="<?php echo $options->text; ?>"><?php echo MUI($options->text); ?>
			<?php
			endif;
			
		endforeach;
		
		if($opentag):
		?></optgroup><?php
		endif;
	}
/**
 * BlogPressRegister.DrawSectors() -> void
 * Cette méthode affiche la liste des secteurs d'activités.
 **/
 	static public function DrawSectors($default = NULL){
		
		$array = BlogPress::Meta('BP_SECTORS');
		
		if(!is_array($array)){
			BlogPress::Configure();
			$array = BlogPress::Meta('BP_SECTORS');
		}
		$opentag = false;
		foreach($array as $options):
			
			$options =  new BpFormOption($options);
		
			if(empty($options->type)):
			?>
				<option value="<?php echo $options->text; ?>"<?php echo $default == $options->text ? ' selected' : ''; ?>><?php echo MUI($options->text); ?></option>
			<?php
			else:
				if($opentag):
				?></optgroup><?php
				endif;
				$opentag = true;
			?>
				<optgroup label="<?php echo $options->text; ?>"><?php echo MUI($options->text); ?>
			<?php
			endif;
			
		endforeach;
		
		if($opentag):
		?></optgroup><?php
		endif;
	}
/**
 * BlogPressRegister.DrawServices() -> void
 * Cette méthode affiche la liste des secteurs d'activités.
 **/
 	static public function DrawServices($default = NULL){
		
		$array = BlogPress::Meta('BP_SERVICES');
		
		if(!is_array($array)){
			BlogPress::Configure();
			$array = BlogPress::Meta('BP_SERVICES');
		}
		
		$opentag = false;
		foreach($array as $options):
		
			$options =  new BpFormOption($options);
			
			if(empty($options->text)) continue;
			
			if(empty($options->type)):
			?>
				<option value="<?php echo $options->text; ?>"<?php echo $default == $options->text ? ' selected' : ''; ?>><?php echo $options->text; ?></option>
			<?php
			else:
				if($opentag):
				?></optgroup><?php
				endif;
				$opentag = true;
			?>
				<optgroup label="<?php echo $options->text; ?>"><?php echo $options->text; ?>
			<?php
			endif;
			
		endforeach;
		
		if($opentag):
		?></optgroup><?php
		endif;
	}
/**
 * BlogPressRegister.DrawWorkforce() -> void
 * Cette méthode affiche la liste des effectifs des emploiés d'une entreprise.
 **/
 	static public function DrawWorkforce($default = NULL){
		
		$array = BlogPress::Meta('BP_WORKFORCE');
		
		if(!is_array($array)){
			BlogPress::Configure();
			$array = BlogPress::Meta('BP_WORKFORCE');
		}
		$opentag = false;
		foreach($array as $options):
		
			$options =  new BpFormOption($options);
		
			if(empty($options->type)):
			?>
				<option value="<?php echo $options->text; ?>"<?php echo $default == $options->text ? ' selected' : ''; ?>><?php echo $options->text; ?></option>
			<?php
			else:
				if($opentag):
				?></optgroup><?php
				endif;
				$opentag = true;
			?>
				<optgroup label="<?php echo $options->text; ?>"><?php echo $options->text; ?>
			<?php
			endif;
			
		endforeach;
		
		if($opentag):
		?></optgroup><?php
		endif;
	}
/**
 * BlogPressRegister.HaveService() -> Boolean
 * Cette méthode retourne vrai si le champs service contient au moins une ligne de données.
 **/
 	static public function HaveService($default = NULL){
		$array = BlogPress::Meta('BP_SERVICES');
		return !empty($array);
	}
/**
 * BlogPressRegister.HaveSector() -> Boolean
 * Cette méthode retourne vrai si le champs serteur contient au moins une ligne de données.
 **/
 	static public function HaveSector($default = NULL){
		$array = BlogPress::Meta('BP_SECTORS');
		return !empty($array);
	}	
/**
 * BlogPressRegister.HaveWorkforce() -> Boolean
 * Cette méthode retourne vrai si le champs effectif contient au moins une ligne de données.
 **/
 	static public function HaveWorkforce($default = NULL){
		$array = BlogPress::Meta('BP_WORKFORCE');
		return !empty($array);
	}
}

BlogPressRegister::Initialize();

class BpRegister extends BlogPressRegister{}

class BpFormOption extends ObjectTools{
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs > 0){
			if(is_object($arg_list[0]) || is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
	}
}
?>