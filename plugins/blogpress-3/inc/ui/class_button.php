<?php
/** section: BlogPress
 * class Button
 * includes Attributs
 **/
class Button extends Attributs{
	public $Title = '';
	public $Link = 	''; 
		
	function __construct($link = '', $title = ''){
		$this->Link = 	$link;
		$this->Title =	$title;
		
		$this->pushAttr('class', 'box-simple-button');
	}
	
	final function __toString(){
		
		$string = 	'<span '.$this->serializeAttributs().'>';
		$string .= 	'<a href="'.$this->Link.'">'.$this->Title.'</a>';	
		$string .= 	'</span>';
		return $string;
	}
}
?>