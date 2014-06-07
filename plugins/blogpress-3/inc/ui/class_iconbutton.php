<?php
/** section: BlogPress
 * class IconButton
 * includes Attributs
 * Cette classe créer un bouton avec icône au format 32x32 sans texte.
 **/
class IconButton extends Attributs{
/**
 * IconButton.Icon -> String
 * Icône du bouton.
 **/
	public $Icon =	'';
/**
 * IconButton.Link -> String
 * Lien de la page cible.
 **/
	public $Link =	'';
/**
 * new IconButton([link [, icon]])
 * - link (String): Lien de la page cible.
 * - icon (String): Classe CSS de l'icône.
 * 
 * Cette méthode créée une nouvelle instance d'[[IconButton]].
 **/
	function __construct($link = '', $icon = ''){
		$this->Icon = $icon;
		$this->Link = $link;
		
		$this->pushAttr('class', 'button-icon');
	}
/**
 * IconButton.toString() -> String
 *
 * Convertie l'instance en chaine de caractère HTML.
 **/
 	public function __toString(){
				
		if(preg_match('/\./', $this->Icon)){
			return '<span '.$this->serializeAttributs().'><a href="'.$this->Link.'"><img src="'.$this->Icon.'" /></a></span>';
		}
		
		$this->pushAttr('class', ' icon-'.$this->Icon);
		return '<span '.$this->serializeAttributs().'><a href="'.$this->Link.'"></a></span>';
	}
}
?>