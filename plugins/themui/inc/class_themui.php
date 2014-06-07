<?php
/** section: TheMUI
 * class TheMUI < Multilingual
 *
 * Cette méthode permet de gérer les fichiers de langage.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_template.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(class_exists('Multilingual')):

abstract class TheMUI extends Multilingual{
	
	private static $ListOfLangs = array(
		array('icon' => 'gb-flag', 'text' => 'Anglais', 'value' =>  'en'),
		array('icon' => 'de-flag', 'text' => 'Allemand', 'value' =>  'de'),
		array('icon' => 'cn-flag', 'text' => 'Chinois', 'value' =>  'zh'),
		array('icon' => 'es-flag', 'text' => 'Espagnol', 'value' =>  'es'),
		array('icon' => 'fr-flag', 'text' => 'Français', 'value' =>  'fr'),
		array('icon' => 'it-flag', 'text' => 'Italien', 'value' =>  'it'),
		array('icon' => 'jp-flag', 'text' => 'Japonais', 'value' =>  'ja'),
		array('icon' => 'pt-flag', 'text' => 'Portugais', 'value' =>  'pt')
	);
/*
 * TheMUI.onStartInterface() -> void
 **/	
	static public function onStartInterface(){
		
		$link = new Permalink();
		
		foreach(self::$ListOfLangs as $lang){
			if($link->strEnd('/'. $lang['value'])){
				self::SetLang($lang['value']);
				header('Location:' . substr($link, 0, strlen($link) - 3));
				break;
			}
		}
	}
/*
 * TheMUI.onBuildPost() -> void
 **/	
	static public function onBuildPost(){
		$post = 	Post::Current();
		$oPost = 	new Post((int) $post->Post_ID, false);
		
		$lpost = 	new Post((int) $post->getMeta(self::GetLang()), false);
		
		if($lpost->Post_ID != 0){
			$post->Title = 		$lpost->Title;
			$post->Content = 	str_replace($oPost->Content, $lpost->Content, $oPost->Content);
			$post->Meta = 		$lpost->Meta;
			
			Post::Current($post);
		}
	}
/*
 * TheMUI.onDrawPost() -> void
 **/	
	static public function onDrawPost($post){
		
		if($post){
			
			$oPost = 	new Post((int) $post->Post_ID, false);
			$lpost = 	new Post((int) $post->getMeta(self::GetLang()), false);
			
			if($lpost->Post_ID != 0){
								
				$post->Title = 		$lpost->Title;
				$post->Content = 	str_replace($oPost->Content, $lpost->Content, $oPost->Content);
				$post->Meta = 		$lpost->Meta;
				
				return $post;
			}
		}
	}
}

endif;
?>