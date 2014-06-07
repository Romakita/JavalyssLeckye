<?php
/*
Plugin Name: reCaptcha
Plugin URI:	http://www.javalyss.fr/extension/recaptcha/
Description: Cette extension ajoute la validation des formulaires par Captcha en utilisant le service reCaptcha.
Author: Lenzotti Romain
Version: 1.3
Author URI: http://www.javalyss.fr

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/


/** section: Plugins
 * class reCaptcha
 * includes iPlugin
 * 
 * Cette extension ajoute la validation des formulaires par Captcha en utilisant le service reCaptcha.
 **/
class reCaptcha implements iPlugin{
	
	static $error;
/**
 * reCaptcha.Initialize(() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	static public function Initialize(){
		
		System::addScript(Plugin::Uri().'recaptcha.js');
		System::addCSS(Plugin::Uri().'recaptcha.css');
			
		include('recaptchalib.php');
		
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('plugin.active', array(__CLASS__, 'Install')); 
		System::Observe('blog:form.submit', array(__CLASS__,'onFormSubmit'));
		System::Observe('blog:form.after', array(__CLASS__,'onAfterForm'));
		
	}
/**
 * reCaptcha.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/	
	static public function Install(){
		System::Meta('RECAPTCHA_AUTO', 1); 
		System::Meta('RECAPTCHA_THEME', 'red'); 
	}
/**
 * reCaptcha.Uninstall(eraseData) -> void
 * - eraseData (Boolean): Suppression de données. 
 *
 * Cette méthode désintalle  l'extension et supprime les données liées à l'extension si `eraseData` est vrai.
 **/	
	static public function Uninstall($eraseData = false){}
/**
 * reCaptcha.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){}
/**
 * reCaptcha.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande - en mode non connecté - et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	static public function execSafe($op){}
/**
 *
 **/	
	static public function onFormSubmit(){
		
		if(!empty($_POST["recaptcha_response_field"])) {
			$resp = recaptcha_check_answer (System::Meta('RECAPTCHA_PRIVATE_KEY'),
											$_SERVER["REMOTE_ADDR"],
											$_POST["recaptcha_challenge_field"],
											$_POST["recaptcha_response_field"]);
			
			if (!$resp->is_valid) {
				switch($resp->error){
					case 'invalid-site-private-key':
						BlogPress::SetError('Le clef privée reCaptcha est invalide');
						break;
					default:
					# set the error code so that we can display it
					self::$error = $resp->error;
					BlogPress::SetError('Le code Captcha est incorrect');		
				}
				
			}
		}else{
			BlogPress::SetError('Veuillez saisir le code captcha');
		}
	}
/*
 *
 **/	
	static public function onAfterForm($type = ''){
		if(System::Meta('RECAPTCHA_AUTO') == 1){
			
			if($type != 'connexion'){
				echo new self();
			}
		}
	}
	
	public function __toString(){	
		
		return '
		 <script type="text/javascript">
		 var RecaptchaOptions = {
			theme : \''.System::Meta('RECAPTCHA_THEME').'\'
		 };
		 </script>
		'.recaptcha_get_html(System::Meta('RECAPTCHA_PUBLIC_KEY'), self::$error);
	}
};

reCaptcha::Initialize();

?>