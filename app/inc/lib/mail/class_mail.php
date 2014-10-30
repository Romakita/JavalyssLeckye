<?php
/** section: Library
 * class Mail
 * Cette classe gère la construction et l'envoi d'e-mail avec pièce jointe.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mail.php
 * * Version : 1.2
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('Mail')):

include_once('class_phpmailer.php');

class Mail extends PHPMailer{
	const TAG_MESSAGE =				'#MESSAGE';
	const TAG_SUBJECT =				'#SUBJECT';
/**
 * Mail.VERSION -> String
 * Numéro de version de la bibliothèque.
 **/
	const VERSION = 				'1.2';
	const TEXT = 					'text/plain';
	const HTML = 					'text/html';
	const ALL = 					'all';
	const ALT =						'multipart/alternative';
	const MIXED =					'multipart/mixed';
	const RELATED =					'multipart/related';
	const RCPT =					'to';
	const CC =						'cc';
	const BCC =						'bcc';
	const LOW =						'low';
	const HIGH =					'high';
	const NORMAL =					'normal';					
/**
 * Mail#From -> String
 * Adresse de l'expéditeur
 **/	
	public $From =					'';
/**
 * Mail#AddrContact -> String
 * Adresse e-mail du webmaster du site.
 **/
	public $AddrContact =			'';	
/**
 * Mail#AddrAbuse -> String
 * Adresse e-mail du webmaster du site.
 **/
	public $AddrAbuse =				'';
/**
 * Mail#Template -> String
 * Contenu du template.
 **/	
	protected $Template =			'';
/**
 * Mail#Message -> String
 * Corps du message.
 **/
	public $Message =				'';
/**
 * Mail#RawMessage -> String
 * Corps du message.
 **/
	public $RawMessage =			'';
/**
 * Mail#Priority -> int
 * Priorité du mail. Par defaut l'attribut vaut 3.
 **/
	public $Priority =				3;
/**
 * Mail#mimetype -> String
 * `protected` Type d'affichage de l'e-mail. Soit `Mail.TEXT`, soit `Mail.HTML` ou les deux avec `Mail.ALL`.
 **/
 	public $mimetype =				self::ALL;
	
	public $CharSet =				'utf-8';
	public $FromName =				'';
/**
 * Mail#addAttach(link) -> Boolean
 * Mail#addAttach(linkList) -> Boolean
 * - link (String): Adresse e-mail à ajouter.
 * - linkList (Array): Liste des adresses e-mail à ajouter.
 *
 * Cette méthode ajoute une ou plusieurs pièces jointes.
 *
 * <p class="note">Cette méthode retourne faux si le fichier n'existe pas et stock la chaine `mail.type.error` avec l'index si `linkList` est un tableau dans [[Mail#error]]</p>
 *
 **/	
	public function addAttach($attachs, $name = '', $encoding = 'base64', $type = '', $disposition = 'attachment') {
				
		if(is_string($attachs)){
			
			return $this->AddAttachment($attachs, $name, $encoding, $type, $disposition);
						
		}
		
		if(is_array($attachs)){
			
			foreach($attachs as $attach){
				if(!$this->AddAttachment($attach)){
					return false;
				}
			}
		}
		
		return true;
	}
/**
 * Mail#addRecipient(mail) -> Boolean
 * Mail#addRecipient(maillist) -> Boolean
 * - mail (String): Adresse e-mail à ajouter.
 * - maillist (String): Liste des adresses e-mail à ajouter.
 *
 * Cette méthode ajoute un ou plusieurs destinataires au mail.
 *
 * <p class="note">Cette méthode retourne faux si la syntaxe de l'e-mail `mail` est incorrect et stock la chaine `mail.address.invalid.syntax` dans [[Mail#error]]</p>
 *
 **/
	public function addRecipient($mails, $name = '') {
			
		if(is_string($mails)){
			return $this->AddAnAddress(self::RCPT, $mails);
		}
		
		if(is_array($mails)){
			foreach($mails as $mail){
				if(!$this->AddAnAddress(self::RCPT, $mails, $name)){
					return false;	
				}
			}
		}
		return true;
	}
