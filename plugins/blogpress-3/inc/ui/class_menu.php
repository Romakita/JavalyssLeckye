<?php
/** section: BlogPress
 * class Menu
 * includes Attributs
 **/
class Menu extends Attributs{
	private $Array = array();
	function __construct(){
		$this->pushAttr('class', 'menu');	
	}
	
	public function add($link, $title){
		array_push($this->Array, array('title' => $title, 'link' => $link));
	}
	
	public function __toString(){
		$str  = '<ul '.$this->serializeAttributs().'>';
		
		foreach($this->Array as $row){
			
			$page = explode('/', $_SERVER['PHP_SELF']);
			$page = $page[count($page) -1];
			
			$page2 = explode('/', $row['link']);
			$page2 = $page2[count($page2) -1];
			
			if($page == $page2){
				$str .='<li class="selected"><a href="'.$row['link'].'"><span>'.$row['title'].'</span></a></li>';
			}else{
				$str .='<li><a href="'.$row['link'].'"><span>'.$row['title'].'</span></a></li>';
			}
			
		}
		
		$str .= '</ul>';
		return $str;
	}
}
?>