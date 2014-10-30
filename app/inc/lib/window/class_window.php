<?php

/** section: Window Builder
 * class Window
 **/
class Window extends CssNode{
	public $header;
	public $menu;
	public $body;
	public $footer;
	
	public function __construct(){
		parent::__construct(false);
		//
		// Header
		//
		$this->header = 		new CssNode();
		$this->header->icon = 	new CssNode();
		$this->header->button = new CssNode();
		//
		// Menu
		//
		$this->menu = 			new CssNode();
		$this->menu->rubbon = 	new CssNode();
		//
		// Body
		//
		$this->body = 	new CssNode();
		//
		// Footer
		//
		$this->footer = new CssNode();
		$this->footer->pointer = new CssBackground();
	}
}
/** section: Window Builder
 * class TaskBar
 **/
class TaskBar extends CssNode{
	public $menu;
	public $clock;
	public function __construct(){
		
		parent::__construct(false);
		$this->menu = 	new CssNode(false);
		$this->clock =	new CssNode(false);
	}
}
/** section: Window Builder
 * class MinWin
 **/
class MinWin extends ObjectMouseState{	
	public $overflow = 'auto';
	public function __construct(){
		parent::__construct(false);
	}
}
?>