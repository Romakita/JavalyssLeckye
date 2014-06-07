<?php
/*
Plugin Name: Newsletter
Plugin URI:	http://www.javalyss.fr/marketplace/newsletter/
Description: Editez vos newsletter grâce à cette extension.
Author: Lenzotti Romain
Version: 1.0
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
define('NEWSLETTER_PATH', Plugin::Path());//chemin absolue du répertoire de l'extension ex : /www/plugins/pmo/
define('NEWSLETTER_URI', Plugin::Uri());//chemin absolue du répertoire de l'extension ex : /www/plugins/pmo/

class NewsletterPlugin{
	
	const REG_EMAIL =			"/([@]([a-z0-9]+)[\-]?([a-z0-9]+)[\.](([a-z]+)[\.]?([a-z]+)))/";
/**
 * NewsletterPlugin.Initialize() -> void
 *
 * Cette méthode ajoute les composants nécessaire son éxécution.
 **/	
	static function Initialize(){
		
		//
		// Inclusion des classes métiers
		//
		include('inc/class_newsletter_contact.php');
		include('inc/class_newsletter_email.php');
		include('inc/class_newsletter_model.php');
		//
		// Observation des événements
		//
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));	
		//
		// Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur installera votre module depuis le menu Extension du logiciel.
		//
		System::Observe('plugin.active', array(__CLASS__,'Install')); 
		//
		// Evenement plugin.active. Cette événement est lancé lorsque l'utilisateur désinstallera votre module depuis le menu Extension du logiciel.
		//
		System::Observe('plugin.deactive', array(__CLASS__,'Deactive'));
		//
		// Evenement plugin.configure. Cette événement est lancé lorsque l'utilisateur met à jour l'extension depuis Javalyss.fr ou un autre dépôt d'application.
		//
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		//
		// Ajout des composants nécessaires à la création d'interface dans le logiciel.
		//
		System::EnqueueScript('newsletter', Plugin::Uri().'js/newsletter.js');
		System::EnqueueScript('newsletter.email', Plugin::Uri().'js/newsletter_email.js');
		System::EnqueueScript('newsletter.model', Plugin::Uri().'js/newsletter_model.js');
		System::EnqueueScript('newsletter.model.angular', Plugin::Uri().'js/angularjs.js');
		System::EnqueueScript('newsletter.model.preview', Plugin::Uri().'js/html2canvas.js');
		
		System::AddCSS(Plugin::Uri().'css/newsletter.css');
		
		//detection des liens
		if(!class_exists('BlogPress')){
			self::onStart();
		}else{
			System::Observe('blog:start', array(__CLASS__, 'onStart'));
		}
				
	}
	
	
	static function onStart(){
		$link = Permalink::Get();
		
		if($link->match('/newsletter\/(.*)/')){
			
			$parameters = $link->getParameters();
			
			switch(@$parameters[1]){
				case 'subscribe':
										
					if(count($parameters) == 3){
						$mail = $parameters[2];
					}else{
						if(!empty($_GET['Email'])){
							$mail = $_GET['Email'];
						}else{
							if(!empty($_POST['Email'])){
								$mail = $_POST['Email'];
							}else{
								return;	
							}
						}
					}
					
					$mail = preg_replace('/[_\\-]/', '', $mail);
					
					if(!preg_match_all(self::REG_EMAIL, $mail, $matches)){
						return;
					}
					
					$o = new NewsletterContact();
					$o->Email = $mail;
					$o->commit();
					
					if(!class_exists('BlogPress')){
						
						header('Content-Type:text/html; charset=utf-8');
						
						echo "<h3>" . MUI('Vous suivez désormais la newsletter') . '</h3>';
						exit();
						
					}else{
						
						$post = 			new Post();
						$post->Name = 		Permalink::ToRel((string) $link);//on lui donne un nom unique						
						$post->Title =		MUI('Souscription à la newsletter');
						
						$post->Template =	'page-newsletter-subscribe.php'; //Une petite mise en page pré-développé pour se simplifier la vie.
						$post->Type =		'page';
						
						$post->Content = "<p>" . MUI('Vous suivez désormais la newsletter ! Vous pouvez à tous moment vous y désincrire en cliquant sur ce lien :') 
						. '</p><p><a href="'.Blog::GetInfo('uri').'newsletter/unsubscribe/'.$mail.'" class="button">'.MUI('Me désinscrire').'</a></p>';
						
						Post::Current($post);//on indique que le post en cours est celui-ci.
						//
						// #PHASE 4 : Indiquer à BlogPress que tout va bien
						//
						Template::ImportPage();		//on importe le template.
						BlogPress::StopEvent();		//on stop la propagation de l'événement startpage.
						
						return false;
					}
										
					break;
					
				case 'unsubscribe':
					
					if(count($parameters) == 3){
						$mail = $parameters[2];
					}else{
						if(!empty($_GET['Email'])){
							$mail = $_GET['Email'];
						}else{
							if(!empty($_POST['Email'])){
								$mail = $_POST['Email'];
							}else{
								return;	
							}
						}
					}
					
					$mail = preg_replace('/[_\\-]/', '', $mail);
					
					if(!preg_match_all(self::REG_EMAIL, $mail, $matches)){
						return;
					}
					
					$o = new NewsletterContact();
					$o->Email = $mail;
					$o->delete();
					
					if(!class_exists('BlogPress')){
						
						header('Content-Type:text/html; charset=utf-8');
						
						echo "<h3>" . MUI('Vous ne suivez plus la newsletter') . '</h3>';
						exit();
						
					}else{
						
						$post = 			new Post();
						$post->Name = 		Permalink::ToRel((string) $link);//on lui donne un nom unique						
						$post->Title =		MUI('Désabonnement de la newsletter');
						
						$post->Template =	'page-newsletter-unsubscribe.php'; //Une petite mise en page pré-développé pour se simplifier la vie.
						$post->Type =		'page';
						
						$post->Content = "<p>" . MUI('Vous ne suivez plus la newsletter !') .'</p>';
						
						Post::Current($post);//on indique que le post en cours est celui-ci.
						//
						// #PHASE 4 : Indiquer à BlogPress que tout va bien
						//
						Template::ImportPage();		//on importe le template.
						BlogPress::StopEvent();		//on stop la propagation de l'événement startpage.
						
						return false;
					}
					break;
					
				case 'preview':
				
					if(count($parameters) == 3){
						$o = new NewsletterEmail((int) $parameters[2]);
						if($o->Statut == 'draft'){
							return;	
						}
					}else{
						if(!empty($_POST['NewsletterEmail'])){
							$o = new NewsletterEmail($_POST['NewsletterEmail']);
						}else{
							return;
						}
					}
					
					$o->draw();
					exit();
					
			}
				
		}	
	}