/**
 * Mail#addCc(mail) -> Boolean
 * Mail#addCc(maillist) -> void
 * - mail (String): Adresse e-mail à ajouter.
 * - maillist (String): Liste des adresses e-mail à ajouter.
 *
 * Cette méthode ajoute un ou plusieurs destinataires au mail en copie.
 *
 * <p class="note">Cette méthode retourne faux si la syntaxe de l'e-mail `mail` est incorrect et stock la chaine `mail.address.invalid.syntax` dans [[Mail#error]]</p>
 *
 * <p class="note">Dans le cas de l'ajout d'une liste d'adresse avec `maillist`, la méthode retourne toujours vrai. Pour savoir si la méthode à rencontré une erreur sur l'une des adresses e-mail utilisez la méthode Mail#getError()</p>
 **/
	public function addCc($mails, $name = '') {
		
		if(is_string($mails)){
			return $this->AddAnAddress(self::CC, $mails, $name);
		}
		
		if(is_array($mails)){
			foreach($mails as $mail){
				if(!$this->AddAnAddress(self::CC, $mail)){
					return false;	
				}
			}
		}
		
		return true;
	}
/**
 * Mail#addBcc(mail) -> Boolean
 * Mail#addBcc(maillist) -> void
 * - mail (String): Adresse e-mail à ajouter.
 * - maillist (String): Liste des adresses e-mail à ajouter.
 *
 * Cette méthode ajoute un ou plusieurs destinataires au mail en copie caché.
 *
 * <p class="note">Cette méthode retourne faux si la syntaxe de l'e-mail `mail` est incorrect et stock la chaine `mail.address.invalid.syntax` dans [[Mail#error]]</p>
 *
 * <p class="note">Dans le cas de l'ajout d'une liste d'adresse avec `maillist`, la méthode retourne toujours vrai. Pour savoir si la méthode à rencontré une erreur sur l'une des adresses e-mail utilisez la méthode Mail#getError()</p>
 **/
	public function addBcc($mails, $name = '') {
		if(is_string($mails)){
			return $this->AddAnAddress(self::BCC, $mails, $name);
		}
		
		if(is_array($mails)){
			foreach($mails as $mail){
				if(!$this->AddAnAddress(self::BCC, $mail)){
					return false;	
				}
			}
		}
		return true;
	}
/** deprecated
 * Mail#addMailTo(mail, type) -> boolean
 * - mail (String): Adresse e-mail.
 * - type (String): Nom de la liste où doit être ajouté l'adresse, soit `Mail::RCPT`, `Mail::CC` ou `Mail::BCC`. Par défaut `type` vaut `Mail::RCPT`.
 * 
 * `final` Cette méthode ajoute une adresse e-mail à l'une des trois listes du mail, c'est-à-dire soit la liste des destinataires, 
 * soit la liste des adresses en copie ou enfin soit la liste des adresses en copie caché.
 *
 * <p class="note">Cette méthode retourne faux si la syntaxe de l'e-mail est incorrect et stock la chaine `mail.address.invalid.syntax` dans [[Mail#error]]</p>
 **/
	public function addMailTo($mails, $type = self::RCPT, $name = ''){
		
		if(is_string($mails)){
			return $this->AddAnAddress($type, $mails, $name);
		}
		
		if(is_array($mails)){
			foreach($mails as $mail){
				if(!$this->AddAnAddress($type, $mail)){
					return false;	
				}
			}
		}
		
		return true;
	}
/**
 * Mail#importTemplate(link) -> String
 * - link (String): Chemin du template.
 *
 * Cette méthode importe une template HTML pour votre e-mail.
 **/
	function importTemplate($link){
		
		if(Stream::Extension($link) == 'php'){
			ob_start();
			include($link);
			$this->Template = ob_get_clean();
		}else{
			$this->Template = Stream::Read($link);	
		}
				
		return $this->Template;
	}
/**
 * Mail#send() -> Boolean
 *
 * Cette fonction envoi l'e-mail aux destinataires demandés.
 **/
	public function send($type = ''){
		$this->error = '';
		
		if(empty($this->Subject)){
			$this->Subject = '(no subject)';
		}
		
		if(!empty($this->Template)){
			$this->Message =	str_replace(
									array(
										self::TAG_SUBJECT,
										self::TAG_MESSAGE,
									),
									array(
										$this->Subject,
										$this->Message
									),
									$this->Template
								);
								
			$this->Message = 	str_replace(URI_PATH, '', $this->Message);
			$this->Message = 	$this->MsgHTML($this->Message, ABS_PATH);
			$this->Template = 	'';
		}
		
		if(!empty($this->Message)){
			$this->Body = str_replace(array('€'), array('&euro;'), $this->Message);
		}
		
		return parent::Send();
	}
