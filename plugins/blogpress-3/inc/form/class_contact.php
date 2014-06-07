<?php
/** section: Plugins
 * class BlogPressContact
 * includes iForm, iPage
 *
 * Cette classe gère le formulaire de contact du site.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_contact.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class BlogPressContact implements iForm, iPage{
/**
 * BlogPressContact.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	public static function Initialize(){
		System::Observe('blog:form.submit', array(__CLASS__,'onFormSubmit'));
		System::Observe('blog:form.commit', array(__CLASS__,'onFormCommit'));
		System::Observe('blog:form.before', array(__CLASS__,'onBeforeForm'));
		System::Observe('blog:startpage', array(__CLASS__,'onStartPage'));
		System::Observe('blog:startpage', array(__CLASS__,'onStart'));
	}
/**
 * BlogPressContact.onStart() -> void
 *
 * Cette méthode est lancé avant le chargement d'une page. 
 * Via cette méthode vous pouvez stopper le processus de chargement d'une page en fonction de son Permalien et charger une autre page de votre choix.
 **/
	public static function onStart(){
		
	}
/**
 * BlogPressContact.onStart() -> void
 *
 * Cette méthode est lancé pendant le chargement de la page. Il est possible d'afficher du contenu complémentaire dans cette page.
 **/
	public static function onStartPage(){
		$id = BlogPress::Meta('CONTACT_PAGE');
		
		if(!empty($id) && Post::ID() == $id){
			Post::Content(Post::Content()  . Blog::Contact(false));
		}
			
	}
/**
 * BlogPressContact.onFormSubmit() -> void
 *
 * Cette méthode teste les champs envoyés par le formulaire affiché dans la page source.
 *
 * Utilisez les méthodes [[System.GetCMD]] pour connaitre la commande et [[BlogPress.SetError]] pour indiquer une erreur dans le formulaire.
 **/
	public static function onFormSubmit(){
		
		if(System::GetCMD() != 'blogpress.contact.submit') return;
		
		$contacts = Blog::GetInfo('contact');
		
		if(empty($contacts)){
			BlogPress::SetError('La personne que vous désirez contacter n\'a pas mentionné d\'adresse e-mail pour être contacté.');	
			return;
		}
			
		//test du champ nom
		if($_POST['Name'] == ''){
			BlogPress::SetError('Veuillez saisir votre nom');
		}
		
		//test du champ prenom
		if($_POST['LastName'] == ''){
			BlogPress::SetError('Veuillez saisir votre prénom');
		}
		
		//test du champ e-mail
		if($_POST['EMail'] == ''){
			BlogPress::SetError('Veuillez saisir votre adresse e-mail');
		}else{
			$mail = preg_replace('/[_\\-]/', '', $_POST['EMail']);
			
			if(!preg_match_all(BlogPress::REG_EMAIL, $mail, $matches)){
				BlogPress::SetError('Veuillez saisir une adresse e-mail valide');
			}
		}
		
		//test du champ content
		if($_POST['Content'] == ''){
			BlogPress::SetError('Veuillez saisir votre message');
		}
	}