/**
 * NewsletterPlugin.Install() -> void
 *
 * Cette méthode est appelée lorsque le logiciel installe l'extension.
 **/	
	static function Install(){
		
		NewsletterContact::Install();
		NewsletterEmail::Install();
		NewsletterModel::Install();
		
		
		$roles = Role::GetList();
		
		for($i = 0; $i < $roles['length']; $i++){
			self::addBroadcastGroup('Groupe ' . $roles[$i]['Name'], strtolower($roles[$i]['Name'].'@newsletter.fr'));
		}
	}
/**
 * NewsletterPlugin.Install() -> void
 *
 * Cette méthode est appelée lorsque le logiciel désinstalle l'extension.
 **/	
	static function Uninstall(){
		
	}
	
	static function exec($op){
		switch($op){
			case 'newsletter.db.configure':
				self::Install();
				break;	
		}
	}
	
	static function addBroadcastGroup($name, $value){
		
		$array = System::Meta('NEWSLETTER_GROUPS');
		
		if(empty($array)){
			$o = new stdClass();
			$o->value = 'subscribers@newsletter.fr';
			$o->text = 'Abonnées de la newsletter';
			
			$array = array($o);
		}
		
		for($i = 0; $i < count($array); $i++){
			if($array[$i]->value == $value){
				return true;
			}
		}
	
		
		$o = new stdClass();
		$o->value = $value;
		$o->text = $name;
		
		array_push($array, $o);
		usort($array, array(__CLASS__, 'onSort'));
				
		System::Meta('NEWSLETTER_GROUPS', $array);
	}
	
	static function getBroadcastGroups(){
		
		$array = System::Meta('NEWSLETTER_GROUPS');
		$list = array();
		
		foreach($array as $o){
			array_push($list, $o->value);	
		}
		
		return $list;
	}
	
	public static function onSort($a, $b){
		return strcmp(basename($a->text), basename($b->text));
	}
}

NewsletterPlugin::Initialize();

?>