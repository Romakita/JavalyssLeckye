<?php
/** section: Window Builder
 * class Form
 * Gestion du style des formulaires
 **/
class Form extends CssNode{
	public $input;
	public $field;
 
	public function __construct(){
		parent::__construct(false);
		
		$this->input = 	new ObjectMouseState(false);
		$this->select = new ObjectMouseState(false);
		$this->button = new ObjectMouseState(false);
		$this->field = 	new CssNode(false);
	}
}
?>