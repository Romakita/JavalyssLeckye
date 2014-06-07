<?php
/** section: Window Builder
 * class Calendar
 **/
class Calendar extends CssNode{
	public $header;
	public $body;
	public $day;
	public $today;
	public $week;
	public $weekend;
	public $inter;
	
	public function __construct(){
		
		parent::__construct(false);
		
		$this->header = 			new CssNode(false);
		$this->body =				new CssNode(false);
		$this->day = 				new ObjectMouseState();
		$this->day->off =			new CssNode(false);
		$this->inter = 				new CssNode(false);
		$this->today =				new CssNode(false);
		$this->week =				new CssNode(false);
		$this->weekend =			new CssNode(false);
	}
}
?>