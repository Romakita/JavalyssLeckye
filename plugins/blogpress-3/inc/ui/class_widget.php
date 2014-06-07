<?php
/**
 * class Widget
 * includes Attributs
 **/
class Widget extends Attributs{
	private $Array = array();
	
	function __construct(){
		$this->pushAttr('class', 'jwidget');
	}
	
/**
 * Widget.add(slide) -> void
 **/
	public function add($object){
		array_push($this->Array, $object);
	}
	
	final function __toString(){
		
		$string = '<div '.$this->serializeAttributs().'>';
		
		foreach($this->Array as $row){
			$string .= $row;
		}
		
		$string .= '</div>';
		return $string;
	}
}
?>