/**
 * Mail#setSubject(subject) -> String
 * - subject (String): Sujet du message.
 *
 * `final` Cette méthode assigne un sujet au message.
 **/
	public function setSubject($subject) {
		if(!empty($subject) && is_string($subject)) {
			$this->Subject = stripslashes($subject);
		}
		return $this;
	}
/**
 * Mail#setPriority(priority) -> String
 * - priority (String): Priorité du message.
 *
 * `final` Cette méthode change la priorité du message.
 *
 * Les différents types de priorité sont :
 *
 * * `Mail::LOW` : priorité faible.
 * * `Mail::NORMAL` : priorité normal. 
 * * `Mail::HIGH` : priorité haute.
 *
 **/
	public function setPriority($prio = self::NORMAL) {
				
		switch($prio) {
			case self::HIGH:
				$this->Priority = 1;
				break;
			
			default:
			case self::NORMAL:
				$this->Priority = 3;
				break;
				
			case selft::LOW:
				$this->Priority = 5;
			break;
		}
		return $this;
	}
/**
 * Mail#setType(type) -> String
 * - type (String): Sujet du message.
 *
 * `final` Cette méthode change le `mimetype` du message.
 *
 * Les différents `mimetype` ont :
 *
 * * `Mail::TEXT` : L'affichage de l'e-mail se fera en mode `text/plain`.
 * * `Mail::NORMAL` : L'affichage de l'e-mail se fera en mode `text/html`.
 * * `Mail::ALL` : L'e-mail sera écrit en `text/plain` et `text/html`.
 *
 **/
	public function setType($type){
		switch($type){
			case self::TEXT:
				$this->IsHTML(false);
				break;
			case self::HTML:
			case self::ALL:
				$this->IsHTML(true);
				break;	
			default:
				$this->IsHTML(true);
				break;
		}
	}
/**
 * Mail#setPath(path) -> String
 * - path (String): Répertoire d'envoi.
 *
 * Le paramètre `path` peut être utilisé pour passer des drapeaux additionnels comme options à la ligne de commande configurée pour être utilisée pour envoyer les mails en utilisant le 
 * paramètre de configuration `sendmail_path`. Par exemple, ceci peut être utilisé pour définir l'enveloppe de l'adresse de l'expéditeur lors de l'utilisation de `sendmail` avec l'option -f.
 *
 * L'utilisateur sous lequel tourne le serveur web doit être ajouté en tant qu'utilisateur de confiance dans la configuration de `sendmail` afin que l'en-tête X-Warning ne soit pas ajouté au message lorsque 
 * l'enveloppe de l'expéditeur (-f) est défini en utilisant cette méthode. Pour les utilisateurs de `sendmail`, ce fichier est /etc/mail/trusted-users.
 *
 **/	
	public function setPath($sendpath) {
		if(!empty($sendpath) && is_string($sendpath)) {
			$this->Path = $sendpath;
		}
		return $this;
	}

	function getInfo() {
		
		/*if(!empty($this->Template)){
			$this->Message = 	str_replace(
									array(
										'#SUBJECT',
										'#MESSAGE'
									),
									array(
										$this->Subject,
										$this->Message
									),
									$this->Template
								);
			$this->Template = '';
		}
		
		echo '<pre><code><u><b>Destinataire(s):</b></u> ' . htmlspecialchars($this->From) . "\n";
		echo '<u><b>Expediteur:</b></u> ' . htmlspecialchars(implode(',', $this->recipients)) . "\n";
		echo '<u><b>Sujet:</b></u> ' . utf8_decode($this->Subject) . "\n";
		
		if(!empty($this->copieconforme))
			echo '<u>Copie(s) conforme(s):</u> ' . htmlspecialchars(implode(',', $this->carbonCopy)) . "\n";
		if(!empty($this->copiecachee))
			echo '<u>Copie(s) cachee(s):</u> ' . htmlspecialchars(implode(',', $this->blindCarbonCopy)) . "\n";
		if(!empty($this->attachement))
			echo '<u>Piece(s) jointe(s):</u> ' . implode(',', $this->attachments) . "\n";
		if(!empty($this->sendmail_path))
			echo '<u>Commande:</u> ' . $this->Path ;
			
		echo '<u><b>Message:</b></u>' . "\n" . utf8_decode($this->drawHeader() . htmlentities($this->drawBody())). "\n";
		echo '</code></pre>';*/
	}
}
endif;
?>