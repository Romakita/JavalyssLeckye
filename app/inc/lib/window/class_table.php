<?php
/** section: Window Builder
 * class Table
 **/
class Table extends CssNode{
	public $header;
	public $body;
	
	public function __construct(){
				
		parent::__construct(false);
		
		$this->header = 		new ObjectMouseState();
		$this->body = 			new CssNode(false);
		$this->body->header = 	new CssNode(false);
		$this->body->row =		new CssNode(false);
	}
}
/** section: Window Builder
 * class Row
 **/
class Row extends ObjectMouseState{
	public $odd;
	public $even;
	public $outline;
	public $selected;
	public $over;
	
	public function __construct(){
		
		parent::__construct(false);
		
		$this->odd = 			new CssNode(false);
		$this->even = 			new CssNode(false);
		$this->outline =		new CssNode(false);
		$this->outline->left = 	new CssBorder();
		$this->outline->right = new CssBorder();
		
	}
}
?>