<?php
/** section: Window Builder
 * class ObjectMouseState
 * Gestion du style d'un objet à différent état.
 **/
class ObjectMouseState extends CssNode{
	
	public $over;
	public $normal;
	public $selected;
	public $focus;
	
	public function __construct(){
		
		parent::__construct(false);
		
		$this->over = 		new CssNode(false);
		$this->normal =		new CssNode(false);
		$this->selected =	new CssNode(false);
		$this->submit =		new CssNode(false);
		$this->focus =		new CssNode(false);
	}
}
?>