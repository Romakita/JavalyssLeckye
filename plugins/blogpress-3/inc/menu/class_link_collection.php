<?php
/**
 * class BlogPressLinks
 *
 * Cette classe gère une collection de lien.
 **/
class BlogPressLinks extends ObjectTools{
	public $exclude =		NULL;
	public $title =			'';
	public $more =			'plus';
	public $titleClass =	'';
	public $className = 	'';
/**
 * Links.Category -> String
 **/
	public $Category =			'Liens';
/**
 * Links.limits -> Number
 **/
	public $limits = 		5;
/**
 * Links.order -> Number
 **/
	public $order = 		0;
/**
 * Links.where -> String
 **/
	public $where =			'';
/**
 * Links.op -> String
 **/
	public $op = 			'-c';
	
	public $value =			'';
	
	public $append =		'';
/**
 * new Links()
 *
 * Cette méthode créée une nouvelle instance `Links`.
 **/
	function __construct($instance = NULL){
		if(is_object($instance) || is_array($instance)){
			foreach($instance as $key => $value){
				$this->$key = $value;
			}
		}
	}
	
	public static function Equals($link, $link2){
		if(!preg_match('/\/$/', $link)){
			$link = $link.'/';
		}
		
		if(!preg_match('/\/$/', $link2)){
			$link2 = $link2.'/';
		}
		
		return str_replace('www.', '', $link) == str_replace('www.', '', $link2);	
	}
/**
 * Links.Draw(options) -> void
 **/
	public static function Draw($array = array()){
		
		$string = 			'';
		$options = 			new self($array);
		$options->value = 	$options->Category;
		
		$links =  			BlogPressLink::GetList($options, $options);
		
		if(!$links){
			
			die(Sql::Current()->getRequest() . '  ' .Sql::Current()->getError());	
		}
		
		if($options->title != ''){
			$string = '<h3 class="'.$options->titleClass.'">' . $options->title;
		}
		
		if($links['maxLength'] > $links['length']){
			$string .= '<a class="more">'.$options->more.'</a>';	
		}
		
		if($options->title != ''){
			$string .= '</h3>';
		}	
		
		$string .= '<ul class="list links-list link-'.strtolower($options->Category).' '.$options->className.'">';
		
		for($i = 0; $i < $links['length']; $i++){
			$link = 	new BlogPressLink($links[$i]);
			
			$selected = self::Equals(Blog::GetInfo($link->Uri), new Permalink()) ? ' selected' : '';
			$target = 	$link->Target == '_none' ? "" : ' target="_blank"';
			$string .= 	'<li class="link-entry link-'.$link->Link_ID.$selected.'"><a href="'.Blog::GetInfo($link->Uri).'"'.$target.' rel="'.$link->Relation.'" title="'.$link->Description.'"><span>'. $link->Title .'</span></a></li>';
			
		}
		
		$string .= $options->append . '<li class="clearfloat"></li></ul>';
		
		echo $string;
	}
}

class Links extends BlogPressLinks{}
?>