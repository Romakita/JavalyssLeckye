<?php
/** section: Window Builder
 * class Button
 * Gestion du style du bouton
 **/
class Button extends ObjectMouseState{
	public $large;
		
	public function __construct(){
		
		parent::__construct(false);
		
		$this->large = new ObjectMouseState();
		
		$this->min->height =			'20px';
		$this->max->width =				'200px';	
	}
}
?>