/**
 * BlogPressContact.onFormCommit() -> void
 *
 * Cette méthode permet d'enregistrer les données du formulaire seulement si aucune erreur n'a été signalé via la méthode [[BlogPress.SetError]].
 **/
	public static function onFormCommit(){
		if(System::GetCMD() != 'blogpress.contact.submit') return;
		
		
		//Création du mail
		$mail = 		new Mail();
		
		$mail->setType(Mail::HTML);
		$mail->From = 	$_POST['EMail'];
		
		$mail->addMailTo(Blog::GetInfo('contacts'));
		
		$mail->setSubject("Demande contact via ".Blog::GetInfo('name'));
								
		$mail->Message = '
		<html>
		<head>
			<title>Demande contact</title>
		</head>
		<body>
			<div class="header">
				<h3>Demande de contact</h3>';
				
		$mail->Message .= '<h4>Bonjour,</h4>';
		
		$mail->Message .= '
			</div>
			<div class="body">
				<p>Une demande de contact a &eacute;t&eacute; faite depuis votre site internet
				<a href="'.Blog::GetInfo('uri').'">'.str_replace('http://', '', Blog::GetInfo('uri')).'</a>.</p>
				
				<h4>Détails de la demande</h4>
				<table>
					<tr>
					<th style="text-align:left">Nom : </th><td>'.@$_POST['Name'].'</td>
					</tr>
					<tr>
					<th style="text-align:left">Prénom :</th><td>'.@$_POST['LastName'].'</td>
					</tr>
					<tr>
					<th style="text-align:left">E-mail :</th><td>'.@$_POST['EMail'].'</td>
					</tr>
					<tr>
					<th style="text-align:left">T&eacute;l :</th><td>'.@$_POST['Phone'].'</td>
					</tr>
				</table>
	
				<p><b>Sa demande</b> :</p>
				<div class="content-mail">
				'.nl2br(stripslashes(@$_POST['Content'])).'
				</div>
				
			</div>
		</body>
		</html>';
		
		if($mail->send()){
			$_POST['Name'] = 		'';
			$_POST['LastName'] = 	'';
			$_POST['EMail'] = 		'';
			$_POST['Phone'] = 		'';
			$_POST['Content'] = 	'';
		}else{
			BlogPress::IsError('Le serveur e-mail est inaccessible. L\'équipe informatique est en train de résoudre le problème. Veuillez réessayer un peu plutard.');
		}			
		
	}
/**
 * BlogPressContact.onBeforeForm() -> void
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
		
		if(System::GetCMD() != 'blogpress.contact.submit') return;
		
		if(BlogPress::IsError()){
			echo '
				<div class="box-form-error">
					<h2>Erreur dans le formulaire</h2>
					<p>Le formulaire a rencontré une ou plusieurs erreurs indiqués ci-après :</p>
					'.self::GetError().'
				</div>';
		}else{
			echo '
				<div class="box-form-valid">
					<h2>Demande correctement envoyée !</h2>
				</div>';
		}	
	}
/**
 * BlogPressContact.onAfterForm() -> void
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
 * BlogPressContact.Draw() -> void
 *
 * Cette méthode permet de contruire le contenu du page.
 **/
	static public function Draw($echo = true){
		
		if(!$echo) ob_start();
		?>
        <form action="<?php Blog::Info('submit'); ?>" method="post" name="formContact" class="form form-contact">
            <input type="hidden" name="cmd" value="blogpress.contact.submit" />
            <?php 
				BlogPress::Fire('form.before'); 
			?>           
        	<table class="table-form form-table">
            <tbody>
            <tr><th><label for="Name">Nom *</label></th>
            <td><input id="Name" type="text" name="Name" maxlength="255" value="<?php echo @$_POST['Name'] ?>" /></td>
            </tr>
            <tr><th><label for="LastName">Prénom *</label></th>
            <td><input id="LastName" type="text" name="LastName" maxlength="255" value="<?php echo @$_POST['LastName'] ?>" /></td>
            </tr>
            <tr><th><label for="EMail">E-mail *</label></th>
            <td><input id="EMail" type="text" name="EMail" maxlength="50" value="<?php echo @$_POST['EMail'] ?>" /></td>
            </tr>
            <tr><th><label for="Phone">Tel</label></th>
            <td><input id="Phone" type="text" name="Phone" maxlength="30" value="<?php echo @$_POST['Phone'] ?>" /></td>
            </tr>
            </tbody>
            </table>
            
            <p><label for="Content">Votre demande *</label></p>
            <p><textarea id="Content" name="Content"><?php echo @$_POST['Content'] ?></textarea></p>
            
			<?php 
                BlogPress::Fire('form.after', 'contact'); 
            ?>
            <p>
        	<span class="button"><input type="submit" value="Envoyer" class="icon-mail-forward" /></span>
            </p>
        </form>
        <?php
		if(!$echo){
			return ob_get_clean();
		}
		
	}
}
BlogPressContact::Initialize();
?>